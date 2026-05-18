<?php

namespace Jolanda\Controls\Editor;

use Jolanda\Controls\Form\Controls\FormGroup;
use Jolanda\Controls\Grid\SubGridVue;
use Jolanda\Controls\Grid\RelationSwitcher;
use Jolanda\Controls\Grid\SubGrid;
use Nette\Utils\Html;
use Tracy\Debugger;

/**
 * Class Group
 *
 * @package Jolanda\Controls\Editor
 */
class Group
{

    /**
     * Rodičovský tab
     *
     * @var Tab
     */
    public $tab;

    protected $super;

    /**
     * ID skupiny
     *
     * @var string
     */
    private $id = null;

    /**
     * Pole prvků ve skupině
     *
     * @var array
     */
    private $groupControls = [];

    /**
     * Boostrap velikost skupiny
     *
     * @var int
     */
    private $columnSize = 12;

    /**
     * Titulek skupiny
     *
     * @var string
     */
    private $title;

    /**
     * Pole HTML atributů
     *
     * @var string[]
     */
    private $attributes = [];

    /**
     * Group constructor.
     *
     * @param string $title Titulek skupiny
     */
    public function __construct(string $title, $parent)
    {
        $this->title = $title;
        $this->tab = $parent;
        $this->super = $this->tab->editor->getSuper();
        $this->attributes = [
            'class' => "",
        ];

    }

    /**
     * Vrací pole HTML atributů skupiny
     *
     * @return string[]
     */
    public function getAttributes(): array
    {
        $this->attributes['class'] .= "col-md-{$this->getColumnSize()} tab-group";

        if($this->getId()){
            $this->attributes['id'] = "{$this->getId()}";
        }


        return $this->attributes;
    }

    /**
     * Vrací velikost Bootstrap sloupce
     *
     * @return int
     */
    public function getColumnSize(): int
    {
        return $this->columnSize;
    }

    /**
     * Nastaví velikost Bootstrap sloupce
     *
     * @param int $size Číslo 1-12
     */
    public function setColumnSize(int $size): Group
    {
        if ($size > 12) {
            $this->columnSize = 12;
        } elseif ($size < 1) {
            $this->columnSize = 1;
        } else {
            $this->columnSize = $size;
        }

        return $this;
    }

    /**
     * Vrací ID skupiny
     *
     * @return string
     */
    public function getId(): ?string
    {
        return $this->id;
    }

    /**
     * Nastavuje ID skupiny
     *
     * @param string $id
     */
    public function setId(string $id): Group
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Nastavuje skupině HTML atribut
     *
     * @param string $attribute Název atributu
     * @param string $value     Hodnota atributu
     */
    public function setElementAttribute(string $attribute, $value): Group
    {
        $this->attributes[$attribute] = $value;

        return $this;
    }

    /**
     * Přidá formulář do skupiny
     *
     * @return FormGroup
     */
    public function addForm(): FormGroup
    {
        $formGroup = new FormGroup($this->tab->editor, $this->title);
        $this->groupControls[] = $formGroup;

        return $formGroup;
    }

    /**
     * Přidá grid do skupiny
     *
     * @param string $id    ID gridu
     * @param string $title Titulek gridu
     *
     * @return SubGrid
     */
    public function addGrid(string $id, string $title): SubGrid
    {
        $grid = new SubGrid($id, $title, null);
        $grid->setParentEditor($this->tab->editor);
        $this->groupControls[] = $grid;

        return $grid;
    }

    public function addGridVue(string $id, string $title): SubGridVue
    {
        $grid = new SubGridVue($id, $title, null);
        $grid->setParentEditor($this->tab->editor);
        $this->groupControls[] = $grid;

        return $grid;
    }

