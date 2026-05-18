<?php

namespace Jolanda\Controls\Grid;

use Nette\Utils\Html;

class Action
{

    /**
     * Grid
     *
     * @var Grid
     */
    private $grid;

    /**
     * Tlačítko v hlavičce
     *
     * @var Html
     */
    private $headerButton;

    /**
     * Tlačítko v kontextovém menu
     *
     * @var Html
     */
    private $contextButton;

    /**
     * Tlačítko v řádku
     *
     * @var Html
     */
    private $rowButton;

    /**
     * Viditelnost
     *
     * @var array|bool[]
     */
    private $visibility;

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

    private $id;
    private $label;
    private $onclick;

    /**
     * Action constructor.
     *
     * @param Grid         $grid
     * @param string       $id
     * @param string       $label
     * @param string|null  $onclick
     * @param array|bool[] $visibility
     */
    public function __construct(Grid $grid, string $id, string $label, string $onclick = null, array $visibility = [
        true,
        true,
        true
    ]
    ) {
        $this->grid = $grid;
        $this->id = $id;
        $this->label = $label;
        $this->onclick = $onclick;

        $this->visibility = [
            'header' => $visibility[0],
            'context' => $visibility[1],
            'row' => $visibility[2]
        ];

        $this->headerButton = Html::el('button', [
            'class' => 'btn btn-dark',
            'id' => $id . '_header',
            'type' => 'button',
            'data-toggle' => 'bstooltip',
            'onclick' => $onclick,
        ]);
        $this->headerButton->setText($label);
        $this->contextButton = Html::el('li', [
            'id' => $id . '_context',
            'onclick' => $onclick
        ]);
        $this->contextButton->setText($label);

        $fn = explode('(', $onclick)[0];
        $args = [];
        preg_match('#\((.*?)\)#', $onclick, $args);
        $args = isset($args[1]) ? $args[1] : '';
        $this->rowButton = Html::el('button', [
            'class' => 'btn btn-icon',
            'onclick' => $grid->class . '.callRow(this, ' . $fn . ',[' . $args . '])',
            'id' => $id . '_row',
            'title' => $label,
            'type' => 'button'
        ]);
        $this->rowButton->setHtml("<i class='ci ci-cog'></i>");
    }

    /**
     * Přidá podakci
     *
     * @param string $id      ID položky
     * @param string $label   Název položky
     * @param string $onclick OnClick událost
     */
    public function addSubAction(string $id, string $label, string $onclick): Action
    {
        $this->subactions[] = [
            'id' => $id,
            'label' => $label,
            'onclick' => $onclick
        ];

        return $this;
    }

    /**
     * Nastavuje ikonu tlačítka v řádku
     *
     * @param string $icon Název ci-ikony
     */
    public function setIcon(string $icon): Action
    {
        $this->rowButton->setHtml("<i class='ci ci-{$icon}'></i>");
        $this->headerButton->setHtml("<i class='ci ci-{$icon} btn-ci'></i>" . $this->headerButton->getText());

        return $this;
    }

    /**
     * Renderuje tlačítko v hlavičce
     *
     * @return Html|string
     */
    public function renderHeader()
    {
        if ($this->visibility['header']) {
            $this->headerButton->setAttribute('title', $this->help_text);

            if (empty($this->subactions)) {
                return $this->headerButton;
            } else {
                $this->headerButton->setAttribute('class', $this->headerButton->getAttribute('class') . ' dropdown-toggle');
                $this->headerButton->setAttribute('data-toggle', 'dropdown');
                $this->headerButton->setAttribute('aria-expanded', 'false');
                $this->headerButton->removeAttribute('onclick');

                $dropdown = Html::el('div', ['class' => 'dropdown']);
                $dropdown->insert(null, $this->headerButton);
                $menu = Html::el('div', ['class' => 'dropdown-menu']);
                foreach ($this->subactions as $subaction) {
                    $item = Html::el('a', [
                        'href' => 'javascript:' . $subaction['onclick'],
                        'id' => $subaction['id'] . '_context',
                        'class' => 'dropdown-item'
                    ]);
                    $item->setText($subaction['label']);
                    $menu->insert(null, $item);
                }
                $dropdown->insert(null, $menu);

                return $dropdown;
            }
        } else {
            return '';
        }
    }

