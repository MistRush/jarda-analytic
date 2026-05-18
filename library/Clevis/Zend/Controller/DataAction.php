<?php

/**
 * Data Action
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Zend_Controller_DataAction extends Clevis_Zend_Controller_Action {

    /**
     * Data manager
     * 
     * @var Clevis_Data_Manager
     */
    private $dataManager = null;

    private $getSchema = false;

    /**
     * Constructor
     *
     * @param Zend_Controller_Request_Abstract $request
     * @param Zend_Controller_Response_Abstract $response
     * @param array $invokeArgs
     */
    public function  __construct(Zend_Controller_Request_Abstract $request,Zend_Controller_Response_Abstract $response,array $invokeArgs = array()) {        
        parent::__construct($request,$response,$invokeArgs);

        // Set current data manager
        $this->dataManager = Zend_Controller_Front::getInstance()->getDispatcher()->getDataManager();
    }

    /**
     * Get data manager
     * 
     * @return Clevis_Data_Manager
     */
    public function getDataManager() {
        return $this->dataManager;
    }

    /**
     * Render data array
     *
     * @param array $dataIdentifier
     * @param array $data
     * @param array $dataParam
     */
    public function renderData($data, $dataIdentifier, $dataParam = null) {
        echo Clevis_Helper::formatDojoData($data, $dataIdentifier, $dataParam);
    }

    /**
     * Data list action
     */
    public function dataListAction() {
        Clevis_Timer::start('run-action-data-list');

        // Init data action
        $this->disableLayout();

        // Attributes
        $attributes = Clevis_Helper::getRequestParams();

        //Toto přidáme
        if(isset($attributes['_getSchema'])){
            $this->getSchema = true;
            unset($attributes['_getSchema']);
        }
        //end

        unset($attributes['module']);
        unset($attributes['controller']);
        unset($attributes['action']);

        // Get list mode
        $listType = Clevis_Helper::hasRequestParam('full') ? Clevis_Data_Manager::LIST_HIERARCHY : Clevis_Data_Manager::LIST_LISTING;

        // Get data manager
        $dataManager = $this->dataManager->getManager(Clevis_Data_Manager::DATA_LIST, $attributes, $listType);
        $dataManager->init(Clevis_Data_Manager::DATA_LIST, $attributes, $listType);

        // Perform data list
        $data = $dataManager->performDataList($attributes, $listType);

        $dataParam = null;
        if (isset($data['numResults'])) {
            $dataParam['numRows'] = $data['numResults'];
        }
        if (isset($data['message'])) {
            $dataParam['message'] = $data['message'];
        }
        if($this->getSchema){
            $dataParam['schema'] = $dataManager->getDataSchema();
        }

        $dataParam['statuses'] = \Jolanda\Controls\Editor\StatusManager::getInstance()->toArray();

        $this->renderData($data['data'], $data['identifier'], $dataParam);

        \Jolanda\Tracy\Extensions\Extensions::setManagerData($data);

        Clevis_Timer::stop('run-action-data-list');

        if ( Clevis_Helper::isDebuggingEnvironment() && Zend_Controller_Front::getInstance()->getRequest()->isXmlHttpRequest() == false )
            echo Clevis_Timer::render();
    }

    public function dataPreCreateAction() {
        Clevis_Timer::start('run-action-data-pre-create');

        // Init data action
        $this->disableLayout();

        // Get data
        $attributes = Zend_Json::decode($this->getRequest()->getParam('data'));
        if ( $attributes == null )
            $attributes = array();

        // Get data manager
        $dataManager = $this->dataManager->getManager(Clevis_Data_Manager::DATA_PRE_CREATE, $attributes);
        $dataManager->init(Clevis_Data_Manager::DATA_PRE_CREATE, $attributes);

        // Perform data create
        $data = $dataManager->performDataPreCreate($attributes);

        // Render data
        $this->renderData($data['data'], $data['identifier']);

        Clevis_Timer::stop('run-action-data-pre-create');
    }

    /**
     * Data create action
     */
    public function dataCreateAction() {
        Clevis_Timer::start('run-action-data-create');

        // Init data action
        $this->disableLayout();

        // Get data
        $attributes = Zend_Json::decode($this->getRequest()->getParam('data'));
        if ( $attributes == null ) {
            throw new Exception('Attribute "data" must not be empty!');
        }

        // Get data manager
        $dataManager = $this->dataManager->getManager(Clevis_Data_Manager::DATA_CREATE, $attributes);
        $dataManager->init(Clevis_Data_Manager::DATA_CREATE, $attributes);

        // Perform data create
        try {
            $data = $dataManager->performDataCreate($attributes);
        } catch ( Exception $exception ) {
            if ( $exception instanceof Doctrine_Connection_Pgsql_Exception ) {
                if ( $exception->getCode() == 23505 ) {
                    Clevis_Error::renderRuntimeError('Záznam již v databázi existuje!', $exception->getMessage());
                }
            }
            throw $exception;
        }

        // Prepare list attributes
        $attributesList = array();
        foreach ( $dataManager->getModelIdentifier() as $identifier ) {
            $attributesList[$identifier] = $data[0][$identifier];
        }
        // Perform data list
        $data = $dataManager->performDataList($attributesList, $this->getRequest()->getParam('full') !== null ? Clevis_Data_Manager::LIST_HIERARCHY : Clevis_Data_Manager::LIST_LISTING);

        // Render data
        $this->renderData($data['data'], $data['identifier']);

        Clevis_Timer::stop('run-action-data-create');
    }

    /**
     * Data update action
     */
    public function dataUpdateAction() {
        Clevis_Timer::start('run-action-data-update');

        // Init data action
        $this->disableLayout();

        // Get data
        $attributes = Zend_Json::decode($this->getRequest()->getParam('data'));
        if ( $attributes == null ) {
            throw new Exception('Attribute "data" must not be empty!');
        }

        // Get data manager
        $dataManager = $this->dataManager->getManager(Clevis_Data_Manager::DATA_UPDATE, $attributes);
        $dataManager->init(Clevis_Data_Manager::DATA_UPDATE, $attributes);

        try {
            // Perform data update
            $result = $dataManager->performDataUpdate($attributes);
        } catch ( Exception $exception ) {
            if ( $exception instanceof Doctrine_Connection_Pgsql_Exception ) {
                if ( $exception->getCode() == 23503 ) {
                    Clevis_Error::renderRuntimeError('Při modifikaci záznamu se nepodařilo vymazat položku, na kterou se v databázi odkazují záznamy!', $exception->getMessage());
                } else if ( $exception->getCode() == 23505 ) {
                    Clevis_Error::renderRuntimeError('Při modifikaci záznamu se nepodařilo vytvořit položku, protože tato položka již v databázi existuje!', $exception->getMessage());
                }
            }
            throw $exception;
        }

        // If perform update return false, don't select data and exit
        if ( $result == false )
            return;

        // Prepare list attributes
        $attributesList = array();
        foreach ( $dataManager->getModelIdentifier() as $identifier ) {
            $attributesList[$identifier] = $attributes[$identifier];
        }

        // Perform data list
        $data = $dataManager->performDataList($attributesList, $this->getRequest()->getParam('full') !== null ? Clevis_Data_Manager::LIST_HIERARCHY : Clevis_Data_Manager::LIST_LISTING);

        // Render data
        $this->renderData($data['data'], $data['identifier']);

        Clevis_Timer::stop('run-action-data-update');
    }

    /**
     * Data delete action
     */
    public function dataDeleteAction() {
        Clevis_Timer::start('run-action-data-delete');

        // Init data action
        $this->disableLayout();

        // Prepare attributes
        $attributes = Zend_Json::decode($this->getRequest()->getParam('data'));
        if ( $attributes == null ) {
            throw new Exception('Attribute "data" must not be empty!');
        }

        // Get data manager
        $dataManager = $this->dataManager->getManager(Clevis_Data_Manager::DATA_DELETE, $attributes);
        $dataManager->init(Clevis_Data_Manager::DATA_DELETE, $attributes);

        try {
            // Perform data delete
            $dataManager->performDataDelete($attributes);
        } catch ( Exception $exception ) {
            if ( $exception instanceof Doctrine_Connection_Mysql_Exception ) {
                if ( $exception->getCode() == 23000 ) {
                    Clevis_Error::renderRuntimeError('Záznam nelze vymazat, v databázi se na něj odkazují existující záznamy!', $exception->getMessage());
                }
            }
            throw $exception;
        }

        Clevis_Timer::stop('run-action-data-delete');
    }

    /**
     * Data batch action
     */
    public function dataBatchAction() {
        Clevis_Timer::start('run-action-data-batch');

        // Init data action
        $this->disableLayout();

        // Prepare attributes
        $attributes = Zend_Json::decode($this->getRequest()->getParam('data'));

        try {
            // Perform data batch
            $this->dataManager->init(Clevis_Data_Manager::DATA_ALL, $attributes);
            $this->dataManager->performDataBatch($attributes);
        } catch ( Exception $exception ) {
            if ( $exception instanceof Doctrine_Connection_Mysql_Exception ) {
                if ( $exception->getCode() == 23000 ) {
                    Clevis_Error::renderRuntimeError('Záznam nelze vymazat, v databázi se na něj odkazují existující záznamy!', $exception->getMessage());
                }
            }
            throw $exception;
        }

        Clevis_Timer::stop('run-action-data-batch');
    }

    public function dataGridAction() {
        Clevis_Timer::start('run-action-data-grid');

        // Init data action
        $this->disableLayout();

        $attributes = Clevis_Helper::getRequestParams();
        unset($attributes['module']);
        unset($attributes['controller']);
        unset($attributes['action']);

        // Get data manager
        $dataManager = $this->dataManager->getManager(Clevis_Data_Manager::DATA_GRID, $attributes);
        $dataManager->init(Clevis_Data_Manager::DATA_GRID, $attributes);

        // Perform data grid
        $data = $dataManager->performDataGrid($attributes);

        $this->renderData($data, null, ['statuses' => \Jolanda\Controls\Editor\StatusManager::getInstance()->toArray()]);

        Clevis_Timer::stop('run-action-data-grid');
    }

    public function dataEditorAction() {
        Clevis_Timer::start('run-action-data-editor');

        // Init data action
        $this->disableLayout();

        $attributes = Clevis_Helper::getRequestParams();
        unset($attributes['module']);
        unset($attributes['controller']);
        unset($attributes['action']);

        // Get data manager
        $dataManager = $this->dataManager->getManager(Clevis_Data_Manager::DATA_EDITOR, $attributes);
        $dataManager->init(Clevis_Data_Manager::DATA_EDITOR, $attributes);

        // Perform data editor
        $data = $dataManager->performDataEditor($attributes);

        $this->renderData($data, null, ['statuses' => \Jolanda\Controls\Editor\StatusManager::getInstance()->toArray()]);

        Clevis_Timer::stop('run-action-data-editor');
    }

    public function dataSchemaAction() {
        Clevis_Timer::start('run-action-data-schema');

        $this->disableLayout();

        $attributes = Clevis_Helper::getRequestParams();
        unset($attributes['module']);
        unset($attributes['controller']);
        unset($attributes['action']);

        $dataManager = $this->dataManager->getManager(Clevis_Data_Manager::DATA_SCHEMA, $attributes);
        $dataManager->init(Clevis_Data_Manager::DATA_EDITOR, $attributes);

        $schema = $dataManager->getDataSchema();

        header('Content-Type: application/json');
        echo json_encode(['schema' => $schema]);

        Clevis_Timer::stop('run-action-data-schema');
    }

}

?>