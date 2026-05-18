<?php

/**
 * Class that represents Input Editor
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Form_Editor extends Clevis_View_Form_Item {

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setType('clevis.view.form.Editor');
        $this->setTag('div');
        $this->setClass('clevis-view-form-editor');
        $this->setElementAttribute('data-dojo-props', "extraPlugins:['|','foreColor','hiliteColor','|','createLink','insertImage','|','viewsource']");
        //$this->setElementAttribute('data-dojo-props', "extraPlugins:['foreColor','hiliteColor','|','createLink','insertImage','fullscreen','viewsource','newpage']");
        
    }


}
?>