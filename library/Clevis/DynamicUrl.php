<?php

/**
 * DynamicURL
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_DynamicUrl {
    
    /**
     * Render dynamic url
     * 
     * @param string $url
     * @param string $name 
     */
    public static function render($url, $name) {
        return '<a class="clevis-dynamic-link" onClick="require([\'clevis/dynamicUrl\'], function(dynamicUrl) { dynamicUrl.redirect(\'' . $url . '\'); });">' . $name . '</a>';
    }

    /**
     * Bind item to dynamic param
     * 
     * @param Clevis_View_ItemElement $itemElement
     * @param string $dynamicParam
     */
    public static function bindDynamicParam(Clevis_View_ItemElement $itemElement, $dynamicParam) {
        // Set dynamic param to item
        $itemElement->setDojoAttribute('dynamicParam', $dynamicParam);
        // Set dynamic param value to item
        $dynamicParamValue = Clevis_Helper::getRequestParam($dynamicParam);
        if ( $dynamicParamValue != null && $dynamicParamValue != '' ) {
            $itemElement->setDojoAttribute('dynamicParamValue', $dynamicParamValue);
        }
    }
}

?>