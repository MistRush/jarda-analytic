<?php

namespace Jolanda\Sheets;

use Clevis_Data_ManagerRaw as ManagerRaw;

class ModelDefinition
{
    public string $id;
    public string $name;
    public string $dataUrl;
    public array $columns;
    public array $relations;

    public function __construct($id, $name, $dataUrl, $columns, $relations)
    {
        $this->id = $id;
        $this->name = $name;
        $this->dataUrl = $dataUrl;
        $this->columns = $columns;
        $this->relations = $relations;
    }
}