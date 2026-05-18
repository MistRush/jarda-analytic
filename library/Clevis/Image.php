<?php

/**
 * Description of Image
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Image {

    /** 8x8 Icon */
    const ICON_MINI = 'clevis-image-icon-mini';

    /** 16x16 Icon */
    const ICON_SMALL = 'clevis-image-icon-small';

    /** 32x32 Icon */
    const ICON_NORMAL = 'clevis-image-icon-normal';

    /** 71x71 BW Icon */
    const ICON_BW = 'clevis-image-icon-bw';

    /** 71x71 Color Icon */
    const ICON_COLOR = 'clevis-image-icon-color';

    /** Big picture */
    const PICTURE = 'clevis-image-picture';

    /** Icon menu */
    const ICON_MENU = 'clevis-image-icon-menu';

    /**
     *
     * @param string $image
     * @param enum $type (ICON | PICTURE)
     * @param array $style
     * @return string
     */
    public static function render($image, $type, $class = null) {
        // Prepare class
        if ($class != null)
            $class = ' ' . $class;
        else
            $class = '';

        $output = '';
        $output .= '<div class="' . $type . $class . '">';
        $output .= '<div class="' . $image . '"></div>';
        $output .= '</div>';
        return $output;
    }

}

?>