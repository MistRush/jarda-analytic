import { useEntityLogStore } from "@/Components/Other/EntityLog/stores/entityLogStore.js";

export function useEntityLog(entityName = null, entityID = null) {
    const store = useEntityLogStore(window.pinia);

    // Pokud jsou předány parametry, vytvoří a zobrazí historii
    if (entityName && entityID) {
        return store.showEntityHistory(entityName, entityID);
    }

    return {
        ...store,
    };
} 