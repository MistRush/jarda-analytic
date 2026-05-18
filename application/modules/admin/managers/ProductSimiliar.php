<?php

class Admin_Manager_ProductSimiliar extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_ProductSimiliar');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('productLangs.Name', 'ProductSimiliarName');
        $query->leftJoin('entity', 'productSimiliar');
        $query->leftJoin('productSimiliar', 'productLangs', 'productLangs', 'Language_ID = 1');
    }
}