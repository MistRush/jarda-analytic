<?php

/**
 * ManagerQuery
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Data_ManagerRawQuery {

    /**
     * From alias.
     *
     * @var string
     */
    private $fromAlias = 'entity';

    /**
     * Manager
     * 
     * @var Doctrine_Table
     */
    private $table = array();

    /**
     * Query parts
     * 
     * @var string
     */
    private $querySelect;
    private $querySelectMap = array();
    private $queryFrom;
    private $queryJoins;
    private $queryWhere;
    private $queryGroupBy;
    private $queryOrderBy;
    private $queryHaving;
    private $as = [];

    /**
     * Constuctor
     * 
     * @param Doctrine_Table $table
     */
    public function __construct() {
        // Initialize query parts
        $this->querySelect = '';
        $this->queryFrom = '';
        $this->queryJoins = [];
        $this->queryWhere = '';
        $this->queryGroupBy = '';
        $this->queryOrderBy = '';
        $this->queryHaving = '';
    }

    /**
     * Add to sql select
     *
     * @param $select
     * @param string|null $as
     * @return void
     */
    private function __addSelect($select, $as = null) {
        if ( strlen($this->querySelect) > 0 )
            $this->querySelect .= ',' . PHP_EOL;
        $this->querySelect .= '    ' . $select;
        if ( $as != null )
            $this->querySelect .= ' AS "' . $as . '"';
    }

    /**
     * Add to sql select
     *
     * @param $select
     * @param string|null $as
     * @param bool $inCount
     * @return void
     */
    public function addSelect($select, $as = null, $inCount = false) {
        if ( $as == null ) {
            $this->__addSelect($select, $as);
        } else {
            if ($inCount)
                $this->as[$as] = $select;
            $this->querySelectMap[$as] = $select;
        }
    }

    /**
     * Add to sql select
     *
     * @param $select
     * @param string|null $as
     * @return void
     */
    public function addSelectAndGroupBy($select, $as = null) {
        $this->addSelect($select, $as);
        $this->addGroupBy($select);
    }

    /**
     * @param $column
     * @return true if column is selected in select,
     *         false otherwise
     */
    public function hasSelectedColumn($column) {
        return array_key_exists($column, $this->querySelectMap);
    }

    /**
     * @param $column
     * @return select statement for given column
     */
    public function getSelectedColumn($column) {
        return array_key_exists($column, $this->querySelectMap) ? $this->querySelectMap[$column] : null;
    }

    /**
     * Set sql from statement
     * 
     * @param $table Table from
     * @param string|null $as  Table alias
     * @return void
     */
    public function from($tableOrModel, $as = null) {
        if ( ($tableOrModel instanceof Doctrine_Table) == false )
            $tableOrModel = Doctrine_Core::getTable($tableOrModel);
        if ( $as == null ) {
            $as = $this->fromAlias;
        }
        $this->table[$as] = $tableOrModel;
        $this->fromAlias = $as;

        $this->queryFrom = 'FROM ' . $tableOrModel->getTableName() . ' AS ' . $as . PHP_EOL;

        $this->clearWhere();
        $this->clearOrderBy();

        // Apply behaviours to query
        $templates = $tableOrModel->getTemplates();
        foreach ( $templates as $template ) {
            $listener = $template->getListener()->get(0);
            if ( $listener instanceof Clevis_Data_ManagerRawQueryListener )
                $listener->preRawSelect($this);
        }
    }

    /**
     * Add left join to query
     *
     * @param $join
     * @param $aliasFrom  Alias from ie 'entity'
     * @param $alias  Left join alias ie 'contacts'
     * @param null $aliasAs  Left join alias as ie 'entityContacts' or null for the same as $alias
     * @param null $with  Left join filter statements
     * @return void
     */
    public function doJoin($join, $aliasFrom, $alias, $aliasAs = null, $with = null, $inCount = true) {
        // Default as is alias
        if ( $aliasAs == null )
            $aliasAs = $alias;

        // Check from alias exists
        if ( array_key_exists($aliasFrom, $this->table) == false )
            throw new Exception('Unknown table alias [' . $aliasFrom . ']!');

        // Get relation
        $table = $this->table[$aliasFrom];
        $relation = $table->getRelation($alias);
        $relationTable = $relation->getTable();
        $tmpQueryJoins = '';

        // Apply templates
        $templates = $relationTable->getTemplates();
        foreach ( $templates as $template ) {
            $listener = $template->getListener()->get(0);
            if ( $listener instanceof Clevis_Data_ManagerRawQueryListener ) {
                $query = new Clevis_Data_ManagerRawQuery($relationTable);
                $listener->preRawSelect($query);

                $queryJoins = str_replace('entity.', $aliasAs . '.', $query->queryJoins);
                $queryWhere = str_replace('entity.', $aliasAs . '.', $query->queryWhere);

                $tmpQueryJoins .= $queryJoins;
                if ( strlen($queryWhere) > 0 ) {
                    if ( strlen($with) > 0 )
                        $with .= ' AND (' . $queryWhere . ')';
                    else
                        $with .= '(' . $queryWhere . ')';
                }
            }
        }

        // Append join
        $tmpQueryJoins .= $join . ' ' . $relationTable->getTableName() . ' AS ' . $aliasAs;
        $tmpQueryJoins .= ' ON (' . $aliasAs . '.' .  $relation->getForeign() . ' = ' . $aliasFrom . '.' . $relation->getLocal();
        if ( $with != null )
            $tmpQueryJoins .= ' AND ' . $with;
        $tmpQueryJoins .= ')' . PHP_EOL;
        $this->queryJoins[] = [$tmpQueryJoins, $inCount];

        // Save table for future use
        $this->table[$aliasAs] = $relationTable;
    }

    /**
     * Add left join to query
     *
     * @param string $aliasFrom  Alias from ie 'entity'
     * @param string $alias  Left join alias ie 'contacts'
     * @param null $aliasAs  Left join alias as ie 'entityContacts' or null for the same as $alias
     * @param null $with  Left join filter statements
     * @return void
     */
    public function leftJoin($aliasFrom, $alias, $aliasAs = null, $with = null, $inCount = true) {
        $this->doJoin('LEFT JOIN', $aliasFrom, $alias, $aliasAs, $with, $inCount);
    }

    /**
     * Add right join to query
     *
     * @param $aliasFrom  Alias from ie 'entity'
     * @param $alias  Left join alias ie 'contacts'
     * @param null $aliasAs  Left join alias as ie 'entityContacts' or null for the same as $alias
     * @param null $with  Left join filter statements
     * @return void
     */
    public function rightJoin($aliasFrom, $alias, $aliasAs = null, $with = null) {
        $this->doJoin('RIGHT JOIN', $aliasFrom, $alias, $aliasAs, $with);
    }

    /**
     * Add left join to query
     *
     * @param string $aliasFrom  Alias from ie 'entity'
     * @param string $alias  Left join alias ie 'contacts'
     * @param null $aliasAs  Left join alias as ie 'entityContacts' or null for the same as $alias
     * @param null $with  Left join filter statements
     * @return void
     */
    public function innerJoin($aliasFrom, $alias, $aliasAs = null, $with = null) {
        $this->doJoin('INNER JOIN', $aliasFrom, $alias, $aliasAs, $with);
    }

    /**
     * Add where clause
     *
     * @param string $where clause with {1}, {2}, ... parameters
     * @param string|null|array $value  Value or array of values
     * @param string $connect  Connect type 'AND' or 'OR'
     * @return void
     */
    public function addWhere($where, $value = null, $connect = 'AND') {
        // Format where
        if ( $value != null ) {
            if ( is_array($value) ) {
                foreach ( $value as $key => $item ) {
                    if ( is_string($item) ) {
                        $where = str_replace('{' . ($key + 1) . '}', '\'' . $item . '\'', $where);
                    } else {
                        $where = str_replace('{' . ($key + 1) . '}', $item, $where);
                    }
                }
            } else if ( is_string($value) ) {
                $where = str_replace('{1}', '\'' . $value . '\'', $where);
            } else {
                $where = str_replace('{1}', $value, $where);
            }
        }
        // Add where
        if ( strlen($this->queryWhere) > 0 ) {
            $this->queryWhere = '(' . $this->queryWhere . ') ' . $connect . ' (' . $where . ')';
        } else {
            $this->queryWhere = $where;
        }
    }

    /**
     * Add where clause connect by AND
     *
     * @param string $where  Where clause with {1}, {2}, ... parameters
     * @param string|null|array $value  Value or array of values
     * @return void
     */
    public function andWhere($where, $value = null) {
        $this->addWhere($where, $value, 'AND');
    }

    /**
     * Add where clause connect by OR
     *
     * @param string $where  Where clause with {1}, {2}, ... parameters
     * @param value|null|array $value  Value or array of values
     * @return void
     */
    public function orWhere($where, $value = null) {
        $this->addWhere($where, $value, 'OR');
    }

    /**
     * Add group by
     *
     * @param $column  Array of columns or one column
     */
    public function addGroupBy($columnOrArray) {
        if ( is_array($columnOrArray) == false )
            $columnOrArray = array($columnOrArray);

        foreach ( $columnOrArray as $column ) {
            if ( strlen($this->queryGroupBy) > 0 )
                $this->queryGroupBy .= ',';
            $this->queryGroupBy .= $column;
        }
    }

    /**
     * Order by
     * 
     * @param $orderBy
     * @return void
     */
    public function orderBy($orderBy) {
        $this->queryOrderBy = $orderBy;
    }

    /**
     * Set having
     *
     * @param $having
     * @return void
     */
    public function having($having) {
        $this->queryHaving = $having;
    }

    /**
     * Clear select clause
     */
    public function clearSelect() {
        $this->querySelect = '';
        $this->querySelectMap = array();
    }

    /**
     * Clear order by
     */
    public function clearWhere() {
        $this->queryWhere = '';
    }

    /**
     * Clear order by
     */
    public function clearOrderBy() {
        $this->queryOrderBy = '';
    }

    /**
     * Get from alias
     *
     * @return string
     */
    public function getFromAlias() {
        return $this->fromAlias;
    }

    /**
     * Get sql query
     *
     * @return string
     */
    public function getQuery($countOnly = false) {
        // Add selects to query
        foreach ( $this->querySelectMap as $as => $select ) {
            $this->__addSelect($select, $as);
        }
        $this->querySelectMap = array();

        // Format query
        $query = '';
        if (!$countOnly)
            $query .= 'SELECT ' . PHP_EOL . $this->querySelect . PHP_EOL;
        else {
            $query .= 'SELECT ';
            $query .= "entity.$entityIdentifier";
            if($this->queryHaving){
                //TODO přidat jen sloupce v havingu
                if (empty($this->as)) {
//                    $query .= "entity.$entityIdentifier";
                } else {
                    $this->as = array_unique($this->as);
                    foreach ($this->as as $as => $select) {
                        if ($as != "entity.$entityIdentifier") {
                            $query .= ',';
                            $query .= "entity.$entityIdentifier as `" . $a . '`';
                            $i++;
                            $query .= "$select as `" . $as . '`';
                        }else{
//                            $query .= "entity.$entityIdentifier";
                        }
                    }
                }
            }

            $query .= PHP_EOL;
        }
        $query .= $this->queryFrom;
        $queryJoins = '';
        foreach ($this->queryJoins as $queryJoin) {
            if ($countOnly){
                if ($queryJoin[1] == true)
                    $queryJoins .= $queryJoin[0];
            } else
                $queryJoins .= $queryJoin[0];
        }
        $query .= $queryJoins;
        if ( strlen($this->queryWhere) > 0 ) {
            $query .= 'WHERE ' . $this->queryWhere . PHP_EOL;
        }
        if ( strlen($this->queryGroupBy) > 0 ) {
            $query .= 'GROUP BY ' . $this->queryGroupBy . PHP_EOL;
        }
        if ( strlen($this->queryHaving) > 0 ) {
            $query .= 'HAVING ' . $this->queryHaving . PHP_EOL;
        }
        if (!$countOnly) {
            if (strlen($this->queryOrderBy) > 0) {
                $query .= 'ORDER BY ' . $this->queryOrderBy . PHP_EOL;
            }
        }
        return $query;
    }
}

?>