<?php

namespace common\logic\Helper;

use Admin_Model_Order as OrderModel;
use common\logic\Email\EmailFactory;
use PHPMailer\PHPMailer\Exception;

class QrPayment {
    const API_URL = "https://api.paylibo.com/paylibo/";

    const ENDPOINT_QR = "generator/image";
    const ENDPOINT_CZECH_QR = "generator/czech/image";

    const TYPE_QR = 'qr';
    const TYPE_CZECH_QR = 'cz-qr';


    const DEFAULT_PARAMS = [
        'iban' => null,
        'bic' => null,
        'amount' => 0,
        'currency' => 'CZK',
        'sendersReference' => '0',
        'identifier' => '0',
        'message' => 'ORDER /VS/0',
        'recipientName' => 'hadex.cz',
        'branding' => false,
        'size' => 1000,
    ];

    /**
     * Vygeneruje QR kód
     * @param OrderModel $order
     * @param string|null $customAccount
     * @return string|null
     * @throws Exception
     */
    public static function generateQrCZx(OrderModel $order, ?string $customAccount = null): ?string
    {
        if (!$order->Payment_ID)
            return null;

        if (!$customAccount) {
            $customAccount = explode('/', $order->payment->BankAccount);
        } else {
            $customAccount = explode('/', $customAccount);
        }

        $accountNumber = trim($customAccount[0]);
        $bankCode = trim($customAccount[1]) ?? null;
        $accountPrefix = explode('-', $accountNumber);
        $accountPrefix = count($accountPrefix) > 1 ? $accountPrefix[0] : null;

        $params = [
            'accountPrefix' => $accountPrefix,
            'accountNumber' => $accountNumber,
            'bankCode' => $bankCode,
            'amount' => ($order->InvoiceAddress_ID && $order->invoiceAddress->DIC) ? $order->PriceTotalWithoutVat : $order->PriceTotalWithVat,
            'currency' => 'CZK',
            'sendersReference' => 'VS' . $order->OrderNumber . '/SS/KS',
            'identifier' => 'VS' . $order->OrderNumber,
            'vs' => $order->OrderNumber,
            'message' => translate('Objednávka', $order->language->Code) . ' VS' . $order->OrderNumber,
            'recipientName' => $order->eshop->Name,
            'branding' => true
        ];

        $url = self::buildUrl($params, self::TYPE_CZECH_QR);
        [$content, $headers] = self::get_content($url);
        if (strpos($headers['Content-Type'] ?? null, 'image/') === false) {
//            EmailFactory::sendError('Chyba při generování QR kódu', json_encode($headers, JSON_PRETTY_PRINT));
            return null;
        }

        return $content;
    }

    /**
     * Vygeneruje URL pro QR platbu
     * @param array|null $params
     * @param string $type
     * @return string
     */
    private static function buildUrl(?array $params = null, string $type = self::TYPE_QR): string {
        $url = self::API_URL;

        switch ($type) {
            case self::TYPE_QR:
                $url .= self::ENDPOINT_QR;
                break;
            case self::TYPE_CZECH_QR:
                $url .= self::ENDPOINT_CZECH_QR;
                break;
        }

        $params = array_merge(self::DEFAULT_PARAMS, $params);

        if (is_array($params) && count($params))
            $url .= '?' . http_build_query($params);

        return $url;
    }

    /**
     * Vrátí pole s obsahem a hlavičkou
     * @param string $url
     * @return array
     */
    private static function get_content(string $url): array {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        curl_setopt($curl, CURLOPT_HEADER, true);
        $result = curl_exec($curl);

        $headerSize = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
        $headerStr = substr($result, 0, $headerSize);
        $bodyStr = substr($result, $headerSize);

        curl_close($curl);

        return [$bodyStr, self::parseHeaders($headerStr)];
    }

    /**
     * Převede hlavičku na array
     * @param string $str
     * @return array
     */
    private static function parseHeaders(string $str): array {
        $headers = [];
        $headersTmpArray = explode("\r\n" , $str);
        for ($i = 0; $i < count($headersTmpArray); ++$i) {
            if (strlen($headersTmpArray[$i]) > 0) {
                if (strpos($headersTmpArray[$i] , ":")) {
                    $headerName = substr($headersTmpArray[$i], 0 , strpos($headersTmpArray[$i], ":"));
                    $headerValue = substr($headersTmpArray[$i], strpos($headersTmpArray[$i], ":")+1);
                    $headers[$headerName] = $headerValue;
                }
            }
        }
        return $headers;
    }
}