<?php

namespace Jolanda\Controls\Grid;

use Jolanda\Controls\Form\Controls\FormGroup;
use Jolanda\Controls\Form\Form;
use Jolanda\Latte\Latte;
use Jolanda\Translations\Lang;
use Nette\Utils\Html;

/**
 * Class Grid
 *
 * @package Jolanda\Controls\Grid
 */
class Grid
{

    const SELECT_SINGLE = 'single';
    const SELECT_MULTI = 'multi';
    const SELECT_MULTI_CHECKBOX = 'multi_checkbox';
    const SELECT_MULTI_CHECKBOX_REVERSE = 'multi_checkbox_reverse';

    const SELECT_MULTI_TYPE_ONLY_LOADED = 'only_loaded';
    const SELECT_MULTI_TYPE_ALL = 'all';

    const SAVE_DATA_SERVERSIDE = 'serverside';
    const SAVE_DATA_LOCAL = 'local';

    public const PRESET_SAVE_TYPE_LOCAL = 'local';
    public const PRESET_SAVE_TYPE_SERVERSIDE = 'serverside';

    public static bool $EXCEL_APP = false;
    public static string $PRESET_SAVE_TYPE = self::PRESET_SAVE_TYPE_LOCAL;
    public static ?string $PRESET_SAVE_SERVERSIDE_URL = null;

    public $class = 'Grid';

    /**
     * ID gridu v DOMu
     *
     * @var string
     */
    protected $id;

    /**
     * Název gridu
     *
     * @var string
     */
    protected $name;

    /**
     * Zdali se má cachovat editor gridu
     *
     * @var boolean
     */
    protected $cacheEditor = false;

    /**
     * URL adresa datalistu
     *
     * @var string
     */
    protected $datalist_url;

    /**
     * URL adresa pro smazání entity
     *
     * @var string
     */
    protected $delete_url;

    /**
     * URL adresa pro úpravu entity
     *
     * @var string
     */
    protected $update_url;

    /**
     * URL adresa pro vytvoření entity
     *
     * @var string
     */
    protected $create_url;

    /**
     * Pole jednotlivých sloupců
     *
     * @var array[Column]
     */
    protected $cols;

    /**
     * Pole vlastních akcí - tlačítek
     *
     * @var array
     */
    protected $actions;

    /**
     * Pole výchozích akcí
     *
     * @var array
     */
    protected $baseActions;

    /**
     * URL adresa Entity Editoru
     *
     * @var string
     */
    protected $edit_action = null;

    /**
     * URL adresa pro úpravu entity v inline editoru
     *
     * @var string|null
     */
    protected $inline_edit_action;

    /**
     * URL adresa Quick Editoru
     *
     * @var string
     */
    protected $quickedit_action = null;

    /**
     * maxWidth quickeditoru
     *
     * @var int
     */
    protected $quickedit_maxWidth = null;

    /**
     * Pole povolených akcí [add, edit, delete]
     *
     * @var array
     */
    protected $enabled_actions;

    /**
     * Titulek gridu
     *
     * @var string
     */
    protected $title;

    /**
     * Relační sloupce rodičovské a podřízené entity
     *
     * @var array
     */
    protected $relations;

    /**
     * Sloupec, určující pořadí
     *
     * @var string|null
     */
    protected $order_column;

    /**
     * Typ výběru řádků
     *
     * @var string
     */
    protected $select;

    /**
     * Určení, zda má grid filtr
     *
     * @var bool
     */
    protected $has_filter;

    /**
     * Název vlastní JS funkce pro formátování řádků
     *
     * @var string|null
     */
    protected $rowFormatter;

    /**
     * Určení, zda má grid vyhledávání
     *
     * @var null|array
     */
    protected $search = null;

    /**
     * @var array|bool
     */
    protected $relation_switcher = false;

    /**
     * Určení, zda má grid implicitně zapnutý filtr
     *
     * @var bool
     */
    protected $filter_default = true;

    /**
     * Výška gridu
     *
     * @var string
     */
    protected $height = '68vh';

    /**
     * Určení zda je povolen preview řádku
     *
     * @var bool
     */
    protected $preview = false;

    /**
     * Výchozí řazení
     *
     * @var array|string[]
     */
    protected $order = [];

    /**
     * Jestli musí být vybraný aspoň jeden item z parentGridu
     *
     * @var bool
     */
    protected $one_must_be_selected = true;

    /**
     * Formulář s přepínači
     *
     * @var FormGroup
     */
    protected $switchesForm;

    protected $super;

    protected $multipleType;

    protected int $displayBuffer = 25;

    protected bool $infiniteScroll = true;

    protected string $dataSaveType = self::SAVE_DATA_SERVERSIDE;

    protected array $dataSaveParams = [];

    protected bool $enable_controls = true;

    protected bool $enable_refresh = true;

    protected bool $ajax = true;

    protected ?array $data = null;

    protected bool $columnReorder = true;

