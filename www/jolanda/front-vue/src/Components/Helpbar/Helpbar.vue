<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useRouter } from "vue-router";

import { useHelpbarStore } from "@/Components/Helpbar/stores/helpbarStore.js";
import { useAjax } from "@/Composables/useAjax.js";
import { useApp } from "@/App/composables/useApp.js";
import { useAlertStore } from "@/Components/Alerts/stores/alertStore.js";
import HelpbarSearchbar from "@/Components/Helpbar/HelpbarSearchbar.vue";
import HelpbarPage from "@/Components/Helpbar/HelpbarPage.vue";
import HelpbarPageEdit from "@/Components/Helpbar/HelpbarPageEdit.vue";
import HelpbarList from "@/Components/Helpbar/HelpbarList.vue";
import Modal from "@/Components/Modal/Modal.vue";

const helpbarStore = useHelpbarStore(window.pinia);
const ajax = useAjax();
const { user } = useApp();
const router = useRouter();

//alerts
const alerts = useAlertStore(window.pinia);
//end alerts

const inEditMode = ref(false);
const fullscreen = ref(false);
const showDeletePageConfirmation = ref(false);

let treeProcessed = false;
let firstTimeJolandaOpened = true;

let fullPageDocList = [];
let fullJolandaDocList = [];
let fullDocList = fullPageDocList;

const pageData = computed(() => {
    return helpbarStore.showJolandaDocs ? helpbarStore.currentJolandaPage : helpbarStore.currentPage;
});

// Uchovává aktuální typ pohledu momentálně zobrazovaného typu dokumentace (Projekt/Jolanda)
const showDocList = computed(() => {
    return helpbarStore.showJolandaDocs ? helpbarStore.showJolandaDocList : helpbarStore.showPageDocList;
});

// Seznam dokumentací mometnálně zobrazovaného typu dokumentace (Projekt/Jolanda)
const docList = computed(() => {
    return helpbarStore.showJolandaDocs ? helpbarStore.jolandaDocList : helpbarStore.pageDocList;
});

if (typeof window.jolandaConfig !== "undefined" && window.jolandaConfig.helpbar) {
    window.helpbar = helpbarStore;
}

/**
 * @param id    ID dokumentu
 * @param route Cesta na projektu
 * @param list  Výběr seznamu dokumentů
 * @returns {Promise<void>}
 */
const fetchFormData = async (id = null, route = "", list = false) => {
    const { data } = await ajax.get(`/admin/docs/get-page`, {
        params: {
            id: id,
            route: route,
            list: list,
            isJolanda: helpbarStore.showJolandaDocs,
        },
    });

    if (data) {
        helpbarStore.updateCurrentPage(data);
        setListMode(false);
    } else {
        setListMode(true);
    }
};

const fetchDocsList = async (searchTerm = "", reconstructNavigationTree = false) => {
    const { data } = await ajax.get(`/admin/docs/get-page-list`, {
        params: {
            isJolanda: helpbarStore.showJolandaDocs,
            searchTerm: searchTerm,
        },
    });

    if (data) {
        helpbarStore.updateDocList(data);
        const rebuildTree = (!treeProcessed || reconstructNavigationTree) && searchTerm === "";
        const firstJolandaToggle = helpbarStore.showJolandaDocs && firstTimeJolandaOpened;

        if (rebuildTree || firstJolandaToggle) {
            fullDocList = data;
            buildNavigationTree();
            treeProcessed = true;
            if (firstJolandaToggle) {
                firstTimeJolandaOpened = false;
            }
            // console.log(fullDocList);
        }
    }
};

function buildNavigationTree() {
    const docMap = new Map();
    fullDocList.forEach((doc) => {
        docMap.set(doc.id, doc);
        doc.parent = null;
    });

    fullDocList.forEach((doc) => {
        let current = doc;
        const seen = new Set(); // Množina pro kontrolu kruhových závislostí
        while (current.parentdoc_id) {
            if (seen.has(current.id)) {
                console.warn(`Circular dependency`);
                break;
            }
            seen.add(current.id);

            const parent = docMap.get(current.parentdoc_id);
            if (parent) {
                current.parent = parent;
                current = parent;
            } else {
                current.parent = null;
                break;
            }
        }
    });

    helpbarStore.updateNavigationMap(docMap);
}

const updateFormData = async (updatedData) => {
    if (!updatedData) {
        alerts.error("Chyba: Chybějící data pro aktualizaci dokumentu.");
        return;
    }

    // Přidání typu dokumentace do dat a převedení dat do řetězce
    const data = {
        data: JSON.stringify({ ...updatedData, isJolanda: helpbarStore.showJolandaDocs }),
    };

    let hasError = false;

    await ajax
        .postForm("/admin/docs/update-page", data, null, {
            waitingAlert: {
                title: "Ukládám štítek",
            },
        })
        .then(({ response, alert }) => {
            if (response && response.data.success) {
                alert.changeToSuccess("Dokument byl úspěšně uložen.");
                const finalId = response.data.id;
                const newData = { ...updatedData, id: finalId };
                helpbarStore.updateCurrentPage(newData);
                // Aktualizace seznamu dokumentací + rekonstrukce navigačního stromu
                fetchDocsList("", true);

                inEditMode.value = false;
            } else {
                alert.changeToError(`Chyba při ukládání dokumentu: ${response?.data.message || "Neznámá chyba."}`);
            }
        })
        .catch(function ({ error, alert }) {
            alert.changeToError("Chyba při ukládání štítku", error.message ? error.message : "", error);
            hasError = true;
        });

    return !hasError;
};

