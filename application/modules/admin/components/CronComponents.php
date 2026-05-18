<?php

namespace admin\components;

use Common_Model_Cron as CronModel;
use Common_Model_CronLog as CronLogModel;
use Jolanda\Controls\Grid\Grid;
use Jolanda\Controls\Editor\EntityEditor;
use Jolanda\Controls\Grid\GridVue;
use Nette\Utils\Html;
use stdClass;

class CronComponents
{
    public static function cronGrid(): GridVue
    {
        $grid = new GridVue('cron', translate('Cron'), null);
        $grid->setUrl('common/cron');
        $grid->setEditAction('admin/cron/edit-cron');
        $grid->enableSearch('searchAs', translate('Vyhledávejte dle akce'));

        $grid->addColumn(COLUMN_ID, 'ID', translate('ID'), 30);
        $grid->addColumn(COLUMN_CHECKBOX, 'Active', translate('Aktivní'), 70);
        $grid->addColumn(COLUMN_TEXT, 'Name', translate('Název'), 200);
        $grid->addColumn(COLUMN_TEXT, 'Script', translate('Akce'), 150);
        $grid->addColumn(COLUMN_TEXT, 'CronExpression', translate('Cron výraz'), 130);
        $grid->addColumn(COLUMN_TEXT, 'Minute', translate('Minuta'), 30);
        $grid->addColumn(COLUMN_TEXT, 'Hour', translate('Hodina'), 30);
        $grid->addColumn(COLUMN_TEXT, 'Day', translate('Den'), 30);
        $grid->addColumn(COLUMN_TEXT, 'Month', translate('Měsíc'), 30);
        $grid->addColumn(COLUMN_TEXT, 'Week', translate('Týden'), 30);
        $grid->addColumn(COLUMN_TEXT, 'Note', translate('Poznámka'), 120);
        $grid->addColumn(COLUMN_DATETIME, 'NextRun', translate('Další RUN'), 170);
        $grid->addColumn(COLUMN_DATETIME, 'LastRun', translate('Poslední RUN'), 170);
        $grid->addColumn(COLUMN_DATETIME, 'LastFinish', translate('Poslední FINISH'), 170);
        $grid->addColumn(COLUMN_TEXT, 'LastStatus', translate('Poslední status'), 50);
        $grid->addColumn(COLUMN_DATE, 'DateCreated', translate('Vytvořen'), 100);

        $grid->addAction('runCron', translate('Spustit cron'), 'runCron()')->setIcon('phone');
        $grid->addAction('showLog', translate('Zobrazit log'), 'showLog()')->setIcon('witness');

        return $grid;
    }

    public static function editCronEditor(): EntityEditor
    {
        require_once APPLICATION_PATH . "/modules/common/controllers/ClicronController.php";

        $editor = new EntityEditor('cronEntityEditor', translate('Položka Cronu'), 'common/cron');
        $editor->enableStandalone();
        $editor->setBackUrl('admin/cron/cron');
        $tab = $editor->addTab(translate('Nastavení cronu'));
        $group = $tab->addGroup(translate('Nastavení cronu'));
        $form = $group->addForm();
        $form->setColumns(1);
        $form->addTextBox('Name', translate('Název'));
        $form->addTextBox('Note', translate('Poznámka'));
        $scriptInput = $form->addTextBox('Script', translate('Akce'));
        $scriptInput->getControlPart()->setAttribute('list', 'script-datalist');
        $datalist = Html::el('datalist', ['id' => 'script-datalist']);
        foreach (\Common_ClicronController::getActions() as $action) {
            $datalist->addHtml(Html::el('option', ['value' => $action]));
        }
        $form->addHtml($datalist);

        $form->addCheckBox('Active', translate('Aktivní'));
        $form->addTextBox('CronExpression', translate('Cron výraz'))->setHelp('Nemusíte vyplňovat položky Cronu, když nastavíte tento sloupec, rozdělení proběhne při uložení automaticky');
        $form->addTextBox('Minute', translate('Minuta'))->setHelp('Následující položky mají přednost před celým výrazem!');
        $form->addTextBox('Hour', translate('Hodina'));
        $form->addTextBox('Day', translate('Den'));
        $form->addTextBox('Month', translate('Měsíc'));
        $form->addTextBox('Week', translate('Týden'));

        $tab = $editor->addTab(translate('Řešitelé'));
        $group = $tab->addGroup(translate('Řešitelé'));

        $group->addRelationSwitcher(translate('Řešitelé'), 'user/user', 'common/cron-user', 'Cron_ID', 'User_ID', 'Name', ['onlyAdmin' => 1]);

//        $tab = $editor->addTab(translate('Adresáti'));
//        $group = $tab->addGroup(translate('Adresáti'));
//        $form = $group->addForm();
//        $manager = new Admin_Manager_Employee();
//        $employees = $manager->performDataList([ 'active' => 1], Manager::LIST_HIERARCHY);
//        foreach ($employees['data'] as $employee){
//            $form->addCheckBox('emp_id'.$employee['ID'], $employee['Name']);
//        }
        return $editor;
    }

    /**
     * @param int $cron_ID
     * @return stdClass
     */
    public static function log(int $cron_ID): stdClass
    {
        $log = new stdClass();
        $log->cron = CronModel::getCron($cron_ID);
        $log->logs = CronLogModel::getCronLogs($cron_ID);

        return $log;
    }

}
