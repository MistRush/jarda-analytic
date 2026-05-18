import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useEntityLog } from '../js/useEntityLog.js';

export const useEntityLogStore = defineStore('entityLog', () => {
    const entityLogs = ref([]);
    
    /**
     * Vytvoří nový entity log a přidá ho do store
     * @param {string} entityName Název Doctrine entity
     * @param {number} entityID ID entity
     * @returns {Object} Instance entity logu
     */
    const createEntityLog = (entityName, entityID) => {
        const entityLog = useEntityLog(entityName, entityID);
        entityLogs.value.push(entityLog);
        return entityLog;
    };
    
    /**
     * Zobrazí historii entity - pokud už existuje, použije existující, jinak vytvoří nový
     * @param {string} entityName Název Doctrine entity
     * @param {number} entityID ID entity
     * @returns {Object} Instance entity logu
     */
    const showEntityHistory = (entityName, entityID) => {
        // Najdi existující entity log
        let entityLog = entityLogs.value.find(log => 
            log.entityName === entityName && log.entityID === entityID
        );
        
        // Pokud neexistuje, vytvoř nový
        if (!entityLog) {
            entityLog = createEntityLog(entityName, entityID);
        }
        
        // Zobraz historii
        entityLog.show();
        return entityLog;
    };
    
    /**
     * Zobrazí historii relace entity
     * @param {string} relationClass Název třídy relace
     * @param {string} parentClass Název rodičovské třídy
     * @param {number} parentID ID rodiče
     * @param {string} parentAlias Alias relace
     * @returns {Object} Instance entity logu
     */
    const showRelationHistory = async (relationClass, parentClass, parentID, parentAlias) => {
        // Vytvoř unikátní ID pro relaci
        const relationId = `${parentClass} (${parentID}) > ${parentAlias}`;
        
        // Najdi existující entity log pro tuto relaci
        let entityLog = entityLogs.value.find(log => 
            log.entityName === relationClass && log.entityID === relationId
        );
        
        // Pokud neexistuje, vytvoř nový
        if (!entityLog) {
            entityLog = createEntityLog(relationClass, relationId);
        }
        
        // Zobraz modal před načtením dat
        entityLog.isVisible = true;
        
        // Načti historii relace
        await entityLog.loadRelationHistory(relationClass, parentClass, parentID, parentAlias);
        
        return entityLog;
    };
    
    /**
     * Odstraní entity log ze store
     * @param {string} id ID entity logu
     */
    const removeEntityLog = (id) => {
        const index = entityLogs.value.findIndex(log => log.id === id);
        if (index !== -1) {
            entityLogs.value.splice(index, 1);
        }
    };
    
    /**
     * Odstraní všechny entity logy ze store
     */
    const clearAll = () => {
        entityLogs.value = [];
    };
    
    return {
        entityLogs,
        createEntityLog,
        showEntityHistory,
        showRelationHistory,
        removeEntityLog,
        clearAll
    };
}); 