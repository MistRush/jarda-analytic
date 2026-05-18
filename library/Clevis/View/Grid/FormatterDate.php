<?php

/**
 * Class that represents grid date formatter
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_Grid_FormatterDate extends Clevis_View_Grid_Formatter {

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();

        $this->data['name'] = Clevis_View_Grid::FORMATTER_DATE;
    }

}
?>