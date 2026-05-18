<?php

/**
 * Admin_Manager_Banner
 *
 */
class Admin_Manager_Banner extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Banner');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('file.ID IS NOT NULL', 'Photo');
        $query->addSelect('file.ID', 'File_ID');
        $query->addSelect('CONCAT(file.Name, ".", file.Extension)', 'FileName');
        $query->leftJoin('entity', 'file');
    }

    protected function onDataGrid(array $attributes): array {
        $data = [];
        $data['eshops'] = [ 1 => 'Hadex CZ', 2 => 'Hadex SK'];

        return $data;
    }
}