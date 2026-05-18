<?php

/**
 * Doctrine_Migration_Base which setup itself as Callback migration (which cannot be reverted).
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
abstract class Doctrine_Migration_AbstractCallback extends Doctrine_Migration_Base implements Doctrine_Migration_Callback
{
    public function up()
    {
        // Invoke perform() with migration connection
        $this->addCallback($this);
    }

    public function down()
    {
        throw new Exception("Not implemented");
    }
}
