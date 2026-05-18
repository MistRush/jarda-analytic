<?php

/**
 * LogCreate Behavior Listener
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Behavior_LogCreateListener extends Doctrine_Record_Listener
{
    /**
     * PreInsert
     *
     * @param Doctrine_Event $event
     * @return void
     */
    public function preInsert(Doctrine_Event $event)
    {
        $record = $event->getInvoker();
        $record->CreatedBy = User_Logic_Session::getCurrentUserID();
        $record->CreatedDate = Clevis_Helper::now();
    }

}