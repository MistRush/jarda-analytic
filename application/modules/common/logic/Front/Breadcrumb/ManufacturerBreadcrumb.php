<?php
namespace common\logic\Front\Breadcrumb;

use Admin_Model_Manufacturer as Manufacturer;

/**
 * Module constants
 */
class ManufacturerBreadcrumb extends Breadcrumb
{

    private $manufacturer = [];

    /**
     * Constructor
     * @param array $category
     */
    public function __construct(array $category)
    {
        $this->setManufacturer($category);

        parent::__construct();
    }

    public function computeBreadcrumbItems(): void
    {
        $manufacturer = $this->getManufacturer();
        if ($manufacturer) {
            $this->addBreadcrumbItem($manufacturer['Name'], self::LINK_MANUFACTURER);
        }

        $this->setBreadcrumbItems(array_reverse($this->getBreadcrumbItems()));
    }

    /**
     * @return array
     */
    public function getManufacturer(): array
    {
        return $this->manufacturer;
    }

    /**
     * @param array $category
     */
    public function setManufacturer(array $manufacturer)
    {
        $this->manufacturer = $manufacturer;
    }
}