import {computed, ref, watch} from 'vue';
import GridBuilder from "@/DataGrid/js/GridBuilder";

export function useGridOld(createGridFn, props, ...args) {
    const gridDef = ref(null);

    if(props?.parent){
        if(!props.parent.hasOwnProperty('grid') || !props.parent.column){
            throw new Error('Parent grid and column must be set');
        }
    }

    const reactiveDepends = computed(() => {
        const depends = [...(props?.depends ?? [])];

        // Kontrola, zda už parent není v seznamu (porovnáváme hodnotu ref)
        if (
            props?.parent &&
            !depends.some((dep) => dep === props.parent.grid || dep?.value === props.parent?.grid.value)
        ) {
            depends.push(props.parent.grid); // Přidáme parent do depends
        }

        return depends;
    });

    const create = () => {
        watch(
            reactiveDepends,
            async (newDepends) => {
                if(gridDef.value){
                    return;
                }

                if (newDepends.every((dep) => dep)) {
                    if(createGridFn instanceof GridBuilder){
                        gridDef.value = await createGridFn._createDef({...props?.params ?? {}, ...args[0]});
                    }else{
                        gridDef.value = createGridFn({...props?.params ?? {}, ...args[0]});
                    }


                    if(props?.parent){
                        gridDef.value.setParentGrid(props.parent.grid, props.parent.column, props.parent.child ?? 'ID');
                    }

                    if (props?.onAfterCreate && typeof props.onAfterCreate === 'function') {
                        props.onAfterCreate(gridDef.value);
                    }
                }
            },
            {immediate: true} // Spustí se i při první hodnotě
        );
    }

    create();

    return {gridDef};
}

export const gridProps = {
    onAfterCreate: {
        type: Function,
        default: null,
    },
    depends: {
        type: Array,
        default: () => [],
    },
    parent: {
        type: Object,
        default: null,
    }
};
