<?php
namespace admin\logic;

use Admin_Model_Product as Product;
use Admin_Model_Order as Order;
use Exception;
use Jolanda\Menu\Menu;
use user\logic\UserAdminSession;
use User_Model_User as User;

class Navigation {
    const INDEX = 'index';

    const SITEMAP = 'sitemap';

    const PRODUCT = 'product';
    const PRODUCT_LIST = 'product-list';
    const PRODUCT_CATEGORY = 'product-category';
    const PRODUCT_UPDATE = 'product-update';
    const COMPLAINT = 'complaint';
    const COMPLAINT_LIST = 'complaint-list';

    const ORDER = 'order';

    const ORDER_LIST = 'order-list';
    const ORDER_FINISHED = 'order-finished';
    const ORDER_GOPAY = 'order-gopay';
    const ORDER_CSOB = 'order-csob';
    const ORDER_BALIKOBOT = 'order-balikobot';

    const CUSTOMER = 'customer';
    const CUSTOMER_LIST = 'customer-list';
    const CUSTOMER_CART = 'customer-cart';
    const CUSTOMER_COUPON = 'customer-coupon';

    const FEEDBACK_INDEX = 'feedback-index';
    const FEEDBACK_PROJECT= 'feedback-project';

    const MARKETING = 'marketing';
    const MARKETING_STATS = 'marketing-stats';
    const MARKETING_NEWSLETTER = 'marketing-newsletter';
    const MARKETING_QUESTION = 'marketing-question';
    const MARKETING_FEED = 'marketing-feed';
    const MARKETING_MASS_EMAIL = 'marketing-mass-email';

    const SETTINGS = 'settings';
    const SETTINGS_BASIC = 'settings-basic';
    const SETTINGS_BASIC_ESHOP = 'settings-basic-eshop';
    const SETTINGS_BASIC_CURRENCY = 'settings-basic-currency';
    const SETTINGS_BASIC_LANGUAGE = 'settings-basic-language';
    const SETTINGS_BASIC_VAT = 'settings-basic-vat';
    const SETTINGS_BASIC_PERMISSION = 'settings-basic-permission';
    const SETTINGS_BASIC_CRON = 'settings-basic-cron';

    const SETTINGS_PRODUCT = 'settings-product';
    const SETTINGS_PRODUCT_MANUFACTURER = 'settings-product-manufacturer';
    const SETTINGS_PRODUCT_PARAMETER = 'settings-product-parameter';

    const SETTINGS_DESIGN = 'settings-design';
    const SETTINGS_DESIGN_PAGE = 'settings-design-page';

    const SETTINGS_DESIGN_BLOCK = 'settings-design-block';
    const SETTINGS_DESIGN_PRODUCT_ON_HOMEPAGE = 'settings-design-product-on-homepage';

    const SETTINGS_DESIGN_MENU = 'settings-design-menu';
    const SETTINGS_DESIGN_NEWS = 'settings-design-news';
    const SETTINGS_DESIGN_BANNER = 'settings-design-banner';
    const SETTINGS_DESIGN_POPUP = 'settings-design-popup';
    const SETTINGS_DESIGN_ANNOUNCEMENT = 'settings-design-announcement';

    const SETTINGS_PPL_SHIPPING = 'settings-ppl-shipping';

    const SETTINGS_SP = 'settings-sp';
    const SETTINGS_SP_SHIPPING = 'settings-sp-shipping';
    const SETTINGS_SP_PAYMENT = 'settings-sp-payment';

    const SETTINGS_ORDER = 'settings-order';
    const SETTINGS_ORDER_STATE_TYPE = 'settings-order-state-type';

    const ADMINISTRATION = 'administration';
    const ADMINISTRATION_LOG = 'administration-log';
    const ADMINISTRATION_LOG_EMAIL = 'administration-log-email';
    const ADMINISTRATION_LOG_LOGIN = 'administration-log-login';
    const ADMINISTRATION_LOG_SEARCH = 'administration-log-search';
    const ADMINISTRATION_LOG_API = 'administration-log-api';
    const ADMINISTRATION_LOG_CART = 'administration-log-cart';

    const ADMINISTRATION_SYSTEM_TRANSLATIONS = 'administration-system-translations';
    const ADMINISTRATION_SYSTEM_TRANSLATIONS_EDIT = 'administration-system-translations-edit';

    const USER = 'user';
    const USER_LIST = 'user-list';
    const USER_GROUP = 'user-group';
    const MEALS = 'meals';
    const CONDITIONS = 'conditions';
    const RECOMENDATIONS = 'recomendations';
    const BLOG = 'blog';
    const BLOG_LIST = 'blog-list';
    const BLOG_CATEGORY = 'blog-category';

