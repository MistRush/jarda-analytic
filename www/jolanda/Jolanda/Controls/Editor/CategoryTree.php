<?php


namespace Jolanda\Controls\Editor;


use Jolanda\Latte\Latte;
use Nette\Utils\Html;

class CategoryTree
{

    /**
     * Rodičovský editor
     *
     * @var EntityEditor
     */
    public $editor;

    /**
     * ID stromu
     *
     * @var string
     */
    private $id;

    /**
     * Popisek stromu
     *
     * @var null|string
     */
    private $label;

    /**
     * Store
     *
     * @var array
     */
    private $store;

    /**
     * Datový strom
     *
     * @var array
     */
    private $tree;

    /**
     * Nastavení
     *
     * @var array
     */
    private $settings = [];

    /**
     * CategoryTree constructor
     *
     * @param EntityEditor $editor                  Rodičovský entity editor
     * @param string       $id                      ID prvku
     * @param string|null  $label                   Popisek
     * @param array        $store                   URL manageru zdrojových dat
     * @param string       $storeField              Název sloupce s názvem dat
     * @param string       $relation_url            URL manageru relační tabulky
     * @param string       $child_column            Sloupec vazby :N
     * @param string       $parent_column           Sloupec vazby M:
     * @param string       $self_referencing_column Sloupec vazby na sebe sama (pro vnoření)
     *
     * @return CategoryTree
     */
    public function __construct(EntityEditor $editor, string $id, ?string $label, array $store, string $storeField, string $relation_url, string $child_column, string $parent_column, string $self_referencing_column = 'Parent_ID')
    {
        $this->id = $id;
        $this->editor = $editor;
        $this->settings['delete_url'] = _bu() . '/' . $relation_url . '/data-delete';
        $this->settings['create_url'] = _bu() . '/' . $relation_url . '/data-create';
        $this->settings['data_url'] = _bu() . '/' . $relation_url . '/data-list';
        $this->settings['child_column'] = $child_column;
        $this->settings['parent_column'] = $parent_column;

        $result = [];
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
        foreach ($data['data'] as $item) {
            $result[] = [
                "text" => $item[$storeField],
                "id" => $item['ID'],
                "Parent_ID" => $item[$self_referencing_column]
            ];
        }

        $this->tree = $this->buildTree($result, [
            'parent_id_column_name' => 'Parent_ID',
            'children_key_name' => 'children',
            'id_column_name' => 'id']);
    }

    /**
     * Sestavuje strom
     *
     * @param array $elements
     * @param array $options
     * @param int   $parentId
     *
     * @return array
     */
    private function buildTree(array $elements, array $options, $parentId = 0)
    {
        $branch = array();
        foreach ($elements as $element) {
            if ($element[$options['parent_id_column_name']] == $parentId) {
                $children = $this->buildTree($elements, $options, $element[$options['id_column_name']]);
                if ($children) {
                    $element[$options['children_key_name']] = $children;
                } else {
                    $element[$options['children_key_name']] = [];
                }
                $branch[] = $element;
            }
        }

        return $branch;
    }

    /**
     * Vrací titulek stromu
     *
     * @return string|null
     */
    public function getLabel(): ?string
    {
        return $this->label;
    }

    /**
     * Nastavuje titulek stromu
     *
     * @param string|null $label
     */
    public function setLabel(?string $label): void
    {
        $this->label = $label;
    }

    /**
     * Vrací store
     *
     * @return array
     */
    public function getStore(): array
    {
        return $this->store;
    }

    /**
     * Nastavuje store
     *
     * @param array $store
     */
    public function setStore(array $store): void
    {
        $this->store = $store;
    }

    /**
     * Vrací strom
     *
     * @return array
     */
    public function getTree(): array
    {
        return $this->tree;
    }

    /**
     * Nastaveje datové pole stromu
     *
     * @param array $tree
     */
    public function setTree(array $tree): void
    {
        $this->tree = $tree;
    }

    /**
     * Vrací nastavení v JSONu
     *
     * @return string
     */
    public function getSettings(): string
    {
        return json_encode($this->settings);
    }

    /**
     * Renderuje CategoryTree
     *
     * @return Html
     */
    public function render()
    {
        $latte = Latte::getInstance()->getEngine();
        $params = [
            "categoryTree" => $this,
        ];

        $html = new Html();
        $html->setHtml($latte->renderToString(__DIR__ . '/latte/category-tree.latte', $params));

        return $html;
    }

    /**
     * Vrací ID
     *
     * @return string
     */
    public function __toString()
    {
        return $this->getId();
    }

    /**
     * Vrací ID stromu
     *
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * Nastavuje ID stromu
     *
     * @param string $id
     */
    public function setId(string $id): void
    {
        $this->id = $id;
    }

}