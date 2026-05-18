<?php

namespace common\logic\Api;

use Admin_Model_Parameter;
use Admin_Model_ParameterValue;
use Admin_Model_Product as Product;
use Admin_Model_ProductImage as ProductImage;
use Admin_Model_ProductParameter;
use common\logic\File\Uploader;
use Common_Model_File as File;
use Doctrine_Query;
use ReallySimpleJWT\Token;
use Zend_Json;

class Products extends Base {

    /**
     * @throws \Doctrine_Query_Exception
     * @throws \Exception
     */
    public static function getProductAvailability($token){
        if (!Authorization::isAuthorized($token, 'api-product')) {
            parent::sendOutput(json_encode(array("msg" => 'Fail wrong authorization')), array('Content-Type: application/json', 'HTTP/1.1 403 Forbidden'));
        }
        $products = Product::getProductsForAvailability();
        parent::sendOutput(Zend_Json::encode($products), array('Content-Type: application/json', 'HTTP/1.1 200 OK'));
    }

    /**
     * @throws \Doctrine_Query_Exception
     * @throws \Exception
     */
    public static function getProductPrice($token, $sinceDate){
        if (!Authorization::isAuthorized($token, 'api-product')) {
            parent::sendOutput(json_encode(array("msg" => 'Fail wrong authorization')), array('Content-Type: application/json', 'HTTP/1.1 403 Forbidden'));
        }

        $products = Product::getProductsForPrice($sinceDate);

        parent::sendOutput(Zend_Json::encode($products), array('Content-Type: application/json', 'HTTP/1.1 200 OK'));
    }

    /**
     * @throws \Doctrine_Query_Exception
     * @throws \Exception
     */
    public static function getProducts($token, $apiProductIDs = null, $productCodes = null, $offset = null, $limit = null, $sinceDate = null)
    {
        $payloadData = Token::getPayload($token);

        if (!Authorization::isAuthorized($token, 'api-product')) {
            \Admin_Model_ApiLog::insertRecord([
                'User' => $payloadData['iss'],
                'Url' => htmlentities($_SERVER['REQUEST_URI']),
                'StatusCode' => '403 Forbidden',
                'Message' => 'Wrong permission',
            ]);
            parent::sendOutput(json_encode(array("msg" => 'Fail wrong authorization')), array('Content-Type: application/json', 'HTTP/1.1 403 Forbidden'));
        }

        if ($apiProductIDs) {
            $apiProductIDs = explode(',', $apiProductIDs);
        }

        if ($productCodes) {
            $productCodes = explode(',', $productCodes);
        }
        $products = Product::getProductsForAPI(productIDs: $apiProductIDs, productCodes: $productCodes, offset: $offset, limit: $limit, sinceDate: $sinceDate);
        $numberOfProducts = count($products);
        \Admin_Model_ApiLog::insertRecord([
            'User' => $payloadData['iss'],
            'Url' => htmlentities($_SERVER['REQUEST_URI']),
            'StatusCode' => '200 OK',
            'Message' => $numberOfProducts. ' products fetched',
        ]);
        parent::sendOutput(Zend_Json::encode($products), array('Content-Type: application/json', 'HTTP/1.1 200 OK'));
    }

    /**
     * @throws \Doctrine_Query_Exception
     * @throws \Exception
     */
    public static function getProductCount($token){
        if (!Authorization::isAuthorized($token, 'api-product')) {
            parent::sendOutput(json_encode(array("msg" => 'Fail wrong authorization')), array('Content-Type: application/json', 'HTTP/1.1 403 Forbidden'));
        }

        $productCount = Product::getProductsCount();
        parent::sendOutput(Zend_Json::encode(array("ProductsCount" => $productCount)), array('Content-Type: application/json', 'HTTP/1.1 200 OK'));
    }

