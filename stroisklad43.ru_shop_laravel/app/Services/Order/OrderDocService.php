<?php

namespace App\Services\Order;

use App\Models\Cart;
use App\Models\Order;
use App\Models\CartItem;
use App\Models\OrderItem;
use Illuminate\Support\Collection;
use App\Repositories\Order\OrderRepository;
use Dompdf\Dompdf; 

class OrderDocService
{
    
    private $pay_agent;

    private $products;

    private $timestamp;

    /**
     * MainController constructor.
     */
    public function __construct()
    {
        
    }

    public function createPdf($pay_agent, $products) {
        $this->pay_agent = $pay_agent;
        $this->products = $products;
        
        $dompdf = new Dompdf(array('enable_remote' => true));

        $html = $this->renderHtml();

        $dompdf->loadHtml($html, 'UTF-8');
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        //создаем уникальное имя из ранд числа и даты
        $name_salt = random_int(100, 999);
        $name_date = date("d.m.Y", $this->timestamp);
        $name_date = str_replace('.', '', $name_date);
        $name_salt = $name_salt . '-' . $name_date;
        
        // Вывод файла в браузер:
        //$dompdf->stream('schet-10'); 
        
        // Или сохранение на сервере:
        $pdf = $dompdf->output();
        $file_path = $_SERVER['DOCUMENT_ROOT'] . '/public/storage/doc/schet-stroisklad-' . $name_salt . '.pdf';
        file_put_contents($file_path, $pdf);

        return $file_path;
    }

    // Форматирование цен.
    function format_price($value)
    {
        return number_format($value, 2, ',', ' ');
    }
    
    // Сумма прописью.
    function str_price($value)
    {
        $value = explode('.', number_format($value, 2, '.', ''));
    
        //$f = new NumberFormatter('ru', NumberFormatter::SPELLOUT);
        //$str = $f->format($value[0]);

        $str = $value[0];
    
        // Первую букву в верхний регистр.
        $str = mb_strtoupper(mb_substr($str, 0, 1)) . mb_substr($str, 1, mb_strlen($str));
    
        // Склонение слова "рубль".
        $num = $value[0] % 100;
        if ($num > 19) { 
            $num = $num % 10; 
        }	
        switch ($num) {
            case 1: $rub = 'рубль'; break;
            case 2: 
            case 3: 
            case 4: $rub = 'рубля'; break;
            default: $rub = 'рублей';
        }	
        
        return $str . ' ' . $rub . ' ' . $value[1] . ' копеек.';
    }

