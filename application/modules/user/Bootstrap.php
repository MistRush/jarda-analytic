<?php
use user\logic\UserAdminSession;

class User_Bootstrap extends Zend_Application_Module_Bootstrap implements Clevis_Zend_Plugin_AuthAction {

    /**
     * Constructor
     */
    public function __construct($application) {
        parent::__construct($application);
    }

    /**
     * Init resource loader
     */
    public function initResourceLoader() {
        parent::initResourceLoader();

        Clevis_Zend_Plugin_Auth::getInstance()->addAuthAction(1, $this);
    }

    /**
     * Route shutdown
     *
     * Zend_Controller_Request_Abstract $request
     * @return boolean if some changes were made to request, so shutdown next action
     */
    public function routeShutdown(Zend_Controller_Request_Abstract $request) {
        if (UserAdminSession::isCurrentUser() == true) {
            if ( $request->getModuleName() == 'admin' && UserAdminSession::getCurrentUserType() == User_Model_User::TYPE_CUSTOMER ) {
                // Presmerujeme se na login stranku
                $request->setModuleName('default');
                $request->setControllerName('index');
                $request->setActionName('index');
                return true;
            } else {
                \Jolanda\Controller\BaseController::initJolandaBuildTime();
            }
        }
        // Pokud neni prihlasen uzivatel musime presmerovat na stranku na prihlaseni
        else if (UserAdminSession::isCurrentUser() == false) {
            if ($request->getActionName() == 'process' && $request->getControllerName() == 'login' && $request->getModuleName() == 'admin') {
                return false;
            }
            if ($request->getActionName() == 'index' && $request->getControllerName() == 'login' && $request->getModuleName() == 'admin') {
                return false;
            }
            // Musime ovsem povolit samotny proces prihlaseni, tedy nasledujicic akci
            if ($request->getActionName() == 'process' && $request->getControllerName() == 'login' && $request->getModuleName() == 'user') {
                return false;
            }
            // Musime povolit vytvorit administratorsky ucet
            if ($request->getActionName() == 'data-create-data' && $request->getControllerName() == 'user' && $request->getModuleName() == 'user') {
                return false;
            }

            // Povolime common tool
            if ($request->getControllerName() == 'tool' && $request->getModuleName() == 'common') {
                return false;
            }            

            // Povolime file
            if ($request->getControllerName() == 'file' && $request->getModuleName() == 'common') {
                return false;
            }            
            
            // Povolime cely model default
            if ($request->getModuleName() == 'default') {
                return false;
            }

            // Povolime z venku spouštět crony
            if ($request->getControllerName() == 'cron' && $request->getModuleName() == 'common') {
                return false;
            }

            // Povolime z venku spouštět crony
            if ($request->getControllerName() == 'endpoint' && $request->getModuleName() == 'api') {
                return false;
            }

            // Povolime gopay
            if ($request->getControllerName() == 'gopay' && $request->getModuleName() == 'common') {
                return false;
            }

            // Presmerujeme se na login stranku
            $request->setModuleName('admin');
            $request->setControllerName('login');
            $request->setActionName('index');
            return true;
        }
        return false;
    }

}
