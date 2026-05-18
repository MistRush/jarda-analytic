<?php

/**
 * Admin_Manager_ProductImage
 *
 */
class Admin_Manager_Manufacturer extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Manufacturer');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('CONCAT(manufacturerFile.Name, ".", manufacturerFile.Extension)', 'FileName');
        $query->leftJoin('entity', 'manufacturerFile');
    }
}