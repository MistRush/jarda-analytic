<?php

namespace Jolanda\Controls\Form\Controls;

use Jolanda\Translations\Lang;
use Nette\Utils\Html;

/**
 * Class FormControl
 *
 * @package Jolanda\Controls\Form\Controls
 */
abstract class FormControl
{

    public const
        VALIDATOR_REQUIRED = ':required', VALIDATOR_MIN_LENGTH = ':min_length', VALIDATOR_MAX_LENGTH = ':max_length', VALIDATOR_LENGTH = ':length', VALIDATOR_EMAIL = ':email', VALIDATOR_PATTERN = ':pattern', VALIDATOR_NUMBER = ':number', VALIDATOR_RANGE = ':range', VALIDATOR_SAME_VALUE = ':same', VALIDATOR_CUSTOM = ':custom';

    public static $idMask = 'frm-%s';

    /**
     * Atribut name
     *
     * @var string
     */
    protected $name;

    /**
     * Hodnota
     *
     * @var mixed
     */
    protected $value;

    /**
     * Label
     *
     * @var string
     */
    protected $label;

    /**
     * HTML část s popiskem
     *
     * @var Html
     */
    protected $labelPart;

    /**
     * HTML část s ovládacím prvkem
     *
     * @var Html
     */
    protected $controlPart;

    /**
     * Atribut disabled
     *
     * @var bool
     */
    protected $disabled = false;

    /**
     * Atribut placeholder
     *
     * @var string
     */
    protected $placeholder;

    /**
     * Element prvku
     *
     * @var Html
     */
    protected $element;

    /**
     * Atribut required
     *
     * @var bool
     */
    protected $required = false;

    /**
     * Pole validátorů
     *
     * @var array
     */
    protected $validators = [];

    /**
     * Atribut readonly
     *
     * @var bool
     */
    protected $readOnly = false;

    /**
     * Velikost bootstrap sloupce
     *
     * @var int
     */
    protected $columnSize;

    /**
     * Rodičovský formulář
     *
     * @var Form
     */
    protected $parent_form;

    protected $render_label = true;

    /**
     * Text nápovědy
     *
     * @var string|null
     */
    protected $help_html = null;

    protected $super;

    /**
     * FormControl constructor.
     *
     * @param string      $name  Atribut name
     * @param string|null $label Popisek
     */
    public function __construct($super, string $name, ?string $label = null)
    {
        $this->name = $name;
        $this->super = $super;
        $this->label = $label;
        $this->element = Html::el('div');
        $this->labelPart = Html::el('label');
        $this->labelPart->setText($label);
    }

    /**
     * @param $parent_form
     */
    public function setParentForm($parent_form): FormControl
    {
        $this->parent_form = $parent_form;
        $this->controlPart->setAttribute('id', $parent_form->getId() . '_' . $this->name);

        return $this;
    }

    public function isRenderLabel(): bool
    {
        return $this->render_label;
    }

    public function setRenderLabel(bool $render_label): FormControl
    {
        $this->render_label = $render_label;

        return $this;
    }


    /**
     * Vrací atribut name
     *
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Nastavuje atribut name
     *
     * @param string $name
     */
    public function setName(string $name): FormControl
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Vrací hodnotu prvku
     *
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * Nastavuje hodnotu prvku
     *
     * @param mixed $value
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * Vrací popisek
     *
     * @return string|null
     */
    public function getLabel(): ?string
    {
        return $this->label;
    }

    /**
     * Nastavuje popisek
     *
     * @param string $label
     */
    public function setLabel(string $label): FormControl
    {
        $this->label = $label;

        return $this;
    }

    public function setAccesskey($accesskey){
        $this->labelPart->setAttribute('accesskey', $accesskey);
    }

    /**
     * Vrací atribut placeholder
     *
     * @return string|null
     */
    public function getPlaceholder(): ?string
    {
        return $this->placeholder;
    }

    /**
     * Nastavuje atribut placeholder
     *
     * @param string $placeholder
     */
    public function setPlaceholder(string $placeholder): FormControl
    {
        $this->placeholder = $placeholder;

        return $this;
    }

    /**
     * Vrací element
     *
     * @return Html
     */
    public function getElement(): Html
    {
        return $this->element;
    }

    /**
     * Vrací zda má prvek atribut required
     *
     * @return bool
     */
    public function isRequired(): bool
    {
        return $this->required;
    }

    /**
     * Nastavuje povinnost vyplnění prvku
     *
     * @param bool   $required Povinnost
     * @param string $message  Zpráva v případě nesplnění podmínky
     */
    public function setRequired(bool $required = true, string $message = '')
    {
        if ($message == '') {
            $message = Lang::getInstance()->translate('FIELD_REQUIRED');
        }
        $this->required = $required;
        $this->addRule(self::VALIDATOR_REQUIRED, $message, null);

        return $this;
    }

    /**
     * Přidává validační pravidlo
     *
     * @param string $validator Typ validátoru
     * @param string $message   Zpráva v případě neplatné hodnoty
     * @param mixed  $params    Parametry validátoru
     *
     * @return FormControl
     */
    public function addRule(string $validator, string $message, $params = null)
    {
        $this->validators[] = [
            'v' => $validator,
            'm' => $message,
            'p' => $params
        ];

        return $this;
    }

