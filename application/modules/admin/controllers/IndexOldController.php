<?php
use Admin_Model_Cart as Cart;
use Admin_Model_Category as Category;
use Admin_Model_Order as Order;
use Admin_Model_OrderStateType as OrderStateType;
use Admin_Model_Product as Product;
use common\logic\Latte\LatteEngine;
use user\logic\UserAdminSession;
use User_Model_User as User;

class Admin_IndexController extends Admin_Controller_Action {

    public function indexAction() {
        if (!in_array(UserAdminSession::getCurrentUserType(), User::getAdminTypes(true)))
            return;

        $orderChartDataSrc = Order::getOrdersChartData('months', 12);
        $orderchartData = [];
        for ($i = 12; $i>=0; $i--){
            $orderchartData[date('n/Y',strtotime(date('Y-m-' . '01') . ' -' . $i . ' months'))] = [
                'TotalCount' => 0,
                'TotalPrice' => 0,
            ];
        }

        foreach ($orderChartDataSrc as $item) {
            $orderchartData[$item['date']] = [
                'TotalPrice' => $item['TotalPrice'],
                'TotalCount' => $item['TotalCount']
            ];
        }

        $this->renderLatte([
            //'todayVisits' => Analytics::getInstance()->getResults('today', 'today', 'ga:users'),
            'todayVisits' => 0,
            'todayCarts' => Cart::getTodayCarts(),
            'last30DaysOrdersPrice' => Order::getOrdersSum(date('Y-m-d', strtotime('- 30 days'))),
            'last30DaysOrdersCount' => Order::getOrdersCount(date('Y-m-d', strtotime('- 30 days'))),
            //'last30DaysVisits' => Analytics::getInstance()->getResults('30daysAgo', 'today', 'ga:users'),
            'last30DaysVisits' => 0,
            'orders' => Order::getLastOrders(),
            'ordersChart' => $orderchartData,
            'ordersActiveCount' => Order::getNewOrdersCount(),
            'ordersActiveSum' => Order::getOrdersSum(null, OrderStateType::ID_STATE_NEW),
        ]);
    }

    public function getChartDataAction() {
        $type = $this->getRequest()->getParam('type');
        $back = $this->getRequest()->getParam('back');
        $orderChartData = Order::getOrdersChartData($type, $back);

        $chartData = [];
        if ($type == 'months') {
            for ($i = $back; $i>=0; $i--){
                $chartData[date('n/Y',strtotime(date('Y-m-' . '01') . ' -' . $i . ' months'))] = [
                    'TotalCount' => 0,
                    'TotalPrice' => 0
                ];
            }
        } elseif ($type == 'days') {
            for ($i = $back; $i>=0; $i--){
                $chartData[date('j.n',strtotime('-' . $i . ' days'))] = [
                    'TotalCount' => 0,
                    'TotalPrice' => 0
                ];
            }
        } elseif ($type == 'quarters') {
            foreach ($this->get_quarters($back) as $q) {
                $chartData[$q] = [
                    'TotalCount' => 0,
                    'TotalPrice' => 0
                ];
            }
        }
        foreach ($orderChartData as $item) {
            $chartData[$item['date']] = [
                'TotalPrice' => $item['TotalPrice'],
                'TotalCount' => $item['TotalCount']
            ];
        }
        echo json_encode($chartData);
        return;
    }

    public function searchAction() {
        $searchString = $this->getRequest()->getParam('SearchString');

        echo LatteEngine::getInstance()->renderToString(__DIR__ . '/../../admin/views/index/search.latte',
            [
                'searchString' => $searchString,
                'products' => Product::getSearchProducts($searchString, 10),
                'productsCount' => Product::getSearchProductsCount($searchString),
                'categories' => Category::getSearchCategories($searchString, 10),
                'categoriesCount' => Category::getSearchCategoriesCount($searchString),
                'orders' => Order::getSearchOrders($searchString, 10),
                'ordersCount' => Order::getSearchOrdersCount($searchString),
                'customers' => User::getSearchUsers($searchString, 10),
                'customersCount' => User::getSearchUsersCount($searchString),
            ]
        );
    }

    /**
     * @param int $back
     * @return array
     */
    private function get_quarters(int $back): array {
        $quarters = array();
        $start_month = date( 'm', strtotime('-' . ($back*3) . ' months') );
        $start_year = date( 'Y', strtotime('-' . ($back*3) . ' months') );
        $end_month = date( 'm');
        $end_year = date( 'Y' );
        $start_quarter = ceil($start_month/3);
        $end_quarter = ceil($end_month/3);
        $quarter = $start_quarter;

        for ( $y = $start_year; $y <= $end_year; $y++ ) {
            if($y == $end_year)
                $max_qtr = $end_quarter;
            else
                $max_qtr = 4;

            for($q=$quarter; $q<=$max_qtr; $q++){
                $quarters[] = $y . ' Q' . $q;
            }
            $quarter = 1;
        }

        return $quarters;
    }
}