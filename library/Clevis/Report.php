<?php

/**
 * Class that manages reports
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Report {

    /**
     * Get report script url
     *
     * @return string
     */
    public static function getReportScriptUrl() {
        $url = 'http://';
        $url .= $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'] . '/';
        $url .= Zend_Controller_Front::getInstance()->getBaseUrl();
        $url .= 'clevis/cgi-bin/report.cgi';
        return $url;
    }

    /**
     * Generate report
     * 
     * @param string $reportXml
     * @param string $reportData
     * @param string $reportType
     * @return string generated report
     */
    public static function generate($report,$data,$type) {
        // Get url of report script
        $url = Clevis_Report::getReportScriptUrl();

        // Create http client
        $httpClient = new Zend_Http_Client($url);
        $httpClient->setMethod(Zend_Http_Client::POST);
        $httpClient->setConfig(array('maxredirects' => 0,'timeout' => 30));

        // Set POST parameters
        $httpClient->setParameterPost('report',base64_encode($report));
        $httpClient->setParameterPost('data',base64_encode($data));
        $httpClient->setParameterPost('type',$type);

        // Make POST request
        $response = $httpClient->request();

        // Get report
        $report = array();
        $report['content-type'] = $response->getHeader('Content-type');
        $report['content'] = $response->getBody();

        return $report;
    }
}
?>