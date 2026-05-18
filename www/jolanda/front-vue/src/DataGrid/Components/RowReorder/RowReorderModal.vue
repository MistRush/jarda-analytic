<script setup>
import Modal from "@/Components/Modal/Modal.vue";
import { inject, onMounted, reactive, ref } from "vue";
import Table from "@/Components/Table/Table.vue";
import Thead from "@/Components/Table/Thead.vue";
import TheadTr from "@/Components/Table/TheadTr.vue";
import Tbody from "@/Components/Table/Tbody.vue";
import TbodyTd from "@/Components/Table/TbodyTd.vue";
import { useAjax } from "@/Composables/useAjax.js";
import Button from "@/Components/Inputs/Button.vue";
import { useTranslations } from "@/Composables/useTranslation.js";
import { useAlerts } from "@/Composables/useAlerts.js";
import Loader from "@/Components/Other/Loading/Loader.vue";
import Icon from "@/Icons/Icon.vue";

const props = defineProps({
    reorderColumn: String,
    columns: Array,
});

const emit = defineEmits("close");

const dataGrid = inject("dataGrid", null);
const dataGridState = inject("dataGridState");

const ajax = useAjax();
const { translations } = useTranslations();
const alerts = useAlerts();

const state = reactive({
    rows: null,
    loading: true,
});

const loadData = async () => {
    const params = { ...dataGrid.ajax.state };
    delete params.count;
    delete params.start;
    delete params.order;
    delete params.sort;

    Object.entries(dataGridState.filterDialog.data).forEach(([key, value]) => {
        delete params[key];
    });

    params.sort = props.reorderColumn;

    ajax.get(dataGrid.ajax.url, {
        params: params,
    }).then(({ data }) => {
        if (data && data.items) {
            state.rows = data.items;
        }

        state.loading = false;
    });
};

const save = async () => {
    const saveQueue = [];
    const saveUrl = dataGrid.ajax.url.replace(/\/data-list$/, "") + "/data-update";

    const waitingAlert = alerts.waiting(translations.SAVING);

    state.rows.forEach((row, index) => {
        saveQueue.push(
            ajax.postForm(saveUrl, {
                data: JSON.stringify({
                    ID: row.ID,
                    Rank: index + 1,
                }),
            }),
        );
    });

    await Promise.all(saveQueue);

    waitingAlert.changeToSuccess("OK");
    emit("close");
};

onMounted(() => {
    loadData();
});
</script>

<template>
    <Modal :is-visible="true" @close="emit('close')">
        <template #header>{{ translations.ROW_REORDER }}</template>
        <template #body>
            <div class="min-h-10">
                <Table v-if="!state.loading">
                    <Thead class="sticky">
                        <TheadTr>
                            <TheadTh>#</TheadTh>
                            <TheadTh v-for="column in columns">{{ column.label }}</TheadTh>
                        </TheadTr>
                    </Thead>
                    <Tbody :list="state.rows" draggable @onAfterDrag="(val) => (state.rows = val)" class="table-body">
                        <template #default="{ element, index }">
                            <TbodyTd class="pl-0!"><Icon icon="handle" class="w-[18px] h-[18px] text-icon-light-gray inline mr-2" />{{ index + 1 }}</TbodyTd>
                            <TbodyTd v-for="column in columns">{{ element[column.data] }}</TbodyTd>
                        </template>
                    </Tbody>
                </Table>
                <Loader v-else size="8px" />
            </div>
        </template>
        <template #footer>
            <Button variant="green" @click="save">{{ translations.SAVE }}</Button>
        </template>
    </Modal>
</template>

<style scoped>
:deep([data-draggable]) {
    cursor: grab;
    background-color: red;
}

:deep([data-draggable].sortable-chosen) {
    cursor: grabbing !important;
}
</style>
