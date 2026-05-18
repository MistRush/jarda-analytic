<?php

/**
 * Class that represents grid enum formatter
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_Grid_FormatterEnum extends Clevis_View_Grid_Formatter {

    /**
     * Constructor
     * 
     * @param $values
     */
    public function  __construct($values = array()) {
        parent::__construct();

        $this->data['name'] = Clevis_View_Grid::FORMATTER_ENUM;
        $this->data['values'] = $values;
    }

}
?>