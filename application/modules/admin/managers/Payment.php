<?php
use Common_Model_File as File;

/**
 * Admin_Manager_Payment
 *
 */
class Admin_Manager_Payment extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Payment');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('CONCAT(file.Name, ".", file.Extension)', 'FileName');
        $query->leftJoin('entity', 'file');
    }

    protected function onDataListFinish(Array &$attributes, $listType, Array &$data, $dataSize = null): array {
        $output = array();
        $output['identifier'] = $this->getDataUniqueIdentifier();

        foreach ($data as &$item) {
            $item['FullFileName'] = $item['FileName'] ? '/' . File::TYPE_LOGO_FOLDER .  $item['FileName'] : '';
        }

        $output['data'] = $data;
        $output['numResults'] = $dataSize;

        return $output;
    }

    protected function onDataGrid(array $attributes): array {
        $data = [];
        $data['eshops'] = [ 1 => 'Hadex CZ', 2 => 'Hadex SK'];

        return $data;
    }
}