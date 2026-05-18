<?php
use Admin_Model_Product as Product;
use Admin_Model_ProductImage as ProductImage;
use Admin_Model_Shipping as Shipping;

class ModalController extends BaseController {

    public function addToCartAction() {
        $request = $this->getRequest();
        $quantity = (int) $request->getParam('Quantity');
        $product = Product::getProductByID($request->getParam('Product_ID'), requiredQuantity:$quantity);
        $mainImage = ProductImage::getProductMainImage($product['ID']);
        $freeShipping = Shipping::getFreeShipping();

        $params = [
            'product' => $product,
            'mainImage' => $mainImage[0] ?? [],
            'dialog_id' => $request->getParam('dialog_id'),
            'freeShipping' => $freeShipping??null

        ];

        $this->renderLatte($params);
    }

    public function loginAction() {
        $this->renderLatte([]);
    }

    public function cartClearConfirmationAction() {
        $title = $this->getRequest()->getParam('title');
        $content = $this->getRequest()->getParam('content');

        $params = [
            'title' => translate($title),
            'content' => translate($content),
            'dialog_id' => $this->getParam('dialog_id'),
        ];

        $this->renderLatte($params);
    }

    public function cartOutStockInfoAction() {
        $stockCheck = $this->getRequest()->getParam('stockCheck');
        $params = [
            'stockCheck' => $stockCheck,
            'dialog_id' => $this->getParam('dialog_id'),
        ];

        $this->renderLatte($params);
    }

    public function deleteAddressConfirmationAction() {
        $addressID = $this->getRequest()->getParam('addressId');

        $params = [
            'addressID' => $addressID,
            'dialog_id' => $this->getParam('dialog_id'),
            'content' => $this->getParam('content'),
        ];

        $this->renderLatte($params);
    }

    public function watchdogConfirmationAction() {
        $params = [
            'dialog_id' => $this->getParam('dialog_id'),
            'content' => $this->getParam('content'),
        ];

        $this->renderLatte($params);
    }
}