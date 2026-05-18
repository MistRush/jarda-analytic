<?php

/**
 * Action
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Zend_Controller_Action extends Zend_Controller_Action {

    /**
     * Constructor
     *
     * @param Zend_Controller_Request_Abstract $request
     * @param Zend_Controller_Response_Abstract $response
     * @param array $invokeArgs
     */
    public function  __construct(Zend_Controller_Request_Abstract $request,Zend_Controller_Response_Abstract $response,array $invokeArgs = array()) {        
        parent::__construct($request,$response,$invokeArgs);
    }

    /**
     * Init all actions
     */
    public function init() {
        // No view is needed
        $this->_helper->viewRenderer->setNoRender(true);
    }

    /**
     * Init data actions
     */
    public function disableLayout($disable = true) {
        // No layout is needed
        $this->getHelper('layout')->disableLayout($disable);
    }

    /**
     * Render view object
     *
     * @param Clevis_View view
     */
    public function renderView(Clevis_View & $view) {
        if ( $view->isPageFullSize() ) {
            $this->view->fullSize = true;
        }
        $this->view->layout = $this->getHelper('layout')->getLayout();
        echo $view->renderTopView($this->view);
    }
    
    /**
     * Pre-dispatch routines
     *
     * @return void
     */
    public function preDispatch() {
        Clevis_Timer::stop('run-before');
        Clevis_Timer::start('run-action');
    }
    
    /**
     * Post-dispatch routines
     *
     * @return void
     */
    public function postDispatch() {
        Clevis_Timer::stop('run-action');
        Clevis_Timer::start('run-after');
    }

}

?>