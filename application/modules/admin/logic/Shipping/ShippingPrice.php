<?php

namespace admin\logic\Shipping;

use Admin_Model_Category as Category;
use Admin_Model_ShippingCategory as ShippingCategory;
use common\logic\Front\Cart;
use common\logic\Helper\Price;

class ShippingPrice
{
    const FREE_SHIPPING_ALLOWED_COUNTRY_ID = \Common_Model_Country::CZ_ID;

    /**
     * @param array $shipping
     * @param Cart|null $cart
     * @return array
     */
    public static function computeShippingPrice(array $shipping, Cart $cart = null): array
    {
        $shippingItems = [];

        if ($cart) {
            if ($shipping['FreeShipping'] &&
                ($shipping['FreeShipping'] < $cart->getTotalPriceWithVat())) {
                $shipping['Price'] = 0;
                $shipping['PriceWithoutVat'] = 0;
                $shipping['PriceWithVat'] = 0;
                return $shipping;
            } else {
                $cartItems = $cart->getCartItems();
                foreach ($cartItems as $cartItem) {
                    $shippingCategory = ShippingCategory::getShippingCategory($shipping['ID'], $cartItem['product']['CategoryIDs']);

                    if ($shippingCategory) {
                        $shippingCategory = Price::addVatPrices($shippingCategory[0]);
                        $shippingCategory['Quantity'] = $cartItem['Quantity'];
                        $shippingItems[] = $shippingCategory;
                    }
                }
            }
        }

        if ($shippingItems) {
            $areAllNotPriceAllways = true;

            /// nejdrive cekni, jestli nahodou nemas v kosiku jen polozky u nich se cena objednavky dopocitava
            foreach ($shippingItems as $shippingItem) {
                if ($shippingItem['PriceAlways']) {
                    $areAllNotPriceAllways = false;
                    break;
                }
            }

            if ($areAllNotPriceAllways) {
                $maxPriceWithoutVat = 0;
                $maxPriceWithVat = 0;
                $quantityByMaxPriceWithoutVat = 1;

                foreach ($shippingItems as $shippingItem) {
                    if ($shippingItem['PriceWithoutVat'] > $maxPriceWithoutVat) {
                        $maxPriceWithoutVat = $shippingItem['PriceWithoutVat'];
                        $maxPriceWithVat = $shippingItem['PriceWithVat'];

                        $quantityByMaxPriceWithoutVat = $shippingItem['PricePerPiece'] ? $shippingItem['Quantity'] : 1;
                    }
                }

                $shipping['PriceWithoutVat'] = $maxPriceWithoutVat * $quantityByMaxPriceWithoutVat;
                $shipping['PriceWithVat'] = $maxPriceWithVat * $quantityByMaxPriceWithoutVat;

                return $shipping;
            } else {
                $priceWithoutVat = 0;
                $priceWithVat = 0;

                foreach ($shippingItems as $shippingItem) {
                    if (!$shippingItem['PriceAlways'])
                        continue;

                    $quantity = $shippingItem['PricePerPiece'] ? $shippingItem['Quantity'] : 1;

                    $priceWithoutVat += $shippingItem['PriceWithoutVat'] * $quantity;
                    $priceWithVat += $shippingItem['PriceWithVat'] * $quantity;
                }

                $shipping['PriceWithoutVat'] = $priceWithoutVat;
                $shipping['PriceWithVat'] = $priceWithVat;

                return $shipping;
            }
        } else {
            //Zatim se neřeší nějaký ceník dle váhy a rozměrů, takže natvrdo nultý index a první cena každé dopravy
            if(isset($shipping['shippingPrices'][0]['PriceWithoutVat']))  {
                if(!isset($shipping['shippingPrices'][0]['PriceWithoutVat']) || $shipping['shippingPrices'][0]['PriceWithoutVat'] == 0) {
                    $shipping['PriceWithoutVat'] = 0;
                    $shipping['PriceWithVat'] = 0;
                } else {
                    $shipping['PriceWithoutVat'] = $shipping['shippingPrices'][0]['PriceWithoutVat'];
                    $shipping['PriceWithVat'] = isset($shipping['vat']['Value'])?round(Price::priceToVat($shipping['shippingPrices'][0]['PriceWithoutVat'], $shipping['vat']['Value'])):$shipping['shippingPrices'][0]['PriceWithoutVat'];
                }
                $shipping['Note'] = isset($shipping['shippingPrices'][0]['Note']) ? $shipping['shippingPrices'][0]['Note'] : '';
                return $shipping;
            }
            return Price::addVatPrices($shipping);
        }
    }
}