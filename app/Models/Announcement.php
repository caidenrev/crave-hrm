<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Announcement extends Model
{
    use HasFactory, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'title',
        'slug',
        'content',
        'category',
        'priority',
        'is_pinned',
        'published_at',
        'author_id',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'published_at' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->title) . '-' . Str::random(5);
            }
            if (empty($model->published_at)) {
                $model->published_at = now()->toDateString();
            }
        });
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
