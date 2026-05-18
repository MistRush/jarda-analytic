<?php
session_start();
require_once '../library/autoload.php';

$extensions = array('gd', 'mbstring', 'curl');
foreach ( $extensions as $extension ) {
    if ( !extension_loaded($extension)) {
        die("Extension missing - " . $extension);
    }
}

date_default_timezone_set('Europe/Paris');
error_reporting(E_ALL & ~E_DEPRECATED);
ini_set('display_errors', '1');


// Define path to application directory
defined('APPLICATION_PATH')
|| define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/../application'));

// Define application environment
defined('APPLICATION_ENV')
|| define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'development'));

// Ensure library/ is on include_path
set_include_path(
    APPLICATION_PATH . '/../library' . PATH_SEPARATOR .
    APPLICATION_PATH . '/../library/Zend' . PATH_SEPARATOR .
    APPLICATION_PATH . '/../application/modules' . PATH_SEPARATOR .
    APPLICATION_PATH . '/../application/modules/admin/logic'
);

// Get start time
require_once 'Clevis/Timer.php';

Clevis_Timer::start(Clevis_Timer::APPLICATION);

// Zend_Application
require_once 'Zend/Application.php';

// Create application
Clevis_Timer::start('app-create');
$application = new Zend_Application(
    APPLICATION_ENV,
    APPLICATION_PATH . '/configs/application.ini'
);
Clevis_Timer::stop('app-create');

// Bootstrap
Clevis_Timer::start('app-init');
$bootstrap = $application->bootstrap();
Clevis_Timer::stop('app-init');

// Run
Clevis_Timer::start('run');
Clevis_Timer::start('run-before');
$bootstrap->run();
Clevis_Timer::stop('run-after');
Clevis_Timer::stop('run');

// Render end
Clevis_Layout::renderEnd();