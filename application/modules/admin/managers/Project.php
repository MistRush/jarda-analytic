<?php
use Common_Model_Language as Language;

class Admin_Manager_Project extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Project');
    }
}