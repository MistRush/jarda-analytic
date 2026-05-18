<?php

class Clevis_Zend_Dojo_Form extends Zend_Dojo_Form {

    // Decorators pro tabulky at to muze byt ve dvou sloupcich

    // Decorator pro vytvoreni obal celeho formu do tabulky
    public $formDecoratorsTable = array(
        'FormElements',
        array(array('data'=>'HtmlTag'),
        array('tag'=>'table','class'=>'tableForm')),
        'DijitForm'
    );

    // Postupne pridava elementy do jednoho sloupce tabulky
    public $elementDecoratorsTable = array(
        'DijitElement',
        'Errors',
        array(array('data'=>'HtmlTag'),array('tag'=>'td','class'=>'tdForm')),
        array('Label',array('tag'=>'td','class'=>'labelForm')),
        array(array('row'=>'HtmlTag'),array('tag'=>'tr','class'=>'trForm'))
    );

    // Pridava elementy formulare do tabulky o dvou sloupcich, levy sloupec
    public $elementDecoratorsTableOpen = array(
        'DijitElement',
        'Errors',
        array(array('data'=>'HtmlTag'),array('tag'=>'td','class'=>'tdForm')),
        array('Label',array('tag'=>'td','class'=>'labelForm')),
        array(array('row'=>'HtmlTag'),array('tag'=>'tr','class'=>'trForm','openOnly'=>'true'))
    );

    // Pridava elementy formulare do tabulky o dvou sloupcich, pravy sloupec
    public $elementDecoratorsTableClose = array(
        'DijitElement',
        'Errors',
        array(array('data'=>'HtmlTag'),array('tag'=>'td','class'=>'tdForm')),
        array('Label',array('tag'=>'td','class'=>'labelForm')),
        array(array('row'=>'HtmlTag'),array('tag'=>'tr','class'=>'trForm','closeOnly'=>'true'))
    );

/*
 *      Moznost pridat znak text za element pomocí description
 *        $amountCollected->setDescription('Kč');
          $amountCollected->setDecorators(array(
            'DijitElement',
            'Errors',
            array(array('data'=>'HtmlTag'),array('tag'=>'td','class'=>'tdForm','style'=>'width: ')),
            array('Label',array('tag'=>'td','class'=>'labelForm')),
            array('Description',array('tag'=>'td','escape'=>false)),
            array(array('row'=>'HtmlTag'),array('tag'=>'tr','class'=>'trForm')),
        ));
*/

    // funkce pro odstraneni decorateru okolo skrytych elementu
    protected function _clearDecorocatorsForHiddenElement(Zend_Form_Element $element) {
        return $element->removeDecorator('label')
                       ->removeDecorator('HtmlTag');
    }

    // chybova hlaska pro spatne vyplnenou polozku formulare - currencyTextBox
    public $invalidMessageCurrency = 'Zadaná měnová hodnota není ve správném formátu';

    // chybova hlaska pro spatne vyplnenou polozku formulare - dateTextBox
    public $invalidMessageDate = 'Zadaný datum není ve správném formátu.';

    private static $elementCount = 0;

    public function addElement($element,$name = null,$options = null) {
        $element->setAttrib('id','form-element-' . Clevis_Zend_Dojo_Form::$elementCount++);
        return parent::addElement($element,$name,$options);
    }

}
?>