<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformanceReview extends Model
{
    use HasFactory, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'employee_id',
        'reviewer_id',
        'reviewer_type',
        'cycle_name',
        'status',
        'score_technical',
        'score_communication',
        'score_initiative',
        'score_problem_solving',
        'score_integrity',
        'overall_score',
        'strengths',
        'improvements',
        'completed_at',
    ];

    protected $casts = [
        'score_technical' => 'float',
        'score_communication' => 'float',
        'score_initiative' => 'float',
        'score_problem_solving' => 'float',
        'score_integrity' => 'float',
        'overall_score' => 'float',
        'completed_at' => 'datetime',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'reviewer_id');
    }
}
