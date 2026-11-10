<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class, 'company_user')
            ->withPivot(['role', 'branch_id', 'is_primary'])
            ->withTimestamps();
    }

    public function currentCompany(): ?Company
    {
        $activeCompanyId = session('active_company_id');

        if ($activeCompanyId) {
            $company = $this->companies()->where('companies.id', $activeCompanyId)->first();
            if ($company) {
                return $company;
            }
        }

        // Fallback to primary or first company
        $primary = $this->companies()->wherePivot('is_primary', true)->first() 
            ?? $this->companies()->first();

        if ($primary) {
            session(['active_company_id' => $primary->id]);
        }

        return $primary;
    }

    public function currentRole(): ?string
    {
        $company = $this->currentCompany();
        return $company?->pivot?->role ?? null;
    }

    public function hasRole(string|array $roles): bool
    {
        $currentRole = $this->currentRole();
        if (!$currentRole) {
            return false;
        }

        if (is_array($roles)) {
            return in_array($currentRole, $roles);
        }

        return $currentRole === $roles;
    }
}
