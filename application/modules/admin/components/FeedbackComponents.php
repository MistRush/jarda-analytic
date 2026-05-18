<?php
namespace admin\components;

use admin\logic\Navigation;
use Admin_Model_Feedback as Feedback;
use Admin_Model_FeedbackState as FeedbackState;
use common\logic\Eshop\Eshop;
use common\logic\Languages;
use Common_Model_File as File;
use Jolanda\Controls\Editor\EntityEditor;
use Jolanda\Controls\Form\Form;
use Jolanda\Controls\Grid\Grid;
use Jolanda\Controls\Grid\GridVue;
use Jolanda\Controls\Grid\QuickEditor;
use Jolanda\Menu\Menu;
use user\logic\UserAdminSession;
use User_Model_User as User;

class FeedbackComponents {
    const FEEDBACK = 'feedback';

    public static function createFeedbackGrid(): Grid {
        $grid = new GridVue(self::FEEDBACK, translate('Feedbacky'), 'admin/feedback/edit-feedback');

        $switches = $grid->getSwitchesForm();
        if (UserAdminSession::isSuperadmin()) {
            $switches->addComboBoxStore('userSelect', translate('Zobrazit jako'), ['module' => 'user', 'controller' => 'userOnlyAdmin', 'onlyAdmin' => true])->setColumnSize(2);
//            $switches->addComboBoxStore('Project_ID', translate('Projekt'),
//                ['module' => 'admin', 'controller' => 'project', 'acl' => true, 'onlyAdmin' => true]);
            $switches->addComboBoxStore('SolverUser_ID', translate('Řešitel'),
                ['module' => 'user', 'controller' => 'userOnlyAdmin', 'acl' => true, 'onlyAdmin' => true])->setColumnSize(2);
            $switches->addCheckBox('showAll', translate('Zobrazit vše'))->setValue($_COOKIE['showAll']??false)->setColumnSize(2);;
            $switches->addCheckBox('onlyPostponed', translate('Zobrazit odložené'))->setValue(false)->setColumnSize(2);;
        }

        $onlyAuthor = $_COOKIE['onlyAuthor']??false;

        $switches->addCheckBox('onlyAuthor', translate('Vytvořeno mnou'))->setValue($onlyAuthor)->setColumnSize(2);;

        $grid->enablePreview();
        $grid->setEnabledActions(false, true, UserAdminSession::isSuperadmin());
        $grid->setOrder('DateExpectedSolving');
        $grid->enableSearch('searchAs', translate('Vyhledat feedback dle čísla, obsahu, předmětu'));
        $grid->setUrl('admin/feedback');

        $grid->setRowFormatter('feedbackFormat');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'SolveFeedback', translate('Odpovědět'), 15)->setFormatFunction('formatQuickReplyIcon');
        $grid->addColumn(COLUMN_TEXT, 'FeedbackNumber', translate('Číslo feedbacku'))->setFilter()->setFormatFunction('formatCopyIcon');
        $grid->addColumn(COLUMN_BOOL, 'ErrorReporting', translate('Chyba'), 2)->setFilter();
        $grid->addColumn(COLUMN_ENUM, 'Priority', translate('Priorita'))->setFilter()->setEditable()->setEnumValues(Feedback::getPriorities());
        $grid->addColumn(COLUMN_DATE, 'DateTime', translate('Datum'));
        $grid->addColumn(COLUMN_TEXT, 'Header', translate('Hlavička'), 200);
        $grid->addColumn(COLUMN_TEXT, 'AuthorName', translate('Autor'));
//        $grid->addColumn(COLUMN_ENTITY, 'Project_ID', 'Projekt')->setEntity('ID', 'Name', ['module' => 'admin', 'controller' => 'project']);
        $grid->addColumn(COLUMN_ENTITY, 'SolverUser_ID', translate('Řešitel'))->setFilter()->setEntity('ID', 'Name', ['module' => 'user', 'controller' => 'user', 'onlyAdmin' => true]);
        $grid->addColumn(COLUMN_LONGTEXT, 'Content', translate('Obsah'));
        $grid->addColumn(COLUMN_ENUM, 'tmpState', translate('Stav'))->setEnumValues(FeedbackState::getStates());
//        $grid->addColumn(COLUMN_DATE, 'DateStartSolving', translate('Datum zač. řešení'));
        $grid->addColumn(COLUMN_DATE, 'DateExpectedSolving', translate('Předpoklad. datum vyřešení'));
        $grid->addColumn(COLUMN_NUMBER, 'FileCount', translate('Soubory'))->setMinWidth('20');

//        $grid->addAction('quickReply', translate('Rychlá odpověď'), 'showReply()')->setIcon('feedback');
        $grid->addAction('setUnread', translate('Označit jako nepřečtené'), 'setUnread()', [false, false, true])->setIcon('witness');

