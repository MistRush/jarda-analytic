<?php
namespace admin\components;

use admin\logic\Navigation;
use common\logic\Helper\Price;
use Jolanda\Controls\Editor\EntityEditor;
use Jolanda\Controls\Form\controls\FormControl;
use Jolanda\Controls\Grid\Grid;
use Jolanda\Controls\Grid\GridVue;
use Jolanda\Menu\Menu;
use user\logic\UserAdminSession;
use User_Model_User as User;

/**
 * Class UserComponents
 * @package admin\components
 */
class UserComponents {

    /**
     * @return Grid
     */
    public static function userGrid() :Grid {
        $grid = new GridVue('user', 'Seznam uživatelských účtů', 'admin/user/edit-user');
        $grid->enableSearch(['Name'], 'Zadejte hledaný výraz');

        if ( UserAdminSession::getCurrentUserType() == User::TYPE_SUPERADMIN )
            $grid->setEnabledActions(true, true, true);
        else
            $grid->setEnabledActions(false, true, false);

        $grid->setUrl('user/user');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        if ( UserAdminSession::getCurrentUserType() == User::TYPE_SUPERADMIN )
            $grid->addColumn(COLUMN_CHECKBOX, 'Active', 'Aktivní');
        $grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', 'Eshop', 150)->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'eshop'));
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Uživatelský účet', 150);
        $grid->addColumn(COLUMN_ENUM, 'Type', 'Typ účtu', 150)->setEnumValues(User::getUserTypes());
        $grid->addColumn(COLUMN_DATE, 'RegistrationDate', 'Datum registrace');
        $grid->addColumn(COLUMN_DATE, 'LastLogin', 'Datum posledního přihlášení', 150);
        $grid->addColumn(COLUMN_TEXT, 'CountLogin', 'Počet přihlášení');

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function userEntityEditor() :EntityEditor {
        $editor = new EntityEditor('user', 'Zákazník', 'user/user');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::USER_LIST)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');
        $tab = $editor->addTab('Základní informace', 'basic-info');
        $tab->setColumns(1);

        $group = $tab->addGroup('Uživatelský účet');
        $form = $group->addForm();
        $form->setColumns(2);
        $name = $form->addTextBox('Name', 'Název účtu:');
        $form->addComboBoxStore('Eshop_ID', 'Eshop:', array('module' => 'common', 'controller' => 'eshop'), 'Name')->setReadOnly(1);
        $name->addRule(FormControl::VALIDATOR_EMAIL, ' Zadejte email ve správném formátu');
        $name->addRule(FormControl::VALIDATOR_CUSTOM, ' Zadaný uživ. účet již existuje', 'checkUserExists();');
        $form->addComboBoxEnum('Type', 'Typ účtu:', User::getUserTypes(), true);
        $form->addPassword('Password', 'Heslo:', true);
        $form->addPassword('PasswordConfirmation', 'Heslo znovu:', true)->addRule(FormControl::VALIDATOR_SAME_VALUE, 'Hesla se musejí shodovat', 'Password');

        $group = $tab->addGroup('Kontaktní informace');
        $form = $group->addForm();
        $form->setColumns(2);
        $form->addTextBox('ContactName', 'Jméno:');
        $form->addTextBox('ContactDescription', 'Popis pozice:');
        $form->addTextBox('ContactPhone', 'Telefon:');

        $tab = $editor->addTab('Opravnění a obchody', 'permissions-eshop');
        $tab->setColumns(2);

        if (UserAdminSession::hasPermission('user-edit-eshop')) {
            $group = $tab->addGroup('Nastavení přístupu');
            $group->addRelationSwitcher('Přístup k obchodům', 'common/eshop', 'user/user-eshop', 'User_ID', 'Eshop_ID', 'Name');
        }

        if (UserAdminSession::hasPermission('user-edit-permissions')) {
            $group = $tab->addGroup('Nastavení přístupu');
            $group->addRelationSwitcher('Přístupová práva', 'user/permission', 'user/user-has-permission', 'User_ID', 'Permission_ID', 'Name', ['sort' => 'Name']);
        }

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function groupGrid() :Grid {
        $grid = new GridVue('group', 'Seznam skupin', 'admin/user/edit-group');
        $grid->enableSearch(['Name'], 'Zadejte hledaný výraz');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('user/group');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Název skupiny', 150);

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function groupEntityEditor() :EntityEditor {
        $editor = new EntityEditor('user', 'Uživatelská skupina', 'user/group');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::USER_GROUP)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');
        $tab = $editor->addTab('Základní informace', 'basic-info');
        $tab->setColumns(1);

        $group = $tab->addGroup('Uživatelská skupina');
        $form = $group->addForm();
        $form->setColumns(2);
        $form->addTextBox('Name', 'Název skupiny:');

        return $editor;
    }

    /**
     * @param $groupGrid
     * @return Grid
     */
    public static function groupDiscountGrid($groupGrid) :Grid {
        $grid = new GridVue('groupDiscount', 'Kategorie', 'admin/user/edit-group-discount');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('user/group-discount');
        $grid->setParentGrid($groupGrid, 'Group_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ENTITY, 'Category_ID', 'Kategorie', 300)->setEntity('ID', 'FullName', array('module' => 'admin', 'controller' => 'category'));
        $grid->addColumn(COLUMN_NUMBER, 'Discount', 'Sleva', 50);

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function groupDiscountEntityEditor() :EntityEditor {
        $editor = new EntityEditor('groupDiscount', 'Kategorie', 'user/group-discount');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::USER_GROUP)->getUrl());
        $editor->enableStandalone();

        $tab = $editor->addTab('Slevové kategorie', 'basic-info');
        $tab->setColumns(2);

        $group = $tab->addGroup('Slevové kategorie');
        $form = $group->addForm();
        $form->addComboBoxStore('Category_ID', 'Kategorie:', array('module' => 'admin', 'controller' => 'category'), 'FullName', true);
        $form->addNumericBox('Discount', 'Sleva:', true);

        return $editor;
    }
}