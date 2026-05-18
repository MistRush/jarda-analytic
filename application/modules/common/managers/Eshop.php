<?php
use user\logic\UserAdminSession;

class Common_Manager_Eshop extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Common_Model_Eshop');
        $this->addChildManagerByModel('Common_Model_Settings', 'settings');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        // Select if data list full
        $query->addSelect('settings.ProjectName', 'ProjectName');
        $query->addSelect('settings.ProjectURL', 'ProjectURL');
        $query->addSelect('settings.ContactEmail', 'ContactEmail');
        $query->addSelect('settings.ContactPhone', 'ContactPhone');
        $query->addSelect('settings.AddressStreet', 'AddressStreet');
        $query->addSelect('settings.AddressZipCode', 'AddressZipCode');
        $query->addSelect('settings.AddressStreet', 'AddressStreet');
        $query->addSelect('settings.AddressCity', 'AddressCity');
        $query->addSelect('settings.RegistrationNumber', 'RegistrationNumber');
        $query->addSelect('settings.VATNumber', 'VATNumber');
        $query->leftJoin('entity', 'settings');

        $query->addSelect('CONCAT(file.Name, ".", file.Extension)', 'FileName');
        $query->leftJoin('entity', 'file');

        if (isset($attributes['acl']) && $attributes['acl'] && UserAdminSession::getCurrentUserType() != 'superadmin')
            $query->innerJoin('entity', 'userEshops', 'userEshops', 'userEshops.User_ID = ' . UserAdminSession::getCurrentUserID());
    }

    /**
     * @param array $attributes
     * @param $listType
     * @param array $data
     * @param null $dataSize
     *
     * @return array
     */
/*    protected function onDataListFinish(Array &$attributes, $listType, Array &$data, $dataSize = null): array {
        $output = array();
        $output['identifier'] = $this->getDataUniqueIdentifier();

        foreach ($data as &$item)
            $item['Address'] = $item['AddressStreet'] . ', ' . $item['AddressZipCode'] . ' ' . $item['AddressCity'];

        $output['data'] = $data;
        $output['numResults'] = $dataSize;

        return $output;
    }*/
}