const deletePageData = async (pageID) => {
    if (!pageData.value?.id || !user.hasAdminAccess()) {
        alerts.error("Nemáte dostatečná práva nebo není načtená stránka");
        return false;
    }

    await ajax
        .request(
            "delete",
            "/admin/docs/delete-page",
            {},
            {
                params: {
                    page_id: pageID,
                    isJolanda: helpbarStore.showJolandaDocs,
                },
            },
        )
        .catch((e) => {
            alerts.error("error", error.message ?? "");
            return false;
        })
        .then((response) => {
            alerts.success("Stránka byla úspěšně smazána", "ID: " + (response.data?.id ?? "-"));
            return true;
        });
};

const toggleDoctype = () => {
    helpbarStore.toggleDoctype();
    if (helpbarStore.showJolandaDocs) {
        fullDocList = fullJolandaDocList;
    } else {
        fullDocList = fullPageDocList;
    }
    // Pokud ještě nebyl získán seznam všech dokumentací, získáme jej
    if (showDocList.value && docList.value?.length === 0) {
        fetchDocsList();
    }
};

const setOpenDocument = (documentId, invokedByBreadcrumbChange = false) => {
    if (pageData.value?.id !== documentId || !invokedByBreadcrumbChange) {
        fetchFormData(documentId);
    }
};

const deletePage = async () => {
    if (pageData.value?.id) {
        await deletePageData(pageData.value?.id);

        setListMode(true);
        inEditMode.value = false;
        showDeletePageConfirmation.value = false;

        await fetchDocsList("", true);
    }
};

function setListMode(value) {
    if (helpbarStore.showJolandaDocs) {
        helpbarStore.showJolandaDocList = value;
    } else {
        helpbarStore.showPageDocList = value;
    }

    // Aktualizace seznamu dokumentací při změně na seznamový pohled
    if (value) {
        fetchDocsList();
        inEditMode.value = false;
    }
}

function createNewDoc() {
    helpbarStore.updateCurrentPage(getDefaultPageObject());
    setListMode(false);
    inEditMode.value = true;
}

function getDefaultPageObject() {
    return {
        id: null,
        parentdoc_id: null,
        title: "Nová dokumentace",
        urlpattern: "",
        content: "",
        breadcrumb: "",
        tags: "",
        createdat: Date.now(),
        createdby: "",
        updatedat: Date.now(),
        updatedby: "",
    };
}

// Nastavení aktuální cesty při načtení komponenty
onMounted(() => {
    router.isReady().then(() => {
        helpbarStore.updateCurrentPath(router.currentRoute?.value?.fullPath ?? "");
    });
});

// Aktualizace aktuální cesty na webu při načtení nové stránky
router.isReady().then(() => {
    router.afterEach((to) => {
        helpbarStore.updateCurrentPath(router.currentRoute?.value?.fullPath);
    });
});

// Sledování otevření helpbaru
watch(
    () => helpbarStore.isOpen,
    (isOpen) => {
        const pathChanged = helpbarStore.currentPath !== router.currentRoute?.value?.fullPath ?? "";
        if ((isOpen && pathChanged) || !pageData.value?.id) {
            fetchDocsList();
            fetchFormData("", router.currentRoute?.value?.fullPath ?? "");
        }
    },
);
</script>

