<?php

namespace common\logic\HadexApi\Resources;

use Admin_Model_Parameter as Parameter;
use Admin_Model_Vat as Vat;
use Admin_Model_ParameterValue as ParameterValue;
use Admin_Model_ProductSlugHistory as ProductSlugHistory;
use Admin_Model_Product as ProductModel;
use Admin_Model_ProductLang as ProductLang;
use Admin_Model_ProductInCategory as ProductInCategory;
use Admin_Model_ProductEshop as ProductEshop;
use Admin_Model_ProductMeta as ProductMeta;
use Admin_Model_ProductParameter as ProductParameter;
use Admin_Model_Stock as Stock;
use Admin_Model_ProductStock as ProductStock;
use Admin_Model_ProductRelated as ProductRelated;
use Admin_Model_Category as Category;
use Admin_Model_ApiLog as ApiLog;
use Admin_Model_ProductAttachment as ModelProductAttachment;
use User_Model_User as User;
use common\logic\HadexApi\Converters\DateTimeConverter;
use common\logic\HadexApi\Enums\PriceType;


class Product {

    private string $taxType;
    private int $productID;
    private bool $productUpdate;
    private string $productCode;
    private ?ProductModel $productModel;
    private ProductLang $productLang;
    private ?array $productPrices;
    private ?array $productStocks;
    private ?array $productLinks;
    private ?array $productMetas;
    private ?array $productAttributes;
    private ?array $productCategories;
    private ?array $productAttachments;


    public function __construct() {
        $this->taxType = '';
        $this->productUpdate = false;
        $this->productAttachments = null;
        $this->productCategories = null;
        $this->productMetas = null;
        $this->productPrices = null;
        $this->productStocks = null;
        $this->productLinks = null;
        $this->productAttributes = null;
        $this->apiLog = new ApiLog();
    }

    public function getProduct($productID=null, $productCode = null) {
          if(!$productID && !$productCode) {
              return [
                  'errorCode' => 400,
                  'message' => 'Product ID or Product Code is required'
              ];
          }
          if($productID) {
              $this->productModel = ProductModel::getProductObjByID($productID);
          } else {
              $this->productModel = ProductModel::getProductByCode($productCode);
          }

          if(!$this->productModel) {
              return [
                  'errorCode' => 404,
                  'message' => 'Product not found'
              ];
          }

        $this->productID =  $this->productModel->ID;
        $this->productCode =  $this->productModel->Code;
        $this->productLang = ProductLang::getProductLang($this->productID);
        $attachments = new ProductAttachment(productID: $this->productID);
        $attachments = $attachments->getAttachment();

        if(isset($attachments[0]) && $attachments) {
            foreach($attachments as $attachment) {
                $this->productAttachments[] = $attachment;
            }
        }

        $productCategories = ProductInCategory::getProductCategories($this->productID);
        if(isset($productCategories[0]) && $productCategories[0]) {
            foreach($productCategories as $productCategory) {
                $this->productCategories[] = $productCategory->category->Code;
            }
        }

        $productMetas = ProductMeta::getProductMetas($this->productID);
        if(isset($productMetas[0]) && $productMetas[0]) {
            foreach($productMetas as $productMeta) {
                $this->productMetas[] = $productMeta;
            }
        }

        $productPrices = ProductEshop::getProductPrices($this->productID);
        if(isset($productPrices[0]) && $productPrices[0]) {
            foreach($productPrices as $productPrice) {
                $this->productPrices[] = $productPrice;
            }
        }

        $productStocks = ProductStock::getProductStocksByProductID($this->productID);
        if(isset($productStocks[0]) && $productStocks[0]) {
            foreach($productStocks as $productStock) {
                $this->productStocks[] = $productStock;
            }
        }

        $productLinks = ProductRelated::getProductsRelatedByProductID($this->productID);
        if(isset($productLinks[0]) && $productLinks[0]) {
            foreach($productLinks as $productLink) {
                $this->productLinks[] = $productLink;
            }
        }

        $productAttributes = ProductParameter::getProductParameters($this->productID);
        if(isset($productAttributes[0]) && $productAttributes[0]) {
            foreach($productAttributes as $productAttribute) {
                $this->productAttributes[] = $productAttribute;
            }
        }

        return $this->getResponse();
    }

