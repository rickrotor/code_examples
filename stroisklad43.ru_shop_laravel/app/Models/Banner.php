<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Banner
 * @package App\Models
 */
class Banner extends Model
{
    protected $fillable = [
        'path', 'name', 'imageable_type', 'imageable_id',
    ];

    public function imageable()
    {
        return $this->morphTo();
    }

    public function getFullUrlAttribute()
    {
        return '/storage/' . $this->path . '/' . $this->name;
    }
}
