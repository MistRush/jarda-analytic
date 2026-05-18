<?php
use Admin_Model_Manufacturer as Manufacturer;
use Admin_Model_Product as Product;
use common\logic\Front\ProductList;
use default\components\Layout as LayoutComponent;

class ManufacturerController extends BaseController {

    public function indexAction() {
        $this->renderLatte([
            'title' => 'Seznam výrobců',
            'metaDescription' => 'Seznam výrobců',
            'metaKeywords' => 'Výrobci',
            'manufacturers' => Manufacturer::getManufacturers(),
            'breadcrumb' => LayoutComponent::breadcrumb([['title'=>'Značky', 'link'=>'/znacky']]),
        ]);
    }

    public function detailAction() {
        $request = $this->getRequest();
        $productList = new ProductList($request);

        $manufacturer = Manufacturer::getManufacturerBySlug($productList->getSlug());
        if ( !$manufacturer ) {
            $this->forward('not-found', 'error', 'default');
            return;
        }

        $totalProducts = Product::getTotalProductsForManufacturer($manufacturer[0]['ID']);
        $products = Product::getProductsForManufacturer($manufacturer[0]['ID'],  $productList);
        $currentUrl = '/' . URL::MANUFACTURER . '/' . $manufacturer[0]['slug'];

        $this->renderLatte([
            'currentUrl' => $currentUrl,
            'title' => $manufacturer[0]['Name'],
            'metaDescription' => $manufacturer[0]['MetaDescription'],
            'metaKeywords' => 'Výrobci',
            'manufacturer' => $manufacturer[0],
            'products' => $products,
            'sortings' => ProductList::getSortings(),
            'page' => $productList->getPage(),
            'grid' => $productList->getGrid(),
            'sorting' => $productList->getSorting(),
            'offset' => ProductList::DEFAULT_OFFSET,
            'totalProducts' => $totalProducts,
            'totalPages' => ceil($totalProducts / ProductList::DEFAULT_OFFSET),
            'breadcrumb' => LayoutComponent::breadcrumb([['title'=>'Značky', 'link'=>'znacky/'], ['title'=> $manufacturer[0]['Name'], 'link'=>'znacky/' . $productList->getSlug()]]),
        ]);
    }

    public function loadPageAction() {
        $request = $this->getRequest();
        $productList = new ProductList($request);

        $manufacturer = Manufacturer::getManufacturerBySlug($productList->getSlug());
        $totalProducts = Product::getTotalProductsForManufacturer($manufacturer[0]['ID']);
        $products = Product::getProductsForManufacturer($manufacturer[0]['ID'],  $productList);

        $this->renderLatte([
            'title' => 'Výrobci',
            'metaDescription' => 'Výrobci',
            'metaKeywords' => 'Výrobci',
            'manufacturer' => $manufacturer[0],
            'products' => $products,
            'sortings' => ProductList::getSortings(),
            'page' => $productList->getPage(),
            'grid' => $productList->getGrid(),
            'sorting' => $productList->getSorting(),
            'offset' => ProductList::DEFAULT_OFFSET,
            'totalProducts' => $totalProducts,
            'totalPages' => ceil($totalProducts / ProductList::DEFAULT_OFFSET),
        ]);
    }

    public function pageUpdateAction() {
        $request = $this->getRequest();
        $productList = new ProductList($request);
        $manufacturer = Manufacturer::getManufacturerBySlug($productList->getSlug());

        $totalProducts = Product::getTotalProductsForManufacturer($manufacturer[0]['ID']);
        $products = Product::getProductsForManufacturer($manufacturer[0]['ID'],  $productList);
        $currentUrl = '/' . URL::MANUFACTURER . '/' . $manufacturer[0]['slug'];

        $this->renderLatte([
            'currentUrl' => $currentUrl,
            'products' => $products,
            'totalProducts' => $totalProducts,
            'grid' => $productList->getGrid(),
            'totalPages' => ceil($totalProducts / ProductList::DEFAULT_OFFSET),
            'page' => $productList->getPage(),
            'offset' => ProductList::DEFAULT_OFFSET
        ]);
    }
}