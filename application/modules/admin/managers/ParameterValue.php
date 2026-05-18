<?php

class Admin_Manager_ParameterValue extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_ParameterValue');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        $attributes['sort'] = 1;

        parent::onDataList($query, $attributes, $listType, $connection);

        if ( isset($attributes['q']) && $attributes['q'] )
            $query->andWhere("entity.Value LIKE '%" . $attributes['q'] . "%'");

        $query->orderBy('entity.Value ASC');
    }
}