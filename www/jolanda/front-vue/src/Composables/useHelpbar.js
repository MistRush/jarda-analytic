import {useHelpbarStore} from "@/Components/Helpbar/stores/helpbarStore.js";

export function useHelpbar(){
    const store = useHelpbarStore(window.pinia);

    return {
        ...store,
    }
}