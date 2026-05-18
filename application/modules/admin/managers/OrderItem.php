<?php

use common\logic\Eshop\Eshop;

class Admin_Manager_OrderItem extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_OrderItem');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection)
    {
        $eshop = Eshop::getInstance();
        $langID = $eshop->getLangID();
        parent::onDataList($query, $attributes, $listType, $connection);
        $query->addSelect('product.ID', 'ProductID');
        $query->addSelect('CONCAT(product.Code, " - ", productLangs.Name)', 'ProductName');
        $query->leftJoin('entity', 'product');
        $query->leftJoin('product', 'productLangs', 'productLangs', 'productLangs.Language_ID = '.$langID);
    }

    /**
     * @param array $attributes
     * @param $listType
     * @param array $data
     * @param null $dataSize
     *
     * @return array
     */
    protected function onDataListFinish(Array &$attributes, $listType, Array &$data, $dataSize = null): array {
        $output = array();
        $output['identifier'] = $this->getDataUniqueIdentifier();

        foreach ($data as &$item) {
            $item['TotalPriceWithoutVat'] = $item['PriceWithoutVat'] * $item['Quantity'];
            $item['TotalPriceWithVat'] = $item['PriceWithVat'] * $item['Quantity'];
        }

        $output['data'] = $data;
        $output['numResults'] = $dataSize;

        return $output;
    }
}