<?php

/**
 * Class that represents one box in navigation view
 *
 * @author Pavel Cihlar
 */
class Clevis_View_NavigationBox extends Clevis_View_Item {

    /**
     * Navigation item
     *
     * @var Clevis_NavigationItem
     */
    private $navigationItem;
    
    /**
     * Constructor
     * 
     * @param code  Navigation item code
     */
    public function __construct($navigationItem) {
        $this->navigationItem = $navigationItem;
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
        $output .= '<div class="navigation-box">' . PHP_EOL;
        
        // Left image
        $output .= '<div style="display: table-cell; vertical-align: top;">' . PHP_EOL;
        $output .= '<div class="navigation-box-image">' . PHP_EOL;
        $output .= '<div class="navigation-box-image" style="display: table-cell;">' . PHP_EOL;
        $output .= '<div style="display: inline-block;">' . PHP_EOL;
        $output .= Clevis_Image::render($image, Clevis_Image::ICON_NORMAL);
        $output .= '</div>' . PHP_EOL;
        $output .= '</div>' . PHP_EOL;
        $output .= '</div>' . PHP_EOL;
        $output .= '</div>' . PHP_EOL;
        
        // Add title
        $output .= '<div style="display: table-cell; width: 100%;">' . PHP_EOL;
        $output .= '<h2 class="clevis-image-icon-small">' . PHP_EOL;
        if ( $url != null )
            $output .= '<a href="' . $url . '">' . $name . '</a>' . PHP_EOL;
        else
            $output .= $name . '' . PHP_EOL;

        // Add children links
        $children = $navigationItem->getChildren();
        if ( count($children) > 0 || $navigationItem->getChildrenDescription() != null ) {
            $output .= '<div class="navigation-box-menu">' . PHP_EOL;

            // Children
            $outputChildren = '';

            foreach ( $children as $index => $child ) {
                // Render child
                if ( strlen($outputChildren) > 0 )
                    $outputChildren .= ',&nbsp;&nbsp; ';

                $url = $child->getUrl();
                if ( $url == null )
                    $url = '?code=' . $child->getCode();
                
                $outputChildren .= '<a href="' . $url . '">' . $child->getName() . '</a>';

            }
            $output .= $outputChildren;
            if ( strlen($outputChildren) > 0 )
                $output .= '<br>';
            $output .= $navigationItem->getChildrenDescription();
            $output .= '</div>' . PHP_EOL;
        }

        // End title
        $output .= '</h2>';
        
        // If has description, render hideable panel
        if ( $description != null ) {
            // Add content
            $output .= '<div id="' . $id . '-content" class="navigation-box-content">' . PHP_EOL;
        
            // Add image
            if ( $image != null ) {
                $output .= '<div class="navigation-box-content-image"><center>' . PHP_EOL;
                $output .= '<a href="' . $url . '">' . Clevis_Image::render($image, Clevis_Image::PICTURE) . '</a>';
                $output .= '</center></div>' . PHP_EOL;
            }
        
            // Add description
            $output .= '<p>' . $description . '</p>' . PHP_EOL;
                
            // End content
            $output .= '</div>' . PHP_EOL;           
        }
        
        $output .= '</div>' . PHP_EOL;
        $output .= '</div>' . PHP_EOL;

        return $output;
    }    
    

}
?>