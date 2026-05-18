<?php

class User_GridSettingsController extends Clevis_Zend_Controller_Action {
    public function init() {
        parent::init();

        $this->disableLayout();
    }

    public function saveSettingsAction() {
        $name = $this->getRequest()->getParam('Name');
        $value = $this->getRequest()->getParam('Value');

        //GridSettings::saveGridSettings(UserxSession::getCurrentUserID(), $name, $value);
    }


    public function loadSettingsAction() {
        $name = $this->getRequest()->getParam('Name');

        /*$gridSettings = GridSettings::getGridSettingsValue(UserxSession::getCurrentUserID(), $name);

        if ( $gridSettings )
            echo $gridSettings->Value;
        else*/
            echo null;
    }
}