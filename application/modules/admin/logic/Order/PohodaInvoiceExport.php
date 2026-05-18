<?php
namespace admin\logic\Order;

use Admin_Model_Address as Address;
use Admin_Model_Payment as Payment;
use common\logic\Languages;

class PohodaInvoiceExport {

    private $orders;

    private $ico = "09818774";
    private $ver = "2.0";
    private $app = "Jolanda";
    private $order_prefix = "obj-";
    private $xmlns_dat = "http://www.stormware.cz/schema/version_2/data.xsd";
    private $xmlns_inv = "http://www.stormware.cz/schema/version_2/invoice.xsd";
    private $xmlns_typ = "http://www.stormware.cz/schema/version_2/type.xsd";
    private $langID;
    private $roundingDocument = 'math2one';
    private $invoiceType = 'issuedInvoice';

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
        $note = count($this->orders)?'Import fa':'Zadne faktury k importu';
        $html = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<dat:dataPack xmlns:dat="{$this->xmlns_dat}" xmlns:inv="{$this->xmlns_inv}" xmlns:typ="{$this->xmlns_typ}" id="{$this->order_prefix}002" ico="{$this->ico}" application="{$this->app}" version="{$this->ver}" note="{$note}">
XML;

        if (count($this->orders)) {
            foreach ( $this->orders as $order) {
                $this->langID = $order->eshop->Language_ID;

                $html .= <<<XML

    <dat:dataPackItem id="{$order['OrderNumber']}" version="{$this->ver}">
        <inv:invoice version="{$this->ver}">
{$this->getInvoiceHeader($order)}
{$this->getInvoiceDetail($order)}
{$this->getInvoiceSummary($order)}
        </inv:invoice>
    </dat:dataPackItem>

XML;
            }
        } else {
            $html .= <<<XML

    <dat:dataPackItem version="{$this->ver}" id="-1">
        <inv:invoice version="{$this->ver}">
            <!-- Nothing to importing. Empty XML -->
        </inv:invoice>
    </dat:dataPackItem>

XML;
        }

        $html .= "</dat:dataPack>";

        return $html;
    }

    private function getInvoiceHeader($order) {
        $addresses = $order['InvoiceAddress_ID']>0?$this->getInvoiceAddress($order):'';
        $date = date('Y-m-d');
        $dueDate = date('Y-m-d', strtotime('+ 14 days'));

        return <<<XML
            <inv:invoiceHeader>
                <inv:invoiceType>{$this->invoiceType}</inv:invoiceType>
                <inv:date>{$date}</inv:date>
                <inv:dateTax>{$date}</inv:dateTax>
                <inv:dateAccounting>{$date}</inv:dateAccounting>
                <inv:dateDue>{$dueDate}</inv:dateDue>
                <inv:accounting>
                    <typ:ids>3FV</typ:ids>
                </inv:accounting>
                <inv:classificationVAT>
                    <typ:classificationVATType>inland</typ:classificationVATType>
                </inv:classificationVAT>
{$addresses}
            <inv:numberOrder>obj {$order['OrderNumber']}</inv:numberOrder>
              <inv:dateOrder>{$date}</inv:dateOrder>
{$this->getPaymentType($order)}
            </inv:invoiceHeader>
XML;
    }

    private function getInvoiceAddress($o): string
    {
        $address = $o->invoiceAddress;

        return <<<XML
                <inv:partnerIdentity>
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
                </inv:partnerIdentity>
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
                <inv:paymentType>
                    <typ:ids>{$paymentType}</typ:ids>
                </inv:paymentType>
              <inv:note>Načteno z XML</inv:note>
             <inv:intNote>Tento doklad byl vytvořen importem přes XML.</inv:intNo
XML;
    }

    private function getInvoiceDetail($order) {
        return <<<XML
            <inv:invoiceDetail>
{$this->getInvoiceItems($order)}
{$this->getPayment($order)}
{$this->getShipping($order)}
            </inv:invoiceDetail>
XML;
    }

    private function getInvoiceItems($order) {
        $xml = "";

        foreach ($order->orderItems as $item) {
            $vat = $order->Eshop_ID == 1?21:20;
            $text = $item->product->getLang($this->langID)->Name;
            $price = $item->PriceWithoutVat;
            $code = $item->product->Code;

            $xml .= <<<XML
                <inv:invoiceItem>
                    <inv:text><![CDATA[{$text}]]></inv:text>
                    <inv:code>{$code}</inv:code>
                    <inv:quantity>{$item['Quantity']}</inv:quantity>
                    <inv:rateVAT>high</inv:rateVAT>                    
                    <inv:stockItem>
                        <typ:store>
                            <typ:ids>{$item->product->PohodaStock}</typ:ids>
                        </typ:store>
                        <typ:stockItem>
                            <typ:ids>{$code}</typ:ids>
                        </typ:stockItem>
                    </inv:stockItem>
{$this->getItemPrice($price, $order->Eshop_ID)}
                </inv:invoiceItem>
XML;
        }

        return $xml;
    }

    private function getInvoiceSummary($o) {
        return <<<XML
            <inv:invoiceSummary>
                <inv:roundingDocument>{$this->roundingDocument}</inv:roundingDocument>
{$this->formatCurrency($o)}
            </inv:invoiceSummary>
XML;
    }

    private function formatCurrency($order) {
        if ($order->Currency_ID == \Admin_Model_Currency::CURRENCY_CZK_ID)
            return '';

        return <<<XML
                <inv:foreignCurrency>
                    <typ:currency>
                        <typ:ids>{$order->currency->Mark}</typ:ids>
                    </typ:currency>
                </inv:foreignCurrency>
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
                    <inv:orderItem>
                        <inv:text><![CDATA[{$order['payment']['Name']}]]></inv:text>
                        <inv:quantity>1</inv:quantity>
                        <inv:payVAT>false</inv:payVAT>
                        <inv:rateVAT>high</inv:rateVAT>
{$this->getItemPrice($price, $order->Eshop_ID)}
$pohodaCode
                    </inv:orderItem>
XML;
    }

    private function getShipping($order) {
        $vat = $order->Eshop_ID == 1?21:20;
        $vat = $order->WithoutVat?0:$vat;
        $price = $order['PriceShippingWithoutVat'];

        $pohodaCode = '';
        if ( $order['shipping']['PohodaCode'] ) {
            $pohodaCode = '
<inv:code>' . $order['shipping']['PohodaCode'] . '</ord:code>
<inv:stockItem>
    <typ:stockItem>
        <typ:ids>' . $order['shipping']['PohodaCode'] . '</typ:ids>
    </typ:stockItem>
</inv:stockItem>           
';
        }

        return <<<XML
                    <inv:orderItem>
                        <inv:text><![CDATA[{$order['shipping']['Name']}]]></inv:text>
                        <inv:quantity>1</inv:quantity>
                        <inv:payVAT>false</inv:payVAT>
                        <inv:rateVAT>high</inv:rateVAT>
{$this->getItemPrice($price, $order->Eshop_ID)}
{$pohodaCode}
                    </inv:orderItem>
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
                    <inv:homeCurrency>
                        <typ:unitPrice>{$price}</typ:unitPrice>
                    </inv:homeCurrency>
XML;
        } else {
            return <<<XML
                    <inv:foreignCurrency>
                        <typ:unitPrice>{$price}</typ:unitPrice>
                    </inv:foreignCurrency>
XML;
        }
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
        header("Content-disposition: attachment; filename=\"" . 'invoices.xml' . "\"");
    }

}