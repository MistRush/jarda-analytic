<?php

class Clevis_FormItem extends Clevis_FormBase {

    /**
     * Label
     *
     * @var string
     */
    private $label;

    /**
     * Required
     *
     * @var boolean
     */
    private $required = false;

    /**
     * Validate
     *
     * @var boolean
     */
    private $validate;

    /**
     * description
     *
     * @var string
     */
    private $description;

    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct();
    }

    public function setLabel($label) {
        $this->label = $label;
    }

    public function getLabel() {
        return $this->label;
    }

    public function setRequired($required) {
        $this->required = $required;
    }

    public function getRequired() {
        return $this->required;
    }

    public function setValidate($validate) {
        $this->validate = $validate;
    }

    public function getValidate() {
        return $this->validate;
    }

    public function setDescription($description) {
        $this->description = $description;
    }

    public function getDescription() {
        return $this->description;
    }

    public function renderHeader() {
        $output = '';
        $output .= '<label for="' . $this->getID() . '">' . $this->getLabel();
        $output .= ($this->getRequired() ? ' <span class="required">*</span>' : '');
        $output .= ($this->getDescription() ? ' <span class="description">(' . $this->getDescription() . ')</span>' : '');
        $output .= '</label>';

        return $output;
    }

    public function renderFooter() {
        $output = '';

        if ($this->getValidate())
            $output .= '<span id="' . $this->getID() . 'Error" class="error"></span>';


        return $output;
    }

}
