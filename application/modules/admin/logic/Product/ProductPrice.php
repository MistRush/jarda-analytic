<?php
namespace admin\logic\Product;

use common\logic\Eshop\Eshop;
use common\logic\HadexApi\Enums\PriceType;
use common\logic\Helper\Price;
use user\logic\UserClientSession;
use user\logic\UserSettings;
use User_Model_Group;
use User_Model_GroupDiscount as GroupDiscount;
use User_Model_User as User;
use User_Model_UserSettings;

class ProductPrice {

    private array $product = [];

    private ?int $userDiscount = 0;

    private array $groupDiscount = [];

    private ?int $currencyID;


    /**
     * Constructor
     * @param array $product
     * @param int|null $userDiscount
     * @param array $groupDiscount
     * @param int|null $currencyID
     */
    public function __construct(array $product, ?int $userDiscount = 0, array $groupDiscount = [], ?int $quantity = null) {
        $this->setProduct($product);
        $this->setUserDiscount($userDiscount);
        $this->setGroupDiscount($groupDiscount);

//        if ( !$currencyID )
//             $currencyID = UserSettings::getInstance()->getValue('Currency_ID');
//
//        $this->setCurrencyID($currencyID);
        $this->computePrice($quantity);
    }

    /**
     * computePrice
     */
    public function computePrice(?int $quantity = null): void {
        $userID = UserClientSession::getCurrentUserID();
        $user = $userID?User::getUser($userID):null;
        $userDiscount = $userID?(float)$user->Discount:null;
        $userDeactivateQuantityMin = $userID?$user->DeactivateQuantityMin:null;
        $product = $this->getProduct();
        $currentTime = time();

        if(!isset($product['productEshops'][0])) {
            return;
        }

        if ( $user ) {
            $userBasePriceTypeCode = $user->BasePriceTypeCode ?? 'A';
        } else {
            $userBasePriceTypeCode = 'A';
        }

        $productPrices = $product['productEshops'];
        $actionPrice = $this->handleActionPrice($productPrices, $currentTime);
        $customerPrice = $this->handleCustomerPrice($user, $productPrices);

        if (!empty($customerPrice) || !empty($actionPrice)) {
            $validPrices = $this->getValidSpecialPrice($customerPrice, $actionPrice);
        } else {
            $validPrices = $this->getValidStandardPrices($userBasePriceTypeCode, $productPrices);
        }

        usort($validPrices, function($a, $b) {
            return $a['QuantityMin'] <=> $b['QuantityMin'];
        });
        $priceCount = count($validPrices);

        foreach ($validPrices as $index => $validPrice) {
            $price = Price::computeCurrency($validPrice, 1)['Price'];
            $vatValue = $validPrice['vat']['Value'];
            $priceType = $validPrice['ProductPriceTypeCode'];

            if (in_array($priceType, [PriceType::PRICE_A, PriceType::PRICE_ACTION, PriceType::PRICE_CUSTOMER])) {

                // Výchozí originální cena je aktuální cena
                $originalPrice = $price;

                if ($priceType === PriceType::PRICE_ACTION) {
                    // Najdi cenu typu A pro výpočet slevy
                    $originalPriceItem = array_filter($productPrices, fn($item) => $item['ProductPriceTypeCode'] === PriceType::PRICE_A);
                    if ($originalPriceItem) {
                        $original = end($originalPriceItem);
                        $originalPrice = Price::computeCurrency($original, 1)['Price'] ?? $price;
                    }
                }

                // Spočítej slevu, pokud se originální cena liší od aktuální
                $discount = $originalPrice > 0 ? round((($originalPrice - $price) / $originalPrice) * 100) : 0;

                // Nastav data produktu
                $product['OriginalPriceWithoutVat'] = $originalPrice;
                $product['OriginalPriceWithVat'] = Price::priceToVat($originalPrice, $vatValue);
                $product['PriceWithoutVat'] = $price;
                $product['ProductDiscount'] = $discount;
                $product['PriceWithVat'] = Price::priceToVat($price, $vatValue);
            } else {
                $quantityMax = ($index < $priceCount - 1) ? $validPrices[$index + 1]['QuantityMin'] - 1 : null;
                $originalPriceWithVat = Price::priceToVat($price, $vatValue);
                $discount = $userDiscount ?: 0;
                $priceWithoutVat = $userDiscount ? Price::priceWithDiscount($price, $userDiscount) : $price;
                $priceWithVat = $userDiscount ? Price::priceToVat($priceWithoutVat, $vatValue) : $originalPriceWithVat;

                $product['additionalPrices'][$priceType] = [
                    'QuantityMin' => $validPrice['QuantityMin'],
                    'QuantityMax' => $quantityMax,
                    'OriginalPriceWithoutVat' => $price,
                    'OriginalPriceWithVat' => $originalPriceWithVat,
                    'ProductDiscount' => $discount,
                    'PriceWithoutVat' => $priceWithoutVat,
                    'PriceWithVat' => $priceWithVat,
                ];
            }
          }

        //  pokud A bez DPH rovno cene D tak se neaplikuje sleva
        if($userDiscount && isset($product['additionalPrices'][PriceType::PRICE_D])) {
            if( $product['PriceWithoutVat'] == $product['additionalPrices'][PriceType::PRICE_D]['PriceWithoutVat'] ) {
                $product['additionalPrices'][PriceType::PRICE_D]['ProductDiscount'] = 0;
                $product['additionalPrices'][PriceType::PRICE_D]['PriceWithoutVat'] = $product['additionalPrices'][PriceType::PRICE_D]['OriginalPriceWithoutVat'];
                $product['additionalPrices'][PriceType::PRICE_D]['PriceWithVat'] = $product['additionalPrices'][PriceType::PRICE_D]['OriginalPriceWithVat'];
            }
        }

        // pokud je D až B cena od qtyMin 1 tak platí ihned namísto ceny A
        $priceTypesWithPossibleQtyMin1 = [PriceType::PRICE_D, PriceType::PRICE_C, PriceType::PRICE_B];

        foreach ($priceTypesWithPossibleQtyMin1 as $priceType) {
            if ($userBasePriceTypeCode == $priceType && isset($product['additionalPrices'][$priceType])) {
                if ($product['additionalPrices'][$priceType]['QuantityMin'] == 1) {
                    $product['PriceWithoutVat'] = $product['additionalPrices'][$priceType]['PriceWithoutVat'];
                    $product['PriceWithVat'] = $product['additionalPrices'][$priceType]['PriceWithVat'];
                    $product['ProductDiscount'] = 0;
                    // a jelikož platí jen ta jediná cena tak ostatní ceny se smažou
                    unset($product['additionalPrices']);
                    break;
                }
            }
        }


        // Pokud má velkoodběratel $userDeactivateQuantityMin tak se sleva aplikuje ihned při prvním kusu tzn rovnou se nastaví na cenu A
        if ($userDeactivateQuantityMin) {
            $priceTypeToUse = null;

            // Přednostně použít cenu C, když není k dispozici, tak cenu B
            if (isset($product['additionalPrices'][PriceType::PRICE_C]) && $userBasePriceTypeCode == [PriceType::PRICE_C]) {
                $priceTypeToUse = PriceType::PRICE_C;
            } elseif (isset($product['additionalPrices'][PriceType::PRICE_B]) && $userBasePriceTypeCode == [PriceType::PRICE_B]) {
                $priceTypeToUse = PriceType::PRICE_B;
            }

            // Pokud byla nalezena použitelná cena, aplikujeme ji
            if ($priceTypeToUse) {
                $product['PriceWithoutVat'] = $product['additionalPrices'][$priceTypeToUse]['PriceWithoutVat'];
                $product['PriceWithVat'] = $product['additionalPrices'][$priceTypeToUse]['PriceWithVat'];
                unset($product['additionalPrices']);
            }

        }

        //pořešení množstevních slev, když jsou přidány do košíku a pokud u produktu existují
        if ($quantity && isset($product['additionalPrices'])) {
            $productPriceWithQuantity = array_filter($product['additionalPrices'], function ($item) use ($quantity) {
                return $item['QuantityMin'] <= $quantity && ($item['QuantityMax'] === null || $item['QuantityMax'] >= $quantity);
            });
            if($productPriceWithQuantity) {
                $product['PriceWithoutVat'] = end($productPriceWithQuantity)['PriceWithoutVat'];
                $product['PriceWithVat'] = end($productPriceWithQuantity)['PriceWithVat'];
            }
        }

        $this->setProduct($product);
    }

