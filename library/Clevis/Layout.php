<?php
use user\logic\UserAdminSession;

class Clevis_Layout {

    /**
     * Get application name
     *
     * @return string
     */
    public static function getApplicationName() {
        return Clevis_Navigation::getInstance()->getApplicationName();
    }

    /**
     * Get application short name
     *
     * @return string
     */
    public static function getApplicationShortName() {
        return Clevis_Navigation::getInstance()->getApplicationShortName();
    }

    /**
     * Get current navigation string
     *
     * @param Zend_View $view
     * @return string
     */
    public static function getApplicationTitle() {
        $logo = '';
        $logo .= Clevis_Layout::getApplicationName();
        $logo .= ' ';
        $logo .= Clevis_Version::getMajor();
        return $logo;
    }

    /**
     * Licence Owner Name
     *
     * @return string
     */
    public static function getLicenceOwnerName() {
        return Unit_Logic_Session::getCurrentUnitName();
    }

    /**
     * Is clevis layout should be rendered as full page size (stretching on resize)
     *
     * @param Zend_View $view
     * @return boolean
     */
    public static function isFullSize(Zend_View & $view) {
        return $view->fullSize;
    }

    /**
     * Render clevis layout page title (ie title tag in html)
     *
     * @param Zend_View $view
     * @return string
     */
    public static function renderTitle(Zend_View & $view) {
        $navigationItemName = '';
        $navigationItem = null;

        if ($navigationItem) {
            $navigationItemName = $navigationItem->getName();
        }

        return $navigationItemName . ' | Core';
    }

    /**
     * Render clevis layout header (ie part of content of header tag in html)
     *
     * @param Zend_View $view
     * @return string
     */
    public static function renderHeader(Zend_View & $view) {
        $output = '';

        // Base url
        $baseUrl = Zend_Controller_Front::getInstance()->getBaseUrl();
        // Dojo release
        $dojoDebug = Clevis_Helper::isDevelopmentEnvironment();

        // Base url for clevis
        if ($dojoDebug) {
            $baseUrlClevis = $baseUrl . '/clevis/src';
        } else {
            $baseUrlClevis = $baseUrl . '/clevis/release';
        }

        // Dojo styles
        echo '<style type="text/css">' . PHP_EOL;
        echo '<!--' . PHP_EOL;
        echo '    @import "' . $baseUrlClevis . '/dijit/themes/claro/claro.css";' . PHP_EOL;
        echo '    @import "' . $baseUrlClevis . '/dijit/themes/claro/document.css";' . PHP_EOL;
        echo '    @import "' . $baseUrlClevis . '/clevis/resources/clevis.css";' . PHP_EOL;
        echo '    @import "' . $baseUrlClevis . '/dojox/grid/resources/claroGrid.css";' . PHP_EOL;
        echo '    @import "' . $baseUrlClevis . '/dojox/form/resources/FileInput.css";' . PHP_EOL;
        echo '    @import "' . $baseUrlClevis . '/dojox/image/resources/Lightbox.css";' . PHP_EOL;
        echo '-->' . PHP_EOL;
        echo '</style>' . PHP_EOL;

        // Dojo config
        echo '<script type="text/javascript">' . PHP_EOL;
        echo '    var dojoConfig = {' . PHP_EOL;
        echo '        parseOnLoad: false,' . PHP_EOL;
        echo '        locale: "cs",' . PHP_EOL;
        echo '        baseUrl: "' . $baseUrlClevis . '/dojo/",' . PHP_EOL;
        echo '        packages: [{name: "clevis", location: "../clevis", main: "application"}, {name: "jqueryui", location: "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js", main: "jquery-ui-1.11.1"}]' . PHP_EOL;
        echo '    };' . PHP_EOL;
        echo '</script>' . PHP_EOL;

        // Dojo source
        if ($dojoDebug) {
            echo '<script type="text/javascript" data-dojo-config="async: true" src="' . $baseUrlClevis . '/dojo/dojo.js"></script>' . PHP_EOL;
        } else {
            echo '<script type="text/javascript" src="' . $baseUrlClevis . '/clevis/clevis.js"></script>' . PHP_EOL;
        }

        // Help setup and parse page
        echo '<script type="text/javascript">' . PHP_EOL;
        echo 'require(["dojo/ready", "clevis", "clevis/help"], function(ready, application, help){' . PHP_EOL;
        if (UserAdminSession::getCurrentUserType() == 'admin') {
            echo '    help.editable = true;' . PHP_EOL;
        }
        echo '    application.url = "' . $baseUrl . '";' . PHP_EOL;
        echo '});' . PHP_EOL;
        echo '</script>' . PHP_EOL;

        return $output;
    }

