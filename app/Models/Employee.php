<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use HasFactory, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'branch_id',
        'department_id',
        'designation_id',
        'default_shift_id',
        'user_id',
        'nik',
        'nama_lengkap',
        'email',
        'nomor_telepon',
        'tanggal_lahir',
        'jenis_kelamin',
        'tanggal_masuk',
        'status_kerja',
        'ptkp_status',
        'bank_name',
        'bank_account_number',
        'gaji_pokok',
        'avatar_url',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'tanggal_lahir' => 'date',
        'tanggal_masuk' => 'date',
        'gaji_pokok' => 'decimal:2',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function designation(): BelongsTo
    {
        return $this->belongsTo(Designation::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function defaultShift(): BelongsTo
    {
        return $this->belongsTo(Shift::class, 'default_shift_id');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveBalances(): HasMany
    {
        return $this->hasMany(LeaveBalance::class);
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function overtimes(): HasMany
    {
        return $this->hasMany(Overtime::class);
    }

    public function reimbursements(): HasMany
    {
        return $this->hasMany(Reimbursement::class);
    }

    public function visits(): HasMany
    {
        return $this->hasMany(Visit::class);
    }

    public function canteenVouchers(): HasMany
    {
        return $this->hasMany(CanteenVoucher::class);
    }

    public function getNameAttribute(): ?string
    {
        return $this->nama_lengkap;
    }

    public function getAvatarAttribute(): ?string
    {
        return $this->avatar_url;
    }
}
