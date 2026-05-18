<?php
namespace admin\components;

use admin\logic\Navigation;
use Jolanda\Controls\Editor\EntityEditor;
use Jolanda\Controls\Grid\Grid;
use Jolanda\Controls\Grid\GridVue;
use Jolanda\Menu\Menu;

/**
 * Class AdministrationComponents
 * @package admin\components
 */
class AdministrationComponents {

    /**
     * @return Grid
     */
    public static function logEmailGrid() :Grid {
        $grid = new GridVue('emailLog', 'Log posílání emailů', 'admin/administration/edit-log-email');
        $grid->setEnabledActions(false, false, false);
        $grid->enableSearch(['Subject', 'Body', 'Sender', 'Recipients'], 'Zadejte hledaný výraz');
        $grid->setUrl('admin/email-log');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
//        $grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', 'Eshop', 300)->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'eshop'));
        $grid->addColumn(COLUMN_DATE, 'Date', 'Datum', 60);
        $grid->addColumn(COLUMN_TEXT, 'Time', 'Čas', 60);
        $grid->addColumn(COLUMN_LONGTEXT, 'Subject', 'Předmět', 300);
        $grid->addColumn(COLUMN_LONGTEXT, 'Body', 'Obsah', 300);
        $grid->addColumn(COLUMN_TEXT, 'Sender', 'Odesílatel', 150);
        $grid->addColumn(COLUMN_TEXT, 'Recipients', 'Příjemce', 150);
        $grid->enablePreview();

        return $grid;
    }

    /**
     * @return Grid
     */
    public static function logApiGrid() :Grid {
        $grid = new GridVue('apiLog', 'API Log');
        $grid->setEnabledActions(false, false, false);
        $grid->enableSearch(['Subject', 'Body', 'Sender', 'Recipients'], 'Zadejte hledaný výraz');
        $grid->setUrl('admin/api-log');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'User', 'Uživatel', 100);
        $grid->addColumn(COLUMN_DATETIME, 'DateTime', 'Datum a čas', 60);
        $grid->addColumn(COLUMN_LONGTEXT, 'Url', 'Url', 300);
        $grid->addColumn(COLUMN_TEXT, 'StatusCode', 'Status', 50);
        $grid->addColumn(COLUMN_TEXT, 'Message', 'Zpráva', 200);
        $grid->enablePreview();

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function logEmailEntityEditor() :EntityEditor {
        $editor = new EntityEditor('emailLog', 'Log posílání emailů', 'admin/email-log');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::ADMINISTRATION_LOG_EMAIL)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Subject');
        $editor->setReadonly(true);

        $tab = $editor->addTab('Log posílání emailů', 'basic-info');

        $group = $tab->addGroup('Log posílání emailů');
        $form = $group->addForm();
        $form->setColumns(2);
        $form->addDateBox('Date', 'Datum:');
        $form->addTextBox('Time', 'Čas:');
        $form->addTextBox('Subject', 'Předmět:');
        $form->addTextBox('Sender', 'Odesílatel:');
        $form->addTextBox('Recipients', 'Příjemce:');
        $form->setColumns(1);
        $body = $form->addEditor('Body', 'Obsah:');
        $body->setElementAttribute('style', 'height: 900px');

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function logLoginGrid() :Grid {
        $grid = new GridVue('loginLog', 'Log přihlášení do systému');
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('user/login-log');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ENTITY, 'User_ID', 'Uživatel', 200)->setEntity('ID', 'Name', array('module' => 'user', 'controller' => 'user'));
        $grid->addColumn(COLUMN_DATE, 'Date', 'Datum', 60);
        $grid->addColumn(COLUMN_TEXT, 'Time', 'Čas', 60);
        $grid->addColumn(COLUMN_TEXT, 'Type', 'Typ');

        return $grid;
    }

    /**
     * @return Grid
     */
    public static function logSearchGrid() {
        $grid = new GridVue('loginLog', 'Log vyhledávání');
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/search-log');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', 'Eshop', 300)->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'eshop'));
        $grid->addColumn(COLUMN_DATE, 'Date', 'Datum', 60);
        $grid->addColumn(COLUMN_TEXT, 'Time', 'Čas', 60);
        $grid->addColumn(COLUMN_TEXT, 'SearchTerm', 'Hledaný výraz', 200);
        $grid->addColumn(COLUMN_ENTITY, 'User_ID', 'Uživatel', 200)->setEntity('ID', 'Name', array('module' => 'user', 'controller' => 'user'));

        return $grid;
    }

    /**
     * @return Grid
     */
    public static function logCartGrid() {
        $grid = new GridVue('cartLog', 'Log košíku');
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/cart-log');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ENTITY, 'User_ID', 'Uživatel', 200)->setEntity('ID', 'Name', array('module' => 'user', 'controller' => 'user'));
        $grid->addColumn(COLUMN_ENTITY, 'Product_ID', 'Produkt', 300)->setEntity('ID', 'FullName', array('module' => 'admin', 'controller' => 'product'));
        $grid->addColumn(COLUMN_TEXT, 'Date', 'Datum', 60);
        $grid->addColumn(COLUMN_TEXT, 'Time', 'Čas', 60);
        $grid->addColumn(COLUMN_TEXT, 'IPAddress', 'IP Addresa', 200);

        return $grid;
    }
}