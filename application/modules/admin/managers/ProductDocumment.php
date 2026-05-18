<?php

class Admin_Manager_ProductDocumment extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_ProductDocumment');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('CONCAT(file.Name, ".", file.Extension)', 'FileName');
        $query->addSelect('file.Extension', 'Extension');
        $query->leftJoin('entity', 'file');
    }
}