        return $grid;
    }

    public static function createFeedbackCreateEditor(): EntityEditor {
        $editor = new EntityEditor(self::FEEDBACK . '_create', 'Feedback', 'admin/feedback');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::FEEDBACK_INDEX)->getURL());
        $editor->enableStandalone();
        $tab = $editor->addTab(translate('Vytvoření feedbacku'));

        $group = $tab->addGroup(translate(''));
        $form = $group->addForm();
        $cantEdit = !UserAdminSession::isSuperadmin();
        $form->setColumns(2);
//        $form->addComboBoxStore('Project_ID', translate('Projekt'), array('module' => 'admin', 'controller' => 'project'), required: true);
            $form->addComboBoxStore('SolverUser_ID', translate('Primární řešitel'),
                ['module' => 'user', 'controller' => 'userOnlyAdmin', 'onlyAdmin' => true], 'FeedbackName', true)->setReadOnly($cantEdit);
        $form->addTextBox('Header', translate('Hlavička'), true)->setColumnSize(6);
        $form->addComboBoxEnum('Priority', translate('Priorita'), Feedback::getPriorities(), true);
        $form->addDateBox('DateStartSolving', translate('Datum začátku řešení'))->setReadOnly($cantEdit);
        $form->addDateBox('DateExpectedSolving', translate('Předpokládané datum vyřešení'));
        $form->addCheckBox('ErrorReporting', translate('Hlášení chyby'));
        $state = $form->addRadioButton('State', translate('Stav'));
        $state->addDataItems(FeedbackState::getStates(true));
        $state->setValue(FeedbackState::STATE_NEW);

        $group = $tab->addGroup( translate(''));
        $form = $group->addForm();
        $form->addMultiFileBox('files', '', [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload',
            'type' => File::TYPE_FEEDBACK_ATTACHMENT
        ]);
        $group = $tab->addGroup(translate('Místo pro vložení HTML/CSS/JS kódu'));
        $form = $group->addForm();
        $form->addTextArea('ScriptCodeContent');

        $group = $tab->addGroup(translate(''));
        $form = $group->addForm();
        $form->addEditor('Content')->setColumnSize(12);

        return $editor;
    }

    public static function createFeedbackEditor(): EntityEditor {
        $editor = new EntityEditor(self::FEEDBACK, 'Feedback', 'admin/feedback');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::FEEDBACK_INDEX)->getUrl());
        $editor->setEntityNameColumn('FeedbackNumber');
        $tab = $editor->addTab(translate('Feedback'), 'feedback');
        $group = $tab->addGroup(translate(''));
        $form = $group->addForm();
        $form->setColumns(2);
