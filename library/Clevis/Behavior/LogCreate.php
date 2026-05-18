<?php

/**
 * LogCreate Behavior
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Behavior_LogCreate extends Doctrine_Template {

    /**
     * Options
     * 
     * @var array
     */
    protected $_options = array(
        "ByClass" => null,
        "ByClassAlias" => "createdBy",
        "ByClassColumn" => null
    );

    /** Default Options */
    private static $_defaultOptions = array();

    /**
     * Set default options
     * 
     * @param $userClass
     * @param $userClassColumn
     * @return void
     */
    public static function setDefaultOptions($options) {
        self::$_defaultOptions = $options;
    }

    /**
     * Constructor
     * 
     * @param array $options
     */
    public function __construct(array $options = array()) {
        parent::__construct($options);

        // Set default options
        foreach ( $this->_options as $key => $value ) {
            if ( $value == null || array_key_exists($key, self::$_defaultOptions) )
                $this->_options[$key] = self::$_defaultOptions[$key];
        }
        assert($this->_options["ByClass"] != null);
        assert($this->_options["ByClassColumn"] != null);
    }
        
    /**
     * Set table definition for behavior
     *
     * @return void
     */
    public function setTableDefinition()
    {
        // Setup columns
        $this->hasColumn('CreatedBy', 'integer');
        $this->hasColumn('CreatedDate', 'timestamp');
        
        // Add listener
        $this->addListener(new Clevis_Behavior_LogCreateListener());
    }

    /**
     * Setup
     *
     * @return void
     */
    public function setUp()
    {
        $this->hasOne($this->_options["ByClass"] . ' as ' . $this->_options["ByClassAlias"], array(
             'local' => 'CreatedBy',
             'foreign' => $this->_options["ByClassColumn"]
        ));
    }
}
?>