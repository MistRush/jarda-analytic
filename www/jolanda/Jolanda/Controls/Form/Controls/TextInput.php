<?php

namespace Jolanda\Controls\Form\Controls;

use Jolanda\Translations\Lang;
use Nette\Utils\Html;


/**
 * Class TextInput
 *
 * @package Jolanda\Controls\Form\Controls
 */
class TextInput extends FormControl
{

    const TYPE_TEXT = 'text', TYPE_EMAIL = 'email', TYPE_PASSWORD = 'password', TYPE_NUMBER = 'number', TYPE_FLOAT = 'float', TYPE_HIDDEN = 'hidden';

    public function __construct($super, string $name, ?string $label = null, bool $required = false, $type = self::TYPE_TEXT)
    {
        parent::__construct($super, $name, $label);
        $this->controlPart = Html::el('input', ['type' => ($type == self::TYPE_FLOAT) ? 'number' : $type]);
        $this->controlPart->setAttribute('class', 'form-control');
        $this->controlPart->setAttribute('autocomplete', 'false');
        if ($type == self::TYPE_FLOAT) {
            $this->controlPart->setAttribute('step', '0.01');
            $this->addRule(FormControl::VALIDATOR_PATTERN, Lang::getInstance()->translate('FORM_VALIDATION_FLOAT'), "^([0-9.]+)*$");
        } else {
            if ($type == self::TYPE_HIDDEN) {
                $this->element->setAttribute('class', 'd-none');
                $this->setRenderLabel(false);
            }
        }

        if ($required) {
            $this->setRequired();
        }

    }

    public function setValue($value)
    {
        parent::setValue($value);
        $this->controlPart->setAttribute('value', $value);

        return $this;
    }

    public function toArray(): array
    {
        // Získání základního JSON z FormControl
        $array = parent::toArray();

        // Pokud je typ FLOAT, přidáme krok (step)
//        if ($this->controlPart->getAttribute('type') === self::TYPE_FLOAT) {
//            $array['controlPart']['attributes']['step'] = $this->controlPart->getAttribute('step');
//        }
        $array['type'] = $this->controlPart->getAttribute('type');

        return $array;
    }

}