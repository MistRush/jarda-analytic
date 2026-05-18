<?php

/**
 * Admin_Manager_ProductEshop
 *
 */
class Admin_Manager_ProductEshop extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_ProductEshop');
    }

    protected function onDataGrid(array $attributes): array {
        $data = [];
        $data['eshops'] = [ 1 => 'Hadex CZ', 2 => 'Hadex SK'];

        return $data;
    }
}