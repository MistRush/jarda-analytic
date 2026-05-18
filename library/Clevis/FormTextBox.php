<?php

class Clevis_FormTextBox extends Clevis_FormItem {

    /**
     * type
     *
     * @var string
     */
    private $type;

    /**
     * value
     *
     * @var string
     */
    private $value;

    /**
     * maxLength
     *
     * @var string
     */
    private $maxLength;

    /**
     * class
     *
     * @var string
     */
    private $class;

    /**
     * Class
     *
     * @var string
     */
    private $readOnly;

    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct();
    }

    public function setType($type) {
        $this->type = $type;
    }

    public function getType() {
        return $this->type;
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

    public function setMaxlength($maxLength) {
        $this->maxLength = $maxLength;
    }

    public function getMaxlength() {
        return $this->maxLength;
    }

    public function setReadOnly($readOnly) {
        $this->readOnly = $readOnly;
    }

    public function getReadOnly() {
        return $this->readOnly;
    }

    public function render() {
        $output = '';
        $output .= '<div class="form-row-holder ' . $this->getClass() . '">';
        $output .= '<div class="row">';
        $output .= '<div class="col-md-2 text-box">';
        $output .= parent::renderHeader();
        $output .= '</div>';

        $output .= '<div class="col-md-6">';
        $readOnly = ( $this->getReadOnly() ? ' readOnly' : '' );
        $output .= '<input type = "' . $this->getType() . '" name = "' . $this->getID() . '" id = "' . $this->getID() . '" maxlength = "' . $this->getMaxlength() . '" value = "' . $this->getValue() . '" ' . $readOnly . ' />';
        $output .= "</div>";

        $output .= parent::renderFooter();

        $output .= "</div>";
        $output .= "</div>";

        return $output;
    }

}
