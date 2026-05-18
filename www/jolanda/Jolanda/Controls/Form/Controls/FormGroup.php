<?php

namespace Jolanda\Controls\Form\Controls;

use Jolanda\Controls\Grid\SubGrid;
use Jolanda\Translations\Lang;
use Nette\Utils\Html;
use Symfony\Components\Yaml\Exception;
use Tracy\Debugger;

/**
 * Class FormGroup
 *
 * @package Jolanda\Controls\Form\Controls
 */
class FormGroup
{

    protected $parent;

    protected $super;

    private ?string $id;

    /**
     * Výchozí velikost Bootstrap sloupce
     *
     * @var int
     */
    private $defaultColumnSize = 12;

    /**
     * Element
     *
     * @var Html
     */
    private $element;

    /**
     * Popisek
     *
     * @var string|null
     */
    private $label;

    /**
     * Pole formulářových prvků
     *
     * @var array
     */
    protected $formControls = [];

    /**
     * Property modelu s cizí vazbou, např. feedbackSolvers
     *
     * @var string|null
     */
    private $data_attribute = null;

    /**
     * @var FormGroup[]
     */
    private $formGroups = [];

    /**
     * FormGroup constructor.
     *
     * @param string $label Popisek
     */
    public function __construct($parent, ?string $label = null, ?string $id = null)
    {
        $this->element = Html::el('div');
        $this->element->setAttribute('class', 'row form-group');
        $this->label = $label;
        $this->parent = $parent;
        $this->id = $id;
        $this->super = $parent->getSuper();
    }

    /**
     * Vrací výchozí velikost Bootstrap sloupce
     *
     * @return int
     */
    public function getDefaultColumnSize(): int
    {
        return $this->defaultColumnSize;
    }

    /**
     * Nastavuje výchozí velikost Bootstrap sloupce
     *
     * @param int $defaultColumnSize Číslo 1-12
     */
    public function setDefaultColumnSize(int $defaultColumnSize): FormGroup
    {
        if ($defaultColumnSize > 12) {
            $this->defaultColumnSize = 12;
        } elseif ($defaultColumnSize == 0) {
            $this->defaultColumnSize = 'auto';
        } elseif ($defaultColumnSize < 1) {
            $this->defaultColumnSize = 1;
        } else {
            $this->defaultColumnSize = $defaultColumnSize;
        }

        return $this;
    }

    /**
     * Nastavuje počet sloupců
     *
     * @param int $columns
     */
    public function setColumns(int $columns): FormGroup
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
     * Nastavuje property modelu pro vazbu, např. feedbackSolvers
     *
     * @param string $data_attribute
     */
    public function setDataAttribute(string $data_attribute): FormGroup
    {
        $this->data_attribute = $data_attribute;

        return $this;
    }

