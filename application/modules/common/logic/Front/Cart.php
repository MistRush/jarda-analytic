<?php
namespace common\logic\Front;

use Admin_Model_Cart as CartModel;
use Admin_Model_Coupon as CouponModel;
use Admin_Model_Currency;
use Admin_Model_Product as Product;
use common\logic\Eshop\Eshop;
use common\logic\Helper\Price;
use user\logic\UserClientSession;

/**
 * Module constants
 */
class Cart {

    /**
     * @var ?int
     */
    private ?int $userID;

    /**
     * @var array
     */
    private array $cartItems = [];

    /**
     * @var float
     */
    private float $totalPriceWithoutVat;

    /**
     * @var float
     */
    private float $totalPriceWithVat;

    /**
     * @var int
     */
    private int $totalCount;

    /**
     * @var int
     */
    private int $totalWeight;

    /**
     * @var int
     */
    private int $productsCount;

    private Admin_Model_Currency|null $currency = null;

    /**
     * $coupon
     *
     * @var CouponModel|null
     */
    public $coupon;

    /**
     * $coupon
     *
     * @var int
     */
    public $totalPriceWithoutCoupon;

    /**
     * Constructor
     * @param int|null $userID
     */
    public function __construct(int $userID = null) {
        $this->setUserID($userID);

        $this->currency = Eshop::getInstance()->getCurrency();
        $this->computeCart();
    }


    /**
     * @return string|null
     */
    public function getCoupon(): ?string {
        return $this->coupon?->Code;
    }

    /**
     * compute cart
     */
    public function computeCart() {
        $userID = $this->getUserID();
        if ( !$userID && UserClientSession::getCurrentUserID() )
            $userID = UserClientSession::getCurrentUserID();

        $cartItems = CartModel::getCartItems($userID);
        $totalPriceWithVat = 0;
        $totalPriceWithoutVat = 0;
        $quantity = 0;
        $productsCount = 0;
        $totalWeight = 0;

        foreach ($cartItems as &$cartItem) {
            $cartItem['Vat'] = $cartItem['product']['productEshops'][0]['vat']['Value'];
            $cartItem['PriceWithVat'] = $cartItem['product']['PriceWithVat'];
            $cartItem['PriceWithoutVat'] = $cartItem['product']['PriceWithoutVat'];
            $totalPriceWithVat += $cartItem['Quantity'] * $cartItem['product']['PriceWithVat'];
            $totalPriceWithoutVat += $cartItem['Quantity'] * $cartItem['product']['PriceWithoutVat'];
            $quantity += $cartItem['Quantity'];
            $totalWeight += $cartItem['Quantity'] * $cartItem['product']['Weight'];
            $productsCount++;
        }

        $this->totalPriceWithVat = $totalPriceWithVat;
        $this->totalPriceWithoutVat = $totalPriceWithoutVat;
        $this->totalCount = $quantity;
        $this->cartItems = $cartItems;
        $this->totalWeight = $totalWeight;
        $this->productsCount = $productsCount;

        $this->totalPriceWithoutCoupon = $totalPriceWithVat;
        $this->coupon = CartModel::getCartCoupon($userID);

        if ($this->coupon && $this->totalPriceWithoutVat > 0) {
            if ($this->coupon->Type == CouponModel::TYPE_DISCOUNT) {
                $this->totalPriceWithoutVat -= (Price::computeCouponCurrency($this->coupon->Discount) / ($this->totalPriceWithVat / $this->totalPriceWithoutVat));
                $this->totalPriceWithVat -= (Price::computeCouponCurrency($this->coupon->Discount));
            } elseif ($this->coupon->Type == CouponModel::TYPE_PERCENTAGE) {
                $discount = (100 - $this->coupon->Discount) / 100;
                if ($discount > 0) {
                    $this->totalPriceWithoutVat *= $discount;
                    $this->totalPriceWithVat *= $discount;
                }
            }
        }

        $this->totalPriceWithVat = $this->totalPriceWithVat > 0 ? $this->totalPriceWithVat : 0;
        $this->totalPriceWithoutVat = $this->totalPriceWithoutVat > 0 ? $this->totalPriceWithoutVat : 0;
    }

    /**
     * @param ?int $userID
     * @param int $productID
     * @param int $quantity
     * @param bool $assignQuantity
     * @param int|null $parrentCartItemID
     * @return CartModel
     */
    public function updateCartProduct(?int $userID, int $productID, int $quantity, bool $assignQuantity, int $parrentCartItemID = null): CartModel {
        return CartModel::createCart($userID, $productID, $quantity, $assignQuantity, CartModel::getCartByProductID($userID, $productID), $parrentCartItemID);
    }

    /**
     * @param int|null $userID
     * @param int $productID
     */
    public function deleteCartProduct(?int $userID, int $productID) {
        $cartItem = CartModel::getCartByProductID($userID, $productID);

        if(!$cartItem)
            return;
        /* @var $cartItem CartModel */
        foreach ($cartItem->carts as $cartItem)
            CartModel::deleteCartProduct($userID, $cartItem->Product_ID);

        CartModel::deleteCartProduct($userID, $productID);
    }

