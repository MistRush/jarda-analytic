<?php

class User_Manager_UserGroup extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('User_Model_Group');
        $this->setColumnFilter('Name', Clevis_Data_Manager::FILTER_LIKE);
    }

}