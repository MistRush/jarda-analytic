<?php


namespace Jolanda\Tracy\Extensions;

use Doctrine_Event;
use Tracy\Helpers;
use Tracy\IBarPanel;

class SqlDebuggerPanel implements IBarPanel
{
    const DEFAULT_LIMIT_SIZE_MB = 2;
    public static int|float $limitSizeMB = self::DEFAULT_LIMIT_SIZE_MB;

    public $data;
    private bool $trimmed;
    private bool $enabled;

    private int $iterator;

    private static $instance;

    private function __construct() {
        $this->data = [];
        $this->trimmed = false;
        $this->enabled = true;
        $this->iterator = 0;
    }

    public static function getInstance(): self {
        if (!isset(self::$instance))
            self::$instance = new self();

        return self::$instance;
    }

    public function getTab(): string
    {
        return Helpers::capture(function () {
            $total_time = 0;
            $total_count = 0;
            $trimmed = $this->trimmed;
            $size = self::humanSize(strlen(serialize($this->data)));
            foreach ($this->data as $d) {
                $total_time += $d['time'];
                $total_count += $d['calls'];
            }
            require __DIR__ . "/panels/sql.tab.phtml";
        });
    }

    public function getPanel(): string
    {
        return Helpers::capture(function () {
            if (is_file(__DIR__ . "/panels/sql.panel.phtml")) {
                // Seřazení dat podle počtu volání queries (sestupně)
                uasort($this->data, function ($a, $b) {
                    return $b['calls'] <=> $a['calls'];
                });
                $data = $this->data;
                $trimmed = $this->trimmed;
                $size = self::humanSize(strlen(serialize($this->data)));
                require __DIR__ . "/panels/sql.panel.phtml";
            }
        });
    }

    public function addRecord(Doctrine_Event $event, $time, $back_trace) {
        if (!$this->enabled || $this->trimmed) return;

        if ($this->iterator % (self::$limitSizeMB * 100) === 0) {
            if (strlen(serialize($this->data)) / 1024 / 1024 > self::$limitSizeMB) {
                $this->trimmed = true;
                return;
            }
        }

        $this->iterator++;

        $hash = md5($event->getQuery());
        self::formatTraces($back_trace);

        if (!isset($this->data[$hash])) {
            $this->iterator += strlen(serialize($this->data[$hash] = [
                'params' => $event->getParams(),
                'calls' => 1,
                'query' => $event->getQuery(),
                'time' => $time * 1000,
                'back_trace' => $back_trace
            ]));
        } else {
            $this->data[$hash]['calls']++;
            $this->data[$hash]['time'] += $time * 1000;
            $this->data[$hash]['back_trace'] = array_merge($this->data[$hash]['back_trace'], $back_trace);
        }
    }

    public static function formatTraces(&$traces = []) {
        if (!count($traces))
            return;

        $traces = array_reverse($traces);

        for ($i=0; $i<=3; $i++) {
            if (isset($traces[$i]))
                unset($traces[$i]);
        }

        foreach ($traces as $ind => &$trace) {
            if (!self::formatTrace($trace))
                unset($traces[$ind]);

        }

        $traces = [array_values($traces)];
    }

    private static function formatTrace(&$trace): bool {
        if (isset($trace['class']) && $trace['class'] == 'Doctrine_Record')
            return false;

        $function = ($trace['class']??'') . ($trace['type']??'') . ($trace['function']??'');
        $function .= !empty($trace['function'])?'()':'';

        $file = ($trace['file']??'-') . (!empty($trace['line'])?':'.$trace['line']:'');

        $trace = [
            'function' => $function,
            'file' => $file
        ];

        return true;
    }

    public function isTrimmed(): bool
    {
        return $this->trimmed;
    }

    public function isEnabled(): bool
    {
        return $this->enabled;
    }

    public function setEnabled(bool $enabled): self
    {
        $this->enabled = $enabled;

        return $this;
    }

    private static function humanSize($bytes, int $dec = 2): string
    {
        $size   = array('B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
        $factor = floor((strlen($bytes) - 1) / 3);
        if ($factor == 0) $dec = 0;

        return sprintf("%.{$dec}f %s", $bytes / (1024 ** $factor), $size[$factor]);
    }

}
