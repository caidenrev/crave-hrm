<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\CraveResetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_forgot_password_screen_can_be_rendered(): void
    {
        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Auth/ForgotPassword')
        );
    }

    public function test_reset_password_link_can_be_requested_for_existing_user(): void
    {
        Notification::fake();

        $user = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@craveservices.my.id',
            'password' => Hash::make('oldpassword123'),
        ]);

        $response = $this->post('/forgot-password', [
            'email' => 'budi@craveservices.my.id',
        ]);

        $response->assertSessionHas('status');
        Notification::assertSentTo($user, CraveResetPasswordNotification::class);
    }

    public function test_reset_password_link_fails_for_non_existent_email(): void
    {
        Notification::fake();

        $response = $this->post('/forgot-password', [
            'email' => 'unknown@perusahaan.com',
        ]);

        $response->assertSessionHasErrors('email');
        Notification::assertNothingSent();
    }

    public function test_reset_password_screen_can_be_rendered(): void
    {
        $response = $this->get('/reset-password/sample-token?email=budi@craveservices.my.id');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Auth/ResetPassword')
            ->where('token', 'sample-token')
            ->where('email', 'budi@craveservices.my.id')
        );
    }

    public function test_password_can_be_reset_with_valid_token(): void
    {
        $user = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@craveservices.my.id',
            'password' => Hash::make('oldpassword123'),
        ]);

        $token = Password::createToken($user);

        $response = $this->post('/reset-password', [
            'token' => $token,
            'email' => 'budi@craveservices.my.id',
            'password' => 'newpassword456',
            'password_confirmation' => 'newpassword456',
        ]);

        $response->assertRedirect('/login');
        $response->assertSessionHas('status');

        $this->assertTrue(Hash::check('newpassword456', $user->fresh()->password));
    }

    public function test_password_cannot_be_reset_with_invalid_token(): void
    {
        $user = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@craveservices.my.id',
            'password' => Hash::make('oldpassword123'),
        ]);

        $response = $this->post('/reset-password', [
            'token' => 'invalid-reset-token',
            'email' => 'budi@craveservices.my.id',
            'password' => 'newpassword456',
            'password_confirmation' => 'newpassword456',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertFalse(Hash::check('newpassword456', $user->fresh()->password));
    }

    public function test_email_notification_renders_properly(): void
    {
        $user = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@craveservices.my.id',
            'password' => Hash::make('oldpassword123'),
        ]);

        $notification = new CraveResetPasswordNotification('test-token-123');
        $mail = $notification->toMail($user);

        $html = view($mail->view, $mail->viewData)->render();

        $this->assertStringContainsString('Crave', $html);
        $this->assertStringContainsString('Atur Ulang Kata Sandi', $html);
        $this->assertStringContainsString('Budi Santoso', $html);
        $this->assertStringContainsString('test-token-123', $html);
        $this->assertStringContainsString('dark-mode-logo.png', $html);
    }
}
