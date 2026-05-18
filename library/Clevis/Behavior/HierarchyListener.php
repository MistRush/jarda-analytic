<?php

/**
 * Hierarchy Behavior Listener
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Behavior_HierarchyListener extends Doctrine_Record_Listener
{

    /**
     * Flag if behaviour is disabled
     *
     * @var bool
     */
    static private $disabled = false;

    /**
     * Disable behaviour
     *
     * @return void
     */
    public static function disable() {
        self::$disabled = true;
    }

    /**
     * Disable behaviour
     *
     * @return void
     */
    public static function enable($modelForUpdate, Doctrine_Connection $connection = null) {
        if ( $modelForUpdate != null ) {
            // Get behaviour
            $table = Doctrine_Core::getTable($modelForUpdate);
            $hierarchy = $table->getTemplate('Clevis_Behavior_Hierarchy');
            assert($hierarchy != null);

            // Get connection
            if ( $connection == null )
                $connection = Doctrine_Manager::connection();

            // Get parameters
            $columnIdentifier = $table->getIdentifier();
            $columnParent = $hierarchy->getOption('ColumnParent');
            $columnChildren = $hierarchy->getOption('ColumnChildren');

            // Prepare map parent => children
            $parents = array();
            $entities = $connection->getTable($modelForUpdate)->findAll();
            foreach ( $entities as $entity ) {
                $entityIdentifier = $entity[$columnIdentifier];
                $entityParent = $entity[$columnParent];
                if ( $entityParent == null )
                    continue;
                if ( array_key_exists($entityParent, $parents) == false )
                    $parents[$entityParent] = array();
                $parents[$entityParent][$entityIdentifier] = $entity['Name'];
            }

            // Iteratively update items, starting without children, etc
            while ( count($parents) > 0 ) {
                foreach ( $entities as $entity ) {
                    $entityIdentifier = $entity[$columnIdentifier];
                    if ( array_key_exists($entityIdentifier, $parents) )
                        continue;

                    $hierarchy->listener->updateEntity($entity);

                    $entityParent = $entity[$columnParent];
                    if ( $entityParent != null ) {
                        array_remove_by_key($parents[$entityParent], $entityIdentifier);
                        if ( count($parents[$entityParent]) == 0 )
                            array_remove_by_key($parents, $entityParent);
                    }
                }
            }

            // Update top parents
            foreach ( $entities as $entity ) {
                $entityParent = $entity[$columnParent];
                if ( $entityParent == null )
                    $hierarchy->listener->updateEntity($entity);
            }
        }

        self::$disabled = false;
    }

    /**
     * Model class
     * 
     * @var string
     */
    private $modelClass;

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
    public function __construct($modelClass, $options) {
        $this->modelClass = $modelClass;
        $this->_options = $options;
    }

    /**
     * Update entity
     * 
     * @param Doctrine_Record $entity
     * @return
     */
    private function updateEntity(Doctrine_Record $entity) {
        $table = $entity->getTable();
        $columnIdentifier = $table->getIdentifier();
        $columnParent = $this->_options['ColumnParent'];
        $columnChildren = $this->_options['ColumnChildren'];
        
        // Get parent children
        $children = $entity->getTable()->findBy($columnParent, $entity[$columnIdentifier]);

        // Calculate children identifier set
        $childrenIdentifiers = '' . $entity[$columnIdentifier];
        foreach ( $children as $child ) {
            $childrenIdentifiers .= ',';
            $childrenIdentifiers .= $child[$columnChildren];
        }

        // Set children identifiers to parent and save it
        $entity[$columnChildren] = $childrenIdentifiers;
        $entity->save($table->getConnection());
    }

    /**
     * Update entity
     *
     * @param Doctrine_Record $entity
     * @return
     */
    private function updateEntityParent(Doctrine_Record $entity) {
        $table = $entity->getTable();
        $columnParent = $this->_options['ColumnParent'];
        
        // Get entity parent
        $parent = $table->find($entity[$columnParent]);
        if ( $parent == null )
            return;
        $this->updateEntity($parent);
    }

    /**
     * Post insert
     * 
     * @param Doctrine_Event $event
     * @return void
     */
    public function postInsert(Doctrine_Event $event) {
        if ( self::$disabled )
            return;

        $this->updateEntity($event->getInvoker());
        $this->updateEntityParent($event->getInvoker());
    }

    /**
     * Post update
     * 
     * @param Doctrine_Event $event
     * @return void
     */
    public function postUpdate(Doctrine_Event $event) {
        if ( self::$disabled )
            return;

        $this->updateEntityParent($event->getInvoker());
    }

    /**
     * Post delete
     *
     * @param Doctrine_Event $event
     * @return void
     */
    public function postDelete(Doctrine_Event $event) {
        if ( self::$disabled )
            return;

        $this->updateEntityParent($event->getInvoker());
    }

}