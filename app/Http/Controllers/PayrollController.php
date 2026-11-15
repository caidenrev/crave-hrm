<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Overtime;
use App\Models\PayrollItem;
use App\Models\PayrollPeriod;
use App\Models\Reimbursement;
use App\Services\BankExportService;
use App\Services\BpjsCalculator;
use App\Services\Pph21TerCalculator;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PayrollController extends Controller
{
    public function __construct(
        protected Pph21TerCalculator $pphCalculator,
        protected BpjsCalculator $bpjsCalculator,
        protected BankExportService $bankExportService,
    ) {}

    /**
     * Resolve active company id from session or current user/company fallback.
     */
    protected function getActiveCompanyId(): ?int
    {
        $user = auth()->user();
        $companyId = session('active_company_id') ?? $user?->currentCompany()?->id ?? Company::first()?->id;
        if ($companyId && !session()->has('active_company_id')) {
            session(['active_company_id' => $companyId]);
        }
        return $companyId;
    }

    /**
     * Display Payroll Runner & Batch Overview.
     */
    public function index(Request $request): Response
    {
        $companyId = $this->getActiveCompanyId();

        $periods = PayrollPeriod::where('company_id', $companyId)
            ->with('processor:id,name')
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->get();

        $selectedPeriodId = $request->query('period_id', $periods->first()?->id);
        $activePeriod = $selectedPeriodId
            ? PayrollPeriod::where('company_id', $companyId)
                ->with(['items.employee.department', 'items.employee.designation'])
                ->find($selectedPeriodId)
            : null;

        $employees = Employee::where('company_id', $companyId)
            ->where('is_active', true)
            ->with(['department', 'designation'])
            ->get();

        $departments = Department::where('company_id', $companyId)->get();

        // High-level KPI metrics
        $metrics = [
            'total_net_payroll' => (float) ($activePeriod?->total_net_pay ?? 0),
            'total_gross_payroll' => (float) ($activePeriod?->total_gross ?? 0),
            'total_employees' => (int) ($activePeriod?->total_employees ?? $employees->count()),
            'total_tax_pph21' => (float) ($activePeriod ? $activePeriod->items->sum('pph21') : 0),
            'total_bpjs_contributions' => (float) ($activePeriod ? $activePeriod->items->sum(function ($item) {
                return $item->bpjs_kes_employee + $item->bpjs_jht_employee + $item->bpjs_jp_employee;
            }) : 0),
        ];

        // 6-Month continuous wave trend data for AreaChart
        $targetMonth = $activePeriod ? $activePeriod->month : 11;
        $targetYear = $activePeriod ? $activePeriod->year : 2026;
        $targetDate = Carbon::create($targetYear, $targetMonth, 1);

        $trendData = [];
        for ($i = 5; $i >= 0; $i--) {
            $mDate = $targetDate->copy()->subMonths($i);
            $p = $periods->first(fn($item) => $item->month === (int)$mDate->month && $item->year === (int)$mDate->year);

            $monthLabel = $mDate->translatedFormat('M') . ' ' . $mDate->format('y');
            if ($p) {
                $gross = round((float)$p->total_gross / 1000000, 1);
                $net = round((float)$p->total_net_pay / 1000000, 1);
            } else {
                $baseGross = (float)($activePeriod?->total_gross ?: $employees->sum('gaji_pokok'));
                $multiplier = 1.0 - ($i * 0.03);
                $gross = round(($baseGross * $multiplier) / 1000000, 1);
                $net = round($gross * 0.83, 1);
            }

            $trendData[] = [
                'name' => $monthLabel,
                'gross' => $gross,
                'net' => $net,
            ];
        }

        return Inertia::render('Payroll/Index', [
            'periods' => $periods,
            'activePeriod' => $activePeriod,
            'employees' => $employees,
            'departments' => $departments,
            'metrics' => $metrics,
            'trendData' => $trendData,
        ]);
    }

    /**
     * Run / Process Automated Payroll Calculation for a given month and year.
     */
    public function runPayroll(Request $request)
    {
        $companyId = $this->getActiveCompanyId();

        $validated = $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2020|max:2030',
            'payment_date' => 'required|date',
            'name' => 'nullable|string|max:100',
        ]);

        $month = (int) $validated['month'];
        $year = (int) $validated['year'];
        $paymentDate = Carbon::parse($validated['payment_date']);
        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = Carbon::create($year, $month, 1)->endOfMonth();

        $monthName = $startDate->translatedFormat('F');
        $periodName = $validated['name'] ?? "Payroll {$monthName} {$year}";

        try {
            DB::transaction(function () use ($companyId, $month, $year, $startDate, $endDate, $paymentDate, $periodName) {
                $period = PayrollPeriod::updateOrCreate(
                    [
                        'company_id' => $companyId,
                        'month' => $month,
                        'year' => $year,
                    ],
                    [
                        'name' => $periodName,
                        'start_date' => $startDate,
                        'end_date' => $endDate,
                        'payment_date' => $paymentDate,
                        'status' => 'draft',
                        'processed_by' => auth()->id(),
                        'processed_at' => now(),
                    ]
                );

                // Fetch active employees
                $employees = Employee::where('company_id', $companyId)
                    ->where('is_active', true)
                    ->get();

                $totalGross = 0;
                $totalDeductions = 0;
                $totalNetPay = 0;

                foreach ($employees as $employee) {
                    $baseSalary = (float) ($employee->gaji_pokok ?? 0);
                    $fixedAllowance = 0; // Tunjangan tetap default
                    $variableAllowance = 0;

                    // Hitung lembur yang disetujui di bulan berjalan
                    $overtimePay = (float) Overtime::where('company_id', $companyId)
                        ->where('employee_id', $employee->id)
                        ->where('status', 'approved')
                        ->whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
                        ->sum('estimated_amount');

                    // Hitung reimbursement yang disetujui di bulan berjalan
                    $reimbursementTotal = (float) Reimbursement::where('company_id', $companyId)
                        ->where('employee_id', $employee->id)
                        ->where('status', 'approved')
                        ->whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
                        ->sum('amount');

                    $grossIncome = $baseSalary + $fixedAllowance + $variableAllowance + $overtimePay + $reimbursementTotal;

                    // Kalkulasi BPJS
                    $bpjs = $this->bpjsCalculator->calculate($baseSalary + $fixedAllowance);

                    // Kalkulasi PPh 21 TER 2024
                    $taxResult = $this->pphCalculator->calculateMonthlyTax($grossIncome, $employee->ptkp_status);

                    $employeeDeductions = $bpjs['total_employee'] + $taxResult['tax_amount'];
                    $takeHomePay = max(0, $grossIncome - $employeeDeductions);

                    PayrollItem::updateOrCreate(
                        [
                            'company_id' => $companyId,
                            'payroll_period_id' => $period->id,
                            'employee_id' => $employee->id,
                        ],
                        [
                            'gaji_pokok' => $baseSalary,
                            'tunjangan_tetap' => $fixedAllowance,
                            'tunjangan_tidak_tetap' => $variableAllowance,
                            'uang_lembur' => $overtimePay,
                            'reimbursement_total' => $reimbursementTotal,
                            'penghasilan_bruto' => $grossIncome,
                            'bpjs_kes_company' => $bpjs['bpjs_kes_company'],
                            'bpjs_jkk' => $bpjs['bpjs_jkk'],
                            'bpjs_jkm' => $bpjs['bpjs_jkm'],
                            'bpjs_jht_company' => $bpjs['bpjs_jht_company'],
                            'bpjs_jp_company' => $bpjs['bpjs_jp_company'],
                            'bpjs_kes_employee' => $bpjs['bpjs_kes_employee'],
                            'bpjs_jht_employee' => $bpjs['bpjs_jht_employee'],
                            'bpjs_jp_employee' => $bpjs['bpjs_jp_employee'],
                            'pph21' => $taxResult['tax_amount'],
                            'total_potongan' => $employeeDeductions,
                            'take_home_pay' => $takeHomePay,
                            'ptkp_status' => $employee->ptkp_status ?? 'TK/0',
                            'ter_category' => $taxResult['category'],
                            'ter_rate' => $taxResult['rate'],
                            'payment_status' => 'unpaid',
                        ]
                    );

                    $totalGross += $grossIncome;
                    $totalDeductions += $employeeDeductions;
                    $totalNetPay += $takeHomePay;
                }

                $period->update([
                    'total_employees' => $employees->count(),
                    'total_gross' => $totalGross,
                    'total_deductions' => $totalDeductions,
                    'total_net_pay' => $totalNetPay,
                ]);
            });

            return redirect()->back()->with('success', 'Payroll berhasil diproses dengan presisi PPh 21 TER 2024 dan BPJS.');
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Payroll batch calculation failed: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => 'Gagal memproses batch penggajian: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Finalize & Lock Payroll Period.
     */
    public function finalize(PayrollPeriod $period)
    {
        $companyId = $this->getActiveCompanyId();
        if ($period->company_id !== $companyId) {
            abort(403);
        }

        $period->update([
            'status' => 'finalized',
        ]);

        // Mark all items as paid
        PayrollItem::where('payroll_period_id', $period->id)
            ->update([
                'payment_status' => 'paid',
                'paid_at' => now(),
            ]);

        return redirect()->back()->with('success', "Periode {$period->name} berhasil difinalisasi dan dikunci.");
    }

    /**
     * Display Employee Payslips.
     */
    public function slips(Request $request): Response
    {
        $companyId = $this->getActiveCompanyId();

        $periods = PayrollPeriod::where('company_id', $companyId)
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->get();

        $selectedPeriodId = $request->query('period_id', $periods->first()?->id);

        $query = PayrollItem::where('company_id', $companyId)
            ->with(['employee.department', 'employee.designation', 'period']);

        if ($selectedPeriodId) {
            $query->where('payroll_period_id', $selectedPeriodId);
        }

        if ($search = $request->query('search')) {
            $query->whereHas('employee', function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        $items = $query->paginate(20)->withQueryString();

        $stats = [
            'total_slips' => $query->count(),
            'total_paid' => (float) $query->sum('take_home_pay'),
            'total_tax' => (float) $query->sum('pph21'),
        ];

        return Inertia::render('Payroll/Slips', [
            'periods' => $periods,
            'selectedPeriodId' => $selectedPeriodId,
            'items' => $items,
            'stats' => $stats,
        ]);
    }

    /**
     * Print / Preview Payslip HTML view (ready for PDF printing).
     */
    public function printSlip(PayrollItem $item)
    {
        $companyId = $this->getActiveCompanyId();
        if ($item->company_id !== $companyId) {
            abort(403);
        }

        $item->load(['employee.department', 'employee.designation', 'period.processor', 'company']);

        return view('payroll.slip-print', [
            'item' => $item,
        ]);
    }

    /**
     * Display Bank Batch Export & Summary.
     */
    public function export(Request $request): Response
    {
        $companyId = $this->getActiveCompanyId();

        $periods = PayrollPeriod::where('company_id', $companyId)
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->get();

        $selectedPeriodId = $request->query('period_id', $periods->first()?->id);
        $period = $selectedPeriodId ? PayrollPeriod::where('company_id', $companyId)->find($selectedPeriodId) : null;

        $items = $period ? PayrollItem::where('payroll_period_id', $period->id)->with('employee')->get() : collect();

        // Bank distribution count
        $bankDistribution = $items->groupBy(function ($item) {
            return strtoupper(trim($item->employee->bank_name ?? 'LAINNYA'));
        })->map(function ($group) {
            return [
                'count' => $group->count(),
                'total_amount' => (float) $group->sum('take_home_pay'),
            ];
        });

        return Inertia::render('Payroll/Export', [
            'periods' => $periods,
            'selectedPeriod' => $period,
            'bankDistribution' => $bankDistribution,
            'totalEmployees' => $items->count(),
            'totalAmount' => (float) $items->sum('take_home_pay'),
        ]);
    }

    /**
     * Download Bank Corporate Batch Transfer File (BCA, Mandiri, BRI, BNI).
     */
    public function exportBank(Request $request): StreamedResponse
    {
        $companyId = $this->getActiveCompanyId();

        $validated = $request->validate([
            'payroll_period_id' => 'required|exists:payroll_periods,id',
            'bank_format' => 'required|string|in:BCA,MANDIRI,BRI,BNI',
        ]);

        $period = PayrollPeriod::where('company_id', $companyId)
            ->findOrFail($validated['payroll_period_id']);

        $export = $this->bankExportService->generateExport($period, $validated['bank_format']);

        return response()->streamDownload(
            function () use ($export) {
                echo $export['content'];
            },
            $export['filename'],
            [
                'Content-Type' => $export['mime_type'] . '; charset=UTF-8',
            ]
        );
    }

    /**
     * Download Excel / CSV Payroll Master Recap.
     */
    public function exportExcel(Request $request): StreamedResponse
    {
        $companyId = $this->getActiveCompanyId();

        $validated = $request->validate([
            'payroll_period_id' => 'required|exists:payroll_periods,id',
        ]);

        $period = PayrollPeriod::where('company_id', $companyId)
            ->with(['items.employee.department', 'items.employee.designation'])
            ->findOrFail($validated['payroll_period_id']);

        $filename = "Rekap_Payroll_{$period->year}_{$period->month}.csv";

        return response()->streamDownload(
            function () use ($period) {
                $output = fopen('php://output', 'w');
                // UTF-8 BOM for Excel
                fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

                fputcsv($output, [
                    'NIK',
                    'Nama Karyawan',
                    'Departemen',
                    'Jabatan',
                    'PTKP',
                    'Kategori TER',
                    'Tarif TER (%)',
                    'Gaji Pokok',
                    'Tunjangan Tetap',
                    'Tunjangan Variabel',
                    'Uang Lembur',
                    'Reimbursement',
                    'Penghasilan Bruto',
                    'PPh 21 TER',
                    'BPJS Kes Karyawan (1%)',
                    'BPJS JHT Karyawan (2%)',
                    'BPJS JP Karyawan (1%)',
                    'Total Potongan',
                    'Take Home Pay',
                    'Bank',
                    'Nomor Rekening',
                    'Status Pembayaran',
                ]);

                foreach ($period->items as $item) {
                    fputcsv($output, [
                        $item->employee->nik ?? '',
                        $item->employee->nama_lengkap ?? '',
                        $item->employee->department->name ?? '',
                        $item->employee->designation->name ?? '',
                        $item->ptkp_status,
                        $item->ter_category,
                        number_format($item->ter_rate, 2),
                        $item->gaji_pokok,
                        $item->tunjangan_tetap,
                        $item->tunjangan_tidak_tetap,
                        $item->uang_lembur,
                        $item->reimbursement_total,
                        $item->penghasilan_bruto,
                        $item->pph21,
                        $item->bpjs_kes_employee,
                        $item->bpjs_jht_employee,
                        $item->bpjs_jp_employee,
                        $item->total_potongan,
                        $item->take_home_pay,
                        $item->employee->bank_name ?? '',
                        $item->employee->bank_account_number ?? '',
                        $item->payment_status,
                    ]);
                }

                fclose($output);
            },
            $filename,
            [
                'Content-Type' => 'text/csv; charset=UTF-8',
            ]
        );
    }
}

