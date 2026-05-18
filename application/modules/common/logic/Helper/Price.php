<?php
namespace common\logic\Helper;

use user\logic\UserSettings;

class Price {
    const VAT_TYPE_WITHOUT = 'without-vat';
    const VAT_TYPE_WITH = 'with-vat';

    /**
     * @param array $entity
     * @return mixed
     */
    public static function addVatPrices(array $entity): array {
        $currentCurrency = \Admin_Model_Currency::getCurrentCurrency();
        $entity = self::computeCurrency($entity, $currentCurrency['Ratio']);
        if ( !isset($entity['vat']) || $entity['vat']['Value'] == 0 ) {
            $entity['PriceWithoutVat'] = $entity['Price'];
            $entity['PriceWithVat'] = $entity['Price'];
        } else {
            if ( $entity['VatType'] == self::VAT_TYPE_WITHOUT ) {
                $entity['PriceWithoutVat'] = $entity['Price'];
                $entity['PriceWithVat'] = self::priceToVat($entity['Price'], $entity['vat']['Value']);
            } elseif ( $entity['VatType'] == self::VAT_TYPE_WITH ) {
                $entity['PriceWithoutVat'] = self::priceToWithoutVat($entity['Price'], $entity['vat']['Value']);
                $entity['PriceWithVat'] = $entity['Price'];
            }
        }

        return $entity;
    }

    /**
     * @param $entity
     * @param null $currencyRatio
     * @return mixed
     */
    public static function computeCurrency($entity, $currencyRatio = null): array {
        if ( !$currencyRatio ) {
            $currentCurrency = \Admin_Model_Currency::getCurrentCurrency();
            $currencyRatio = $currentCurrency['Ratio'];
        }

        $entity['Price'] = $entity['Price'] * $currencyRatio;

        return $entity;
    }

    public static function computeCouponCurrency($discount, $currencyRatio = null): float {
        if ( !$currencyRatio ) {
            $currentCurrency = \Admin_Model_Currency::getCurrentCurrency();
            $currencyRatio = $currentCurrency['Ratio'];
        }

        return  $discount * $currencyRatio;
    }

    /**
     * @return array
     */
    public static function getVatTypes() :array {
        return [
            self::VAT_TYPE_WITHOUT => 'uvedená cena je bez DPH',
            self::VAT_TYPE_WITH => 'uvedená cena je s DPH',
        ];
    }

    /**
     * @param float|null $price
     * @param int $vatValue
     * @return float
     */
    public static function priceToVat(?float $price, int $vatValue): float {
        $coeficient = $vatValue / 100;
        $tax = $price * $coeficient;

        return round($price + $tax,2);
    }

    /**
     * @param float $price
     * @param int $vatValue
     * @return float
     */
    public static function priceToWithoutVat(float $price, int $vatValue): float {
        $coef = 1;
        if ( $vatValue == 21 )
            $coef = 1.21;

        if ( $vatValue == 15 )
            $coef = 1.15;

        return round($price/$coef, 2);
    }

    public static function priceWithDiscount(float $price, float|int $userDiscount): float {
        return $price - ($price * $userDiscount / 100);
    }
}