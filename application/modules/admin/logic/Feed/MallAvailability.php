<?php
namespace admin\logic\Feed;

use common\logic\Eshop\Eshop;
use Common_Model_Eshop as EshopModel;
use URL;

class MallAvailability {

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
<AVAILABILITIES>
    {$this->getItemsXml()}
</AVAILABILITIES>
XML;
    }

    /**
     * @return string
     */
    private function getItemsXml(): string {
        $html = "";

        foreach ($this->products as $p) {
            $inStock = $p['OnStock'] == 0 ? 0 : 1;
            $html .= <<<XML
            <AVAILABILITY>            
                <ID>PRODUCT_{$p['ID']}</ID>
                <IN_STOCK>{$inStock}</IN_STOCK>
                <ACTIVE>true</ACTIVE>
            </AVAILABILITY>
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