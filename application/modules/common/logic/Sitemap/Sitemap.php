<?php
namespace common\logic\Sitemap;

use DOMDocument;
use DOMElement;

class Sitemap {

    const VERSION = '1.0';
    const CHARSET = 'UTF-8';
    
    private DOMDocument $document;
    private DOMElement $rootElement;
    private array $urlItems;

    /**
     * @param array $urlItems
     */
    public function __construct(array $urlItems) {
        $this->setUrlItems($urlItems);        
        $this->initDocument();
        $this->initRootElement();
        $this->fillSitemap();
    }

    public function fillSitemap() {
        foreach ( $this->getUrlItems() as $urlItem )
            $this->addUrlItem($urlItem);
    }

    /**
     * @param array $urlItem
     */
    private function addUrlItem(array $urlItem) {
        $rootElement = $this->getRootElement();
        $document = $this->getDocument();        
        $urlElement = $document->createElement('url');
        $rootElement->appendChild($urlElement);
        
        foreach ( $urlItem as $urlItemKey => $urlItemValue ) {
            $urlItemParam = $document->createElement($urlItemKey, $urlItemValue);
            $urlElement->appendChild($urlItemParam);
        }
    }

    private function initRootElement() {
        $document = $this->getDocument();        
        $rootElement = $document->createElement('urlset');
        
        $atributes = array('xmlns' => 'http://www.sitemaps.org/schemas/sitemap/0.9', 'xmlns:xsi' => 'http://www.w3.org/2001/XMLSchema-instance',
            'xsi:schemaLocation' => 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',);
        
        foreach ( $atributes as $atributeName => $atributeValue ) {
            $atribute = $document->createAttribute($atributeName);            
            $atribute->value = $atributeValue;
            $rootElement->appendChild($atribute);                    
        }       
                
        $document->appendChild($rootElement);        
        $this->setRootElement($rootElement);
    }

    private function initDocument() {
        $document = new DOMDocument(self::VERSION, self::CHARSET);
        $this->setDocument($document);        
    }

    public function generateXML() {
        $document = $this->getDocument();
        file_put_contents('sitemap.xml', $document->saveXML());
    }

    /**
     * @return DOMElement
     */
    private function getRootElement(): DOMElement {
        return $this->rootElement;
    }

    /**
     * @param DOMElement $rootElement
     */
    private function setRootElement(DOMElement $rootElement) {
        $this->rootElement = $rootElement;
    }

    /**
     * @return DOMDocument
     */
    private function getDocument(): DOMDocument {
        return $this->document;
    }

    /**
     * @param DOMDocument $document
     */
    private function setDocument(DOMDocument $document) {
        $this->document = $document;
    }

    /**
     * @return array
     */
    private function getUrlItems(): array {
        return $this->urlItems;
    }

    /**
     * @param array $urlItems
     */
    private function setUrlItems(array $urlItems) {
        $this->urlItems = $urlItems;
    }    
}
