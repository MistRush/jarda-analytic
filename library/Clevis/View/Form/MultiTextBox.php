<?php

/**
 * Class that represents multiple text boxes
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Form_MultiTextBox extends Clevis_View_Form_Item {

    /**
     * Items
     *
     * @var array of strings
     */
    private $textBoxes = array();

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setType('clevis.view.form.MultiTextBox');
    }

    /**
     * Add item
     *
     * @param $value
     * @param $name
     * @return void
     */
    public function addTextBox($validatorType, $width, $labelPre = null, $labelPost = null) {
        $this->textBoxes[] = array(
            'validator-type' => $validatorType,
            'width' => $width,
            'label-pre' => $labelPre,
            'label-post' => $labelPost
        );
    }

    /**
     * Set value format
     * 
     * @param string $format
     * @return void
     */
    public function setFormat($format) {
        $this->setDojoAttribute("format", $format);
    }

    /**
     * Process value callbacks
     *
     * @param string $processGetValue
     * @param string $processSetValue
     * @return void
     */
    public function setProcessValue($processGetValue, $processSetValue) {
        $this->setDojoAttribute("processGetValue", $processGetValue);
        $this->setDojoAttribute("processSetValue", $processSetValue);
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
        foreach ( $this->textBoxes as $textBox ) {
            $id =  $name . '_item' . $index;
            $output .= '<label class="clevis-view-multi-textbox">';
            if ( $textBox['label-pre'] != null ) {
                $output .= $textBox['label-pre'] . ' ';
            }
            $output .= '<input style="width: 30px;" id="' . $id . '" jsId="' . $id . '" ';
            $output .= 'data-dojo-type="dijit.form.ValidationTextBox" ';
            if ( $textBox['validator-type'] != null ) {
                $output .= 'data-dojo-props="';
                $output .= Clevis_View_Form_TextBox::formatValidator(Clevis_View_Form_TextBox::getValidator($textBox['validator-type']));
                $output .= '" ';
            }
            $output .= 'maxLength="' . $textBox['width'] . '"';
            $output .= '></input>';
            if ( $textBox['label-post'] != null ) {
                $output .= ' ' . $textBox['label-post'];
            }
            $output .= '</label>' . PHP_EOL;
            $index++;
        }
        $output .= '</td></tr></table>';

        $output .= $this->renderEndTag();

        return $output;
    }

}
?>