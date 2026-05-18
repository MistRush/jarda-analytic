<?php

namespace common\logic\HadexApi\Resources;

use Admin_Model_ProductAttachment as ModelProductAttachment;
use Admin_Model_ProductImage as ModelProductImage;
use Admin_Model_ProductDocumment as ModelProductDocument;
use Admin_Model_ApiLog as ApiLog;
use Common_Model_File as ModelFile;
use common\logic\HadexApi\Converters\AttachmentConverter;
use common\logic\HadexApi\Converters\DateTimeConverter;
use common\logic\HadexApi\Includes\File;
use Exception;

class ProductAttachment {

    private ?int $productID;
    private ?int $attachmentID;
    private ?string $productCode;
    private ApiLog $apiLog;

    public function __construct($attachmentID = null, $productID = null, $productCode = null) {
        $this->attachmentID = $attachmentID;
        $this->productID = $productID;
        $this->productCode = $productCode;
        $this->apiLog = new ApiLog();
    }

    public function getAttachment(): array {
        if (!$this->attachmentID && !$this->productID && !$this->productCode) {
            return [
                'errorCode' => 400,
                'message' => 'Attachment ID or Product ID or Product Code is required'
            ];
        }

        if ($this->attachmentID) {
            $productAttachment = ModelProductAttachment::getAttachmentByAttachmentID($this->attachmentID);
            $productAttachments = $productAttachment?[$productAttachment]:null;
        } elseif ($this->productID) {
            $productAttachments = ModelProductAttachment::getAttachmentsByProductID($this->productID);
        } else {
            $productAttachments = ModelProductAttachment::getAttachmentsByProductCode($this->productCode);
        }

        if (!$productAttachments ) {
            return [
                'errorCode' => 404,
                'message' => 'No attachment found'
            ];
        }

        return $this->getAttachmentArrayResponse($productAttachments);
    }

    /**
     * @throws Exception
     */
    public function processAttachment(array $dataItem): array {
        if (!$this->attachmentID && !$this->productID && !$this->productCode) {
            return [
                'errorCode' => 400,
                'message' => 'Attachment ID or Product ID or Product Code is required'
            ];
        }
        if( $this->attachmentID ) {
            $existedProductAttachment = ModelProductAttachment::getAttachmentByAttachmentID($this->attachmentID);
            if(!$existedProductAttachment) {
                return [
                    'errorCode' => 404,
                    'message' => 'Attachment not found'
                ];
            }
            return $this->updateExistingAttachment($existedProductAttachment, $dataItem);
        }
        try {
            if (ModelProductAttachment::getAttachmentByHashAndProductID($dataItem['hash'], $this->productID)) {
                return [
                    'errorCode' => 400,
                    'message' => 'Attachment with this hash already exists for this product'
                ];
            }
            $modelProductAttachment = new ModelProductAttachment();
            $modelProductAttachment = $this->saveAttachment($dataItem, $modelProductAttachment);
        } catch (Exception $e) {
            return [
                'errorCode' => 500,
                'message' => $e->getMessage()
            ];
        }
        return $this->getAttachmentSingleResponse($modelProductAttachment);
    }

    /**
     * @throws \DateMalformedStringException
     */
    private function getAttachmentArrayResponse(array | \Doctrine_Collection $productAttachments): array {
        $attachments = [];
        foreach ($productAttachments as $productAttachment) {
            $attachments[] = $this->getAttachmentResultEntity($productAttachment);
        }
        return $attachments;

    }

    private static function getAttachmentByHash(string $hash, int $productID) {
        $productAttachment = ModelProductAttachment::getAttachmentByHash($hash, $productID);
        if (!$productAttachment) {
            return [
                'errorCode' => 404,
                'message' => 'Attachment not found'
            ];
        }
        return $productAttachment;

    }


    /**
     * @throws Exception
     */
    public function updateExistingAttachment(ModelProductAttachment $existedProductAttachment, array $dataItem): array {
        $modifiedAttachment = $this->saveAttachment($dataItem, $existedProductAttachment);

        return $this->getAttachmentSingleResponse($modifiedAttachment);
    }


    /**
     * @throws \DateMalformedStringException
     */
    private function getAttachmentSingleResponse(ModelProductAttachment $productAttachment): array {
        return $this->getAttachmentResultEntity($productAttachment);
    }

