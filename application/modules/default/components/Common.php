<?php
namespace default\components;

use Admin_Model_Announcement as Announcement;
use Admin_Model_Shipping as Shipping;
use common\logic\Eshop\Eshop;
use common\logic\Latte\LatteEngine;
use Common_Model_Eshop as EshopModel;
use Doctrine_Query_Exception;

class Common {

    const FOLDER = __DIR__ . '/../../default/views/latte/components/common/';

    /**
     * @return string
     */
    public static function benefits(): string {
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'benefits.latte');
    }

    /**
     * @return string
     */
    public static function freeShipping(): string {
        $freeShipping = Shipping::getFreeShipping();
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'free-shipping.latte',
            [
                'freeShipping' => $freeShipping,
            ]
        );
    }

    /**
     * @return string
     */
    public static function shopYear(): string {
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'shop-year.latte');
    }

    /**
     * @param string|null $type
     * @return string
     */
    public static function contactBox(string $type = null): string {
        $eshop = Eshop::getInstance();

        $latte = 'contact-box.latte';
        if ( $type == 'line' )
            $latte = 'contact-line-box.latte';

        return LatteEngine::getInstance()->renderToString(self::FOLDER . $latte,
            [
                'eshop' => $eshop,
            ]
        );
    }

    /**
     * @return string
     */
    public static function newsletter(): string {
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'newsletter.latte');
    }

    /**
     * @return string
     */
    public static function cookiesConfirm(): string {
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'cookies-confirm.latte', ['eshop' => Eshop::getInstance()]);
    }

    public static function registerAction() {
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'register-action.latte', ['eshop' => Eshop::getInstance()]);
    }

    /**
     * @return string
     */
    public static function reviews() {
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'reviews.latte');
    }

    /**
     * Vrácí aktivní oznámeni
     * @param EshopModel|null $eshop
     * @return string|null
     * @throws Doctrine_Query_Exception
     */
    public static function announcement(?EshopModel $eshop = null): ?string {
        if (!$eshop)
            $eshop = Eshop::getInstance()->getEshop();

        foreach (Announcement::getActiveAnnouncements($eshop) as $announcement) {
            if ($announcement->isRead())
                continue;

            return LatteEngine::getInstance()->renderToString(self::FOLDER . 'announcement.latte', [
                'announcement' => $announcement
            ]);
        }

        return null;
    }
}