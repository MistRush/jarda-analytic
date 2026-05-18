<?php
use user\logic\UserAdminSession;
use User_Model_User as User;

class User_Manager_User extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('User_Model_User');
        $this->setColumnFilter('Name', Clevis_Data_Manager::FILTER_LIKE);
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('count(logs.ID)', 'CountLogin');
        $query->addSelect('MAX(logs.Date)', 'LastLogin');
        $query->addSelect('IF(entity.Name IS NOT NULL, CONCAT("[", entity.Name, "] ", entity.Name), entity.Name)', 'FeedbackName');
        $query->leftJoin('entity', 'logs');

        $query->addGroupBy(array('entity.ID', 'entity.Name', 'entity.Hash', 'entity.Salt', 'entity.Type' ));

        if (!UserAdminSession::hasPermission('edit-users'))
            $query->addWhere("entity.ID = " . UserAdminSession::getCurrentUserID());

        $query->addSelect('entity.Hash', 'Password');
        $query->addSelect('entity.Hash', 'PasswordConfirmation');
    }

    protected function onDataCreateChildren(Array &$attributes, &$entity, Doctrine_Connection $connection) {
        $entity->save($connection);

        parent::onDataCreateChildren($attributes, $entity, $connection);
    }

    protected function onDataCreate(Array &$attributes, Doctrine_Connection $connection): User {
        /** @var User $user */
        $user = parent::onDataCreate($attributes, $connection);
        $user->Salt = User::generateSalt();
        $user->Hash = User::buildHash($attributes['Password']);

        return $user;
    }

    protected function onDataUpdate(Array &$attributes, Doctrine_Connection $connection): User {
        /** @var User $user */
        $user = parent::onDataUpdate($attributes, $connection);

        if ($user) {
            $password = array_key_exists('Password', $attributes) ? $attributes['Password'] : null;
            if ($user->Hash != $password && $password!== null)
                $user->Hash = User::buildHash($password);
        }

        return $user;
    }
}