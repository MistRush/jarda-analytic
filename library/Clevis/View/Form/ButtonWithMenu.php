<?php

/**
 * Class that represents button with menu
 *
 * @author Pavel Cihlar
 */

class Clevis_View_Form_ButtonWithMenu extends Clevis_View_Form_Item {

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setType('clevis.view.form.ButtonWithMenu');
        $this->setTag('div');
    }

   /**
     * Set action image
     *
     * @param string $image
     * @return void
     */
    public function setImage($image) {
        $this->setDojoAttribute('iconClass', $image);
    }

    /**
     * Has action image
     *
     * @return boolean
     */
    public function hasImage() {
       return $this->hasAttribute('iconClass') != null;
    }

    /**
     * Get action image
     *
     * @return $image
     */
    public function getImage() {
       return $this->getDojoAttribute('iconClass');
    }

    /**
     * Add menuItem
     *
     * @param string $label
     * @param string $action
     * @param string $image
     * @return Clevis_View_MenuItem
     */
    public function addMenuItem($label,$image = null,$value = null) {
        // Create action
        $menuItem = new Clevis_View_MenuItem();
        $menuItem->setLabel($label);
        $menuItem->setValue($value);
        if ( $image != null )
            $menuItem->setImage($image);
        return $this->addItem($menuItem);
    }

    /**
     * Render ComboButton
     *
     * @return string
     */
    public function render() {
        $attributes = array();

        $output = '';
        $output .= $this->renderBeginTag('div',$attributes);
        $output .= '<span>' . $this->getlabel() . '</span>';
        $output .= '<div dojoType="dijit.Menu">' . PHP_EOL;
        $output .= $this->renderContent();
        $output .= '</div>';
        $output .= $this->renderEndTag();

        return $output;
    }
}
?>