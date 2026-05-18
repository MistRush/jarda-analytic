<?php

namespace Jolanda\Controls\Form\Controls;

use Nette\Utils\Html;

/**
 * Class TextArea
 *
 * @package Jolanda\Controls\Form\Controls
 */
class TextArea extends FormControl
{

    public function __construct($super, string $name, ?string $label = null, bool $required = false)
    {
        parent::__construct($super, $name, $label);
        $this->controlPart = Html::el('textarea');
        $this->controlPart->setAttribute('class', 'form-control');

        if ($required) {
            $this->setRequired();
        }
    }

    public function setValue($value)
    {
        parent::setValue($value);
        $this->controlPart->setText($value);

        return $this;
    }

    public function setRows(int $count): TextArea
    {
        $this->controlPart->setAttribute('rows', $count);

        return $this;
    }

    public function toArray(): array
    {
        // Získání základního JSON z FormControl
        $array = parent::toArray();

        return $array;
    }

}