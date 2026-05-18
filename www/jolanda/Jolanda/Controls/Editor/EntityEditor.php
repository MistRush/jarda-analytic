<?php

namespace Jolanda\Controls\Editor;

use Jolanda\Controls\Form\Controls\FormGroup;
use Jolanda\Controls\Form\Form;
use Jolanda\Controls\Grid\SubGrid;
use Jolanda\Translations\Lang;
use Nette\Utils\Html;

/**
 * Class EntityEditor
 *
 * @package Jolanda\Controls\Editor
 */
class EntityEditor extends Form
{
    const SAVE_DATA_SERVERSIDE = 'serverside';
    const SAVE_DATA_LOCAL = 'local';

    /**
     * Pole všech tabů
     *
     * @var array[Tab]
     */
    private $tabs = [];

    /**
     * URL k manageru, např. admin/feedback
     *
     * @var string
     */
    private $data_url;

    /**
     * ID upravované entity
     *
     * @var string
     */
    private $entity_id = null;

    /**
     * URL pro návrat, např. feedback/index
     *
     * @var string|null
     */
    private $back_url = null;

    /**
     * Název editoru
     *
     * @var string
     */
    private $name = '';

    /**
     * DB sloupec, určující název upravované entity
     *
     * @var string|null
     */
    private $entity_name_column = null;

    /**
     * Pole s rodičovskou entitou slopuec => hodnota
     *
     * @var array|null
     */
    private $parent_entities = null;

    /**
     * Způsob načtení editoru, AJAX nebo běžný request
     *
     * @var bool
     */
    private $ajax = false;

    /**
     * Povolení zobrazení samostatného editoru pro tvorbu nové entity
     *
     * @var bool
     */
    private $enable_standalone = false;

    /**
     * Pole tlačítek s akcema
     *
     * @var array
     */
    private $actions = [];

    /**
     * Určesní zda je editor je pro čtení
     *
     * @var bool
     */
    private $readonly = false;

    /**
     * URL parametry pro data list
     *
     * @var array
     */
    private $url_parameters = [];

    /**
     * Ukládání editoru na enter
     *
     * @var bool
     */
    private $sendOnEnter = true;

    /**
     * Zobrazování ukládacích tlačítek
     *
     * @var bool
     */
    private $showSaveButtons = true;

    private $footerTab = null;

    private $headerTab = null;

    private $enableNextPrevButtons = false;

    private $enableNextPrevCounter = true;

    private $dataListAction = 'data-list';
    private $dataUpdateAction = 'data-update';
    private $dataCreateAction = 'data-create';

    public string $_bu;

    private array $customData = [];

    public $dataSaveType = self::SAVE_DATA_SERVERSIDE;
    public $forGrid = null;
    public $local_tmp_id = null;

    /**
     * EntityEditor constructor.
     *
     * @param string $id   Unikátní ID editoru
     * @param string $name Název editoru
     * @param string $url  URL manageru, např. admin/feedback
     */
    public function __construct(string $id, string $name, string $url, $super = null)
    {
        $this->_bu = _bu();
        $this->id = 'entityeditor_' . substr(md5(mt_rand()), 0, 7);
        $this->super = $super;
        $this->data_url = $url;
        $this->name = $name;

        $entity_id = \Zend_Controller_Front::getInstance()?->getRequest()?->getParam('entity_ID');

        if(!empty($entity_id))
            $this->setEntityId($entity_id);
    }

    /**
     * @param string $title Název tabu
     * @param null   $data  Zatím nevyužito
     *
     * @return Tab
     */
    public function addTab(string $title, ?string $id = null): Tab
    {
        $tab = new Tab($title, $this, $id);
        $this->tabs[] = $tab;

        return $tab;
    }

    /**
     * Vrací pole tabů
     *
     * @return array
     */
    public function getTabs(): array
    {
        return $this->tabs;
    }

    public function getTab($id): Tab|null
    {
        foreach ($this->tabs as $tab){
            if($tab->getId() === $id){
                return $tab;
            }
        }

        return null;
    }

    public function removeTab($id): self{
        foreach ($this->tabs as $key => $tab){
            if($tab->getId() === $id){
                unset($this->tabs[$key]);
            }
        }

        return $this;
    }

    public function getSubGrid($name) : ?SubGrid{
        foreach ($this->getSubGrids() as $grid){
            if($grid->getName() === $name){
                return $grid;
            }
        }

        return null;
    }

    public function getControl($name){
        foreach ($this->tabs as $tab){
            foreach ($tab->getGroups() as $group){
                foreach ($group->getGroupControls() as $control){
                    if($control instanceof FormGroup){
                        $result = $control->getFormControl($name);

                        if($result){
                            return $result;
                        }
                    }
                }
            }
        }

        return null;
    }

