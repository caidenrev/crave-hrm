<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Employee;
use App\Models\PayrollItem;
use App\Models\PayrollPeriod;
use App\Models\SalaryComponent;
use App\Services\BpjsCalculator;
use App\Services\Pph21TerCalculator;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PayrollSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = Company::all();
        $pphCalculator = new Pph21TerCalculator();
        $bpjsCalculator = new BpjsCalculator();

        foreach ($companies as $company) {
            // Seed default salary components
            SalaryComponent::firstOrCreate(
                ['company_id' => $company->id, 'name' => 'Tunjangan Jabatan'],
                ['type' => 'earning', 'is_taxable' => true, 'is_fixed' => true, 'default_amount' => 1500000]
            );

            SalaryComponent::firstOrCreate(
                ['company_id' => $company->id, 'name' => 'Tunjangan Transportasi & Makan'],
                ['type' => 'earning', 'is_taxable' => true, 'is_fixed' => true, 'default_amount' => 1000000]
            );

            SalaryComponent::firstOrCreate(
                ['company_id' => $company->id, 'name' => 'Potongan Keterlambatan'],
                ['type' => 'deduction', 'is_taxable' => false, 'is_fixed' => false, 'default_amount' => 50000]
            );

            $employees = Employee::where('company_id', $company->id)->where('is_active', true)->get();
            if ($employees->isEmpty()) {
                continue;
            }

            // Create November 2026 Payroll Period
            $now = Carbon::parse('2026-11-15');
            $period = PayrollPeriod::firstOrCreate(
                [
                    'company_id' => $company->id,
                    'month' => 11,
                    'year' => 2026,
                ],
                [
                    'name' => 'Payroll November 2026',
                    'start_date' => '2026-11-01',
                    'end_date' => '2026-11-30',
                    'payment_date' => '2026-11-25',
                    'status' => 'draft',
                    'processed_by' => 1,
                    'processed_at' => $now,
                ]
            );

            $totalGross = 0;
            $totalDeductions = 0;
            $totalNetPay = 0;

            foreach ($employees as $employee) {
                $baseSalary = (float) ($employee->gaji_pokok ?: 8500000);
                $fixedAllowance = 1000000;
                $grossIncome = $baseSalary + $fixedAllowance;

                $bpjs = $bpjsCalculator->calculate($grossIncome);
                $taxResult = $pphCalculator->calculateMonthlyTax($grossIncome, $employee->ptkp_status);

                $employeeDeductions = $bpjs['total_employee'] + $taxResult['tax_amount'];
                $takeHomePay = max(0, $grossIncome - $employeeDeductions);

                PayrollItem::updateOrCreate(
                    [
                        'company_id' => $company->id,
                        'payroll_period_id' => $period->id,
                        'employee_id' => $employee->id,
                    ],
                    [
                        'gaji_pokok' => $baseSalary,
                        'tunjangan_tetap' => $fixedAllowance,
                        'tunjangan_tidak_tetap' => 0,
                        'uang_lembur' => 0,
                        'reimbursement_total' => 0,
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
                        'ptkp_status' => $employee->ptkp_status ?: 'TK/0',
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
        }
    }
}

