import { defineStore } from 'pinia';
import { ref } from "vue";

export const useAlertStore = defineStore('jolanda_panels', () => {
    const panels = ref([]);

    const add = (panel) => {
        panels.value.push(panel);
    };

    const remove = (panel) => {
        const index = panels.value.indexOf(panel);
        if (index !== -1) {
            panels.value.splice(index, 1);
        }
    };

    const getPanels = () => {
        return panels.value;
    };

    const getShowedPanels = () => {
        return panels.value.filter(panel => panel.showed);
    };

    return {
        panels,
        add,
        remove,
        getPanels,
        getShowedPanels
    };
});