<?php


namespace App\Http\Controllers\Admin;


use App\Models\Image;
use Illuminate\Support\Facades\DB;

class OrderInfoController extends \App\Http\Controllers\Controller
{
    public function show($id)
    {
        $items = DB::table('order_items')
            ->join('products','order_items.product_id', '=', 'products.id')
            ->where('order_items.order_id', '=', $id)
            ->get();

        $img = Image::All();

        foreach ($items as $item_order) {
            foreach ($img as $item) {
                if (($item_order->id === $item->imageable_id) && ($item->imageable_type === 'App\Models\Product')) {
                    $item_order->img = $item->name;
                }
            }
        }

        return view('admin.order.oreder_info', ['order' => $items]);
    }
}
