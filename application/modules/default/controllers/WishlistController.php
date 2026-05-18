<?php

use common\logic\Front\WishList;
use user\logic\UserClientSession;

class WishlistController extends BaseController {

    public function indexAction() {
        $wishList = WishList::getInstance();
//
//        if ( $cart->getTotalCount() == 0 ) {
//            $this->forward('empty', 'cart', 'default');
//            return;
//        }
//
        if($userID = UserClientSession::getCurrentUserID()) {
            $isLogged = 1;
        } else {
            $isLogged = 0;
        }
//
//
        $this->renderLatte([
            'wishListItems' => $wishList->getWishListItems($userID),
            'title' => translate('Oblíbené produkty'),
            'metaDescription' => translate('Oblíbené produkty'),
            'metaKeywords' => '',
            'isLogged' => $isLogged,
        ]);
    }

    public function updateWishListAction() {
        $successMsg = '';
        $failMsg = '';
        $valid = true;

        $productID = (int) $this->getRequest()->getParam('ProductID');
        $userID = UserClientSession::getCurrentUserID();

        if ( !is_integer($productID) ) {
            $valid = false;
        }

        if ( $valid ) {
            Wishlist::getInstance()->updateWishList($userID, $productID);
            $successMsg = translate('Seznam oblíbených produktů byl aktualizován');
        }

        $wishlistSummary['successMsg'] = $successMsg;
        $wishlistSummary['failMsg'] = $failMsg;

        echo Zend_Json::encode($wishlistSummary);
    }

    public function deleteWishListItemAction() {
        $productID = $this->getRequest()->getParam('ProductID');
        $userID = UserClientSession::getCurrentUserID();

        WishList::getInstance()->deleteWishListItem($userID, $productID);

//        echo Zend_Json::encode(Cart::getInstance()->getCartSummary());
    }
}