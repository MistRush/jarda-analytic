<?php

class Admin_Manager_CartLog extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_CartLog');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('user.Name', 'UserName');
        $query->addSelect('productLangs.Name', 'ProductName');
        $query->leftJoin('entity', 'user');
        $query->leftJoin('entity', 'product');
        $query->leftJoin('product', 'productLangs', 'productLangs', 'productLangs.Language_ID = 1');
    }
}