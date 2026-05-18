<?php

/**
 * Hierarchy Behavior
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Behavior_Hierarchy extends Doctrine_Template {

    /**
     * Options
     * 
     * @var array
     */
    protected $_options = array(
        'ColumnParent' => null,
        'ColumnChildren' => 'ChildrenIDs',
    );

    /**
     * Listener
     *
     * @var Clevis_Behavior_HierarchyListener
     */
    public $listener;

    /**
     * Constructor
     * 
     * @param array $options
     */
    public function __construct(array $options = array()) {
        parent::__construct($options);

        assert($this->_options['ColumnParent'] != null);
    }
        
    /**
     * Set table definition for behavior
     *
     * @return void
     */
    public function setTableDefinition()
    {
        // Setup columns
        $this->hasColumn($this->_options['ColumnParent'], 'integer');
        $this->hasColumn($this->_options['ColumnChildren'], 'string');
        
        // Add listener
        $this->listener = new Clevis_Behavior_HierarchyListener($this->getTable()->getOption("name"), $this->_options);
        $this->addListener($this->listener);
    }

    /**
     * Setup
     *
     * @return void
     */
    public function setUp()
    {
        $model = $this->getTable()->getOption("name");

        $this->hasOne($model . ' as parent', array(
             'local' => $this->_options['ColumnParent'],
             'foreign' => $this->getTable()->getIdentifier()
        ));
        $this->hasMany($model . ' as children', array(
            'local' => $this->getTable()->getIdentifier(),
            'foreign' => $this->_options['ColumnParent']
        ));
    }
}
?>