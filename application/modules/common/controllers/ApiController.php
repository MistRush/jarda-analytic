<?php


use common\logic\Api\Authorization;
use common\logic\Api\Base;
use common\logic\Api\Orders;
use common\logic\Api\Products;

class Common_ApiController extends Clevis_Zend_Controller_Action {

    public function init() {
        parent::init();

        $this->disableLayout();
    }

    public function __call($name, $arguments)
    {
        Base::sendNotFound($name);
    }

    public function indexAction() {
        echo "Api";
    }

    /**
     * @throws Zend_Json_Exception
     * @throws Exception
     */
    public function authorizeAction() {
        $data = Zend_Json::decode($this->getRequest()->getRawBody());
        Authorization::authorize($data);
    }

    public function clearSessionAction() {
        Authorization::clearUserxSession();
    }

    /**
     * @throws Zend_Json_Exception
     */
    public function createOrderAction() {
       $token = $this->getTokenFromHeader($this->getRequest());
       $data = Zend_Json::decode($this->getRequest()->getRawBody());
        if($token)
       Orders::createOrder($token, $data);
   }

    /**
     * @throws Doctrine_Query_Exception
     */
    public function getProductAvailabilityAction() {
      $token = $this->getTokenFromHeader($this->getRequest());
        if($token)
      Products::getProductAvailability($token);
   }

    /**
     * @throws Doctrine_Query_Exception
     */
    public function getProductPriceAction() {
        $token = $this->getTokenFromHeader($this->getRequest());
        $sinceDate = $this->getRequest()->getParam('since-date');
        if($token)
        Products::getProductPrice($token, $sinceDate);
    }

    /**
     * @throws Doctrine_Query_Exception
     */
    public function getProductCountAction() {
        $token = $this->getTokenFromHeader($this->getRequest());
        if($token)
        Products::getProductCount($token);
    }

    /**
     * @throws Doctrine_Query_Exception
     */
    public function getProductsAction(){
        ini_set('memory_limit','-1');
        $token = $this->getTokenFromHeader($this->getRequest());
        $sinceDate = $this->getRequest()->getParam('since-date');
        $productIDs = $this->getRequest()->getParam('product-ids');
        $productCodes = $this->getRequest()->getParam('product-codes');
        $offset = $this->getRequest()->getParam('offset');
        $limit= $this->getRequest()->getParam('limit');
        Products::getProducts($token, $productIDs, $productCodes, $offset, $limit, $sinceDate);
   }

    /**
     * @throws Doctrine_Query_Exception
     */
    public function createProductAction(){
        $token = $this->getTokenFromHeader($this->getRequest());
        $data = Zend_Json::decode($this->getRequest()->getRawBody());
        if($token)
        Products::createProduct($token, $data);
    }

    /**
     * @throws Doctrine_Query_Exception
     */
    public function updateProductStockAction(){
        $token = $this->getTokenFromHeader($this->getRequest());
        $data = Zend_Json::decode($this->getRequest()->getRawBody());
        if($token)
        Products::updateProductStock($token, $data);
    }

    private function getTokenFromHeader($request): array|string
    {
        $token = $request->getHeader('Auth');
        if(strlen($token)>0) {
            return str_replace('Bearer ', '', $token);
        } else {
            return false;
        }
    }
}
