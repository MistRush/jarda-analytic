<?php

namespace common\logic\HadexApi\Resources;

use Admin_Model_Product as ModelProduct;

class ProductSimple {


    public function __construct() {}

    public function getProductSimple() {
        $products = ModelProduct::getProductSimple();
        if($products) {
            return $products;
        } else {
            return ['status' => 'error', 'errorCode'=>404, 'message' => 'No products found'];
        }
    }


}