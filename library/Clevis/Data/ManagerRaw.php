<?php

use Common_Model_Language as Languages;
use common\logic\Eshop\Eshop;

/**
 * Manager
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Data_ManagerRaw extends Clevis_Data_Manager {

    /**
     * Rozdelovac rozsahu
     * @var char
     */
    private $rangeCharSeparator = ':';

    private $languageManipulation = null;

    private $eshopManipulation = null;

    /**
     *
     * @param type $char
     */
    public function setRangeCharSeparator($char = ':') {
        $this->rangeCharSeparator = $char;
    }

    /**
     * Perform data list action
     *
     * @param array $attributes
     * @param integer $listType (LIST_LISTING | LIST_HIERARCHY)
     */
    public function performDataList(Array $attributes, $listType) {
        Clevis_Timer::start('run-action-data-list');
        $this->onDataStart();

        // Begin transaction
        $connection = Doctrine_Manager::getInstance()->connection();
        $connection->beginTransaction();

        // Update attributes
        $this->onDataAttributes($attributes, $connection);

        // Create doctrine query
        $query = new Clevis_Data_ManagerRawQuery();
        $query->from($this->modelDefinition, 'entity');

        // Select all column if it is list
        foreach ($this->modelColumns as $column) {
            if (array_key_exists($column, $this->modelColumnsMapLoad)) {
                $query->addSelect('entity.' . $column, $this->modelColumnsMapLoad[$column]);
            } else {
                $query->addSelect('entity.' . $column, $column);
            }
        }

        $count = null;
        if (array_key_exists('count', $attributes)) {
            $count = $attributes['count'];
            unset($attributes['count']);
        }

        // Perform list
        $this->onDataList($query, $attributes, $listType, $connection);

        // Order by
        if (array_key_exists('sort', $attributes)) {
            $orderByColumn = null;
            $orderByOrder = null;
            if (substr($attributes['sort'], 0, 1) == '-') {
                $orderByColumn = substr($attributes['sort'], 1);
                $orderByOrder = 'DESC';
            } else {
                $orderByColumn = $attributes['sort'];
                $orderByOrder = 'ASC';
            }
            if ($this->modelDefinition->hasColumn($orderByColumn)) {
                $query->orderBy($query->getFromAlias() . '.' . $orderByColumn . ' ' . $orderByOrder);
            } else if ($query->hasSelectedColumn($orderByColumn)) {
                $query->orderBy($query->getSelectedColumn($orderByColumn) . ' ' . $orderByOrder);
            }
        } else {
            // Order by model identifier
            $sort = '';
            foreach ($this->modelIdentifier as $identifier) {
                if (strlen($sort) > 0)
                    $sort .= ',';
                $sort .= $query->getFromAlias() . '.' . $identifier;
            }
            $query->orderBy($sort);
        }

        // Filter identifier
        if (array_key_exists('id', $attributes)) {
            $identifier = $this->getModelUniqueIdentifier(true);
            $query->andWhere($query->getFromAlias() . '.' . $identifier . ' = {1}', $attributes['id']);
            unset($attributes['id']);
        }
        foreach ($this->modelIdentifier as $identifier) {
            if (array_key_exists($identifier, $attributes)) {
                $value = $attributes[$identifier];
                if ($value == null) {
                    $query->andWhere($query->getFromAlias() . '.' . $identifier . ' IS NULL');
                } else if (is_array($value)) {
                    $binding = [];
                    foreach ($value as $key => $item) {
                        $binding[] = '{'.($key+1).'}';
                    }
                    $query->andWhere($query->getFromAlias() . '.' . $identifier . ' IN ('.implode(', ',$binding).')', $value);
                } else {
                    $query->andWhere($query->getFromAlias() . '.' . $identifier . ' = {1}', $value);
                }
            }
        }

        // Get sql query
        $query = $query->getQuery();

        // Get page size
        $pageStart = array_key_exists('start', $attributes) ? $attributes['start'] : 0;
        $pageSize = null;
        if ($count != null)
            $pageSize = $count;

        // Fetch results
        $dataArray = null;
        $dataArrayCount = null;
        if ($pageSize != null && $pageSize != 0) {
            // Paging Version 1
            $dataArrayCount = $connection->execute('SELECT COUNT(*) FROM (' . $query . ') AS data')->fetchColumn(0);
            $dataArray = $connection->execute($query . ' LIMIT ' . $pageSize . ' OFFSET ' . $pageStart)->fetchAll(PDO::FETCH_ASSOC);

            // Paging Version 2
            /* $connection->execute('DECLARE data SCROLL CURSOR FOR ' . $query);
              $dataArrayCount = $connection->execute('MOVE FORWARD ALL IN data')->rowCount();
              $connection->execute('MOVE ABSOLUTE ' . $pageStart . ' IN data');
              $dataArray = $connection->execute('FETCH FORWARD ' . $pageSize . ' FROM data;')->fetchAll(PDO::FETCH_ASSOC); */
        } else {
            // Not paging
            $statement = $connection->execute($query);
            $dataArray = $statement->fetchAll(PDO::FETCH_ASSOC);
        }

        $connection->commit();

        // Finish data list
        return $this->performDataListFinish($attributes, $listType, $dataArray, $dataArrayCount);
    }

    /**
     * Add where to query
     *
     * @param Doctrine_Query $query
     * @param string $filterType
     * @param string $column
     * @param string $value
     */
    private function addWhereToQuery(Clevis_Data_ManagerRawQuery $query, $filterType, $column, $value) {
        if ($filterType == Clevis_Data_Manager::FILTER_NONE) {
            // do nothing
        } if ($filterType == Clevis_Data_Manager::FILTER_RANGE) {
            $rangeBegin = $value[0];
            if ($rangeBegin == '')
                $rangeBegin = null;
            $rangeEnd = $value[1];
            if ($rangeEnd == '')
                $rangeEnd = null;
            if ($rangeBegin != null) {
                $query->andWhere($column . ' >= {1}', $rangeBegin);
            }
            if ($rangeEnd != null) {
                $query->andWhere($column . ' <= {1}', $rangeEnd);
            }
        } else {
            if ($value == null) {
                $query->andWhere($column . ' IS NULL');
            } else if ($filterType == Clevis_Data_Manager::FILTER_LIKE) {
                $query->andWhere($column . ' LIKE {1}', '%' . $value . '%');
            } else if ($filterType == Clevis_Data_Manager::FILTER_DATE) {
                $query->andWhere($column . ' = {1}', '' . $value . '');
            } else if ($filterType == Clevis_Data_Manager::FILTER_BOOL) {
                if ($value == 'true')
                    $value = 1;
                else if ($value == 'false')
                    $value = 0;
                else if ($value == '' || $value == 'all')
                    return;
                $query->andWhere($column . ' = {1}', $value);
            } else {
                // Filter type all can stop filtering on 'all' or '' value
                if ($filterType == Clevis_Data_Manager::FILTER_ALL) {
                    if ($value == '' || $value == 'all')
                        return;
                }
                if (is_array($value)) {
                    if (count($value) > 0) {
                        if (is_string($value[0])) {
                            $items = '';

                            foreach ($value as $item) {
                                if (strlen($items) > 0)
                                    $items .= ',';
                                $items .= '\'' . $item . '\'';
                            }
                            $value = $items;
                        } else {
                            $value = implode(',', $value);
                            if ($value === '')
                                $value = '0';
                        }
                    } else {
                        $value = 'NULL';
                    }
                    $query->andWhere($column . ' IN (' . $value . ')');
                } else {
                    $query->andWhere($column . ' = {1}', $value);
                }
            }
        }
    }

    /**
     * Perform data list
     *
     * @param Clevis_Data_ManagerRawQuery $query
     * @param array $attributes
     * @param string $listType
     * @param Doctrine_Connection $connection
     */
    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        // Is data list allowed?
        if (($this->dataType & self::DATA_LIST) == 0)
            throw new Exception('Data List is not allowed for manager [' . get_class($this) . '] with model [' . $this->model . ']!');

        // Where clause
        foreach ($attributes as $paramName => $paramValue) {
            if ($paramValue == '*' || $paramValue === '')
                continue;

            if ($this->modelDefinition->hasColumn($paramName) && !$this->modelDefinition->isIdentifier($paramName) && $paramName != 'id') {
                // Prepare column name
                $column = null;
                $column = 'entity.' . $paramName;
                if (array_key_exists($paramName, $this->columnFilters)) {
                    $filter = array_key_exists($paramName, $this->columnFilters) ? $this->columnFilters[$paramName] : null;
                    if (array_key_exists('customColumn', $filter) && $filter['customColumn'] != null)
                        $column = $filter['customColumn'];
                }

                // Parse filter array
                $rangeArray = null;
                if (is_string($paramValue)) {
                    $rangeArray = explode(':', $paramValue);
                } else {
                    $rangeArray = array($paramValue);
                }

                // Filter single value
                if (count($rangeArray) == 1) {
                    $filterType = (array_key_exists($paramName, $this->columnFilters) && array_key_exists('type', $this->columnFilters[$paramName])) ? $this->columnFilters[$paramName]['type'] : null;
                }
                // Filter range
                else {
                    $filterType = Clevis_Data_Manager::FILTER_RANGE;
                    $paramValue = $rangeArray;
                }
                $this->addWhereToQuery($query, $filterType, $column, $paramValue);
            } else if (array_key_exists($paramName, $this->columnFilters)) {
                $filter = array_key_exists($paramName, $this->columnFilters) ? $this->columnFilters[$paramName] : null;
                $column = $paramName;
                if (array_key_exists('customColumn', $filter)) {
                    $column = $filter['customColumn'];
                }
                $this->addWhereToQuery($query, $filter['type'], $column, $paramValue);
            }
        }

        if (array_key_exists('gridSearch', $attributes) && strlen($attributes['gridSearch']) > 0) {
            $gridSearch = json_decode($attributes['gridSearch']);
            $where = '';
            $i = 0;
            foreach (explode(',',$gridSearch[0]) as $column) {
                if ($i > 0)
                    $where .= 'OR ';
                if (strpos($column,'.') === false)
                    $column = 'entity.' . $column;
                $where .= "{$column} LIKE '%{$gridSearch[1]}%' ";
                $i++;
            }
            $query->addWhere($where);
        }

        if ($this->languageManipulation != null) {
            foreach (Languages::getActiveLanguages() as $language) {
                foreach ($this->languageManipulation['columns'] as $c)
                    $query->addSelect($this->languageManipulation['relation_name'].$language['Code'].'.'.$c, $c.$language['Code']);
                $query->leftJoin('entity', $this->languageManipulation['relation_name'], $this->languageManipulation['relation_name'].$language['Code'], $this->languageManipulation['relation_name'].$language['Code'].'.Language_ID = '.$language['ID']);
            }
        }

        if ($this->eshopManipulation != null) {
            foreach (Eshop::getInstance()->getEshops() as $eshop){
                foreach ($this->eshopManipulation['columns'] as $c) {
                    $query->addSelect($this->eshopManipulation['relation_name'] . $eshop->ID . '.' . $c, $eshop->ID . '_' . $c);

                    if ($eshop->ID == Eshop::getInstance()->getEshopID())
                        $query->addSelect($this->eshopManipulation['relation_name'] . $eshop->ID . '.' . $c, '_' . $c);
                }
                $query->leftJoin('entity', $this->eshopManipulation['relation_name'], $this->eshopManipulation['relation_name'] . $eshop->ID, $this->eshopManipulation['relation_name'] . $eshop->ID . '.Eshop_ID = ' . $eshop->ID);
            }
        }
    }

    protected function onDataCreate(array &$attributes, Doctrine_Connection $connection) {
        $entity = parent::onDataCreate($attributes, $connection);

        if ($this->languageManipulation != null) {
            foreach (Languages::getActiveLanguages() as $language) {
                $lang = new $this->languageManipulation['class_name']();
                $lang->Language_ID = $language['ID'];
                foreach ($this->languageManipulation['columns'] as $c){
                    if (isset($attributes[$c.$language['Code']]))
                        $lang->$c = $attributes[$c.$language['Code']];
                    else
                        $lang->$c = null;
                }
                $entity->{$this->languageManipulation['relation_name']}[] = $lang;
            }
        }

        return $entity;
    }

    protected function onDataUpdate(Array &$attributes, Doctrine_Connection $connection) {
        $entity = parent::onDataUpdate($attributes, $connection);
        if ($this->languageManipulation != null) {
            foreach (Languages::getActiveLanguages() as $language) {
                $query = Doctrine_Query::create();
                $query->from($this->languageManipulation['class_name'].' object');
                $query->where("object.Language_ID = ?", $language['ID']);
                $query->andWhere("object.".$this->languageManipulation['relation_column']." = ?", $attributes['ID']);
                $entityExists = $query->count();

                if ( $entityExists ) {
                    $save_skip = true;
                    $query = Doctrine_Query::create();
                    $query->update($this->languageManipulation['class_name'] . ' object');
                    $query->where("object.Language_ID = ?", $language['ID']);
                    $query->andWhere("object." . $this->languageManipulation['relation_column'] . " = ?", $attributes['ID']);
                    foreach ($this->languageManipulation['columns'] as $c) {
                        if (array_key_exists($c . $language['Code'], $attributes) && $attributes[$c . $language['Code']] !== null) {
                            $query->set($c, '?', $attributes[$c . $language['Code']]);
                            $save_skip = false;
                        }
                    }

                    if (!$save_skip)
                        $query->execute();
                } else {
                    $lang = new $this->languageManipulation['class_name']();
                    $lang->Language_ID = $language['ID'];
                    foreach ($this->languageManipulation['columns'] as $c){
                        if (isset($attributes[$c.$language['Code']]))
                            $lang->$c = $attributes[$c.$language['Code']];
                        else
                            $lang->$c = null;
                    }
                    $entity->{$this->languageManipulation['relation_name']}[] = $lang;
                }
            }
        }

        return $entity;
    }

    public function setLanguagesManipulation(string $class_name, string $relation_name, string $relation_column, array $columns) {
        $this->languageManipulation = [
            'class_name' => $class_name,
            'relation_name' => $relation_name,
            'relation_column' => $relation_column,
            'columns' => $columns
        ];
    }

    public function setEshopManipulation(string $class_name, string $relation_name, string $relation_column, array $columns) {
        $this->eshopManipulation = [
            'class_name' => $class_name,
            'relation_name' => $relation_name,
            'relation_column' => $relation_column,
            'columns' => $columns
        ];
    }

    public function performDataGrid(array $attributes)
    {
        return $this->onDataGrid($attributes) ?? [];
    }

    public function performDataEditor(array $attributes)
    {
        return $this->onDataEditor($attributes) ?? [];
    }

    protected function onDataGrid(array $attributes){
        return [];
    }

    protected function onDataEditor(array $attributes){
        return [];
    }
}