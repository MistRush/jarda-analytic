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
class ComplaintComponents {
    /**
     * @return Grid
     */
    public static function complaintGrid() :Grid {
        $grid = new GridVue('complaint', 'Reklamace', 'admin/complaint/edit-complaint');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/complaint');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Zákazník', 40);
        $grid->addColumn(COLUMN_TEXT, 'Email', 'Email');
        $grid->addColumn(COLUMN_TEXT, 'Phone', 'Telefon');
        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function complaintEntityEditor() :EntityEditor {
        $editor = new EntityEditor('complaint', 'Reklamace', 'admin/complaint');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::COMPLAINT_LIST)->getUrl());
        $editor->enableStandalone();

        $tab = $editor->addTab('Reklamace', 'basic-info');
        $tab->setColumns(2);

        $group = $tab->addGroup('Základní informace');
        $form = $group->addForm();
        $form->addTextBox('Name', 'Jméno:');
        $form->addTextBox('Email', 'Email:');
        $form->addTextBox('Phone', 'Telefon:');

        $group = $tab->addGroup('Firemní údaje');
        $form = $group->addForm();
        $form->addTextBox('CompanyName', 'Název společnosti:');
        $form->addTextBox('IC', 'IC:');
        $form->addTextBox('DIC', 'Dic:');

        $group = $tab->addGroup('Fakturační údaje');
        $form = $group->addForm();
        $form->addTextBox('InvoiceStreet', 'Ulice');
        $form->addTextBox('InvoiceCity', 'Město');
        $form->addTextBox('InvoiceZipCode', 'PSČ');

        $group = $tab->addGroup('Doručovací údaje');
        $form = $group->addForm();
        $form->addTextBox('DeliveryName', 'Název společnosti/Jméno');
        $form->addTextBox('DeliveryStreet', 'Ulice');
        $form->addTextBox('DeliveryZipCode', 'PSČ');

        $tab = $editor->addTab('Položky');
        $group = $tab->addGroup('Položky');

        $grid = $group->addGrid('items', 'Položky');
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/complaint-item');
        $grid->setParentEntity('Complaint_ID');
        $grid->addEditor('admin/complaint/edit-complaint-item');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'InvoiceNumber', 'Číslo faktury');
        $grid->addColumn(COLUMN_TEXT, 'ProductNumber', 'Číslo produktu');
        $grid->addColumn(COLUMN_NUMBER, 'Amount', 'Početu kusů');
        $grid->addColumn(COLUMN_TEXT, 'Description', 'Popis');

        return $editor;
    }

//    public static function complaintItemEntityEditor() :EntityEditor {
//        $editor = new EntityEditor('complaint-item', 'Položka reklamace', 'admin/edit-complaint-item');
//        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::COMPLAINT_LIST)->getUrl());
//        $editor->enableStandalone();
//
//        $tab = $editor->addTab('Položka reklamace', 'basic-info');
//        $tab->setColumns(2);
//
//        $group = $tab->addGroup('Základní informace');
//        $form = $group->addForm();
//        $form->addTextBox('InvoiceNumber', 'Číslo faktury:');
//        $form->addTextBox('ProductNumber', 'Číslo produktu:');
//        $form->addNumericBox('Amount', 'Počet:');
//        $form->addTextBox('Description', 'Popis:');
//
//
//        return $editor;
//    }
}