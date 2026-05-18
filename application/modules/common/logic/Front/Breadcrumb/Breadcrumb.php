<?php
namespace common\logic\Front\Breadcrumb;

use Admin_Model_Category as Category;

/**
 * Module constants
 */
abstract class Breadcrumb {

    const LINK_CATEGORY = 'c';
    const LINK_MANUFACTURER = 'vyrobce';
    const LINK_PRODUCT = 'p';

    private $breadcrumbItems = [];

    /**
     * Constructor
     */
    public function __construct() {
        $this->computeBreadcrumbItems();
    }

    /**
     * void
     */
    abstract function computeBreadcrumbItems() : void;

    /**
     * @param string $title
     * @param string $link
     */
    public function addBreadcrumbItem(string $title, string $link) {
        $breadcrumbItem = [];
        $breadcrumbItem['title'] = $title;
        $breadcrumbItem['link'] = $link;

        $this->breadcrumbItems[] = $breadcrumbItem;
    }

    /**
     * @return array
     */
    public function getBreadcrumbItems(): array {
        return $this->breadcrumbItems;
    }

    /**
     * @param array $breadcrumbItems
     */
    public function setBreadcrumbItems(array $breadcrumbItems) {
        $this->breadcrumbItems = $breadcrumbItems;
    }
}