//        $form->addComboBoxStore('Project_ID', translate('Projekt'), array('module' => 'admin', 'controller' => 'project'), required: true);
        $isTemplate = null;
        $cantEdit = !UserAdminSession::isSuperadmin();
        $form->addComboBoxStore('CreatorUser_ID', translate('Autor'), array(
            'module' => 'user',
            'controller' => 'userOnlyAdmin',
            'onlyAdmin' => true
        ))->setReadOnly($cantEdit);
        $form->addTextBox('Header', translate('Hlavička'), true);
        $form->addComboBoxStore('SolverUser_ID', translate('Primární řešitel'), array(
            'module' => 'user',
            'controller' => 'userOnlyAdmin',
            'onlyAdmin' => true
        ), 'FeedbackName', true)->setReadOnly($cantEdit);



        $form->addRadioButton('Priority', translate('Priorita'), Feedback::getPriorities(), true);
        $form->addDateBox('DateStartSolving', translate('Datum začátku řešení'))->setReadOnly($cantEdit);
        $form->addTextBox('FeedbackNumber', translate('Číslo feedbacku'))->setReadOnly(true);
        $form->addDateBox('DateExpectedSolving', translate('Předpokládané datum vyřešení'))->setReadOnly($cantEdit);
        $form->addComboBoxEnum('tmpState', translate('Stav'), FeedbackState::getStates(), true)->setReadOnly($cantEdit);
        $form->addCheckBox('ErrorReporting', translate('Hlášení chyby'));

        $group = $tab->addGroup(translate('Místo pro vložení HTML/CSS/JS kódu'));
        $form = $group->addForm();
        $form->addTextArea('ScriptCodeContent');

        $group = $tab->addGroup(translate(''));
        $form = $group->addForm();
        $form->addEditor('Content');

        $tab = $editor->addTab(translate('Soubory'));
        $group = $tab->addGroup(translate('Soubory'));
        $grid = $group->addGridVue(self::FEEDBACK . '_files', translate('Soubory'));
        $grid->setParentEntity('Feedback_ID');
        $grid->setUrl('admin/feedback-file');
        $grid->addEditor('admin/feedback/edit-feedback-file');
        $grid->setParentEntity('Feedback_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'File_ID', 'ID', 80);
        $grid->addColumn(COLUMN_TEXT, 'Name', translate('Název'), 120);
        $grid->addColumn(COLUMN_TEXT, 'Extension', translate('Přípona'), 80);

        $grid->addAction("preview", translate('Náhled'), 'previewFile();');
        $grid->addAction("download", translate('Stáhnout'), 'downloadFile();');

        return $editor;
    }

    public static function createFeedbackFileQEditor(): QuickEditor {
        $editor = new QuickEditor('', 'admin/feedback-file');
        $editor->addFileBox('File_ID', 'Soubor', [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload',
            'type' => File::TYPE_FEEDBACK_ATTACHMENT
        ]);

        return $editor;
    }

    public static function quickReplyForm(?string $state): Form {
        $form = new Form();
        $form->setAjax(true);
        $form->setAction(_bu().'/admin/feedback/quick-state');
        $group = $form->addFormGroup('');
        $group->setColumns(2);
        $group->addSelect('State', translate('Stav'), array_merge([null => ''], FeedbackState::getStates()), true)->setValue(FeedbackState::STATE_NEW);
        $group->addCheckBox('SendEmail', translate('Odeslat email'))->setValue(true);
        $group->addEditor('Description', translate('Obsah'))->setColumnSize(12);
        $group->addTextArea('ScriptCodeContent', 'Místo pro vložení HTML/CSS/JS kódu');

        $group->addHidden('ID');

        $group->addMultiFileBox('files', translate('Soubory'), [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload',
            'type' => File::TYPE_FEEDBACK_ATTACHMENT
        ]);

        $form->addButton(translate('Odeslat'), 'submit');

        return $form;
    }


    /**
     * @return Grid
     */
    public static function projectGrid() :Grid {
        $grid = new GridVue('project', 'Seznam projektů', 'admin/feedback/edit-project');
        $grid->enableSearch([ 'Name', 'Www'], 'Zadejte hledaný výraz');
        $grid->setEnabledActions(true, true, true);
        $grid->setUrl('admin/project');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'Name', 'Název', 250)->setEditable();
        $grid->addColumn(COLUMN_TEXT, 'Www', 'www' )->setEditable();
        $grid->addColumn(COLUMN_TEXT, 'Description', 'Popis')->setEditable();

        return $grid;
    }

    /**
     * @return EntityEditor
     */
    public static function projectEntityEditor(): EntityEditor {
        $editor = new EntityEditor('project', 'Projekt', 'admin/project');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::FEEDBACK_PROJECT)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('Name');
        $tab = $editor->addTab('Základní informace', 'basic-info');
        $tab->setColumns(1);

        $group = $tab->addGroup('Informace o projektu');
        $form = $group->addForm();
        $form->addTextBox('Name', 'Název:', true);
        $form->addTextBox('Www', 'www:');
        $form->addComboBoxStore('DefaultSolver_ID', translate('Výchozí řešitel'), array('module' => 'user', 'controller' => 'user'));
        $form->addEditor('Description', 'Popis:');


        return $editor;
    }


}