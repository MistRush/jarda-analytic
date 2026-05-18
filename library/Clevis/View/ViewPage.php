<?php

/**
 * Class for rendering view
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_ViewPage extends Clevis_View {

    /**
     * Render title
     *
     * @var boolean
     */
    private $renderTitle = true;

    /**
     * Constructor
     *
     * @param $name Page code name
     * @param $title Page title
     */
    public function __construct($name = null, $title = null, $permission = null, $renderTitle = true) {
        parent::__construct($name);

        // View style
        $this->setPageFullSize(true);
        $this->setStyleFullHeight();

        $layout = $this->addLayout();
        $layout->setName($this->getName());
        $layout->setImplicitPadding(false);

        // Get current navigation item
        $navigationItem = Default_Logic_Navigation::getInstance()->getItemForCurrentUrl();
        if ($navigationItem == null) {
            throw new Exception('Tato stánka není k dispozici nebo k ní aktuální uživatel nemá přístup!');
        }

        // Get permission from navigation
        if ($permission == null)
            $permission = $navigationItem->getPermission();

        // Set permission
        if ($permission != null)
            $this->setPermission($permission);

        // Get item name
        $name = $navigationItem->getName();
        if ($title != null) {
            $name = $title;
        }
        if ($this->hasName() == false) {
            $this->setName($navigationItem->getCode());
        }

        // Module content
        $content = new Clevis_View_Panel();
        $content->setName('content');
        $content->setStyleFullHeight();
        $content->setParent($layout);
        $this->appendContent($content);
        if ($content->isEmpty() == false) {
            $panelLeft = $layout->addPanel(Clevis_View_Layout::POSITION_LEFT);
            $panelLeft->setStyleWidth(240);
            $panelLeft->setStyle('min-width', '240');
            $panelLeft->setStyle('margin-right', '5px');
            $panelLeft->setStyle('background-color', '#003e6a');
            $panelLeft->setStyle('padding-top', '10px');            
            $panelLeft->setId('panelSitemap');
            $panelLeft->addCode($this->renderLeftMenu());

            $panelCenter = $layout->addPanel(Clevis_View_Layout::POSITION_CENTER);
            $panelCenterLayout = $panelCenter->addLayout();

            // Add title
            if ($renderTitle) {
                $panelCenterTop = $panelCenterLayout->addPanel(Clevis_View_Layout::POSITION_TOP);
                $panelCenterTop->setName('top');
                $panelCenterTop->setStyleHeight(43);
                $panelCenterTopContent = self::renderTitle($name, $navigationItem, $panelCenterTop);
                $this->appendTitle($panelCenterTopContent);

                self::renderTitleMenu($navigationItem, $panelCenterTopContent, false);
            } else {
                $panelCenterTop = $panelCenterLayout->addPanel(Clevis_View_Layout::POSITION_TOP);
                $panelCenterTop->setStyleHeight(5);
            }

            $panelCenterBottom = $panelCenterLayout->addPanel(Clevis_View_Layout::POSITION_CENTER);
            $panelCenterBottom->setStyleHeight('auto');
            $panelCenterBottom->addItem($content, Clevis_View_Layout::POSITION_CENTER, true);
        }

        // Module header
        $header = new Clevis_View_Panel();
        $header->setName('header');
        $header->setParent($layout);
        $this->appendHeader($header);
        if ($header->isEmpty() == false)
            $layout->addItem($header, Clevis_View_Layout::POSITION_TOP, true);

        // Module footer
        $footer = new Clevis_View_Panel();
        $footer->setName('footer');
        $footer->setParent($layout);
        $this->appendFooter($footer);
        if ($footer->isEmpty() == false)
            $layout->addItem($footer, Clevis_View_Layout::POSITION_BOTTOM, true);
    }

    /**
     * Set renderTitle
     *
     * @param string $renderTitle
     * @return void
     */
    public function setRenderTitle($renderTitle) {
        $this->renderTitle = $renderTitle;
    }

    /**
     * Get item renderTitle
     *
     * @return $nrenderTitle
     */
    public function getRenderTitle() {
        return $this->renderTitle;
    }

    /**
     * Append to title
     */
    protected function appendTitle(Clevis_View_Container & $title) {

    }

    /**
     * Append to header
     */
    protected function appendHeader(Clevis_View_Container & $header) {

    }

    /**
     * Append to content
     */
    protected function appendContent(Clevis_View_Container & $content) {

    }

    /**
     * Append to footer
     */
    protected function appendFooter(Clevis_View_Container & $footer) {

    }

    /**
     * Render page title
     *
     * @param strin name
     * @param Clevis_NavigationItem $navigationItem
     * @param Clevis_View_Container $container
     * @return Clevis_View_Container
     */
    public static function renderTitle($name, Clevis_NavigationItem $navigationItem, Clevis_View_Container $container) {
        $panelTopContent = $container->addElementDiv();
        $panelTopContent->setClass('clevis-view-page-title');
        $panelTopContent->setVerticalAlign(ALIGN_MIDDLE, 'clevis-view-page-title-item');
        $panelTopContent->addImage($navigationItem->getImage(), Clevis_Image::ICON_NORMAL);
        $panelTopContent->addElement('h1', $name);

        return $panelTopContent;
    }

    /**
     * Render Left Menu
     *
     * @return string $output
     */
    public static function renderLeftMenu() {
        $item = Clevis_Navigation::getInstance();
        $siteArray[] = self::addToArray($item);

        $output = '';
        $ignoreItems = array('information');

        foreach ($siteArray[0]['children'] as $item) {
            if (in_array($item['Code'], $ignoreItems) )
                    continue;
            
            $hasChildren = array_key_exists('children', $item);

            $output .= '<div class="clear_fix menu-item menu-item-' . $item['Code'] . '">';
            $output .= '<a href="' . $item['Url'] . '">';
            $output .= '<div class="icon-wrapper" onMouseOver="dijit.showTooltip(\'' . $item['Name'] . '\',this, [\'below\'])" onMouseOut="dijit.hideTooltip(dojo.byId(this));">' . Clevis_Image::render($item['Image'], Clevis_Image::ICON_MENU) . '</div>';
            $output .= '</a>';
            $output .= '<div class="name-wrapper">';
            $output .= '<div class="name">';
            $output .= '<a href="' . $item['Url'] . '">';
            $output .= $item['Name'];
            $output .= '</a>';

            /*if ($hasChildren)
                $output .= '<div class="menu-toggler" style="color: white; font-size: 14px; cursor: pointer; font-weight: bold; float: right; margin-right: -25px;">+</div>';*/

            $output .= '</div>';

            if ($hasChildren) {
                $childrenOutput = '';
                $childrenOutput .= '<div class="menu-toggler-content" id="navig-' . $item['Code'] . '">';

                foreach ($item['children'] as $children) {
                    $childrenOutput .= '<a href="' . $children['Url'] . '">' . $children['Name'] . '</a>';
                }

                $childrenOutput .= '</div>';
                $output .= $childrenOutput;
            }
            $output .= '</div>';

            $output .= '</div>';
        }

        $output .= '<script>';


        $output .= '    function toggleText(a, b){';
        $output .= '        var that = this;';
        $output .= '            if (that.text() != a && that.text() != b){';
        $output .= '                that.text(a);';
        $output .= '            }';
        $output .= '            else';
        $output .= '            if (that.text() == a){';
        $output .= '                that.text(b);';
        $output .= '            }';
        $output .= '            else';
        $output .= '            if (that.text() == b){';
        $output .= '                that.text(a);';
        $output .= '            }';
        $output .= '        return this;';
        $output .= '    }';


        $output .= '</script>';

        return $output;
    }

    public static function addToArray($item) {
        $arrayItem = array();
        $arrayItem['Name'] = $item->getName();
        $arrayItem['Code'] = $item->getCode();
        $arrayItem['Url'] = $item->getUrl();
        $arrayItem['Image'] = $item->getImage();
        $arrayItem['Description'] = $item->getDescription();

        $children = $item->getChildren();
        if (count($children) > 0) {
            foreach ($children as $child) {
                $arrayItem['children'][] = self::addToArray($child);
            }
        }

        return $arrayItem;
    }

}

?>