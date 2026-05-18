<?php

/**
 * Class that represents HTML element (div, p ... )
 *
 * @author Pavel Cihlar
 */

class Clevis_View_Element extends Clevis_View_ItemElement {

    /**
     * Content of element
     *
     * @var string
     */
    private $content;

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
    }

    /**
     * Set content of element
     *
     * @param $content
     * @return void
     */
    public function setContent($content) {
        $this->content = $content;
    }

    /**
     * Get content of element
     *
     * @return string $content
     */
    public function getContent() {
        return $this->content;
    }
    
    /**
     * Render item without tag
     *
     * @return string
     */
    public function renderContent() {
        $output = '';
        $output .= $this->getContent();
        $output .= parent::renderContent();
        return $output;
    }

}
?>