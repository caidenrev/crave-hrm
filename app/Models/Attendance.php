<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'employee_id',
        'shift_id',
        'branch_id',
        'date',
        'clock_in_time',
        'clock_out_time',
        'clock_in_lat',
        'clock_in_lng',
        'clock_in_ip',
        'clock_in_distance_meters',
        'clock_in_selfie_url',
        'clock_out_lat',
        'clock_out_lng',
        'clock_out_ip',
        'clock_out_distance_meters',
        'clock_out_selfie_url',
        'status',
        'geofence_status',
        'late_minutes',
        'early_leave_minutes',
        'work_duration_minutes',
        'notes',
        'is_corrected',
        'correction_reason',
        'corrected_by',
    ];

    protected $casts = [
        'date' => 'date',
        'clock_in_lat' => 'decimal:8',
        'clock_in_lng' => 'decimal:8',
        'clock_out_lat' => 'decimal:8',
        'clock_out_lng' => 'decimal:8',
        'clock_in_distance_meters' => 'integer',
        'clock_out_distance_meters' => 'integer',
        'late_minutes' => 'integer',
        'early_leave_minutes' => 'integer',
        'work_duration_minutes' => 'integer',
        'is_corrected' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function correctedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'corrected_by');
    }
}
