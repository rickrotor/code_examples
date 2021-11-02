<?php

namespace App\Http\Controllers\Shop;

use App\Models\Image;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Catalog\CatalogService;
use App\Repositories\Props\PropsRepository;
use App\Repositories\Brand\BrandRepository;
use App\Repositories\Product\ProductRepository;
use App\Repositories\Category\CategoryRepository;
use App\Repositories\ProductType\ProductTypeRepository;
use App\Repositories\Services\ServicesRepository;
use App\Repositories\Reviews\ReviewsRepository;
use Illuminate\Support\Facades\DB;

class PublicofferController extends Controller
{


    /**
     * @var CatalogService
     */
    private $catalogService;

    /**
     * CategoryController constructor.
     */
    public function __construct(

    ) {

    }

    /**
     * @param string $slug
     * @param Request $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     * @throws \Throwable
     */
    public function show()
    {
        return view(
            'shop2.publicoffer',[]
        );
    }
}