    /**
     * @throws \Exception
     */
    public static function createProduct($token, $data){
        if (!Authorization::isAuthorized($token, 'api-product')) {
            parent::sendOutput(json_encode(array("msg" => 'Fail invalid authorization token')), array('Content-Type: application/json', 'HTTP/1.1 403 Forbidden'));
        }
        try {
            $product = new \Admin_Model_Product();
            $product->Manufacturer_ID = self::getManufacturerID($data['Manufacturer']);
            $product->Code = $data['Code'];
            $product->OnStock = $data['OnStock'];
            $product->save();
        } catch (\Exception $e) {

            parent::sendOutput(json_encode(array("msg" => 'Fail, product has not been created')), array('Content-Type: application/json', 'HTTP/1.1 200 OK'));
        }


        $productLang = new \Admin_Model_ProductLang();
        $productLang->Name = $data['Name'];
        $productLang->Language_ID = \Common_Model_Eshop::getFirstEshop()->Language_ID;
        $productLang->Description = $data['Description'];
        $productLang->MetaDescription = $data['MetaDescription'];
        $productLang->Product_ID = $product->ID;
        $productLang->save();

        self::updateProductPrice($product->ID, (float)$data['PriceWithoutVat']);

        if ( isset($data['parameters']) ) {
            foreach ($data['parameters'] as $parameterData) {
                $parameterID = self::getParameterID($parameterData['Name'], $parameterData['Unit']);
                $parameter = new Admin_Model_ProductParameter();
                $parameter->Parameter_ID = $parameterID;
                $parameter->Product_ID = $product->ID;
                $parameter->Value = $parameterData['Value'];
                $parameter->ParameterValue_ID = self::getParameterValueID($parameterID, $parameterData['Value']);
                $parameter->save();
            }
        }

        if ( isset($data['categories']) ) {
            foreach ($data['categories'] as $category) {
                $productInCategory = new \Admin_Model_ProductInCategory();
                $productInCategory->Product_ID = $product->ID;
                $productInCategory->Category_ID = $category['ID'];
                $productInCategory->save();
            }

        }

        if ( isset($data['images']) ) {
            foreach ($data['images'] as $image) {
                $fileNameExplode = explode('/', $image['Path']);
                $uploader = new Uploader($image['Path'], end($fileNameExplode), File::TYPE_PRODUCT_PHOTO);
                $commonFile = File::createFile(File::TYPE_PRODUCT_PHOTO, $uploader->getFileName(), $uploader->getExtension());

                $productImage = new ProductImage();
                $productImage->Product_ID = $product->ID;
                $productImage->Main = $image['Main'];
                $productImage->File_ID = $commonFile->ID;
                $productImage->Description = $image['Description'];
                $productImage->save();
            }
        }

        parent::sendOutput(Zend_Json::encode(array("msg" => "Success. Produkt byl úspěšně vytvořen", "productID" => $product->ID)), array('Content-Type: application/json', 'HTTP/1.1 200 OK'));

    }

    public static function updateProductStock($token, $data) {
        if(!Authorization::isAuthorized($token, 'api-product')) {
            parent::sendOutput(json_encode(array("msg" => 'Fail invalid authorization token')), array('Content-Type: application/json', 'HTTP/1.1 403 Forbidden'));
        }
        try {
            $product = new \Admin_Model_Product();
            $product->Manufacturer_ID = self::getManufacturerID($data['Manufacturer']);
            $product->Code = $data['Code'];
            $product->API_ID = $data['API_ID'];
            $product->OnStock = $data['OnStock'];
            $product->save();
        } catch (\Exception $e) {
            parent::sendOutput(json_encode(array("msg" => 'Fail, product has not been updated')), array('Content-Type: application/json', 'HTTP/1.1 200 OK'));
        }
    }

    private static function getManufacturerID($name) {
        $query = Doctrine_Query::create();
        $query->from('Admin_Model_Manufacturer object');
        $query->where('object.Name = ?', $name);
        $manufacturer = $query->execute()->toArray();

        if ($manufacturer) {
            return $manufacturer[0]['ID'];
        } else {
            $manufacturer = new \Admin_Model_Manufacturer();
            $manufacturer->Name = $name;
            $manufacturer->save();
            return $manufacturer->ID;
        }
    }

    private static function getParameterValueID($parameterID, $value) {
        $query = Doctrine_Query::create();
        $query->from('Admin_Model_ParameterValue object');
        $query->where('object.Parameter_ID = ?', $parameterID);
        $query->andWhere('object.Value = ?', $value);
        $parameterValue = $query->execute()->toArray();

        if ( $parameterValue ) {
            return $parameterValue[0]['ID'];
        } else {
            $parameterValue = new Admin_Model_ParameterValue();
            $parameterValue->Parameter_ID = $parameterID;
            $parameterValue->Value = $value;
            $parameterValue->save();

            return $parameterValue->ID;
        }
    }

    private static function getParameterID($parameterName, $unit): int
    {
        $query = Doctrine_Query::create();
        $query->from('Admin_Model_ParameterLang object');
        $query->where('object.Name= ?', $parameterName);
        $parameterID = $query->execute()->toArray();

        if ( $parameterID ) {
            return $parameterID[0]['Parameter_ID'];
        } else {
            $parameter = new Admin_Model_Parameter();
            $parameter->Unit = $unit;
            $parameter->save();

            $parameterLang = new \Admin_Model_ParameterLang();
            $parameterLang->Name = $parameterName;
            $parameterLang->Language_ID = \Common_Model_Eshop::getFirstEshop()->Language_ID;
            $parameterLang->Parameter_ID = $parameter->ID;
            $parameterLang->save();

            return $parameterLang->Parameter_ID;
        }
    }

    /**
     * @throws \Doctrine_Query_Exception
     */
    private static function updateProductPrice($productID, $price) {
        $query = Doctrine_Query::create();
        $query->update('Admin_Model_ProductEshop object');
        $query->set('object.Price', '?', $price);
        $query->where('object.Product_ID=?', $productID);
        $query->execute();
    }


}
