<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Task8LeaveManagementTest extends TestCase
{
    use RefreshDatabase;

    protected Company $companyA;
    protected Company $companyB;
    protected User $userA;
    protected Employee $employeeA;
    protected User $supervisorUser;
    protected User $hrUser;
    protected LeaveType $annualType;
    protected LeaveType $sickType;

    protected function setUp(): void
    {
        parent::setUp();

        $this->companyA = Company::create([
            'name' => 'PT Crave Utama',
            'slug' => 'crave-utama',
            'is_holding' => true,
            'is_active' => true,
        ]);

        $this->companyB = Company::create([
            'name' => 'PT Crave Kedua',
            'slug' => 'crave-kedua',
            'is_holding' => false,
            'is_active' => true,
        ]);

        $this->userA = User::factory()->create([
            'email' => 'employee@crave.id',
        ]);
        $this->userA->companies()->attach($this->companyA->id, ['role' => 'employee', 'is_primary' => true]);

        $this->supervisorUser = User::factory()->create([
            'email' => 'supervisor@crave.id',
        ]);
        $this->supervisorUser->companies()->attach($this->companyA->id, ['role' => 'branch_manager', 'is_primary' => true]);

        $this->hrUser = User::factory()->create([
            'email' => 'hr@crave.id',
        ]);
        $this->hrUser->companies()->attach($this->companyA->id, ['role' => 'company_admin', 'is_primary' => true]);

        $dept = Department::create([
            'company_id' => $this->companyA->id,
            'name' => 'Engineering',
        ]);

        $desig = Designation::create([
            'company_id' => $this->companyA->id,
            'title' => 'Software Engineer',
        ]);

        $this->employeeA = Employee::create([
            'company_id' => $this->companyA->id,
            'user_id' => $this->userA->id,
            'department_id' => $dept->id,
            'designation_id' => $desig->id,
            'nik' => 'EMP-001',
            'nama_lengkap' => 'Budi Santoso',
            'email' => 'employee@crave.id',
            'tanggal_masuk' => '2025-01-01',
            'is_active' => true,
        ]);

        // Leave Types
        $this->annualType = LeaveType::create([
            'company_id' => $this->companyA->id,
            'name' => 'Cuti Tahunan',
            'code' => 'ANNUAL',
            'days_allocated' => 12,
            'is_paid' => true,
            'requires_attachment' => false,
            'is_active' => true,
        ]);

        $this->sickType = LeaveType::create([
            'company_id' => $this->companyA->id,
            'name' => 'Cuti Sakit',
            'code' => 'SICK',
            'days_allocated' => 14,
            'is_paid' => true,
            'requires_attachment' => true,
            'is_active' => true,
        ]);

        // Balances
        LeaveBalance::create([
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'leave_type_id' => $this->annualType->id,
            'year' => Carbon::now()->year,
            'total_allocated' => 12,
            'used_days' => 0,
            'pending_days' => 0,
            'remaining_days' => 12,
        ]);
    }

    public function test_employee_can_view_leave_page_with_balances_and_types(): void
    {
        $response = $this->actingAs($this->userA)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get(route('leave.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Leave/Index')
            ->has('leaveTypes')
            ->has('balances')
            ->has('stats.annual_remaining')
        );
    }

    public function test_employee_can_submit_annual_leave_request(): void
    {
        $response = $this->actingAs($this->userA)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('leave.store'), [
                'leave_type_id' => $this->annualType->id,
                'start_date' => '2026-11-16', // Monday
                'end_date' => '2026-11-18',   // Wednesday (3 working days)
                'reason' => 'Keperluan keluarga di luar kota',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('leave_requests', [
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'leave_type_id' => $this->annualType->id,
            'total_days' => 3,
            'status' => 'pending_supervisor',
            'supervisor_status' => 'pending',
            'hr_status' => 'pending',
        ]);

        // Verify balance pending_days incremented
        $balance = LeaveBalance::where('employee_id', $this->employeeA->id)
            ->where('leave_type_id', $this->annualType->id)
            ->first();
        $this->assertEquals(3, $balance->pending_days);
    }

    public function test_employee_cannot_submit_leave_exceeding_annual_quota(): void
    {
        // Request 15 days when only 12 allocated
        $response = $this->actingAs($this->userA)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('leave.store'), [
                'leave_type_id' => $this->annualType->id,
                'start_date' => '2026-11-16',
                'end_date' => '2026-12-04', // 15 working days
                'reason' => 'Libur panjang',
            ]);

        $response->assertSessionHas('error');
        $this->assertDatabaseMissing('leave_requests', [
            'employee_id' => $this->employeeA->id,
            'reason' => 'Libur panjang',
        ]);
    }

    public function test_sick_leave_requires_attachment_when_more_than_one_day(): void
    {
        // 2 days sick leave without attachment should fail
        $response = $this->actingAs($this->userA)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('leave.store'), [
                'leave_type_id' => $this->sickType->id,
                'start_date' => '2026-11-16',
                'end_date' => '2026-11-17',
                'reason' => 'Demam berdarah',
                'attachment_url' => '',
            ]);

        $response->assertSessionHas('error');
    }

    public function test_sequential_approval_supervisor_then_hr_deducts_quota(): void
    {
        // 1. Submit request
        $this->actingAs($this->userA)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('leave.store'), [
                'leave_type_id' => $this->annualType->id,
                'start_date' => '2026-11-16',
                'end_date' => '2026-11-17', // 2 working days
                'reason' => 'Urusan pribadi',
            ]);

        $leaveRequest = LeaveRequest::first();

        // 2. Supervisor approves Level 1
        $responseSupervisor = $this->actingAs($this->supervisorUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('leave.approvals.supervisor', $leaveRequest), [
                'notes' => 'Disetujui, pekerjaan didelegasikan',
            ]);

        $responseSupervisor->assertRedirect();
        $leaveRequest->refresh();
        $this->assertEquals('pending_hr', $leaveRequest->status);
        $this->assertEquals('approved', $leaveRequest->supervisor_status);
        $this->assertEquals($this->supervisorUser->id, $leaveRequest->supervisor_id);

        // 3. HR approves Level 2 (Final)
        $responseHr = $this->actingAs($this->hrUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('leave.approvals.hr', $leaveRequest), [
                'notes' => 'Disahkan oleh HR',
            ]);

        $responseHr->assertRedirect();
        $leaveRequest->refresh();
        $this->assertEquals('approved', $leaveRequest->status);
        $this->assertEquals('approved', $leaveRequest->hr_status);
        $this->assertEquals($this->hrUser->id, $leaveRequest->hr_id);

        // 4. Verify balance deducted
        $balance = LeaveBalance::where('employee_id', $this->employeeA->id)
            ->where('leave_type_id', $this->annualType->id)
            ->first();
        $this->assertEquals(0, $balance->pending_days);
        $this->assertEquals(2, $balance->used_days);
        $this->assertEquals(10, $balance->remaining_days);
    }

    public function test_supervisor_rejection_restores_pending_quota(): void
    {
        // Submit request
        $this->actingAs($this->userA)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('leave.store'), [
                'leave_type_id' => $this->annualType->id,
                'start_date' => '2026-11-16',
                'end_date' => '2026-11-17',
                'reason' => 'Cuti mendadak',
            ]);

        $leaveRequest = LeaveRequest::first();

        // Reject
        $response = $this->actingAs($this->supervisorUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('leave.approvals.reject', $leaveRequest), [
                'reason' => 'Ada deadline rilis sistem mendesak',
                'level' => 'supervisor',
            ]);

        $response->assertRedirect();
        $leaveRequest->refresh();
        $this->assertEquals('rejected', $leaveRequest->status);
        $this->assertEquals('rejected', $leaveRequest->supervisor_status);

        // Verify balance restored
        $balance = LeaveBalance::where('employee_id', $this->employeeA->id)
            ->where('leave_type_id', $this->annualType->id)
            ->first();
        $this->assertEquals(0, $balance->pending_days);
        $this->assertEquals(0, $balance->used_days);
        $this->assertEquals(12, $balance->remaining_days);
    }

    public function test_employee_can_cancel_pending_leave_request(): void
    {
        $this->actingAs($this->userA)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('leave.store'), [
                'leave_type_id' => $this->annualType->id,
                'start_date' => '2026-11-20',
                'end_date' => '2026-11-20',
                'reason' => 'Rencana awal',
            ]);

        $leaveRequest = LeaveRequest::first();

        $response = $this->actingAs($this->userA)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->delete(route('leave.cancel', $leaveRequest));

        $response->assertRedirect();
        $leaveRequest->refresh();
        $this->assertEquals('cancelled', $leaveRequest->status);

        $balance = LeaveBalance::where('employee_id', $this->employeeA->id)
            ->where('leave_type_id', $this->annualType->id)
            ->first();
        $this->assertEquals(0, $balance->pending_days);
    }

    public function test_cannot_overlap_active_leave_requests(): void
    {
        // Request 1
        $this->actingAs($this->userA)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('leave.store'), [
                'leave_type_id' => $this->annualType->id,
                'start_date' => '2026-11-16',
                'end_date' => '2026-11-18',
                'reason' => 'Pengajuan pertama',
            ]);

        // Request 2 overlapping with Request 1
        $response = $this->actingAs($this->userA)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('leave.store'), [
                'leave_type_id' => $this->annualType->id,
                'start_date' => '2026-11-17',
                'end_date' => '2026-11-19',
                'reason' => 'Pengajuan kedua overlap',
            ]);

        $response->assertSessionHas('error');
    }

    public function test_multi_company_isolation_on_leave_requests(): void
    {
        // Create request in company A
        $requestA = LeaveRequest::create([
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'leave_type_id' => $this->annualType->id,
            'start_date' => '2026-11-16',
            'end_date' => '2026-11-16',
            'total_days' => 1,
            'reason' => 'Cuti Company A',
            'status' => 'pending_supervisor',
        ]);

        // User from Company B attempts to approve
        $userB = User::factory()->create();
        $userB->companies()->attach($this->companyB->id, ['role' => 'company_admin', 'is_primary' => true]);

        $response = $this->actingAs($userB)
            ->withSession(['active_company_id' => $this->companyB->id])
            ->post(route('leave.approvals.supervisor', $requestA));

        // BelongsToCompany global scope ensures zero cross-tenant discovery (404 Not Found)
        $response->assertNotFound();
    }
}
