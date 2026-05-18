<?php

class Admin_SettingsController extends Admin_Controller_Action {

    public function productOnHomepageAction() {
        $this->renderVue();
    }

    public function announcementAction() {
        $this->renderVue();
    }

    public function editAnnouncementAction() {
        $this->renderVue([], false);
    }

    public function popupAction() {
        $this->renderVue();
    }

    public function bannerAction() {
        $this->renderVue();
    }

    public function editBannerAction() {
        $this->renderVue([], false);
    }

    public function menuAction() {
        $this->renderVue();
    }

    public function blockAction() {
        $this->renderVue();
    }

    public function pageAction() {
        $this->renderVue();
    }

    public function editPageAction() {
        $this->renderVue([], false);
    }

    public function orderStateTypeAction() {
        $this->renderVue();
    }

    public function editOrderStateTypeAction() {
        $this->renderVue([], false);
    }

    public function shippingAction() {
        $this->renderVue();
    }

    public function editShippingAction() {
        $this->renderVue([], false);
    }

    public function paymentAction() {
        $this->renderVue();
    }

    public function editPaymentAction() {
        $this->renderVue([], false);
    }

    public function manufacturerAction() {
        $this->renderVue();
    }

    public function editManufacturerAction() {
        $this->renderVue([], false);
    }

    public function parameterAction() {
        $this->renderVue();
    }

    public function permissionAction() {
        $this->renderVue();
    }

    public function vatAction() {
        $this->renderVue();
    }

    public function currencyAction() {
        $this->renderVue();
    }

    public function languageAction() {
        $this->renderVue();
    }

    public function eshopAction() {
        $this->renderVue();
    }

    public function editEshopAction() {
        $this->renderVue([], false);
    }
}