    public function processProduct($data): array|bool {
        //Když je přítomno ID produktu jedná se o aktualizaci
        if (isset($data['id']) && $data['id']) {
            $this->productUpdate = true;
            $productModel = ProductModel::getProduct($data['id']);
            if (!$productModel) {
                return [
                    'errorCode' => 404,
                    'message' => 'Product not found'
                ];
            }

        }

        if(!$this->productUpdate) {
            $fieldsCheck = $this->createProductRequiredFieldsCheck($data);
            if ($fieldsCheck['status'] === 'error') {
                return $fieldsCheck;
            }
        }


        $basicProductData = [
            'id' => $data['id'] ?? null,
            'code' => $data['code']?? null,
            'ean' => $data['ean']?? null,
            'isAvailable' => $data['isAvailable']?? null,
//            'stockItemCount' => $data['stockItemCount']?? null,
        ];


        $productLangData = [
            'name' => $data['name']?? null,
            'shortDescription' => $data['ean']?? null,
            'description' => $data['description']?? null,
            'note' => $data['note']?? null,
            'url' => $data['url']?? null,
        ];


        $this->taxType = $data['taxType'];

        $productAttachmentsData = $data['attachments'] ?? null;
        $productAttributesData = $data['productAttributes'] ?? null;
        $productCategoriesData = $data['categories'] ?? null;
        $productMetasData = $data['productMetas'] ?? null;
        $productPricesData = $data['productPrices'] ?? null;
        $productStocksData = $data['productStocks'] ?? null;
        $productLinksData = $data['productLinks'] ?? null;

        $this->productModel = $this->handleProductModelCreate($basicProductData);
        $this->productLang = $this->handleProductLangCreate($productLangData);

        if (isset($productAttachmentsData[0]) && $productAttachmentsData) {
            foreach ($productAttachmentsData as $dataItem) {
                $this->handleProductAttachments($dataItem);
            }
        }
        if (isset($productCategoriesData[0]) && $productCategoriesData) {
            if ($this->productUpdate) {
                ProductInCategory::deleteProductInCategory($this->productID);
            }
            foreach ($productCategoriesData as $dataItem) {
                $this->handleProductCategory($dataItem);
            }
        }
        if (isset($productMetasData[0]) && $productMetasData) {
            if ($this->productUpdate) {
                ProductMeta::deleteProductMeta($this->productID);
            }
            foreach ($productMetasData as $dataItem) {
                $this->handleProductMetaData($dataItem);
            }
        }
        if (isset($productPricesData[0]) && $productPricesData) {
            if ($this->productUpdate) {
                ProductEshop::deleteProductEshopPrice($this->productID);
            }
            foreach ($productPricesData as $dataItem) {
                $this->handleProductEshopPriceCreate($dataItem);
            }
        }
        if (isset($productStocksData[0]) && $productStocksData) {
            if ($this->productUpdate) {
                ProductStock::deleteProductStock($this->productID);
            }
            foreach ($productStocksData as $dataItem) {
                $this->handleProductStock($dataItem);
            }
        }
        if (isset($productLinksData[0]) && $productLinksData) {

            if ($this->productUpdate) {
                ProductRelated::deleteProductRelated($this->productID);
            }
            foreach ($productLinksData as $dataItem) {
                $this->handleProductLink($dataItem);
            }
        }

        if (isset($productAttributesData[0]) && $productAttributesData) {
            if ($this->productUpdate) {
                ProductParameter::deleteProductParameters($this->productID);
            }
            foreach ($productAttributesData as $dataItem) {
                $this->handleProductAttributes($dataItem);
            }
        }

        return $this->getResponse();

    }


