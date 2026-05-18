<?php

/**
 * Helper class for rendering help icons.
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Help
{
    /** Only given tooltip will be shown and the help loading/saving will be disabled */
    const TOOLTIP = 1;

    /** Option to float the image to the right */
    const FLOAT_RIGHT = 2;

    /**
     * Render help image. The unique help id must be specified. The help image will be of specified image size.
     * If tooltip is filled it is shown when user hovers the icon and the help is loaded when the user clicks
     * on the icon and is shown as tooltip dialog.
     * If tooltip is not filled then the help is loaded right after the user hovers the icon and
     * it is shown as simple tooltip.
     *
     * @param $helpId          Unique help id
     * @param $imageSize       Image size for help icon
     * @param $options         Options for help icon (float right, show only tooltip and not help when click)
     * @param string $tooltip  Tooltip text that is shown when user hovers the icon (can be null)
     * @return string
     */
    public static function renderHelpImage($helpId, $imageSize, $options = null, $tooltip = null)
    {
        // If help is load/save-able and we are in development mode add help id to tooltip
        if ( $tooltip != null && ($options & self::TOOLTIP) == 0 && Clevis_Helper::isDevelopmentEnvironment() ) {
            $tooltip .= ' [id:<span style=\\\'color: red;\\\'>' . $helpId . '</span>]';
        }

        // Prepare help icon style
        $style = ' style="display: inline-block; margin-left: 2px;';
        if ( $imageSize == Clevis_Image::ICON_SMALL ) {
            $style .= 'margin-top: 2px;';
        }
        if ( ($options & self::FLOAT_RIGHT) == self::FLOAT_RIGHT ) {
            $style .= 'float: right;"';
        }
        $style .= '"';

        // Render help icon
        $helpNodeId = $helpId . '_help';
        $output = '';
        $output .= '<div class="' . $imageSize . '" ' . $style . '>';
        $output .= '<div id="' . $helpNodeId . '" class="image-help"';

        // Show help as tooltip on mouseOver and do nothing on click
        $output .= ' onclick="require([\'clevis/help\'], function(help) { help.showHelpAsTooltip(\'' . $helpId . '\', \'' . $helpNodeId . '\'); });"';
        $output .= ' onmouseout="require([\'clevis/help\'], function(help) { help.hideTooltip(\'' . $helpNodeId . '\', true); });"';

        $output .= '></div></div>';

        return $output;
    }
}
