<?php

namespace Jolanda\Sheets\ManagerLoader;

use Clevis_Data_ManagerRaw as ManagerRaw;
use Jolanda\Sheets\ModelDefinition;

class Manager
{
    public string $managerName;
    public $manager;
    public bool $init = false;
    public function __construct($manager)
    {
        $this->manager = $manager;
        $this->managerName = get_class($manager);
    }

    public function initManager(){
        if($this->init){
            return $this->manager;
        }

        $attributes = [];
        $this->manager->init(\Clevis_Data_Manager::DATA_LIST, $attributes, \Clevis_Data_Manager::LIST_LISTING);
        $this->init = true;

        return $this->manager;
    }

    public function createDefinition(){
        $this->initManager();

        $columns = $this->getColumnsDefinition();
        $dataUrl = $this->getDataUrl();
        $relations = $this->getRealationsDefinition();

        $definition = new ModelDefinition($this->managerName, $this->managerName, $dataUrl, $columns, $relations);

        return $definition;
    }

    public function getColumns(){
        $this->initManager();

        return $this->manager->getDataListColumns();
    }

    public function getColumnsDefinition(){
        $result = [];
        $columns = $this->getColumns();

        foreach ($columns as $column){
            $result[] = [
                'data' => $column->alias ?? str_replace('entity.', '', $column->select),
                'title' => $column->alias ?? str_replace('entity.', '', $column->select),
                'type' => 'text',
                'defaultValue' => '',
            ];
        }

        return $result;
    }

    public function getDataUrl(){
        return _bu() . '/' . $this->nameToUrlPart() . '/data-list';
    }

    public function nameToUrlPart(){
        $originalString = $this->managerName;

        // Odstranění části "_Manager"
        $noManagerString = str_replace('_Manager', '', $originalString);

        // Převod na "kebab-case" a přidání lomítka
        // Nejprve převedeme PascalCase na kebab-case
        $kebabCase = preg_replace('/([a-z])([A-Z])/', '$1-$2', $noManagerString);

        // Nyní nahradíme první podtržítko lomítkem
        // Vzhledem k tomu, že máme odstranit část "_Manager", měli bychom mít pouze jedno podtržítko,
        // které nahradíme lomítkem
        $withSlash = str_replace('_', '/', $kebabCase);

        // Převedeme celý řetězec na malá písmena
        return strtolower($withSlash);
    }

    public function getRealationsDefinition(){
        $this->initManager();

        $result = [];

        $doctrineDefinition = $this->manager->getModelDefinition();

        if($doctrineDefinition){
            $managers = ManagersLoader::getInstance()->getManagersForModel($this->manager->getModel());

            foreach ($managers as $manager){
                $result[] = [
                    'model' => $manager->managerName,
                    'name' => $manager->managerName,
                    'localKey' => $doctrineDefinition->getIdentifier(),
                    'foreignKey' => $doctrineDefinition->getIdentifier(),
                ];
            }

            foreach ($doctrineDefinition->getRelations() as $relation){
                $managers = ManagersLoader::getInstance()->getManagersForModel($relation->getClass());
                foreach ($managers as $manager){
                    $result[] = [
                        'model' => $manager->managerName,
                        'name' => $manager->managerName,
                        'localKey' => $relation->getLocalFieldName(),
                        'foreignKey' => $relation->getForeignFieldName(),
                    ];
                }
            }
        }

        return $result;
    }
}