    protected bool $custom_row_reorder = false;

    protected Form $filterForm;
    protected FormGroup $filterFormGroup;
    protected string $presetSaveType;
    protected bool $use_filters_bar = true;

    protected bool $renderInCreateEditor = false;

    public string $_bu;

    protected bool $switchesFormToEditor = false;

    /**
     * Grid constructor.
     *
     * @param string      $id          ID gridu
     * @param string      $title       Titulek gridu
     * @param string|null $edit_action URL akce s Entity Editorem, př. order/edit-order
     */
    public function __construct(string $id, string $title, string $edit_action = null, $super = null, $allowExport = true)
    {
        $this->_bu = _bu();
        $this->name = $id;
        $this->id = $this->name . '_datagrid';
        $this->cols = [];
        $this->actions = [];
        $this->relations = [];
        $this->rowFormatter = null;
        $this->title = $title;
        $this->inline_edit_action = null;
        if (!is_null($edit_action)) {
            $this->edit_action = _bu() . '/' . $edit_action;
        }
        $this->enabled_actions = ['add' => true, 'edit' => true, 'remove' => true];
        $this->order_column = null;
        $this->select = self::SELECT_SINGLE;
        $this->multipleType = self::SELECT_MULTI_TYPE_ONLY_LOADED;
        $this->has_filter = false;
        $this->order = ['order' => 'asc', 'column' => 'ID'];
        $this->super = $super;
        $addButton = new Action($this, $this->id . '_add', Lang::getInstance()->translate('ADD'), "window['{$this->id}'].add()", [true, true, false]);
        $addButton->getHeaderButton()->setAttribute('class', 'btn btn-green');
        $addButton->setIcon('plus');
        $editButton = new Action($this, $this->id . '_edit', Lang::getInstance()->translate('EDIT'), "window['{$this->id}'].edit()", [true, true, true]);
        $editButton->getHeaderButton()->setAttribute('class', 'btn btn-yellow ' . $this->id . '_edit_button');
        $editButton->setIcon('edit');
        $removeButton = new Action($this, $this->id . '_remove', Lang::getInstance()->translate('REMOVE'), "window['{$this->id}'].remove()", [true, true, true]);
        $removeButton->getHeaderButton()->setAttribute('class', 'btn btn-red');
        $removeButton->setIcon('times');
        $this->baseActions = [
            'add' => $addButton,
            'edit' => $editButton,
            'remove' => $removeButton
        ];
        $switchesForm = new Form();
        $switchesForm->setId($this->id . '_switches');
        $this->switchesForm = $switchesForm->addFormGroup();
        $this->switchesForm->setDefaultColumnSize(0);
        $this->filterForm = new Form();
        $this->filterForm->setId($this->id . '_filterform');
        $this->filterFormGroup = $this->filterForm->addFormGroup();
        $this->presetSaveType = self::$PRESET_SAVE_TYPE;

        if($allowExport){
            $export = $this->addAction('orig_export', Lang::getInstance()->translate('EXPORT'), null, [false, true, true]);
            $export->addSubAction('orig_export_csv_all', Lang::getInstance()->translate('EXPORT_CSV_ALL'), "window['{$this->id}'].exportDataToCSV()");
            $export->addSubAction('orig_export_csv_filter', Lang::getInstance()->translate('EXPORT_CSV_FILTER'), "window['{$this->id}'].exportDataToCSV(true)");
            $export->addSubAction('orig_export_pdf_all', Lang::getInstance()->translate('EXPORT_PDF_ALL'), "window['{$this->id}'].exportDataToPDF()");
            $export->addSubAction('orig_export_pdf_filter', Lang::getInstance()->translate('EXPORT_PDF_FILTER'), "window['{$this->id}'].exportDataToPDF(true)");
        }

        if(self::$EXCEL_APP){
            $toExcelApp = $this->addAction('export_grid_to_excel_app', 'Přenést do excel appky', "window.exportGridToExcelApp('{$this->id}')", [false, true, false]);
        }
    }

    /**
     * Vrací titulek gridu
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * Nastavuje titulek gridu
     *
     * @param string $title
     */
    public function setTitle(string $title): Grid
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Vrací pole povolených implicitních akcí [add, edit, delete]
     *
     * @return array
     */
    public function getEnabledActions(): array
    {
        return $this->enabled_actions;
    }

    /**
     * Nastavení povolených implicitních akcí
     *
     * @param bool $add    Přidání záznamu
     * @param bool $edit   Úprava záznamu
     * @param bool $remove Smazání záznamu
     */
    public function setEnabledActions(bool $add, bool $edit, bool $remove): Grid
    {
        $this->enabled_actions = ['add' => $add, 'edit' => $edit, 'remove' => $remove];

        return $this;
    }

    /**
     * Vrací pole všech sloupců
     *
     * @return Column[]
     */
    public function getColumns(): array
    {
        return $this->cols;
    }

