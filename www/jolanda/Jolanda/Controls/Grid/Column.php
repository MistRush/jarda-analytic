<?php

namespace Jolanda\Controls\Grid;

use Jolanda\Controls\Form\Controls\ComboBox;

/**
 * Class Column
 *
 * @package Jolanda\Controls\Grid
 */
class Column
{
    public const EDIT_TYPE_DEFAULT = 'default';
    public const EDIT_TYPE_AJAX_SELECT = 'ajax-select';


    protected $super;

    /**
     * Formát sloupce
     *
     * @var int
     */
    private $format;

    /**
     * Databázový sloupec
     *
     * @var string
     */
    private $column;

    /**
     * Titulek sloupce
     *
     * @var string
     */
    private $label;

    /**
     * Minimální šířka sloupce
     *
     * @var int
     */
    private $min_width;

    /**
     * Vlastní JS funkce pro formátování hodnot ve sloupci
     *
     * @var string|null
     */
    private $format_function;

    /**
     * JSON s enum hodnotami
     *
     * @var string
     */
    private $entity_values;

    /**
     * Označení zda má sloupec filtr
     *
     * @var bool
     */
    private $filter;

    /**
     * Označení zda je sloupec upravitelný
     *
     * @var bool
     */
    private $editable;

    /**
     * Rodičovksý grid
     *
     * @var Grid|null
     */
    private $parent;

    /**
     * Implicitní viditelnost sloupce
     *
     * @var bool
     */
    private $visible = true;

    /**
     * Tooltip sloupce
     *
     * @var string|null
     */
    private $help_text = null;

    private $editType = self::EDIT_TYPE_DEFAULT;

    private $editParams = [];

    /**
     * Column constructor.
     *
     * @param int       $format    Formát sloupce
     * @param string    $column    Název DB sloupce
     * @param string    $label     Titulek sloupce
     * @param null      $min_width Minimální šířka
     * @param Grid|null $parent    Rodičovský grid
     */
    public function __construct(int $format, string $column, string $label, $min_width = null, Grid $parent = null)
    {
        $this->format = $format;
        $this->column = $column;
        $this->label = $label;
        if (is_null($min_width) && $this->column == 'ID') {
            $min_width = 10;
        }
        $this->min_width = (is_null($min_width) ? '90px' : $min_width . 'px');
        $this->filter = $parent->getFilterDefault();
        if ($this->filter) {
            $parent->setHasFilter(true);
        }
        $this->editable = false;
        $this->parent = $parent;
        $this->super = $parent->getSuper();
    }

    /**
     * Vrací formát sloupce
     *
     * @return int
     */
    public function getFormat(): int
    {
        return $this->format;
    }

    /**
     * Nastavuje formát sloupce
     *
     * @param int $format
     */
    public function setFormat(int $format): Column
    {
        $this->format = $format;

        return $this;
    }

    /**
     * Vrací název DB sloupce
     *
     * @return string
     */
    public function getColumn(): string
    {
        return $this->column;
    }

    /**
     * Nastavuje název DB sloupce
     *
     * @param string $column
     */
    public function setColumn(string $column): Column
    {
        $this->column = $column;

        return $this;
    }

    /**
     * Vrací titulek sloupce
     *
     * @return string
     */
    public function getLabel(): string
    {
        return $this->label;
    }

    /**
     * Nastavuje titulek sloupce
     *
     * @param string $label
     */
    public function setLabel(string $label): Column
    {
        $this->label = $label;

        return $this;
    }

    /**
     * Vrací minimální šířku sloupce v px
     *
     * @return string|null
     */
    public function getMinWidth(): ?string
    {
        return $this->min_width;
    }

    /**
     * Nastavuje minimální šířku sloupce
     *
     * @param $min_width
     */
    public function setMinWidth(int $min_width): Column
    {
        $this->min_width = $min_width;

        return $this;
    }

    /**
     * Vrací vlastní JS formátovací funkci
     *
     * @return string|null
     */
    public function getFormatFunction(): ?string
    {
        return $this->format_function;
    }

    /**
     * Nastavuje název vlastní JS funkci pro formátování hodnot ve sloupci
     *
     * @param string $format_function Název JS funkce, např. formatHeader
     */
    public function setFormatFunction(string $format_function): Column
    {
        $this->format_function = $format_function;

        return $this;
    }

