<?php
use Admin_Model_Parameter as Parameter;

class Admin_Manager_Parameter extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Parameter');
        $this->setLanguagesManipulation('Admin_Model_ParameterLang', 'parameterLangs', 'Parameter_ID', ['Name']);
    }

    protected function onDataEditor(array $attributes): array {
        $data = [];
        $data['filterTypes'] = Parameter::getFilterTypes();

        return $data;
    }

    protected function onDataGrid(array $attributes): array {
        $data = [];
        $data['filterTypes'] = Parameter::getFilterTypes();

        return $data;
    }
}