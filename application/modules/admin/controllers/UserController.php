<?php
use User_Model_User as User;

class Admin_UserController extends Admin_Controller_Action {

    public function listAction() {
        $this->renderVue();
    }

    public function editUserAction() {
        $this->renderVue([], false);
    }

    public function checkUserExistAction() {
        $userName = $this->getRequest()->getParam('UserName');
        $userID = $this->getRequest()->getParam('User_ID');

        $result = [];
        $result['result'] = ['ok'];
        if ( User::getUserByEmail($userName, $userID) )
            $result['result'] = ['fail'];

        echo Zend_Json::encode($result);
    }
}