    private function createProductRequiredFieldsCheck($data): array|bool {
        $requiredFields = [
            'code' => 'Missing code',
            'isAvailable' => 'Missing isAvailable',
            'taxType' => 'Missing taxType',
//            'stockItemCount' => 'Missing stockItemCount',
            'name' => 'Missing name',
        ];

        $check = $this->checkRequiredFields($data, $requiredFields);
        if ($check !== true) {
            return $check;
        }

        return ['status' => 'success'];
    }


    private function checkRequiredFields(array $data, array $requiredFields): array|bool {
        foreach ($requiredFields as $field => $message) {
            if (!isset($data[$field])) {
                return ['status' => 'error', 'errorCode' => 400, 'message' => $message];
            }
        }
        return true;
    }

    private function handleProductModelCreate(array $basicProductData): ProductModel | array {
        if ($this->productUpdate) {
            $productModel = ProductModel::getProduct($basicProductData['id']);
        } else {
            $productModel = new ProductModel();
        }
        return $this->processProductModel($productModel, $basicProductData);

    }
    private function handleProductLangCreate(array $productLangData): ProductLang {
        if ($this->productUpdate) {
            $productLang = ProductLang::getProductLang($this->productID);
        } else {
            $productLang = new ProductLang();
        }

        return $this->processProductLang($productLang, $productLangData);
    }

    private function handleVatType(string $taxType) {
        return match($taxType)  {
            'REDUCED' => Vat::getVatIDByRatio(12),
            'REDUCED2' => Vat::getVatIDByRatio(0),
            default => Vat::getVatIDByRatio(21),
        };
    }

    private function handleProductEshopPriceCreate(array $priceData):void {
        if (!in_array($priceData['productPriceTypeCode'], PriceType::priceTypes())) {
            return;
        }

        $productEshop = new ProductEshop();
        $productEshop->Eshop_ID = 1;
        $productEshop->Product_ID = $this->productID;

        if($priceData['productPriceTypeCode'] === PriceType::PRICE_A) {
            $productEshop->Price = round($priceData['value'],3);
            $productEshop->QuantityMin = $priceData['quantityMin']??null;
            $productEshop->ProductPriceTypeCode = PriceType::PRICE_A;
        }
        if($priceData['productPriceTypeCode'] === PriceType::PRICE_B) {
            $productEshop->Price = round($priceData['value'],3);
            $productEshop->QuantityMin = $priceData['quantityMin']??null;
            $productEshop->ProductPriceTypeCode = PriceType::PRICE_B;

        }
        if($priceData['productPriceTypeCode'] === PriceType::PRICE_C) {
            $productEshop->Price = round($priceData['value'], 3);
            $productEshop->QuantityMin = $priceData['quantityMin'] ?? null;
            $productEshop->ProductPriceTypeCode = PriceType::PRICE_C;
        }

        if($priceData['productPriceTypeCode'] === PriceType::PRICE_D) {
            $productEshop->Price = round($priceData['value'],3);
            $productEshop->QuantityMin = $priceData['quantityMin']??null;
            $productEshop->ProductPriceTypeCode = PriceType::PRICE_D;

        }
        if($priceData['productPriceTypeCode'] === PriceType::PRICE_ACTION) {
            $productEshop->Price = round($priceData['value'],3);
            $productEshop->QuantityMin = $priceData['quantityMin']??null;
            $productEshop->ProductPriceTypeCode =  PriceType::PRICE_ACTION;
            $productEshop->ValidFrom = isset($priceData['validFrom']) && $priceData['validFrom']? DateTimeConverter::convertUtcToMySqlFormat($priceData['validFrom']):null;
            $productEshop->ValidTo = isset($priceData['validTo']) && $priceData['validTo']? DateTimeConverter::convertUtcToMySqlFormat($priceData['validTo']):null;
        }

        if($priceData['productPriceTypeCode'] === PriceType::PRICE_CUSTOMER) {
            $user = User::getUserByCode($priceData['customerCode']);
            if(!$user) {
                $this->apiLog->log(404, 'productPrices.user with code '.$priceData['customerCode'].' not found');
                return;
            }
            $productEshop->User_ID = $user->ID;
            $productEshop->Price = round($priceData['value'],3);
            $productEshop->QuantityMin = $priceData['quantityMin']??null;
            $productEshop->ProductPriceTypeCode =  PriceType::PRICE_CUSTOMER;
        }

        $productEshop->Vat_ID = $this->handleVatType($this->taxType);
        $productEshop->DateTimeCreated = date('Y-m-d H:i:s');
        $productEshop->DateTimeUpdated = date('Y-m-d H:i:s');

        $productEshop->Description = $priceData['description']??null;
        $productEshop->Currency_ID = $this->handleCurrencyID($priceData['currencyCode']);
        $productEshop->IsDiscountable = filter_var($priceData['isDiscountable'], FILTER_VALIDATE_BOOLEAN);

        $productEshop->Active = 1;
        $productEshop->save();

        //Jelikož nám action price posílá včetně DPH a my si ji potřebujeme uložit bez DPH . NEKONZISTENCE, jakmile se přejde na nový HADEX CRM tohle smazat!!!!
        if($priceData['productPriceTypeCode'] === PriceType::PRICE_ACTION) {
            $vatValue = (float)$productEshop->vat->Value;
            $productEshop->Price = round($productEshop->Price / ($vatValue / 100 + 1), 3);
            $productEshop->save();
        }

        $this->apiLog->log(200, 'Nastavena cena typu '.  $productEshop->ProductPriceTypeCode.' pro product ID '.$productEshop->Product_ID.' ve výši '.$productEshop->Price.' Kč');

        $this->productPrices[] = $productEshop;
    }

