<?php
use admin\components\TranslationComponents;
use Jolanda\Controls\Form\Form;

class Admin_TranslationController extends Admin_Controller_Action {

    public function init() {
        $this->translation = Default_Logic_Translation::getInstance();

        parent::init();
    }

    public function indexAction() {
        /*$languages = Languages::getInstance()->getActiveLanguagesArray();
        unset($languages['CZ']);*/

        $languages = [
            'sk' => 'Slovenština'
        ];

        $langEditSelectForm = new Form();
        $langEditSelectForm->setAction(_bu().'/admin/translation/edit-translation');
        $group = $langEditSelectForm->addFormGroup('');
        $group->addSelect('lang', 'Jazyk', $languages, true);
        $langEditSelectForm->addButton('Upravit', 'submit');

        $langDownloadSelectForm = new Form();
        $langDownloadSelectForm->setAction(_bu().'/admin/translation/download-translation');
        $group = $langDownloadSelectForm->addFormGroup('');
        $group->addSelect('lang', 'Jazyk', $languages, true);
        $langDownloadSelectForm->addButton('Stáhnout', 'submit');

        $langUploadForm = new Form();
        $langUploadForm->setAction(_bu() . '/admin/translation/upload-translation');
        $langUploadForm->getElement()->setAttribute('method', 'POST');
        $group = $langUploadForm->addFormGroup('');
        $group->addSelect('lang', 'Jazyk', $languages, true);
        $group->addSelect('type', 'Způsob doplnění', [
            'rewrite_missing' => 'Doplnit (přepsat) pouze chybějící',
            'rewrite' => 'Přepsat vše',
        ]);
        $group->addFileBox('file', 'Soubor', null);

        $langUploadForm->addButton('Nahrát', 'submit');

        $this->renderLatte([
            'langEditSelectForm' => $langEditSelectForm,
            'langDownloadSelectForm' => $langDownloadSelectForm,
            'langUploadForm' => $langUploadForm
        ]);
    }

    public function editTranslationAction() {
        $locale = $this->getRequest()->getParam('lang');
        $this->translation->generateTemplate();
        $this->translation->updateFromPot($locale);
        $strings = $this->translation->getStrings($locale);

        $form = TranslationComponents::createStringsForm($strings);

        $this->renderLatte([
            'form' => $form,
            'locale' => $locale
        ]);
    }

    public function downloadTranslationAction() {
        $locale = strtolower($this->getRequest()->getParam('lang'));
        $this->translation->generateTemplate();
        $this->translation->updateFromPot($locale);
        $file = Default_Logic_Translation::TRANSLATION_FOLDER.$locale.'.po';

        header('Content-Description: File Transfer');
        header('Content-Disposition: attachment; filename='.basename($file));
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: '.filesize($file));
        header("Content-Type: text/plain");
        readfile($file);
    }

    public function processEditTranslationAction() {
        $data = json_decode($this->getRequest()->getParam('data'));
        $this->translation->updateCatalog('sk', $data);
    }

    public function uploadTranslationAction() {
        $file = $_FILES['file'];
        $locale = $this->getRequest()->getParam('lang');
        $type = $this->getRequest()->getParam('type');

        $this->translation->updateFromFile($file['tmp_name'], $locale, $type);

        $this->_helper->redirector('index', 'translation', 'default');
    }
}
