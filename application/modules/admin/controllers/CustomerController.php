<?php

class Admin_CustomerController extends Admin_Controller_Action {

    public function customerAction() {
        $this->renderVue();
    }

    public function editCustomerAction() {
        $this->renderVue([], false);
    }

    public function cartAction() {
        $this->renderVue();
    }

    public function couponAction() {
        $this->renderVue();
    }

    public function editCouponAction() {
        $this->renderVue([], false);
    }
}