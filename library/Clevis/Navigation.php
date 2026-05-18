<?php

const CLEVIS_NAVIGATION_MAIN = 'main';

/**
 * NavigationItem
 * 
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_NavigationItem {
    
    /**
     * Parent item
     * 
     * @var Clevis_NavigationItem
     */
    protected $parent = null;
    
    /**
     * Unique item code
     * 
     * @var string
     */
    private $code;
    
    /**
     * Name for display
     * 
     * @var string
     */
    private $name;
    
    /**
     * Description of item
     * 
     * @var string
     */
    private $description;
    
    /**
     * Image of item
     * 
     * @var string
     */
    private $image;

    /**
     * Description of item children
     *
     * @var string
     */
    private $childrenDescription;

    /**
     * Description of item children
     *
     * @var string
     */
    private $childrenDescriptionLong;

    /**
     * URL
     * 
     * @var string
     */
    private $url;
    
    /**
     * URL filled
     * 
     * @var boolean
     */
    private $urlFilled = false;
    
    /**
     * URL Action
     * 
     * @var string
     */
    private $urlAction;
    
    /**
     * URL Controller
     * 
     * @var string
     */
    private $urlController;
    
    /**
     * URL Module
     * 
     * @var string
     */
    private $urlModule;

    /**
     * Url params
     *
     * @var array
     */
    protected $urlParams = array();

    /**
     * Url filter build from params and parent filter
     *
     * @var array
     */
    private $urlFilter = array();

    /**
     * Permission code
     *
     * @var string
     */
    private $permission;
    
    /**
     * Children
     * 
     * @var array of Clevis_NavigationItem
     */
    protected $children = array();
    
    /**
     * Array of statistics
     * 
     * @var array
     */
    private $statistic = array();

    /**
     * Show title menu
     *
     * @var boolean
     */
    private $titleMenuVisible = true;

    /**
     * Constructor
     * 
     * @param $code Item code
     * @param $name Item name
     * @param $image Item image
     */
    public function __construct($code = null, $name = null, $image = null, $permission = null) {
        $this->code = $code;
        $this->name = $name;
        $this->image = $image;
        $this->permission = $permission;
    }
    
    /**
     * Set parent
     * 
     * @param Clevis_NavigationItem $parent 
     */
    public function setParent(Clevis_NavigationItem $parent) {
        $this->parent = $parent;
    }
    
    /**
     * Get parent
     * 
     * @return Clevis_NavigationItem
     */
    public function getParent() {
        return $this->parent;
    }

    /**
     * Set code
     * 
     * @param $code
     * @return void
     */
    protected function setCode($code) {
        $this->code = $code;
    }
    
    /**
     * Get unique code
     * 
     * @return string
     */
    public function getCode() {
        return $this->code;
    }

    /**
     * Set name
     *
     * @param $name
     * @return void
     */
    protected function setName($name) {
        $this->name = $name;
    }
    
    /**
     * Get name for display
     * 
     * @return string
     */
    public function getName() {
        return $this->name;
    }

    /**
     * Set dynamicLinks
     *
     * @param $dynamicLinks
     * @return void
     */
    public function setTitleMenuVisible($titleMenuVisible) {
        $this->titleMenuVisible = $titleMenuVisible;
    }

    /**
     * Get dynamicLinks
     *
     * @return string
     */
    public function getTitleMenuVisible() {
        return $this->titleMenuVisible;
    }

    /**
     * Set description
     * 
     * @param string $description 
     */
    public function setDescription($description) {
        $this->description = $description; 
    }
    
    /**
     * Get description
     * 
     * @return string
     */
    public function getDescription() {
        return $this->description;
    }
    
    /**
     * Set image class
     * 
     * @param string $image 
     */
    public function setImage($image) {
        $this->image = $image;
    }
    
    /**
     * Get image class
     * 
     * @return string
     */
    public function getImage() {
        return $this->image;
    }

    /**
     * Set children description
     *
     * @param string $description
     */
    public function setChildrenDescription($childrenDescription) {
        $this->childrenDescription = $childrenDescription;
    }

    /**
     * Get children description
     *
     * @return string
     */
    public function getChildrenDescription() {
        return $this->childrenDescription;
    }

    /**
     * Set children descriptionLong
     *
     * @param string $descriptionLong
     */
    public function setChildrenDescriptionLong($childrenDescriptionLong) {
        $this->childrenDescriptionLong = $childrenDescriptionLong;
    }

    /**
     * Get children descriptionLong
     *
     * @return string
     */
    public function getChildrenDescriptionLong() {
        return $this->childrenDescriptionLong;
    }

    /**
     * Get permission
     * 
     * @return string
     */
    public function getPermission() {
        return $this->permission;
    }
    
    /**
     * Set url
     * 
     * @param string $action Action name
     * @param string $controller Controller name (if not set use parent controller)
     * @param string $module Module name (if not set use parent module)
     */
    public function setUrl($action, $controller = null, $module = null) {
        // Set url components
        $this->urlAction = $action;
        $this->urlController = $controller;
        $this->urlModule = $module;
        $this->urlFilled = true;
    }

    /**
     * Add url param
     *
     * @param $param
     * @param $value  If is null, current request value is added
     */
    public function addUrlParam($param, $value = null) {
        if ( $value == null ) {
            // If value is null we want to define it only for the first time and the value is taken from request
            if ( array_key_exists($param, $this->urlParams) == false ) {
                $this->urlParams[$param] = Clevis_Helper::getRequestParam($param);
            }
        } else {
            $this->urlParams[$param] = $value;
        }
    }
    
    /**
     * Is url filled
     * 
     * @return boolean
     */
    public function isUrlFilled() {
        return $this->urlFilled;
    }

    /**
     * Get url
     * 
     * @return string
     */
    public function getUrl() {
        if ( $this->url == null ) {
            $urlFilter = $this->getUrlFilter();
            // If url is filled it means to concat url components on url get
            if ( $this->urlFilled == true ) {
                $this->url = Clevis_Helper::formatUrl('/' . $this->getUrlModule() . '/' . $this->getUrlController() . '/' . $this->getUrlAction());
                if ( $urlFilter != null && strlen($urlFilter) > 0 ) {
                    $this->url .= '?' . $urlFilter;
                }
            }
            // Else url is null
            else {
                $this->url = Clevis_Navigation::getInstance()->getUrl() . '?code=' . $this->getCode();
                if ( $urlFilter != null && strlen($urlFilter) > 0 ) {
                    $this->url .= '&' . $urlFilter;
                }
            }
        }
        return $this->url;
    }
    
    /**
     * Get url action
     * 
     * @return string
     */
    public function getUrlAction() {
        if ( $this->urlAction == null && $this->urlFilled == true )
            $this->urlAction = $this->parent->getUrlAction();
        return $this->urlAction;
    }
    
    /**
     * Get url controller
     * 
     * @return string
     */
    public function getUrlController() {
        if ( $this->urlController == null && $this->urlFilled == true )
            $this->urlController = $this->parent->getUrlController();
        return $this->urlController;
    }
    
    /**
     * Get url module
     * 
     * @return string
     */
    public function getUrlModule() {
        if ( $this->urlModule == null && $this->urlFilled == true )
            $this->urlModule = $this->parent->getUrlModule();
        return $this->urlModule;
    }

    /**
     * Get url filter
     *
     * @return string
     */
    public function getUrlFilter() {
        if ( $this->urlFilter == null ) {
            $urlFilter = '';
            if ( $this->parent != null) {
                $urlFilter .= $this->parent->getUrlFilter();
            }
            foreach ( $this->urlParams as $param => $value ) {
                if ( $value == null ) {
                    continue;
                }
                if ( strlen($urlFilter) > 0 ) {
                    $urlFilter .= '&';
                }
                $urlFilter .= $param . '=' . $value;
            }
            $this->urlFilter = $urlFilter;
        }
        return $this->urlFilter;
    }
    
    /**
     * Add this item to navigation item
     * 
     * @param Clevis_NavigationItem $item
     * @param array $filter
     * @return boolean
     */
    public function into(Clevis_NavigationItem $item, $filter = null) {
        // Check filter
        if ( self::$instance != null && self::$instance->filter($this, $filter) == false ) {
            return false;
        }
        // If doesn't have permission, set it from parent
        if ( $this->permission == null )
            $this->permission = $item->getPermission();
        // Add this to item
        $this->setParent($item);
        $item->children[] = $this;
        return true;
    }
    
    /**
     * Get children
     * 
     * @return array of Clevis_NavigationItem
     */
    public function & getChildren() {
        return $this->children;
    }
    
    /**
     * Add statistic
     * 
     * @param string $name
     * @param array $callback 
     */
    public function addStatistic($name, $callback) {
        $this->statistic[] = array('name' => $name, 'callback' => $callback);
    }
    
    /**
     * Get array of statistics
     * 
     * @return array
     */
    public function & getStatistic() {
        return $this->statistic;
    }

    /**
     * Init item
     */
    public function init() {
    }

    /**
     * First constructed instance of this class in application
     *
     * @var Clevis_Navigation
     */
    protected static $instance;
}

