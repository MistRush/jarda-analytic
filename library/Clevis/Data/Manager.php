<?php

/**
 * Manager
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
abstract class Clevis_Data_Manager {

    /** Child type CHILD (default, list child as subchild (by alias) in tree) */
    const CHILD = 1;

    /** Child type MERGE (list child as merged values to current object in tree) */
    const MERGE = 2;

    /** Child type READ_ONLY (child will be only load but not stored) */
    const READ_ONLY = 4;

    /** Child type DISABLE_AUTO_CREATE (one child isn't auto created) */
    const DISABLE_AUTO_CREATE = 8;

    /** If child doesn't exist parent will be filtered out */
    const FLAG_REQUIRED = 16;

    /** Fetched is only one object (even if many relation is specified) */
    const FLAG_ONE = 32;

    /** Child type CHILD where fetched is only one object (even if many relation is specified) */
    const CHILD_ONE = 33;

    /** Child type MERGE where fetched is only one object (even if many relation is specified) */
    const MERGE_ONE = 34;

    /** Child type MERGE that is REQUIRED (if child doesn't exist parent will be filtered out) */
    const MERGE_REQUIRED = 18;

    /** List type LISTING (ie. grid listing) */
    const LIST_LISTING = 0;

    /** List type HIERARCHY (ie. edit dialog listing) */
    const LIST_HIERARCHY = 1;

    /** Relation type constants */
    const RELATION_MANY = 1;
    const RELATION_ONE = 2;

    /** Flag if relation foreign column is primary */
    const RELATION_PRIMARY = 4;

    /** Manager data type */
    const DATA_NONE = 0;
    const DATA_LIST = 1;
    const DATA_PRE_CREATE = 2;
    const DATA_CREATE = 4;
    const DATA_UPDATE = 8;
    const DATA_DELETE = 16;
    const DATA_EDIT = 30; // DATA_PRE_CREATE | DATA_CREATE | DATA_UPDATE | DATA_DELETE
    const DATA_ALL = 31; // DATA_LIST | DATA_EDIT

    /**
     * Value used in child manager filter definition which specify that this column will be ignored.
     * Is usefull for example in MERGE mode when merge entities has same column which is filtered and
     * we do not want to filter by it in merged entity so we set in MERGE child manager 'Column' => IGNORE
     */
    const IGNORE = '{ignore}';

    /**
     * Model
     *
     * @var string
     */
    protected $model = null;

    /**
     * Children managers
     *
     * @var string
     */
    protected $children = array();

    /**
     * Model identifier (array of columns)
     *
     * @var string|array
     */
    protected $modelIdentifier = null;

    /**
     * Model unique identifier column
     *
     * @var null
     */
    protected $modelUniqueIdentifier = null;

    /**
     * Model columns
     *
     * @var array
     */
    protected $modelColumns = null;

    /**
     * Model columns map used when loading (renaming columns)
     *
     * @var string
     */
    protected $modelColumnsMapLoad = array();

    /**
     * Model columns map used when saving (save other value than column name)
     *
     * @var string
     */
    protected $modelColumnsMapSave = array();

    /**
     * Model columns default inicialization flag
     *
     * @var array
     */
    protected $modelColumnsDefault = true;

    /**
     * Model definition from doctrine
     *
     * @var Doctrine_Table
     */
    protected $modelDefinition = null;

    /**
     * Column filters
     *
     * @var array
     */
    protected $columnFilters = array();

    /**
     * Manager data type
     *
     * @var integer
     */
    protected $dataType = self::DATA_ALL;

    /**
     * Constructor
     */
    public function __construct($model = null) {
        if ($model != null) {
            $this->setModel($model);
        }
    }

    /**
     * Set model
     *
     * @param string $model
     */
    protected function setModel($model) {
        $this->model = $model;
        $this->modelDefinition = Doctrine_Core::getTable($this->model);
        $this->modelColumns = $this->modelDefinition->getFieldNames();
        $this->modelIdentifier = $this->modelDefinition->getIdentifier();
        if (is_array($this->modelIdentifier) == false) {
            // Check primary key autoincrement
            if (Clevis_Helper::isDevelopmentEnvironment()) {
                $columnDefinition = $this->modelDefinition->getColumnDefinition(strtolower($this->modelIdentifier));
                if (array_key_exists('autoincrement', $columnDefinition) == false || $columnDefinition['autoincrement'] != true) {
                    $result = false;
                    foreach ($this->modelDefinition->getRelations() as $relation) {
                        if ($this->modelIdentifier == $relation->getLocalFieldName()) {
                            $result = true;
                        }
                    }

                    if ($result == false) {
                        throw new Exception('Column ' . $this->modelIdentifier . ' in model ' . $model . ' isn\'t set autoincrement, repair it in ORM definitions!');
                    }
                }
            }

            $this->modelUniqueIdentifier = $this->modelIdentifier;
            $this->modelIdentifier = array($this->modelIdentifier);
        }
    }

    /**
     * Set manager data type
     *
     * @param $dataType
     * @return void
     */
    public function setDataType($dataType) {
        $this->dataType = $dataType;
    }

    /**
     * @return manager data type
     */
    public function getDataType() {
        return $this->dataType;
    }

    /**
     * Remeve all model columns
     */
    public function resetModelColumns() {
        $this->modelColumnsDefault = false;
        $this->modelColumns = array();
    }

    /**
     * Add model column for manager to work with
     *
     * @param string $name
     */
    public function addModelColumn($name) {
        $this->modelColumnsDefault = false;
        $this->modelColumns[] = $name;
    }

    /**
     * Remove model column for manager
     *
     * @param string $name
     */
    public function removeModelColumn($name) {
        $this->modelColumnsDefault = false;
        array_remove($this->modelColumns, $name);
    }

    /**
     * Map model column for loading and saving
     *
     * @param string $from Column from name
     * @param string $to Column to name
     */
    public function mapModelColumn($from, $to) {
        $this->modelColumnsDefault = false;
        $this->modelColumnsMapLoad[$from] = $to;
        $this->modelColumnsMapSave[$to] = $from;
    }

    const FILTER_NONE = 'none';
    const FILTER_EQUAL = 'equal';
    const FILTER_LIKE = 'like';
    const FILTER_DATE = 'date';
    const FILTER_BOOL = 'bool';
    const FILTER_ALL = 'all';
    const FILTER_RANGE = 'range';
    const FILTER_DEFAULT = Clevis_Data_Manager::FILTER_EQUAL;

    /**
     * Set column filter
     *
     * @param string $column
     * @param string $filterType (FILTER_DEFAULT | FILTER_NONE | FILTER_EQUAL | FILTER_LIKE | FILTER_DATE | FILTER_RANGE)
     * @param string $filterCustomColumn
     */
    protected function setColumnFilter($column, $filterType = FILTER_DEFAULT, $filterCustomColumn = null) {
        $this->columnFilters[$column] = array('type' => $filterType, 'customColumn' => $filterCustomColumn);
    }

    /**
     * Get model
     *
     * @return string
     */
    public function getModel() {
        return $this->model;
    }

    /**
     * Get model identifier
     *
     * @return array
     */
    public function getModelIdentifier() {
        return $this->modelIdentifier;
    }

    /**
     * Set model unique identifier
     *
     * @param $modelUniqueIdentifier
     * @return void
     */
    public function setModelUniqueIdentifier($modelUniqueIdentifier) {
        $this->modelUniqueIdentifier = $modelUniqueIdentifier;
    }

    /**
     * Get model unique identifier column
     *
     * @return array
     */
    public function getModelUniqueIdentifier($forceNotNull = false) {
        if ($forceNotNull && $this->modelUniqueIdentifier == null)
            throw new Exception('Entity [' . $this->getModel() . '] doesn\'t have set unique identifier column!');
        return $this->modelUniqueIdentifier;
    }

    /**
     * Get unique identifier column for result json data
     *
     * @return array
     */
    public function getDataUniqueIdentifier() {
        $dataUniqueIdentifier = $this->getModelUniqueIdentifier();
        if ($dataUniqueIdentifier == null) {
            $dataUniqueIdentifier = $this->getModelIdentifier();
        }
        return $dataUniqueIdentifier;
    }

    /**
     * Get model columns
     *
     * @return array
     */
    public function getModelColumns() {
        return $this->modelColumns;
    }

    /**
     * Add child manager
     *
     * @param Clevis_Data_Manager|string $manager
     * @param string $alias from Doctrine for left join and data manipulation
     * @param string $type (CHILD | MERGE | READ_ONLY, or theirs combination)
     * @param string $aliasAs alias name for return data
     * @param array $filter array('column' => 'value')
     * @param array $pass array('columnChild' => 'value')
     * @return Clevis_Data_Manager
     */
    public function addChildManager($manager, $alias, $type = null, $aliasAs = null, $filter = null, $pass = null) {
        if ($type == null)
            $type = Clevis_Data_Manager::CHILD;
        if ($aliasAs == null) {
            $aliasAs = $alias;
            if (is_array($alias))
                throw new Exception('You must specify alias-as for child manager with custom relation alias!');
        }
        if ($filter == null)
            $filter = array();
        if ($pass == null)
            $pass = array();
        $this->children[] = array(
            'manager' => $manager,
            'alias' => $alias,
            'type' => $type,
            'alias-as' => $aliasAs,
            'filter' => $filter,
            'pass' => $pass
        );
        return $manager;
    }

    /**
     * Add child manager by new instance of Clevis_Data_Manager
     *
     * @param string $model
     * @param string $alias from Doctrine for left join and data manipulation
     * @param string $type (CHILD | MERGE | READ_ONLY, or theirs combination)
     * @param string $aliasAs alias name for return data
     * @param array $filter array('column' => 'value')
     * @param array $pass array('columnChild' => 'value')
     * @return Clevis_Data_Manager
     */
    public function addChildManagerByModel($model, $alias, $type = null, $aliasAs = null, $filter = null, $pass = null) {
        return $this->addChildManager('model:' . $model, $alias, $type, $aliasAs, $filter, $pass);
    }

    /**
     * Get manager for child
     *
     * @param $manager
     * @return Clevis_Data_Manager
     */
    private function getChildManager(&$manager) {
        if (is_string($manager)) {
            $modelPosition = strpos($manager, 'model:');
            if ($modelPosition !== false) {
                $model = substr($manager, 6);
                $manager = new Clevis_Data_ManagerRaw($model);
            } else {
                $manager = new $manager();
            }
        }
        return $manager;
    }

    /**
     * Get relation properties from alias.
     * Alias can by string name from doctrine or array('type' => RELATION_[ONE|MANY], 'local' => 'ID', 'foreign' => 'Parent_ID')
     *
     * @param $alias
     * @param $type
     * @param $local
     * @param $foreign
     * @return void
     */
    private function getChildRelation(&$alias, &$type, &$local, &$foreign) {
        // Get relation properties
        if (is_string($alias)) {
            // String alias means doctrine alias
            $relation = $this->modelDefinition->getRelation($alias);

            // Setup type
            $type = self::RELATION_MANY;
            if ($relation->getType() == Doctrine_Relation::ONE)
                $type = self::RELATION_ONE;

            // When is one to one and foreign column is primary key, relation is primary
            if ($relation->isOneToOne()) {
                $relationTable = $relation->getTable();
                if ($relationTable->isIdentifier($relation->getLocalFieldName())) {
                    if ($relationTable->isIdentifierAutoincrement()) {
                        throw new Exception("Relation table column [" . $relationTable->getTableName() . '#'
                        . $relation->getLocalFieldName() . '] in one-to-one association from '
                        . $this->model . ' should not be auto-increment!');
                    }
                    $type |= self::RELATION_PRIMARY;
                }
            }

            // Setup local and foreign column
            $local = $relation->getLocalFieldName();
            $foreign = $relation->getForeignFieldName();
            if ($this->modelDefinition === $relation->getTable()->getClassnameToReturn()) {
                $local = $relation->getForeignFieldName();
                $foreign = $relation->getLocalFieldName();
            }
        } else if (is_array($alias)) {
            // Array alias means custom relation definition
            $type = $alias['type'];
            $local = $alias['local'];
            $foreign = $alias['foreign'];
        } else {
            throw new Exception('Unknown relation alias type!');
        }
    }

    /**
     * Get proper manager for data actions.
     *
     * @param $dataAction
     * @param $attributes
     * @param $flag
     * @return Clevis_Data_Manager
     */
    public function getManager($dataAction, Array &$attributes, $flag = 0) {
        return $this;
    }

    /**
     * Flag determines whether data manager was already inited.
     */
    private $inited = false;

    /**
     * Init data manager
     *
     * @param $dataAction
     * @param $attributes
     * @param $flag
     */
    public function init($dataAction, Array &$attributes, $flag = 0) {
        if ($this->inited == true) {
            return;
        }

        $withoutChildManagers = ($dataAction == self::DATA_LIST && $flag == self::LIST_LISTING);

        // Invoke on init
        $this->onInit($attributes, $withoutChildManagers);

        // Init child manager recursively
        foreach ($this->children as &$child) {
            $childManager = $this->getChildManager($child['manager']);
            $childManager->init($dataAction, $attributes, $flag);
        }
    }

    /**
     * Init manager
     *
     * @param $attributes
     * @param $withoutChildManagers
     */
    protected function onInit(Array &$attributes, $withoutChildManagers) {

    }

    /**
     * Perform data list action
     *
     * @param array $attributes
     * @param integer $listType (LIST_LISTING | LIST_HIERARCHY)
     */
    public abstract function performDataList(Array $attributes, $listType);

    /**
     * Finish performing data list action
     *
     * @param array $attributes
     * @param integer $listType
     * @param array $dataArray
     * @param integer $dataArrayCount
     * @return array
     */
    protected function performDataListFinish(Array &$attributes, $listType, Array &$dataArray, &$dataArrayCount) {

        // Children
        foreach ($this->children as &$child) {
            // Get child properties
            $type = $child['type'];
            $aliasAs = $child['alias-as'];
            $resultAttribute = '__' . $aliasAs . '__result';
            // Get relation properties
            $relationType = null;
            $relationLocal = null;
            $relationForeign = null;
            $this->getChildRelation($child['alias'], $relationType, $relationLocal, $relationForeign);

            // Get identifier values for data items
            $identifierValues = array();
            foreach ($dataArray as &$dataItem) {
                if (array_key_exists($relationLocal, $dataItem) && $dataItem[$relationLocal] != null) {
                    $identifierValues[] = $dataItem[$relationLocal];
                }
            }
            if (count($identifierValues) == 0) {
                continue;
            }
            // Child Merge
            if ($type & Clevis_Data_Manager::MERGE) {
                // Prepare attributes
                $childAttributes = $attributes;
                // Remove current model columns from attributes
                foreach ($this->modelColumns as $column) {
                    array_remove_by_key($childAttributes, $column);
                }
                // Child don't need to sort, start and count
                array_remove_by_key($childAttributes, 'sort');
                array_remove_by_key($childAttributes, 'start');
                array_remove_by_key($childAttributes, 'count');
                // We only need items with that IDs
                $childAttributes[$relationForeign] = $identifierValues;
                if ($this->prepareChildAttributesByFilter($childAttributes, $child['filter'], $dataArray, $resultAttribute, $relationLocal, $relationForeign) == false)
                    continue;
                // Perform data list for child
                $dataMerge = $this->getChildManager($child['manager'])->performDataList($childAttributes, $listType);
                $dataMerge = $dataMerge['data'];
                // Prepare merge map (ID => mergeItem)
                $dataMergeMap = array();
                foreach ($dataMerge as &$dataMergeItem) {
                    $dataMergeMap[$dataMergeItem[$relationForeign]] = &$dataMergeItem;
                }
                // Merge data for all data items
                foreach ($dataArray as $key => &$dataItem) {
                    if (array_key_exists($resultAttribute, $dataItem)) {
                        $skip = $dataItem[$resultAttribute] == false;
                        unset($dataItem[$resultAttribute]);
                        if ($skip)
                            continue;
                    }

                    if (array_key_exists($relationLocal, $dataItem) == false)
                        throw new Exception('Data item doesn\'t contain local column [' . $relationLocal . ']!');
                    $relationLocalValue = $dataItem[$relationLocal];

                    $toMerge = null;
                    if (array_key_exists($relationLocalValue, $dataMergeMap)) {
                        // Find mergeItem by map
                        $toMerge = $dataMergeMap[$relationLocalValue];
                    } else {
                        if (($type & Clevis_Data_Manager::MERGE_REQUIRED) != Clevis_Data_Manager::MERGE_REQUIRED) {
                            throw new Exception('Item for merging with [' . $relationLocal . '=' . $relationLocalValue . '] was not found (parent: ' . $this->model . ', child: ' . $aliasAs . ', childColumn: ' . $relationForeign . ')! Merge data: ' . json_encode($dataMerge));
                        }
                    }

                    // Merge it
                    if ($toMerge != null) {
                        $dataItem = array_merge($toMerge, $dataItem);
                    } else if (($type & Clevis_Data_Manager::MERGE_REQUIRED) == Clevis_Data_Manager::MERGE_REQUIRED) {
                        unset($dataArray[$key]);
                        $dataArrayCount--;
                    }
                }
                $dataArray = array_values($dataArray);
            }
            // Child List
            else if ($type & Clevis_Data_Manager::CHILD) {
                // Only when listing objects
                if ($listType == Clevis_Data_Manager::LIST_LISTING)
                    continue;
                // Prepare attributes
                $childAttributes = array();
                $childAttributes[$relationForeign] = $identifierValues;
                if ($this->prepareChildAttributesByFilter($childAttributes, $child['filter'], $dataArray, $resultAttribute, $relationLocal, $relationForeign) == false)
                    continue;
                // Create controller, prepare request and perform data list
                $dataList = $this->getChildManager($child['manager'])->performDataList($childAttributes, $listType);
                $dataList = $dataList['data'];
                // Prepare data array map
                $dataArrayMap = array();
                foreach ($dataArray as &$dataItem) {
                    if (array_key_exists($resultAttribute, $dataItem)) {
                        $skip = $dataItem[$resultAttribute] == false;
                        unset($dataItem[$resultAttribute]);
                        if ($skip)
                            continue;
                    }
                    $dataArrayMap[$dataItem[$relationLocal]] = &$dataItem;
                    if (($relationType & self::RELATION_MANY) == self::RELATION_MANY && ($type & Clevis_Data_Manager::CHILD_ONE) != Clevis_Data_Manager::CHILD_ONE) {
                        $dataArrayMap[$dataItem[$relationLocal]][$aliasAs] = array();
                    }
                }
                // List data
                foreach ($dataList as &$dataListItem) {
                    if (array_key_exists($relationForeign, $dataListItem) == false) {
                        throw new Exception("Item in '" . $this->model . "'->'" . $aliasAs . "' doesn't contain column '" . $relationForeign . "'! Attributes: " .
                        json_encode($childAttributes) . " Item: " . json_encode($dataListItem));
                    }
                    $dataItem = &$dataArrayMap[$dataListItem[$relationForeign]];
                    if ($dataItem == null)
                        continue;
                    if (($relationType & self::RELATION_MANY) == self::RELATION_MANY && ($type & Clevis_Data_Manager::CHILD_ONE) != Clevis_Data_Manager::CHILD_ONE) {
                        $dataItem[$aliasAs][] = $dataListItem;
                    }
                    // If one set only one first child, ignore the others
                    else if (array_key_exists($aliasAs, $dataItem) == false) {
                        $dataItem[$aliasAs] = $dataListItem;
                    }
                }
            }
            // Unknown type
            else {
                throw new Exception('Unknown child manager type [' . $type . ']');
            }
        }
        $result = $this->onDataListFinish($attributes, $listType, $dataArray, $dataArrayCount);

        $this->onDataFinish(__FUNCTION__);
        return $result;
    }

    /**
     * Finish data listing
     *
     * @param $listType
     * @param array $data
     * @param $dataSize
     * @return array
     */
    protected function onDataListFinish(Array &$attributes, $listType, Array &$data, $dataSize = null) {
        $output = array();
        $output['identifier'] = $this->getDataUniqueIdentifier();
        $output['data'] = $data;
        if ($dataSize != null) {
            $output['numResults'] = $dataSize;
        }
        return $output;
    }

    /**
     * Remove null values from array (recursive)
     *
     * @param array $value
     * @return array|null
     */
    private function arrayRemoveNulls(Array $value) {
        foreach ($value as $key => &$item) {
            if ($item === null)
                unset($value[$key]);
            else if (is_array($item)) {
                $item = $this->arrayRemoveNulls($item);
            }
        }
        if (count($value) == 0)
            return null;
        return $value;
    }

    /**
     * Perform data pre create action
     *
     * @param array $attributes
     */
    public function performDataPreCreate(Array &$attributes) {
        $this->onDataStart();

        // Pre create entity
        $entity = $this->onDataPreCreate($attributes);

        $this->onDataFinish(__FUNCTION__);

        // Remove nulls
        if (is_array($entity) == false)
            $entity = $entity->toArray();
        $entity = $this->arrayRemoveNulls($entity);

        // Return data
        $data = array();
        $data['identifier'] = $this->getDataUniqueIdentifier();
        $data['data'] = $entity != null ? array($entity) : array();
        return $data;
    }

    /**
     * Prepare child attributes by filter
     *
     * @param $childAttributes  Output child attributes
     * @param $filter  Filter values (Column => Value or Parent.Column => Value)
     * @param $dataArray  Fetched items that are used for parent.XXX filters
     * @param $resultAttribute  Resulst attribute that is set to true | false in dataArray items indicating whether child should be presented
     * @param $relationLocal  Relation local column for child
     * @param $relationForeign  Relation foreign column for child
     * @return bool true if some items can be retrieved by childAttributes, false if none item cannot be retrieved (ie no item in Parent.XXX was set)
     */
    public function prepareChildAttributesByFilter(Array &$childAttributes, &$filter, &$dataArray, &$resultAttribute, &$relationLocal, &$relationForeign) {
        // Prepare filter attributes for data items
        $thisAttributes = array();
        // Filter (new version, before it select all items and filter it manually, so now its better)
        foreach ($filter as $filterName => $filterValue) {
            // If data items are filtered by parent values
            $pos = strpos($filterName, 'parent.');
            if ($pos !== false) {
                // Add filter to this manager attributes
                $thisAttributes[substr($filterName, $pos + 7)] = $filterValue;
                continue;
            }
            if ($filterValue == self::IGNORE) {
                if (array_key_exists($filterName, $childAttributes))
                    unset($childAttributes[$filterName]);
            } else {
                $childAttributes[$filterName] = $filterValue;
            }
        }
        // Check parent filter and setup child attributes by proper identifier values
        if (count($thisAttributes) > 0) {
            // Find identifier values that meets filter attributes
            $identifierValues = array();
            $result = true;
            foreach ($dataArray as &$dataItem) {
                $dataItem[$resultAttribute] = true;
                foreach ($thisAttributes as $filterName => $filterValue) {
                    if ($dataItem[$filterName] != $filterValue) {
                        $dataItem[$resultAttribute] = false;
                        break;
                    }
                }
                if ($dataItem[$resultAttribute]) {
                    $identifierValues = $dataItem[$relationLocal];
                }
            }
            $childAttributes[$relationForeign] = $identifierValues;

            // If none, skip child manager
            if (count($identifierValues) == 0) {
                // Unset all resulsts attributes
                foreach ($dataArray as &$dataItem)
                    unset($dataItem[$resultAttribute]);
                return false;
            }
        }
        return true;
    }

    /**
     * Perform data create action
     *
     * @param array $attributes
     */
    public function performDataCreate(Array &$attributes) {
        // Begin transaction
        $connection = Doctrine_Manager::getInstance()->connection();
        $connection->beginTransaction();

        $this->onDataStart();

        // Update attributes
        $this->onDataAttributes($attributes, $connection);

        // Perform create
        $entity = $this->onDataCreate($attributes, $connection);

        if (!is_array($entity)) {
            $entity->save($connection);
            $entity = $entity->toArray();
        }

        $this->onDataFinish(__FUNCTION__);

        // Commit transaction
        $connection->commit();

        // Return data
        $data = array();
        $data[] = $entity;
        return $data;
    }

    /**
     * Perform data update action
     *
     * @param array $attributes
     * @param bool
     */
    public function performDataUpdate(Array &$attributes) {
        // Begin transaction
        $connection = Doctrine_Manager::getInstance()->connection();
        $connection->beginTransaction();

        $this->onDataStart();

        // Update attributes
        $this->onDataAttributes($attributes, $connection);

        // Perform update
        $entity = $this->onDataUpdate($attributes, $connection);
        if ($entity != null && $entity != false)
            $entity->save($connection);

        $this->onDataFinish(__FUNCTION__);

        // Commit transaction
        $connection->commit();

        return $entity != false;
    }

    /**
     * Perform data delete action
     *
     * @param array $attributes
     */
    public function performDataDelete(Array &$attributes) {
        // Begin transaction
        $connection = Doctrine_Manager::getInstance()->connection();
        $connection->beginTransaction();

        $this->onDataStart();

        // Update attributes
        $this->onDataAttributes($attributes, $connection);

        // Perform delete
        $this->onDataDelete($attributes, $connection);

        $this->onDataFinish(__FUNCTION__);

        // Commit transaction
        $connection->commit();
    }

    /**
     * Perform data batch action
     *
     * @param array $attributes
     */
    public function performDataBatch(Array &$attributes) {
        if (array_key_exists('new', $attributes)) {
            foreach ($attributes['new'] as $item) {
                $this->performDataCreate($item);
            }
        }
        if (array_key_exists('modified', $attributes)) {
            foreach ($attributes['modified'] as $item) {
                $this->performDataUpdate($item);
            }
        }
        if (array_key_exists('deleted', $attributes)) {
            foreach ($attributes['deleted'] as $item) {
                $this->performDataDelete($item);
            }
        }
    }

    /**
     * Perform data pre create
     *
     * @param $attributes
     */
    protected function onDataPreCreate(Array &$attributes) {
        // Is data pre create allowed?
        if (($this->dataType & self::DATA_PRE_CREATE) == 0)
            throw new Exception('Data Pre Create is not allowed for manager [' . get_class($this) . '] with model [' . $this->model . ']!');

        $entity = new $this->model();

        return $entity;
    }

    /**
     * Update attributes
     *
     * @param $attributes
     * @param Doctrine_Connection $connection
     * @return void
     */
    protected function onDataAttributes(Array &$attributes, Doctrine_Connection $connection) {

    }

    /**
     * Process attributes for data create, update, delete. Here is attributes transformed, renamed, etc. before data is processed.
     *
     * @param array $attributes
     */
    private function processSaveAttributes(&$attributes) {
        foreach ($this->modelColumnsMapSave as $from => $to) {
            $attributes[$to] = $attributes[$from];
            array_remove_by_key($attributes, $from);
        }
    }

    /**
     * Get child attributes from parent data
     *
     * @param $attributes  Parent attributes
     * @param $entity  Parent entity
     * @param $childData  Array to output child attrbiutes
     * @param $childType  Child type
     * @param $childAliasAs  Child alias as
     * @param $childRelationLocal  Child relation local column
     * @param $childRelationForeign  Child relation foreign column
     * @return bool if child exists
     */
    protected function onDataAttributesForChild(Array &$attributes, &$entity, &$childData, &$childType, &$childAliasAs, &$childRelationType, &$childRelationLocal, &$childRelationForeign, Doctrine_Connection $connection) {
        // If relation type is primary (means relation from primary autoincrement ID => primary not-autoincrement ID) and entity ID is null
        if (($childRelationType & self::RELATION_PRIMARY) == self::RELATION_PRIMARY && $entity[$childRelationLocal] == null) {
            // We must save entity to get that ID and pass it to child
            $entity->save($connection);
        }
        // If merge data, we pass request data
        if ($childType & Clevis_Data_Manager::MERGE) {
            // Data are the same attributes
            $childData = $attributes;
            // Pass relation column value
            if (array_key_exists($childRelationLocal, $childData) == false || $childData[$childRelationLocal] == null) {
                $childData[$childRelationForeign] = $entity[$childRelationLocal];
            } else {
                $childData[$childRelationForeign] = $childData[$childRelationLocal];
            }
            // Else, as normal, we use data child by aliasAs
        } else if (array_key_exists($childAliasAs, $attributes)) {
            // Data are one of attributes
            $childData = $attributes[$childAliasAs];
            // Pass relation column value
            if ($childData != null && (array_key_exists($childRelationLocal, $childData) == false || $childData[$childRelationLocal] == null)) {
                $childData[$childRelationForeign] = $entity[$childRelationLocal];
            }
        } else {
            // Else we can't get data for child
            return false;
        }

        return true;
    }

    /**
     * Pass data to child
     *
     * @param $entity
     * @param $childData
     * @param $childPass
     * @return void
     */
    protected function onDataAttributesPassToChild(&$entity, &$entityAttributes, &$childData, &$childFilter, &$childPass) {
        // Pass values
        foreach ($childPass as $columnChild => $value) {
            $pos = strpos($value, 'parent.');
            if ($pos !== false) {
                $name = substr($value, $pos + 7);
                if ($entity->getTable()->hasColumn($name)) {
                    $childData[$columnChild] = $entity[$name];
                } else if (array_key_exists($name, $entityAttributes)) {
                    $childData[$columnChild] = $entityAttributes[$name];
                }
            } else {
                $childData[$columnChild] = $value;
            }
        }
        // Pass filter values if not set
        foreach ($childFilter as $filterName => $filterValue) {
            if (array_key_exists($filterName, $childData))
                continue;
            // Skip ignore
            if ($filterValue == self::IGNORE)
                continue;
            // Pass only filters that aren't parent values
            $pos = strpos($filterName, 'parent.');
            if ($pos === false) {
                $childData[$filterName] = $filterValue;
            }
        }
    }

    /**
     * @param $entity
     * @param $entityChild
     * @param $childAlias
     * @param $relationType
     * @return void
     */
    private function saveEntityChild(&$entity, &$entityChild, &$childAlias, &$relationType, &$relationLocal, &$relationForeign, Doctrine_Connection $connection) {
        if (is_string($childAlias)) {
            // Alias is doctrine name alias
            if (($relationType & self::RELATION_ONE) == self::RELATION_ONE) {
                $entity[$childAlias] = $entityChild;
            } else {
                $entity[$childAlias][] = $entityChild;
            }
            // If parent entity was already saved, we must save the child because it won't be saved automatically (again: because the parent is already saved)
            if ($entity[$relationLocal] != null) {
                $entityChild->save($connection);
            }
        } else if (is_array($childAlias)) {
            // Alias is custom array so get entity identifier
            if ($entity[$relationLocal] == null) {
                $entity->save($connection);
            }
            assert($entity[$relationLocal] != null);

            // And save it to child entity to proper column
            if ($entityChild->getTable()->hasColumn($relationForeign)) {
                $entityChild[$relationForeign] = $entity[$relationLocal];
            }

            // Save child entity (because it is not set to parent entity so it cannot save it)
            $entityChild->save($connection);
        } else {
            throw new Exception('Unknown relation alias type!');
        }
    }

    /**
     * Perform data create children
     *
     * @param $attributes
     * @param $entity
     * @param Doctrine_Connection $connection
     * @return void
     */
    protected function onDataCreateChildren(Array &$attributes, &$entity, Doctrine_Connection $connection) {
        // Setup data children
        foreach ($this->children as $child) {
            // Get child properties
            $type = $child['type'];
            $aliasAs = $child['alias-as'];
            // Get relation properties
            $relationType = null;
            $relationLocal = null;
            $relationForeign = null;
            $this->getChildRelation($child['alias'], $relationType, $relationLocal, $relationForeign);

            // Skip read-only
            if ($child['type'] & Clevis_Data_Manager::READ_ONLY) {
                continue;
            }

            // Get attributes for child
            $data = array();
            if ($this->onDataAttributesForChild($attributes, $entity, $data, $type, $aliasAs, $relationType, $relationLocal, $relationForeign, $connection) == false) {
                continue;
            }

            // Setup data child
            if ($data != null) {
                $manager = $this->getChildManager($child['manager']);

                // If children is custom alias, we must force save parent entity before child entity creation is done
                // That must be done here and not only in saveEntityChild which was developed only for editation,
                // For total create of the whole data tree this MUST be done here, because parent entity dont have ID yet
                $alias = $child['alias'];
                if (is_array($alias)) {
                    // Alias is custom array so get entity identifier if not set
                    if ($entity[$relationLocal] == null) {
                        $entity->save($connection);
                    }
                    // And save it to child entity to proper column
                    $data[$relationForeign] = $entity[$relationLocal];
                }

                if (($relationType & self::RELATION_ONE) == self::RELATION_ONE || ($type & Clevis_Data_Manager::FLAG_ONE) == Clevis_Data_Manager::FLAG_ONE) {

                    $this->onDataAttributesPassToChild($entity, $attributes, $data, $child['filter'], $child['pass']);
                    $entityChild = null;
                    $entityChildIdentifier = $manager->getModelUniqueIdentifier();

                    // Check whether child already exists
                    $entityChildExists = false;
                    if (array_key_exists($entityChildIdentifier, $data) && $data[$entityChildIdentifier] != null) {
                        $result = $manager->performDataList(array($entityChildIdentifier => $data[$entityChildIdentifier]), self::LIST_LISTING);
                        $entityChildExists = count($result['data']) > 0;
                    }

                    // If child exists, update it
                    if ($entityChildExists) {
                        $entityChild = $manager->onDataUpdate($data, $connection);
                    }
                    // Otherwise create it
                    else {
                        if ($type & Clevis_Data_Manager::DISABLE_AUTO_CREATE) {
                            // Don't create
                        } else {
                            $entityChild = $manager->onDataCreate($data, $connection);
                        }
                    }

                    if ($entityChild != null) {
                        $this->saveEntityChild($entity, $entityChild, $alias, $relationType, $relationLocal, $relationForeign, $connection);
                    }
                } else {
                    if (array_key_exists('new', $data) && ($manager->dataType & self::DATA_CREATE)) {
                        foreach ($data['new'] as $item) {
                            $this->onDataAttributesPassToChild($entity, $attributes, $item, $child['filter'], $child['pass']);
                            $entityChild = $manager->onDataCreate($item, $connection);
                            $this->saveEntityChild($entity, $entityChild, $alias, $relationType, $relationLocal, $relationForeign, $connection);
                        }
                    }
                }
            }
        }
    }

    /**
     * Perform data create
     *
     * @param $attributes
     */
    protected function onDataCreate(Array &$attributes, Doctrine_Connection $connection) {
        // Is data create allowed?
        if (($this->dataType & self::DATA_CREATE) == 0)
            throw new Exception('Data Create is not allowed for manager [' . get_class($this) . '] with model [' . $this->model . ']!');

        // Process attributes
        $this->processSaveAttributes($attributes);

        // Create entity
        $entity = Doctrine_Core::getTable($this->model)->create();
        // Setup entity
        foreach ($this->modelColumns as $column) {
            $value = null;
            if (array_key_exists($column, $attributes))
                $value = $attributes[$column];
            if ((is_numeric($value) || $value != null ) && ($entity[$column] == null || $entity[$column] != $value)) {
                $entity[$column] = $value;
            }
        }

        // Save children
        $this->onDataCreateChildren($attributes, $entity, $connection);

        return $entity;
    }

    /**
     * Get entity by attributes
     *
     * @param array $attributes
     * @param Doctrine_Connection $connection
     * @return mixed
     */
    private function getEntityByAttributes(Array &$attributes, Doctrine_Connection $connection) {
        // Prepare query
        $query = Doctrine_Query::create($connection);
        $query->from($this->model . ' entity');
        foreach ($this->modelIdentifier as $identifier) {
            if (array_key_exists($identifier, $attributes)) {
                if ($attributes[$identifier] == null)
                    $query->addWhere('entity.' . $identifier . ' IS NULL');
                else
                    $query->addWhere('entity.' . $identifier . ' = ?', $attributes[$identifier]);
            } else {
                return null;
            }
        }
        // Perform query
        $entity = $query->fetchOne();
        return $entity;
    }

    /**
     * Perform data update
     *
     * @param array $attributes
     * @param Doctrine_Connection $connection
     */
    protected function onDataUpdate(Array &$attributes, Doctrine_Connection $connection) {
        // Is data update allowed?
        if (($this->dataType & self::DATA_UPDATE) == 0)
            throw new Exception('Data Update is not allowed for manager [' . get_class($this) . '] with model [' . $this->model . ']!');

        // Process attributes
        $this->processSaveAttributes($attributes);

        // Find entity
        $entity = $this->getEntityByAttributes($attributes, $connection);
        if ($entity == null)
            return null;

        // Update entity
        foreach ($this->modelColumns as $column) {
            if (array_key_exists($column, $attributes) == false)
                continue;
            $columnDefinition = $this->modelDefinition->getColumnDefinition(strtolower($column));
            if (array_key_exists('autoincrement', $columnDefinition) && $columnDefinition['autoincrement'] == true)
                continue;
            $value = $attributes[$column];
            if ((is_numeric($value) || $value != null ) && ($entity[$column] == null || $entity[$column] != $value)) {
                $entity[$column] = $value;
            } else if ($value == null && $entity[$column] != null) {
                $entity[$column] = null;
            }
        }

        // Update data children
        foreach ($this->children as $child) {
            // Get child properties
            $type = $child['type'];
            $aliasAs = $child['alias-as'];
            // Get relation properties
            $relationType = null;
            $relationLocal = null;
            $relationForeign = null;
            $this->getChildRelation($child['alias'], $relationType, $relationLocal, $relationForeign);

            // Skip read-only
            if ($child['type'] & Clevis_Data_Manager::READ_ONLY) {
                continue;
            }

            // Get attributes for child
            $data = array();
            if ($this->onDataAttributesForChild($attributes, $entity, $data, $type, $aliasAs, $relationType, $relationLocal, $relationForeign, $connection) == false)
                continue;

            // Update child
            if ($data != null) {
                $manager = $this->getChildManager($child['manager']);
                if (($relationType & self::RELATION_ONE) == self::RELATION_ONE || ($type & Clevis_Data_Manager::FLAG_ONE) == Clevis_Data_Manager::FLAG_ONE) {
                    $this->onDataAttributesPassToChild($entity, $attributes, $data, $child['filter'], $child['pass']);
                    $entityChild = $manager->onDataUpdate($data, $connection);
                    if ($entityChild != null) {
                        $entityChild->save($connection);
                    } else {
                        if ($type & Clevis_Data_Manager::DISABLE_AUTO_CREATE) {
                            // Don't create
                        } else {
                            $entityChild = $manager->onDataCreate($data, $connection);
                        }
                    }
                    if ($entityChild != null) {
                        $this->saveEntityChild($entity, $entityChild, $child['alias'], $relationType, $relationLocal, $relationForeign, $connection);
                    }
                } else {
                    if (array_key_exists('new', $data) && ($manager->dataType & self::DATA_CREATE)) {
                        foreach ($data['new'] as $item) {
                            $this->onDataAttributesPassToChild($entity, $attributes, $item, $child['filter'], $child['pass']);
                            $entityChild = $manager->onDataCreate($item, $connection);
                            if ($entityChild != null) {
                                $this->saveEntityChild($entity, $entityChild, $child['alias'], $relationType, $relationLocal, $relationForeign, $connection);
                            }
                        }
                    }

                    if (array_key_exists('modified', $data) && ($manager->dataType & self::DATA_UPDATE)) {
                        foreach ($data['modified'] as $item) {
                            $this->onDataAttributesPassToChild($entity, $attributes, $item, $child['filter'], $child['pass']);
                            $entityChild = $manager->onDataUpdate($item, $connection);
                            if ($entityChild != null) {
                                $entityChild->save($connection);
                            }
                        }
                    }
                    if (array_key_exists('deleted', $data) && ($manager->dataType & self::DATA_DELETE)) {
                        foreach ($data['deleted'] as $item) {
                            $this->onDataAttributesPassToChild($entity, $attributes, $item, $child['filter'], $child['pass']);

                            // Delete item
                            $manager->onDataDelete($item, $connection);

                            // For doctrine alias, remove item from parent
                            $childAlias = $child['alias'];
                            if (is_string($childAlias)) {
                                if (($relationType & self::RELATION_ONE) == self::RELATION_ONE) {
                                    // Just remove reference to the entity
                                    $entity[$childAlias] = null;
                                } else {
                                    // Find child and remove it
                                    foreach ($entity[$childAlias] as $index => $entityChild) {
                                        $match = true;
                                        foreach ($manager->modelIdentifier as $modelIdentifier) {
                                            if ($entityChild[$modelIdentifier] != $item[$modelIdentifier]) {
                                                $match = false;
                                                break;
                                            }
                                        }
                                        if ($match) {
                                            $entity[$childAlias]->remove($index);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // If data for child is null we must delete child, but only if it is one
            else {
                $manager = $this->getChildManager($child['manager']);
                $alias = $child['alias'];
                if (($relationType & self::RELATION_ONE) == self::RELATION_ONE && is_string($alias)) {
                    if ($entity->relatedExists($alias)) {
                        $childEntity = $entity[$alias];
                        $entity[$alias] = null;
                        $entity->save($connection);
                        $childEntity->delete($connection);
                    }
                } else if (($relationType & self::RELATION_ONE) == self::RELATION_ONE || ($type & Clevis_Data_Manager::FLAG_ONE) == Clevis_Data_Manager::FLAG_ONE) {
                    // Prepare more info about child
                    $resultAttribute = '__' . $aliasAs . '__result';
                    $dataArray = array($entity->toArray());
                    // Prepare attributes for child
                    $childAttributes = array();
                    $childAttributes[$relationForeign] = $entity[$relationLocal];
                    if ($this->prepareChildAttributesByFilter($childAttributes, $child['filter'], $dataArray, $resultAttribute, $relationLocal, $relationForeign)) {
                        // If result attribute was not set or it is set to true
                        if (array_key_exists($resultAttribute, $dataArray[0]) == false || $dataArray[0][$resultAttribute]) {
                            // List proper child object
                            $entityChildList = $manager->performDataList($childAttributes, self::LIST_LISTING);
                            $entityChildList = $entityChildList['data'];
                            if (count($entityChildList) > 0) {
                                // Delete first child
                                $manager->onDataDelete($entityChildList[0], $connection);
                            }
                        }
                    }
                }
            }
        }
        return $entity;
    }

    /**
     * Perform data delete
     *
     * @param array $attributes
     * @param Doctrine_Connection $connection
     */
    protected function onDataDelete(Array &$attributes, Doctrine_Connection $connection) {
        // Is data delete allowed?
        if (($this->dataType & self::DATA_DELETE) == 0)
            throw new Exception('Data Delete is not allowed for manager [' . get_class($this) . '] with model [' . $this->model . ']!');

        // Process attributes
        $this->processSaveAttributes($attributes);

        // Delete entity
        $entity = $this->getEntityByAttributes($attributes, $connection);
        if ($entity == null)
            throw new Exception('Can\'t find entity ' . json_encode($attributes) . '!');

        if ($entity != false) {
            $entity->deleted = true;
            $entity->delete($connection);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Called when data action is starting
     */
    protected function onDataStart() {

    }

    /**
     * Called when data action is finishing
     */
    protected function onDataFinish($caller = '') {

    }

    const DATA_GRID = 64;
    const DATA_EDITOR = 128;
    const DATA_SCHEMA = 256;

    public function getDataSchema(){
        $schema = [
            'manager' => [
                'model' => $this->model,
                'modelIdentifier' => $this->modelIdentifier,
                'modelUniqueIdentifier' => $this->modelUniqueIdentifier,
            ],
            'children' => [],
        ];


        foreach ($this->children as $child){
            $this->getChildRelation($child['alias'], $relationType, $relationLocal, $relationForeign);

            $childSchema = array_merge($child['manager']->getDataSchema(), [
                'alias' => $child['alias'],
                'type' => $child['type'],
                'aliasAs' => $child['alias-as'],
                'relation' => [
                    'type' => $relationType,
                    'local' => $relationLocal,
                    'foreign' => $relationForeign,
                ],
            ]);


            $schema['children'][] = $childSchema;
        }

        return $schema;
    }

}

?>