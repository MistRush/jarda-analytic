<?php

/**
 * Class that represents dialog used for entity editation
 *
 * @author Pavel Cihlar
 */
class Clevis_View_DialogEdit extends Clevis_View_Dialog {

    /**
     * Edit Dialog Tabcontainer
     *
     * @var Clevis_View_Tabcontainer
     */
    protected $tabContainer;

    /**
     * Edit dialog action set
     *
     * @var Clevis_View_ActionSet
     */
    private $actionSet;
    
    /**
     * DynamicContainer
     * 
     * @var Clevis_View_DynamicContainer;
     */
    protected $dynamicContainer;

    /**
     * Constructor
     */
    public function  __construct($title = null, $name = null, $autoSize = false) {
        parent::__construct($title, $name);
        
        // Dynamic container
        $this->dynamicContainer = new Clevis_View_DynamicContainer();
        
        // Prepare tab container
        $this->tabContainer = $this->addTabContainer();
        if ( $autoSize ) {
            $this->tabContainer->setAutoSize(true);
        } else {
            $this->tabContainer->setElementAttribute('style', 'width: 800px; height: 450px');
        }

        // Prepare actions
        $div = $this->addElementDiv();
        $div->setElementAttribute('style', 'padding: 5px; background-color: #eee;');
        $div->setId($this->getId() . '_first');

        $this->actionSet = $div->addActionSet(Clevis_View_ActionSet::FILL_DIALOG);
    }

    /**
     * Get tab container from dialog edit
     *
     * @return Clevis_View_TabContainer
     */
    protected function getTabContainer() {
        return $this->tabContainer;
    }

    /**
     * Add tab
     *
     * @param string|Clevis_View_Tab $titleOrTab
     * @return Clevis_View_Tab
     */
    public function addTab($titleOrTab, $data = null) {
        $tab = $titleOrTab;
        if ( ($tab instanceof Clevis_View_Tab) == false ) {
            $tab = new Clevis_View_Tab();
            $tab->setTitle($titleOrTab);
        }
        
        // Add item to dynamic container
        $this->dynamicContainer->addItem(
            $tab, 
            $this->tabContainer->getId() . '.showTab(item, visible);',
            $data
        );

        return $this->tabContainer->addItem($tab);
    }
    
    /**
     * On init script type methods notification
     *
     * @param Clevis_View_ScriptType $scriptType
     */
    protected function onInitScriptType(Clevis_View_ScriptType & $scriptType) {
        parent::onInitScriptType($scriptType);
        
        $this->dynamicContainer->initScriptType($scriptType);
        $scriptType->addMethod('init', null, 'this.dynamicContainerInit(); ');
        $scriptType->addMethod('beforeEdit', array('data'), 'this.inherited(arguments);' . PHP_EOL . 'this.dynamicContainerUpdate(data);' . PHP_EOL . 'return true;');
    }

    /**
     * Pre render
     * 
     * @return string
     */
    public function preRender() {
        if ( $this->isInlineSizeAuto() == false ) {
            $this->tabContainer->setAutoSize(false);
        }

        // Remove write actions when don't have permission
        if ( $this->hasPermissionWrite() == false ) {
            $this->actionSet->getItem(0)->setEnabled(false);
        }
        
        return parent::preRender();
    }

}
?>