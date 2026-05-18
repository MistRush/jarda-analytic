<?php

/**
 * Interface that has getCurrentValue for all view items
 * 
 * @author Martin Srom <srom.martin@gmail.com>
 */
interface Clevis_View_CurrentValueAble {
    
    /**
     * Get current value
     * 
     * @return string
     */
    public function getCurrentValue();
}

?>