<?php

class Admin_Manager_Question extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Question');
        $this->addChildManagerByModel('Admin_Model_QuestionAnswer', 'answers');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        $doSort = false;
        if ( !array_key_exists('sort', $attributes) ) {
            $attributes['sort'] = 1;
            $doSort = true;
        }

        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('productLangs.Name', 'ProductName');
        $query->leftJoin('entity', 'product');
        $query->leftJoin('product', 'productLangs', 'productLangs', 'productLangs.Language_ID = 1');

        if ( $doSort )
            $query->orderBy('entity.ID DESC');
    }

    protected function onDataGrid(array $attributes): array {
        $data = [];
        $data['eshops'] = [ 1 => 'Hadex CZ', 2 => 'Hadex SK'];

        return $data;
    }
}