    /**
     * Přidá RelationSwitcher do skupiny
     *
     * @param string     $title                 Titulek
     * @param string     $source_url            URL manageru zdrojových dat
     * @param string     $relations_url         URL manageru s vazebními daty
     * @param string     $parent_column         Sloupec vazby M:
     * @param string     $child_column          Sloupec vazby :N
     * @param string     $child_name_column     Název sloupce z N tabulky pro generování názvu
     * @param array|null $params                URL paramentry pro Manager
     * @param string|null $group_by_column      Sloupec zdrojových dat, podle kterého seskupit data
     * @param string|null $group_by_name_column Sloupec zdrojových dat, název skupiny
     *
     * @return RelationSwitcher
     */
    public function addRelationSwitcher(string $title, string $source_url, string $relations_url, string $parent_column, string $child_column, string $child_name_column, ?array $params = null, ?string $group_by_column = null, ?string $group_by_name_column = null): RelationSwitcher
    {
        $relation_switcher = new RelationSwitcher($this->tab->editor, $title, $source_url, $relations_url, $parent_column, $child_column, $child_name_column, $params, $group_by_column, $group_by_name_column);
        $this->groupControls[] = $relation_switcher;

        return $relation_switcher;
    }

    /**
     * Přidává strom kategorií do skupiny
     *
     * @param string      $id                      ID prvku
     * @param string|null $label                   Popisek
     * @param array       $store                   URL manageru zdrojových dat
     * @param string      $storeField              Název sloupce s názvem dat
     * @param string      $relation_url            URL manageru relační tabulky
     * @param string      $child_column            Sloupec vazby :N
     * @param string      $parent_column           Sloupec vazby M:
     * @param string      $self_referencing_column Sloupec vazby na sebe sama (pro vnoření)
     *
     * @return CategoryTree
     */
    public function addCategoryTree(string $id, ?string $label, array $store, string $storeField, string $relation_url, string $child_column, string $parent_column, string $self_referencing_column = 'Parent_ID'): CategoryTree
    {
        $category_tree = new CategoryTree($this->tab->editor, $id, $label, $store, $storeField, $relation_url, $child_column, $parent_column, $self_referencing_column);
        $this->groupControls[] = $category_tree;

        return $category_tree;
    }

    /**
     * Přidá do skupiny HTML blok
     *
     * @param string|null $html Vlastní HTML kód
     *
     * @return Html
     */
    public function addHtml(?string $html = ''): Html
    {
        $group = Html::el('div', ['class' => 'form-group']);
        $content = Html::el('div');
        $content->setHtml($html);

        $group->insert(null, $content);
        $this->groupControls[] = $group;

        return $content;
    }

    /**
     * Vrací titulek skupiny
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * Nastavuje titulek skupiny
     *
     * @param string $title
     */
    public function setTitle(string $title): Group
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Vrací pole prvků skupiny
     *
     * @return array
     */
    public function getGroupControls(): array
    {
        return $this->groupControls;
    }

    public function getSubGrids(): array
    {
        $subGrids = [];
        foreach ($this->groupControls as $control){
            if(is_a($control,'Jolanda\Controls\Grid\SubGrid') || is_a($control,'Jolanda\Controls\Grid\SubGridVue')) {
                $subGrids[] = $control;
            }
        }

        return $subGrids;
    }

    public function getRelationSwitches(): array
    {
        $relationSwitches = [];
        foreach ($this->groupControls as $control){
            if(is_a($control,'Jolanda\Controls\Grid\RelationSwitcher')) {
                $relationSwitches[] = $control;
            }
        }

        return $relationSwitches;
    }

    public function getCategoryTrees(): array
    {
        $categoryTrees = [];
        foreach ($this->groupControls as $control){
            if(is_a($control,'Jolanda\Controls\Editor\CategoryTree')) {
                $categoryTrees[] = $control;
            }
        }

        return $categoryTrees;
    }

    public function toArray(): array
    {
        $groupControls = [];
        foreach ($this->groupControls as $groupControl){
            if($groupControl instanceof Html){
                $groupControls[] = [
                    'tag' => $groupControl->getName(),
                    'attributes' => $groupControl->attrs,  // Získání všech atributů jako pole
                    'text' => $groupControl->getText(),    // Získání textového obsahu
                    'html' => $groupControl->getHtml(),    // Celý HTML obsah elementu jako string
                    'componentType' => 'html',
                ];
                continue;
            }
            $groupControls[] = $groupControl->toArray();
        }

        return [
            'id' => $this->id,
            'groupControls' => $groupControls,
            'columnSize' => $this->columnSize,
            'title' => $this->title,
            'attributes' => $this->attributes,
        ];
    }

    public function toJson(): string
    {
        return json_encode($this->toArray());
    }

}