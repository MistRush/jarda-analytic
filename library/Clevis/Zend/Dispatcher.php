<?php

/**
 * Dispatcher
 * 
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Zend_Dispatcher extends Zend_Controller_Dispatcher_Standard {

    /** 
     * Flag if current action is data action
     *
     * @var bool
     */
    private $dataAction;

    /**
     * Data action manager
     * 
     * @var Clevis_Data_Manager
     */
    private $dataManager;
    
    /**
     * Get data manager for current action
     * 
     * @return Clevis_Data_Manager
     */
    public function getDataManager() {
        return $this->dataManager;
    }

    /**
     * Dispatch
     * 
     * @param Zend_Controller_Request_Abstract $request
     * @param Zend_Controller_Response_Abstract $response
     * @return void
     */
    public function dispatch(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response)
    {
        // Check for data action
        $action = $request->getActionName();
        if ( substr_compare($action, 'data-', 0, 5) == 0 ) {
            Clevis_Timer::start('run-before-manager-create');
            $this->dataAction = true;
            // Set data manager for data action
            $module = ucfirst($this->_formatName($request->getModuleName()));
            $entity = ucfirst($this->_formatName($request->getControllerName()));
            $managerClass = $module . '_Manager_' . $entity;
            if ( class_exists($managerClass, true) ) {
                $this->dataManager = new $managerClass();
            } else {
                $modelClass = $module . '_Model_' . $entity;
                if ( class_exists($modelClass, true) == false ) {
                    throw new Exception('Undefined model [' . $modelClass . ']!');
                }
                $this->dataManager = new Clevis_Data_ManagerRaw($modelClass);
            }
            Clevis_Timer::stop('run-before-manager-create');
        } else {
            $this->dataAction = false;
            $this->dataManager = null;
        }
        \Jolanda\Tracy\Extensions\Extensions::addRequestListener();

        // Dispatch
        parent::dispatch($request, $response);
    }

    /**
     * Get controller class
     * 
     * @param Zend_Controller_Request_Abstract $request
     * @return false|string
     */
    public function getControllerClass(Zend_Controller_Request_Abstract $request) {
        if ( $this->dataAction == true )
            return 'Clevis_Zend_Controller_DataAction';
        else
            return parent::getControllerClass($request);
    }

    /**
     * Load controller class
     * 
     * @param $className
     * @return string
     */
    public function loadClass($className) {
        if ( $this->dataAction == true )
            return 'Clevis_Zend_Controller_DataAction';
        else
            return parent::loadClass($className);
    }
    
}
