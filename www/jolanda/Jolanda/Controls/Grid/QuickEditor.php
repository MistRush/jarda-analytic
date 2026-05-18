<?php

namespace Jolanda\Controls\Grid;

use Jolanda\Controls\Editor\EntityEditor;
use Jolanda\Controls\Editor\Group;
use Jolanda\Controls\Form\Controls\FormGroup;
use Jolanda\Controls\Form\Form;
use Jolanda\Latte\Latte;
use Tracy\Debugger;

/**
 * Class QuickEditor
 *
 * @package Jolanda\Controls\Grid
 */
class QuickEditor extends FormGroup
{
    const SAVE_DATA_SERVERSIDE = 'serverside';
    const SAVE_DATA_LOCAL = 'local';
    /**
     * ID editoru
     *
     * @var string
     */
    protected $id;

    protected $super;

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
     * ID dialogu, ve kterém je editor renderován
     *
     * @var string
     */
    private $dialog;

    /**
     * Vlastní JS kód
     *
     * @var string|null
     */
    private $custom_code;

    /**
     * Ukládání editoru na enter
     *
     * @var bool
     */
    private $send_on_enter = true;

    private string $dataListUrl = 'data-list';
    private string $dataUpdateUrl = 'data-update';
    private string $dataCreateUrl = 'data-create';

    public string $_bu;

    private array $customData = [];

    /**
     * Pole FormGroup
     *
     * @var FormGroup[]
     */
    private array $formGroups = [];

    public $dataSaveType = self::SAVE_DATA_SERVERSIDE;
    public $forGrid;
    public $local_tmp_id;
    public $create_default_values;

