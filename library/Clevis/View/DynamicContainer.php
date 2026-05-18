<?php

/**
 * Description of DynamicContainer
 *
 * @author martin
 */
class Clevis_View_DynamicContainer {
    
    /** Items in dynamic container */
    private $items = array();
        
    /**
     * Javascript: onBeforeUpdate
     * Parameters: data
     */
    public function onBeforeUpdate($onBeforeUpdate) {
        $this->onBeforeUpdate = $onBeforeUpdate;
    }
    private $onBeforeUpdate = null;

    /**
     * Javascript: onAfterUpdate
     * Parameters: data
     */
    public function onAfterUpdate($onAfterUpdate) {
        $this->onAfterUpdate = $onAfterUpdate;
    }
    private $onAfterUpdate = null;

    /**
     * Add item to dynamic container
     * 
     * @param Clevis_View_ItemElement $item
     * @param string $update Javascript update procedure with parameters (item, visible, info)
     * @param type $data Data match for item
     * @param type $info Data info for item
     */
    public function addItem(Clevis_View_ItemElement $item, $update, $data = null, $info = null) {
        $this->items[] = array('item' => $item, 'update' => $update, 'data' => $data, 'info' => $info);
    }

    /**
     * Init script type
     *
     * @param Clevis_View_ScriptType $scriptType
     */
    public function initScriptType(Clevis_View_ScriptType & $scriptType) {
        // Init dynamic container, save its items
        $initBody = 'this.dynamicContainerItems = [];' . PHP_EOL;
        $list = '';
        // Save info for each panel
        foreach ( $this->items as $item) {
            if ( empty($list) == false )
                $list .= PHP_EOL;
            // Save data items and panel item type
            $list .= 'this.dynamicContainerItems.push({';
            $list .= 'id: "' . $item['item']->getId() . '", ';
            $list .= 'parentId: "' . $item['item']->dataGetParent()->getId() . '", ';
            $list .= 'update: function(item, visible, info) { ' . $item['update'] . ' }, ';
            $list .= 'data: ' . Zend_Json::encode($item['data']) . ', ';
            $list .= 'info: ' . Zend_Json::encode($item['info']);
            $list .= '});';
        }
        $initBody .= $list . PHP_EOL . 'require(["clevis/view/dynamicContainer"], function(dynamicContainer) { dynamicContainer.init(this); });';
        $scriptType->addMethod('dynamicContainerInit',null,$initBody);

        // Update dynamic container
        $updateBody = '';
        if ( $this->onBeforeUpdate != null)
            $updateBody .= $this->onBeforeUpdate . PHP_EOL;
        $updateBody .= 'require(["clevis/view/dynamicContainer"], function(dynamicContainer) { dynamicContainer.update(this, data); });';
        if ( $this->onAfterUpdate != null)
            $updateBody .= PHP_EOL . $this->onAfterUpdate;
        $scriptType->addMethod('dynamicContainerUpdate',array('data'),$updateBody);
    }
}

?>