<?php

namespace App\Models;

use App\Http\Traits\HasImages;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasImages;

    protected $fillable = [
        'name', 'description', 'disable', 'sort', 'slug', 'altname'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
    
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    public function banners()
    {
        return $this->morphMany(Banner::class, 'imageable');
    }
}
