<template>
    <div>
        <!-- Modal pro zobrazení historie entity -->
        <Modal
            v-for="entityLog in entityLogs"
            :key="entityLog.id"
            v-model:isVisible="entityLog.isVisible"
            @close="entityLog.hide()"
            size="fullscreen"
            :fullHeight="true"
        >
            <template #header>Historie entit</template>
            <template #body>
                <!-- Breadcrumb navigace -->
                <div
                    class="breadcrumb mb-4 p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <!-- Pokud prohlížíme relaci, zobraz parent informace -->
                        <template v-if="entityLog.parentClass && entityLog.parentID && entityLog.parentAlias">
                            <span class="font-medium">Parent:</span>
                            <span
                                class="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded text-xs">
                                {{ entityLog.parentClass }}
                            </span>
                            <span class="mx-2">|</span>
                            <span class="font-medium">ID:</span>
                            <span
                                class="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs">
                                {{ entityLog.parentID }}
                            </span>
                            <span class="mx-2">|</span>
                            <span class="font-medium">Relace:</span>
                            <span
                                class="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded text-xs">
                                {{ entityLog.parentAlias }}
                            </span>
                        </template>
                        <!-- Jinak zobraz standardní entity informace -->
                        <template v-else>
                            <span class="font-medium">Entity:</span>
                            <span
                                class="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs">
                                {{ entityLog.entityName || 'Neznámá třída' }}
                            </span>
                            <span class="mx-2">|</span>
                            <span class="font-medium">ID:</span>
                            <span
                                class="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs">
                                {{ entityLog.entityID || 'Neznámé ID' }}
                            </span>
                        </template>
                    </div>
                </div>

                <div v-if="entityLog.isLoading" class="flex justify-center items-center p-8">
                    <span class="ml-3">Načítání historie...</span>
                </div>

                <div v-else-if="entityLog.error" class="p-4">
                    <Alert type="error" :title="'Chyba'" :message="entityLog.error"/>
                </div>

                <div v-else-if="entityLog.data" class="entity-log-content">
                    <!-- Vždy zobrazujeme jako více entit, protože data jsou vždy v poli -->
                    <div v-if="Array.isArray(entityLog.data) && entityLog.data.length > 0" class="relations-content">
                        <div v-for="(entityData, index) in entityLog.data" :key="index" class="relation-entity mb-8">
                            <!-- Informace o entitě -->
                            <div
                                class="entity-info mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                                <h4 class="text-md font-semibold mb-2">
                                    {{ entityData.entity?.description || 'Entity' }}</h4>
                                <div class="text-sm text-gray-600 dark:text-gray-400">
                                    <span class="font-medium">ID:</span> {{ entityData.entity?.id || 'SMAZÁNO' }}
                                    |
                                    <span class="font-medium">Třída:</span> {{
                                        entityData.entity?.className || 'Neznámá'
                                    }}
                                </div>
                            </div>

                            <!-- Tabulka historie pro tuto entitu -->
                            <div class="history-table mb-4">
                                <h5 class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                    {{
                                        entityData.history && entityData.history.length > 0 ? 'Historie změn' : 'Aktuální stav'
                                    }}
                                </h5>
                                <div class="overflow-x-auto overflow-y-auto max-h-[40dvh]">
                                    <table class="min-w-full border border-gray-200 dark:border-gray-700">
                                        <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0">
                                        <tr>
                                            <th class="px-3 py-2 text-left text-xs font-medium bg-gray-50 text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b">
                                                ID log
                                            </th>
                                            <th class="px-3 py-2 text-left text-xs font-medium bg-gray-50 text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b">
                                                Uživatel
                                            </th>
                                            <th class="px-3 py-2 text-left text-xs font-medium bg-gray-50 text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b">
                                                Datum
                                            </th>
                                            <th class="px-3 py-2 text-left text-xs font-medium bg-gray-50 text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b">
                                                Akce
                                            </th>
                                            <th v-for="(change, fieldName) in getTableColumns(entityData)"
                                                :key="fieldName"
                                                class="px-3 py-2 text-left text-xs font-medium bg-gray-50 text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b">
                                                {{ fieldName }}
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody
                                            class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                        <tr v-if="entityData.history && entityData.history.length > 0"
                                            v-for="historyItem in entityData.history" :key="historyItem.id"
                                            class="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td class="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border-b">
                                                {{ historyItem.id }}
                                            </td>
                                            <td class="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border-b">
                                                {{ historyItem.user.name }}
                                            </td>
                                            <td class="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border-b">
                                                {{ formatDateTime(historyItem.dateTime) }}
                                            </td>
                                            <td class="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border-b">
                                                {{ historyItem.action }}
                                            </td>
                                            <td v-for="(change, fieldName) in historyItem.changes" :key="fieldName"
                                                class="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border-b">
                                                <span class="text-sm">{{ change.value || '' }}</span>
                                            </td>
                                        </tr>
                                        <!-- Prázdný řádek pokud není historie -->
                                        <tr v-if="!entityData.history || entityData.history.length === 0"
                                            class="text-center text-gray-500 dark:text-gray-400">
                                            <td colspan="100%" class="py-8">
                                                Žádná historie změn
                                            </td>
                                        </tr>
                                        </tbody>

                                        <!-- Aktuální stav -->
                                        <tfoot class="sticky bottom-0">
                                        <tr>
                                            <th class="px-3 py-2 text-left text-xs font-medium bg-gray-50 text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b">
                                                Aktuální stav
                                            </th>
                                            <th class="px-3 py-2 text-left text-xs font-medium bg-gray-50 text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b">
                                            </th>
                                            <th class="px-3 py-2 text-left text-xs font-medium bg-gray-50 text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b">
                                            </th>
                                            <th class="px-3 py-2 text-left text-xs font-medium bg-gray-50 text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b">
                                            </th>
                                            <th v-for="(value, fieldName) in (entityData.entity?.currentState || {})"
                                                :key="fieldName"
                                                class="px-3 py-2 text-left text-sm text-gray-900 bg-gray-50 dark:text-gray-100 border-b">
                                                <span class="text-sm">{{ value || '-' }}</span>
                                            </th>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <!-- Relace pro tuto entitu -->
                                <div v-if="entityData.relations && entityData.relations.length > 0"
                                     class="relations mt-4">
                                    <h6 class="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">Relace</h6>
                                    <div class="space-y-1">
                                        <button v-for="relation in entityData.relations"
                                                :key="relation.random"
                                                @click="loadRelationHistoryForEntity(relation, entityData.entity || {}, entityLog)"
                                                :disabled="!relation.canLoad"
                                                class="text-left p-1 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <span class="font-medium">{{ relation.alias }}</span>
                                            <span class="text-xs text-gray-500 dark:text-gray-400">({{
                                                    relation.numberOfItems
                                                }})</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else class="p-4 text-center text-gray-500">
                        Žádná data k zobrazení
                    </div>
                </div>
            </template>

            <template #footer>
                <a href="#" @click="entityLog.hide()" variant="secondary">
                    Zavřít
                </a>
            </template>
        </Modal>

        <!-- Modal pro JSON data -->
        <Modal
            v-model:isVisible="jsonModal.show"
            size="fullscreen"
        >
            <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-96">{{ jsonModal.data }}</pre>
            <template #footer>
                <button @click="jsonModal.show = false" variant="secondary">Zavřít</button>
            </template>
        </Modal>
    </div>
