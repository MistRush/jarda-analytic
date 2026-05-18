<?php

/**
 * Sitemap
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_Sitemap extends Clevis_View_Item {
    
    private $item;
    private $ignoreChildren;
    private $skipMain;
    
    public function __construct(Clevis_NavigationItem & $item, $ignoreChildren = array(), $skipMain = false) {
        parent::__construct();
        
        $this->item = &$item;
        $this->ignoreChildren = $ignoreChildren;
        $this->skipMain = $skipMain;
    }
    
    private function renderItem(Clevis_NavigationItem & $item) {

        $output = '';
        if ( in_array($item->getCode(), $this->ignoreChildren) == false ) {

            $itemId = 'view(' . $item->getCode() . ')';                      
            if ( $item->getCode() != Navigation::MAIN || $this->skipMain != true )
                $output .= '<li>' . PHP_EOL;
            else
                $output .= '<li style="list-style-type: none;">' . PHP_EOL;
            if ( $item->getChildrenDescriptionLong() && $item->getCode() != 'item-' . ITEM::TECHNICAL ) {
                $output .= '  <a href="' . $item->getUrl() . '" onMouseOver="dijit.showTooltip(\'' . $item->getChildrenDescriptionLong() . '\',this)" onMouseOut="dijit.hideTooltip(dojo.byId(this));">' . $item->getName() . '</a>' . Clevis_Help::renderHelpImage($itemId, Clevis_Image::ICON_SMALL) . PHP_EOL;
            } else {
                if ( $item->getCode() != Navigation::MAIN || $this->skipMain != true )
                    $output .= '  <a href="' . $item->getUrl() . '">' . $item->getName() . '</a>' . PHP_EOL;
                else
                    $output .= '  <div style="height: 24px;"></div>' . PHP_EOL;
            }

            $children = $item->getChildren();
            if ( count($children) > 0 && in_array($item->getCode(), $this->ignoreChildren) == false ) {
                $output .= '  <ul>' . PHP_EOL;
                foreach ( $children as $child ) {
                    $output .= Clevis_View_Code::indentHtmlCode($this->renderItem($child), 2) . PHP_EOL;
                }
                $output .= '  </ul>' . PHP_EOL;
            }

            $output .= '</li>' . PHP_EOL;
        }
        return $output;
    }
    
    public function render() {
        $output = '';       
        $output .= '<ul>' . PHP_EOL;
        $output .= Clevis_View_Code::indentHtmlCode($this->renderItem($this->item)) . PHP_EOL;
        $output .= '</ul>' . PHP_EOL;
        
        return $output;
    }
}

?>