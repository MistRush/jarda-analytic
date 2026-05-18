<?php
namespace default\components;

use Admin_Model_Coupon as CouponModel;
use Admin_Model_Currency as Currency;
use Admin_Model_Order as OrderModel;
use Admin_Model_OrderItem as OrderItemModel;
use Admin_Model_Payment as Payment;
use Admin_Model_Shipping as Shipping;
use common\logic\Eshop\Eshop;
use common\logic\Front\Cart as FrontCart;
use common\logic\Front\CartStep\CartSteps;
use common\logic\Latte\LatteEngine;
use user\logic\UserSettings;

class Order {

    const FOLDER = __DIR__ . '/../../default/views/latte/components/order/';

    /**
     * @param int $cartStep
     * @return string
     */
    public static function cartSteps(int $cartStep): string {
        $cartSteps = new CartSteps($cartStep);
        $latte = LatteEngine::getInstance();

        return $latte->renderToString(self::FOLDER . 'cart-steps.latte',
            [
                'cartSteps' => $cartSteps->getCartSteps(),
                'currentCartStep' => $cartSteps->getCurrentCartStep()
            ]
        );
    }

    /**
     * @param string|null $orderHash
     * @param int|null $shippingID
     * @param int|null $paymentID
     * @param int|null $step
     * @return string
     */
    public static function orderRecapitulation(string $orderHash = null, int $shippingID = null, int $paymentID = null, int $step = null): string {
        if ( $orderHash ) {
            $order = OrderModel::getOrderByHash($orderHash)[0];
            $coupon = OrderModel::getOrder($order['ID'])->getCoupon();
            if ($coupon && $coupon->Type === CouponModel::TYPE_ITEM)
                $coupon = null;
            $productItems = OrderItemModel::getOrderItems($order);

            $shippingPriceWithoutVat = $order['PriceShippingWithoutVat'];
            $shippingPriceWithVat = $order['PriceShippingWithVat'];
            $shippingName = $order['shipping']['Name'];
            $shippingImage = isset($order['shipping']['file'])?fu($order['shipping'], 'logo'):null;

            $paymentPriceWithoutVat = $order['PricePaymentWithoutVat'];
            $paymentPriceWithVat = $order['PricePaymentWithVat'];
            $paymentName = $order['payment']['Name'];
            $paymentImage = isset($order['payment']['file'])?fu($order['payment'], 'logo'): null;

            $productsPriceWithoutVat = $order['PriceProductWithoutVat'];
            $productsPriceWithVat = $order['PriceProductWithVat'];

            $totalPriceWithoutVat = $order['PriceTotalWithoutVat'];
            $totalPriceWithVat = $order['PriceTotalWithVat'];

            $currencyID = $order['Currency_ID'];
            $currency = Currency::getCurrencyByID($currencyID);
        } else {
            $cart = FrontCart::getInstance();
            $productItems = $cart->getCartItems();
            $coupon = $cart->coupon;

            $productsPriceWithoutVat = $cart->getTotalPriceWithoutVat();
            $productsPriceWithVat = $cart->getTotalPriceWithVat();

            $shipping = false;
            $payment = false;

            if ( $shippingID ) {
                $shipping = Shipping::getShippingByID($shippingID, $cart);
                $shippingImage = isset($shipping['file'])?fu($shipping, 'logo'):null;
            }

            if ( $paymentID ) {
                $payment = Payment::getPaymentByID($paymentID);
                $paymentImage = isset($payment['file'])?fu($payment, 'logo'):null;
            }

            $shippingPriceWithoutVat = $shipping['PriceWithoutVat'] ?? 0;
            $shippingPriceWithVat = $shipping['PriceWithVat'] ?? 0;
            $shippingName = $shipping['Name'] ?? 0;
            $shippingImage = $shippingImage ?? null;

            $paymentPriceWithoutVat = $payment['PriceWithoutVat'] ?? 0;
            $paymentPriceWithVat = $payment['PriceWithVat']?? 0;
            $paymentName = $payment['Name'] ?? 0;
            $paymentImage = $paymentImage ?? null;


            $totalPriceWithoutVat = $productsPriceWithoutVat + $shippingPriceWithoutVat + $paymentPriceWithoutVat;
            $totalPriceWithVat = $productsPriceWithVat + $shippingPriceWithVat + $paymentPriceWithVat;

            $currencyID = UserSettings::getInstance()->getValue('Currency_ID');
            $currency = Currency::getCurrentCurrency();
        }

        $latte = LatteEngine::getInstance();
        return $latte->renderToString(self::FOLDER . 'order-recapitulation.latte',
            [
                'productItems' => $productItems,
                'productsPriceWithoutVat' => $productsPriceWithoutVat,
                'productsPriceWithVat' => $productsPriceWithVat,

                'shippingPriceWithoutVat' => $shippingPriceWithoutVat,
                'shippingPriceWithVat' => $shippingPriceWithVat,
                'shippingName' => $shippingName,
                'shippingImage' => $shippingImage,

                'paymentPriceWithoutVat' => $paymentPriceWithoutVat,
                'paymentPriceWithVat' => $paymentPriceWithVat,
                'paymentName' => $paymentName,
                'paymentImage' => $paymentImage,

                'totalPriceWithoutVat' => $totalPriceWithoutVat,
                'totalPriceWithVat' => $totalPriceWithVat,
                'totalVat' => $totalPriceWithVat - $totalPriceWithoutVat,
                'coupon' => $coupon,
                'currencyID' => $currencyID,
                'currency' => $currency,
                'step'=> $step,
                'eshop' => Eshop::getInstance()
            ]
        );
    }
}