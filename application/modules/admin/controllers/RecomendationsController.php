<?php

class Admin_RecomendationsController extends Admin_Controller_Action {

    public function recomendationsAction() {
        $this->renderVue();
    }

    public function editRecomendationsAction() {
        $this->renderVue([], false);
    }
}