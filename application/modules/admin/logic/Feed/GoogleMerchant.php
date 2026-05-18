<?php
namespace admin\logic\Feed;

use Admin_Model_Shipping as Shipping;
use common\logic\Eshop\Eshop;
use Common_Model_Eshop as EshopModel;
use URL;

class GoogleMerchant {

    /** @var array $products Produkty */
    private array $products;

    /** @var EshopModel $eshop Nastavení */
    private EshopModel $eshop;

    /** @var array $shippings Dopravy */
    private array $shippings;

    /**
     * Constructor
     *
     * @param array $products
     * @param EshopModel|null $eshop
     */
    public function __construct(array $products, ?EshopModel $eshop = null) {
        $this->products = $products;
        $this->eshop = $eshop??Eshop::getInstance()->getEshop();
        $this->shippings = Shipping::getActiveShippings($eshop);
    }

    /**
     *
     * @return string
     */
    private function getLayout(): string {
        return <<<XML
<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
    <channel>
        <title>{$this->eshop->Name}</title>
        <link>{$this->eshop->URL}</link>
        {$this->getItemsXml()}
    </channel>
</rss>
XML;
    }

    /**
     * @return string
     */
    private function getItemsXml(): string {
        $html = "";

        foreach ($this->products as $p) {
            $price = number_format($p['PriceWithVat'], 2, '.', '') . ' ' . $this->eshop->currency->Label;
            $productType = $p['categories'][0]['category']['categoryLangs'][0]['Name']??'';
            $productUrl = $this->eshop->URL . '/' . URL::PRODUCT . '/' . $p['slug'];
            $stock = 'in stock';
            $name = str_replace('&', ' ', $p['Name']);
            $code = str_replace('-', '', $p['Code']);
            $manufacturer = $p['manufacturer']['Name']??'hadex.cz';

            $html .= <<<XML
                    <item>
                        <g:id>{$p['ID']}</g:id>
                        <g:title><![CDATA[{$name}]]></g:title>
                        <g:description><![CDATA[{$p['ShortDescription']}]]></g:description>
                        <g:link>{$productUrl}</g:link>
                        <g:brand>{$manufacturer}</g:brand>
                        <g:mobile_link>{$productUrl}</g:mobile_link>
                        <g:image_link>{$this->getImageUrl($p)}</g:image_link>        
                        <g:condition>new</g:condition>
                        <g:availability>{$stock}</g:availability>
                        <g:price>{$price}</g:price>
                        <g:product_type><![CDATA[{$productType}]]></g:product_type>  
                        <g:mpn>{$code}</g:mpn>
                        <g:gtin>{$p['EAN']}</g:gtin>           
                        {$this->getShippings()}
                        <g:shipping_weight>{$p['Weight']}</g:shipping_weight>
                        <g:adult>FALSE</g:adult>
                    </item>
            XML;
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
            $url .= fu($product['productImages'][0], 'product/200');
        } else {
            $url .= '/img/noimage.png';
        }

        return $url;
    }

    /**
     * @return string
     */
    private function getShippings(): string {
        $html = "";

        foreach ($this->shippings as $shipping) {
            $price = number_format($shipping['PriceWithVat'], 2, '.', '') . ' ' . $this->eshop->currency->Label;

            $html .= <<<XML
            <g:shipping>
                <g:country>{$this->eshop->language->Code}</g:country>
                <g:service>{$shipping['Name']}</g:service>
                <g:price>{$price}</g:price>
            </g:shipping>
            XML;
        }

        return $html;
    }

    /**
     * @return string
     */
    public function getXml(): string {
        return $this->getLayout();
    }
}