<?php

namespace common\logic\HadexApi\Resources;

use Admin_Model_Product;
use common\logic\HadexApi\Converters\DateTimeConverter;
use common\logic\HadexApi\Includes\File;
use Admin_Model_ProductStock as ModelProductStock;
use Admin_Model_Stock as Stock;

class ProductStock {

    private ?int $productStockID;
    private ?int $productID;
    private ?string $productCode;

    public function __construct($productStockID = null, $productID = null, $productCode = null) {
        $this->productStockID = $productStockID;
        $this->productID = $productID;
        $this->productCode = $productCode;

        if (!$this->productID && $this->productCode) {
            $product = Admin_Model_Product::getProductByCode($this->productCode);
            if ($product) {
                $this->productID = $product->ID;
            }
        }
    }

    public function getProductStock(): array {
        if (!$this->productStockID && !$this->productID && !$this->productCode) {
            return [
                'errorCode' => 400,
                'message' => 'Product stock ID or Product ID or Product Code is required'
            ];
        }

        if ($this->productStockID) {
            $productStock = [ModelProductStock::getProductStockByProductStockID($this->productStockID)];
        } elseif ($this->productID) {
            $productStock = ModelProductStock::getProductStocksByProductID($this->productID);
        } else {
            $productStock = ModelProductStock::getProductStocksByProductCode($this->productCode);
        }

        if (!$productStock) {
            return [
                'errorCode' => 404,
                'message' => 'No product stock found'
            ];
        }

        return $this->getProductStockArrayResponse($productStock);
    }

    /**
     * @throws \Exception
     */
    public function processProductStock(array $dataItem): array {
        if (!$this->productStockID && !$this->productID && !$this->productCode) {
            return [
                'status' => 'error',
                'errorCode' => 400,
                'message' => 'Product stock ID or Product ID or Product Code is required'
            ];
        }
        if ($this->productStockID) {
            $existedProductStock = ModelProductStock::getProductStockByProductStockID($this->productStockID);
            if (!$existedProductStock) {
                return [
                    'status' => 'error',
                    'errorCode' => 404,
                    'message' => 'Product stock not found'
                ];
            }
            $this->productID = $existedProductStock->Product_ID;
            return $this->updateExistingProductStock($existedProductStock, $dataItem);
        }

        if($this->productCode || $this->productID) {
            $productStock = ModelProductStock::getProductStockByProductIDAndWarehouseCode($this->productID, $this->productCode, $dataItem['warehouseCode']);
            if($productStock) {
                return $this->updateExistingProductStock($productStock, $dataItem);
            }
        }

        try {
            $modelProductStock = new ModelProductStock();
            $modelProductStock = $this->saveProductStock($dataItem, $modelProductStock);
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorCode' => 500,
                'message' => $e->getMessage()
            ];
        }
        return $this->getProductStockSingleResponse($modelProductStock);
    }

    /**
     * @throws \DateMalformedStringException
     */
    private function getProductStockArrayResponse(array|\Doctrine_Collection $productStocks): array {
        $result = [];
        foreach ($productStocks as $productStock) {
            $result[] = $this->getProductStockResultEntity($productStock);
        }
        return $result;

    }

    /**
     * @throws \Exception
     */
    public function updateExistingProductStock(ModelProductStock $existedProductStock, array $dataItem): array {
        $modifiedProductStock = $this->saveProductStock($dataItem, $existedProductStock);

        return $this->getProductStockSingleResponse($modifiedProductStock);
    }


    /**
     * @throws \DateMalformedStringException
     */
    private function getProductStockSingleResponse(ModelProductStock $productStock): array {
        return $this->getProductStockResultEntity($productStock);
    }

    /**
     * @param array $dataItem
     * @param ModelProductStock $modelProductStock
     * @return void
     * @throws \Exception
     */
    private function saveProductStock(array $dataItem, ModelProductStock $modelProductStock): ModelProductStock | array {
        $stock = Stock::getStockByStockCode($dataItem['warehouseCode'], true);
        if (!$stock) {
            return [
                'status' => 'error',
                'errorCode' => 404,
                'message' => 'Warehouse not found'
            ];
        }
        $modelProductStock->Product_ID = $this->productID;
        $modelProductStock->Quantity = $dataItem['value'];
        $modelProductStock->Stock_ID = $stock->ID;
        $modelProductStock->Note = $dataItem['note'] ?? null;
        $modelProductStock->save();
        return $modelProductStock;
    }

    /**
     * @param mixed $productAttachment
     * @return array
     * @throws \DateMalformedStringException
     */
    private function getProductStockResultEntity(mixed $productStock): array {
        return [
            'id' => $productStock->ID,
            'productID' => $productStock->Product_ID,
            'productCode' => $productStock->product->Code,
            'warehouseCode' => $productStock->stock->Code,
            'note' => $productStock->Note,
            'value' => $productStock->Quantity,
        ];
    }

}