<?php

namespace Jolanda\Sheets;

class Sheet
{
    public $id;
    public $modelDefinition;
    public $sheetDefinition;
    public $data;


    public function __construct($id, $modelDefinition, $sheetDefinition, $data)
    {
        $this->id = $id;
        $this->modelDefinition = $modelDefinition;
        $this->sheetDefinition = $sheetDefinition;
        $this->data = $data;
    }
}