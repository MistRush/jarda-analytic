<?php

/**
 * UuidAble Behavior
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Behavior_UuidAble extends Doctrine_Template {

    /**
     * Options
     *
     * @var array
     */
    protected $_options = array(
    );
    
    /**
     * Set table definition for behavior
     *
     * @return void
     */
    public function setTableDefinition()
    {
        $this->hasColumn('UUID','char',36);
        
        $this->addListener(new Clevis_Behavior_UuidAbleListener());
    }
}
?>