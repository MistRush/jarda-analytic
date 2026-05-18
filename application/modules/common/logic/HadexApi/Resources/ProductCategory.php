<?php

namespace common\logic\HadexApi\Resources;
use Admin_Model_Category as ModelCategory;
use Admin_Model_ApiLog as ApiLog;
use Admin_Model_CategorySlugHistory as CategorySlugHistory;
use Admin_Model_CategoryMeta as ModelCategoryMeta;
use Admin_Model_CategoryLang as ModelCategoryLang;
use common\logic\HadexApi\Converters\DateTimeConverter;
use Common_Model_Language as ModelLanguage;

class ProductCategory {
    private ?int $categoryID;
    private ApiLog $apiLog;

    public function __construct($categoryID = null) {
        $this->categoryID = $categoryID;
        $this->apiLog = new ApiLog();
    }

    public function updateProductCategory(array $dataItem) {
        $fieldsCheck = $this->updateProductRequiredFieldsCheck($dataItem);
        if ($fieldsCheck['status'] === 'error') {
            return $fieldsCheck;
        }
        $category = ModelCategory::getCategoryObjByID($dataItem['id']);
        if (!$category) {
            return ['status' => 'error', 'errorCode'=>404, 'message' => 'Category not found'];
        }
        if(isset($dataItem['code'])) {
            $category->Code = $dataItem['code'];
        }
        if(isset($dataItem['isAvailable'])) {
            $category->IsAvailable = $dataItem['isAvailable'];
        }
        if(isset($dataItem['name'])) {
            $category->categoryLangs[0]->Name = $dataItem['name'];
        }
        if(isset($dataItem['shortDescription'])) {
            $category->categoryLangs[0]->ShortDescription = $dataItem['shortDescription'];
        }
        if(isset($dataItem['description'])) {
            $category->categoryLangs[0]->Description = $dataItem['description'];
        }
        if(isset($dataItem['metaTitle'])) {
            $category->categoryLangs[0]->Title = $dataItem['metaTitle'];
        }
        if(isset($dataItem['metaDescription'])) {
            $category->categoryLangs[0]->MetaDescription = $dataItem['metaDescription'];
        }
        if(isset($dataItem['headline'])) {
            $category->categoryLangs[0]->H1Name = $dataItem['headline'];
        }
        if(isset($dataItem['rank'])) {
            $category->categoryLangs[0]->Rank = $dataItem['rank'];
        }

        if ((!empty($dataItem['parentProductCategoryId'])) || !empty($dataItem['parentProductCategoryCode'])) {
            if (!empty($dataItem['parentProductCategoryId'])) {
                if ($category->ID == $dataItem['parentProductCategoryId']) {
                    return ['status' => 'error', 'errorCode' => 400, 'message' => 'Category cannot be parent of itself'];
                }
            }

            if (!empty($dataItem['parentProductCategoryCode'])) {
                $parentCategory = ModelCategory::getCategoryByCode($dataItem['parentProductCategoryCode']);
                if (!$parentCategory) {
                    return ['status' => 'error', 'errorCode' => 404, 'message' => 'Parent category not found'];
                }
                if ($category->ID == $parentCategory->ID) {
                    return ['status' => 'error', 'errorCode' => 400, 'message' => 'Category cannot be parent of itself'];
                }
            }

            $parentCategoryResult = $this->handleParentCategory($category, $dataItem);
            if ($parentCategoryResult['status'] === 'error') {
                return $parentCategoryResult;
            }
        }

        if(isset($dataItem['url']) && $dataItem['url']) {
            try {
                CategorySlugHistory::addSlugHistory($category->ID, $dataItem['url']);
            } catch (\Exception $e) {
                $this->apiLog->log(500, $e->getMessage());
            }
        }

        $category->save();

        if(isset($dataItem['productCategoryMetas'])) {
            ModelCategoryMeta::deleteCategoryMetasByCategoryID($category->ID);
            foreach ($dataItem['productCategoryMetas'] as $categoryMeta) {
                $this->handleCategoryMetaData($categoryMeta);
            }
        }

        return $this->getProductCategoriesArrayResponse([$category]);
        //TODO co ty attachmenty? Budeme je tady taky aktualizovat? Nebo se to bude řešit přes samostatný endpoint ty aktualizace?
    }