    /**
     * Vrací JSON s informacemi o sloupcích pro LATTE
     *
     * @return string
     */
    public function getFormattedColumns(): array
    {
        $result = [];
        if(str_contains($this->getSelect(), 'checkbox')){
            $result[] = [
                "name" => 'checkbox',
                "minwidth" => '20',
                "label" => 'Checkbox'
            ];
        }
        foreach ($this->cols as $col) {
            $tmp = [
                "name" => $col->getColumn(),
                "format" => $col->getFormat(),
                "format_function" => $col->getFormatFunction(),
                "editable" => $col->isEditable(),
                "editType" => $col->getEditType(),
                "editParams" => count($col->getEditParams()) > 0 ? $col->getEditParams() : null,
                "minwidth" => $col->getMinWidth(),
                "label" => $col->getLabel(),
                "entity_values" => $col->getEntityValues(),
                "visibility" => $col->isVisible(),
            ];

            $result[] = $tmp;
        }

        return $result;
    }

    public function getFormattedColumnsJson(): string
    {
        return json_encode($this->getFormattedColumns());
    }

    /**
     * Vrací JSON s tlačítky v řádcích
     *
     * @return string
     */
    public function getRowActions(): ?array
    {
        $result = [];
        foreach ($this->getActions() as $action) {
            if ($action->getVisibility()['row']) {
                $result[] = $action->renderRow();
            }
        }
        if (empty($result)) {
            return null;
        } else {
            return $result;
        }
    }

    public function getRowActionsJson(): string{
        return json_encode($this->getRowActions() ?? []);
    }

    /**
     * Vrací pole uživatelksých akcí - tlačítek
     *
     * @return array
     */
    public function getActions(): array
    {
        return $this->actions;
    }

    /**
     * Vrací absolutní URL s akcí na vykreslení Entity Editoru
     *
     * @return string|null
     */
    public function getEditAction(): ?string
    {
        return $this->edit_action;
    }

    /**
     * @param string $edit_action
     */
    public function setEditAction(string $edit_action): Grid
    {
        $this->edit_action = _bu() . '/' . $edit_action;

        return $this;
    }

    /**
     * @return string
     */
    public function getQuickeditAction(): ?string
    {
        return $this->quickedit_action;
    }

    /**
     * @param string $quickedit_action
     */
    public function setQuickeditAction(string $quickedit_action): Grid
    {
        $this->quickedit_action = _bu() . '/' . $quickedit_action;

        return $this;
    }


    public function setQuickeditMaxWidth(int $maxWidth): Grid
    {
        $this->quickedit_maxWidth = $maxWidth;

        return $this;
    }

    /**
     * @return int
     */
    public function getQuickeditMaxWidth(): ?int
    {
        return $this->quickedit_maxWidth;
    }

    /**
     * Nastavuje URL manageru původním způsobem
     *
     * @param array $store
     */
    public function setupStore(array $store): Grid
    {
        $url = '';
        if (!isset($store['module'])) {
            $url .= 'admin';
        } else {
            $url .= $store['module'];
        }
        $url .= '/' . $store['controller'];
        unset($store['module']);
        unset($store['controller']);

        $this->setUrl($url, $store);

        return $this;
    }

    /**
     * Nastavuje URL manageru
     *
     * @param string     $url    Url k manažeru, např. admin/order
     * @param array|null $params URL parametry přijímané managerem
     */
    public function setUrl(string $url, ?array $params = null): Grid
    {
        $this->datalist_url = _bu() . '/' . $url . '/data-list';
        if (!is_null($params)) {
            $this->datalist_url .= '?';
            $urlParamsArray = [];
            foreach ($params as $k => $v) {
                $urlParamsArray[] = $k.'='.$v;
            }
            $this->datalist_url .= implode('&', $urlParamsArray);
        }
        $this->delete_url = _bu() . '/' . $url . '/data-delete';
        $this->update_url = _bu() . '/' . $url . '/data-update';
        $this->create_url = _bu() . '/' . $url . '/data-create';

        if(is_null($this->inline_edit_action))
            $this->inline_edit_action = $this->update_url;

        return $this;
    }

    /**
     * Nastavuje vlastní URL pro práci s daty
     *
     * @param string     $url    Url ke controlleru, např. admin/order
     * @param array $dataActions actionony pro vlastní správu dat v url controlleru
     * @param array|null $params URL parametry přijímané managerem/controllerem
     */
    public function setDirectUrl(string $url, array $dataActions = [
        'data-list' => 'data-list',
        'data-delete' => 'data-delete',
        'data-update' => 'data-update',
        'data-create' => 'data-create'
    ], ?array $params = null): Grid
    {
        $this->datalist_url = _bu() . '/' . $url . '/' . ($dataActions['data-list'] ?? 'data-list');
        if (!is_null($params)) {
            $this->datalist_url .= '?';
            foreach ($params as $k => $v) {
                $this->datalist_url .= $k . '=' . $v;
            }
        }
        $this->delete_url = _bu() . '/' . $url . '/' . ($dataActions['data-delete'] ?? 'data-delete');
        $this->update_url = _bu() . '/' . $url . '/' . ($dataActions['data-update'] ?? 'data-update');
        $this->create_url = _bu() . '/' . $url . '/' . ($dataActions['data-create'] ?? 'data-create');

        if(is_null($this->inline_edit_action))
            $this->inline_edit_action = $this->update_url;

        return $this;
    }

