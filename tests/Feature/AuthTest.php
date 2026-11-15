<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Auth/Login')
            ->has('demoAccounts')
        );
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $company = Company::create([
            'name' => 'Crave Global Group',
            'slug' => 'crave-global-group',
            'is_holding' => true,
        ]);

        $user = User::create([
            'name' => 'Eka Revandi',
            'email' => 'founder@craveservices.my.id',
            'password' => Hash::make('@Mukbsca22'),
        ]);

        $user->companies()->attach($company->id, ['role' => 'super_admin', 'is_primary' => true]);

        $response = $this->post('/login', [
            'email' => 'founder@craveservices.my.id',
            'password' => '@Mukbsca22',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/');
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::create([
            'name' => 'Eka Revandi',
            'email' => 'founder@craveservices.my.id',
            'password' => Hash::make('@Mukbsca22'),
        ]);

        $this->post('/login', [
            'email' => 'founder@craveservices.my.id',
            'password' => 'wrong-password-123',
        ]);

        $this->assertGuest();
    }

    public function test_rate_limiter_blocks_excessive_failed_login_attempts(): void
    {
        $user = User::create([
            'name' => 'Eka Revandi',
            'email' => 'founder@craveservices.my.id',
            'password' => Hash::make('@Mukbsca22'),
        ]);

        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', [
                'email' => 'founder@craveservices.my.id',
                'password' => 'wrong-password',
            ]);
        }

        $response = $this->post('/login', [
            'email' => 'founder@craveservices.my.id',
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertStringContainsString('Terlalu banyak percobaan gagal', session('errors')->first('email'));
    }

    public function test_register_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Auth/Register')
        );
    }

    public function test_new_users_can_register_and_create_company(): void
    {
        $response = $this->post('/register', [
            'name' => 'Mitra Baru',
            'company_name' => 'PT Mitra Sukses Abadi',
            'email' => 'mitra@suksesabadi.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/');

        $this->assertDatabaseHas('users', [
            'email' => 'mitra@suksesabadi.com',
        ]);

        $this->assertDatabaseHas('companies', [
            'name' => 'PT Mitra Sukses Abadi',
        ]);
    }

    public function test_users_can_logout(): void
    {
        $user = User::create([
            'name' => 'Eka Revandi',
            'email' => 'founder@craveservices.my.id',
            'password' => Hash::make('@Mukbsca22'),
        ]);

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/login');
    }
}
