<?php

class User_Manager_Group extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();
        
        $this->setModel('User_Model_Group');
    }
}
