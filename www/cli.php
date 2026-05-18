<?php
require_once '../library/autoload.php';

date_default_timezone_set('Europe/Paris');

// Define path to application directory
defined('APPLICATION_PATH') || define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/../application'));

// Define application environment
defined('APPLICATION_ENV') || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

// Ensure library/ is on include_path
set_include_path(
    APPLICATION_PATH . '/../library' . PATH_SEPARATOR .
    APPLICATION_PATH . '/../library/Zend' . PATH_SEPARATOR .
    APPLICATION_PATH . '/../application/modules' . PATH_SEPARATOR .
    APPLICATION_PATH . '/../application/modules/admin/logic'
);

// Zend_Application
require_once 'Zend/Application.php';

// Create application
$application = new Zend_Application(
    APPLICATION_ENV,
    APPLICATION_PATH . '/configs/applicationCli.ini'
);

// Bootstrap
$bootstrap = $application->bootstrap();
$bootstrap->run();
