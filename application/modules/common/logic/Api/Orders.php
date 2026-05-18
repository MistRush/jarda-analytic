<?php
namespace common\logic\Api;

use Admin_Model_Order as Order;
use Admin_Model_Product;
use ReallySimpleJWT\Token;

use User_Model_User;

class Orders extends Base {

    /**
     * @throws \Exception
     */
    public static function createOrder($token, $data) {
        $payloadData = Token::getPayload($token);
       if(!Authorization::isAuthorized($token,'api-create-order')) {
           \Admin_Model_ApiLog::insertRecord([
               'User' => $payloadData['iss'],
               'Url' => htmlentities($_SERVER['REQUEST_URI'] . $_SERVER['QUERY_STRING']),
               'StatusCode' => '403 Forbidden',
               'Message' => 'Wrong permission',
           ]);
           parent::sendOutput(json_encode(array("msg" => 'Fail wrong authorization')), array('Content-Type: application/json', 'HTTP/1.1 403 Forbidden'));
       }

       $order = new Order();
       $order->Eshop_ID = $data[0]['eshop']['ID'];
       $order->Vat_ID = $data[0]['eshop']['VAT_ID'];
       $order->Currency_ID = $data[0]['eshop']['Currency_ID'];
       $order->Language_ID = $data[0]['eshop']['Language_ID'];
       $order->Shipping_ID = $data[0]['order']['Shipping_ID'];
       $order->Payment_ID = $data[0]['order']['Payment_ID'];
       $order->Description = $data[0]['order']['Description'];
       $order->PriceShippingWithoutVat = 0;
       $order->PriceShippingWithVat = 0;
       $order->PricePaymentWithoutVat = 0;
       $order->PricePaymentWithVat = 0;
       $priceTotalWithoutVat = 0;
       $priceTotalWithVat = 0;
        foreach ($data[0]['orderItems'] as &$orderItem) {
            $product = Admin_Model_Product::getProductByIDForAPIOrder($orderItem['Product_Api_ID']);
            $orderItem = array_merge($orderItem,$product);
            $priceTotalWithoutVat += ($orderItem['Quantity'] * $orderItem['PriceWithoutVat']);
            $priceTotalWithVat += ($orderItem['Quantity'] *  $orderItem['PriceWithVat']);
        }
        $order->PriceTotalWithoutVat = $priceTotalWithoutVat;
        $order->PriceTotalWithVat = $priceTotalWithVat;
        $order->PriceProductWithoutVat = $priceTotalWithoutVat;
        $order->PriceProductWithVat = $priceTotalWithVat;
//        $order->InvoiceAddress_ID = Address::createAddressFromAPI(Address::TYPE_INVOICE, $data[0]['invoiceAddress'])->ID;
        $order->InvoiceAddress_ID = User_Model_User::getUser($payloadData['u_id'])->InvoiceAddress_ID;
        $order->User_ID = $payloadData['u_id'];
       $order->saveApiOrder($data[0]['orderItems']);

        \Admin_Model_ApiLog::insertRecord([
            'User'=> $payloadData['iss'],
            'Url' => htmlentities($_SERVER['REQUEST_URI'].$_SERVER['QUERY_STRING']),
            'StatusCode'=> '200 OK',
            'Message' => 'Order created',
        ]);

       parent::sendOutput(json_encode(array(
           "msg" => "Objednávka vytvořena",
           "OrderID"=> $order->ID,
           "OrderNumber" => $order->OrderNumber,
           "OrderHash" => $order->Folder,
       )), array('Content-Type: application/json', 'HTTP/1.1 200 OK'));
   }
}
