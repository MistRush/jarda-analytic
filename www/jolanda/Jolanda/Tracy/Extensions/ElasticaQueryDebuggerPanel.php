<?php

namespace Jolanda\Tracy\Extensions;

use Tracy\Helpers;
use Tracy\IBarPanel;

class ElasticaQueryDebuggerPanel implements IBarPanel
{
    public $data;

    private static $instance;
    protected $action;

    private $hashes;

    private function __construct() {
        $this->data = [];
        $this->hashes = [];
    }

    public static function getInstance(): self {
        if (!isset(self::$instance))
            self::$instance = new self();

        return self::$instance;
    }

    public function getTab(): string
    {
        return Helpers::capture(function () {
            $data = $this->data;
            require __DIR__ . "/panels/elasticaQuery.tab.phtml";
        });
    }

    public function getPanel(): string
    {
        return Helpers::capture(function () {
            if (is_file(__DIR__ . "/panels/elasticaQuery.panel.phtml")) {
                $data = $this->data;
                require __DIR__ . "/panels/elasticaQuery.panel.phtml";
            }
        });
    }

    public function addQuery(\Elastica\Query $query)
    {
        $this->data[] = $query->toArray();
    }
}