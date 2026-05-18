<?php

use common\logic\Languages;
use Admin_Model_Product as Product;
use Clevis_Data_Manager as DataManager;

/**
 * Admin_Manager_ProductSimple
 *
 */
class Admin_Manager_ProductSimple extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Product');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        $langID = Languages::getInstance()->getCurrentLanguageID();
        $query->innerJoin('entity', 'productLangs', null, 'productLangs.Language_ID = ' . $langID);

        $query->clearSelect();
        $query->addSelect('entity.ID, productLangs.Name Name, entity.Code');

        parent::onDataList($query, $attributes, $listType, $connection);
    }
}