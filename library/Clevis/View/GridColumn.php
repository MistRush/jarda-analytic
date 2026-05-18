<?php

/**
 * Class that represents grid column
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_GridColumn extends Clevis_View_ItemElement {
    
    /**
     * Column title
     * 
     * @var string
     */
    private $title;

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setWidth('100px');
    }
    
    /**
     * Set field
     *
     * @param string $field
     * @return void
     */
    public function setField($field) {
        $this->setElementAttribute('field', $field);
    }

    /**
     * Get field
     *
     * @return string $field
     */
    public function getField() {
        return $this->getElementAttribute('field');
    }

    /**
     * Set title
     *
     * @param string $title
     * @return void
     */
    public function setTitle($title) {
        $this->title = $title;
    }

    /**
     * Get title
     *
     * @return string $title
     */
    public function getTitle() {
        return $this->title;
    }
    
    /**
     * Set width
     *
     * @param string $width
     * @return void
     */
    public function setWidth($width) {
        $this->setElementAttribute('width', $width);
    }

    /**
     * Get width
     *
     * @return string $width
     */
    public function getWidth() {
        return $this->getElementAttribute('width');
    }

    /**
     * Set align
     *
     * @param string $align
     * @return void
     */
    public function setAlign($align) {
        $this->setDojoAttribute('styles','text-align: ' . $align . '; margin: 10;');
    }
    
    /**
     * Set enum values for column
     * 
     * @param type $values 
     */
    public function setEnumValues($enumValues) {
        $this->getParent()->setColumnFormat($this->getField(), new Clevis_View_Grid_FormatterEnum($enumValues));
    }

    /**
     * Set entity parameters
     *
     * @param string $columnValue
     * @param string $columnTitle
     * @param array $entityController
     */
    public function setEntity($columnValue, $columnTitle, $entityController, $columnEdited = null) {
        $formatter = new Clevis_View_Grid_FormatterEntity($columnValue, $columnTitle, $entityController, $columnEdited);
        $this->getParent()->setColumnFormat($this->getField(), $formatter);
    }

    /**
     * Set check box
     * 
     * @param $checkBox
     * @return void
     */
    public function setCheckBox($checkBox) {
        if ( $checkBox ) {
            $this->setElementAttribute('cellType', 'clevis.view.grid.cells.Bool');
            $this->setElementAttribute('editable', true);
        } else {
            $this->setElementAttribute('cellType', null);
            $this->setElementAttribute('editable', false);
        }
    }

    /**
     * Set edit box
     *
     * @param $editBox
     * @return void
     */
    public function setEditBox($editBox) {
        if ( $editBox ) {
            $this->setElementAttribute('cellType', 'clevis.view.grid.cells.EditBox');
            $this->setElementAttribute('editable', true);
        } else {
            $this->setElementAttribute('cellType', null);
            $this->setElementAttribute('editable', false);
        }
    }

    /**
     * Set combo box
     *
     * @param $comboBox
     * @return void
     */
    public function setComboBox($comboBox) {
        if ( $comboBox ) {
            $this->setElementAttribute('cellType', 'clevis.view.grid.cells.ComboBox');
            $this->setElementAttribute('editable', true);
        } else {
            $this->setElementAttribute('cellType', null);
            $this->setElementAttribute('editable', false);
        }
    }

    /**
     * Pre render
     * 
     * @return string
     */
    public function preRender() {
        if ( $this->getElementAttribute('editable') == true && $this->hasPermissionWrite() == false ) {
            $this->setElementAttribute('cellType', null);
            $this->setElementAttribute('editable', false);
        }
        return parent::preRender();
    }
    
    /**
     * Render grid column
     *
     * @return string
     */
    public function render() {
        $output = '    <th' . $this->renderAttributes() . '>';
        $output .= $this->getTitle();
        $output .= '</th>' . PHP_EOL;
        return $output;
    }

}
?>