<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Department;
use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Services\LeaveService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveController extends Controller
{
    public function __construct(
        protected LeaveService $leaveService
    ) {}

    /**
     * Resolve active company and current employee from session/auth.
     */
    protected function getActiveContext(Request $request): array
    {
        $companyId = session('active_company_id');
        $user = $request->user();

        if (!$companyId && $user) {
            $companyId = $user->active_company_id ?? $user->companies()->first()?->id;
        }

        if (!$companyId) {
            $firstCompany = Company::where('is_active', true)->first();
            $companyId = $firstCompany?->id;
            session(['active_company_id' => $companyId]);
        }

        $employee = null;
        if ($user) {
            $employee = Employee::where('company_id', $companyId)
                ->where('user_id', $user->id)
                ->first();
        }

        if (!$employee) {
            $employee = Employee::where('company_id', $companyId)->first();
        }

        return [$companyId, $employee];
    }

    /**
     * Submenu: Cuti & Izin Saya (/leave)
     */
    public function index(Request $request): Response
    {
        [$companyId, $employee] = $this->getActiveContext($request);
        $currentYear = Carbon::now()->year;

        // Leave Types for company
        $leaveTypes = LeaveType::where('company_id', $companyId)
            ->where('is_active', true)
            ->get();

        // Balances for employee
        $balances = [];
        if ($employee) {
            // Ensure standard balances exist
            foreach ($leaveTypes as $type) {
                $this->leaveService->getOrCreateBalance($employee, $type, $currentYear);
            }

            $balances = LeaveBalance::where('company_id', $companyId)
                ->where('employee_id', $employee->id)
                ->where('year', $currentYear)
                ->with('leaveType')
                ->get();
        }

        // Employee's Leave Requests
        $requests = [];
        if ($employee) {
            $requests = LeaveRequest::where('company_id', $companyId)
                ->where('employee_id', $employee->id)
                ->with(['leaveType', 'supervisor', 'hr'])
                ->orderBy('created_at', 'desc')
                ->paginate(10)
                ->withQueryString();
        }

        // Summary Stats
        $annualBalance = collect($balances)->firstWhere('leaveType.code', 'ANNUAL');
        $sickBalance = collect($balances)->firstWhere('leaveType.code', 'SICK');

        $pendingRequestsCount = $employee
            ? LeaveRequest::where('company_id', $companyId)
                ->where('employee_id', $employee->id)
                ->whereIn('status', ['pending_supervisor', 'pending_hr'])
                ->count()
            : 0;

        $approvedThisYearCount = $employee
            ? LeaveRequest::where('company_id', $companyId)
                ->where('employee_id', $employee->id)
                ->where('status', 'approved')
                ->whereYear('start_date', $currentYear)
                ->count()
            : 0;

        return Inertia::render('Leave/Index', [
            'employee' => $employee ? $employee->load(['department', 'designation', 'branch']) : null,
            'leaveTypes' => $leaveTypes,
            'balances' => $balances,
            'requests' => $requests,
            'stats' => [
                'annual_remaining' => $annualBalance ? max(0, $annualBalance->remaining_days - $annualBalance->pending_days) : 12,
                'annual_total' => $annualBalance?->total_allocated ?? 12,
                'annual_used' => $annualBalance?->used_days ?? 0,
                'sick_used' => $sickBalance?->used_days ?? 0,
                'pending_count' => $pendingRequestsCount,
                'approved_count' => $approvedThisYearCount,
            ],
        ]);
    }

    /**
     * Action: Submit Leave Request
     */
    public function store(Request $request): RedirectResponse
    {
        [$companyId, $employee] = $this->getActiveContext($request);

        if (!$employee) {
            return back()->with('error', 'Profil karyawan tidak ditemukan.');
        }

        $validated = $request->validate([
            'leave_type_id' => ['required', 'exists:leave_types,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['required', 'string', 'max:1000'],
            'attachment_url' => ['nullable', 'string'],
        ]);

        try {
            $this->leaveService->submitRequest($employee, $validated, $request->user());
            return back()->with('success', 'Permohonan cuti berhasil diajukan dan sedang menunggu persetujuan atasan langsung.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Action: Cancel Leave Request by Employee
     */
    public function cancel(Request $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        [$companyId, $employee] = $this->getActiveContext($request);

        if (!$employee) {
            return back()->with('error', 'Profil karyawan tidak valid.');
        }

        try {
            $this->leaveService->cancel($leaveRequest, $employee);
            return back()->with('success', 'Permohonan cuti berhasil dibatalkan.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Submenu: Persetujuan Cuti (/leave/approvals)
     */
    public function approvals(Request $request): Response
    {
        [$companyId] = $this->getActiveContext($request);

        $query = LeaveRequest::where('leave_requests.company_id', $companyId)
            ->with(['employee.department', 'employee.designation', 'leaveType', 'supervisor', 'hr']);

        $status = $request->input('status', 'all');
        $departmentId = $request->input('department_id', 'all');
        $search = $request->input('search');

        if ($status !== 'all') {
            if ($status === 'pending') {
                $query->whereIn('leave_requests.status', ['pending_supervisor', 'pending_hr']);
            } else {
                $query->where('leave_requests.status', $status);
            }
        }

        if ($departmentId !== 'all') {
            $query->whereHas('employee', function ($q) use ($departmentId) {
                $q->where('department_id', $departmentId);
            });
        }

        if ($search) {
            $query->whereHas('employee', function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        $requests = $query->orderBy('leave_requests.created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $departments = Department::where('company_id', $companyId)->get(['id', 'name']);

        // Summary Statistics for KPI Cards
        $totalPending = LeaveRequest::where('company_id', $companyId)
            ->whereIn('status', ['pending_supervisor', 'pending_hr'])
            ->count();

        $pendingSupervisor = LeaveRequest::where('company_id', $companyId)
            ->where('status', 'pending_supervisor')
            ->count();

        $pendingHr = LeaveRequest::where('company_id', $companyId)
            ->where('status', 'pending_hr')
            ->count();

        $approvedThisMonth = LeaveRequest::where('company_id', $companyId)
            ->where('status', 'approved')
            ->whereMonth('start_date', Carbon::now()->month)
            ->whereYear('start_date', Carbon::now()->year)
            ->count();

        return Inertia::render('Leave/Approvals', [
            'requests' => $requests,
            'departments' => $departments,
            'filters' => [
                'status' => $status,
                'department_id' => $departmentId,
                'search' => $search ?: '',
            ],
            'stats' => [
                'total_pending' => $totalPending,
                'pending_supervisor' => $pendingSupervisor,
                'pending_hr' => $pendingHr,
                'approved_this_month' => $approvedThisMonth,
            ],
        ]);
    }

    /**
     * Action: Approve by Supervisor (Level 1)
     */
    public function approveSupervisor(Request $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        if ($leaveRequest->company_id !== $companyId) {
            abort(403);
        }

        $notes = $request->input('notes');

        try {
            $this->leaveService->approveBySupervisor($leaveRequest, $request->user(), $notes);
            return back()->with('success', 'Permohonan cuti disetujui pada tingkat atasan langsung dan diteruskan ke HR.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Action: Approve by HR (Level 2 / Final)
     */
    public function approveHr(Request $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        if ($leaveRequest->company_id !== $companyId) {
            abort(403);
        }

        $notes = $request->input('notes');

        try {
            $this->leaveService->approveByHr($leaveRequest, $request->user(), $notes);
            return back()->with('success', 'Permohonan cuti telah disetujui final oleh HR dan kuota cuti karyawan berhasil dipotong.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Action: Reject Request
     */
    public function reject(Request $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        if ($leaveRequest->company_id !== $companyId) {
            abort(403);
        }

        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
            'level' => ['nullable', 'in:supervisor,hr'],
        ]);

        $level = $request->input('level', 'supervisor');
        $reason = $request->input('reason');

        try {
            $this->leaveService->reject($leaveRequest, $request->user(), $reason, $level);
            return back()->with('success', 'Permohonan cuti berhasil ditolak.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
