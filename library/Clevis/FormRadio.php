<?php

class Clevis_FormRadio extends Clevis_FormBase {

    /**
     * $items
     *
     * @var array
     */
    private $items = array();

    /**
     * value
     *
     * @var string
     */
    private $name;

    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct();
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function getName() {
        return $this->name;
    }

    public function getItems() {
        return $this->items;
    }

    public function addRadioItem($value, $label, $checked = false) {
        $radioItem = new Clevis_FormRadioItem();
        $radioItem->setValue($value);
        $radioItem->setLabel($label);
        $radioItem->setChecked($checked);

        return $this->items[] = $radioItem;
    }

    public function render() {
        $output = '';
        $output .= '<div class="form-row">';

        foreach ($this->getItems() as $item) {
            $checked = '';
            if ($item->getChecked())
                $checked = ' checked';

            $output .= '<input class="radio" type="radio" name="' . $this->getName() . '" value="' . $item->getValue() . '" id="' . $this->getName() . '-' . $item->getValue() . '" ' . $checked . '  />';
            $output .= '<label class="radio" for="' . $this->getName() . '-' . $item->getValue() . '">' . $item->getLabel() . '</label>';
        }

        $output .= "</div>";

        return $output;
    }

}
