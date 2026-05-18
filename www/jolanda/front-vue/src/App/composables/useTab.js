import { inject, computed, onUnmounted } from "vue";
import { useTabsStore } from "@/App/stores/tabsStore";
import { onTabEvent } from "@/App/events/tabEvents";
import { toValue } from "@vueuse/core";

export function useTab(options = {}) {
    const tabStore = useTabsStore(window.pinia);
    const tabId = options?.tabId ? options.tabId : inject("jolanda_currentTabId", null);

    const tab = computed(() => {
        if (toValue(tabId)) {
            return tabStore.tabs.find((t) => t.id === toValue(tabId));
        } else {
            return null;
        }
    });

    const cleanups = [];

    if (tab.value && tab.value.id) {
        if (options.onActivate) {
            cleanups.push(onTabEvent(tab.value.id, "activate", options.onActivate));
        }
        if (options.onDeactivate) {
            cleanups.push(onTabEvent(tab.value.id, "deactivate", options.onDeactivate));
        }
        if (options.onClose) {
            cleanups.push(onTabEvent(tab.value.id, "close", options.onClose));
        }
    }

    onUnmounted(() => {
        cleanups.forEach((unsub) => unsub());
    });

    const close = () => {
        tabStore.closeTab(tab.value.id);
    };

    const setIcon = (icon) => {
        tab.value.icon = icon;
    };
    const setDescription = (description) => {
        tab.value.description = description;
    };

    const setTitle = (title) => {
        tab.value.title = title;
    };

    const pushModal = (id) => {
        if(!tab.value) return;

        tab.value.modalStack = tab.value.modalStack.filter(x => x !== id);
        tab.value.modalStack.push(id);
    };

    const removeModal = (id) => {
        if(!tab.value) return;

        tab.value.modalStack = tab.value.modalStack.filter(x => x !== id);
    };

    const isModalOnTop = (id) => {
        if(!tab.value) return;

        return tab.value.modalStack.length > 0 && tab.value.modalStack[tab.value.modalStack.length - 1] === id;
    }

    return {
        tab,
        close,
        setIcon,
        tabStore,
        setTitle,
        setDescription,
        pushModal,
        removeModal,
        isModalOnTop,
    };
}
