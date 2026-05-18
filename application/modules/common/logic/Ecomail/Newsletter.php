<?php
namespace common\logic\Ecomail;

use Exception;
use Zend_Json_Exception;

class Newsletter
{
    const NEWSLETTER_LIST_ID = 3;
    const AFTER_ORDER_LIST_ID = 4;

    /**
     * @throws Zend_Json_Exception
     * @throws Exception
     */
    public static function addNewEmailContactToNewsletterList(string $contactEmail, ?string $listID = null): void
    {
        if(!$listID)
            $listID = self::NEWSLETTER_LIST_ID;

        $api = new Requester();
        if ($listID) {
            $subscriberDetails = [
                'subscriber_data' => [
                    'email' => $contactEmail
                ],
                'trigger_autoresponders'=> true
            ];
            $api->buildRequest('/lists/'.self::NEWSLETTER_LIST_ID.'/subscribe', 'POST', data: $subscriberDetails);
        }
    }

    public static function addNewEmailContactToAfterOrderList(?string $contactEmail, ?string $listID = null): void
    {
        if(!$contactEmail) {
            return;
        }

        if(!$listID)
            $listID = self::AFTER_ORDER_LIST_ID;
        $api = new Requester();
        if ($listID) {
            $subscriberDetails = [
                'subscriber_data' => [
                    'email' => $contactEmail
                ],
                'trigger_autoresponders'=> true
            ];
            $api->buildRequest('/lists/'.self::AFTER_ORDER_LIST_ID.'/subscribe', 'POST', data: $subscriberDetails);
        }
    }

}