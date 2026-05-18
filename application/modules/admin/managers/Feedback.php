<?php
use Admin_Model_FeedbackState as FeedbackState;
use common\logic\Email\Email;
use user\logic\UserAdminSession;

/**
 * Admin_Manager_Feedback
 *
 */
class Admin_Manager_Feedback extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Feedback');

        $this->addChildManager(new Admin_Manager_FeedbackState(), 'feedbackStates');
        $this->addChildManager(new Admin_Manager_FeedbackFile(), "feedbackFiles", Clevis_Data_Manager::MERGE || Clevis_Data_Manager::DISABLE_AUTO_CREATE);

        //$this->setColumnFilter('AuthorName', Clevis_Data_Manager::FILTER_LIKE, 'creatorUser.Name');
        $this->setColumnFilter('FeedbackNumber', Clevis_Data_Manager::FILTER_LIKE);
        $this->setColumnFilter('Content', Clevis_Data_Manager::FILTER_LIKE);
    }

    protected function onDataCreate(array &$attributes, Doctrine_Connection $connection) {
        $entity = parent::onDataCreate($attributes, $connection);

        if (!is_array($entity) && array_key_exists('State', $attributes) && $attributes['State'] != FeedbackState::STATE_NEW) {
            $entity->save();
            FeedbackState::createQuickState($entity->ID, '', $attributes['State'], false);
        }

        return $entity;
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, array &$attributes, $listType, Doctrine_Connection $connection) {
        if (!array_key_exists('sort', $attributes)) {
            $attributes['sort'] = 1;
            $query->orderBy('entity.DateExpectedSolving ASC');
        }

        parent::onDataList($query, $attributes, $listType, $connection);

        if ($listType == Clevis_Data_Manager::LIST_LISTING) {
            $tmpStates = FeedbackState::getInternalStateNames(true);

            $userID = UserAdminSession::getCurrentUserID();
            if (UserAdminSession::isSuperadmin()) {
                if (array_key_exists('userSelect', $attributes) && $attributes['userSelect'] !== "") {
                    if (is_numeric($attributes['userSelect'])) {
                        $userID = $attributes['userSelect'];
                    }
                }
            }

            $query->addSelect('DATEDIFF(entity.DateExpectedSolving, CURDATE())', 'DateDifferrence');
            $query->addSelect('(SELECT count(state.ID) FROM admin__model__feedback_state state WHERE state.Feedback_ID = entity.ID)', 'SolveFeedback');
            $query->addSelect('entity.FeedbackNumber', 'copyIcon');
            $query->addSelect('(SELECT count(ff.ID) FROM admin__model__feedback_file ff WHERE ff.Feedback_ID = entity.ID)', 'FileCount');
            $query->addSelect('creatorUser.Name', 'AuthorName');

            $query->addSelect('COUNT(feedbackReadLastStates.ID)', 'HasOpened');

            $query->leftJoin('entity', 'solverUser');
            $query->leftJoin('entity', 'creatorUser');
            $query->leftJoin('entity', 'feedbackReadLastStates', 'feedbackReadLastStates', "feedbackReadLastStates.User_ID = {$userID}");

            $query->addGroupBy('entity.ID');

            if (array_key_exists('hideWaiting', $attributes) && $attributes['hideWaiting']) {
                $tmpStates = array_diff($tmpStates, [FeedbackState::STATE_WAITING_APPROVE]);
            }

            if (array_key_exists('onlyPostponed', $attributes) && $attributes['onlyPostponed']) {
                $tmpStates = [FeedbackState::STATE_DEFERRED];
                $query->addWhere("entity.tmpState IN ('" . implode("','", $tmpStates) . "')");
            }


            if (!array_key_exists('showAll', $attributes) || !$attributes['showAll'] && !$attributes['onlyPostponed']) {
                $tmpStates = array_diff($tmpStates, [FeedbackState::STATE_DEFERRED]);
                $query->addWhere("entity.tmpState IN ('" . implode("','", $tmpStates) . "')");

                if (array_key_exists('onlyAuthor', $attributes) && $attributes['onlyAuthor'])
                    $query->addWhere("entity.CreatorUser_ID = {$userID}");
                elseif (array_key_exists('onlyAuthor', $attributes) && !$attributes['onlyAuthor'])
                    $query->addWhere("entity.SolverUser_ID = {$userID}");
            }

            if (array_key_exists('searchAs', $attributes) && strlen($attributes['searchAs']) > 0) {
                $searchAs = "entity.Content LIKE '%{$attributes['searchAs']}%'
                                  OR entity.Header LIKE '%{$attributes['searchAs']}%'
                                  OR entity.FeedbackNumber LIKE '%{$attributes['searchAs']}%'
                                  OR entity.Hash LIKE '%{$attributes['searchAs']}%'";
                $query->addWhere($searchAs);
                unset($attributes['searchAs']);
            }
        }
    }
}