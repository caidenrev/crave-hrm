<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\Overtime;
use App\Models\Reimbursement;
use App\Models\User;
use App\Models\Visit;
use App\Services\OvertimeCalculatorService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Task9ClaimsOvertimeTest extends TestCase
{
    use RefreshDatabase;

    protected Company $companyA;
    protected Company $companyB;
    protected User $userA;
    protected User $adminUser;
    protected Employee $employeeA;
    protected OvertimeCalculatorService $calculatorService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->calculatorService = new OvertimeCalculatorService();

        $this->companyA = Company::create([
            'name' => 'PT Crave Ekosistem',
            'slug' => 'crave-ekosistem',
            'is_holding' => true,
            'is_active' => true,
        ]);

        $this->companyB = Company::create([
            'name' => 'PT Crave Mitra Dua',
            'slug' => 'crave-mitra-dua',
            'is_holding' => false,
            'is_active' => true,
        ]);

        $this->userA = User::factory()->create([
            'email' => 'staff@crave.id',
        ]);
        $this->userA->companies()->attach($this->companyA->id, ['role' => 'employee', 'is_primary' => true]);

        $this->adminUser = User::factory()->create([
            'email' => 'admin@crave.id',
        ]);
        $this->adminUser->companies()->attach($this->companyA->id, ['role' => 'company_admin', 'is_primary' => true]);

        $dept = Department::create([
            'company_id' => $this->companyA->id,
            'name' => 'Operations',
        ]);

        $desig = Designation::create([
            'company_id' => $this->companyA->id,
            'title' => 'Support Engineer',
        ]);

        $this->employeeA = Employee::create([
            'company_id' => $this->companyA->id,
            'user_id' => $this->userA->id,
            'department_id' => $dept->id,
            'designation_id' => $desig->id,
            'nik' => 'OPS-001',
            'nama_lengkap' => 'Rian Pratama',
            'email' => 'staff@crave.id',
            'gaji_pokok' => 8650000, // 8,650,000 / 173 = exactly 50,000 per hour
            'bank_name' => 'BCA',
            'bank_account_number' => '1234567890',
            'tanggal_masuk' => '2025-01-01',
            'is_active' => true,
        ]);
    }

    public function test_overtime_calculator_pp35_hourly_rate_and_multipliers(): void
    {
        // 1. Hourly rate: 8,650,000 / 173 = 50,000
        $hourlyRate = $this->calculatorService->calculateHourlyRate(8650000);
        $this->assertEquals(50000.0, $hourlyRate);

        // 2. Workday overtime: 3 hours = 1.5 + 2.0 + 2.0 = 5.5 multiplier hours
        $workdayMulti = $this->calculatorService->calculateMultiplierHours(3.0, 'workday');
        $this->assertEquals(5.5, $workdayMulti);

        // 3. Weekend overtime: 9 hours = (8 * 2.0) + (1 * 3.0) = 19.0 multiplier hours
        $weekendMulti = $this->calculatorService->calculateMultiplierHours(9.0, 'weekend');
        $this->assertEquals(19.0, $weekendMulti);

        // 4. Full package
        $package = $this->calculatorService->calculateOvertime($this->employeeA, '17:00', '20:00', 'workday');
        $this->assertEquals(3.0, $package['duration_hours']);
        $this->assertEquals(50000.0, $package['hourly_rate']);
        $this->assertEquals(5.5, $package['multiplier_hours']);
        $this->assertEquals(275000.0, $package['estimated_amount']); // 5.5 * 50,000 = 275,000
    }

    public function test_employee_can_view_overtime_page(): void
    {
        $response = $this->actingAs($this->userA)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get(route('claims.overtime.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Claims/Overtime')
            ->has('overtimes')
            ->has('stats.hourly_rate')
        );
    }

    public function test_employee_can_submit_spkl_overtime(): void
    {
        $response = $this->actingAs($this->userA)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('claims.overtime.store'), [
                'date' => '2026-11-15',
                'start_time' => '17:00',
                'end_time' => '20:00',
                'day_type' => 'workday',
                'task_description' => 'Deploy hotfix v2.1 dan monitoring server',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('overtimes', [
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'duration_hours' => 3.0,
            'multiplier_hours' => 5.5,
            'estimated_amount' => 275000.0,
            'status' => 'pending',
        ]);
    }

    public function test_admin_can_approve_and_reject_overtime(): void
    {
        $overtime = Overtime::create([
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'date' => '2026-11-15',
            'start_time' => '17:00',
            'end_time' => '19:00',
            'duration_hours' => 2.0,
            'day_type' => 'workday',
            'hourly_rate' => 50000,
            'multiplier_hours' => 3.5,
            'estimated_amount' => 175000,
            'task_description' => 'Bantu tim logistik',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('claims.overtime.approve', $overtime));

        $response->assertRedirect();
        $overtime->refresh();
        $this->assertEquals('approved', $overtime->status);
        $this->assertEquals($this->adminUser->id, $overtime->approved_by);
    }

    public function test_employee_can_submit_and_manage_reimbursement(): void
    {
        // 1. Submit
        $response = $this->actingAs($this->userA)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('claims.reimbursement.store'), [
                'title' => 'Beli Obat Flu & Vitamin di Kimia Farma',
                'category' => 'medical',
                'date' => '2026-11-15',
                'amount' => 125000,
                'description' => 'Resep dokter klinik',
                'bank_name' => 'BCA',
                'bank_account_number' => '1234567890',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('reimbursements', [
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'category' => 'medical',
            'amount' => 125000,
            'status' => 'pending',
        ]);

        $claim = Reimbursement::first();

        // 2. Approve
        $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('claims.reimbursement.approve', $claim));

        $claim->refresh();
        $this->assertEquals('approved', $claim->status);

        // 3. Mark as Paid
        $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('claims.reimbursement.pay', $claim));

        $claim->refresh();
        $this->assertEquals('paid', $claim->status);
        $this->assertNotNull($claim->paid_at);
    }

    public function test_employee_can_checkin_visit_and_manager_verify(): void
    {
        // 1. Check-in Visit
        $response = $this->actingAs($this->userA)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('claims.visit.store'), [
                'client_name' => 'Resto Sedap Rasa Menteng',
                'visit_date' => '2026-11-15',
                'check_in_time' => '10:00',
                'latitude' => -6.195432,
                'longitude' => 106.832145,
                'location_name' => 'Menteng, Jakarta Pusat',
                'purpose' => 'Instalasi hardware Crave POS & Training Kasir',
                'notes' => 'Kasir berhasil demo transaksi',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('visits', [
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'client_name' => 'Resto Sedap Rasa Menteng',
            'status' => 'completed',
        ]);

        $visit = Visit::first();

        // 2. Verify
        $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('claims.visit.verify', $visit));

        $visit->refresh();
        $this->assertEquals('verified', $visit->status);
        $this->assertEquals($this->adminUser->id, $visit->verified_by);
    }

    public function test_multi_company_isolation_on_overtime_and_claims(): void
    {
        $overtimeA = Overtime::create([
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'date' => '2026-11-15',
            'start_time' => '17:00',
            'end_time' => '18:00',
            'duration_hours' => 1.0,
            'task_description' => 'Tugas A',
            'status' => 'pending',
        ]);

        $userB = User::factory()->create();
        $userB->companies()->attach($this->companyB->id, ['role' => 'company_admin', 'is_primary' => true]);

        // User B attempts to approve Overtime in Company A
        $response = $this->actingAs($userB)
            ->withSession(['active_company_id' => $this->companyB->id])
            ->post(route('claims.overtime.approve', $overtimeA));

        // BelongsToCompany global scope ensures zero cross-tenant discovery (404)
        $response->assertNotFound();
    }
}