    /**
     * @return array
     */
    public function getCartSummary(): array {
        $summary = [];
        $summary['TotalCount'] = $this->getTotalCount();
        $summary['TotalPriceWithVat'] = price($this->getTotalPriceWithVat(), $this->currency['Label']);
        $summary['TotalPriceWithoutVat'] = price($this->getTotalPriceWithoutVat(), $this->currency['Label']);
        $summary['TotalVat'] = price($this->getTotalPriceWithVat() - $this->getTotalPriceWithoutVat(), $this->currency['Label']);

        $cis = [];
        foreach ( $this->getCartItems() as $cartItem ) {
            $ci = [];
            $ci['ID'] = $cartItem['ID'];
            $ci['Product_ID'] = $cartItem['Product_ID'];
            $ci['Quantity'] = $cartItem['Quantity'];
            $ci['TotalQuantityOnStock'] = $cartItem['product']['TotalQuantity'];
            $ci['ProductName'] = $cartItem['ProductName'];
            $ci['ProductCode'] = $cartItem['product']['Code'];
            $ci['ProductImageUrl'] = isset($cartItem['product']['productImages'][0])?fu($cartItem['product']['productImages'][0], 'product/50'):null;
            $ci['slug'] = $cartItem['slug'];
            $ci['PriceWithVat'] = price($cartItem['PriceWithVat'], $this->currency['Label']);
            $ci['PriceWithoutVat'] = price($cartItem['PriceWithoutVat'], $this->currency['Label']);
            $ci['TotalPriceWithVat'] = price($cartItem['PriceWithVat'] * $cartItem['Quantity'], $this->currency['Label']);
            $ci['TotalPriceWithoutVat'] = price($cartItem['PriceWithoutVat'] * $cartItem['Quantity'], $this->currency['Label']);

            $cis[] = $ci;
        }

        $summary['cartItems'] = $cis;
        $summary['ProductsCount'] = $this->getProductsCount();

        if ($this->coupon) {
            $c = [];
            $c['Code'] = $this->coupon->Code;
            $c['Name'] = $this->coupon->getLang(Eshop::getInstance()->getLangID())->Name;
            $c['Type'] = $this->coupon->Type;
            $summary['Coupon'] = $c;
        } else {
            $summary['Coupon'] = null;
        }

        return $summary;
    }

    /**
     * Použije kupón
     * @param string|int|null $userID
     * @param string $coupon
     * @return CartModel|null
     * @throws \Exception
     */
    public function applyCoupon($userID, string $coupon): ?CartModel
    {
       return CartModel::applyCoupon($userID, $coupon, $this->getTotalPriceWithVat());
    }

    /**
     * Odebere kupón
     * @param string|int|null $userID
     */
    public function removeCoupon($userID) {
        CartModel::deleteCartCoupon($userID);
    }

    /**
     * @return int|null
     */
    public function getUserID(): ?int {
        return $this->userID;
    }

    /**
     * @param int|null $userID
     */
    public function setUserID(?int $userID): void {
        $this->userID = $userID;
    }

    /**
     * @return float
     */
    public function getTotalPriceWithoutVat(): float {
        return $this->totalPriceWithoutVat;
    }

    /**
     * @return float
     */
    public function getTotalPriceWithVat(): float {
        return $this->totalPriceWithVat;
    }

    /**
     * @return int
     */
    public function getTotalCount(): int {
        return $this->totalCount;
    }

    /**
     * @return int|null
     */
    public function getTotalWeight(): ?int {
        return $this->totalWeight;
    }

    /**
     * @return int
     */
    public function getProductsCount(): int {
        return $this->productsCount;
    }

    /**
     * @return array
     */
    public function getCartItems(): array {
        return $this->cartItems;
    }

    public function resetCart($userID = null) {
        CartModel::emptyCart($userID);
    }

    /** Single instance */
    private static self $instance;

    /**
     * Get single instace
     *
     * @param null $userID
     * @return Cart
     */
    public static function getInstance($userID = null): Cart {
        if (!isset(self::$instance)) {
            self::$instance = new Cart($userID);
        }

        return self::$instance;
    }

    public static function importProductsFromCsv(\Iterator $records) {
        $cart = self::getInstance();
        $userID = UserClientSession::getCurrentUserID();
        $importedCount = 0;
        foreach ($records as $record) {
            $product = Product::getProductByCode($record['ProductCode']);
            if (!$product) {
                continue;
            }
            $productID = $product->ID;
            $quantity = (int) $record['Quantity'];
            $cart->updateCartProduct($userID??null, $productID, $quantity, false);
            $importedCount++;
        }

        if ($importedCount == 0) {
           throw new \Exception('Žádný produkt nebyl z csv souboru importován');
        }
    }


}