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

class CatalogController extends Controller
{
    /**
     * @var CategoryRepository
     */
    private $categoryRepository;
    /**
     * @var ProductRepository
     */
    private $productRepository;
    /**
     * @var ProductTypeRepository
     */
    private $productTypeRepository;
    /**
     * @var BrandRepository
     */
    private $brandRepository;
    /**
     * @var PropsRepository
     */
    private $propsRepository;
    /**
     * @var ServicesRepository
     */
    private $servicesRepository;
    /**
     * @var ReviewsRepository
     */
    private $reviewsRepository;

    /**
     * @var CatalogService
     */
    private $catalogService;

    /**
     * CategoryController constructor.
     * @param CategoryRepository $categoryRepository
     * @param ProductRepository $productRepository
     * @param ProductTypeRepository $productTypeRepository
     * @param BrandRepository $brandRepository
     * @param PropsRepository $propsRepository
     * @param CatalogService $catalogService
     * @param ServicesRepository $servicesRepository
     * @param ReviewsRepository $reviewsRepository
     */
    public function __construct(
        CategoryRepository $categoryRepository,
        ProductRepository $productRepository,
        ProductTypeRepository $productTypeRepository,
        BrandRepository $brandRepository,
        PropsRepository $propsRepository,
        CatalogService $catalogService,
        ServicesRepository $servicesRepository,
        ReviewsRepository $reviewsRepository
    ) {
        $this->categoryRepository = $categoryRepository;
        $this->productRepository = $productRepository;
        $this->productTypeRepository = $productTypeRepository;
        $this->brandRepository = $brandRepository;
        $this->propsRepository = $propsRepository;
        $this->catalogService = $catalogService;
        $this->servicesRepository = $servicesRepository;
        $this->reviewsRepository = $reviewsRepository;
    }

    /**
     * @param string $slug
     * @param Request $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     * @throws \Throwable
     */
    public function show(string $slug, Request $request)
    {
        $category = DB::table('categories')->where('slug', '=', $slug)->first();

        if (is_null($category)) {
            abort(404, "product not found");
        }

        $categoryBanner = DB::table('banners')->where('imageable_id', '=', $category->id)->first();
        $productsIds = DB::table('category_product')->where('category_id', '=', $category->id)->get(['id', 'product_id']);
        $productsIdsArray = [];

        foreach ($productsIds as $item) {
            $productsIdsArray[] = $item->product_id;
        }

        $productsItems = DB::table('products')->whereIn('id', $productsIdsArray)->where('disable', '=', '0')->get()->toArray();
        $img = Image::All();

        foreach ($productsItems as $key => $val) {
            foreach ($img as $item) {
                if (($val->id === $item->imageable_id) && ($item->imageable_type === 'App\Models\Product')) {
                    $productsItems[$key]->img = $item->name;
                }
            }
        }

        if ( is_object($categoryBanner) ) {
            $categoryBannerPath = '/storage/' . $categoryBanner->path . '/' . $categoryBanner->name;
        } else {
            $categoryBannerPath = '';   
        }

        $otherProducts = $this->productRepository->getRandomInQuantity();
        foreach ($otherProducts as $key => $val) {
            foreach ($img as $item) {
                if (($val->id === $item->imageable_id) && ($item->imageable_type === 'App\Models\Product')) {
                    $otherProducts[$key]['img'] = $item->name;
                }
            }
        }

        
        $services = $this->servicesRepository->getAll();
        foreach ($services as $key => $val) {
            foreach ($img as $item) {
                if (($val->id === $item->imageable_id) && ($item->imageable_type === 'App\Models\Services')) {
                    $services[$key]->img = $item->name;
                }
            }
        }

        $reviews = $this->reviewsRepository->getAll();
        foreach ($reviews as $key => $val) {
            foreach ($img as $item) {
                if (($val->id === $item->imageable_id) && ($item->imageable_type === 'App\Models\Reviews')) {
                    $reviews[$key]->img = $item->name;
                }
            }
        }
        

        return view(
            'shop2.category', 
            [
                'products' => $productsItems, 
                'h2' => $category->altname, 
                'description' => $category->description,
                'name' => $category->name,
                'banner' => $categoryBannerPath,
                'services' => $services,
                'reviews' => $reviews,
                'otherProducts' => $otherProducts
            ]
        );
    }

    /**
     * Render Catalog page filter after ajax request
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Throwable
     */

    public function catalogRender(Request $request)
    {
        $filters = $this->prepareCatalogFilter($request, $request->slug);
        $products = $this->catalogService->getProducts($filters);

        $getProducts = view('shop.category.list', compact(
            'products'
        ))->render();

        return response()->json($getProducts);
    }
    /**
     * Catalog page (/catalog)
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function showCatalog()
    {
        return view('shop.category.catalog_page');
    }

    /**
     * @param Request $request
     * @param string $slug
     * @return array
     */
    public function prepareCatalogFilter(Request $request, string $slug): array
    {
        $filters = $request->all();
        $filters['product_type'] = $slug;

        return $filters;
    }
}
