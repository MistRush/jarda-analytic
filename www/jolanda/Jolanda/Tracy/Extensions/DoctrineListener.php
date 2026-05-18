<?php

namespace Jolanda\Tracy\Extensions;

use Doctrine_Event;
use Doctrine_EventListener;

class DoctrineListener extends Doctrine_EventListener
{
    /*private $total_query_time = 0;
    private $total_fetch_time = 0;

    public function preQuery(Doctrine_Event $event) {
        $this->total_query_time = microtime(true);
    }

    public function preFetch(Doctrine_Event $event) {
        $this->total_fetch_time = microtime(true);
    }

    public function postQuery(Doctrine_Event $event) {
        $end_time = microtime(true);
        $exec_time = $end_time - $this->total_query_time;
        SqlDebuggerPanel::getInstance()->addRecord($event, $exec_time, debug_backtrace());
    }

    public function postFetch(Doctrine_Event $event) {
        $end_time = microtime(true);
        $exec_time = $end_time - $this->total_fetch_time;
        SqlDebuggerPanel::getInstance()->addRecord($event, $exec_time, debug_backtrace());
    }*/

    private float $total_query_time = 0;
    private float $total_fetch_time = 0;
    private float $total_exec_time = 0;

    public function preStmtExecute(Doctrine_Event $event) {
        $this->total_exec_time = microtime(true);
    }

    public function postStmtExecute(Doctrine_Event $event) {
        $end_time = microtime(true);
        $exec_time = ($end_time - $this->total_exec_time);
        SqlDebuggerPanel::getInstance()->addRecord($event, $exec_time, debug_backtrace());
    }

    public function preQuery(Doctrine_Event $event)
    {
        $this->total_exec_time = microtime(true);
    }
    public function postQuery(Doctrine_Event $event)
    {
        $end_time = microtime(true);
        $exec_time = ($end_time - $this->total_exec_time);
        SqlDebuggerPanel::getInstance()->addRecord($event, $exec_time, debug_backtrace());
    }
}