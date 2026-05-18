<?php
namespace admin\components;

use admin\logic\Navigation;
use Admin_Model_Announcement as Announcement;
use Admin_Model_Payment as Payment;
use Admin_Model_Parameter as Parameter;
use common\logic\Helper\Price;
use common\logic\Languages;
use Common_Model_Eshop as Eshop;
use Common_Model_File as File;
use Common_Model_Language as Language;
use Jolanda\Controls\Editor\EntityEditor;
use Jolanda\Controls\Form\Controls\FormControl;
use Jolanda\Controls\Grid\Grid;
use Jolanda\Controls\Grid\GridVue;
use Jolanda\Controls\Grid\QuickEditor;
use Jolanda\Menu\Menu;

/**
 * Class SettingsComponents
 * @package admin\components
 */
class SettingsComponents {

    /**
     * @return Grid
     */
    public static function eshopGrid() :Grid {
        $grid = new GridVue('eshop', 'Nastavení eshopů', 'admin/settings/edit-eshop');
        $grid->setEnabledActions(false, true, false);
        $grid->setUrl('common/eshop');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_CHECKBOX, 'Active', 'Aktivní', 40);
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Název eshopu');
        $grid->addColumn(COLUMN_TEXT, 'URL', 'URL');
        $grid->addColumn(COLUMN_ENTITY, 'Language_ID', 'Jazyk', 100)->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'language'));
        $grid->addColumn(COLUMN_ENTITY, 'Currency_ID', 'Daň', 100)->setEntity('ID', 'Name', array('module' => 'admin', 'controller' => 'currency'));
        $grid->addColumn(COLUMN_ENTITY, 'Vat_ID', 'Daň', 100)->setEntity('ID', 'Name', array('module' => 'admin', 'controller' => 'vat'));
        $grid->addColumn(COLUMN_TEXT, 'ProjectName', 'Název projektu');
        $grid->addColumn(COLUMN_TEXT, 'ProjectURL', 'Url projektu');
        $grid->addColumn(COLUMN_TEXT, 'ContactEmail', 'Kontaktní email');
        $grid->addColumn(COLUMN_TEXT, 'ContactPhone', 'Kontaktní telefon');
        $grid->addColumn(COLUMN_TEXT, 'Address', 'Adresa');
        $grid->addColumn(COLUMN_TEXT, 'RegistrationNumber', 'IČ');
        $grid->addColumn(COLUMN_TEXT, 'VATNumber', 'DIČ');

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function eshopEntityEditor() :EntityEditor {
        $editor = new EntityEditor('eshop', 'Nastavení eshop', 'common/eshop');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_BASIC_ESHOP)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');

        $tab = $editor->addTab('Základní informace', 'basic-info');
        $tab->setColumns(2);

        $group = $tab->addGroup('Eshop');
        $form = $group->addForm();
        $form->setColumns(2);
        $form->addTextBox('Name', 'Název eshopu:', true);
        $form->addTextBox('URL', 'URL projektu:', true);
        $form->addCheckBox('Active', 'Aktivní:');
        $form->addComboBoxStore('Language_ID', 'Jazyk:', array('module' => 'common', 'controller' => 'language'), 'Name', true);
        $form->addComboBoxStore('Currency_ID', 'Měna:', array('module' => 'admin', 'controller' => 'currency'), 'Name', true);
        $form->addComboBoxStore('Vat_ID', 'DPH:', array('module' => 'admin', 'controller' => 'vat'), 'Name', true);

        $group = $tab->addGroup('Nastavení');
        $form = $group->addForm();
        $form->setDataAttribute('settings');
        $form->setColumns(2);
        $form->addTextBox('ProjectName', 'Název projektu:', true);
        $form->addTextBox('ProjectURL', 'URL projektu:', true);
        $form->addTextBox('ProjectShortURL', 'Zkrácená URL projektu:', true);

        $group = $tab->addGroup('Další nastavení');
        $form = $group->addForm();
        $form->setDataAttribute('settings');
        $form->setColumns(2);
        $form->addTextBox('PriceDecimalPlaces', 'Počet desetinných míst u cen:', true);
        $form->addBoolRadioButton('EnableRegistration', 'Zákaznická registrace:');
        //$form->addBoolRadioButton('PriceVisibleOnlyForLogged', 'Ceny vidí jen přihlášení:');

        $group = $tab->addGroup('Kontakt');
        $form = $group->addForm();
        $form->setDataAttribute('settings');
        $form->setColumns(2);
        $form->addTextBox('ContactPhone', 'Kontaktní telefon:', true);
        $form->addTextBox('ContactEmail', 'Kontaktní email:', true);
        $form->addTextBox('ContactPerson', 'Kontaktní osoba:');
        $form->addTextBox('OpeningHours', 'Otvírací doba:');

        $group = $tab->addGroup('Adresa');
        $form = $group->addForm();
        $form->setDataAttribute('settings');
        $form->setColumns(2);
        $form->addTextBox('AddressStreet', 'Ulice a č.p.:', true);
        $form->addTextBox('AddressCity', 'Město:', true);
        $form->addTextBox('AddressZipCode', 'PSČ:', true);

        $group = $tab->addGroup('Společnost');
        $form = $group->addForm();
        $form->setDataAttribute('settings');
        $form->setColumns(2);
        $form->addTextBox('RegistrationNumber', 'IČ:', true);
        $form->addTextBox('VATNumber', 'DIČ:', true);

        $group = $tab->addGroup('Nastavení emailu');
        $form = $group->addForm();
        $form->setDataAttribute('settings');
        $form->setColumns(2);
        $form->addTextBox('SenderName', 'Jméno odesílatele:', true);
        $senderEmail = $form->addTextBox('SenderEmail', 'Email odesílatele:', true);
        $senderEmail->addRule(FormControl::VALIDATOR_EMAIL, ' Zadejte email ve správném formátu');
        $senderEmail = $form->addTextBox('NotifyEmail', 'Email pro notifikace (objednávka, napište nám, ...):', true);
        $senderEmail->addRule(FormControl::VALIDATOR_EMAIL, ' Zadejte email ve správném formátu');

        $group = $tab->addGroup('Soc. sítě');
        $form = $group->addForm();
        $form->setDataAttribute('settings');
        $form->setColumns(2);
        $form->addTextBox('FacebookURL', 'Facebook URL:');
        $form->addTextBox('FacebookName', 'Facebook název:');
        $form->addTextBox('InstagramURL', 'Instagram URL:');
        $form->addTextBox('InstagramName', 'Instagram název:');
        $group = $tab->addGroup('Google Analytics');
        $form = $group->addForm();
        $form->setDataAttribute('settings');
        $form->setColumns(2);
        $form->addTextBox('AnalyticsCode', 'Kód:');

        $group = $tab->addGroup('Logo');
        $form = $group->addForm();
        $form->setColumns(2);
        $form->addFileBox('FileLogo_ID', 'Soubor', [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload',
            'type' => File::TYPE_LOGO
        ]);

        $group = $tab->addGroup('Heureka');
        $form = $group->addForm();
        $form->setDataAttribute('settings');
        $form->setColumns(1);
        $form->addBoolRadioButton('HeurekaOverenoZakazniky', 'Heureka ověřeno zákazníky:');
        $form->addTextBox('HeurekaSecretKey', 'Heureka tajný klíč:');
        $form->addBoolRadioButton('HeurekaMereniKonverzi', 'Heureka měření konverzí:');
        $form->addTextBox('HeurekaPublicKey', 'Heureka veřejný klíč:');

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function currencyGrid() :Grid {
        $grid = new GridVue('currency', 'Měny', 'admin/settings/edit-currency');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/currency');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Název');
        $grid->addColumn(COLUMN_NUMBER, 'Ratio', 'Kurz');
        $grid->addColumn(COLUMN_TEXT, 'Label', 'Zkratka');
        $grid->addColumn(COLUMN_TEXT, 'Mark', 'Značka');

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function currencyEntityEditor(): EntityEditor {
        $editor = new EntityEditor('currency', 'Měna', 'admin/currency');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_BASIC_CURRENCY)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');

        $tab = $editor->addTab('Měna', 'basic-info');
        $tab->setColumns(2);

        $group = $tab->addGroup('Měna');
        $form = $group->addForm();
        $form->setColumns(2);
        $form->addTextBox('Name', 'Název:', true);
        $form->addFloatingPointBox('Ratio', 'Kurz:', true);
        $form->addTextBox('Label', 'Zkratka:', true);
        $form->addTextBox('Mark', 'Značka:', true);

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function languageGrid() :Grid {
        $grid = new GridVue('language', 'Jazyky', 'admin/settings/edit-language');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('common/language');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Název');
        $grid->addColumn(COLUMN_TEXT, 'Code', 'Kód');

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function languageEntityEditor() :EntityEditor {
        $editor = new EntityEditor('language', 'Měna', 'common/language');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_BASIC_LANGUAGE)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');

        $tab = $editor->addTab('Jazyk', 'basic-info');
        $tab->setColumns(2);

        $group = $tab->addGroup('Jazyk');
        $form = $group->addForm();
        $form->setColumns(2);
        $form->addTextBox('Name', 'Název:', true);
        $form->addTextBox('Code', 'Kód:', true);

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function vatGrid() :Grid {
        $grid = new GridVue('vat', 'Daňová pravidla', 'admin/settings/edit-vat');
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/vat');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Název');
        $grid->addColumn(COLUMN_TEXT, 'Value', 'Hodnota');

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function vatEntityEditor() :EntityEditor {
        $editor = new EntityEditor('vat', 'Daňové pravidlo', 'admin/vat');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_BASIC_VAT)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');

        $tab = $editor->addTab('Daňové pravidlo', 'basic-info');
        $tab->setColumns(2);

        $group = $tab->addGroup('Daňové pravidlo');
        $form = $group->addForm();
        $form->setColumns(2);
        $form->addTextBox('Name', 'Název:', true);
        $form->addFloatingPointBox('Value', 'Hodnota:');

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function manufacturerGrid() :Grid {
        $grid = new GridVue('manufacturer', 'Výrobci', 'admin/settings/edit-manufacturer');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/manufacturer');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Název výrobce');
        $grid->addColumn(COLUMN_TEXT, 'FileName', 'Název souboru', 300);

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function manufacturerEntityEditor() :EntityEditor {
        $editor = new EntityEditor('manufacturer', 'Výrobce', 'admin/manufacturer');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_PRODUCT_MANUFACTURER)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');

        $tab = $editor->addTab('Výrobce', 'manufacturer');
        $tab->setColumns(1);

        $group = $tab->addGroup('Výrobce');
        $form = $group->addForm();
        $form->setColumns(1);
        $form->addTextBox('Name', 'Název výrobce:', true);
        $form->addEditor('Description', 'Popis výrobce:');
        $form->addTextArea('MetaDescription', 'Meta description:');
        $form->addFileBox('File_ID', 'Soubor', [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload',
            'type' => File::TYPE_MANUFACTURER
        ]);

        return $editor;
    }

    /**
     * @return QuickEditor
     */
    public static function createManufacturerQEditor() :QuickEditor {
        $editor = new QuickEditor('', 'admin/manufacturer');
        $editor->addTextBox('Name', 'Název', true);

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function parameterGrid() :Grid {
        $grid = new GridVue('parameter', 'Parametry', 'admin/settings/edit-parameter');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/parameter');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_BOOL, 'ToFilter', 'Parametrické filtrování', 40);
        $grid->addColumn(COLUMN_TEXT, 'NameCZ', 'Název parameteru');
        $grid->addColumn(COLUMN_TEXT, 'Unit', 'Jednotka');
        $grid->addColumn(COLUMN_ENUM, 'FilterType', 'Typ filtru')->setEnumValues(Parameter::getFilterTypes());

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function parameterEntityEditor() :EntityEditor {
        $editor = new EntityEditor('parameter', 'Parametr', 'admin/parameter');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_PRODUCT_PARAMETER)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');

        $tab = $editor->addTab('Parametr', 'parameter');
        $tab->setColumns(2);

        $group = $tab->addGroup('parameter');
        $form = $group->addForm();
        $form->setColumns(2);

        foreach (Language::getActiveLanguages() as $language) {
            $form->addTextBox('Name' . $language->Code, 'Název parametru ' . $language->Code . ':', true);
        }

        $form->addTextBox('Unit', 'Jednotka:');
        $form->addCheckBox('ToFilter', 'Parametrické filtrování:');
        $form->addComboBoxEnum('FilterType', 'Typ filtru:', Parameter::getFilterTypes());

        return $editor;
    }

    /**
     * @param $parameterGrid
     * @return Grid
     */
    public static function parameterValueGrid($parameterGrid) :Grid {
        $grid = new GridVue('parameterValue', 'Hodnoty parametrů', 'admin/settings/edit-parameter-value');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/parameter-value');
        $grid->setParentGrid($parameterGrid, 'Parameter_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Value', 'Hodnota');
        $grid->addColumn(COLUMN_TEXT, 'Additional', 'Rozšíření');

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function parameterValueEntityEditor() :EntityEditor {
        $editor = new EntityEditor('parameterValue', 'Hodnota parametru', 'admin/parameter-value');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_PRODUCT_PARAMETER)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Value');

        $tab = $editor->addTab('Hodnota parametru', 'parameterValue');
        $tab->setColumns(2);

        $group = $tab->addGroup('parameterValue');
        $form = $group->addForm();
        $form->setColumns(2);
        $form->addTextBox('Value', 'Hodnota parametru:', true);
        $form->addTextBox('Additional', 'Rozšíření:');

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function pageGrid() :Grid {
        $grid = new GridVue('page', 'Podstránky', 'admin/settings/edit-page');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/page');
        $grid->enableSearch(['Name'], 'Zadejte hledaný výraz');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Name' . Languages::getLangCode(), 'Název', 400);
        $grid->addColumn(COLUMN_TEXT, 'slug' . Languages::getLangCode(), 'URL', 400);
        $previewPage = $grid->addAction('previewPage', 'Zobrazit stránku', '', [true, true, false]);
        $previewPage->setIcon('import');
        foreach ( Eshop::getEshops() as $eshop ) {
            $previewPage->addSubAction('previewPage' . $eshop->ID, 'Zobrazit stránku ' . $eshop->Name, "previewPage('" . $eshop->URL . "', '" . $eshop->language->Code . "');");
        }

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function pageEntityEditor() :EntityEditor {
        $editor = new EntityEditor('page', 'Podstránka', 'admin/page');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_DESIGN_PAGE)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');

        $tab = $editor->addTab('Podstránka', 'basic-info');
        $tab->setColumns(1);

        foreach (Language::getActiveLanguages() as $language) {
            $group = $tab->addGroup(strtoupper($language->Code));
            $form = $group->addForm();
            $form->addTextBox('Name' . $language->Code, 'Název ' . $language->Code . ':', true);
            $form->addTextBox('Title' . $language->Code, 'Titulek ' . $language->Code . ':');
            $form->addTextBox('MetaDescription' . $language->Code, 'Meta description ' . $language->Code . ':');
            $form->addTextBox('MetaKeywords' . $language->Code, 'Meta keywords ' . $language->Code . ':');
            $content = $form->addTextArea('Content' . $language->Code, 'Obsah podstránky ' . $language->Code . ':');
            $content->setElementAttribute('style', 'height: 3000px');
        }

        // množstevní slevy
        $tab = $editor->addTab('Nastavení eshopů');
        $group = $tab->addGroup('Nastavení eshopů');

        $grid = $group->addGridVue('pageEshop', 'Nastavení eshopů');
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/page-eshop');
        $grid->addEditor('admin/settings/edit-page-eshop');
        $grid->setParentEntity('Page_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', 'Eshop', 300)->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'eshop'));
        $grid->addColumn(COLUMN_CHECKBOX, 'Active', 'Aktivní');

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function bannerGrid() :Grid {
        $grid = new GridVue ('banner', 'Banner', 'admin/settings/edit-banner');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/banner');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', 'Eshop')->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'eshop'));
        $grid->addColumn(COLUMN_CHECKBOX, 'Active', 'Aktivní', 40);
        $grid->addColumn(COLUMN_TEXT, 'Rank', 'Pořadí', 40);
        $grid->addColumn(COLUMN_TEXT, 'Headline', 'Název banneru', 170);
        $grid->addColumn(COLUMN_TEXT, 'Subline', 'Podtext', 200);
        $grid->addColumn(COLUMN_TEXT, 'Url', 'URL', 170);

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function bannerEntityEditor() :EntityEditor {
        $editor = new EntityEditor('banner', 'Banner', 'admin/banner');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_DESIGN_BANNER)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Headline');

        $tab = $editor->addTab('Banner', 'banner');
        $tab->setColumns(2);
        $group = $tab->addGroup('Banner');
        $form = $group->addForm();
        $form->setColumns(2);
        $form->addComboBoxStore('Eshop_ID', 'Eshop:', array('module' => 'common', 'controller' => 'eshop'), 'Name');
        $form->addNumericBox('Rank', 'Pořadí:');
        $form->addComboBoxEnum('Template', 'Šablona:', array('classic' => 'Klasická', 'two-columns' => 'Dva sloupce'), true);
        $form->addTextBox('Headline', 'Název baneru:', true);
        $form->setColumns(1);
        $form->addTextArea('Subline', 'Podtext:');
        $form->setColumns(2);
        $form->addTextBox('Url', 'URL:');
        $form->addTextBox('LinkBtnText', 'Text tlačítka:');

        $form = $group->addForm();

        $form->addFileBox('File_ID', 'Soubor', [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload',
            'type' => File::TYPE_BANNER
        ]);

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function menuGrid() :Grid {
        $grid = new GridVue('menu', 'Menu');
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/menu');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Název');
        $grid->addColumn(COLUMN_TEXT, 'Type', 'Typ');

        return $grid;
    }

    /**
     * @param $menuGrid
     * @return Grid
     */
    public static function menuItemGrid($menuGrid) :Grid {
        $grid = new GridVue('munuItem', 'Položky menu', 'admin/settings/edit-menu-item');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/menu-item');
        $grid->setParentGrid($menuGrid, 'Menu_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_CHECKBOX, 'Active', 'Aktivní', 50);
        $grid->addColumn(COLUMN_CHECKBOX, 'InNewWindow', 'Otevřít v novém okně', 50);
        $grid->addColumn(COLUMN_TEXT, 'Rank', 'Pozice')->setEditable(true);
        $grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', 'Eshop')->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'eshop'));
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Název', 150);
        $grid->addColumn(COLUMN_TEXT, 'Url', 'Url', 150);

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function menuItemEntityEditor() :EntityEditor {
        $editor = new EntityEditor('menu', 'Menu', 'admin/menu-item');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_DESIGN_MENU)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');

        $tab = $editor->addTab('Menu', 'basic-info');
        $tab->setColumns(2);

        $group = $tab->addGroup('Menu');
        $form = $group->addForm();
        $form->addComboBoxStore('Eshop_ID', 'Eshop:', array('module' => 'common', 'controller' => 'eshop'), 'Name');
        $form->addBoolRadioButton('Active', 'Aktivní:')->setValue(true);
        $form->addBoolRadioButton('InNewWindow', 'Otevřít v novém okně:');
        $form->addTextBox('Name', 'Název:', true);
        $form->addTextBox('Url', 'URL:', true);

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function popupGrid() :Grid {
        $grid = new GridVue('popup', 'Popup', 'admin/settings/edit-popup');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/popup');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_CHECKBOX, 'Active', 'Aktivní', 40);
        $grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', 'Eshop')->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'eshop'));
        $grid->addColumn(COLUMN_TEXT, 'Header', 'Hlavička', 220);

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function popupEntityEditor() :EntityEditor {
        $editor = new EntityEditor('popup', 'Popup', 'admin/popup');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_DESIGN_POPUP)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Headline');

        $tab = $editor->addTab('Popup', 'popup');
        $group = $tab->addGroup('Popup');
        $form = $group->addForm();
        $form->addComboBoxStore('Eshop_ID', 'Eshop:', array('module' => 'common', 'controller' => 'eshop'), 'Name');
        $form->addTextBox('Header', 'Hlavička:');
        $form->addEditor('Content', 'Obsah:');

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function orderStateTypeGrid() :Grid {
        $grid = new GridVue('orderState', 'Stav objednávky', 'admin/settings/edit-order-state-type');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/order-state-type');
        $grid->enableSearch(['Name'], 'Zadejte hledaný výraz');
        $grid->setRowFormatter('rowFormatter');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_CHECKBOX, 'SendEmail', 'Odesílat email');
        $grid->addColumn(COLUMN_TEXT, 'Name' . Languages::getLangCode(), translate('Název stavu'));
        $grid->addColumn(COLUMN_TEXT, 'EmailHeader' . Languages::getLangCode(), translate('Hlavička emailu'), 380);

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function orderStateTypeEntityEditor() :EntityEditor {
        $editor = new EntityEditor('orderStateType', 'Stav objednávky', 'admin/order-state-type');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_ORDER_STATE_TYPE)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name' . Languages::getLangCode());

        $tab = $editor->addTab('Stav objednávky', 'basic-info');
        $tab->setColumns(2);

        $group = $tab->addGroup('Definice stavů objednávky');
        $group->setColumnSize(12);
        $form = $group->addForm();
        $form->setColumns(4);
        $form->addBoolRadioButton('SendEmail', 'Odesílat email?');
        $color = $form->addTextBox('Color', 'Barva');
        $color->setValue('#0277ef');
        $color->getControlPart()
            ->setAttribute('type','color')
            ->setAttribute('style', 'padding: 0!important');

        foreach (Languages::getInstance()->getActiveLanguages() as $lang) {
            $group = $tab->addGroup($lang['Name']);
            $form = $group->addForm();
            $form->addTextBox('Name' . $lang['Code'], 'Název stavu', true);
            $form->addTextBox('EmailHeader' . $lang['Code'], 'Hlavička emailu', true);
            $form->addEditor('EmailContent' . $lang['Code'], 'Obsah emailu');
        }

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function paymentGrid() :Grid {
        $grid = new GridVue('payment', 'Platby', 'admin/settings/edit-payment');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/payment');
        $grid->enableSearch(['Name'], 'Zadejte hledaný výraz');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_CHECKBOX, 'Active', 'Aktivní', 40);
        $grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', 'Eshop')->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'eshop'));
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Název', 100);
        //$grid->addColumn(COLUMN_TEXT, 'Description', 'Poznámka');
        $grid->addColumn(COLUMN_TEXT, 'Price', 'Cena', 50);
        $grid->addColumn(COLUMN_ENTITY, 'Vat_ID', 'Daň', 100)->setEntity('ID', 'Name', array('module' => 'admin', 'controller' => 'vat'));
        $grid->addColumn(COLUMN_ENUM, 'VatType', 'Daň u ceny', 140)->setEnumValues(Price::getVatTypes());
        $grid->addColumn(COLUMN_TEXT, 'BankAccount', 'Bankovní účet');
        $grid->addColumn(COLUMN_TEXT, 'IBAN', 'IBAN');
        $grid->addColumn(COLUMN_ENUM, 'Type', 'Typ', 50)->setEnumValues(Payment::getTypes());
        $grid->addColumn(COLUMN_TEXT, 'PohodaCode', 'Pohoda ID');

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function paymentEntityEditor() :EntityEditor {
        $editor = new EntityEditor('payment', 'Platba', 'admin/payment');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_SP_PAYMENT)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');

        $tab = $editor->addTab('Platba', 'basic-info');
        $tab->setColumns(2);

        $group = $tab->addGroup('Platba');
        $form = $group->addForm();
        $form->setColumns(1);
        $form->addComboBoxStore('Eshop_ID', 'Eshop:', array('module' => 'common', 'controller' => 'eshop'), 'Name');
        $form->addTextBox('Name', 'Název:', true);
        $form->setColumns(2);
        $form->addFloatingPointBox('Price', 'Cena:');
        $form->addComboBoxStore('Vat_ID', 'Daň:', array('module' => 'admin', 'controller' => 'vat'), 'Value', true);
        $form->addComboBoxEnum('VatType', 'Daň u ceny', Price::getVatTypes());
        $form->addComboBoxEnum('Type', 'Typ', Payment::getTypes());
        $form->addTextBox('BankAccount', 'Bankovní účet:');
        $form->addTextBox('IBAN', 'IBAN:');
        $form->addTextArea('Description', 'Poznámka:');
        $form->addTextBox('PohodaCode', 'Pohoda kód:');
        $form->addFileBox('File_ID', 'Soubor', [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload',
            'type' => File::TYPE_LOGO
        ]);

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function shippingGrid() :Grid {
        $grid = new GridVue('shipping', 'Dopravci', 'admin/settings/edit-shipping');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/shipping');
        $grid->enableSearch(['Name'], 'Zadejte hledaný výraz');
        $grid->addColumn(COLUMN_CHECKBOX, 'Active', 'Aktivní', 40);
        $grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', 'Eshop')->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'eshop'));
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Název', 100);
        //$grid->addColumn(COLUMN_TEXT, 'Description', 'Poznámka');
        $grid->addColumn(COLUMN_TEXT, 'Price', 'Cena', 50);
        $grid->addColumn(COLUMN_ENTITY, 'Vat_ID', 'Daň', 100)->setEntity('ID', 'Name', array('module' => 'admin', 'controller' => 'vat'));
        $grid->addColumn(COLUMN_ENUM, 'VatType', 'Daň u ceny', 140)->setEnumValues(Price::getVatTypes());
        $grid->addColumn(COLUMN_TEXT, 'FreeShipping', 'Doprava zdarma od');
        $grid->addColumn(COLUMN_TEXT, 'PohodaCode', 'Pohoda ID');

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function shippingEntityEditor() :EntityEditor {
        $editor = new EntityEditor('shipping', 'Dopravci', 'admin/shipping');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_SP_SHIPPING)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');

        $tab = $editor->addTab('Dopravci', 'basic-info');
        $tab->setColumns(2);

        $group = $tab->addGroup('Dopravci');
        $form = $group->addForm();
        $form->addComboBoxStore('Eshop_ID', 'Eshop:', array('module' => 'common', 'controller' => 'eshop'), 'Name');
        $form->addTextBox('Name', 'Název:', true);
        $form->setColumns(2);
        $form->addFloatingPointBox('Price', 'Cena:');
        $form->addComboBoxStore('Vat_ID', 'Daň:', array('module' => 'admin', 'controller' => 'vat'), 'Value', true);
        $form->addComboBoxEnum('VatType', 'Daň u ceny', Price::getVatTypes());
        $form->addFloatingPointBox('FreeShipping', 'Doprava zdarma od:');
        $form->addTextArea('Description', 'Poznámka:');
//        $form->addTextBox('PohodaCode', 'Pohoda kód:');
        $form->addFileBox('File_ID', 'Soubor', [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload',
            'type' => File::TYPE_LOGO
        ]);

        $tab = $editor->addTab('Použitelné platby');
        $group = $tab->addGroup('Použitelné platby');
        $group->addRelationSwitcher('Použitelné platby', 'admin/payment', 'admin/shipping-payment', 'Shipping_ID', 'Payment_ID', 'Name');

        return $editor;
    }

    /**
     * @param $shippingGrid
     * @return Grid
     */
    public static function shippingCategoryGrid($shippingGrid) :Grid {
        $grid = new GridVue('shippingCategory', 'Kategorie', 'admin/settings/edit-shipping-category');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/shipping-category');
        $grid->setParentGrid($shippingGrid, 'Shipping_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ENTITY, 'Category_ID', 'Kategorie', 300)->setEntity('ID', 'FullName', array('module' => 'admin', 'controller' => 'category'));
        $grid->addColumn(COLUMN_TEXT, 'Price', 'Cena', 50);
        $grid->addColumn(COLUMN_ENTITY, 'Vat_ID', 'Daň', 100)->setEntity('ID', 'Name', array('module' => 'admin', 'controller' => 'vat'));
        $grid->addColumn(COLUMN_ENUM, 'VatType', 'Daň u ceny', 140)->setEnumValues(Price::getVatTypes());
        $grid->addColumn(COLUMN_CHECKBOX, 'PricePerPiece', 'Cena za kus', 50);
        $grid->addColumn(COLUMN_CHECKBOX, 'PriceAlways', 'Cena vždy', 50);

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function shippingCategoryEntityEditor() :EntityEditor {
        $editor = new EntityEditor('shippingCategory', 'Dopravci', 'admin/shipping-category');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_SP_SHIPPING)->getUrl());
        $editor->enableStandalone();

        $tab = $editor->addTab('Kategorie u dopravců', 'basic-info');
        $tab->setColumns(2);

        $group = $tab->addGroup('Kategorie u dopravců');
        $form = $group->addForm();
        $form->addComboBoxStore('Category_ID', 'Kategorie:', array('module' => 'admin', 'controller' => 'category'), 'FullName');
        $form->addFloatingPointBox('Price', 'Cena:');
        $form->setColumns(2);
        $form->addComboBoxStore('Vat_ID', 'Daň:', array('module' => 'admin', 'controller' => 'vat'), 'Value', true);
        $form->addComboBoxEnum('VatType', 'Daň u ceny:', Price::getVatTypes());
        $form->addBoolRadioButton('PricePerPiece', 'Cena za kus:');
        $form->addBoolRadioButton('PriceAlways', 'Cena vždy:');

        $form->addFileBox('File_ID', 'Soubor', [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload',
            'type' => File::TYPE_LOGO
        ]);

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function createPermissionGrid() :Grid {
        $grid = new GridVue('permissions', 'Přístupová práva');
        $grid->setQuickeditAction('admin/settings/edit-permission');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('user/permission');

        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Název');
        $grid->addColumn(COLUMN_TEXT, 'Code', 'Kód');

        return $grid;
    }

    /**
     * @return QuickEditor
     */
    public static function createPermissionQEditor() :QuickEditor {
        $editor = new QuickEditor('', 'user/permission');
        $editor->setColumns(2);

        $editor->addTextBox('Name', 'Název', true);
        $editor->addTextBox('Code', 'Kód', true);

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function createAnnouncementGrid(): Grid {
        $grid = new GridVue('announcement', translate('Oznámení na webu'));
        $grid->setQuickeditAction('admin/settings/edit-announcement');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/announcement');
        $grid->enableSearch(['Hash', 'Type', 'Content'], translate('Vyhledat oznámení dle Hashe/Typu/Obsahu'));

        $switchesForm = $grid->getSwitchesForm();
        $switchesForm->addComboBoxStore('Eshop_ID', translate('Obchod'), ['module' => 'common', 'controller' => 'eshop', 'none-option' => true], 'Name', true)->setValue('-1');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Hash', 'Hash');
        $grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', translate('Obchod'))->setEntity('ID', 'Name', ['module' => 'common', 'controller' => 'eshop']);
        $grid->addColumn(COLUMN_BOOL | COLUMN_CHECKBOX, 'Active', translate('Aktivní'));
//        $grid->addColumn(COLUMN_BOOL | COLUMN_CHECKBOX, 'InEmail', translate('Odesílat v emailu'));
        $grid->addColumn(COLUMN_DATE, 'DateFrom', translate('Zobrazit od'));
        $grid->addColumn(COLUMN_DATE, 'DateTo', translate('Zobrazit do'));
        $grid->addColumn(COLUMN_ENUM, 'Type', translate('Typ'), 100)->setEnumValues(Announcement::getTypes());
        $grid->addColumn(COLUMN_LONGTEXT, 'Content', translate('Obsah'), 400);

        return $grid;
    }

    /**
     * @param bool $isEditing
     * @return QuickEditor
     */
    public static function createAnnouncementQEditor(bool $isEditing = false): QuickEditor {
        $editor = new QuickEditor('Oznámení na webu', 'admin/announcement');

        $editor->setColumns(2);
        $editor->addComboBoxStore('Eshop_ID', translate('Obchod'), ['module' => 'common', 'controller' => 'eshop'])
            ->setValue(\common\logic\Eshop\Eshop::getInstance()->getEshopID());
        $editor->addComboBoxEnum('Type', translate('Typ'), Announcement::getTypes(), true)->setValue(Announcement::TYPE_INFO);
        if ($isEditing) {
            $editor->setColumns(3);
            $renew = $editor->addBoolRadioButton('renew', translate('Obnovit'));
            $renew->setValue(false);
            $renew->setHelp(translate('Obnoví hash') . '<hr>' . translate('Všichni uvidí upozornění znovu'));
        } else {
            $editor->setColumns(2);
        }
        $editor->addBoolRadioButton('Active', translate('Aktivní'))->setValue(true);
//        $editor->addBoolRadioButton('InEmail', translate('Odesílat v emailu'))->setValue(false);
        $editor->addDateBox('DateFrom', translate('Zobrazit od'), false)->setValue(date('Y-m-d'));
        $editor->addDateBox('DateTo', translate('Zobrazit do'), false)->setValue(date('Y-m-d', strtotime('+1 week')));

        $editor->setColumns(1);
        $editor->addTextArea('Content', translate('Obsah'), true);

        return $editor;
    }

    public static function productOnHomepageGrid(): Grid {
        $grid = new GridVue('productOnHomepage', 'Produkty na HP', 'admin/settings/edit-product-on-homepage');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/product-on-homepage');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ENTITY, 'Product_ID', 'Produkt', 250)->setEntity('ID', 'NameCZ', array('module' => 'admin', 'controller' => 'product'));
        $grid->addColumn(COLUMN_TEXT, 'Rank', 'Pozice', 380)->setEditable(true);

        return $grid;
    }

    public static function productOnHomepageEntityEditor(): EntityEditor {
        $editor = new EntityEditor('productOnHomepage', 'Produkty na HP', 'admin/product-on-homepage');
        $editor->enableStandalone();

        $tab = $editor->addTab('Produkty na HP', 'productOnHomepageEditor');
        $group = $tab->addGroup('Produkty na HP');
        $form = $group->addForm();
        $form->addComboBoxStore('Product_ID', 'Produkt', ['module'=>'admin', 'controller'=>'product-simple']);

        return $editor;
    }


    public static function pplPackageNrGrid() {
        $grid = new GridVue('pplPackageNrGrid', 'Nastavení číselných řad pro PPL', 'admin/settings/edit-ppl-package-nr-settings');
        $grid->setEnabledActions(false, true, false);
        $grid->setUrl('admin/p-p-l-package-nr-settings');
        $grid->enableSearch(['Name'], 'Zadejte hledaný výraz');
        $grid->setRowFormatter('rowFormatter');

        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ID, 'ProductType_ID', translate('PPL Type ID'));
        $grid->addColumn(COLUMN_TEXT, 'ProductTypeName', translate('Název produktu'), 380);
        $grid->addColumn(COLUMN_NUMBER, 'PackageNumberSeriesFrom', translate('Číselná řada od'), 380);
        $grid->addColumn(COLUMN_NUMBER, 'PackageNumberSeriesTo', 'Číselná řada do');
        $grid->addColumn(COLUMN_NUMBER, 'LastPackageNumber', 'Poslední použité číslo');
        $grid->addColumn(COLUMN_CUSTOM, 'RemainingNrs', 'Zbývající čísla v řadě');

        return $grid;
    }


    /**
     * @return EntityEditor
     */
    public static function pplPackageNrEntityEditor() :EntityEditor {
        $editor = new EntityEditor('pplPackageNr', 'Číselné řady', 'admin/p-p-l-package-nr-settings');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_PPL_SHIPPING)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');

        $tab = $editor->addTab('Číselné řady', 'pplPackageNr');
        $tab->setColumns(1);

        $group = $tab->addGroup('Číselné řady');
        $form = $group->addForm();
        $form->setColumns(2);
        $form->addTextBox('ProductType_ID', 'PPL Type ID', true)->setReadOnly(true);
        $form->addTextBox('ProductTypeName', 'Název produktu', true)->setReadOnly(true);
        $form->addNumericBox('PackageNumberSeriesFrom', 'Číselná řada od', true);
        $form->addNumericBox('PackageNumberSeriesTo', 'Číselná řada do', true);

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function blockGrid(): Grid {
        $grid = new GridVue('block', 'HTML blok', 'admin/settings/edit-block');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/block');
        $grid->enableSearch(['Name', 'Code'], 'Zadejte hledaný výraz');

        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Název', 300);
        $grid->addColumn(COLUMN_TEXT, 'Code', 'Kód', 300);
        $grid->addColumn(COLUMN_TEXT, 'CountPage', 'Počet stránek');

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function blockEntityEditor() :EntityEditor {
        $editor = new EntityEditor('block', 'HTML blok', 'admin/block');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::SETTINGS_DESIGN_BLOCK)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');

        $tab = $editor->addTab('HTML blok', 'basic-info');
        $tab->setColumns(1);
        $group = $tab->addGroup('Základní nastavení');

        $form = $group->addForm();
        $form->addTextBox('Name', 'Název:', true);
        $form->addTextBox('Code', 'Kód:', true);
        $form->addTextArea('Content', 'Obsah bloku:');

        return $editor;
    }
}