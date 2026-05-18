<?php

use Tracy\Debugger;

class Clevis_Zend_Debug extends Zend_Debug {

    /** Is enabled */
    private static $enabled = false;

    /**
     * Is enabled debugging
     * 
     * @return boolean
     */
    public static function isEnabled() {
        return Clevis_Zend_Debug::$enabled;
    }
    
    /**
     * Enable debug mode
     */
    public static function enable() {
        Clevis_Zend_Debug::$enabled = true;

        // Nette excepton handling
        require_once 'Debug/Nette/Object.php';
        require_once 'Debug/Nette/IDebugPanel.php';
        require_once 'Debug/Nette/exceptions.php';
        require_once 'Debug/Nette/Debug.php';

        Debugger::enable(Debugger::DETECT, __DIR__ . '\..\..\..\data\log\tracy'); // aktivujeme Laděnku
        Debugger::$maxDepth = 5;
        Debugger::$showBar = true;
        Debugger::$scream = false;
        Debugger::$strictMode = true;

        Zend_Controller_Front::getInstance()->throwExceptions(true);

        // Zend debugging panel
        $autoloader = Zend_Loader_Autoloader::getInstance();
        $autoloader->registerNamespace('ZFDebug');

        // Prepare base path
        $basePath = Zend_Controller_Front::getInstance()->getBaseUrl();

        // For debugging
        if ( Clevis_Helper::isDevelopmentEnvironment() ) {
            // Prepare base path
            $basePath .= '/clevis/src/';
        }
        // For not debugging
        else {
            // Prepare base path
            $basePath .= '/clevis/release/';
        }

        // Create debug instance
        $options = array(
            'plugins' => array('Variables','Doctrine','File','Memory','Time'),
            'jquery_path' => $basePath . 'jquery/jquery.min.js',
        );
        $debug = new Clevis_Zend_Debug_Controller_Plugin_Debug($options);

        // Register ZFDebug with the front controller
        //Zend_Controller_Front::getInstance()->registerPlugin($debug);

        assert_options(ASSERT_ACTIVE, true);
        assert_options(ASSERT_WARNING, false);
        assert_options(ASSERT_BAIL, false);
        assert_options(ASSERT_QUIET_EVAL, false);
        assert_options(ASSERT_CALLBACK, array('Clevis_Zend_Debug', 'assert_failure'));
    }

    /**
     * Assertion failure
     * 
     * @return void
     */
    public static function assert_failure($file, $line, $message) {
       throw new FatalErrorException("Assertion failed", 0, E_USER_ERROR, $file, $line, null);
    }

    /**
     * Disable debug mode
     */
    public static function disable() {
        Clevis_Zend_Debug::$enabled = false;
        require_once 'Debug/Nette/Debug.php';
        Debug::disable();
        Zend_Controller_Front::getInstance()->throwExceptions(false);

        // Asserts
        assert_options(ASSERT_ACTIVE, false);
    }

}
?>