<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Employee;
use App\Models\PayrollItem;
use App\Models\PayrollPeriod;
use App\Models\SalaryComponent;
use App\Models\User;
use App\Services\BpjsCalculator;
use App\Services\Pph21TerCalculator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Task11PayrollTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Company $companyA;
    protected Company $companyB;
    protected Employee $employeeA;
    protected Employee $employeeB;

    protected function setUp(): void
    {
        parent::setUp();

        $this->companyA = Company::create([
            'name' => 'Crave Global Holding',
            'slug' => 'crave-holding',
            'is_holding' => true,
        ]);

        $this->companyB = Company::create([
            'name' => 'Crave Retail',
            'slug' => 'crave-retail',
            'is_holding' => false,
        ]);

        $this->user = User::factory()->create([
            'name' => 'HR Manager',
            'email' => 'hr@crave.id',
        ]);

        $this->user->companies()->attach($this->companyA->id, ['role' => 'hr_admin']);

        $this->employeeA = Employee::create([
            'company_id' => $this->companyA->id,
            'nik' => 'EMP-001',
            'nama_lengkap' => 'Budi Santoso',
            'email' => 'budi@crave.id',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'TK/0',
            'gaji_pokok' => 10000000,
            'is_active' => true,
            'tanggal_masuk' => '2024-01-01',
            'bank_name' => 'BCA',
            'bank_account_number' => '1234567890',
        ]);

        $this->employeeB = Employee::create([
            'company_id' => $this->companyB->id,
            'nik' => 'EMP-002',
            'nama_lengkap' => 'Siti Nurhaliza',
            'email' => 'siti@crave.id',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'K/1',
            'gaji_pokok' => 15000000,
            'is_active' => true,
            'tanggal_masuk' => '2024-01-01',
            'bank_name' => 'Mandiri',
            'bank_account_number' => '0987654321',
        ]);
    }

    public function test_pph21_ter_calculator_for_category_a(): void
    {
        $calculator = new Pph21TerCalculator();
        
        $category = $calculator->getTerCategory('TK/0');
        $this->assertEquals('A', $category);

        // Gaji Rp 10.000.000 -> Range > 9.650.000 s.d. 10.050.000 -> 2.0%
        $result = $calculator->calculateMonthlyTax(10000000, 'TK/0');
        $this->assertEquals(2.0, $result['rate']);
        $this->assertEquals(200000, $result['tax_amount']);
    }

    public function test_pph21_ter_calculator_for_category_b(): void
    {
        $calculator = new Pph21TerCalculator();

        $category = $calculator->getTerCategory('K/1');
        $this->assertEquals('B', $category);

        // Gaji Rp 15.000.000 -> Range > 13.700.000 s.d. 15.100.000 -> 4.0%
        $result = $calculator->calculateMonthlyTax(15000000, 'K/1');
        $this->assertEquals(4.0, $result['rate']);
        $this->assertEquals(600000, $result['tax_amount']);
    }

    public function test_pph21_ter_calculator_for_category_c(): void
    {
        $calculator = new Pph21TerCalculator();

        $category = $calculator->getTerCategory('K/3');
        $this->assertEquals('C', $category);

        // Gaji Rp 20.000.000 -> Range > 19.500.000 s.d. 22.700.000 -> 8.0%
        $result = $calculator->calculateMonthlyTax(20000000, 'K/3');
        $this->assertEquals(8.0, $result['rate']);
        $this->assertEquals(1600000, $result['tax_amount']);
    }

    public function test_bpjs_calculator_rates_and_wage_caps(): void
    {
        $calculator = new BpjsCalculator();

        // 1. Gaji di bawah cap: Rp 8.000.000
        $bpjs1 = $calculator->calculate(8000000);
        $this->assertEquals(320000, $bpjs1['bpjs_kes_company']); // 4%
        $this->assertEquals(80000, $bpjs1['bpjs_kes_employee']);  // 1%
        $this->assertEquals(19200, $bpjs1['bpjs_jkk']);           // 0.24%
        $this->assertEquals(24000, $bpjs1['bpjs_jkm']);           // 0.30%
        $this->assertEquals(296000, $bpjs1['bpjs_jht_company']);  // 3.7%
        $this->assertEquals(160000, $bpjs1['bpjs_jht_employee']); // 2.0%
        $this->assertEquals(160000, $bpjs1['bpjs_jp_company']);   // 2.0%
        $this->assertEquals(80000, $bpjs1['bpjs_jp_employee']);   // 1.0%

        // 2. Gaji di atas cap BPJS Kesehatan (Cap Rp 12.000.000) & JP (Cap Rp 10.042.300): Rp 20.000.000
        $bpjs2 = $calculator->calculate(20000000);
        $this->assertEquals(480000, $bpjs2['bpjs_kes_company']); // 4% of 12jt
        $this->assertEquals(120000, $bpjs2['bpjs_kes_employee']);  // 1% of 12jt
        $this->assertEquals(48000, $bpjs2['bpjs_jkk']);            // 0.24% of 20jt
        $this->assertEquals(60000, $bpjs2['bpjs_jkm']);            // 0.30% of 20jt
        $this->assertEquals(740000, $bpjs2['bpjs_jht_company']);  // 3.7% of 20jt
        $this->assertEquals(400000, $bpjs2['bpjs_jht_employee']); // 2.0% of 20jt
        // JP capped at 10.042.300
        $this->assertEquals(round(10042300 * 0.02, 2), $bpjs2['bpjs_jp_company']);
        $this->assertEquals(round(10042300 * 0.01, 2), $bpjs2['bpjs_jp_employee']);
    }

    public function test_user_can_view_payroll_index_and_run_payroll_batch(): void
    {
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/payroll');

        $response->assertStatus(200);

        // Run batch for November 2026
        $runResponse = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post('/payroll/run', [
                'month' => 11,
                'year' => 2026,
                'payment_date' => '2026-11-25',
            ]);

        $runResponse->assertRedirect();

        $period = PayrollPeriod::where('company_id', $this->companyA->id)
            ->where('month', 11)
            ->where('year', 2026)
            ->first();

        $this->assertNotNull($period);
        $this->assertEquals(1, $period->total_employees);
        $this->assertGreaterThan(0, $period->total_gross);
        $this->assertGreaterThan(0, $period->total_net_pay);

        $item = PayrollItem::where('payroll_period_id', $period->id)->first();
        $this->assertNotNull($item);
        $this->assertEquals($this->employeeA->id, $item->employee_id);
        $this->assertEquals(10000000, $item->gaji_pokok);
        $this->assertEquals(200000, $item->pph21); // 2% of 10jt
    }

    public function test_multi_tenant_isolation_for_payroll(): void
    {
        // Create period in Company A
        $periodA = PayrollPeriod::create([
            'company_id' => $this->companyA->id,
            'name' => 'Payroll Nov 2026 A',
            'month' => 11,
            'year' => 2026,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-30',
            'payment_date' => '2026-11-25',
            'status' => 'draft',
        ]);

        PayrollItem::create([
            'company_id' => $this->companyA->id,
            'payroll_period_id' => $periodA->id,
            'employee_id' => $this->employeeA->id,
            'gaji_pokok' => 10000000,
            'penghasilan_bruto' => 10000000,
            'take_home_pay' => 9300000,
        ]);

        // When authenticated in Company B
        $responseB = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyB->id])
            ->get('/payroll');

        $responseB->assertStatus(200);
        // Ensure no periods from Company A leak to Company B
        $periodsInB = PayrollPeriod::where('company_id', $this->companyB->id)->get();
        $this->assertCount(0, $periodsInB);
    }

    public function test_user_can_view_and_download_payslip(): void
    {
        $period = PayrollPeriod::create([
            'company_id' => $this->companyA->id,
            'name' => 'Payroll Nov 2026',
            'month' => 11,
            'year' => 2026,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-30',
            'payment_date' => '2026-11-25',
            'status' => 'finalized',
        ]);

        $item = PayrollItem::create([
            'company_id' => $this->companyA->id,
            'payroll_period_id' => $period->id,
            'employee_id' => $this->employeeA->id,
            'gaji_pokok' => 10000000,
            'tunjangan_tetap' => 1000000,
            'penghasilan_bruto' => 11000000,
            'pph21' => 220000,
            'total_potongan' => 700000,
            'take_home_pay' => 10300000,
            'ptkp_status' => 'TK/0',
            'ter_category' => 'A',
            'ter_rate' => 2.0,
            'payment_status' => 'paid',
        ]);

        // 1. View slips index
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/payroll/slips');
        $response->assertStatus(200);

        // 2. View printable / downloadable slip
        $slipResponse = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get("/payroll/slips/{$item->id}/print");
        $slipResponse->assertStatus(200);
        $slipResponse->assertSee('SLIP GAJI KARYAWAN');
        $slipResponse->assertSee('Budi Santoso');
    }

    public function test_user_can_export_bank_batch_files(): void
    {
        $period = PayrollPeriod::create([
            'company_id' => $this->companyA->id,
            'name' => 'Payroll Nov 2026',
            'month' => 11,
            'year' => 2026,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-30',
            'payment_date' => '2026-11-25',
            'status' => 'finalized',
        ]);

        PayrollItem::create([
            'company_id' => $this->companyA->id,
            'payroll_period_id' => $period->id,
            'employee_id' => $this->employeeA->id,
            'gaji_pokok' => 10000000,
            'penghasilan_bruto' => 10000000,
            'take_home_pay' => 9300000,
            'payment_status' => 'unpaid',
        ]);

        // Access Export page
        $exportPage = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/payroll/export');
        $exportPage->assertStatus(200);

        // Download all 9 Indonesian bank batch formats
        foreach (['BCA', 'MANDIRI', 'BRI', 'BNI', 'BSI', 'CIMB', 'PERMATA', 'DANAMON', 'BTN'] as $bankCode) {
            $bankExport = $this->actingAs($this->user)
                ->withSession(['active_company_id' => $this->companyA->id])
                ->post('/payroll/export/bank', [
                    'payroll_period_id' => $period->id,
                    'bank_format' => $bankCode,
                ]);
            $bankExport->assertStatus(200);
            $this->assertStringContainsString('1234567890', $bankExport->streamedContent());
        }

        // Unsupported bank format rejected by strict allowlist
        $invalidBank = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post('/payroll/export/bank', [
                'payroll_period_id' => $period->id,
                'bank_format' => 'UNKNOWN_BANK',
            ]);
        $invalidBank->assertSessionHasErrors('bank_format');
    }

    public function test_bank_export_neutralizes_csv_formula_injection(): void
    {
        $this->employeeA->update([
            'nama_lengkap' => '=CMD|\' /C calc\'!A0',
        ]);

        $period = PayrollPeriod::create([
            'company_id' => $this->companyA->id,
            'name' => 'Payroll Nov 2026',
            'month' => 11,
            'year' => 2026,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-30',
            'payment_date' => '2026-11-25',
            'status' => 'finalized',
        ]);

        PayrollItem::create([
            'company_id' => $this->companyA->id,
            'payroll_period_id' => $period->id,
            'employee_id' => $this->employeeA->id,
            'gaji_pokok' => 10000000,
            'penghasilan_bruto' => 10000000,
            'take_home_pay' => 9300000,
            'payment_status' => 'unpaid',
        ]);

        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post('/payroll/export/bank', [
                'payroll_period_id' => $period->id,
                'bank_format' => 'BSI',
            ]);

        $response->assertStatus(200);
        $content = $response->streamedContent();
        $this->assertStringContainsString("\"'=CMD", $content);
    }
}
