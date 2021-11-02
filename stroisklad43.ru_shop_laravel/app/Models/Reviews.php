<?php

namespace App\Models;

use App\Http\Traits\HasImages;
use Illuminate\Database\Eloquent\Model;

class Reviews extends Model
{
    use HasImages;

    protected $fillable = [
        'name', 'description', 'sort', 'vk_link'
    ];

    public function reviews()
    {
        return $this->belongsToMany(Reviews::class);
    }
    
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
}
