<?php

class Admin_Manager_ProductOnHomepage extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_ProductOnHomepage');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->clearSelect();
        $query->addSelect('entity.ID', 'ID');
        $query->addSelect('entity.Rank', 'Rank');
        $query->addSelect('entity.Product_ID', 'Product_ID');
        $query->addSelect('product.Code', 'Code');
        $query->addSelect('productLangs.Name', 'Name');
        $query->leftJoin('entity', 'product');
        $query->leftJoin('product', 'productLangs');
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
            $item['FullName'] = $item['Code'] . ' - ' . $item['Name'];
        }

        $output['data'] = $data;
        $output['numResults'] = $dataSize;

        return $output;
    }
}