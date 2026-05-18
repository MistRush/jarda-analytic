<?php
/**
 * Class that represents parent information for inner views
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_ParentInfo {

    /**
     * Parent
     *
     * @var Clevis_View_Item
     */
    private $parent;

    /**
     * Set parent
     *
     * @param Clevis_View_Item $parent
     */
    public function setParent(Clevis_View_Item & $parent) {
        $this->parent = $parent;
    }

    /**
     * Get parent
     * 
     * @return Clevis_View_Item
     */
    public function & getParent() {
        return $this->parent;
    }
 
    /**
     * Singleton
     *
     * @var Clevis_View_ParentInfo
     */
    private static $stackParentInfo;

    /**
     * Add new parent info
     *
     * @param Clevis_View_ParentInfo $parentInfo
     * @return void
     */
    public static function pushParentInfo(Clevis_View_ParentInfo & $parentInfo) {
        Clevis_View_ParentInfo::$stackParentInfo[] = &$parentInfo;
    }

    /**
     * Remove last parent info
     *
     * @return void
     */
    public static function popParentInfo() {
        array_pop(Clevis_View_ParentInfo::$stackParentInfo);
    }

    /**
     * Is parent info
     * 
     * @return boolean
     */
    public static function isParentInfo() {
        return count(Clevis_View_ParentInfo::$stackParentInfo) > 0;
    }

    /**
     * Get current parent info
     * 
     * @return Clevis_View_ParentInfo
     */
    public static function getParentInfo() {
        if ( Clevis_View_ParentInfo::isParentInfo() )
            return Clevis_View_ParentInfo::$stackParentInfo[count(Clevis_View_ParentInfo::$stackParentInfo) - 1];
    }


    
}
?>