    /**
     * @param array $dataItem
     * @param ModelProductAttachment $modelProductAttachment
     * @return void
     * @throws Exception
     */
    private function saveAttachment(array $dataItem, ModelProductAttachment $modelProductAttachment): ModelProductAttachment|array {
        $originalFileID = $modelProductAttachment->File_ID;

        $modelProductAttachment->AttachmentType = $dataItem['attachmentType'];
        $modelProductAttachment->Alt = $dataItem['alt'];
        $modelProductAttachment->Hash = $dataItem['hash'];
        $modelProductAttachment->UrlPath = $dataItem['urlPath'];
        $modelProductAttachment->Product_ID = $this->productID;

        if (isset($dataItem['urlPath']) && $dataItem['urlPath']) {
            $modelProductAttachment->UrlPath = $dataItem['urlPath'];
            $modelProductAttachment->File_ID = File::uploadFileFromUrl($dataItem['urlPath'], $dataItem['attachmentType']);
        }
        if (isset($dataItem['attachmentDataAsBase64']) && $dataItem['attachmentDataAsBase64']) {
            $modelProductAttachment->File_ID = File::uploadFileFromBase64($dataItem['attachmentDataAsBase64'], $dataItem['attachmentType'], $this->productID, $dataItem['fileName']);
        }
        $modelProductAttachment->save();

        if(AttachmentConverter::convertFromApiToEshop($modelProductAttachment->AttachmentType) === ModelFile::TYPE_PRODUCT_PHOTO) {
            $this->processProductImage($modelProductAttachment, $originalFileID);
        }
        if(AttachmentConverter::convertFromApiToEshop($modelProductAttachment->AttachmentType) === ModelFile::TYPE_PRODUCT_DOCUMMENT) {
            $this->processProductDocument($modelProductAttachment, $originalFileID);
        }

        return $modelProductAttachment;
    }

    /**
     * @param mixed $productAttachment
     * @return array
     * @throws \DateMalformedStringException
     */
    private function getAttachmentResultEntity(mixed $productAttachment): array {
        return [
            'id' => $productAttachment->ID,
            'fileName' => $productAttachment->file->Name . '.' . $productAttachment->file->Extension,
            'urlPath' => $productAttachment->UrlPath,
            'hash' => $productAttachment->Hash,
            'alt' => $productAttachment->Alt,
            'createdOnUtc' => DateTimeConverter::convertFromMySqlToUtc($productAttachment->DateTimeCreated, 'ISO-8601'),
            'updatedOnUtc' => DateTimeConverter::convertFromMySqlToUtc($productAttachment->DateTimeUpdated, 'ISO-8601'),
            'attachmentType' => $productAttachment->AttachmentType,
            'productCode' => $productAttachment->product->Code,
            'productId' => $productAttachment->Product_ID,
        ];
    }

    private function processProductImage(ModelProductAttachment $modelProductAttachment, ?int $originalFileID): void {
        try {
            //smažeme původní obrázek (kvůli aktualizaci)
            if($originalFileID) {
                $originalProductImage = ModelProductImage::getProductImageByProductAndFileID($modelProductAttachment->Product_ID, $originalFileID);
                if($originalProductImage) {
                    $originalProductImage->delete();
                }
            }
            $productImage = new ModelProductImage();
            $productImage->Product_ID = $modelProductAttachment->Product_ID;
            $productImage->File_ID = $modelProductAttachment->File_ID;
            $productImage->Main = $modelProductAttachment->AttachmentType == AttachmentConverter::ATTACHMENT_TYPE_PRODUCT_1;
            $productImage->Description = $modelProductAttachment->Alt;
            $productImage->save();
        } catch (Exception $e) {
            $this->apiLog->log($e->getCode(), 'ProductAttachment.processProductImage '. $e->getMessage());
        }
    }

    private function processProductDocument(ModelProductAttachment $modelProductAttachment, ?int $originalFileID): void {
        try {
            //smažeme původní dokument (kvůli aktualizaci)
            if($originalFileID) {
                $originalProductDocument = ModelProductDocument::getProductDocumentByProductAndFileID($modelProductAttachment->Product_ID, $originalFileID);
                if($originalProductDocument) {
                    $originalProductDocument->delete();
                }
            }
            $productDocument = new ModelProductDocument();
            $productDocument->Product_ID = $modelProductAttachment->Product_ID;
            $productDocument->File_ID = $modelProductAttachment->File_ID;
            $productDocument->Description = $modelProductAttachment->Alt;
            $productDocument->save();
        } catch (Exception $e) {
            $this->apiLog->log($e->getCode(), 'ProductAttachment.processProductDocument '. $e->getMessage());
        }
    }


}