<?php
// install_db.php
define('APPLICATION_PATH', realpath(__DIR__ . '/application'));
define('APPLICATION_ENV', 'development');

set_include_path(
    APPLICATION_PATH . '/../library' . PATH_SEPARATOR .
    APPLICATION_PATH . '/../library/Zend' . PATH_SEPARATOR .
    APPLICATION_PATH . '/../application/modules'
);

require_once 'library/autoload.php';
require_once 'Zend/Application.php';

// Bootstrap aplikace (nyní již DB existuje, takže by to mělo projít)
$application = new Zend_Application(
    APPLICATION_ENV,
    APPLICATION_PATH . '/configs/application.ini'
);

try {
    $application->bootstrap();
    echo "Aplikace nabootována, připojen k 'trym'.\n";
    
    echo "Generuji tabulky z modelů...\n";
    
    $modulesDir = APPLICATION_PATH . '/modules';
    foreach (new DirectoryIterator($modulesDir) as $module) {
        if ($module->isDir() && !$module->isDot()) {
            $modelsDir = $module->getPathname() . '/models';
            if (is_dir($modelsDir)) {
                echo "Načítám modely: " . $module->getFilename() . "\n";
                Doctrine_Core::loadModels($modelsDir);
            }
        }
    }

    Doctrine_Core::createTablesFromModels();
    echo "HOTOVO! Všechny tabulky byly vytvořeny.\n";
} catch (Exception $e) {
    echo "CHYBA: " . $e->getMessage() . "\n";
}
