import { reactive } from "vue";
import { useAjax } from '@/Composables/useAjax.js';

/**
 * @brief Vytvoří objekt entity logu s členskými funkcemi pro zobrazení historie entity
 * @param entityName Název Doctrine entity (např. 'Common_Model_Eshop')
 * @param entityID ID entity
 * @returns Objekt entity logu, který je pak vložen do pole entityLogStore
 */

export function useEntityLog(entityName, entityID) {
    const { get } = useAjax();
    
    return reactive({
        id: crypto.randomUUID(),
        entityName: entityName,
        entityID: entityID,
        isVisible: false,
        isLoading: false,
        data: null,
        error: null,
        
        /**
         * Zobrazí modal s historií entity
         */
        show() {
            this.isVisible = true;
            this.loadHistory();
        },
        
        /**
         * Skryje modal s historií entity
         */
        hide() {
            this.isVisible = false;
            this.data = null;
            this.error = null;
        },
        
        /**
         * Načte historii entity z backendu
         */
        async loadHistory() {
            if (!this.entityName) {
                this.error = 'Chybí název entity';
                return;
            }
            
            // Pro relace (entityID obsahuje unikátní identifikátor)
            if (this.entityID && this.entityID.includes('_')) {
                this.error = 'Tato entita je relace, použij loadRelationHistory';
                return;
            }
            
            if (!this.entityID) {
                this.error = 'Chybí ID entity';
                return;
            }
            
            this.isLoading = true;
            this.error = null;
            
            try {
                const response = await get('/admin/entity-log/index', {
                    params: {
                        entity: this.entityName,
                        id: this.entityID,
                        format: 'json'
                    }
                }, { waitingAlert: false });
                
                if (response.data.success) {
                    // Vždy zabalíme data do pole, i když je to jen jedna entita
                    this.data = [response.data.data];
                } else {
                    this.error = 'Chyba při načítání dat';
                }
            } catch (error) {
                this.error = error.message || 'Chyba při načítání historie';
            } finally {
                this.isLoading = false;
            }
        },
        
        /**
         * Načte historii relace entity
         */
        async loadRelationHistory(relationClass, parentClass, parentID, parentAlias) {
            if (!relationClass || !parentClass || !parentID || !parentAlias) {
                this.error = 'Chybí parametry pro načtení historie relace';
                return;
            }
            
            this.isLoading = true;
            this.error = null;
            
            try {
                const response = await get('/admin/entity-log/load-relation-history', {
                    params: {
                        class: relationClass,
                        parent_class: parentClass,
                        parent_id: parentID,
                        parent_alias: parentAlias,
                        format: 'json'
                    }
                }, { waitingAlert: false });
                
                if (response.data.success) {
                    // Backend vrací pole objektů s vlastními success a data vlastnostmi
                    // Musíme extrahovat data z každého objektu
                    if (Array.isArray(response.data.data)) {
                        this.data = response.data.data.map(item => item.data);
                    } else {
                        // Fallback pro případ, že data nejsou pole
                        this.data = [response.data.data];
                    }
                } else {
                    this.error = 'Chyba při načítání dat relace';
                }
            } catch (error) {
                this.error = error.message || 'Chyba při načítání historie relace';
            } finally {
                this.isLoading = false;
            }
        }
    });
} 