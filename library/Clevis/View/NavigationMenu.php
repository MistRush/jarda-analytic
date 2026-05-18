<?php

/**
 * Class that represents main menu
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_NavigationMenu extends Clevis_View_Item {

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
    public function & getNavigationItem() {
        return $this->navigationItem;
    }

    /**
     * RenderSubItem
     *
     * @return string
     */
    private function renderSubItem(Clevis_NavigationItem & $item) {

        $output = '';
        $output .= '<li>' . PHP_EOL;

        $children = $item->getChildren();
        if ( count($children) > 0 ) {
            $output .= '<a href="' . Clevis_Helper::formatUrl($item->getUrl()) . '" class="subbed">' . $item->getName() . '</a>' . PHP_EOL;
            $output .= '<ul>' . PHP_EOL;
            foreach ( $children as $child ) {
                $output .= Clevis_View_Code::indentHtmlCode($this->renderSubItem($child), 2) . PHP_EOL;
            }
            $output .= '</ul>' . PHP_EOL;

        } else {
            $output .= '<a href="' . Clevis_Helper::formatUrl($item->getUrl()) . '">' . $item->getName() . '</a>' . PHP_EOL;
        }

        $output .= '</li>' . PHP_EOL;
        return $output;
    }

    /**
     * RenderItem
     *
     * @return string
     */
    private function renderItem(Clevis_NavigationItem & $item) {

        $output = '';

        $children = $item->getChildren();

        if ( count($children) > 0 ) {
            $output .= '<div id="navigationMenu">' . PHP_EOL;
            $output .= '<ul class="navigationMenuTopParent">' . PHP_EOL;
            $output .= '<li><input type="button" value="' . $item->getName() . ' +" class="sub-button" />' . PHP_EOL;

            $output .= '<ul class="navigation" style="margin-top: 17px;">' . PHP_EOL;
            foreach ( $children as $child ) {
                $output .= $this->renderSubItem($child);
            }
            $output .= '</ul>' . PHP_EOL;
            $output .= '</li>' . PHP_EOL;
            $output .= '</ul>' . PHP_EOL;
            $output .= '</div>' . PHP_EOL;

        } else {
            // TODO: correct it
            //if ( $item->getUnitType() == null || $item->getUnitType() == Unit_Logic_Session::getUnitType() ) {
                $output .= '<a href="' . Clevis_Helper::formatUrl($item->getUrl()) . '"><input type="button" value="' . $item->getName() . '" class="sub-button" /></a>' . PHP_EOL;
            //}
        }

        return $output;
    }

    /**
     * Render MainMenu
     *
     * @return string
     */
    public function render() {
        $output = '';
        $items = $this->getNavigationItem()->getChildren();

        foreach ( $items as $item ) {
            $output .= $this->renderItem($item);
        }

        return $output;
    }

}
?>