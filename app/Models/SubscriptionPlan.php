<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'months',
        'price',
        'original_price',
        'discount_pct',
        'label',
        'description',
        'is_active',
    ];

    protected $casts = [
        'months' => 'integer',
        'price' => 'integer',
        'original_price' => 'integer',
        'discount_pct' => 'integer',
        'is_active' => 'boolean',
    ];
}