    /**
     * @throws \Exception
     */
    public function createProductCategory(array $dataItem) {
        $fieldsCheck = $this->createProductRequiredFieldsCheck($dataItem);

        if ($fieldsCheck['status'] === 'error') {
            return $fieldsCheck;
        }

        if(ModelCategory::getCategoryByCode($dataItem['code'])) {
            return ['status' => 'error', 'errorCode'=>409, 'message' => 'Category with this code already exists'];
        }

        if (!empty($dataItem['parentProductCategoryCode'])) {
            $parentCategory = ModelCategory::getCategoryByCode($dataItem['parentProductCategoryCode']);
            if (!$parentCategory) {
                return ['status' => 'error', 'errorCode' => 404, 'message' => 'Parent category not found'];
            }
        }

        if (!empty($dataItem['parentProductCategoryId'])) {
            $parentCategory = ModelCategory::getCategoryByID($dataItem['parentProductCategoryId']);
            if (!$parentCategory) {
                return ['status' => 'error', 'errorCode' => 404, 'message' => 'Parent category not found'];
            }
        }


        $category = new ModelCategory();
        $category->Code = $dataItem['code'];
        $category->IsAvailable = $dataItem['isAvailable'];
        $category->save();

        $this->categoryID = $category->ID;

        $categoryLang = new ModelCategoryLang();
        $categoryLang->Category_ID = $category->ID;
        $categoryLang->Name = $dataItem['name'];
        $categoryLang->H1Name = $dataItem['headline']??$dataItem['name'];
        $categoryLang->Description = $dataItem['description'];
        $categoryLang->Language_ID = ModelLanguage::ID_LANGUAGE_CZ;
        $categoryLang->Title = $dataItem['metaTitle']??$dataItem['name'];
        $categoryLang->Rank = $dataItem['rank']??ModelCategoryLang::getLastRank() + 1;
        $categoryLang->ShortDescription = $dataItem['shortDescription']??null;
        $categoryLang->MetaDescription = $dataItem['metaDescription']??mb_substr($dataItem['description'], 0, 160);
        $categoryLang->save();

        if(isset($dataItem['url']) && $dataItem['url']) {
            try {
                CategorySlugHistory::addSlugHistory($category->ID, $dataItem['url']);
            } catch (\Exception $e) {
                $this->apiLog->log(500, $e->getMessage());
            }
        }

        if(isset($dataItem['attachments']) && is_array($dataItem['attachments']) && $dataItem['attachments']) {
            foreach ($dataItem['attachments'] as $attachment) {
                $categoryAttachment = new CategoryAttachment(null, $category->ID, $category->Code);
                $categoryAttachment->processAttachment($attachment);
            }
        }

        if(isset($dataItem['productCategoryMetas']) && is_array($dataItem['productCategoryMetas']) && $dataItem['productCategoryMetas']) {
            foreach ($dataItem['productCategoryMetas'] as $categoryMeta) {
                 $this->handleCategoryMetaData($categoryMeta);
            }
        }

        if ((!empty($dataItem['parentProductCategoryId'])) || !empty($dataItem['parentProductCategoryCode'])) {
            if (!empty($dataItem['parentProductCategoryId'])) {
                if ($category->ID == $dataItem['parentProductCategoryId']) {
                    return ['status' => 'error', 'errorCode' => 400, 'message' => 'Category cannot be parent of itself'];
                }
            }

            if (!empty($dataItem['parentProductCategoryCode'])) {
                $parentCategory = ModelCategory::getCategoryByCode($dataItem['parentProductCategoryCode']);
                if ($category->ID == $parentCategory->ID) {
                    return ['status' => 'error', 'errorCode' => 400, 'message' => 'Category cannot be parent of itself'];
                }
            }

            $parentCategoryResult = $this->handleParentCategory($category, $dataItem);
            if($parentCategoryResult['status'] === 'error') {
                return $parentCategoryResult;
            }
        }


        return $this->getProductCategoriesArrayResponse([$category]);

    }

    public function getProductCategories($filter = null, $changedSince = null): array {
        $productCategories = ModelCategory::getCategories($this->categoryID, $filter, $changedSince);
        $result = [];
        foreach ($productCategories as $productCategory) {
            $result[] = $this->getProductCategoryResultEntity($productCategory);
        }
        return $result;
        }

