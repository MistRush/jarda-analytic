<?php

class User_Manager_LoginLog extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();
        
        $this->setModel('User_Model_LoginLog');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('user.Name', 'UserName');
        $query->leftJoin('entity', 'user');
    }

}
