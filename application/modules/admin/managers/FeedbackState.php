<?php

/**
 * Admin_Manager_FeedbackState
 *
 */
class Admin_Manager_FeedbackState extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_FeedbackState');
    }
}