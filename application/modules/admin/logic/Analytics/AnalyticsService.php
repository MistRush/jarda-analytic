<?php

namespace admin\logic\Analytics;

use MiladRahimi\Jwt\Generator;
use MiladRahimi\Jwt\Cryptography\Algorithms\Rsa\RS256Signer;
use MiladRahimi\Jwt\Cryptography\Keys\RsaPrivateKey;

/**
 * Service pro napojení na Google Analytics 4 a Search Console.
 * Implementováno bez nutnosti instalovat nové PHP knihovny (využívá stávající JWT knihovnu v projektu).
 */
class AnalyticsService {

    private $credentials;
    private $oauthToken = null;
    private $clientSecret = null;
    private $accessToken = null;

    public function __construct($credentialsPath, $oauthTokenPath = null, $clientSecretPath = null) {
        if (file_exists($credentialsPath)) {
            $this->credentials = json_decode(file_get_contents($credentialsPath), true);
        }
        
        if ($oauthTokenPath && file_exists($oauthTokenPath)) {
            $this->oauthToken = json_decode(file_get_contents($oauthTokenPath), true);
        }
        
        if ($clientSecretPath && file_exists($clientSecretPath)) {
            $this->clientSecret = json_decode(file_get_contents($clientSecretPath), true);
        }
    }

    /**
     * Získá Access Token od Googlu (prioritně OAuth2, pak Service Account)
     */
    public function getAccessToken() {
        if ($this->accessToken) return $this->accessToken;

        // 1. Priorita: OAuth2 (pokud máme refresh token)
        if ($this->oauthToken && isset($this->oauthToken['refresh_token'])) {
            return $this->refreshOAuthToken();
        }

        // 2. Fallback: Service Account
        if ($this->credentials) {
            return $this->getServiceAccountToken();
        }

        throw new \Exception("Chybí autentizační údaje (JSON klíče).");
    }

    private function refreshOAuthToken() {
        $url = "https://oauth2.googleapis.com/token";
        $client = $this->clientSecret['installed'] ?? $this->clientSecret['web'];
        
        $body = [
            'client_id' => $client['client_id'],
            'client_secret' => $client['client_secret'],
            'refresh_token' => $this->oauthToken['refresh_token'],
            'grant_type' => 'refresh_token'
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($body));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
        $response = json_decode(curl_exec($ch), true);
        curl_close($ch);

        if (isset($response['access_token'])) {
            $this->accessToken = $response['access_token'];
            return $this->accessToken;
        }

        throw new \Exception("Chyba při obnově OAuth2 tokenu: " . ($response['error_description'] ?? 'Neznámá chyba'));
    }