    /**
     * Vrací element
     *
     * @return Html
     */
    public function getElement()
    {
        return $this->element;
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
    public function setLabel(string $label): FormGroup
    {
        $this->label = $label;

        return $this;
    }

    /**
     * Přidá prázdné pole pro zaplnění buňky
     *
     * @return Html
     */
    public function addEmpty(?int $column_size = null): Html
    {
        if ($column_size == null) {
            $column_size = $this->defaultColumnSize;
        }
        $control = Html::el('div');
        $control->setAttribute('class', "form-input-group col-md-{$column_size}");
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Přidá textové pole
     *
     * @param string      $name
     * @param string|null $label
     * @param bool        $required
     *
     * @return TextInput
     */
    public function addTextBox(string $name, ?string $label = null, bool $required = false): TextInput
    {
        $control = new TextInput($this->super, $name, $label, $required, $type = TextInput::TYPE_TEXT);
        $control->setParentForm($this->parent);
        $control->setColumnSize($this->defaultColumnSize);
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Přidá textové pole s heslem
     *
     * @param string      $name
     * @param string|null $label
     * @param bool        $required
     *
     * @return TextInput
     */
    public function addPassword(string $name, ?string $label = null, bool $required = false): TextInput
    {
        $control = new TextInput($this->super, $name, $label, $required, $type = TextInput::TYPE_PASSWORD);
        $control->setParentForm($this->parent);
        $control->setColumnSize($this->defaultColumnSize);
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Přidá číselné pole
     *
     * @param string      $name
     * @param string|null $label
     * @param bool        $required
     *
     * @return TextInput
     */
    public function addNumericBox(string $name, ?string $label = null, bool $required = false): TextInput
    {
        $control = new TextInput($this->super, $name, $label, $required, $type = TextInput::TYPE_NUMBER);
        $control->setParentForm($this->parent);
        $control->setColumnSize($this->defaultColumnSize);
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Přidá pole s datem a časem
     *
     * @param string      $name
     * @param string|null $label
     * @param bool        $required
     *
     * @return DateBox
     */
    public function addDateTimeBox(string $name, ?string $label, bool $required = false): DateBox
    {
        $control = new DateBox($this->super, $name, $label, $required, DateBox::TYPE_DATETIME);
        $control->setParentForm($this->parent);
        $control->setColumnSize($this->defaultColumnSize);
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Přidá pole s datem a časem
     *
     * @param string      $name
     * @param string|null $label
     * @param string      $type [H => Hodiny, HM => Hodiny:Minuty, HMS => Hodiny:Minuty:Sekundy]
     * @param bool        $required
     *
     * @return DateBox
     */
    public function addTimeBox(string $name, ?string $label, $type = 'HMS', bool $required = false): DateBox
    {
        if($type != 'H' && $type != 'HM' && $type != 'HMS'){
            Throw new Exception('Wrong timeBox type');
        }

        $control = new DateBox($this->super, $name, $label, $required, DateBox::TYPE_TIME . $type);
        $control->setParentForm($this->parent);
        $control->setColumnSize($this->defaultColumnSize);
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Alias metody addTextArea
     *
     * @param string      $name
     * @param string|null $label
     *
     * @return TextArea
     */
    public function addEditor(string $name, ?string $label = null): TextArea
    {
        $control = $this->addTextArea($name, $label);
        $control->setParentForm($this->parent);
        $control->setColumnSize($this->defaultColumnSize);
        $control->getControlPart()->setAttribute('data-mce', 'true');

        return $control;
    }

    /**
     * Přidá pole s WYSIWYG editorem
     *
     * @param string      $name
     * @param string|null $label
     * @param bool        $required
     *
     * @return TextArea
     */
    public function addTextArea(string $name, ?string $label = null, bool $required = false): TextArea
    {
        $control = new TextArea($this->super, $name, $label, $required);
        $control->setParentForm($this->parent);
        $control->setColumnSize($this->defaultColumnSize);
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Přidá pole s datem
     *
     * @param string      $name
     * @param string|null $label
     * @param bool        $required
     *
     * @return DateBox
     */
    public function addDateBox(string $name, ?string $label = null, bool $required = false): DateBox
    {
        $control = new DateBox($this->super, $name, $label, $required, DateBox::TYPE_DATE);
        $control->setColumnSize($this->defaultColumnSize);
        $control->setParentForm($this->parent);
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Přidá selectbox s hodnotami z manageru
     *
     * @param string      $name
     * @param string|null $label
     * @param array       $storeUrl   Pole s cestou k manageru [module, controller, parametry, ...]
     * @param string      $storeField Popisek hodnoty
     * @param bool        $required
     *
     * @return ComboBox
     */
    public function addComboBoxStore(string $name, ?string $label = null, array $storeUrl = ['module' => 'admin'], string $storeField = 'Name', bool $required = false, bool $multi = false): ComboBox
    {
        $control = new ComboBox($this->super, $name, $label, $required, $storeUrl, $storeField, $multi);
        $control->setColumnSize($this->defaultColumnSize);
        $control->setParentForm($this->parent);
        $this->formControls[] = $control;

        return $control;
    }

    public function addAjaxComboBoxStore(string $name, ?string $label = null, array $storeUrl = ['module' => 'admin'], string $storeField = 'Name', ?string $depends = null, bool $required = false): ComboBox
    {
        $control = new ComboBox($this->super, $name, $label, $required, $storeUrl, $storeField, false, $depends);
        $control->setColumnSize($this->defaultColumnSize);
        $control->setParentForm($this->parent);
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Alias metody addComboBoxEnum
     *
     * @param string      $name
     * @param string|null $label
     * @param array       $enumValues
     * @param bool        $required
     *
     * @return ComboBox
     */
    public function addSelect(string $name, ?string $label, array $enumValues = [], bool $required = false): ComboBox
    {
        $control = $this->addComboBoxEnum($name, $label, $enumValues, $required);

        return $control;
    }

    /**
     * Přidá selectbox s hodnotami z pole
     *
     * @param string      $name
     * @param string|null $label
     * @param array       $enumValues
     * @param bool        $required
     * @param bool        $multi
     *
     * @return ComboBox
     */
    public function addComboBoxEnum(string $name, ?string $label = null, array $enumValues = [], bool $required = false, $multi = false): ComboBox
    {
        $control = new ComboBox($this->super, $name, $label, $required, $enumValues, [], $multi);
        $control->setColumnSize($this->defaultColumnSize);
        $control->setParentForm($this->parent);
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Přidá multiselect
     *
     * @param string      $name
     * @param string|null $label
     * @param array       $enumValues
     * @param bool        $required
     *
     * @return ComboBox
     */
    public function addMultiSelect(string $name, ?string $label, ?array $enumValues = [], bool $required = false): ComboBox
    {
        $control = $this->addComboBoxEnum($name, $label, $enumValues, $required, true);

        return $control;
    }

    /**
     * Přidá pole pro nahrání souboru
     *
     * @param string      $name
     * @param string|null $label
     * @param array       $fileUploadUrl Pole s cestou k upload akci [module, controller, action, parametry]
     *
     * @return FileBox
     */
    public function addFileBox(string $name, ?string $label = null, ?array $fileUploadUrl = [
        'module' => 'common',
        'controller' => 'file',
        'action' => 'upload'
    ], $preview = false, $path = null
    ) {
        $control = new FileBox($this->super, $name, $label, $fileUploadUrl);
        $control->setColumnSize($this->defaultColumnSize);
        $control->setParentForm($this->parent);

        if(isset($fileUploadUrl['folder']))
            $control->getControlPart()->setAttribute('data-folder', $fileUploadUrl['folder']);

        if($preview){
            $group = Html::el('div', ['class' => 'form-input-group col-md-12']);
            $imgControl = Html::el('img', ['data-imgpreview' => $name, 'data-imgpath' => $path]);

            $group->insert(null, $imgControl);
            $this->formControls[] =  $group;
        }

        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Přidá pole pro nahrání souboru
     *
     * @param string      $name
     * @param string|null $label
     * @param array       $fileUploadUrl Pole s cestou k upload akci [module, controller, action, parametry]
     * @param array       $options Pole pro parovací tabulku [url => 'admin/order-image', identifier => 'OrderState_ID']
     *
     * @return FileBox
     */
    public function addMultiFileBox(string $name, ?string $label = null, ?array $fileUploadUrl = [
        'module' => 'common',
        'controller' => 'file',
        'action' => 'upload'
    ], $callback = null,
    array $options = null
    ) {
        $control = new FileBox($this->super, $name, $label, $fileUploadUrl, true);
        $control->setColumnSize($this->defaultColumnSize);
        $control->setParentForm($this->parent);
        $control->getControlPart()->setAttribute('data-callback', $callback);
        $control->getControlPart()->setAttribute('data-multiupload', true);
        if($options) {
            $options['url'] = _bu() . '/' . $options['url'] . '/data-create';
            $control->getControlPart()->setAttribute('data-multiupload-url', json_encode($options));
        }
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Přidá checkbox
     *
     * @param string      $name
     * @param string|null $label
     * @param bool        $required
     *
     * @return Checkbox
     */
    public function addCheckBox(string $name, ?string $label = null, bool $required = false): Checkbox
    {
        $control = new Checkbox($this->super, $name, $label, $required);
        $control->setColumnSize($this->defaultColumnSize);
        $control->setParentForm($this->parent);
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Přidá radiobutton s hodnotami ano/ne
     *
     * @param string      $name
     * @param string|null $label
     * @param bool        $noneOption
     *
     * @return RadioButton
     */
    public function addBoolRadioButton(string $name, ?string $label = null, bool $noneOption = false): RadioButton
    {
        $control = $this->addRadioButton($name, $label);
        $items = [
            '1' => Lang::getInstance()->translate('YES'),
            '0' => Lang::getInstance()->translate('NO'),
        ];
        if ($noneOption) {
            $items[null] = Lang::getInstance()->translate('NONE');
        }
        $control->addDataItems($items);

        return $control;
    }

    /**
     * Přidá radiobutton
     *
     * @param string      $name
     * @param string|null $label
     * @param array       $items
     *
     * @param bool        $required
     *
     * @return RadioButton
     */
    public function addRadioButton(string $name, ?string $label = null, array $items = [], bool $required = false): RadioButton
    {
        $control = new RadioButton($this->super, $name, $label, $required);
        $control->setColumnSize($this->defaultColumnSize);
        $control->setParentForm($this->parent);
        $control->addDataItems($items);
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Přidá float pole, které musí být násobeno 100
     *
     * @param string      $name
     * @param string|null $label
     * @param bool        $required
     *
     * @return TextInput
     */
    public function addCurrencyBox(string $name, ?string $label = null, bool $required = false): TextInput
    {
        $control = $this->addFloatingPointBox($name, $label, $required);
        $control->getControlPart()->setAttribute('data-currency', '1');


        return $control;
    }

    /**
     * Přidá float pole
     *
     * @param string      $name
     * @param string|null $label
     * @param bool        $required
     *
     * @return TextInput
     */
    public function addFloatingPointBox(string $name, ?string $label = null, bool $required = false): TextInput
    {
        $control = new TextInput($this->super, $name, $label, $required, $type = TextInput::TYPE_FLOAT);
        $control->setColumnSize($this->defaultColumnSize);
        $control->setParentForm($this->parent);
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Přidá skryté pole
     *
     * @param string $name
     *
     * @return TextInput
     */
    public function addHidden(string $name): TextInput
    {
        $control = new TextInput($this->super, $name, null, false, $type = TextInput::TYPE_HIDDEN);
        $control->setColumnSize($this->defaultColumnSize);
        $control->setParentForm($this->parent);
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Vrací rodičovský formulář
     *
     * @return mixed
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * Render prvku
     *
     * @return string
     */
    public function __toString()
    {
        if ($this->label != null) {
            $heading = Html::el('div', [
                'class' => 'col-12'
            ]);
            $heading->insert(null, Html::el('h2', $this->label));
            $this->element->insert(null, $heading);
        }
        foreach ($this->formControls as $control) {
            if(is_a($control,'Jolanda\Controls\Grid\SubGrid') || is_a($control,'Jolanda\Controls\Grid\SubGridVue')){
                $div = Html::el('div', [
                    'class' => 'col-12 form-input-group'
                ]);
                $div->insert(null, $control->render());
                $this->element->insert(null, $div);
                continue;
            }
            if(is_a($control,'Jolanda\Controls\Form\Controls\FormGroup')){
                $div = Html::el('div', [
                    'class' => 'col-12 sub-form-group'
                ]);
                $div->insert(null, $control->__toString());
                $this->element->insert(null,  $div);
                continue;
            }


            if ($this->data_attribute != null) {
                $control->setName($this->data_attribute . '[' . $control->getName() . ']');
                $control->setParentForm($this->parent);
            }
            //                $control->getControlPart()->setAttribute('name', $control->getControlPart()->getAttribute('name') . '[' . $this->data_attribute . ']');
            $this->element->insert(null, $control);
        }

        return $this->element->render();
    }

    /**
     * Přidá block editor
     *
     * @param string      $name
     *
     * @return RadioButton
     */
    public function addBlockEditor(string $name): BlockEditor
    {
        $control = $this->addTextArea($name);
        $control->setParentForm($this->parent);
        $control->setColumnSize($this->defaultColumnSize);
        $control->getControlPart()->hidden = true;
        $control->getControlPart()->appendAttribute('blockeditor', $name);

        $control = new BlockEditor($this->super, $name, $name);
        $control->setColumnSize($this->defaultColumnSize);
        $this->formControls[] = $control;

        return $control;
    }

    /**
     * Přidá block editor
     *
     * @param string      $name
     *
     * @return RadioButton
     */
    public function addDynamicBlockEditor(string $name, string $defaultName, array $names): BlockEditor
    {
        foreach ($names as $key => $label){
            $control = $this->addTextArea($key);
            $control->setParentForm($this->parent);
            $control->setColumnSize($this->defaultColumnSize);
            $control->getControlPart()->hidden = true;
            $control->getControlPart()->appendAttribute('blockeditor', $key);
            $control->getElement()->setAttribute('class', 'd-none');
        }


        $control = new BlockEditor($this->super, $name, $defaultName);
        $control->setColumnSize($this->defaultColumnSize);
        $control->getControlPart()->appendAttribute('dynamic', 1);

        $selectControl = $this->addComboBoxEnum($control->getName() . '_names', '', $names)->setValue($defaultName);

        $this->formControls[] = $control;

        return $control;
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
        $columnSize = 12;
        if ($this->defaultColumnSize > 12) {
            $columnSize = 12;
        } elseif ($this->defaultColumnSize == 0) {
            $columnSize = 'auto';
        } elseif ($this->defaultColumnSize < 1) {
            $columnSize = 1;
        } else {
            $columnSize = $this->defaultColumnSize;
        }

        $control = Html::el('div', ['class' => 'form-input-group col-md-'.$columnSize]);
        $content = Html::el('div');
        $content->setHtml($html);

        $control->insert(null, $content);
        $this->formControls[] = $control;

        return $content;
    }

    /**
     * @return string|null
     */
    public function getId(): ?string
    {
        return $this->id;
    }

    /**
     * @param string|null $id
     */
    public function setId(?string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getFormControls(): array
    {
        return $this->formControls;
    }

    public function getFormControl($name): ?FormControl
    {
        foreach ($this->getFormControls() as $control){
            if($control->getName() === $name)
                return $control;
        }

        return null;
    }

    public function addFormGroup(string $title): FormGroup
    {
        $formGroup = new FormGroup($this, $title);
        $this->formGroups[] = $formGroup;
        $this->formControls[] = $formGroup;
        $formGroup->setDefaultColumnSize(12);

        return $formGroup;
    }

    public function toArray(): array
    {
        foreach ($this->formControls as $control){
            if ($this->data_attribute != null) {
                $control->setName($this->data_attribute . '[' . $control->getName() . ']');
                $control->setParentForm($this->parent);
            }
        }

        $formControls = array_map(function ($control) {
            return method_exists($control, 'toArray') ? $control->toArray() : (string)$control;
        }, $this->formControls);

        return [
            'id' => $this->id,
            'label' => $this->label,
            'element' => $this->element ? $this->extractHtmlAttributes($this->element) : null,
            'defaultColumnSize' => $this->defaultColumnSize,
            'dataAttribute' => $this->data_attribute,
            'formControls' => $formControls,
            'formGroups' => array_map(function ($group) {
                return $group->toJson();
            }, $this->formGroups),
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