    /**
     * Vrací URL akce manageru DataList
     *
     * @return string
     */
    public function getDatalistUrl(): string
    {
        return $this->datalist_url;
    }

    /**
     * Vrací URL akce manageru DataDelete
     *
     * @return string
     */
    public function getDeleteUrl(): string
    {
        return $this->delete_url;
    }

    /**
     * Vrací URL akce manageru DataUpdate
     *
     * @return string
     */
    public function getUpdateUrl(): string
    {
        return $this->update_url;
    }

    /**
     * Vrací URL akce manageru DataCreate
     *
     * @return string
     */
    public function getCreateUrl(): string
    {
        return $this->create_url;
    }

    public function setDatalistUrl(string $datalist_url): Grid
    {
        $this->datalist_url = $datalist_url;

        return $this;
    }

    public function setDeleteUrl(string $delete_url): Grid
    {
        $this->delete_url = $delete_url;

        return $this;
    }

    public function setUpdateUrl(string $update_url): Grid
    {
        $this->update_url = $update_url;

        return $this;
    }

    public function setCreateUrl(string $create_url): Grid
    {
        $this->create_url = $create_url;

        return $this;
    }



    /**
     * Přidá nový sloupec do gridu
     *
     * @param int    $format   Formát hodnoty ve sloupci
     * @param string $column   Název sloupce v DB
     * @param string $name     Popisek sloupce
     * @param null   $minWidth Minimální šířka sloupce v px
     *
     * @return Column
     */
    public function addColumn(int $format, string $column, string $name, $minWidth = null): Column
    {
        $col = new Column($format, $column, $name, $minWidth, $this);
        $this->cols[] = $col;

        return $col;
    }

    /**
     * Přidá novou uživatelskou akci - tlačítko
     *
     * @param string $id         DOM id
     * @param string $label      Text v tlačítku
     * @param string $classes    HTML class
     * @param string $onclick    JS event po kliknutí
     * @param array  $visibility Viditelnost [button, context_menu, row]
     */
    public function addAction(string $id, string $label, ?string $onclick, array $visibility = [
        true,
        true,
        true
    ]
    ): Action {
        $action = new Action($this, $id, $label, $onclick, $visibility);
        $this->actions[$id] = $action;

        return $action;
    }

    public function clearActions(){
        $this->actions = [];
        return $this;
    }

    /**
     * Nastavení sloupce, určující pořadí
     *
     * @param string $column Název sloupce v DB
     */
    public function setReorderColumn(string $column, $custom_row_reorder = false): Grid
    {
        $this->order_column = $column;
        $this->custom_row_reorder = $custom_row_reorder;

        return $this;
    }

    /**
     * Vrací sloupec, určující pořadí. Pokud je null, funkce je vypnutá
     *
     * @return string|null
     */
    public function getOrderColumn(): ?string
    {
        return $this->order_column;
    }

    public function getCustomRowReorder(): bool
    {
        return $this->custom_row_reorder;
    }

    /**
     * Vrací způsob výběru řádků gridu
     *
     * @return string
     */
    public function getSelect(): string
    {
        return $this->select;
    }

    /**
     * Vrací způsob výběru řádků gridu (pouze z načtených dat/ze všech dat)
     *
     * @return string
     */
    public function getMultipleType(): string
    {
        return $this->multipleType;
    }

    /**
     * Nastavuje typ možnosti výběru řádků
     *
     * @param string $type
     */
    public function setSelect(string $type, $multipleType = self::SELECT_MULTI_TYPE_ONLY_LOADED): Grid
    {
        $this->select = $type;
        $this->multipleType = $multipleType;

        return $this;
    }

    /**
     * Vrací uživatelskou JS funkci formátování řádků
     *
     * @return string|null
     */
    public function getRowFormatter(): ?string
    {
        return $this->rowFormatter;
    }

    /**
     * Nastavuje název uživatelké JS funkci pro formátování řádků
     *
     * @param string $rowFormatter
     */
    public function setRowFormatter(string $rowFormatter): Grid
    {
        $this->rowFormatter = $rowFormatter;

        return $this;
    }

    /**
     * Vrací JSON s nastavením napojení na rodičovský grid
     *
     * @return string
     */
    public function getParentGrid(): array
    {
        $result = [];

        foreach ($this->relations as $relation){
            $tmp = $relation;

            $tmp['grid'] = $relation['grid']->getId();
            $result[] = $tmp;
        }

        return $result;
    }

