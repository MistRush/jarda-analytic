<?php

/**
 * Class that represents Input Textarea
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Form_TextArea extends Clevis_View_Form_Item {

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setTag('textarea');
        $this->addClass('clevis-view-textArea');
        $this->setType('dijit.form.SimpleTextarea');
    }
    
}
?>