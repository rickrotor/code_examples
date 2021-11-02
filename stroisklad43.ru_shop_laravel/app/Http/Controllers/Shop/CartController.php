<?php

namespace App\Http\Controllers\Shop;

use stdClass;
use App\Models\Image;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use App\Services\Cart\CartService;
use App\Services\Cart\CartRbs;
use App\Services\Cart\CartRbsdiscount;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Mail\OrderMailer;
use App\Mail\OrderToClientMailer;
use Illuminate\Support\Facades\Mail;
use App\Services\Order\OrderDocService;
use Illuminate\Http\RedirectResponse;

class CartController extends Controller
{
    private $rbs;

    private $cartService;

    private $pay_type;

    private $pay_type_text;

    private $pay_agent;

    private $return_url = 'https://stroisklad43.ru/order_info';

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Show cart page
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function showCart()
    {
        $cart = $this->cartService->showCart();

        return view('shop.cart.cart', ['cart' => $cart]);
    }

    /**
     * Add product to cart
     *
     * @param Request $request
     */
    public function addToCart(Request $request)
    {
        $quantity = $request->get('quantity');
        $productId = $request->get('product_id');

        $this->cartService->add($productId, $quantity);

    }

    /**
     * Delete product from cart
     *
     * @param Request $request
     */
    public function destroyInCart(Request $request)
    {
        $productId = $request->get('id');
        $this->cartService->destroy($productId);
    }

    /**
     * Edit product in cart (change quantity)
     *
     * @param Request $request
     */
    public function editCart(Request $request)
    {
        $quantity = $request->get('quantity');
        $productId = $request->get('product_id');

        $this->cartService->add($productId, $quantity);
    }


    /**
     * Получаем товары заказа
     */
    public function getOrder()
    {
        if( isset($_POST['products']) ){
            $products = $_POST['products'];
        } else {
            die();
        }

        $product_collection = [];

        $img = Image::All();

        foreach ($products as $key => $val) {
            $product_info = DB::table('products')->where('id', '=', $key)->first();

            foreach ($img as $item) {
                if (($product_info->id === $item->imageable_id) && ($item->imageable_type === 'App\Models\Product')) {
                    $product_info->img = $item->name;
                }
            }

            $product_info->count = $val;

            $product_collection[] = $product_info;
        }

        if(!$product_collection){
            die();
        }

        return view('shop2.get_order', compact('product_collection'));
        //return response()->json($product_collection, 200);
    }

    /**
     * Создаем заказ и выполняем обработку заказа
     */
    public function addOrder(Request $request)
    {
        //проверяем параметры с методом оплаты и товарами
        if (!isset($_POST['pay_type'])) {
            return 'false';
        }

        $this->pay_type = $_POST['pay_type'];
        $this->pay_type_text = $_POST['pay_type_text'];
        $this->pay_agent = $_POST['pay_agent'];

        if(!isset($_POST['products'])){
            return 'false';
        } else {
            $products = $_POST['products'];
        }

        //создаем новый заказ
        $model = new Order();
        $model->number = md5($request->name.$request->phone);
        $model->status_id = 1;
        $model->email = $request->email;
        $model->name = $request->name;
        $model->surname = 'empty';
        $model->patronymic = 'empty';
        $model->tel = $request->phone;
        $model->country = 'empty';
        $model->city = 'empty';
        $model->street = 'empty';
        $model->house = 'empty';
        $model->apartment = 'empty';
        $model->total_price = 0;
        $model->pay_type = $this->pay_type_text;
        $model->pay_agent = $this->pay_agent;

        if ($model->save()) {

            $idOrder = $model->id;

            $totalOrderPrice = 0;

            $order_products = array();

            //создаем товары заказа
            foreach ($products as $product_id => $product_count) {
                if(!$product_count){
                    continue;
                }

                $product_count = (int)$product_count;
                
                $productDB = DB::table('products')->where('id', '=', $product_id)->first();

                $modelItems = new OrderItem();
                $modelItems->order_id = $idOrder;
                $modelItems->product_id = $product_id;
                $modelItems->price = $productDB->price;
                $modelItems->total_price = $productDB->price * $product_count;
                $modelItems->quantity = $product_count;                
                $modelItems->name = $productDB->name;
                $modelItems->metric_name = $productDB->metric_name;

                $order_products[$product_id]['id'] = $product_id;
                $order_products[$product_id]['name'] = $productDB->name;
                $order_products[$product_id]['price'] = $productDB->price;
                $order_products[$product_id]['count'] = $product_count;
                $order_products[$product_id]['measure'] = $productDB->metric_name;

                $modelItems->save();
            }

            //берем данные пользователя
            $customerEmail = $_POST['email'];
            $customerPhone = $_POST['phone'];

            if(isset($customerPhone) && $customerPhone != ''){
                $customerPhone = str_replace(array('+', '(', ')', '-', ' '), '', $customerPhone);
            } else {
                $customerPhone = '';
            }

            //выбираем метод обработки заказа в зависимости от типа оплаты
            if($this->pay_type == 'bank'){
                $response = $this->payment($idOrder, $customerEmail, $customerPhone, $order_products);                
            } elseif($this->pay_type == 'urlica') {
                $response = array(
                    'formUrl' => $this->return_url . '?free=true&doc=true&orderId=' . $idOrder . '&lang=ru'
                );
            } else {
                $response = array(
                    'formUrl' => $this->return_url . '?free=true&orderId=' . $idOrder . '&lang=ru'
                );
            }
            

            //если все ок возвращаем ссылку с переходом на оплату или подтверждение заказа
            if(!$response){
                return 'false';
            } else {
                return $response;
            }
        } else {
            return 'false';
        }

    }


