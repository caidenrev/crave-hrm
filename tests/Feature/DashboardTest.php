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
}
