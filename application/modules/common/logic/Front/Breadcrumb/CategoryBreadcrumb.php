<?php
namespace common\logic\Front\Breadcrumb;

use Admin_Model_Category as Category;

/**
 * Module constants
 */
class CategoryBreadcrumb extends Breadcrumb {

    private $category = [];

    /**
     * Constructor
     * @param array $category
     */
    public function __construct(array $category) {
        $this->setCategory($category);

        parent::__construct();
    }

    public function computeBreadcrumbItems() : void {
        $category = $this->getCategory();
        if ( $category) {
            $this->addBreadcrumbItem($category['categoryLangs'][0]['Name'], self::LINK_CATEGORY . '/' . $category['categoryLangs'][0]['slug']);

            while ($category['Category_ID']) {
                $category = Category::getCategoryByID($category['Category_ID'])[0];
                $this->addBreadcrumbItem($category['categoryLangs'][0]['Name'], self::LINK_CATEGORY . '/' . $category['categoryLangs'][0]['slug']);
            }
        }

        $this->setBreadcrumbItems(array_reverse($this->getBreadcrumbItems()));
    }

    /**
     * @return array
     */
    public function getCategory(): array {
        return $this->category;
    }

    /**
     * @param array $category
     */
    public function setCategory(array $category) {
        $this->category = $category;
    }
}