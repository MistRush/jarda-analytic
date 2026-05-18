<?php

/**
 * Callback migration
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
interface Doctrine_Migration_Callback
{
    /**
     * Perform migration.
     *
     * @param Doctrine_Connection $connection
     * @return mixed
     */
    public function perform(Doctrine_Connection $connection);
}
