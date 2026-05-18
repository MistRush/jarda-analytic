<script setup>
import PaginationInfo from "@/DataGrid/Components/Table/Footer/PaginationInfo.vue";
import {computed, inject} from "vue";
import {useTranslations} from "@/Composables/useTranslation.js";
import {RowSetting} from "@/DataGrid/js/Settings/RowSetting";

const props = defineProps();
const {translations} = useTranslations();

const dataGrid = inject('__dataGrid', null);
const theme = inject('__dataGrid_theme', null);

const selectedRows = computed(() => {
    if(dataGrid.settings.row.selectType === RowSetting.SELECT_TYPE_SINGLE){
        return;
    }

    return dataGrid.rows({selected: true}).count();
});

</script>

<template>
    <div class="dataGrid-footer"
         :class="{
            oldTheme: theme === 'old',
            newTheme: theme === 'new',
            'text-[0.846rem] dark:text-light': theme === 'new',
         }"
    >
        <div v-if="theme !== 'old'" class="flex justify-between">
            <PaginationInfo></PaginationInfo>
            <div class="selected-rows-info">
                <div v-if="selectedRows > 0">{{ translations.SELECTED }} <span class="font-bold">{{selectedRows}} {{ translations.OF }} {{dataGrid.ajax ? dataGrid.ajax._loadedRows.length : dataGrid._data.length}}</span> {{ translations.RECORDS }}</div>
            </div>

        </div>
    </div>
</template>

<style scoped>
    .selected-rows-info {
        padding-top: 5px;
        padding-right: 4px;
        white-space: nowrap;
    }
</style>