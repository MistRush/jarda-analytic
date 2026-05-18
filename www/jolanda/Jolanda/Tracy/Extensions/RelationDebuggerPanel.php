<?php

namespace Jolanda\Tracy\Extensions;

use Tracy\Helpers;
use Tracy\IBarPanel;

class RelationDebuggerPanel implements IBarPanel
{
    public $data;

    private static $instance;

    private function __construct() {
        $this->data = [];
    }

    public static function getInstance(): self {
        if (!isset(self::$instance))
            self::$instance = new self();

        return self::$instance;
    }

    public function getTab(): string
    {
        return Helpers::capture(function () {
            $total_count = 0;
            foreach ($this->data as $d) {
                $total_count += $d['calls'];
            }
            require __DIR__ . "/panels/relation.tab.phtml";
        });
    }

    public function getPanel(): string
    {
        return Helpers::capture(function () {
            if (is_file(__DIR__ . "/panels/relation.panel.phtml")) {
                $data = $this->data;
                require __DIR__ . "/panels/relation.panel.phtml";
            }
        });
    }

    public function addRecord($object, $fieldName) {
        $name = get_class($object) . '->' . $fieldName;
        $back_trace = debug_backtrace();
        array_shift($back_trace);
        SqlDebuggerPanel::formatTraces($back_trace);

        $hash = md5($name);
        if (!isset($this->data[$hash])) {
            $this->data[$hash] = [
                'calls' => 1,
                'name' => $name,
                'back_trace' => $back_trace,
            ];
        } else {
            $this->data[$hash]['calls']++;
            $this->data[$hash]['back_trace'] = array_merge($this->data[$hash]['back_trace'], $back_trace);
        }
    }

}