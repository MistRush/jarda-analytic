<?php
namespace common\logic\Search;
use default\components\Layout as LayoutComponent;
use Admin_Model_Product as Product;
use Admin_Model_Category as Category;

class Search {
    const SEARCH_LIMIT = 50;
    const QUICK_LIMIT = 4;
    private string $searchTerm;
    public function __construct(string $searchTerm) {
        $this->searchTerm = $searchTerm;
    }

    public function renderProperSearchResults(): array {
        $products = Product::getSearchProducts($this->searchTerm, self::SEARCH_LIMIT);
        $categories = Category::getSearchCategories($this->searchTerm, self::SEARCH_LIMIT);

        $latteParams = [];
        $latteParams['title'] = translate('Vyhledávání') . ' - ' . $this->searchTerm;
        $latteParams['metaDescription'] = translate('Vyhledávání') . ' - ' . $this->searchTerm;
        $latteParams['metaKeywords'] = translate('Vyhledávání') . ' - ' . $this->searchTerm;
        $latteParams['term'] = $this->searchTerm;
        $latteParams['breadcrumb'] = LayoutComponent::breadcrumb([['link' => 'search', 'title' => translate('Vyhledávání')]]);
        $latteParams['products'] = $products;
        $latteParams['productsCount'] = count($products);
        $latteParams['categories'] = $categories;
        $latteParams['categoryCount'] = count($categories);

        return $latteParams;
    }

    public function renderProperQuickSearchResults(): array {
        $products = Product::getSearchProducts($this->searchTerm, self::SEARCH_LIMIT);
        $categories = Category::getSearchCategories($this->searchTerm, 10);
        $result = [];

        foreach ($products as $product) {
            $image = isset($product['productImages'][0]) ? fu($product['productImages'][0], 'product/200') : '';
            $result[] = [
                'slug' => $product['slug'],
                'image' => $image,
                'Name' => $product['ProductName'],
                'TotalQuantity' => $product['TotalQuantity'],
                'PriceWithVat' => $product['PriceWithVat'] ?? 0,
                'OnStock' => $product['OnStock'],
                'OnExternalStock' => $product['OnExternalStock'],
            ];

            if (count($result) >= self::QUICK_LIMIT)
                break;
        }

        return [
            'products' => $result,
            'categories' => $categories,
            'productCount' => count($products),
            'categoryCount' => count($categories),
            'searchTerm' => $this->searchTerm,
        ];
    }

}