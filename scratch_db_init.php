<?php
define('APPLICATION_PATH', realpath(__DIR__ . '/application'));
define('APPLICATION_ENV', 'development');

set_include_path(
    APPLICATION_PATH . '/../library' . PATH_SEPARATOR .
    APPLICATION_PATH . '/../library/Zend' . PATH_SEPARATOR .
    APPLICATION_PATH . '/../application/modules'
);

require_once 'library/autoload.php';
require_once 'Zend/Application.php';

$application = new Zend_Application(
    APPLICATION_ENV,
    APPLICATION_PATH . '/configs/application.ini'
);

$bootstrap = $application->bootstrap();

echo "Initializing SQLite database...\n";

$dsn = 'sqlite:///' . __DIR__ . '/data/database.sqlite';
$conn = Doctrine_Manager::connection($dsn, 'default');

// Load models from modules
$modulesDir = APPLICATION_PATH . '/modules';
foreach (new DirectoryIterator($modulesDir) as $module) {
    if ($module->isDir() && !$module->isDot()) {
        $modelsDir = $module->getPathname() . '/models';
        if (is_dir($modelsDir)) {
            echo "Loading models from " . $module->getFilename() . "...\n";
            Doctrine_Core::loadModels($modelsDir);
        }
    }
}

// Create tables
try {
    Doctrine_Core::createTablesFromModels();
    echo "Tables created successfully.\n";
} catch (Exception $e) {
    echo "Error creating tables: " . $e->getMessage() . "\n";
}
