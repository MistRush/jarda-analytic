<?php
define('APPLICATION_PATH', realpath(__DIR__ . '/application'));
set_include_path(APPLICATION_PATH . '/../library' . PATH_SEPARATOR . get_include_path());

require_once 'Zend/Application.php';
$application = new Zend_Application('Default', APPLICATION_PATH . '/configs/config.ini');
$application->bootstrap();

try {
    $conn = Doctrine_Manager::connection();
    $tables = $conn->import->listTables();
    foreach ($tables as $table) {
        if (strpos($table, 'common__model__') === false) continue;
        echo "Table: $table\n";
        $columns = $conn->import->listTableColumns($table);
        foreach ($columns as $name => $details) {
            echo "  - $name\n";
        }
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
