<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class CanteenVoucher extends Model
{
    use HasFactory, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'employee_id',
        'vendor_id',
        'voucher_code',
        'encrypted_token',
        'meal_date',
        'meal_type',
        'nominal_value',
        'status',
        'expires_at',
        'redeemed_at',
        'redeemed_by',
        'ip_address',
        'device_info',
    ];

    protected $casts = [
        'meal_date' => 'date:Y-m-d',
        'nominal_value' => 'decimal:2',
        'expires_at' => 'datetime',
        'redeemed_at' => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(CanteenVendor::class, 'vendor_id');
    }

    public function redeemer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'redeemed_by');
    }

    /**
     * Check if dynamic token is expired.
     */
    public function isTokenExpired(): bool
    {
        return $this->expires_at === null || $this->expires_at->isPast();
    }

    /**
     * Refresh the dynamic QR token with a fresh 60s TTL.
     */
    public function refreshDynamicToken(int $ttlSeconds = 60): string
    {
        $timestamp = now()->timestamp;
        $randomSalt = Str::random(16);
        $signature = hash_hmac(
            'sha256',
            "{$this->id}|{$this->company_id}|{$this->employee_id}|{$timestamp}|{$randomSalt}",
            config('app.key') ?? 'crave-hrm-secret-salt-2026'
        );

        $newToken = "CRV-QR-{$this->id}-{$timestamp}-" . substr($signature, 0, 32);

        $this->update([
            'encrypted_token' => $newToken,
            'expires_at' => now()->addSeconds($ttlSeconds),
        ]);

        return $newToken;
    }
}
