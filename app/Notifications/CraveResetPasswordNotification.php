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
            ->greeting("Halo, {$notifiable->name}!")
            ->line('Kami menerima permintaan pengaturan ulang kata sandi untuk akun Crave HRM yang terhubung dengan alamat email ini.')
            ->action('Atur Ulang Kata Sandi', $resetUrl)
            ->line('Tautan pengaturan ulang kata sandi ini bersifat rahasia dan berlaku selama 60 menit.')
            ->line('Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini dan kata sandi Anda akan tetap aman.')
            ->salutation("Salam hangat,\nTim Keamanan Crave HRM");
    }
}
