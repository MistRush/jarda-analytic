<?php
namespace admin\logic\Order;

use Admin_Model_Address as Address;
use Admin_Model_Payment as Payment;
use common\logic\Languages;

class PohodaExport {

    private $orders;

    private $ico = "09818774";
    private $ver = "2.0";
    private $app = "Jolanda";
    private $order_prefix = "obj-";
    private $xmlns_dat = "http://www.stormware.cz/schema/version_2/data.xsd";
    private $xmlns_ord = "http://www.stormware.cz/schema/version_2/order.xsd";
    private $xmlns_typ = "http://www.stormware.cz/schema/version_2/type.xsd";
    private $langID;
    private $roundingDocument = 'math2one';
    private $orderType = 'receivedOrder';

    /**
     * Constructor
     * 
     * @param array $orders
     */
    public function __construct($orders) {
        $this->orders = $orders;
        $this->langID = Languages::getLangID();
    }

    private function getLayout() {
        $note = count($this->orders)?'Import objednavek':'Zadne objednavky k importu';
        $html = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<dat:dataPack xmlns:dat="{$this->xmlns_dat}" xmlns:ord="{$this->xmlns_ord}" xmlns:typ="{$this->xmlns_typ}" id="{$this->order_prefix}002" ico="{$this->ico}" application="{$this->app}" version="{$this->ver}" note="{$note}">
XML;

        if (count($this->orders)) {
            foreach ( $this->orders as $order) {
                $this->langID = $order->eshop->Language_ID;

                $html .= <<<XML

    <dat:dataPackItem id="{$order['OrderNumber']}" version="{$this->ver}">
        <ord:order version="{$this->ver}">
{$this->getOrderHeader($order)}
{$this->getOrderDetail($order)}
{$this->getOrderSummary($order)}
        </ord:order>
    </dat:dataPackItem>

XML;
            }
        } else {
            $html .= <<<XML

    <dat:dataPackItem version="{$this->ver}" id="-1">
        <ord:order version="{$this->ver}">
            <!-- Nothing to importing. Empty XML -->
        </ord:order>
    </dat:dataPackItem>

XML;
        }

        $html .= "</dat:dataPack>";

        return $html;
    }

    private function getOrderHeader($order) {
        $addresses = $order['InvoiceAddress_ID']>0?$this->getOrderAddress($order):'';
        $date = date('Y-m-d');

        return <<<XML
            <ord:orderHeader>
                <ord:orderType>{$this->orderType}</ord:orderType>
                <ord:numberOrder>{$order['OrderNumber']}</ord:numberOrder>
                <ord:date>{$date}</ord:date>
                <ord:dateFrom>{$date}</ord:dateFrom>
                <ord:dateTo>{$date}</ord:dateTo>

{$addresses}
{$this->getHeaderMoss($order)}
{$this->getPaymentType($order)}
            </ord:orderHeader>
XML;
    }

    private function getOrderAddress($o): string
    {
        $address = $o->invoiceAddress;

        return <<<XML
                <ord:partnerIdentity>
                    <typ:address>
                        <typ:company>{$address['CompanyName']}</typ:company>
                        <typ:name>{$address->getFullName()}</typ:name>
                        <typ:city>{$address['City']}</typ:city>
                        <typ:street>{$address->getFullStreet()}</typ:street>
                        <typ:zip>{$address['ZipCode']}</typ:zip>
                        <typ:ico>{$address['IC']}</typ:ico>
                        <typ:dic>{$address['DIC']}</typ:dic>
                        <typ:phone>{$address->getPhone()}</typ:phone>
                        <typ:email>{$address['Email']}</typ:email>
                        <typ:country>
                            <typ:ids>{$address->getCountryCode()}</typ:ids>
                        </typ:country>
                    </typ:address>
{$this->getDeliveryAddress($o)}
                </ord:partnerIdentity>
XML;
    }

