<?php
use User_Model_User as User;

class User_Manager_UserOnlyAdmin extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('User_Model_User');
        $this->setColumnFilter('Name', Clevis_Data_Manager::FILTER_LIKE);
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('entity.Name', 'FeedbackName');
        $query->addGroupBy(array('entity.ID', 'entity.Name', 'entity.Hash', 'entity.Salt', 'entity.Type' ));
        $query->addWhere('entity.Type IN ("' . User::TYPE_SUPERADMIN.'","'. User::TYPE_ADMIN.'")');

    }

}