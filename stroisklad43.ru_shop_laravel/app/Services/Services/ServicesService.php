<?php

namespace App\Services\Services;

use App\Models\Services;
use App\Repositories\Services\ServicesRepository;

class ServicesService
{
    /**
     * @var Services
     */
    private $servicesModel;
    /**
     * @var ServicesRepository
     */
    public $repository;


    /**
     * ProductService constructor.
     * @param Services $servicesModel
     * @param ServicesRepository $servicesRepository
     */
    public function __construct(Services $servicesModel, ServicesRepository $servicesRepository)
    {
        $this->servicesModel = $servicesModel;
        $this->repository = $servicesRepository;
    }

    /**
     * Adds new product with relations
     * @param array $attributes
     * @return bool
     */
    public function add(array $attributes): bool
    {
        $createdCategory = $this->servicesModel->fill($attributes);
        $createdCategory->save();

        if(isset($attributes['image'])) {
            $createdCategory->addServicesImage($attributes['image']);
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
        $updatedCategory = $this->servicesModel->find($id);
        $updatedCategory->fill($attributes);
        $updatedCategory->save();

        if(isset($attributes['image'])) {
            $updatedCategory->addServicesImage($attributes['image']);
        }

        return true;
    }

    /**
     * @param int $id
     * @return bool
     */
    public function destroy(int $id): bool
    {
        $servicesToDelete = $this->servicesModel->findOrFail($id);
        $servicesToDelete->delete();

        return true;
    }
}