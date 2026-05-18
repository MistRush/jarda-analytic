<?php

/**
 * Class that represents view script (page defined by view script phtml)
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_ViewScript extends Clevis_View_Item {

    /**
     * Relative filename to view
     * 
     * @var string
     */
    private $viewScript;

    /**
     * Pre rendered output
     * 
     * @var string
     */
    private $output;

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->parentInfo = new Clevis_View_ParentInfo();
        $this->parentInfo->setParent($this);
    }

    /**
     * Set relative filename to view
     *
     * @param string $view
     */
    public function setViewScript($viewScript) {
        $this->viewScript = $viewScript;
    }


    /**
     * Get relative filename to view
     * @return $view
     */
    public function getViewScript() {
        return $this->viewScript;
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
        // Call parent info methods
        return call_user_func_array(array($this->parentInfo,$name),$newArguments);
    }

    /**
     * Pre render view
     *
     * @return void
     */
    public function preRender() {
        $parentInfo = Clevis_View_ParentInfo::pushParentInfo($this->parentInfo);
        $this->output = parent::getView()->getZendView()->render($this->getViewScript());
        Clevis_View_ParentInfo::popParentInfo();
    }

    /**
     * Render view
     * 
     * @return string
     */
    public function render() {
        return $this->output;
    }

}
?>