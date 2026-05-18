import { defineStore } from "pinia";
import { ref } from "vue";

export const useErrorHandlerStore = defineStore('jolanda_errorHandlerStore', () => {
    const errorHandler = ref(null);

    const setErrorHandler = (handler) => {
        errorHandler.value = handler;
    }

    const getErrorHandler = () => {
        return errorHandler.value;
    }

    return {
        setErrorHandler,
        getErrorHandler
    };
});