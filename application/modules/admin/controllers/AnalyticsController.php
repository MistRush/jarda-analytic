<?php

use admin\logic\Analytics\AnalyticsService;

/**
 * Controller pro obsluhu analytik v administraci.
 */
class Admin_AnalyticsController extends Admin_Controller_Action {

    /**
     * Načte data ze GA4 na serveru a předá je Vue přes window.__DATA__.
     * Varianta A: vše server-side, žádný AJAX při načítání stránky.
     * Refresh dat = odeslání formuláře s datumem (klasický GET).
     */
    public function indexAction() {
        $eshop    = Common_Model_Eshop::getFirstEshop();
        $settings = $eshop->settings;

        $propertyId = $this->getParam('propertyId', $settings->AnalyticsCode ?: '285638052');
        $startDate  = $this->getParam('startDate', date('Y-m-d', strtotime('-30 days')));
        $endDate    = $this->getParam('endDate', date('Y-m-d'));
        $baseUrl    = rtrim(Zend_Controller_Front::getInstance()->getBaseUrl(), '/');

        $domain = $eshop->URL ?: $eshop->domain ?: 'www.escapegame.cz';
        if (strpos($domain, 'localhost') !== false || $domain === '127.0.0.1') {
            $domain = 'www.escapegame.cz';
        }
        $siteUrl = 'https://' . $domain;

        // Výchozí prázdná struktura (fallback pokud API selže)
        $data = [
            'propertyId'        => $propertyId,
            'startDate'         => $startDate,
            'endDate'           => $endDate,
            'overview'          => [],
            'trend'             => [],
            'devices'           => [],
            'sources'           => [],
            'topPages'          => [],
            'geo'               => [],
            'browsers'          => [],
            'screenResolutions' => [],
            'realtime'          => [],
            'searchConsole'     => [],
            'diffs'             => [],
            'error'             => null,
        ];

        try {
            $keyDir  = APPLICATION_PATH . '/../data/keys/googleapi/';
            $service = new AnalyticsService(
                $keyDir . 'service-account-credentials.json',
                $keyDir . 'oauth_token.json',
                $keyDir . 'client_secret.json'
            );

            // GA4
            try {
                $analytics = $service->getAnalyticsReport($propertyId, $startDate, $endDate);
                $data['overview']          = $analytics['overview'];
                $data['trend']             = $analytics['trend'];
                $data['devices']           = $analytics['devices'];
                $data['sources']           = $analytics['sources'];
                $data['topPages']          = $analytics['topPages'];
                $data['geo']               = $analytics['geo'];
                $data['browsers']          = $analytics['browsers'];
                $data['screenResolutions'] = $analytics['screenResolutions'];
                $data['newReturning']      = $analytics['newReturning'];
                $data['landingPages']      = $analytics['landingPages'];
                $data['realtime']          = $analytics['realtime'];

                // % změna vůči předchozímu období
                foreach ($data['overview']['current'] ?? [] as $k => $v) {
                    $prev = $data['overview']['previous'][$k] ?? 0;
                    if (is_numeric($v) && $prev > 0) {
                        $data['diffs'][$k] = round((($v - $prev) / $prev) * 100);
                    }
                }
            } catch (Exception $e) {
                $data['error'] = 'GA4: ' . $e->getMessage();
            }

            // Search Console
            try {
                $data['searchConsole'] = $service->getSearchConsoleData($siteUrl, $startDate, $endDate);
            } catch (Exception $e) {
                $msg = 'GSC: ' . $e->getMessage();
                $data['error'] = $data['error'] ? $data['error'] . ' | ' . $msg : $msg;
            }

        } catch (Exception $e) {
            $data['error'] = $e->getMessage();
        }

        $this->renderLatte([
            'baseUrl'       => $baseUrl,
            'propertyId'    => $propertyId,
            'startDate'     => $startDate,
            'endDate'       => $endDate,
            // Celá data jako JSON → window.__DATA__ v Latte šabloně
            'analyticsJson' => json_encode($data, JSON_HEX_TAG | JSON_HEX_AMP),
        ]);
    }

    /**
     * JSON API endpoint – volitelné, užitečné pro debug nebo budoucí AJAX.
     * URL: /admin/analytics/data?propertyId=...&startDate=...&endDate=...
     */
    public function dataAction() {
        $this->_helper->viewRenderer->setNoRender(true);
        $this->getResponse()->setHeader('Content-Type', 'application/json');

        $eshop    = Common_Model_Eshop::getFirstEshop();
        $settings = $eshop->settings;

        $propertyId = $this->getParam('propertyId', $settings->AnalyticsCode ?: '57151035');
        $domain     = $eshop->URL ?: $eshop->domain ?: 'www.escapegame.cz';
        if (strpos($domain, 'localhost') !== false || $domain === '127.0.0.1') {
            $domain = 'www.escapegame.cz';
        }
        $siteUrl   = 'https://' . $domain;
        $startDate = $this->getParam('startDate', date('Y-m-d', strtotime('-30 days')));
        $endDate   = $this->getParam('endDate', date('Y-m-d'));

        $result = [
            'propertyId'        => $propertyId,
            'siteUrl'           => $siteUrl,
            'startDate'         => $startDate,
            'endDate'           => $endDate,
            'overview'          => [],
            'trend'             => [],
            'devices'           => [],
            'sources'           => [],
            'topPages'          => [],
            'geo'               => [],
            'browsers'          => [],
            'screenResolutions' => [],
            'realtime'          => [],
            'searchConsole'     => [],
            'diffs'             => [],
            'error'             => null,
        ];

        try {
            $keyDir  = APPLICATION_PATH . '/../data/keys/googleapi/';
            $service = new AnalyticsService(
                $keyDir . 'service-account-credentials.json',
                $keyDir . 'oauth_token.json',
                $keyDir . 'client_secret.json'
            );

            try {
                $analytics = $service->getAnalyticsReport($propertyId, $startDate, $endDate);
                $result['overview']          = $analytics['overview'];
                $result['trend']             = $analytics['trend'];
                $result['devices']           = $analytics['devices'];
                $result['sources']           = $analytics['sources'];
                $result['topPages']          = $analytics['topPages'];
                $result['geo']               = $analytics['geo'];
                $result['browsers']          = $analytics['browsers'];
                $result['screenResolutions'] = $analytics['screenResolutions'];
                $result['newReturning']      = $analytics['newReturning'];
                $result['landingPages']      = $analytics['landingPages'];
                $result['realtime']          = $analytics['realtime'];

                foreach ($result['overview']['current'] ?? [] as $k => $v) {
                    $prev = $result['overview']['previous'][$k] ?? 0;
                    if (is_numeric($v) && $prev > 0) {
                        $result['diffs'][$k] = round((($v - $prev) / $prev) * 100);
                    }
                }
            } catch (Exception $e) {
                $result['error'] = 'GA4: ' . $e->getMessage();
            }

            try {
                $result['searchConsole'] = $service->getSearchConsoleData($siteUrl, $startDate, $endDate);
            } catch (Exception $e) {
                $msg = 'GSC: ' . $e->getMessage();
                $result['error'] = $result['error'] ? $result['error'] . ' | ' . $msg : $msg;
            }

        } catch (Exception $e) {
            $result['error'] = $e->getMessage();
        }

        echo json_encode($result);
    }
}
