import {ref} from 'vue';
import {useRouter} from 'vue-router';
import EditorBuilder from "@/Components/EntityEditor/js/EditorBuilder";

export function useEntityEditor(createEntityEditorFn, props = {}) {
    const entityEditorDef = ref(null);

    const create = async () => {
        if(createEntityEditorFn instanceof EditorBuilder){
            entityEditorDef.value = await createEntityEditorFn._createDef(props?.params ?? null);
        }else{
            entityEditorDef.value = createEntityEditorFn(props?.params ?? null);
        }

        if(typeof props.entityID === 'undefined'){
            const router = useRouter();
            const entityID = router?.currentRoute?.value?.query?.entity_ID ?? null;

            if(entityID){
                entityEditorDef.value.setEntityId(entityID);
            }
        }else if(props.entityID){
            entityEditorDef.value.setEntityId(props.entityID);
        }

        if (props?.onAfterCreate && typeof props.onAfterCreate === 'function') {
            props.onAfterCreate(entityEditorDef.value);
        }
    }

    create();

    return {entityEditorDef};
}

export const entityEditorProps = {
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
        default: undefined,
    },
};
