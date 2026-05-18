<?php

/**
 * EntityOther Behavior Listener
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Behavior_EntityOtherListener extends Doctrine_Record_Listener
{
    /**
     * Options
     *
     * @var array
     */
    protected $_options = array();

    /**
     * __construct
     *
     * @param string $options
     * @return void
     */
    public function __construct($options) {
        $this->_options = $options;
    }
    
    /**
     * Pre save
     * 
     * @param Doctrine_Event $event
     * @return void
     */
    public function preSave(Doctrine_Event $event) {
        $entity = $event->getInvoker();
        $table = $entity->getTable();

        // Get relation class
        $class = null;
        foreach ( $table->getRelations() as $relation ) {
            if ( $this->_options['Column'] == $relation->getLocalFieldName() ) {
                $class = $relation->getClass();
                break;
            }
        }
        assert($class != null);

        // Update other
        $entityId = $entity[$this->_options['Column']];
        if ( $entityId != null ) {
            $entityTable = Doctrine_Core::getTable($class);
            $entityObject = $entityTable->find($entityId);
            assert($entityObject!= null);
            $column = $this->_options['EntityColumn'];
            if ( $entityTable->hasField($column) == false ) {
                $entity[$this->_options['ColumnOther']] = call_user_func( array( $entityObject, 'get' . $column ) );
            } else {
                $entity[$this->_options['ColumnOther']] = $entityObject[$column];
            }
        }
    }

}