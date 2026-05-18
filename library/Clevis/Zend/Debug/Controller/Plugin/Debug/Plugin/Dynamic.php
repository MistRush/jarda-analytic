<?php
/**
 * ZFDebug dynamic plugin
 */
class Clevis_Zend_Debug_Controller_Plugin_Debug_Plugin_Dynamic extends Clevis_Zend_Debug_Controller_Plugin_Debug_Plugin implements Clevis_Zend_Debug_Controller_Plugin_Debug_Plugin_Interface
{
    /**
     * Contains plugin identifier name
     *
     * @var string
     */
    protected $_identifier = 'dynamic';

    /**
     * Create Clevis_Zend_Debug_Controller_Plugin_Debug_Plugin_Variables
     *
     * @return void
     */
    public function __construct(array $options = array())
    {
    }

    /**
     * Gets identifier for this plugin
     *
     * @return string
     */
    public function getIdentifier()
    {
        return $this->_identifier;
    }

    /**
     * Gets menu tab for the Debugbar
     *
     * @return string
     */
    public function getTab()
    {
        return 'dynamic';
    }

    /**
     * Gets content panel for the Debugbar
     *
     * @return string
     */
    public function getPanel()
    {
        return 'dynamic';
    }

    /**
     * Gets dynamic data
     *
     * @return string
     */
    public function getData()
    {
        return array();
    }

    /**
     * Gets dynamic plugin script
     *
     * @return string
     */
    public function getScript() {
        $script = new Clevis_View_Script();

        $id = $this->getIdentifier();
        $type = 'type_debug_panel_' . $id;

        // Add script type
        $scriptType = $script->addType($type, 'clevis/DebugPanel');
        $scriptType->addRequire("clevis/common", "common");
        $scriptType->addField('data', Zend_Json::encode($this->getData()));
        $scriptType->addField('identifier', '"' . $id . '"');
        $scriptType->addMethod('refresh');
        $this->onInitScriptType($scriptType);

        // Panel declaration
        $script->addOnLoad('require(["clevis/debug"], function(debug) { debug.' . $id . ' = new ' . $type . '(); debug.' . $id . '.refresh(); });');
        
        return $script->render();
    }

    /**
     * On init script type notification
     *
     * @param Clevis_View_ScriptType $scriptType
     */
    protected function onInitScriptType(Clevis_View_ScriptType & $scriptType) {
    }

}