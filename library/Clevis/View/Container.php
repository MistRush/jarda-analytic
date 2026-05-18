<?php

/**
 * Class that represents container
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_Container extends Clevis_View_Form_Container {

    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct();
        $this->enableScript(false);
        $this->enableScriptType(false);
    }

    /**
     * Add code to container
     * 
     * @param string $code
     * @return Clevis_View_Code
     */
    public function addCode($code) {
        $itemCode = new Clevis_View_Code();
        $itemCode->setCode($code);
        return $this->addItem($itemCode);
    }
    
    /**
     * Add horizontal line to container
     * 
     * @return Clevis_View_Code
     */
    public function addHorizontalLine() {
        $itemCode = new Clevis_View_Code();
        $itemCode->setCode('<hr>');
        return $this->addItem($itemCode);
    }
    
    /**
     * Add script source to container
     * 
     * @param string $url
     */
    public function addScriptSource($url) {
        $itemCode = new Clevis_View_Code();
        $itemCode->setCode(
            '<script type="text/javascript" src="' .
            $url . 
            '"></script>' . PHP_EOL
        );
        $this->addItem($itemCode);
    }

    /**
     * Add script source to container
     *
     * @param string $url
     */
    public function addScript($code) {
        $itemCode = new Clevis_View_Code();
        $itemCode->setCode(
            '<script type="text/javascript">' .  PHP_EOL . $code . PHP_EOL . '</script>' . PHP_EOL
        );
        $this->addItem($itemCode);
    }

    /**
     * Add placeholder to container
     *
     * @param string $placeholder
     * @param array $replace ('string' => 'string')
     * @return Clevis_View_Placeholder
     */
    public function addPlaceholder($placeholder, $replace = array()) {
        $itemplaceholder = new Clevis_View_Placeholder();
        $itemplaceholder->setPlaceholder($placeholder);
        $itemplaceholder->setReplace($replace);
        return $this->addItem($itemplaceholder);
    }
    
    /**
     * Add border container to container
     * 
     * @return Clevis_View_Layout
     */
    public function addLayout() {
        $layout = new Clevis_View_Layout();
        return $this->addItem($layout);
    }

    /**
     * Add tab container
     *
     * @return Clevis_View_TabContainer
     */
    public function addTabContainer() {
        return $this->addItem(new Clevis_View_TabContainer());
    }

    /**
     * Add action set
     *
     * @param $fillType automatic fill type
     * @return Clevis_View_ActionSet
     */
    public function addActionSet($fillType = null,$name = null) {
        $actionSet = new Clevis_View_ActionSet();
        if ( $fillType != null ) {
            $actionSet->fill($fillType,$name);
        }
        return $this->addItem($actionSet);
    }

    /**
     * Add form to container. If data attribute is filled, form will be filled
     * by values from data attributes otherwise form will be filled from root
     * values.
     * 
     * @param Zend_From $form
     * @param string $dataAttribute
     * @return Clevis_View_Form
     */
    public function addForm($dataAttribute = null) {
        $itemForm = new Clevis_View_Form();
        if ( $dataAttribute != null )
            $itemForm->setDataAttribute($dataAttribute);
        return $this->addItem($itemForm);
    }

    /**
     * Add view to container
     *
     * @param string $view
     * @return Clevis_View_View
     */
    public function addViewScript($viewScript) {
        $itemViewScript = new Clevis_View_ViewScript();
        $itemViewScript->setViewScript($viewScript);
        return $this->addItem($itemViewScript);
    }

    /**
     * Add set store to container
     *
     * @return Clevis_View_StoreSet
     */
    public function addStoreSet() {
        $store = new Clevis_View_StoreSet();
        return $this->addItem($store);
    }

    /**
     * Add write store to container
     *
     * @return Clevis_View_StoreWrite
     */
    public function addStore() {
        $store = new Clevis_View_Store();
        return $this->addItem($store);
    }

    /**
     * Add entity
     * 
     * @return Clevis_View_Entity
     */
    public function addEntity() {
        $entity = new Clevis_View_Entity();
        return $this->addItem($entity);
    }

    /**
     * Add query write store to container
     *
     * @return Clevis_View_ItemFileWriteStore
     */
    public function addItemFileWriteStore() {
        $store = new Clevis_View_ItemFileWriteStore();
        return $this->addItem($store);
    }

    /**
     * Add grid to container
     *
     * @return Clevis_View_Grid
     */
    public function addGrid() {
        $grid = new Clevis_View_Grid();
        return $this->addItem($grid);
    }

    /**
     * Add group to container
     *
     * @return Clevis_View_Group
     */
    public function addGroup($title, $name = null) {
        $group = new Clevis_View_Group();
        $group->setTitle($title);
        if ($name != null) {
            $group->setName($name);
        }
        return $this->addItem($group);
    }

    /**
     * Add check group to container. If data attribute is filled, form will be filled
     * by values from data attributes otherwise form will be filled from root
     * values.
     *
     * @param string $dataAttribute
     * @return Clevis_View_CheckGroup
     */
    public function addCheckGroup($title, $dataAttribute = null) {
        $group = new Clevis_View_CheckGroup();
        $group->setTitle($title);
        if ( $dataAttribute != null )
            $group->setDataAttribute($dataAttribute);
        return $this->addItem($group);
    }

    /**
     * Add panel to container
     *
     * @return Clevis_View_Panel
     */
    public function addPanel() {
        $panel = new Clevis_View_Panel();
        return $this->addItem($panel);
    }

    /**
     * Add titlePane to container
     *
     * @return Clevis_View_TitlePane
     */
    public function addPanelTitle($title) {
        $panelTitle = new Clevis_View_PanelTitle();
        $panelTitle->setTitle($title);
        return $this->addItem($panelTitle);
    }

    /**
     * Add html element to container
     *
     * @return Clevis_View_Element
     */
    public function addElement($tag,$content = null) {
        $element = new Clevis_View_Element();
        $element->setTag($tag);
        if ( $content != null)
            $element->setContent($content);
        return $this->addItem($element);
    }

    /**
     * Add html elementDiv to container
     *
     * @return Clevis_View_ElementDiv
     */
    public function addElementDiv() {
        $elementDiv = new Clevis_View_ElementDiv();
        return $this->addItem($elementDiv);
    }

    /**
     * Add filter set
     *
     * @return Clevis_View_FilterSet
     */
    public function addFilterSet() {
        $filterSet = new Clevis_View_FilterSet();
        return $this->addItem($filterSet);
    }

    /**
     * Add toolTip to container
     *
     * @return Clevis_View_ToolTip
     */
    public function addToolTip($connectId) {
        $toolTip = new Clevis_View_ToolTip();
        $toolTip->setConnectId($connectId);
        return $this->addItem($toolTip);
    }

    /**
     * Add Tree to container
     *
     * @return Clevis_View_Tree
     */
    public function addTree() {
        $tree = new Clevis_View_Tree();
        return $this->addItem($tree);
    }

    /**
     * Add Tree to container
     *
     * @return Clevis_View_ButtonWithMenu
     */
    public function addButtonWithMenu($label,$image = null) {
        $button = new Clevis_View_ButtonWithMenu();
        $button->setLabel($label);
        if ( $image != null)
            $button->setImage($image);
        return $this->addItem($button);
    }
    
    /**
     * Add Listing to container
     *
     * @return Clevis_View_Listing
     */
    public function addListing($title = null, $name = null) {
        $listing = new Clevis_View_Listing($title, $name);
        return $this->addItem($listing);
    }
    
    /**
     * Add PanelStack to container
     *
     * @return Clevis_View_PanelStack
     */
    public function addPanelStack($dataAttribute, Clevis_View_DynamicContainer & $dynamicContainer, Clevis_View_ItemElement & $panelParent = null) {
        $panelStack = new Clevis_View_PanelStack($dataAttribute, $dynamicContainer);
        if ( $panelParent != null )
            $panelStack->setPanelParent($panelParent);
        return $this->addItem($panelStack);
    }
    
    /**
     * Add image
     * 
     * @return Clevis_View_Code
     */
    public function addImage($image, $type, $class = null) {
        $code = new Clevis_View_Code();
        $code->setCode(Clevis_Image::render($image, $type, $class));
        return $this->addItem($code);
    }
    
    /**
     * Add float clear both
     * 
     * @return Clevis_View_Code
     */
    public function addFloatClear() {
        $code = new Clevis_View_Code();
        $code->setCode('<div style="clear: both;"></div>');
        return $this->addItem($code);
    }
    
    /**
     * Add picker
     * 
     * @return Clevis_View_Picker
     */
    public function addPicker() {
        $picker = new Clevis_View_Picker();
        return $this->addItem($picker);
    }
}

?>