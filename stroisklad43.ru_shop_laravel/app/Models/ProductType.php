<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ProductType
 * @package App\Models
 */
class ProductType extends Model
{
    protected $fillable = [
        'name', 'slug'
    ];

    protected $table = 'categories';

    /**
     * Product relation
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function product()
    {
        return $this->hasMany(Product::class, 'type_id');
    }

    /**
     * Product properties relation
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function productProps()
    {
        return $this->belongsTo(Props::class);
    }
}
