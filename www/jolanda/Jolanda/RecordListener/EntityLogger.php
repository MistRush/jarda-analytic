<?php

namespace Jolanda\RecordListener;

abstract class EntityLogger extends \Doctrine_Record_Listener
{
    public const EVENT_INSERT = 'insert';
    public const EVENT_UPDATE = 'update';
    public const EVENT_DELETE = 'delete';

    // TODO temporary fix (pokud je uživatel guest)
    abstract protected function getCurrentUserID(): int | null;

    public function postUpdate(\Doctrine_Event $event)
    {
        if ($event->getInvoker()->logChanges) {
            $this->saveChange(self::EVENT_UPDATE, $event->getInvoker());
        }
    }

    public function postInsert(\Doctrine_Event $event)
    {
        if ($event->getInvoker()->logChanges) {
            $this->saveChange(self::EVENT_INSERT, $event->getInvoker());
        }
    }

    public function postDelete(\Doctrine_Event $event)
    {
        if ($event->getInvoker()->logChanges) {
            $this->saveChange(self::EVENT_DELETE, $event->getInvoker());
        }
    }

    public function postHydrate(\Doctrine_Event $event)
    {
        if ($event->getInvoker()->logChanges) {
            $this->saveChange(self::EVENT_UPDATE, $event->getInvoker());
        }
    }

    public function saveChange($event, $entity)
    {
        /** @var \Admin_Model_Product $entity */
        $log = new \Admin_Model_EntityLog();
        $log->User_ID = $this->getCurrentUserID();
        $log->URL = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        $log->Entity = get_class($entity);
        $log->Entity_ID = $entity->ID;
        $log->DateTime = date('Y-m-d H:i:s');
        $log->Action = $event;
        $log->save();

        foreach ($entity->getModified(true, true) as $field => $value) {
            if ($value != $entity->$field) {
                $logValue = new \Admin_Model_EntityLogValues();
                $logValue->Field = $field;
                $logValue->OldValue = $value;
                $logValue->NewValue = $entity->$field;
                $logValue->EntityLog_ID = $log->ID;
                $logValue->save();
            }
        }
    }
}
