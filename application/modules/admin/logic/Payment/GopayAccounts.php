<?php

namespace admin\logic\Payment;

use Common_Model_Eshop as EshopModel;

class GopayAccounts {

    private const ACCOUNTS = [
        'test' => [
            EshopModel::HADEX_CZ_ID => [
                'GoID' => '8665547220',
                'SecureKey' => '8BZUr7BHZyJfG8d2zCPrMStZ',
                'ClientID' => '1922952053',
                'ClientSecret' => 'KLp5wkxa'
            ],
        ],

        'production' => [
            EshopModel::HADEX_CZ_ID => [
                'GoID' => '8436851390',
                'SecureKey' => '',
                'ClientID' => '1290720310',
                'ClientSecret' => 'ne82XYFE'
            ],
        ],
        'empty' => [
            'GoID' => '8665547220',
            'SecureKey' => '8BZUr7BHZyJfG8d2zCPrMStZ',
            'ClientID' => '1922952053',
            'ClientSecret' => 'KLp5wkxa'
        ]
    ];

    /**
     * Vrací přihlašovací údaje
     * @param int $Eshop_ID
     * @param bool $isProductionMode
     * @return mixed
     */
    public static function get(int $Eshop_ID, bool $isProductionMode = false) {
        return self::ACCOUNTS[$isProductionMode?'production':'test'][$Eshop_ID]??self::ACCOUNTS['empty'];
    }
}