    /**
     * QuickEditor constructor.
     *
     * @param string $label Titulek editoru
     * @param string $url   URL k manageru, např. admin/feedback
     */
    public function __construct(string $label, string $url, $super = null)
    {
        $this->_bu = _bu();
        $this->super = $super;
        parent::__construct($this, $label);
        $this->id = 'quickeditor_' . substr(md5(mt_rand()), 0, 7);
        $this->data_url = $url;

        $entity_id = \Zend_Controller_Front::getInstance()?->getRequest()?->getParam('entity_id');

        if(!empty($entity_id))
            $this->setEntityId($entity_id);
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
    public function setEntityId($entity_id): QuickEditor
    {
        $this->entity_id = $entity_id;
        if(!$this->getFormControl('ID'))
            $this->addHidden('ID')->setValue($entity_id);
        else
            $this->getFormControl('ID')->setValue($entity_id);

        return $this;
    }

    /**
     * Vrací ID dialogu, ve kterém je editor renderován
     *
     * @return string
     */
    public function getDialog(): string
    {
        return $this->dialog;
    }

    /**
     * Nastavuje ID dialogu, ve kterém je editor renderován
     *
     * @param string $dialog
     */
    public function setDialog(string $dialog): QuickEditor
    {
        $this->dialog = $dialog;

        return $this;
    }

    /**
     * Vrací ID editoru
     *
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * Vrací URL k manageru s daty
     *
     * @return string
     */
    public function getDatalistUrl(): string
    {
        $conjunction = '?';

        if(str_contains($this->dataListUrl, '?')){
            $conjunction = '&';
        }

        return _bu() . '/' . $this->data_url . '/' . $this->dataListUrl . $conjunction . 'ID=';
    }

    /**
     * Vrací URL k manageru pro update
     *
     * @return string
     */
    public function getDataupdateUrl(): string
    {
        return _bu() . '/' . $this->data_url . '/' . $this->dataUpdateUrl;
    }

    /**
     * Vrací URL k manageru pro tvorbu
     *
     * @return string
     */
    public function getDatacreateUrl(): string
    {
        return _bu() . '/' . $this->data_url . '/'. $this->dataCreateUrl;
    }

    /**
     * Nastavuje rodičovskou vazbu
     *
     * @param string $column Název relačního sloupece
     * @param string $value  Hodnota
     */
    public function setParent(string $column, string $value): QuickEditor
    {
        $this->addHidden($column)->setValue($value);

        return $this;
    }

    /**
     * @param string|null $custom_code
     */
    public function setCustomCode(?string $custom_code): QuickEditor
    {
        $this->custom_code = $custom_code;

        return $this;
    }

    public function getCustomCode(): ?string
    {
        return $this->custom_code;
    }



    /**
     * @return mixed|null
     */
    public function getSuper()
    {
        return $this->super;
    }

    /**
     * Render editoru
     *
     * @return string
     */
    public function render(array $params = [])
    {
        $form = parent::__toString();
        $latte = Latte::getInstance()->getEngine();
        $formGroups = [];

//        foreach ($this->formGroups as $formGroup){
//            $formGroups[] = $formGroup->__toString();
//        }

        $params = array_merge($params, [
            "editor" => $this,
            "form" => $form,
            "custom_code" => $this->custom_code,
            "formGroups" => $formGroups,
        ]);

        return $latte->renderToString(__DIR__ . '/latte/quickeditor.latte', $params);
    }

    /**
     * Vrací ID editoru
     *
     * @return string
     */
    public function __toString()
    {
        return $this->id;
    }

    /**
     * @return bool
     */
    public function getSendOnEnter(): bool
    {
        return $this->send_on_enter;
    }

    /**
     * @param bool $sendOnEnter
     */
    public function sendOnEnter(bool $sendOnEnter): self
    {
        $this->send_on_enter = $sendOnEnter;
        return $this;
    }

    /**
     * @param string $dataListUrl
     */
    public function setDataListUrl(string $dataListUrl): self
    {
        $this->dataListUrl = $dataListUrl;

        return $this;
    }

    /**
     * @param string $dataUpdateUrl
     */
    public function setDataUpdateUrl(string $dataUpdateUrl): self
    {
        $this->dataUpdateUrl = $dataUpdateUrl;

        return $this;
    }

    /**
     * @param string $dataCreateUrl
     */
    public function setDataCreateUrl(string $dataCreateUrl): self
    {
        $this->dataCreateUrl = $dataCreateUrl;

        return $this;
    }

    /**
     * Přidá grid do quickeditoru
     *
     * @param string $id    ID gridu
     * @param string $title Titulek gridu
     *
     * @return SubGrid
     */
    public function addGrid(string $id, string $title): SubGrid
    {
        $grid = new SubGrid($id, $title, null);
        $grid->setParentEditor($this);
        $this->formControls[] = $grid;

        return $grid;
    }

    public function getSubGrids(): array
    {
        $subGrids = [];
        foreach ($this->formControls as $control){
            if(is_a($control,'Jolanda\Controls\Grid\SubGrid') || is_a($control,'Jolanda\Controls\Grid\SubGridVue')) {
                $subGrids[] = $control;
            }
        }

        return $subGrids;
    }


    public function setDataListAction(string $dataListAction): self
    {
        return $this->setDataListUrl($dataListAction);
    }

    public function setDataUpdateAction(string $dataUpdateAction): self
    {
        return $this->setDataUpdateUrl($dataUpdateAction);
    }

    public function setDataCreateAction(string $dataCreateAction): self
    {
        return $this->setDataCreateUrl($dataCreateAction);
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

    public function setupRemoteEditor($module){
        $url = $this->data_url;
        $url = substr($url, strpos($url, '/'));
        $this->data_url = $module . $url;

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

    public function getControlsByType($type){
        $controls = [];

        foreach ($this->getFormControls() as $formControl){
            if($formControl instanceof $type){
                $controls[] = $formControl;
            }
        }

        return $controls;
    }

//    public function addFormGroup(string $title): FormGroup
//    {
//        $formGroup = new FormGroup($this, $title);
//        $this->formGroups[] = $formGroup;
//        $formGroup->setDefaultColumnSize(12);
//
//        return $formGroup;
//    }

    public function toArray(): array{
        $array = parent::toArray();

        $array['id'] = $this->id;
        $array['data_url'] = $this->data_url;
        $array['entity_id'] = $this->entity_id;
        $array['dialog'] = $this->dialog;
        $array['custom_code'] = $this->custom_code;
        $array['send_on_enter'] = $this->send_on_enter;
        $array['dataListUrl'] = $this->dataListUrl;
        $array['dataUpdateUrl'] = $this->dataUpdateUrl;
        $array['dataCreateUrl'] = $this->dataCreateUrl;
        $array['_bu'] = $this->_bu;
        $array['customData'] = $this->customData;
        $array['dataSaveType'] = $this->dataSaveType;
        $array['forGrid'] = $this->forGrid;
        $array['local_tmp_id'] = $this->local_tmp_id;
        $array['create_default_values'] = $this->create_default_values;

        return $array;
    }

    public function toJson(): string{
        return json_encode($this->toArray());
    }
}