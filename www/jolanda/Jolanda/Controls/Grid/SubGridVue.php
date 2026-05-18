<?php

namespace Jolanda\Controls\Grid;

use Jolanda\Controls\Editor\EntityEditor;

/**
 * Class SubGrid
 *
 * @package Jolanda\Controls\Grid
 */
class SubGridVue extends GridVue
{

    public $class = 'SubGridVue';

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
    public function setParentEditor(EntityEditor|QuickEditor $editor): SubGridVue
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
    public function addEditor(string $url): SubGridVue
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
    public function setParentEntity(string $column): SubGridVue
    {
        $this->parent_entity = $column;

        return $this;
    }

    public function render()
    {
        if (is_null($this->datalist_url) && $this->isAjax()) {
            throw new \Exception('Unable to render Grid. Data list URL must be specified.');
        }

        $html = "
<SubGrid
    json=\"" . htmlspecialchars($this->toJson(), ENT_QUOTES, 'UTF-8') . "\"
/>";

        return $html;
    }

    public function getSetting($json = true){
        $settings = parent::getSetting(false);
        $settings['parent-element'] = $this->getParentEntity();
        $settings['parent-editor'] = $this->getParentEditor();
        $settings['quickeditor'] = $this->getQuickEditor();

        return $json ? json_encode($settings) : $settings;
    }

    public function toArray(): array
    {
        $array = parent::toArray();

        $array['parent_entity'] = $this->parent_entity;
        $array['parent_editor'] = $this->parent_editor;
        $array['quick_editor'] = $this->quick_editor;
        $array['componentType'] = 'SubGrid';

        return $array;
    }

}