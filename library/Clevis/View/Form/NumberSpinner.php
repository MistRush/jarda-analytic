<?php

/**
 * Class that represents Input TextBox
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Form_NumberSpinner extends Clevis_View_Form_Item {

    /**
     * NumberSpinner required
     *
     * @var string
     */
    private $required;

    /**
     * NumberSpinner smallDelta
     *
     * @var string
     */
    private $smallDelta = 1;

    /**
     * NumberSpinner value
     *
     * @var string
     */
    private $value = 0;

    /**
     * NumberSpinner min
     *
     * @var string
     */
    private $min = 0;

    /**
     * NumberSpinner max
     *
     * @var string
     */
    private $max = 300;

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setType('dijit.form.NumberSpinner');
        $this->setTag('input', true);
        $this->setRequired(false);

    }

    /**
     * Set required
     *
     * @param string $required
     * @return void
     */
    public function setRequired($required) {
        $this->required = $required;
    }

    /**
     * Get required
     *
     * @return string $required
     */
    public function getRequired() {
        return $this->required;
    }

    /**
     * Set value
     *
     * @param string $value
     * @return void
     */
    public function setValue($value) {
        $this->value = $value;
    }

    /**
     * Get value
     *
     * @return string $value
     */
    public function getValue() {
        return $this->value;
    }

    /**
     * Set smallDelata
     *
     * @param string $smallDelata
     * @return void
     */
    public function setSmallDelta($smallDelata) {
        $this->smallDelta = $smallDelata;
    }

    /**
     * Get smallDelata
     *
     * @return string $smallDelta
     */
    public function getSmallDelta() {
        return $this->smallDelta;
    }

    /**
     * Set min
     *
     * @param string $min
     * @return void
     */
    public function setMin($min) {
        $this->min = $min;
    }

    /**
     * Get min
     *
     * @return string $min
     */
    public function getMin() {
        return $this->min;
    }

    /**
     * Set max
     *
     * @param string $max
     * @return void
     */
    public function setMax($max) {
        $this->max = $max;
    }

    /**
     * Get max
     *
     * @return string $max
     */
    public function getMax() {
        return $this->max;
    }

    /**
     * Pre render NumberSpinner
     */
    public function preRender() {
        parent::preRender();
        if ( $this->required ) {
            $this->setDojoAttribute('required', true);
        }

        $this->setDojoAttribute('constraints', array('min' => $this->min, 'max' => $this->max, 'places' => '0'));
        $this->setDojoAttribute('smallDelta', $this->smallDelta);
        $this->setElementAttribute('value', $this->value);
    }
}
?>