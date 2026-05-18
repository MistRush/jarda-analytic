<script>
export const editorProps = {
    state: {
        type: Object,
        default: undefined,
    },
    schema: [Object, Function],
    manager: [String, Object],
    dataListUrl: String,
    dataUpdateUrl: String,
    dataCreateUrl: String,
    id: {
        type: [String, Number],
        default: undefined,
    },
    idFromRoute: {
        type: Boolean,
        default: true,
    },
    backURL: [String, Object],
    rightBar: {
        type: Boolean,
        default: true,
    },
    grid: {
        type: Object,
        default: null,
    },
    defaultData: {
        type: Object,
        default: {},
    },
    fetchData: Boolean,
    fetchDataURL: String,
    fetchPreviewData: Boolean,
    fetchPreviewDataURL: String,
    showPreviewOnCreate: {
        type: Boolean,
        default: false,
    },
    dashboard: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        default: "Editor",
    },
    labelField: {
        type: String,
        default: "ID",
    },
    horizontalTabs: {
        type: Boolean,
        default: false,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    validateOn: {
        type: Array,
        default: () => ["blur", "input", "change", "submit"],
    },
    saveAndCloseOnly: {
        type: Boolean,
        default: false,
    }
};
</script>

<script setup>
import Form from "@/Components/Form/Components/Form.vue";
import { computed, onMounted, reactive, ref, provide, watch, inject, h, useId, useSlots, nextTick, getCurrentInstance } from "vue";
import { useAjax } from "@/Composables/useAjax.js";
import Button from "@/Components/Inputs/Button.vue";
import { useTranslations } from "@/Composables/useTranslation.js";
import { useRouter } from "vue-router";
import { useInternalStore } from "@/App/stores/internalStore";
import { useManager } from "@/Composables/useManager";
import Loader from "@/Components/Other/Loading/Loader.vue";
import EditorButtons from "@/Components/Editor/EditorButtons.vue";
import GridStackComponent from "@/Components/Other/GridStack/GridStack.vue";
import { Splitpanes, Pane } from "splitpanes";
import { useHelper } from "@/Composables/useHelper";
import { useResponsiveBreakpoint } from "@/Composables/useResponsiveBreakpoint";
import { useTab } from "@/App/composables/useTab";
import { useTabsStore } from "@/App/stores/tabsStore";
import { usePage } from "@/App/composables/usePage";
import { useApp } from "@/App/composables/useApp.js";
import Popover from "@/Components/Popover/Popover.vue";

const props = defineProps(editorProps);
const emit = defineEmits(["beforeCreate", "beforeUpdate", "save", "error", "back", "beforeLoadData", "afterLoadData", "afterLoadParams", "ready"]);
const { translations } = useTranslations();
const router = useRouter();
const dataGridState = inject("dataGridState", null);
const modal = inject("modal", null);
const helper = useHelper();
const { is } = useResponsiveBreakpoint();
const { tab } = useTab();
const tabsStore = useTabsStore();
const { title, setTitle } = usePage();
const { layout } = useApp();

if (tab && !modal && !title.value) {
    setTitle(props.name);
}

const instance = getCurrentInstance();
const manager = useManager(props.manager);

const formId = useId();
const slots = useSlots();
const formRef = ref(null);

// Stav načítání a inicializace
const editorState = reactive({
    // Hlavní data editoru
    data: null,

    // Stav načítání
    loading: {
        mainData: false, // Načítání hlavních dat
        editorParams: false, // Načítání dodatečných dat pomocí fetchData
        previewData: false,
        error: false, // Indikace chyby při načítání
    },

    saving: false,

    // Inicializováno
    initialized: {
        mainData: false, // Hlavní data jsou inicializována
        editorParams: false, // Dodatečná data jsou inicializována
        previewData: false,
    },
    files: [],
});

