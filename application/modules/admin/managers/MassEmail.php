<?php

use common\logic\Email\EmailFactory;
use common\logic\Languages;

class Admin_Manager_MassEmail extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();
        $this->setModel('Admin_Model_EmailLog');

    }

    protected function onDataCreate(Array &$attributes, Doctrine_Connection $connection = null): Admin_Model_EmailLog {
        EmailFactory::sendMassEmail($attributes);
        $emailLog = new Admin_Model_EmailLog();
        $emailLog->Eshop_ID = $attributes['Eshop_ID'];
        $emailLog->Subject = $attributes['Subject'];
        $emailLog->Body = $attributes['Content'];
        $emailLog->Recipients = 'Pro všechny zákazníky';
        if($attributes['TestMail']) {
            $emailLog->Recipients = $attributes['TestMail'];
        }
        $emailLog->save();
        return $emailLog;
    }

}