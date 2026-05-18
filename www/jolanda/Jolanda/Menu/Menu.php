<?php
namespace Jolanda\Menu;

use Zend_Controller_Request_Abstract;

/**
 * Class Menu
 * @package Jolanda\menu
 */
class Menu {

    /**
     * Pole položek 1. úrovně
     * @var array[MenuItem]
     */
    private $menu_items = [];

    /**
     * Pole všech položek menu
     * @var array[MenuItem]
     */
    public $items_list = [];

    /**
     * Pole všech URL pro kontrolu přístupu
     * @var array
     */
    private $acl = [];

    /**
     * Výchozí modul
     * @var string
     */
    private $module = 'default';

    /**
     * Instance
     * @var Menu
     */
    private static $instance;

    /**
     * Zobrazit vyhledávání v menu
     * @var bool
     */
    private bool $searchVisible = true;

    /**
     * Zobrazit hlavní stránku v menu
     * @var bool
     */
    private bool $homepageVisible = true;

    /**
     * @return static
     */
    public static function getInstance(): self {
        if (!isset(self::$instance))
            self::$instance = new self();

        return self::$instance;
    }

    /**
     * @param string $id
     * @param string $name
     * @param string|null $url
     * @param string|null $icon
     * @param string|null $description
     * @return MenuItem
     */
    public function addItem(string $id, string $name, ?string $url, ?string $icon = null, ?string $description = null): MenuItem {
        $item = new MenuItem($id, $name, $url, $icon, $description, true, $this);
        $this->menu_items[] = $item;
        $this->items_list[] = $item;

        return $item;
    }

    /**
     * Přidá novou skrytou položku do 1. úrovně menu
     *
     * @param string $id               ID položky
     * @param string $name             Název/text položky
     * @param string $url              URL
     * @param string|null $description Popisek
     *
     * @return MenuItem
     */
    public function addHidden(string $id, string $name, string $url, ?string $description = null): MenuItem {
        $item = new MenuItem($id, $name, $url, $description, null, false, $this);
        $this->menu_items[] = $item;
        $this->items_list[] = $item;

        return $item;
    }

    /**
     * Sestaví seznam přístupných položek pro uživatele
     */
    public function buildAcl(): void {
        foreach ($this->items_list as $item) {
            $this->acl[] = $item->getUrl();
        }
    }

    /**
     * Kontrola oprávněného přístupu k akci
     *
     * @param Zend_Controller_Request_Abstract $request
     *
     * @return bool
     */
    public function isAuthorized(Zend_Controller_Request_Abstract $request): bool {
        return in_array($request->getModuleName().'/'.$request->getControllerName().'/'.$request->getActionName(), $this->acl);
    }

    /**
     * Prohledává rekurzivně položky menu
     *
     * @param $toBeSearchedArray
     * @param $searchValue
     * @param $exactPath
     *
     * @return bool
     */
    private function get_from_array($toBeSearchedArray, $searchValue, &$exactPath) {
        foreach ($toBeSearchedArray as $item) {
            if (!empty($item->getChildren())) {
                if ($this->get_from_array($item->getChildren(), $searchValue, $exactPath)) {
                    $exactPath[] = $item;

                    return true;
                }
            }
            if ($item->getUrl() == $searchValue) {
                $exactPath[] = $item;

                return true;
            }
        }
    }

    /**
     * Vrací celou cestu k položce menu dle requestu
     *
     * @param Zend_Controller_Request_Abstract $request
     *
     * @return array
     */
    public function getPath(Zend_Controller_Request_Abstract $request): array {
        $result = [];
        $this->get_from_array($this->menu_items, "{$request->getModuleName()}/{$request->getControllerName()}/{$request->getActionName()}", $result);

        return $result;
    }

    /**
     * Vrací celou cestu k položce menu dle ID prvku
     *
     * @param string $item_id ID položky
     *
     * @return array
     */
    public function getPathById(string $item_id): array {
        $result = [];
        $this->get_from_array($this->menu_items, $this->getItemById($item_id)->getUrl(), $result);

        return $result;
    }

    /**
     * Vrací celou cestu k položce menu dle URL prvku
     *
     * @param string $url URL položky
     *
     * @return array
     */
    public function getPathByUrl(string $url): array {
        $result = [];
        $this->get_from_array($this->menu_items, $url, $result);

        return $result;
    }

    /**
     * Vrací položku menu dle ID
     *
     * @param string $ID ID položky
     *
     * @return MenuItem|null
     */
    public function getItemById(string $ID): ?MenuItem {
        foreach ($this->items_list as $item) {
            if ($item->getId() == $ID)
                return $item;
        }

        return null;
    }

    /**
     * Vrací celou cestu k položce menu dle kontroleru a akce
     *
     * @param string $controller Název kontroleru
     * @param string $action     Název akce
     *
     * @return array
     */
    public function search(string $controller, string $action): array {
        $result = [];
        $this->get_from_array($this->menu_items, "{$controller}/{$action}", $result);

        return $result;
    }

    /**
     * Vrací položky menu
     * @return array
     */
    public function getMenu(): array {
        return $this->menu_items;
    }

    /**
     * Vrací položky menu
     * @return array
     */
    public function getChildren() :array {
        return $this->menu_items;
    }

    /**
     * Nastavuje výchozí modul
     * @param string $module
     */
    public function setModule(string $module) {
        $this->module = $module;
    }

    /**
     * @return string
     */
    public function getModule(): string {
        return $this->module;
    }

    /**
     * @param bool $searchVisible
     *
     * @return static
     */
    public function setSearchVisible(bool $searchVisible = true): static
    {
        $this->searchVisible = $searchVisible;

        return $this;
    }

    /**
     * @param bool $homepageVisible
     *
     * @return static
     */
    public function setHomepageVisible(bool $homepageVisible = true): static
    {
        $this->homepageVisible = $homepageVisible;

        return $this;
    }

    /**
     * @return bool
     */
    public function isSearchVisible(): bool
    {
        return $this->searchVisible;
    }

    /**
     * @return bool
     */
    public function isHomepageVisible(): bool
    {
        return $this->homepageVisible;
    }

    public function getAcl(){
        return $this->acl;
    }

    public function toArray($onlyVisible = false)
    {
        $items = [];
        foreach ($this->menu_items as $item) {
            if(in_array($item->getURL(), $this->getAcl())){
                $i = $item->toArray($onlyVisible);
                if($i){
                    $items[] = $i;
                }
            }
        }

        $array = [
            'menuItems' => $items,
            'searchVisible' => $this->searchVisible,
            'homepageVisible' => $this->homepageVisible,
        ];

        return $array;
    }

    public function checkUniqueId($id){
        foreach ($this->items_list as $item) {
            if ($item->getId() === $id) {
                throw new \Exception('Menu ID [' . $id . '] already exists. ID must be unique.');
            }
        }
    }
}