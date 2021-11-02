<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Services\ServicesService;
use App\Http\Requests\Services\ServicesEditRequest;
use App\Http\Requests\Services\ServicesCreateRequest;

class ServicesController extends Controller
{

    /**
     * @var ServicesService
     */

    private $servicesService;

    public function __construct(ServicesService $servicesService)
    {
        $this->middleware(['auth', 'admin']);
        $this->servicesService = $servicesService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index()
    {
        $servicesShowList = $this->servicesService->repository->getPaginated();

        return view('admin.services.list', compact('servicesShowList'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $services = $this->servicesService->repository->getAll();

        return view('admin.services.create', compact('services'));
    }

    public function store(ServicesCreateRequest $request)
    {
        $attributes = $request->all();
        $this->servicesService->add($attributes);

        return redirect()->route('services.create')->with('status', 'Услуга добавлена!');
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $servicesForEdit = $this->servicesService->repository->getById($id);

        return view('admin.services.edit', compact('servicesForEdit'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ServicesEditRequest $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(ServicesEditRequest $request, $id)
    {
        $attributes = $request->all();
        $this->servicesService->update($id, $attributes);

        return redirect()->route('services.edit', $id)->with('status', 'Услуга обновлена!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->servicesService->destroy($id);

        return redirect()->route('services.index')->with('status', 'Услуга удалена!');
    }

}
