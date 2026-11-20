<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Employee;
use App\Models\PerformanceReview;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Task13PerformanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_access_performance_page_and_view_radar_data(): void
    {
        $company = Company::create([
            'name' => 'Crave Global Group',
            'slug' => 'crave-global-group',
            'is_holding' => true,
        ]);
        $user = User::factory()->create();
        $user->companies()->attach($company->id, ['role' => 'super_admin', 'is_primary' => true]);

        $employee = Employee::create([
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
            ->get('/performance');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Performance/Index')
            ->has('metrics')
            ->has('radarData')
            ->has('reviewsAboutMe')
        );
    }

    public function test_user_can_submit_360_performance_evaluation(): void
    {
        $company = Company::create([
            'name' => 'Crave Global Group',
            'slug' => 'crave-global-group',
            'is_holding' => true,
        ]);
        $user = User::factory()->create();
        $user->companies()->attach($company->id, ['role' => 'super_admin', 'is_primary' => true]);

        $employee1 = Employee::create([
            'company_id' => $company->id,
            'user_id' => $user->id,
            'nik' => 'HLD-001',
            'nama_lengkap' => 'Eka Revandi',
            'email' => $user->email,
            'tanggal_masuk' => '2022-01-01',
            'is_active' => true,
            'gaji_pokok' => 45000000,
        ]);

        $employee2 = Employee::create([
            'company_id' => $company->id,
            'nik' => 'HLD-002',
            'nama_lengkap' => 'Aufa Dev',
            'email' => 'aufa@craveservices.my.id',
            'tanggal_masuk' => '2023-01-01',
            'is_active' => true,
            'gaji_pokok' => 20000000,
        ]);

        $response = $this->actingAs($user)
            ->withSession(['active_company_id' => $company->id])
            ->post('/performance/evaluate', [
                'employee_id' => $employee2->id,
                'reviewer_type' => 'peer',
                'score_technical' => 5,
                'score_communication' => 4,
                'score_initiative' => 5,
                'score_problem_solving' => 4,
                'score_integrity' => 5,
                'strengths' => 'Sangat cepat mengeksekusi UI React 19 dan komponen Shadcn.',
                'improvements' => 'Pertahankan konsistensi dokumentasi.',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('performance_reviews', [
            'company_id' => $company->id,
            'employee_id' => $employee2->id,
            'status' => 'completed',
            'score_technical' => 5,
            'score_integrity' => 5,
        ]);
    }
}