    public function getParentGridJson(): string
    {
        return json_encode($this->getParentGrid());
    }

    /**
     * Nastavuje rodičovský grid ve smyslu dvou na sebe závislých gridů
     *
     * @param Grid   $parent_grid   Rodičovský grid
     * @param string $parent_column Sloupec rodičovské entity
     */
    public function setParentGrid(Grid $parent_grid, string $parent_column, string $child_column = 'ID'): Grid
    {
        $this->relations = [
            [
                'grid' => $parent_grid,
                'column' => $parent_column,
                'child' => $child_column,
            ]
        ];

        return $this;
    }

    /**
     * Nastavuje rodičovský grid ve smyslu dvou na sebe závislých gridů
     *
     * @param Grid   $parent_grid   Rodičovský grid
     * @param string $parent_column Sloupec rodičovské entity
     * @param array $relations [['column' => '', 'child' => ''],...]
     */
    public function setParentGridRelations(Grid $parent_grid, array $relations): Grid
    {
        $this->relations = $relations;
        foreach ($this->relations as &$rel){
            $rel['grid'] = $parent_grid;
        }

        return $this;
    }

    /**
     * Nastavuje rodičovské gridy ve smyslu dvou a více na sebe závislých gridů
     *
     * @param array $relations [['column' => '', 'child' => '', 'grid' => Grid],...]
     */
    public function setParentRelations(array $relations): Grid
    {
        $this->relations = $relations;

        return $this;
    }

    /**
     * Vrací ID gridu
     *
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * Nastavuje ID gridu
     *
     * @param string $id
     */
    public function setId(string $id): Grid
    {
        $this->name = $id;
        $this->id = $this->name . '_datagrid';

        return $this;
    }

    /**
     * Vrací, zda má grid filtr
     *
     * @return bool
     */
    public function hasFilter(): bool
    {
        if($this->getDataSaveType() == self::SAVE_DATA_LOCAL){
            return false;
        }

        return $this->has_filter;
    }

    /**
     * Nastavuje, zda má grid filtr
     *
     * @param bool $has_filter
     */
    public function setHasFilter(bool $has_filter): Grid
    {
        $this->has_filter = $has_filter;

        return $this;
    }

    public function enableRelationSwitcher(string $title, string $source_url, string $relations_url, string $parent_column, string $child_column, string $child_name_column, ?array $params = null,  ?string $group_by_column = null, ?string $group_by_name_column = null): void
    {
        $this->relation_switcher = [];
        $this->relation_switcher['relations_url'] = _bu() . '/' . $relations_url . '/data-list';
        $this->relation_switcher['source_url'] = _bu() . '/' . $source_url . '/data-list';
        if (!is_null($params)) {
            $this->relation_switcher['source_url'] .= '?';
            foreach ($params as $k => $v) {
                $this->relation_switcher['source_url'] .= $k . '=' . $v;
            }
        }
        $this->relation_switcher['delete_url'] = _bu() . '/' . $relations_url . '/data-delete';
        $this->relation_switcher['create_url'] = _bu() . '/' . $relations_url . '/data-create';
        $this->relation_switcher['child_name_column'] = $child_name_column;
        $this->relation_switcher['parent_column'] = $parent_column;
        $this->relation_switcher['child_column'] = $child_column;
        $this->relation_switcher['title'] = $title;
        $this->relation_switcher['group_by_column'] = $group_by_column;
        $this->relation_switcher['group_by_name_column'] = $group_by_name_column;
    }

    /**
     * Vrací Relation Switcher gridu
     *
     * @return false|string
     */
    public function getRelationSwitcher()
    {
        if (!$this->relation_switcher) {
            return false;
        } else {
            return json_encode($this->relation_switcher);
        }
    }

    /**
     * Povoluje zobrazení vyhledávání v gridu
     *
     * @param array|string $column      Název sloupce, ve kterém se má vyhledávat nebo searchAs
     * @param string       $placeholder Placeholder inputu
     * @param array        $searchType  Pole itemů v checkboxu vedle vyhledávání
     */
    public function enableSearch($column, string $placeholder, $searchType = null): Grid
    {
        $this->search = [$column, $placeholder, $searchType];

        return $this;
    }

    /**
     * Vrací nastavení vyhledávání
     *
     * @return array|null
     */
    public function getSearch(): ?array
    {
        if ($this->search == null) {
            return null;
        }
        if (is_array($this->search[0])) {
            return [implode(',', $this->search[0]), $this->search[1], $this->search[2]];
        } else {
            return $this->search;
        }
    }

    /**
     * Vrací zda mají sloupce implicitně zapnuto filtrování
     *
     * @return bool
     */
    public function getFilterDefault(): bool
    {
        return $this->filter_default;
    }

    /**
     * Nastavuje zda mají mít sloupce implicitně zapnuto filtrování
     *
     * @param bool $filter
     */
    public function setFilterDefault($filter = true): Grid
    {
        $this->filter_default = $filter;

        return $this;
    }

