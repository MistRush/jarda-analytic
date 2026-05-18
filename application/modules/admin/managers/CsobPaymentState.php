<?php

class Admin_Manager_CsobPaymentState extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_CsobPaymentState');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('orderStateTypeLangs.Name', 'OrderStateTypeName');
        $query->leftJoin('entity', 'orderStateType');
        $query->leftJoin('orderStateType', 'orderStateTypeLangs');
    }
}