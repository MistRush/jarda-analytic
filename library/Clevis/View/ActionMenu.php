<?php

/**
 * Class that represents action with menu
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_ActionMenu extends Clevis_View_Form_ButtonWithMenu {
  
    /**
     * Action body
     *
     * @var string
     */
    private $body;
    
    /**
     * Action attribute value
     *
     * @var string
     */
    private $attributeValue;

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->removeClassAll();
    }
    
    /**
     * Set action title
     *
     * @param string $title
     * @return void
     */
    public function setTitle($title) {
        $this->setLabel($title);
    }

    /**
     * Get action title
     *
     * @return $title
     */
    public function getTitle() {
       return $this->getLabel();
    }
    
    /**
     * Set action attribute value name
     *
     * @param string $attributeValue
     * @return void
     */
    public function setAttributeValue($attributeValue) {
        $this->attributeValue = $attributeValue;
    }
    
    /**
     * Get action attribute value name
     *
     * @return $attribute
     */
    public function getAttributeValue() {
       return $this->attributeValue;
    }

    /**
     * Set action body
     *
     * @param string $body
     * @return void
     */
    public function setBody($body) {
        $this->body = $body;
    }

    /**
     * Has action body
     *
     * @return boolean
     */
    public function hasBody() {
       return $this->body != null;
    }

    /**
     * Get action body
     *
     * @return $body
     */
    public function getBody() {
       return $this->body;
    }

    /**
     * Set enabled
     *
     * @param $enabled
     * @return void
     */
    public function setEnabled($enabled) {
        $this->setDojoAttribute('disabled', true);
    }
    
    /**
     * Get menu item handler
     * 
     * @param $menuItem
     * @return string 
     */
    public function getMenuItemHandler($menuItem) {
        $handler = '';
        $handler .= $this->getParent()->getId() . '.onButton' . ucfirst($this->getName());
        $handler .= '({' . $this->getAttributeValue(). ': ';
        $value = $menuItem->getValue();
        if ( is_integer($value) )
            $handler .= '' . $value . '});';
        else
            $handler .= '"' . $value . '"});';
        return $handler;
    }

    /**
     * Pre render
     */
    public function preRender() {
        $defaultHandler = null;
        foreach ( $this->items as &$menuItem ) {
            $handler = $this->getMenuItemHandler($menuItem);
            $menuItem->setAction($handler);
            if ( $menuItem->getValue() == null )
                $defaultHandler = $handler;
        }
        // Set default handler as handler of item that has value null
        if ( $defaultHandler != null ) {
            $this->setDojoAttribute('onClick', 'function(){ ' . $defaultHandler . ' }');
        }
        return parent::preRender();
    }
    
}
?>