<?php

class Clevis_Zend_Plugin_Auth extends Zend_Controller_Plugin_Abstract {

    /**
     * Auth actions
     * 
     * @var array
     */
    private $authActions = array();

    /**
     * Instance
     *
     * @var Clevis_Zend_Plugin_Auth
     */
    private static $instance = null;

    /**
     * Get instance
     * 
     * @return Clevis_Zend_Plugin_Auth
     */
    public static function getInstance() {
        return Clevis_Zend_Plugin_Auth::$instance;
    }

    /**
     * Constructor
     */
    public function __construct() {
        Clevis_Zend_Plugin_Auth::$instance = $this;
    }

    /**
     * Add auth action
     * 
     * @param Clevis_Zend_Plugin_AuthAction $authAction
     */
    public function addAuthAction($priority,Clevis_Zend_Plugin_AuthAction & $authAction) {
        $this->authActions[$priority] = &$authAction;
        ksort($this->authActions);
    }

    /**
     * Route shutdown
     * 
     * @param Zend_Controller_Request_Abstract $request
     */
    public function routeShutdown(Zend_Controller_Request_Abstract $request) {
        if ( strpos($request->getPathInfo(), '/clevis/release/') === 0 ) {
            throw new Exception('Požadovaný soubor neexistuje: ' . $request->getPathInfo());
        }

        foreach ( $this->authActions as $priority => $authAction ) {
            if ( $authAction->routeShutdown($request) ) {
                if ( $request->getControllerName() != 'favicon.ico' )
                    Clevis_Helper::saveRequestedUrl();
                break;
            } else {
                continue;
            }
        }
    }

}
?>