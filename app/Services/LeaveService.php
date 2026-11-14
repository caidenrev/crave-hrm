<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Holiday;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Exception;

class LeaveService
{
    /**
     * Calculate working days between two dates excluding weekends and national holidays.
     */
    public function calculateWorkingDays(Carbon $startDate, Carbon $endDate, int $companyId): int
    {
        if ($startDate->greaterThan($endDate)) {
            throw new Exception('Tanggal awal tidak boleh melebihi tanggal akhir.');
        }

        $period = CarbonPeriod::create($startDate, $endDate);
        
        // Fetch national holidays in this range
        $holidays = Holiday::where(function ($q) use ($companyId) {
                $q->where('company_id', $companyId)->orWhereNull('company_id');
            })
            ->whereDate('date', '>=', $startDate->format('Y-m-d'))
            ->whereDate('date', '<=', $endDate->format('Y-m-d'))
            ->pluck('date')
            ->map(fn ($d) => Carbon::parse($d)->format('Y-m-d'))
            ->toArray();

        $workingDays = 0;
        foreach ($period as $date) {
            // Skip Saturday (6) and Sunday (0)
            if ($date->isWeekend()) {
                continue;
            }

            // Skip SKB 3 Menteri national holidays
            if (in_array($date->format('Y-m-d'), $holidays)) {
                continue;
            }

            $workingDays++;
        }

        return max(1, $workingDays);
    }

    /**
     * Get or initialize leave balance for employee, leave type and year.
     */
    public function getOrCreateBalance(Employee $employee, LeaveType $leaveType, int $year): LeaveBalance
    {
        return LeaveBalance::firstOrCreate(
            [
                'company_id' => $employee->company_id,
                'employee_id' => $employee->id,
                'leave_type_id' => $leaveType->id,
                'year' => $year,
            ],
            [
                'total_allocated' => $leaveType->days_allocated,
                'used_days' => 0,
                'pending_days' => 0,
                'remaining_days' => $leaveType->days_allocated,
            ]
        );
    }

