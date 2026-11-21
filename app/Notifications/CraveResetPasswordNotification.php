<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CraveResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(public string $token)
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $resetUrl = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        return (new MailMessage)
            ->subject('[Crave HRM] Atur Ulang Kata Sandi Akun Anda')
            ->view('emails.reset-password', [
                'user' => $notifiable,
                'name' => $notifiable->name ?? 'Pengguna Crave HRM',
                'email' => $notifiable->getEmailForPasswordReset(),
                'resetUrl' => $resetUrl,
                'logoUrl' => asset('dark-mode-logo.png'),
            ]);
    }
}
