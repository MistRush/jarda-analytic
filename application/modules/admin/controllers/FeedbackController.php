<?php

use admin\components\FeedbackComponents;
use Admin_Model_Feedback as Feedback;
use Admin_Model_FeedbackState as FeedbackState;
use common\logic\Email\Email;

class Admin_FeedbackController extends Admin_Controller_Action {
    public function indexAction() {
        $grid = FeedbackComponents::createFeedbackGrid();

        $this->renderLatte([
            "grid" => $grid,
        ]);
    }

    public function createFeedbackAction() {
        $editor = FeedbackComponents::createFeedbackCreateEditor();

        $this->renderEditor($editor);
    }

    public function sendFeedbackAction() {
        parent::disableLayout();

        $request = $this->getRequest();

        $feedback = Feedback::createFeedback(
            $request->getParam('Header'),
            $request->getParam('Content'),
            $request->getParam('ErrorReporting'),
            $request->getParam('Priority'),
            $request->getParam('DateExpectedSolving'),
            $request->getParam('SolverUser_ID'),
            $request->getParam('Eshop_ID'),
            $request->getParam('DateStartSolving'),
            $request->getParam('State')
        );

        echo $feedback->ID;
    }

    /*public function sendFeedbackEmailAction() {
        $feedback = Feedback::getFeedbackByID($this->getParam('FeedbackID'));

        Email::sendFeedbackEmail($feedback, 'NF');
    }*/

    public function editFeedbackAction() {
        $editor = FeedbackComponents::createFeedbackEditor();

        if ($feedback = Feedback::getFeedbackByID($this->getParam('entity_ID')))
            $feedback->addReaded();

        $this->renderEditor($editor);
    }

    public function editFeedbackFileAction() {
        $editor = FeedbackComponents::createFeedbackFileQEditor();

        $this->renderQuickEditor($editor);
    }

    public function quickReplyAction() {
        $this->setLayout(self::LAYOUT_NONE);
        $feedback_Hash = $this->getRequest()->getParam('Feedback_Hash');
        $feedback = Feedback::getFeedbackByHash($feedback_Hash);
        if (!$feedback)
            die(404);

        $feedback->addReaded();
        $feedback->tmpState;

        $replyForm = FeedbackComponents::quickReplyForm($feedback->tmpState);
        $this->renderLatte([
            'feedback' => $feedback,
            'replyForm' => $replyForm,
            'statesOnly'=>false,
        ], false);
    }

    public function quickStateAction() {
        $this->setLayout(self::LAYOUT_NONE);
        $request = $this->getRequest();

        $sendEmail = $request->getParam('SendEmail')=='true'?1:0;

        $feedback = Feedback::getFeedbackByHash($request->getParam('ID'));

        FeedbackState::createQuickState(
            $feedback->ID,
            $request->getParam('Description'),
            $request->getParam('State'),
            $request->getParam('ScriptCodeContent'),
            $sendEmail
        );

        $this->renderLatte([
            'feedback' => $feedback,
            'statesOnly' => true
        ], false, 'feedback/quick-reply');
    }

    public function setUnreadAction() {
        $feedback = Feedback::getFeedbackByHash($this->getParam('Hash'));

        if (!$feedback) {
            http_response_code(404);
            die ('ERR');
        }

        try {
            $feedback->resetRead();
            die ('OK');
        } catch (Exception $exception) {
            http_response_code(500);
            die ('ERR');
        }
    }

    public function projectAction() {
        $this->renderLatte([
            'projectGrid' => FeedbackComponents::projectGrid(),
        ]);
    }

    public function editProjectAction() {
        $editor = FeedbackComponents::projectEntityEditor();
        $this->renderEditor($editor);
    }

//    public function getDefaultSolverByProjectAction(){
//        $request = $this->getRequest();
//        $projectID = $request->getParam('Project_ID');
//        if($projectID) {
//            echo Admin_Model_Project::getDefaultSolverIdNameById($projectID);
//        }
//        else echo null;
//    }
}