<?php

/**
 * Class that represents simple ItemFileReadStore
 *
 * @author Pavel Cihlar
 */

class Clevis_View_StoreRead extends Clevis_View_OldStore {

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setBaseType('clevis/view/StoreRead');
        $this->setUrlDefaultAction('data-list');
    }

}
?>