    /**
     * @return array
     */
    public function getProduct(): array {
        return $this->product;
    }

    /**
     * @param array $product
     */
    public function setProduct(array $product) {
        $this->product = $product;
    }

    /**
     * @return int|null
     */
    public function getUserDiscount(): ?int {
        return $this->userDiscount;
    }

    /**
     * @param int|null $userDiscount
     */
    public function setUserDiscount(?int $userDiscount): void {
        $this->userDiscount = $userDiscount;
    }

    /**
     * @return array
     */
    public function getGroupDiscount(): array {
        return $this->groupDiscount;
    }

    /**
     * @param array $groupDiscount
     */
    public function setGroupDiscount(array $groupDiscount): void {
        $this->groupDiscount = $groupDiscount;
    }

    /**
     * @return int|null
     */
    public function getCurrencyID(): ?int {
        return $this->currencyID;
    }

    /**
     * @param int|null $currencyID
     */
    public function setCurrencyID(?int $currencyID): void {
        $this->currencyID = $currencyID;
    }

    /**
     * @param array $productPrices
     * @param int $currentTime
     * @return mixed
     */
    private function handleActionPrice(array $productPrices, int $currentTime): mixed {
        return array_filter($productPrices, function ($item) use ($currentTime) {
            $isActionPrice = $item['ProductPriceTypeCode'] == PriceType::PRICE_ACTION;

            $isValid = true;

            if (isset($item['ValidFrom']) && !empty($item['ValidFrom'])) {
                $validFromTime = strtotime($item['ValidFrom']);
                if ($validFromTime > $currentTime) {
                    $isValid = false;
                }
            }

            if (isset($item['ValidTo']) && !empty($item['ValidTo'])) {
                $validToTime = strtotime($item['ValidTo']);
                if ($validToTime < $currentTime) {
                    $isValid = false;
                }
            }

            return $isActionPrice && $isValid;
        });
    }

