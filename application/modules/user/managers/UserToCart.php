<?php
use User_Model_User as User;

class User_Manager_UserToCart extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('User_Model_User');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('invoiceAddress.CompanyName', 'CompanyName');
        $query->leftJoin('entity', 'invoiceAddress');
        $query->addWhere("entity.Type = '" . User::TYPE_CUSTOMER . "'");
    }

    /**
     * @param array $attributes
     * @param $listType
     * @param array $data
     * @param null $dataSize
     * @return array
     */
    protected function onDataListFinish(array &$attributes, $listType, array &$data, $dataSize = null): array {
        $output = array();
        $output['identifier'] = $this->getDataUniqueIdentifier();

        foreach ($data as &$item)
            $item['FullName'] = $item['CompanyName'] . ' - ' . $item['UserNumber'] . ' - ' . $item['Name'];

        $output['data'] = $data;
        $output['numResults'] = $dataSize;

        return $output;
    }
}