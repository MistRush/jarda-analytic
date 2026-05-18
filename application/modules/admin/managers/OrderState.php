<?php

use common\logic\Eshop\Eshop;

class Admin_Manager_OrderState extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_OrderState');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        $eshop = Eshop::getInstance();
        $langID = $eshop->getLangID();
        parent::onDataList($query, $attributes, $listType, $connection);
        $query->addSelect('orderStateTypeLangs.Name', 'OrderStateTypeName');
        $query->leftJoin('entity', 'orderStateType');
        $query->leftJoin('orderStateType', 'orderStateTypeLangs', 'orderStateTypeLangs', 'orderStateTypeLangs.Language_ID = '.$langID);
    }
}