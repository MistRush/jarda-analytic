<?php

namespace Jolanda\Tracy\Extensions;

use Clevis_Data_Manager;
use ReflectionClass;
use ReflectionException;
use Tracy\Helpers;
use Tracy\IBarPanel;
use Zend_Controller_Request_Abstract;

class RequestDebuggerPanel implements IBarPanel
{
    private string|null $module;
    private string|null $controller;
    private string|null $action;
    private Clevis_Data_Manager|null $manager;

    public array $data;
    public array $params;
    private array|null $managerData;

    public string|null $file;
    public int|null $line;

    private static self $instance;

    private function __construct() {
        $this->module = null;
        $this->controller = null;
        $this->action = null;
        $this->manager = null;
        $this->data = [];
        $this->params = [];
        $this->managerData = null;

        $this->file = null;
        $this->line = null;
    }

    public static function getInstance(): self {
        if (!isset(self::$instance))
            self::$instance = new self();

        return self::$instance;
    }

    public function getTab(): string
    {
        return Helpers::capture(function () {
            require __DIR__ . "/panels/request.tab.phtml";
        });
    }

    public function getPanel(): string
    {
        return Helpers::capture(function () {
            if (is_file(__DIR__ . "/panels/sql.panel.phtml")) {
                require __DIR__ . "/panels/request.panel.phtml";
            }
        });
    }

    public function getModule(): ?string
    {
        return $this->module;
    }

    public function setModule(?string $module): void
    {
        $this->module = $module;
    }

    public function getController(): ?string
    {
        return $this->controller;
    }

    public function setController(?string $controller): void
    {
        $this->controller = $controller;
    }

    public function getAction(): ?string
    {
        return $this->action;
    }

    public function setAction(?string $action): void
    {
        $this->action = $action;
    }

    public function getManager(): ?Clevis_Data_Manager
    {
        return $this->manager;
    }

    /**
     * @param Clevis_Data_Manager|null $manager
     *
     * @return void
     */
    public function setManager($manager): void
    {
        if ($manager instanceof Clevis_Data_Manager) {
            $this->manager = $manager;

            $this->setFile($this->getManagerFile());
        } else {
            $this->manager = null;
        }
    }

    public function getParams(): array
    {
        return $this->params;
    }

    public function setParams(array $params): void
    {
        $this->params = $params;
    }

    public function getUrl()
    {
        $m = $this->module == 'default' ? null : $this->module;
        $c = $this->controller;
        $a = $this->action;

        if ($this->manager) {
            return $this->manager::class;
        } else {
            return preg_replace('[//]', '/', "/$m/$c/$a");
        }

    }

    /**
     * @param Zend_Controller_Request_Abstract $request
     *
     * @return void
     */
    public function addFromRequest(Zend_Controller_Request_Abstract $request): void
    {
        $this->setModule($request->getModuleName());
        $this->setController($request->getControllerName());
        $this->setAction($request->getActionName());

        $this->setParams(array_diff_key($request->getParams(), array_flip(['module', 'controller', 'action'])));
    }

    public function getManagerFile(): string|null
    {
        if (!$this->getManager())
            return null;

        try {
            $ref = new ReflectionClass($this->getManager());
            return $ref->getFileName();
        } catch (ReflectionException) {
            return null;
        }

    }

    public function getManagerData(): array|null
    {
        return $this->managerData;
    }

    public function setManagerData(array|null $managerData): void
    {
        if (!$this->getManager())
            return;

        $this->managerData = $managerData;
    }

    /**
     * Přidání vlastních dat do request panelu
     *
     * @param string $key
     * @param string $val
     * @return void
     */
    public function addData(string $key, string $val): void
    {
        $this->data[$key] = $val;
    }

    public function getData(): array
    {
        return $this->data;
    }

    public function setData(array $data): void
    {
        $this->data = $data;
    }

    public function getFile(): ?string
    {
        return $this->file;
    }

    public function setFile(?string $file): void
    {
        $this->file = $file;
    }

    public function getLine(): ?int
    {
        return $this->line;
    }

    public function setLine(?int $line): void
    {
        $this->line = $line;
    }

    public function getFullFile(): string|null {
        if (empty($this->getFile()))
            return null;

        return $this->getFile() . ($this->getLine()?':'.$this->getLine():null);
    }
}