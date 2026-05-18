<?php

use common\logic\Languages;
use Admin_Model_Product as Product;
use Clevis_Data_Manager as DataManager;

/**
 * Admin_Manager_FeedbackFile
 *
 */
class Admin_Manager_FeedbackFile extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_FeedbackFile');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->leftJoin('entity', 'file');
        $query->addSelect('file.Name', 'Name');
        $query->addSelect('file.Extension', 'Extension');

        if (array_key_exists('FeedbackID', $attributes) && strlen($attributes['FeedbackID']) > 0) {
            $query->addWhere('entity.Feedback_ID = ' . $attributes['FeedbackID']);
            unset($attributes['FeedbackID']);
        }

    }

    protected function onDataCreate(Array &$attributes, Doctrine_Connection $connection) {
        $entity = parent::onDataCreate($attributes, $connection);

        if (isset($attributes['feedbackFiles']['File_ID']))
           $entity->File_ID = $attributes['feedbackFiles']['File_ID'];

        return $entity;
    }
}