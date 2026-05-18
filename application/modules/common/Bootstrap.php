<?php

class Common_Bootstrap extends Zend_Application_Module_Bootstrap implements Clevis_Zend_Plugin_AuthAction
{
    public function __construct($application)
    {
        parent::__construct($application);
    }

    /**
     * Init resource loader
     */
    public function initResourceLoader()
    {
        parent::initResourceLoader();

        Clevis_Zend_Plugin_Auth::getInstance()->addAuthAction(0, $this);
    }

    /**
     * Route shutdown
     *
     * Zend_Controller_Request_Abstract $request
     * @return boolean if some changes were made to request, so shutdown next action
     */
    public function routeShutdown(Zend_Controller_Request_Abstract $request)
    {
        // Povolime tool
        if ( $request->getControllerName() == 'tool' && $request->getModuleName() == 'common' ) {
            // Nebudeme povolovat import/export dat (aby se uzivatel musel prihlasit),
            // ale v pripade ze je aplikace spustene skrze index_tool.php pak data akce povolime
            if ( strpos($request->getActionName(), 'data') === false || defined('INDEX_TOOL') ) {
                return true;
            }
        }
        // Povolime zmenu licence
        if ( $request->getControllerName() == 'license' && $request->getModuleName() == 'common') {
            return true;
        }

        // Povolime zapi
        if ( $request->getControllerName() == 'hadex-api' && $request->getModuleName() == 'common') {
            return true;
        }

        // Povolime zapi
        if ( $request->getControllerName() == 'csob' && $request->getModuleName() == 'common') {
            return true;
        }

        // Povolime zmenu licence
        if ( $request->getControllerName() == 'api' && $request->getModuleName() == 'common') {
            return true;
        }

        return false;
    }
}