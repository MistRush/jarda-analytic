<?php

/**
 * Class that represents html element DIV
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_ElementDiv extends Clevis_View_Container {

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setTag('div');
    }

}
?>