<?php
namespace admin\components;

use admin\logic\Navigation;
use common\logic\Languages;
use Common_Model_Eshop as Eshop;
use Common_Model_File as File;
use Common_Model_Language as Language;
use Jolanda\Controls\Editor\EntityEditor;
use Jolanda\Controls\Grid\Grid;
use Jolanda\Controls\Grid\GridVue;
use Jolanda\Controls\Grid\QuickEditor;
use Jolanda\Menu\Menu;

/**
 * Class ProductComponents
 * @package admin\components
 */
class ProductComponents {

    /**
     * @return Grid
     */
    public static function productGrid(bool $activeProduct) :Grid {
        $activeLabel = $activeProduct?'aktivních':'neaktivních';
        $grid = new GridVue('product' . $activeProduct, 'Seznam '.$activeLabel.' produktů', 'admin/product/edit-product');
        $grid->enableSearch([ 'productLangs' . Languages::getLangCode() . '.Name', 'Code'], 'Zadejte hledaný výraz');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/product', ['Active' => $activeProduct]);
        $grid->setEditorCache(false);
        //$grid->setSelect(Grid::SELECT_MULTI_CHECKBOX);
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Code', 'Kód', 55)->setHelp('Univerzální kód produktu');
        $grid->addColumn(COLUMN_ENTITY, 'Manufacturer_ID', 'Výrobce')->setEntity('ID', 'Name', array('module' => 'admin', 'controller' => 'manufacturer'));
        //$grid->addColumn(COLUMN_TEXT, 'CategoryName', 'Kategorie', 200);
        $grid->addColumn(COLUMN_TEXT, 'Name' . Languages::getLangCode(), 'Název', 250)->setEditable(true);
        $grid->addColumn(COLUMN_BOOL, '_Active', 'Aktivní', 50);
        $grid->addColumn(COLUMN_TEXT, '_Price', 'Cena', 50);
        $grid->addColumn(COLUMN_TEXT, 'OnStock', 'Skladem', 40);
//        $grid->addColumn(COLUMN_TEXT, 'PohodaStock', 'POHODa sklad', 60);
        $grid->addColumn(COLUMN_CHECKBOX, 'FlagNews', 'Novinka', 40);
        $grid->addColumn(COLUMN_CHECKBOX, 'FlagClearanceSale', 'Doprodej', 40);
        $grid->addColumn(COLUMN_CUSTOM, 'URL', 'Odkaz na produkt', 200);
        $grid->addColumn(COLUMN_CUSTOM, 'Preview', 'Zobrazit produkt');

        //$grid->addColumn(COLUMN_DATE, 'CreatedDate', 'Datum vytvoření', 60);
        $previewProduct = $grid->addAction('previewProduct', 'Zobrazit produkt', '', [true, true, false]);
        $previewProduct->setIcon('import');

        foreach ( Eshop::getEshops() as $eshop ) {
            $previewProduct->addSubAction('previewProduct' . $eshop->ID, 'Zobrazit produkt ' . $eshop->Name, "previewProduct('" . $eshop->URL . "', '" . $eshop->language->Code . "');");
        }

        $grid->setOrder('Code');
        $grid->addAction('copyProduct', 'Kopírovat produkt', "copyProduct();");

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function productEntityEditor(): EntityEditor {
        $editor = new EntityEditor('product', 'Produkt', 'admin/product');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::PRODUCT_LIST)->getUrl());
        $editor->setEntityNameColumn('NameCZ');

        $tab = $editor->addTab('Základní informace', 'basic-info');
        $tab->setColumns(2);

        foreach (Language::getActiveLanguages() as $language) {
            $group = $tab->addGroup(strtoupper($language->Code));
            $form = $group->addForm();
            $form->addTextBox('Name' . $language->Code, 'Název:', true);
            $form->addTextBox('Perex' . $language->Code, 'Perex:', true);
            $form->addTextBox('Title' . $language->Code, 'Titulek:');
            $form->addTextBox('MetaDescription' . $language->Code, 'Meta description:');
            $form->addTextArea('ShortDescription' . $language->Code, 'Krátký popis:');
            $form->addEditor('Description' . $language->Code, 'Popis:');
            $form->addTextBox('CustomAvailabilityInfo' . $language->Code, 'Vlastní info ke skladové dostupnosti:');
        }

