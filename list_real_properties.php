<?php
define('APPLICATION_PATH', realpath(__DIR__ . '/application'));
set_include_path(APPLICATION_PATH . '/../library' . PATH_SEPARATOR . get_include_path());
require_once 'autoload.php';
require_once 'Clevis/Common.php';
require_once APPLICATION_PATH . '/modules/admin/logic/Analytics/AnalyticsService.php';

use admin\logic\Analytics\AnalyticsService;

try {
    $credentialsPath = __DIR__ . '/data/keys/googleapi/service-account-credentials.json';
    $service = new AnalyticsService($credentialsPath);
    
    echo "Získávám Access Token...\n";
    $token = $service->getAccessToken();
    echo "Token získán.\n";
    
    echo "Seznam přístupných Analytics Properties:\n";
    $ch = curl_init("https://analyticsadmin.googleapis.com/v1alpha/accountSummaries");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token"]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $res = json_decode(curl_exec($ch), true);
    curl_close($ch);
    
    print_r($res);
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
