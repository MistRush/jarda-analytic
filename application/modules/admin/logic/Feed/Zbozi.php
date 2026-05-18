<?php
namespace admin\logic\Feed;

use common\logic\Eshop\Eshop;
use Common_Model_Eshop as EshopModel;
use URL;

class Zbozi {

    /** @var array $products Produkty */
    private array $products;

    /** @var EshopModel $eshop Nastavení */
    private EshopModel $eshop;

    /**
     * Constructor
     *
     * @param array $products
     * @param EshopModel|null $eshop
     */
    public function __construct(array $products, ?EshopModel $eshop = null) {
        $this->products = $products;
        $this->eshop = $eshop??Eshop::getInstance()->getEshop();
    }

    /**
     *
     * @return string
     */
    private function getLayout(): string {
        return <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<SHOP xmlns="http://www.zbozi.cz/ns/offer/1.0">
    {$this->getItemsXml()}
</SHOP>
XML;
    }

    /**
     * @return string
     */
    private function getItemsXml(): string {
        $html = "";

        foreach ($this->products as $p) {
            $productUrl = $this->eshop->URL . '/' . URL::PRODUCT . '/' . $p['slug'];
            $name = str_replace('&', ' ', $p['Name']);
            $manufacturer = '';
            if ( $p['Manufacturer_ID'] )
                $manufacturer = $p['manufacturer']['Name'];

            $stock = 0;
            if ( $p['OnStock'] == 0 )
                $stock = 1;

            $html .= <<<XML
            <SHOPITEM>
                <ITEM_ID>{$p['ID']}</ITEM_ID>
                <PRODUCTNAME><![CDATA[{$name} ({$p['ID']})]]></PRODUCTNAME>
                <DESCRIPTION><![CDATA[{$p['ShortDescription']}]]></DESCRIPTION>
                <URL>{$productUrl}</URL>
                <IMGURL>{$this->getImageUrl($p)}</IMGURL>           
                <PRICE_VAT>{$p['PriceWithVat']}</PRICE_VAT>        
                <MANUFACTURER>{$manufacturer}</MANUFACTURER>
                <CATEGORYTEXT>{$p['categories'][0]['category']['categoryLangs'][0]['Name']}</CATEGORYTEXT>
                <EAN>{$p['EAN']}</EAN>                   
            {$this->getItemParams($p)}                                
                <DELIVERY_DATE>{$stock}</DELIVERY_DATE>
                <PRODUCTNO>{$p['Code']}</PRODUCTNO>
            </SHOPITEM>
            XML;
        }

        return $html;
    }

    /**
     * @param $product
     * @return string
     */
    private function getItemParams($product): string {
        $html = '';
        foreach ( $product['parameters'] as $productParameter ) {
            if (isset($productParameter['parameterValue'])) {
                $html .= <<<XML
                <PARAM>
                    <PARAM_NAME>{$productParameter['parameter']['parameterLangs'][0]['Name']}</PARAM_NAME>
                    <VAL>{$productParameter['parameterValue']['Value']}</VAL>
                </PARAM>
            XML;
            }

        }

        return $html;
    }

    /**
     * @param array $product
     * @return string
     */
    private function getImageUrl(array $product): string {
        $url = $this->eshop->URL;
        if (count($product['productImages']) > 0) {
            $url .= fu($product['productImages'][0], 'product/800');
        } else {
            $url .= '/img/noimage.png';
        }

        return $url;
    }

    /**
     * @return string
     */
    public function getXml(): string {
        return $this->getLayout();
    }
}