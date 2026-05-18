import { defineStore } from 'pinia';
import { ref } from "vue";

export const useInternalStore = defineStore('jolanda_internalStore', () => {
    const activeGrid = ref(null);
    const pageCache = ref([]);
    const pageDeepCacheCount = ref(0);
    const refreshActiveGrid = ref(false);

    const setActiveGrid = (grid) => {
        activeGrid.value = grid
    }

    const getActiveGrid = () => {
        return activeGrid.value;
    }

    const addPageToCache = (page) => {
        activeGrid.value = page.activeGrid;

        if(typeof page === 'string'){
            page = {
                component: page,
                activeGrid: null,
            };
        }else{
            page = {
                component: page.component,
                activeGrid: null,
                // ...page,
            }
        }



        // Kontrola, zda objekt již existuje (porovnáváme podle `component`)
        if (pageCache.value.some(cachedPage => cachedPage.component === page.component)) {
            return;
        }

        pageCache.value.push(page);
    };

    const removePageFromCache = (page) => {
        activeGrid.value = null;

        const component = typeof page === 'string' ? page : page.component;

        // Najdeme index objektu v cache (opět podle `component`)
        const index = pageCache.value.findIndex(cachedPage => cachedPage.component === component);
        if (index > -1) {
            pageCache.value.splice(index, 1);
        }
    };

    const getPageCache = () => {
        return pageCache.value;
    }

    const getPageCacheComponents = () => {
        return pageCache.value.map(page => page.component);
    }

    const getPageInCache = (component) => {
        return pageCache.value.find(cachedPage => cachedPage.component === component);
    }

    const clearPageCache = () => {
        refreshActiveGrid.value = null;
        activeGrid.value = null;
        pageCache.value = [];
    }

    const getPageDeepCacheCount = () => {
        return pageDeepCacheCount.value;
    }

    const setPageDeepCacheCount = (count) => {
        pageDeepCacheCount.value = count;
    }

    return {
        setActiveGrid,
        getActiveGrid,
        addPageToCache,
        removePageFromCache,
        getPageCache,
        getPageInCache,
        getPageCacheComponents,
        clearPageCache,
        activeGrid,
        pageCache,

        getPageDeepCacheCount,
        setPageDeepCacheCount,
        refreshActiveGrid
    };
});