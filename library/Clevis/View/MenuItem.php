<?php

/**
 * Class that represents menuItem
 *
 * @author Pavel Cihlar
 */
class Clevis_View_MenuItem extends Clevis_View_ItemElement {
  
    /**
     * MenuItem name
     *
     * @var string
     */
    private $name;
    
    /**
     * MenuItem label
     *
     * @var string
     */
    private $label;
    
    /**
     * MenuItem value
     *
     * @var string
     */
    private $value;

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setTag('div');
        $this->setType('clevis.view.MenuItem');
    }
    
    /**
     * Set menuItem label
     *
     * @param string $label
     * @return void
     */
    public function setLabel($label) {
        $this->label = $label;
    }

    /**
     * Get menuItem label
     *
     * @return $label
     */
    public function getLabel() {
       return $this->label;
    }
    
    /**
     * Set menuItem value
     *
     * @param string $value
     * @return void
     */
    public function setValue($value) {
        $this->value = $value;
    }

    /**
     * Get action value
     *
     * @return $value
     */
    public function getValue() {
       return $this->value;
    }

    /**
     * Set menuItem action
     *
     * @param string $action
     * @return void
     */
    public function setAction($action) {
        $this->setDojoAttribute('onClick', 'function() { ' . $action . ' }');
    }

    /**
     * Set menu item image
     *
     * @param string $image
     * @return void
     */
    public function setImage($image) {
        $this->setDojoAttribute('iconClass', $image);
    }

    /**
     * Get menu item image
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
    public function addMenuItem($label,$image = null,$action = null) {
        // Create action
        $menuItem = new Clevis_View_MenuItem();
        $menuItem->setLabel($label);
        if ( $image != null )
            $menuItem->setImage($image);
        $menuItem->setAction($action);
        return $this->addItem($menuItem);
    }
    
    public function preRender() {
        return parent::preRender();
    }

    /**
     * Render menuItem
     *
     * @return string
     */
    public function render() {
        if ( $this->getItemCount() > 0 ) {
            $this->setType('dijit.PopupMenuItem');
        }

        $attributes = array();

        $output = '';
        $output .= $this->renderBeginTag('div', $attributes);
        
        if ( $this->getItemCount() > 0 ) {
            $output .= '<span>' . $this->getLabel() . '</span>' . PHP_EOL;
            $output .= '<div dojoType="dijit.Menu">' . PHP_EOL;
            $output .= $this->renderContent();
            $output .= '</div>' . PHP_EOL;
        } else {
            $output .= $this->getLabel();
        }
        
        $output .= $this->renderEndTag();

        return $output;
    }
}
?>