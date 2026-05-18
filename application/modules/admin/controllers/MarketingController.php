<?php
use Admin_Model_OrderStateType as OrderStateTypes;
use Admin_Model_Order as Order;
use Common_Model_Eshop as EshopModel;
use common\logic\Eshop\Eshop;
use user\logic\UserAdminSession;

class Admin_MarketingController extends Admin_Controller_Action {

    public function statsAction() {
        $now = time();
        $from = strtotime('-6 month', $now);
        $to = $now;

        $orderStates = OrderStateTypes::getStateTypes();
        $eshop = Eshop::getInstance()->getEshop();
        $orders = Order::getOrderStats($eshop, $from, $to);

        $from = date('d. m. Y', $from);
        $to = date('d. m. Y', $to);

        $this->renderLatte([
            'now' => $now,
            'from' => $from,
            'to' => $to,
            'orderStates' => $orderStates,
            'orders' => $orders,
            'shop_order' => $eshop
        ]);
    }

    public function getOrderStatsAjaxAction() {
        if (UserAdminSession::getCurrentUserType() !== 'admin' && UserAdminSession::getCurrentUserType() !== 'superadmin')
            die (translate('Neoprávněný přístup'));

        $eshop = $this->getParam('Eshop_ID');
        if (empty($eshop))
            die (translate('Vyberte eshop'));

        $eshop = EshopModel::getEshopByID($eshop);

        $range = $this->getParam('range');
        $from = DateTime::createFromFormat('d. m. Y', $this->getParam('dateFrom'))->getTimestamp();
        $to = DateTime::createFromFormat('d. m. Y', $this->getParam('dateTo'))->getTimestamp();
        $OrderStateType_ID = (int) $this->getParam('orderStateType');

        if (!$from || !$to)
            die (translate('Špatné datum'));

        $orders = Order::getOrderStats($eshop, $from, $to, $OrderStateType_ID, $range);

        $this->renderLatte([
            'orders' => $orders,
            'shop_order' => $eshop,
        ], false, 'marketing/modules/orders');
    }

    public function newsletterAction() {
        $this->renderVue();
    }

    public function questionAction() {
        $this->renderVue();
    }

    public function feedAction() {
        $this->renderVue([
            'eshops' => EshopModel::getEshops()->toArray()
        ], false);
    }
}