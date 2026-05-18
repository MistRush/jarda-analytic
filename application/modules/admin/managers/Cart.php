<?php
use admin\logic\Product\ProductPrice;

/**
 * Admin_Manager_Cart
 *
 */
class Admin_Manager_Cart extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Cart');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('user.Name', 'UserName');
        $query->addSelect('productLangs.Name', 'ProductName');
        $query->leftJoin('entity', 'user');
        $query->leftJoin('entity', 'product');
        $query->leftJoin('product', 'productLangs', 'productLangs', 'productLangs.Language_ID = 1');
    }

    protected function onDataGrid(array $attributes): array {
        $data = [];
        $data['eshops'] = [ 1 => 'Hadex CZ', 2 => 'Hadex SK'];

        return $data;
    }
}