<?php

namespace Jolanda\Controls\Grid;

use Jolanda\Controls\Editor\EntityEditor;

/**
 * Class SubGrid
 *
 * @package Jolanda\Controls\Grid
 */
class SubGrid extends Grid
{

    public $class = 'SubGrid';

    /**
     * Výška gridu
     *
     * @var string
     */
    protected $height = '56vh';

    /**
     * Editor pro rychlou editaci záznamu v gridu
     *
     * @var QuickEditor|null
     */
    private $quick_editor = null;

    /**
     * Název rodičovského sloupce v DB
     *
     * @var string
     */
    private $parent_entity = '';

    /**
     * Rodičovský entity editor, ve kterém se grid nachází
     *
     * @var EntityEditor|QuickEditor|null
     */
    private $parent_editor = null;

    /**
     * Vrací ID rodičovského entity editoru
     *
     * @return string
     */
    public function getParentEditor(): string
    {
        return $this->parent_editor;
    }

    /**
     * Nastavuje rodičovský entity editor
     *
     * @param EntityEditor $editor
     */
    public function setParentEditor(EntityEditor|QuickEditor $editor): SubGrid
    {
        $this->parent_editor = $editor->getId();

        return $this;
    }

    /**
     * Vrací ID editoru pro rychlou úpravu záznamu v gridu
     *
     * @return string
     */
    public function getQuickEditor(): ?string
    {
        return $this->quick_editor;
    }

    /**
     * Nastaví URL akce s rychlým editorem entit v gridu
     *
     * @param string $url URL akce s rychlým editorem entit
     */
    public function addEditor(string $url): SubGrid
    {
        $this->quick_editor = _bu() . '/' . $url;

        return $this;
    }

    /**
     * Vrací rodičovský sloupec v DB
     *
     * @return string
     */
    public function getParentEntity(): string
    {
        return $this->parent_entity;
    }

    /**
     * Nastaví rodičovský sloupec v DB pro vazbu
     *
     * @param string $column
     */
    public function setParentEntity(string $column): SubGrid
    {
        $this->parent_entity = $column;

        return $this;
    }

    public function toArray()
    {
        throw new \Exception('Please use SubGridVue for EntityEditorVue');
    }

}