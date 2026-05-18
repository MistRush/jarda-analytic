<?php
/**
 * Manager
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Data_ManagerDql extends Clevis_Data_Manager {

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
        $query = $connection->createQuery();
        $query->from($this->model . ' entity');

        // Select all column if it is list
        if ( $this->modelColumnsDefault ) {
            $query->addSelect('entity.*');
        } else {
            foreach ( $this->modelColumns as $column ) {
                if (array_key_exists($column, $this->modelColumnsMapLoad) ) {
                    $query->addSelect('entity.' . $column . ' as ' . $this->modelColumnsMapLoad[$column]);
                } else {
                    $query->addSelect('entity.' . $column);
                }
            }
        }
        
        // Perform list
        $this->onDataList($query, $attributes, $listType, $connection);
        
        // Filter identifier
        if ( array_key_exists('id', $attributes) ) {
            $identifier = $this->getModelUniqueIdentifier(true);
            $query->andWhere('entity.' . $identifier . ' = ?',$attributes['id']);
            unset($attributes['id']);
        }
        foreach ( $this->modelIdentifier as $identifier ) {
            if ( array_key_exists($identifier,$attributes) ) {
                $value = $attributes[$identifier];
                if ( $value == null ) {
                    $query->andWhere('entity.' . $identifier . ' IS NULL');
                } else if ( is_array($value) ) {
                    $query->andWhereIn('entity.' . $identifier, $value);
                } else {
                    $query->andWhere('entity.' . $identifier . ' = ?', $value);
                }
            }
        }

         // Order by
        if ( array_key_exists('sort',$attributes) ) {
            $orderByColumn = null;
            $orderByOrder = null;
            if ( substr($attributes['sort'],0,1) == '-' ) {
                $orderByColumn = substr($attributes['sort'],1);
                $orderByOrder = 'DESC';
            } else {
                $orderByColumn = $attributes['sort'];
                $orderByOrder = 'ASC';
            }
            $query->orderBy($orderByColumn . ' ' . $orderByOrder);
        }

        // Paging
        $data = null;
        $dataArray = null;
        $dataArrayCount = null;
        $pageSize = null;
        if ( array_key_exists('count',$attributes) )
            $pageSize = $attributes['count'];
        if ( $pageSize != null && $pageSize != 0 ) {
            $pageIndex = $attributes['start'] / $pageSize + 1;
            $pager = new Doctrine_Pager($query,$pageIndex,$pageSize);
            $dataArray = $pager->execute()->toArray();
            $dataArrayCount = $pager->getNumResults();
        // Not paging
        } else {
            $dataArray = $query->execute()->toArray();
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
    private function addWhereToQuery(Doctrine_Query $query, $filterType, $column, $value) {
        if ( $filterType == Clevis_Data_Manager::FILTER_NONE ) {
            // do nothing
        } if ( $filterType == Clevis_Data_Manager::FILTER_RANGE ) {
            $rangeBegin = $value[0];
            if ( $rangeBegin == '' )
                $rangeBegin = null;
            $rangeEnd = $value[1];
            if ( $rangeEnd == '' )
                $rangeEnd = null;
            if ( $rangeBegin != null ) {
                $query->andWhere($column . ' >= ? ',$rangeBegin);
            }
            if ( $rangeEnd != null ) {
                $query->andWhere($column . ' <= ? ',$rangeEnd);
            }
        } else {
            if ( $value == null ) {
                $query->andWhere($column . ' IS NULL');
            } else if ( $filterType == Clevis_Data_Manager::FILTER_LIKE ) {
                $query->andWhere($column . ' LIKE ?','%' . $value . '%');
            } else if ( $filterType == Clevis_Data_Manager::FILTER_DATE ) {
                $query->andWhere($column . ' LIKE ?','%' . $value . '%');
            } else if ( $filterType == Clevis_Data_Manager::FILTER_BOOL ) {
                if ( $value == 'true' )
                    $value = 1;
                else if ( $value == 'false' )
                    $value = 0;
                else if ( $value == '' || $value == 'all' )
                    return;
                $query->andWhere($column . ' = ?',$value);
            } else{
                // Filter type all can stop filtering on 'all' or '' value
                if ( $filterType == Clevis_Data_Manager::FILTER_ALL ) {
                    if ( $value == '' || $value == 'all' )
                        return;
                }
                if ( is_array($value) ) {
                    $query->andWhereIn($column,$value);
                } else  {
                    $query->andWhere($column . ' = ?',$value);
                }
            }
        }
    }

    /**
     * Perform data list
     *
     * @param Doctrine_Query $query
     * @param array $attributes
     * @param integer $listType
     * @param Doctrine_Connection $connection
     */
    protected function onDataList(Doctrine_Query $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        // Is data list allowed?
        if ( ($this->dataType & self::DATA_LIST) == 0 )
            throw new Exception('Data List is not allowed for manager [' . get_class($this) . '] with model [' . $this->model . ']!');

        // Where clause
        foreach ( $attributes as $paramName => $paramValue ) {
            if ( $paramValue == '*' || $paramValue === '' )
                continue;

            if ( $this->modelDefinition->hasColumn($paramName) && !$this->modelDefinition->isIdentifier($paramName) && $paramName != 'id') {
                // Prepare column name
                $column = null;
                $column = 'entity.' . $paramName;
                if ( array_key_exists($paramName, $this->columnFilters) ) {
                    $filter = array_key_exists($paramName, $this->columnFilters) ? $this->columnFilters[$paramName] : null;
                    if ( array_key_exists('customColumn', $filter) && $filter['customColumn'] != null )
                        $column = $filter['customColumn'];
                }    
                
                // Parse filter array
                $rangeArray = null;
                if ( is_string($paramValue) ) {
                    $rangeArray = explode(':',$paramValue);
                } else {
                    $rangeArray = array($paramValue);
                }
                
                // Filter single value
                if ( count($rangeArray) == 1 ) {
                    $filterType = (array_key_exists($paramName, $this->columnFilters) && array_key_exists('type', $this->columnFilters[$paramName])) ? $this->columnFilters[$paramName]['type'] : null;
                }
                // Filter range
                else {
                    $filterType = Clevis_Data_Manager::FILTER_RANGE;
                    $paramValue = $rangeArray;
                }
                $this->addWhereToQuery($query,$filterType,$column,$paramValue);
            
            } else if ( array_key_exists($paramName,$this->columnFilters) ) {
                $filter = array_key_exists($paramName, $this->columnFilters) ? $this->columnFilters[$paramName] : null;
                $column = $paramName;
                if ( array_key_exists('customColumn', $filter) )
                    $column = $filter['customColumn']; 
                $this->addWhereToQuery($query,$filter['type'],$column,$paramValue);
            }
        }
    }
    
}
?>