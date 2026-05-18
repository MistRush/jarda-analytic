<script setup>
import { useTranslations } from "@/Composables/useTranslation.js";
import { inject } from "vue";

const props = defineProps({
    row: Object,
});
console.log(props.row);

const emit = defineEmits(["close"]);

const { translations } = useTranslations();
const dataGrid = inject("dataGrid", null);

const close = () => {
    emit("close");
};
</script>

<template>
    <Modal :is-visible="true" @close="close">
        <template #header>
            {{ translations.PREVIEW }}
        </template>
        <template #body>
            <div v-for="cell in props.row.cells" class="item">
                <template v-if="cell.column.external?.preview">
                    <h2>
                        <component v-if="typeof cell.column.label === 'function' && cell.column.label" :is="cell.column.label" />
                        <template v-else>
                            {{ cell.column.label }}
                        </template>
                    </h2>
                    <div v-if="typeof cell.renderPreview() === 'string'" v-html="cell.renderPreview()"></div>
                    <!--                    <component v-else :is="cell.renderPreview()"></component>-->
                    <hr />
                </template>
            </div>
        </template>
        <template #footer> </template>
    </Modal>
</template>

<style scoped>
hr {
    margin: 6px 0px 12px 0px !important;
}

h2 {
    font-weight: 600 !important;
}
</style>
