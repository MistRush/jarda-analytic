<?php
use Admin_Model_NewsCategory as NewsCategory;

class Admin_NewsController extends Admin_Controller_Action {

    public function newsAction() {
        $this->renderVue();
    }

    public function editNewsAction() {
        $this->renderVue([], false);
    }

    public function newsCategoryAction() {
        $this->renderVue();
    }

    public function editNewsCategoryAction() {
        $this->renderVue([], false);
    }

    public function loadNewsCategoryTreeAction() {
        echo json_encode(NewsCategory::formatCategoryTree());
    }
}