    public function archiveCategory(): array {
        $category = ModelCategory::getCategoryObjByID($this->categoryID);
        if (!$category) {
            return ['status' => 'error', 'errorCode'=>404, 'message' => 'Category not found'];
        }
        $category->Archived = true;
        $category->save();
        return ['status' => 'success', 'message' => 'Category '.$this->categoryID.' archived'];
    }


    private function getProductCategoryResultEntity(ModelCategory $modelCategory): array {

        $categoryAttachment = new CategoryAttachment(null, $modelCategory->ID, $modelCategory->Code);
        $attachments = $categoryAttachment->getAttachment(false);
        $categoryMetas = ModelCategoryMeta::getCategoryMetasByCategoryID($modelCategory->ID);
        if($modelCategory->Category_ID)
        $parentCategory = ModelCategory::getCategoryObjByID($modelCategory->Category_ID);
        else
            $parentCategory = null;

        return [
            'id' => $modelCategory->ID,
            'code' => $modelCategory->Code,
            'parentProductCategoryId' => $parentCategory ? $parentCategory['ID'] : null,
            'parentProductCategoryCode' => $parentCategory ? $parentCategory['Code'] : null,
            'name' => $modelCategory->categoryLangs[0]->Name,
            'description' => $modelCategory->categoryLangs[0]->Description,
            'url' => $modelCategory->categoryLangs[0]->slug,
            'createdOnUtc' => DateTimeConverter::convertFromMySqlToUtc($modelCategory->DateTimeCreated, 'ISO-8601'),
            'updatedOnUtc' => DateTimeConverter::convertFromMySqlToUtc($modelCategory->DateTimeUpdated, 'ISO-8601'),
            'isAvailable' => $modelCategory->IsAvailable,
            'attachments' => $attachments,
            'productCategoryMetas' => $categoryMetas,
            'rank' => $modelCategory->categoryLangs[0]->Rank,
        ];

}

    private function getProductCategoriesArrayResponse(array $productCategories): array {
        $result = [];
        foreach ($productCategories as $productCategory) {
            $result[] = $this->getProductCategoryResultEntity($productCategory);
        }
        return array_merge(...$result);
    }

    private function updateProductRequiredFieldsCheck($data): array|bool {
        $requiredFields = [
            'id' => 'Missing id',
        ];

        $check = $this->checkRequiredFields($data, $requiredFields);
        if ($check !== true) {
            return $check;
        }

        return ['status' => 'success'];
    }

    private function createProductRequiredFieldsCheck($data): array|bool {
        $requiredFields = [
            'code' => 'Missing code',
            'isAvailable' => 'Missing isAvailable',
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
            if (!isset($data[$field]) || !$data[$field]) {
                return ['status' => 'error', 'errorCode'=> 400, 'message' => $message];
            }
        }
        return true;
    }

    private function handleCategoryMetaData(array $dataItem): void {
        if($categoryMeta = ModelCategoryMeta::getCategoryMetaByCode($this->categoryID, $dataItem['code'])) {
            if($categoryMeta->Value === $dataItem['value']) {
                return;
            }
        }
        $categoryMeta = new ModelCategoryMeta();
        $categoryMeta->Category_ID = $this->categoryID;
        $categoryMeta->Code = $dataItem['code'];
        $categoryMeta->Value = $dataItem['value'];
        $categoryMeta->save();
    }



    private function handleParentCategory(ModelCategory $category, array $dataItem): array {
        $parentCategoryID = $dataItem['parentProductCategoryId']??null;
        $parentCategoryCode = $dataItem['parentProductCategoryCode']??null;
        $parentCategory = ModelCategory::getCategoryByIdOrCode($parentCategoryID, $parentCategoryCode);

        if(!$parentCategory) {
            return ['status' => 'error', 'errorCode'=>404, 'message' => 'Parent category not found'];
        }

        $category->Category_ID = $parentCategory->ID;
        $category->save();

        $parentCategory->DateTimeUpdated = date('Y-m-d H:i:s');
        $parentCategory->save();

        return ['status' => 'success'];
    }

}