import { ref, markRaw } from 'vue';

export function usePageComponent() {
    const pageComponent = ref(null);
    const error = ref(false);
    const isRendered = ref(false);

    const loadComponent = async (path, routeName) => {
        try {
            const modules = import.meta.glob('/src/pages/**/*.vue');
            const importPath = '/src/pages' + path;

            if (!modules[importPath]) {
                throw new Error(`Component not found for path: ${path}`);
            }

            const module = await modules[importPath]();
            // module.default.__name = routeName;
            
            pageComponent.value = markRaw(module.default);
            error.value = false;
        } catch (err) {
            error.value = true;
            console.error("Failed to load component:", err);
            throw err;
        }
    };

    const reset = () => {
        pageComponent.value = null;
        error.value = false;
        isRendered.value = false;
    };

    return {
        pageComponent,
        error,
        isRendered,
        loadComponent,
        reset
    };
} 