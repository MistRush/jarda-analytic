<?php

class Clevis_Helper_RenderOrganization extends Zend_View_Helper_Abstract {
    
    public function renderOrganization($organization) {
        $view = new Zend_View();
        $view->organization = $organization;
        $view->setScriptPath(APPLICATION_PATH.'/modules/default/views/scripts/organization/');
        echo $view->render('list-item.phtml');  
    }
}