const defaultData = computed(() => {
    if (dataGridState && dataGridState.parent && typeof dataGridState.parent.ref !== "undefined") {
        return {
            ...(props.defaultData ?? {}),
            // [dataGridState.parent.child]: dataGridState.parent.ref.grid?.getCurrentItem()[dataGridState.parent.parent] ?? null,
            [dataGridState.parent.child]:
                (dataGridState.parent.ref?.getCurrentItem()?.constructor === Array
                    ? dataGridState.parent.ref?.getCurrentItem()[0][dataGridState.parent.parent] // multi-parent
                    : dataGridState.parent.ref?.getCurrentItem()[dataGridState.parent.parent]) ?? // single-parent
                null,
        };
    }

    if (tab && tab.value && tab.value.sourceTabInstanceId && tab.value.fromGridId && tab.value.gridParentCol && tab.value.gridParentId) {
        return {
            ...(props.defaultData ?? {}),
            [tab.value.gridParentCol]: tab.value.gridParentId,
        };
    };

    return props.defaultData;
});

const localId = ref(null);
const id = computed({
    get() {
        if (localId.value !== null) {
            return localId.value;
        }

        if (typeof props.id !== "undefined") {
            return props.id;
        } else if (tab) {
            return tab.value?.route?.query?.entity_ID;
        } else if (dataGridState) {
            // return dataGridState.grid.getCurrentItem()?.ID ?? null;
        } else if (props.idFromRoute) {
            return router?.currentRoute?.value?.query?.entity_ID ?? null;
        }

        return null;
    },
    set(val) {
        localId.value = val;
    },
});

// Pomocná computed property, která určuje, zda jsou všechna potřebná data načtena
const isReady = computed(() => {
    // Pokud je editor v režimu načítání, není připraven
    if (editorState.loading.mainData || (props.fetchData && editorState.loading.editorParams)) {
        return false;
    }

    // Pokud nastala chyba při načítání, editor není připraven
    if (editorState.loading.error) {
        return false;
    }

    // Kontrola, zda jsou všechna potřebná data inicializována
    const mainDataReady = editorState.initialized.mainData;
    const editorParamsReady = !props.fetchData || editorState.initialized.editorParams;
    const previewDataReady = !props.fetchPreviewData || editorState.initialized.previewData;

    if(mainDataReady && editorParamsReady && previewDataReady)
        emit("ready");

    return mainDataReady && editorParamsReady && previewDataReady;
});

// Funkce pro inicializaci nového záznamu
const initData = async () => {
    if (!props.manager) {
        editorState.data = { ...(props.state ?? {}) };
        editorState.initialized.mainData = true;

        return;
    }

    try {
        editorState.loading.mainData = true;
        if (!id.value) {
            const data = await manager.createPlainRecord();
            editorState.data = {
                ...(defaultData.value ?? {}),
                ...(data ?? {}),
            };
        } else {
            await loadData();
        }
        editorState.initialized.mainData = true;
    } catch (error) {
        editorState.loading.error = true;
        console.error("Chyba při inicializaci dat:", error);
    } finally {
        editorState.loading.mainData = false;
    }
};

// Funkce pro načtení existujícího záznamu
const loadData = async () => {
    if (!id.value) {
        // Pro nový záznam nepotřebujeme načítat data
        editorState.initialized.mainData = true;
        return;
    }

    if (!props.manager) {
        editorState.initialized.mainData = true;
        return;
    }

    try {
        emit("beforeLoadData");
        editorState.loading.mainData = true;

        const result = await manager.getData({
            full: true,
            ID: id.value,
        });

        if (result.error) {
            editorState.loading.error = true;
        } else if (result.data.length === 1) {
            editorState.data = {
                ...(defaultData.value ?? {}),
                ...(result.data[0] ?? {}),
            };
            editorState.initialized.mainData = true;

            emit("afterLoadData", editorState.data, result.data[0]);

            if (tab && !modal) {
                // tab.description = 'ID [' + editorState.data.Code + ']';
                tab.value.description = editorState.data[props.labelField];
            }
        } else {
            editorState.loading.error = true;
            console.error("Neočekávaný formát dat");
        }
    } catch (error) {
        editorState.loading.error = true;
        console.error("Chyba při načítání dat:", error);
    } finally {
        editorState.loading.mainData = false;
    }
};

