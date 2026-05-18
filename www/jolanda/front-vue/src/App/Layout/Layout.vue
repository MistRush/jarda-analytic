<script setup>
import MenuComponent from "@/App/Layout/Menu/Components/Menu.vue";
import AlertManager from "@/Components/Alerts/AlertManager.vue";
import EntityLog from "@/Components/Other/EntityLog/EntityLog.vue";
import Helpbar from "@/Components/Helpbar/Helpbar.vue";
import { useAlertStore } from "@/Components/Alerts/stores/alertStore.js";
import { useApp } from "@/App/composables/useApp.js";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Loader from "@/Components/Other/Loading/Loader.vue";
import { useCookies } from "@/Composables/useCookies";
import { useBroadcastChannel, useMediaQuery } from "@vueuse/core";
import { useHelpbar } from "@/Composables/useHelpbar";
import { useTabsStore } from "@/App/stores/tabsStore";
import draggable from "vuedraggable";
import AppRouterLink from "@/App/Router/AppRouterLink.vue";
import { useTranslations } from "@/Composables/useTranslation.js";
import FavoritesModal from "@/App/Layout/Menu/Components/Favorites/FavoritesModal.vue";
import Popover from "@/Components/Popover/Popover.vue";
import Button from "@/Components/Inputs/Button.vue";

const props = defineProps({});

const { app, user } = useApp();
const { translations } = useTranslations();

const layout = app.layout;
const menu = layout.menu;
const settings = layout.settings;
const alerts = useAlertStore(window.pinia);
const helpbar = useHelpbar();
const route = useRoute();
const router = useRouter();
const cookies = useCookies();
const isMobile = useMediaQuery("(max-width: 960px)");
// useTabScreenshotLoop();
if (layout && route?.query?.hasOwnProperty("_nolayout")) {
    layout.state.hideLayout = true;
}

const hasDefaultView = computed(() => {
    return route.matched.some((record) => record.components?.default);
});

const hasEditorView = computed(() => {
    return route.matched.some((record) => record.components?.editor);
});

const lightMenu = ref(cookies.getCookie("menuOpened") === "false");
const darkModeChanel = useBroadcastChannel({ name: "jolanda-dark-mode-channel" });

// Mobilní stav
const isMobileMenuOpen = ref(false);
const isTabsPopoverOpen = ref(false);

const themeToggle = () => {
    const currentColorMode = cookies.getCookie("color-mode");
    if (currentColorMode === "prefer-dark") {
        cookies.setCookie("color-mode", "prefer-light", 999);
        darkModeChanel.post("light");
    } else {
        cookies.setCookie("color-mode", "prefer-dark", 999);
        darkModeChanel.post("dark");
    }

    document.documentElement.classList.toggle("dark-theme", currentColorMode !== "prefer-dark");
};

watch(
    () => darkModeChanel.data.value,
    () => {
        document.documentElement.classList.toggle("dark-theme", darkModeChanel.data.value === "dark");
    },
);

//tabs DEV
const tabsStore = useTabsStore(window.pinia);

const scrollTabContainer = ref(null);

const handleWheel = (event) => {
    if (scrollTabContainer.value) {
        event.preventDefault();
        scrollTabContainer.value.scrollLeft += event.deltaY;
    }
};

onMounted(() => {
    if (scrollTabContainer.value) {
        scrollTabContainer.value.addEventListener("wheel", handleWheel, { passive: false });
    }
});

onBeforeUnmount(() => {
    if (scrollTabContainer.value) {
        scrollTabContainer.value.removeEventListener("wheel", handleWheel);
    }
});

const reload = () => {
    location.reload(true);
};

//menu favorites
const showMenuFavoritesModal = ref(false);

// Mobilní funkce
const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
};

const toggleTabsPopover = () => {
    isTabsPopoverOpen.value = !isTabsPopoverOpen.value;
};

watch(
    isMobile,
    (newValue) => {
        layout.state.isMobile = newValue;
    },
    { immediate: true },
);
</script>

