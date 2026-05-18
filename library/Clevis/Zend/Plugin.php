<?php

/**
 * Clevis Plugin
 */
class Clevis_Zend_Plugin extends Zend_Controller_Plugin_Abstract
{
    /**
     * Constructor
     */
    public function __construct()
    {
    }
    
    /**
     * Shutdown
     */
    public function dispatchLoopShutdown()
    {
        if ( $this->getRequest()->isXmlHttpRequest() == true ) {
            $this->getResponse()->setHeader('Timer', Clevis_Timer::render());
        }
    }
}