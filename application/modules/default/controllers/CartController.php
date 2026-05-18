<?php
use Admin_Model_Cart as ModelCart;
use Admin_Model_Product as Product;
use common\logic\Front\Cart;
use common\logic\Front\CartStep\CartStep;
use default\components\Order as OrderComponents;
use League\Csv\Reader;
use user\logic\UserClientSession;

class CartController extends BaseController {

    public function indexAction() {
        $cart = Cart::getInstance();

        if ( $cart->getTotalCount() == 0 ) {
            $this->forward('empty', 'cart', 'default');
            return;
        }

        $this->renderLatte([
            'cartItems' => $cart->getCartItems(),
            'totalPriceWithVat' => $cart->getTotalPriceWithVat(),
            'totalPriceWithoutVat' => $cart->getTotalPriceWithoutVat(),
            'totalVat' => $cart->getTotalPriceWithVat() - $cart->getTotalPriceWithoutVat(),
            'totalCount' => $cart->getTotalCount(),
            'cartSteps' => OrderComponents::cartSteps(CartStep::ORDER_CART),
            'title' => translate('Nákupní košík'),
            'metaDescription' => translate('Nákupní košík'),
            'metaKeywords' => '',
            'coupon' => $cart->coupon,
            'isLogged' => boolval(UserClientSession::getCurrentUserID()),
        ]);
    }

    public function updateCartProductAction() {
        $successMsg = '';
        $failMsg = '';
        $valid = true;

        $productID = (int) $this->getRequest()->getParam('ProductID');
        $quantity = (int) $this->getRequest()->getParam('Quantity');
        $assign = $this->getRequest()->getParam('Assign');
        $userID = UserClientSession::getCurrentUserID();

        $cartByProduct = ModelCart::getCartByProductID($userID, $productID);
        $product = Product::getProductByID($productID, requiredQuantity:$quantity);
        $totalQuantity = $product['TotalQuantity'];
        $productID = (int)$product['ID'];

        $finalQuantity = $quantity;
        if ( !$assign && $cartByProduct )
            $finalQuantity = $quantity + $cartByProduct->Quantity;

        if ( !is_integer($productID) || !is_integer($quantity) || $quantity < 1 ) {
            $valid = false;
            $failMsg = translate('Zadaná hodnota musí být celé číslo.');
        }

        if ( $finalQuantity > $product['TotalQuantity'] ) {
            $valid = false;
            $failMsg = translate('Není možné přidat do košíku víc než je skladem.');
        }

        if ( $valid ) {
            Cart::getInstance()->updateCartProduct($userID, $productID, $quantity, $assign == true && $assign != 'false');
            $successMsg = translate('Košík byl úspěšně aktualizován.');
        }

        Cart::getInstance()->computeCart();
        $cartSummary = Cart::getInstance()->getCartSummary();
        $cartSummary['successMsg'] = $successMsg;
        $cartSummary['failMsg'] = $failMsg;
        $cartSummary['totalQuantity'] = $totalQuantity;
        $cartSummary['productID'] = $productID;

        if ($cartSummary['Coupon']) {
            $params = $this->getBaseParams();
            $params['coupon'] = Cart::getInstance()->coupon;
            $cartSummary['CouponItemHtml'] = $this->latte->renderToString(__DIR__ . '/../views/latte/cart/coupon.latte', $params);
        } else {
            $cartSummary['CouponItemHtml'] = null;
        }

        echo Zend_Json::encode($cartSummary);
    }

    public function deleteCartProductAction() {
        $productID = $this->getRequest()->getParam('ProductID');
        $userID = UserClientSession::getCurrentUserID();

        Cart::getInstance()->deleteCartProduct($userID, $productID);
        Cart::getInstance()->computeCart();

        echo Zend_Json::encode(Cart::getInstance()->getCartSummary());
    }

    public function emptyAction() {
        $this->renderLatte([
            'title' => translate('Nákupní košík je prázdný'),
            'metaDescription' => translate('Nákupní košík je prázdný'),
            'metaKeywords' => '',
        ]);
    }

    public function importProductsFromCsvAction() {
        $delimiter = $this->getRequest()->getParam('Delimiter')??';';
        $transfer = new Zend_File_Transfer_Adapter_Http();
        $fileInfo = $transfer->getFileInfo();

        if(empty($fileInfo["File"]["tmp_name"])) {
            echo json_encode(array('status' => 'error', 'error_message' => 'Chyba při nahrávání souboru!'));
            return;
        }

        try {
            $reader = Reader::createFromPath($fileInfo["File"]["tmp_name"], 'r+');
            $reader->setDelimiter($delimiter);
            $headers = ['ProductCode', 'Quantity'];
            $records = $reader->getRecords($headers);

            Cart::importProductsFromCsv($records);
            echo json_encode(array('status' => 'success', 'message' => 'Produkty byly úspěšně importovány do košíku.'));
        } catch (Exception $e) {
            echo json_encode(array('status' => 'error', 'error_message' => 'Chyba v csv souboru! Zkontrolujte prosím, že všechny sloupce mají svůj název!'));
            return;
        }

    }

    public function checkProductStockQuantityAction() {
        $productID = $this->getRequest()->getParam('ProductID');
        $quantity = $this->getRequest()->getParam('Quantity');
        $quantityAlreadyInCart = 0;

        $product = Product::getProductByID($productID);

        $cart = Cart::getInstance();

        $cartItems = $cart->getCartItems();

        if($cartItems) {
            foreach ($cartItems as $cartItem) {
                if ($cartItem['Product_ID'] == $productID) {
                    $quantityAlreadyInCart += $cartItem['Quantity'];
                }
            }
        }

        $allowedQuantity = ($product['TotalQuantity'] - $quantityAlreadyInCart ) < $quantity ? ($product['TotalQuantity'] - $quantityAlreadyInCart) : $quantity;

        if($allowedQuantity < 0) {
            $allowedQuantity = 0;
        }

        echo json_encode([
            'ProductName' => $product['ProductName'],
            'ProductCode' => $product['Code'],
            'TotalQuantity' => $product['TotalQuantity'],
            'QuantityDiff' => ($product['TotalQuantity'] - $quantityAlreadyInCart) < $quantity,
            'AllowedQuantity' => $allowedQuantity
        ]);
    }

    public function clearAction(){
        $userID = UserClientSession::getCurrentUserID();
        Cart::getInstance()->resetCart($userID);
        $this->forward('empty', 'cart', 'default');
    }

    public function applyCouponAction() {
        $coupon = $this->getParam('coupon');
        $out = [
            'error' => false,
            'error_msg' => null
        ];

        if (empty($coupon)) {
            $out['error'] = true;
            $out['error_msg'] = translate('Kupón nebyl zadán.');
        }

        $cart = Cart::getInstance();
        $userID = UserClientSession::getCurrentUserID();

        if ($cart->getCoupon()) {
            $out['error'] = true;
            $out['error_msg'] = translate('Lze použít pouze jeden kupón.');
        } else {
            if ( !$cart->applyCoupon($userID, $coupon)) {
                $out['error'] = true;
                $out['error_msg'] = translate('Kupón neexistuje');
            }
        }

        die (json_encode($out));
    }

    public function removeCouponAction() {
        $cart = Cart::getInstance();
        $userID = UserClientSession::getCurrentUserID();
        $cart->removeCoupon($userID);
    }
}