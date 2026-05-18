<?php

namespace Jolanda\Controls\Grid;

use Jolanda\Controls\Form\Controls\FormGroup;
use Jolanda\Controls\Form\Form;
use Jolanda\Latte\Latte;
use Jolanda\Translations\Lang;
use Nette\Utils\Html;

/**
 * Class Grid
 *
 * @package Jolanda\Controls\Grid
 */
class GridVue extends Grid
{
    public $class = 'GridVue';

    protected $rowHeight = 33;

    public function __construct(string $id, string $title, string $edit_action = null, $super = null, $allowExport = true)
    {
        parent::__construct($id, $title, $edit_action, $super, $allowExport);
    }

    public function getSetting($json = true) {
        $settings = [
            'actions' => [
                'remove' => $this->getEnabledActions()['remove'] ?? false,
                'add' => $this->getEnabledActions()['add'] ?? false,
                'edit' => $this->getEnabledActions()['edit'] ?? false,
            ],
            'dataListUrl' => $this->isAjax() ? $this->getDatalistUrl() : null,
            'editAction' => $this->getEditAction(),
            'inlineEditAction' => $this->getInlineEditAction(),
            'quickEditAction' => $this->getQuickeditAction(),
            'deleteUrl' => $this->getDeleteUrl(),
            'updateUrl' => $this->getUpdateUrl(),
            'createUrl' => $this->getCreateUrl(),
            'select' => $this->getSelect(),
            'multipleType' => $this->getMultipleType(),
            'columns' => $this->getFormattedColumnsJson(),
            'parent' => $this->getParentGridJson(),
            'reorder' => $this->getOrderColumn(),
            'rowButtons' => $this->getRowActionsJson(),
            'rowFormatter' => $this->getRowFormatter(),
            'relationSwitcher' => $this->getRelationSwitcher(),
            'height' => $this->getHeight(),
            'orders' => $this->getOrder(),
            'preview' => $this->isPreview(),
            'name' => $this->name,
            'cacheEditor' => $this->getEditorCache(),
            'displayBuffer' => $this->getDisplayBuffer(),
            'infiniteScroll' => $this->getInfiniteScroll(),
            'dataSaveType' => $this->getDataSaveType(),
            'dataSaveParams' => $this->getDataSaveParams(true),
            'one_must_be_selected' => $this->mustBeOneSelected(),
            'quickEditMaxWidth' => $this->getQuickeditMAxWidth(),
            'isAjax' => $this->isAjax() ? 1 : 0,
            'data' => !$this->isAjax() ? $this->getDataJson() : null,
            'title' => $this->getTitle(),
            'columnReorder' => $this->getColumnReorder() ? 1 : 0,
            'customRowReorder' => $this->getCustomRowReorder() ? 1 : 0,
            'presetSaveType' => $this->getPresetSaveType(),
            'presetServersideUrl' => $this->getPresetServersideUrl(),
            'useFiltersBar' => $this->useFiltersBar() ? 1 : 0,
            'contextMenu' => $this->getContextMenuSettingJson(),
            'rowHeight' => $this->getRowHeight(),
        ];

        return $json ? json_encode($settings) : $settings;
    }

    /**
     * Render gridu do HTML
     *
     * @return string
     * @throws \Exception
     */
    public function render()
    {
        if (is_null($this->datalist_url) && $this->isAjax()) {
            throw new \Exception('Unable to render Grid. Data list URL must be specified.');
        }



        $grid = "
<Grid
    json=\"" . htmlspecialchars($this->toJson(), ENT_QUOTES, 'UTF-8') . "\" class=\"tailwind\"
/>";

        $html = new Html();
        $html->setHtml($grid);

        return $html;
    }

    protected function setRowHeight($height){
        $this->rowHeight = $height;
    }

    protected function getRowHeight(){
        return $this->rowHeight;
    }

    public function toArray(): array
    {
        $array = parent::toArray();

        $array['rowHeight'] = $this->rowHeight;

        return $array;
    }


}