<template>
    <div class="layout bg-white dark:bg-dark-bg min-h-[100dvh] h-full w-full min-w-0" :class="{ 'pb-[60px]': isMobile }">
        <div
            class="left relative text-white z-[999]"
            :class="{
                'w-[76px] min-w-[76px]': lightMenu,
                'w-[317px] min-w-[317px]': !lightMenu,
                'light-menu': lightMenu,
                hidden: isMobile,
            }"
            v-if="!layout.state.hideLayout"
        >
            <div
                class="menu-wrapper bg-nav dark:bg-dark fixed flex flex-col overflow-y-auto overflow-x-hidden z-50"
                :class="{
                    'w-[76px] min-w-[76px]': lightMenu,
                    'w-[317px] min-w-[317px]': !lightMenu,
                }"
            >
                <div class="logo min-h-[29px] max-h-[29px]">
                    <AppRouterLink :to="'/' + app.settings.module" v-if="!lightMenu">
                        <slot name="logo">
                            <img v-if="settings.logo_path" :src="settings.logo_path" :alt="settings.appTitle" class="svg logo-img h-[29px]" />
                            <template v-else>
                                {{ settings.appTitle }}
                            </template>
                        </slot>
                    </AppRouterLink>
                </div>

                <div
                    class="minimize-trigger w-[30px] min-h-[30px] bg-dark dark:bg-nav flex items-center justify-center rounded-[5px] hover:cursor-pointer absolute top-[20px] right-[5px] z-50"
                    @click="
                        () => {
                            lightMenu = !lightMenu;
                            if (lightMenu) {
                                cookies.setCookie('menuOpened', 'false', 999);
                            } else {
                                cookies.setCookie('menuOpened', 'true', 999);
                            }
                        }
                    "
                >
                    <Icon icon="arrow" class="w-[13px]" :direction="lightMenu ? 'right' : 'left'" />
                </div>
                <div v-if="menu.favorites" class="minimize-trigger w-[30px] min-h-[30px] bg-dark dark:bg-nav flex items-center justify-center rounded-[5px] hover:cursor-pointer absolute top-[20px] right-[38px] z-50" @click="showMenuFavoritesModal = true">
                    <Icon icon="gear" class="w-[13px]" />
                </div>

                <MenuComponent :menu="menu" class="menu" :light="lightMenu" @update:light="(value) => (lightMenu = value)">
                    <template #afterItems>
                        <slot name="menuAfterItems" />
                    </template>
                    <template #beforeItems>
                        <slot name="menuBeforeItems" />
                    </template>
                </MenuComponent>
            </div>
        </div>
        <div class="right bg-white dark:bg-dark-bg flex flex-grow flex-col min-w-0" :class="{ 'w-full': isMobile }">
            <header class="bg-nav dark:bg-dark z-100 min-w-0 sticky top-0" v-if="!layout.state.hideLayout && !isMobile">
                <div class="bg-light-gray dark:bg-[#0F1826] flex h-[50px] min-w-0 gap-20">
                    <div class="tabs-wrapper flex grow items-end min-w-0">
                        <div class="flex h-[40px] pl-[4px] overflow-x-auto overflow-y-hidden" ref="scrollTabContainer">
                            <div class="h-full mx-3 flex items-center w-[20px]">
                                <Icon v-if="tabsStore.tabs.length > 1" icon="delete" class="w-[20px] cursor-pointer text-light hover:text-medium dark:text-medium dark:hover:text-light" @click="tabsStore.closeAllExceptActiveTab" />
                            </div>

                            <draggable :list="tabsStore.tabs" tag="div" item-key="instanceId" class="flex">
                                <template #item="{ element: tab, index }">
                                    <div
                                        @click.left.prevent="router.push(tab.route)"
                                        class="px-[18px] group rounded-t-lg border-b cursor-pointer"
                                        :class="{
                                            'bg-white text-primary border-primary dark:bg-dark-bg': tabsStore.activeTabId === tab.id,
                                            'hover:bg-white hover:text-primary border-white hover:border-primary dark:border-dark-bg dark:hover:bg-dark-bg': tabsStore.activeTabId !== tab.id,
                                        }"
                                        @mousedown="
                                            (event) => {
                                                if (event.button === 1) {
                                                    event.preventDefault();
                                                    tabsStore.closeTab(tab.id);
                                                }
                                            }
                                        "
                                        :key="index"
                                    >
                                        <div class="flex items-center h-[100%]">
                                            <div class="mr-[6px] w-[18px]">
                                                <Icon
                                                    v-if="tab.icon"
                                                    :icon="tab.icon"
                                                    class="max-w-[18px] max-h-[18px] h-full w-full text-icon-dark-gray duotone"
                                                    :class="{
                                                        'icon-secondary-primary': tabsStore.activeTabId === tab.id,
                                                        'icon-secondary-icon-dark-gray group-hover:icon-secondary-primary group-hover:opacity-70 dark:group-hover:opacity-80 text-icon-dark-gray!': tabsStore.activeTabId !== tab.id,
                                                    }"
                                                />
                                            </div>
                                            <div class="font-semibold pt-1 text-[0.923rem]">
                                                <div class="whitespace-nowrap">
                                                    {{ tab.title }}
                                                </div>
                                                <div class="text-[9px]/2 text-light opacity-80 pl-[2px] whitespace-nowrap">
                                                    {{ tab.description }}
                                                </div>
                                            </div>
                                            <div class="ml-[8px] w-[11px]">
                                                <Icon v-if="tabsStore.tabs.length > 1" icon="close" class="max-w-[11px] max-h-[11px] h-full w-full text-light hover:text-medium" @click.left.prevent.stop="tabsStore.closeTab(tab.id)" />
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </draggable>
                        </div>
                    </div>
                    <div class="header-right flex items-center pr-[22px]">
                        <slot name="headRight" />

                        <div class="line w-[1px] h-[16px] bg-icon-light-gray mx-[12px]" v-if="$slots.headRight"></div>

                        <Icon icon="bell" class="min-w-[16px] w-[16px] text-icon-light-gray cursor-pointer hover:text-dark dark:hover:text-outline" @click="alerts.showHistoryBar()" />

                        <div class="line w-[1px] h-[16px] bg-icon-light-gray mx-[12px]"></div>

                        <button class="theme-toggle text-icon-light-gray hover:text-dark! dark:hover:text-outline!" id="theme-toggle" title="Toggles light & dark" aria-label="auto" aria-live="polite" @click="themeToggle">
                            <svg class="sun-and-moon text-icon-light-gray hover:text-dark! dark:hover:text-outline!" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
                                <mask class="moon" id="moon-mask">
                                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                    <circle cx="24" cy="10" r="6" fill="black" />
                                </mask>
                                <circle class="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
                                <g class="sun-beams" stroke="currentColor">
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </g>
                            </svg>
                        </button>

                        <div class="line w-[1px] h-[16px] bg-icon-light-gray mx-[12px]"></div>

                        <Icon icon="help" id="help" title="Open helpbar" v-if="app.settings?.jolandaConfig?.helpbar?.vueHelpbar ?? false"
                              class="min-w-[18px] w-[18px] text-icon-light-gray cursor-pointer
                               hover:text-dark dark:hover:text-outline!" @click="helpbar.toggleOpen()"/>

                        <div class="line w-[1px] h-[16px] bg-icon-light-gray mx-[12px]" v-if="app.settings?.jolandaConfig?.helpbar?.vueHelpbar ?? false"></div>

                        <div class="user-img">
                            <Popover :popper="{ placement: 'bottom-start', middleware: { offset: 10 } }">
                                <div class="flex gap-x-[8px] cursor-pointer">
                                    <div class="user-img-wrapper w-[34px] h-[34px] border-1 border-white dark:border-icon-light-gray bg-icon-light-gray dark:bg-dark-bg overflow-hidden flex justify-center items-center text-light-gray">
                                        <slot name="userImg">
                                            <Icon icon="user" class="w-[50%]" />
                                        </slot>
                                    </div>
                                    <Icon icon="arrow" direction="bottom" class="w-[12px]" />
                                </div>

                                <template #panel>
                                    <slot name="userPanel">
                                        <div class="p-4">
                                            <div class="flex gap-x-[6px] opacity-50 text-[11px]"><Icon icon="user" class="w-3" /> {{ app.user.Name }}</div>
                                            <div class="pt-4">
                                                <a href="/login/logout" class="hover:text-primary">{{ translations.LOGOUT }}</a>
                                            </div>
                                        </div>
                                    </slot>
                                </template>
                            </Popover>
                        </div>
                    </div>
                </div>
            </header>
            <main class="p-[1.692rem] pb-[5rem] grow min-w-0" :class="{ 'pb-[80px]': isMobile, 'min-h-[calc(100vh-60px)]': isMobile }">
                <slot name="content">
                    <RouterView v-slot="{ Component }" v-if="!layout.state.loading && hasDefaultView" name="default">
                        <template v-if="Component">
                            <Suspense>
                                <component :is="Component" v-show="!hasEditorView"></component>

                                <template #fallback>
                                    <Loader />
                                </template>
                            </Suspense>
                        </template>
                    </RouterView>
                </slot>
            </main>

            <!-- Mobilní spodní navigační bar -->
            <div v-if="!layout.state.hideLayout && isMobile" class="mobile-bottom-bar fixed bottom-0 left-0 right-0 bg-white dark:bg-dark border-t border-outline dark:border-medium z-[999]">
                <div class="flex items-center h-[60px] p-2 gap-2">
                    <!-- Menu tlačítko -->
                    <button @click="toggleMobileMenu" class="flex flex-1 flex-col items-center justify-center w-12 h-full rounded-lg hover:bg-light dark:hover:bg-medium transition-colors p-2 cursor-pointer" :class="{ 'bg-primary text-white': isMobileMenuOpen }">
                        <Icon icon="menu" class="w-6 h-6" :class="{ 'text-white duotone icon-secondary-primary': isMobileMenuOpen }" />
                        <span class="text-xs mt-1">{{ translations.MENU }}</span>
                    </button>

                    <!-- Taby tlačítko -->
                    <Popover v-model:open="isTabsPopoverOpen" :popper="{ placement: 'top', middleware: { offset: 10 } }" class="flex-1">
                        <button class="flex flex-1 flex-col items-center justify-center w-12 h-full rounded-lg hover:bg-light dark:hover:bg-medium transition-colors p-2 cursor-pointer" :class="{ 'bg-primary text-white': isTabsPopoverOpen }">
                            <div class="relative">
                                <Icon icon="blocks" class="w-6 h-6" :class="{ 'text-white duotone icon-secondary-primary': isTabsPopoverOpen }" />
                                <div class="text-[9px] rounded-[50%] bg-primary text-white w-[16px] h-[16px] flex items-center justify-center absolute bottom-[-5px] right-[-6px]" :class="{ 'bg-white text-primary!': isTabsPopoverOpen }">
                                    {{ tabsStore.tabs.length }}
                                </div>
                            </div>

                            <span class="text-xs mt-1">{{ translations.TABS }}</span>
                        </button>

                        <template #panel>
                            <div class="p-4 min-w-[300px] max-h-[400px] overflow-y-auto">
                                <div class="flex items-center justify-between mb-3">
                                    <h3 class="font-semibold text-lg">{{ translations.OPENED_TABS }}</h3>
                                    <button v-if="tabsStore.tabs.length > 1" @click="tabsStore.closeAllExceptActiveTab" class="text-sm text-red-500 hover:text-red-700">
                                        <div class="h-full mx-3 flex items-center w-[20px]">
                                            <Icon v-if="tabsStore.tabs.length > 1" icon="delete" class="w-[20px] cursor-pointer text-light hover:text-medium dark:text-medium dark:hover:text-light" @click="tabsStore.closeAllExceptActiveTab" />
                                        </div>
                                    </button>
                                </div>

                                <div class="space-y-2">
                                    <div
                                        v-for="tab in tabsStore.tabs"
                                        :key="tab.id"
                                        @click="
                                            router.push(tab.route);
                                            isTabsPopoverOpen = false;
                                        "
                                        class="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-light dark:hover:bg-medium transition-colors"
                                        :class="{ 'bg-primary text-white': tabsStore.activeTabId === tab.id }"
                                    >
                                        <div class="flex items-center flex-1 min-w-0">
                                            <Icon v-if="tab.icon" :icon="tab.icon" class="w-4 h-4 mr-2 flex-shrink-0" />
                                            <div class="flex-1 min-w-0">
                                                <div class="font-medium truncate">{{ tab.title }}</div>
                                                <div class="text-sm opacity-70 truncate">{{ tab.description }}</div>
                                            </div>
                                        </div>
                                        <button v-if="tabsStore.tabs.length > 1" @click.stop="tabsStore.closeTab(tab.id)" class="ml-2 p-1 hover:bg-red-500 hover:text-white rounded cursor-pointer">
                                            <Icon icon="close" class="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Popover>

                    <!-- Uživatelský účet -->
                    <Popover :popper="{ placement: 'top', middleware: { offset: 10 } }" class="flex-1">
                        <button class="flex flex-1 flex-col items-center justify-center w-12 h-full rounded-lg hover:bg-light dark:hover:bg-medium transition-colors p-2 cursor-pointer">
                            <!--                            <div class="w-[20px] h-[20px] rounded-full bg-icon-light-gray dark:bg-dark-bg flex items-center justify-center">-->
                            <!--                                <Icon icon="user" class="w-4 h-4" :class="{ 'text-white duotone icon-secondary-primary!': isTabsPopoverOpen }" />-->
                            <!--                            </div>-->
                            <div class="user-img-wrapper w-[22px] h-[22px] rounded-full bg-icon-light-gray dark:bg-dark-bg overflow-hidden flex justify-center items-center text-light-gray">
                                <slot name="userImg">
                                    <Icon icon="user" class="w-[70%]" />
                                </slot>
                            </div>
                            <span class="text-xs mt-1">{{ translations.ACCOUNT }}</span>
                        </button>

                        <template #panel>
                            <slot name="userPanel">
                                <div class="p-4 min-w-[200px]">
                                    <div class="flex items-center gap-2 mb-3">
                                        <Icon icon="user" class="w-4 h-4" />
                                        <span class="text-xs opacity-70">{{ app.user.Name }}</span>
                                    </div>
                                    <div class="border-t border-outline dark:border-medium pt-3">
                                        <a href="/login/logout" class="block text-sm hover:text-primary">{{ translations.LOGOUT }}</a>
                                    </div>
                                </div>
                            </slot>
                        </template>
                    </Popover>
                </div>
            </div>

            <!-- Fullscreen Menu Overlay -->
            <div v-if="isMobileMenuOpen" class="mobile-menu-overlay fixed inset-0 bg-nav dark:bg-dark z-[999] flex flex-col text-white">
                <!-- Header s logem a zavíracím tlačítkem -->
                <div class="flex items-center justify-between p-4 border-b border-light/20">
                    <div class="logo">
                        <AppRouterLink :to="'/' + app.settings.module" @click="closeMobileMenu">
                            <slot name="mobile-logo">
                                <img v-if="settings.logo_path" :src="settings.logo_path" :alt="settings.appTitle" class="h-8" />
                                <template v-else>
                                    <span class="text-xl font-bold text-white">{{ settings.appTitle }}</span>
                                </template>
                            </slot>
                        </AppRouterLink>
                    </div>
                    <div class="flex gap-4 items-center">
                        <div class="flex gap-2 items-center mr-2">
                            <slot name="headRight" />
                        </div>

                        <button class="theme-toggle text-icon-light-gray hover:text-dark! dark:hover:text-outline!" id="theme-toggle" title="Toggles light & dark" aria-label="auto" aria-live="polite" @click="themeToggle">
                            <svg class="sun-and-moon text-icon-light-gray hover:text-dark! dark:hover:text-outline!" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
                                <mask class="moon" id="moon-mask">
                                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                    <circle cx="24" cy="10" r="6" fill="black" />
                                </mask>
                                <circle class="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
                                <g class="sun-beams" stroke="currentColor">
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </g>
                            </svg>
                        </button>
                        <div v-if="menu.favorites" class="minimize-trigger w-[30px] min-h-[30px] bg-dark dark:bg-nav flex items-center justify-center rounded-[5px] hover:cursor-pointer z-50" @click="showMenuFavoritesModal = true">
                            <Icon icon="gear" class="w-[14px]" />
                        </div>
                        <button @click="closeMobileMenu" class="p-2 hover:bg-dark dark:hover:bg-nav rounded-lg text-white cursor-pointer">
                            <Icon icon="close" class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <!-- Menu obsah -->
                <div class="flex-1 overflow-y-auto p-4">
                    <MenuComponent :menu="menu" class="menu" :light="false" @update:light="() => {}" @routerClick="closeMobileMenu">
                        <template #afterItems>
                            <slot name="menuAfterItems" />
                        </template>
                        <template #beforeItems>
                            <slot name="menuBeforeItems" />
                        </template>
                    </MenuComponent>
                </div>
            </div>
        </div>

        <!-- Jednotný RouterView pro oba layouty -->
        <div v-if="layout.state.hideLayout" class="fullscreen-content">
            <slot name="content">
                <RouterView v-slot="{ Component }" v-if="!layout.state.loading && hasDefaultView" name="default">
                    <template v-if="Component">
                        <Suspense>
                            <component :is="Component" v-show="!hasEditorView"></component>

                            <template #fallback>
                                <Loader />
                            </template>
                        </Suspense>
                    </template>
                </RouterView>
            </slot>
        </div>

        <AlertManager class="alert-manager"></AlertManager>
        <Helpbar v-if="app.settings?.jolandaConfig?.helpbar?.vueHelpbar ?? false" />
        <EntityLog />
        <FavoritesModal v-if="showMenuFavoritesModal" @close="showMenuFavoritesModal = false" :menu="menu" />

        <Modal :is-visible="true" v-if="layout.newVersionModal.show" @close="layout.newVersionModal.show = false" size="extraSmall">
            <template #header></template>
            <template #body>
                <div>
                    <div class="justify-center items-center flex gap-4">
                        <Icon icon="Cogs" class="w-[30px] duotone icon-secondary-primary" />
                        <div class="text-lg">{{ translations.NEW_VERSION }}</div>
                    </div>

                    <div class="flex justify-center mt-6 gap-2">
                        <Button variant="primary" @click="reload">{{ translations.LOAD }}</Button>
                        <Button variant="default" @click="layout.newVersionModal.show = false">{{ translations.CLOSE }}</Button>
                    </div>
                </div>
            </template>
        </Modal>
        <div class="fixed bottom-4 left-[50%] transform -translate-x-1/2 new-version-alert bg-white dark:bg-dark dark:border dark:border-light/20 p-3" v-if="layout.newVersionAlert.show">
            <div>
                <div class="justify-center items-center flex gap-2">
                    <Icon icon="Cogs" class="w-[20px] duotone icon-secondary-primary" />
                    <div>{{ translations.NEW_VERSION }}</div>
                </div>

                <div class="flex justify-center mt-2 gap-2">
                    <Button variant="primary" @click="reload" size="small">{{ translations.LOAD }}</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.layout {
    display: flex;

    .desktop-layout {
        width: 100%;
    }

    .mobile-layout {
        width: 100%;
    }

    .left {
        transition:
            width 0.2s ease,
            min-width 0.2s ease;

        .menu-wrapper {
            padding: 21px 14px 16px 16px;
            height: 100dvh;

            .menu {
                margin-top: 15px;
            }

            transition:
                width 0.2s ease,
                min-width 0.2s ease;
        }

        &.light-menu {
            .menu-wrapper {
                padding: 21px 13px 16px 13px;
            }
        }
    }

    .right {
    }

    header {
        .header-right {
            .user-img-wrapper {
                border-radius: 50%;
            }
        }
    }

    .new-version-alert {
        box-shadow: 0px 0px 22px 0px rgba(14, 11, 48, 0.9);
        border-radius: 10px;
    }

    .mobile-bottom-bar {
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 9999 !important;
    }

    .mobile-menu-overlay {
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(0);
        }
    }
}
</style>
