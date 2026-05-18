<?php

/**
 * Class that represents Input RadiButton
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Form_CheckBox extends Clevis_View_Form_Item {

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setType('clevis.view.form.CheckBox');
        $this->setTag('input');
    }

    /**
     * Set checked
     * 
     * @param $checked
     * @return void
     */
    public function setChecked($checked) {
        $this->setDojoAttribute('checked', $checked);
    }

     /**
     * Render filtering select
     *
     * @return string
     */
    public function render() {
        $output = '';

        $output .= parent::render();

        if ( ($this->getParent() instanceof Clevis_View_Form) == false ) {
            $output .= '<label for=' . $this->getId() . '>' . $this->getLabel() . '</label>';
        }
        
        return $output;
    }

}
?>