// Funkce pro načtení dodatečných dat přes fetchData
const fetchExtraData = async () => {
    console.log(props.fetchPreviewData, previewDataURL.value)
    if (!props.fetchData || !fetchDataURL.value)
        editorState.initialized.editorParams = true;

    if(!props.fetchPreviewData || !previewDataURL.value)
        editorState.initialized.previewData = true;

    if(editorState.initialized.editorParams && editorState.initialized.previewData)
        return;

    if(!editorState.initialized.editorParams) {
        try {
            editorState.loading.editorParams = true;
            const ajax = useAjax();

            const {data} = await ajax.get(fetchDataURL.value, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            editorState.editorParams = data?.items ?? null;
            editorState.initialized.editorParams = true;
            emit("afterLoadParams", editorState.editorParams);
        } catch (error) {
            editorState.loading.error = true;
            console.error("Chyba při načítání dodatečných dat:", error);
        } finally {
            editorState.loading.editorParams = false;
        }
    }

    if(!editorState.initialized.previewData) {

        try {
            editorState.loading.previewData = true;
            const ajax = useAjax();

            const { data } = await ajax.get(previewDataURL.value, {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    ID: id.value,
                },
            });

            editorState.previewData = data?.items ?? null;
            editorState.initialized.previewData = true;
        } catch (error) {
            editorState.loading.error = true;
            console.error("Chyba při načítání dat pro náhled:", error);
        } finally {
            editorState.loading.previewData = false;
        }
    }
};

const tabs = reactive([]); // Použití reaktivního pole pro dynamické sledování
const activeTab = ref(null);

// Funkce pro přidání a odebrání sekcí
const registerTab = (sectionId, sectionTitle, grid = null, tabInputsErrors, icon, iconPath) => {
    if (!tabs.some((s) => s.id === sectionId)) {
        tabs.push({ id: sectionId, title: sectionTitle, grid: grid, tabInputsErrors, icon, iconPath });
    }

    if (!activeTab.value) {
        activeTab.value = sectionId;
    }
};

const unregisterTab = (sectionId) => {
    const index = tabs.findIndex((s) => s.id === sectionId);
    if (index !== -1) {
        tabs.splice(index, 1); // Dynamicky odstraníme sekci
    }

    if (activeTab.value === sectionId) {
        if (tabs.length > 0) {
            activeTab.value = tabs[0].id;
        } else {
            activeTab.value = null;
        }
    }
};

const registerFileInput = (name, fieInput) => {
    if (editorState.files.hasOwnProperty(name)) return;

    editorState.files[name] = fieInput;
};

const unregisterFileInput = (name) => {
    delete editorState.files[name];
};

//GridStack
const sideGridStackRef = ref(null);

provide("registerTab", registerTab);
provide("unregisterTab", unregisterTab);
provide("activeTab", activeTab);
provide("registerFileInput", registerFileInput);
provide("unregisterFileInput", unregisterFileInput);
provide("editor", {
    dashboard: props.dashboard,
    sideGridStack: sideGridStackRef,
});

const URLs = computed(() => {
    const { getURLs } = useManager(props.manager);
    return getURLs();
});

