<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Reviews\ReviewsService;
use App\Http\Requests\Reviews\ReviewsEditRequest;
use App\Http\Requests\Reviews\ReviewsCreateRequest;

class ReviewsController extends Controller
{

    /**
     * @var ReviewsService
     */

    private $reviewsService;

    public function __construct(ReviewsService $reviewsService)
    {
        $this->middleware(['auth', 'admin']);
        $this->reviewsService = $reviewsService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index()
    {
        $reviewsShowList = $this->reviewsService->repository->getPaginated();

        return view('admin.reviews.list', compact('reviewsShowList'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $reviews = $this->reviewsService->repository->getAll();

        return view('admin.reviews.create', compact('reviews'));
    }

    public function store(ReviewsCreateRequest $request)
    {
        $attributes = $request->all();
        $this->reviewsService->add($attributes);

        return redirect()->route('reviews.create')->with('status', 'Услуга добавлена!');
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $reviewsForEdit = $this->reviewsService->repository->getById($id);

        return view('admin.reviews.edit', compact('reviewsForEdit'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ReviewsEditRequest $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(ReviewsEditRequest $request, $id)
    {
        $attributes = $request->all();
        $this->reviewsService->update($id, $attributes);

        return redirect()->route('reviews.edit', $id)->with('status', 'Услуга обновлена!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->reviewsService->destroy($id);

        return redirect()->route('reviews.index')->with('status', 'Услуга удалена!');
    }

}
