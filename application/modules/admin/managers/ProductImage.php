<?php
use Common_Model_File as File;

class Admin_Manager_ProductImage extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_ProductImage');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('CONCAT(file.Name, ".", file.Extension)', 'FileName');
        $query->addSelect('file.Extension', 'Extension');
        $query->addSelect('file.Name', 'Name');
        $query->leftJoin('entity', 'file');
    }

    protected function onDataListFinish(Array &$attributes, $listType, Array &$data, $dataSize = null): array {
        $output = array();
        $output['identifier'] = $this->getDataUniqueIdentifier();

        foreach ($data as &$item) {
            $item['FullFileName'] = $item['FileName'] ? '/' . File::TYPE_PRODUCT_PHOTO_FOLDER . '200/' . $item['FileName'] : '';
        }

        $output['data'] = $data;
        $output['numResults'] = $dataSize;

        return $output;
    }
}