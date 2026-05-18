<script setup>
import { inject } from "vue";
import { useTranslations } from "@/Composables/useTranslation.js";

const dataGridState = inject("dataGridState", null);
const grid = dataGridState.grid;

const { translations } = useTranslations();
</script>

<template>
    <Modal :is-visible="true" @close="dataGridState.columnsSettingDialog.show = false">
        <template #header>
            {{ translations.SHOW_HIDE_COLUMNS }}
        </template>
        <template #body>
            <div class="dataTable-columnvisibility row">
                <div class="btn-group-toggle col-12 md:col-6" v-for="column in grid.columns">
                    <label class="btn flex items-center justify-between border-b border-outline dark:border-light/20 pb-2" :class="{ active: column.visible }">
                        <component v-if="typeof column.label === 'function' && column.label" :is="column.label" />
                        <template v-else>
                            {{ column.label }}
                        </template>
                        <Switch v-model="column.visible" />
                    </label>
                </div>
            </div>
        </template>
        <template #footer> </template>
    </Modal>
</template>
