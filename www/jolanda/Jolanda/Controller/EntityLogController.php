<?php

namespace Jolanda\Controller;

class EntityLogController extends \Zend_Controller_Action
{
    public function indexAction(): void
    {
        $entityName = $this->getParam('entity');
        $entityID = $this->getParam('id');

        $this->getEntityHistoryJson($entityName, $entityID);
    }

    public function loadRelationHistoryAction(): void
    {
        $class = $this->getParam('class');
        $parentClass = $this->getParam('parent_class');
        $parent_ID = $this->getParam('parent_id');
        $parentAlias = $this->getParam('parent_alias');

        $this->getRelationHistoryJson($class, $parentClass, $parent_ID, $parentAlias);
    }

    /**
     * Vrátí historii entity v JSON formátu pro Vue komponentu
     */
    public function getEntityHistoryJson($entityName, $entityID, $returnData = false)
    {
        /** @var Admin_Model_Order $entity dame si napr objednavku, at to aspon neco napovida */
        $entity = $entityName::findOneBy('ID', $entityID);

        $entityLog = \Admin_Model_EntityLog::findBy(null, null, [
            'Entity' => $entityName,
            'Entity_ID' => $entityID,
        ], ['DateTime' => 'ASC']);

        $entityClass = new $entityName();

        if ($entity === false) {
            $entity = $entityClass;
        }

        $entityHistory = $this->getHistoryForEntity($entityClass, $entityID);
        $entityHistory = array_column($entityHistory, null, 'entitylog_id');

        $entityRelations = [];
        foreach ($entityClass->getTable()->getRelations() as $relation) {
            /** @var Doctrine_Relation_ForeignKey $relation */

            $entityRelations[] = [
                'random' => rand(1, 999999),
                'alias' => $relation->getAlias(),
                'class' => $relation->getClass(),
                'numberOfItems' => $this->getHistoryCount($relation, $entity)
            ];
        }

        // Připrav data pro JSON
        $entityData = [
            'id' => $entity->ID ?? null,
            'description' => method_exists($entity, 'getEntityDescription') ? $entity->getEntityDescription(
            ) : get_class($entity),
            'className' => get_class($entity),
            'currentState' => []
        ];

        // Přidej aktuální stav entity
        if ($entity->ID) {
            foreach ($entity->getTable()->getFieldNames() as $columnName => $fieldName) {
                $entityData['currentState'][$columnName] = $entity->{$fieldName};
            }
        }

        // Připrav data pro tabulku historie
        $historyData = [];
        if (!empty($entityLog) && $entityLog->count() > 0) {
            foreach ($entityLog as $entityRow) {
                $user = $entityRow->user;
                $historyRow = [
                    'id' => $entityRow->ID,
                    'user' => [
                        'id' => $user->ID ?? null,
                        'name' => $user->Name ?? '-'
                    ],
                    'url' => $entityRow->URL,
                    'dateTime' => $entityRow->DateTime,
                    'action' => $entityRow->Action,
                    'entityId' => $entityRow->Entity_ID,
                    'changes' => []
                ];

                // Přidej změny pro každý sloupec
                if (!empty($entityHistory) && !empty($entityHistory[$entityRow->ID])) {
                    foreach ($entity->getTable()->getColumns() as $columnName => $data) {
                        $fieldName = strtolower($columnName);
                        $value = $entityHistory[$entityRow->ID]->{$fieldName} ?? null;

                        $historyRow['changes'][$columnName] = [
                            'value' => $value,
                            'isJson' => str_starts_with($value, '{') && json_decode($value) !== false
                        ];
                    }
                }

                $historyData[] = $historyRow;
            }
        }

        // Připrav data pro relace
        $relationsData = [];
        foreach ($entityRelations as $relation) {
            $relationsData[] = [
                'random' => $relation['random'],
                'alias' => $relation['alias'],
                'class' => $relation['class'],
                'numberOfItems' => $relation['numberOfItems'],
                'canLoad' => $relation['numberOfItems'] > 0 && $relation['numberOfItems'] < 300
            ];
        }

        $response = [
            'success' => true,
            'data' => [
                'entity' => $entityData,
                'history' => $historyData,
                'relations' => $relationsData
            ]
        ];

        // Pokud máme vracet data místo výpisu JSON
        if ($returnData) {
            return $response;
        }

        $this->getResponse()->setHeader('Content-Type', 'application/json');
        echo json_encode($response);
        die();
    }

