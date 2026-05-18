<?php

/**
 * Class that represents grid formatter
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_Grid_Formatter {

    /**
     * Formatter data
     * 
     * @var string
     */
    protected $data;
    
    /**
     * Constructor
     */
    public function  __construct() {
    }

    /**
     * Convert formatter to array
     *
     * @param Clevis_View_Grid & $grid
     * @return array
     */
    public function toArray(Clevis_View_Grid & $grid) {
        return $this->data;
    }

}
?>