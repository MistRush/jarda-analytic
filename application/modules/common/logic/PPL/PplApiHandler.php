<?php

namespace common\logic\PPL;

use Admin_Model_Currency;
use Admin_Model_Order;
use common\logic\Configs;
use common\logic\Eshop\Eshop;
use common\logic\Latte\LatteEngine;
use Exception;
use Salamek\PplMyApi\Api as PplApi;
use Salamek\PplMyApi\Enum\Country;
use Salamek\PplMyApi\Enum\Currency;
use Salamek\PplMyApi\Enum\Depo;
use Salamek\PplMyApi\Enum\Product;
use Salamek\PplMyApi\Exception\OfflineException;
use Salamek\PplMyApi\Exception\SecurityException;
use Salamek\PplMyApi\Exception\WrongDataException;
use Salamek\PplMyApi\Model\CityRouting;
use Salamek\PplMyApi\Model\Package;
use Salamek\PplMyApi\Model\PackageNumberInfo;
use Salamek\PplMyApi\Model\PaymentInfo;
use Salamek\PplMyApi\Model\Recipient;
use Salamek\PplMyApi\Model\Sender;
use Salamek\PplMyApi\Model\SpecialDelivery;
use Salamek\PplMyApi\PdfLabel;
use Salamek\PplMyApi\Tools;

class PplApiHandler {

    /**
     * @throws OfflineException
     * @throws SecurityException
     * @throws WrongDataException
     * @throws Exception
     */
    public static function sendOrderToPPL(Admin_Model_Order $order): Package | string {
        $eshop = Eshop::getInstance();
        $authorization = self::getAuthorization();
        if ($order['payment']['Type'] === \Admin_Model_Payment::TYPE_COD) {
            $cod = true;
        } else {
            $cod = false;
        }

        $pplMyApi = new PplApi($authorization['Username'], $authorization['Password'], $authorization['CustomerID']);
        $deliveryAddress = $order->deliveryAddress ?? $order->invoiceAddress;
        $currencyMark = Admin_Model_Currency::getCurrencyByID($order['Currency_ID'])['Mark'];

        if ($cod) {
            if($deliveryAddress->Country_ID == \Common_Model_Country::CZ_ID) {
                $packageProductType = Product::PPL_PARCEL_CZ_PRIVATE_COD;
            }

            if($deliveryAddress->Country_ID == \Common_Model_Country::SK_ID) {
                $packageProductType = Product::EXPORT_PACKAGE_COD;
            }

            $cashOnDeliveryCurrency = $currencyMark;

            $cashOnDeliveryPrice = $order['PriceTotalWithVat']; // COD price
            $cashOnDeliveryVariableSymbol = $order['OrderNumber'];
            $paymentInfo = new PaymentInfo($cashOnDeliveryPrice, $cashOnDeliveryCurrency, $cashOnDeliveryVariableSymbol);
        } else {
            if($deliveryAddress->Country_ID == \Common_Model_Country::CZ_ID) {
                $packageProductType = Product::PPL_PARCEL_CZ_PRIVATE;
            }
            if($deliveryAddress->Country_ID == \Common_Model_Country::SK_ID) {
                $packageProductType = Product::EXPORT_PACKAGE;
            }
        }

        $recipient = [
            'name' => $deliveryAddress->FirstName.' '. $deliveryAddress->LastName,
            'country' => \Common_Model_Country::getCountryByID($deliveryAddress->Country_ID)->Code2,
            'city' => $deliveryAddress->City,
            'street' => $deliveryAddress->Street,
            'zipCode' => $deliveryAddress->ZipCode,
            'email' => $order->invoiceAddress->Email,
            'phone' => $order->invoiceAddress->Phone,
        ];

        $sender = [
            'name' => $eshop->getSettings('ProjectName'),
            'country' => Country::CZ,
            'city' => $eshop->getSettings('AddressCity'),
            'street' =>  $eshop->getSettings('AddressStreet'),
            'zipCode' => $eshop->getSettings('AddressZipCode'),
            'email' => $eshop->getSettings('ContactEmail'),
            'phone' => $eshop->getSettings('ContactPhone'),
        ];

        if($order->PPL_ID) {
            $specialDelivery = new SpecialDelivery($order->PPL->PickupPlaceCode);
        } else {
            $specialDelivery = null;
        }

        if($specialDelivery) {
            $parcelShopDetail = $pplMyApi->getParcelShops($order->PPL->PickupPlaceCode);
            $recipientPPL = new Recipient($parcelShopDetail->City, $parcelShopDetail->Name, $parcelShopDetail->Street, $parcelShopDetail->ZipCode, $recipient['email'], $recipient['phone'], $recipient['name'], $parcelShopDetail->Country, $parcelShopDetail->Name2);
        } else {
            $recipientPPL = new Recipient($recipient['city'], $recipient['name'], $recipient['street'], $recipient['zipCode'], $recipient['email'], $recipient['phone'], null, $recipient['country']);
        }
        $senderPPL = new Sender($sender['city'], $sender['name'], $sender['street'], $sender['zipCode'], $sender['email'], $sender['phone'], null, $sender['country']);

        $cityRoutingResponse = $pplMyApi->getCitiesRouting($recipient['country'], null, $recipient['zipCode'], $recipient['street']);

        if (is_array($cityRoutingResponse) && !empty($cityRoutingResponse)) {
            $cityRoutingResponse = $cityRoutingResponse[0];
        }

        if (!isset($cityRoutingResponse->RouteCode) || !isset($cityRoutingResponse->DepoCode) || !isset($cityRoutingResponse->Highlighted)) {
            throw new Exception('Štítek PPL se nepodařilo vytisknout, chybí Routing, pravděpodobně neplatná adresa!');
        }

        $cityRouting = new CityRouting(
            $cityRoutingResponse->RouteCode,
            $cityRoutingResponse->DepoCode,
            $cityRoutingResponse->Highlighted
        );

        $packageSeriesNumberId = $order['ID'];
        $packageNumberInfo = new PackageNumberInfo($packageSeriesNumberId, $packageProductType,  $cityRoutingResponse->DepoCode, $cod);
        $packageNumber = self::generatePackageNumber($packageNumberInfo);

        $package = new Package($packageNumber, $packageProductType, '', $recipientPPL, $cityRouting, $senderPPL, null, $specialDelivery, $paymentInfo??null);

        try {
            $pplMyApi->createPackages([$package]);
            $rawPdf = PdfLabel::generateLabels([$package]);
            file_put_contents(APPLICATION_PATH.'/../data/ppl/labels/'.$package->getPackageNumber() . '.pdf', $rawPdf);
            return $package->getPackageNumber();
        }
        catch (\Exception $e) {
            return $e->getMessage() . PHP_EOL;
        }
    }

    /**
     * @throws Exception
     */
    public static function getLabels(array $packetIDs) {
        $input_xml = self::getTemplate($packetIDs, 'packetsLabelsPdf');
        $responseXml = self::sendRequest($input_xml);
        $xml = simplexml_load_string($responseXml, "SimpleXMLElement", LIBXML_NOCDATA);
        $responseArray = json_decode(json_encode($xml), TRUE);
        if ($responseArray['status'] !== 'ok') {
            throw new Exception($responseArray['fault'] . ' ' . $responseArray['string']);
        } else {
            return $responseArray['result'];
        }
    }

    private static function getAuthorization() {
        return Configs::getApiPPLCredentials();
    }

    private static function generatePackageNumber($packageNumberInfo) {
        return \Admin_Model_PPLPackageNrSettings::getPackageNumber($packageNumberInfo->getProductType());
    }
}