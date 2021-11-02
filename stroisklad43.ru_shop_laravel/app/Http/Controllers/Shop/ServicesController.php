<?php

namespace App\Http\Controllers\Shop;

use stdClass;
use App\Mail\ServiceMailer;
use App\Models\Image;
use App\Http\Controllers\Controller;
use App\Repositories\Services\ServicesRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; 
use Illuminate\Support\Facades\Mail;

class ServicesController extends Controller
{
    /**
     * @var ServicesRepository
     */
    private $servicesRepository;

    /**
     * ServicesController constructor.
     * @param ServicesRepository $servicesRepository
     */
    public function __construct(
        ServicesRepository $servicesRepository
    ) {
        $this->servicesRepository = $servicesRepository;
    }

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     * @throws \Throwable
     */
    public function show(Request $request)
    {
        $services = $this->servicesRepository->getAll();
        $img = Image::All();

        foreach ($services as $key => $val) {
            foreach ($img as $item) {
                if (($val->id === $item->imageable_id) && ($item->imageable_type === 'App\Models\Services')) {
                    $services[$key]->img = $item->name;
                }
            }
        }

        return view(
            'shop2.services', 
            [
                'services' => $services
            ]
        );
    }

    public function sendServiceRequest()
    {
        $data = new stdClass();
        $data->name = $_POST['name'];
        $data->email = $_POST['email'];
        $data->phone = $_POST['phone'];
        $data->service_type = $_POST['service_type'];

        Mail::to('stroiskladstroi@yandex.ru')->bcc('rickrotor@mail.ru')->send(new ServiceMailer($data));

        return 'true';
    }
}
