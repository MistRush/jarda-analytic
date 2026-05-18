<?php
use Clevis_Data_Manager as DataManager;

/**
 * Admin_Manager_Announcement
 *
 */
class Admin_Manager_Announcement extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Announcement');
        $this->setColumnFilter('Type', DataManager::FILTER_LIKE);
        $this->setColumnFilter('Content', DataManager::FILTER_LIKE);
        $this->setColumnFilter('Hash', DataManager::FILTER_EQUAL);
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        if (array_key_exists('Eshop_ID', $attributes) && $attributes['Eshop_ID'] == -1)
            unset($attributes['Eshop_ID']);

        parent::onDataList($query, $attributes, $listType, $connection);
    }

    protected function onDataUpdate(array &$attributes, Doctrine_Connection $connection) {
        if (array_key_exists('renew', $attributes) && $attributes['renew']) {
            $attributes['Hash'] = null;
        }
        unset($attributes['renew']);

        return parent::onDataUpdate($attributes, $connection);
    }

    protected function onDataGrid(array $attributes): array {
        $data = [];
        $data['eshops'] = [ 1 => 'Hadex CZ', 2 => 'Hadex SK'];

        return $data;
    }
}