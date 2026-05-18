<?php

class Admin_MealsController extends Admin_Controller_Action {

    public function mealsAction() {
        $this->renderVue();
    }

    public function editMealsAction() {
        $this->renderVue([], false);
    }
}