    private function getDeliveryAddress(\Admin_Model_Order $o): string {
        $address = $o->DeliveryAddress_ID ? $o->deliveryAddress : $o->invoiceAddress;
        $invoiceAddress = $o->invoiceAddress;


        return <<<XML
                    <typ:shipToAddress>
                        <typ:company>{$address['CompanyName']}</typ:company>
                        <typ:name>{$address->getFullName()}</typ:name>
                        <typ:city>{$address['City']}</typ:city>
                        <typ:street>{$address->getFullStreet()}</typ:street>
                        <typ:zip>{$address['ZipCode']}</typ:zip>
                        <typ:phone>{$invoiceAddress->getPhone()}</typ:phone>
                        <typ:email>{$invoiceAddress['Email']}</typ:email>                        
                    </typ:shipToAddress>
XML;
    }

    private function getPaymentType($order) {
        $paymentType = 'příkazem';

        if ( $order->payment->Type == Payment::TYPE_BANK )
            $paymentType = 'příkazem';

        if ( $order->payment->Type == Payment::TYPE_GOPAY )
            $paymentType = 'Plat.kartou';

        if ( $order->payment->Type == Payment::TYPE_CASH || $order->payment->Type == Payment::TYPE_COD )
            $paymentType = 'Dobírkou';

        return <<<XML
                <ord:paymentType>
                    <typ:ids>{$paymentType}</typ:ids>
                    <typ:paymentType>draft</typ:paymentType>
                </ord:paymentType>
XML;
    }

    private function getOrderDetail($order) {
        return <<<XML
            <ord:orderDetail>
{$this->getOrderItems($order)}
{$this->getPayment($order)}
{$this->getShipping($order)}
            </ord:orderDetail>
XML;
    }

    private function getOrderItems($order) {
        $xml = "";

        foreach ($order->orderItems as $item) {
            $vat = $order->Eshop_ID == 1?21:20;
            $text = $item->product->getLang($this->langID)->Name;
            $price = $item->PriceWithoutVat;
            $code = $item->product->Code;

            $xml .= <<<XML
                <ord:orderItem>
                    <ord:text><![CDATA[{$text}]]></ord:text>
                    <ord:note></ord:note>
                    <ord:code>{$code}</ord:code>
                    <ord:quantity>{$item['Quantity']}</ord:quantity>
                    <ord:payVAT>false</ord:payVAT>
                    <ord:rateVAT>high</ord:rateVAT>                    
                    <ord:stockItem>
                        <typ:store>
                            <typ:ids>{$item->product->PohodaStock}</typ:ids>
                        </typ:store>
                        <typ:stockItem>
                            <typ:ids>{$code}</typ:ids>
                        </typ:stockItem>
                    </ord:stockItem>
{$this->getItemPrice($price, $order->Eshop_ID)}
{$this->getItemMoss($order->Eshop_ID)}
                </ord:orderItem>
XML;
        }

        return $xml;
    }

    private function getOrderSummary($o) {
        return <<<XML
            <ord:orderSummary>
                <ord:roundingDocument>{$this->roundingDocument}</ord:roundingDocument>
{$this->formatCurrency($o)}
            </ord:orderSummary>
XML;
    }

    private function formatCurrency($order) {
        if ($order->Eshop_ID == \Common_Model_Eshop::HADEX_CZ_ID)
            return '';

        return <<<XML
                <ord:foreignCurrency>
                    <typ:currency>
                        <typ:ids>{$order->eshop->currency->Label}</typ:ids>
                    </typ:currency>
                </ord:foreignCurrency>
XML;
    }

    private function getPayment($order) {
        $vat = $order->Eshop_ID == 1?21:20;
        $price = $order['PricePaymentWithoutVat'];

        $pohodaCode = '';
        if ( $order['payment']['PohodaCode'] ) {
            $pohodaCode = '
<ord:code>' . $order['payment']['PohodaCode'] . '</ord:code>
<ord:stockItem>
    <typ:store>
        <typ:id>01</typ:id>
    </typ:store>
    <typ:stockItem>
        <typ:ids>' . $order['payment']['PohodaCode'] . '</typ:ids>
    </typ:stockItem>
</ord:stockItem>       
';
        }

            return <<<XML
                    <ord:orderItem>
                        <ord:text><![CDATA[{$order['payment']['Name']}]]></ord:text>
                        <ord:quantity>1</ord:quantity>
                        <ord:payVAT>false</ord:payVAT>
                        <ord:rateVAT>high</ord:rateVAT>
{$this->getItemPrice($price, $order->Eshop_ID)}
{$this->getItemMoss($order->Eshop_ID)}
$pohodaCode
                    </ord:orderItem>
XML;
    }

