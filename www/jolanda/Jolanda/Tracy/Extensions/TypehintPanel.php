<?php

namespace Jolanda\Tracy\Extensions;

use Tracy\Helpers;
use Tracy\IBarPanel;

class TypehintPanel implements IBarPanel
{
    public array $data;

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
            require __DIR__ . "/panels/typehint.tab.phtml";
        });
    }

    public function getPanel(): string
    {
        return Helpers::capture(function () {
            if (is_file(__DIR__ . "/panels/typehint.panel.phtml")) {
                $data = $this->data;
                require __DIR__ . "/panels/typehint.panel.phtml";
            }
        });
    }

    public function addParam(string $latteFile, string $variableName, array $variableTypes) {
        if (!$variableTypes || !is_array($variableTypes)) {
            $variableTypes = [];
        }

        $this->data[$latteFile][$variableName] = $variableTypes;
    }

    public function getData(): array
    {
        return $this->data;
    }

    public function resetData(): array
    {
        return $this->data = [];
    }

}