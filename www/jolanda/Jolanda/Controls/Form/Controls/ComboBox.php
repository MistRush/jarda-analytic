<?php

namespace Jolanda\Controls\Form\Controls;

use Nette\Utils\Html;

/**
 * Class ComboBox
 *
 * @package Jolanda\Controls\Form\Controls
 */
class ComboBox extends FormControl
{

    /**
     * @var array
     */
    private $enumValues = [];

    /**
     * @var bool
     */
    private $multi;

    private $dynamicAddingOptions = false;

    private $quickEditorUrl = null;

    private $editable = false;
    private $storeField = null;
    private $ajax = false;

    public function __construct($super, $name, $label, $required = null, $enum = [], $storeField = null, bool $multi = false, $ajax = false)
    {
        parent::__construct($super, $name, $label);
        $this->controlPart = Html::el('select');
        $this->controlPart->setAttribute('class', 'form-control');
        $this->multi = $multi;
        $this->storeField = $storeField;
        $this->ajax = $ajax;


        if (!$ajax && !is_null($ajax)) {
            if ($multi) {
                $this->controlPart->setAttribute('multiple', 'multiple');
            }
            if ($storeField == null) {
                if ($multi) {
                    unset($enum['']);
                }
                $this->enumValues = $enum;
            } else {
                $this->enumValues = $this->getStoreValues($enum, $storeField);
            }

            if (count($this->enumValues) > 50) {
                $this->setMinimumSearchLength(1);
            }

            $this->setSelectWidth('100%');
        } else {
            if(!isset($enum['action']))
                $enum['action'] = 'data-list';

            $store = _bu();
            if (!isset($enum['module'])) {
                $store .= '/admin';
            } else {
                $store .= '/' . $enum['module'];
                unset($enum['module']);
            }
            $store .= '/' . $enum['controller'] . '/' . $enum['action'];
            unset($enum['action']);
            unset($enum['controller']);
            $this->controlPart->addAttributes([
                'data-store' => $store,
                'data-storefield' => $storeField,
                'data-storeparams' => json_encode($enum),
                'data-storedepends' => $ajax
            ]);

            $this->setSelectWidth();
        }

        if ($required) {
            $this->setRequired();
        }
    }

    private function getStoreValues($store, $storeField)
    {
        /**
         * @var Clevis_Data_ManagerRaw $manager
         */
        if (!isset($store['module'])) {
            $store['module'] = 'admin';
        }
        $manager_class = ucfirst($store['module']) . '_Manager_';
        foreach (explode('-', $store['controller']) as $item) {
            $manager_class .= ucfirst($item);
        }
        $manager = new $manager_class();
        unset($store['module']);
        unset($store['controller']);
        $data = $manager->performDataList($store, \Clevis_Data_Manager::LIST_HIERARCHY);
        if ($this->multi) {
            $result = [];
        } else {
            $result = ['' => ''];
        }
        foreach ($data['data'] as $item) {
            $result[$item["ID"]] = $item[$storeField];
        }

        return $result;
    }

    public function setMinimumSearchLength($length = 3): ComboBox
    {
        $this->controlPart->setAttribute('data-minimum-input-length', $length);

        return $this;
    }

    public function setSelectWidth($width = '100%'): self
    {
        if(!is_string($width))
            $width .= 'px';

        $this->controlPart->setAttribute('data-width', $width);
        $this->controlPart->setAttribute('style', 'width: ' . $width . ';');

        return $this;
    }

    public function isAjax(){
        if($this->controlPart->getAttribute('data-store'))
            return true;
        else
            return false;

    }

    public function __toString()
    {
        $this->element->setAttribute('id', $this->name . "_group");

        foreach ($this->enumValues as $key => $value) {    
            if ($this->getControlPart()->getAttribute('multiple') == 'multiple' && $key == '') {
                continue;
            }
            $option = Html::el('option');
            $option->setAttribute('value', $key);
            if ($this->value == $key) {
                $option->setAttribute('selected', 'selected');
            }
            $option->setText($value);
            $this->controlPart->insert(null, $option);
        }

        if($this->editable){
            $this->controlPart->setAttribute('data-editable', 'true');
        }

        $this->element->setAttribute('data-dynamicAdding', $this->dynamicAddingOptions ? 'true':'false');
        if($this->dynamicAddingOptions){
            $this->element->setAttribute('data-dynamicAddingQuickEditor', $this->quickEditorUrl);
        }

        if($this->dynamicAddingOptions)
            $this->element->addHtml('<Button class="combo_box_add_dynamic_option_button btn btn-green" data-parent="'.$this->name . '_group'.'">+</Button>');

        return parent::__toString();
    }

    public function enableDynamicAddingOptions($quickEditorUrl): self
    {
        $this->quickEditorUrl = $quickEditorUrl;
        $this->dynamicAddingOptions = true;

        return $this;
    }

    public function setEditable($editable = true){
        $this->editable = true;
    }

    public function toArray(): array
    {
        // Získání základního JSON z FormControl
        $array = parent::toArray();

        $array['enumValues'] = $this->enumValues;
        $array['multi'] = $this->multi;
        $array['dynamicAddingOptions'] = $this->dynamicAddingOptions;
        $array['quickEditorUrl'] = $this->quickEditorUrl;
        $array['editable'] = $this->editable;
        $array['storeField'] = $this->storeField;
        $array['ajax'] = $this->ajax;

        return $array;
    }

}