    /**
     * Регистрация заказа.
     * Переадресация покупателя при успешной регистрации.
     * Вывод ошибки при неуспешной регистрации.
     */
    public function payment($idOrder, $customerEmail, $customerPhone, $order_products)
    {

        // for config settings
        $this->initializeRbs();
        
        $order_number = (int)$idOrder;

        $return_url = $this->return_url;

        // here we will collect data for orderBundle
        $orderBundle = [];

        $orderBundle['customerDetails'] = array(
            'email' => $customerEmail,
            'phone' => $customerPhone
        );

        $cart_id = 1;
        $order_amount = 0;

        // ITEMS
        foreach ($order_products as $product) {
            $tax_type = 0;
            $tax_sum = 0;

            $item_count = (int)$product['count'];
            $item_price =  round($product['price'] * 100);
            $item_amount = $item_price * $item_count;
            $order_amount += $item_amount;

            $product_data = array(
                'positionId' => $cart_id,
                'name' => $product['name'],
                'quantity' => array(
                    'value' => $product['count'],
                    'measure' => $product['measure'],
                ),
                'itemAmount' => $item_amount,
                'itemCode' => $product['id'] . "_" . $cart_id,
                'tax' => array(
                    'taxType' => $tax_type,
                    'taxSum' => $tax_sum
                ),
                'itemPrice' => $item_price,
            );

            // FFD 1.05 added
            if ($this->rbs->getFFDVersion() == 'v105') {

                $attributes = array();
                $attributes[] = array(
                    "name" => "paymentMethod",
                    "value" => $this->rbs->getPaymentMethodType()
                );
                $attributes[] = array(
                    "name" => "paymentObject",
                    "value" => $this->rbs->getPaymentObjectType()
                );

                $product_data['itemAttributes']['attributes'] = $attributes;
            }

            $orderBundle['cartItems']['items'][] = $product_data;

            $cart_id += 1;
        }

        $currency_code = $this->rbs->currency_code2num['RUB'];
        
        $response = $this->rbs->register_order($order_number, $order_amount, $return_url, $currency_code, $orderBundle);

        if (isset($response['errorCode'])) {
            return false;
        } else {
            return $response;
        }

    }

