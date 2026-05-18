<?php

use admin\components\FeedbackComponents;
use Admin_Model_Feedback as Feedback;
use Admin_Model_FeedbackState as FeedbackState;
use common\logic\Email\Email;
use EdSDK\FlmngrServer\FlmngrServer;

class Admin_FlmngrController extends Admin_Controller_Action {
    public function indexAction(): void
    {
       try{
           FlmngrServer::flmngrRequest(
               array(
                   'dirFiles' => APPLICATION_PATH.'/../www/files/upload',
               )
           );
       } catch(Exception $exception) {

       }
    }

}