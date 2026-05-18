<?php
namespace admin\logic\Feed;

use admin\logic\Feed\Converters\MallParamConverter;
use common\logic\Eshop\Eshop;
use Common_Model_Eshop as EshopModel;
use URL;

class Mall {

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
<ITEMS>
    {$this->getItemsXml()}
</ITEMS>
XML;
    }

    /**
     * @return string
     */
    private function getItemsXml(): string {
        $html = "";

        foreach ($this->products as $p) {
            $price = ceil($p['PriceWithVat']);
            if( $price == 0 )
                continue;
            $productUrl = $this->eshop->URL . '/' . URL::PRODUCT . '/' . $p['slug'];
            $name = str_replace('&', ' ', $p['Name']);

            $manufacturer = '';
            if ( $p['Manufacturer_ID'] || $p['Manufacturer_ID'] != 8 )
                $manufacturer = isset($p['manufacturer'])?str_replace([" ", "."],["-", ""],strtoupper($p['manufacturer']['Name'])):'';

            $shortDescription = strip_tags($p['ShortDescription']);
            if ( strlen($shortDescription) > 300 )
                $shortDescription = mb_substr($shortDescription, 0, 290) . ' ...';

            $description = $p['Description'];
            if ( !$description )
                $description = $p['ShortDescription'];

            $itemParams = $this->getItemParams($p);
            $imageUrl = $this->getImageUrl($p);

            $html .= <<<XML
            <ITEM>            
                <ID>PRODUCT_{$p['ID']}</ID>
                <STAGE>live</STAGE>
                <CATEGORY_ID>ND384</CATEGORY_ID>
                <BRAND_ID>{$manufacturer}</BRAND_ID>
                <TITLE><![CDATA[{$name}]]></TITLE>
                <SHORTDESC><![CDATA[{$shortDescription}]]></SHORTDESC>
                <LONGDESC><![CDATA[{$description}]]></LONGDESC>
                <PRIORITY>1</PRIORITY>
                <PACKAGE_SIZE>bigbox</PACKAGE_SIZE>
                <BARCODE>{$p['EAN']}</BARCODE>
                <PRICE>{$price}</PRICE>
                <VAT>21</VAT>
                <MEDIA>
                    <URL>{$imageUrl}</URL>
                    <MAIN>true</MAIN>
                </MEDIA>{$itemParams}
                <DIMENSIONS>
                    <WEIGHT>{$p['Weight']}</WEIGHT>
                    <WIDTH>0</WIDTH>
                    <HEIGHT>0</HEIGHT>
                    <LENGTH>0</LENGTH>
                </DIMENSIONS>
                <DELIVERY_DELAY>0</DELIVERY_DELAY>
                <FREE_DELIVERY>false</FREE_DELIVERY>
            </ITEM>
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
            $paramName = MallParamConverter::convertParam($productParameter['Parameter_ID']);
             if(!isset($productParameter['parameterValue']) || $paramName === null) {
               continue;
             } else {
                 $html .= <<<XML
                
                <PARAM>
                    <NAME>{$paramName}</NAME>
                    <VALUE>{$productParameter['parameterValue']['Value']}</VALUE>
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
            $url .= str_replace(' ', '%20', fu($product['productImages'][0], 'product/800'));
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