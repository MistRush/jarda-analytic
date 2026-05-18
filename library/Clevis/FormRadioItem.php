<?php

class Clevis_FormRadioItem extends Clevis_FormRadio {

    /**
     * label
     *
     * @var string
     */
    private $label;

    /**
     * value
     *
     * @var string
     */
    private $value;

    /**
     * checked
     *
     * @var string
     */
    private $checked;

    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct();
    }

    public function setValue($value) {
        $this->value = $value;
    }

    public function getValue() {
        return $this->value;
    }

    public function setLabel($label) {
        $this->label = $label;
    }

    public function getLabel() {
        return $this->label;
    }

    public function setChecked($checked) {
        $this->checked = $checked;
    }

    public function getChecked() {
        return $this->checked;
    }

    public function render() {
        $output = 'ahoj ';

        return $output;
    }

}