    private function getShipping($order) {
        $vat = $order->Eshop_ID == 1?21:20;
        $vat = $order->WithoutVat?0:$vat;
        $price = $order['PriceShippingWithoutVat'];

        $pohodaCode = '';
        if ( $order['shipping']['PohodaCode'] ) {
            $pohodaCode = '
<ord:code>' . $order['shipping']['PohodaCode'] . '</ord:code>
<ord:stockItem>
    <typ:store>
        <typ:id>01</typ:id>
    </typ:store>
    <typ:stockItem>
        <typ:ids>' . $order['shipping']['PohodaCode'] . '</typ:ids>
    </typ:stockItem>
</ord:stockItem>           
';
        }

        return <<<XML
                    <ord:orderItem>
                        <ord:text><![CDATA[{$order['shipping']['Name']}]]></ord:text>
                        <ord:quantity>1</ord:quantity>
                        <ord:payVAT>false</ord:payVAT>
                        <ord:rateVAT>high</ord:rateVAT>
{$this->getItemPrice($price, $order->Eshop_ID)}
{$this->getItemMoss($order->Eshop_ID)}
{$pohodaCode}
                    </ord:orderItem>
XML;
    }

    /**
     * Vratí OSS režim u produktů
     * @param $eshop_ID
     * @return string
     */
    private function getItemMoss($eshop_ID): string {
        if ($eshop_ID == \Common_Model_Eshop::HADEX_CZ_ID)
            return "";

        return <<<XML
                        <ord:typeServiceMOSS>
                            <typ:ids>GD</typ:ids>
                        </ord:typeServiceMOSS>
XML;
    }

    /**
     * Vratí cenu s typem měny
     * @param $price
     * @param $eshop_ID
     * @return string
     */
    private function getItemPrice($price, $eshop_ID): string {
        if ($eshop_ID == \Common_Model_Eshop::HADEX_CZ_ID) {
            return <<<XML
                    <ord:homeCurrency>
                        <typ:unitPrice>{$price}</typ:unitPrice>
                    </ord:homeCurrency>
XML;
        } else {
            return <<<XML
                    <ord:foreignCurrency>
                        <typ:unitPrice>{$price}</typ:unitPrice>
                    </ord:foreignCurrency>
XML;
        }
    }

    /**
     * Vratí OSS režim u produktů
     * @param $order
     * @return string
     */
    private function getHeaderMoss($order): string {
        //if ($order->Eshop_ID == \Common_Model_Eshop::VAMOT_CZ_ID)
            return "";

        $moss = $order->DeliveryAddress_ID&&$order->deliveryAddress->Country_ID?$order->deliveryAddress->cCountry->Code2:$order->invoiceAddress->cCountry->Code2;

        return <<<XML
                <ord:MOSS>
                    <typ:ids>{$moss}</typ:ids>
                </ord:MOSS>
                <ord:evidentiaryResourcesMOSS>
                    <typ:ids>G</typ:ids>
                </ord:evidentiaryResourcesMOSS>
XML;
    }

    public function printXML(bool $setHeader = true) {
        if ($setHeader)
            header('Content-Type: application/xml; charset=utf-8');
        echo $this->getLayout();
    }

    public function exportXML() {
        $layout = $this->getLayout();
        header('Content-Type: application/xml; charset=utf-8');
        echo $layout;
        header("Content-Transfer-Encoding: Binary");
        header("Content-disposition: attachment; filename=\"" . 'orders.xml' . "\"");
    }

}