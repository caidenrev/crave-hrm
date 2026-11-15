<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LandingTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_visiting_root_sees_landing_page(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Landing/Index')
            ->has('stats')
        );
    }

    public function test_anyone_can_view_explicit_landing_route(): void
    {
        $response = $this->get('/landing');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Landing/Index')
        );
    }

    public function test_authenticated_user_visiting_root_sees_landing_page(): void
    {
        $company = Company::create([
            'name' => 'Crave Global Group',
            'slug' => 'crave-global-group',
            'is_holding' => true,
        ]);
        $user = User::factory()->create();
        $user->companies()->attach($company->id, ['role' => 'super_admin', 'is_primary' => true]);

        $response = $this->actingAs($user)
            ->withSession(['active_company_id' => $company->id])
            ->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Landing/Index')
        );
    }

    public function test_user_can_access_dashboard_path(): void
    {
        $company = Company::create([
            'name' => 'Crave Global Group',
            'slug' => 'crave-global-group',
            'is_holding' => true,
        ]);
        $user = User::factory()->create();
        $user->companies()->attach($company->id, ['role' => 'super_admin', 'is_primary' => true]);

        $response = $this->actingAs($user)
            ->withSession(['active_company_id' => $company->id])
            ->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
        );
    }
}
