<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Employee;
use App\Models\PayrollItem;
use App\Models\PayrollPeriod;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RbacRoleEnforcementTest extends TestCase
{
    use RefreshDatabase;

    protected Company $company;
    protected User $superAdmin;
    protected User $hrAdmin;
    protected User $employeeUser;
    protected User $otherEmployeeUser;
    protected Employee $employee;
    protected Employee $otherEmployee;
    protected PayrollPeriod $period;
    protected PayrollItem $employeeSlip;
    protected PayrollItem $otherSlip;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Setup Company
        $this->company = Company::create([
            'name' => 'PT Crave Layanan Digital',
            'slug' => 'crave-layanan-digital',
            'is_holding' => false,
        ]);

        // 2. Super Admin
        $this->superAdmin = User::factory()->create([
            'name' => 'Eka Revandi',
            'email' => 'founder@craveservices.my.id',
        ]);
        $this->superAdmin->companies()->attach($this->company->id, ['role' => 'super_admin', 'is_primary' => true]);

        // 3. HR Admin
        $this->hrAdmin = User::factory()->create([
            'name' => 'Siti Rahmawati',
            'email' => 'siti.hr@craveservices.my.id',
        ]);
        $this->hrAdmin->companies()->attach($this->company->id, ['role' => 'hr_admin', 'is_primary' => true]);

        // 4. Staff Employee (Dewi)
        $this->employeeUser = User::factory()->create([
            'name' => 'Dewi Lestari',
            'email' => 'dewi.staff@craveservices.my.id',
        ]);
        $this->employeeUser->companies()->attach($this->company->id, ['role' => 'employee', 'is_primary' => true]);

        $this->employee = Employee::create([
            'company_id' => $this->company->id,
            'user_id' => $this->employeeUser->id,
            'nik' => 'CRV-STAFF-001',
            'nama_lengkap' => 'Dewi Lestari',
            'email' => $this->employeeUser->email,
            'tanggal_masuk' => '2024-01-01',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'TK/0',
            'gaji_pokok' => 8000000,
            'is_active' => true,
        ]);

        // 5. Another Staff Employee (Budi)
        $this->otherEmployeeUser = User::factory()->create([
            'name' => 'Budi Santoso',
            'email' => 'budi.santoso@craveservices.my.id',
        ]);
        $this->otherEmployeeUser->companies()->attach($this->company->id, ['role' => 'employee', 'is_primary' => true]);

        $this->otherEmployee = Employee::create([
            'company_id' => $this->company->id,
            'user_id' => $this->otherEmployeeUser->id,
            'nik' => 'CRV-STAFF-002',
            'nama_lengkap' => 'Budi Santoso',
            'email' => $this->otherEmployeeUser->email,
            'tanggal_masuk' => '2024-02-01',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'K/1',
            'gaji_pokok' => 9500000,
            'is_active' => true,
        ]);

        // 6. Setup Payroll Period & Slips
        $this->period = PayrollPeriod::create([
            'company_id' => $this->company->id,
            'name' => 'Payroll November 2026',
            'month' => 11,
            'year' => 2026,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-30',
            'payment_date' => '2026-11-25',
            'status' => 'finalized',
        ]);

        $this->employeeSlip = PayrollItem::create([
            'company_id' => $this->company->id,
            'payroll_period_id' => $this->period->id,
            'employee_id' => $this->employee->id,
            'gaji_pokok' => 8000000,
            'penghasilan_bruto' => 8000000,
            'pph21' => 160000,
            'total_potongan' => 320000,
            'take_home_pay' => 7680000,
        ]);

        $this->otherSlip = PayrollItem::create([
            'company_id' => $this->company->id,
            'payroll_period_id' => $this->period->id,
            'employee_id' => $this->otherEmployee->id,
            'gaji_pokok' => 9500000,
            'penghasilan_bruto' => 9500000,
            'pph21' => 190000,
            'total_potongan' => 380000,
            'take_home_pay' => 9120000,
        ]);
    }

    public function test_staff_employee_is_forbidden_from_administrative_modules(): void
    {
        // 1. Data Karyawan (Admin/HR only)
        $this->actingAs($this->employeeUser)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/employees')
            ->assertStatus(403);

        // 2. Proses Payroll (Admin/Finance only)
        $this->actingAs($this->employeeUser)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/payroll')
            ->assertStatus(403);

        // 3. Ekspor Bank & Rekap (Admin/Finance only)
        $this->actingAs($this->employeeUser)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/payroll/export')
            ->assertStatus(403);

        // 4. Matriks RBAC (Admin only)
        $this->actingAs($this->employeeUser)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/organization/rbac-matrix')
            ->assertStatus(403);

        // 5. Canteen Merchant Scanner (Admin/Merchant only)
        $this->actingAs($this->employeeUser)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/canteen/scanner')
            ->assertStatus(403);

        // 6. Canteen Vendor Settlement (Finance/Admin only)
        $this->actingAs($this->employeeUser)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/canteen/settlement')
            ->assertStatus(403);

        // 7. Persetujuan Cuti (Supervisor/HR/Admin only)
        $this->actingAs($this->employeeUser)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/leave/approvals')
            ->assertStatus(403);
    }

    public function test_staff_employee_can_only_view_and_print_own_payslip(): void
    {
        // Staff Dewi can access /payroll/slips
        $response = $this->actingAs($this->employeeUser)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/payroll/slips');

        $response->assertStatus(200);

        // Verify Dewi only sees 1 slip (her own), not Budi's slip
        $response->assertInertia(fn ($page) => $page
            ->component('Payroll/Slips')
            ->where('isStaff', true)
            ->where('stats.total_slips', 1)
            ->where('stats.total_paid', 7680000)
            ->has('items.data', 1)
            ->where('items.data.0.id', $this->employeeSlip->id)
        );

        // Dewi printing own payslip -> 200 OK
        $printOwn = $this->actingAs($this->employeeUser)
            ->withSession(['active_company_id' => $this->company->id])
            ->get("/payroll/slips/{$this->employeeSlip->id}/print");
        $printOwn->assertStatus(200);

        // Dewi attempting to print Budi's payslip -> 403 Forbidden
        $printOther = $this->actingAs($this->employeeUser)
            ->withSession(['active_company_id' => $this->company->id])
            ->get("/payroll/slips/{$this->otherSlip->id}/print");
        $printOther->assertStatus(403);
    }

    public function test_super_admin_has_unrestricted_access(): void
    {
        $this->actingAs($this->superAdmin)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/employees')
            ->assertStatus(200);

        $this->actingAs($this->superAdmin)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/payroll')
            ->assertStatus(200);

        $this->actingAs($this->superAdmin)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/organization/rbac-matrix')
            ->assertStatus(200);
    }

    public function test_hr_admin_can_access_hr_modules(): void
    {
        $this->actingAs($this->hrAdmin)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/employees')
            ->assertStatus(200);

        $this->actingAs($this->hrAdmin)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/leave/approvals')
            ->assertStatus(200);

        $this->actingAs($this->hrAdmin)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/recruitment')
            ->assertStatus(200);
    }
}
