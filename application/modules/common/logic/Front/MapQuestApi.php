<?php
namespace common\logic\Front;

use Admin_Model_Address as Address;

/**
 * Module constants
 */
class MapQuestApi {

    const SECRET_KEY = 'anPYgkONzW1lgCYFE2TiwoEVTOJBsGK9';

    /**
     * success
     *
     * @var mixed
     */
    private mixed $response;

    /**
     * Constructor
     */
    public function __construct(Address $address) {
        $verifyResponse = file_get_contents('https://www.mapquestapi.com/geocoding/v1/address?key=' . self::SECRET_KEY . '&inFormat=kvp&outFormat=json&location=' . urlencode($address->Street . ' ' . $address->City) . '&thumbMaps=false');
        $this->setResponse(json_decode($verifyResponse, true));
    }

    /**
     * @return mixed
     */
    public function getResponse(): mixed {
        return $this->response;
    }

    /**
     * @param mixed $response
     */
    public function setResponse(mixed $response): void {
        $this->response = $response;
    }
}