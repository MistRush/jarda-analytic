<?php
namespace common\logic\Front\Breadcrumb;

use Admin_Model_Category as Category;

/**
 * Module constants
 */
class ProductBreadcrumb extends CategoryBreadcrumb {

    private $product = [];

    /**
     * Constructor
     * @param array $product
     */
    public function __construct(array $product) {
        $this->setProduct($product);
        $category = isset($product['categories'][0]) ? $product['categories'][0]['category'] : [];

        parent::__construct($category);
    }

    public function computeBreadcrumbItems() : void {
        parent::computeBreadcrumbItems();

        $product = $this->getProduct();
        $this->addBreadcrumbItem($product['productLangs'][0]['Name'], self::LINK_PRODUCT . '/' . $product['productLangs'][0]['slug']);
    }

    /**
     * @return array
     */
    public function getProduct(): array {
        return $this->product;
    }

    /**
     * @param array $product
     */
    public function setProduct(array $product) {
        $this->product = $product;
    }
}