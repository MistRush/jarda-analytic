<?php

/**
 * Class that represents every item that is element with script in view
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_ItemElementScript extends Clevis_View_ItemElement {

    /**
     * Enable script
     * 
     * @var boolean
     */
    private $enableScript = true;
    
    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct();
    }

    /**
     * Enable script
     *
     * @param boolean $enableScript
     */
    public function enableScript($enableScript) {
        $this->enableScript = $enableScript;
    }

    /**
     * Is script enabled
     *
     * @return boolean $enableScript
     */
    public function isScriptEnabled() {
        return $this->enableScript;
    }

    /**
     * Render script
     *
     * @return string
     */
    protected function renderScript() {
        $output = '';
        if ( $this->isScriptEnabled() ) {
            $script = new Clevis_View_Script();
            $this->onInitScript($script);
            $output .= $script->render();
        }
        return $output;
    }

    /**
     * On init script notification
     *
     * @param Clevis_View_Script $script
     */
    protected function onInitScript(Clevis_View_Script & $script) {
    }

    /**
     * Render item element with script
     *
     * @return string
     */
    public function render() {
        $output = '';
        $output .= $this->renderScript();
        $output .= parent::render();
        return $output;
    }

}
?>