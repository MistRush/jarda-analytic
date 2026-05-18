<?php

/**
 * Admin_Manager_ProductParameter
 *
 */
class Admin_Manager_ProductParameter extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_ProductParameter');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('parameterValue.Value', 'ParameterValue');
        $query->addSelect('parameterLangs.Name', 'ParameterName');
        $query->leftJoin('entity', 'parameterValue');
        $query->leftJoin('entity', 'parameter');
        $query->leftJoin('parameter', 'parameterLangs', 'parameterLangs', 'parameterLangs.Language_ID = 1');
    }
}