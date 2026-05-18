<?php
namespace admin\components;

use admin\logic\Navigation;
use Admin_Model_Address as Address;
use Admin_Model_Coupon as Coupon;
use common\logic\Eshop\Eshop;
use common\logic\Languages;
use Jolanda\Controls\Editor\EntityEditor;
use Jolanda\Controls\Form\Controls\FormControl;
use Jolanda\Controls\Form\Form;
use Jolanda\Controls\Grid\Grid;
use Jolanda\Controls\Grid\GridVue;
use Jolanda\Controls\Grid\QuickEditor;
use Jolanda\Menu\Menu;
use User_Model_User as User;

/**
 * Class CustomerComponents
 * @package admin\components
 */
class CustomerComponents {

    /**
     * @return Grid
     */
    public static function customerGrid() :Grid {
        $grid = new GridVue('customer', 'Seznam zákazníků', 'admin/customer/edit-customer');
        $switches = $grid->getSwitchesForm();
        $switches->addComboBoxStore('Eshop_ID', translate('Eshop'),
            array('module' => 'common', 'controller' => 'eshop', 'acl' => true), 'Name', false)->setValue(Eshop::getInstance()->getEshopID());
        $grid->enableSearch(['Name', 'invoiceAddress.FirstName', 'invoiceAddress.LastName', 'invoiceAddress.CompanyName', 'invoiceAddress.City', 'invoiceAddress.Street',  'invoiceAddress.ZipCode'], 'Zadejte hledaný výraz');
        $grid->setEnabledActions(false, true, true);
        $grid->setUrl('admin/customer');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', 'Eshop', 50)->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'eshop'));
        $grid->addColumn(COLUMN_CHECKBOX, 'Active', 'Aktivní', 35);
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Název účtu', 150);
        $grid->addColumn(COLUMN_ENUM, 'Type', 'Typ účtu', 150)->setEnumValues(User::getUserTypes());
        $grid->addColumn(COLUMN_TEXT, 'IAFullName', 'Jméno a příjmení', 150);
        //$grid->addColumn(COLUMN_TEXT, 'UserNumber', 'Číslo účtu', 150);
        $grid->addColumn(COLUMN_TEXT, 'IACompanyName', 'Název společnosti', 100);
        $grid->addColumn(COLUMN_TEXT, 'IAAddress', 'Adresa', 200);
        $grid->addColumn(COLUMN_DATE, 'LastLogin', 'Datum posledního přihlášení', 135);
        $grid->addColumn(COLUMN_TEXT, 'CountLogin', 'Počet přihlášení', 60);
        $grid->addColumn(COLUMN_TEXT, 'Discount', 'Sleva (%)', 40);

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function customerEntityEditor(): EntityEditor {
        $editor = new EntityEditor('customer', 'Zákazník', 'admin/customer');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::CUSTOMER_LIST)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');
        $tab = $editor->addTab('Základní informace', 'basic-info');
        $tab->setColumns(1);

        $group = $tab->addGroup('Uživatelský účet');
        $form = $group->addForm();
        $form->setColumns(1);
        $name = $form->addTextBox('Name', 'Název účtu', true);
        $name->addRule(FormControl::VALIDATOR_EMAIL, 'Zadejte email ve správném formátu');
        $form->setColumns(2);
        $form->addComboBoxStore('Eshop_ID', 'Eshop:', array('module' => 'common', 'controller' => 'eshop'), 'Name')->setReadOnly(1);
        $form->addEmpty();
        $form->addHidden('Type')->setValue(User::TYPE_CUSTOMER);
        $form->addPassword('Password', 'Heslo:', true);
        $form->addPassword('PasswordConfirmation', 'Heslo znovu:', true)->addRule(FormControl::VALIDATOR_SAME_VALUE, 'Hesla se musejí shodovat', 'Password');
        //$form->addTextBox('UserNumber', 'Číslo účtu');

        $group = $tab->addGroup('Nastavení zákazníka');
        $form = $group->addForm();
        $form->setDataAttribute('userSettings');
        $form->setColumns(2);
        $form->addComboBoxStore('Group_ID', 'Uživatelská skupina:', array('module' => 'user', 'controller' => 'group'), 'Name', false);
        $form->addNumericBox('Discount', 'Sleva (%):');
        $form->addBoolRadioButton('ShowOnMap', 'Zobrazit na mapě');
        //$form->addBoolRadioButton('HidePrices', 'Skrýt ceny');

        $tab->setColumns(2);
        $group = $tab->addGroup('Fakturační adresa');
        $form = $group->addForm();
        $form->setDataAttribute('invoiceAddress');
        $form->addHidden('Type')->setValue(Address::TYPE_INVOICE);
        $form->addTextBox('CompanyName', 'Název společnosti');
        $form->setColumns(2);
        $form->addTextBox('FirstName', 'Jméno:');
        $form->addTextBox('LastName', 'Příjmení:');
        $form->addTextBox('IC', 'IČ:');
        $form->addTextBox('DIC', 'DIČ:');
        $form->addTextBox('Street', 'Ulice a č.p.:', true);
        $form->addTextBox('City', 'Obec:', true);
        $form->addTextBox('ZipCode', 'PSČ:', true);
        $form->addTextBox('Email', 'Email:')->setReadOnly(true);
        $form->addTextBox('EmailAlternative', 'Email #2:');
        $form->addTextBox('Phone', 'Telefon:');

        $group = $tab->addGroup('Doručovací adresa');
        $form = $group->addForm();
        $form->setDataAttribute('deliveryAddress');
        $form->addHidden('Type')->setValue(Address::TYPE_DELIVERY);
        $form->addTextBox('CompanyName', 'Název společnosti');
        $form->setColumns(2);
        $form->addTextBox('FirstName', 'Jméno:');
        $form->addTextBox('LastName', 'Příjmení:');
        $form->addTextBox('Street', 'Ulice a č.p.:');
        $form->addTextBox('City', 'Obec:');
        $form->addTextBox('ZipCode', 'PSČ:');
        $form->addTextBox('Phone', 'Telefon:');

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function currentCartGrid() :Grid {
        $grid = new GridVue('currentCart', 'Seznam položek v opuštěných nákupních košících');
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/cart');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_DATE, 'Date', 'Datum', 160);
        $grid->addColumn(COLUMN_TEXT, 'Time', 'Čas', 160);
        $grid->addColumn(COLUMN_TEXT, 'SessionID', 'Host', 250)->setHelp('ID nepřihlášeného zákazníka');
        $grid->addColumn(COLUMN_ENTITY, 'User_ID', 'Uživatel', 250)->setEntity('ID', 'Name', array('module' => 'user', 'controller' => 'user'));
        $grid->addColumn(COLUMN_ENTITY, 'Product_ID', 'Produkt', 250)->setEntity('ID', 'NameCZ', array('module' => 'admin', 'controller' => 'product'));
        $grid->addColumn(COLUMN_TEXT, 'Quantity', 'Množství', 50);

        return $grid;
    }

    /**
     * @return Grid
     */
    public static function cartGrid() :Grid {
        $grid = new GridVue('cart', 'Nákupní košíky');
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/cart');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ENTITY, 'User_ID', 'Uživatel', 200)->setEntity('ID', 'Name', array('module' => 'user', 'controller' => 'user'));
        $grid->addColumn(COLUMN_ENTITY, 'Product_ID', 'Produkt', 300)->setEntity('ID', 'FullName', array('module' => 'admin', 'controller' => 'product'));
        $grid->addColumn(COLUMN_TEXT, 'Date', 'Datum', 60);
        $grid->addColumn(COLUMN_TEXT, 'Time', 'Čas', 60);

        return $grid;
    }

    /**
     * @return QuickEditor
     */
    public static function cartQuickEditor() :QuickEditor {
        $editor = new QuickEditor('Položka košíku', 'admin/cart');
        $editor->addNumericBox('Quantity', 'Počet:', true);

        return $editor;
    }

    /**
     * @return Form
     */
    public static function createAddToCartForm() :Form {
        $form = new Form();
        $group = $form->addFormGroup('');
        $group->setColumns(1);
        $productID = $group->addComboBoxStore('Product_ID', 'Název produktu:', array('module' => 'admin', 'controller' => 'product-to-cart'), 'FullName', true);
        $productID->setMinimumSearchLength(3);
        $group->addNumericBox('Quantity', 'Počet:')->setValue(1);

        return $form;
    }

    /**
     * @return Grid
     */
    public static function couponGrid(): Grid {
        $lang = Languages::getLangCode();

        $grid = new GridVue('coupon', 'Kupóny', 'admin/customer/edit-coupon');
        $grid->enableSearch(['Code', 'Name'.$lang], 'Zadejte hledaný kód/název');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/coupon');
        $grid->setRowFormatter('formatRow');
        $grid->setOrder('CreatedDate', 'DESC');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Code', 'Slevový kód', 70);
        $grid->addColumn(COLUMN_TEXT, 'Name'.$lang, 'Název', 200);
        $grid->addColumn(COLUMN_ENUM, 'Type', 'Typ kupónu', 100)->setEnumValues(Coupon::getCouponTypes());
        $grid->addColumn(COLUMN_NUMBER, 'Quantity', 'Množství', 20);
        $grid->addColumn(COLUMN_ENTITY, 'Product_ID', 'Produkt', 150)->setEntity('ID', 'Name', ['module'=>'admin', 'controller'=>'product-simple']);
        $grid->addColumn(COLUMN_TEXT, 'Discount', 'Sleva (CZK/%)', 50)->setFormatFunction('formatDiscount');
        $grid->addColumn(COLUMN_NUMBER, 'TotalCount', 'Počet použití', 50)->setFormatFunction('formatCount');
        $grid->addColumn(COLUMN_NUMBER, 'MinOrder', 'Minimální objednávka', 85);
        $grid->addColumn(COLUMN_DATE, 'ExpiryDate', 'Expirace', 60);
        $grid->addColumn(COLUMN_DATE, 'CreatedDate', 'Datum vytvoření', 60);
        $grid->addColumn(COLUMN_ENTITY, 'User_ID', 'Uživatel', 150)->setEntity('ID', 'Name', ['module'=>'user','controller'=>'user']);

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function couponEditor(): EntityEditor {
        $editor = new EntityEditor('coupon','Kupón', 'admin/coupon');
        $editor->enableStandalone();
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::CUSTOMER_COUPON)->getUrl());

        $tab = $editor->addTab('Nastavení kupónu');
        $group = $tab->addGroup('Obecné nastavení');
        $group->setColumnSize(7);
        $form = $group->addForm();
        $form->setColumns(2);
        $form->addTextBox('Code', 'Kód:', true)->setColumnSize(8);
        $form->addComboBoxEnum('Type', 'Typ:', Coupon::getCouponTypes(), true)->setColumnSize(4);
        $form->addNumericBox('Quantity', 'Množství', true)->setColumnSize(2)->setValue(1);
        $product = $form->addComboBoxStore('Product_ID', 'Produkt', ['module'=>'admin', 'controller'=>'product-simple'], 'Name', false)->setColumnSize(6);
        $product->getElement()->setAttribute('class', 'coupon-type-product');
        $discount = $form->addFloatingPointBox('Discount', 'Sleva (CZK/%)', false)->setColumnSize(4);
        $discount->setValue(0);
        $discount->getElement()->setAttribute('class', 'coupon-type-discount');

        $form->setColumns(3);
        $form->addDateBox('ExpiryDate', 'Datum Expirace', false);
        $form->addEmpty()->setAttribute('class','col-12');
        $form->addFloatingPointBox('MinOrder', 'Minimální objednávka (CZK)', false)->setValue(0.0);
        $form->addEmpty()->setAttribute('class','col-12');
        $form->addComboBoxStore('User_ID', 'Uživatel', ['module'=>'user','controller'=>'user'],'Name', false);
        $form->addNumericBox('TotalCount', 'Maximální počet použití', false)->setValue(0);

        $group = $tab->addGroup('Nastavení názvu');
        $group->setColumnSize(5);
        $form = $group->addForm();

        foreach(Languages::getInstance()->getLanguages() as $language)
            $form->addTextBox('Name'.$language['Code'], $language['Name'], $language['Active']>0);

        return $editor;
    }
}