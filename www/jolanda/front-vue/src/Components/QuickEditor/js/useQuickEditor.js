import { ref } from 'vue';
import QuickEditorBuilder from "@/Components/QuickEditor/js/QuickEditorBuilder";

export function useQuickEditor(createQuickEditorFn, props = {}) {
    const quickEditorDef = ref(null);

    const create = async () => {
        if(createQuickEditorFn instanceof QuickEditorBuilder){
            quickEditorDef.value = await createQuickEditorFn._createDef(props?.params ?? null);
        }else{
            quickEditorDef.value = createQuickEditorFn(props?.params ?? null);
        }

        if(props.entityID){
            quickEditorDef.value.setEntityId(props.entityID);
        }

        if (props?.onAfterCreate && typeof props.onAfterCreate === 'function') {
            props.onAfterCreate(quickEditorDef.value);
        }
    }



    create();

    return {quickEditorDef};
}

export const quickEditorProps = {
    onAfterCreate: {
        type: Function,
        default: null,
    },
    onAfterInit: {
        type: Function,
        default: null,
    },
    entityID: {
        type: [Number, String, null],
        default: null,
    },
    forGrid: {
        type: Object,
        default: null,
    },

};