/**
 * Navigation
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_NavigationItemProxy extends Clevis_NavigationItem {

    /**
     * Navigation item code
     *
     * @var \Item|null
     */
    private $code = null;

    /**
     * Navigation item
     *
     * @var Clevis_NavigationItem
     */
    private $navigationItem = null;

    /**
     * Constructor
     *
     * @param $codeOrItem
     */
    public function __construct($codeOrItem = null) {
        parent::__construct();
        if ( $codeOrItem instanceof Clevis_NavigationItem ) {
            $this->navigationItem = $codeOrItem;
            $this->code = $codeOrItem->getCode();
        } else {
            $this->code = $codeOrItem;
        }
    }

    /**
     * Init item
     */
    public function init() {
        $this->navigationItem = Clevis_Navigation::getInstance()->getItem($this->code);
        assert($this->navigationItem != null);

        // We must add all url param to proxied item with current value from request
        foreach ( $this->urlParams as $name => $value) {
            $this->navigationItem->addUrlParam($name);
        }
    }

    /**
     * Get parent
     *
     * @return Clevis_NavigationItem
     */
    public function getParent() {
        return $this->navigationItem->getParent();
    }

    /**
     * Get unique code
     *
     * @return string
     */
    public function getCode() {
        return $this->code;
    }

    /**
     * Get name for display
     *
     * @return string
     */
    public function getName() {
        return $this->navigationItem->getName();
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription() {
        return $this->navigationItem->getDescription();
    }

    /**
     * Get image class
     *
     * @return string
     */
    public function getImage() {
        return $this->navigationItem->getImage();
    }

    /**
     * Is url filled
     *
     * @return boolean
     */
    public function isUrlFilled() {
        return $this->navigationItem->isUrlFilled();
    }

    /**
     * Get url
     *
     * @return string
     */
    public function getUrl() {
        $url = $this->navigationItem->getUrl();
        
        $urlFilter = $this->getUrlFilter();
        if ( $urlFilter != null ) {
            if ( strpos($url, '?') != false ) {
                $url .= '&' . $urlFilter;

            } else {
                $url .= '?' . $urlFilter;
            }
        }
        return $url;
    }

    /**
     * Get url action
     *
     * @return string
     */
    public function getUrlAction() {
        return $this->navigationItem->getUrlAction();
    }

    /**
     * Get url controller
     *
     * @return string
     */
    public function getUrlController() {
        return $this->navigationItem->getUrlController();
    }

    /**
     * Get url module
     *
     * @return string
     */
    public function getUrlModule() {
        return $this->navigationItem->getUrlModule();
    }

    /**
     * Get children
     *
     * @return array of Clevis_NavigationItem
     */
    public function & getChildren() {
        $children = array();
        foreach ( $this->navigationItem->getChildren() as $child ) {
            $childProxy = new Clevis_NavigationItemProxy($child);
            $childProxy->parent = $this;
            $children[] = $childProxy;
        }
        return $children;
    }

    /**
     * Get array of statistics
     *
     * @return array
     */
    public function & getStatistic() {
        return $this->navigationItem->getStatistic();
    }
}

