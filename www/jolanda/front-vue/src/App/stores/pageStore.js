import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

export const usePageStore = defineStore('jolanda_page', () => {
    // Cache stavů stránek podle route name
    const pageStates = reactive({});

    // Aktuální stav stránky
    const currentPageName = ref(null);

    // Inicializace nového stavu stránky
    const createInitialPageState = () => ({
        // Data stránky
        data: null,
        status: null,
        fetched: false,

        // Route parametry
        routeParams: {
            query: {},
            params: {},
        },

        // Metadata
        meta: {
            title: '',
            loading: false,
            error: null,
        },

        // Gridy
        grids: {
            items: {},
        }
    });

    // Metody pro práci se stavy stránek
    const initPageState = (routeName) => {
        if (!pageStates[routeName]) {
            pageStates[routeName] = reactive(createInitialPageState());
            // markRaw(pageStates[routeName].grids);
        }
        currentPageName.value = routeName;
    };

    const getCurrentState = () => {
        if (!currentPageName.value || !pageStates[currentPageName.value]) {
            return reactive(createInitialPageState());
        }
        return pageStates[currentPageName.value];
    };

    const getPageState = (routeName) => {
        return pageStates[routeName] || reactive(createInitialPageState());
    };

    // Metody pro práci s daty stránky
    const setPageData = (data, routeName = currentPageName.value) => {
        const state = getPageState(routeName);
        state.data = data;
        state.status = 200;
        state.fetched = true;
    };

    const setPageError = (status, routeName = currentPageName.value) => {
        const state = getPageState(routeName);
        state.data = null;
        state.status = status;
        state.fetched = true;
    };

    const resetPageData = (routeName = currentPageName.value) => {
        const state = getPageState(routeName);
        state.data = null;
        state.status = null;
        state.fetched = false;
    };

    // Metody pro aktualizaci URL parametrů
    const updateRouteParams = (query, params, routeName = currentPageName.value) => {
        const state = getPageState(routeName);
        state.routeParams.query = query;
        state.routeParams.params = params;
    };

    // Metadata metody
    const setPageTitle = (title, routeName = currentPageName.value) => {
        const state = getPageState(routeName);
        state.meta.title = title;
        if (routeName === currentPageName.value) {
            document.title = title;
        }
    };

    const setLoading = (loading, routeName = currentPageName.value) => {
        const state = getPageState(routeName);
        state.meta.loading = loading;
    };

    const setError = (error, routeName = currentPageName.value) => {
        const state = getPageState(routeName);
        state.meta.error = error;
    };

    // Grid metody
    const registerGrid = (gridId, gridInstance, routeName = currentPageName.value) => {
        const state = getPageState(routeName);
        state.grids.items[gridId] = gridInstance;
    };

    const unregisterGrid = (gridId, routeName = currentPageName.value) => {
        const state = getPageState(routeName);
        delete state.grids.items[gridId];
    };

    const getGrid = (gridId, routeName = currentPageName.value) => {
        const state = getPageState(routeName);
        return state.grids.items[gridId];
    };

    const getAllGrids = (routeName = currentPageName.value) => {
        const state = getPageState(routeName);
        return Object.values(state.grids.items);
    };

    const clearPageState = (routeName = null) => {
        if(routeName){
            delete pageStates[routeName];
            if (currentPageName.value === routeName) {
                currentPageName.value = null;
            }
        }else{
            Object.keys(pageStates).forEach(key => {
                if(key !== currentPageName.value){
                    delete pageStates[key];
                }
            });
        }

    };

    return {
        // State
        pageStates,
        currentPageName,

        // Gettery
        getCurrentState,
        getPageState,

        // Základní metody
        initPageState,
        clearPageState,

        // Data metody
        setPageData,
        setPageError,
        resetPageData,

        // Route metody
        updateRouteParams,

        // Metadata metody
        setPageTitle,
        setLoading,
        setError,

        // Grid metody
        registerGrid,
        unregisterGrid,
        getGrid,
        getAllGrids,
    };
}); 