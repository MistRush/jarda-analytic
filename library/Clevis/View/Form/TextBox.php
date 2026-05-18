<?php

/**
 * Class that represents Input TextBox
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Form_TextBox extends Clevis_View_Form_Item {

    /**
     * ValidationTextBox required
     *
     * @var string
     */
    private $required;

    /**
     * Constructor
     */
    public function  __construct() {
        parent::__construct();
        $this->setType('dijit.form.ValidationTextBox');
        $this->setTag('input', true);
        $this->setRequired(false);
    }

    /**
     * Set required
     *
     * @param string $required
     * @return void
     */
    public function setRequired($required) {
        $this->required = $required;
    }

    /**
     * Get required
     *
     * @return string $required
     */
    public function getRequired() {
        return $this->required;
    }

    /**
     * Set readOnly
     *
     * @param string $readOnly
     * @return void
     */
    public function setReadOnly($readOnly) {
        $this->setElementAttribute('readonly', $readOnly);
        $this->setElementAttribute('disabled', $readOnly);
        $this->setStyle('background-color', '#eee');
    }

    /**
     * Get readOnly
     *
     * @return string $readOnly
     */
    public function getReadOnly() {
        return $this->getAttribute('readonly');
    }

    /**
     * Set text maximum length
     *
     * @param $maximumLength
     * @return void
     */
    public function setMaximumLength($maximumLength) {
        $this->setDojoAttribute('maxLength', $maximumLength);
    }

    /**
     * Set validatorType
     *
     * @param string $validatorType
     * @return void
     */
    public function setValidatorType($validatorType) {
        $validator = self::getValidator($validatorType);
        $this->setElementAttribute('data-dojo-props', self::formatValidator($validator));
    }

    /**
     * Set custom validator type
     * 
     * @param $regExp
     * @param $invalidMessage
     * @return void
     */
    public function setValidatorCustom($regExp, $invalidMessage) {
        $this->setElementAttribute('data-dojo-props',"regExp:'" . $regExp . "', invalidMessage:'" . $invalidMessage . "'");
    }

    /**
     * Pre render text box
     */
    public function preRender() {
        parent::preRender();
        if ( $this->required ) {
            $this->setElementAttribute('required', true);
        }
    }

    /**
     * @param $validatorType
     * @return validator
     * @throws Exception
     */
    public static function getValidator($validatorType)
    {
        switch ($validatorType) {
            case VALIDATOR_NUMERIC:
                return array('regExp' => '^\\\\d+$', 'invalidMessage' => 'Zadejte číselnou hodnotu!');
            case VALIDATOR_FLOATING_POINT:
                return array('regExp' => '^\\\\d+(\\\\.\\\\d+)?$|^\\\\.\\\\d+$', 'invalidMessage' => 'Zadejte správnou číselnou hodnotu!');
            case VALIDATOR_CURRENCY:
                return array('invalidMessage' => 'Zadejte správnou číselnou hodnotu!<br /> V případě desetinných míst je potřeba použít desetinou čárku a maximálně 2 desetinná místa.');
            case VALIDATOR_EMAIL:
                return array('regExp' => '[a-z0-9.+_-]+@[a-z0-9.+_-]+\\.[a-z]{2,}', 'invalidMessage' => 'Emailová adresa musí být ve formátu nazev@domena.cz!');
            case VALIDATOR_ZIP_CODE:
                return array('regExp' => '\\\\d{5}', 'invalidMessage' => 'PSČ je tvořeno pouze 5 čísly!');
            case VALIDATOR_TIME:
                return array('regExp' => '^[0-2]?[0-9]:[0-5][0-9]$', 'invalidMessage' => 'Zadejte správnou časovou hodnotu (např. 6:04).');
            default:
                throw new Exception('Unknown validator type "' . $validatorType . '".');
        }
    }

    /**
     * @param $validator
     * @return formatted validator
     */
    public static function formatValidator($validator)
    {
        $validatorText = '';
        if ( array_key_exists('regExp', $validator) ) {
            $validatorText .= 'regExp:\'' . $validator['regExp'] . '\'';
        }
        if ( array_key_exists('invalidMessage', $validator) ) {
            if ( strlen($validatorText) > 0 ) {
                $validatorText .= ', ';
            }
            $validatorText .= 'invalidMessage:\'' . $validator['invalidMessage'] . '\'';
        }
        return $validatorText;
    }

}
?>