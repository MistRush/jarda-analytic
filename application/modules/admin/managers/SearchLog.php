<?php

class Admin_Manager_SearchLog extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();
        
        $this->setModel('Admin_Model_SearchLog');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('user.Name', 'UserName');
        $query->leftJoin('entity', 'user');
    }
}