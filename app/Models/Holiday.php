<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Holiday extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name',
        'date',
        'type',
        'description',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function scopeForActiveCompany(Builder $query): Builder
    {
        if (session()->has('active_company_id')) {
            return $query->where(function ($q) {
                $q->whereNull('company_id')
                  ->orWhere('company_id', session('active_company_id'));
            });
        }

        return $query;
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
