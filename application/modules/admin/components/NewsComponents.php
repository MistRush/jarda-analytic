<?php
namespace admin\components;

use admin\logic\Navigation;
use Common_Model_Eshop as Eshop;
use Common_Model_File as File;
use Common_Model_Language as Language;
use Jolanda\Controls\Editor\EntityEditor;
use Jolanda\Controls\Grid\Grid;
use Jolanda\Controls\Grid\GridVue;
use Jolanda\Menu\Menu;

/**
 * Class ProductComponents
 * @package admin\components
 */
class NewsComponents {
    /**
     * @return Grid
     */
    public static function newsGrid() :Grid {
        $grid = new GridVue('news', 'Novinky', 'admin/news/edit-news');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/news');
        $grid->enableSearch(['Headline'], 'Zadejte hledaný výraz');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_CHECKBOX, 'Active', 'Aktivní', 40);
        $grid->addColumn(COLUMN_ENTITY, 'NewsCategory_ID', 'Kategorie')->setEntity('ID', 'NameCZ', array('module' => 'admin', 'controller' => 'news-category'));
        $grid->addColumn(COLUMN_TEXT, 'Headline', 'Název');
        $grid->addAction('previewNews', 'Zobrazit novinku', "previewNews();")->setIcon('import');

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function newsEntityEditor() :EntityEditor {
        $editor = new EntityEditor('news', 'Novinka', 'admin/news');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::BLOG_LIST)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');

        $tab = $editor->addTab('Novinka', 'basic-info');
        $tab->setColumns(1);

        $group = $tab->addGroup('Novinka');
        $form = $group->addForm();
        $form->addComboBoxStore('Eshop_ID', 'Eshop:', array('module' => 'common', 'controller' => 'eshop'), 'Name', true)->setValue(\common\logic\Eshop\Eshop::getInstance()->getEshopID());
        $form->addComboBoxStore('NewsCategory_ID', 'Kategorie:', array('module' => 'Admin', 'controller' => 'news-category'), 'NameCZ', true);
        $form->addTextBox('Headline', 'Název:', true);
        $form->addTextBox('Perex', 'Perex:', true);
        $form->addNumericBox('ReadingTime', 'Doba čtení:', true);
        $form->addDateBox('Date', 'Datum:', true);
        $form->addEditor('Content', 'Obsah:');
        $form->addFileBox('File_ID', 'Soubor', [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload',
            'type' => File::TYPE_NEWS
        ]);

        return $editor;
    }

    /**
     * @return Grid
     */
    public static function categoryGrid() :Grid {
        $grid = new GridVue('category', 'Seznam kategorií', 'admin/news/edit-news-category');
        $grid->enableSearch(['Name'], 'Zadejte hledaný výraz');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/news-category');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'NameCZ', 'Název', 300);
        $grid->addColumn(COLUMN_ENTITY, 'NewsCategory_ID', 'Nadkategorie', 300)->setEntity('ID', 'NameCZ', array('module' => 'admin', 'controller' => 'news-category'));
        $grid->addColumn(COLUMN_TEXT, 'FileName', 'Název souboru', 300);

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
        $editor = new EntityEditor('category', 'Kategorie', 'admin/news-category');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::BLOG_CATEGORY)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');
        $tab = $editor->addTab('Základní informace', 'basic-info');
        $tab->setColumns(1);

        foreach (Language::getActiveLanguages() as $language) {
            $group = $tab->addGroup(strtoupper($language->Code));
            $form = $group->addForm();
            $form->addTextBox('Name' . $language->Code, 'Název:', true);
            $form->addTextArea('ShortDescription' . $language->Code, 'Krátký popis:');
            $form->addEditor('Description' . $language->Code, 'Popis:');
        }

        $group = $tab->addGroup('Základní informace');
        $form = $group->addForm();
        $form->addComboBoxStore('NewsCategory_ID', 'Nadkategorie:', array('module' => 'admin', 'controller' => 'news-category'), 'NameCZ');

        $form->addFileBox('File_ID', 'Soubor', [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload',
            'type' => File::TYPE_CATEGORY_PICTOGRAM
        ]);

        return $editor;
    }
}