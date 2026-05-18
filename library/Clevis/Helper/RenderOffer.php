<?php

class Clevis_Helper_RenderOffer extends Zend_View_Helper_Abstract {
    
    public function renderOffer($offer) {
        $view = new Zend_View();
        $view->offer = $offer;
        $view->setScriptPath(APPLICATION_PATH.'/modules/default/views/scripts/actual/');
        echo $view->render('list-item.phtml');
    }
}