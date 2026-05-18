<?php
use Common_Model_File as File;

class Admin_Manager_News extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_News');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        if (isset($attributes['NewsCategory_IDs']) && is_array($attributes['NewsCategory_IDs']) && count($attributes['NewsCategory_IDs']))
            $query->andWhere('entity.ID IN (' . implode(',', $attributes['NewsCategory_IDs']) . ')');
        $query->addSelect('newsCategoryLangs.Name', 'NewsCategoryName');
        $query->addSelect('CONCAT(file.Name, ".", file.Extension)', 'FileName');
        $query->leftJoin('entity', 'newsCategory');
        $query->leftJoin('newsCategory', 'newsCategoryLangs');
        $query->leftJoin('entity', 'file');
    }

    protected function onDataListFinish(Array &$attributes, $listType, Array &$data, $dataSize = null): array {
        $output = array();
        $output['identifier'] = $this->getDataUniqueIdentifier();

        foreach ($data as &$item) {
            $item['FullFileName'] = '/' . File::TYPE_NEWS_FOLDER . '/50/' . $item['FileName'];
        }

        $output['data'] = $data;
        $output['numResults'] = $dataSize;

        return $output;
    }
}