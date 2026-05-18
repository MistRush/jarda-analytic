<?php

/**
 * Class that represents listing column
 */
class Clevis_View_ListingColumn
{    
    /**
     * Column type
     * 
     * @var string
     */
    private $type;
    
    /**
     * Column field
     * 
     * @var string
     */
    private $field;
    
    /**
     * Column field
     * 
     * @var string
     */
    private $title;
    
    /**
     * Column Width
     * 
     * @var integer
     */
    private $width;
    
    /**
     * Constructor
     */
    public function  __construct() {
    }
    
    /**
     * Set column type
     * 
     * @param integer $type 
     */
    public function setType($type) {
        $this->type = $type;
    }

    /**
     * Is column of specified type
     *
     * @param integer $type
     * @return boolean
     */
    public function isType($type) {
        return ($this->type & $type) == $type;
    }
    
    /**
     * Set column field
     * 
     * @param string $field
     */
    public function setField($field) {
        $this->field = $field;
    }
    
    /**
     * Get column field
     * 
     * @return string
     */
    public function getField() {
        return $this->field;
    }
    
    /**
     * Set column title
     * 
     * @param string $title
     */
    public function setTitle($title) {
        $this->title = $title;
    }
    
    /**
     * Get column title
     * 
     * @return string
     */
    public function getTitle() {
        return $this->title;
    }
    
    /**
     * Set column width
     * 
     * @param integer $width
     */
    public function setWidth($width) {
        $this->width = $width;
    }
    
    /**
     * Get column width
     * 
     * @return integer
     */
    public function getWidth() {
        return $this->width;
    }

    /**
     * Format custom
     * 
     * @var null
     */
    private $formatCustom = null;

    /**
     * Set custom formatter
     * 
     * @param $formatCustom (see Clevis_View_Grid_FormatterCustom)
     * @return void
     */
    public function setFormat($formatCustom) {
        $this->formatCustom = $formatCustom;
    }
    
    /**
     * Column enum values
     * 
     * @var string
     */
    private $enumValues = null;
    
    /**
     * Set enum values for column
     * 
     * @param array $values
     */
    public function setEnumValues($values) {
        $this->enumValues = &$values;
    }
    
    /**
     * Filter combo
     */
    private $filterComboField;
    private $filterComboDataUrl;
    private $filterComboDataColumn;
    
    /**
     * Set filter combo
     * 
     * @param string $field
     * @param string $dataUrl 
     * @param type $dataColumn
     */
    public function setFilterCombo($field, $dataUrl, $dataColumn) {
        $this->filterComboField = $field;
        $this->filterComboDataUrl = $dataUrl;
        $this->filterComboDataColumn = $dataColumn;
    }
    
    /**
     * Filter combo
     */
    private $entityColumnValue;
    private $entityColumnTitle;
    private $entityController;
    private $entityColumnEdited;
    
    /**
     * Set entity parameters
     * 
     * @param string $columnValue
     * @param string $columnTitle
     * @param array $entityController 
     */
    public function setEntity($columnValue, $columnTitle, $entityController, $columnEdited = null) {
        $this->entityColumnValue = $columnValue;
        $this->entityColumnTitle = $columnTitle;
        $this->entityController = $entityController;
        $this->entityColumnEdited = $columnEdited;
    }
    
    /**
     * Append column to grid
     * 
     * @param Clevis_View_Grid $grid 
     */
    public function appendToGrid(Clevis_View_Grid & $grid) {
        // Add column to grid
        $column = $grid->addColumn($this->type, $this->getField(), $this->getTitle(), $this->getWidth());
        
        // Set enum or entity formatter
        if ( $this->formatCustom != null ) {
            $grid->setColumnFormat($this->getField(), new Clevis_View_Grid_FormatterCustom($this->formatCustom));
        } else if ( $this->enumValues != null && $this->isType(COLUMN_ENUM) ) {
            $grid->setColumnFormat($this->getField(), new Clevis_View_Grid_FormatterEnum($this->enumValues));   
        } else if ( $this->entityController != null && $this->isType(COLUMN_ENTITY)) {
            $grid->setColumnFormat($this->getField(), new Clevis_View_Grid_FormatterEntity($this->entityColumnValue, $this->entityColumnTitle, $this->entityController, $this->entityColumnEdited));
        }
    }
    
    /**
     * Append column to filter set
     * 
     * @param Clevis_View_FilterSet $filterSet 
     */
    public function appendToFilterSet(Clevis_View_FilterSet & $filterSet) {
        // Add filter?
        if ( $this->isType(FILTER_ENABLE) == false )
            return;
        
        // Setup parameters
        $type = null;
        $attribute = null;
        $field = $this->getField();
        if ( $this->isType(COLUMN_TEXT) ) {
            if ( $this->filterComboField == null) {
                $type = Clevis_View_FilterSet::FILTER_TEXT;
            } else {
                $type = Clevis_View_FilterSet::FILTER_COMBO;
                $attribute = array('url' => $this->filterComboDataUrl, 'field' => $this->filterComboDataColumn);
                $field = $this->filterComboField;
            }
        } else if ( $this->isType(COLUMN_NUMBER) ) {
            $type = Clevis_View_FilterSet::FILTER_NUMBER;
        } else if ( $this->isType(COLUMN_BOOL) ) {
            $type = Clevis_View_FilterSet::FILTER_CHECK;
        } else if ( $this->isType(COLUMN_CHECKBOX) ) {
            $type = Clevis_View_FilterSet::FILTER_CHECK;
        } else if ( $this->isType(COLUMN_CURRENCY) ) {
            $type = Clevis_View_FilterSet::FILTER_RANGE_CURRENCY;
        } else if ( $this->isType(COLUMN_DATE) ) {
            $type = Clevis_View_FilterSet::FILTER_RANGE_DATE;
        } else if ( $this->isType(COLUMN_ENUM) ) {
            $type = Clevis_View_FilterSet::FILTER_ENUM;
            $attribute = array('enum-values' => array_merge(array(null => 'Vše'), $this->enumValues));
        } else if ( $this->isType(COLUMN_ENTITY) ) {
            $type = Clevis_View_FilterSet::FILTER_COMBO;
                $attribute = array('url' => $this->entityController, 'field' => $this->entityColumnTitle);
        }
        
        // Add filter
        if ($type != null) {
            $filterSet->addFilter($field, $type, $this->getTitle(), $attribute);
        }
    }
    
}

?>