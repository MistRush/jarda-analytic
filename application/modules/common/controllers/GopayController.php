<?php

use Admin_Model_GopayPayment as GopayPayment;
use Admin_Model_GopayPaymentState as GopayPaymentState;
use Admin_Model_Payment as Payment;
use Admin_Model_Order as Order;
use Admin_Model_OrderState as OrderState;
use admin\logic\Payment\Gopay;
use common\logic\Eshop\Eshop;
use GoPay\Definition\Language;
use GoPay\Definition\Payment\Currency;
use GoPay\Definition\Payment\PaymentInstrument;
use GoPay\Definition\Payment\VatRate;
use GoPay\Definition\TokenScope;

class Common_GopayController extends Clevis_Zend_Controller_Action {

    public function notifyAction() {
        parent::disableLayout();

        $id = $this->getRequest()->getParam('id');
        $gopayPayment = GopayPayment::getPaymentByGopayID($id);
        if (!count($gopayPayment))
            throw new Exception('GoPay platba nenalezena');

        $order = Order::getOrder($gopayPayment[0]['Order_ID']);
        $gopay = Gopay::getInstance(null, $order->eshop)->payment();

        $response = $gopay->getStatus($gopayPayment[0]['GopayID']);
        $state = $response->json['state'];

        if ( $state == 'CREATED' )
            GopayPaymentState::createGopayPaymentState($gopayPayment[0]['ID'], 7);

        if ( $state == 'PAYMENT_METHOD_CHOSEN' )
            GopayPaymentState::createGopayPaymentState($gopayPayment[0]['ID'], 8);

        if ( $state == 'PAID' ) {
            GopayPaymentState::createGopayPaymentState($gopayPayment[0]['ID'], 9);
            OrderState::createOrderState($gopayPayment[0]['Order_ID'], 6, OrderState::USER_GOPAY);
            Order::setOrderPaid($gopayPayment[0]['Order_ID']);
        }

        if ( $state == 'CANCELED' )
            GopayPaymentState::createGopayPaymentState($gopayPayment[0]['ID'], 10);

        if ( $state == 'TIMEOUTED' )
            GopayPaymentState::createGopayPaymentState($gopayPayment[0]['ID'], 11);
    }

    public function paymentAction() {
        parent::disableLayout();

        $eshopURL = Eshop::getInstance()->getURL();
        $orderHash = $this->getRequest()->getParam('order');
        $order = Order::getOrderObjectByHash($orderHash);

        $gopayInstance = Gopay::getInstance(null, $order->eshop);
        $gopay = $gopayInstance->payment();

        $items = [];

        /** @var Admin_Model_OrderItem $orderItem */
        foreach ($order->orderItems as $orderItem) {
            $items[] = [
                'type' => 'ITEM',
                'name' => $orderItem->product->getLang($order->Language_ID)->Name,
                'product_url' => $eshopURL . '/' . URL::PRODUCT . '/' . $orderItem->product->getLang($order->Language_ID)->slug,
                'amount' => $orderItem->PriceWithVat * 100 * $orderItem->Quantity,
                'count' => $orderItem->Quantity,
                //'vat_rate' => (int) ($hasDIC?0:$orderItem->Vat),
                'ean' => $orderItem->product->EAN??null,
            ];
        }

        $items[] = [
            'type' => 'DELIVERY',
            'name' => translate('Doprava a platba'),
            'product_url' => $eshopURL,
            'amount' => ((float) $order->PriceShippingWithVat * 100) + ((float) $order->PricePaymentWithVat * 100),
            'count' => 1,
            //'vat_rate' => (int) ($hasDIC?0:$order->vat->Value)
        ];

        $paymentType = PaymentInstrument::PAYMENT_CARD;
        if ( $order->payment->Type == Payment::TYPE_GOPAY_PAYPAL )
            $paymentType = PaymentInstrument::PAYPAL;

        if ( $order->payment->Type == Payment::TYPE_GOPAY_APPLE_PAY )
            $paymentType = PaymentInstrument::APPLE_PAY;

        $response = $gopay->createPayment([
            'payer' => [
                'default_payment_instrument' => $paymentType,
                'allowed_payment_instruments' => [$paymentType],
                'contact' => ['first_name' => $order->invoiceAddress->FirstName,
                    'last_name' => $order->invoiceAddress->LastName,
                    'email' => $order->invoiceAddress->Email,
                    'phone_number' => $order->invoiceAddress->Phone,
                    'city' => $order->invoiceAddress->City,
                    'street' => $order->invoiceAddress->Street,
                    'postal_code' => $order->invoiceAddress->ZipCode,
                    'country_code' => $order->invoiceAddress->country->Code
                ]
            ],
            'amount' => (float) $order->PriceTotalWithVat * 100,
            'currency' => $order->eshop->currency->Mark,
            'order_number' => $order->OrderNumber,
            'order_description' => '',
            'items' => $items,
            'additional_params' => [
                ['name' => 'invoicenumber', 'value' => $order->OrderNumber],
            ],
            'callback' => [
                'return_url' => $eshopURL . '/order/step-3/order/' . $order->Folder . '/orderNumber/' . $order->OrderNumber,
                'notification_url' => $eshopURL . '/common/gopay/notify/'
            ],
            'lang' => $gopayInstance->getLanguage()
        ]);

        if ($response->hasSucceed()) {
            GopayPayment::createGopayPayment($order->ID, $response->json['id'], $response->json['gw_url']);
        }

        if (isset($response->json['errors'])) {
            throw new Exception($response->json['errors'][0]['message'], $response->json['errors'][0]['error_code']);
        }

        header("Location: " . $response->json['gw_url']);

        exit();
    }
}