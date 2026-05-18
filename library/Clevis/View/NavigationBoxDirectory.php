<?php

/**
 * Class that represents one directory box in navigation view
 *
 * @author Pavel Cihlar
 */
class Clevis_View_NavigationBoxDirectory extends Clevis_View_Item {

    /**
     * Navigation item
     *
     * @var Clevis_NavigationItem
     */
    private $navigationItem;

    private $width;
    private $height;

    /**
     * Constructor
     * 
     * @param code  Navigation item code
     */
    public function __construct($navigationItem, $width, $height) {
        $this->navigationItem = $navigationItem;
        $this->width = $width;
        $this->height = $height;
    }

    /**
     * Get navigation item
     *
     * @return Clevis_NavigationItem
     */
    public function getNavigationItem() {
        return $this->navigationItem;
    }

    /**
     * Render moduleBox
     *
     * @return string
     */
    public function render() {
        $navigationItem = $this->getNavigationItem();

        if ( !$navigationItem )
            return;

        // Get navigation item properties
        $id = 'navigation-' . $navigationItem->getCode();
        $code = $navigationItem->getCode();
        $name = $navigationItem->getName();
        $description = $navigationItem->getDescription();
        $image = $navigationItem->getImage();
        $url = $navigationItem->getUrl();
        if ( $url == null )
            $url = '?code=' . $navigationItem->getCode();

        $output = '';
        $output .= '<div class="navigation-box-directory" style="width: ' . $this->width . 'px; height: ' . $this->height . 'px;">' . PHP_EOL;
               
        // Add title
        $output .= '<div>' . PHP_EOL;
        $output .= '<h2>' . PHP_EOL;

        // Left image
        $output .= '<div style="display: table-cell; vertical-align: top; float: left; margin-top: -4px;">' . PHP_EOL;
        $output .= '<div class="navigation-box-image-bw" style="display: table-cell;">' . PHP_EOL;
        $output .= '<div style="display: inline-block;">' . PHP_EOL;
        $output .= Clevis_Image::render($image, Clevis_Image::ICON_BW);
        $output .= '</div>' . PHP_EOL;
        $output .= '</div>' . PHP_EOL;
        $output .= '</div>' . PHP_EOL;

        if ( $url != null )
            $output .= '<a href="' . $url . '">' . $name . '</a>' . PHP_EOL;
        else
            $output .= $name . '' . PHP_EOL;
        
        // Render help icon to title
        if ( $description != null ) {
            $output .= '<div style="float: right; margin-top: 3px; margin-right: 10px;">';
            $output .= Clevis_Help::renderHelpImage('navigation(' . $navigationItem->getCode() . ')', Clevis_Image::ICON_NORMAL, Clevis_Help::TOOLTIP | Clevis_Help::FLOAT_RIGHT);
            $output .= '</div>';
        }

        // End title
        $output .= '</h2>';

        // Add children links
        $children = $navigationItem->getChildren();
        if ( count($children) > 0 || $navigationItem->getChildrenDescription() != null ) {

            $output .= '<div class="navigation-directory-box-menu">' . PHP_EOL;

            // Children
            $outputChildren = '';

            foreach ( $children as $index => $child ) {
                // Render child
                if ( strlen($outputChildren) > 0 )
                    $outputChildren .= ',&nbsp;&nbsp; ';

                $url = $child->getUrl();
                if ( $url == null )
                    $url = '?code=' . $child->getCode();

                $navigationChildItem = Clevis_Navigation::getInstance()->getItem($child->getCode());

                if ( sizeof($navigationChildItem->getChildren()) > 0 ) {
                    $code = str_replace("-","",$child->getCode()) ;
                    $outputChildren .= '<span onMouseOver="showNavigationMap' . $code . '(this)"><a href="' . $url . '"  onMouseOut="setShow' . $code . '();">' . $child->getName() . '</a></span>';
                    $outputChildren .=
                    '<script type="text/javascript">
                        var dialog_navigationMap' . $code . ' = null;
                        require(["clevis/ready!", "dijit/popup"], function(ready, popup){
                            var show' . $code . ' = false;
                            dialog_navigationMap' . $code . '= new dijit.TooltipDialog({
                                href: "' .  Zend_Controller_Front::getInstance()->getBaseUrl() . '/common/navigation-map/navigation-map/type/' . $child->getCode() . '",
                                errorMessage: ""
                            });
                            window.hideNavigationMap' . $code . ' = function() {
                                popup.close(window.dialog_navigationMap' . $code . ');
                            };
                            window.setShow' . $code . ' = function(){
                                show' . $code . ' = false;
                            }
                            window.showNavigationMap' . $code . ' = function(node){
                                show' . $code . ' = true;
                                setTimeout(function(){
                                    if (show' . $code . ')
                                        popup.open({ popup: dialog_navigationMap' . $code . ', around: dojo.byId(node) });
                                }, ' . TOOLTIP_DELAY . ');
                            }
                        });
                    </script>';
                } else {
                    $outputChildren .= '<a href="' . $url . '">' . $child->getName() . '</a>';
                }

            }
            $output .= $outputChildren;
            if ( strlen($outputChildren) > 0 )
                $output .= '<br>';
            $output .= $navigationItem->getChildrenDescription();
            $output .= '</div>' . PHP_EOL;
        } 

        $output .= '</div>' . PHP_EOL;
        $output .= '</div>' . PHP_EOL;

        return $output;
    }
}
?>