    /**
     * @param User|bool|null $user
     * @param mixed $productPrices
     * @return mixed|null
     */
    private function handleCustomerPrice(User|bool|null $user, mixed $productPrices): ?array {
        return $user ? array_filter($productPrices, function ($item) use ($user) {
            return $item['ProductPriceTypeCode'] == PriceType::PRICE_CUSTOMER && $item['User_ID'] == $user->ID;
        }) : null;
    }

    /**
     * @param mixed $customerPrice
     * @param mixed $actionPrice
     * @return mixed
     */
    private function getValidSpecialPrice(?array $customerPrice, ?array $actionPrice): array {
        if (!empty($customerPrice) && !empty($actionPrice)) {
            $validPrices = $customerPrice['Price'] < $actionPrice['Price'] ? $customerPrice : $actionPrice;
        } else {
            $validPrices = !empty($customerPrice) ? $customerPrice : $actionPrice;
        }
        return $validPrices;
    }

    /**
     * @param string $userBasePriceTypeCode
     * @param array $productPrices
     * @return array|mixed
     */
    private function getValidStandardPrices(string $userBasePriceTypeCode, array $productPrices): array {
      // Mapování cenových typů na povolené kódy
        $priceTypeMappings = [
            PriceType::PRICE_A => ['A', 'B', 'C'],
            PriceType::PRICE_B => ['A', 'B', 'C'],
            PriceType::PRICE_C => ['A', 'B', 'C'],
            //TODO pořešit když je C A D
            PriceType::PRICE_D => ['A', 'B', 'D']
        ];

        // Získání povolených cenových kódů pro daný typ ceny uživatele
        $allowedPriceCodes = $priceTypeMappings[$userBasePriceTypeCode] ?? [];

        // Filtrování podle povolených cenových kódů
        $validPrices = empty($allowedPriceCodes) ? [] : array_filter($productPrices, function ($item) use ($allowedPriceCodes) {
            return in_array($item['ProductPriceTypeCode'], $allowedPriceCodes);
        });

        return $validPrices;
    }
}