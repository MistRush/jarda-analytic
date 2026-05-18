<?php

class Clevis_FormBlock {

    /**
     * Title
     *
     * @var string
     */
    private $title;

    /**
     * Description
     *
     * @var string
     */
    private $description;
    
    /**
     * Class
     *
     * @var string
     */
    private $class;

    /**
     * Items
     *
     * @var arraz
     */
    private $items = array();

    /**
     * Constructor
     */
    public function __construct() {

    }

    public function setTitle($title) {
        $this->title = $title;
    }

    public function getTitle() {
        return $this->title;
    }

    public function setDescription($description) {
        $this->description = $description;
    }

    public function getDescription() {
        return $this->description;
    }
    
    public function setClass($class) {
        $this->class = $class;
    }

    public function getClass() {
        return $this->class;
    }

    public function addTextBox($ID, $label, $type, $value = '', $required = true, $validate = true, $maxLength = 64, $readOnly = false, $description = '') {
        $textBox = new Clevis_FormTextBox();
        $textBox->setID($ID);
        $textBox->setLabel($label);
        $textBox->setMaxlength($maxLength);
        $textBox->setRequired($required);
        $textBox->setType($type);
        $textBox->setValidate($validate);
        $textBox->setValue($value);
        $textBox->setReadOnly($readOnly);
        $textBox->setDescription($description);

        return $this->items[] = $textBox;
    }

    public function addTextArea($ID, $label, $value = '', $validate = false) {
        $textArea = new Clevis_FormTextArea();
        $textArea->setID($ID);
        $textArea->setLabel($label);
        $textArea->setValidate($validate);
        $textArea->setValue($value);

        return $this->items[] = $textArea;
    }

    public function addRadio($radio) {

        return $this->items[] = $radio;
    }

    public function render() {
        $output = '';
        $output .= '<div class="form-content ' . $this->getClass() . '">';
        $output .= '<h2>' . $this->getTitle() . '</h2>';
        $output .= '<p>' . $this->getDescription() . '</p>';

        foreach ($this->items as $item) {
            $output .= $item->render();
        }

        $output .= '</div>';

        echo $output;
    }

}
