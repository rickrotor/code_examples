<?php

namespace App\Services\Reviews;

use App\Models\Reviews;
use App\Repositories\Reviews\ReviewsRepository;

class ReviewsService
{
    /**
     * @var Reviews
     */
    private $reviewsModel;
    /**
     * @var ReviewsRepository
     */
    public $repository;


    /**
     * ProductService constructor.
     * @param Reviews $reviewsModel
     * @param ReviewsRepository $reviewsRepository
     */
    public function __construct(Reviews $reviewsModel, ReviewsRepository $reviewsRepository)
    {
        $this->reviewsModel = $reviewsModel;
        $this->repository = $reviewsRepository;
    }

    /**
     * Adds new product with relations
     * @param array $attributes
     * @return bool
     */
    public function add(array $attributes): bool
    {
        $createdCategory = $this->reviewsModel->fill($attributes);
        $createdCategory->save();

        if(isset($attributes['image'])) {
            $createdCategory->addReviewsImage($attributes['image']);
        }

        return true;
    }

    /**
     * @param int $id
     * @param array $attributes
     * @return bool
     */
    public function update(int $id, array $attributes): bool
    {
        /** @var Category $updatedCategory */
        $updatedCategory = $this->reviewsModel->find($id);
        $updatedCategory->fill($attributes);
        $updatedCategory->save();

        if(isset($attributes['image'])) {
            $updatedCategory->addReviewsImage($attributes['image']);
        }

        return true;
    }

    /**
     * @param int $id
     * @return bool
     */
    public function destroy(int $id): bool
    {
        $reviewsToDelete = $this->reviewsModel->findOrFail($id);
        $reviewsToDelete->delete();

        return true;
    }
}