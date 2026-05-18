<?php

class Common_Manager_Language extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();
        
        $this->setModel('Common_Model_Language');
    }
}