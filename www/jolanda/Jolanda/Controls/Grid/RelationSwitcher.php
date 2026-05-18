<?php

namespace Jolanda\Controls\Grid;

use Jolanda\Controls\Editor\EntityEditor;
use Jolanda\Latte\Latte;

class RelationSwitcher
{

    private $settings = [];

    private $id;

    private $editor;

    public function __construct(EntityEditor $editor, string $title, string $source_url, string $relations_url, string $parent_column, string $child_column, string $child_name_column, ?array $params = null, ?string $group_by_column = null, ?string $group_by_name_column = null)
    {
        $this->id = 'rs_' . substr(md5(mt_rand()), 0, 7);
        $this->editor = $editor;

        $this->settings['relations_url'] = _bu() . '/' . $relations_url . '/data-list';
        $this->settings['source_url'] = _bu() . '/' . $source_url . '/data-list';
        $this->settings['params'] = null;
        if (!is_null($params)) {
            $this->settings['params'] = $params;
            $urlParams = [];
            foreach ($params as $k => $v)
                $urlParams[] = $k . '=' . $v;

            $this->settings['source_url'] .= '?'.implode('&', $urlParams);
        }
        $this->settings['delete_url'] = _bu() . '/' . $relations_url . '/data-delete';
        $this->settings['create_url'] = _bu() . '/' . $relations_url . '/data-create';
        $this->settings['child_name_column'] = $child_name_column;
        $this->settings['parent_column'] = $parent_column;
        $this->settings['child_column'] = $child_column;
        $this->settings['title'] = $title;
        $this->settings['group_by_column'] = null;
        $this->settings['group_by_name_column'] = null;

        if(!is_null($group_by_column))
            $this->settings['group_by_column'] = $group_by_column;
        if(!is_null($group_by_name_column))
            $this->settings['group_by_name_column'] = $group_by_name_column;
    }

    public function getSettings(): string
    {
        return json_encode($this->settings);
    }

    public function getEditor(): EntityEditor
    {
        return $this->editor;
    }

    public function render()
    {
        $latte = Latte::getInstance()->getEngine();
        $params = [
            "rs" => $this,
            'id' => $this->id
        ];

        return $latte->renderToString(__DIR__ . '/latte/relationswitcher.latte', $params);
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'settings' => $this->settings,
            'componentType' => basename(str_replace('\\', '/', get_class($this))),
        ];
    }

    public function toJson(): string
    {
        return json_encode($this->toArray());
    }

}