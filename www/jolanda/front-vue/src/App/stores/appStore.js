import { defineStore } from 'pinia';
import {markRaw, reactive, computed} from "vue";

export const useAppStore = defineStore('jolanda_appStore', () => {
    const store = reactive({ app: null });
    const app = computed(() => store.app);

    const setApp = (application) => {
        store.app = application;

        if(store.app.layout?.component){
            store.app.layout.component = markRaw(store.app.layout.component);
        }
    }

    const getApp = () => {
        return store.app;
    }

    return {
        setApp,
        getApp,
        app
    };
});