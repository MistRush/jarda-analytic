<?php

/**
 * Class that represents one directory box in navigation view
 *
 * @author Pavel Cihlar
 */
class Clevis_View_NavigationBoxDirectorySDH extends Clevis_View_Item {

    private $navigationItem;
    private $title;
    private $width;
    private $height;

    /**
     * Constructor
     * 
     * @param code  Navigation item code
     */
    public function __construct($navigationItem, $title, $width, $height) {
        $this->navigationItem = $navigationItem;
        $this->title = $title;
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
     * Get title
     *
     * @return $string
     */
    public function getTitle() {
        return $this->title;
    }
    
    /**
     * Render moduleBox
     *
     * @return string
     */
    public function render() {
        $navigationItem = $this->getNavigationItem();
        $title = $this->getTitle();

        $image = '';
        $code = '';

        if ( $navigationItem ) {
            $image = $navigationItem->getImage();
            $code = $navigationItem->getCode();
        }

        $output = '';
        $output .= '<div class="navigation-box-directory" style="width: ' . $this->width . 'px; height: ' . $this->height . 'px;">' . PHP_EOL;
               
        // Add title
        $output .= '<div>' . PHP_EOL;
        $output .= '<h2 style="font-size: 14px; font-weight: bold; border: 0">' . PHP_EOL;

        // Left image
        $output .= '<div style="display: table-cell; vertical-align: top; float: left; margin-top: -4px;">' . PHP_EOL;
        $output .= '<div class="navigation-box-image-bw" style="display: table-cell;">' . PHP_EOL;
        $output .= '<div style="display: inline-block;">' . PHP_EOL;
        $output .= Clevis_Image::render($image, Clevis_Image::ICON_COLOR);
        $output .= '</div>' . PHP_EOL;
        $output .= '</div>' . PHP_EOL;
        $output .= '</div>' . PHP_EOL;

        $output .= '<div style="cursor: pointer;" onclick="updateContent(\'box-' . $code . '\')">' . PHP_EOL;
        $output .= $title . '' . PHP_EOL;
        $output .= '</div>' . PHP_EOL;
        $output .= '<div style="float: right; margin-top: -20px;">';
        $output .= Clevis_Help::renderHelpImage('index-' . $code, Clevis_Image::ICON_SMALL, Clevis_Help::FLOAT_RIGHT);
        $output .= '</div>';


        // End title
        $output .= '</h2>';

        $output .= '</div>' . PHP_EOL;
        $output .= '</div>' . PHP_EOL;

        return $output;
    }
}
?>