/**
 * Navigation
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
abstract class Clevis_Navigation extends Clevis_NavigationItem {
    
    /**
     * Clevis navigation class type
     * 
     * @var string
     */
    private static $instanceType;
    
    /**
     * Application name
     * 
     * @var string
     */
    private $applicationName;
    
    /**
     * Application short name
     * 
     * @var string
     */
    private $applicationShortName;
    
    /**
     * Map of item (code => item)
     * 
     * @var array
     */
    private $mapItem = array();
    
    /**
     * Map of item (url => item)
     * 
     * @var array
     */
    private $mapUrlItem = array();
    
    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct();
    }

    /**
     * Set application name
     * 
     * @param $applicationName
     * @return void
     */
    public function setApplicationName($applicationName) {
        $this->applicationName = $applicationName;
    }

    /**
     * Get application name
     *
     * @return string
     */
    public function getApplicationName() {
        return $this->applicationName;
    }

    /**
     * Set application short name
     *
     * @param $applicationShortName
     * @return void
     */
    public function setApplicationShortName($applicationShortName) {
        $this->applicationShortName = $applicationShortName;
    }
    
    /**
     * Get application short name
     * 
     * @return string
     */
    public function getApplicationShortName() {
        return $this->applicationShortName;
    }
    
    
    /**
     * Get item in navigation by its code
     * 
     * @param type $code 
     * @return Clevis_NavigationItem
     */
    public function getItem($code) {
        $item = null;
        if ( array_key_exists($code, $this->mapItem) )
            $item = $this->mapItem[$code];
        return $item;
    }

    /**
     * Exist item in navigation
     * 
     * @param $code
     * @return bool
     */
    public function existItem($code) {
        return array_key_exists($code, $this->mapItem);
    }
    
    /**
     * Get navigation item for current url
     * 
     * @return Clevis_NavigationItem &
     */
    public function getItemForCurrentUrl() {
        // Get current url
        $request = Zend_Controller_Front::getInstance()->getRequest();
        $url = Clevis_Helper::formatMainUrl(
            $request->getParam('module'),
            $request->getParam('controller'),
            $request->getParam('action')
        );
        // Get proper navigation item
        $navigationItem = null;
        if ( array_key_exists($url, $this->mapUrlItem) )
            $navigationItem = $this->mapUrlItem[$url];

        // Allow all develop pages in development environment
        if ( $navigationItem == null && Clevis_Helper::isDevelopmentEnvironment() ) {
            if ( $request->getParam('module') == 'develop' )
                return New Clevis_NavigationItem(null, 'Develop');
        }

        return $navigationItem;
    }
    
    /**
     * Get nesting items for current url
     * 
     * @return array of items
     */
    public function getNestingItemsForCurrentUrl() {
        // Get proper navigation item
        $navigationItem = $this->getItemForCurrentUrl();
        // If navigation item is main page, get code and select proper subpage based on code
        $code = null;
        if ( $navigationItem == $this ) {
            $code = Zend_Controller_Front::getInstance()->getRequest()->getParam('code');
            if ( array_key_exists($code, $this->mapItem) )
                $navigationItem = $this->mapItem[$code];
        }
        // Fill items
        $items = array();
        while ( $navigationItem != null ) {
            $item = array();
            $item['name'] = $navigationItem->getName();
            $item['url'] = $navigationItem->getUrl();
            $item['code'] = $navigationItem->getCode();
            // Add item
            $items = array_merge(array($item), $items);
            // Next navigation item is its parent
            $navigationItem = $navigationItem->getParent();
        }
        return $items;
    }
    
    /**
     * Fill map with item
     * 
     * @param Clevis_NavigationItem $item 
     */
    private function fillMapItem(Clevis_NavigationItem & $item) {
        if ( $item instanceof Clevis_NavigationItemProxy )
            return;
        // Map code => item
        $this->mapItem[$item->getCode()] = $item;
        // Map url => item
        $url = Clevis_Helper::formatMainUrl($item->getUrlModule(), $item->getUrlController(), $item->getUrlAction());
        $this->mapUrlItem[$url] = $item;
        // Process children
        foreach ( $item->children as &$child ) {
            $this->fillMapItem($child);
        }
    }

    /**
     * Init item
     *
     * @param Clevis_NavigationItem $item
     */
    private function initItem(Clevis_NavigationItem & $item) {
        $item->init();
        // Process children
        foreach ( $item->children as &$child ) {
            $this->initItem($child);
        }
    }

    /**
     * Abstract Build navigation
     * 
     * @return void
     */
    abstract public function build();

    /**
     * Filter navigation item
     * 
     * @param Clevis_NavigationItem $item
     * @param $filter
     * @return bool
     */
    public function filter(Clevis_NavigationItem $item, $filter) {
        return true;
    }
    
    /**
     * Set navigation instance type
     *
     * @param string $instanceType
     */
    public static function setInstanceType($instanceType) {
        self::$instanceType = $instanceType;
    }
    
    /**
     * Set navigation instance
     * 
     * @param type $instance 
     */
    public static function setInstance($instance) {
        if ( self::$instance != null) {
            throw new Exception('Navigation instance is already set!');
        }
        self::$instance = $instance;
        self::$instance->fillMapItem($instance);
    }
    
    /**
     * Get instance of navigation
     * 
     * @return Clevis_Navigation
     */
    public static function getInstance() {
        if ( self::$instance == null ) {
            if ( self::$instanceType != null ) {
                Clevis_Timer::start('run-navigation');
                self::$instance = new self::$instanceType();
                self::$instance->build();
                self::$instance->fillMapItem(self::$instance);
                self::$instance->initItem(self::$instance);
                Clevis_Timer::stop('run-navigation');
            }
            else
                throw new Exception('Navigation instance is not set!');
        }
        return self::$instance;
    }
    
}

?>