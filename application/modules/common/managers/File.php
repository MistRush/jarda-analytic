<?php

class Common_Manager_File extends Clevis_Data_ManagerDql {

    public function  __construct() {
        parent::__construct();

        $this->setModel('Common_Model_File');
        $this->removeModelColumn('Data');
    }
}