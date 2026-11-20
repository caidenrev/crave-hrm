<?php

namespace Tests\Feature;

use App\Models\SalesLead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactSalesTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_access_contact_sales_page(): void
    {
        $response = $this->get('/contact-sales');
        $response->assertStatus(200);
    }

    public function test_can_submit_contact_sales_form_successfully(): void
    {
        $payload = [
            'name' => 'John Doe',
            'company_name' => 'PT Maju Bersama',
            'work_email' => 'john@majubersama.com',
            'phone' => '081234567890',
            'employee_count' => '21 - 50 Karyawan',
            'notes' => 'Tertarik implementasi payroll dan absensi GPS.',
        ];

        $response = $this->postJson('/contact-sales', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonPath('message', fn ($msg) => str_contains($msg, 'John Doe') && str_contains($msg, 'PT Maju Bersama'));

        $this->assertDatabaseHas('sales_leads', [
            'name' => 'John Doe',
            'company_name' => 'PT Maju Bersama',
            'work_email' => 'john@majubersama.com',
            'phone' => '081234567890',
            'status' => 'new',
        ]);
    }

    public function test_contact_sales_validation_errors(): void
    {
        $response = $this->postJson('/contact-sales', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'company_name', 'work_email', 'phone']);
    }

    public function test_non_founder_cannot_access_founder_leads(): void
    {
        $user = User::factory()->create([
            'email' => 'regular@company.com',
        ]);

        $response = $this->actingAs($user)->get('/founder/leads');
        $response->assertStatus(403);
    }

    public function test_founder_can_view_leads_dashboard(): void
    {
        $founder = User::factory()->create([
            'email' => 'founder@craveservices.my.id',
        ]);

        SalesLead::create([
            'name' => 'Budi Santoso',
            'company_name' => 'PT Sukses Mandiri',
            'work_email' => 'budi@sukses.com',
            'phone' => '081987654321',
            'employee_count' => '51 - 100 Karyawan',
            'status' => 'new',
        ]);

        $response = $this->actingAs($founder)->get('/founder/leads');

        $response->assertStatus(200);
    }

    public function test_founder_can_update_lead_status_and_notes(): void
    {
        $founder = User::factory()->create([
            'email' => 'founder@craveservices.my.id',
        ]);

        $lead = SalesLead::create([
            'name' => 'Dewi Lestari',
            'company_name' => 'CV Digital Kreasi',
            'work_email' => 'dewi@kreasi.id',
            'phone' => '081333444555',
            'status' => 'new',
        ]);

        $response = $this->actingAs($founder)->patchJson("/founder/leads/{$lead->id}", [
            'status' => 'contacted',
            'founder_notes' => 'Sudah ditelepon via WA, jadwal demo besok jam 14:00.',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('sales_leads', [
            'id' => $lead->id,
            'status' => 'contacted',
            'founder_notes' => 'Sudah ditelepon via WA, jadwal demo besok jam 14:00.',
        ]);

        $this->assertNotNull(SalesLead::find($lead->id)->contacted_at);
    }
}
