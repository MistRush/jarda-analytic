<?php

/**
 * Permission
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Permission {

    const PERMISSION_DENIED = 0;
    const PERMISSION_READ = 1;
    const PERMISSION_WRITE = 2;
    const PERMISSION_GRANTED = 3;

     /**
     * Get user permisson result
     *
     * @param $permission
     * @return integer
     */
    protected function getPermission($permission) {
        return self::PERMISSION_DENIED;
    }

    /**
     * Has user permission granted
     *
     * @param $permission
     * @return bool
     */
    public function hasPermission($permission) {
        return ($this->getPermission($permission) & self::PERMISSION_GRANTED) == self::PERMISSION_GRANTED;
    }

    /**
     * Has user permission for read granted
     *
     * @param $permission
     * @return bool
     */
    public function hasPermissionRead($permission) {
        $result = ($this->getPermission($permission) & self::PERMISSION_READ) == self::PERMISSION_READ;
        return $result;
    }

    /**
     * Has user permission for write granted
     *
     * @param $permission
     * @return bool
     */
    public function hasPermissionWrite($permission) {
        return ($this->getPermission($permission) & self::PERMISSION_WRITE) == self::PERMISSION_WRITE;
    }

    /**
     * Clevis permission class type
     *
     * @var string
     */
    private static $instanceType;

    /**
     * Set navigation instance type
     *
     * @param string $instanceType
     */
    public static function setInstanceType($instanceType) {
        self::$instanceType = $instanceType;
    }

    /**
     * Clevis permission instance
     *
     * @var string
     */
    protected static $instance;

    /**
     * Get instance of permission
     *
     * @return Clevis_Permission
     */
    public static function getInstance() {
        if ( self::$instance == null ) {
            Clevis_Timer::start('run-permission');
            self::$instance = new self::$instanceType();
            Clevis_Timer::stop('run-permission');
        }
        return self::$instance;
    }

}
