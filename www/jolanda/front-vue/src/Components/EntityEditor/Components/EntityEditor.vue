<script setup>
import {onDeactivated, onMounted, onUnmounted, reactive, ref} from "vue";
import EntityEditorMapper from "../js/Mappers/EntityEditorMapper";
import Content from "@/Components/EntityEditor/Components/Content.vue";
import Buttons from "@/Components/EntityEditor/Components/Buttons.vue";
import PanelComponent from "@/Components/Panel/Components/Panel.vue";
import Panel from "@/Components/Panel/js/Panel.js";
import EntityEditor from "../js/EntityEditor";
import {useAppStore} from "@/App/stores/appStore";
import {useInternalStore} from "@/App/stores/internalStore";

const props = defineProps({
    json: String,
    entityEditorDef: Object,
    panel: Panel,
    customCode: String,
})

const entityEditorRef = ref(null);  // Definujeme ref pro entity editor
const customCodeWrapperRef = ref(null);  // Definujeme ref pro entity editor
const entityEditorDef = reactive(!props.entityEditorDef ? EntityEditorMapper.map(props.json) : props.entityEditorDef);
const entityEditor = ref(null);

const internalStore = useInternalStore(window.pinia);

onMounted(() => {
    try{
        entityEditor.value = new EntityEditor(entityEditorDef);
        window[entityEditorDef.id] = entityEditor.value;
        panel.entityEditor = window[entityEditorDef.id];
        entityEditor.value.panel = panel;

        //TODO zbavit se závislosti na entityEditorDef
        if(internalStore.getActiveGrid()){
            entityEditorDef.forGrid = internalStore.getActiveGrid();
            entityEditorDef.forGrid.editor.editor = entityEditor.value;

            if(entityEditorDef.forGrid.editor && entityEditorDef.forGrid.editor.parentRows){
                entityEditorDef.forGrid.editor.parentRows.forEach((row) => {
                    entityEditor.value.setParentEntity(row.column, row.id);
                });
            }
        }

        // window[entityEditor.id].entity_id = 1;

        if (props.customCode && customCodeWrapperRef.value) {
            const container = document.createElement('div');
            container.innerHTML = props.customCode;

            // Najdeme všechny <script> tagy a přímo je vykonáme v customCodeWrapperRef
            const scripts = container.querySelectorAll('script');
            scripts.forEach((script) => {
                const inlineScript = document.createElement('script');
                inlineScript.textContent = script.textContent;
                customCodeWrapperRef.value.appendChild(inlineScript); // Přidáme a spustíme přímo v customCodeWrapperRef
            });

            // // Přidáme obsah divu bez <script> tagů do customCodeWrapperRef
            // customCodeWrapperRef.value.appendChild(container);
        }
    }catch (e){
        console.error(e)
    }

});

const panel = reactive(props.panel ? props.panel : new Panel());
panel.setTitle(entityEditorDef.getTitle());

if(!props.panel){
    panel.show();
    // panel.showed = true;
}

panel.classes = 'entity-editor';

onUnmounted(() => {
    if(entityEditorDef.forGrid && entityEditorDef.forGrid.editor){
        entityEditorDef.forGrid.editor.close();
    }
});

onDeactivated(() => {
    if(entityEditorDef.forGrid && entityEditorDef.forGrid.editor){
        entityEditorDef.forGrid.editor.close();
    }
})

const goBack = () => {
  const { app } = useAppStore(window.pinia);
    //TODO co když není back URL?
    const backURL = entityEditorDef.getBackUrl();
    if(typeof backURL === 'string')
        app.router.router.push({ name: backURL });
    else app.router.router.push(backURL);
}
</script>

<template>
    <PanelComponent :panel="panel" ref="entityEditorRef">
        <template #back>
            <template v-if="!props.panel">
<!--                <a v-if="entityEditorDef.getBackUrl() != null" class="btn btn-icon" :href="entityEditorDef._bu + '/' + entityEditorDef.getBackUrl()" :id="entityEditorDef.getId()+'_back'"><i class="fa fa-arrow-left"></i> </a>-->
                <a v-if="entityEditorDef.getBackUrl() != null" class="btn btn-icon" @click="goBack" :id="entityEditorDef.getId()+'_back'"><i class="fa fa-arrow-left"></i> </a>
                <h1 class="d-inline-block" data-content="title" v-html="entityEditorDef.getTitle()"></h1>
            </template>
        </template>
        <template #buttons>
            <Buttons :entityEditor="entityEditorDef"/>
        </template>
        <template #header>

        </template>
        <template #content>
            <Content :entityEditor="entityEditorDef"/>
            <div class="vue-entityeditor-beta-text">VUE ENTITY EDITOR</div>
        </template>
        <template #footer>
        </template>
        <template v-if="props.customCode">
            <div ref="customCodeWrapperRef">

            </div>
        </template>
    </PanelComponent>
</template>

<style scoped>
    .vue-entityeditor-beta-text{
        font-size: 11px;
        opacity: 0.4;
        text-align: right;
        position: absolute;
        right: 15px;
        bottom: 0;
        pointer-events: none;
    }
</style>