<script setup>
import { ref } from "vue";
import CheckIcon from "../../../Icons/CheckIcon.vue";
import TextEditor from "./TextEditor.vue";
import EnumEditor from "./EnumEditor.vue";
import DateEditor from "./DateEditor.vue";

const props = defineProps({
    cell: Object,
    type: String,
});

const emit = defineEmits(["confirm", "cancel"]);

const value = ref(props.cell.getData());
const oldVal = value.value;

const confirm = (val = null) => {
    if(val) {
        value.value = val;
    }

    props.cell.updateData(value.value);
    emit("confirm", value.value);
    if (typeof props.cell.column.dataGrid.settings.editor?.onAfterConfirm === "function") {
        props.cell.column.dataGrid.settings.editor.onAfterConfirm(props.cell, value.value, oldVal);
    }
};

const cancel = () => {
    emit("cancel");
};
</script>

<template>
    <div class="inline-editor">
        <div class="editor-wrapper">
            <TextEditor v-model="value" v-if="type === 'text' || type === 'number'" @keyup.enter="confirm(null)" :number="type === 'number'"></TextEditor>
            <EnumEditor v-model="value" :enum-values="props.cell.column.format.enumValues" v-if="type === 'enum' || type === 'bool'" @change="(val) => confirm(val)" @close="cancel"></EnumEditor>
            <DateEditor v-model="value" v-if="type === 'date' || type === 'datetime' || type === 'time'" :type="type"></DateEditor>
        </div>

        <template v-if="!(type === 'enum' || type === 'bool')">
            <CheckIcon class="icon" @click="confirm(null)" />
            <Icon icon="close" class="close-icon" @click="cancel" />
        </template>
    </div>
</template>

<style scoped>
.icon {
    cursor: pointer;
    margin-left: 10px;
    min-width: 10px;
}

.close-icon {
    cursor: pointer;
    margin-left: 10px;
    width: 10px;
}

.inline-editor {
    display: flex;
    align-items: center;
}
</style>
