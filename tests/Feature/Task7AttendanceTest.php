<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Branch;
use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\Shift;
use App\Models\ShiftSwap;
use App\Models\User;
use App\Services\AttendanceService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class Task7AttendanceTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Company $companyA;
    protected Company $companyB;
    protected Branch $branchA;
    protected Shift $shiftPagi;
    protected Employee $employeeA;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

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

        // Branch at Monas Jakarta (-6.175392, 106.827153) with 100m radius and office IP
        $this->branchA = Branch::create([
            'company_id' => $this->companyA->id,
            'name' => 'Kantor Pusat Jakarta',
            'code' => 'HQ-JKT',
            'latitude' => -6.175392,
            'longitude' => 106.827153,
            'radius_meters' => 100,
            'office_ips' => ['103.120.45.10', '192.168.1.100'],
            'is_active' => true,
        ]);

        $this->shiftPagi = Shift::create([
            'company_id' => $this->companyA->id,
            'name' => 'Shift Pagi Reguler',
            'code' => 'PAGI',
            'start_time' => '08:00:00',
            'end_time' => '17:00:00',
            'late_tolerance_minutes' => 15,
            'is_flexible' => false,
            'is_active' => true,
        ]);

        $dept = Department::create([
            'company_id' => $this->companyA->id,
            'name' => 'Engineering',
        ]);

        $desig = Designation::create([
            'company_id' => $this->companyA->id,
            'title' => 'Senior Developer',
        ]);

        $this->employeeA = Employee::create([
            'company_id' => $this->companyA->id,
            'branch_id' => $this->branchA->id,
            'department_id' => $dept->id,
            'designation_id' => $desig->id,
            'default_shift_id' => $this->shiftPagi->id,
            'user_id' => $this->user->id,
            'nik' => 'EMP-CRV-001',
            'nama_lengkap' => 'Eka Revandi',
            'email' => 'eka@craveservices.my.id',
            'tanggal_masuk' => '2024-01-01',
            'is_active' => true,
        ]);
    }

    public function test_haversine_distance_calculation(): void
    {
        $service = app(AttendanceService::class);

        // Distance between Monas (-6.175392, 106.827153) and point ~50m away (-6.175000, 106.827153)
        $distClose = $service->calculateDistanceMeters(-6.175392, 106.827153, -6.175000, 106.827153);
        $this->assertLessThan(100, $distClose);

        // Distance between Monas and Bundaran HI (-6.1950, 106.8230) ~2.2 km
        $distFar = $service->calculateDistanceMeters(-6.175392, 106.827153, -6.1950, 106.8230);
        $this->assertGreaterThan(2000, $distFar);
    }

    public function test_user_can_view_checkin_page(): void
    {
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/attendance');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Attendance/CheckIn'));
    }

    public function test_clock_in_succeeds_within_geofence_radius(): void
    {
        // 30 meters from branch center
        $latWithin = -6.175300;
        $lngWithin = 106.827153;

        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post('/attendance/clock-in', [
                'latitude' => $latWithin,
                'longitude' => $lngWithin,
                'selfie_image' => 'data:image/jpeg;base64,/9j/fake',
                'notes' => 'Presensi tepat waktu di kantor pusat.',
            ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('attendances', [
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'geofence_status' => 'valid_geofence',
        ]);
    }

    public function test_clock_in_fails_outside_geofence_radius_without_ip_whitelist(): void
    {
        // ~2.2 km away from branch
        $latFar = -6.195000;
        $lngFar = 106.823000;

        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->withServerVariables(['REMOTE_ADDR' => '180.252.90.12']) // not in office_ips
            ->post('/attendance/clock-in', [
                'latitude' => $latFar,
                'longitude' => $lngFar,
                'selfie_image' => 'data:image/jpeg;base64,/9j/fake',
            ]);

        $response->assertSessionHas('error');
        $this->assertDatabaseMissing('attendances', [
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
        ]);
    }

    public function test_clock_in_succeeds_outside_geofence_if_ip_is_whitelisted(): void
    {
        $latFar = -6.195000;
        $lngFar = 106.823000;

        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->withServerVariables(['REMOTE_ADDR' => '103.120.45.10']) // matches office_ips
            ->post('/attendance/clock-in', [
                'latitude' => $latFar,
                'longitude' => $lngFar,
                'selfie_image' => 'data:image/jpeg;base64,/9j/fake',
            ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('attendances', [
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'geofence_status' => 'valid_ip',
        ]);
    }

    public function test_clock_out_calculates_work_duration(): void
    {
        $today = Carbon::today()->format('Y-m-d');

        // Pre-create clocked in record
        $attendance = Attendance::create([
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'branch_id' => $this->branchA->id,
            'shift_id' => $this->shiftPagi->id,
            'date' => $today,
            'clock_in_time' => now()->subHours(2)->format('H:i:s'),
            'clock_in_lat' => -6.175392,
            'clock_in_lng' => 106.827153,
            'status' => 'present',
            'geofence_status' => 'valid_geofence',
        ]);

        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post('/attendance/clock-out', [
                'latitude' => -6.175392,
                'longitude' => 106.827153,
            ]);

        $response->assertSessionHas('success');
        $attendance->refresh();
        $this->assertNotNull($attendance->clock_out_time);
        $this->assertGreaterThan(0, $attendance->work_duration_minutes);
    }

    public function test_user_can_manage_shifts_and_swap_request(): void
    {
        // 1. View shifts page
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/attendance/shifts');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Attendance/Shifts'));

        // 2. Store new shift
        $storeResponse = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post('/attendance/shifts', [
                'name' => 'Shift Malam Ekstra',
                'code' => 'MALAM',
                'start_time' => '22:00',
                'end_time' => '06:00',
                'late_tolerance_minutes' => 10,
                'is_flexible' => false,
                'is_active' => true,
            ]);

        $storeResponse->assertSessionHas('success');
        $this->assertDatabaseHas('shifts', [
            'company_id' => $this->companyA->id,
            'name' => 'Shift Malam Ekstra',
            'code' => 'MALAM',
        ]);

        // 3. Shift swap request between coworkers
        $employeeB = Employee::create([
            'company_id' => $this->companyA->id,
            'branch_id' => $this->branchA->id,
            'user_id' => null,
            'nik' => 'EMP-CRV-002',
            'nama_lengkap' => 'Aufa Pratama',
            'email' => 'aufa@craveservices.my.id',
            'tanggal_masuk' => '2024-02-01',
            'is_active' => true,
        ]);

        $newShift = Shift::where('name', 'Shift Malam Ekstra')->first();

        $swapResponse = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post('/attendance/shifts/swap', [
                'target_employee_id' => $employeeB->id,
                'requested_shift_id' => $this->shiftPagi->id,
                'target_shift_id' => $newShift->id,
                'swap_date' => Carbon::tomorrow()->format('Y-m-d'),
                'reason' => 'Ada keperluan keluarga mendesak di pagi hari.',
            ]);

        $swapResponse->assertSessionHas('success');
        $this->assertDatabaseHas('shift_swaps', [
            'company_id' => $this->companyA->id,
            'requester_id' => $this->employeeA->id,
            'target_employee_id' => $employeeB->id,
            'status' => 'pending',
        ]);
    }

    public function test_user_can_view_recap_and_hr_can_correct_log(): void
    {
        $today = Carbon::today()->format('Y-m-d');
        $attendance = Attendance::create([
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'branch_id' => $this->branchA->id,
            'shift_id' => $this->shiftPagi->id,
            'date' => $today,
            'clock_in_time' => '08:45:00',
            'status' => 'late',
            'late_minutes' => 45,
            'geofence_status' => 'valid_geofence',
        ]);

        // Recap view
        $viewResponse = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/attendance/recap');

        $viewResponse->assertStatus(200);
        $viewResponse->assertInertia(fn ($page) => $page->component('Attendance/Report'));

        // HR Manual Correction
        $correctResponse = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->patch("/attendance/recap/{$attendance->id}/correct", [
                'status' => 'present',
                'clock_in_time' => '08:05:00',
                'clock_out_time' => '17:00:00',
                'correction_reason' => 'Klarifikasi kendala jaringan GPS saat check-in.',
            ]);

        $correctResponse->assertSessionHas('success');
        $attendance->refresh();
        $this->assertEquals('present', $attendance->status);
        $this->assertTrue($attendance->is_corrected);
        $this->assertEquals('Klarifikasi kendala jaringan GPS saat check-in.', $attendance->correction_reason);
        $this->assertEquals(0, $attendance->late_minutes);
        $this->assertGreaterThan(0, $attendance->work_duration_minutes);
    }

    public function test_selfie_image_is_stored_to_storage_disk_as_file(): void
    {
        $latWithin = -6.175300;
        $lngWithin = 106.827153;

        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post('/attendance/clock-in', [
                'latitude' => $latWithin,
                'longitude' => $lngWithin,
                'selfie_image' => 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=',
                'notes' => 'Clock-in selfie optimization test.',
            ]);

        $response->assertSessionHas('success');
        $attendance = Attendance::where('company_id', $this->companyA->id)
            ->where('employee_id', $this->employeeA->id)
            ->first();

        $this->assertNotNull($attendance);
        $this->assertStringStartsWith('/storage/attendances/selfies/', $attendance->clock_in_selfie_url);

        $relativePath = str_replace('/storage/', '', $attendance->clock_in_selfie_url);
        Storage::disk('public')->assertExists($relativePath);
    }

    public function test_branch_timezone_metadata_is_rendered_in_inertia(): void
    {
        // Update branch to WITA (Asia/Makassar)
        $this->branchA->update(['timezone' => 'Asia/Makassar']);

        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get('/attendance');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Attendance/CheckIn')
                ->where('timezone', 'Asia/Makassar')
                ->where('timezone_abbr', 'WITA')
                ->has('server_timestamp')
        );
    }

    public function test_multi_branch_visiting_allows_attendance_at_other_active_company_branch(): void
    {
        // Create another branch in Surabaya (-7.2575, 112.7521)
        $branchSurabaya = Branch::create([
            'company_id' => $this->companyA->id,
            'name' => 'Kantor Cabang Surabaya',
            'code' => 'SBY-01',
            'latitude' => -7.257500,
            'longitude' => 112.752100,
            'radius_meters' => 150,
            'is_active' => true,
        ]);

        // Employee A is assigned to Jakarta, but is visiting Surabaya
        $latSurabaya = -7.257520;
        $lngSurabaya = 112.752120;

        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post('/attendance/clock-in', [
                'latitude' => $latSurabaya,
                'longitude' => $lngSurabaya,
                'notes' => 'Dinas kunjungan ke kantor cabang Surabaya.',
            ]);

        $response->assertSessionHas('success');
        $attendance = Attendance::where('company_id', $this->companyA->id)
            ->where('employee_id', $this->employeeA->id)
            ->first();

        $this->assertNotNull($attendance);
        $this->assertEquals('valid_geofence', $attendance->geofence_status);
        $this->assertEquals($branchSurabaya->id, $attendance->branch_id);
    }

    public function test_cross_midnight_shift_early_leave_calculation(): void
    {
        $service = app(\App\Services\AttendanceService::class);

        // Night shift 22:00 to 06:00
        $shiftMalam = Shift::create([
            'company_id' => $this->companyA->id,
            'name' => 'Shift Malam Security',
            'start_time' => '22:00:00',
            'end_time' => '06:00:00',
            'late_tolerance_minutes' => 15,
            'is_flexible' => false,
            'is_active' => true,
        ]);

        // Clocked out at 05:30 (30 minutes early)
        $clockOutTime = Carbon::parse('2026-11-20 05:30:00', 'Asia/Jakarta');
        $earlyMinutes = $service->calculateEarlyLeaveMinutes($shiftMalam, $clockOutTime);

        $this->assertEquals(30, $earlyMinutes);

        // Clocked out at 06:05 (on time / past end_time)
        $clockOutOnTime = Carbon::parse('2026-11-20 06:05:00', 'Asia/Jakarta');
        $earlyMinutesZero = $service->calculateEarlyLeaveMinutes($shiftMalam, $clockOutOnTime);

        $this->assertEquals(0, $earlyMinutesZero);
    }

    public function test_multi_tenant_isolation_for_attendances(): void
    {
        // Attendance in Company A
        Attendance::create([
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'date' => Carbon::today()->format('Y-m-d'),
            'clock_in_time' => now()->subHours(2)->format('H:i:s'),
            'status' => 'present',
            'geofence_status' => 'valid_geofence',
        ]);

        // Shift in Company A
        $shiftA = $this->shiftPagi;

        // Switch to Company B
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyB->id])
            ->get('/attendance/recap');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('attendances.data', 0)
        );

        // Cannot correct Company A attendance from Company B session
        $attendanceA = Attendance::withoutGlobalScopes()->where('company_id', $this->companyA->id)->first();
        $forbiddenResponse = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->companyB->id])
            ->patch("/attendance/recap/{$attendanceA->id}/correct", [
                'status' => 'present',
                'correction_reason' => 'Hacker attempt across tenant.',
            ]);

        $this->assertTrue(in_array($forbiddenResponse->status(), [403, 404]));
    }
}
