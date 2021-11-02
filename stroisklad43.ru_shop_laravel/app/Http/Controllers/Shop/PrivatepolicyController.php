<?php

namespace App\Http\Controllers\Shop;

use App\Models\Image;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Catalog\CatalogService;
use Illuminate\Support\Facades\DB;

class PrivatepolicyController extends Controller
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
            'shop2.privatepolicy',[]
        );
    }
}
