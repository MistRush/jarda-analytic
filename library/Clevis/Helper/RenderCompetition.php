<?php

class Clevis_Helper_RenderCompetition extends Zend_View_Helper_Abstract {
    
    public function renderCompetition($competition) {
        $view = new Zend_View();
        $view->competition = $competition;
        $view->setScriptPath(APPLICATION_PATH.'/modules/default/views/scripts/competition/');
        
        echo $view->render('list-item.phtml');
    }
}