<?php

/**
 * Class that represents Input CurrencyTextBox
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Form_CurrencyBox extends Clevis_View_Form_TextBox {

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setType('clevis.view.form.CurrencyBox');
        $this->setTag('div');
        $this->setValidatorType(VALIDATOR_CURRENCY);
    }

    /**
     * Set title
     * 
     * @param string $title
     * @return void
     */
    public function setTitle($title) {
        $this->setDojoAttribute('title',$title);
    }

    /**
     * Get title
     *
     * @return string $title
     */
    public function getTitle() {
        return $this->getAttribute('title');
    }

    /**
     * Set currency
     *
     * @param string $currency
     * @return Clevis_View_Form_CurrencyBox
     */
    public function setCurrency($currency) {
        $this->setDojoAttribute('currency', $currency);
        return $this;
    }

    /**
     * Get currency
     *
     * @return string $currency
     */
    public function getCurrency() {
        return $this->getAttribute('currency');
    }

    /**
     * Set decimal places
     *
     * @param integer $places
     * @return Clevis_View_Form_CurrencyBox
     */
    public function setPlaces($places) {
        $this->setDojoAttribute('places', $places);
        return $this;
    }

    /**
     * Get decimal places
     *
     * @return integer
     */
    public function getPlaces() {
        return $this->getAttribute('places');
    }

    /**
     * Set value type
     *
     * @param string $valueType ('integer' | 'double')
     * @return Clevis_View_Form_CurrencyBox
     */
    public function setValueType($valueType) {
        $this->setDojoAttribute('valueType', $valueType);
        return $this;
    }

    /**
     * Get value type
     *
     * @return string ('integer' | 'double')
     */
    public function getValueType() {
        return $this->getAttribute('valueType');
    }

    /**
     * Set required
     *
     * @param string $required
     * @return void
     */
    public function setRequired($required) {
        $this->setElementAttribute('required',$required);
    }

    /**
     * Get required
     *
     * @return string $required
     */
    public function getRequired() {
        return $this->getAttribute('required');
    }

    /**
     * Set value
     *
     * @param string $value
     * @return void
     */
    public function setValue($value) {
        $this->setElementAttribute('value', $value);
    }

    /**
     * Get value
     *
     * @return string $value
     */
    public function getValue() {
        return $this->getAttribute($value);
    }

}
?>