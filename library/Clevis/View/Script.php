<?php

/**
 * Class that represents script
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_Script extends Clevis_View_ItemElement {

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setTag("script");
        $this->setElementAttribute("type","text/javascript");
    }

    /**
     * Add code to script
     *
     * @param string $code
     * @return Clevis_View_Code
     */
    public function addCode($code) {
        $itemCode = new Clevis_View_Code();
        $itemCode->setCode($code);
        return $this->addItem($itemCode);
    }

    /**
     * Add type to script
     *
     * @param string $type
     * @param string $baseType
     * @return Clevis_View_ScriptType
     */
    public function addType($type, $baseType = null) {
        $itemType = new Clevis_View_ScriptType();
        $itemType->setType($type);
        $itemType->setBaseType($baseType);
        return $this->addItem($itemType);
    }

    /**
     * Add on load code
     *
     * @param string $code
     * @return Clevis_View_Code
     */
    public function addOnLoad($code, $requires = null) {
        $outputRequires = '"clevis/ready!"';
        $outputParams = 'ready';
        if ( $requires != null ) {
            foreach ( $requires as $name => $param ) {
                $outputRequires .= ', "' . $name . '"';
                $outputParams .= ', ' . $param;
            }
        }
        $itemCode = new Clevis_View_Code();
        $itemCode->setCode(
            'require([' . $outputRequires . '], function(' . $outputParams . '){' . PHP_EOL . Clevis_View_Code::indentJavaScriptCode($code) . PHP_EOL . '});' . PHP_EOL);
        return $this->addItem($itemCode);
    }

}
?>