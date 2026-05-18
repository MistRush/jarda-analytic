<?php
use Clevis_Helper as ClevisHelper;
use User_Model_LoginLog as LoginLog;
use user\logic\UserAdminSession;
use User_Model_User as User;

class Admin_LoginController extends Admin_Controller_Action {

    public function indexAction() {
        $this->setLayout(self::LAYOUT_LOGIN);
        $this->renderLatte([], false);
    }

    public function preDispatch() {
        parent::preDispatch();
        if (UserAdminSession::isCurrentUser()) {
            if ('logout' != $this->getRequest()->getActionName()) {
                $this->_helper->redirector('index', 'index', 'admin');
            }
        } else {
            if ('logout' == $this->getRequest()->getActionName()) {
                $this->_helper->redirector('index', 'index', 'admin');
            }
        }
    }

    public function processAction() {
        $request = $this->getRequest();

        $user = User::getUserForAdminLogin($request->getParam('Name'));
        if ($user == null || !password_verify($request->getParam('Password'), $user['Hash'])) {
            echo "Fail";
            return;
        }

        UserAdminSession::setCurrentUser($user['ID'], $user['Name'], $user['Type']);

        LoginLog::createLoginLog('Přihlášení', UserAdminSession::getCurrentUserID());
        echo _bu() . '/admin/index/index';
    }

    public function logoutAction() {
        LoginLog::createLoginLog('Odhlášení', UserAdminSession::getCurrentUserID());
        UserAdminSession::resetCurrentUser();
        ClevisHelper::resetRequestedUrl();
        $this->_helper->redirector('index', 'login', 'admin');
    }
}