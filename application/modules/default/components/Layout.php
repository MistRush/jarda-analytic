<?php
namespace default\components;

use Admin_Model_Category as Category;
use Admin_Model_Menu as Menu;
use Admin_Model_MenuItem as MenuItem;
use common\logic\Eshop\Eshop;
use common\logic\Front\Cart as Cart;
use common\logic\Latte\LatteEngine;
use user\logic\UserClientSession;

class Layout {
    const FOLDER = __DIR__ . '/../../default/views/latte/components/layout/';

    /**
     * @return string
     */
    public static function headerMenu(): string {
        $controller = \Zend_Controller_Front::getInstance()->getRequest()->getControllerName();
        $isCategoryMenuActive = in_array($controller, ['index']);
        $categories = Category::getMainMenuCategories();

        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'header-menu.latte',
            [
                'isCategoryMenuActive' => $isCategoryMenuActive,
                'eshop' => Eshop::getInstance(),
                'categories' => $categories,
                'isLogged' => UserClientSession::getCurrentUserID() ? 1 : 0,
                'menuItems' => MenuItem::getMenuItems(Menu::ID_HEADER_MENU),
                'currentUri' => $_SERVER['REQUEST_URI'],
            ]
        );
    }

    /**
     * @return string
     */
    public static function headerContact(): string {
        $isLogged = UserClientSession::getCurrentUserID() ? 1 : 0;
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'header-contact.latte',
            [
                'eshop' => Eshop::getInstance(),
                'isLogged' => $isLogged,
                'user' => $isLogged? UserClientSession::getCurrentUser() : null,
            ]
        );
    }

    public static function headerMainMenu(): string {
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'header-main-menu.latte',
            [
                'eshop' => Eshop::getInstance(),
                'categories' => Category::getMainMenuCategories(),
                'isLogged' => UserClientSession::getCurrentUserID() ? 1 : 0,
                'menuItems' => MenuItem::getMenuItems(Menu::ID_HEADER_MENU),
                'currentUri' => $_SERVER['REQUEST_URI'],
            ]
        );
    }

    public static function mobileMenu(): string {
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'mobile-menu.latte',
            ['menuItems' => MenuItem::getMenuItems(Menu::ID_HEADER_MENU)]
        );
    }

    /**
     * @return string
     */
    public static function headerControl(): string {
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'header-control.latte',
            [
                'userID' => UserClientSession::getCurrentUserID(),
                'eshop' => Eshop::getInstance(),
                'cart' => Cart::getInstance()
            ]
        );
    }

    /**
     * @return string
     */
    public static function footerContact(): string {
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'footer-contact.latte',
            ['eshop' => Eshop::getInstance(),]
        );
    }

    /**
     * @return string
     */
    public static function footerMenu(): string {
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'footer-menu.latte',
            [
                'menuItems' => MenuItem::getMenuItems(Menu::ID_FOOTER_MENU_1),
                'eshop' => Eshop::getInstance()
            ]
        );
    }

    public static function footerMenu2(): string {
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'footer-menu.latte',
            ['menuItems' => MenuItem::getMenuItems(Menu::ID_FOOTER_MENU_2),
                'eshop' => Eshop::getInstance()
            ]
        );
    }

    /**
     * @return string
     */
    public static function footerCopyright(): string {
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'footer-copyright.latte',
            ['eshop' => Eshop::getInstance(),]
        );
    }

    /**
     * @param array $breadcrumbs
     * @return string
     */
    public static function breadcrumb(array $breadcrumbs): string {
        return LatteEngine::getInstance()->renderToString(self::FOLDER . 'breadcrumb.latte',
            ['breadcrumbs' => $breadcrumbs]
        );
    }
}