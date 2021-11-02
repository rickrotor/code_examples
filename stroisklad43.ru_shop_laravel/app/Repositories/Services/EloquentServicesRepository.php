<?php

namespace App\Repositories\Services;

use App\Models\Services;
use App\Repositories\AbstractRepository;

class EloquentServicesRepository extends AbstractRepository implements ServicesRepository
{
    /**
     * @var Services
     */
    private $model;

    /**
     * EloquentProductRepository constructor.
     * @param Services $services
     */
    public function __construct(Services $services)
    {
        $this->model = $services;
        parent::__construct($services);
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
     * Get services where slug
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