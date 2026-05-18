<?php
use Admin_Model_Coupon as Coupon;
/**
 * Admin_Manager_Coupon
 *
 */
class Admin_Manager_Coupon extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Coupon');
        $this->setLanguagesManipulation('Admin_Model_CouponLang', 'couponLangs', 'Coupon_ID', ['Name']);
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('IF(entity.ExpiryDate > NOW() AND (entity.TotalCount < 1 OR IFNULL(entity.UsedCount, 0) < entity.TotalCount),1,0)', 'IsActive');
        $query->addSelect('user.Name', 'UserName');
        $query->addSelect('productLangs.Name', 'ProductName');
        $query->leftJoin('entity', 'user');
        $query->leftJoin('entity', 'product');
        $query->leftJoin('product', 'productLangs', 'productLangs', 'productLangs.Language_ID = 1');
    }

    protected function onDataGrid(array $attributes): array {
        $data = [];
        $data['types'] = Coupon::getCouponTypes();

        return $data;
    }

    protected function onDataEditor(array $attributes): array {
        $data = [];
        $data['types'] = Coupon::getCouponTypes();

        return $data;
    }
}