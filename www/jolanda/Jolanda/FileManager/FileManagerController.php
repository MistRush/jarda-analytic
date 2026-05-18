<?php
namespace Jolanda\FileManager;
class FileManagerController extends \Clevis_Zend_Controller_Action
{

    public function __construct(\Zend_Controller_Request_Abstract $request, \Zend_Controller_Response_Abstract $response, array $invokeArgs = array())
    {
        parent::__construct($request, $response, $invokeArgs);

        if(!$this->isAccessAllowed()){
            die('Access Denied!');
        }
    }

    public function uploadPhpAction(){
        include 'jolanda/Jolanda/FileManager/upload.php';
    }

    public function dialogPhpAction(){
        $GLOBALS['FileManagerNotUseSession'] = true;
        include 'jolanda/Jolanda/FileManager/dialog.php';
    }

    public function ajaxcallsPhpAction(){
        include 'jolanda/Jolanda/FileManager/ajax_calls.php';
    }

    public function executePhpAction(){
        include 'jolanda/Jolanda/FileManager/execute.php';
    }

    public function forcedownloadPhpAction(){
        include 'jolanda/Jolanda/FileManager/force_download.php';
    }

    protected function isAccessAllowed(){
        return false;
    }
}