<script setup>
import DialogComponent from "@/Components/Dialog/Components/Dialog.vue";
import QuickEditorComponent from "@/Components/QuickEditor/Components/QuickEditor.vue";
import Dialog from "@/Components/Dialog/js/Dialog";
import {onMounted, ref, watch} from "vue";

const props = defineProps({
    json: String,
    quickEditorDef: Object,
    onAfterInit: Function,
    forGrid: Object,
    entityID: [String, Number],

    //Def from slots
    title: String,
    url: String,
});

const dialog = ref(new Dialog());
const quickEditorRef = ref(null);

const initEditor = () => {
    if(props.quickEditorDef){
        props.quickEditorDef.dialog = dialog.value;


        dialog.value.onAfterClose = () => {
            if(props.quickEditorDef.forGrid && props.quickEditorDef.forGrid.editor){
                props.quickEditorDef.forGrid.editor.close();
            }
        };
    }
}

initEditor();


onMounted(() => {
   if(dialog.value){
        dialog.value.show();
   }
});

watch(() => props.quickEditorDef, (newVal, oldVal) => {
    if(newVal && oldVal === null){
        initEditor();
    }
});

watch(() => quickEditorRef.value?.quickEditor, (newVal, oldVal) => {
    if(newVal){
        newVal.entityEditorDef.dialog = dialog.value;

        dialog.value.onAfterClose = () => {
            newVal.entityEditorDef.forGrid?.editor?.close();
        };
    }

});

</script>

<template>
    <DialogComponent :dialog="dialog">
        <template #title>
            Editovat
        </template>
        <template #content>
            <QuickEditorComponent v-bind="props" ref="quickEditorRef">
                <slot name="default"></slot>
            </QuickEditorComponent>
        </template>
        <template #footer>

        </template>
    </DialogComponent>
</template>