</template>

<script setup>
import {useEntityLogStore} from './stores/entityLogStore.js';
import Modal from '@/Components/Modal/Modal.vue';
import Alert from '@/Components/Alerts/Alert.vue';
import {reactive} from 'vue';

// Použij store pro získání všech entity logů
const store = useEntityLogStore(window.pinia);
const {entityLogs} = store;

// Modal pro JSON data
const jsonModal = reactive({
    show: false,
    data: ''
});

// Funkce pro formátování data a času
const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    const date = new Date(dateTime);
    return date.toLocaleString('cs-CZ');
};

// Funkce pro získání titulku modalu
const getModalTitle = (entityLog) => {
    if (entityLog.data?.entity) {
        return `Historie: ${entityLog.data.entity.description} (ID: ${entityLog.data.entity.id || 'SMAZÁNO'})`;
    }
    return `Historie entity ${entityLog.entityName} (ID: ${entityLog.entityID})`;
};

// Funkce pro zobrazení JSON modalu
const showJsonModal = (jsonData) => {
    try {
        const parsed = JSON.parse(jsonData);
        jsonModal.data = JSON.stringify(parsed, null, 2);
        jsonModal.show = true;
    } catch (error) {
        jsonModal.data = jsonData;
        jsonModal.show = true;
    }
};

