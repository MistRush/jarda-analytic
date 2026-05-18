<?php
use Admin_Model_Category as Category;
use Admin_Model_Order as Order;
use Admin_Model_Product as Product;
use User_Model_User as User;

class Admin_IndexController extends Admin_Controller_Action {

    public function indexAction() {
        $this->renderVue([
            'orders' => Order::getLastOrders(),
        ]);
    }

    public function searchAction() {
        $searchString = $this->getRequest()->getParam('SearchString');

        $result = [
            'products' => Product::getSearchProducts($searchString, 10),
            'productsCount' => Product::getSearchProductsCount($searchString),
            'categories' => Category::getSearchCategories($searchString, 10),
            'categoriesCount' => Category::getSearchCategoriesCount($searchString),
            'orders' => Order::getSearchOrders($searchString, 10),
            'ordersCount' => Order::getSearchOrdersCount($searchString),
        ];

        echo json_encode($result);
    }
}