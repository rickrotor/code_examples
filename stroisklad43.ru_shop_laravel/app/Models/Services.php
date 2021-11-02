<?php

namespace App\Models;

use App\Http\Traits\HasImages;
use Illuminate\Database\Eloquent\Model;

class Services extends Model
{
    use HasImages;

    protected $fillable = [
        'name', 'description', 'price', 'sort'
    ];

    public function services()
    {
        return $this->belongsToMany(Services::class);
    }
    
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
}
