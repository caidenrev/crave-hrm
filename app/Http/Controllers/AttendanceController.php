<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Branch;
use App\Models\Company;
use App\Models\Employee;
use App\Models\Shift;
use App\Models\ShiftSwap;
use App\Services\AttendanceService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    protected AttendanceService $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    /**
     * Resolve active company and logged in employee helper.
     */
    protected function getActiveContext(Request $request): array
    {
        $companyId = session('active_company_id');
        $user = $request->user();

        if (!$companyId && $user) {
            $company = $user->currentCompany();
            $companyId = $company?->id;
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

        // Fallback for admin or testing without linked employee
        if (!$employee) {
            $employee = Employee::where('company_id', $companyId)->first();
        }

        // Auto-link or create employee profile for logged in user if none exists
        if (!$employee && $user) {
            $firstBranch = Branch::where('company_id', $companyId)->first();
            $employee = Employee::firstOrCreate(
                ['company_id' => $companyId, 'user_id' => $user->id],
                [
                    'branch_id' => $firstBranch?->id,
                    'email' => $user->email,
                    'nama_lengkap' => $user->name,
                    'nik' => 'EMP-' . str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
                    'tanggal_masuk' => Carbon::now()->format('Y-m-d'),
                    'is_active' => true,
                ]
            );
        }

        return [$companyId, $employee];
    }

    /**
     * Submenu: Presensi Harian (/attendance)
     */
    public function checkInView(Request $request): Response
    {
        [$companyId, $employee] = $this->getActiveContext($request);
        $today = Carbon::today()->format('Y-m-d');

        $todayAttendance = null;
        $recentAttendances = [];

        if ($employee) {
            $todayAttendance = Attendance::with(['shift', 'branch'])
                ->where('company_id', $companyId)
                ->where('employee_id', $employee->id)
                ->whereDate('date', $today)
                ->first();

            $recentAttendances = Attendance::with(['shift', 'branch'])
                ->where('company_id', $companyId)
                ->where('employee_id', $employee->id)
                ->orderBy('date', 'desc')
                ->take(7)
                ->get();
        }

        $assignedShift = $employee?->defaultShift
            ?? Shift::where('company_id', $companyId)->where('is_active', true)->first();

        $assignedBranch = $employee?->branch
            ?? Branch::where('company_id', $companyId)->where('is_active', true)->first();

        // Calculate Monthly Summary Stats for Employee
        $startOfMonth = Carbon::today()->startOfMonth()->format('Y-m-d');
        $monthlyPresent = Attendance::where('company_id', $companyId)
            ->where('employee_id', $employee?->id)
            ->whereDate('date', '>=', $startOfMonth)
            ->whereDate('date', '<=', $today)
            ->whereIn('status', ['present', 'late', 'early_leave'])
            ->count();

        $monthlyLate = Attendance::where('company_id', $companyId)
            ->where('employee_id', $employee?->id)
            ->whereDate('date', '>=', $startOfMonth)
            ->whereDate('date', '<=', $today)
            ->where('status', 'late')
            ->count();

        $totalMinutesWorked = Attendance::where('company_id', $companyId)
            ->where('employee_id', $employee?->id)
            ->whereDate('date', '>=', $startOfMonth)
            ->whereDate('date', '<=', $today)
            ->sum('work_duration_minutes');

        $avgHoursWorked = $monthlyPresent > 0
            ? round(($totalMinutesWorked / $monthlyPresent) / 60, 1)
            : 0;

        return Inertia::render('Attendance/CheckIn', [
            'employee' => $employee ? $employee->load(['branch', 'department', 'designation']) : null,
            'todayAttendance' => $todayAttendance,
            'assignedShift' => $assignedShift,
            'assignedBranch' => $assignedBranch,
            'recentAttendances' => $recentAttendances,
            'stats' => [
                'monthly_present' => $monthlyPresent,
                'monthly_late' => $monthlyLate,
                'avg_hours_worked' => $avgHoursWorked,
                'today_date' => Carbon::today()->translatedFormat('l, d F Y'),
            ],
        ]);
    }

    /**
     * Action: Clock In
     */
    public function clockIn(Request $request): RedirectResponse
    {
        [$companyId, $employee] = $this->getActiveContext($request);

        if (!$employee) {
            return back()->with('error', 'Profil karyawan tidak ditemukan untuk perusahaan ini.');
        }

        $validated = $request->validate([
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'selfie_image' => ['nullable', 'string'],
            'notes' => ['nullable', 'string', 'max:500'],
            'force_outside' => ['nullable', 'boolean'],
        ]);

        try {
            $this->attendanceService->recordClockIn($employee, $validated, $request->ip());
            return back()->with('success', 'Presensi masuk berhasil dicatat. Selamat bekerja!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Action: Clock Out
     */
    public function clockOut(Request $request): RedirectResponse
    {
        [$companyId, $employee] = $this->getActiveContext($request);

        if (!$employee) {
            return back()->with('error', 'Profil karyawan tidak ditemukan.');
        }

        $validated = $request->validate([
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'selfie_image' => ['nullable', 'string'],
        ]);

        try {
            $this->attendanceService->recordClockOut($employee, $validated, $request->ip());
            return back()->with('success', 'Presensi pulang berhasil dicatat. Terima kasih atas dedikasi Anda!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Submenu: Jadwal & Shift (/attendance/shifts)
     */
    public function shifts(Request $request): Response
    {
        [$companyId] = $this->getActiveContext($request);

        $shifts = Shift::where('company_id', $companyId)
            ->withCount(['employees', 'attendances'])
            ->orderBy('start_time')
            ->get();

        $shiftSwaps = ShiftSwap::where('company_id', $companyId)
            ->with(['requester.department', 'targetEmployee.department', 'requestedShift', 'targetShift', 'approver'])
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();

        $employees = Employee::where('company_id', $companyId)
            ->where('is_active', true)
            ->with('defaultShift')
            ->get(['id', 'nama_lengkap', 'nik', 'default_shift_id', 'department_id']);

        // KPI Summary
        $totalShifts = $shifts->count();
        $regularShifts = $shifts->where('is_flexible', false)->count();
        $flexibleShifts = $shifts->where('is_flexible', true)->count();
        $pendingSwaps = $shiftSwaps->where('status', 'pending')->count();

        return Inertia::render('Attendance/Shifts', [
            'shifts' => $shifts,
            'shiftSwaps' => $shiftSwaps,
            'employees' => $employees,
            'stats' => [
                'total_shifts' => $totalShifts,
                'regular_shifts' => $regularShifts,
                'flexible_shifts' => $flexibleShifts,
                'pending_swaps' => $pendingSwaps,
            ],
        ]);
    }

    /**
     * Store a new Shift
     */
    public function storeShift(Request $request): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'code' => ['nullable', 'string', 'max:20'],
            'start_time' => ['required', 'string'],
            'end_time' => ['required', 'string'],
            'late_tolerance_minutes' => ['required', 'integer', 'min:0', 'max:120'],
            'is_flexible' => ['boolean'],
            'is_active' => ['boolean'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['company_id'] = $companyId;
        $validated['is_flexible'] = $request->boolean('is_flexible');
        $validated['is_active'] = $request->boolean('is_active', true);

        Shift::create($validated);

        return back()->with('success', 'Master jadwal shift berhasil ditambahkan.');
    }

    /**
     * Update Shift
     */
    public function updateShift(Request $request, Shift $shift): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        if ($shift->company_id !== $companyId) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'code' => ['nullable', 'string', 'max:20'],
            'start_time' => ['required', 'string'],
            'end_time' => ['required', 'string'],
            'late_tolerance_minutes' => ['required', 'integer', 'min:0', 'max:120'],
            'is_flexible' => ['boolean'],
            'is_active' => ['boolean'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['is_flexible'] = $request->boolean('is_flexible');
        $validated['is_active'] = $request->boolean('is_active');

        $shift->update($validated);

        return back()->with('success', 'Jadwal shift berhasil diperbarui.');
    }

    /**
     * Toggle Shift Active Status
     */
    public function toggleShiftActive(Request $request, Shift $shift): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        if ($shift->company_id !== $companyId) {
            abort(403);
        }

        $shift->update(['is_active' => !$shift->is_active]);

        return back()->with('success', 'Status operasional shift berhasil diubah.');
    }

    /**
     * Delete Shift
     */
    public function destroyShift(Request $request, Shift $shift): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        if ($shift->company_id !== $companyId) {
            abort(403);
        }

        $shift->delete();

        return back()->with('success', 'Jadwal shift berhasil dihapus.');
    }

    /**
     * Submit Shift Swap Request
     */
    public function storeShiftSwap(Request $request): RedirectResponse
    {
        [$companyId, $currentEmployee] = $this->getActiveContext($request);

        $validated = $request->validate([
            'target_employee_id' => ['required', 'exists:employees,id'],
            'requested_shift_id' => ['required', 'exists:shifts,id'],
            'target_shift_id' => ['required', 'exists:shifts,id'],
            'swap_date' => ['required', 'date', 'after_or_equal:today'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $requesterId = $request->input('requester_id') ?? $currentEmployee?->id;

        if (!$requesterId) {
            return back()->with('error', 'Karyawan pemohon tidak valid.');
        }

        ShiftSwap::create([
            'company_id' => $companyId,
            'requester_id' => $requesterId,
            'target_employee_id' => $validated['target_employee_id'],
            'requested_shift_id' => $validated['requested_shift_id'],
            'target_shift_id' => $validated['target_shift_id'],
            'swap_date' => $validated['swap_date'],
            'reason' => $validated['reason'] ?? null,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Pengajuan tukar shift berhasil dikirim untuk persetujuan.');
    }

    /**
     * Approve / Reject Shift Swap
     */
    public function actionShiftSwap(Request $request, ShiftSwap $shiftSwap): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        if ($shiftSwap->company_id !== $companyId) {
            abort(403);
        }

        $status = $request->input('status');
        if (!in_array($status, ['approved', 'rejected'])) {
            return back()->with('error', 'Status aksi tidak valid.');
        }

        $shiftSwap->update([
            'status' => $status,
            'approved_by' => $request->user()?->id,
            'approved_at' => Carbon::now(),
        ]);

        $msg = $status === 'approved' ? 'Pengajuan tukar shift telah disetujui.' : 'Pengajuan tukar shift ditolak.';
        return back()->with('success', $msg);
    }

    /**
     * Submenu: Rekap Kehadiran (/attendance/recap)
     */
    public function recap(Request $request): Response
    {
        [$companyId] = $this->getActiveContext($request);

        $query = Attendance::where('attendances.company_id', $companyId)
            ->with(['employee.department', 'employee.designation', 'shift', 'branch', 'correctedBy']);

        // Filters
        $dateFrom = $request->input('date_from', Carbon::today()->startOfMonth()->format('Y-m-d'));
        $dateTo = $request->input('date_to', Carbon::today()->format('Y-m-d'));
        $branchId = $request->input('branch_id');
        $shiftId = $request->input('shift_id');
        $status = $request->input('status');
        $search = $request->input('search');

        if ($dateFrom) {
            $query->whereDate('attendances.date', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('attendances.date', '<=', $dateTo);
        }

        if ($branchId && $branchId !== 'all') {
            $query->where('attendances.branch_id', $branchId);
        }

        if ($shiftId && $shiftId !== 'all') {
            $query->where('attendances.shift_id', $shiftId);
        }

        if ($status && $status !== 'all') {
            $query->where('attendances.status', $status);
        }

        if ($search) {
            $query->whereHas('employee', function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        $attendances = $query->orderBy('attendances.date', 'desc')
            ->orderBy('attendances.clock_in_time', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Branches and Shifts for filters
        $branches = Branch::where('company_id', $companyId)->where('is_active', true)->get(['id', 'name']);
        $shifts = Shift::where('company_id', $companyId)->where('is_active', true)->get(['id', 'name', 'code']);

        // Summary Statistics for current date range
        $statsBase = Attendance::where('attendances.company_id', $companyId);
        if ($dateFrom) {
            $statsBase->whereDate('attendances.date', '>=', $dateFrom);
        }
        if ($dateTo) {
            $statsBase->whereDate('attendances.date', '<=', $dateTo);
        }
        $totalRecords = (clone $statsBase)->count();
        $onTimeCount = (clone $statsBase)->where('attendances.status', 'present')->count();
        $lateCount = (clone $statsBase)->where('attendances.status', 'late')->count();
        $geofenceValidCount = (clone $statsBase)->whereIn('attendances.geofence_status', ['valid_geofence', 'valid_ip'])->count();

        // 2:1 Chart Data: Daily distribution for trend
        $dailyTrend = (clone $statsBase)
            ->selectRaw('date(attendances.date) as day_date, count(*) as total, sum(case when status = "present" then 1 else 0 end) as tepat_waktu, sum(case when status = "late" then 1 else 0 end) as terlambat')
            ->groupBy('day_date')
            ->orderBy('day_date')
            ->take(14)
            ->get()
            ->map(fn ($row) => [
                'date' => Carbon::parse($row->day_date)->format('d M'),
                'tepat_waktu' => (int) $row->tepat_waktu,
                'terlambat' => (int) $row->terlambat,
                'total' => (int) $row->total,
            ]);

        // Shift distribution donut
        $shiftCompositionQuery = Attendance::withoutGlobalScopes()
            ->where('attendances.company_id', $companyId);
        if ($dateFrom) {
            $shiftCompositionQuery->whereDate('attendances.date', '>=', $dateFrom);
        }
        if ($dateTo) {
            $shiftCompositionQuery->whereDate('attendances.date', '<=', $dateTo);
        }
        $shiftComposition = $shiftCompositionQuery
            ->join('shifts', 'attendances.shift_id', '=', 'shifts.id')
            ->selectRaw('shifts.name, count(*) as count')
            ->groupBy('shifts.name')
            ->get()
            ->map(fn ($row) => [
                'name' => $row->name,
                'value' => (int) $row->count,
            ]);

        return Inertia::render('Attendance/Report', [
            'attendances' => $attendances,
            'branches' => $branches,
            'shifts' => $shifts,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'branch_id' => $branchId ?: 'all',
                'shift_id' => $shiftId ?: 'all',
                'status' => $status ?: 'all',
                'search' => $search ?: '',
            ],
            'stats' => [
                'total_records' => $totalRecords,
                'on_time_count' => $onTimeCount,
                'late_count' => $lateCount,
                'geofence_valid_count' => $geofenceValidCount,
            ],
            'charts' => [
                'dailyTrend' => $dailyTrend,
                'shiftComposition' => $shiftComposition,
            ],
        ]);
    }

    /**
     * Action: HR Manual Correction
     */
    public function correctAttendance(Request $request, Attendance $attendance): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        if ($attendance->company_id !== $companyId) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => ['required', 'in:present,late,early_leave,absent'],
            'clock_in_time' => ['nullable', 'string'],
            'clock_out_time' => ['nullable', 'string'],
            'correction_reason' => ['required', 'string', 'max:500'],
        ]);

        $attendance->update([
            'status' => $validated['status'],
            'clock_in_time' => $validated['clock_in_time'] ?: $attendance->clock_in_time,
            'clock_out_time' => $validated['clock_out_time'] ?: $attendance->clock_out_time,
            'correction_reason' => $validated['correction_reason'],
            'is_corrected' => true,
            'corrected_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Koreksi log absensi berhasil disimpan.');
    }
}
