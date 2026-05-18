<?php

/**
 * Class that represents grid custom formatter
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_Grid_FormatterCustom extends Clevis_View_Grid_Formatter {

    /**
     * Constructor
     *
     * @param $code javascript code, available variables: data (column value string), item (store item object), rowIndex (grid and store row index)
     */
    public function  __construct($code) {
        parent::__construct();

        $this->data['name'] = Clevis_View_Grid::FORMATTER_CUSTOM;
        $this->data['code'] = 'function(data, item, rowIndex){' . $code . '}';
    }

}
?>