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
     * Get branch timezone, fallback to system timezone or Asia/Jakarta.
     */
    public function getBranchTimezone(?Branch $branch): string
    {
        return $branch?->timezone ?: config('app.timezone', 'Asia/Jakarta');
    }

    /**
     * Store base64 selfie image to public storage disk and return public URL.
     * Prevents storing megabytes of raw base64 data in database tables.
     */
    public function storeSelfieImage(?string $imageData, int $employeeId, string $type = 'in'): ?string
    {
        if (empty($imageData)) {
            return null;
        }

        // If it's already a saved storage path or external URL, return as is
        if (str_starts_with($imageData, '/storage/') || str_starts_with($imageData, 'http://') || str_starts_with($imageData, 'https://')) {
            return $imageData;
        }

        // Match base64 data URI
        if (preg_match('/^data:image\/(\w+);base64,(.+)$/', $imageData, $matches)) {
            $extension = strtolower($matches[1]) === 'png' ? 'png' : 'jpg';
            $base64 = $matches[2];
            $binary = base64_decode($base64, true);

            if ($binary === false) {
                return null;
            }

            $datePath = date('Y/m');
            $randomSuffix = bin2hex(random_bytes(4));
            $filename = "selfie_{$employeeId}_{$type}_" . time() . "_{$randomSuffix}.{$extension}";
            $relativePath = "attendances/selfies/{$datePath}/{$filename}";

            Storage::disk('public')->put($relativePath, $binary);

            return "/storage/{$relativePath}";
        }

        return $imageData;
    }

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
     * Supports multi-branch detection across active company branches.
     *
     * @return array{is_valid: bool, distance: int, status: string, message: string, branch?: Branch}
     */
    public function validateGeofenceAndIp(?Branch $branch, ?float $userLat, ?float $userLng, ?string $clientIp, ?Employee $employee = null): array
    {
        if (!$branch && !$employee) {
            return [
                'is_valid' => true,
                'distance' => 0,
                'status' => 'exempt',
                'message' => 'Cabang tidak ditentukan. Presensi diizinkan.',
            ];
        }

        $effectiveBranch = $branch;
        $hasCoordinates = !is_null($userLat) && !is_null($userLng);
        $distance = 0;

        // 1. Check primary assigned branch geofence
        if ($effectiveBranch && !is_null($effectiveBranch->latitude) && !is_null($effectiveBranch->longitude) && $hasCoordinates) {
            $distance = $this->calculateDistanceMeters(
                (float) $userLat,
                (float) $userLng,
                (float) $effectiveBranch->latitude,
                (float) $effectiveBranch->longitude
            );

            $radiusAllowed = $effectiveBranch->radius_meters ?: 100;

            if ($distance <= $radiusAllowed) {
                return [
                    'is_valid' => true,
                    'distance' => $distance,
                    'status' => 'valid_geofence',
                    'message' => "Posisi GPS terverifikasi ({$distance}m dari pusat {$effectiveBranch->name}, maks {$radiusAllowed}m).",
                    'branch' => $effectiveBranch,
                ];
            }
        }

        // 2. Multi-Branch Visiting: Check other active branches of the same company
        if ($employee && $employee->company_id && $hasCoordinates) {
            $otherBranches = Branch::where('company_id', $employee->company_id)
                ->where('is_active', true)
                ->where('id', '!=', $effectiveBranch?->id)
                ->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->get();

            foreach ($otherBranches as $otherBranch) {
                $otherDist = $this->calculateDistanceMeters(
                    (float) $userLat,
                    (float) $userLng,
                    (float) $otherBranch->latitude,
                    (float) $otherBranch->longitude
                );
                $otherRadius = $otherBranch->radius_meters ?: 100;

                if ($otherDist <= $otherRadius) {
                    return [
                        'is_valid' => true,
                        'distance' => $otherDist,
                        'status' => 'valid_geofence',
                        'message' => "Posisi GPS terverifikasi di kantor cabang {$otherBranch->name} ({$otherDist}m, maks {$otherRadius}m).",
                        'branch' => $otherBranch,
                    ];
                }
            }
        }

        // 3. Geofence failed or coordinates missing — check office IP whitelist
        if ($effectiveBranch && $this->isIpWhitelisted($effectiveBranch, $clientIp)) {
            return [
                'is_valid' => true,
                'distance' => $distance,
                'status' => 'valid_ip',
                'message' => "Terhubung via jaringan IP resmi kantor ({$clientIp}).",
                'branch' => $effectiveBranch,
            ];
        }

        // Also check IP whitelist for other active branches
        if ($employee && $employee->company_id && $clientIp) {
            $allBranches = Branch::where('company_id', $employee->company_id)->where('is_active', true)->get();
            foreach ($allBranches as $b) {
                if ($this->isIpWhitelisted($b, $clientIp)) {
                    return [
                        'is_valid' => true,
                        'distance' => $distance,
                        'status' => 'valid_ip',
                        'message' => "Terhubung via jaringan IP resmi kantor {$b->name} ({$clientIp}).",
                        'branch' => $b,
                    ];
                }
            }
        }

        if (!$hasCoordinates) {
            return [
                'is_valid' => false,
                'distance' => 0,
                'status' => 'outside_geofence',
                'message' => 'Koordinat GPS perangkat tidak terdeteksi dan IP kantor tidak sesuai.',
            ];
        }

        $branchName = $effectiveBranch?->name ?: 'kantor';
        $maxRadius = $effectiveBranch?->radius_meters ?: 100;
        return [
            'is_valid' => false,
            'distance' => $distance,
            'status' => 'outside_geofence',
            'message' => "Di luar radius aman {$branchName} ({$distance}m dari pusat kantor, maks {$maxRadius}m).",
        ];
    }

    /**
     * Check if given IP matches branch's office_ips array. Supports CIDR notation.
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

            // Check CIDR subnet matching (e.g. 192.168.1.0/24 or 10.0.0.0/8)
            if (str_contains($trimmed, '/')) {
                [$subnet, $bits] = explode('/', $trimmed, 2);
                $ipLong = ip2long($clientIp);
                $subnetLong = ip2long($subnet);
                if ($ipLong !== false && $subnetLong !== false) {
                    $mask = -1 << (32 - (int) $bits);
                    $subnetMasked = $subnetLong & $mask;
                    if (($ipLong & $mask) === $subnetMasked) {
                        return true;
                    }
                }
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
        $shiftStart = Carbon::parse("{$dateString} {$shift->start_time}", $clockInTime->timezone);
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
     * Supports cross-midnight shifts (e.g. 22:00 to 06:00).
     */
    public function calculateEarlyLeaveMinutes(?Shift $shift, Carbon $clockOutTime): int
    {
        if (!$shift || $shift->is_flexible) {
            return 0;
        }

        $dateString = $clockOutTime->format('Y-m-d');
        $shiftEnd = Carbon::parse("{$dateString} {$shift->end_time}", $clockOutTime->timezone);

        // If shift crosses midnight (e.g. 22:00 to 06:00):
        // If employee is clocking out in the evening of start day (>= 12:00), shiftEnd is next day
        if ($shift->end_time < $shift->start_time) {
            if ($clockOutTime->hour >= 12) {
                $shiftEnd = $shiftEnd->addDay();
            }
        }

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
        $branch = $employee->branch;
        $tz = $this->getBranchTimezone($branch);
        $now = Carbon::now($tz);
        $today = $now->format('Y-m-d');

        // Check if attendance already exists today
        $existing = Attendance::where('company_id', $employee->company_id)
            ->where('employee_id', $employee->id)
            ->whereDate('date', $today)
            ->first();

        if ($existing && $existing->clock_in_time) {
            throw new Exception('Anda sudah melakukan presensi masuk untuk hari ini.');
        }

        $userLat = isset($data['latitude']) ? (float) $data['latitude'] : null;
        $userLng = isset($data['longitude']) ? (float) $data['longitude'] : null;

        // Geofence & IP validation with multi-branch check
        $validation = $this->validateGeofenceAndIp($branch, $userLat, $userLng, $clientIp, $employee);
        $detectedBranch = $validation['branch'] ?? $branch;

        // Enforce geofence rule (strict: cannot clock-in if outside radius unless bypass requested or IP valid)
        if (!$validation['is_valid'] && empty($data['force_outside'])) {
            throw new Exception($validation['message']);
        }

        // Resolve Shift
        $shift = $employee->defaultShift ?? Shift::where('company_id', $employee->company_id)->where('is_active', true)->first();
        $lateCheck = $this->calculateLateMinutes($shift, $now);

        // Store selfie to public disk storage (optimized decoupled storage)
        $selfieUrl = $this->storeSelfieImage($data['selfie_image'] ?? null, $employee->id, 'in');

        $attendance = $existing ?? new Attendance();
        $attendance->company_id = $employee->company_id;
        $attendance->employee_id = $employee->id;
        $attendance->branch_id = $detectedBranch?->id;
        $attendance->shift_id = $shift?->id;
        $attendance->date = $today;
        $attendance->clock_in_time = $now->format('H:i:s');
        $attendance->clock_in_lat = $userLat;
        $attendance->clock_in_lng = $userLng;
        $attendance->clock_in_ip = $clientIp;
        $attendance->clock_in_distance_meters = $validation['distance'];
        $attendance->clock_in_selfie_url = $selfieUrl;
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
        $branch = $employee->branch;
        $tz = $this->getBranchTimezone($branch);
        $now = Carbon::now($tz);
        $today = $now->format('Y-m-d');

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

        $userLat = isset($data['latitude']) ? (float) $data['latitude'] : null;
        $userLng = isset($data['longitude']) ? (float) $data['longitude'] : null;

        $validation = $this->validateGeofenceAndIp($branch, $userLat, $userLng, $clientIp, $employee);

        $shift = $attendance->shift ?? $employee->defaultShift;
        $earlyLeaveMinutes = $this->calculateEarlyLeaveMinutes($shift, $now);

        // Calculate work duration with timezone awareness
        $dateStr = Carbon::parse($attendance->date)->format('Y-m-d');
        $clockInCarbon = Carbon::parse("{$dateStr} {$attendance->clock_in_time}", $tz);
        $clockOutCarbon = $now->copy();
        if ($shift && $shift->end_time < $shift->start_time && $clockOutCarbon->lessThan($clockInCarbon)) {
            $clockOutCarbon = $clockOutCarbon->addDay();
        }
        $workDurationMinutes = max(0, (int) $clockInCarbon->diffInMinutes($clockOutCarbon));

        // Store selfie to public disk storage
        $selfieUrl = $this->storeSelfieImage($data['selfie_image'] ?? null, $employee->id, 'out');

        $attendance->clock_out_time = $now->format('H:i:s');
        $attendance->clock_out_lat = $userLat;
        $attendance->clock_out_lng = $userLng;
        $attendance->clock_out_ip = $clientIp;
        $attendance->clock_out_distance_meters = $validation['distance'];
        $attendance->clock_out_selfie_url = $selfieUrl;
        $attendance->early_leave_minutes = $earlyLeaveMinutes;
        $attendance->work_duration_minutes = $workDurationMinutes;

        if ($earlyLeaveMinutes > 0 && $attendance->status === 'present') {
            $attendance->status = 'early_leave';
        }

        $attendance->save();

        return $attendance;
    }
}
