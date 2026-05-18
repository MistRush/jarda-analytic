<?php

namespace admin\logic\Shipping;

use common\logic\Front\Cart;
use Common_Model_Eshop as ModelEshop;

class ShippingDisplay
//ToDo ZDVO: chce to refactor, upravu modelu, kde bude možné pro jednotlivé dopravce a eshopy povolovat/zakazovat dopravce per konkrétní kategorii a napsat to hezky. Tohle je prozatimní řešení.
{
    const FORBIDDEN_CATEGORY_IDS_FOR_DPD = [9720];
    const ALLOWED_CATEGORY_IDS_FOR_FOFR_VAMOTSK = [9720];

    /**
     * @param array $shipping
     * @param Cart|null $cart
     * @return array
     */
    public static function checkShippingCategory(array $shipping, Cart $cart = null, ModelEshop $eshop): array
    {
        if($eshop->ID == 1) {
            $forbiddenCategories = match ($shipping['ID']) {
                '3' => self::FORBIDDEN_CATEGORY_IDS_FOR_DPD,
                default => null
            };
        }

        if($eshop->ID == 2) {
            $forbiddenCategories = match ($shipping['ID']) {
                '2' => self::FORBIDDEN_CATEGORY_IDS_FOR_DPD,
                default => null
            };
        }

        if ($cart && $forbiddenCategories !== null) {
            $cartItems = $cart->getCartItems();
            $categoryIDs = [];
            foreach ($cartItems as $cartItem) {
                array_push($categoryIDs, ...explode(',', $cartItem['product']['CategoryIDs']));
            }
            $uniqueCategoryIDs = array_unique($categoryIDs);
            if(self::in_array_any($uniqueCategoryIDs, $forbiddenCategories)) {
                $shipping['Display'] = false;
            } else {
                $shipping['Display'] = true;
            };
        } else {
            $shipping['Display'] = true;
        }

        //Pouze pro VAMOT SK, když není DPD pro nosiče a boxy tak tam naval FOFR
        //FOFR zobrazovat na VAMOT SK pouze, pokud JE v košíku nějaký produkt z nosičů a boxů (9720), jinak NE
        if($eshop->ID == 2) {
            $allowedCategories = match($shipping['ID']) {
                '6' => self::ALLOWED_CATEGORY_IDS_FOR_FOFR_VAMOTSK,
                default => null
            };

            if ($cart && $allowedCategories !== null) {
                $cartItems = $cart->getCartItems();
                $categoryIDs = [];
                foreach ($cartItems as $cartItem) {
                    array_push($categoryIDs, ...explode(',', $cartItem['product']['CategoryIDs']));
                }
                $uniqueCategoryIDs = array_unique($categoryIDs);
                $shipping['Display'] = self::in_array_any($uniqueCategoryIDs, $allowedCategories);
            }
        }

        return $shipping;


    }

    private static function in_array_any($needles, $haystack)
    {
        return !empty(array_intersect($needles, $haystack));
    }
}