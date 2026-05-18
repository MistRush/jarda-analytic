<?php

use admin\logic\Payment\Csob;
use Admin_Model_CsobPayment as CsobPayment;
use Admin_Model_CsobPaymentState as CsobPaymentState;
use Admin_Model_Order as Order;
use Admin_Model_OrderState as OrderState;
use common\logic\Eshop\Eshop;
use OndraKoupil\Csob\Metadata\Customer;

class Common_CsobController extends Clevis_Zend_Controller_Action {

    public function notifyAction() {
        parent::disableLayout();
        $eshopURL = Eshop::getInstance()->getURL();

        $csobID = $this->getRequest()->getParam('payId');
        $csobPayment = CsobPayment::getPaymentByCsobID($csobID);
        if (!count($csobPayment))
            throw new Exception('ČSOB platba nenalezena');

        $order = Order::getOrder($csobPayment[0]['Order_ID']);
        $csobResponse = Csob::getInstance(null, $order->eshop);
        $statusID = $csobResponse->client->paymentStatus($csobPayment[0]['CsobID']);

        if ( $statusID == 1 )
            CsobPaymentState::createCsobPaymentState($csobPayment[0]['ID'], 12);
        if ( $statusID == 2 )
            CsobPaymentState::createCsobPaymentState($csobPayment[0]['ID'], 13);
        if ( $statusID == 3 )
            CsobPaymentState::createCsobPaymentState($csobPayment[0]['ID'], 14);
        if ( $statusID == 4 )
            CsobPaymentState::createCsobPaymentState($csobPayment[0]['ID'], 15);
        if ( $statusID == 5 )
            CsobPaymentState::createCsobPaymentState($csobPayment[0]['ID'], 16);
        if ( $statusID == 6 )
            CsobPaymentState::createCsobPaymentState($csobPayment[0]['ID'], 17);
        if ( $statusID == 7 )
            CsobPaymentState::createCsobPaymentState($csobPayment[0]['ID'], 18);
        if ( $statusID == 8 )
            CsobPaymentState::createCsobPaymentState($csobPayment[0]['ID'], 19);
        if ( $statusID == 9 )
            CsobPaymentState::createCsobPaymentState($csobPayment[0]['ID'], 20);
        if ( $statusID == 10 )
            CsobPaymentState::createCsobPaymentState($csobPayment[0]['ID'], 21);


        if ($statusID == 4 || $statusID == 7) {
            OrderState::createOrderState($csobPayment[0]['Order_ID'], 6, OrderState::USER_CSOB);
            Order::setOrderPaid($csobPayment[0]['Order_ID']);
        }

        header("Location: " . $eshopURL . '/order/step-3/order/' . $order->Folder . '/orderNumber/' . $order->OrderNumber);

    }

    /**
     * @throws Exception
     */
    public function paymentAction() {
        parent::disableLayout();

        $eshopURL = Eshop::getInstance()->getURL();
        $orderHash = $this->getRequest()->getParam('order');
        $order = Order::getOrderObjectByHash($orderHash);
        $returnUrl = $eshopURL . '/common/csob/notify/';

        $csobInstance = Csob::getInstance(null, $order->eshop, $returnUrl);
        $csobPayment = $csobInstance->payment($order->OrderNumber);


        $totalAmount = 0;

        /** @var Admin_Model_OrderItem $orderItem */
        foreach ($order->orderItems as $orderItem) {
           $totalAmount += ($orderItem->PriceWithVat * 100) * $orderItem->Quantity;
        }

        $csobPayment->addCartItem(
            'Objednávka č. ' . $order->OrderNumber . ' - ' . $order->eshop->Name,
           1,
            $totalAmount,
        );

        $csobPayment->addCartItem(
            'Doprava a platba',
            1,
            ((float) $order->PriceShippingWithVat * 100) + ((float) $order->PricePaymentWithVat * 100)
        );

        $customer = new Customer();
        $customer->name = $order->invoiceAddress->FirstName . ' ' . $order->invoiceAddress->LastName;
        $customer->email = $order->invoiceAddress->Email;

        $csobPayment->setCustomer($customer);

        try {
            $response = $csobInstance->client->paymentInit($csobPayment);
            if($response['payId']) {
                $payId = $response['payId'];
                $url = $csobInstance->client->getPaymentProcessUrl($csobPayment);
                CsobPayment::createCsobPayment($order->ID, $payId, $url);
                header("Location: " .$url);
                exit();
            } else {
                throw new Exception('Unable to create payment');
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}