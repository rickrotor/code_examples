<?php

namespace App\Http\Traits;

use App\Models\Image;
use Illuminate\Support\Facades\Storage;

trait HasImages
{
    /**
     * Product Images relation
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    public function banners()
    {
        return $this->morphMany(Banner::class, 'imageable');
    }

    public function addImages(array $images)
    {
        /** @var UploadedFile $image */
        foreach ($images as $image) {
            $path  = "images/products";
            $imageName = md5($image->getClientOriginalName()) . time() . '.' . $image->getClientOriginalExtension();

            $this->saveToRelations($imageName, $path);
            $this->saveToStorage($path, $image, $imageName);
        }
    }

    public function addSingleImage($image)
    {
        $path  = "images/categories";
        $imageName = md5($image->getClientOriginalName()) . time() . '.' . $image->getClientOriginalExtension();

        $this->saveToRelations($imageName, $path);
        $this->saveToStorage($path, $image, $imageName);
    }

    public function addServicesImage($image)
    {
        $path  = "images/services";
        $imageName = md5($image->getClientOriginalName()) . time() . '.' . $image->getClientOriginalExtension();

        $this->saveToRelations($imageName, $path);
        $this->saveToStorage($path, $image, $imageName);
    }

    public function addReviewsImage($image)
    {
        $path  = "images/reviews";
        $imageName = md5($image->getClientOriginalName()) . time() . '.' . $image->getClientOriginalExtension();

        $this->saveToRelations($imageName, $path);
        $this->saveToStorage($path, $image, $imageName);
    }

    public function addSingleBanner($image)
    {
        $path  = "images/banners";
        $imageName = md5($image->getClientOriginalName()) . time() . '.' . $image->getClientOriginalExtension();

        $this->saveToRelationsBanners($imageName, $path);
        $this->saveToStorage($path, $image, $imageName);
    }

    public function addBrandSingleImage($image)
    {
        $path  = "images/brands";
        $imageName = md5($image->getClientOriginalName()) . time() . '.' . $image->getClientOriginalExtension();

        $this->saveToRelations($imageName, $path);
        $this->saveToStorage($path, $image, $imageName);
    }

    /**
     * @param string $path
     * @param $image
     * @param $imageName
     */
    private function saveToStorage(string $path, $image, $imageName)
    {
        Storage::disk('public')->putFileAs($path, $image, $imageName);
    }

    /**
     * @param $imageName
     * @param string $path
     */
    private function saveToRelations($imageName, string $path)
    {
        $this->images()->updateOrCreate([
            "name" => $imageName,
            "path" => $path
        ]);
    }
    
    private function saveToRelationsBanners($imageName, string $path)
    {
        $this->banners()->updateOrCreate([
            "name" => $imageName,
            "path" => $path
        ]);
    }

    public function getThumbnailAttribute()
    {
        $imageForThumbnail = $this->images->first();

        return ($imageForThumbnail) ? $imageForThumbnail->fullUrl : null;
    }
}