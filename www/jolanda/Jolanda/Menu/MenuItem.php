<?php

namespace Jolanda\Menu;

/**
 * Class MenuItem
 * @package Jolanda\menu
 */
class MenuItem {

    /**
     * ID položky
     * @var string
     */
    private $id = '';

    /**
     * Název/text položky
     * @var string
     */
    private $name = '';

    /**
     * URL položky
     * @var string
     */
    private $URL = '';

    /**
     * Ikona položky
     * @var string
     */
    private $icon = null;

    /**
     * Potomci
     * @var array[MenuItem]
     */
    private $children = [];

    /**
     * Viditelnost
     * @var bool
     */
    private $visible = true;

    /**
     * Položka první úrovně
     * @var Menu
     */
    private $menu;

    /**
     * Popisek
     * @var string
     */
    private $description;

    /**
     * Hodnota ve štítku
     * @var string|null
     */
    private $badge = null;

    private array $tags = [];

    private array $developers = [];
    private array $responsiblePersons = [];

    /**
     * MenuItem constructor.
     *
     * @param string $id               ID položky
     * @param string $name             Název/text položky
     * @param string $URL              URL
     * @param string|null $icon        Ikona
     * @param string|null $description Popisek
     * @param bool $visible            Viditelnost
     * @param Menu|null $menu          Menu 1. úrovně
     */
    public function __construct(string $id, string $name, ?string $URL, string $icon = null, $description = null, bool $visible = true, $menu = null) {
        $this->id = $id;
        $this->name = $name;
        if ($URL == null)
            $this->URL = $menu->getModule() . '/menu/index?id=' . $id;
        else
            $this->URL = $URL;
        $this->icon = $icon;
        $this->visible = $visible;
        $this->menu = $menu;
        $this->description = $description;

        $this->menu->checkUniqueId($id);
    }

    /**
     * Vrací ID položky
     * @return string
     */
    public function getId(): string {
        return $this->id;
    }

    /**
     * Nastavuje ID položky
     *
     * @param string $id
     */
    public function setId(string $id): void {
        $this->id = $id;
    }

    /**
     * Vrací název/text položky
     * @return string
     */
    public function getName(): string {
        return $this->name;
    }

    /**
     * Nastavuje název/text položky
     *
     * @param string $name
     */
    public function setName(string $name): void {
        $this->name = $name;
    }

    /**
     * Vrací URL položky
     * @return string
     */
    public function getURL(): string {
        return $this->URL;
    }

    /**
     * Nastavuje URL položky
     *
     * @param string $URL
     */
    public function setURL(string $URL): void {
        $this->URL = $URL;
    }

    /**
     * Vrací ikonu položky
     * @return string
     */
    public function getIcon(): ?string {
        return $this->icon;
    }

    /**
     * Nastavuje ikonu položky
     *
     * @param string $icon
     */
    public function setIcon(string $icon): void
    {
        $this->icon = $icon;
    }

    /**
     * Vrací potomky položky
     * @return array[MenuItem]
     */
    public function getChildren(bool $withoutVisible = false): array
    {
        if ($withoutVisible) {
            return array_filter($this->children, function (self $val) {
                return $val->isVisible();
            });
        } else {
            return $this->children;
        }
    }

    /**
     * Přidá podřazenou položku
     * @param string $id ID
     * @param string $name Název/text
     * @param string $url URL
     * @param string|null $icon Ikona
     * @param string|null $description Popisek
     *
     * @return $this
     */
    public function addItem(string $id, string $name, ?string $url, ?string $icon = null, ?string $description = null): self {
        $item = new self($id, $name, $url, $icon, $description, true, $this->menu);
        $this->children[] = $item;
        $this->menu->items_list[] = $item;

        return $item;
    }

    public function addHidden(string $id, string $name, string $url, ?string $description = null): MenuItem {
        $item = new self($id, $name, $url, null, $description, false, $this->menu);
        $this->children[] = $item;
        $this->menu->items_list[] = $item;

        return $item;
    }

    /**
     * Vrací zda je položka viditelná
     * @return bool
     */
    public function isVisible(): bool {
        return $this->visible;
    }

    /**
     * Nastavuje viditelnost položky
     * @param bool $visible
     */
    public function setVisible(bool $visible): void {
        $this->visible = $visible;
    }

    /**
     * Vrací popisek položky
     * @return string|null
     */
    public function getDescription(): ?string {
        return $this->description;
    }

    /**
     * Nastavuje popisek položky
     * @param string $description
     */
    public function setDescription(string $description): self {
        $this->description = $description;
        return $this;
    }

    public function setBadge($value) {
        $this->badge = $value;
        return $this;
    }

    public function addTag($tag): self {
        $this->tags[] = $tag;
        return $this;
    }

    public function setTags($tags): self {
        $this->tags = $tags;
        return $this;
    }

    public function getTags() {
        return $this->tags;
    }

    public function addDeveloper($developer): self {
        $this->developers[] = $developer;
        return $this;
    }

    public function setDevelopers($developers): self {
        $this->developers = $developers;
        return $this;
    }

    public function getDevelopers() {
        return $this->developers;
    }

    public function addResponsiblePerson($person): self {
        $this->responsiblePersons[] = $person;
        return $this;
    }

    public function setResponsiblePersons($persons): self {
        $this->responsiblePersons = $persons;
        return $this;
    }

    public function getResponsiblePersons() {
        return $this->responsiblePersons;
    }

    /**
     * @return string|null
     */
    public function getBadge() {
        return $this->badge;
    }

    public function toArray($onlyVisible = false) {
        $items = [];
        foreach ($this->children as $item) {
            if(in_array($item->URL, $this->menu->getAcl())){
                $i = $item->toArray($onlyVisible);
                if($i){
                    $items[] = $i;
                }
            }
        }

        if($onlyVisible && $this->visible === false) {
            return null;
        }

        $array = [
            'menuItems' => $items,
            'id' => $this->id,
            'name' => $this->name,
            'URL' => $this->URL,
            'icon' => $this->icon,
            'visible' => $this->visible,
            'description' => $this->description,
            'badge' => $this->badge,
            'tags' => $this->tags,
            'developers' => $this->developers,
            'responsiblePersons' => $this->responsiblePersons,
        ];

        return $array;
    }

}