    /**
     * Vrací výšku gridu
     *
     * @return string
     */
    public function getHeight(): string
    {
        return $this->height;
    }

    /**
     * Nastavuje výšku gridu
     *
     * @param string $height
     */
    public function setHeight(string $height): Grid
    {
        $this->height = $height;

        return $this;
    }

    /**
     * Vrací výchozí řazení
     *
     * @return string
     */
    public function getOrder(): string
    {
        return json_encode($this->order);
    }

    /**
     * Nastavuje výchozí řazení
     *
     * @param string $column Sloupec
     * @param string $order  Řazení
     */
    public function setOrder(string $column, string $order = 'asc'): Grid
    {
        $this->order = ['order' => strtolower($order), 'column' => $column];

        return $this;
    }

    /**
     * @return mixed
     */
    public function getSuper()
    {
        return $this->super;
    }

    /**
     * Vrací zda má grid možnost náhledu
     *
     * @return bool
     */
    public function isPreview(): bool
    {
        return $this->preview;
    }

    /**
     * Povolení rychlého preview řádku
     *
     * @param bool $preview
     */
    public function enablePreview(bool $preview = true): Grid
    {
        $this->preview = $preview;

        return $this;
    }

    /**
     * @return array
     */
    public function getBaseActions(): array
    {
        return $this->baseActions;
    }

    /**
     * Render gridu do HTML
     *
     * @return string
     * @throws \Exception
     */
    public function render()
    {
        if (is_null($this->datalist_url) && $this->isAjax()) {
            throw new \Exception('Unable to render Grid. Data list URL must be specified.');
        }

        $latte = Latte::getInstance()->getEngine();
        $params = [
            "id" => $this->id,
            "name" => $this->name,
            "filterForm" => $this->generateFilter(),
            "grid" => $this,
        ];

        $html = new Html();
        $html->setHtml($latte->renderToString(__DIR__ . '/latte/' . strtolower($this->class) . '.latte', $params));

        return $html;
    }

    /**
     * Funkce pro vygenerování filtrovacího formuláře
     *
     * @return Form
     */
    protected function generateFilter(): Form
    {
        $group = $this->filterFormGroup;
        $group->setColumns(2);
        foreach ($this->cols as $col) {
            if ($col->hasFilter()) {
                switch ($col->getFormat()) {
                    case COLUMN_BOOL:
                    case COLUMN_CHECKBOX:
                        $group->addBoolRadioButton($col->getColumn() . '__filter', $col->getLabel(), true);
                        break;
                    case COLUMN_ENTITY:
                    case COLUMN_ENUM:
                        $group->addMultiSelect($col->getColumn() . '__filter', $col->getLabel(), $col->getEntityValues(false));
                        break;
                    case COLUMN_DATE:
                    case COLUMN_DATETIME:
                    case COLUMN_NUMBER:
                    case COLUMN_CURRENCY:
                        if ($col->getFormat() == COLUMN_DATE || $col->getFormat() == COLUMN_DATETIME) {
                            $from = $group->addDateBox($col->getColumn() . 'From' . '__filter', $col->getLabel() . ' ' . Lang::getInstance()->translate('FROM'));
                            $to = $group->addDateBox($col->getColumn() . 'To' . '__filter', $col->getLabel() . ' ' . Lang::getInstance()->translate('TO'));
                        } else {
                            if ($col->getFormat() == COLUMN_NUMBER) {
                                $from = $group->addNumericBox($col->getColumn() . 'From' . '__filter', $col->getLabel() . ' ' . Lang::getInstance()->translate('FROM'));
                                $to = $group->addNumericBox($col->getColumn() . 'To' . '__filter', $col->getLabel() . ' ' . Lang::getInstance()->translate('TO'));
                            } else {
                                if ($col->getFormat() == COLUMN_CURRENCY) {
                                    $from = $group->addCurrencyBox($col->getColumn() . 'From' . '__filter', $col->getLabel() . ' ' . Lang::getInstance()->translate('FROM'));
                                    $to = $group->addCurrencyBox($col->getColumn() . 'To' . '__filter', $col->getLabel() . ' ' . Lang::getInstance()->translate('TO'));
                                }
                            }
                        }
                        $from->setColumnSize(3);
                        $from->getControlPart()->setAttribute('data-range', 'from');
                        $from->getControlPart()->setAttribute('data-range-target', $col->getColumn() . '__filter');
                        $to->setColumnSize(3);
                        $to->getControlPart()->setAttribute('data-range', 'to');
                        $to->getControlPart()->setAttribute('data-range-target', $col->getColumn() . '__filter');
                        break;
                    default:
                        $group->addTextBox($col->getColumn() . '__filter', $col->getLabel());
                }
            }
        }

        foreach ($this->filterForm->getFormGroups() as $group){
            foreach ($group->getFormControls() as $formControl){
                if(!str_ends_with($formControl->getName(), '__filter')){
                    $formControl->setName($formControl->getName() . '__filter');
                }
            }
        }

        return $this->filterForm;
    }

