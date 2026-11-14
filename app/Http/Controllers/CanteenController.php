<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\CanteenVendor;
use App\Models\CanteenVoucher;
use App\Models\Company;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CanteenController extends Controller
{
    /**
     * Get active company id from session or fallback.
     */
    protected function getActiveCompanyId(): ?int
    {
        $user = Auth::user();
        return session('active_company_id') ?? $user?->currentCompany()?->id ?? Company::first()?->id;
    }

    /**
     * Get employee linked to user or first employee in company.
     */
    protected function resolveEmployee(): ?Employee
    {
        $user = Auth::user();
        $companyId = $this->getActiveCompanyId();

        $employee = null;
        if ($user && $user->email) {
            $employee = Employee::where('company_id', $companyId)
                ->where('email', $user->email)
                ->first();
        }

        if (!$employee) {
            $employee = Employee::where('company_id', $companyId)->first();
        }

        return $employee;
    }

    /**
     * Display Employee Voucher Card (Submenu: Voucher QR Saya).
     */
    public function index(Request $request): Response
    {
        $companyId = $this->getActiveCompanyId();
        $employee = $this->resolveEmployee();
        $today = Carbon::today()->format('Y-m-d');

        $todayVoucher = null;
        $todayAttendance = null;

        if ($employee) {
            // Check today's attendance
            $todayAttendance = Attendance::where('company_id', $companyId)
                ->where('employee_id', $employee->id)
                ->whereDate('date', $today)
                ->first();

            // Find or create today's voucher
            $todayVoucher = CanteenVoucher::where('company_id', $companyId)
                ->where('employee_id', $employee->id)
                ->whereDate('meal_date', $today)
                ->first();

            if (!$todayVoucher) {
                // Auto create active voucher for today
                $voucherCode = 'CRV-CRN-' . Carbon::today()->format('Ymd') . '-' . strtoupper(Str::random(5));
                $token = 'CRV-QR-' . now()->timestamp . '-' . Str::random(24);

                $todayVoucher = CanteenVoucher::create([
                    'company_id' => $companyId,
                    'employee_id' => $employee->id,
                    'vendor_id' => null,
                    'voucher_code' => $voucherCode,
                    'encrypted_token' => $token,
                    'meal_date' => $today,
                    'meal_type' => 'lunch',
                    'nominal_value' => 25000.00,
                    'status' => 'active',
                    'expires_at' => now()->addSeconds(60),
                ]);
            } elseif ($todayVoucher->status === 'active' && $todayVoucher->isTokenExpired()) {
                // Refresh token if active but expired
                $todayVoucher->refreshDynamicToken(60);
            }
        }

        // Voucher history for this employee
        $history = [];
        $stats = [
            'total_redeemed_month' => 0,
            'total_saved_month' => 0,
            'attendance_wfo_count' => 0,
        ];

        if ($employee) {
            $monthStart = Carbon::today()->startOfMonth()->format('Y-m-d');
            $monthEnd = Carbon::today()->endOfMonth()->format('Y-m-d');

            $history = CanteenVoucher::where('company_id', $companyId)
                ->where('employee_id', $employee->id)
                ->with(['vendor'])
                ->orderBy('meal_date', 'desc')
                ->take(15)
                ->get()
                ->map(fn ($v) => [
                    'id' => $v->id,
                    'voucher_code' => $v->voucher_code,
                    'meal_date' => $v->meal_date->format('Y-m-d'),
                    'meal_type' => $v->meal_type,
                    'nominal_value' => (float) $v->nominal_value,
                    'status' => $v->status,
                    'redeemed_at' => $v->redeemed_at ? $v->redeemed_at->format('H:i') : null,
                    'vendor_name' => $v->vendor ? $v->vendor->name : null,
                ]);

            $monthRedeemed = CanteenVoucher::where('company_id', $companyId)
                ->where('employee_id', $employee->id)
                ->where('status', 'redeemed')
                ->whereBetween('meal_date', [$monthStart, $monthEnd])
                ->get();

            $stats['total_redeemed_month'] = $monthRedeemed->count();
            $stats['total_saved_month'] = (float) $monthRedeemed->sum('nominal_value');
            $stats['attendance_wfo_count'] = Attendance::where('company_id', $companyId)
                ->where('employee_id', $employee->id)
                ->whereBetween('date', [$monthStart, $monthEnd])
                ->where('status', 'present')
                ->count();
        }

        $activeVendors = CanteenVendor::where('company_id', $companyId)
            ->where('status', 'active')
            ->select('id', 'name', 'code', 'location', 'price_per_meal')
            ->get();

        return Inertia::render('Canteen/VoucherCard', [
            'employee' => $employee ? [
                'id' => $employee->id,
                'name' => $employee->name,
                'nik' => $employee->nik,
                'avatar' => $employee->avatar,
                'department' => $employee->department?->name,
                'designation' => $employee->designation?->name,
            ] : null,
            'todayVoucher' => $todayVoucher ? [
                'id' => $todayVoucher->id,
                'voucher_code' => $todayVoucher->voucher_code,
                'encrypted_token' => $todayVoucher->encrypted_token,
                'meal_date' => $todayVoucher->meal_date->format('Y-m-d'),
                'meal_type' => $todayVoucher->meal_type,
                'nominal_value' => (float) $todayVoucher->nominal_value,
                'status' => $todayVoucher->status,
                'expires_at' => $todayVoucher->expires_at?->toIso8601String(),
                'ttl_remaining' => $todayVoucher->expires_at ? max(0, now()->diffInSeconds($todayVoucher->expires_at, false)) : 0,
                'redeemed_at' => $todayVoucher->redeemed_at ? $todayVoucher->redeemed_at->format('H:i:s') : null,
                'vendor' => $todayVoucher->vendor ? [
                    'id' => $todayVoucher->vendor->id,
                    'name' => $todayVoucher->vendor->name,
                ] : null,
            ] : null,
            'todayAttendance' => $todayAttendance ? [
                'id' => $todayAttendance->id,
                'status' => $todayAttendance->status,
                'clock_in' => $todayAttendance->clock_in,
            ] : null,
            'history' => $history,
            'stats' => $stats,
            'vendors' => $activeVendors,
        ]);
    }

    /**
     * Refresh the dynamic token of today's voucher (60s TTL).
     */
    public function refreshToken(Request $request): JsonResponse
    {
        $companyId = $this->getActiveCompanyId();
        $employee = $this->resolveEmployee();

        if (!$employee) {
            return response()->json(['error' => 'Data karyawan tidak ditemukan.'], 404);
        }

        $today = Carbon::today()->format('Y-m-d');
        $voucher = CanteenVoucher::where('company_id', $companyId)
            ->where('employee_id', $employee->id)
            ->whereDate('meal_date', $today)
            ->first();

        if (!$voucher) {
            return response()->json(['error' => 'Voucher makan hari ini belum tersedia.'], 404);
        }

        if ($voucher->status !== 'active') {
            return response()->json([
                'error' => 'Voucher sudah ditebus atau tidak aktif.',
                'status' => $voucher->status,
            ], 422);
        }

        $newToken = $voucher->refreshDynamicToken(60);

        return response()->json([
            'success' => true,
            'encrypted_token' => $newToken,
            'expires_at' => $voucher->expires_at->toIso8601String(),
            'ttl_seconds' => 60,
        ]);
    }

    /**
     * Merchant Scanner Interface (Submenu: Scanner Merchant).
     */
    public function scanner(Request $request): Response
    {
        $companyId = $this->getActiveCompanyId();
        $today = Carbon::today()->format('Y-m-d');

        $vendors = CanteenVendor::where('company_id', $companyId)
            ->where('status', 'active')
            ->get();

        $selectedVendorId = $request->query('vendor_id', $vendors->first()?->id);

        // Recent scans today
        $query = CanteenVoucher::where('canteen_vouchers.company_id', $companyId)
            ->where('canteen_vouchers.status', 'redeemed')
            ->whereDate('canteen_vouchers.meal_date', $today)
            ->with(['employee.department', 'employee.designation', 'vendor'])
            ->orderBy('canteen_vouchers.redeemed_at', 'desc');

        if ($selectedVendorId) {
            $query->where('canteen_vouchers.vendor_id', $selectedVendorId);
        }

        $recentScans = $query->take(15)->get()->map(fn ($v) => [
            'id' => $v->id,
            'voucher_code' => $v->voucher_code,
            'meal_type' => $v->meal_type,
            'nominal_value' => (float) $v->nominal_value,
            'redeemed_at' => $v->redeemed_at ? $v->redeemed_at->format('H:i:s') : null,
            'vendor_name' => $v->vendor?->name,
            'employee' => [
                'name' => $v->employee->name,
                'nik' => $v->employee->nik,
                'avatar' => $v->employee->avatar,
                'department' => $v->employee->department?->name,
                'designation' => $v->employee->designation?->name,
            ],
        ]);

        $allScansToday = CanteenVoucher::where('company_id', $companyId)
            ->where('status', 'redeemed')
            ->whereDate('meal_date', $today)
            ->when($selectedVendorId, fn ($q) => $q->where('vendor_id', $selectedVendorId))
            ->get();

        $todayStats = [
            'total_meals' => $allScansToday->count(),
            'total_amount' => (float) $allScansToday->sum('nominal_value'),
            'selected_vendor_id' => $selectedVendorId ? (int) $selectedVendorId : null,
        ];

        return Inertia::render('Canteen/Scanner', [
            'vendors' => $vendors,
            'recentScans' => $recentScans,
            'todayStats' => $todayStats,
        ]);
    }

    /**
     * Redeem Voucher via Merchant Scan (< 1s fast verification).
     */
    public function redeem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'vendor_id' => 'required|integer',
        ]);

        $companyId = $this->getActiveCompanyId();

        // 1. Verify Vendor belongs to this company
        $vendor = CanteenVendor::where('company_id', $companyId)
            ->where('id', $validated['vendor_id'])
            ->first();

        if (!$vendor) {
            return response()->json([
                'success' => false,
                'message' => 'Vendor kantin tidak valid atau tidak terdaftar pada perusahaan ini.',
            ], 404);
        }

        // 2. Find Voucher by encrypted token
        $voucher = CanteenVoucher::where('company_id', $companyId)
            ->where('encrypted_token', $validated['token'])
            ->with(['employee.department', 'employee.designation'])
            ->first();

        if (!$voucher) {
            return response()->json([
                'success' => false,
                'message' => 'Token QR tidak ditemukan atau tidak valid. Silakan scan ulang.',
            ], 404);
        }

        // 3. Check if already redeemed
        if ($voucher->status === 'redeemed') {
            $redeemedVendor = $voucher->vendor?->name ?? 'Merchant';
            $redeemedTime = $voucher->redeemed_at ? $voucher->redeemed_at->format('H:i:s') : 'hari ini';
            return response()->json([
                'success' => false,
                'message' => "Voucher ini sudah pernah digunakan pada pukul {$redeemedTime} di {$redeemedVendor}.",
                'already_redeemed' => true,
            ], 422);
        }

        // 4. Check if token expired (> 60 seconds TTL)
        if ($voucher->isTokenExpired()) {
            return response()->json([
                'success' => false,
                'message' => 'Token QR telah kedaluwarsa (> 60 detik). Karyawan harus menyegarkan layar QR Code.',
                'expired' => true,
            ], 422);
        }

        // 5. Check meal date
        $today = Carbon::today()->format('Y-m-d');
        if ($voucher->meal_date->format('Y-m-d') !== $today) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher ini tidak berlaku untuk tanggal hari ini.',
            ], 422);
        }

        // 6. Redeem atomically
        $voucher->update([
            'status' => 'redeemed',
            'vendor_id' => $vendor->id,
            'nominal_value' => $vendor->price_per_meal,
            'redeemed_at' => now(),
            'redeemed_by' => Auth::id(),
            'ip_address' => $request->ip(),
            'device_info' => $request->userAgent() ?? 'Crave Merchant Scanner',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Voucher berhasil diverifikasi dan ditebus!',
            'voucher' => [
                'id' => $voucher->id,
                'voucher_code' => $voucher->voucher_code,
                'meal_type' => $voucher->meal_type,
                'nominal_value' => (float) $voucher->nominal_value,
                'redeemed_at' => $voucher->redeemed_at->format('H:i:s'),
                'vendor_name' => $vendor->name,
                'employee' => [
                    'id' => $voucher->employee->id,
                    'name' => $voucher->employee->name,
                    'nik' => $voucher->employee->nik,
                    'avatar' => $voucher->employee->avatar,
                    'department' => $voucher->employee->department?->name,
                    'designation' => $voucher->employee->designation?->name,
                ],
            ],
        ]);
    }

    /**
     * Vendor Settlement & Reconciliation Report (Submenu: Rekonsiliasi Vendor).
     */
    public function settlement(Request $request): Response
    {
        $companyId = $this->getActiveCompanyId();
        $month = $request->query('month', Carbon::today()->format('Y-m'));

        $startOfMonth = Carbon::createFromFormat('Y-m', $month)->startOfMonth()->format('Y-m-d');
        $endOfMonth = Carbon::createFromFormat('Y-m', $month)->endOfMonth()->format('Y-m-d');

        // All vendors in this company
        $vendors = CanteenVendor::where('company_id', $companyId)->get();

        // Redeemed vouchers in selected month
        $vouchersInMonth = CanteenVoucher::where('company_id', $companyId)
            ->where('status', 'redeemed')
            ->whereDate('meal_date', '>=', $startOfMonth)
            ->whereDate('meal_date', '<=', $endOfMonth)
            ->with(['vendor', 'employee.department'])
            ->get();

        $totalMeals = $vouchersInMonth->count();
        $totalExpenditure = (float) $vouchersInMonth->sum('nominal_value');
        $activeVendorsCount = $vendors->where('status', 'active')->count();

        $totalEmployees = Employee::where('company_id', $companyId)->where('status', 'active')->count();
        $uniqueEmployeesWhoAte = $vouchersInMonth->pluck('employee_id')->unique()->count();
        $utilizationRate = $totalEmployees > 0 ? round(($uniqueEmployeesWhoAte / $totalEmployees) * 100, 1) : 0;

        // Vendor breakdown summary
        $vendorSummaries = $vendors->map(function ($vendor) use ($vouchersInMonth) {
            $vendorVouchers = $vouchersInMonth->where('vendor_id', $vendor->id);
            $porsi = $vendorVouchers->count();
            $totalTagihan = (float) $vendorVouchers->sum('nominal_value');

            return [
                'id' => $vendor->id,
                'code' => $vendor->code,
                'name' => $vendor->name,
                'pic_name' => $vendor->pic_name,
                'pic_phone' => $vendor->pic_phone,
                'location' => $vendor->location,
                'price_per_meal' => (float) $vendor->price_per_meal,
                'status' => $vendor->status,
                'total_porsi' => $porsi,
                'total_tagihan' => $totalTagihan,
            ];
        });

        // 30-day Daily trend for AreaChart
        $dailyTrend = [];
        $curDate = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        $monthEndDate = Carbon::createFromFormat('Y-m', $month)->endOfMonth();
        if ($monthEndDate->isFuture()) {
            $monthEndDate = Carbon::today();
        }

        while ($curDate->lte($monthEndDate)) {
            $dStr = $curDate->format('Y-m-d');
            $dayVouchers = $vouchersInMonth->where('meal_date', Carbon::parse($dStr));

            $item = [
                'date' => $dStr,
                'day' => $curDate->format('d M'),
                'total' => $dayVouchers->count(),
            ];

            foreach ($vendors as $vendor) {
                $item['vendor_' . $vendor->id] = $dayVouchers->where('vendor_id', $vendor->id)->count();
            }

            $dailyTrend[] = $item;
            $curDate->addDay();
        }

        // Composition for PieChart
        $colors = ['#1B5CFE', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
        $vendorComposition = $vendorSummaries->filter(fn ($v) => $v['total_porsi'] > 0)->values()->map(function ($v, $i) use ($totalMeals, $colors) {
            return [
                'name' => $v['name'],
                'porsi' => $v['total_porsi'],
                'nominal' => $v['total_tagihan'],
                'percentage' => $totalMeals > 0 ? round(($v['total_porsi'] / $totalMeals) * 100, 1) : 0,
                'color' => $colors[$i % count($colors)],
            ];
        });

        // Recent detailed redemptions
        $recentTransactions = $vouchersInMonth->sortByDesc('redeemed_at')->take(50)->values()->map(fn ($v) => [
            'id' => $v->id,
            'voucher_code' => $v->voucher_code,
            'meal_date' => $v->meal_date->format('Y-m-d'),
            'meal_type' => $v->meal_type,
            'nominal_value' => (float) $v->nominal_value,
            'redeemed_at' => $v->redeemed_at ? $v->redeemed_at->format('d/m/Y H:i') : null,
            'vendor_name' => $v->vendor?->name ?? '-',
            'employee' => [
                'name' => $v->employee->name,
                'nik' => $v->employee->nik,
                'department' => $v->employee->department?->name ?? '-',
            ],
        ]);

        return Inertia::render('Canteen/Reports', [
            'month' => $month,
            'kpis' => [
                'total_meals' => $totalMeals,
                'total_expenditure' => $totalExpenditure,
                'active_vendors_count' => $activeVendorsCount,
                'utilization_rate' => $utilizationRate,
            ],
            'vendors' => $vendorSummaries,
            'dailyTrend' => $dailyTrend,
            'vendorComposition' => $vendorComposition,
            'recentTransactions' => $recentTransactions,
        ]);
    }

    /**
     * Store new Canteen Vendor.
     */
    public function storeVendor(Request $request): RedirectResponse
    {
        $companyId = $this->getActiveCompanyId();

        $validated = $request->validate([
            'code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'pic_name' => 'required|string|max:255',
            'pic_phone' => 'nullable|string|max:50',
            'location' => 'required|string|max:255',
            'price_per_meal' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        CanteenVendor::create([
            'company_id' => $companyId,
            ...$validated,
            'status' => 'active',
        ]);

        return back()->with('success', 'Vendor kantin berhasil ditambahkan.');
    }

    /**
     * Update Canteen Vendor.
     */
    public function updateVendor(Request $request, CanteenVendor $vendor): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'pic_name' => 'required|string|max:255',
            'pic_phone' => 'nullable|string|max:50',
            'location' => 'required|string|max:255',
            'price_per_meal' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
            'notes' => 'nullable|string',
        ]);

        $vendor->update($validated);

        return back()->with('success', 'Data vendor berhasil diperbarui.');
    }

    /**
     * Delete Canteen Vendor.
     */
    public function destroyVendor(CanteenVendor $vendor): RedirectResponse
    {
        $vendor->delete();
        return back()->with('success', 'Vendor berhasil dihapus.');
    }
}
