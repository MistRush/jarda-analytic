import axios from "axios";
import { useAjax } from "@/Composables/useAjax.js";

export function useErrorHandler(app, errorEndpoint) {
    const { postForm } = useAjax();

    const initErrorHandler = () => {
        app.config.errorHandler = async (err, vm) => {
            await handleError(err, vm)
        };

        axios.interceptors.response.use(
            response => response,
            async (error) => {
                if (error.response?.status === 404 || error.response?.status === 500)
                    return Promise.reject(error);

                await handleError(error);
                return Promise.reject(error);
            }
        );
    }

    const handleError = async (err, vm = null) => {
        const errorObject = constructErrorObject(err, vm);
        if(errorObject === false)
            return;

        console.error(err);
        await sendError(errorObject);
    }

    const constructErrorObject = (err, vm) => {
        const base = {
            message: err?.message || String(err),
            host: window.location.host,
            path: window.location.pathname,
            component: vm ? getComponentTree(vm) : null,
        };

        if (err?.isAxiosError) {
            if (axios.isCancel(err) || err.code === 'ERR_CANCELED')
                return false;

            base.ajax = {
                url: err.config?.url,
                method: err.config?.method,
                status: err.response?.status,
                response: err.response?.data,
            };
        }

        return base;
    }

    const getComponentTree = (vm) => {
        const component =  {
            name: vm?.$options?.__name || vm?.$options?.name,
            attrs: vm?.$attrs,
            props: vm?.$props,
        }

        if(vm?.$parent)
            component.parentComponent = getComponentTree(vm.$parent);

        return component;
    }

    const sendError = async (errorObject) => {
        await postForm(errorEndpoint, { error: safeStringify(errorObject) });
    }

    const safeStringify = (obj) => {
        const seen = new WeakSet()
        return JSON.stringify(obj, (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value))
                    return "[Circular]"

                seen.add(value)
            }
            return value
        }, 2)
    }

    return {
        initErrorHandler,
        handleError,
    };
}
