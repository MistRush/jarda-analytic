<?php
namespace user\logic;

use User_Model_GroupDiscount as GroupDiscount;
use User_Model_UserSettings as Settings;

/**
 * Module constants
 */
class UserSettings {

    /** @var Settings */
    private $settings = null;

    /** Single instance */
    private static $instance;

    /** @var array */
    private array $groupDiscounts = [];

    /**
     * Constructor
     * @param null $userID
     */
    public function __construct($userID = null) {
        if ( !$userID && UserClientSession::getCurrentUserID() )
            $userID = UserClientSession::getCurrentUserID();

        $groupID = 2;

        if ( $userID ) {
            $settings = Settings::getUserSettings($userID);

            $this->setSettings($settings);

            if ( $settings && $settings->Group_ID )
                $groupID = $settings->Group_ID;
        }

        $this->setGroupDiscounts(GroupDiscount::getGroupDiscounts($groupID));
    }

    /**
     * @param string $parameter
     * @return mixed
     */
    public function getValue(string $parameter): mixed {
        $settings = $this->getSettings();

        if ( !$settings )
            return null;

        if ( $parameter == 'Discount' ) {
            if ( $settings->Discount )
                return $settings->Discount;

            return null;
        }

        return $settings->$parameter;
    }

    /**
     * @return string|null
     */
    public function getCurrencyLabel(): ?string {
        $settings = $this->getSettings();

        return $settings?->currency->Label;
    }

    /**
     * @return string|null
     */
    public function getCurrencyRatio(): ?string {
        $settings = $this->getSettings();

        return $settings?->currency->Ratio;
    }

    /**
     * @return Settings|null
     */
    public function getSettings(): ?Settings {
        return $this->settings;
    }

    /**
     * @param Settings|null $settings
     */
    public function setSettings(?Settings $settings) {
        $this->settings = $settings;
    }

    /**
     * @return array
     */
    public function getGroupDiscounts(): array {
        return $this->groupDiscounts;
    }

    /**
     * @param array $groupDiscounts
     */
    public function setGroupDiscounts(array $groupDiscounts) {
        $this->groupDiscounts = $groupDiscounts;
    }

    /**
     * @param int|null $userID
     * @return UserSettings
     */
    public static function getInstance(int $userID = null): UserSettings {
        if (!isset(self::$instance))
            self::$instance = new UserSettings($userID);

        return self::$instance;
    }
}