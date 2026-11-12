<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\Branch;
use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\Holiday;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Task6MasterDataTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Company $companyA;
    protected Company $companyB;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $this->companyA = Company::create([
            'name' => 'PT Crave Nusantara',
            'slug' => 'pt-crave-nusantara',
        ]);

        $this->companyB = Company::create([
            'name' => 'PT Crave Kuliner',
            'slug' => 'pt-crave-kuliner',
        ]);

        $this->user->companies()->attach($this->companyA->id, ['role' => 'company_admin', 'is_primary' => true]);
        $this->user->companies()->attach($this->companyB->id, ['role' => 'company_admin', 'is_primary' => false]);
    }

    public function test_user_can_view_announcements_page(): void
    {
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/announcements');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Announcements/Index'));
    }

    public function test_user_can_create_announcement_and_scoped_to_active_company(): void
    {
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post('/announcements', [
                'title' => 'Pengumuman Penting Operasional',
                'content' => 'Seluruh cabang diwajibkan memeriksa parameter geofence.',
                'category' => 'policy',
                'priority' => 'urgent',
                'is_pinned' => true,
                'published_at' => '2026-11-12',
            ]);

        $response->assertRedirect();

        $announcement = Announcement::where('title', 'Pengumuman Penting Operasional')->first();
        $this->assertNotNull($announcement);
        $this->assertEquals($this->companyA->id, $announcement->company_id);
        $this->assertTrue($announcement->is_pinned);
    }

    public function test_announcement_isolation_between_companies(): void
    {
        // Create in Company A
        Announcement::create([
            'company_id' => $this->companyA->id,
            'title' => 'Khusus PT Crave Nusantara',
            'content' => 'Informasi rahasia internal PT Crave Nusantara.',
            'category' => 'general',
            'priority' => 'normal',
        ]);

        // Query when active session is Company B
        session(['active_company_id' => $this->companyB->id]);
        $visibleInB = Announcement::where('title', 'Khusus PT Crave Nusantara')->count();

        $this->assertEquals(0, $visibleInB, 'Data pengumuman tidak boleh bocor ke perusahaan lain.');

        // Query when active session is Company A
        session(['active_company_id' => $this->companyA->id]);
        $visibleInA = Announcement::where('title', 'Khusus PT Crave Nusantara')->count();

        $this->assertEquals(1, $visibleInA);
    }

    public function test_user_can_view_calendar_holidays(): void
    {
        Holiday::create([
            'name' => 'Tahun Baru 2026 Masehi',
            'date' => '2026-01-01',
            'type' => 'national',
            'company_id' => null,
        ]);

        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/calendar?year=2026');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Calendar/HolidayCalendar'));
    }

    public function test_user_can_create_company_specific_holiday(): void
    {
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post('/calendar', [
                'name' => 'Family Gathering PT Crave Nusantara',
                'date' => '2026-12-10',
                'type' => 'company_holiday',
                'description' => 'Acara tahunan keluarga karyawan',
            ]);

        $response->assertRedirect();

        $holiday = Holiday::where('name', 'Family Gathering PT Crave Nusantara')->first();
        $this->assertNotNull($holiday);
        $this->assertEquals($this->companyA->id, $holiday->company_id);
    }

    public function test_user_can_manage_branches_and_geofence(): void
    {
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post('/organization/branches', [
                'name' => 'Cabang Sudirman Central',
                'code' => 'SDR-01',
                'address' => 'Jl. Jenderal Sudirman Kav 50, Jakarta Selatan',
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'radius_meters' => 150,
                'office_ips' => ['182.253.110.2', '114.124.90.15'],
                'is_active' => true,
            ]);

        $response->assertRedirect();

        $branch = Branch::where('code', 'SDR-01')->first();
        $this->assertNotNull($branch);
        $this->assertEquals($this->companyA->id, $branch->company_id);
        $this->assertEquals(150, $branch->radius_meters);
        $this->assertCount(2, $branch->office_ips);
    }

    public function test_user_can_view_organization_chart(): void
    {
        $dept = Department::create([
            'company_id' => $this->companyA->id,
            'name' => 'Technology & Product',
            'code' => 'TECH',
        ]);

        $desig = Designation::create([
            'company_id' => $this->companyA->id,
            'department_id' => $dept->id,
            'title' => 'Lead Software Engineer',
            'level' => 'Lead',
        ]);

        Employee::create([
            'company_id' => $this->companyA->id,
            'department_id' => $dept->id,
            'designation_id' => $desig->id,
            'user_id' => $this->user->id,
            'nik' => '3171012345670001',
            'nama_lengkap' => 'Aufa Developer',
            'email' => 'aufa@craveservices.my.id',
            'tanggal_masuk' => '2024-01-01',
            'status_kerja' => 'tetap',
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/organization/chart');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Organization/OrgChart'));
    }
}
