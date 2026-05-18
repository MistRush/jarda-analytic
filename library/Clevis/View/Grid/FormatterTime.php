<?php

/**
 * Class that represents grid time formatter
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_Grid_FormatterTime extends Clevis_View_Grid_Formatter {

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();

        $this->data['name'] = Clevis_View_Grid::FORMATTER_TIME;
    }

}
?>