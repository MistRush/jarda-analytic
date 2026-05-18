<?php
namespace common\logic\Front;

use Admin_Model_WishList as WishListModel;
use common\logic\Eshop\Eshop;
use common\logic\Helper\Price;
use user\logic\UserClientSession;
use user\logic\UserSettings;

/**
 * Module constants
 */
class WishList {

    /**
     * @var ?int
     */
    private ?int $userID;

    /**
     * @var array
     */
    private array $wishListItems = [];

    /**
     * Constructor
     * @param int|null $userID
     */
    public function __construct(int $userID = null) {
        $this->setUserID($userID);
    }

    public function getWishListItems($userID = null): array {
        if ( !$userID && UserClientSession::getCurrentUserID() )
            $userID = UserClientSession::getCurrentUserID();
        $cartItems = WishListModel::getWishListItems($userID);
        return $this->wishListItems = $cartItems;
    }

    /**
     * @param ?int $userID
     * @param int $productID
     * @param int $quantity
     * @param bool $assignQuantity
     * @param int|null $parrentCartItemID
     * @return CartModel
     */
    public function updateWishList(?int $userID, int $productID): WishListModel {
        return WishListModel::createWishlist($userID, $productID);
    }

    /**
     * @param int|null $userID
     * @param int $productID
     */
    public function deleteWishListItem(?int $userID, int $productID): void
    {
        $wishlistItem = WishListModel::getWishListByProductID($userID, $productID);

        if(!$wishlistItem)
            return;
          WishListModel::deleteWishListItem($userID, $wishlistItem->Product_ID);
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
            $ci['ProductName'] = $cartItem['ProductName'];
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



    /** Single instance */
    private static self $instance;

    /**
     * Get single instance
     *
     * @param null $userID
     * @return Wishlist
     */
    public static function getInstance($userID = null): Wishlist {
        if (!isset(self::$instance)) {
            self::$instance = new Wishlist($userID);
        }

        return self::$instance;
    }
}