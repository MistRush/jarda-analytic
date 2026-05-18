<?php
use Admin_Model_Category as Category;
use Admin_Model_Product as Product;
use common\logic\Front\Breadcrumb\CategoryBreadcrumb;
use common\logic\Front\ProductList;
use common\logic\Helper\RangeFilter;
use common\logic\Helper\RangeFilterType;
use default\components\Category as CategoryComponent;
use default\components\Common as CommonComponent;
use default\components\Layout as LayoutComponent;

class CategoryController extends BaseController {

    // podivej se, jestli je potreba ctyri actiony tady a na co vlastne jsou
    // ve strankovani je blbe trochu range filters ...
    // je potreba opravdu posílat tolik parametrů do latte?
    // pak udelat poradek v latteckach a rozhodit je do komponent

    public function indexAction() {
        $request = $this->getRequest();
        $productList = new ProductList($request);

        $category = Category::getCategoryBySlug($productList->getSlug());
        if ( !$category ) {
            $this->forward('not-found', 'error', 'default');
            return;
        }

        $products = Product::getProductsForCategory($category['CategoryIDs'], $productList);
        $totalProducts = Product::getTotalProductsForCategory($category['CategoryIDs'], $productList);
        $categoryBreadcrumb = new CategoryBreadcrumb($category);
        $currentUrl = $this->formatCurrentUrl($category);

        $filter = CategoryComponent::filter($category, $productList->getFilter(), $currentUrl, $products);
        $activeFilter = CategoryComponent::activeFilter($currentUrl, $productList->getFilter());
        $paramRangeSeparator = $productList->getFilter() ? '&' : '?';

        $this->renderLatte([
            'shopYear' => CommonComponent::shopYear(),
            'grid' => $productList->getGrid(),
            'sorting' => $productList->getSorting(),
            'currentUrl' => $currentUrl,
            'filterUrl' => $productList->getFilterParams() ? '?f=' . $productList->getFilterParams() : '',
            'priceRangeParamsUrl' => $productList->getRangeFilterParams() ? $paramRangeSeparator . $productList->getRangeFilterParams() : '',
            'subCategories' => Category::getSubCategories($category['ID']),
            'filter' => $filter,
            'activeFilter' => $activeFilter,
            'filterParams' => $productList->getFilterParams(),
            'category' => $category,
            'breadcrumb' => LayoutComponent::breadcrumb($categoryBreadcrumb->getBreadcrumbItems()),
            'products' => $products,
            'totalProducts' => $totalProducts,
            'totalPages' => ceil($totalProducts / ProductList::DEFAULT_OFFSET),
            'page' => $productList->getPage(),
            'offset' => ProductList::DEFAULT_OFFSET,
            'title' => $category['Title'],
            'metaDescription' => $category['MetaDescription'],
        ]);
    }

    public function pageUpdateAction() {
        $request = $this->getRequest();

        $productList = new ProductList($request);

        $category = Category::getCategoryBySlug($productList->getSlug());
        $products = Product::getProductsForCategory($category['CategoryIDs'], $productList);
        $totalProducts = Product::getTotalProductsForCategory($category['CategoryIDs'], $productList);
        $currentUrl = $this->formatCurrentUrl($category);
        $paramRangeSeparator = $productList->getFilter() ? '&' : '?';
        $filterUrl = $productList->getFilterParams() ? '?f=' . $productList->getFilterParams() : '';
        $filterUrl .= $productList->getRangeFilterParams() ? $paramRangeSeparator . $productList->getRangeFilterParams() : '';

        $this->renderLatte([
            'currentUrl' => $currentUrl,
            'filterUrl' => $filterUrl,
            'products' => $products,
            'totalProducts' => $totalProducts,
            'grid' => $productList->getGrid(),
            'totalPages' => ceil($totalProducts / ProductList::DEFAULT_OFFSET),
            'page' => $productList->getPage(),
            'offset' => ProductList::DEFAULT_OFFSET
        ]);
    }

    public function loadPageAction() {
        $request = $this->getRequest();

        $productList = new ProductList($request);
        $category = Category::getCategoryBySlug($productList->getSlug());
        if ( !$category ) {
            $this->forward('not-found', 'error', 'default');
            return;
        }

        $products = Product::getProductsForCategory($category['CategoryIDs'], $productList);
        $totalProducts = Product::getTotalProductsForCategory($category['CategoryIDs'], $productList);
        $currentUrl = $this->formatCurrentUrl($category);

        $filter = CategoryComponent::filter($category, $productList->getFilter(), $currentUrl,$products);
        $activeFilter = CategoryComponent::activeFilter($currentUrl, $productList->getFilter());

        $this->renderLatte([
            'grids' => ProductList::getGrids(),
            'sortings' => ProductList::getSortings(),
            'grid' => $productList->getGrid(),
            'sorting' => $productList->getSorting(),
            'currentUrl' => $currentUrl,
            'filterUrl' => $productList->getFilterParams() ? '?f=' . $productList->getFilterParams() : '',
            'filter' => $filter,
            'activeFilter' => $activeFilter,
            'category' => $category,
            'products' => $products,
            'totalProducts' => $totalProducts,
            'totalPages' => ceil($totalProducts / ProductList::DEFAULT_OFFSET),
            'page' => $productList->getPage(),
            'offset' => ProductList::DEFAULT_OFFSET,
        ]);
    }

    public function oldCategoriesSeoRedirectAction() {
        $slug = $this->getRequest()->getParam('slug');
        $category = Category::getCategoryByOldHistorySlug($slug);
        if (isset($category['slug']) && $category['slug']) {
            header("Location: /c/" . $category['slug'], TRUE, 301);
        } else {
            $this->forward('old-pages-seo-redirect', 'page', 'default', ['slug' => $slug]);
        }
    }

    /**
     * @param array $category
     * @return string
     */
    private function formatCurrentUrl(array $category) :string {
        return '/' . URL::CATEGORY . '/' . $category['slug'];
    }
}