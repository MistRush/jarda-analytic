<?php

namespace common\logic\HadexApi\Resources;

use Admin_Model_CategoryAttachment as ModelCategoryAttachment;
use Admin_Model_Category as ModelCategory;
use Admin_Model_ApiLog as ApiLog;
use Common_Model_File as ModelFile;
use common\logic\HadexApi\Converters\AttachmentConverter;
use common\logic\HadexApi\Converters\DateTimeConverter;
use common\logic\HadexApi\Includes\File;
use Exception;

class CategoryAttachment {

    private ?int $categoryID;
    private ?int $attachmentID;
    private ?string $categoryCode;
    private ApiLog $apiLog;

    public function __construct($attachmentID = null, $categoryID = null, $categoryCode = null) {
        $this->attachmentID = $attachmentID;
        $this->categoryID = $categoryID;
        $this->categoryCode = $categoryCode;
        $this->apiLog = new ApiLog();
    }

    public function getAttachment(bool $errorResponse = true): array {
        if (!$this->attachmentID && !$this->categoryID && !$this->categoryCode) {
            if ($errorResponse) {
                return [
                    'errorCode' => 400,
                    'message' => 'Attachment ID or Category ID or Category Code is required'
                ];
            } else {
                return [];
            }
        }

        if ($this->attachmentID) {
            $categoryAttachments = [ModelCategoryAttachment::getAttachmentByAttachmentID($this->attachmentID)];
        } elseif ($this->categoryID) {
            $categoryAttachments = ModelCategoryAttachment::getAttachmentsByCategoryID($this->categoryID);
        } else {
            $categoryAttachments = ModelCategoryAttachment::getAttachmentsByCategoryCode($this->categoryCode);
        }

        if (!$categoryAttachments) {
            if ($errorResponse) {
                return [
                    'errorCode' => 404,
                    'message' => 'No attachment found'
                ];
            } else {
                return [];
            }
        }

        return $this->getAttachmentArrayResponse($categoryAttachments);
    }

    /**
     * @throws \Exception
     */
    public function processAttachment(array $dataItem): array {
        if ($this->attachmentID) {
            $existedCategoryAttachment = ModelCategoryAttachment::getAttachmentByAttachmentID($this->attachmentID);
            if (!$existedCategoryAttachment) {
                return [
                    'errorCode' => 404,
                    'message' => 'Attachment not found'
                ];
            }
            return $this->updateExistingAttachment($existedCategoryAttachment, $dataItem);
        }
        try {
            $modelCategoryAttachment = new ModelCategoryAttachment();
            $modelCategoryAttachment = $this->saveAttachment($dataItem, $modelCategoryAttachment);
        } catch (\Exception $e) {
            return [
                'errorCode' => 500,
                'message' => $e->getMessage()
            ];
        }
        return $this->getAttachmentSingleResponse($modelCategoryAttachment);
    }

    /**
     * @throws \DateMalformedStringException
     */
    private function getAttachmentArrayResponse(array | \Doctrine_Collection  $categoryAttachments): array {
        $attachments = [];
        foreach ($categoryAttachments as $productAttachment) {
            $attachments[] = $this->getAttachmentResultEntity($productAttachment);
        }
        return $attachments;

    }

    /**
     * @throws \Exception
     */
    public function updateExistingAttachment(ModelCategoryAttachment $existedCategoryAttachment, array $dataItem): array {
        $modifiedAttachment = $this->saveAttachment($dataItem, $existedCategoryAttachment);

        return $this->getAttachmentSingleResponse($modifiedAttachment);
    }


    /**
     * @throws \DateMalformedStringException
     */
    private function getAttachmentSingleResponse(ModelCategoryAttachment $categoryAttachment): array {
        return $this->getAttachmentResultEntity($categoryAttachment);
    }

    /**
     * @param array $dataItem
     * @param ModelCategoryAttachment $modelCategoryAttachment
     * @return void
     * @throws \Exception
     */
    private function saveAttachment(array $dataItem, ModelCategoryAttachment $modelCategoryAttachment): ModelCategoryAttachment {
        $modelCategoryAttachment->AttachmentType = 'CATEGORY';
        $modelCategoryAttachment->Alt = $dataItem['alt']??null;;
        $modelCategoryAttachment->Hash = $dataItem['hash'];
        $modelCategoryAttachment->UrlPath = $dataItem['urlPath']??null;;
        $modelCategoryAttachment->Category_ID = $this->categoryID;

        if (isset($dataItem['urlPath']) && $dataItem['urlPath']) {
            $modelCategoryAttachment->UrlPath = $dataItem['urlPath'];
            $modelCategoryAttachment->File_ID = File::uploadFileFromUrl($dataItem['urlPath'], $dataItem['attachmentType']);
        }
        if (isset($dataItem['attachmentDataAsBase64']) && $dataItem['attachmentDataAsBase64']) {
            $modelCategoryAttachment->File_ID = File::uploadFileFromBase64($dataItem['attachmentDataAsBase64'], $dataItem['attachmentType'], $this->categoryID, $dataItem['fileName']);
        }
        $modelCategoryAttachment->save();
        if(AttachmentConverter::convertFromApiToEshop($modelCategoryAttachment->AttachmentType) === ModelFile::TYPE_CATEGORY_PHOTO) {
            $this->processCategoryImage($modelCategoryAttachment);
        }
        return $modelCategoryAttachment;
    }

    /**
     * @param mixed $categoryAttachment
     * @return array
     * @throws \DateMalformedStringException
     */
    private function getAttachmentResultEntity(ModelCategoryAttachment $categoryAttachment): array {
        return [
            'id' => $categoryAttachment->ID,
            'fileName' => $categoryAttachment->file->Name . '.' . $categoryAttachment->file->Extension,
            'urlPath' => $categoryAttachment->UrlPath,
            'hash' => $categoryAttachment->Hash,
            'alt' => $categoryAttachment->Alt,
            'createdOnUtc' => DateTimeConverter::convertFromMySqlToUtc($categoryAttachment->DateTimeCreated, 'ISO-8601'),
            'updatedOnUtc' => DateTimeConverter::convertFromMySqlToUtc($categoryAttachment->DateTimeUpdated, 'ISO-8601'),
            'attachmentType' => $categoryAttachment->AttachmentType,
            'categoryCode' => $categoryAttachment->category->Code,
            'categoryId' => $categoryAttachment->Category_ID,
        ];
    }

    private function processCategoryImage(ModelCategoryAttachment $modelCategoryAttachment,): void {
        try {
            $category = ModelCategory::getCategoryByIdOrCode($modelCategoryAttachment->Category_ID);
            $category->File_ID = $modelCategoryAttachment->File_ID;
            $category->save();
        } catch (Exception $e) {
            $this->apiLog->log($e->getCode(), 'CategoryAttachment.processCategoryImage '. $e->getMessage());
        }
    }


}