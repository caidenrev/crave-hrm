<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'logo_url',
        'email',
        'phone',
        'address',
        'tax_id',
        'bpjs_kesehatan_id',
        'bpjs_ketenagakerjaan_id',
        'is_holding',
        'parent_company_id',
        'is_active',
        'subscription_status',
        'trial_ends_at',
        'current_period_end',
        'plan_name',
        'max_employees',
        'founder_note',
        'suspended_at',
        'suspended_reason',
    ];

    protected $casts = [
        'is_holding' => 'boolean',
        'is_active' => 'boolean',
        'trial_ends_at' => 'datetime',
        'current_period_end' => 'datetime',
        'suspended_at' => 'datetime',
        'max_employees' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Company $company) {
            if (empty($company->trial_ends_at) && empty($company->current_period_end) && !$company->is_holding) {
                $company->trial_ends_at = now()->addDays(14);
            }
        });
    }

    public function branches(): HasMany
    {
        return $this->hasMany(Branch::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'company_user')
            ->withPivot(['role', 'branch_id', 'is_primary'])
            ->withTimestamps();
    }

    public function parentCompany(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'parent_company_id');
    }

    public function subsidiaries(): HasMany
    {
        return $this->hasMany(Company::class, 'parent_company_id');
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function designations(): HasMany
    {
        return $this->hasMany(Designation::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    public function subscriptionInvoices(): HasMany
    {
        return $this->hasMany(SubscriptionInvoice::class);
    }

    public function subscriptionState(): string
    {
        if ($this->is_holding) {
            return 'active';
        }

        if ($this->subscription_status === 'suspended') {
            return 'suspended';
        }

        $now = now();

        if ($this->current_period_end && $now->lte($this->current_period_end)) {
            return 'active';
        }

        // Grace period 3 days after current_period_end
        if ($this->current_period_end && $now->lte($this->current_period_end->copy()->addDays(3))) {
            return 'grace';
        }

        $trialEnd = $this->trial_ends_at ?? ($this->created_at ? $this->created_at->copy()->addDays(14) : $now->copy()->addDays(14));
        if ($now->lte($trialEnd)) {
            return 'trial';
        }

        return 'expired';
    }

    public function daysLeft(): int
    {
        if ($this->is_holding) {
            return 999;
        }

        $now = now();
        $state = $this->subscriptionState();

        if ($state === 'active') {
            return max(0, (int) ceil($now->diffInDays($this->current_period_end, false)));
        }

        if ($state === 'grace') {
            return max(0, (int) ceil($now->diffInDays($this->current_period_end->copy()->addDays(3), false)));
        }

        if ($state === 'trial') {
            $trialEnd = $this->trial_ends_at ?? ($this->created_at ? $this->created_at->copy()->addDays(14) : $now->copy()->addDays(14));
            return max(0, (int) ceil($now->diffInDays($trialEnd, false)));
        }

        return 0;
    }

    public function isSuspended(): bool
    {
        return $this->subscriptionState() === 'suspended';
    }

    public function canAccessHrm(): bool
    {
        return in_array($this->subscriptionState(), ['active', 'trial', 'grace']);
    }
}
