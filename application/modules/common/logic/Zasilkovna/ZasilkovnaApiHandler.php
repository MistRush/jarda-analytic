<?php
namespace common\logic\Zasilkovna;

use Admin_Model_Order;
use common\logic\Latte\LatteEngine;
use Exception;

class ZasilkovnaApiHandler {

    const apiPassword = 'e1a9d9a10b2adb23c0f63c97ea93e2ed';
    const apiEndpoint = 'https://www.zasilkovna.cz/api/rest';

    const externalCarrierIDCZ = 106;
    const externalCarrierIDSK = 131;

    /**
     * @param Admin_Model_Order $order
     * @return void
     * @throws Exception
     */
    public static function sendOrderToZasilkovna(Admin_Model_Order $order): string {
        if ($order['payment']['Type'] === \Admin_Model_Payment::TYPE_COD) {
            $cod = true;
        } else {
            $cod = false;
        }
        $order->deliveryAddress = $order->deliveryAddress  ?? $order->invoiceAddress;

        if ($order['Zasilkovna_ID']) {
            $input_xml = self::getTemplate($order,'createPickupPacket', $cod);
        } else {
            if ($order->deliveryAddress->Country_ID == \Common_Model_Country::CZ_ID) {
                $externalCarrierID = self::externalCarrierIDCZ;
            } else {
                $externalCarrierID = self::externalCarrierIDSK;
            }
            $input_xml = self::getTemplate($order,'createDirectPacket', $cod, $externalCarrierID);
        }
        $responseXml = self::sendRequest($input_xml);
        $xml = simplexml_load_string($responseXml, "SimpleXMLElement", LIBXML_NOCDATA);
        $responseArray = json_decode(json_encode($xml),TRUE);

        bdmp($responseArray);
        
        if ($responseArray['status']!== 'ok') {
            throw new Exception($responseArray['fault'].' '. $responseArray['string']);
        } else {
            return $responseArray['result']['id'];
        }
    }

    /**
     * @throws Exception
     */
    public static function getLabels(array $packetIDs) {
        $input_xml = self::getTemplate($packetIDs, 'packetsLabelsPdf');
        $responseXml = self::sendRequest($input_xml);
        $xml = simplexml_load_string($responseXml, "SimpleXMLElement", LIBXML_NOCDATA);
        $responseArray = json_decode(json_encode($xml),TRUE);
        if($responseArray['status']!== 'ok') {
            throw new Exception($responseArray['fault'].' '. $responseArray['string']);
        } else {
            return $responseArray['result'];
        }
    }

    private static function getTemplate($data,$template, $cod = false, $externalCarrierID = null): string {
        return LatteEngine::getInstance()->renderToString(__DIR__ . '/templates/' . $template . '.latte', ['data' => $data, 'cod' => $cod, 'externalCarrierID' => $externalCarrierID, 'apiPassword' => self::apiPassword]);
    }

    /**
     * @param string $input_xml
     * @return void
     */
    private static function sendRequest(string $input_xml): mixed {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL, self::apiEndpoint);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $input_xml);

        $response  = curl_exec($ch);
        if (curl_errno($ch)) {
            $error_msg = curl_error($ch);
        }
        curl_close($ch);
        if (isset($error_msg)) {
            $LogFileHandle = fopen(__DIR__ . "/logs/err" . time() . ".log", "a+");
            fwrite($LogFileHandle, $error_msg);
            fclose($LogFileHandle);
        }
        return $response;
    }
}