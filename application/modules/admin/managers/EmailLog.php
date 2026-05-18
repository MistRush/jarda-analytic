<?php

class Admin_Manager_EmailLog extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();
        
        $this->setModel('Admin_Model_EmailLog');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        $attributes['sort'] = 1;

        parent::onDataList($query, $attributes, $listType, $connection);

        $query->orderBy('entity.ID DESC');
    }
}