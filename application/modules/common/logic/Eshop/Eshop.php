<?php
namespace common\logic\Eshop;

use Admin_Model_Currency as Currency;
use Common_Model_Eshop as EshopModel;
use Doctrine_Collection;
use user\logic\UserClientSession;

/**
 * Module constants
 */
class Eshop {

    /** @var ?EshopModel $eshop */
    private ?EshopModel $eshop;

    /** Single instance */
    private static self $instance;

    /**
     * Constructor
     */
    public function __construct() {

        $eshop = EshopModel::getEshopByID(EshopModel::HADEX_CZ_ID);
        $this->setEshop($eshop);
        return;

        if (\Zend_Controller_Front::getInstance()->getRequest()->getModuleName() != 'admin') {
            $eshop = EshopModel::getEshopByURL(self::_getServer());
            $this->setEshop($eshop);
        } else
            $this->setEshopFromCookie();

        if ( !$this->eshop )
            die('Eshop nenalezen.');
    }

    /**
     * Vrací URL
     * @return string
     */
    private static function _getServer(): string {
        return $_SERVER['HTTP_HOST'];
        return trim(substr($host, strrpos($host, '.', -(strlen($host) - strrpos($host, '.') + 1))), '.');
    }

    /**
     * @param string $parameter
     * @return ?string
     */
    public function getSettings(string $parameter) : ?string {
        if ($parameter == 'AnalyticsCode' && isDevelopment())
            return null;
        return $this->getEshop()->settings->$parameter;
    }

    /**
     * @return string
     */
    public function getLanguage(): string {
        return $this->getEshop()->language->Code;
    }

    /**
     * @return int
     */
    public function getLangID() : int {
        return $this->getEshop()->Language_ID;
    }

    /**
     * @return int
     */
    public function getVatID(): int {
        return $this->getEshop()->Vat_ID;
    }

    /**
     * @return string
     */
    public function getName() : string {
        return $this->getEshop()->Name;
    }

    /**
     * @return string
     */
    public function getURL() : string {
        return $this->getEshop()->URL;
    }

    /**
     * @return string
     */
    public function getLogo() : string {
        $logo = $this->getEshop()->fileLogo;
        $path = $this->getEshop()->URL . '/files/images/logo/';
        if (!$logo) {
            return $this->getEshop()->URL . '/files/front/logo.png';
        }
        return $path . $logo->Name . '.' . $logo->Extension;
    }

    /**
     * @return Currency
     */
    public function getCurrency() : Currency {
        return $this->eshop->currency;
    }

    /**
     * @return EshopModel|null
     */
    public function getEshop(): ?EshopModel {
        return $this->eshop;
    }

    /**
     * @return int|null
     */
    public function getEshopID() : ?int {
        return $this->getEshop()?->ID;
    }

    /**
     * @return EshopModel[]|Doctrine_Collection
     */
    public function getEshops(): array|Doctrine_Collection {
        return EshopModel::getEshops(UserClientSession::getCurrentUserID());
    }

    /**
     * @param EshopModel|null $eshop
     */
    public function setEshop(?EshopModel $eshop) {
        $this->eshop = $eshop;
    }

    /**
     * Nastaví Eshop pro administrátory
     */
    public function setEshopFromCookie() {
        if (!UserClientSession::getCurrentUserID()) {
            $eshop = EshopModel::getFirstEshop();
            $this->setEshop($eshop);
            return;
        }

        if (isset($_COOKIE['Eshop_ID']) && is_numeric($_COOKIE['Eshop_ID'])) {
            $eshop = EshopModel::getEshopByID((int)$_COOKIE['Eshop_ID']);
            if (!$eshop)
                $eshop = EshopModel::getFirstEshop();
        } else
            $eshop = EshopModel::getFirstEshop();

        if ($eshop) {
            $this->setEshop($eshop);
            setcookie('Eshop_ID', $this->getEshopID(), time() + (86400 * 30), "/admin");
        } else
            unset($_COOKIE['Eshop_ID']);
    }

    /**
     * @return Eshop
     */
    public static function getInstance(): self {
        if (!isset(self::$instance))
            self::$instance = new Eshop();

        return self::$instance;
    }
}