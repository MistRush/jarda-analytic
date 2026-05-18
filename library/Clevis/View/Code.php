<?php

/**
 * Class that represents tab
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_Code extends Clevis_View_Item {

    /**
     * Code of item
     * 
     * @var string
     */
    private $code;

    /**
     * Constructor
     */
    public function  __construct($code = null) {
        parent::__construct();
        $this->code = $code;
    }
    
    /**
     * Set code
     *
     * @param string $code
     * @return void
     */
    public function setCode($code) {
        $this->code = $code;
    }

    /**
     * Get code
     *
     * @return string $code
     */
    public function getCode() {
        return $this->code;
    }

    /**
     * Render code
     * 
     * @return string
     */
    public function render() {
        return $this->code . PHP_EOL;
    }

    /**
     * Indent javascript code
     * 
     * @param string $code
     * @param integer $indent
     * @return string indented code
     */
    public static function indentJavaScriptCode($code,$indent = 1) {
        if ( $code == '' )
            return $code;
        $indentString = '';
        for ( $index = 0; $index < $indent; $index++ )
            $indentString .= '    ';
        return $indentString . str_replace(PHP_EOL,PHP_EOL . $indentString, $code);
    }

    /**
     * Indent html code
     *
     * @param string $code
     * @param integer $indent
     * @return string indented code
     */
    public static function indentHtmlCode($code,$indent = 1) {
        if ( $code == '' )
            return $code;
        $code = rtrim($code, PHP_EOL);
        $indentString = '';
        for ( $index = 0; $index < $indent; $index++ )
            $indentString .= '  ';
        return $indentString . str_replace(PHP_EOL, PHP_EOL . $indentString, $code);
    }

}
?>