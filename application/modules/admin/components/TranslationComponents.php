<?php
namespace admin\components;

use Jolanda\Controls\Form\Form;

/**
 * Class TranslationComponents
 * @package admin\components
 */
class TranslationComponents {

    /**
     * @param $strings
     * @return Form
     */
    public static function createStringsForm($strings) {
        $form = new Form();
        $form->setAction(_bu() . '/admin/translation/process-edit-translation');
        $group = $form->addFormGroup('');

        $columns = array_column($strings, 'orig');
        array_multisort($columns, SORT_ASC, $strings);
        $group->addEmpty()->setAttribute('id', 'empty');
        foreach ($strings as $id => $string) {
             $input = $group->addTextBox($id, $string['orig']);
             $input->setValue($string['text']);
             if ($string['text'] == '')
                 $input->getElement()->setAttribute('class', 'has-error');
        }
        $form->addButton('Save', 'submit');

        return $form;
    }
}