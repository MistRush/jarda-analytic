<script setup>
import { computed, h, inject } from "vue";
import { ColumnTypeBool } from "@/DataGrid/js/Column/ColumnType/ColumnTypeBool.js";
import { ColumnTypeDate } from "@/DataGrid/js/Column/ColumnType/ColumnTypeDate.js";
import { ColumnTypeDateTime } from "@/DataGrid/js/Column/ColumnType/ColumnTypeDateTime.js";
import { ColumnTypeEnum } from "@/DataGrid/js/Column/ColumnType/ColumnTypeEnum.js";
import { ColumnTypeNumber } from "@/DataGrid/js/Column/ColumnType/ColumnTypeNumber.js";
import { ColumnTypeText } from "@/DataGrid/js/Column/ColumnType/ColumnTypeText.js";
import { ColumnTypeCurrency } from "@/DataGrid/js/Column/ColumnType/ColumnTypeCurrency.js";
import DatePicker from "@/Components/Inputs/DatePicker.vue";
import { useTranslations } from "@/Composables/useTranslation.js";

const dataGridState = inject("dataGridState", null);
const grid = dataGridState.grid;
const state = dataGridState.filterDialog;

const { translations } = useTranslations();
const applyFilter = inject("applyFilter");

const columnValueMap = computed(() => {
    const map = [];

    Object.entries(state.data).forEach(([key, value]) => {
        if (state.data[key] !== null) {
            if(typeof state.data[key] === "object" && state.data[key].from === null && state.data[key].to === null) {
                return;
            }

            const col = grid.columns.find((col) => col.data === key);

            if (col) {
                map.push({
                    column: col,
                    value,
                });
            }
        }
    });

    return map;
});

const removeFilter = (key) => {
    state.data[key] = null;

    applyFilter();
};
</script>

<template>
    <div class="flex gap-2 mt-2 items-center">
        <span class="font-bold text-[12px] mb-2">{{ translations.ACTIVE_FILTERS }}:</span>
        <Tag v-for="item in columnValueMap" light class="mb-2">
            <div class="flex gap-2 items-center">
                <div class="font-bold">{{ item.column.label }}:</div>
                <div>
                    <template v-if="item.column.format instanceof ColumnTypeBool">
                        <template v-if="item.value">
                            {{ translations.YES }}
                        </template>
                        <template v-else>
                            {{ translations.YES }}
                        </template>
                    </template>
                    <template v-if="item.column.format instanceof ColumnTypeDate">
                        <template v-if="typeof item.value === 'object'"> {{ item.value.from ?? '' }} - {{ item.value.to ?? '' }} </template>
                        <template v-else>
                            {{ item.value }}
                        </template>
                    </template>
                    <template v-if="item.column.format instanceof ColumnTypeDateTime">
                        <template v-if="typeof item.value === 'object'"> {{ item.value.from ?? '' }} - {{ item.value.to ?? '' }} </template>
                        <template v-else>
                            {{ item.value }}
                        </template>
                    </template>
                    <template v-if="item.column.format instanceof ColumnTypeEnum">
                        {{ item.column.enumValues[item.value] }}
                    </template>
                    <template v-if="item.column.format instanceof ColumnTypeNumber">
                        <template v-if="typeof item.value === 'object'"> {{ item.value.from ?? '' }} - {{ item.value.to ?? '' }} </template>
                        <template v-else>
                            {{ item.value }}
                        </template>
                    </template>
                    <template v-if="item.column.format instanceof ColumnTypeText">
                        {{ item.value }}
                    </template>
                    <template v-if="item.column.format instanceof ColumnTypeCurrency">
                        <template v-if="typeof item.value === 'object'"> {{ item.value.from ?? '' }} - {{ item.value.to ?? '' }} </template>
                        <template v-else>
                            {{ item.value }}
                        </template>
                    </template>
                </div>
                <div>
                    <Icon icon="close" class="w-[10px] hover:opacity-75 cursor-pointer" @click="removeFilter(item.column.data)" />
                </div>
            </div>
        </Tag>
    </div>
</template>

<style scoped></style>
