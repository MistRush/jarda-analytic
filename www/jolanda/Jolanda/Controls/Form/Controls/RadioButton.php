<?php

namespace Jolanda\Controls\Form\Controls;

use Nette\Utils\Html;

/**
 * Class RadioButton
 *
 * @package Jolanda\Controls\Form\Controls
 */
class RadioButton extends FormControl
{

    /**
     * @var array
     */
    private $items = [];

    public function __construct($super, string $name, ?string $label = null, bool $required = false)
    {
        parent::__construct($super, $name, $label);
        $this->controlPart = Html::el('div');
        if ($required) {
            $this->setRequired();
        }
    }

    public function addDataItems(array $items): RadioButton
    {
        $this->items = $items;

        return $this;
    }

    public function __toString()
    {
        if ($this->help_html != null) {
            $this->labelPart->addHtml("<i class='ml-2 ci ci-help cursor-pointer' data-toggle='bstooltip' data-title='{$this->help_html}'></i>");
        }

        if($this->parent_form){
            $this->labelPart->setAttribute('for', $this->parent_form->getId() . '_' . $this->name);
        }else{
            $this->labelPart->setAttribute('for', $this->name);
        }

        if ($this->isRequired()) {
            $this->labelPart->addHtml(' <span class="required-char">*</span>');
        }else{
            $this->labelPart->addHtml(' <span class="required-char d-none">*</span>');
        }

        $i = 0;
        foreach ($this->items as $value => $label) {
            $line = Html::el('label class=radiobox');
            $radio = Html::el('input type=radio');
            $radio->setAttribute('name', $this->name);
            $radio->setAttribute('value', $value);

            if ($i == 0) {
                if ($this->isRequired()) {
                    $radio->setAttribute('data-validator', json_encode($this->validators));
                    $radio->setAttribute('required', $this->required);
                }
                if ($this->isDisabled()) {
                    $radio->setAttribute('class', $this->controlPart->getAttribute('class') . 'disabled');
                    $radio->setAttribute('disabled', 'disabled');
                }
                if ($this->isReadOnly()) {
                    $radio->setAttribute('readonly', 'readonly');
                }
            }
            if ($this->value == $value) {
                $radio->setAttribute('checked', true);
            }

            $line->insert(null, $radio);
            $checkmark = Html::el('span');
            $checkmark->setAttribute('class', 'checkmark');
            $line->insert(null, $checkmark);
            $line->insert(null, Html::el('span')->setText($label));
            $this->controlPart->insert(null, $line);
            $i++;
        }

        $this->element->setAttribute('class', "form-input-group col-md-{$this->columnSize}");
        $this->element->setAttribute('id', $this->name . "_group");

        $this->element->insert(0, $this->labelPart);
        $this->element->insert(1, $this->controlPart);

        return $this->element->render();
    }

    public function toArray(): array
    {
        // Získání základního JSON z FormControl
        $array = parent::toArray();

        $array['items'] = $this->items;

        return $array;
    }

}