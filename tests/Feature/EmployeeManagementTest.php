<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Company $companyA;
    private Company $companyB;
    private Department $deptA;
    private Designation $desA;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $this->companyA = Company::create([
            'name' => 'PT Crave Alfa',
            'slug' => 'pt-crave-alfa',
        ]);

        $this->companyB = Company::create([
            'name' => 'PT Crave Beta',
            'slug' => 'pt-crave-beta',
        ]);

        $this->user->companies()->attach($this->companyA->id, ['role' => 'company_admin', 'is_primary' => true]);
        $this->user->companies()->attach($this->companyB->id, ['role' => 'company_admin', 'is_primary' => false]);

        $this->deptA = Department::create([
            'company_id' => $this->companyA->id,
            'name' => 'Engineering',
            'code' => 'ENG',
        ]);

        $this->desA = Designation::create([
            'company_id' => $this->companyA->id,
            'department_id' => $this->deptA->id,
            'title' => 'Software Engineer',
            'level' => 'Staff',
        ]);
    }

    public function test_user_can_view_employee_list_with_active_company(): void
    {
        Employee::create([
            'company_id' => $this->companyA->id,
            'nik' => 'ALFA-001',
            'nama_lengkap' => 'Karyawan Alfa Satu',
            'email' => 'alfa1@craveservices.my.id',
            'tanggal_masuk' => '2024-01-01',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'TK/0',
            'bank_name' => 'BCA',
            'gaji_pokok' => 10000000,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/employees');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Employees/Index')
                ->has('employees.data', 1)
                ->where('employees.data.0.nik', 'ALFA-001')
        );
    }

    public function test_multi_company_employee_isolation(): void
    {
        // Employee in Company A
        Employee::create([
            'company_id' => $this->companyA->id,
            'nik' => 'ALFA-001',
            'nama_lengkap' => 'Karyawan Alfa Satu',
            'email' => 'alfa1@craveservices.my.id',
            'tanggal_masuk' => '2024-01-01',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'TK/0',
            'bank_name' => 'BCA',
            'gaji_pokok' => 10000000,
            'is_active' => true,
        ]);

        // Employee in Company B
        Employee::create([
            'company_id' => $this->companyB->id,
            'nik' => 'BETA-001',
            'nama_lengkap' => 'Karyawan Beta Rahasia',
            'email' => 'beta1@craveservices.my.id',
            'tanggal_masuk' => '2024-01-01',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'TK/0',
            'bank_name' => 'Mandiri',
            'gaji_pokok' => 15000000,
            'is_active' => true,
        ]);

        // When viewing as Company A, Company B's employee MUST NOT be visible
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/employees');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('employees.data', 1)
                ->where('employees.data.0.nik', 'ALFA-001')
        );

        // Switch to Company B
        $responseB = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyB->id])
            ->get('/employees');

        $responseB->assertStatus(200);
        $responseB->assertInertia(fn ($page) => 
            $page->has('employees.data', 1)
                ->where('employees.data.0.nik', 'BETA-001')
        );
    }

    public function test_can_toggle_employee_active_status(): void
    {
        $employee = Employee::create([
            'company_id' => $this->companyA->id,
            'nik' => 'ALFA-002',
            'nama_lengkap' => 'Budi Hermanto',
            'email' => 'budi@craveservices.my.id',
            'tanggal_masuk' => '2024-01-01',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'TK/0',
            'bank_name' => 'BCA',
            'gaji_pokok' => 12000000,
            'is_active' => true,
        ]);

        $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->patch("/employees/{$employee->id}/toggle-active");

        $this->assertFalse($employee->fresh()->is_active);

        // Toggle back to active
        $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->patch("/employees/{$employee->id}/toggle-active");

        $this->assertTrue($employee->fresh()->is_active);
    }

    public function test_can_store_new_employee(): void
    {
        $payload = [
            'nik' => 'ALFA-003',
            'nama_lengkap' => 'Citra Lestari',
            'email' => 'citra@craveservices.my.id',
            'nomor_telepon' => '081234567890',
            'tanggal_lahir' => '1998-05-20',
            'jenis_kelamin' => 'P',
            'tanggal_masuk' => '2024-02-01',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'TK/0',
            'bank_name' => 'BCA',
            'bank_account_number' => '8210984712',
            'gaji_pokok' => 15000000,
            'department_id' => $this->deptA->id,
            'designation_id' => $this->desA->id,
            'is_active' => true,
        ];

        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post('/employees', $payload);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('employees', [
            'company_id' => $this->companyA->id,
            'nik' => 'ALFA-003',
            'nama_lengkap' => 'Citra Lestari',
        ]);
    }

    public function test_can_access_rbac_matrix_page(): void
    {
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/organization/rbac-matrix');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Organization/RbacMatrix')
                ->has('roles', 5)
                ->has('modules', 5)
        );
    }
}
