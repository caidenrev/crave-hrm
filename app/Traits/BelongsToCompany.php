<?php

namespace App\Traits;

use App\Models\Company;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class BelongsToCompanyScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (session()->has('active_company_id')) {
            $builder->where($model->qualifyColumn('company_id'), session('active_company_id'));
        }
    }
}

trait BelongsToCompany
{
    public static function bootBelongsToCompany(): void
    {
        static::addGlobalScope(new BelongsToCompanyScope());

        static::creating(function ($model) {
            if (empty($model->company_id) && session()->has('active_company_id')) {
                $model->company_id = session('active_company_id');
            }
        });
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
