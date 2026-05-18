<?php
namespace common\logic\Ecomail;

use common\logic\Configs;
use Exception;
use Zend_Json;
use Zend_Json_Exception;

class Requester {
    private ?string $authToken = null;

    /**
     * @throws Zend_Json_Exception
     * @throws Exception
     */

    public function __construct() {
        $this->authToken = Configs::getEcomailApiKey();
    }

    /**
     * @throws Zend_Json_Exception
     * @throws Exception
     */
    public function buildRequest($action, $requestType, $queryParams = null, $data = null ): array
    {
        $requestResult = $this->requestBuilder($action, $requestType, $queryParams, $data);
        if(is_string($requestResult)) {
            return Zend_Json::decode($requestResult);
        } else {
            throw new Exception('Wrong API request type! Make sure that you mentioned POST or GET in the request');
        }
    }

    /**
     * @throws Exception
     */
    private function requestBuilder(string $action, $requestType, array $queryParams = null, array $data = null): string|bool
    {
        $ch = curl_init();
        $headers = $this->getRequestHeaders($this->authToken);
        if($requestType === "GET") {
            if($queryParams)
                $url = Configs::getEcomailBasicApiEndpoint(). $action. '?' . http_build_query($queryParams);
            else
                $url = Configs::getEcomailBasicApiEndpoint(). $action;
        } elseif($requestType === "POST") {
            $payload = json_encode($data);
            $url = Configs::getEcomailBasicApiEndpoint(). $action;
            curl_setopt( $ch, CURLOPT_POSTFIELDS, $payload );
        } else {
            return false;
        }
        curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_URL, $url);
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }

    private function getRequestHeaders($authorizationToken = null): array
    {
        $header = array();
        $header[] = 'Content-type: application/json';
        if($authorizationToken) {
            $header[] = 'key:'.$authorizationToken;
        }
        return $header;
    }
}