    /**
     * Nastavuje ENUM hodnoty pro sloupec
     *
     * @param array $values Pole enum hodnot, např. [1 => 'Hodnota 1', ...]
     *
     * @return Column
     */
    public function setEnumValues(array $values): Column
    {
        $vals = ['' => ''];
        foreach ($values as $key => $val) {
            $vals[(string)$key] = $val;
        }
        $this->entity_values = $vals;

        return $this;
    }

    /**
     * Vrací JSON nebo pole s enum nebo entity hodnotami
     *
     * @param bool $json Určení zda má vracet json nebo pole
     *
     * @return string|array
     */
    public function getEntityValues($json = true)
    {
        if ($json) {
            return json_encode($this->entity_values);
        } else {
            return $this->entity_values;
        }
    }

    /**
     * Nastavuje Entity hodnoty pro sloupec
     *
     * @param string $foreignRelationColumn Název vazebního sloupce, např. ID
     * @param string $foreignValueColumn    Název sloupce s hodnotami, FullName
     * @param array  $store                 Pole cesty k manageru
     */
    public function setEntity(string $foreignRelationColumn, string $foreignValueColumn, array $store): Column
    {
        /**
         * @var \Clevis_Data_ManagerRaw $store
         */
        if (!isset($store['module'])) {
            $store['module'] = 'admin';
        }
        $manager_class = ucfirst($store['module']) . '_Manager_';
        foreach (explode('-', $store['controller']) as $item) {
            $manager_class .= ucfirst($item);
        }
        $manager = new $manager_class();
        unset($store['module']);
        unset($store['controller']);
        $data = $manager->performDataList($store, \Clevis_Data_Manager::LIST_HIERARCHY);
        $result = ['' => ''];
        foreach ($data['data'] as $item) {
            $result[$item[$foreignRelationColumn]] = $item[$foreignValueColumn];
        }

        $this->entity_values = $result;

        return $this;
    }

    /**
     * Vrací zda má sloupec filtr
     *
     * @return bool
     */
    public function hasFilter(): bool
    {
        return $this->filter;
    }

    /**
     * Nastavuje, zda má sloupec filtr
     *
     * @param bool $filter
     *
     * @return Column
     */
    public function setFilter(bool $filter = true): Column
    {
        $this->filter = $filter;
        $this->parent->setHasFilter(true);

        return $this;
    }

    /**
     * Vrací, zda je sloupec editovatelný
     *
     * @return bool
     */
    public function isEditable(): bool
    {
        return $this->editable;
    }

    /**
     * Nastavuje, zda je sloupec editovatelný
     *
     * @param bool $editable
     *
     * @return Column
     */
    public function setEditable(bool $editable = true, string $editType = self::EDIT_TYPE_DEFAULT, array $editParams = []): Column
    {
        $this->editable = $editable;
        $this->editType = $editType;
        $this->editParams = $editParams;

        if($editType === self::EDIT_TYPE_AJAX_SELECT){
            $input = new ComboBox($this, $editParams['name'], '', false, $editParams['storeUrl'], $editParams['storeField'], false, true);
            $input->getControlPart()->name = $editParams['name'];
            $input->setSelectWidth('100%');
            $this->editParams['input'] = $input->getControlPart()->render();
        }


        return $this;
    }

    public function getEditType(){
        return $this->editType;
    }

    public function getEditParams(){
        return $this->editParams;
    }

    /**
     * Vrací zda je sloupec viditelný
     *
     * @return bool
     */
    public function isVisible(): bool
    {
        return $this->visible;
    }

    /**
     * Nastavuje viditelnost sloupce
     *
     * @param bool $visible
     */
    public function setVisible(bool $visible): Column
    {
        $this->visible = $visible;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getHelp(): ?string
    {
        return $this->help_text ?? $this->label;
    }

    /**
     * @param string|null $help_text
     */
    public function setHelp(?string $help_text): Column
    {
        $this->help_text = $help_text;

        return $this;
    }

    public function toArray(): array {
        $array = [
            'format' => $this->format,
            'column' => $this->column,
            'label' => $this->label,
            'min_width' => $this->min_width,
            'format_function' => $this->format_function,
            'entity_values' => $this->entity_values,
            'filter' => $this->filter,
            'editable' => $this->editable,
            'visible' => $this->visible,
            'help_text' => $this->help_text,
            'editType' => $this->editType,
            'editParams' => $this->editParams
        ];

        return $array;
    }

    public function toJson(): string {
        return json_encode($this->toArray());
    }

}