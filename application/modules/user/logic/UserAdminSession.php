<?php
namespace user\logic;

use User_Model_Permission as PermissionModel;
use User_Model_User as UserModel;
use Zend_Session_Namespace as ZendSessionNamespace;

class UserAdminSession {

    const SESSION = 'hadex_user_admin';

    /**
     * @return ZendSessionNamespace
     */
    public static function getCurrentUser(): ZendSessionNamespace {
        return new ZendSessionNamespace(self::SESSION);
    }

    /**
     * @return ?int
     */
    public static function getCurrentUserID(): ?int {
        return self::getCurrentUser()->ID;
    }

    /**
     * @return string
     */
    public static function getCurrentUserName(): ?string {
        return self::getCurrentUser()->Name;
    }

    /**
     * @return string
     */
    public static function getCurrentUserType(): ?string {
        return self::getCurrentUser()->Type;
    }

    public static function getCurrentUserPermissions() {
        $user = self::getCurrentUser();

        return $user->permissions;
    }

    /**
     * @param bool $asArray
     * @return array|null
     */
    public static function getCurrentUserEshop(bool $asArray = false): ?array {
        $user = UserModel::getUser(self::getCurrentUserID());
        $eshops = [];

        if (!count($user->userEshops) || self::getCurrentUserType() == UserModel::TYPE_SUPERADMIN)
            return null;

        foreach ($user->userEshops as $userEshop) {
            if ($asArray) {
                $eshops[] = $userEshop->Eshop_ID;
            } else {
                $eshops[] = $userEshop->eshop;
            }
        }

        return $eshops;
    }

    /*
    * Načte oprávnění
    */
    public static function refreshPermissions() {
        $user = new ZendSessionNamespace(self::SESSION);

        if ($user->isLocked())
            $user->unlock();

        $user->permissions = PermissionModel::getPermissionsForUser(self::getCurrentUserID());
        $user->lock();
    }

    /**
     * @return boolean
     */
    public static function isCurrentUser(): bool {
        return self::getCurrentUserID() != null;
    }

    /**
     * @param string|null $Code
     * @return bool
     */
    public static function hasPermission(?string $Code): bool {
        if (empty($Code))
            return true;

        $user = new ZendSessionNamespace(self::SESSION);
        if (!is_array($user->permissions))
            return false;

        if (!array_key_exists($Code, $user->permissions))
            return UserModel::userHasPermission($user->ID, $Code);

        if (self::getCurrentUserType() === UserModel::TYPE_SUPERADMIN)
            return true;

        return $user->permissions[$Code];
    }

    /**
     * @param int|string|null $id
     * @param string|null $name
     * @param string|null $type
     */
    public static function setCurrentUser(?int $id, ?string $name, ?string $type) {
        $user = new ZendSessionNamespace(self::SESSION);

        if ($user->isLocked())
            $user->unlock();

        $user->ID = $id;
        $user->Name = $name;
        $user->Type = $type;
        $user->permissions = null;

        if ($user->ID)
            self::refreshPermissions();

        if (!$user->isLocked())
            $user->lock();
    }

    /**
     * Reset current user
     */
    public static function resetCurrentUser() {
        self::setCurrentUser(null, null, null);
    }

    /**
     * @return bool
     */
    public static function isAdmin(): bool {
        if (!self::getCurrentUserID())
            return false;

        return in_array(self::getCurrentUserType(), UserModel::getAdminTypes(true));
    }

    /**
     * @return bool
     */
    public static function isSuperadmin(): bool {
        if (!self::getCurrentUserID())
            return false;

        return self::getCurrentUserType() == UserModel::TYPE_SUPERADMIN;
    }
}