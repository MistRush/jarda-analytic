<?php

class Admin_JolandaController extends Admin_Controller_Action {

    public function indexAction() {
        if(!isDevelopment()){
            die('Only in development mode');
        }

        $this->renderVue([], false);
    }
}