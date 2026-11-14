<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\Shift;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Storage;

class AttendanceService
{
    /**
     * Calculate Haversine distance in meters between two GPS coordinates.
     */
    public function calculateDistanceMeters(float $lat1, float $lon1, float $lat2, float $lon2): int
    {
        $earthRadius = 6371000; // in meters

        $latFrom = deg2rad($lat1);
        $lonFrom = deg2rad($lon1);
        $latTo = deg2rad($lat2);
        $lonTo = deg2rad($lon2);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));

        return (int) round($angle * $earthRadius);
    }

    /**
     * Validate employee location against branch geofence and/or IP whitelist.
     *
     * @return array{is_valid: bool, distance: int, status: string, message: string}
     */
    public function validateGeofenceAndIp(?Branch $branch, ?float $userLat, ?float $userLng, ?string $clientIp): array
    {
        if (!$branch) {
            return [
                'is_valid' => true,
                'distance' => 0,
                'status' => 'exempt',
                'message' => 'Cabang tidak ditentukan. Presensi diizinkan.',
            ];
        }

        $hasCoordinates = !is_null($branch->latitude) && !is_null($branch->longitude) && !is_null($userLat) && !is_null($userLng);
        $distance = 0;

        if ($hasCoordinates) {
            $distance = $this->calculateDistanceMeters(
                (float) $userLat,
                (float) $userLng,
                (float) $branch->latitude,
                (float) $branch->longitude
            );

            $radiusAllowed = $branch->radius_meters ?: 100;

            if ($distance <= $radiusAllowed) {
                return [
                    'is_valid' => true,
                    'distance' => $distance,
                    'status' => 'valid_geofence',
                    'message' => "Posisi GPS terverifikasi ({$distance}m dari pusat kantor, maks {$radiusAllowed}m).",
                ];
            }
        }

        // Geofence failed or coordinates missing — check office IP whitelist
        if ($this->isIpWhitelisted($branch, $clientIp)) {
            return [
                'is_valid' => true,
                'distance' => $distance,
                'status' => 'valid_ip',
                'message' => "Terhubung via jaringan IP resmi kantor ({$clientIp}).",
            ];
        }

        if (!$hasCoordinates) {
            return [
                'is_valid' => false,
                'distance' => 0,
                'status' => 'outside_geofence',
                'message' => 'Koordinat GPS perangkat tidak terdeteksi dan IP kantor tidak sesuai.',
            ];
        }

        return [
            'is_valid' => false,
            'distance' => $distance,
            'status' => 'outside_geofence',
            'message' => "Di luar radius aman kantor ({$distance}m dari pusat kantor, maks {$branch->radius_meters}m).",
        ];
    }

    /**
     * Check if given IP matches branch's office_ips array.
     */
    public function isIpWhitelisted(Branch $branch, ?string $clientIp): bool
    {
        if (!$clientIp) {
            return false;
        }

        // Allow localhost development / testing environment
        if (in_array($clientIp, ['127.0.0.1', '::1', 'localhost']) || app()->environment('local')) {
            return true;
        }

        if (empty($branch->office_ips)) {
            return false;
        }

        $ips = is_array($branch->office_ips)
            ? $branch->office_ips
            : json_decode($branch->office_ips, true) ?? [];

        foreach ($ips as $ip) {
            $trimmed = trim($ip);
            if ($trimmed === '*' || $trimmed === $clientIp) {
                return true;
            }
        }

        return false;
    }

    /**
     * Calculate late minutes based on shift schedule and tolerance.
     *
     * @return array{late_minutes: int, status: string}
     */
    public function calculateLateMinutes(?Shift $shift, Carbon $clockInTime): array
    {
        if (!$shift || $shift->is_flexible) {
            return ['late_minutes' => 0, 'status' => 'present'];
        }

        $dateString = $clockInTime->format('Y-m-d');
        $shiftStart = Carbon::parse("{$dateString} {$shift->start_time}");
        $toleranceLimit = $shiftStart->copy()->addMinutes($shift->late_tolerance_minutes);

        if ($clockInTime->greaterThan($toleranceLimit)) {
            $lateMinutes = (int) $shiftStart->diffInMinutes($clockInTime);
            return [
                'late_minutes' => $lateMinutes,
                'status' => 'late',
            ];
        }

        return [
            'late_minutes' => 0,
            'status' => 'present',
        ];
    }

    /**
     * Calculate early leave minutes if clocked out before shift end time.
     */
    public function calculateEarlyLeaveMinutes(?Shift $shift, Carbon $clockOutTime): int
    {
        if (!$shift || $shift->is_flexible) {
            return 0;
        }

        $dateString = $clockOutTime->format('Y-m-d');
        $shiftEnd = Carbon::parse("{$dateString} {$shift->end_time}");

        if ($clockOutTime->lessThan($shiftEnd)) {
            return (int) $clockOutTime->diffInMinutes($shiftEnd);
        }

        return 0;
    }

    /**
     * Record employee clock-in with GPS, IP, Selfie, and Shift evaluation.
     */
    public function recordClockIn(Employee $employee, array $data, ?string $clientIp): Attendance
    {
        $today = Carbon::today()->format('Y-m-d');
        $now = Carbon::now();

        // Check if attendance already exists today
        $existing = Attendance::where('company_id', $employee->company_id)
            ->where('employee_id', $employee->id)
            ->whereDate('date', $today)
            ->first();

        if ($existing && $existing->clock_in_time) {
            throw new Exception('Anda sudah melakukan presensi masuk untuk hari ini.');
        }

        $branch = $employee->branch;
        $userLat = isset($data['latitude']) ? (float) $data['latitude'] : null;
        $userLng = isset($data['longitude']) ? (float) $data['longitude'] : null;

        // Geofence & IP validation
        $validation = $this->validateGeofenceAndIp($branch, $userLat, $userLng, $clientIp);

        // Enforce geofence rule (strict: cannot clock-in if outside radius unless bypass requested or IP valid)
        if (!$validation['is_valid'] && empty($data['force_outside'])) {
            throw new Exception($validation['message']);
        }

        // Resolve Shift
        $shift = $employee->defaultShift ?? Shift::where('company_id', $employee->company_id)->where('is_active', true)->first();
        $lateCheck = $this->calculateLateMinutes($shift, $now);

        $attendance = $existing ?? new Attendance();
        $attendance->company_id = $employee->company_id;
        $attendance->employee_id = $employee->id;
        $attendance->branch_id = $branch?->id;
        $attendance->shift_id = $shift?->id;
        $attendance->date = $today;
        $attendance->clock_in_time = $now->format('H:i:s');
        $attendance->clock_in_lat = $userLat;
        $attendance->clock_in_lng = $userLng;
        $attendance->clock_in_ip = $clientIp;
        $attendance->clock_in_distance_meters = $validation['distance'];
        $attendance->clock_in_selfie_url = $data['selfie_image'] ?? null;
        $attendance->status = $lateCheck['status'];
        $attendance->geofence_status = $validation['status'];
        $attendance->late_minutes = $lateCheck['late_minutes'];
        $attendance->notes = $data['notes'] ?? null;
        $attendance->save();

        return $attendance;
    }

    /**
     * Record employee clock-out.
     */
    public function recordClockOut(Employee $employee, array $data, ?string $clientIp): Attendance
    {
        $today = Carbon::today()->format('Y-m-d');
        $now = Carbon::now();

        $attendance = Attendance::where('company_id', $employee->company_id)
            ->where('employee_id', $employee->id)
            ->whereDate('date', $today)
            ->first();

        if (!$attendance || !$attendance->clock_in_time) {
            throw new Exception('Anda belum melakukan presensi masuk hari ini.');
        }

        if ($attendance->clock_out_time) {
            throw new Exception('Anda sudah melakukan presensi pulang hari ini.');
        }

        $branch = $employee->branch;
        $userLat = isset($data['latitude']) ? (float) $data['latitude'] : null;
        $userLng = isset($data['longitude']) ? (float) $data['longitude'] : null;

        $validation = $this->validateGeofenceAndIp($branch, $userLat, $userLng, $clientIp);

        $shift = $attendance->shift ?? $employee->defaultShift;
        $earlyLeaveMinutes = $this->calculateEarlyLeaveMinutes($shift, $now);

        // Calculate work duration
        $clockInCarbon = Carbon::parse("{$today} {$attendance->clock_in_time}");
        $workDurationMinutes = (int) $clockInCarbon->diffInMinutes($now);

        $attendance->clock_out_time = $now->format('H:i:s');
        $attendance->clock_out_lat = $userLat;
        $attendance->clock_out_lng = $userLng;
        $attendance->clock_out_ip = $clientIp;
        $attendance->clock_out_distance_meters = $validation['distance'];
        $attendance->clock_out_selfie_url = $data['selfie_image'] ?? null;
        $attendance->early_leave_minutes = $earlyLeaveMinutes;
        $attendance->work_duration_minutes = $workDurationMinutes;

        if ($earlyLeaveMinutes > 0 && $attendance->status === 'present') {
            $attendance->status = 'early_leave';
        }

        $attendance->save();

        return $attendance;
    }
}
