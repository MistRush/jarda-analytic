import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * @brief Definuje store se stavem helpbaru
 **/
export const useHelpbarStore = defineStore('jolanda_helpbar', () => {
    // Je helpbar otevřený?
    const isOpen = ref(false);
    // cesta, na které se na webu momentálně uživatel nachází
    const currentPath = ref('');
    // Data stránky načtené v helpbaru
    const currentPage = ref({
        id: null,
        parentdoc_id: null,
        title: 'Nová dokumentace',
        urlpattern: '',
        content: '',
        breadcrumb: '',
        tags: '',
        createdat: Date.now(),
        createdby: '',
        updatedat: Date.now(),
        updatedby: '',
    });
    const currentJolandaPage = ref(false);

    const pageDocList = ref([]);
    const jolandaDocList = ref([]);

    // Přepínač dokumentace mezi dokumentací projektu a jolandy
    const showJolandaDocs = ref(false);
    // Data Jolanda stránky načtené v helpbaru

    // Seznam všech dokumentací s navigacemi
    const navigationMap = ref([]);
    const jolandaNavigationMap = ref([]);

    function updateNavigationMap(newMap) {
        const navMap = (showJolandaDocs.value ? jolandaNavigationMap : navigationMap);
        navMap.value = newMap;
    }

    // Získá navigaci pro dokumentaci přes jeho ID
    function getNavigationItem(docId) {
        const navMap = (showJolandaDocs.value ? jolandaNavigationMap : navigationMap);
        if (navMap.value instanceof Map) {
            return navMap.value.get(docId);
        }
        return false;
    }

    // Zobrazení seznamu dokumentací
    const showPageDocList = ref(false);
    const showJolandaDocList = ref(true);

    const toggleOpen = (() => {
        isOpen.value = !isOpen.value;
    });

    const toggleDoctype = (() => {
        showJolandaDocs.value = !showJolandaDocs.value;
    });

    const togglePageHelpbarType = (() => {
        showPageDocList.value = !showPageDocList.value;
    });

    const toggleJolandaHelpbarType = (() => {
        showJolandaDocList.value = !showJolandaDocList.value;
    });

    /**
     * @desc Updates the current page path if Helpbar component is not currently opened or current path is empty
     * @param newPath Path to be applied
     */
    const updateCurrentPath = ((newPath) => {
        if(!isOpen.value || currentPath.value === '') {
            currentPath.value = newPath;
        }
    });

    const updateCurrentPage = ((data) => {
        if(showJolandaDocs.value) {
            currentJolandaPage.value = data;
        } else {
            currentPage.value = data;
        }
    });

    const updateDocList = (data) => {
        const docList = (showJolandaDocs.value ? jolandaDocList : pageDocList);
        docList.value = data;
    }

    return {
        isOpen,
        showJolandaDocs,
        toggleOpen,
        showPageDocList, showJolandaDocList,
        pageDocList, jolandaDocList,
        navigationMap, updateNavigationMap, getNavigationItem,

        currentPath,
        currentPage,
        currentJolandaPage,

        togglePageHelpbarType, toggleJolandaHelpbarType,
        toggleDoctype,
        updateCurrentPath,
        updateCurrentPage,
        updateDocList
    };
});