    public function getControlsByType($type){
        $controls = [];

        foreach ($this->tabs as $tab){
            foreach ($tab->getGroups() as $group){
                foreach ($group->getGroupControls() as $control){
                    if($control instanceof FormGroup){
                        foreach ($control->getFormControls() as $formControl){
                            if($formControl instanceof $type){
                                $controls[] = $formControl;
                            }
                        }
                    }
                }
            }
        }

        return $controls;
    }

    /**
     * Vrací URL k manageru s daty
     *
     * @return string
     */
    public function getDatalistUrl(): string
    {
        $conjunction = '?';

        if(str_contains($this->dataListAction, '?')){
            $conjunction = '&';
        }

        if (empty($this->url_parameters)) {
            return $this->_bu . '/' . $this->data_url . '/'.$this->dataListAction . $conjunction . 'ID=';
        } else {
            $params = implode('&', $this->url_parameters);

            return $this->_bu . '/' . $this->data_url . '/'.$this->dataListAction . $conjunction . $params . '&ID=';
        }
    }

    /**
     * Vrací URL k manageru pro update
     *
     * @return string
     */
    public function getDataupdateUrl(): string
    {
        return $this->_bu . '/' . $this->data_url . '/' . $this->dataUpdateAction;
    }

    /**
     * Vrací URL k manageru pro tvorbu
     *
     * @return string
     */
    public function getDatacreateUrl(): string
    {
        return $this->_bu . '/' . $this->data_url . '/' . $this->dataCreateAction;
    }

    /**
     * Vrací zpětnou URL
     *
     * @return string|null
     */
    public function getBackUrl(): ?string
    {
        return $this->back_url;
    }

    /**
     * Nastavuje zpětnou URL
     *
     * @param string $back_url Zpětná URL, např. feedback/index
     */
    public function setBackUrl(string $back_url): EntityEditor
    {
        $this->back_url = $back_url;
        return $this;
    }

    /**
     * Vrací titulek editoru
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->getName() . ' ' . ($this->entity_id == null ? '(' . Lang::getInstance()->translate('EDITOR_NEW') . ')' : '(' . Lang::getInstance()->translate('EDITOR_EDIT') . ')') . ($this->getEntityNameColumn() == null || $this->getEntityId() == null ? '' : ' - <span class="entity_name"></span>');
    }

    /**
     * Vrací název editoru
     *
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Nastavuje název editoru
     *
     * @param string $name
     */
    public function setName(string $name): EntityEditor
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Vrací DB sloupec, určující název upravované entity
     *
     * @return string
     */
    public function getEntityNameColumn(): ?string
    {
        return $this->entity_name_column;
    }

    /**
     * Nastavuje DB sloupec, určující název upravované entity
     *
     * @param string $entity_name_column
     */
    public function setEntityNameColumn(string $entity_name_column): EntityEditor
    {
        $this->entity_name_column = $entity_name_column;

        return $this;
    }

    /**
     * Vrací ID aktuálně upravované entity, pokud null probíhá vytváření
     *
     * @return string|null
     */
    public function getEntityId(): ?string
    {
        return $this->entity_id;
    }

    /**
     * Nastavuje ID právě upravované entity
     *
     * @param string $entity_id
     */
    public function setEntityId(?string $entity_id): EntityEditor
    {
        $this->entity_id = $entity_id;

        return $this;
    }

    /**
     * Vrací pole s rodičovskou entitou [sloupec, hodnota]
     *
     * @return array|null
     */
    public function getParentEntities(): ?array
    {
        return $this->parent_entities;
    }

    /**
     * Nastavuje rodičovskou entitu
     *
     * @param string $parent_entity Sloupec v DB
     * @param string $parent_value  Hodnota
     */
    public function setParentEntity(string $parent_entity, string $parent_value): EntityEditor
    {
        $this->parent_entities[$parent_entity] = $parent_value;

        return $this;
    }

    /**
     * Vrací zda je editor načten pomocí AJAXu
     *
     * @return bool
     */
    public function isAjax(): bool
    {
        return $this->ajax;
    }

    /**
     * Nastavuje způsob načtení editoru
     *
     * @param bool $ajax
     */
    public function setAjax(bool $ajax = true)
    {
        $this->ajax = $ajax;

        return $this;
    }

    /**
     * Vrací zda může být editor pro tvorbu entity renderován samostatně
     *
     * @return bool
     */
    public function isEnableStandalone(): bool
    {
        return $this->enable_standalone;
    }

    /**
     * Nastavuje zda může být editor pro tvorbu entity renderován samostatně
     *
     * @param bool $enable_standalone
     */
    public function enableStandalone(bool $enable_standalone = true): EntityEditor
    {
        $this->enable_standalone = $enable_standalone;

        return $this;
    }