    /**
     * Nastavuje velikost bootstrap sloupce
     *
     * @param int $size Číslo 1-12
     *
     * @return FormControl
     */
    public function setColumnSize($size): FormControl
    {
        if ($size > 12) {
            $this->columnSize = 12;
        } elseif ($size == 0) {
            $this->columnSize = 'auto';
        } elseif ($size < 1) {
            $this->columnSize = 1;
        } else {
            $this->columnSize = $size;
        }

        return $this;
    }

    /**
     * Vrací HTML část s popiskem
     *
     * @return Html
     */
    public function getLabelPart(): Html
    {
        return $this->labelPart;
    }

    /**
     * Nastavuje HTML část s popiskem
     *
     * @param Html $labelPart
     */
    public function setLabelPart(Html $labelPart): FormControl
    {
        $this->labelPart = $labelPart;

        return $this;
    }

    /**
     * Vrací HTML část s ovládacím prvkem
     *
     * @return Html
     */
    public function getControlPart(): Html
    {
        return $this->controlPart;
    }

    /**
     * Nastavuje HTML část s ovládacím prvkem
     *
     * @param Html $controlPart
     */
    public function setControlPart(Html $controlPart): FormControl
    {
        $this->controlPart = $controlPart;

        return $this;
    }

    /**
     * Nastavuje HTML atribut elementu
     *
     * @param string $name
     * @param mixed  $value
     */
    public function setElementAttribute(string $name, $value): FormControl
    {
        $this->controlPart->setAttribute($name, $value);

        return $this;
    }

    public function setHelp(string $text): FormControl
    {
        $this->help_html = $text;

        return $this;
    }

    public function getHelp()
    {
        return $this->help_html;
    }

    /**
     * Render prvku
     *
     * @return string
     */
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

        $this->element->setAttribute('class', $this->element->getAttribute('class') . " form-input-group col-md-{$this->columnSize}");
        $this->element->setAttribute('id', $this->name . "_group");

        if (!empty($this->validators)) {
            $this->controlPart->setAttribute('data-validator', json_encode($this->validators));
            //            $this->controlPart->setAttribute('required', $this->required);
        }
        if ($this->isDisabled()) {
            $this->controlPart->setAttribute('class', $this->controlPart->getAttribute('class') . ' disabled');
            $this->controlPart->setAttribute('disabled', 'disabled');
        }
        if ($this->isReadOnly()) {
            $this->controlPart->setAttribute('readonly', 'readonly');
            $this->element->setAttribute('class', $this->element->getAttribute('class') . ' readonly');
        }
        $this->controlPart->setAttribute('placeholder', $this->placeholder);
        $this->controlPart->setAttribute('name', $this->name);
        if($this->isRenderLabel()){
            $this->element->insert(0, $this->labelPart);
        }
        $this->element->insert(1, $this->controlPart);

        if($this->parent_form){
            $this->labelPart->setAttribute('for', $this->parent_form->getId() . '_' . $this->name);
        }else{
            $this->labelPart->setAttribute('for', $this->name);
        }

        return $this->element->render();
    }

    /**
     * Vrací zda má prvek atribut disabled
     *
     * @return bool
     */
    public function isDisabled(): bool
    {
        return $this->disabled;
    }

    /**
     * Nastavuje atribut disabled
     *
     * @param bool $disabled
     */
    public function setDisabled(bool $disabled): FormControl
    {
        $this->disabled = $disabled;

        return $this;
    }

    /**
     * Vrací zda má prvek atribut readonly
     *
     * @return bool
     */
    public function isReadOnly(): bool
    {
        return $this->readOnly;
    }

    /**
     * Nastavuje atribut readonly
     *
     * @param bool $readOnly
     */
    public function setReadOnly(bool $readOnly): FormControl
    {
        $this->readOnly = $readOnly;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'value' => $this->value,
            'label' => $this->label,
            'labelPart' => $this->labelPart ? $this->extractHtmlAttributes($this->labelPart) : null,  // Převod labelPart
            'controlPart' => $this->controlPart ? $this->extractHtmlAttributes($this->controlPart) : null,  // Převod controlPart
            'element' => $this->controlPart ? $this->extractHtmlAttributes($this->element) : null,  // Převod controlPart
            'placeholder' => $this->placeholder,
            'required' => $this->required,
            'disabled' => $this->disabled,
            'readOnly' => $this->readOnly,
            'columnSize' => $this->columnSize,
            'validators' => $this->validators,
            'helpHtml' => $this->help_html,
            'renderLabel' => $this->render_label,
            'componentType' => basename(str_replace('\\', '/', get_class($this))),
        ];
    }

    public function toJson(): string
    {
        return json_encode($this->toArray());
    }

    private function extractHtmlAttributes(Html $htmlElement): array
    {
        return [
            'tag' => $htmlElement->getName(),
            'attributes' => $htmlElement->attrs,  // Získání všech atributů jako pole
            'text' => $htmlElement->getText(),    // Získání textového obsahu
//            'html' => (string) $htmlElement       // Celý HTML obsah elementu jako string
        ];
    }

}