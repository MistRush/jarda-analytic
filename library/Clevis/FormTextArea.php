<?php

class Clevis_FormTextArea extends Clevis_FormItem {

    /**
     * value
     *
     * @var string
     */
    private $value;

    /**
     * class
     *
     * @var string
     */
    private $class;

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

    public function setClass($class) {
        $this->class = $class;
    }

    public function getClass() {
        return $this->class;
    }

    public function render() {
        $output = '';
        $output .= '<div class="form-row-holder ' . $this->getClass() . '">';
        $output .= parent::renderHeader();
        $output .= '<textarea id="' . $this->getID() . '" name="' . $this->getID() . '" cols="50" rows="6">' . $this->getValue() . '</textarea>';
        $output .= parent::renderFooter();
        $output .= "</div>";

        return $output;
    }

}
