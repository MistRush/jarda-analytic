<?php

/**
 * Class that represents breadcrumb
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Breadcrumb {

    /**
     * Array of breadcrumb items
     *
     * @var array
     */
    private $breadcrumbItems = array();

    /**
     * Add action
     *
     * @param string $name
     * @param string $url
     */
    public function addBreadcrumbItem($name, $url = null) {
        $this->breadcrumbItems[] = array('name' => $name, 'url' => $url);
    }

    /**
     * Render placeholder
     *
     * @return string
     */
    public function render() {
        $output = '';
        foreach ($this->breadcrumbItems as $breadcrumbItem) {
            if (strlen($output) > 0)
                $output .= '<div class="header-menu-breadcrumb-separator"></div>';

            $output .= '<div class="header-menu-breadcrumb-item">';
            if ($breadcrumbItem['url'] != null) {
                $output .= '<a href="' . $breadcrumbItem['url'] . '">' . $breadcrumbItem['name'] . '</a>';
            } else {
                $output .= ' ' . $breadcrumbItem['name'];
            }
            $output .= '</div>';
        }
        $output = '<div class="header-menu-breadcrumb">' . $output . '</div>';

        return $output;
    }

}

?>