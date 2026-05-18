<?php

/**
 * Class that represents DateTimeBox
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Form_DateTimeBox extends Clevis_View_Form_Item {

    /**
     * DateName
     *
     * @var string
     */
    private $dateName;

    /**
     * TimeName
     *
     * @var string
     */
    private $timeName;

    /**
     * DateTimeBox required
     *
     * @var string
     */
    private $required;

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setTag('div', true);
        $this->setItemGroup('dateTimeBox');
    }

    /**
     * Set date name
     *
     * @param string $dateName
     * @return void
     */
    public function setDateName($dateName) {
        $this->dateName = $dateName;
    }

    /**
     * Get date name
     *
     * @return string $dateName
     */
    public function getDateName() {
        return $this->dateName;
    }

    /**
     * Get date id
     *
     * @return string
     */
    public function  getDateId() {
        return $this->getId() . '_date';
    }

    /**
     * Set time name
     *
     * @param string $timeName
     * @return void
     */
    public function setTimeName($timeName) {
        $this->timeName = $timeName;
    }

    /**
     * Get time name
     *
     * @return string $timeName
     */
    public function getTimeName() {
        return $this->timeName;
    }

    /**
     * Get time id
     *
     * @return string
     */
    public function  getTimeId() {
        return $this->getId() . '_time';
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
     * Render filtering select
     *
     * @return string
     */
    public function render() {
        $output = '';
        $output .= $this->renderScript();

        $dateBox = new Clevis_View_Form_DateBox();
        $dateBox->setId($this->getDateId());
        $dateBox->setName($this->getDateName());
        $dateBox->setElementAttribute('style', 'width: 96px;');

        $timeBox = new Clevis_View_Form_TimeBox();
        $timeBox->setId($this->getTimeId());
        $timeBox->setName($this->getTimeName());
        $timeBox->setElementAttribute('style', 'width: 80px;');
        
        $output .= $dateBox->render();
        $output .= $timeBox->render();
        return $output;
    }
}
?>