    /**
     * Submit a new leave request.
     */
    public function submitRequest(Employee $employee, array $data, ?User $user): LeaveRequest
    {
        $startDate = Carbon::parse($data['start_date']);
        $endDate = Carbon::parse($data['end_date']);

        $leaveType = LeaveType::where('company_id', $employee->company_id)
            ->where('id', $data['leave_type_id'])
            ->firstOrFail();

        // Calculate working days
        $totalDays = $this->calculateWorkingDays($startDate, $endDate, $employee->company_id);

        // Check quota if type has limited allocation and not sick leave
        $year = $startDate->year;
        $balance = $this->getOrCreateBalance($employee, $leaveType, $year);

        if ($leaveType->code === 'ANNUAL' && ($balance->remaining_days - $balance->pending_days) < $totalDays) {
            $available = max(0, $balance->remaining_days - $balance->pending_days);
            throw new Exception("Saldo cuti tahunan tidak mencukupi (sisa kuota: {$available} hari, pengajuan: {$totalDays} hari).");
        }

        // Require attachment for sick leave > 1 day
        if ($leaveType->requires_attachment && $totalDays > 1 && empty($data['attachment_url'])) {
            throw new Exception('Pengajuan cuti sakit lebih dari 1 hari wajib melampirkan foto surat keterangan dokter.');
        }

        // Check for overlapping active leave requests
        $overlap = LeaveRequest::where('company_id', $employee->company_id)
            ->where('employee_id', $employee->id)
            ->whereIn('status', ['pending_supervisor', 'pending_hr', 'approved'])
            ->where(function ($q) use ($startDate, $endDate) {
                $q->whereBetween('start_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
                  ->orWhereBetween('end_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
                  ->orWhere(function ($sub) use ($startDate, $endDate) {
                      $sub->where('start_date', '<=', $startDate->format('Y-m-d'))
                          ->where('end_date', '>=', $endDate->format('Y-m-d'));
                  });
            })
            ->exists();

        if ($overlap) {
            throw new Exception('Anda sudah memiliki pengajuan cuti yang aktif pada rentang tanggal tersebut.');
        }

        // Increment pending days
        $balance->increment('pending_days', $totalDays);

        return LeaveRequest::create([
            'company_id' => $employee->company_id,
            'employee_id' => $employee->id,
            'leave_type_id' => $leaveType->id,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'total_days' => $totalDays,
            'reason' => $data['reason'],
            'attachment_url' => $data['attachment_url'] ?? null,
            'status' => 'pending_supervisor',
            'supervisor_status' => 'pending',
            'hr_status' => 'pending',
        ]);
    }

    /**
     * Level 1 Approval: Direct Supervisor
     */
    public function approveBySupervisor(LeaveRequest $request, User $supervisor, ?string $notes = null): LeaveRequest
    {
        if ($request->status !== 'pending_supervisor') {
            throw new Exception('Status permohonan cuti tidak berada pada antrean persetujuan atasan langsung.');
        }

        $request->update([
            'status' => 'pending_hr',
            'supervisor_id' => $supervisor->id,
            'supervisor_status' => 'approved',
            'supervisor_notes' => $notes,
            'supervisor_action_at' => Carbon::now(),
        ]);

        return $request;
    }

    /**
     * Level 2 Approval: HR Admin (Final approval and balance deduction)
     */
    public function approveByHr(LeaveRequest $request, User $hr, ?string $notes = null): LeaveRequest
    {
        // Allow HR to approve if pending_hr or direct approval if bypass
        if (!in_array($request->status, ['pending_hr', 'pending_supervisor'])) {
            throw new Exception('Status permohonan cuti tidak valid untuk persetujuan HR.');
        }

        $year = Carbon::parse($request->start_date)->year;
        $balance = $this->getOrCreateBalance($request->employee, $request->leaveType, $year);

        // Deduct from balance
        $balance->pending_days = max(0, $balance->pending_days - $request->total_days);
        $balance->used_days += $request->total_days;
        $balance->remaining_days = max(0, $balance->total_allocated - $balance->used_days);
        $balance->save();

        $updateData = [
            'status' => 'approved',
            'hr_id' => $hr->id,
            'hr_status' => 'approved',
            'hr_notes' => $notes,
            'hr_action_at' => Carbon::now(),
        ];

        // If supervisor hasn't acted, auto-sign as HR direct
        if ($request->supervisor_status === 'pending') {
            $updateData['supervisor_status'] = 'approved';
            $updateData['supervisor_id'] = $hr->id;
            $updateData['supervisor_action_at'] = Carbon::now();
        }

        $request->update($updateData);

        return $request;
    }

    /**
     * Reject Leave Request (by supervisor or HR)
     */
    public function reject(LeaveRequest $request, User $user, string $reason, string $level = 'supervisor'): LeaveRequest
    {
        if (in_array($request->status, ['approved', 'rejected', 'cancelled'])) {
            throw new Exception('Permohonan cuti ini sudah tidak dapat ditolak.');
        }

        $year = Carbon::parse($request->start_date)->year;
        $balance = $this->getOrCreateBalance($request->employee, $request->leaveType, $year);

        // Restore pending days
        $balance->pending_days = max(0, $balance->pending_days - $request->total_days);
        $balance->save();

        if ($level === 'hr') {
            $request->update([
                'status' => 'rejected',
                'hr_id' => $user->id,
                'hr_status' => 'rejected',
                'hr_notes' => $reason,
                'hr_action_at' => Carbon::now(),
            ]);
        } else {
            $request->update([
                'status' => 'rejected',
                'supervisor_id' => $user->id,
                'supervisor_status' => 'rejected',
                'supervisor_notes' => $reason,
                'supervisor_action_at' => Carbon::now(),
            ]);
        }

        return $request;
    }

    /**
     * Cancel leave request by employee.
     */
    public function cancel(LeaveRequest $request, Employee $employee): void
    {
        if ($request->employee_id !== $employee->id) {
            throw new Exception('Anda tidak memiliki wewenang untuk membatalkan pengajuan ini.');
        }

        if (!in_array($request->status, ['pending_supervisor', 'pending_hr'])) {
            throw new Exception('Pengajuan cuti yang sudah disetujui atau ditolak tidak dapat dibatalkan.');
        }

        $year = Carbon::parse($request->start_date)->year;
        $balance = $this->getOrCreateBalance($employee, $request->leaveType, $year);

        $balance->pending_days = max(0, $balance->pending_days - $request->total_days);
        $balance->save();

        $request->update([
            'status' => 'cancelled',
        ]);
    }
}
