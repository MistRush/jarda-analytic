<?php

namespace Jolanda\Controls\Editor;

use Jolanda\Controls\Grid\Grid;
use Jolanda\Controls\Grid\RelationSwitcher;
use Tracy\Debugger;

/**
 * Class Tab
 *
 * @package Jolanda\Controls\Editor
 */
class Tab
{

    /**
     * Rodičovský editor
     *
     * @var EntityEditor
     */
    public $editor;

    protected $super;

    /**
     * Pole skupin
     *
     * @var array[Group]
     */
    private $groups = [];

    /**
     * Titulek tabu
     *
     * @var string
     */
    private $title;

    /**
     * Bootstrap velikost slopců
     *
     * @var int
     */
    private $defaultColumnSize = 12;

    /**
     * Určení zda je tab neaktivní při vytváření entity
     *
     * @var bool
     */
    private $hiddenOnCreate = false;

    /**
     * Unikátní ID
     *
     * @var string
     */
    private $id;

    /**
     * Tab constructor.
     *
     * @param string $title Titulek tabu
     */
    public function __construct(string $title, $parent = null, ?string $id = null)
    {
        $this->title = $title;
        $this->editor = $parent;

        if(is_null($id))
            $this->id = uniqid();
        else
            $this->id = $id;

        $this->super = $this->editor->getSuper();
    }

    /**
     * @param string $title Titulek nové skupiny
     *
     * @return Group
     */
    public function addGroup(string $title): Group
    {
        $group = new Group($title, $this);
        $this->groups[] = $group;
        $group->setColumnSize($this->defaultColumnSize);

        return $group;
    }

    /**
     * Nastaví počet sloupců
     *
     * @param int $columns Číslo 1-12
     */
    public function setColumns(int $columns): Tab
    {
        if ($columns > 12) {
            $this->defaultColumnSize = 1;
        } elseif ($columns < 1) {
            $this->defaultColumnSize = 12;
        } else {
            $this->defaultColumnSize = 12 / $columns;
        }

        return $this;
    }

    /**
     * Vrací velikost Bootstrap sloupce
     *
     * @return int
     */
    public function getDefaultColumnSize(): int
    {
        return $this->defaultColumnSize;
    }

    /**
     * Nastaví velikost Bootstrap sloupce
     *
     * @param int $defaultColumnSize Číslo 1-12
     */
    public function setDefaultColumnSize(int $defaultColumnSize): Tab
    {
        if ($defaultColumnSize > 12) {
            $this->defaultColumnSize = 12;
        } elseif ($defaultColumnSize < 1) {
            $this->defaultColumnSize = 1;
        } else {
            $this->defaultColumnSize = $defaultColumnSize;
        }

        return $this;
    }

    /**
     * Vrací titulek tabu
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * Nastaví titulek tabu
     *
     * @param string $title
     */
    public function setTitle(string $title): Tab
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Vrací ID tabu
     *
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * Nastavuje zda má být panel skrytý při vytváření entity
     *
     * @param bool $hiddenOnCreate
     */
    public function setHiddenOnCreate(bool $hiddenOnCreate = true): Tab
    {
        $this->hiddenOnCreate = $hiddenOnCreate;

        return $this;
    }

    /**
     * Vrací zda při vytváření entity nemá tab alespoň jeden formulář ale pouze prvek závislý na id entity
     *
     * @return bool
     */
    public function isNotSimple(): bool
    {

        if ($this->editor->getEntityId() != null) {
            return false;
        } else {
            if ($this->hiddenOnCreate) {
                return true;
            }
            foreach ($this->getGroups() as $group) {
                foreach ($group->getGroupControls() as $control) {
                    if (!(($control instanceof Grid && $control->getDataSaveType() === Grid::SAVE_DATA_SERVERSIDE) || $control instanceof RelationSwitcher || $control instanceof CategoryTree)) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * Vrací pole skupin
     *
     * @return array
     */
    public function getGroups(): array
    {
        return $this->groups;
    }

    public function getSubGrids(): array
    {
        $subGrids = [];
        foreach ($this->groups as $group){
            $subGrids = array_merge($subGrids, $group->getSubGrids());
        }

        return $subGrids;
    }

    public function getRelationSwitches(): array
    {
        $relationSwitches = [];
        foreach ($this->groups as $group){
            $relationSwitches = array_merge($relationSwitches, $group->getRelationSwitches());
        }

        return $relationSwitches;
    }

    public function getCategoryTrees(): array
    {
        $categoryTrees = [];
        foreach ($this->groups as $group){
            $categoryTrees = array_merge($categoryTrees, $group->getCategoryTrees());
        }

        return $categoryTrees;
    }

    public function toArray(): array
    {
        $groups = [];
        foreach ($this->groups as $group){
            $groups[] = $group->toArray();
        }

        return [
            'groups' => $groups,
            'title' => $this->title,
            'defaultColumnSize' => $this->defaultColumnSize,
            'hiddenOnCreate' => $this->hiddenOnCreate,
            'id' => $this->id,
        ];
    }

    public function toJson(): string
    {
        return json_encode($this->toArray());
    }

}