    /**
     * Vrátí historii relace v JSON formátu pro Vue komponentu
     */
    public function getRelationHistoryJson($relationClass, $parentClass, $parentID, $parentAlias)
    {
        $parentEntity = $parentClass::findOneBy('ID', $parentID);
        $relation = $parentEntity->$parentAlias;

        $relationsData = [];

        // Kontrola, zda je to Doctrine Collection (více entit)
        if (get_class($relation) == \Doctrine_Collection::class) {
            $relationsIDs = [];

            // Projdi všechny entity v kolekci
            foreach ($parentEntity->$parentAlias as $relationItem) {
                $relationData = $this->getEntityHistoryJson(get_class($relationItem), $relationItem->ID, true);
                $relationsData[] = $relationData;
                $relationsIDs[] = $relationItem->ID;
            }

            // Najdi smazané entity
            if (!empty($relationsIDs)) {
                $deleted = $this->findByClassAndValue(
                    get_class($relationItem),
                    $relation->getRelation()->getForeignFieldName(),
                    $parentID,
                    $relationsIDs
                );
                foreach ($deleted as $deletedItem) {
                    $relationData = $this->getEntityHistoryJson($deletedItem->Entity, $deletedItem->Entity_ID, true);
                    $relationsData[] = $relationData;
                }
            }
        } // Kontrola pro Doctrine_Relation_ForeignKey (jedna entita)
        else {
            if (get_class($relation) == \Doctrine_Relation_ForeignKey::class) {
                $relationData = $this->getEntityHistoryJson(get_class($relation), $relation->ID, true);
                $relationsData[] = $relationData;
            } // Fallback pro ostatní typy relací
            else {
                $relationData = $this->getEntityHistoryJson(get_class($relation), $relation->ID, true);
                $relationsData[] = $relationData;
            }
        }

        $response = [
            'success' => true,
            'data' => $relationsData
        ];

        $this->getResponse()->setHeader('Content-Type', 'application/json');
        echo json_encode($response);
        die();
    }

    /**
     *
     * @return \Admin_Model_EntityLogValues[]
     */
    public static function getHistoryForEntity(\Doctrine_Record $entity, $entityID)
    {
        $select = [];

        foreach ($entity->getTable()->getColumns() as $columnName => $data) {
            $select[] = "MAX(CASE WHEN ev.field = '" . $columnName . "' THEN ev.newvalue ELSE NULL END) AS " . $columnName . "";
        }
        //
        $sqlSelect = implode(' , ', $select);
        $entityName = get_class($entity);
        $sql = <<<SQL
          SELECT 
             e.entity_id as history_entity_id,
             ev.entitylog_id,
             $sqlSelect
            FROM admin__model__entity_log_values ev
            LEFT JOIN admin__model__entity_log e ON e.id = ev.entitylog_id
            WHERE e.entity = '$entityName' AND e.entity_id = '$entityID'
          GROUP BY ev.entitylog_id
        SQL;
        return \Doctrine_Manager::connection()->getDbh()->query($sql)->fetchAll(\PDO::FETCH_OBJ);
    }

    public function getHistoryCount($relation, \Doctrine_Record $entity)
    {
        if (get_class($relation) == \Doctrine_Relation_ForeignKey::class) {
            $externalFieldName = $relation->getForeignFieldName();
            $entityFieldName = $relation->getLocalFieldName();
        } else {
            $externalFieldName = $relation->getForeignFieldName();
            $entityFieldName = $relation->getLocalFieldName();
        }
        if (empty($entity->{$entityFieldName})) {
            return 0;
        }

        $query = \Doctrine_Query::create();
        $query->from($relation->getClass() . ' object');
        $query->where('object.' . $externalFieldName . ' = ?', $entity->{$entityFieldName});

        return $query->count();
    }

    // $relation->getRelation()->getForeignFieldName() == $parent_ID && not in $relationsIDs

    /**
     *
     * @return \Admin_Model_EntityLog[]
     */
    public function findByClassAndValue($class, $columnName, $columnValue, $excludedIds = [])
    {
        $select = [];

        $query = \Doctrine_Query::create();
        $query->select('object.*');
        $query->addSelect('entityLogValues.*');
        $query->from('Admin_Model_EntityLog object');
        $query->leftJoin('object.entityLogValues entityLogValues');
        $query->where('object.Entity = ?', $class);
        $query->addWhere('entityLogValues.Field = ? AND entityLogValues.NewValue = ?', [$columnName, $columnValue]);

        if (!empty($excludedIds)) {
            $query->andWhereNotIn('object.Entity_ID', $excludedIds);
        }

        return $query->execute();
    }
}
