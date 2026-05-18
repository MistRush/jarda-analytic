<?php

/**
 * Class that represents Input DateBox
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Form_DateBox extends Clevis_View_Form_Item {

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setType('clevis.view.form.DateBox');
        $this->setTag('div');
        $this->setDojoAttribute('invalidMessage','Zadejte datum ve správném formátu!');
    }

    /**
     * Set required
     *
     * @param string $required
     * @return void
     */
    public function setRequired($required) {
        $this->setDojoAttribute('required', $required);
    }

    /**
     * Get required
     *
     * @return string $required
     */
    public function getRequired() {
        return $this->getAttribute('required');
    }

    /**
     * Set readOnly
     *
     * @param string $readOnly
     * @return void
     */
    public function setReadOnly($readOnly) {
        $this->setElementAttribute('readonly', $readOnly);
        $this->setStyle('background-color', '#eee');
    }

    /**
     * Get readOnly
     *
     * @return string $readOnly
     */
    public function getReadOnly() {
        return $this->getAttribute('readonly');
    }

    public function render() {

        $cancelIcon = '';
        /*
        if ( $this->getRequired() == false && ($this->getParent() instanceof Clevis_View_FilterSet) == false ) {
            $cancelIcon .= '<div style="padding: 0px; display: inline-block;"><a style="cursor: pointer;" onClick="dijit.byId(\'' . $this->getId() . '\').attr(\'value\', null);"><img style="vertical-align:middle;" src="' . Zend_Controller_Front::getInstance()->getBaseUrl() . '/clevis/src/clevis/resources/images/cancelIcon.png" /></a></div>';
        }               
        */
        $output = '';
        $output .= parent::render();
        $output .= $cancelIcon;
        return $output;
    }

}
?>