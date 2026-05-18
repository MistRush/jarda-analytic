import { computed, onUnmounted, inject, toValue } from "vue";
import {useTabsStore} from "@/App/stores/tabsStore";

let i = 0;
export function usePageInstance(options = {}) {
  const tabId = options?.tab ? toValue(options.tab).id : inject('jolanda_currentTabId');
  const tabsStore = useTabsStore(window.pinia);
  const tab = options.tab ?? tabsStore.tabs.find(t => t.id === toValue(tabId));

  const initState = () => {
    return {
      i: i++,
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
        title: tab ? toValue(tab).route.meta.title : '',
        loading: false,
        error: null,
      },

      // Gridy
      grids: {
        items: {},
      }
    }
  }

  const state = computed(() => {
    if(toValue(tab)){
      if(!toValue(tab).page){
        toValue(tab).page = initState();
        // markRaw(toValue(tab).page.grids);
      }


      return toValue(tab).page;
    }else{
      return initState();
    }
    // else{
    //     const injectedTabId = inject('jolanda_currentTabId');
    //
    //     if(injectedTabId){
    //         const tabsStore = useTabsStore(window.pinia);
    //         const injectedTab = tabsStore.tabs.find(t => t.id === injectedTabId);
    //
    //         if(injectedTab){
    //             if(!injectedTab.page){
    //                 injectedTab.page = initState();
    //                 markRaw(injectedTab.page.grids);
    //             }
    //
    //             return injectedTab.page;
    //         }
    //     }
    //
    //     return initState();
    // }
  })



  // Computed properties pro snadný přístup
  // const query = computed(() => state.value.routeParams.query);
  const query = computed(() => toValue(tab)?.route?.query);
  // const params = computed(() => state.value.routeParams.params);
  const params = computed(() => toValue(tab)?.route?.params);
  const pageData = computed(() => ({
    data: state.value.data,
    status: state.value.status,
    fetched: state.value.fetched
  }));
  const isLoading = computed(() => state.value.meta.loading);
  const error = computed(() => state.value.meta.error);
  const title = computed(() => state.value.meta.title);

  // Grid helpers s kontextem komponenty
  const registerGrid = (gridId, gridInstance) => {
    state.value.grids.items[gridId] = gridInstance;
    // markRaw(state.value.grids.items[gridId]);
  };

  const unregisterGrid = (gridId) => {
    delete state.value.grids.items[gridId];
  };

  const getGrid = (gridId) => {
    return state.value.grids.items[gridId];
  };

  const getAllGrids = () => {
    return Object.values(state.value.grids.items);
  };

  // Automatické odstranění všech gridů při zničení komponenty
  onUnmounted(() => {
    const gridIds = Object.keys(state.value.grids.items);
    gridIds.forEach(gridId => unregisterGrid(gridId));
  });

  // Wrapper funkce pro zachování kontextu komponenty
  const setPageData = (data) => {
    state.value.data = data;
    state.value.status = 200;
    state.value.fetched = true;
  }
  const setPageError = (status) => {
    state.value.data = null;
    state.value.status = status;
    state.value.fetched = true;
  };
  const resetPageData = () => {
    state.value.data = null;
    state.value.status = null;
    state.value.fetched = false;
  };
  const setLoading = (loading) => {
    state.value.meta.loading = loading;
  };
  const setError = (error) => {
    state.value.meta.error = error;
  };
  const setTitle = (title) => {
    state.value.meta.title = title;
    if(tab){
      toValue(tab).title = title;
    }
  };

  return {
    state,
    // URL parametry
    query,
    params,

    // Data stránky
    pageData,
    setPageData,
    setPageError,
    resetPageData,

    // Metadata
    isLoading,
    error,
    title,
    setLoading,
    setError,
    setTitle,

    // Grid metody
    registerGrid,
    unregisterGrid,
    getGrid,
    getAllGrids,
  };
}