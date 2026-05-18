<?php
use Admin_Model_OrderStateType as OrderStateType;
use Clevis_Data_Manager as DataManager;

class Admin_Manager_OrderFinished extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Order');
        $this->setColumnFilter('OrderNumber', DataManager::FILTER_LIKE);
        $this->setColumnFilter('Date', DataManager::FILTER_DATE);
        $this->setColumnFilter('FullName', DataManager::FILTER_LIKE);
        $this->setColumnFilter('Email', DataManager::FILTER_LIKE, "concat(invoiceAddress.LastName, ' ' , invoiceAddress.FirstName)");
        $this->setColumnFilter('OrderStateType_ID', DataManager::FILTER_EQUAL);
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        $doSort = false;
        if ( !array_key_exists('sort', $attributes) ) {
            $attributes['sort'] = 1;
            $doSort = true;
        }

        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('invoiceAddress.Email', 'Email');
        $query->addSelect('invoiceAddress.Phone', 'Phone');
        $query->addSelect("concat(invoiceAddress.LastName, ' ' , invoiceAddress.FirstName)", 'FullName');
        $query->leftJoin('entity', 'invoiceAddress');
        $query->leftJoin('entity', 'product');
        $query->addWhere('entity.OrderStateType_ID = ' . OrderStateType::ID_STATE_FINISH);

        if ( $doSort )
            $query->orderBy('entity.ID DESC');
    }
}