    private function handleProductMetaData(array $dataItem): void {
        $productMeta = new ProductMeta();
        $productMeta->Product_ID = $this->productID;
        $productMeta->Code = $dataItem['code'];
        $productMeta->Value = $dataItem['value'];
        $productMeta->save();
        $this->productMetas[] = $productMeta;
    }

    private function handleProductStock(array $dataItem): void {
        $stockID = Stock::getStockIDByCode($dataItem['warehouseCode'], true);
        $productStock = new ProductStock();
        $productStock->Product_ID = $this->productID;
        $productStock->Stock_ID = $stockID;
        $productStock->Code = $this->productCode;
        $productStock->Quantity = $dataItem['value'];
        $productStock->Note = $dataItem['note'];
        $productStock->save();
        $this->productStocks[] = $productStock;
    }

    private function handleProductLink(array $dataItem): void {
        //Neposílá product ID, ale code, takže to musíme zjistit
        if (!isset($dataItem['productId']) || !$dataItem['productId']) {
            $product = ProductModel::getProductByCode($dataItem['productCode']);
            if (!$product) {
                return;
            }
            $productID = $product->ID;
        } else {
            $productID = $dataItem['productId'];
        }

        $productRelated = new ProductRelated();
        $productRelated->Product_ID = $this->productID;
        $productRelated->ProductRelated_ID = $productID;
        $productRelated->LinkType = $dataItem['linkType'];
        $productRelated->save();
        $this->productLinks[] = $productRelated;

    }

