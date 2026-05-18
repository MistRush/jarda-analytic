<?php
use Clevis_Data_Manager as DataManager;
use User_Model_User as User;

/**
 * Admin_Manager_Customer
 *
 */
class Admin_Manager_Customer extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setColumnFilter('Date', DataManager::FILTER_DATE, 'MAX(logs.Date)');
        $this->setColumnFilter('Name', DataManager::FILTER_LIKE);

        $this->setModel('User_Model_User');
        $this->addChildManagerByModel('User_Model_UserSettings', 'userSettings');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        // Select if data list full
        $query->addSelect('userSettings.Discount', 'Discount');
        $query->addSelect('entity.Hash', 'Password');
        $query->addSelect('entity.Hash', 'PasswordConfirmation');
        $query->addSelect('count(logs.ID)', 'CountLogin');
        $query->addSelect('MAX(logs.Date)', 'LastLogin');
        $query->leftJoin('entity', 'logs');
        $query->leftJoin('entity', 'userSettings');
        $query->andWhere("entity.Type = '" . User::TYPE_CUSTOMER . "'");
        $query->addGroupBy(array('entity.ID', 'entity.Name', 'entity.Hash', 'entity.Salt', 'entity.Type' ));
    }

    protected function onDataCreate(Array &$attributes, Doctrine_Connection $connection): Doctrine_Record {
        /** @var User $user */
        $user = parent::onDataCreate($attributes, $connection);
        $user->Salt = User::generateSalt();
        $user->Hash = User::buildHash($attributes['Password']);

        return $user;
    }

    protected function onDataUpdate(array &$attributes, Doctrine_Connection $connection){
        $user = parent::onDataUpdate($attributes, $connection);
        if ($user) {
            $password = array_key_exists('Password', $attributes) ? $attributes['Password'] : null;
            if ($password && $user->Hash != $password)
                $user->Hash = User::buildHash($password);
        }

        return $user;
    }
}