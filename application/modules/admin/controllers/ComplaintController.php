<?php

class Admin_ComplaintController extends Admin_Controller_Action {

    public function complaintAction() {
        $this->renderVue();
    }

    public function editComplaintAction() {
        $this->renderVue([], false);
    }
}