const onSubmit = async (event) => {
    if (props.readonly) {
        console.error('Editor is readonly');
        return;
    }

    const action = event.submitter?.dataset?.action;
    let result;
    editorState.saving = true;

    if (editorState.files) {
        const fileUploadQueue = [];
        Object.values(editorState.files).forEach((file) => {
            fileUploadQueue.push(file.uploadFile());
        });

        await Promise.all(fileUploadQueue);
    }

    if (event.data.ID) {
        result = await update(event.data);
    } else {
        result = await create(event.data);
    }

    editorState.saving = false;
    if (result) {
        if (modal && dataGridState) {
            dataGridState.editor.shouldRefresh = true;
        }

        emit("save", event.data);

        //Pokud se do editoru přišlo z gridu, tak při návratu na tab s gridem refresh gridu
        if (tab && tab.value && tab.value.sourceTabInstanceId && tab.value.fromGridId) {
            const sourceTab = tabsStore.tabs.find((t) => t.instanceId === tab.value.sourceTabInstanceId);

            if (sourceTab) {
                if (!Array.isArray(sourceTab.gridRefreshQueue)) {
                    sourceTab.gridRefreshQueue = [];
                }

                if (!sourceTab.gridRefreshQueue.includes(tab.value.fromGridId)) {
                    sourceTab.gridRefreshQueue.push(tab.value.fromGridId);
                }
            }
        }

        if (action === "saveAndClose") {
            onBack(true, true);
        } else {
            const internalStore = useInternalStore(window.pinia);
            const activeGrid = internalStore.getActiveGrid();
            if (activeGrid) {
                internalStore.refreshActiveGrid = true;
            }

            //Při uložení se otevře stejný tab jak před uložením. Bohužel zatím se to musí vyhledat podle názvu tabu, takže to nemujsí být přesné a nemusí to fungovat vždy
            const activeTabTitle = tabs.find((tab) => tab.id === activeTab.value)?.title;

            await loadData();
            await nextTick();

            const tabsWithActiveTitle = tabs.filter((tab) => tab.title === activeTabTitle);

            if (tabsWithActiveTitle && tabsWithActiveTitle.length === 1) {
                activeTab.value = tabsWithActiveTitle[0].id;
            }
        }
    }
};

const create = async (data) => {
    let modifiedData = { ...data };
    let cancelAction = false;

    const onBeforeCreate = instance.vnode.props?.onBeforeCreate;
    if (onBeforeCreate) {
        const handlers = Array.isArray(onBeforeCreate) ? onBeforeCreate : [onBeforeCreate];
        for (const handler of handlers) {
            await handler(data, (newData) => {
                modifiedData = newData;
            }, (shouldCancel = false) => {
                cancelAction = shouldCancel;
            });
        }
    } else {
        emit("beforeCreate", data, (newData) => {
            modifiedData = newData;
        }, (shouldCancel = false) => {
            cancelAction = shouldCancel;
        });
    }


    if(cancelAction)
        return false;

    if (props.manager) {
        const url = URLs.value.create;

        if (!url) {
            console.error("Create URL is not set. Can not create entity in editor");
            return false;
        }

        const result = await sendData(url, modifiedData, "create");

        if (result) {
            if (result.ID) {
                id.value = result.ID;
            }
        }

        return result;
    } else {
        if (dataGridState) {
            const maxId = Math.max(...dataGridState.grid.getData().map((item) => Number(item.ID)), 0) ?? 0;
            const newId = maxId + 1;

            data.ID = newId;
            modifiedData.ID = newId;

            dataGridState.grid._data.push({ ID: newId, ...modifiedData });
            id.value = newId;
        }

        return true;
    }
};

const update = async (data) => {
    let modifiedData = { ...data };
    let cancelAction = false;

    const onBeforeUpdate = instance.vnode.props?.onBeforeUpdate;
    if (onBeforeUpdate) {
        const handlers = Array.isArray(onBeforeUpdate) ? onBeforeUpdate : [onBeforeUpdate];
        for (const handler of handlers) {
            await handler(data, (newData) => {
                modifiedData = newData;
            }, (shouldCancel = false) => {
                cancelAction = shouldCancel;
            });
        }
    } else {
        emit("beforeUpdate", data, (newData) => {
            modifiedData = newData;
        }, (shouldCancel = false) => {
            cancelAction = shouldCancel;
        });
    }

    if(cancelAction)
        return false;

    if (props.manager) {
        const url = URLs.value.update;

        if (!url) {
            console.error("Update URL is not set. Can not update entity in editor");
            return false;
        }

        return await sendData(url, modifiedData, "update");
    } else {
        if (dataGridState) {
            const row = dataGridState.grid.getData().find((row) => row.ID == id.value);
            Object.keys(modifiedData).forEach((key) => {
                row[key] = modifiedData[key];
            });
        }

        return true;
    }
};

