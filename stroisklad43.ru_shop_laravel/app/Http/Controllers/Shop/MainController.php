<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Repositories\Pages\PagesRepository;
use App\Repositories\Product\ProductRepository;
use App\Repositories\Category\CategoryRepository;
use App\Repositories\Reviews\ReviewsRepository;
use App\Models\Image;
use Illuminate\Support\Facades\DB;

class MainController extends Controller
{
    /**
     * @var ProductRepository
     */
    private $productRepository;
    /**
     * @var PagesRepository
     */
    private $pagesRepository;
    /**
     * @var ReviewsRepository
     */
    private $reviewsRepository;


    /**
     * MainController constructor.
     * @param ProductRepository $productRepository
     * @param PagesRepository $pagesRepository
     * @param ReviewsRepository $reviewsRepository
     */
    public function __construct(ProductRepository $productRepository, PagesRepository $pagesRepository, CategoryRepository $categoryRepository, ReviewsRepository $reviewsRepository)
    {
        $this->productRepository = $productRepository;
        $this->pagesRepository = $pagesRepository;
        $this->categoryRepository = $categoryRepository;
        $this->reviewsRepository = $reviewsRepository;
    }


    public function index() {

        $img = Image::All();
        $category = $this->categoryRepository->getAll();
        //$products = $this->productRepository->getAll();
        $products = DB::table('products')->where('disable', '=', '0')->get()->toArray();
        //$about = $this->pagesRepository->getById('3');

        foreach ($category as $key => $val) {
            foreach ($img as $item) {
                if (($val->id === $item->imageable_id) && ($item->imageable_type === 'App\Models\Category')) {
                    $category[$key]['img'] = $item->name;
                }
            }
        }

        foreach ($products as $product) {
            foreach ($img as $item) {
                if (($product->id === $item->imageable_id) && ($item->imageable_type === 'App\Models\Product')) {
                    $product->img = $item->name;
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

        return view('shop2.index', ['category' => $category, 'products' => $products, 'reviews' => $reviews]);
        //return view('shop.layouts.main_products', compact('products', 'about'));
    }
}