    /**
     * Přidá akční tlačítko
     *
     * @param string      $id    ID tlačítka
     * @param string      $label Text tlačítka
     * @param string|null $icon  Ikona
     *
     * @return Html
     */
    public function addAction(string $id, string $label, ?string $icon = null, $visible_create = true, $visible_update = true, $onclick = null): Action
    {
        $button = new Action($this, $id, $label, $icon, $visible_create, $visible_update, $onclick);
        $this->actions[] = $button;

        return $button;
    }

    public function enableNextPrevButtons($showCounter = true): self
    {
        $this->enableNextPrevButtons = true;
        $this->enableNextPrevCounter = $showCounter;

        return $this;
    }

    public function isNextPrevButtonsEnabled(): bool
    {
        return $this->enableNextPrevButtons;
    }

    public function isNextPrevCounterEnabled(): bool
    {
        return $this->enableNextPrevCounter;
    }

    /**
     * Vrací pole akčních tlačítek
     *
     * @return array
     */
    public function getActions(): array
    {
        return $this->actions;
    }

    /**
     * Vrací zda je editor pouze pro čtení
     *
     * @return bool
     */
    public function isReadonly(): bool
    {
        return $this->readonly;
    }

    /**
     * Natavuje zda má být editor pouze pro čtení
     *
     * @param bool $readonly
     */
    public function setReadonly(bool $readonly = true): EntityEditor
    {
        $this->readonly = $readonly;

        return $this;
    }

    /**
     * Nastavuje URL parametry pro data list
     *
     * @param array $parameters
     */
    public function setUrlParameters(array $parameters): EntityEditor
    {
        $this->url_parameters = $parameters;

        return $this;
    }

    /**
     * Render formulářové skupiny
     *
     * @return string
     */
    public function render()
    {
        foreach ($this->formGroups as $group) {
            $this->element->insert(null, $group);
        }
        if ($this->id != null) {
            $this->element->setAttribute('id', $this->id);
        }

        return $this->element->render();
    }

    /**
     * @return bool
     */
    public function getSendOnEnter(): bool
    {
        return $this->sendOnEnter;
    }

    /**
     * @param bool $sendOnEnter
     */
    public function sendOnEnter(bool $sendOnEnter): self
    {
        $this->sendOnEnter = $sendOnEnter;
        return $this;
    }

    public function getSubGrids(): array
    {
        $subGrids = [];
        foreach ($this->tabs as $tab){
            $subGrids = array_merge($subGrids, $tab->getSubGrids());
        }

        if($this->headerTab){
            $subGrids = array_merge($subGrids, $this->headerTab->getSubGrids());
        }

        if($this->footerTab){
            $subGrids = array_merge($subGrids, $this->footerTab->getSubGrids());
        }

        return $subGrids;
    }

    public function getRelationSwitches(): array
    {
        $relationSwitches = [];
        foreach ($this->tabs as $tab){
            $relationSwitches = array_merge($relationSwitches, $tab->getRelationSwitches());
        }

        if($this->headerTab){
            $relationSwitches = array_merge($relationSwitches, $this->headerTab->getRelationSwitches());
        }

        if($this->footerTab){
            $relationSwitches = array_merge($relationSwitches, $this->footerTab->getRelationSwitches());
        }

        return $relationSwitches;
    }

    public function getCategoryTrees(): array
    {
        $categoryTrees = [];
        foreach ($this->tabs as $tab){
            $categoryTrees = array_merge($categoryTrees, $tab->getCategoryTrees());
        }

        if($this->headerTab){
            $categoryTrees = array_merge($categoryTrees, $this->headerTab->getCategoryTrees());
        }

        if($this->footerTab){
            $categoryTrees = array_merge($categoryTrees, $this->footerTab->getCategoryTrees());
        }

        return $categoryTrees;
    }

    public function showSaveButtons($show = true):self
    {
        $this->showSaveButtons = $show;
        return $this;
    }

    public function isShowSaveButtons(): bool
    {
        return $this->showSaveButtons;
    }

    public function addFooterTab(string $title, ?string $id = null): Tab
    {
        $tab = new Tab($title, $this, $id);
        $this->footerTab = $tab;

        return $tab;
    }

    public function getFooterTab(): Tab|null
    {
        return $this->footerTab;
    }

    public function addHeaderTab(string $title, ?string $id = null): Tab
    {
        $tab = new Tab($title, $this, $id);
        $this->headerTab = $tab;

        return $tab;
    }

    public function getHeaderTab(): Tab|null
    {
        return $this->headerTab;
    }

    public function getDataListAction(): string
    {
        return $this->dataListAction;
    }

    public function setDataListAction(string $dataListAction): EntityEditor
    {
        $this->dataListAction = $dataListAction;

        return $this;
    }

    public function getDataUpdateAction(): string
    {
        return $this->dataUpdateAction;
    }

