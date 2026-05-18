<?php
use Common_Model_File as File;

/**
 * Admin_Manager_Category
 */
class Admin_Manager_NewsCategory extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_NewsCategory');
        $this->setLanguagesManipulation('Admin_Model_NewsCategoryLang', 'newsCategoryLangs', 'NewsCategory_ID', ['Name', 'ShortDescription', 'Description', 'slug']);
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('CONCAT(file.Name, ".", file.Extension)', 'FileName');
        $query->addSelect('newsCategoryLangs.Name', 'ParentNameCZ');
        $query->leftJoin('entity', 'file');
        $query->leftJoin('entity', 'newsCategory');
        $query->leftJoin('newsCategory', 'newsCategoryLangs');

        if (isset($attributes['NewsCategory_IDs']) && is_array($attributes['NewsCategory_IDs']) && count($attributes['NewsCategory_IDs']))
            $query->andWhere('entity.ID IN (' . implode(',', $attributes['NewsCategory_IDs']) . ')');
    }

    protected function onDataListFinish(Array &$attributes, $listType, Array &$data, $dataSize = null): array {
        $output = array();
        $output['identifier'] = $this->getDataUniqueIdentifier();

        foreach ($data as &$item) {
            $item['FullFileName'] = $item['FileName'] ? '/' . File::TYPE_CATEGORY_PICTOGRAM_FOLDER . $item['FileName'] : '';
        }

        $output['data'] = $data;
        $output['numResults'] = $dataSize;

        return $output;
    }
}