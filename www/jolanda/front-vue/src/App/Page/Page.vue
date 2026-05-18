<script setup>
import { onMounted, watch, nextTick, computed, onErrorCaptured, ref } from "vue";
import { useRouter } from "vue-router";
import Loader from "@/Components/Other/Loading/Loader.vue";
import { usePageComponent } from "@/App/composables/usePageComponent";
import { useErrorHandlerStore } from "@/App/stores/errorHandlerStore";
import { useAjax } from "@/Composables/useAjax.js";
import Breadcrumb from "@/App/Layout/Breadcrumb/Breadcrumb.vue";
import { useTitle } from "@vueuse/core";
import { useAppStore } from "@/App/stores/appStore";
import { useTab } from "@/App/composables/useTab";
import { useTabsStore } from "@/App/stores/tabsStore";
import { usePageInstance } from "@/App/composables/internal/usePageInstance";
import { createDynamicPageWrapper } from "@/App/Page/createDynamicPageWrapper";

const props = defineProps({
    pageComponentPath: {
        type: String,
        required: true,
    },
});

const { app } = useAppStore(window.pinia);
const router = useRouter();
const tabsStore = useTabsStore(window.pinia);

const isDevelopment = import.meta.env.DEV;

const { tab } = useTab({
    tabId: computed(() => tabsStore.activeTabId),
});

const { pageData, setPageData, setPageError, resetPageData, setLoading, title } = usePageInstance({
    tab: tab,
});
const { pageComponent, error, isRendered, loadComponent, reset: resetComponent } = usePageComponent();

useTitle(
    computed(() => {
        return title.value;
    }),
    { titleTemplate: "%s | " + app.settings.appTitle },
);

const loadPage = async () => {
    resetComponent();
    tabWrapper.value = null;
    //resetPageData();
    setLoading(true);

    if (!pageData.value.fetched) {
        try {
            const ajax = useAjax();
            // const { data } = await ajax.get(router.currentRoute.value.href, {
            const { data } = await ajax.get(tab.value.route.href, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setPageData(data);
        } catch (error) {
            setPageError(error.status);
            isRendered.value = true;
            setLoading(false);
            return;
        }
    }

    try {
        // await loadComponent(props.pageComponentPath, router.currentRoute.value.name);
        await loadComponent(props.pageComponentPath, tab.value.route.name);
        await nextTick();
    } catch (err) {
        throw err;
    } finally {
        tabWrapper.value = getWrapperForTab(tab.value);
        isRendered.value = true;
        setLoading(false);
    }
};

onMounted(loadPage);

// watch(() => props.pageComponentPath, async () => {
//     await loadPage();
// });

if (!isDevelopment) {
    onErrorCaptured(async (err, vm) => {
        const errorHandlerStore = useErrorHandlerStore(window.pinia);
        const errorHandler = errorHandlerStore.getErrorHandler();
        if(errorHandler)
            errorHandler.handleError(err, vm);

        pageComponent.value = null;
        error.value = err;
        return false;
    });
}

watch(
    () => tab.value.instanceId,
    async (newValue, oldValue) => {
        await loadPage();
    },
);

watch(
    () => tabsStore.tabs.length,
    () => {
        wrapperCache.entries().forEach(([key, value]) => {
            const tab = tabsStore.tabs.find((tab) => tab.instanceId === key);

            if (!tab) {
                wrapperCache.delete(key);
            }
        });
    },
);

const cachedKeys = computed(() => {
    return tabsStore.tabs.map((t) => "PageWrapper_" + t.instanceId);
});

const wrapperCache = new Map();

function getWrapperForTab(tab) {
    if (!tab?.instanceId) return null;

    if (!wrapperCache.has(tab.instanceId)) {
        const wrapper = createDynamicPageWrapper({
            pageComponent: pageComponent.value,
            tabInstanceId: tab.instanceId,
        });
        wrapperCache.set(tab.instanceId, wrapper);
        return wrapper;
    }

    return wrapperCache.get(tab.instanceId);
}

const tabWrapper = ref(null);
</script>

<template>
    <div class="page-container h-full" id="jolanda-page-wrapper">
        <Breadcrumb class="mb-[20px]" />

        <!--        <keep-alive :include="cachedPages">-->
        <!--            <component-->
        <!--                v-if="pageComponent && !error && pageData.fetched && pageData.status === 200"-->
        <!--                :is="pageComponent"-->
        <!--                :key="props.pageComponentPath"-->
        <!--            />-->
        <!--        </keep-alive>-->

        <!--        <keep-alive :include="cachedComponentNames">-->
        <!--        <keep-alive>-->
        <!--            <PageWrapper-->
        <!--              v-if="pageComponent && !error && pageData.fetched && pageData.status === 200"-->
        <!--              :pageComponent="pageComponent"-->
        <!--              :key="normalizeFullPathWithQuery(router.currentRoute.value)"-->
        <!--            />-->
        <!--        </keep-alive>-->
        <!--        <keep-alive>-->
        <!--            <PageWrapper-->
        <!--              v-if="pageComponent && !error && pageData.fetched && pageData.status === 200"-->
        <!--              :pageComponent="pageComponent"-->
        <!--              :key="tab.instanceId"-->
        <!--            />-->
        <!--        </keep-alive>-->

        <keep-alive :include="cachedKeys">
            <component v-if="tabWrapper && pageComponent && !error && pageData.fetched && pageData.status === 200" :is="tabWrapper" :key="tab.instanceId" />
        </keep-alive>

        <div v-if="!isRendered && !error" class="loading">
            <Loader class="loading-spinner" />
        </div>

        <div v-if="pageData.fetched && pageData.status !== 200" class="error-container">
            <div class="error-message">
                :-(
                <span v-if="pageData.status === 403">Forbidden</span>
                <span v-else-if="pageData.status === 500">Server error</span>
                <span v-else-if="pageData.status === 401">Unauthorized</span>
                <span v-else>Error status: {{ pageData.status }}</span>
            </div>
        </div>

        <div v-else-if="error" class="error-container">
            <div class="error-message">
                :-( Cannot load component
                <pre v-if="isDevelopment">{{ error.stack }}</pre>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-container {
    position: relative;
}

.loading {
    height: 100%;
    width: 100%;
    min-height: 100vh;
}

.loading-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.error-container {
    padding: 2rem;
    text-align: center;
}

.error-message {
    color: #dc3545;
}
</style>
