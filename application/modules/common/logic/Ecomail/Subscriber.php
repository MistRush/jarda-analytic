<?php
namespace common\logic\Ecomail;

use Exception;
use Zend_Json_Exception;

class Subscriber
{

    public static function getSubscriberInfo(string $contactEmail): array
    {

        $api = new Requester();
        return $api->buildRequest('/subscribers/'.$contactEmail, 'GET');

    }

}