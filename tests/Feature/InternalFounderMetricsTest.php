<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Employee;
use App\Models\SubscriptionInvoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InternalFounderMetricsTest extends TestCase
{
    use RefreshDatabase;

    public function test_cannot_access_internal_metrics_without_secret(): void
    {
        $response = $this->getJson('/api/v1/internal/founder-stats');

        $response->assertStatus(401);
        $response->assertJson([
            'success' => false,
            'error' => 'Unauthorized: Invalid or missing internal secret key.',
        ]);
    }

    public function test_cannot_access_internal_metrics_with_invalid_secret(): void
    {
        $response = $this->withHeaders([
            'X-Crave-Internal-Key' => 'wrong_secret_123',
        ])->getJson('/api/v1/internal/founder-stats');

        $response->assertStatus(401);
    }

    public function test_can_access_internal_metrics_with_valid_header(): void
    {
        $secret = config('services.crave_internal.secret');

        $response = $this->withHeaders([
            'X-Crave-Internal-Key' => $secret,
        ])->getJson('/api/v1/internal/founder-stats');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'product',
            'timestamp',
            'kpi' => [
                'mrr',
                'annual_mrr',
                'revenue_total',
                'revenue_period',
                'total_companies',
                'active_companies',
                'trial_companies',
                'total_employees',
                'total_users',
                'attendance_today',
            ],
            'daily',
            'feed',
            'companies',
            'invoices',
        ]);

        $response->assertHeader('Access-Control-Allow-Origin', '*');
    }

    public function test_can_access_internal_metrics_with_bearer_token(): void
    {
        $secret = config('services.crave_internal.secret');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $secret,
        ])->getJson('/api/v1/internal/founder-stats');

        $response->assertStatus(200);
        $response->assertJsonPath('product', 'crave_hrm');
    }

    public function test_handles_cors_preflight_options(): void
    {
        $response = $this->call('OPTIONS', '/api/v1/internal/founder-stats');

        $response->assertStatus(204);
        $response->assertHeader('Access-Control-Allow-Origin', '*');
        $response->assertHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    }
}
