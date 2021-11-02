<?php

namespace App\Http\Controllers\Shop;

use App\Models\Image;
use App\Services\Cart\CartService;
use App\Services\Cart\CartManager;
use App\Http\Controllers\Controller;
use App\Services\Product\ProductService;
use App\Repositories\Services\ServicesRepository;
use App\Repositories\Reviews\ReviewsRepository;
use App\Repositories\Cart\CartRepository;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{

    private $productService;
    /**
     * @var CartService
     */
    private $cartService;

    /**
     * @var ServicesRepository
     */
    private $servicesRepository;
    /**
     * @var ReviewsRepository
     */
    private $reviewsRepository;
    /**
     * @var CartRepository
     */
    private $repository;
    /**
     * @var CartManager
     */
    private $cartManager;

    /**
     * ProductController constructor.
     * @param ProductService $productService
     * @param CartService $cartService
     * @param CartManager $cartManager
     * @param ServicesRepository $servicesRepository
     * @param ReviewsRepository $reviewsRepository
     */
    public function __construct(
        ProductService $productService,
        CartService $cartService,
        CartManager $cartManager,
        ServicesRepository $servicesRepository,
        ReviewsRepository $reviewsRepository
    ) {
        $this->productService = $productService;
        $this->cartService = $cartService;
        $this->cartManager = $cartManager;
        $this->servicesRepository = $servicesRepository;
        $this->reviewsRepository = $reviewsRepository;
    }

    /**
     * Show detail product
     * @param string $productSlug
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function show(string $productSlug)
    {
        $product = $this->productService->repository->getBySlug(['props', 'productType'], $productSlug);

        if (is_null($product)) {
            abort(404, "product not found");
        }

        $parentCategory = DB::table('category_product')->where('product_id', '=', $product->id)->first();

        $categoryBanner = DB::table('banners')->where('imageable_id', '=', $parentCategory->category_id)->first();

        if ( is_object($categoryBanner) ) {
            $categoryBannerPath = '/storage/' . $categoryBanner->path . '/' . $categoryBanner->name;
        } else {
            $categoryBannerPath = '';   
        }

        $isInCart = $this->cartService->checkInCart($product);

        $img = Image::All();

        foreach ($img as $item) {
            if (($product->id === $item->imageable_id) && ($item->imageable_type === 'App\Models\Product')) {
                $product->img = $item->name;
            }
        }

        $cookie = isset($_COOKIE['order']) ? json_decode($_COOKIE['order']) : false;
        $basket = false;

        if ($cookie->products ?? false) {
            foreach ($cookie->products as $item) {
                if ($item[0] === $product->id) {
                    $basket = true;
                    break;
                }
            }
        }

        $sameCategoryProducts = DB::table('category_product')->where('category_id', '=', $parentCategory->category_id)->where('product_id', '!=', $product->id)->get(['id', 'product_id']);
        $sameCategoryProductsArray = [];

        foreach ($sameCategoryProducts as $item) {
            $sameCategoryProductsArray[] = $item->product_id;
        }

        $sameProducts = DB::table('products')->whereIn('id', $sameCategoryProductsArray)->where('disable', '=', '0')->get()->toArray();


        $products = $this->productService->repository->getRandomInQuantity();
        foreach ($products as $key => $val) {
            foreach ($img as $item) {
                if (($val->id === $item->imageable_id) && ($item->imageable_type === 'App\Models\Product')) {
                    $products[$key]['img'] = $item->name;
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

        return view('shop2.product', compact('product', 'isInCart', 'basket', 'services', 'reviews', 'categoryBannerPath', 'products', 'sameProducts'));
    }

    public function newSellers()
    {
        $newSeller = $this->productService->repository->getNewAll();
        return view('shop.newsellers.new_sellers', compact('newSeller'));
    }
}
