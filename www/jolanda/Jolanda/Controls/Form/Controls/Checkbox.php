<?php

namespace Jolanda\Controls\Form\Controls;

use Nette\Utils\Html;

/**
 * Class Checkbox
 *
 * @package Jolanda\Controls\Form\Controls
 */
class Checkbox extends FormControl
{

    public function __construct($super, string $name, ?string $label = null, bool $required = false)
    {
        parent::__construct($super, $name, $label);
        $this->controlPart = Html::el('input type=checkbox');
        $this->controlPart->setAttribute('class', 'form-control');

        if ($required) {
            $this->setRequired();
        }
    }

    public function setValue($value)
    {
        parent::setValue($value);
        if ($value == true) {
            $this->controlPart->setAttribute('checked', true);
        } else {
            $this->controlPart->removeAttribute('checked');
        }

        return $this;
    }

    public function __toString()
    {
        if ($this->help_html != null) {
            $this->labelPart->addHtml("<i class='ml-2 ci ci-help cursor-pointer' data-toggle='bstooltip' data-title='{$this->help_html}'></i>");
        }

        if ($this->isRequired()) {
            $this->labelPart->addHtml(' <span class="required-char">*</span>');
        }else{
            $this->labelPart->addHtml(' <span class="required-char d-none">*</span>');
        }

        $this->element->setAttribute('class', "form-input-group col-md-{$this->columnSize}");
        $this->element->setAttribute('id', $this->name . "_group");

        if (!empty($this->validators)) {
            $this->controlPart->setAttribute('data-validator', json_encode($this->validators));
        }
        if ($this->isDisabled()) {
            $this->controlPart->setAttribute('class', $this->controlPart->getAttribute('class') . 'disabled');
            $this->controlPart->setAttribute('disabled', 'disabled');
        }
        if ($this->isReadOnly()) {
            $this->controlPart->setAttribute('readonly', 'readonly');
            $this->controlPart->setAttribute('onclick', 'return false;');
        }
        $this->controlPart->setAttribute('name', $this->name);
        $this->labelPart->setAttribute('class', 'checkbox');
        $this->labelPart->insert(0, $this->controlPart);
        $checkmark = Html::el('span');
        $checkmark->setAttribute('class', 'checkmark');
        $this->labelPart->removeAttribute('for');
        $this->labelPart->insert(1, $checkmark);

        $this->element->insert(0, $this->labelPart);

        return $this->element->render();
    }

    public function toArray(): array
    {
        // Získání základního JSON z FormControl
        $array = parent::toArray();

        return $array;
    }

}