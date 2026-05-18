<?php

/**
 * Class that represents Input TimeBox
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Form_TimeBox extends Clevis_View_Form_Item {

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setType('clevis.view.form.TimeBox');
        $this->setTag('div');
        $this->setDojoAttribute('invalidMessage','Zadejte čas ve správném formátu!');
        $this->setDojoAttribute('constraints', array('clickableIncrement' => 'T01:00:00', 'visibleIncrement' => 'T01:00:00', 'visibleRange' => 'T14:00:00'));
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

}
?>