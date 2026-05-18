<script setup>
import { provide } from "vue";
import { useTabsStore } from "@/App/stores/tabsStore";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/App/stores/appStore";
import { useTab } from "@/App/composables/useTab";
import { usePage } from "@/App/composables/usePage";

const props = defineProps({
    pageComponent: Object,
});

const { app } = useAppStore();

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore(window.pinia);

const currentTab = tabsStore.tabs.find((tab) => tab.id === app.router.normalizeFullPathWithQuery(route)) || null;

provide("jolanda_currentTabId", currentTab.id);
provide("jolanda_currentTabInstanceId", currentTab.instanceId);

const { tab } = useTab({
    tabId: currentTab.id,
    onActivate: () => {
        const gridIds = tab.value.gridRefreshQueue || [];

        gridIds.forEach((gridId) => {
            const grid = getGrid(gridId);

            if (grid) {
                grid.refresh();
            }
        });

        // Po zpracování vyčistit
        tab.value.gridRefreshQueue = [];
    },
});

const { getGrid } = usePage({ tab });
</script>

<template>
    <div>
        <component :is="pageComponent" />
    </div>
</template>
