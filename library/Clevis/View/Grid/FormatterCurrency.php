<?php

/**
 * Class that represents grid currency formatter
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_Grid_FormatterCurrency extends Clevis_View_Grid_Formatter {

    /**
     * Constructor
     *
     * @param integer $places decimal places
     * @param string $valueType value type (double | integer)
     * @param string $currencyType
     */
    public function  __construct($places = null,$valueType = null,$currencyType = null) {
        parent::__construct();
        
        $this->data['name'] = Clevis_View_Grid::FORMATTER_CURRENCY;
        $this->data['places'] = $places;
        $this->data['valueType'] = $valueType;
        $this->data['currencyType'] = $currencyType;
    }
    
}
?>