<template>
    <div>
        <Teleport to="body">
            <div :class="'helpbar  bg-white dark:bg-dark ' + (fullscreen ? 'fullscreen' : '')" v-if="helpbarStore.isOpen">
                <div class="helpbar-container">
                    <div class="helpbar-header">
                        <div class="helpbar-title">
                            <h2>Dokumentace {{ helpbarStore.showJolandaDocs ? "Jolandy" : "webu" }}</h2>
                        </div>
                        <div class="helpbar-header-buttons">
                            <div class="helpbar-maximize" @click="fullscreen = !fullscreen">
                                <Icon :class="'icon-' + (fullscreen ? 'min' : 'max')" icon="arrow" color="#506069" :width="18" :height="18" />
                            </div>
                            <button class="helpbar-toggle cursor-pointer" id="helpbar-toggle" title="Toggle view type" aria-label="auto" aria-live="polite" @click="setListMode(!showDocList)" v-if="pageData.id">
                                <Icon :icon="showDocList ? 'application' : 'list'" color="#506069" :width="16" :height="16" />
                            </button>
                            <button class="helpbar-toggle cursor-pointer" id="helpbar-toggle" :title="'Show ' + (helpbarStore.showJolandaDocs ? 'Website' : 'Jolanda') + ' docs'" aria-label="auto" aria-live="polite" @click="toggleDoctype">
                                <Icon icon="project" color="#506069" :width="16" :height="16" />
                            </button>
                            <div class="helpbar-new" @click="createNewDoc" v-if="user.hasAdminAccess()">
                                <Icon icon="plus" color="#506069" :width="18" :height="18" />
                            </div>
                            <div class="helpbar-close" @click="helpbarStore.toggleOpen()">
                                <Icon icon="close" color="#506069" :width="16" :height="16" />
                            </div>
                        </div>
                    </div>

                    <div class="helpbar-body">
                        <!--                        TODO change the helpbar structure-->
                        <div class="helpbar-body-search" v-if="showDocList">
                            <HelpbarSearchbar @updateSearch="fetchDocsList" />
                        </div>
                        <div class="helpbar-body-content-wrapper">
                            <div class="helpbar-body-list-wrapper" v-if="showDocList">
                                <HelpbarList :docs="docList" @setCurrentDocument="setOpenDocument" />
                            </div>
                            <div class="helpbar-body-detail-wrapper" v-if="!showDocList">
                                <div class="helpbar-body-detail-button">
                                    <Button variant="white" :outline="true" @click="setListMode(true)" tooltip="Návrat na seznam dokumentací">
                                        <Icon class="button-arrow" icon="arrow" color="#506069" :width="20" :height="20" />
                                        Zpět
                                    </Button>
                                </div>
                                <div class="helpbar-body-page" v-if="!inEditMode && pageData">
                                    <HelpbarPage :data="pageData" @toggleEdit="inEditMode = !inEditMode" @setCurrentDocument="setOpenDocument" @deletePage="showDeletePageConfirmation = true" />
                                </div>
                                <div class="helpbar-body-edit" v-if="inEditMode && pageData">
                                    <HelpbarPageEdit :initial-data="pageData" @closeEdit="inEditMode = false" @editPage="updateFormData" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>

    <Modal
        size="small"
        :isVisible="(showDeletePageConfirmation && pageData.value?.id)" @close="showDeletePageConfirmation = false">
        <template #header> Smazat stránku </template>
        <template #body> Opravdu chcete smazat stránku? </template>
        <template #footer>
            <Button variant="red" size="large" @click="deletePage">{{ _l("Smazat") }}</Button>
            <Button variant="default" size="large" @click="showDeletePageConfirmation">{{ _l("Zrušit") }}</Button>
        </template>
    </Modal>
</template>

<style scoped>
.helpbar {
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    width: 32%;
    height: 100vh;
    flex-wrap: wrap;
    z-index: 100;
    direction: rtl;

    @media (max-width: 767px) {
        width: 100% !important;
    }

    &.fullscreen {
        width: 60%;
    }

    box-shadow: 0 4px 34px 0 rgba(169, 181, 222, 0.2);

    .helpbar-container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow: hidden;
        direction: ltr;
        height: 100vh;
        padding: 10px 10px 0 20px;
        pointer-events: all;
        width: 100%;

        .helpbar-header {
            margin: 12px 0;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .helpbar-title {
                display: flex;
                align-items: center;
                font-size: 16px;
                padding: 0 5px;

                h2 {
                    padding: 0;
                    margin: 0;
                }
            }

            .helpbar-header-buttons {
                align-items: center;
                margin-left: auto;
                display: flex;
                flex-direction: row;
                column-gap: 10px;

                div {
                    cursor: pointer;
                    padding: 1px;
                    border-radius: 4px;
                }

                .helpbar-maximize {
                    @media (max-width: 767px) {
                        display: none;
                    }
                    .icon-max {
                        rotate: 90deg;
                    }
                    .icon-min {
                        rotate: -90deg;
                    }
                }

                .helpbar-new {
                    background: rgba(36, 197, 134, 0.5);
                    &:hover {
                        background: rgba(36, 197, 134, 0.8);
                    }
                }

                .helpbar-close {
                    font-size: 22px;
                    color: rgba(0, 0, 0, 0.2);
                    cursor: pointer;
                }
            }
        }

        .helpbar-body {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            overflow: hidden;
            min-height: 0;
            margin-bottom: 5px;

            .helpbar-body-content-wrapper {
                margin-top: 10px;
                padding-right: 5px;
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                overflow: hidden;
                min-height: 0;

                .helpbar-body-list-wrapper {
                    flex-grow: 1;
                    overflow-y: auto;
                    min-height: 0;
                }

                .helpbar-body-detail-wrapper {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    overflow: hidden;
                    min-height: 0;

                    .helpbar-body-detail-button {
                        .button-arrow {
                            rotate: 90deg;
                        }
                        margin-bottom: 10px;
                        flex-shrink: 0;
                    }

                    .helpbar-body-page {
                        flex-grow: 1;
                        overflow-y: auto;
                        min-height: 0;
                    }

                    .helpbar-body-edit {
                        flex-grow: 1;
                        overflow-y: auto;
                        min-height: 0;
                    }
                }
            }
        }
    }
}
</style>
