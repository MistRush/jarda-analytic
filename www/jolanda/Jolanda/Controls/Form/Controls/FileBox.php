<?php

namespace Jolanda\Controls\Form\Controls;

use Jolanda\Translations\Lang;
use Nette\Utils\Html;

/**
 * Class FileBox
 *
 * @package Jolanda\Controls\Form\Controls
 */
class FileBox extends FormControl
{
    private $fileUploadUrl;
    public function __construct($super, string $name, ?string $label = null, $fileUploadUrl = ['module' => 'common', 'controller' => 'file', 'action' => 'upload'], $multi = false)
    {
        parent::__construct($super, $name, $label);
        $this->fileUploadUrl = $fileUploadUrl;

        $this->controlPart = Html::el('input', ['type' => 'file']);
        $this->controlPart->setAttribute('class', 'form-control custom-file-input');
        if ($multi) {
            $this->controlPart->setAttribute('multiple', 'multiple');
        }
        if ($fileUploadUrl != null) {
            $url = $fileUploadUrl['module'] . '/' . $fileUploadUrl['controller'] . '/' . $fileUploadUrl['action'] . '?null=null';
            unset($fileUploadUrl['module']);
            unset($fileUploadUrl['controller']);
            unset($fileUploadUrl['action']);
            foreach ($fileUploadUrl as $key => $value) {
                $url .= '&' . $key . '=' . $value;
            }
            $this->controlPart->setAttribute('data-url', $url);
        }
    }

    public function addRule(string $validator, string $message, $params = null)
    {
    }

    public function setRequired(bool $required = true, string $message = 'This field is required'): void
    {
    }

    public function __toString()
    {
        $this->element->setAttribute('class', "form-input-group col-md-{$this->columnSize}");
        $this->element->setAttribute('id', $this->name . "_group");

        if ($this->isRequired()) {
            $this->labelPart->addHtml(' <span class="required-char">*</span>');
        }else{
            $this->labelPart->addHtml(' <span class="required-char d-none">*</span>');
        }

        if ($this->isDisabled()) {
            $this->controlPart->setAttribute('class', $this->controlPart->getAttribute('class') . ' disabled');
            $this->controlPart->setAttribute('disabled', 'disabled');
        }
        if ($this->isReadOnly()) {
            $this->controlPart->setAttribute('readonly', 'readonly');
        }
        $this->controlPart->setAttribute('placeholder', $this->placeholder);
        $this->controlPart->setAttribute('name', $this->name);
        $this->element->insert(0, $this->labelPart);

        $div = Html::el('div', ['class' => 'custom-file']);
        $div->insert(null, $this->controlPart);
        $label = Html::el('label', ['class' => 'custom-file-label']);
        $label->setText(Lang::getInstance()->translate('SELECT_FILE'));
        $div->insert(null, $label);
        $this->element->insert(1, $div);

        return $this->element->render();
    }

    public function toArray(): array
    {
        // Získání základního JSON z FormControl
        $array = parent::toArray();

        $array['fileUploadUrl'] = $this->fileUploadUrl;
        $array['multi'] = $this->controlPart->getAttribute('multi') ?? false;

        return $array;
    }
}