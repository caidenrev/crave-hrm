<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesLead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'company_name',
        'work_email',
        'phone',
        'employee_count',
        'notes',
        'status',
        'founder_notes',
        'contacted_at',
    ];

    protected $casts = [
        'contacted_at' => 'datetime',
    ];

    /**
     * Get clean international phone number for WhatsApp link (e.g. 0812... -> 62812...)
     */
    public function cleanPhone(): string
    {
        $clean = preg_replace('/[^0-9]/', '', $this->phone ?? '');
        if (str_starts_with($clean, '0')) {
            $clean = '62' . substr($clean, 1);
        } elseif (str_starts_with($clean, '8')) {
            $clean = '62' . $clean;
        }
        return $clean;
    }

    /**
     * Generate direct WhatsApp follow-up URL
     */
    public function whatsappUrl(): string
    {
        $phone = $this->cleanPhone();
        $greeting = rawurlencode("Halo {$this->name} ({$this->company_name}), saya dari Tim Crave HRM. Terima kasih telah menghubungi kami terkait kebutuhan sistem HRM perusahaan Anda.");
        return "https://wa.me/{$phone}?text={$greeting}";
    }

    /**
     * Get Indonesian readable status label
     */
    public function statusLabel(): string
    {
        return match ($this->status) {
            'contacted' => 'Sudah Dihubungi',
            'demo_scheduled' => 'Demo Dijadwalkan',
            'converted' => 'Closing / Jadi Tenant',
            'archived' => 'Diarsipkan',
            default => 'Prospek Baru',
        };
    }
}
