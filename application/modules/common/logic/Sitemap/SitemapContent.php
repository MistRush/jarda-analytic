<?php
namespace common\logic\Sitemap;

use Admin_Model_Category as Category;
use Admin_Model_Product as Product;

/**
 * Class for sitemap
 *
 * @author Pavel Cihlar
 */
class SitemapContent {

    private $urls;
    
    const CHANGE_FREQUENCY = 'monthly';
    //const HOME_URL = 'http://www.venkart.eu/';

    public function __construct() {
        $this->fillPages();
        $this->fillCategory();
        $this->fillProducts();
    }
    
    private function fillPages() {
        /*$this->addUrl(self::HOME_URL, self::CHANGE_FREQUENCY, 1);
        $this->addUrl(self::HOME_URL . 'o-firme', self::CHANGE_FREQUENCY, 0.95);
        $this->addUrl(self::HOME_URL . 'nabidka', self::CHANGE_FREQUENCY, 0.95);
        $this->addUrl(self::HOME_URL . 'kontakt', self::CHANGE_FREQUENCY, 0.95);
        $this->addUrl(self::HOME_URL . 'katalog-fefco', self::CHANGE_FREQUENCY, 0.95);
        $this->addUrl(self::HOME_URL . 'novinky', self::CHANGE_FREQUENCY, 0.95);
        $this->addUrl(self::HOME_URL . 'poptavka', self::CHANGE_FREQUENCY, 0.95);
        $this->addUrl(self::HOME_URL . 'poptavka-klopovych-krabic', self::CHANGE_FREQUENCY, 0.95);
        $this->addUrl(self::HOME_URL . 'rucne-vyrabene-krabice-na-sklo', self::CHANGE_FREQUENCY, 0.95);
        $this->addUrl(self::HOME_URL . 'kompletacni-prace-vcetne-foliovani', self::CHANGE_FREQUENCY, 0.95);
        $this->addUrl(self::HOME_URL . 'obchodni-podminky', self::CHANGE_FREQUENCY, 0.95);*/
    }

    private function fillCategory() {
        foreach ( Category::getCategoriesForSitemap() as $category )
            $this->addUrl(self::HOME_URL . 'category/' . $category['slug'], self::CHANGE_FREQUENCY, 0.9);
    }    
    
    private function fillProducts() {
        foreach ( Product::getProductsForSitemap() as $product )
            $this->addUrl(self::HOME_URL . 'product/' . $product['slug'], self::CHANGE_FREQUENCY, 0.85);
    }
    
    public function addUrl($loc, $changefreq, $priority) {
        $urlItem = array();
        $urlItem['loc'] = $loc;
        $urlItem['changefreq'] = $changefreq;
        $urlItem['priority'] = $priority;        
        
        $this->urls[] = $urlItem;
    }
    
    public function getUrls() {
        return $this->urls;
    }
    
    private function setUrls($urls) {
        $this->urls = $urls;
    }    
}
