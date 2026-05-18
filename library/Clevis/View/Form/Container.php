<?php

/**
 * Class that represents form container
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_Form_Container extends Clevis_View_ItemElementScriptType {

    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct();
        $this->enableScript(false);
        $this->enableScriptType(false);
    }

    /**
     * Add empty
     * 
     * @return Clevis_View_Form_Empty
     */
    public function addEmpty() {
        return $this->addItem(new Clevis_View_Form_Item());
    }

    /**
     * Add store
     *
     * @return Clevis_View_Store
     */
    public function addStore() {
        $store = new Clevis_View_Store();
        return $this->addItem($store);
    }

    /**
     * Add store read
     *
     * @return Clevis_View_StoreRead
     */
    public function addStoreRead() {
        $store = new Clevis_View_StoreRead();
        return $this->addItem($store);
    }

    /**
     * Add text box
     *
     * @param string $name
     * @return Clevis_View_TextBox
     */
    public function addTextBox($name, $label = null, $required = false, $validatorType = null) {
        $textBox = new Clevis_View_Form_TextBox();
        $textBox->setName($name);
        if ( $label != null )
            $textBox->setLabel($label);
        if ( $required == true )
            $textBox->setRequired(true);
        if ( $validatorType != null )
            $textBox->setValidatorType($validatorType);
        return $this->addItem($textBox);
    }

    /**
     * Add numeric box
     *
     * @param string $name
     * @param string $label
     * @param bool $required
     * @return Clevis_View_TextBox
     */
    public function addNumericBox($name, $label = null, $required = false) {
        $textBox = new Clevis_View_Form_TextBox();
        $textBox->setName($name);
        $textBox->setValidatorType(VALIDATOR_NUMERIC);
        if ( $label != null )
            $textBox->setLabel($label);
        if ( $required == true )
            $textBox->setRequired(true);
        return $this->addItem($textBox);
    }

    /**
     * Add numeric box
     *
     * @param string $name
     * @param string $label
     * @param bool $required
     * @return Clevis_View_Form_NumberSpinner
     */
    public function addNumberSpinner($name, $label = null, $required = false) {
        $numberSpinner = new Clevis_View_Form_NumberSpinner();
        $numberSpinner->setName($name);
        if ( $label != null )
            $numberSpinner->setLabel($label);
        if ( $required == true )
            $numberSpinner->setRequired(true);
        return $this->addItem($numberSpinner);
    }

    /**
     * Add numeric box
     *
     * @param string $label
     * @return Clevis_View_Form_DoubleNumberSpinner
     */
    public function addDoubleNumberSpinner($label, $name1, $name2, $required = true) {
        $doubleNumberSpinner = new Clevis_View_Form_DoubleNumberSpinner();
        $doubleNumberSpinner->setLabel($label);
        $doubleNumberSpinner->setName1($name1);
        $doubleNumberSpinner->setName2($name2);
        $doubleNumberSpinner->setRequired($required);

        return $this->addItem($doubleNumberSpinner);
    }

    /**
     * Add date time box
     *
     * @param string $label
     * @return Clevis_View_Form_DateTimeBox
     */
    public function addDateTimeBox($dateName, $timeName, $label, $required = false) {
        $dateTimeBox = new Clevis_View_Form_DateTimeBox();
        $dateTimeBox->setLabel($label);
        $dateTimeBox->setDateName($dateName);
        $dateTimeBox->setTimeName($timeName);
        if ( $required == true )
            $dateTimeBox->setRequired(true);
        return $this->addItem($dateTimeBox);
    }

    /**
     * Add floating point box
     *
     * @param string $name
     * @param string $label
     * @param bool $required
     * @return Clevis_View_TextBox
     */
    public function addFloatingPointBox($name, $label = null, $required = false) {
        $textBox = new Clevis_View_Form_TextBox();
        $textBox->setName($name);
        $textBox->setValidatorType(VALIDATOR_FLOATING_POINT);
        if ( $label != null )
            $textBox->setLabel($label);
        if ( $required == true )
            $textBox->setRequired(true);
        return $this->addItem($textBox);
    }

    /**
     * Add text box with time validation
     *
     * @param string $name
     * @param string $label
     * @param bool $required
     * @return Clevis_View_TextBox
     */
    public function addTimeValidatedBox($name, $label = null, $required = false) {
        $textBox = new Clevis_View_Form_TextBox();
        $textBox->setName($name);
        $textBox->setValidatorType(VALIDATOR_TIME);
        if ( $label != null )
            $textBox->setLabel($label);
        if ( $required == true )
            $textBox->setRequired(true);
        return $this->addItem($textBox);
    }

    /**
     * Add time box with miliseconds.
     *
     * @param $name
     * @param null $label
     * @param bool $required
     * @return Clevis_View_Item
     */
    public function addTimeWithMillisecondBox($name, $label = null, $required = false)
    {
        $textBox = new Clevis_View_Form_MultiTextBox();
        $textBox->setName($name);
        if ( $label != null ) {
            $textBox->setLabel($label);
        }
        if ( $required == true ) {
            $textBox->setRequired(true);
        }
        $textBox->addTextBox(VALIDATOR_NUMERIC, 2, null, 'm');
        $textBox->addTextBox(VALIDATOR_NUMERIC, 2, null, 's');
        $textBox->addTextBox(VALIDATOR_NUMERIC, 3, null, 'ms');
        $textBox->setFormat('%.2d:%.2d:%.2d.%.3d');
        $textBox->setProcessValue(
            'function(value) { ' .
            '  value.splice(0, 0, 0);' .
            '  if ( value[2] >= 60 ) { value[1] += value[2] / 60; value[2] = value[2] % 60; }' .
            '  if ( value[1] >= 60 ) { value[0] += value[1] / 60; value[1] = value[1] % 60; }' .
            '}',
            'function(value) { ' .
            '  if ( value[0] > 0 ) { value[1] = parseInt(value[1]) + parseInt(value[0]) * 60; }' .
            '  value.splice(0, 1); ' .
            '}');
        return $this->addItem($textBox);
    }

    /**
     * Add text area
     *
     * @param string $name
     * @return Clevis_View_Textarea
     */
    public function addTextArea($name, $label = null) {
        $textArea = new Clevis_View_Form_TextArea();
        $textArea->setName($name);
        if ( $label != null )
            $textArea->setLabel($label);
        return $this->addItem($textArea);
    }

    /**
     * Add date box
     *
     * @param string $name
     * @return Clevis_View_DateBox
     */
    public function addDateBox($name, $label = null, $required = false) {
        $dateBox = new Clevis_View_Form_DateBox();
        $dateBox->setName($name);
        if ( $label != null )
            $dateBox->setLabel($label);
        if ( $required == true )
            $dateBox->setRequired(true);
        return $this->addItem($dateBox);
    }

    /**
     * Add time box
     *
     * @param string $name
     * @return Clevis_View_TimeBox
     */
    public function addTimeBox($name, $label = null, $required = false) {
        $timeBox = new Clevis_View_Form_TimeBox();
        $timeBox->setName($name);
        if ( $label != null )
            $timeBox->setLabel($label);
        if ( $required == true )
            $timeBox->setRequired(true);
        return $this->addItem($timeBox);
    }

    /**
     * Add currencyTextBox
     *
     * @param string $name
     * @return Clevis_View_CurrencyBox
     */
    public function addCurrencyBox($name, $label = null, $required = false) {
        $currencyBox = new Clevis_View_Form_CurrencyBox();
        $currencyBox->setName($name);
        if ( $label != null )
            $currencyBox->setLabel($label);
        if ( $required == true )
            $currencyBox->setRequired(true);
        return $this->addItem($currencyBox);
    }

    /**
     * Add radioButton
     *
     * @param string $name
     * @return Clevis_View_RadioButton
     */
    public function addRadioButton($name, $label = null) {
        $radioButton = new Clevis_View_Form_RadioButton();
        $radioButton->setName($name);
        if ( $label != null ) {
            $radioButton->setLabel($label);
        }
        return $this->addItem($radioButton);
    }

    /**
     * Add boolean radio button
     *
     * @param string $name
     * @param string $label
     * @return Clevis_View_RadioButton
     */
    public function addBoolRadioButton($name, $label = null) {
        $radioButton = new Clevis_View_Form_RadioButton();
        $radioButton->setName($name);
        if ( $label != null )
            $radioButton->setLabel($label);
        $radioButton->addDataItems(array('1' => 'Ano', '0' => 'Ne'));
        $radioButton->setValue(0);
        return $this->addItem($radioButton);
    }

    /**
     * Add combo box to layout
     *
     * @return Clevis_View_Form_ComboBox
     */
    public function addComboBox($name = null, $label = null, $required = null) {
        $comboBox = new Clevis_View_Form_ComboBox();
        $comboBox->setName($name);
        if ( $label != null )
            $comboBox->setLabel($label);
        if ( $required != null )
            $comboBox->setRequired($required);
        return $this->addItem($comboBox);
    }

    /**
     * Add combo box to layout with store
     * 
     * @param $name
     * @param $label
     * @param $storeUrl
     * @param $storeField
     * @param bool|null $required
     * @param bool $enableFiltering  Flag if user can write in combobox to search desired value
     * @return Clevis_View_Form_ComboBox
     */
    public function addComboBoxStore($name, $label, $storeUrl, $storeField, $required = false, $enableFiltering = true) {
        // Add store
        $store = $this->addStore();
        $store->setUrl($storeUrl);
        $store->setDynamic(false);
        $store->setReadOnly(true);
        if ( $required != true ) {
            $store->addDataItem(array('{ID}' => null, $storeField => ''));
        }

        // Add combo and set store
        $comboBox = $this->addComboBox($name, $label, $required);
        $comboBox->setStore($store, $storeField);
        $comboBox->setType($enableFiltering ? Clevis_View_Form_ComboBox::TYPE_FILTERING : Clevis_View_Form_ComboBox::TYPE_NORMAL);

        return $comboBox;
    }

     /**
     * Add combo box to layout as enum editor
     *
     * @return Clevis_View_Form_ComboBox
     */
    public function addComboBoxEnum($name, $label, $enumValues, $required = null) {
        // Add combo and set enum values
        $comboBox = $this->addComboBox($name, $label, $required);
        $comboBox->addDataItems($enumValues);
        $comboBox->setType(Clevis_View_Form_ComboBox::TYPE_NORMAL);

        return $comboBox;
    }

     /**
     * Add select to layout as enum editor
     *
     * @return Clevis_View_Form_Select
     */
    public function addSelect($name, $label, $enumValues, $required = null) {

        $select = new Clevis_View_Form_Select();
        $select->addDataItems($enumValues);
        $select->setName($name);
        if ( $label != null )
            $select->setLabel($label);
        if ( $required != null )
            $select->setRequired($required);
        return $this->addItem($select);

    }

    /**
     * Add editor
     *
     * @param string $name
     * @return Clevis_View_Form_Editor
     */
    public function addEditor($name, $label = null) {
        $editor = new Clevis_View_Form_Editor();
        $editor->setName($name);
        if ( $label != null )
            $editor->setLabel($label);
        return $this->addItem($editor);
    }

    /**
     * Add file box
     *
     * @param string $name
     * @return Clevis_View_Form_FileBox
     */
    public function addFileBox($name, $label = null, $fileUploadUrl = null) {
        $fileBox = new Clevis_View_Form_FileBox();
        $fileBox->setName($name);
        if ( $label != null )
            $fileBox->setLabel($label);
        if ( $fileUploadUrl != null )
            $fileBox->setFileUploadUrl($fileUploadUrl);
        return $this->addItem($fileBox);
    }

    /**
     * Add checkbox
     *
     * @param string $name
     * @return Clevis_View_Form_CheckBox
     */
    public function addCheckBox($name, $label = null) {
        $checkbox = new Clevis_View_Form_CheckBox();
        $checkbox->setName($name);
        if ( $label != null )
            $checkbox->setLabel($label);
        return $this->addItem($checkbox);
    }

}
?>