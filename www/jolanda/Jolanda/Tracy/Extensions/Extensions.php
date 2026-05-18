<?php

namespace Jolanda\Tracy\Extensions;

use Clevis_Helper;
use Clevis_Zend_Dispatcher;
use Doctrine_EventListener_Exception;
use Doctrine_Manager;
use Jolanda\Latte\Latte;
use Jolanda\Tracy\Extensions\Latte\LattePanel;
use Latte\Engine;
use Tracy\Debugger;
use Zend_Controller_Dispatcher_Abstract;
use Zend_Controller_Front;
use Zend_Controller_Request_Abstract;

class Extensions {

    /**
     * @return void
     * @throws Doctrine_EventListener_Exception
     */
    public static function addAllPanels(): void
    {
        if (!Clevis_Helper::isDevelopmentEnvironment())
            return;

        Debugger::getBar()->addPanel(TypehintPanel::getInstance());
        Debugger::getBar()->addPanel(SqlDebuggerPanel::getInstance());
        Debugger::getBar()->addPanel(RelationDebuggerPanel::getInstance());
        Debugger::getBar()->addPanel(RequestDebuggerPanel::getInstance());
        Debugger::getBar()->addPanel(ElasticaQueryDebuggerPanel::getInstance());

        // TODO: User a Redis panel, dodělat wiki

        Doctrine_Manager::getInstance()->setListener(new DoctrineListener());

    }

    /**
     * @return void
     */
    public static function addRequestListener(): void
    {
        if (!Clevis_Helper::isDevelopmentEnvironment())
            return;

        if (!$request = Zend_Controller_Front::getInstance()->getRequest())
            return;

        RequestDebuggerPanel::getInstance()->addFromRequest($request);

        if ($dispatcher = Zend_Controller_Front::getInstance()->getDispatcher()) {
            self::addFileLink($dispatcher, $request);

            if ($dataManager = $dispatcher->getDataManager()) {
                RequestDebuggerPanel::getInstance()->setManager($dataManager);
            }
        }
    }

    private static function addFileLink(Zend_Controller_Dispatcher_Abstract|Clevis_Zend_Dispatcher $dispatcher, Zend_Controller_Request_Abstract $request): void
    {

        $controllerDir = $dispatcher->getControllerDirectory($request->getModuleName());
        try {

            $controllerClass = $dispatcher->getControllerClass($request);
            $controllerFile = $controllerDir . '/' . $controllerClass . '.php';

            if (file_exists($controllerFile)) {
                require_once $controllerFile;

                $action = $dispatcher->getActionMethod($request);

                if (!class_exists($controllerClass)) {
                    $controllerClass = ucfirst("{$request->getModuleName()}_$controllerClass");
                }
                try {
                    $reflection = new \ReflectionClass($controllerClass);
                    if ($reflection->hasMethod($action)) {
                        $method = $reflection->getMethod($action);
                        RequestDebuggerPanel::getInstance()->setFile($controllerFile);
                        RequestDebuggerPanel::getInstance()->setLine($method->getStartLine());
                    }
                } catch (\Exception $ex) {
                }
            }
        } catch (\Exception $ex) {

        }
    }

    public static function initializeLatte(Engine|Latte $latte, string|false|null $showName = false): void
    {
        if (!Clevis_Helper::isDevelopmentEnvironment())
            return;

        //        \Latte\Bridges\Tracy\LattePanel::initialize($latte, $showName === false?'':$showName);
        LattePanel::initialize($latte, $showName === false?'':$showName);
    }

    public static function setManagerData(array|null $data = null) {

        if (!Clevis_Helper::isDevelopmentEnvironment())
            return;

        RequestDebuggerPanel::getInstance()->setManagerData($data);
    }

}