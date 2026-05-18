<?php

/**
 * Class that represents tab
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_Placeholder extends Clevis_View_Item {

    /**
     * Placeholder of item
     *
     * @var string
     */
    private $placeholder;

    /**
     * Replace in placeholder content
     *
     * @var array
     */
    private $replace = array();

    /**
     * Constructor
     */
    public function  __construct($placeholder = null, $replace = null) {
        parent::__construct();
        if ( $placeholder != null )
            $this->setPlaceholder($placeholder);
        if ( $replace != null )
            $this->setReplace($replace);
    }

    /**
     * Set placeholder
     *
     * @param string $placeholder
     * @return void
     */
    public function setPlaceholder($placeholder) {
        $this->placeholder = $placeholder;
    }

    /**
     * Get placeholder
     *
     * @return string $placeholder
     */
    public function getPlaceholder() {
        return $this->placeholder;
    }

    /**
     * Set replace placeholder content
     *
     * @param array $replace
     * @return void
     */
    public function setReplace($replace) {
        $this->replace = $replace;
    }

    /**
     * Render placeholder
     *
     * @return string
     */
    public function render() {
        $content = $this->getView()->getZendView()->placeholder($this->getPlaceholder());

        foreach ( $this->replace as $key => $value ) {
            if ( $value instanceof Clevis_View_ItemElement )
                $this->replace[$key] = $value->getId();
        }
        
        $output = '<!-- PLACEHOLDER BEGIN [' . $this->getPlaceholder() . '] -->' . PHP_EOL;
        $output .= strtr($content,$this->replace);
        $output .= '<!-- PLACEHOLDER END [' . $this->getPlaceholder() . '] -->' . PHP_EOL;
        return $output;
    }

}
?>