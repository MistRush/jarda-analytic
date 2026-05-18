<?php

/**
 * Class that represents Input RadiButton
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Form_RadioButton extends Clevis_View_Form_Item {

    /**
     * Items
     *
     * @var array of strings
     */
    private $dataItems = array();

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setType('clevis.view.form.RadioButton');
    }

    /**
     * Add item
     *
     * @param $value
     * @param $name
     * @return void
     */
    public function addDataItem($value, $name) {
        $this->dataItems[$value] = $name;
    }

    /**
     * Add items
     *
     * @param array $items
     * @return void
     */
    public function addDataItems($items) {
        foreach ( $items as $value => $name)
            $this->addDataItem($value, $name);
    }

    /**
     * Set value of whole group (checked value)
     * 
     * @param string $value
     * @return void
     */
    public function setValue($value) {
        $this->setDojoAttribute("defaultValue", $value);
    }

    /**
     * Get value
     *
     * @return string $value
     */
    public function getValue() {
        return $this->getDojoAttribute("defaultValue");
    }

    /**
     * Render radio button
     *
     * @return string
     */
    public function render() {
        $output = $this->renderBeginTag('div');
        $output .= '<table><tr><td>';
        $index = 1;
        $name = $this->getId();
        foreach ( $this->dataItems as $value => $option ) {
            $id =  $name . '_item' . $index;
            $output .= '<label>';
            $output .= '<input id="' . $id . '" jsId="' . $id . '" name="' . $name . '" data-dojo-type="dijit.form.RadioButton" value="' . $value . '"';
            /*if ( $value === $this->value ) {
                $output .= ' checked="true"';
            }*/
            $output .= '></input>';
            $output .= $option;
            $output .= '</label>' . PHP_EOL;
            $index++;
        }
        $output .= '</td></tr></table>';

        $output .= $this->renderEndTag();

        return $output;
    }

}
?>