    private function handleProductAttachments(array $dataItem): void {
        try {
            $productAttachment = new ProductAttachment($dataItem['id']??null, $this->productID);
            $this->productAttachments[] = $productAttachment->processAttachment($dataItem);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    private function handleProductCategory(string $categoryCode): void {
        $category = Category::getCategoryByCode($categoryCode);
        //Co dělat, když kategorie není založena? Zatím vracím.
        if(!$category) {
            return;
        }
        $productInCategory = new ProductInCategory();
        $productInCategory->Product_ID = $this->productID;
        $productInCategory->Category_ID = $category->ID;
        $productInCategory->save();
        $this->productCategories[] = $categoryCode;
    }

    private function handleProductAttributes(array $dataItem): void {
        $parameter = Parameter::getParameterByCode($dataItem['code']);

        if (!$parameter) {
            $parameter = new Parameter();
            $parameter->Code = $dataItem['code'];
            $parameter->parameterLangs[0]->Name = $dataItem['code'];
            $parameter->parameterLangs[0]->Language_ID = 1;
            $parameter->save();
        }

        $productParameter = new ProductParameter();
        $productParameter->Product_ID = $this->productID;
        $productParameter->Parameter_ID = $parameter->ID;
        $productParameter->Value = $dataItem['value'];

        if (!$parameterValueID = ParameterValue::getParameterValueByParameterIDAndValue($parameter->ID, $dataItem['value'])) {
            $parameterValue = new ParameterValue();
            $parameterValue->Parameter_ID = $parameter->ID;
            $parameterValue->Value = $dataItem['value'];
            $parameterValue->save();
            $parameterValueID = $parameterValue->ID;
        }

        $productParameter->ParameterValue_ID = $parameterValueID;
        $productParameter->save();
        $this->productAttributes[] = $productParameter;
    }

    private function processProductModel(bool|ProductModel $productModel, $basicProductData = null): ProductModel {
        $productModel->IsAvailable = filter_var($basicProductData['isAvailable'], FILTER_VALIDATE_BOOLEAN);

        if(isset($basicProductData['code']))
        $productModel->Code = $basicProductData['code'];

        if(isset($basicProductData['ean']))
        $productModel->EAN = $basicProductData['ean'];

        $productModel->UpdateDateTime = date('Y-m-d H:i:s');
        $productModel->save(skipEshop: true);

        $this->productID = $productModel->ID;

        if(isset($productModel->Code))
        $this->productCode = $productModel->Code;
        return $productModel;
    }

    /**
     * @param ProductLang $productLang
     * @param array $productLangData
     * @return void
     */
    public function processProductLang(bool|ProductLang $productLang, array $productLangData): ProductLang {
        $productLang->Product_ID = $this->productID;
        $productLang->Name = $productLangData['name'];
        $productLang->ShortDescription = $productLangData['shortDescription'];
        $productLang->Description = $productLangData['description'];
        $productLang->Language_ID = 1;
        $productLang->save();

        if(isset($productLangData['url']) && $productLangData['url']) {
            try {
                ProductSlugHistory::addSlugHistory($this->productID, $productLangData['url']);
            } catch (\Exception $e) {
                $this->apiLog->log(500, $e->getMessage());
            }
        }

        return $productLang;
    }

    public function archiveProduct(array $productData): array {
        if(!$productData['id'] && !$productData['code']) {
            return [
                'errorCode' => 400,
                'message' => 'Product ID or Product Code is required'
            ];
        }
        if($productData['id']) {
            $productModel = ProductModel::getProduct($productData['id']);
        } else {
            $productModel = ProductModel::getProductByCode($productData['code']);
        }

        if(!$productModel) {
            return [
                'errorCode' => 404,
                'message' => 'Product not found'
            ];
        }

        $productModel->Archived = true;
        $productModel->save();
        return [
            'status' => 'success',
            'message' => 'Product id '.$productModel->ID.' was archived'
        ];
    }


    private function getResponse(): array {
        //ToDO vrátit celý produkt se vším co má
        //pořešit taxType, partNumber, Note, url?

        $response = [
            "id" => $this->productID,
            "code" => $this->productCode,
//            "partNumber" => $this->productModel->PartNumber,
            "ean" => $this->productModel->EAN,
            "createdOnUtc" => DateTimeConverter::convertFromMySqlToUtc($this->productModel->CreatedDate, 'ISO-8601'),
            "updatedOnUtc" => DateTimeConverter::convertFromMySqlToUtc($this->productModel->UpdateDateTime, 'ISO-8601'),
            "isAvailable" => $this->productModel->IsAvailable,
            "taxType" => $this->taxType,
//            "stockItemCount" => $this->productModel->OnStock,
            "name" => $this->productLang->Name,
            "shortDescription" => $this->productLang->ShortDescription,
            "description" => $this->productLang->Description,
//            "note" => $this->productLang->Note,
//            "url" => $this->productLang->slug,
        ];

        if ($this->productAttachments) {
            $i = 0;
            foreach ($this->productAttachments as $attachment) {
                $response['attachments'][$i] = [
                    "id" => $attachment['id'],
                    "fileName" => $attachment['fileName'],
                    "urlPath" => $attachment['urlPath'],
                    "hash" => $attachment['hash'],
                    "alt" => $attachment['alt'],
                    "createdOnUtc" => $attachment['createdOnUtc'],
                    "updatedOnUtc" => $attachment['updatedOnUtc'],
                    "attachmentType" => $attachment['attachmentType'],
                    "productCode" => $attachment['productCode'],
                ];
                $i++;
            }
        }
        if ($this->productCategories) {
            foreach ($this->productCategories as $productCategory) {
                $response['categories'][] = $productCategory;
            }
        }

        if ($this->productMetas) {
            $i = 0;
            foreach ($this->productMetas as $productMeta) {
                $response['productMetas'][$i] = [
                    'code' => $productMeta->Code,
                    'value' => $productMeta->Value,
                ];
                $i++;
            }
        }

        if ($this->productPrices) {
            $i = 0;
            foreach ($this->productPrices as $productPrice) {
                $response['productPrices'][$i] = [
                    'id' => $productPrice->ID,
                    'value' => number_format(round($productPrice->Price,3),3),
                    'quantityMin' => $productPrice->QuantityMin,
                    'validFrom' => $productPrice->ValidFrom?DateTimeConverter::convertFromMySqlToUtc($productPrice->ValidFrom, 'ISO-8601'):null,
                    'validTo' => $productPrice->ValidTo?DateTimeConverter::convertFromMySqlToUtc($productPrice->ValidTo, 'ISO-8601'):null,
                    'createdOnUtc' => DateTimeConverter::convertFromMySqlToUtc($productPrice->DateTimeCreated, 'ISO-8601'),
                    'updatedOnUtc' => DateTimeConverter::convertFromMySqlToUtc($productPrice->DateTimeUpdated, 'ISO-8601'),
                    'description' => $productPrice->Description,
                    'productPriceTypeCode' =>$productPrice->ProductPriceTypeCode,
                    'customerCode' => $productPrice->User_ID?$productPrice->user->Code:null,
                    'currencyCode' => $productPrice->currency->Mark,
                    'isDiscountable' => $productPrice->IsDiscountable,
                ];

                //Jelikož nám action price posílá včetně DPH a my si ji potřebujeme uložit bez DPH ale vracet musíme s dph. NEKONZISTENCE, jakmile se přejde na nový HADEX CRM tohle smazat!!!!
                if ($productPrice->ProductPriceTypeCode === PriceType::PRICE_ACTION) {
                    $response['productPrices'][$i]['value'] = number_format(round($productPrice->Price * ($productPrice->vat->Value / 100 + 1),3),3);
                }
                $i++;
            }
        }

        if ($this->productStocks) {
            $i = 0;
            foreach ($this->productStocks as $productStock) {
                $response['productStocks'][$i] = [
                    'productCode' => $productStock->product->Code,
                    'value' => $productStock->Quantity,
                    'warehouseCode' => $productStock->stock->Code,
                    'id' => $productStock->ID,
                    'note' => $productStock->Note,
                ];
                $i++;
            }
        }

        if ($this->productLinks) {
            $i = 0;
            foreach ($this->productLinks as $productLink) {
                $response['productLinks'][$i] = [
                    'linkType' => $productLink->LinkType,
                    'productCode' => $productLink->product->Code,
                    'productId' => $productLink->Product_ID,
                ];
                $i++;
            }
        }

        if ($this->productAttributes) {
            $i = 0;
            foreach ($this->productAttributes as $productAttribute) {
                $response['productAttributes'][$i] = [
                    'code' => $productAttribute->parameter->Code,
                    'value' => $productAttribute->Value,
                ];
                $i++;
            }
        }

        return $response;
    }

    private function handleCurrencyID(string $currencyCode): int {
        return match ($currencyCode) {
            'CZK' => 1,
            default => 1,
        };
    }



}