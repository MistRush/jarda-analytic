<?php

/**
 * Interface for auth action
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
interface Clevis_Zend_Plugin_AuthAction {

    /**
     * Route shutdown
     *
     * Zend_Controller_Request_Abstract $request
     */
    public function routeShutdown(Zend_Controller_Request_Abstract $request);

}
?>