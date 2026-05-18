<?php

/**
 * Class that represents Input TextBox
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Form_DoubleNumberSpinner extends Clevis_View_Form_Item {

    /**
     * DoubleNumberSpinner required
     *
     * @var string
     */
    private $name1;

    /**
     * DoubleNumberSpinner smallDelta
     *
     * @var string
     */
    private $name2;

    /**
     * DoubleNumberSpinner required
     *
     * @var boolean
     */
    private $required;


    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setTag('div', true);
        $this->setItemGroup('doubleNumberSpinner');
    }

    /**
     * Set name1
     *
     * @param string $name1
     * @return void
     */
    public function setName1($name1) {
        $this->name1 = $name1;
    }

    /**
     * Get name1
     *
     * @return string $name1
     */
    public function getName1() {
        return $this->name1;
    }

    /**
     * Set name2
     *
     * @param string $name2
     * @return void
     */
    public function setName2($name2) {
        $this->name2 = $name2;
    }

    /**
     * Get name2
     *
     * @return string $name2
     */
    public function getName2() {
        return $this->name2;
    }


    /**
     * Set required
     *
     * @param boolean $required
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
     * Render filtering select
     *
     * @return string
     */
    public function render() {
        $output = '';
        $output .= $this->renderScript();

        $spiner1 = new Clevis_View_Form_NumberSpinner();
        $spiner1->setName($this->getName1());
        $spiner1->setElementAttribute('style', 'width: 82px;');
        $spiner1->setDojoAttribute('required', $this->getRequired());
        $spiner1->setElementAttribute('value', 0);
        $spiner1->setDojoAttribute('constraints', array('min' => 0, 'max' => 120, 'places' => 0));

        $spiner2 = new Clevis_View_Form_NumberSpinner();
        $spiner2->setName($this->getName2());
        $spiner2->setElementAttribute('style', 'width: 82px;');
        $spiner2->setDojoAttribute('required',  $this->getRequired());
        $spiner2->setElementAttribute('value', 0);
        $spiner2->setElementAttribute('smallDelta', 10);
        $spiner2->setDojoAttribute('constraints', array('min' => 0, 'max' => 59, 'places' => 0, 'pattern' => '0#;'));

        

        $output .= $spiner1->render();
        $output .= '<b>: </b>';
        $output .= $spiner2->render();
        return $output;
    }
}
?>