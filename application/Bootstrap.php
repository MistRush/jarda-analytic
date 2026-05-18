<?php
require_once 'Clevis/Bootstrap.php';
require_once 'Clevis/Permission.php';
require_once 'Clevis/Navigation.php';
require_once APPLICATION_PATH . '/modules/default/controllers/BaseController.php';
require_once APPLICATION_PATH . '/modules/admin/controllers/Action.php';
require_once APPLICATION_PATH . '/modules/common/logic/URL.php';

use common\logic\Configs;

class Bootstrap extends Clevis_Bootstrap {

    /**
     * Constructor
     * @param Zend_Application|Zend_Application_Bootstrap_Bootstrapper $application
     */
    public function __construct($application) {
        parent::__construct($application);

        // Set permission instance
        Clevis_Permission::setInstanceType('User_Logic_Permission');
        // Set navigation instance
        Clevis_Navigation::setInstanceType('Default_Logic_Navigation');
    }

    /**
     * Init module loaders
     */
    protected function _initModuleLoaders() {
        parent::_initModuleLoaders();
    }

    protected function _initSiteRoutes() {
        $this->bootstrap('frontController');
        $front = $this->getResource('frontController');
        $front->getRouter()->addConfig(new Zend_Config_Ini(APPLICATION_PATH . '/configs/routes.ini'), 'routes');
    }

    /**
     * Init config ini file
     */
    protected function _initEshop() {

    }

    /**
     * Init config ini file
     */
    protected function _initConfig() {
        Configs::loadConfiguration();
    }

    /**
     * Init doctrine
     * @param null $dsn
     */
    protected function _initDoctrine($dsn = null) {
        parent::_initDoctrine($dsn);

        // Init behaviours
        Clevis_Behavior_LogCreate::setDefaultOptions(array("ByClass" => "User_Model_User", "ByClassColumn" => "ID", "ByClassAlias" => "user"));
    }

}