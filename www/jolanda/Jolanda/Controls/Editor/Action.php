<?php


namespace Jolanda\Controls\Editor;


use Nette\Utils\Html;

class Action
{

    /**
     * Rodičovská položka
     *
     * @var EntityEditor|Action
     */
    private $parent;

    /**
     * @var Html
     */
    private $button;

    /**
     * Pole podakcí
     *
     * @var array
     */
    private $subactions = [];

    /**
     * Text pro tooltip
     *
     * @var string|null
     */
    private $help_text;

    /**
     * @var string
     */
    private $id;

    /**
     * @var string
     */
    private $label;

    /**
     * @var string|null
     */
    private $icon;

    private $visible_create;
    private $visible_update;
    private $onclick;
    private $type;

    public function __construct(
        $parent,
        string $id,
        string $label,
        ?string $icon = null,
        $visible_create = true,
        $visible_update = true,
        $onclick = null
    ) {
        $this->parent = $parent;
        $this->id = $id;
        $this->label = $label;
        $this->icon = $icon;
        $this->visible_update = $visible_update;
        $this->visible_create = $visible_create;
        $this->onclick = $onclick;

        $type = is_a($this->parent, EntityEditor::class) ? 'button' : 'div';
        $this->type = $type;

        $this->button = Html::el($type);
        $this->button->setHtml($this->label);
        $this->button->setAttribute('id', $this->id);
        $this->button->setAttribute('class', ($type == 'button') ? 'btn btn-dark' : 'dropdown-item');
        $this->button->setAttribute('data-create', $visible_create ? 'true' : 'false');
        $this->button->setAttribute('data-update', $visible_update ? 'true' : 'false');
        $this->button->setAttribute('onclick', $onclick);
    }

    /**
     * @return Html
     */
    public function getButton(): Html
    {
        return $this->button;
    }

    public function addAction(
        string $id,
        string $label,
        ?string $icon = null,
        $visible_create = true,
        $visible_update = true,
        $onclick = null
    ): Action {
        $subaction = new Action($this, $id, $label, $icon, $visible_create, $visible_update, $onclick);
        $this->subactions[] = $subaction;

        return $subaction;
    }

    public function __toString(): string
    {
        $container = Html::el('div', [
            'class' => 'custom-header-button'
        ]);
        if (!empty($this->subactions)) {
            $this->button->appendAttribute('class', 'dropdown-toggle');
            $this->button->setAttribute('data-toggle', 'dropdown');
            $container->appendAttribute('class', 'dropdown');
            $dropdown = Html::el('div', [
                'class' => 'dropdown-menu'
            ]);
            foreach ($this->subactions as $subaction) {
                $dropdown->insert(null, $subaction->getButton());
            }
            $container->insert(1, $dropdown);
        }
        $container->insert(0, $this->button);

        return $container;
    }

    public function toJson(): string{
        return json_encode($this->toArray());
    }

    public function toArray(): array{
        $subactions = [];
        foreach ($this->subactions as $subaction){
            $subactions[] = $subaction->toArray();
        }

        $array = [
            'button' => $this->button ? $this->extractHtmlAttributes($this->button) : null,
            'subactions' => $subactions,
            'help_text' => $this->help_text,
            'id' => $this->id,
            'label' => $this->label,
            'icon' => $this->icon,
            'visible_create' => $this->visible_create,
            'visible_update' => $this->visible_update,
            'onclick' => $this->onclick,
            'type' => $this->type,
        ];

        return $array;
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