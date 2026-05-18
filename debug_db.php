<?php
define('APPLICATION_PATH', realpath(__DIR__ . '/application'));
define('APPLICATION_ENV', 'development');
set_include_path(APPLICATION_PATH . '/../library' . PATH_SEPARATOR . APPLICATION_PATH . '/../library/Zend' . PATH_SEPARATOR . APPLICATION_PATH . '/../application/modules');
require_once 'library/autoload.php';
require_once 'Zend/Application.php';
$application = new Zend_Application(APPLICATION_ENV, APPLICATION_PATH . '/configs/application.ini');
$application->bootstrap();

echo "--- Settings ---\n";
$q = Doctrine_Query::create()->from('Common_Model_Settings');
$res = $q->execute([], Doctrine_Core::HYDRATE_ARRAY);
print_r($res);

echo "--- Eshop ---\n";
$q = Doctrine_Query::create()->from('Common_Model_Eshop');
$res = $q->execute([], Doctrine_Core::HYDRATE_ARRAY);
print_r($res);