const sendData = async (url, data, type) => {
    const ajax = useAjax();
    let result = false;

    const clearedData = manager.applySchemaToRecord(data, true);

    const mapBooleansToString = (obj) => {
        if (obj instanceof FormData) {
            return obj; // přeskočit FormData beze změny
        }

        if (Array.isArray(obj)) {
            return obj.map(mapBooleansToString);
        } else if (typeof obj === "object" && obj !== null) {
            const mapped = {};
            for (const [key, value] of Object.entries(obj)) {
                if (value === true) {
                    mapped[key] = "1";
                } else if (value === false) {
                    mapped[key] = "0";
                } else {
                    mapped[key] = mapBooleansToString(value);
                }
            }
            return mapped;
        } else {
            return obj;
        }
    };

    let modifiedData = clearedData;
    if (modifiedData) {
        modifiedData = mapBooleansToString(modifiedData);
    }

    try {
        await ajax
            .postForm(
                url,
                {
                    data: JSON.stringify(modifiedData),
                },
                null,
                {
                    waitingAlert: {
                        title: translations.SAVING,
                    },
                },
            )
            .then(({ data, alert }) => {
                alert.changeToSuccess(translations.DATA_SAVED);
                if (data?.items && Array.isArray(data.items)) {
                    result = data.items[0];

                    if (!result && type !== "create") {
                        result = true;
                    } else if (!result) {
                        console.error("No items return from data-create");
                    }
                } else {
                    if (type === "create") {
                        console.error("No items return from data-create");
                    }
                }
            });
    } catch ({ error, alert }) {
        alert.changeToError(translations.SAVING_ERROR);
    }

    return result;
};

const onError = async (event) => {
    console.error("Chyba při validaci formuláře:", event);
    emit("error", event.errors, editorState.data);
};

const onBack = (saved = true, closeTab = false) => {
    if (props.backURL && !modal) {
        if(typeof props.backURL === 'string')
            router.push({ name: props.backURL });
        else router.push(props.backURL);

        if (saved) {
            const internalStore = useInternalStore(window.pinia);
            const activeGrid = internalStore.getActiveGrid();
            if (activeGrid) {
                internalStore.refreshActiveGrid = true;
            }
        }

        if (closeTab) {
            setTimeout(() => tabsStore.closeTab(tab.value.id), 50);
        }

        emit("back");
        return;
    }

    if (dataGridState) {
        dataGridState.editor.show = false;
        dataGridState.editor.id = null;
        dataGridState.grid.refresh();
    } else if (props.grid) {
        if (props.grid.editor) {
            props.grid.editor.close();
        }
    } else {
        const internalStore = useInternalStore(window.pinia);
        const activeGrid = internalStore.getActiveGrid();
        if (activeGrid && activeGrid.editor) {
            activeGrid.editor.close();
        }
    }

    if (closeTab && !modal) {
        setTimeout(() => tabsStore.closeTab(tab.value.id), 50);
    }

    emit("back");
};

// URL pro fetchData
const fetchDataURL = computed(() => {
    if (typeof props.fetchDataURL !== "undefined") {
        return props.fetchDataURL;
    }

    return URLs.value?.editor;
});

const previewDataURL = computed(() => {
    if (typeof props.fetchPreviewDataURL !== "undefined") {
        return props.fetchPreviewDataURL;
    }

    return URLs.value?.preview;
});

