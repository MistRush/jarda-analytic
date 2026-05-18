<script setup>
import { reactive, ref, provide, computed } from 'vue';
import { useResponsiveBreakpoint } from "@/Composables/useResponsiveBreakpoint";
import { useApp } from "@/App/composables/useApp.js";
import Popover from "@/Components/Popover/Popover.vue";

const props = defineProps({
    horizontal: {
        type: Boolean,
        default: false,
    },
    defaultTab: {
        type: String,
        default: null,
    }
});

const emit = defineEmits(['tab-change']);

const { is } = useResponsiveBreakpoint();
const { layout } = useApp();

const tabs = reactive([]);
const activeTab = ref(null);

// Funkce pro registraci a odregistraci tabů
const registerTab = (tabId, tabTitle, tabIcon) => {
    if (!tabs.some((t) => t.id === tabId)) {
        tabs.push({ id: tabId, title: tabTitle, icon: tabIcon });
    }

    if (!activeTab.value || (props.defaultTab && tabId === props.defaultTab)) {
        activeTab.value = tabId;
    }
};

const unregisterTab = (tabId) => {
    const index = tabs.findIndex((t) => t.id === tabId);
    if (index !== -1) {
        tabs.splice(index, 1);
    }

    if (activeTab.value === tabId) {
        if (tabs.length > 0) {
            activeTab.value = tabs[0].id;
        } else {
            activeTab.value = null;
        }
    }
};

const setActiveTab = (tabId) => {
    activeTab.value = tabId;
    emit('tab-change', tabId);
};

// Provide pro Tab komponenty
provide("registerTab", registerTab);
provide("unregisterTab", unregisterTab);
provide("activeTab", activeTab);

const showMobileTabs = computed(() => layout.state.isMobile && tabs.length > 1);
</script>

<template>
    <div class="tabs-container">
        <!-- Mobilní navigace tabů -->
        <div v-if="showMobileTabs" class="mobile-tabs-nav fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark border-t border-outline dark:border-medium">
            <div class="flex justify-center py-2">
                <Popover placement="top" :offset="10">
                    <template #trigger>
                        <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary">
                            <span>{{ tabs.find(tab => tab.id === activeTab)?.title || 'Vybrat tab' }}</span>
                            <Icon icon="chevron-up" class="w-4 h-4" />
                        </button>
                    </template>
                    <template #content>
                        <div class="bg-white dark:bg-dark border border-outline dark:border-medium rounded-lg shadow-lg p-2 min-w-[200px]">
                            <nav>
                                <ul class="space-y-1">
                                    <li v-for="(tab, index) in tabs" :key="tab.id">
                                        <a 
                                            href="#" 
                                            @click.prevent="setActiveTab(tab.id)"
                                            class="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-primary/20"
                                            :class="{ 'bg-primary/20 text-primary': activeTab === tab.id }"
                                        >
                                            <Icon v-if="tab.icon" :icon="tab.icon" class="w-4 h-4" />
                                            <span>{{ tab.title }}</span>
                                        </a>
                                        <hr v-if="index !== tabs.length - 1" class="m-auto w-full border-outline dark:border-light/20" />
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </template>
                </Popover>
            </div>
        </div>

        <!-- Desktop navigace -->
        <div class="body flex" :class="{ 'flex-col': horizontal }">
            <!-- Levá navigace (vertikální) nebo horní (horizontální) -->
            <div 
                v-if="tabs.length > 1 && !layout.state.isMobile" 
                class="tabs-nav"
                :class="{ 
                    'w-[20%] max-w-[260px] pr-6': !horizontal, 
                    'px-[10px] pb-4': horizontal 
                }"
            >
                <nav class="bg-white dark:bg-dark rounded-lg shadow-sm p-1" :class="{ 'overflow-auto': horizontal }">
                    <ul :class="{ 'flex gap-2': horizontal, 'space-y-1': !horizontal }">
                        <li
                            v-for="(tab, index) in tabs"
                            :key="tab.id"
                            class="hover:bg-primary/20 rounded-md"
                            :class="{
                                'bg-primary/20': activeTab === tab.id,
                                'whitespace-nowrap': horizontal
                            }"
                        >
                            <a 
                                href="#" 
                                @click.prevent="setActiveTab(tab.id)"
                                class="block"
                            >
                                <div class="px-3 py-2 flex items-center gap-3">
                                    <Icon v-if="tab.icon" :icon="tab.icon" class="w-4 h-4 text-primary" />
                                    <span class="text-sm font-medium">{{ tab.title }}</span>
                                </div>
                            </a>
                            <hr v-if="index !== tabs.length - 1 && !horizontal" class="mx-2 border-outline dark:border-light/20" />
                        </li>
                    </ul>
                </nav>
            </div>

            <!-- Obsah tabů -->
            <div class="tabs-content flex-1">
                <slot />
            </div>
        </div>
    </div>
</template>

<style scoped>
.tabs-container {
    height: 100%;
    width: 100%;
}

.body {
    height: 100%;
    width: 100%;
}

.tabs-nav {
    flex-shrink: 0;
}

.tabs-content {
    min-height: 0;
    overflow: auto;
}

.mobile-tabs-nav {
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}
</style>
