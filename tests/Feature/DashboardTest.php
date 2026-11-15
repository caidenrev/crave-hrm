<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_managerial_dashboard(): void
    {
        $company = Company::create([
            'name' => 'Crave Global Group',
            'slug' => 'crave-global-group',
            'is_holding' => true,
        ]);
        $user = User::factory()->create();
        $user->companies()->attach($company->id, ['role' => 'super_admin', 'is_primary' => true]);

        Employee::create([
            'company_id' => $company->id,
            'user_id' => $user->id,
            'nik' => 'HLD-001',
            'nama_lengkap' => 'Eka Revandi',
            'email' => $user->email,
            'tanggal_masuk' => '2022-01-01',
            'is_active' => true,
            'gaji_pokok' => 45000000,
        ]);

        $response = $this->actingAs($user)
            ->withSession(['active_company_id' => $company->id])
            ->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('isManagerial', true)
            ->has('metrics')
            ->has('attendanceWeekly')
            ->has('departmentShare')
            ->has('recentAttendances')
        );
    }

    public function test_employee_can_view_self_service_dashboard(): void
    {
        $company = Company::create([
            'name' => 'Crave Global Group',
            'slug' => 'crave-global-group',
            'is_holding' => true,
        ]);
        $user = User::factory()->create();
        $user->companies()->attach($company->id, ['role' => 'employee', 'is_primary' => true]);

        Employee::create([
            'company_id' => $company->id,
            'user_id' => $user->id,
            'nik' => 'EMP-001',
            'nama_lengkap' => 'Staff Biasa',
            'email' => $user->email,
            'tanggal_masuk' => '2023-01-01',
            'is_active' => true,
            'gaji_pokok' => 8000000,
        ]);

        $response = $this->actingAs($user)
            ->withSession(['active_company_id' => $company->id])
            ->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('isManagerial', false)
            ->has('employeeSelfService')
        );
    }

    public function test_dashboard_loads_cleanly_with_payroll_data(): void
    {
        $company = Company::create([
            'name' => 'Crave Global Group',
            'slug' => 'crave-global-group',
            'is_holding' => true,
        ]);
        $user = User::factory()->create();
        $user->companies()->attach($company->id, ['role' => 'employee', 'is_primary' => true]);

        $employee = Employee::create([
            'company_id' => $company->id,
            'user_id' => $user->id,
            'nik' => 'EMP-002',
            'nama_lengkap' => 'Staff Biasa 2',
            'email' => $user->email,
            'tanggal_masuk' => '2023-01-01',
            'is_active' => true,
            'gaji_pokok' => 9000000,
        ]);

        $period = \App\Models\PayrollPeriod::create([
            'company_id' => $company->id,
            'name' => 'Payroll November 2026',
            'month' => 11,
            'year' => 2026,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-30',
            'payment_date' => '2026-11-25',
            'status' => 'finalized',
        ]);

        \App\Models\PayrollItem::create([
            'company_id' => $company->id,
            'payroll_period_id' => $period->id,
            'employee_id' => $employee->id,
            'gaji_pokok' => 9000000,
            'penghasilan_bruto' => 9000000,
            'take_home_pay' => 8500000,
            'payment_status' => 'paid',
        ]);

        $response = $this->actingAs($user)
            ->withSession(['active_company_id' => $company->id])
            ->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('employeeSelfService.latestPayslip.id', fn ($id) => !empty($id))
        );
    }
}