    /**
     * Vrací tlačítko v hlavičce
     *
     * @return Html
     */
    public function getHeaderButton(): Html
    {
        return $this->headerButton;
    }

    /**
     * Vrací tlačítko v kontextovém menu
     *
     * @return Html
     */
    public function getContextButton(): Html
    {
        return $this->contextButton;
    }

    /**
     * Vrací tlačítko v řádku
     *
     * @return Html
     */
    public function getRowButton(): Html
    {
        return $this->rowButton;
    }

    /**
     * Renderuje tlačítko v řádku
     *
     * @return string
     */
    public function renderRow()
    {
        if ($this->visibility['row'] && empty($this->subactions)) {
            return $this->rowButton->render();
        } else {
            return '';
        }
    }

    /**
     * Renderuje tlačítko v kontextovém menu
     *
     * @return Html|string
     */
    public function renderContext()
    {
        if ($this->visibility['context']) {
            if (empty($this->subactions)) {
                return $this->contextButton;
            } else {
                $this->contextButton->removeAttribute('onclick');
                $this->contextButton->appendAttribute('class', 'submenu');
                $menu = Html::el('ul', ['class' => 'dropdown']);
                foreach ($this->subactions as $subaction) {
                    $item = Html::el('li', [
                        'id' => $subaction['id'] . '_context',
                        'onclick' => $subaction['onclick']
                    ]);
                    $item->setText($subaction['label']);
                    $menu->insert(null, $item);
                }
                return $this->contextButton->insert(null, $menu);
            }
        } else {
            return '';
        }
    }

    public function getContextMenuItemSetting(){
        $data = [];

        if ($this->visibility['context']) {
            if (empty($this->subactions)) {
                $data['id'] = $this->id . '_context';
                $data['label'] = $this->label;
                $data['onClick'] = $this->onclick;
            } else {
                $data['id'] = $this->id . '_context';
                $data['label'] = $this->label;
                $data['onClick'] = $this->onclick;
                $data['subItems'] = [];
                foreach ($this->subactions as $subaction) {
                    $item = [
                        'id' => $subaction['id'],
                        'label' => $subaction['label'],
                        'onClick' => $subaction['onclick'],
                    ];
                    $data['subItems'][] = $item;
                }
            }
        }else{
            return null;
        }

        return $data;
    }

    /**
     * Vrací viditelnosti tlačítek
     *
     * @return array|bool[]
     */
    public function getVisibility(): array
    {
        return $this->visibility;
    }

    /**
     * @return string|null
     */
    public function getHelp(): ?string
    {
        return $this->help_text;
    }

    /**
     * @param string|null $help_text
     */
    public function setHelp(?string $help_text): Action
    {
        $this->help_text = $help_text;

        return $this;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getLabel(): string
    {
        return $this->label;
    }

    public function getOnclick(): ?string
    {
        return $this->onclick;
    }

    public function toArray(): array
    {
        $array = [
            'headerButton' => $this->headerButton ? $this->extractHtmlAttributes($this->headerButton) : null,
            'contextButton' => $this->contextButton ? $this->extractHtmlAttributes($this->contextButton) : null,
            'rowButton' => $this->rowButton ? $this->extractHtmlAttributes($this->rowButton) : null,
            'visibility' => $this->visibility,
            'subactions' => $this->subactions,
            'help_text' => $this->help_text,
            'id' => $this->id,
            'label' => $this->label,
            'onclick' => $this->onclick
        ];

        return $array;
    }

    public function toJson(){
        return json_encode($this->toArray());
    }

    private function extractHtmlAttributes(Html $htmlElement): array
    {
        return [
            'tag' => $htmlElement->getName(),
            'attributes' => $htmlElement->attrs,  // Získání všech atributů jako pole
            'text' => $htmlElement->getText(),    // Získání textového obsahu
            'html' => $htmlElement->getHtml(),       // Celý HTML obsah elementu jako string
        ];
    }



}