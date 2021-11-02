<?php

namespace App\Http\Controllers\Shop;

use App\Models\Image;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Reviews\ReviewsRepository;
use Illuminate\Support\Facades\DB; 

class ReviewsController extends Controller
{
    /**
     * @var ReviewsRepository
     */
    private $reviewsRepository;

    /**
     * ReviewsController constructor.
     * @param ReviewsRepository $reviewsRepository
     */
    public function __construct(
        ReviewsRepository $reviewsRepository
    ) {
        $this->reviewsRepository = $reviewsRepository;
    }

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     * @throws \Throwable
     */
    public function show(Request $request)
    {
        $reviews = $this->reviewsRepository->getAll();
        $img = Image::All();

        foreach ($reviews as $key => $val) {
            foreach ($img as $item) {
                if (($val->id === $item->imageable_id) && ($item->imageable_type === 'App\Models\Reviews')) {
                    $reviews[$key]->img = $item->name;
                }
            }
        }

        return view(
            'shop2.reviews', 
            [
                'reviews' => $reviews
            ]
        );
    }
}
