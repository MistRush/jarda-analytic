import { onMounted, onUnmounted } from 'vue';

export function useWindowResize(callback) {
    onMounted(() => window.addEventListener('resize', callback));
    onUnmounted(() => window.removeEventListener('resize', callback));
}