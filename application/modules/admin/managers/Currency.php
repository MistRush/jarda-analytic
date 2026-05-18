<?php

class Admin_Manager_Currency extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();
        
        $this->setModel('Admin_Model_Currency');
    }
}