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

    public function test_user_can_filter_organization_chart_by_branch(): void
    {
        $branch1 = Branch::create(['company_id' => $this->companyA->id, 'name' => 'HQ Sudirman', 'code' => 'HQ-01']);
        $branch2 = Branch::create(['company_id' => $this->companyA->id, 'name' => 'Cabang Bandung', 'code' => 'BDG-01']);

        $dept = Department::create(['company_id' => $this->companyA->id, 'name' => 'Operations', 'code' => 'OPS']);
        $desig = Designation::create(['company_id' => $this->companyA->id, 'department_id' => $dept->id, 'title' => 'Manager']);

        Employee::create([
            'company_id' => $this->companyA->id,
            'department_id' => $dept->id,
            'designation_id' => $desig->id,
            'branch_id' => $branch1->id,
            'nik' => '3271012345670001',
            'nama_lengkap' => 'Staff Sudirman',
            'email' => 'sdr@crave.id',
            'tanggal_masuk' => '2024-01-01',
            'is_active' => true,
        ]);

        Employee::create([
            'company_id' => $this->companyA->id,
            'department_id' => $dept->id,
            'designation_id' => $desig->id,
            'branch_id' => $branch2->id,
            'nik' => '3271012345670002',
            'nama_lengkap' => 'Staff Bandung',
            'email' => 'bdg@crave.id',
            'tanggal_masuk' => '2024-01-01',
            'is_active' => true,
        ]);

        // Filter by Branch 1 (Sudirman)
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get("/organization/chart?branch_id={$branch1->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Organization/OrgChart')
                ->where('selectedBranchId', (string) $branch1->id)
                ->has('departments.0.employees', 1)
        );
    }

    public function test_user_can_update_employee_organization_placement(): void
    {
        $branch = Branch::create(['company_id' => $this->companyA->id, 'name' => 'Cabang Surabaya', 'code' => 'SBY-01']);
        $dept1 = Department::create(['company_id' => $this->companyA->id, 'name' => 'Finance', 'code' => 'FIN']);
        $dept2 = Department::create(['company_id' => $this->companyA->id, 'name' => 'Human Resource', 'code' => 'HR']);
        $desig = Designation::create(['company_id' => $this->companyA->id, 'department_id' => $dept2->id, 'title' => 'HR Specialist']);

        $emp = Employee::create([
            'company_id' => $this->companyA->id,
            'department_id' => $dept1->id,
            'designation_id' => $desig->id,
            'nik' => '3571012345670001',
            'nama_lengkap' => 'Karyawan Pindahan',
            'email' => 'pindah@crave.id',
            'tanggal_masuk' => '2024-01-01',
            'is_active' => true,
        ]);

        // Reassign to Dept 2 and Branch
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->patch("/organization/chart/placement/{$emp->id}", [
                'department_id' => $dept2->id,
                'designation_id' => $desig->id,
                'branch_id' => $branch->id,
            ]);

        $response->assertRedirect();

        $emp->refresh();
        $this->assertEquals($dept2->id, $emp->department_id);
        $this->assertEquals($branch->id, $emp->branch_id);
    }

    public function test_user_can_create_new_department_from_org_chart(): void
    {
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post('/organization/chart/departments', [
                'name' => 'Data & Artificial Intelligence',
                'code' => 'DATA',
                'description' => 'Divisi analitik data dan inovasi AI',
            ]);

        $response->assertRedirect();

        $dept = Department::where('code', 'DATA')->first();
        $this->assertNotNull($dept);
        $this->assertEquals($this->companyA->id, $dept->company_id);
    }
}