    private function getServiceAccountToken() {
        $now = time();
        $payload = [
            'iss' => $this->credentials['client_email'],
            'scope' => 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly',
            'aud' => 'https://oauth2.googleapis.com/token',
            'iat' => $now,
            'exp' => $now + 3600
        ];

        // Podepsání JWT pomocí RSA256 (využíváme knihovnu MiladRahimi\Jwt, která je v projektu)
        $signer = new RS256Signer(new RsaPrivateKey($this->credentials['private_key']));
        $generator = new Generator($signer);
        $jwt = $generator->generate($payload);

        // Výměna JWT za Access Token přes cURL
        $ch = curl_init('https://oauth2.googleapis.com/token');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $jwt
        ]));

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $rawResponse = curl_exec($ch);
        $response = json_decode($rawResponse, true);
        $curlError = curl_error($ch);
        curl_close($ch);

        if (isset($response['access_token'])) {
            $this->accessToken = $response['access_token'];
            return $this->accessToken;
        }

        throw new \Exception("Nepodařilo se získat Google Access Token: " . ($response['error_description'] ?? $response['error'] ?? $curlError ?? 'Neznámá chyba') . " Raw: " . $rawResponse);
    }

    /**
     * Zavolá Google API přes cURL
     */
    private function callApi($url, $method = 'GET', $data = null) {
        $ch = curl_init($url);
        $headers = [
            'Authorization: Bearer ' . $this->getAccessToken(),
            'Content-Type: application/json'
        ];

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new \Exception("Google API Error (Status $httpCode): " . $response);
        }

        return json_decode($response, true);
    }

    /**
     * Získá report z GA4 (Data API v1beta)
     */
    public function getAnalyticsReport($propertyId, $startDate, $endDate) {
        $url = "https://analyticsdata.googleapis.com/v1beta/properties/{$propertyId}:runReport";
        $urlRt = "https://analyticsdata.googleapis.com/v1beta/properties/{$propertyId}:runRealtimeReport";
        
        $diff = strtotime($endDate) - strtotime($startDate);
        $diffDays = ceil($diff / (24 * 3600));
        $prevEnd = date('Y-m-d', strtotime($startDate) - 86400);
        $prevStart = date('Y-m-d', strtotime($prevEnd) - ($diffDays * 86400));

        $dateRanges = [
            ['startDate' => $startDate, 'endDate' => $endDate],
            ['startDate' => $prevStart, 'endDate' => $prevEnd]
        ];

        // 1. Agregovaný report (pro karty)
        $bodyAgg = [
            'dateRanges' => $dateRanges,
            'metrics' => [
                ['name' => 'totalUsers'], ['name' => 'sessions'], ['name' => 'bounceRate'],
                ['name' => 'averageSessionDuration'], ['name' => 'screenPageViews'],
                ['name' => 'newUsers'], ['name' => 'ecommercePurchases'], ['name' => 'purchaseRevenue']
            ]
        ];

        // 2. Denní report – dvě oddělená volání (GA4 neumožňuje dateRange jako dimenzi)
        $bodyTrendCurrent = [
            'dateRanges' => [['startDate' => $startDate, 'endDate' => $endDate]],
            'dimensions' => [['name' => 'nthDay'], ['name' => 'date']],
            'metrics'    => [['name' => 'sessions']],
            'orderBys'   => [['dimension' => ['dimensionName' => 'nthDay']]]
        ];
        $bodyTrendPrev = [
            'dateRanges' => [['startDate' => $prevStart, 'endDate' => $prevEnd]],
            'dimensions' => [['name' => 'nthDay'], ['name' => 'date']],
            'metrics'    => [['name' => 'sessions']],
            'orderBys'   => [['dimension' => ['dimensionName' => 'nthDay']]]
        ];

        // 3. Zařízení
        $bodyDevices = [
            'dateRanges' => [['startDate' => $startDate, 'endDate' => $endDate]],
            'dimensions' => [['name' => 'deviceCategory']],
            'metrics' => [['name' => 'sessions']]
        ];

        // 4. Zdroje (Akvizice)
        $bodySources = [
            'dateRanges' => [['startDate' => $startDate, 'endDate' => $endDate]],
            'dimensions' => [['name' => 'sessionDefaultChannelGroup']],
            'metrics' => [
                ['name' => 'sessions'], ['name' => 'engagedSessions'], ['name' => 'engagementRate'],
                ['name' => 'averageSessionDuration'], ['name' => 'conversions']
            ],
            'orderBys' => [['metric' => ['metricName' => 'sessions'], 'desc' => true]],
            'limit' => 10
        ];

        // 5. Top stránky
        $bodyPages = [
            'dateRanges' => [['startDate' => $startDate, 'endDate' => $endDate]],
            'dimensions' => [['name' => 'pagePath'], ['name' => 'hostName']],
            'metrics' => [['name' => 'screenPageViews']],
            'orderBys' => [['metric' => ['metricName' => 'screenPageViews'], 'desc' => true]],
            'limit' => 15
        ];

        // 6. Geografie
        $bodyGeo = [
            'dateRanges' => [['startDate' => $startDate, 'endDate' => $endDate]],
            'dimensions' => [['name' => 'country'], ['name' => 'city']],
            'metrics' => [['name' => 'sessions']],
            'orderBys' => [['metric' => ['metricName' => 'sessions'], 'desc' => true]],
            'limit' => 10
        ];

        // 7. Prohlížeče
        $bodyBrowsers = [
            'dateRanges' => [['startDate' => $startDate, 'endDate' => $endDate]],
            'dimensions' => [['name' => 'browser']],
            'metrics' => [['name' => 'sessions']],
            'orderBys' => [['metric' => ['metricName' => 'sessions'], 'desc' => true]],
            'limit' => 8
        ];

        // 8. Rozlišení
        $bodyScreens = [
            'dateRanges' => [['startDate' => $startDate, 'endDate' => $endDate]],
            'dimensions' => [['name' => 'screenResolution']],
            'metrics' => [['name' => 'sessions']],
            'orderBys' => [['metric' => ['metricName' => 'sessions'], 'desc' => true]],
            'limit' => 8
        ];

        // 9. Realtime
        $bodyRt = [
            'metrics' => [['name' => 'activeUsers']]
        ];
        $bodyRtTrend = [
            'dimensions' => [['name' => 'minutesAgo']],
            'metrics'    => [['name' => 'activeUsers']]
        ];

        // 10. Nový vs Vracíjí cí se
        $bodyNewReturning = [
            'dateRanges' => [['startDate' => $startDate, 'endDate' => $endDate]],
            'dimensions' => [['name' => 'newVsReturning']],
            'metrics'    => [['name' => 'sessions'], ['name' => 'totalUsers']],
        ];

        // 11. Landing pages (vstupní stránky)
        $bodyLanding = [
            'dateRanges' => [['startDate' => $startDate, 'endDate' => $endDate]],
            'dimensions' => [['name' => 'landingPagePlusQueryString']],
            'metrics'    => [['name' => 'sessions'], ['name' => 'bounceRate']],
            'orderBys'   => [['metric' => ['metricName' => 'sessions'], 'desc' => true]],
            'limit'      => 10
        ];

        $aggRes          = $this->callApi($url, 'POST', $bodyAgg);
        $trendCurrentRes = $this->callApi($url, 'POST', $bodyTrendCurrent);
        $trendPrevRes    = $this->callApi($url, 'POST', $bodyTrendPrev);
        $devRes          = $this->callApi($url, 'POST', $bodyDevices);
        $srcRes          = $this->callApi($url, 'POST', $bodySources);
        $pagRes          = $this->callApi($url, 'POST', $bodyPages);
        $geoRes          = $this->callApi($url, 'POST', $bodyGeo);
        $brwRes          = $this->callApi($url, 'POST', $bodyBrowsers);
        $scrRes          = $this->callApi($url, 'POST', $bodyScreens);
        $nvrRes          = $this->callApi($url, 'POST', $bodyNewReturning);
        $landRes         = $this->callApi($url, 'POST', $bodyLanding);
        
        // Realtime (pokud selže, ignorujeme)
        try {
            $rtRes = $this->callApi($urlRt, 'POST', $bodyRt);
            $rtTrendRes = $this->callApi($urlRt, 'POST', $bodyRtTrend);
        } catch (\Exception $e) {
            $rtRes = $rtTrendRes = null;
        }

        return [
            'overview'          => $this->parseReportResponse($aggRes),
            'trend'             => $this->parseTrendResponse($trendCurrentRes, $trendPrevRes, $diffDays),
            'devices'           => $this->parseSimpleResponse($devRes, 'device'),
            'sources'           => $this->parseSourcesResponse($srcRes),
            'topPages'          => $this->parsePagesResponse($pagRes),
            'geo'               => $this->parseGeoResponse($geoRes),
            'browsers'          => $this->parseSimpleResponse($brwRes, 'browser'),
            'screenResolutions' => $this->parseSimpleResponse($scrRes, 'resolution'),
            'newReturning'      => $this->parseNewReturning($nvrRes),
            'landingPages'      => $this->parseLandingResponse($landRes),
            'realtime'          => $this->parseRealtime($rtRes, $rtTrendRes)
        ];
    }

    private function parseSimpleResponse($response, $labelKey) {
        $rows = $response['rows'] ?? [];
        $data = [];
        foreach ($rows as $row) {
            $data[] = [
                $labelKey => $row['dimensionValues'][0]['value'],
                'value' => (int)$row['metricValues'][0]['value']
            ];
        }
        return $data;
    }

    private function parseTrendResponse($currentRes, $prevRes, $diffDays) {
        $current  = array_fill(0, $diffDays + 1, 0);
        $previous = array_fill(0, $diffDays + 1, 0);
        $labels   = array_fill(0, $diffDays + 1, '');

        foreach ($currentRes['rows'] ?? [] as $row) {
            $nthDay  = (int)$row['dimensionValues'][0]['value'];
            $dateStr = $row['dimensionValues'][1]['value'];
            $val     = (int)$row['metricValues'][0]['value'];
            if (isset($current[$nthDay])) {
                $current[$nthDay]  = $val;
                $labels[$nthDay]   = date('d.m.', strtotime($dateStr));
            }
        }

        foreach ($prevRes['rows'] ?? [] as $row) {
            $nthDay = (int)$row['dimensionValues'][0]['value'];
            $val    = (int)$row['metricValues'][0]['value'];
            if (isset($previous[$nthDay])) {
                $previous[$nthDay] = $val;
            }
        }

        return ['labels' => $labels, 'current' => $current, 'previous' => $previous];
    }

    private function parseSourcesResponse($response) {
        $rows = $response['rows'] ?? [];
        $data = [];
        foreach ($rows as $row) {
            $data[] = [
                'channel' => $row['dimensionValues'][0]['value'],
                'sessions' => (int)$row['metricValues'][0]['value'],
                'engagedSessions' => (int)$row['metricValues'][1]['value'],
                'engagementRate' => round($row['metricValues'][2]['value'] * 100, 1),
                'avgDuration' => (int)$row['metricValues'][3]['value'],
                'conversions' => (int)$row['metricValues'][4]['value']
            ];
        }
        return $data;
    }

    private function parsePagesResponse($response) {
        $rows = $response['rows'] ?? [];
        $data = [];
        foreach ($rows as $row) {
            $data[] = [
                'path' => $row['dimensionValues'][0]['value'],
                'host' => $row['dimensionValues'][1]['value'] ?? '',
                'views' => (int)$row['metricValues'][0]['value']
            ];
        }
        return $data;
    }

    private function parseGeoResponse($response) {
        $rows = $response['rows'] ?? [];
        $data = [];
        foreach ($rows as $row) {
            $data[] = [
                'country'  => $row['dimensionValues'][0]['value'],
                'city'     => $row['dimensionValues'][1]['value'],
                'sessions' => (int)$row['metricValues'][0]['value']
            ];
        }
        return $data;
    }

    private function parseNewReturning($response) {
        $rows = $response['rows'] ?? [];
        $result = [];
        foreach ($rows as $row) {
            $type     = $row['dimensionValues'][0]['value']; // 'new' | 'returning'
            $sessions = (int)$row['metricValues'][0]['value'];
            $users    = (int)$row['metricValues'][1]['value'];
            
            $typeName = 'Neznámé';
            if ($type === 'new') $typeName = 'Noví';
            elseif ($type === 'returning') $typeName = 'Vracející se';
            else $typeName = ucfirst($type);

            $result[] = [
                'type'     => $typeName,
                'sessions' => $sessions,
                'users'    => $users,
                'value'    => $sessions
            ];
        }
        return $result;
    }

    private function parseLandingResponse($response) {
        $rows = $response['rows'] ?? [];
        $data = [];
        $total = 0;
        foreach ($rows as $row) {
            $sessions = (int)$row['metricValues'][0]['value'];
            $total += $sessions;
        }
        foreach ($rows as $row) {
            $sessions = (int)$row['metricValues'][0]['value'];
            $data[] = [
                'path'       => $row['dimensionValues'][0]['value'],
                'sessions'   => $sessions,
                'bounceRate' => round($row['metricValues'][1]['value'] * 100, 1),
                'pct'        => $total > 0 ? round($sessions / $total * 100, 1) : 0
            ];
        }
        return $data;
    }

    private function parseRealtime($res, $trendRes) {
        $activeUsers = (int)($res['rows'][0]['metricValues'][0]['value'] ?? 0);
        $trend = array_fill(0, 30, 0);
        $active5min = 0;

        if (isset($trendRes['rows'])) {
            foreach ($trendRes['rows'] as $row) {
                $minAgo = (int)$row['dimensionValues'][0]['value'];
                $val = (int)$row['metricValues'][0]['value'];
                if ($minAgo < 30) $trend[$minAgo] = $val;
                if ($minAgo < 5) $active5min += $val;
            }
        }
        return [
            'activeUsers' => $activeUsers,
            'active5min' => $active5min,
            'trend' => array_reverse($trend)
        ];
    }

    /**
     * Získá data ze Search Console
     */
    public function getSearchConsoleData($siteUrl, $startDate, $endDate) {
        $body = [
            'startDate'  => $startDate,
            'endDate'    => $endDate,
            'dimensions' => ['query'],
            'rowLimit'   => 20
        ];

        $parse = function($res) {
            $rows  = $res['rows'] ?? [];
            $total = array_sum(array_column($rows, 'clicks'));
            return array_map(function($row) use ($total) {
                return [
                    'keys'        => $row['keys'],
                    'clicks'      => (int)$row['clicks'],
                    'impressions' => (int)$row['impressions'],
                    'ctr'         => round($row['ctr'] * 100, 1),
                    'position'    => round($row['position'], 1),
                    'pct'         => $total > 0 ? round($row['clicks'] / $total * 100, 1) : 0
                ];
            }, $rows);
        };

        try {
            $url = "https://www.googleapis.com/webmasters/v3/sites/" . urlencode($siteUrl) . "/searchAnalytics/query";
            $res = $this->callApi($url, 'POST', $body);
            return $parse($res);
        } catch (\Exception $e) {
            try {
                $domainOnly   = str_replace(['https://', 'http://', 'www.'], '', $siteUrl);
                $domainOnly   = rtrim($domainOnly, '/');
                $scDomainUrl  = "https://www.googleapis.com/webmasters/v3/sites/" . urlencode("sc-domain:" . $domainOnly) . "/searchAnalytics/query";
                $res2 = $this->callApi($scDomainUrl, 'POST', $body);
                return $parse($res2);
            } catch (\Exception $e2) {
                throw $e;
            }
        }
    }

    private function parseReportResponse($response) {
        $rows = $response['rows'] ?? [];
        $data = ['current' => [], 'previous' => []];

        if (isset($rows[0])) {
            $data['current'] = [
                'users' => (int)$rows[0]['metricValues'][0]['value'],
                'sessions' => (int)$rows[0]['metricValues'][1]['value'],
                'bounceRate' => round($rows[0]['metricValues'][2]['value'] * 100, 1),
                'avgDuration' => $this->formatSeconds($rows[0]['metricValues'][3]['value']),
                'pageViews' => (int)$rows[0]['metricValues'][4]['value'],
                'newUsers' => (int)$rows[0]['metricValues'][5]['value'],
                'purchases' => (int)$rows[0]['metricValues'][6]['value'],
                'revenue' => round($rows[0]['metricValues'][7]['value'], 2),
            ];
        }

        if (isset($rows[1])) {
            $data['previous'] = [
                'users' => (int)$rows[1]['metricValues'][0]['value'],
                'sessions' => (int)$rows[1]['metricValues'][1]['value'],
                'bounceRate' => round($rows[1]['metricValues'][2]['value'] * 100, 1),
                'avgDuration' => $this->formatSeconds($rows[1]['metricValues'][3]['value']),
                'pageViews' => (int)$rows[1]['metricValues'][4]['value'],
                'newUsers' => (int)$rows[1]['metricValues'][5]['value'],
                'purchases' => (int)$rows[1]['metricValues'][6]['value'],
                'revenue' => round($rows[1]['metricValues'][7]['value'], 2),
            ];
        }

        return $data;
    }

    private function formatSeconds($s) {
        $sec = (int)$s;
        return floor($sec / 60) . 'm ' . ($sec % 60) . 's';
    }
}