    /**
     * Vrací formulář s přepínači
     *
     * @return FormGroup
     */
    public function getSwitchesForm(): FormGroup
    {
        return $this->switchesForm;
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->getId();
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getInlineEditAction(): ?string
    {
        return $this->inline_edit_action;
    }

    public function setInlineEditAction(?string $action = null): self
    {
        $this->inline_edit_action = $action;
        return $this;
    }

    public function setEditorCache(bool $cache): self
    {
        $this->cacheEditor = $cache;
        return $this;
    }

    public function getEditorCache(): bool
    {
        return $this->cacheEditor;
    }

    /**
     * Nastaví kolik řádků se má načítat (čím menší číslo, tím míň řádků si natahá ze serveru, neodpovída ale 1:1 se zadanou hodnotou)
     *
     * @return self
     */
    public function setDisplayBuffer(int $displayBuffer = 25): self
    {
        $this->displayBuffer = $displayBuffer;
        return $this;
    }

    public function getDisplayBuffer(): int
    {
        return $this->displayBuffer;
    }

    public function setInfiniteScroll($infiniteScroll = true): self
    {
        $this->infiniteScroll = $infiniteScroll;
        return $this;
    }

    public function getInfiniteScroll(): bool
    {
        return $this->infiniteScroll;
    }

    /**
     * Nastavuju, zdali se májí data sub/gridu ukládat přímo na server, nebo jen do lokální paměti

     * @return self
     */
    public function setDataSaveType(string $dataSaveType, $dataSaveParams = []): self
    {
        if($dataSaveType === self::SAVE_DATA_LOCAL && !array_key_exists('managerAlias', $dataSaveParams) && ($this instanceof SubGrid || $this instanceof SubGridVue))
            throw new \Exception('Unable to render SubGrid. Please set managerAlias in dataSaveParams');

        $this->dataSaveParams = $dataSaveParams;
        $this->dataSaveType = $dataSaveType;
        return $this;
    }

    public function getDataSaveParams($asJson = false): array | string
    {
        if($asJson)
            return json_encode($this->dataSaveParams);
        else
            return $this->dataSaveParams;
    }

    public function getDataSaveType(): string
    {
        return $this->dataSaveType;
    }

    public function disableControls(): self
    {
        $this->enable_controls = false;
        return $this;
    }

    public function enableControls(): self
    {
        $this->enable_controls = true;
        return $this;
    }

    public function hasControlsEnabled(): bool
    {
        return $this->enable_controls;
    }

    public function disableRefresh(): self
    {
        $this->enable_refresh = false;
        return $this;
    }

    public function enableRefresh(): self
    {
        $this->enable_refresh = true;
        return $this;
    }

    public function hasRefreshEnabled(): bool
    {
        return $this->enable_refresh;
    }

    public function oneMustBeSelected($selected = true): self
    {
        $this->one_must_be_selected = $selected;
        return $this;
    }

    public function mustBeOneSelected(): bool
    {
        return $this->one_must_be_selected;
    }

    public function setAjax($ajax = true): self
    {
        $this->disableControls();
        $this->setEnabledActions(false, false, false);
        $this->ajax = $ajax;
        return $this;
    }

    public function isAjax(): bool
    {
        return $this->ajax;
    }

    public function setData(?array $data): self
    {
        $this->data = $data;
        return $this;
    }

    public function getData(): ?array
    {
        return $this->data;
    }

    public function getDataJson(): string
    {
        return json_encode($this->data);
    }

    public function setColumnReorder(bool $columnReorder = true): self
    {
        $this->columnReorder = $columnReorder;
        return $this;
    }

    public function getColumnReorder(): bool
    {
        return $this->columnReorder;
    }

    public function getPresetSaveType(): string
    {
        return $this->presetSaveType;
    }

    public function setPresetSaveType(string $presetSaveType): self
    {
        $this->presetSaveType = $presetSaveType;
        return $this;
    }

    public function getPresetServersideUrl(): ?string
    {
        return self::$PRESET_SAVE_SERVERSIDE_URL;
    }
    public function getFilterForm(): Form
    {
        return $this->filterForm;
    }

    public function getFilterFormGroup(): FormGroup
    {
        return $this->filterFormGroup;
    }

    /**
     * @return bool
     */
    public function useFiltersBar(): bool
    {
        return $this->use_filters_bar;
    }

    /**
     * @param bool $use_filters_bar
     *
     * @return Grid
     */
    public function setUseFiltersbar(bool $use_filters_bar): Grid
    {
        $this->use_filters_bar = $use_filters_bar;

        return $this;
    }

    /**
     * @return bool
     */
    public function isRenderInCreateEditor(): bool
    {
        return $this->renderInCreateEditor;
    }

    /**
     * @param bool $renderInCreateEditor
     */
    public function setRenderInCreateEditor(bool $renderInCreateEditor): Grid
    {
        $this->renderInCreateEditor = $renderInCreateEditor;
        return $this;
    }

    public function isSwitchesFormToEditor(): bool
    {
        return $this->switchesFormToEditor;
    }

    public function setSwitchesFormToEditor(bool $switchesFormToEditor = true): Grid
    {
        $this->switchesFormToEditor = $switchesFormToEditor;

        return $this;
    }



    public function getContextMenuSetting(){
        $settings = [];

        if($this->getEnabledActions()['add'] && ((!is_null($this->getEditAction()) ||  !is_null($this->getQuickeditAction())) || (($this->class == 'SubGrid' || $this->class == 'SubGridVue') && $this->getQuickEditor() != null))){
            $settings[] = $this->getBaseActions()['add']->getContextMenuItemSetting();
        }

        if($this->getEnabledActions()['edit'] && ((!is_null($this->getEditAction()) ||  !is_null($this->getQuickeditAction())) || (($this->class == 'SubGrid' || $this->class == 'SubGridVue') && $this->getQuickEditor() != null)) && $this->getSelect() == 'single'){
            $settings[] = $this->getBaseActions()['edit']->getContextMenuItemSetting();
        }

        if($this->getEnabledActions()['remove']){
            $settings[] = $this->getBaseActions()['remove']->getContextMenuItemSetting();
        }

        foreach ($this->actions as $action){
            $setting = $action->getContextMenuItemSetting();

            if($setting){
                $settings[] = $setting;
            }
        }

        return $settings;
    }

    public function getContextMenuSettingJson(){
        return json_encode($this->getContextMenuSetting());
    }

    public function toArray(){
        $this->generateFilter();

        $cols = [];
        foreach ($this->cols as $col){
            $cols[] = $col->toArray();
        }
        $actions = [];
        foreach ($this->actions as $action){
            $actions[] = $action->toArray();
        }
        $baseActions = [];
        foreach ($this->baseActions as $key => $action){
            $baseActions[$key] = $action->toArray();
        }

        $relations = [];
        foreach ($this->relations as $relation){
            $relations[] = [
                'grid' => $relation['grid']->getId(),
                'column' => $relation['column'],
                'child' => $relation['child'],
            ];
        }


        $array = [
            'class' => $this->class,
            'id' => $this->id,
            'name' => $this->name,
            'cacheEditor' => $this->cacheEditor,
            'datalist_url' => $this->datalist_url,
            'delete_url' => $this->delete_url,
            'update_url' => $this->update_url,
            'create_url' => $this->create_url,
            'cols' => $cols,
            'actions' => $actions,
            'baseActions' => $baseActions,
            'edit_action' => $this->edit_action,
            'inline_edit_action' => $this->inline_edit_action,
            'quickedit_action' => $this->quickedit_action,
            'quickedit_maxWidth' => $this->quickedit_maxWidth,
            'enabled_actions' => $this->enabled_actions,
            'title' => $this->title,
            'relations' => $relations, //??? ma v sobě odkaz na grid->ID
            'order_column' => $this->order_column,
            'select' => $this->select,
            'has_filter' => $this->has_filter,
            'rowFormatter' => $this->rowFormatter,
            'search' => $this->search,
            'relation_switcher' => $this->relation_switcher,
            'filter_default' => $this->filter_default,
            'height' => $this->height,
            'preview' => $this->preview,
            'order' => $this->order,
            'one_must_be_selected' => $this->one_must_be_selected,
            'switchesForm' => $this->switchesForm ? $this->switchesForm->getParent()->toArray() : null,
            'multipleType' => $this->multipleType,
            'displayBuffer' => $this->displayBuffer,
            'infiniteScroll' => $this->infiniteScroll,
            'dataSaveType' => $this->dataSaveType,
            'dataSaveParams' => $this->dataSaveParams,
            'enable_controls' => $this->enable_controls,
            'enable_refresh' => $this->enable_refresh,
            'ajax' => $this->ajax,
            'data' => $this->data,
            'columnReorder' => $this->columnReorder,
            'custom_row_reorder' => $this->custom_row_reorder,
            'filterForm' => $this->filterForm ? $this->filterForm->toArray() : null,
//            'filterFormGroup' => $this->filterFormGroup ? $this->filterFormGroup->toArray() : null, //Odkaz na filterForm groups[0]
            'presetSaveType' => $this->presetSaveType,
            'presetServersideUrl' => $this->getPresetServersideUrl(),
            'use_filters_bar' => $this->use_filters_bar,
            'renderInCreateEditor' => $this->renderInCreateEditor,
            '_bu' => $this->_bu,
            'switchesFormToEditor' => $this->switchesFormToEditor,
            'componentType' => 'Grid',
        ];

        return $array;
    }

    public function toJson(){
        return json_encode($this->toArray());
    }


}