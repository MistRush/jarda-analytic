<?php
namespace admin\components;

use admin\logic\Navigation;
use Jolanda\Controls\Editor\EntityEditor;
use Jolanda\Controls\Grid\Grid;
use Jolanda\Controls\Grid\GridVue;
use Jolanda\Menu\Menu;

/**
 * Class MarketingComponents
 * @package admin\components
 */
class MarketingComponents {

    /**
     * @return Grid
     */
    public static function questionGrid() :Grid {
        $grid = new GridVue('question', 'Seznam dotazů');
        $grid->setEnabledActions(false, false, false);
        $grid->enablePreview();
        $grid->setUrl('admin/question');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', 'Eshop', 300)->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'eshop'));
        $grid->addColumn(COLUMN_DATE, 'Date', 'Datum', 70);
        $grid->addColumn(COLUMN_TEXT, 'Time', 'Čas', 60);
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Jméno', 100);
        $grid->addColumn(COLUMN_TEXT, 'Email', 'Email', 100);
        $grid->addColumn(COLUMN_TEXT, 'Phone', 'Telefon', 100);
        $grid->addColumn(COLUMN_LONGTEXT, 'Description', 'Dotaz', 100);

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function massEmailEntityEditor(): EntityEditor {
        $editor = new EntityEditor('massEmail', 'Hromadný email', 'admin/mass-email');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::MARKETING_MASS_EMAIL)->getUrl().'?email-send');
        $editor->enableStandalone();

        $tab = $editor->addTab('Hromadný email', 'basic-info');
        $tab->setColumns(1);

        $group = $tab->addGroup('Detail e-mailu');
        $form = $group->addForm();
        $form->setColumns(1);
        $form->addComboBoxStore('Eshop_ID', 'Eshop:', array('module' => 'common', 'controller' => 'eshop'), 'Name', true);
        $form->addTextBox('TestMail', 'Testovací email(pokud je vyplněn, pošle se zpráva pouze zde)');
        $form->addTextBox('Subject', 'Předmět e-mailu:', true);
        $form->addEditor('Content', 'Obsah zprávy:');

        return $editor;
    }

    public static function newsletterGrid() {
        $grid = new GridVue('newsletter', 'Seznam odběratelů');
        $grid->setEnabledActions(false, false, false);
        $grid->enablePreview();
        $grid->setUrl('admin/Newsletter-subscriber');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_DATE, 'Date', 'Datum');
        $grid->addColumn(COLUMN_TEXT, 'Time', 'Čas');
        $grid->addColumn(COLUMN_TEXT, 'Subscriber', 'E-mail');
        $grid->addColumn(COLUMN_CHECKBOX, 'Active', 'Aktivní');

        return $grid;
    }
}