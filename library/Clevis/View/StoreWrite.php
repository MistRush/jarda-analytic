<?php

/**
 * Class that represents write store
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_StoreWrite extends Clevis_View_OldStore {

    /**
     * Entity
     *
     * @var array of Clevis_View_Entity
     */
    private $entity;

    /**
     * Merge
     *
     * @var boolean
     */
    private $merge = false;

    /**
     * Merge columns
     *
     * @var array
     */
    private $mergeColumns;

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setBaseType('clevis/view/StoreWrite');

        // Create manager for manipulating with entities
        $this->entity = new Clevis_View_Entity();
        $this->addItem($this->entity);
    }

    /**
     * Set merge base url
     *
     * @param string $url
     */
    public function setMergeBaseUrl($url, $mergeColumns = null) {
        $this->setUrl($url);
        $this->merge = true;
        $this->mergeColumns = $mergeColumns;
    }

    /**
     * Call function that doesn't exists
     *
     * @param string $name
     * @param array $arguments
     * @return unknown
     */
    public function __call($name,$arguments) {
        $newArguments = array();
        foreach($arguments as $key => &$argument){
            $newArguments[$key] = &$argument;
        }
        // Call entity methods
        return call_user_func_array(array($this->entity,$name),$newArguments);
    }

    /**
     * Register this store to parent dialog data if some exists
     * 
     * @param string $dataAttribute
     */
    public function registerToParentData($dataAttribute) {
        if ( $this->hasName() == false )
            $this->setName(str_replace('.','_',$dataAttribute));
        $this->setDojoAttribute('dataAttribute',$dataAttribute);
    }

    /**
     * Has data attribute
     *
     * @return boolean
     */
    public function hasDataAttribute() {
        return $this->hasDojoAttribute('dataAttribute');
    }

    /**
     * Get data attribute
     *
     * @return $dataAttribute
     */
    public function getDataAttribute() {
        return $this->getDojoAttribute('dataAttribute');
    }

    /**
     * Check if store write want to be registered to dialog data
     * 
     * @return boolean
     */
    public function isRegisteredToParentData() {
        return $this->hasDataAttribute();
    }

    /**
     * Get entity
     * 
     * @return Clevis_View_Entity
     */
    public function getEntity() {
        return $this->entity;
    }

    /**
     * On init script notification
     *
     * @param Clevis_View_Script $script
     */
    protected function onInitScript(Clevis_View_Script & $script) {
        parent::onInitScript($script);

        $setEntityAsChild = '';
        if ( $this->isRegisteredToParentData() ) {
            $setEntityAsChild .= PHP_EOL . $this->getId() . '.setEntityAsChild(' . $this->entity->getId() . ');';
        }

        $view = $this->getView();
        $script->addOnLoad(
            'var view = dijit.byId("' . $view->getId() . '");' . PHP_EOL .
            'view.addObjectMethodToReset("' . $this->getId() . '", "clear");' . PHP_EOL .
            $this->getId() . '.setEntity(' . $this->entity->getId() . ');' .
            $setEntityAsChild
        );
    }

    /**
     * On init script type notification
     *
     * @param Clevis_View_ScriptType $scriptType
     */
    protected function onInitScriptType(Clevis_View_ScriptType & $scriptType) {
        parent::onInitScriptType($scriptType);
        // Add methods
        $scriptType->addMethod('createEntity',array('parameters'));
        $scriptType->addMethod('editEntity',array('entity'));
        $scriptType->addMethod('deleteEntity',array('entity'));
        $scriptType->addMethod('saveEntity');
    }

    /**
     * On init script type methods notification
     *
     * @param Clevis_View_ScriptType $scriptType
     */
    protected function onInitScriptTypeMethods(Clevis_View_ScriptType & $scriptType) {
        // Add method bodies
        $scriptType->provideMethodBody('createEntity',
            'return this.entity.createEntity(parameters);'
        );
        $scriptType->provideMethodBody('editEntity',
            'if ( entity == null )' . PHP_EOL .
            '   return false;' . PHP_EOL .
            'this.currentEntity = entity;' . PHP_EOL .
            'return this.entity.editEntity(this.getItemValues(entity));'
        );
        $scriptType->provideMethodBody('deleteEntity',
            'if ( entity == null )' . PHP_EOL .
            '   return false;' . PHP_EOL .
            'this.currentEntity = entity;' . PHP_EOL .
            'return this.entity.deleteEntity(this.getItemValues(entity));'
        );
        parent::onInitScriptTypeMethods($scriptType);
    }

    /**
     * Pre render store
     *
     * @return string
     */
    public function preRender() {
        if ( $this->merge ) {
            $this->setDojoAttribute('merge', true);
        }
        if ( $this->mergeColumns != null ) {
            $this->setDojoAttribute('mergeColumns', json_encode($this->mergeColumns));
        }
        return parent::preRender();
    }

}
?>