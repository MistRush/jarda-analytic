<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * EntityOther Behavior
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Behavior_EntityOther extends Doctrine_Template {

    /**
     * Options
     *
     * @var array
     */
    protected $_options = array(
        'Column' => 'Entity_ID',
        'ColumnOther' => 'Entity',
        'EntityColumn' => 'Name'
    );
    
    /**
     * Set table definition for behavior
     *
     * @return void
     */
    public function setTableDefinition()
    {
        $this->hasColumn($this->_options["ColumnOther"], 'string', 64);
        $this->addListener(new Clevis_Behavior_EntityOtherListener($this->_options));
    }
}
?>