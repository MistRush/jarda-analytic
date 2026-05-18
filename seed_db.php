<?php
// seed_db.php
define('APPLICATION_PATH', realpath(__DIR__ . '/application'));
define('APPLICATION_ENV', 'development');
set_include_path(APPLICATION_PATH . '/../library' . PATH_SEPARATOR . APPLICATION_PATH . '/../library/Zend' . PATH_SEPARATOR . APPLICATION_PATH . '/../application/modules');
require_once 'library/autoload.php';
require_once 'Zend/Application.php';
$application = new Zend_Application(APPLICATION_ENV, APPLICATION_PATH . '/configs/application.ini');
$application->bootstrap();

echo "Repairing data for Eshop ID 1...\n";

try {
    // Update Settings ID 1
    $settings = Doctrine_Core::getTable('Common_Model_Settings')->find(1);
    if (!$settings) {
        $settings = new Common_Model_Settings();
        $settings->ID = 1;
    }
    $settings->ContactEmail = 'info@trym.cz';
    $settings->ContactPhone = '+420 123 456 789';
    $settings->ContactName = 'Trym Admin';
    $settings->ProjectName = 'Trym';
    $settings->ProjectURL = 'localhost';
    $settings->OpeningHours = 'Po-Pá: 8:00 - 16:00';
    $settings->save();
    echo "Settings ID 1 updated.\n";

    // Update Language ID 1
    $lang = Doctrine_Core::getTable('Common_Model_Language')->find(1);
    if (!$lang) {
        $lang = new Common_Model_Language();
        $lang->ID = 1;
    }
    $lang->Code = 'cz';
    $lang->Name = 'Čeština';
    $lang->Active = 1;
    $lang->save();
    echo "Language ID 1 updated.\n";

    // Update Currency ID 1
    $currency = Doctrine_Core::getTable('Admin_Model_Currency')->find(1);
    if (!$currency) {
        $currency = new Admin_Model_Currency();
        $currency->ID = 1;
    }
    $currency->Mark = 'CZK';
    $currency->Name = 'Kč';
    $currency->Ratio = 1;
    $currency->save();
    echo "Currency ID 1 updated.\n";

    // Ensure Eshop ID 1 exists and points to these
    $eshop = Doctrine_Core::getTable('Common_Model_Eshop')->find(1);
    if (!$eshop) {
        $eshop = new Common_Model_Eshop();
        $eshop->ID = 1;
    }
    $eshop->Name = 'Trym';
    $eshop->URL = 'localhost';
    $eshop->Active = 1;
    $eshop->Settings_ID = 1;
    $eshop->Language_ID = 1;
    $eshop->Currency_ID = 1;
    $eshop->save();
    echo "Eshop ID 1 updated.\n";

    echo "REPAIR HOTOVO!\n";
} catch (Exception $e) {
    echo "CHYBA: " . $e->getMessage() . "\n";
}
