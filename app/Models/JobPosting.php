<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class JobPosting extends Model
{
    use HasFactory, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'branch_id',
        'department_id',
        'designation_id',
        'title',
        'slug',
        'employment_type',
        'workplace_type',
        'experience_level',
        'min_salary',
        'max_salary',
        'show_salary',
        'description',
        'requirements',
        'benefits',
        'vacancies_count',
        'deadline',
        'status',
    ];

    protected $casts = [
        'show_salary' => 'boolean',
        'min_salary' => 'decimal:2',
        'max_salary' => 'decimal:2',
        'deadline' => 'date',
        'vacancies_count' => 'integer',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($job) {
            if (empty($job->slug)) {
                $job->slug = Str::slug($job->title) . '-' . Str::lower(Str::random(6));
            }
        });
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

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

    public function candidates(): HasMany
    {
        return $this->hasMany(Candidate::class);
    }
}