    /**
     * Render clevis layout header (ie part of content of header tag in html)
     *
     * @param Zend_View $view
     * @return string
     */
    public static function renderFooter(Zend_View & $view) {
        $output = '';
        $output .= '<script type="text/javascript">' . PHP_EOL;
        $output .= 'require(["dojo/parser", "clevis/ready", "clevis/View", "dojo/domReady!"], function(parser, ready) {' . PHP_EOL;
        $output .= '   console.debug("DOJO PARSING"); parser.parse(); console.debug("DOJO PARSING FINISHED");' . PHP_EOL;
        $output .= '   ready.performReady();' . PHP_EOL;
        $output .= '});' . PHP_EOL;
        $output .= '</script>' . PHP_EOL;
        return $output;
    }

    /**
     * Header menu icons
     *
     * @var array
     */
    private static $headerMenuIcons = array();

    /**
     * Add header menu icon
     *
     * @param $id
     * @param $image
     * @param $tooltip
     * @param $onClick
     * @param Clevis_View_Item $itemToRender
     * @return void
     */
    public static function addHeaderMenuIcon($id, $image, $tooltip, $onClick, Clevis_View_Item $itemToRender = null) {
        self::$headerMenuIcons[] = array(
            'id' => $id,
            'image' => $image,
            'tooltip' => $tooltip,
            'onClick' => $onClick,
            'itemToRender' => $itemToRender
        );
    }

    /**
     * Render view extra code (some additional preRender for view)
     *
     * @return string
     */
    public static function renderViewPrepare(Clevis_View $view) {
        $zendView = $view->getZendView();
        if ($zendView->layout == 'login') {
            return;
        }

        // TODO: dojo: opravit
        return;

        $output = '';
        foreach (self::$headerMenuIcons as $icon) {
            $item = $icon['itemToRender'];
            $item->setParent($view);
            $output .= $item->preRender();
            $output .= $item->render();
        }
        return $output;
    }

    public static function renderGuardIcon() {
        // guard icon
        $output = '<div class="clevis-layout-guard ' . Clevis_Image::ICON_NORMAL . '">';
        $output .= '    <div class="clevis-layout-guard-icon image-guard" onClick="window.location.href = \'' . Zend_Controller_Front::getInstance()->getBaseUrl() . '/guard/index/index/\'" onMouseOver="dijit.showTooltip(\'Události systému\', this, [\'below\']);" onMouseOut="dijit.hideTooltip(dojo.byId(this));"></div>' . PHP_EOL;
        $output .= '</div>';
        return $output;
    }

    public static function renderSearchIcon() {

        // setup
        $id = 'main_search';

        // Render events
        $content = '<h1>Vyhledávání v systému</h1>';
        $content .= '<form action=\"' . Zend_Controller_Front::getInstance()->getBaseUrl() . '/default/index/search/\" method=\"post\" id=\"SearchForm\" name=\"SearchForm\">';
        $content .= '<label style=\"font-weight:bold;\">Hledaný výraz: </label>';
        $content .= '<input name=\"SearchTerm\" class=\"clevis-view-form-item\" dojoType=\"dijit.form.ValidationTextBox\" />';
        $content .= '<button name=\"ok\" dojoType=\"clevis.view.form.Button\" iconClass=\"image-search\" onclick=\"document.SearchForm.submit();\">Vyhledat</button>';
        $content .= '</form>';

        // search icon
        $output = '<div class="clevis-layout-search ' . Clevis_Image::ICON_NORMAL . '">';
        $output .= '    <div class="clevis-layout-search-icon image-search"  onMouseOver="showSearch(this)"></div>' . PHP_EOL;

        $output .= '<script type="text/javascript">' . PHP_EOL;
        $output .= 'var dialog_search = null;' . PHP_EOL;
        $output .= 'require(["clevis/ready!"], function() {' . PHP_EOL;
        $output .= 'dialog_search = new dijit.TooltipDialog({' . PHP_EOL;
        $output .= 'content: "' . $content . '",' . PHP_EOL;
        $output .= 'style: "width: 400px;"' . PHP_EOL;
        $output .= '});' . PHP_EOL;
        $output .= 'dojo.connect(dialog_search, "onMouseLeave", function() {' . PHP_EOL;
        $output .= 'dijit.popup.close(dialog_search);' . PHP_EOL;
        $output .= '});' . PHP_EOL;
        $output .= '});' . PHP_EOL;
        $output .= 'function showSearch(node) {' . PHP_EOL;
        $output .= 'dijit.popup.open({ popup: dialog_search, around: dojo.byId(node) });' . PHP_EOL;
        $output .= '}' . PHP_EOL;
        $output .= '</script>' . PHP_EOL;

        $output .= '</div>';
        return $output;
    }

