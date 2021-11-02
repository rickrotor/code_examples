<?php

namespace App\Http\Controllers\Admin;

use App\Models\Banner;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class BannersController extends Controller
{
    public function destroy(Request $request)
    {
        $banner = Banner::find($request->get('id'));

        //dd($image);
        Storage::disk('public')->delete("{$banner->path}/{$banner->name}");
       // Storage::delete('storage/app/public/images/products/3c5820dc16c7429ba70641f100eb6e6a1544428779.jpg');
        $banner->delete();

        return response([
            'success' => true
        ]);
    }
}