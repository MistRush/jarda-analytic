<?php

class Admin_ConditionsController extends Admin_Controller_Action {

    public function conditionsAction() {
        $this->renderVue();
    }

    public function editConditionsAction() {
        $this->renderVue([], false);
    }
}