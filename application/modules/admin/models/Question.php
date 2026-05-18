<?php
use common\logic\Eshop\Eshop;
use Common_Model_Eshop as ModelEshop;
use user\logic\UserClientSession;

class Admin_Model_Question extends Admin_Model_Base_Question {

    /**
     * @param Doctrine_Connection|null $conn
     */
    public function save(Doctrine_Connection $conn = null) {
        if ($this->ID == null) {
            $this->Date = date('Y-m-d');
            $this->Time = date('H:i');
        }

        parent::save($conn);
    }

    /**
     * @param Zend_Controller_Request_Abstract $request
     * @param ModelEshop|null $eshop
     * @return Admin_Model_Question
     */
    public static function createQuestion(Zend_Controller_Request_Abstract $request, ModelEshop $eshop = null): Admin_Model_Question {
        if ( !$eshop )
            $eshop = Eshop::getInstance()->getEshop();

        $question = new Admin_Model_Question();
        $question->Name = $request->getParam('Name');
        $question->Product_ID = $request->getParam('Product_ID');
        $question->Phone = $request->getParam('Phone');
        $question->Email = $request->getParam('Email') ?? UserClientSession::getCurrentUserName();
        $question->Description = $request->getParam('Description');
        $question->State = 'Nová';
        $question->Eshop_ID = $eshop->ID;
        $question->save();

        return $question;
    }
}