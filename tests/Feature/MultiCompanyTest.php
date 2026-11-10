<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MultiCompanyTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_switch_active_company(): void
    {
        $user = User::factory()->create();

        $companyA = Company::create([
            'name' => 'PT Crave Alfa',
            'slug' => 'pt-crave-alfa',
        ]);

        $companyB = Company::create([
            'name' => 'PT Crave Beta',
            'slug' => 'pt-crave-beta',
        ]);

        $user->companies()->attach($companyA->id, ['role' => 'company_admin', 'is_primary' => true]);
        $user->companies()->attach($companyB->id, ['role' => 'employee', 'is_primary' => false]);

        // Login as user
        $response = $this->actingAs($user)->post('/company/switch', [
            'company_id' => $companyB->id,
        ]);

        $response->assertSessionHas('active_company_id', $companyB->id);
        $this->assertEquals($companyB->id, $user->fresh()->currentCompany()->id);
        $this->assertEquals('employee', $user->fresh()->currentRole());
    }

    public function test_user_cannot_switch_to_unauthorized_company(): void
    {
        $user = User::factory()->create();

        $companyA = Company::create([
            'name' => 'PT Crave Alfa',
            'slug' => 'pt-crave-alfa',
        ]);

        $companyC = Company::create([
            'name' => 'PT Rahasia Lain',
            'slug' => 'pt-rahasia-lain',
        ]);

        $user->companies()->attach($companyA->id, ['role' => 'company_admin', 'is_primary' => true]);

        $response = $this->actingAs($user)->post('/company/switch', [
            'company_id' => $companyC->id,
        ]);

        $response->assertSessionHas('error');
        $this->assertNotEquals($companyC->id, session('active_company_id'));
    }
}