    /**
     * Generuje menu
     *
     * @param Menu $menu
     */
    public static function generateMenu(Menu $menu): void{
        $menu->addHidden(self::INDEX, 'Úvodní stránka', 'admin/index/index');
        $menu->addHidden(self::SITEMAP, 'Mapa stránek', 'admin/menu/index'  );

//        $meals = $menu->addItem(self::MEALS, 'Seznam jídel', 'admin/meals/meals', 'stock');
//        $conditions = $menu->addItem(self::CONDITIONS, 'Podmínky', 'admin/conditions/conditions', 'note');
//        $recomendations = $menu->addItem(self::RECOMENDATIONS, 'Doporučení', 'admin/recomendations/recomendations', 'questionMark');
//        $blog = $menu->addItem(self::BLOG, 'Blog', null, 'business');
//        $blog->addItem(self::BLOG_LIST, 'Seznam článků', 'admin/news/news', 'business');
//        $blog->addItem(self::BLOG_CATEGORY, 'Kategorie článků', 'admin/news/news-category', 'business');

//        $customer = $menu->addItem(self::CUSTOMER, 'Zákazníci', null, 'feedback');
//        $customer->setBadge(User::getUsersCount(User::TYPE_CUSTOMER));
//        $customer->addItem(self::CUSTOMER_LIST, 'Seznam zákazníků', 'admin/customer/customer', 'feedback');
//        $customer->addItem(self::CUSTOMER_COUPON, 'Slevové kupóny', 'admin/customer/coupon', 'discount');
//        $customer->addItem(self::CUSTOMER_CART, 'Nákupní košíky', 'admin/customer/cart', 'cart');

        $marketing = $menu->addItem(self::MARKETING, 'Marketing', null, 'trendUp');
        $marketing->addItem(self::MARKETING_STATS, 'GA4 Statistiky (JARDA)', 'admin/analytics/index', 'trendUp');
        $marketing->addItem(self::MARKETING_NEWSLETTER, 'Odběratelé newsletteru', 'admin/marketing/newsletter', 'trendUp');


        $settings = $menu->addItem(self::SETTINGS, 'Nastavení', null, 'cogs');
        if ( UserAdminSession::hasPermission('basic-settings') ) {
            $settingsBasic = $settings->addItem(self::SETTINGS_BASIC, 'Základní nastavení', null, 'cogs');
            $settingsBasic->addItem(self::SETTINGS_BASIC_ESHOP, 'Nastavení webu', 'admin/settings/eshop', 'cogs');
//            $settingsBasic->addItem(self::SETTINGS_BASIC_LANGUAGE, 'Jazyky', 'admin/settings/language', 'cogs');
//            $settingsBasic->addItem(self::SETTINGS_BASIC_PERMISSION, 'Pravidla přístupu', 'admin/settings/permission', 'cogs');
        }


        $settingsDesign = $settings->addItem(self::SETTINGS_DESIGN, 'Vzhled a obsah', null, 'cogs');
        $settingsDesign->addItem(self::SETTINGS_DESIGN_PAGE, 'Obsah podstránek', 'admin/settings/page', 'cogs');
//        $settingsDesign->addItem(self::SETTINGS_DESIGN_BLOCK, 'HTML bloky', 'admin/settings/block', 'cogs');
        $settingsDesign->addItem(self::SETTINGS_DESIGN_MENU, 'Menu', 'admin/settings/menu', 'cogs');



        $administration = $menu->addItem(self::ADMINISTRATION, 'Administrace', null, 'listAlt');
        $administrationLog = $administration->addItem(self::ADMINISTRATION_LOG, 'Logy systému', null, 'listAlt');
        $administrationLog->addItem(self::ADMINISTRATION_LOG_EMAIL, 'Log posílání emailů', 'admin/administration/log-email', 'listAlt');
        $administrationLog->addItem(self::ADMINISTRATION_LOG_LOGIN, 'Log přihlášení do systémů', 'admin/administration/log-login', 'listAlt');

//        $translation = $administration->addItem(self::ADMINISTRATION_SYSTEM_TRANSLATIONS, 'Překlady', 'admin/translation/index', 'cogs');
//        $translation->addHidden(self::ADMINISTRATION_SYSTEM_TRANSLATIONS_EDIT, 'Úprava překladu', 'admin/translation/edit-translation');

        if (self::can(self::USER)) {
            $user = $menu->addItem(self::USER, 'Uživatelé', null, 'user');
            $user->setBadge(User::getUsersCount());
            $user->addItem(self::USER_LIST, 'Seznam uživatelů', 'admin/user/list');
            //$user->addItem(self::USER_GROUP, 'Seznam skupin', 'admin/user/group');
        }

        $menu->buildAcl();
    }

    /**
     * Vrácí, zda má uživatel přístup
     *
     * @param string $Code
     * @return bool
     * @throws Exception
     */
    public static function can(string $Code): bool {
        return UserAdminSession::hasPermission($Code);
    }
}