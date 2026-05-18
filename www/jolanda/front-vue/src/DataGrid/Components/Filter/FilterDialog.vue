<script setup>
import {computed, inject, h, onMounted} from "vue";
import { ColumnTypeNumber } from "@/DataGrid/js/Column/ColumnType/ColumnTypeNumber";
import { useTranslations } from "@/Composables/useTranslation.js";
import { ColumnTypeText } from "@/DataGrid/js/Column/ColumnType/ColumnTypeText";
import { ColumnTypeBool } from "@/DataGrid/js/Column/ColumnType/ColumnTypeBool";
import { ColumnTypeCheckbox } from "@/DataGrid/js/Column/ColumnType/ColumnTypeCheckbox";
import { ColumnTypeDate } from "@/DataGrid/js/Column/ColumnType/ColumnTypeDate";
import { ColumnTypeDateTime } from "@/DataGrid/js/Column/ColumnType/ColumnTypeDateTime";
import { ColumnTypeEnum } from "@/DataGrid/js/Column/ColumnType/ColumnTypeEnum";
import { ColumnTypeCurrency } from "@/DataGrid/js/Column/ColumnType/ColumnTypeCurrency";
import DatePicker from "@/Components/Inputs/DatePicker.vue";

const dataGridState = inject("dataGridState", null);
const grid = dataGridState.grid;
const state = dataGridState.filterDialog;

const { translations } = useTranslations();

//TODO předělat z grid.ajax.state na object a pak řešit v data() dataGridu
const applyFilter = inject("applyFilter");

const rangeValue = computed(() => (key) => {
    if (!state.data[key]) {
        state.data[key] = { from: null, to: null };
    }
    return state.data[key];
});

const resetFilter = () => {
    Object.entries(state.data).forEach(([key, value]) => {
        state.data[key] = null;
    });
};

const close = () => {
    applyFilter();
    state.show = false;
};
</script>

<template>
    <Modal :is-visible="state.show" @close="close">
        <template #header> </template>
        <template #body>
            <Form :state="state">
                <div class="row">
                    <template v-for="column in grid.columns">
                        <div class="col-12 md:col-6" v-if="column.external?.filter">
                            <template v-if="column.format instanceof ColumnTypeBool">
                                <RadioBool :name="column.label" :label="column.label" v-model="state.data[column.data]" :none-option="true" direction="inline" />
                            </template>
                            <template v-if="column.format instanceof ColumnTypeCheckbox">
                                <RadioBool :name="column.label" :label="column.label" v-model="state.data[column.data]" :none-option="true" direction="inline" />
                            </template>
                            <template v-if="column.format instanceof ColumnTypeDate">
                                <DatePicker :label="column.label" v-model="state.data[column.data]" :range="true" type="date" />
                            </template>
                            <template v-if="column.format instanceof ColumnTypeDateTime">
                                <DatePicker :label="column.label" v-model="state.data[column.data]" :range="true" type="datetime" />
                            </template>
                            <template v-if="column.format instanceof ColumnTypeEnum">
                                <Select
                                    :label="column.label"
                                    v-model="state.data[column.data]"
                                    :multiple="true"
                                    :options="
                                        column.enumValues
                                            ? Object.entries(column.enumValues).map(([key, value]) => ({
                                                  text: value,
                                                  value: isNaN(key) ? key : Number(key),
                                              }))
                                            : []
                                    "
                                />
                            </template>
                            <template v-if="column.format instanceof ColumnTypeNumber">
                                <div class="number-range">
                                    <InputField :label="() => h('span', [typeof column.label === 'function' ? h(column.label) : column.label, ' ', translations.FROM])" v-model="rangeValue(column.data).from" type="number" class="from" />
                                    <InputField :label="() => h('span', [typeof column.label === 'function' ? h(column.label) : column.label, ' ', translations.TO])" v-model="rangeValue(column.data).to" type="number" class="to" />
                                </div>
                            </template>
                            <template v-if="column.format instanceof ColumnTypeText">
                                <InputField :label="column.label" v-model="state.data[column.data]" type="text" />
                            </template>
                            <template v-if="column.format instanceof ColumnTypeCurrency">
                                <InputField :label="column.label" v-model="state.data[column.data]" type="currency" />
                            </template>
                        </div>
                    </template>
                    <slot :data="state.data"></slot>
                </div>
            </Form>
        </template>
        <template #footer>
            <Button
                variant="green"
                @click="
                    applyFilter();
                    close();
                "
                class="mr-2"
            >
                Potvrdit
            </Button>
            <Button variant="orange" @click="resetFilter" class="mr-2"> Resetovat </Button>
<!--            <Button variant="red" @click="state.show = false" class="mr-2"> Zavřít </Button>-->
        </template>
    </Modal>
</template>

<style scoped>
.number-range {
    display: flex;
    gap: 30px;

    .from,
    .to {
        flex-grow: 1;
    }
}
</style>
