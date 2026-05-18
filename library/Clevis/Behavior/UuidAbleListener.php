<?php

/**
 * UuidAble Behavior Listener
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Behavior_UuidAbleListener extends Doctrine_Record_Listener
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
        if ( $record->UUID == null )
            $record->UUID = Clevis_Zend_Utility_Uuid::generate();
    }

}