    /**
     * Инициализация библиотеки RBS
     */
    private function initializeRbs()
    {
        $this->rbs = new CartRbs();
        $this->rbs->login = 'pusto';
        $this->rbs->password = 'pusto';
        $this->rbs->stage = 'one';
        $this->rbs->mode = 'test';
        $this->rbs->logging = '1';
        $this->rbs->currency = '643';
        $this->rbs->taxSystem = '1';
        $this->rbs->taxType = '0';
        $this->rbs->ofd_status = '1';

        $this->rbs->ffd_version = 'v105';
        $this->rbs->paymentMethodType = '1';
        $this->rbs->deliveryPaymentMethodType = '1';
        $this->rbs->paymentObjectType = '1';
        $this->rbs->language = "ru";
    }

    /**
     * Колбек для возвращения покупателя из ПШ в магазин.
     */
    public function callback()
    {   
        //Проверяем параметр с ид заказа
        if(!isset($_GET['orderId'])){
            return '';
        }

        $order_id = $_GET['orderId'];

        //проверяем, если заказ без оплаты, даем свои данные для обработки вместо данных банка
        if(isset($_GET['free']) && $_GET['free'] == 'true'){
            $response = array(
                'errorCode' => 0,
                'orderStatus' => 1,
                'orderNumber' => $order_id
            );
        } else {
            // for config settings
            $this->initializeRbs();

            $response = $this->rbs->get_order_status($order_id);
        }

        $title = '';
        $text = '';

        //если ошибок нет и заказ прошел, собираем данные заказа, отправляем уведомления и меняем статут заказа
        if(isset($response['errorCode']) && (int)$response['errorCode'] == 0 && (($response['orderStatus'] == 1) || ($response['orderStatus'] == 2))){
            $title = 'Ваш заказ принят!';
            $text = 'Если у Вас возникли вопросы, пожалуйста свяжитесь с нами.<br>Спасибо за покупки в нашем интернет-магазине!';

            $bank_order_number = $response['orderNumber'];

            $bank_order_number_split = explode('_', $bank_order_number);

            $response_order_id = $bank_order_number_split[0];

            $order_info = DB::table('orders')->where('id', '=', $response_order_id)->where('status_id', '=', '1')->first();

            if(!$order_info){
                return redirect()->route('shop.main');
            }

            $order_products_info = DB::table('order_items')->where('order_id', '=', $response_order_id)->get();

            $pay_agent = $order_info->pay_agent;

            if(isset($order_info) && $order_info->status_id == '1'){
                $file_path = '';

                //если есть параметр для создания pdf заказа, создаем
                if(isset($_GET['doc']) && $_GET['doc'] == 'true'){
                    $docCreater = new OrderDocService();
    
                    $file_path = $docCreater->createPdf($pay_agent, $order_products_info);
                }

                //установим значение статуса в оплачено(2)
                DB::table('orders')->where('id', $response_order_id)->update(['status_id' => 2]);

                //отправим на почту сообщение с информацией о клиенте и заказе
                $this->sendOrderMail($order_info, $order_products_info, $file_path);

                //отправим на почту клиенту сообщение с информацией о заказе
                $this->sendOrderMailToClient($order_info, $order_products_info, $file_path);

                if(file_exists($file_path)){
                    unlink($file_path);
                }
            }
        } else {
            $title = 'Ошибка';
            $text = 'Что-то пошло не так. Если у Вас возникли вопросы, пожалуйста свяжитесь с нами.';
        }

        return view('shop2.order_info', ['title' => $title, 'text' => $text]);
    }



    /**
     * Отправка сообщения о заказе владельцу.
     */
    public function sendOrderMail($order_info, $order_products_info, $file_path)
    {
        $data = new stdClass();
        $data->name = $order_info->name;
        $data->email = $order_info->email;
        $data->phone = $order_info->tel;
        $data->pay_type = $order_info->pay_type;
        $data->products = $order_products_info;

        Mail::to('stroiskladstroi@yandex.ru')->bcc('rickrotor@mail.ru')->send(new OrderMailer($data, $file_path));

        return 'true';
    }

    /**
     * Отправка сообщения о заказе клиенту.
     */
    public function sendOrderMailToClient($order_info, $order_products_info, $file_path)
    {
        $data = new stdClass();
        $data->pay_type = $order_info->pay_type;
        $data->products = $order_products_info;

        Mail::to($order_info->email)->send(new OrderToClientMailer($data, $file_path));

        return 'true';
    }
}
