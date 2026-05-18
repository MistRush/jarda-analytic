<script setup>
import {computed, inject} from "vue";
import { useTranslations } from "@/Composables/useTranslation.js";

  const props = defineProps();

const {translations} = useTranslations();

const dataGrid = inject('__dataGrid', null);

const minMax = computed(() => {
    if(!dataGrid.scroller.viewportItems.length){
        return {
            min: 0,
            max: 0
        }
    }

    return {
        min: Math.min(...dataGrid.scroller.viewportItems) + 1,
        max: Math.max(...dataGrid.scroller.viewportItems) + 1
    }
});

const itemsLength = computed(() => {
    return dataGrid.scroller.virtualListRef?.items?.length?.toLocaleString('cs-CZ') ?? 0;
});
</script>

<template>
    <div v-if="dataGrid.scroller.virtualListRef" class="pagination-info">
        {{ translations.DISPLAYING }} <b>{{minMax.min}} - {{minMax.max}}</b> {{ translations.OF }} <b>{{ itemsLength }}</b> {{ translations.RECORDS }}
    </div>
</template>

<style scoped>
.pagination-info{
    padding-top: 5px;
    padding-left: 4px;
    white-space: nowrap;
}
</style>