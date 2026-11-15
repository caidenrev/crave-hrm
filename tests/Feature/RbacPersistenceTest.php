<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\RolePermission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RbacPersistenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_load_rbac_matrix_page(): void
    {
        $company = Company::create([
            'name' => 'Crave Global Group',
            'slug' => 'crave-global-group',
            'is_holding' => true,
        ]);
        $user = User::factory()->create();
        $user->companies()->attach($company->id, ['role' => 'super_admin']);

        $response = $this->actingAs($user)
            ->withSession(['active_company_id' => $company->id])
            ->get('/organization/rbac-matrix');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Organization/RbacMatrix')
            ->has('roles')
            ->has('modules')
        );
    }

    public function test_can_persist_rbac_matrix_changes(): void
    {
        $company = Company::create([
            'name' => 'Crave Global Group',
            'slug' => 'crave-global-group',
            'is_holding' => true,
        ]);
        $user = User::factory()->create();
        $user->companies()->attach($company->id, ['role' => 'super_admin']);

        $payload = [
            'matrix' => [
                'attendance.manage' => [
                    'super_admin' => true,
                    'company_admin' => true,
                    'branch_manager' => false, // toggled to false
                    'finance' => true, // toggled to true
                    'employee' => false,
                ],
            ],
        ];

        $response = $this->actingAs($user)
            ->withSession(['active_company_id' => $company->id])
            ->post('/organization/rbac-matrix', $payload);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('role_permissions', [
            'company_id' => $company->id,
            'role' => 'branch_manager',
            'permission_key' => 'attendance.manage',
            'is_allowed' => false,
        ]);

        $this->assertDatabaseHas('role_permissions', [
            'company_id' => $company->id,
            'role' => 'finance',
            'permission_key' => 'attendance.manage',
            'is_allowed' => true,
        ]);
    }
}