    /**
     * Render top breadcrumb menu
     *
     * @return string
     */
    public static function renderHeaderBreadcrumb() {
        $output = '';

        // Create breadcrumb
        $breadcrumb = new Clevis_View_Breadcrumb();
        // Fill it with current items
        $items = Clevis_Navigation::getInstance()->getNestingItemsForCurrentUrl();

        foreach ($items as &$item) {
            $breadcrumb->addBreadcrumbItem($item['name'], $item['code'], $item['url']);
        }
        // Render breadcrumb
        $output .= $breadcrumb->render();

        /*        // Get navigation
          $navigation = Clevis_Navigation::getInstance();
          // Render quick items
          $output .= '<div style="padding-top: 4px; float: right;">';
          foreach ( array_reverse($navigation->getChildren()) as $navigationItem ) {
          if ( $navigationItem->getQuick() == Clevis_NavigationItem::QUICK_LINK ) {
          $output .= self::renderQuickNavigationItem($navigationItem);
          } else if ( $navigationItem->getQuick() == Clevis_NavigationItem::QUICK_MENU ) {
          $output .= self::renderQuickNavigationItemMenu($navigationItem);
          }
          }
          $output .= '</div>'; */

        return $output;
    }

    /**
     * Render top breadcrumb menu
     *
     * @return string
     */
    public static function renderHeaderMenu() {
        $output = '';

        // Render help icon
        $item = Clevis_Navigation::getInstance()->getItemForCurrentUrl();
        $itemId = null;
        if ($item) {
            $itemId = 'view(' . $item->getCode() . ')';
        }
        $output = '<div class="header-menu-icons ' . Clevis_Image::ICON_NORMAL . '" style="margin-top: -3px; margin-right: -1px;">';
        $output .= Clevis_Help::renderHelpImage($itemId, Clevis_Image::ICON_NORMAL, Clevis_Help::FLOAT_RIGHT);
        $output .= '</div>';

        // Render navigation items
        $output .= '<div class="site-header-navigation-item" onMouseOver="window.showUserInfo(this)">';
        $output .= '<div class="clevis-image-icon-small" style="float: left; margin-right: 3px;"><div class="image-user"></div></div>';
        $output .= UserAdminSession::getCurrentUserName();
        ;
        $output .= '<script type="text/javascript">';
        $output .= 'require(["dojo/mouse", "dojo/on", "dijit/popup", "dijit/TooltipDialog", "dojo/domReady!"], function(mouse, on, popup, TooltipDialog){';
        $output .= ' window.dialog_userInfo = new TooltipDialog({';
        $output .= '  href: "' . Clevis_Helper::formatUrl(array('module' => 'common', 'controller' => 'common', 'action' => 'user-info')) . '",';
        $output .= '  style: "width: 350px;"';
        $output .= ' });';
        $output .= ' window.showUserInfo = function(node) {';
        $output .= '  popup.open({popup: window.dialog_userInfo, around: dojo.byId(node)});';
        $output .= ' };';
        $output .= ' on(window.dialog_userInfo.domNode, mouse.leave, function() {';
        $output .= '  popup.close(window.dialog_userInfo);';
        $output .= ' });';
        $output .= '});';
        $output .= '</script>';
        $output .= '</div>';

        $output .= '<div class="site-header-navigation-item">';
        $output .= Unit_Logic_Session::getCurrentUnitFullName();
        ;
        $output .= '[<a href="' . Clevis_Helper::formatUrl(array('module' => 'unit', 'controller' => 'unit-select', 'action' => 'reset')) . '" onMouseOver="window.showUnitSelect(this)">Změnit</a>]';
        $output .= '<script type="text/javascript">';
        $output .= 'require(["dojo/on", "dojo/mouse", "dijit/popup", "dijit/TooltipDialog", "dojo/domReady!"], function(on, mouse, popup, TooltipDialog){';
        $output .= ' window.dialog_unitSelect = new TooltipDialog({';
        $output .= '  href: "' . Clevis_Helper::formatUrl(array('module' => 'common', 'controller' => 'common', 'action' => 'unit-select')) . '",';
        $output .= '  style: "width: 400px;"';
        $output .= ' });';
        $output .= ' window.showUnitSelect = function(node) {';
        $output .= '  popup.open({popup: window.dialog_unitSelect, around: dojo.byId(node)});';
        $output .= ' };';
        $output .= ' on(window.dialog_unitSelect.domNode, mouse.leave, function() {';
        $output .= '  popup.close(window.dialog_unitSelect);';
        $output .= ' });';
        $output .= '});';
        $output .= '</script>';
        $output .= '</div>';

        $output .= '<div class="site-header-navigation-icon">';
        $output .= '<div class="clevis-image-icon-mini"><div class="image-phone-contacts" onMouseOver="window.showPhoneContacts(this)"></div></div>';
        $output .= '<script type="text/javascript">';
        $output .= 'require(["dojo/on", "dojo/mouse", "dijit/popup", "dijit/TooltipDialog", "dojo/domReady!"], function(on, mouse, popup, TooltipDialog){';
        $output .= ' window.dialog_phoneContacts = new TooltipDialog({';
        $output .= '  href: "' . Clevis_Helper::formatUrl(array('module' => 'common', 'controller' => 'common', 'action' => 'contacts')) . '",';
        $output .= '  style: "width: 600px;"';
        $output .= ' });';
        $output .= ' window.showPhoneContacts = function(node) {';
        $output .= '  popup.open({popup: window.dialog_phoneContacts, around: dojo.byId(node)});';
        $output .= ' };';
        $output .= ' on(window.dialog_phoneContacts.domNode, mouse.leave, function() {';
        $output .= '  popup.close(window.dialog_phoneContacts);';
        $output .= ' });';
        $output .= '});';
        $output .= '</script>';
        $output .= '</div>';

        $output .= '<div class="site-header-navigation-icon">';
        $output .= '<div class="clevis-image-icon-mini"><div class="image-sitemap" onMouseOver="window.showSitemap(this)"></div></div>';
        $output .= '<script type="text/javascript">';
        $output .= 'require(["dojo/on", "dojo/mouse", "dijit/popup", "dijit/TooltipDialog", "dojo/domReady!"], function(on, mouse, popup, TooltipDialog){';
        $output .= ' window.dialog_sitemap = new TooltipDialog({';
        $output .= '  href: "' . Clevis_Helper::formatUrl(array('module' => 'common', 'controller' => 'common', 'action' => 'sitemap')) . '",';
        $output .= '  style: "width: 730px;"';
        $output .= ' });';
        $output .= ' window.showSitemap = function(node) {';
        $output .= '  popup.open({popup: window.dialog_sitemap, around: dojo.byId(node)});';
        $output .= ' };';
        $output .= ' on(window.dialog_sitemap.domNode, mouse.leave, function() {';
        $output .= '  popup.close(window.dialog_sitemap);';
        $output .= ' });';
        $output .= '});';
        $output .= '</script>';
        $output .= '</div>';

        $output .= '<div class="site-header-navigation-icon-separator">|</div>';

        // Add icons to title
        $output .= '<div class="header-menu-icons ' . Clevis_Image::ICON_NORMAL . '" style="margin-top: -3px; margin-right: -3px;">';
        /*
          foreach ( self::$headerMenuIcons as $icon ) {
          $id = $icon['id'];
          $output .= '<div id="' . $id . '" class="header-menu-icon ' . $icon['image'] . '"' .
          ' onmouseover="dijit.showTooltip(\'' . $icon['tooltip'] . '\', dojo.byId(\'' . $id . '\'));"' .
          ' onmouseout="dijit.hideTooltip(dojo.byId(\'' . $id . '\'));"' .
          ' onclick="dijit.hideTooltip(dojo.byId(\'' . $id . '\')); ' . $icon['onClick'] . '"' .
          '></div>';
          } */

        // vyhledavani
        $content = '<div style="height: 28px; float: right; margin-left: 5px; margin-right: -5px; margin-top: -2px;">';
        $content .= '<form action="' . Zend_Controller_Front::getInstance()->getBaseUrl() . '/default/index/search/" method="post" id="SearchForm" name="SearchForm">';
        $content .= '<input placeHolder="Zadejte hledaný výraz!" name="SearchTerm" class="clevis-view-form-item" dojoType="dijit.form.ValidationTextBox" style="width: 160px; margin-top: 4px; margin-right: -2px;" />';
        $content .= '<fieldset class="clevis-view-actionSet clevis-image-icon-small" style="display: inline-block; float: right; background: none; margin-top: -5px; border: none;">';
        $content .= '<button name="searchButton" dojoType="clevis.view.form.Button" iconClass="image-search" onclick="document.SearchForm.submit();"></button>';
        $content .= '</fieldset>';
        $content .= '</form>';
        $content .= '</div>';
        $output .= $content;

        // TODO: Martin: Pridat ikonky do panelu vpravo nahore
        if (Unit_Logic_Session::isCurrentUnit())
            $output .= self::renderGuardIcon();

        // task icon
        $output .= '<div style="float: right;" class="header-menu-icon image-task" onMouseOver="dijit.showTooltip(\'Úkoly systému\', this, [\'below\']);" onMouseOut="dijit.hideTooltip(dojo.byId(this));" onClick="window.location.href = \'' . Zend_Controller_Front::getInstance()->getBaseUrl() . '/task/task/index\'"></div>' . PHP_EOL;
        $output .= '</div>';

        return $output;
    }