        $group = $tab->addGroup('Další informace');
        $form = $group->addForm();
        $form->setColumns(2);
        $form->addBoolRadioButton('FlagNews', 'Příznak novinka:');
        $form->addBoolRadioButton('FlagClearanceSale', 'Příznak doprodej:');
        $form->addTextBox('Code', 'Kód produktu:');
        $form->addTextBox('EAN', 'EAN:');
        $form->addComboBoxStore('Manufacturer_ID', 'Výrobce:', array('module' => 'admin', 'controller' => 'manufacturer'), 'Name')->enableDynamicAddingOptions('/admin/settings/manufacturer-q-editor');
        $form->addEmpty();
        $form->addNumericBox('OnStock', 'Skladem:');
        $form->addNumericBox('OnExternalStock', 'Skladem u dodavatele:');

        foreach (Language::getActiveLanguages() as $language) {
            $form->addTextBox('CustomAvailabilityInfo' . $language->Code, 'Vlastní info ke skladové dostupnosti (když není skladem):');
        }

        // množstevní slevy
        $tab = $editor->addTab('Nastavení eshopů');
        $group = $tab->addGroup('Nastavení eshopů');
        $grid = $group->addGridVue('productEshop', 'Nastavení eshopů');
        $grid->setEnabledActions(false, true, false);
        $grid->setUrl('admin/product-eshop');
        $grid->addEditor('admin/product/edit-product-eshop');
        $grid->setParentEntity('Product_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', 'Eshop', 300)->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'eshop'));
        $grid->addColumn(COLUMN_CHECKBOX, 'Active', 'Aktivní');
        $grid->addColumn(COLUMN_TEXT, 'Price', 'Cena bez DPH', 50);
        $grid->addColumn(COLUMN_TEXT, 'ProductPriceTypeCode', 'Typ ceny', 50);
        $grid->addColumn(COLUMN_ENTITY, 'Vat_ID', 'Daň')->setEntity('ID', 'Name', array('module' => 'admin', 'controller' => 'vat'));
        $grid->addColumn(COLUMN_TEXT, 'Discount', 'Sleva (%)', 50);


        // kategorie produktu
        $tab = $editor->addTab('Kategorie produktu');
        $group = $tab->addGroup('Kategorie');
        $group->addCategoryTree('category_tree', 'Strom kategorií', ['module'=>'admin', 'controller' => 'category'], 'NameCZ', 'admin/product-in-category', 'Product_ID', 'Category_ID', 'Category_ID');

        // parametry produktu
        $tab = $editor->addTab('Parametry');
        $group = $tab->addGroup('Parametry');
        $grid = $group->addGridVue('productParameters', 'Parametry produktu');
        $grid->setUrl('admin/product-parameter');
        $grid->addEditor('admin/product/edit-product-parameter');
        $grid->setParentEntity('Product_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ENTITY, 'Parameter_ID', 'Parametr')->setEntity('ID', 'NameCZ', array('module' => 'admin', 'controller' => 'parameter'));
        $grid->addColumn(COLUMN_ENTITY, 'ParameterValue_ID', 'Hodnota')->setEntity('ID', 'Value', array('module' => 'admin', 'controller' => 'parameter-value'));

        // fotografie produktu
        $tab = $editor->addTab('Fotografie');
        $tab->setColumns(1);
        $group = $tab->addGroup('Nahrávání fotografie');
//        $form = $group->addForm();
//        $empty = $form->addEmpty();
//        $empty->setHtml('<div style="position: relative; left: 15px; top: 10px; margin-bottom: 10px; "><img id="image-preview" src="" style="max-width: 90%"></div>');
//        $empty->setHtml('<div style="position: relative; left: 15px; top: 10px; margin-bottom: 10px; "><img id="image-preview" src="" style="max-width: 90%" alt="image preview"></div>');
        $group->addHtml('<div class="dropzoneUploader"  data-grid="productPhotos" data-accepted = "*" data-type="'.File::TYPE_PRODUCT_PHOTO.'"></div>');
        $group = $tab->addGroup('Fotografie');
        $grid = $group->addGridVue('productPhotos', 'Fotografie produktu');
        $grid->setEnabledActions(false, true, true);
        $grid->setUrl('admin/product-image');
        $grid->addEditor('admin/product/edit-product-image');
        $grid->setParentEntity('Product_ID');
        $grid->setReorderColumn('Rank');
        $grid->setOrder('Rank');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_NUMBER, 'Rank', 'Poř.')->setEditable(true);
        $grid->addColumn(COLUMN_CUSTOM, 'PhotoPreview', 'Náhled', 250);
        $grid->addColumn(COLUMN_TEXT, 'FileName', 'Název souboru', 250);
        $grid->addColumn(COLUMN_CHECKBOX, 'Main', 'Hlavní');
        $grid->addColumn(COLUMN_TEXT, 'Description', 'Popis')->setEditable(true);


        // fotografie produktu
        $tab = $editor->addTab('Dokumenty');
        $group = $tab->addGroup('Dokumenty');
        $grid = $group->addGridVue('productDocumments', 'Dokumenty produktu');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/product-documment');
        $grid->addEditor('admin/product/edit-product-documment');
        $grid->setParentEntity('Product_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'FileName', 'Název souboru', 250);
        $grid->addColumn(COLUMN_TEXT, 'Description', 'Popis')->setEditable(true);
        $grid->addAction('previewDocumment', 'Stáhnout', 'previewDocumment();')->setIcon('import');

        // parametry produktu
        $tab = $editor->addTab('Podobné produkty');
        $group = $tab->addGroup('Podobné produkty');
        $grid = $group->addGridVue('productSimiliars', 'Podobné produkty');
        $grid->setUrl('admin/product-similiar');
        $grid->addEditor('admin/product/edit-product-similiar');
        $grid->setParentEntity('Product_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'ProductSimiliarName', 'Název podobného produktu', 400);

        return $editor;
    }

    /**
     * @return QuickEditor
     */
    public static function productEshopEditor() :QuickEditor {
        $editor = new QuickEditor('Eshop produktu', 'admin/product-eshop');
        $editor->addComboBoxStore('Eshop_ID', 'Eshop:', array('module' => 'common', 'controller' => 'eshop'), 'Name', true);
        $editor->addBoolRadioButton('Active', 'V prodeji:');
        $editor->addBoolRadioButton('Homepage', 'Homepage:');
        $editor->addFloatingPointBox('Price', 'Cena bez DPH', true);
        $editor->addNumericBox('PriceVat', 'Cena s DPH:')->setReadOnly(true);
        $editor->addComboBoxStore('Vat_ID', 'Daň:', array('module' => 'admin', 'controller' => 'vat'), 'Value', true);
        $editor->addFloatingPointBox('Discount', 'Sleva (%):');
        return $editor;
    }

    /**
     * @return QuickEditor
     */
    public static function productStockEditor(): QuickEditor {
        $editor = new QuickEditor('Produktové sklady', 'admin/product-stock');
        $editor->addComboBoxStore('Stock_ID', 'Sklad:', array('module' => 'admin', 'controller' => 'stock'), 'Name', true);
        $editor->addNumericBox('Code', 'Kód', true);
        $editor->addNumericBox('Quantity', 'Množství', true);
        $editor->addTextBox('Note', 'Poznámka');

        return $editor;
    }

    /**
     * @return QuickEditor
     */
    public static function productDescriptionAccordionEditor() :QuickEditor {
        $editor = new QuickEditor('Rozbalovací popis', 'admin/product-description-accordion');
//        $editor->addComboBoxStore('Language_ID', 'Daň:', array('module' => 'common', 'controller' => 'language'), 'Name', true);
        $editor->addTextBox('Headline', 'Nadpis:');
        $editor->addEditor('Content', 'Obsah:');

        return $editor;
    }

    /**
     * @return QuickEditor
     */
    public static function productParameterEditor() :QuickEditor {
        $editor = new QuickEditor('Parametr produktu', 'admin/product-parameter');
        $editor->addComboBoxStore('Parameter_ID', 'Parametr:', array('module' => 'admin', 'controller' => 'parameter'), 'NameCZ', true);
        $editor->addAjaxComboBoxStore('ParameterValue_ID', 'Hodnota parametru:', array('module' => 'admin', 'controller' => 'parameter-value'), 'Value', 'Parameter_ID', true);

        return $editor;
    }

    /**
     * @return QuickEditor
     */
    public static function productImageEditor() :QuickEditor {
        $editor = new QuickEditor('Fotografie produktu', 'admin/product-image');
        $editor->addFileBox('File_ID', 'Soubor', [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload',
            'type' => File::TYPE_PRODUCT_PHOTO
        ]);
        $editor->addTextArea('Description', 'Popis:');

        return $editor;
    }

    /**
     * @return QuickEditor
     */
    public static function productDocummentEditor() :QuickEditor {
        $editor = new QuickEditor('Dokument produktu', 'admin/product-documment');
        $editor->addFileBox('File_ID', 'Soubor', [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload',
            'type' => File::TYPE_PRODUCT_DOCUMMENT
        ]);
        $editor->addTextArea('Description', 'Popis:');

        return $editor;
    }

    /**
     * @return QuickEditor
     */
    public static function productSimiliarEditor() :QuickEditor {
        $editor = new QuickEditor('Podobné produkty', 'admin/product-similiar');
        $editor->addComboBoxStore('ProductSimiliar_ID', 'Název podobného produktu:', array('module' => 'admin', 'controller' => 'product'), 'FullName', true);

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function categoryGrid() :Grid {
        $grid = new GridVue('category', 'Seznam kategorií', 'admin/product/edit-category');
        $grid->enableSearch(['Name'], 'Zadejte hledaný výraz');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/category');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'NameCZ', 'Název', 300);
        $grid->addColumn(COLUMN_ENTITY, 'Category_ID', 'Nadkategorie', 300)->setEntity('ID', 'NameCZ', array('module' => 'admin', 'controller' => 'category'));
//        $grid->addColumn(COLUMN_TEXT, 'FileName', 'Název souboru', 300);
        $grid->addColumn(COLUMN_CUSTOM, 'URL', 'Odkaz na kategorii', 400);

        $previewCategory = $grid->addAction('previewCategory', 'Zobrazit kategorii', '', [true, true, false]);
        $previewCategory->setIcon('import');
        foreach ( Eshop::getEshops() as $eshop ) {
            $previewCategory->addSubAction('previewCategory' . $eshop->ID, 'Zobrazit kategorii ' . $eshop->Name, "previewCategory('" . $eshop->URL . "', '" . $eshop->language->Code . "');");
        }

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function categoryEntityEditor(): EntityEditor {
        $editor = new EntityEditor('category', 'Kategorie', 'admin/category');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::PRODUCT_CATEGORY)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');
        $tab = $editor->addTab('Základní informace', 'basic-info');
        $tab->setColumns(1);

        foreach (Language::getActiveLanguages() as $language) {
            $group = $tab->addGroup(strtoupper($language->Code));
            $form = $group->addForm();
            $form->addTextBox('Name' . $language->Code, 'Název:', true);
            $form->addTextBox('H1Name' . $language->Code, 'H1 název:', true);
            $form->addTextBox('slug' . $language->Code, 'Název v URL:')->setHelp('Místo mezer použít -. Žádné háčky, čárky apod. Pokud necháte prázdné, vytvoří se dle názvu');
            $form->addTextArea('ShortDescription' . $language->Code, 'Krátký popis:');
            $form->addEditor('Description' . $language->Code, 'Popis:');
            $form->addTextBox('Title' . $language->Code, 'Meta title:', true);
            $form->addTextBox('MetaDescription' . $language->Code, 'Meta description:', true);
        }

        $group = $tab->addGroup('Základní informace');
        $form = $group->addForm();
        $form->addComboBoxStore('Category_ID', 'Nadkategorie:', array('module' => 'admin', 'controller' => 'category'), 'NameCZ');

        $form->addFileBox('File_ID', 'Soubor', [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload',
            'type' => File::TYPE_CATEGORY_PHOTO
        ]);

        // nastavení eshopů
        $tab = $editor->addTab('Nastavení eshopů');
        $group = $tab->addGroup('Nastavení eshopů');

        $grid = $group->addGridVue('categoryEshop', 'Nastavení eshopů');
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/category-eshop');
        $grid->addEditor('admin/product/edit-category-eshop');
        $grid->setParentEntity('Category_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', 'Eshop', 300)->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'eshop'));
        $grid->addColumn(COLUMN_CHECKBOX, 'Active', 'Aktivní');

        return $editor;
    }
}