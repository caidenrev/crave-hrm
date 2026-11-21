<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\SubscriptionInvoice;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Services\MidtransService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FounderConsoleTest extends TestCase
{
    use RefreshDatabase;

    protected User $founder;
    protected User $regularHr;
    protected User $regularStaff;
    protected Company $company;

    protected function setUp(): void
    {
        parent::setUp();

        // Create Founder User
        $this->founder = User::factory()->create([
            'name' => 'Eka Revandi',
            'email' => 'founder@craveservices.my.id',
            'password' => bcrypt('password123'),
        ]);

        // Create Tenant Company
        $this->company = Company::create([
            'name' => 'PT Crave Retail Nusantara',
            'slug' => 'crave-retail',
            'email' => 'admin@craveretail.id',
            'is_active' => true,
            'subscription_status' => 'trial',
            'trial_ends_at' => now()->addDays(14),
            'max_employees' => 50,
        ]);

        // Attach founder as super_admin
        $this->founder->companies()->attach($this->company->id, [
            'role' => 'super_admin',
            'is_primary' => true,
        ]);

        // Regular HR Admin
        $this->regularHr = User::factory()->create([
            'name' => 'HR Manager',
            'email' => 'hr@craveretail.id',
        ]);
        $this->regularHr->companies()->attach($this->company->id, [
            'role' => 'hr_admin',
            'is_primary' => true,
        ]);

        // Regular Employee
        $this->regularStaff = User::factory()->create([
            'name' => 'Staf Operasional',
            'email' => 'staf@craveretail.id',
        ]);
        $this->regularStaff->companies()->attach($this->company->id, [
            'role' => 'employee',
            'is_primary' => true,
        ]);
    }

    public function test_non_founder_cannot_access_founder_console(): void
    {
        $response = $this->actingAs($this->regularHr)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/founder');

        $response->assertStatus(403);
    }

    public function test_founder_can_access_overview_companies_invoices_and_settings(): void
    {
        // 1. Overview
        $this->actingAs($this->founder)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/founder')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Founder/Index'));

        // 2. Companies list
        $this->actingAs($this->founder)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/founder/companies')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Founder/Companies'));

        // 3. Invoices list
        $this->actingAs($this->founder)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/founder/invoices')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Founder/Invoices'));

        // 4. Settings
        $this->actingAs($this->founder)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/founder/settings')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Founder/Settings'));
    }

    public function test_founder_can_suspend_and_unsuspend_company(): void
    {
        // Suspend
        $response = $this->actingAs($this->founder)
            ->withSession(['active_company_id' => $this->company->id])
            ->post("/founder/companies/{$this->company->id}/subscription", [
                'action' => 'suspend',
                'reason' => 'Pelanggaran ketentuan penggunaan trial.',
                'note' => 'Ditangguhkan 20 Nov',
            ]);

        $response->assertSessionHas('success');
        $this->company->refresh();
        $this->assertEquals('suspended', $this->company->subscription_status);
        $this->assertNotNull($this->company->suspended_at);
        $this->assertEquals('Pelanggaran ketentuan penggunaan trial.', $this->company->suspended_reason);

        // Unsuspend
        $response = $this->actingAs($this->founder)
            ->withSession(['active_company_id' => $this->company->id])
            ->post("/founder/companies/{$this->company->id}/subscription", [
                'action' => 'unsuspend',
                'note' => 'Diaktifkan kembali setelah verifikasi',
            ]);

        $response->assertSessionHas('success');
        $this->company->refresh();
        $this->assertNotEquals('suspended', $this->company->subscription_status);
        $this->assertNull($this->company->suspended_at);
    }

    public function test_suspended_company_is_blocked_from_hrm_modules(): void
    {
        // Suspend company
        $this->company->update([
            'subscription_status' => 'suspended',
            'suspended_at' => now(),
            'suspended_reason' => 'Akses ditangguhkan',
        ]);

        // Regular HR visits attendance
        $response = $this->actingAs($this->regularHr)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/attendance');

        // Should be redirected to /subscription/suspended
        $response->assertRedirect(route('subscription.suspended'));

        // Suspended page is viewable
        $this->actingAs($this->regularHr)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/subscription/suspended')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Subscription/Suspended'));

        // Whitelisted route (profile, logout, subscription) should remain accessible
        $this->actingAs($this->regularHr)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/subscription')
            ->assertOk();
    }

    public function test_founder_can_extend_trial_and_add_manual_months(): void
    {
        // 1. Extend trial by 10 days
        $this->actingAs($this->founder)
            ->withSession(['active_company_id' => $this->company->id])
            ->post("/founder/companies/{$this->company->id}/subscription", [
                'action' => 'extend_trial',
                'value' => 10,
                'note' => 'Bonus trial demo',
            ]);

        $this->company->refresh();
        $this->assertEquals('trial', $this->company->subscription_status);
        $this->assertTrue($this->company->trial_ends_at->isAfter(now()->addDays(20)));

        // 2. Add 6 months manual activation
        $this->actingAs($this->founder)
            ->withSession(['active_company_id' => $this->company->id])
            ->post("/founder/companies/{$this->company->id}/subscription", [
                'action' => 'add_months',
                'value' => 6,
                'note' => 'Aktivasi transfer bank direct',
            ]);

        $this->company->refresh();
        $this->assertEquals('active', $this->company->subscription_status);
        $this->assertNotNull($this->company->current_period_end);
        $this->assertTrue($this->company->current_period_end->isAfter(now()->addMonths(5)));

        // Check manual invoice created
        $this->assertDatabaseHas('subscription_invoices', [
            'company_id' => $this->company->id,
            'source' => 'manual',
            'status' => 'paid',
            'months' => 6,
        ]);
    }

    public function test_midtrans_simulation_and_webhook(): void
    {
        // 1. Create checkout invoice
        $orderId = 'CRV-TEST-' . uniqid();
        $invoice = SubscriptionInvoice::create([
            'company_id' => $this->company->id,
            'user_id' => $this->regularHr->id,
            'order_id' => $orderId,
            'plan_name' => 'Paket 1 Bulan',
            'months' => 1,
            'amount' => 299000,
            'status' => 'pending',
            'source' => 'midtrans',
        ]);

        // 2. Simulate Midtrans IPN settlement notification
        $response = $this->postJson('/midtrans/webhook', [
            'order_id' => $orderId,
            'transaction_status' => 'settlement',
            'gross_amount' => '299000',
            'payment_type' => 'qris',
            'transaction_time' => now()->toDateTimeString(),
        ]);

        $response->assertOk();

        // 3. Verify invoice is paid and company is active
        $invoice->refresh();
        $this->assertEquals('paid', $invoice->status);
        $this->assertNotNull($invoice->paid_at);

        $this->company->refresh();
        $this->assertEquals('active', $this->company->subscription_status);
        $this->assertNotNull($this->company->current_period_end);
    }

    public function test_user_can_cancel_pending_subscription_invoice(): void
    {
        $orderId = 'CRV-TEST-CANCEL-' . uniqid();
        $invoice = SubscriptionInvoice::create([
            'company_id' => $this->company->id,
            'user_id' => $this->regularHr->id,
            'order_id' => $orderId,
            'plan_name' => 'Paket 1 Bulan',
            'months' => 1,
            'amount' => 299000,
            'status' => 'pending',
            'source' => 'midtrans',
        ]);

        $response = $this->actingAs($this->regularHr)
            ->withSession(['active_company_id' => $this->company->id])
            ->post('/subscription/cancel-invoice', [
                'order_id' => $orderId,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $invoice->refresh();
        $this->assertEquals('cancelled', $invoice->status);
    }
}
