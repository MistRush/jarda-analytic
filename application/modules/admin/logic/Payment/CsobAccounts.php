<?php

namespace admin\logic\Payment;

use Common_Model_Eshop as EshopModel;

class CsobAccounts {

    private const ACCOUNTS = [
        'test' => [
            EshopModel::HADEX_CZ_ID => [
                'MerchantID' => 'A55612ZaNu',
                'PrivateKeyPath' => APPLICATION_PATH.'/../data/cert/csob/rsa_A55612ZaNu.key',
                'PublicKeyPath' => APPLICATION_PATH.'/../data/cert/csob/mips_iplatebnibrana.csob.cz.pub',
            ],
        ],

        'production' => [
            EshopModel::HADEX_CZ_ID => [
                'MerchantID' => '',
                'PrivateKeyPath' => 'path/to/my/private/key/file.key',
                'PublicKeyPath' => APPLICATION_PATH.'/../data/cert/csob/mips_platebnibrana.csob.cz.pub',
            ],
        ],
        'empty' => [
            'MerchantID' => '',
            'PrivateKeyPath' => '',
            'PublicKeyPath' => '',
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