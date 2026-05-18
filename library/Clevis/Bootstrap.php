<?php
require_once 'Common.php';
require_once 'Version.php';
require_once 'Timer.php';
require_once 'Zend/Plugin.php';
require_once 'Zend/Dispatcher.php';

use common\logic\Configs;
use Tracy\Debugger;

class Clevis_Bootstrap extends Zend_Application_Bootstrap_Bootstrap {

    /** Config variables */
    protected $config;

    /**
     * Constructor
     */
    public function __construct($application) {
        Clevis_Timer::start('app-init-construct');

        parent::__construct($application);

        // Setup front controller
        $frontController = Zend_Controller_Front::getInstance();
        $baseUrl = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
        $frontController->setBaseUrl($baseUrl);
        $frontController->registerPlugin(new Clevis_Zend_Plugin());
        $frontController->setDispatcher(new Clevis_Zend_Dispatcher());

        Clevis_Timer::stop('app-init-construct');       
    }

    /**
     * Init module loaders
     */
    protected function _initModuleLoaders() {
        Clevis_Timer::start('app-init-loader');

        $autoloader = Zend_Loader_Autoloader::getInstance();
        $autoloader->registerNamespace('Clevis_');

        $this->bootstrap('Frontcontroller');
        $fc = $this->getResource('Frontcontroller');
        $modules = $fc->getControllerDirectory();

        foreach ($modules AS $module => $dir) {
            $moduleName = strtolower($module);
            $moduleName = str_replace(array('-', '.'), ' ', $moduleName);
            $moduleName = ucwords($moduleName);
            $moduleName = str_replace(' ', '', $moduleName);

            $loader = new Zend_Application_Module_Autoloader(array(
                'namespace' => $moduleName,
                'basePath' => realpath($dir . '/../'),
            ));
            $resourceTypes = $loader->getResourceTypes();
            $resourceTypes = array_merge($resourceTypes, array(
                'common' => array(
                    'namespace' => $moduleName,
                    'path' => realpath($dir . '/../'),
                ),
                'modelbase' => array(
                    'namespace' => 'Model_Base',
                    'path' => 'models/base',
                ),
                'model' => array(
                    'namespace' => 'Model',
                    'path' => 'models',
                ),
                'manager' => array(
                    'namespace' => 'Manager',
                    'path' => 'managers',
                ),
                'logic' => array(
                    'namespace' => 'Logic',
                    'path' => 'logic',
                ),
                'components' => array(
                    'namespace' => 'components',
                    'path' => 'components',
                ),
                'view' => array(
                    'namespace' => 'View',
                    'path' => 'view',
            )));
            $loader->setResourceTypes($resourceTypes);
            $loader->setDefaultResourceType('modelbase');
        }

        Clevis_Timer::stop('app-init-loader');

        // TODO, tohle udelej automaticky, at to prochazi slozky a dava to tam
        $autoloader->registerNamespace('admin');
        $autoloader->registerNamespace('Ares');        
        $autoloader->registerNamespace('Clevis');
        $autoloader->registerNamespace('common');
        $autoloader->registerNamespace('default');
        $autoloader->registerNamespace('user');
    }
    
    /**
     * Init dojo
     */
    protected function _initDojo() {
        Zend_Dojo_View_Helper_Dojo::setUseDeclarative();
    }

    /**
     * Init view helpers
     */
    protected function _initViewHelpers() {
        $this->bootstrap('view');
        $view = $this->getResource('view');
    }

    /**
     * Init doctrine
     */
    protected function _initDoctrine($dsn = null) {
        Clevis_Timer::start('app-init-doctrine');

        $doctrine = new Clevis_Zend_Doctrine_Application_Resource_Doctrine();
        $doctrine->setManager(array('attributes' => array('attr_model_loading' => 'model_loading_zend')));

        // Set default dsn
        if ($dsn == null) {
            $dsn = Configs::getConfig('doctrine.dsn');
            if ($dsn == null) {
                $dsn = 'sqlite:///' . APPLICATION_PATH . '/../data/database.sqlite';
            }
        }
        $doctrine->setConnections(array('default' => array('dsn' => $dsn)));

        // Set doctrine resource
        $this->_container->doctrine = $doctrine->init();

        // Enable dql callbacks
        Doctrine_Manager::getInstance()->setAttribute(Doctrine_Core::ATTR_USE_DQL_CALLBACKS, true);

        Clevis_Timer::stop('app-init-doctrine');
    }

    /**
     * Init error handling
     */
    protected function _initErroHandling() {
        // Enable debugging
        if ($this->hasOption('debug') && Clevis_Helper::isDevelopmentEnvironment()) {
            //Clevis_Zend_Debug::enable();
            //Debugger::enable(Debugger::DEVELOPMENT, null); // aktivujeme Laděnku
            //\Jolanda\Tracy\Extensions\Extensions::addAllPanels();


            Debugger::$maxDepth = 5;
            Debugger::$showBar = true;
            Debugger::$scream = false;
            Debugger::$strictMode = true;
            Zend_Controller_Front::getInstance()->throwExceptions(true);

        } if (Clevis_Helper::isDevelopmentEnvironment() == false) {
            // Shutdown handler
            register_shutdown_function('Clevis_Bootstrap::production_handle_shutdown');
            // Error handler
            set_error_handler('Clevis_Bootstrap::production_handle_error', E_ALL | E_STRICT);
        }
    }

    /**
     * Init doctrine connection
     */
    protected function _initDoctrineConnection() {
        // Connect to db
        Clevis_Timer::start('app-init-connect');
        $connection = Doctrine_Manager::connection();
        $connection->setCharset('utf8');
        $connection->connect();
        $connection->getDbh()->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, true);
        Clevis_Timer::stop('app-init-connect');
    }

    /**
     * Handle shutdown in production and pass error to error handler if presented
     *
     * @return void
     */
    public static function production_handle_shutdown() {
        $error = error_get_last();
        if ($error != null) {
            self::production_handle_error($error['type'], $error['message'], $error['file'], $error['line']);
        }
    }

    /**
     * Handle error in production
     *
     * @param $errno
     * @param $errstr
     * @param $errfile
     * @param $errline
     * @return bool
     */
    public static function production_handle_error($errno, $errstr, $errfile, $errline) {
        Clevis_Error::renderProductionError($errno, $errstr, $errfile, $errline);
        return true;
    }

}
