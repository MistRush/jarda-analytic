<?php

namespace Jolanda\Controls\Form\Controls;

use Nette\Utils\Html;

/**
 * Class DateBox
 *
 * @package Jolanda\Controls\Form\Controls
 */
class DateBox extends FormControl
{

    const TYPE_DATE = 'datepicker';
    const TYPE_DATETIME = 'datetimepicker';
    const TYPE_TIME = 'timepicker';
    const TYPE_TIME_H = 'timepickerH';
    const TYPE_TIME_HM = 'timepickerHM';
    const TYPE_TIME_HMS = 'timepickerHMS';

    private $dateType;

    public function __construct($super, string $name, ?string $label = null, bool $required = false, $dateType = self::TYPE_DATE)
    {
        parent::__construct($super, $name, $label);
        $this->dateType = $dateType;
        $this->controlPart = Html::el('input type=text');
        $this->controlPart->setAttribute('class', 'form-control ' . $dateType);
        $this->controlPart->setAttribute('data-' . $dateType, true);
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

        $array['dateType'] = $this->dateType;

        return $array;
    }

}