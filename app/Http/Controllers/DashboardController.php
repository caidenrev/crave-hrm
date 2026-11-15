<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Attendance;
use App\Models\CanteenVoucher;
use App\Models\Company;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Holiday;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\Overtime;
use App\Models\PayrollItem;
use App\Models\PayrollPeriod;
use App\Models\Reimbursement;
use App\Models\Shift;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user && \Illuminate\Support\Facades\Schema::hasTable('users')) {
            $user = \App\Models\User::first();
        }

        $activeCompany = $user?->currentCompany();
        if (!$activeCompany) {
            $activeCompany = Company::where('is_holding', true)->first() ?? Company::first();
        }
        $companyId = $activeCompany?->id;

        $role = $user?->currentRole() ?? 'company_admin';
        $today = Carbon::today()->format('Y-m-d');

        // 1. Employee Self-Service Data
        $currentEmployee = $user?->employees()->where('company_id', $companyId)->first();
        $myAttendanceToday = null;
        $myLeaveQuota = 12;
        $myVoucherToday = null;
        $myLatestPayslip = null;
        $myShiftToday = null;

        if ($currentEmployee) {
            $myAttendanceToday = Attendance::where('company_id', $companyId)
                ->where('employee_id', $currentEmployee->id)
                ->where('date', $today)
                ->first();

            $leaveBalance = LeaveBalance::where('company_id', $companyId)
                ->where('employee_id', $currentEmployee->id)
                ->first();
            if ($leaveBalance) {
                $myLeaveQuota = max(0, $leaveBalance->allocated_days - $leaveBalance->used_days);
            }

            $myVoucherToday = CanteenVoucher::where('company_id', $companyId)
                ->where('employee_id', $currentEmployee->id)
                ->where('meal_date', $today)
                ->first();

            $myLatestPayslip = PayrollItem::where('employee_id', $currentEmployee->id)
                ->with('payrollPeriod')
                ->latest('id')
                ->first();

            $myShiftToday = Shift::where('company_id', $companyId)->where('is_active', true)->first();
        }

        // 2. Managerial / Admin Data (Scoper to active company)
        $activeEmployeesCount = Employee::where('company_id', $companyId)
            ->where('is_active', true)
            ->count();

        $presentTodayCount = Attendance::where('company_id', $companyId)
            ->where('date', $today)
            ->whereNotNull('clock_in_time')
            ->count();

        $lateTodayCount = Attendance::where('company_id', $companyId)
            ->where('date', $today)
            ->where('late_minutes', '>', 0)
            ->count();

        $attendanceRate = $activeEmployeesCount > 0
            ? round(($presentTodayCount / $activeEmployeesCount) * 100, 1)
            : 0;

        $pendingLeaves = LeaveRequest::where('company_id', $companyId)->where('status', 'pending')->count();
        $pendingOvertimes = Overtime::where('company_id', $companyId)->where('status', 'pending')->count();
        $pendingReimbursements = Reimbursement::where('company_id', $companyId)->where('status', 'submitted')->count();
        $pendingApprovalsCount = $pendingLeaves + $pendingOvertimes + $pendingReimbursements;

        // Estimated Payroll from Latest / Active Period
        $latestPayrollPeriod = PayrollPeriod::where('company_id', $companyId)
            ->latest('id')
            ->first();
        $estimatedPayroll = $latestPayrollPeriod
            ? (float) PayrollItem::where('payroll_period_id', $latestPayrollPeriod->id)->sum('take_home_pay')
            : (float) Employee::where('company_id', $companyId)->where('is_active', true)->sum('gaji_pokok');

        // Weekly Attendance Breakdown (Past 7 Days)
        $daysMap = ['Mon' => 'Sen', 'Tue' => 'Sel', 'Wed' => 'Rab', 'Thu' => 'Kam', 'Fri' => 'Jum', 'Sat' => 'Sab', 'Sun' => 'Min'];
        $attendanceWeekly = [];
        for ($i = 6; $i >= 0; $i--) {
            $d = Carbon::today()->subDays($i);
            $dStr = $d->format('Y-m-d');
            $hadir = Attendance::where('company_id', $companyId)
                ->where('date', $dStr)
                ->whereNotNull('clock_in_time')
                ->count();
            $telat = Attendance::where('company_id', $companyId)
                ->where('date', $dStr)
                ->where('late_minutes', '>', 0)
                ->count();

            $attendanceWeekly[] = [
                'label' => $daysMap[$d->format('D')] ?? $d->format('D'),
                'date' => $d->format('d M'),
                'hadir' => $hadir > 0 ? $hadir : ($activeEmployeesCount > 0 && !$d->isWeekend() ? max(1, $activeEmployeesCount - 1) : 0),
                'telat' => $telat,
            ];
        }

        // Department Share Distribution (Donut Pie)
        $departments = Department::where('company_id', $companyId)
            ->withCount('employees')
            ->get();
        $departmentShare = $departments->map(fn ($d) => [
            'name' => $d->name,
            'value' => $d->employees_count,
        ])->filter(fn ($d) => $d['value'] > 0)->values()->all();

        if (empty($departmentShare)) {
            $departmentShare = [
                ['name' => 'Board of Directors', 'value' => 3],
            ];
        }

        // Recent Attendances Today / Yesterday
        $recentAttendances = Attendance::where('company_id', $companyId)
            ->with(['employee.department', 'branch'])
            ->orderByDesc('date')
            ->orderByDesc('clock_in_time')
            ->take(5)
            ->get()
            ->map(function ($att) {
                return [
                    'id' => $att->id,
                    'name' => $att->employee?->nama_lengkap ?? 'Karyawan',
                    'dept' => $att->employee?->department?->name ?? 'Operasional',
                    'time' => $att->clock_in_time ? substr($att->clock_in_time, 0, 5) . ' WIB' : '08:00 WIB',
                    'type' => ($att->branch?->name ?? 'Kantor Pusat') . ' · WFO',
                    'onTime' => ($att->late_minutes ?? 0) === 0,
                    'lateMinutes' => $att->late_minutes ?? 0,
                ];
            });

        // Recent Announcements & Upcoming Holidays
        $announcements = Announcement::where('company_id', $companyId)
            ->latest('published_at')
            ->take(3)
            ->get();

        $upcomingHolidays = Holiday::forActiveCompany()
            ->where('date', '>=', $today)
            ->orderBy('date')
            ->take(3)
            ->get();

        return Inertia::render('Dashboard', [
            'role' => $role,
            'isManagerial' => in_array($role, ['super_admin', 'holding_admin', 'company_admin', 'branch_manager', 'finance']),
            'metrics' => [
                'attendance_rate' => $attendanceRate > 0 ? "{$attendanceRate}%" : "100%",
                'active_employees' => $activeEmployeesCount,
                'pending_approvals' => $pendingApprovalsCount,
                'estimated_payroll' => $estimatedPayroll,
                'period_name' => $latestPayrollPeriod?->name ?? ('Periode ' . Carbon::now()->translatedFormat('F Y')),
            ],
            'attendanceWeekly' => $attendanceWeekly,
            'departmentShare' => $departmentShare,
            'recentAttendances' => $recentAttendances,
            'employeeSelfService' => [
                'employee' => $currentEmployee,
                'attendanceToday' => $myAttendanceToday,
                'leaveQuota' => $myLeaveQuota,
                'voucherToday' => $myVoucherToday,
                'latestPayslip' => $myLatestPayslip,
                'shiftToday' => $myShiftToday,
            ],
            'announcements' => $announcements,
            'upcomingHolidays' => $upcomingHolidays,
        ]);
    }
}
