<?php

class Clevis_FormBase {

    /**
     * ID
     *
     * @var string
     */
    private $ID;

    /**
     * Constructor
     */
    public function __construct() {

    }

    public function setID($ID) {
        $this->ID = $ID;
    }

    public function getID() {
        return $this->ID;
    }

}
