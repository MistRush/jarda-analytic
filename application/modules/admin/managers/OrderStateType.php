<?php

class Admin_Manager_OrderStateType extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_OrderStateType');
        $this->setLanguagesManipulation('Admin_Model_OrderStateTypeLang', 'orderStateTypeLangs', 'OrderStateType_ID', ['Name', 'EmailHeader', 'EmailContent']);
    }
}