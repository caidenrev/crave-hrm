<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Company $company;
    protected Employee $employee;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create([
            'name' => 'Crave Global Group',
            'slug' => 'crave-global-group',
            'is_active' => true,
        ]);

        $this->user = User::factory()->create([
            'name' => 'Aufa',
            'email' => 'aufa@craveservices.my.id',
            'password' => Hash::make('password123'),
        ]);

        $this->user->companies()->attach($this->company->id, [
            'role' => 'holding_admin',
            'is_primary' => true,
        ]);

        $this->employee = Employee::create([
            'company_id' => $this->company->id,
            'user_id' => $this->user->id,
            'nik' => 'HLD-003',
            'nama_lengkap' => 'Aufa',
            'email' => 'aufa@craveservices.my.id',
            'nomor_telepon' => '081234567890',
            'avatar_url' => '/images/avatars/avatar-1.jpg',
            'status_kerja' => 'PKWTT',
            'tanggal_masuk' => '2026-11-10',
            'ptkp_status' => 'TK/0',
            'bank_name' => 'BCA',
            'bank_account_number' => '1234567890',
            'gaji_pokok' => 10000000,
            'is_active' => true,
        ]);
    }

    public function test_guest_cannot_view_profile_page(): void
    {
        $response = $this->get('/profile');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_profile_page(): void
    {
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->company->id])
            ->get('/profile');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Profile/Edit')
            ->has('user')
            ->has('employee')
            ->has('sessions')
            ->where('user.email', 'aufa@craveservices.my.id')
        );
    }

    public function test_user_can_update_profile_information(): void
    {
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->company->id])
            ->put('/profile', [
                'name' => 'Aufa Updated',
                'nomor_telepon' => '089876543210',
                'avatar_url' => '/images/avatars/avatar-2.jpg',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'Aufa Updated',
            'avatar_url' => '/images/avatars/avatar-2.jpg',
        ]);

        $this->assertDatabaseHas('employees', [
            'id' => $this->employee->id,
            'nama_lengkap' => 'Aufa Updated',
            'nomor_telepon' => '089876543210',
            'avatar_url' => '/images/avatars/avatar-2.jpg',
        ]);
    }

    public function test_user_can_update_password_with_valid_current_password(): void
    {
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->company->id])
            ->put('/profile/password', [
                'current_password' => 'password123',
                'new_password' => 'newpassword123',
                'new_password_confirmation' => 'newpassword123',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertTrue(Hash::check('newpassword123', $this->user->fresh()->password));
    }

    public function test_user_cannot_update_password_with_incorrect_current_password(): void
    {
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->company->id])
            ->put('/profile/password', [
                'current_password' => 'wrongpassword',
                'new_password' => 'newpassword123',
                'new_password_confirmation' => 'newpassword123',
            ]);

        $response->assertSessionHasErrors(['current_password']);
        $this->assertTrue(Hash::check('password123', $this->user->fresh()->password));
    }

    public function test_user_cannot_set_same_password_as_current(): void
    {
        $response = $this->actingAs($this->user)
            ->withSession(['active_company_id' => $this->company->id])
            ->put('/profile/password', [
                'current_password' => 'password123',
                'new_password' => 'password123',
                'new_password_confirmation' => 'password123',
            ]);

        $response->assertSessionHasErrors(['new_password']);
    }
}
