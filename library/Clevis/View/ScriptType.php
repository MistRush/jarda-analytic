<?php

/**
 * Class that represents script type
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_ScriptType extends Clevis_View_Item {

    /**
     * Type
     * 
     * @var string
     */
    private $type;

    /**
     * Base type
     *
     * @var string
     */
    private $baseType;

    /**
     * Type methods
     */
    private $methods = array();

    /**
     * Type fields
     */
    private $fields = array();

    /**
     * Additional requires
     *
     * @var string
     */
    private $requires = ', "dijit/registry"';

    /**
     * Additional requires
     *
     * @var string
     */
    private $requireParams = ', registry';

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
    }
    
    /**
     * Set type
     * 
     * @param string $type
     * @return void
     */
    public function setType($type) {
        $this->type = $type;
    }

    /**
     * Get type
     *
     * @return string $type
     */
    public function getType() {
        return $this->type;
    }

    /**
     * Set base type
     *
     * @param string $baseType
     * @return void
     */
    public function setBaseType($baseType) {
        $this->baseType = $baseType;
    }

    /**
     * Has base type
     *
     * @return boolean
     */
    public function hasBaseType() {
        return $this->baseType != null;
    }

    /**
     * Get base type
     *
     * @return string $baseType
     */
    public function getBaseType() {
        return $this->baseType;
    }

    /**
     * Ensures type field existence
     * @return void
     */
    public function checkField($name) {
        if ( array_key_exists($name,$this->fields) == false )
            $this->fields[$name] = array();
    }

    /**
     * Add field
     * 
     * @param string $name
     * @param string $value
     */
    public function addField($name,$value) {
        $this->checkField($name);
        if ( $value != null )
            $this->fields[$name]['value'] = $value;
    }

    /**
     * Set type field value
     *
     * @param string $name
     * @param string $value
     */
    public function setFieldValue($name,$value) {
        $this->checkField($name);
        $this->fields[$name]['value'] = $value;
    }

    /**
     * Ensures type method existence
     * @return void
     */
    public function checkMethod($name) {
        if ( array_key_exists($name,$this->methods) == false )
            $this->methods[$name] = array();
    }

    /**
     * Add method to type
     *
     * @param string $name
     * @param array $parameters
     * @param string $body
     */
    public function addMethod($name,$parameters = null,$body = null) {
        $this->checkMethod($name);
        if ( $parameters != null )
            $this->methods[$name]['parameters'] = $parameters;
        if ( $body != null )
            $this->methods[$name]['body'] = $body;
    }

    /**
     * Set type method body
     *
     * @param string $name
     * @param string $body
     */
    public function setMethodBody($name,$body) {
        $this->checkMethod($name);
        $this->methods[$name]['body'] = $body;
    }

    /**
     * Add require
     * @param $require
     * @param $requireParam
     */
    public function addRequire($require, $requireParam) {

        $this->requires .= ', "' . $require . '"';
        $this->requireParams .= ', ' . $requireParam;
    }

    /**
     * Set type method body if the body doesn"t exists, otherwise do not replace it
     *
     * @param string $name
     * @param string $body
     */
    public function provideMethodBody($name,$body) {
        if ( $this->hasMethodBody($name) )
            return;
        $this->setMethodBody($name,$body);
    }

    /**
     * Has type method body
     *
     * @param string $name
     */
    public function hasMethodBody($name) {
        $this->checkMethod($name);
        return array_key_exists('body',$this->methods[$name]);
    }

    /**
     * Render script type
     *
     * @return string
     */
    public function render() {
        $baseType = null;
        if ( $this->hasBaseType() ) {
            $baseType = $this->getBaseType();
            if (is_array($baseType) ) {
                $baseType = '[' . implode(',', $baseType) . ']';
            }
        }
        $output = '';
        if ( $baseType != null ) {
            $output .= 'require(["dojo/_base/declare", "' . $baseType . '"' . $this->requires . '], function(declare, base' . $this->requireParams . ') {' . PHP_EOL;
        }
        else {
            $output .= 'require(["dojo/_base/declare"' . $this->requires . '], function(declare' . $this->requireParams . ') {' . PHP_EOL;
            $output .= '    base = null;' . PHP_EOL;
        }

        $output .= '    declare("' . $this->getType() . '", base, {' . PHP_EOL;
        $first = true;
        foreach ( $this->fields as $name => $field ) {
            if ( $first == false)
                $output .= ',' . PHP_EOL;
            $fieldCode = $name . ': ';
            if ( array_key_exists('value',$field) )
                $fieldCode .= $field['value'];
            else
                $fieldCode .= 'null';
            $output .= Clevis_View_Code::indentJavaScriptCode($fieldCode, 2);
            $first = false;
        }
        foreach ( $this->methods as $name => $method ) {
            if ( $first == false)
                $output .= ',' . PHP_EOL;
            $methodCode = $name . ': function(';
            if ( array_key_exists('parameters',$method) )
                $methodCode .= implode(',',$method['parameters']);
            $methodCode .= ') {' . PHP_EOL;
            $methodBody = null;
            if ( array_key_exists('body',$method) )
                $methodBody .= $method['body'];
            $methodCode .= Clevis_View_Code::indentJavaScriptCode($methodBody);
            if ( $methodBody != null )
                $methodCode .= PHP_EOL;
            $output .= Clevis_View_Code::indentJavaScriptCode($methodCode, 2);
            $output .= '}';
            $first = false;
        }
        if ( $first == false)
            $output .= PHP_EOL;
        $output .= '    });' . PHP_EOL;
        $output .= '});' . PHP_EOL;
        return $output;
    }

}
?>