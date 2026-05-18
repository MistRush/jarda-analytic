<?php
use Common_Model_File as File;
use common\logic\Eshop\Eshop;

/**
 * Admin_Manager_Category
 */
class Admin_Manager_Category extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Category');
        $this->setLanguagesManipulation('Admin_Model_CategoryLang', 'categoryLangs', 'Category_ID', ['Name', 'ShortDescription', 'Description', 'H1Name', 'Title', 'MetaDescription', 'slug']);
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        if (isset($attributes['Category_IDs']) && is_array($attributes['Category_IDs']) && count($attributes['Category_IDs']))
            $query->andWhere('entity.ID IN (' . implode(',', $attributes['Category_IDs']) . ')');

        if (isset($attributes['categoryMenuOnly']) && $attributes['categoryMenuOnly']) {
            $categoryMenuIDs = [2,3,4,5,6];
            $query->andWhere('entity.ID IN (' . implode(',', $categoryMenuIDs) . ')');
        }

        $query->addSelect('categoryLangs.Name', 'CategoryNameCZ');
        $query->addSelect('CONCAT(file.Name, ".", file.Extension)', 'FileName');
        $query->leftJoin('entity', 'file');
        $query->leftJoin('entity', 'category');
        $query->leftJoin('category', 'categoryLangs');
    }

    protected function onDataListFinish(Array &$attributes, $listType, Array &$data, $dataSize = null): array {
        $output = array();
        $output['identifier'] = $this->getDataUniqueIdentifier();

        foreach ($data as &$item) {
            $item['FullFileName'] = $item['FileName'] ? '/' . File::TYPE_CATEGORY_PHOTO_FOLDER . '200/' . $item['FileName'] : '';
        }

        $output['data'] = $data;
        $output['numResults'] = $dataSize;

        return $output;
    }
}