<?php

/**
 * Class that represents grid entity formatter
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_Grid_FormatterEntity extends Clevis_View_Grid_Formatter {

    /**
     * Entity controller
     * 
     * @var array
     */
    private $entityController;

    /**
     * Constructor
     *
     * @param string $columnValue
     * @param string $columnTitle
     * @param string $entityController
     */
    public function  __construct($columnValue, $columnTitle, $entityController, $columnEdited = null) {
        parent::__construct();

        $this->data['name'] = Clevis_View_Grid::FORMATTER_ENTITY;
        $this->data['columnValue'] = $columnValue;
        $this->data['columnTitle'] = $columnTitle;
        $this->data['columnEdited'] = $columnEdited;
        $this->entityController = $entityController;
    }

    /**
     * Convert formatter to array
     *
     * @param Clevis_View_Grid & $grid
     * @return array
     */
    public function toArray(Clevis_View_Grid & $grid) {
        $this->data['url'] = Clevis_Helper::formatUrl(array_merge($this->entityController,array('action' => 'data-list')));
        return parent::toArray($grid);
    }

}
?>