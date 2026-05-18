<?php

/**
 * Clevis helper
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Helper
{
    /**
     * Check if application is running in development environment
     *
     * @return boolean
     */
    public static function isDevelopmentEnvironment()
    {
        if ( defined('APPLICATION_ENV') == false || APPLICATION_ENV == 'development' ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Is debugging
     * 
     * @return boolean
     */
    public static function isDebuggingEnvironment()
    {
        return Clevis_Zend_Debug::isEnabled();
    }

    /**
     * Check if application help is editable
     *
     * @return boolean
     */
    public static function isHelpEditable()
    {
        if ( @getenv('APPLICATION_HELP') == 'editable' ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get doctrine connection driver
     *
     * @return string
     */
    public static function getDoctrineConnectionDriver()
    {
        return strtolower(Doctrine_Manager::connection()->getDriverName());
    }

    /**
     * Get doctrine connection driver
     *
     * @return string
     */
    public static function getDoctrineDatabaseVersion()
    {
        $connection = Doctrine_Manager::connection();
        $result = $connection->fetchColumn('SELECT version FROM migration_version');
        $version = $result[0];
        $version .= ' [' . strtolower($connection->getDriverName()) . ']';
        return $version;
    }

    /**
     * Autoload controller class
     * 
     * @param string $controllerClassName
     */
    public static function autoloadController($controllerClassName)
    {
        $controller = explode('_',$controllerClassName,2);
        $module = strtolower($controller[0]);
        $controllerFile = $controller[1] . '.php';
        $dispatcher = Zend_Controller_Front::getInstance()->getDispatcher();
        $moduleDirectory = $dispatcher->getControllerDirectory($module);
        $controllerFile = $moduleDirectory . DIRECTORY_SEPARATOR . $controllerFile;
        if (Zend_Loader::isReadable($controllerFile) ) {
            include_once $controllerFile;
        } else {
            throw new Exception('Cannot load controller class [' . $controllerClassName . '] from file [' . $controllerFile . '].');
        }
    }

    /**
     * Format dojo data
     *
     * @param array $dataItems
     * @param array $dataIdentity
     * @param array $dataParam
     * @return string
     */
    public static function formatDojoData($dataItems, $dataIdentity = null, $dataParam = null)
    {
        $data = array();
        if ( $dataIdentity != null ) {
            if ( is_array($dataIdentity) && count($dataIdentity) == 1) {
                $data['identifier'] = $dataIdentity[0];
            } else {
                $data['identifier'] = $dataIdentity;
            }
        }

        if ( is_array($dataItems) )
            $data['items'] = $dataItems;
        else
            $data['items'] = $dataItems->toArray();

        if ( $dataParam  != null ) {
            foreach ( $dataParam as $name => $value )
                $data[$name] = $value;
        }

        return Zend_Json::encode($data);
    }

    public static function convertArrayToTree($data, $dataIdentifier, $dataParentIdentifier)
    {
        // Prepare arrays
        $tree = array();
        $map = array();

        // Add all items to map (ID => item)
        foreach ( $data as $dataItem ) {
            $identifier = $dataItem[$dataIdentifier];
            $map[$identifier] = $dataItem;
            $map[$identifier]['children'] = array();
        }

        // Add all items which has parent in map to them
        foreach ( $map as $key => &$dataItem ) {
            $parentIdentifier = $dataItem[$dataParentIdentifier];
            // If parent is in map
            if ( array_key_exists($parentIdentifier,$map) ) {
                // Add it to its children
                $map[$parentIdentifier]['children'][] = &$dataItem;
            } else {
                // Else it is root item
                $tree[] = &$dataItem;
            }
        }
        return $tree;
    }

    const SESSION_REQUESTED_URL = 'clevis_requested_url';
    
    public static function saveRequestedUrl()
    {
        $requestedUrl = new Zend_Session_Namespace(self::SESSION_REQUESTED_URL);
        $requestedUrl->Url = Zend_Controller_Front::getInstance()->getRequest()->getPathInfo();
    }
    
    public static function resetRequestedUrl()
    {
        $requestedUrl = new Zend_Session_Namespace(self::SESSION_REQUESTED_URL);
        $requestedUrl->Url = '/default/index';
    }
    
    public static function getRequestedUrl()
    {
        $requestedUrl = new Zend_Session_Namespace(self::SESSION_REQUESTED_URL);
        return Clevis_Helper::formatUrl($requestedUrl->Url);
    }
    
    /**
     * Format main url component action, controller and module
     * 
     * @param type $module  Module
     * @param type $controller  Controller
     * @param type $action  Action
     * @return string 
     */
    public static function formatMainUrl($module, $controller, $action = null)
    {
        $url = '';
        $url .= '/' . $module;
        $url .= '/' . $controller;
        if ( $action != null )
            $url .= '/' . $action;
        return $url;
    }
    
    /**
     * Format whole url
     * 
     * @param array or string $url 
     * @param
     * @return whole url string
     */
    public static function formatUrl($url, $appendFilter = true)
    {
        // Get base url
        $baseUrl = Zend_Controller_Front::getInstance()->getBaseUrl();
        // Null
        if ($url == null) {
            return null;
        }
        // String
        else if ( is_string($url) ) {
            return $baseUrl . $url;
        }
        // Array
        else if ( is_array($url) ) {
            // Ger request
            $request = Zend_Controller_Front::getInstance()->getRequest();
            // Fill missing params by current url
            if ( array_key_exists('controller', $url) == false )
                $url['controller'] = $request->getParam('controller');
            if ( array_key_exists('module', $url) == false )
                $url['module'] = $request->getParam('module');
            // Prepare url
            if ( array_key_exists('action', $url) )
                $urlFormatted = Clevis_Helper::formatMainUrl($url['module'], $url['controller'], $url['action']);
            else
                $urlFormatted = Clevis_Helper::formatMainUrl($url['module'], $url['controller']);
            // Append filter
            if ( $appendFilter ) {
                // Prepare url filter
                $urlFilter = '';
                foreach ( $url as $key => $value ) {
                    if ( $key == 'action' || $key == 'module' || $key == 'controller' )
                        continue;
                    if ( strlen($urlFilter) > 0 )
                        $urlFilter .= '&';
                    $urlFilter .= urlencode($key) . '=' . urlencode($value);
                }
                // Append url filter
                if ( strlen($urlFilter) > 0 )
                    $urlFormatted .= '?' . $urlFilter;
            }
            return $baseUrl . $urlFormatted;
        } else {
            throw new Exception('Unknown type of url!');
        }
        return null;
    }

    /**
     * Format currency
     * 
     * @param $amount
     * @return string
     */
    public static function formatCurrency($amount)
    {
        if ( $amount == null )
            $amount = 0;
        $amount = $amount / 100.0;
        return number_format($amount, 2, ',', ' ') . " Kč";
    }

    /**
     * Format doctrine case
     * 
     * @param $column
     * @param $values
     * @param null $default
     * @return string
     */
    public static function doctrineFormatCaseStatement($column, $values, $default = null)
    {
        $case = '(CASE ' . $column;
        //when \'sdh\' then \'SDH\' else entity.unit.Type end)
        foreach ( $values as $key => $value) {
            $case .= ' WHEN ';
            if ( is_string($key) )
                $case .= '\'' . $key . '\'';
            else if ( is_integer($key) )
                $case .=  $key;
            $case .= ' THEN ';
            if ( is_string($value) )
                $case .= '\'' . $value . '\'';
            else if ( is_integer($value) )
                $case .=  $value;
        }
        if ( $default != null )
            $case .= ' ELSE \'' . $default . '\'';
        $case .= ' END)';
        return $case;
    }
    
    /**
     * Get request param
     * 
     * @param type $param
     * @return string
     */
    public static function getRequestParam($param)
    {
        $request = Zend_Controller_Front::getInstance()->getRequest();
        $value = $request->getParam($param);
        if ( $value == NULLSTRING ) {
            $value = null;
        }
        return $value;
    }

    /**
     * Has request param
     *
     * @param type $param
     * @return bool
     */
    public static function hasRequestParam($param)
    {
        $request = Zend_Controller_Front::getInstance()->getRequest();
        return $request->getParam($param) !== null;
    }

    /**
     * Get request params
     *
     * @return array
     */
    public static function getRequestParams()
    {
        $request = Zend_Controller_Front::getInstance()->getRequest();
        $params = $request->getParams();
        foreach ( $params as $name => $value ) {
            if ( $value == NULLSTRING ) {
                $params[$name] = null;
            }
        }
        return $params;
    }

    /**
     * Redirect
     *
     * @param type $param
     * @return string
     */
    public static function redirect($url)
    {
        $response = Zend_Controller_Front::getInstance()->getResponse();
        $response->setRedirect(Clevis_Helper::formatUrl($url), 302);
    }

    /**
     * @return current date and time
     */
    public static function now()
    {
        return date('Y-m-d H:m:s', time());
    }
}
?>