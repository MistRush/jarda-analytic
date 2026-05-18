<?php

/**
 * ManagerQueryListener
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
interface Clevis_Data_ManagerRawQueryListener {

    /**
     * Pre raw query select
     * 
     * @abstract
     * @param Clevis_Data_ManagerRawQuery $query
     * @return void
     */
    public function preRawSelect(Clevis_Data_ManagerRawQuery $query);

}

?>