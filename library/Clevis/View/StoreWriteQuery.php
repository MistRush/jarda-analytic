<?php

/**
 * Class that represents query write store
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_StoreWriteQuery extends Clevis_View_StoreWrite {
    
    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setBaseType('clevis/view/StoreWriteQuery');
    }
   
}
?>