    public function setDataUpdateAction(string $dataUpdateAction): EntityEditor
    {
        $this->dataUpdateAction = $dataUpdateAction;

        return $this;
    }

    public function getDataCreateAction(): string
    {
        return $this->dataCreateAction;
    }

    public function setDataCreateAction(string $dataCreateAction): EntityEditor
    {
        $this->dataCreateAction = $dataCreateAction;

        return $this;
    }

    public function addCustomData(string $key, $value): self
    {
        $this->customData[$key] = $value;

        return $this;
    }

    public function setCustomData(array $customData): self
    {
        $this->customData = $customData;

        return $this;
    }

    public function getCustomData(): array
    {
        return $this->customData;
    }

    public function getCustomDataJson(): string
    {
        return json_encode($this->customData);
    }

    public function getDataUrl(): string
    {
        return $this->data_url;
    }

    public function setDataUrl(string $data_url): EntityEditor
    {
        $this->data_url = $data_url;

        return $this;
    }

    public function setupRemoteEditor($module){
        $url = $this->data_url;
        $url = substr($url, strpos($url, '/'));
        $this->setDataUrl($module . $url);

        /** @var \Jolanda\Controls\Grid\SubGrid $grid */
        foreach ($this->getSubGrids() as $grid){
            $url = $grid->getDatalistUrl();
            $url = substr($url, strpos($url, $grid->_bu));
            $url = substr($url, strpos($url, '/', 1));
            $grid->setDatalistUrl(_bu() . '/' . $module . $url);

            $url = $grid->getDeleteUrl();
            $url = substr($url, strpos($url, $grid->_bu));
            $url = substr($url, strpos($url, '/', 1));
            $grid->setDeleteUrl(_bu() . '/' . $module . $url);

            $url = $grid->getUpdateUrl();
            $url = substr($url, strpos($url, $grid->_bu));
            $url = substr($url, strpos($url, '/', 1));
            $grid->setUpdateUrl(_bu() . '/' . $module . $url);

            $url = $grid->getQuickEditor();
            if($url){
                $url = substr($url, strpos($url, $grid->_bu));
                $url = substr($url, strpos($url, '/', 1));

                $grid->addEditor($module . $url);
            }

        }

        $comboboxes = $this->getControlsByType(\Jolanda\Controls\Form\Controls\ComboBox::class);

        foreach ($comboboxes as $combobox){
            if($combobox->isAjax()){
                $url = $combobox->getControlPart()->getAttribute('data-store');
                $url = substr($url, strpos($url, $this->_bu));
                $url = substr($url, strpos($url, '/', 1));

                $combobox->getControlPart()->setAttribute('data-store', _bu() . '/' . $module . $url);
            }
        }
    }

    public function applyParams($params){
        foreach ($params as $key => $value){
            if(is_array($value)){
                $this->$key(...$value);
            }else{
                $this->$key($value);
            }
        }
    }

    public function toJson() {
        return json_encode($this->toArray());
    }

    public function toArray(){
        $array = parent::toArray();
        $tabs = [];
        foreach ($this->tabs as $tab){
            $tabs[] = $tab->toArray();
        }

        $actions = [];
        foreach ($this->actions as $action){
            $actions[] = $action->toArray();
        }


        $footerTab = null;
        $headerTab = null;


        $array['tabs'] = $tabs;
        $array['data_url'] = $this->data_url;
        $array['entity_id'] = $this->entity_id;
        $array['back_url'] = $this->back_url;
        $array['name'] = $this->name;
        $array['entity_name_column'] = $this->entity_name_column;
        $array['parent_entities'] = $this->parent_entities;
        $array['ajax'] = $this->ajax;
        $array['enable_standalone'] = $this->enable_standalone;
        $array['actions'] = $actions;
        $array['readonly'] = $this->readonly;
        $array['url_parameters'] = $this->url_parameters;
        $array['sendOnEnterEnabled'] = $this->sendOnEnter;
        $array['isShowedSaveButtons'] = $this->showSaveButtons;
        $array['footerTab'] = $footerTab;
        $array['headerTab'] = $headerTab;
        $array['isEnabledNextPrevButtons'] = $this->enableNextPrevButtons;
        $array['isEnabledNextPrevCounter'] = $this->enableNextPrevCounter;
        $array['dataListAction'] = $this->dataListAction;
        $array['dataUpdateAction'] = $this->dataUpdateAction;
        $array['dataCreateAction'] = $this->dataCreateAction;
        $array['_bu'] = $this->_bu;
        $array['customData'] = $this->customData;
        $array['dataSaveType'] = $this->dataSaveType;
        $array['forGrid'] = $this->forGrid;
        $array['local_tmp_id'] = $this->local_tmp_id;

        return $array;
    }

}