<?php
use common\logic\Cli\MoveRequestToCli;
use admin\components\CronComponents as Cron;
use Common_Model_Cron as CronModel;
use Common_Model_CronLog as CronLogModel;

class Admin_CronController extends Admin_Controller_Action {

    public function cronAction() {
        $graph = CronLogModel::getLogs();
        $cronGrid = Cron::cronGrid();
        $cronGrid->setHeight('39vh');

        $this->renderLatte([
            'cronGrid' => $cronGrid,
            'graph' => $graph,
        ]);
    }

    public function editCronAction() {
        $this->renderEditor(Cron::editCronEditor());
    }

    public function logAction() {
        $cron_ID = $this->getParam('Cron_ID');
        $panel_id = $this->getParam('Panel_ID');

        if (!$cron_ID)
            return;

        $logs = Cron::log($cron_ID);

        $this->renderLatte([
            'logs' => $logs,
            'panel_id' => $panel_id,
        ], false);
    }

    public function runAction() {
        $cron_ID = $this->getParam('Cron_ID');

        if (!$cron_ID) {
            http_response_code(404);
            die (translate('Cron nenastaven'));
        }

        MoveRequestToCli::callCronCli('manual', ['Cron_ID' => $cron_ID]);
    }
}