    /**
     * Render quick navigation item
     *
     * @param Clevis_NavigationItem $item
     * @return string
     */
    public static function renderQuickNavigationItem(Clevis_NavigationItem $item) {
        $id = 'quick_navigation_' . str_replace('-', '_', $item->getCode());
        $url = $item->getUrl();
        $name = $item->getName();
        $image = $item->getImage();

        $output = '';
        $output .= '<div class="site-header-navigation-icon">';
        $output .= '<div class="clevis-image-icon-mini">';
        $output .= '<div id="' . $id . '" class="' . $image . '" style="height: 24px;" onClick="window.location.href = \'' . $url . '\'">';
        $output .= '<script>';
        $output .= 'require(["dijit/Tooltip",  "dojo/domReady!"], function(Tooltip){';
        $output .= 'var tooltip = new Tooltip({label: "' . $name . '", connectId: "' . $id . '"});';
        $output .= '});';
        $output .= '</script>';
        $output .= '</div>';
        $output .= '</div>';
        $output .= '</div>';
        return $output;
    }

    /**
     * Render quick navigation item
     *
     * @param Clevis_NavigationItem $item
     * @return string
     */
    public static function renderQuickNavigationItemMenu(Clevis_NavigationItem $item) {
        $id = 'quick_navigation_' . str_replace('-', '_', $item->getCode());
        $url = $item->getUrl();
        $name = $item->getName();
        $image = $item->getImage();

        $content = '<a href="' . $url . '">' . $item->getName() . '</a>:<ul style="margin: 0px; padding-left: 20px; padding-top: 5px;">';
        foreach ($item->getChildren() as $child) {
            $content .= '<li><a href="' . $child->getUrl() . '">' . $child->getName() . '</a></li>';
        }
        $content .= '</ul>';

        $output = '';
        $output .= '<div class="site-header-navigation-icon">';
        $output .= '<div class="clevis-image-icon-mini"><div id="' . $id . '" class="' . $image . '"></div></div>';
        $output .= '<script>';
        $output .= 'require(["dojo/on", "dojo/mouse", "dijit/popup", "dijit/Tooltip", "dijit/TooltipDialog", "dojo/domReady!"], function(on, mouse, popup, Tooltip, TooltipDialog){';
        $output .= ' var dialog = new TooltipDialog({content: \'' . $content . '\'});';
        $output .= ' dialog.close = function(delayed) {';
        $output .= '  if ( delayed == true ) { var performClose = {do: true}; dialog.performClose = performClose; setTimeout(function(){ if ( performClose.do ) dialog.close(); }, 1000); return; }';
        $output .= '  popup.close(this);';
        $output .= ' };';
        $output .= ' on(dojo.byId("' . $id . '"), mouse.enter, function() { popup.open({popup: dialog, around: this}); });';
        $output .= ' on(dojo.byId("' . $id . '"), mouse.leave, function() { dialog.close(true); });';
        $output .= ' on(dialog.domNode, mouse.enter, function() { dialog.performClose.do = false; });';
        $output .= ' on(dialog.domNode, mouse.leave, function() { dialog.close(); });';
        $output .= '});';
        $output .= '</script>';
        $output .= '</div>';
        return $output;
    }

    /**
     * Render bottom of clevis layout
     *
     * @return string
     */
    public static function renderBottom() {
        $output = '';
        //$output .= self::getApplicationName();
        //$output .= ' ' . Clevis_Version::getVersion();
        //$output .= ', Databáze ' . Clevis_Helper::getDoctrineDatabaseVersion();
        $output .= Clevis_Timer::render();
        return $output;
    }

    /** Layout End */
    private static $end = null;

    /**
     * Set layout end
     *
     * @param string $end
     */
    public static function setEnd($end) {
        self::$end = $end;
    }

    /**
     * Get layout end
     *
     * @param string $end
     */
    public static function & getEnd() {
        return self::$end;
    }

    /**
     * Render layout end
     */
    public static function renderEnd() {
        if (self::$end != null) {
            $bottom = Clevis_Layout::renderBottom();
            echo str_replace("[bottom]", $bottom, self::$end);
        }
    }

}

?>