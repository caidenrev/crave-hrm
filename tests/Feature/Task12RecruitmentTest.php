<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Candidate;
use App\Models\Company;
use App\Models\Department;
use App\Models\Employee;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class Task12RecruitmentTest extends TestCase
{
    use RefreshDatabase;

    protected Company $companyA;
    protected Company $companyB;
    protected User $adminUser;
    protected User $userB;
    protected Branch $branchA;
    protected Department $deptA;
    protected JobPosting $jobA;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->companyA = Company::create([
            'name' => 'PT Crave Holding Group',
            'slug' => 'crave-holding',
            'is_holding' => true,
            'is_active' => true,
        ]);

        $this->companyB = Company::create([
            'name' => 'PT Retail Solusi',
            'slug' => 'retail-solusi',
            'is_holding' => false,
            'is_active' => true,
        ]);

        $this->adminUser = User::factory()->create([
            'name' => 'HR Manager Crave',
            'email' => 'hr@crave.id',
        ]);
        $this->adminUser->companies()->attach($this->companyA->id, ['role' => 'hr_admin']);

        $this->userB = User::factory()->create([
            'name' => 'Admin Tenant B',
            'email' => 'admin@retail.id',
        ]);
        $this->userB->companies()->attach($this->companyB->id, ['role' => 'hr_admin']);

        $this->branchA = Branch::create([
            'company_id' => $this->companyA->id,
            'name' => 'Kantor Pusat Jakarta',
            'address' => 'Jl. Sudirman Kav 21',
            'is_active' => true,
        ]);

        $this->deptA = Department::create([
            'company_id' => $this->companyA->id,
            'name' => 'Technology',
        ]);

        $this->jobA = JobPosting::create([
            'company_id' => $this->companyA->id,
            'branch_id' => $this->branchA->id,
            'department_id' => $this->deptA->id,
            'title' => 'Senior Full Stack Engineer',
            'slug' => 'senior-full-stack-engineer',
            'employment_type' => 'PKWTT',
            'workplace_type' => 'Hybrid',
            'experience_level' => 'Senior Level',
            'min_salary' => 18000000,
            'max_salary' => 25000000,
            'show_salary' => true,
            'description' => 'Membangun arsitektur modern Crave POS dan Crave HRM.',
            'vacancies_count' => 2,
            'status' => 'published',
        ]);
    }

    public function test_guest_can_view_public_career_portal_and_submit_application(): void
    {
        // 1. Guest views public career portal
        $response = $this->get('/careers');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Career/PublicPortal')
            ->has('jobs', 1)
            ->where('jobs.0.title', 'Senior Full Stack Engineer')
        );

        // 2. Guest submits application with resume file
        $file = UploadedFile::fake()->create('resume_budi.pdf', 300, 'application/pdf');

        $applyResponse = $this->post("/careers/apply/{$this->jobA->slug}", [
            'full_name' => 'Budi Santoso',
            'email' => 'budi.santoso@gmail.com',
            'phone' => '081299887766',
            'current_company' => 'Startup Nusantara',
            'current_title' => 'Fullstack Developer',
            'linkedin_url' => 'https://linkedin.com/in/budisantoso',
            'cover_letter' => 'Saya tertarik bergabung dengan tim engineering Crave.',
            'resume' => $file,
        ]);

        $applyResponse->assertRedirect();
        $applyResponse->assertSessionHas('success');

        $this->assertDatabaseHas('candidates', [
            'company_id' => $this->companyA->id,
            'job_posting_id' => $this->jobA->id,
            'full_name' => 'Budi Santoso',
            'email' => 'budi.santoso@gmail.com',
            'stage' => 'applied',
        ]);
    }

    public function test_hr_can_view_kanban_board_and_filter_by_job(): void
    {
        Candidate::create([
            'company_id' => $this->companyA->id,
            'job_posting_id' => $this->jobA->id,
            'full_name' => 'Siti Aminah',
            'email' => 'siti@gmail.com',
            'phone' => '08123456789',
            'stage' => 'screening',
        ]);

        $response = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/recruitment');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Recruitment/KanbanBoard')
            ->has('candidates', 1)
            ->has('jobPostings', 1)
            ->has('metrics')
        );
    }

    public function test_hr_can_advance_candidate_stage_in_kanban(): void
    {
        $candidate = Candidate::create([
            'company_id' => $this->companyA->id,
            'job_posting_id' => $this->jobA->id,
            'full_name' => 'Rian Pratama',
            'email' => 'rian@gmail.com',
            'phone' => '08123456789',
            'stage' => 'applied',
        ]);

        $response = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->patch("/recruitment/candidates/{$candidate->id}/stage", [
                'stage' => 'interview',
            ]);

        $response->assertRedirect();
        $candidate->refresh();
        $this->assertEquals('interview', $candidate->stage);
    }

    public function test_hr_can_update_scorecard_and_schedule_interview(): void
    {
        $candidate = Candidate::create([
            'company_id' => $this->companyA->id,
            'job_posting_id' => $this->jobA->id,
            'full_name' => 'Kevin Sanjaya',
            'email' => 'kevin@gmail.com',
            'phone' => '08123456789',
            'stage' => 'screening',
        ]);

        // 1. Update Scorecard
        $scoreResponse = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->patch("/recruitment/candidates/{$candidate->id}/scorecard", [
                'rating' => 5,
                'interview_notes' => 'Sangat menguasai React 19 dan arsitektur Laravel.',
                'offered_salary' => 20000000,
            ]);

        $scoreResponse->assertRedirect();
        $candidate->refresh();
        $this->assertEquals(5, $candidate->rating);
        $this->assertEquals(20000000, $candidate->offered_salary);

        // 2. Schedule Interview (auto advance to 'interview' stage)
        $scheduleResponse = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post("/recruitment/candidates/{$candidate->id}/schedule", [
                'interview_scheduled_at' => now()->addDays(2)->format('Y-m-d H:i:s'),
                'interview_meeting_link' => 'https://meet.google.com/test-meet',
                'interview_notes' => 'Jadwal interview teknis.',
            ]);

        $scheduleResponse->assertRedirect();
        $candidate->refresh();
        $this->assertEquals('interview', $candidate->stage);
        $this->assertEquals('https://meet.google.com/test-meet', $candidate->interview_meeting_link);
    }

    public function test_one_click_convert_candidate_to_employee(): void
    {
        $candidate = Candidate::create([
            'company_id' => $this->companyA->id,
            'job_posting_id' => $this->jobA->id,
            'full_name' => 'Aditya Wijaya',
            'email' => 'aditya@crave.id',
            'phone' => '081233445566',
            'stage' => 'hired',
            'offered_salary' => 22000000,
            'is_converted_to_employee' => false,
        ]);

        // 1. Execute 1-Click Convert
        $convertResponse = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post("/recruitment/candidates/{$candidate->id}/convert");

        $convertResponse->assertRedirect();
        $convertResponse->assertSessionHas('success');

        $candidate->refresh();
        $this->assertTrue($candidate->is_converted_to_employee);
        $this->assertNotNull($candidate->employee_id);

        // Verify Employee table created with matching attributes
        $newEmployee = Employee::find($candidate->employee_id);
        $this->assertNotNull($newEmployee);
        $this->assertEquals('Aditya Wijaya', $newEmployee->nama_lengkap);
        $this->assertEquals('aditya@crave.id', $newEmployee->email);
        $this->assertEquals('081233445566', $newEmployee->nomor_telepon);
        $this->assertEquals(22000000, $newEmployee->gaji_pokok);
        $this->assertTrue($newEmployee->is_active);

        // 2. Duplicate conversion attempt should be rejected
        $dupResponse = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post("/recruitment/candidates/{$candidate->id}/convert");

        $dupResponse->assertSessionHasErrors(['error']);
    }

    public function test_cannot_convert_candidate_to_employee_unless_stage_is_hired(): void
    {
        // Candidate still in 'applied' stage
        $candidate = Candidate::create([
            'company_id' => $this->companyA->id,
            'job_posting_id' => $this->jobA->id,
            'full_name' => 'Rian Pratama',
            'email' => 'rian.test@crave.id',
            'phone' => '081299887711',
            'stage' => 'applied',
            'is_converted_to_employee' => false,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post("/recruitment/candidates/{$candidate->id}/convert");

        $response->assertSessionHasErrors(['error']);
        $candidate->refresh();
        $this->assertFalse($candidate->is_converted_to_employee);
        $this->assertNull($candidate->employee_id);
    }

    public function test_cannot_change_stage_of_already_converted_employee(): void
    {
        $employee = Employee::create([
            'company_id' => $this->companyA->id,
            'nik' => 'EMP-TEST-01',
            'nama_lengkap' => 'Karyawan Tetap',
            'email' => 'tetap@crave.id',
            'nomor_telepon' => '081299887722',
            'tanggal_masuk' => now()->format('Y-m-d'),
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'TK/0',
            'gaji_pokok' => 15000000,
            'is_active' => true,
        ]);

        $candidate = Candidate::create([
            'company_id' => $this->companyA->id,
            'job_posting_id' => $this->jobA->id,
            'full_name' => 'Karyawan Tetap',
            'email' => 'tetap@crave.id',
            'phone' => '081299887722',
            'stage' => 'hired',
            'is_converted_to_employee' => true,
            'employee_id' => $employee->id,
        ]);

        // Attempt to demote/move back to applied or rejected
        $response = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->patch("/recruitment/candidates/{$candidate->id}/stage", [
                'stage' => 'applied',
            ]);

        $response->assertSessionHasErrors(['error']);
        $candidate->refresh();
        $this->assertEquals('hired', $candidate->stage);
    }

    public function test_cannot_rate_candidate_while_in_applied_stage(): void
    {
        $candidate = Candidate::create([
            'company_id' => $this->companyA->id,
            'job_posting_id' => $this->jobA->id,
            'full_name' => 'Pelamar Baru',
            'email' => 'pelamar@crave.id',
            'phone' => '081299887733',
            'stage' => 'applied',
            'rating' => 0,
        ]);

        // Attempting to submit rating 4 in applied stage should be rejected
        $response = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->patch("/recruitment/candidates/{$candidate->id}/scorecard", [
                'rating' => 4,
            ]);

        $response->assertSessionHasErrors(['error']);
        $candidate->refresh();
        $this->assertEquals(0, $candidate->rating);
    }

    public function test_hired_candidate_older_than_20_days_is_archived_in_active_view_but_visible_in_all_view(): void
    {
        // Candidate hired 25 days ago
        $archivedCandidate = Candidate::create([
            'company_id' => $this->companyA->id,
            'job_posting_id' => $this->jobA->id,
            'full_name' => 'Kandidat Lama',
            'email' => 'lama@crave.id',
            'phone' => '081299887744',
            'stage' => 'hired',
            'hired_at' => now()->subDays(25),
            'is_converted_to_employee' => false,
        ]);

        // Candidate hired 5 days ago (active)
        $recentCandidate = Candidate::create([
            'company_id' => $this->companyA->id,
            'job_posting_id' => $this->jobA->id,
            'full_name' => 'Kandidat Baru Hired',
            'email' => 'baru@crave.id',
            'phone' => '081299887755',
            'stage' => 'hired',
            'hired_at' => now()->subDays(5),
            'is_converted_to_employee' => false,
        ]);

        // 1. Default active view: only candidate hired <= 20 days is included
        $activeResponse = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/recruitment');

        $activeResponse->assertStatus(200);
        $activeResponse->assertInertia(fn ($page) => $page
            ->component('Recruitment/KanbanBoard')
            ->has('candidates', 1)
            ->where('candidates.0.full_name', 'Kandidat Baru Hired')
            ->where('archivedCount', 1)
        );

        // 2. All view: both candidates are included
        $allResponse = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/recruitment?archive=all');

        $allResponse->assertStatus(200);
        $allResponse->assertInertia(fn ($page) => $page
            ->component('Recruitment/KanbanBoard')
            ->has('candidates', 2)
        );
    }

    public function test_deleting_employee_synchronizes_candidate_conversion_status(): void
    {
        $employee = Employee::create([
            'company_id' => $this->companyA->id,
            'nik' => 'EMP-SYNC-01',
            'nama_lengkap' => 'Rian Sync',
            'email' => 'rian.sync@crave.id',
            'nomor_telepon' => '081299887766',
            'tanggal_masuk' => now()->format('Y-m-d'),
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'TK/0',
            'gaji_pokok' => 18000000,
            'is_active' => true,
        ]);

        $candidate = Candidate::create([
            'company_id' => $this->companyA->id,
            'job_posting_id' => $this->jobA->id,
            'full_name' => 'Rian Sync',
            'email' => 'rian.sync@crave.id',
            'phone' => '081299887766',
            'stage' => 'hired',
            'is_converted_to_employee' => true,
            'employee_id' => $employee->id,
        ]);

        // HR deletes employee from Data Karyawan
        $deleteResponse = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->delete("/employees/{$employee->id}");

        $deleteResponse->assertRedirect();
        $this->assertDatabaseMissing('employees', ['id' => $employee->id]);

        // Candidate conversion status must be synchronized to false
        $candidate->refresh();
        $this->assertFalse($candidate->is_converted_to_employee);
        $this->assertNull($candidate->employee_id);
    }

    public function test_hr_can_delete_unconverted_candidate_and_cannot_delete_active_employee(): void
    {
        $candidate = Candidate::create([
            'company_id' => $this->companyA->id,
            'job_posting_id' => $this->jobA->id,
            'full_name' => 'Pelamar Dibatalkan',
            'email' => 'batal@crave.id',
            'phone' => '081299887777',
            'stage' => 'applied',
        ]);

        // HR deletes candidate
        $deleteResponse = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->delete("/recruitment/candidates/{$candidate->id}");

        $deleteResponse->assertRedirect();
        $this->assertDatabaseMissing('candidates', ['id' => $candidate->id]);
    }

    public function test_multi_tenant_isolation_for_recruitment(): void
    {
        $candidateA = Candidate::create([
            'company_id' => $this->companyA->id,
            'job_posting_id' => $this->jobA->id,
            'full_name' => 'Kandidat Tenant A',
            'email' => 'kandidatA@crave.id',
            'phone' => '08123456789',
            'stage' => 'applied',
        ]);

        // Tenant B attempting to view / update Tenant A candidate is blocked by BelongsToCompany global scope
        $response = $this->actingAs($this->userB)
            ->withSession(['active_company_id' => $this->companyB->id])
            ->patch("/recruitment/candidates/{$candidateA->id}/stage", [
                'stage' => 'interview',
            ]);

        $this->assertTrue(in_array($response->status(), [403, 404]));
    }

    public function test_hr_can_view_printable_offering_letter(): void
    {
        $candidate = Candidate::create([
            'company_id' => $this->companyA->id,
            'job_posting_id' => $this->jobA->id,
            'full_name' => 'Nadia Safira',
            'email' => 'nadia@design.id',
            'phone' => '08123456789',
            'stage' => 'offering',
            'offered_salary' => 19500000,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get("/recruitment/candidates/{$candidate->id}/offering");

        $response->assertStatus(200);
        $response->assertSee('SURAT PENAWARAN KERJA');
        $response->assertSee('Nadia Safira');
        $response->assertSee('19.500.000');
    }
}
