<?php

namespace App\Repositories\Reviews;

use App\Models\Reviews;
use App\Repositories\AbstractRepository;

class EloquentReviewsRepository extends AbstractRepository implements ReviewsRepository
{
    /**
     * @var Reviews
     */
    private $model;

    /**
     * EloquentProductRepository constructor.
     * @param Reviews $reviews
     */
    public function __construct(Reviews $reviews)
    {
        $this->model = $reviews;
        parent::__construct($reviews);
    }

    /**
     * @param array $relations
     * @return mixed
     */
    public function getAll($relations = [])
    {
        return $this->model->with($relations)->get();
    }

    /**
     * @param array $relations
     * @param int $perPage
     * @return mixed
     */
    public function getPaginated($relations = [], $perPage = 15)
    {
        return $this->model->with($relations)->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get reviews where slug
     * @param string $slug
     * @return mixed
     */
    public function getBySlug(string $slug)
    {
        return $this->model->where('slug', '=', $slug)->first();
    }

    /**
     * @param array $relations
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getAllWithCount($relations = [])
    {
        return $this->model
            ->newQuery()
            ->withCount($relations)
            ->get();
    }
}