const setActiveTab = (tab) => {
    activeTab.value = tab;

    setTimeout(() => {
        // const tabElement = document.querySelector(`#${tab}`);
        // if (tabElement) {
        //     tabElement.scrollIntoView({ behavior: 'smooth' });
        // }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
};

//splitpanes
const hasPreview = ref(false);
const centreBarWidth = ref(80);
const rightBarWidth = ref(20);
const previewWidth = ref(0);

onMounted(async () => {
    if (modal) {
        if (!props.readonly) {
            modal.setFooter({
                render: () => {
                    return h(EditorButtons, {
                        formId: formId,
                        disabled: editorState.saving,
                    });
                },
            });
        }

        modal.setHeader({
            render: () => {
                if (id.value && slots.titleUpdate) {
                    return slots.titleUpdate({
                        id: id.value,
                        data: editorState.data,
                    });
                } else if (slots.titleCreate) {
                    return slots.titleCreate();
                } else {
                    return "Editor";
                }
            },
        });
    }

    if(slots.preview) {
        hasPreview.value = true;

        centreBarWidth.value = 60;
        rightBarWidth.value = 20;
        previewWidth.value = 20;
    }

    // Inicializace dat
    await Promise.all([initData(), fetchExtraData()]);
});

// Sledování změny ID pro opětovné načtení dat
watch(
    () => id.value,
    async () => {
        if (props.manager) {
            await initData();
        }
    },
);

watch(
    is,
    (breakpoint) => {
        if (breakpoint === "xl") {
            // > 2500
            if(hasPreview.value) {
                centreBarWidth.value = 60;
                rightBarWidth.value = 20;
                previewWidth.value = 20;
            } else {
                centreBarWidth.value = 70;
                rightBarWidth.value = 30;
            }
        } else if (breakpoint === "lg") {
            // mezi 1900 a 2500
            if(hasPreview.value) {
                centreBarWidth.value = 70;
                rightBarWidth.value = 15;
                previewWidth.value = 15;
            } else {
                centreBarWidth.value = 86;
                rightBarWidth.value = 14;
            }
        } else {
            // < 1900
            if(hasPreview.value) {
                centreBarWidth.value = 80;
                rightBarWidth.value = 5;
                previewWidth.value = 15;
            } else {
                centreBarWidth.value = 95;
                rightBarWidth.value = 5;
            }
        }
    },
    { immediate: true },
);

const showRightBar = computed(() => {
    if (modal) {
        if (typeof props.rightBar === "undefined") {
            return false;
        } else {
            return props.rightBar;
        }
    } else {
        if (typeof props.rightBar === "undefined") {
            return true;
        } else {
            return props.rightBar;
        }
    }
});

const missingTabIcons = ref([])
const onMissingTabIcon= (iconPath) => {
    missingTabIcons.value.push(iconPath);
};

const editorRef = ref(null);

defineExpose({
    state: editorState,
    get data() {
        return editorState.data;
    },
    form: formRef,
    validate: (opts = { silent: true }) => {
        if(formRef.value){
            return formRef.value.validateAllInputs(opts);
        }
    }
});
</script>

<template>
    <div class="editor relative @container h-full" ref="editorRef" :style="!isReady && editorRef ? { 'min-height': editorRef.clientHeight + 'px' } : {}">
        <Form :id="formId" :state="editorState.data" @submit="onSubmit" :schema="props.schema" @error="onError" v-if="isReady" :validate-on="validateOn" ref="formRef" class="h-full relative">
            <div class="header bg-white dark:bg-dark-bg border-b border-outline dark:border-light/20 sticky top-[50px] z-50" :class="{ 'top-0!': layout.state.isMobile }" v-if="!modal">
                <div class="left-bar">
                    <div class="title">
                        <div class="flex items-center">
                            <Button
                                v-if="backURL"
                                :outline="true"
                                icon="arrow"
                                :icon-props="{
                                    direction: 'left',
                                }"
                                size="small"
                                class="back-btn mr-2 w-[28px] h-[28px]"
                                @click="onBack(false, true)"
                                variant="white"
                            />
                            <slot name="titleUpdate" :id="id" :data="editorState.data" v-if="id"> Editace </slot>
                            <slot name="titleCreate" v-else> Vytvoření nového záznamu </slot>
                        </div>
                    </div>

                    <EditorButtons :formId="formId" :disabled="editorState.saving" v-if="!props.readonly" :save-and-close-only="props.saveAndCloseOnly">
                        <slot name="buttons" />
                    </EditorButtons>
                </div>
            </div>

            <!--            Mobilní seznam tabů -->
            <div class="fixed bottom-25 right-4 z-[50]">
                <Popover :popper="{ placement: 'top-end', middleware: { offset: 10 } }" v-if="tabs.length && tabs.length > 1 && layout.state.isMobile">
                    <div class="flex cursor-pointer w-[40px] h-[40px] bg-outline rounded-full items-center justify-center mobile-tabs-nav hover:bg-light dark:bg-dark dark:hover:bg-medium">
                        <Icon icon="tasks" direction="bottom" class="w-[18px]" />
                    </div>

                    <template #panel>
                        <div class="p-4 min-w-[300px] max-h-[400px] overflow-y-auto">
                            <nav class="">
                                <ul>
                                    <li
                                        v-for="(tab, index) in tabs"
                                        :key="tab.id"
                                        class="hover:bg-primary/20 px-[0.4rem]"
                                        :class="{
                                            'bg-primary/20': activeTab === tab.id,
                                        }"
                                    >
                                        <a href="#" @click.prevent="setActiveTab(tab.id)">
                                            <div class="px-[0.523rem] py-[0.78rem] flex justify-between items-center">
                                                <div class="min-h-[1.538rem] flex items-center">{{ tab.title }} <Icon v-if="tab.tabInputsErrors?.length" icon="WarningSign" class="w-[14px] ml-2 text-error" /></div>
                                                <Tag v-if="tab.grid" light>{{ helper.numberFormat(tab.grid.ajax ? tab.grid.ajax.totalCount : tab.grid._data.length, 0, ",", " ") }}</Tag>
                                            </div>
                                        </a>

                                        <hr v-if="index !== tabs.length - 1" class="m-auto w-[100%] border-outline dark:border-light/20" />
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </template>
                </Popover>
            </div>

            <div class="body h-full w-full flex" :class="{ 'flex-col': horizontalTabs }">
                <div class="body-left pt-5" :class="{ 'h-full w-[20%] max-w-[260px] pr-6': !horizontalTabs, 'px-[10px]': horizontalTabs }" v-if="tabs.length && tabs.length > 1 && !layout.state.isMobile">
                    <div class="editor-navdiv sticky top-34">
                        <nav class="editor-nav bg-white dark:bg-dark" :class="{ 'overflow-auto': horizontalTabs }">
                            <ul :class="{ 'flex': horizontalTabs }">
                                <li
                                    v-for="(tab, index) in tabs"
                                    :key="tab.id"
                                    class="hover:bg-primary/20 px-[0.4rem]"
                                    :class="{
                                        'bg-primary/20': activeTab === tab.id,
                                        'whitespace-nowrap': horizontalTabs
                                    }"
                                >
                                    <a href="#" @click.prevent="setActiveTab(tab.id)">
                                        <div class="px-[0.523rem] py-[0.78rem] flex items-center">
                                            <div v-if="tab.icon" class="mr-3">
                                                <Icon :icon="tab.icon" class="w-[15px] text-primary" />
                                            </div>
                                            <div v-else-if="tab.iconPath" class="mr-3">
                                                <img v-if="!missingTabIcons.includes(tab.iconPath)" :src="tab.iconPath" alt="Icon" class="rounded-full w-[15px] h-[15px] object-fill" :width="15" @error="onMissingTabIcon(tab.iconPath)">
                                            </div>
                                            <div class="flex justify-between items-center grow gap-[0.25rem]">
                                                <div class="min-h-[1.538rem] flex items-center">{{ tab.title }} <Icon v-if="tab.tabInputsErrors?.length" icon="WarningSign" class="w-[14px] ml-2 text-error" /></div>
                                                <Tag v-if="tab.grid" light>{{ helper.numberFormat(tab.grid.ajax ? tab.grid.ajax.totalCount : tab.grid._data.length, 0, ",", " ") }}</Tag>
                                            </div>
                                        </div>
                                    </a>

                                    <hr v-if="index !== tabs.length - 1 && !horizontalTabs" class="m-auto w-[100%] border-outline dark:border-light/20" />
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div class="body-right h-full grow">
                    <splitpanes :push-other-panes="false" :maximize-panes="false" ref="splitterRef">
                        <!--                    <pane min-size="18" :size="leftBarWidth" class="h-full bar left-bar overflow-visible! pt-5 pr-6" v-if="tabs.length && show">-->
                        <!--                        <div class="editor-navdiv sticky top-20" >-->
                        <!--                            <nav class="editor-nav bg-white dark:bg-dark">-->
                        <!--                                <ul>-->
                        <!--                                    <li v-for="(tab, index) in tabs" :key="tab.id" class="hover:bg-primary/20 px-[0.4rem]"-->
                        <!--                                        :class="{-->
                        <!--                                        'bg-primary/20': activeTab === tab.id,-->
                        <!--                                    }"-->
                        <!--                                    >-->
                        <!--                                        <a href="#" @click.prevent="setActiveTab(tab.id)">-->
                        <!--                                            <div class="px-[0.523rem] py-[0.78rem] flex justify-between items-center">-->
                        <!--                                                <div class="min-h-[1.538rem] flex items-center">{{ tab.title }}</div>-->
                        <!--                                                <Tag v-if="tab.grid" light>{{ helper.numberFormat(tab.grid.ajax ? tab.grid.ajax.totalCount : tab.grid._data.length, 0, ',', ' ') }}</Tag>-->
                        <!--                                            </div>-->
                        <!--                                        </a>-->

                        <!--                                        <hr v-if="index !== tabs.length -1" class="m-auto w-[100%] border-outline dark:border-light/20" />-->
                        <!--                                    </li>-->
                        <!--                                </ul>-->
                        <!--                            </nav>-->
                        <!--                        </div>-->
                        <!--                    </pane>-->
                        <pane min-size="50" max-size="100" :size="centreBarWidth" class="bar centre-bar pt-5 px-[10px] overflow-auto!">
                            <div class="w-full">
                                <slot :data="editorState.data" :fetchedData="editorState.editorParams" :id="id"></slot>
                            </div>
                        </pane>
                        <pane :size="rightBarWidth" :min-size="Math.min(rightBarWidth, 10)" max-size="50" class="bar right-bar sticky top-1 pt-5 pl-[10px] overflow-auto!" v-if="showRightBar">
                            <GridStackComponent
                                :options="{
                                    float: false,
                                    minRow: 1,
                                    resizable: false,
                                    disableDrag: false,
                                    sizeToContent: true,
                                    acceptWidgets: false,
                                    column: 12,
                                    columnOpts: {
                                        columnWidth: 12,
                                        columnMax: 12,
                                    },
                                    draggable: {
                                        handle: '.dashboard-moveable',
                                    },
                                    cellHeight: 20,
                                }"
                                ref="sideGridStackRef"
                            >
                            </GridStackComponent>
                        </pane>
                        <pane
                            v-if="hasPreview && (id || props.showPreviewOnCreate)"
                            :size="previewWidth"
                            :min-size="Math.min(previewWidth, 10)"
                            max-size="50"
                            class="bar right-bar sticky top-1 pt-5 pl-[10px] overflow-auto!"
                        >
                            <div class="w-full">
                                <slot name="preview" :data="editorState.data" :previewData="editorState.previewData" :fetchedData="editorState.editorParams" :id="id" />
                            </div>
                        </pane>
                    </splitpanes>
                </div>
            </div>
        </Form>
        <Loader v-else />
    </div>
</template>

<style scoped>
.header {
    .title {
        font-size: 1.2rem;
        font-weight: 600;
    }

    display: flex;
    justify-content: space-between;

    .left-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-grow: 1;
        padding: 10px 0px;
    }
}

.body {
    .body-left {
        nav {
            padding: 5px;
            box-shadow: 0px 0px 34px 0px rgba(14, 11, 48, 0.13);
            border-radius: 11px;

            ul {
                padding: 0;
                margin: 0;
            }

            li {
                border-radius: 6px;
                list-style: none;

                a > div {
                    width: 100%;
                    height: 100%;
                    font-size: 12px;
                    font-weight: 600;
                    opacity: 1;
                }
            }
        }
    }
}

:deep(.splitpanes .splitpanes__pane) {
    transition: none;
}

.mobile-tabs-nav {
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}
</style>