// Funkce pro získání sloupců tabulky
const getTableColumns = (data) => {
    // Pokud je historie, použij sloupce z první historie
    if (data.history && data.history.length > 0 && data.history[0].changes) {
        return data.history[0].changes;
    }

    // Jinak použij aktuální stav entity
    if (data.entity && data.entity.currentState) {
        return data.entity.currentState;
    }

    return {};
};

// Funkce pro načtení historie relace
const loadRelationHistory = async (relation, entityLog) => {
    if (!relation.canLoad) return;

    try {
        await entityLog.loadRelationHistory(
            relation.class,
            entityLog.data.entity.className,
            entityLog.data.entity.id,
            relation.alias
        );
    } catch (error) {
        console.error('Chyba při načítání historie relace:', error);
    }
};

// Funkce pro načtení historie relace pro entitu v relaci
const loadRelationHistoryForEntity = async (relation, entity, entityLog) => {
    if (!relation.canLoad) return;

    try {
        // Použij store pro zobrazení historie relace
        await store.showRelationHistory(
            relation.class,
            entity.className,
            entity.id,
            relation.alias
        );
    } catch (error) {
        console.error('Chyba při načítání historie relace pro entitu:', error);
    }
};
</script>

<style scoped>
.entity-log-content {
    max-height: 100vh;
    overflow-y: auto;
}

/* Responzivní tabulka */
.history-table {
    overflow-x: auto;
}

/* Hover efekty pro tlačítka relací */
.relations button:hover:not(:disabled) {
    background-color: rgb(243 244 246);
}

.dark .relations button:hover:not(:disabled) {
    background-color: rgb(31 41 55);
}

/* JSON modal styling */
pre {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
}

/* Aktuální stav styling */
.current-state .grid > div {
    transition: all 0.2s ease;
}

.current-state .grid > div:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Relace styling */
.relations-content .relation-entity {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    background-color: #fafafa;
}

.dark .relations-content .relation-entity {
    background-color: #1f2937;
    border-color: #374151;
}

.relations-content .relation-entity:not(:last-child) {
    margin-bottom: 1.5rem;
}

/* Rozlišení mezi entitami v relaci */
.relation-entity .entity-info {
    border-left: 4px solid #3b82f6;
}

.relation-entity .entity-info h4 {
    color: #1e40af;
}

.dark .relation-entity .entity-info h4 {
    color: #93c5fd;
}

/* Relace v entitách styling */
.relation-entity .relations {
    border-top: 1px solid #e5e7eb;
    padding-top: 0.75rem;
    margin-top: 0.75rem;
}

.dark .relation-entity .relations {
    border-top-color: #374151;
}

.relation-entity .relations button {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
}

.relation-entity .relations button:hover:not(:disabled) {
    background-color: rgb(219 234 254);
}

.dark .relation-entity .relations button:hover:not(:disabled) {
    background-color: rgb(30 58 138);
}
</style>
