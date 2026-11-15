<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Candidate extends Model
{
    use HasFactory, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'job_posting_id',
        'full_name',
        'email',
        'phone',
        'current_company',
        'current_title',
        'linkedin_url',
        'portfolio_url',
        'resume_path',
        'cover_letter',
        'source',
        'stage',
        'rating',
        'interview_notes',
        'interview_scheduled_at',
        'interview_meeting_link',
        'offered_salary',
        'rejection_reason',
        'is_converted_to_employee',
        'employee_id',
        'hired_at',
    ];

    protected $casts = [
        'is_converted_to_employee' => 'boolean',
        'offered_salary' => 'decimal:2',
        'rating' => 'integer',
        'interview_scheduled_at' => 'datetime',
        'hired_at' => 'date',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}

