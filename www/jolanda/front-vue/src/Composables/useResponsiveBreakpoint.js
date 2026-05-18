import { ref, computed, unref } from 'vue';
import { useWindowResize } from './useWindowResize';

export function useResponsiveBreakpoint({
    breakpoints = { sm: 1000, md: 1900, lg: 2500 },
    element = null,
} = {}) {
    const getWidth = () => {
        const el = unref(element);
        return el instanceof HTMLElement ? el.clientWidth : window.innerWidth;
    };

    const getBreakpoint = (width) => {
        const entries = Object.entries(breakpoints)
            .sort(([, a], [, b]) => a - b);

        for (const [name, size] of entries) {
            if (width < size) {
                return name;
            }
        }

        return 'xl';
    };

    const currentBreakpoint = ref(getBreakpoint(getWidth()));

    useWindowResize(() => {
        const newBreakpoint = getBreakpoint(getWidth());
        if (newBreakpoint !== currentBreakpoint.value) {
            currentBreakpoint.value = newBreakpoint;
        }
    });

    const is = computed(() => currentBreakpoint.value);

    return {
        is,
        currentBreakpoint,
    };
}
