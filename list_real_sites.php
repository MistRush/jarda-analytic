<?php
define('APPLICATION_PATH', realpath(__DIR__ . '/application'));
set_include_path(APPLICATION_PATH . '/../library' . PATH_SEPARATOR . get_include_path());
require_once 'autoload.php';
require_once 'Clevis/Common.php';
require_once APPLICATION_PATH . '/modules/admin/logic/Analytics/AnalyticsService.php';

use admin\logic\Analytics\AnalyticsService;

try {
    $keyDir = __DIR__ . '/data/keys/googleapi/';
    $credentialsPath = $keyDir . 'service-account-credentials.json';
    $oauthPath = $keyDir . 'oauth_token.json';
    $secretPath = $keyDir . 'client_secret.json';
    
    $service = new AnalyticsService($credentialsPath, $oauthPath, $secretPath);
    
    echo "Získávám Access Token (OAuth2 preferován)...\n";
    $token = $service->getAccessToken();
    echo "Token získán.\n";
    
    echo "Seznam přístupných Search Console webů:\n";
    $ch = curl_init("https://www.googleapis.com/webmasters/v3/sites");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token"]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $res = json_decode(curl_exec($ch), true);
    curl_close($ch);
    
    print_r($res);
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
