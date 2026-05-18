<?php

/**
 * Class that represents every item in view
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_Item {

    /**
     * Subitems of this item
     *
     * @var array of Clevis_View_Item
     */
    protected $items = array();

    /**
     * Parent item
     * 
     * @var Clevis_View_Item
     */
    protected $parent;
    
    /**
     * Item is parent for other data items (they will connect here)
     *
     * @var boolean
     */
    private $dataIsParent = false;
    
    /**
     * Item is data item (it will connect to first data parent)
     *
     * @var boolean
     */
    private $dataIsItem = false;
    
    /**
     * Data parent
     * 
     * @var Clevis_View_Item
     */
    private $dataParent = null;
    
    /**
     * Items for data manipulation
     *
     * @var array of items
     */
    private $dataItems = array();
    
    /**
     * Vertical align
     * 
     * @var enum (ALIGN_TOP | ALIGN_MIDDLE | ALIGN_BOTTOM)
     */
    private $verticalAlign = null;
    
    /**
     * Vertical align class
     * 
     * @var string
     */
    private $verticalAlignClass = null;

    /**
     * Permission Write
     *
     * @var bool
     */
    protected $permissionWrite;

    /**
     * Constructor
     */
    public function __construct() {
    }
    
    /**
     * Set item parent
     *
     * @param Clevis_View_Item $parent
     * @return void
     */
    public function setParent(&$parent) {
        $oldParent = &$this->parent;
        $this->parent = &$parent;
        if ( $oldParent != $parent )
            $this->onSetParent($oldParent,$parent);
    }

    /**
     * Has parent
     * 
     * @return boolean
     */
    public function hasParent() {
        return $this->parent != null;
    }

    /**
     * Get item parent
     *
     * @return $parent
     */
    public function & getParent() {
        return $this->parent;
    }

    /**
     * Get first parent of given type
     * 
     * @param string $type
     * @param boolean $processThis
     * @return parent with the type or null
     */
    public function & getParentWithType($type,$processThis = false) {
        $parent = $this;
        while ( $parent != null ) {
            if ( $processThis && $parent instanceof $type )
                return $parent;
            $parent = &$parent->getParent();
            $processThis = true;
        }
        $parent = null;
        return $parent;
    }

    /**
     * Get top parent
     * 
     * @return topparent
     */
    public function & getTopParent() {
        $parent = $this;
        while ( $parent->hasParent() ) {
            $parent = $parent->getParent();
        }
        return $parent;
    }

    /**
     * Get previous item of given item
     *
     * @param Clevis_View_Item $item
     */
    public function & getPreviousItem(Clevis_View_Item & $item) {
        $previousItem = null;
        foreach ( $this->items as &$currentItem ) {
            if ( $currentItem === $item )
                break;
            $previousItem = &$currentItem;
        }
        return $previousItem;
    }

    /**
     * Get next item of given item
     *
     * @param Clevis_View_Item $item
     */
    public function & getNextItem(Clevis_View_Item & $item) {
        $nextItem = null;
        $next = false;
        foreach ( $this->items as &$currentItem ) {
            if ( $next ) {
                $nextItem = &$currentItem;
                break;
            }
            if ( $currentItem === $item ) {
                $next = true;
            }
        }
        return $nextItem;
    }

    /**
     * Get last subitem
     * 
     * @return Clevis_View_Item
     */
    public function & getLastItem() {
        if ( count($this->items) == 0 ) {
            $result = null;
            return $result;
        }
        return $this->items[count($this->items) - 1];
    }
    
    /**
     * Get subitem
     * 
     * @return Clevis_View_Item
     */
    public function & getItem($index) {
        if ( $index >= 0 && $index < count($this->items) ) {
            return $this->items[$index];
        }
        else {
            return null;
        }
    }

    /**
     * Get item count
     *
     * @return integer
     */
    public function getItemCount() {
        return count($this->items);
    }

    /**
     * Is empty
     *
     * @return boolean
     */
    public function isEmpty() {
        return count($this->items) == 0;
    }

    /**
     * Get view
     * 
     * @return Clevis_View
     */
    public function getView($error = true) {
        $topParent = $this->getParentWithType('Clevis_View');
        if ( $topParent != null )
            return $topParent;
        else if ( $error) {
            throw new Exception('Can\'t get Clevis_View by getTopParent, the item is not in right object tree!');
        }
        return null;
    }

    /**
     * Get top level view
     *
     * @return Clevis_View
     */
    public function getTopView($error = true) {
        $topParent = $this->getTopParent();
        if ( $topParent instanceof Clevis_View )
            return $topParent;
        else if ( $error) {
            throw new Exception('Can\'t get Clevis_View by getTopParent, the item is not in right object tree!');
        }
        return null;
    }

    /**
     * Check if item has class
     *
     * @param $class
     * @return bool
     */
    public function hasClass($class) {
        return false;
    }

    /**
     * Add sub item to this item
     *
     * @param Clevis_View_Item $item
     * @param boolean  $skipParentCheck  Flag if parent check should be skipped
     * @return Clevis_View_Item
     */
    public function addItem(Clevis_View_Item $item, $skipParentCheck = false) {
        if ( $skipParentCheck == false && $item->parent != null ) {
            throw new Exception('Item ' . $item->getId() . ' has already been added to render tree!');
        }
        $item->setParent($this);
        $this->items[] = $item;
        return $item;
    }

    /**
     * Delete sub item from this item
     *
     * @param Clevis_View_Item $item
     */
    public function deleteItem(Clevis_View_Item $item)
    {
        array_remove($this->items, $item);
    }
    
    /**
     * Set as parent for other data items (they will connect here)
     * 
     * @param boolean $dataIsParent
     */
    public function dataSetIsParent($dataIsParent) {
        $this->dataIsParent = $dataIsParent;
    }
    
    /**
     * Is data parent (data items will connect here)
     * 
     * @return boolean $isDataParent
     */
    public function dataIsParent() {
        return $this->dataIsParent;
    }
    
    /**
     * Set as data item (it will connect to first data parent)
     * 
     * @param boolean $dataIsItem 
     */
    public function dataSetIsItem($dataIsItem) {
        $this->dataIsItem = $dataIsItem;
    }
    
    /**
     * Is data item (it will connect to first data parent)
     * 
     * @return boolean $isDataParent
     */
    public function dataIsItem() {
        return $this->dataIsItem;
    }
    
    /**
     * Add data item (for data manipulation)
     *
     * @param Clevis_View_Item $item
     * @return void
     */
    public function dataAddItem(Clevis_View_Item & $item) {
        $this->dataItems[] = $item;
    }
    
    /**
     * Remove data item
     *
     * @param Clevis_View_Item $item
     * @return void
     */
    public function dataRemoveItem(Clevis_View_Item & $item) {
        array_remove_reference($this->dataItems,$item);
    }
    
    /**
     * Get data items
     * 
     * @return array of data items
     */
    public function getDataItems() {
        return $this->dataItems;
    }
    
    /**
     * Get first data parent
     * 
     * @return data parent
     */
    public function & dataGetParent() {
        if ( $this->dataParent == null ) {
            $parent = &$this->getParent();
            while ( $parent != null ) {
                if ( $parent->dataIsParent() )
                    return $parent;
                $parent = &$parent->getParent();
            }
            $parent = null;
            $this->dataParent = $parent;
        }
        return $this->dataParent;
    }
    
    /**
     * Set vertical align
     * 
     * @param enum $verticalAlign (ALIGN_TOP | ALIGN_MIDDLE | ALIGN_BOTTOM)
     * @param string $verticalAlignClass
     */
    public function setVerticalAlign($verticalAlign, $verticalAlignClass = null) {
        $this->verticalAlign = $verticalAlign;
        $this->verticalAlignClass = $verticalAlignClass;
    }
    
    /**
     * Has vertical align
     * 
     * @return boolean
     */
    public function hasVerticalAlign() {
        return $this->verticalAlign != null;
    }
    
    /**
     * Get vertical align
     * 
     * @return $verticalAlign
     */
    public function getVerticalAlign() {
        return $this->verticalAlign;
    }
    
    /**
     * Set permission write
     *
     * @param string|bool $permission Permission code or bool
     * @return void
     */
    public function setPermissionWrite($permission) {
        if ( is_bool($permission) )
            $this->permissionWrite = $permission;
        else
            $this->permissionWrite = Clevis_Permission::getInstance()->hasPermissionWrite($permission);
    }

    /**
     * Has permission write
     *
     * @return bool
     */
    public function hasPermissionWrite() {
        if ( $this->permissionWrite === null ) {
            $parent = $this->getParent();
            if ( $parent != null ) {
                $this->permissionWrite = $parent->hasPermissionWrite();
            } else {
                $this->permissionWrite = false;
            }
        }
        return $this->permissionWrite;
    }

    /**
     * Pre render item (recursive)
     * This feature is need by inner view, becouse the inner view must be
     * rendered before may view because it has to add some references to parent
     * view and it has to be rendered
     *
     * @return string
     */
    public function preRender() {
        // If it is data item
        if ( $this->dataIsItem() ) {
            // Register to data parent
            $dataParent = $this->dataGetParent();
            if ( $dataParent != null ) {
                $dataParent->dataAddItem($this);
            }
        }
        
        $output = '';
        foreach ( $this->items as $item ) {
            $output .= $item->preRender();
        }
        return $output;
    }

    /**
     * Render item
     * 
     * @return string
     */
    public function render() {
        $output = '';
        if ( $this->hasVerticalAlign() != null ) {
            $class = '';
            if ( $this->verticalAlignClass != null )
                $class = ' class="' . $this->verticalAlignClass . '"';
            foreach ( $this->items as &$item ) {
                if ( $item->hasClass('clevis-hidden') ) {
                    $output .= $item->render();
                } else {
                    $output .= '<div style="display: inline-block;"><table' . $class . '><tr>';
                    $output .= '<td>' . PHP_EOL;
                    $output .= $item->render();
                    $output .= '</td>' . PHP_EOL;
                    $output .= '</tr></table></div>' . PHP_EOL;
                }
            }
            return $output;
        } else {
            foreach ( $this->items as &$item ) {
                $output .= $item->render();
            }
        }
        return $output;
    }

    /**
     * On set parent notification
     *
     * @param $oldParent
     * @param $newParent
     * @return void
     */
    protected function onSetParent(&$oldParent,&$newParent) {
    }

}
?>