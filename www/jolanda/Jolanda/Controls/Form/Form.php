<?php

namespace Jolanda\Controls\Form;

use Jolanda\Controls\Form\Controls\FormControl;
use Jolanda\Controls\Form\Controls\FormGroup;
use Jolanda\Latte\Latte;
use Nette\Utils\Html;
use Tracy\Debugger;

/**
 * Class Form
 *
 * @package Jolanda\Controls\Form
 */
class Form
{

    /**
     * ID formuláře
     *
     * @var string|null
     */
    protected $id = null;

    /**
     * Pole formulářových skupin
     *
     * @var array[FormGroup]
     */
    protected $formGroups = [];

    /**
     * HTML Form element
     *
     * @var Html
     */
    protected $element;

    /**
     * Rodičovská instance
     *
     * @var mixed
     */
    protected $super;

    /**
     * Pole formulářových tlačítek
     *
     * @var array[Html]
     */
    private $buttons = [];

    /**
     * Šablona pro renderování formuláře
     *
     * @var string|null
     */
    private $templatePath;

    /**
     * Form constructor.
     */
    public function __construct($super = null)
    {
        $this->element = Html::el('form');
        $this->id = 'form_' . substr(md5(mt_rand()), 0, 7);
        $this->element->setAttribute('id', $this->id);
        $this->element->setAttribute('enctype', "multipart/form-data");
        $this->super = $super;
    }

    /**
     * Vrací element formuláře
     *
     * @return Html
     */
    public function getElement(): Html
    {
        return $this->element;
    }

    /**
     * Nastavuje URL akce při odeslání formuláře
     *
     * @param string $action
     */
    public function setAction(string $action): Form
    {
        $this->element->setAttribute('action', $action);

        return $this;
    }

    /**
     * Vrací formulářové skupiny
     *
     * @return array[FormGroup]
     */
    public function getFormGroups(): array
    {
        return $this->formGroups;
    }

    /**
     * Přidá formulářovou skupinu
     *
     * @param string $label Titulek skupiny
     *
     * @return FormGroup
     */
    public function addFormGroup(?string $label = null, ?string $id = null): FormGroup
    {
        $formGroup = new FormGroup($this, $label, $id);
        $this->formGroups[] = $formGroup;

        return $formGroup;
    }

    /**
     * Přidá tlačítko na konec formuláře
     *
     * @param string $label   Popisek
     * @param string $type    Typ tlačítka
     * @param string $classes Třídy tlačítka
     *
     * @return Html
     */
    public function addButton(string $label, string $type = 'button', $classes = 'btn btn-primary'): Html
    {
        $button = Html::el('button', [
            'type' => $type,
            'class' => $classes
        ]);
        $button->setText($label);
        $this->buttons[] = $button;

        return $button;
    }

    /**
     * Nastavuje zda má být formulář odesílán pomocí AJAXu
     *
     * @param bool $ajax
     */
    public function setAjax(bool $ajax = true)
    {
        $this->element->setAttribute('data-ajax', (string)$ajax);

        return $this;
    }

    /**
     * @return mixed
     */
    public function getSuper()
    {
        return $this->super;
    }

    /**
     * Render formulářové skupiny
     *
     * @return string
     */
    public function render()
    {
        $latte = Latte::getInstance()->getEngine();

        if(!$this->templatePath){
            foreach ($this->formGroups as $group) {
                $this->element->insert(null, $group);
            }
        }else{
            $renderedTemplate = $latte->renderToString($this->templatePath, ['form' => $this]);
        }

        if (!empty($this->buttons)) {
            $buttons = Html::el('div', ['class' => 'form-group']);
            foreach ($this->buttons as $button) {
                $buttons->insert(null, $button);
            }
            $this->element->insert(null, $buttons);
        }
        if ($this->id != null) {
            $this->element->setAttribute('id', $this->id);
        }

        $params = [
            "id" => $this->id,
            "form" => $this->templatePath ? $renderedTemplate : $this->element->render(),
        ];

        $html = new Html();
        $html->setHtml($latte->renderToString(__DIR__ . '/latte/form.latte', $params));

        return $html;
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->getId();
    }

    /**
     * Vrací ID formuláře
     *
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * Nastavuje ID formláře
     *
     * @param string $id
     */
    public function setId(string $id): Form
    {
        $this->id = $id;

        return $this;
    }

    public function setTemplate(string $templatePath): self
    {
        $this->templatePath = $_SERVER["DOCUMENT_ROOT"]._bu().'/../application/modules/' . $templatePath;

        return $this;
    }

    public function getFormGroup($id): ?FormGroup
    {
        foreach ($this->getFormGroups() as $group){
            if($group->getId() === $id)
                return $group;
        }

        return null;
    }

    public function getFormControl($name): ?FormControl
    {
        foreach ($this->getFormGroups() as $group) {
            $control = $group->getFormControl($name);
            if ($control)
                return $control;
        }

        return null;
    }

    public function getFormControls(): array
    {
        $controls = [];

        foreach ($this->getFormGroups() as $group) {
            $controls = array_merge($controls, $group->getFormControls());
        }

        return $controls;
    }

    public function hasControls(): bool
    {
        return count($this->getFormControls()) > 0;
    }

    public function toJson() {
        return json_encode($this->toArray());
    }

    public function toArray(){
        $formGroups = array_map(function($group) {
            return $group->toArray();  // Každá skupina by také měla vlastní serializační metodu
        }, $this->formGroups);

        $data = [
            'id' => $this->id,
            'formGroups' => $formGroups,
            'element' => $this->element ? $this->extractHtmlAttributes($this->element) : null,
            'buttons' => array_map(function($button) {
                return [
                    'label' => (string) $button->getText(),
                    'type' => (string) $button->getAttribute('type'),
                    'classes' => (string) $button->getAttribute('class')
                ];
            }, $this->buttons),
            'ajax' => $this->element ? $this->element->getAttribute('data-ajax') ?? false : false
        ];

        return $data;
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