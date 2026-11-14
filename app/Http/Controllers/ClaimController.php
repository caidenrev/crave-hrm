<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Employee;
use App\Models\Overtime;
use App\Models\Reimbursement;
use App\Models\Visit;
use App\Services\OvertimeCalculatorService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClaimController extends Controller
{
    public function __construct(
        protected OvertimeCalculatorService $overtimeService
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
     * Default redirect to Overtime
     */
    public function index(): RedirectResponse
    {
        return redirect()->route('claims.overtime.index');
    }

    // ==========================================
    // 1. OVERTIME (SPKL) PP 35/2021
    // ==========================================

    /**
     * Submenu: Lembur (SPKL)
     */
    public function overtimeIndex(Request $request): Response
    {
        [$companyId, $employee] = $this->getActiveContext($request);
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $query = Overtime::where('overtimes.company_id', $companyId)
            ->with(['employee.department', 'approver']);

        // Filter status or view
        $status = $request->input('status', 'all');
        if ($status !== 'all') {
            $query->where('overtimes.status', $status);
        }

        $overtimes = $query->orderBy('overtimes.date', 'desc')
            ->orderBy('overtimes.created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Statistics
        $approvedOvertimesMonth = Overtime::where('company_id', $companyId)
            ->where('status', 'approved')
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear);

        $totalHoursMonth = (clone $approvedOvertimesMonth)->sum('duration_hours');
        $totalAmountMonth = (clone $approvedOvertimesMonth)->sum('estimated_amount');

        $pendingCount = Overtime::where('company_id', $companyId)
            ->where('status', 'pending')
            ->count();

        $approvedCount = Overtime::where('company_id', $companyId)
            ->where('status', 'approved')
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->count();

        // Current employee rate info
        $hourlyRate = $employee
            ? $this->overtimeService->calculateHourlyRate((float) ($employee->gaji_pokok ?? 0))
            : 0;

        return Inertia::render('Claims/Overtime', [
            'employee' => $employee ? $employee->load(['department', 'designation']) : null,
            'overtimes' => $overtimes,
            'filters' => [
                'status' => $status,
            ],
            'stats' => [
                'total_hours_month' => (float) $totalHoursMonth,
                'total_amount_month' => (float) $totalAmountMonth,
                'pending_count' => $pendingCount,
                'approved_count' => $approvedCount,
                'hourly_rate' => $hourlyRate,
            ],
        ]);
    }

    /**
     * Submit SPKL Overtime
     */
    public function storeOvertime(Request $request): RedirectResponse
    {
        [$companyId, $employee] = $this->getActiveContext($request);

        if (!$employee) {
            return back()->with('error', 'Profil karyawan tidak ditemukan.');
        }

        $validated = $request->validate([
            'date' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['required'],
            'day_type' => ['required', 'in:workday,weekend,holiday'],
            'task_description' => ['required', 'string', 'max:1000'],
        ]);

        try {
            $calculation = $this->overtimeService->calculateOvertime(
                $employee,
                $validated['start_time'],
                $validated['end_time'],
                $validated['day_type']
            );

            Overtime::create([
                'company_id' => $companyId,
                'employee_id' => $employee->id,
                'date' => $validated['date'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'duration_hours' => $calculation['duration_hours'],
                'day_type' => $validated['day_type'],
                'hourly_rate' => $calculation['hourly_rate'],
                'multiplier_hours' => $calculation['multiplier_hours'],
                'estimated_amount' => $calculation['estimated_amount'],
                'task_description' => $validated['task_description'],
                'status' => 'pending',
            ]);

            return back()->with('success', 'Pengajuan lembur (SPKL) berhasil dibuat dan dihitung sesuai formula Depnaker PP 35/2021.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Approve Overtime
     */
    public function approveOvertime(Request $request, Overtime $overtime): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        if ($overtime->company_id !== $companyId) {
            abort(403);
        }

        $overtime->update([
            'status' => 'approved',
            'approved_by' => $request->user()?->id,
            'approved_at' => Carbon::now(),
        ]);

        return back()->with('success', 'Pengajuan lembur berhasil disetujui.');
    }

    /**
     * Reject Overtime
     */
    public function rejectOvertime(Request $request, Overtime $overtime): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        if ($overtime->company_id !== $companyId) {
            abort(403);
        }

        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $overtime->update([
            'status' => 'rejected',
            'rejection_reason' => $request->input('reason'),
            'approved_by' => $request->user()?->id,
            'approved_at' => Carbon::now(),
        ]);

        return back()->with('success', 'Pengajuan lembur telah ditolak.');
    }

    // ==========================================
    // 2. REIMBURSEMENT
    // ==========================================

    /**
     * Submenu: Reimbursement
     */
    public function reimbursementIndex(Request $request): Response
    {
        [$companyId, $employee] = $this->getActiveContext($request);
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $query = Reimbursement::where('reimbursements.company_id', $companyId)
            ->with(['employee.department', 'approver']);

        $category = $request->input('category', 'all');
        $status = $request->input('status', 'all');

        if ($category !== 'all') {
            $query->where('reimbursements.category', $category);
        }

        if ($status !== 'all') {
            $query->where('reimbursements.status', $status);
        }

        $reimbursements = $query->orderBy('reimbursements.date', 'desc')
            ->orderBy('reimbursements.created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Statistics
        $monthClaims = Reimbursement::where('company_id', $companyId)
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear);

        $totalClaimedMonth = (clone $monthClaims)->sum('amount');
        $paidAmountMonth = (clone $monthClaims)->where('status', 'paid')->sum('amount');
        $pendingAmount = Reimbursement::where('company_id', $companyId)
            ->where('status', 'pending')
            ->sum('amount');
        $pendingCount = Reimbursement::where('company_id', $companyId)
            ->where('status', 'pending')
            ->count();

        return Inertia::render('Claims/Reimbursement', [
            'employee' => $employee,
            'reimbursements' => $reimbursements,
            'filters' => [
                'category' => $category,
                'status' => $status,
            ],
            'stats' => [
                'total_claimed_month' => (float) $totalClaimedMonth,
                'paid_amount_month' => (float) $paidAmountMonth,
                'pending_amount' => (float) $pendingAmount,
                'pending_count' => $pendingCount,
            ],
        ]);
    }

    /**
     * Submit Reimbursement
     */
    public function storeReimbursement(Request $request): RedirectResponse
    {
        [$companyId, $employee] = $this->getActiveContext($request);

        if (!$employee) {
            return back()->with('error', 'Profil karyawan tidak ditemukan.');
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:medical,transport,parking_toll,meal,office_supplies,other'],
            'date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:1000'],
            'description' => ['nullable', 'string', 'max:1000'],
            'receipt_url' => ['nullable', 'string'],
            'bank_name' => ['nullable', 'string', 'max:50'],
            'bank_account_number' => ['nullable', 'string', 'max:50'],
        ]);

        Reimbursement::create([
            'company_id' => $companyId,
            'employee_id' => $employee->id,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'date' => $validated['date'],
            'amount' => $validated['amount'],
            'description' => $validated['description'] ?? null,
            'receipt_url' => $validated['receipt_url'] ?? null,
            'bank_name' => $validated['bank_name'] ?? $employee->bank_name,
            'bank_account_number' => $validated['bank_account_number'] ?? $employee->bank_account_number,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Klaim reimbursement berhasil diajukan dan menunggu verifikasi Finance/HR.');
    }

    /**
     * Approve Reimbursement
     */
    public function approveReimbursement(Request $request, Reimbursement $reimbursement): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        if ($reimbursement->company_id !== $companyId) {
            abort(403);
        }

        $reimbursement->update([
            'status' => 'approved',
            'approved_by' => $request->user()?->id,
            'approved_at' => Carbon::now(),
        ]);

        return back()->with('success', 'Klaim reimbursement telah disetujui.');
    }

    /**
     * Mark Reimbursement as Paid
     */
    public function payReimbursement(Request $request, Reimbursement $reimbursement): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        if ($reimbursement->company_id !== $companyId) {
            abort(403);
        }

        $reimbursement->update([
            'status' => 'paid',
            'paid_at' => Carbon::now(),
        ]);

        return back()->with('success', 'Klaim reimbursement telah berhasil dicairkan (Paid).');
    }

    /**
     * Reject Reimbursement
     */
    public function rejectReimbursement(Request $request, Reimbursement $reimbursement): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        if ($reimbursement->company_id !== $companyId) {
            abort(403);
        }

        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $reimbursement->update([
            'status' => 'rejected',
            'rejection_reason' => $request->input('reason'),
            'approved_by' => $request->user()?->id,
            'approved_at' => Carbon::now(),
        ]);

        return back()->with('success', 'Klaim reimbursement telah ditolak.');
    }

    // ==========================================
    // 3. TUGAS LAPANGAN / VISIT KLIEN
    // ==========================================

    /**
     * Submenu: Tugas Lapangan / Visit
     */
    public function visitIndex(Request $request): Response
    {
        [$companyId, $employee] = $this->getActiveContext($request);
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $query = Visit::where('visits.company_id', $companyId)
            ->with(['employee.department', 'verifier']);

        $visits = $query->orderBy('visits.visit_date', 'desc')
            ->orderBy('visits.check_in_time', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Statistics
        $totalVisitsMonth = Visit::where('company_id', $companyId)
            ->whereMonth('visit_date', $currentMonth)
            ->whereYear('visit_date', $currentYear)
            ->count();

        $verifiedCount = Visit::where('company_id', $companyId)
            ->where('status', 'verified')
            ->whereMonth('visit_date', $currentMonth)
            ->whereYear('visit_date', $currentYear)
            ->count();

        $completedCount = Visit::where('company_id', $companyId)
            ->where('status', 'completed')
            ->count();

        return Inertia::render('Claims/Visit', [
            'employee' => $employee,
            'visits' => $visits,
            'stats' => [
                'total_visits_month' => $totalVisitsMonth,
                'verified_count' => $verifiedCount,
                'completed_count' => $completedCount,
            ],
        ]);
    }

    /**
     * Submit Client Visit Check-In
     */
    public function storeVisit(Request $request): RedirectResponse
    {
        [$companyId, $employee] = $this->getActiveContext($request);

        if (!$employee) {
            return back()->with('error', 'Profil karyawan tidak ditemukan.');
        }

        $validated = $request->validate([
            'client_name' => ['required', 'string', 'max:255'],
            'visit_date' => ['required', 'date'],
            'check_in_time' => ['required'],
            'check_out_time' => ['nullable'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'location_name' => ['nullable', 'string', 'max:500'],
            'purpose' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'selfie_url' => ['nullable', 'string'],
        ]);

        Visit::create([
            'company_id' => $companyId,
            'employee_id' => $employee->id,
            'client_name' => $validated['client_name'],
            'visit_date' => $validated['visit_date'],
            'check_in_time' => $validated['check_in_time'],
            'check_out_time' => $validated['check_out_time'] ?? null,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'location_name' => $validated['location_name'] ?? null,
            'purpose' => $validated['purpose'],
            'notes' => $validated['notes'] ?? null,
            'selfie_url' => $validated['selfie_url'] ?? null,
            'status' => 'completed',
        ]);

        return back()->with('success', 'Laporan check-in visit klien berhasil dicatat dengan geotagging GPS & foto selfie.');
    }

    /**
     * Verify Client Visit
     */
    public function verifyVisit(Request $request, Visit $visit): RedirectResponse
    {
        [$companyId] = $this->getActiveContext($request);

        if ($visit->company_id !== $companyId) {
            abort(403);
        }

        $visit->update([
            'status' => 'verified',
            'verified_by' => $request->user()?->id,
            'verified_at' => Carbon::now(),
        ]);

        return back()->with('success', 'Laporan visit klien telah diverifikasi oleh atasan/manajemen.');
    }
}