    function renderHtml(){
        $img_path = $_SERVER['DOCUMENT_ROOT'] . '/public/img/pechat.png';
        $img_type = pathinfo($img_path, PATHINFO_EXTENSION);
        $img_data = file_get_contents($img_path);
        $img_base64 = 'data:image/' . $img_type . ';base64,' . base64_encode($img_data);

        $this->timestamp = time();
        $date = date("d.m.Y", $this->timestamp);
        $date_array = explode('.', $date);
        $month = '';
        switch($date_array[1]){
            case 1: 
                $month = 'января';
                break;
            case 2: 
                $month = 'февраля';
                break;
            case 3: 
                $month = 'марта';
                break;
            case 4: 
                $month = 'апреля';
                break;
            case 5: 
                $month = 'мая';
                break;
            case 6: 
                $month = 'июня';
                break;
            case 7: 
                $month = 'июля';
                break;
            case 8: 
                $month = 'августа';
                break;
            case 9: 
                $month = 'сентября';
                break;
            case 10: 
                $month = 'октября';
                break;
            case 11: 
                $month = 'ноября';
                break;
            case 12: 
                $month = 'декабря';
                break;
        }
        $date_array[1] = $month;
        $date_info = implode(' ', $date_array);
            

        $html = '
            <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
                
                <style type="text/css">
                    * { 
                        font-family: arial;
                        font-size: 14px;
                        line-height: 14px;
                    }
                    table {
                        margin: 0 0 15px 0;
                        width: 100%;
                        border-collapse: collapse; 
                        border-spacing: 0;
                    }		
                    table td {
                        padding: 5px;
                    }	
                    table th {
                        padding: 5px;
                        font-weight: bold;
                    }
            
                    .header {
                        margin: 0 0 0 0;
                        padding: 0 0 15px 0;
                        font-size: 12px;
                        line-height: 12px;
                        text-align: center;
                    }
                    
                    /* Реквизиты банка */
                    .details td {
                        padding: 3px 2px;
                        border: 1px solid #000000;
                        font-size: 12px;
                        line-height: 12px;
                        vertical-align: top;
                    }
            
                    h1 {
                        margin: 0 0 10px 0;
                        padding: 10px 0 10px 0;
                        border-bottom: 2px solid #000;
                        font-weight: bold;
                        font-size: 20px;
                    }
            
                    /* Поставщик/Покупатель */
                    .contract th {
                        padding: 3px 0;
                        vertical-align: top;
                        text-align: left;
                        font-size: 13px;
                        line-height: 15px;
                    }	
                    .contract td {
                        padding: 3px 0;
                    }		
            
                    /* Наименование товара, работ, услуг */
                    .list thead, .list tbody  {
                        border: 2px solid #000;
                    }
                    .list thead th {
                        padding: 4px 0;
                        border: 1px solid #000;
                        vertical-align: middle;
                        text-align: center;
                    }	
                    .list tbody td {
                        padding: 0 2px;
                        border: 1px solid #000;
                        vertical-align: middle;
                        font-size: 11px;
                        line-height: 13px;
                    }	
                    .list tfoot th {
                        padding: 3px 2px;
                        border: none;
                        text-align: right;
                    }	
            
                    /* Сумма */
                    .total {
                        position: relative;
                        z-index: 1;
                        margin: 0 0 20px 0;
                        padding: 0 0 10px 0;
                        border-bottom: 2px solid #000;
                    }	
                    .total p {
                        margin: 0;
                        padding: 0;
                    }
                    
                    /* Руководитель, бухгалтер */
                    .sign {
                        position: relative;
                        z-index: 1;
                    }
                    .sign table {
                        width: 60%;
                    }
                    .sign th {
                        padding: 40px 0 0 0;
                        text-align: left;
                    }
                    .sign td {
                        padding: 40px 0 0 0;
                        border-bottom: 1px solid #000;
                        text-align: right;
                        font-size: 12px;
                    }
                    
                    .sign-1 {
                        position: absolute;
                        z-index: -1;
                        left: 169px;
                        top: 10px;
                        width: 170px;
                    }	
                    
                    .printing {
                        position: absolute;
                        left: 271px;
                        top: -15px;
                    }
                </style>
            </head>
            <body>
                <p class="header">
                Внимание! Оплата данного счета означает согласие с условиями поставки товара. Уведомление об оплате обязательно, в противном случае не гарантируется наличие товара на складе. Товар отпускается по факту 
                прихода денег на р/с Поставщика, самовывозом, при наличии доверенности и паспорта. 
                </p>

                
            
                <table class="details">
                    <tbody>
                        <tr>
                            <td colspan="2" style="border-bottom: none;">КИРОВСКОЕ ОТДЕЛЕНИЕ N8612 ПАО СБЕРБАНК г. Киров</td>
                            <td>БИК</td>
                            <td style="border-bottom: none;">043304609</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border-top: none; font-size: 10px;">Банк получателя</td>
                            <td>Сч. №</td>
                            <td style="border-top: none;">30101810500000000609</td>
                        </tr>
                        <tr>
                            <td width="25%">ИНН 434600184318</td>
                            <td width="30%">КПП </td>
                            <td width="10%" rowspan="3">Сч. №</td>
                            <td width="35%" rowspan="3">40802810527000007896</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border-bottom: none;">Индивидуальный предприниматель Кладов Евгений Васильевич</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border-top: none; font-size: 10px;">Получатель</td>
                        </tr>
                    </tbody>
                </table>
            
                <h1>Счет на оплату (б/н) от ' . $date_info . ' г.</h1>
            
                <table class="contract">
                    <tbody>
                        <tr>
                            <td width="15%">Поставщик:</td>
                            <th width="85%">
                                Индивидуальный предприниматель Кладов Евгений Васильевич, ИНН 434600184318,
                                358000 г. Элиста, мкр. 2 д. 30, кв. 37 
                            </th>
                        </tr>
                        <tr>
                            <td>Покупатель:</td>
                            <th>
                                ' . $this->pay_agent . '
                            </th>
                        </tr>
                    </tbody>
                </table>
            
                <table class="list">
                    <thead>
                        <tr>
                            <th width="5%">№</th>
                            <th width="52%">Наименование товара, работ, услуг</th>
                            <th width="8%">Коли-<br>чество</th>
                            <th width="7%">Ед.<br>изм.</th>
                            <th width="14%">Цена</th>
                            <th width="14%">Сумма</th>
                        </tr>
                    </thead>
                    <tbody>';
                    
                    $total = $nds = 0;
                    foreach ($this->products as $i => $row) {
                        $total += $row->price * $row->quantity;
            
                        $html .= '
                        <tr>
                            <td align="center">' . (++$i) . '</td>
                            <td align="left">' . $row->name . '</td>
                            <td align="right">' . $row->quantity . '</td>
                            <td align="left">' . $row->metric_name . '</td>
                            <td align="right">' . $this->format_price($row->price) . '</td>
                            <td align="right">' . $this->format_price($row->price * $row->quantity) . '</td>
                        </tr>';
                    }
            
                    $html .= '
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colspan="5">Итого:</th>
                            <th>' . $this->format_price($total) . '</th>
                        </tr>
                        <tr>
                            <th colspan="5">Без налога (НДС):</th>
                            <th style="text-align:right;">-</th>
                        </tr>
                        <tr>
                            <th colspan="5">Всего к оплате:</th>
                            <th>' . $this->format_price($total) . '</th>
                        </tr>
                        
                    </tfoot>
                </table>
                
                <div class="total">
                    <p>Всего наименований ' . count($this->products) . ', на сумму ' . $this->format_price($total) . ' руб.</p>
                    <p><strong>' . $this->str_price($total) . '</strong></p>
                </div>
                
                <div class="sign">
                    <img class="sign-1" src="' . $img_base64 . '">

                    <table>
                        <tbody>
                            <tr>
                                <th width="30%">Предприниматель</th>
                                <td width="70%">Кладов Е. В.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </body>
            </html>';

            return $html;
    }
}



