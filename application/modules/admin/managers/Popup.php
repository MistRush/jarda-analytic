<?php
use Clevis_Data_Manager as DataManager;

/**
 * Admin_Manager_Announcement
 *
 */
class Admin_Manager_Popup extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Popup');
    }

    protected function onDataGrid(array $attributes): array {
        $data = [];

        $data['eshops'] = [ 1 => 'Hadex CZ', 2 => 'Hadex SK'];

        return $data;
    }
}