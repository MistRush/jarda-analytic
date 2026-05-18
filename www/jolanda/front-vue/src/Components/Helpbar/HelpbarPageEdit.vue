<script setup>
import TinyMCE from "@/Components/Inputs/TinyMCE.vue";
import Icon from "../../Icons/Icon.vue";
import Modal from "@/Components/Modal/Modal.vue";
import InputField from "@/Components/Inputs/InputField.vue";
import { ref, watch, onMounted, onUnmounted } from "vue";
import { debounce } from "lodash";
import { useAjax } from "@/Composables/useAjax.js";
import { useAlertStore } from "@/Components/Alerts/stores/alertStore.js";
import { useHelpbarStore } from "@/Components/Helpbar/stores/helpbarStore.js";

//alerts
const alerts = useAlertStore(window.pinia);
//end alerts

const props = defineProps({
    initialData: {
        type: Object,
        required: true,
    },
});

const helpbarStore = useHelpbarStore();
const ajax = useAjax();

const editorElement = ref(null);
const modalOpen = ref(false);

const formData = ref(null);

// const parentOptions = ref([]);
const parentSearchResults = ref([]);
const parentSearchErrorText = ref("");
const parentSearchTerm = ref("");
const showParentSearchResults = ref(false);
const parentSearchRef = ref(null);
let parentChanged = true;

// onClickOutside composable function
const useClickOutside = (elementRef, callback) => {
    const handleClickOutside = (event) => {
        if (elementRef.value && !elementRef.value.contains(event.target)) {
            callback();
        }
    };

    onMounted(() => {
        document.addEventListener("mousedown", handleClickOutside);
    });

    onUnmounted(() => {
        document.removeEventListener("mousedown", handleClickOutside);
    });
};

// Use the click outside functionality for parent search
useClickOutside(parentSearchRef, () => {
    showParentSearchResults.value = false;
});

const results = {
    1: "fff",
    2: "fff2",
    3: "fff3",
};

const emit = defineEmits(["closeEdit"]);

const maximizeAction = {
    id: "maximizeAction",
    tooltip: "Maximize",
    icon: "fullscreen",
    action: () => {
        openModal();
    },
};

const openModal = () => {
    modalOpen.value = true;
};

const deepClone = (copiedObject) => {
    try {
        return JSON.parse(JSON.stringify(copiedObject));
    } catch (e) {
        alerts.error("Chyba při přenosu dokumentace do editoru", e.message ?? "");
        return copiedObject;
    }
};

const findParents = debounce(async (searchTerm) => {
    if (searchTerm.length < 3) {
        parentSearchErrorText.value = "Zadejte alespoň 3 znaky";
        return;
    }

    const { data } = await ajax.get(`/admin/docs/get-page-list`, {
        params: {
            isJolanda: helpbarStore.showJolandaDocs,
            searchTerm: searchTerm,
            limit: 7,
        },
    });

    if (data) {
        parentSearchResults.value = data;
        showParentSearchResults.value = true;
        console.log(data);
    }
}, 300);

function setParent(id, title) {
    formData.value.parentdoc_id = id;
    parentSearchTerm.value = title;
    parentChanged = true;
    showParentSearchResults.value = false;
}

watch(parentSearchTerm, (searchTerm) => {
    if (parentChanged) {
        parentChanged = false;
        return;
    }
    if (searchTerm.length === 0) {
        formData.value.parentdoc_id = null;
    }
    findParents(searchTerm);
});

watch(
    () => props.initialData,
    (newData) => {
        formData.value = deepClone(newData);
        let navItem = helpbarStore.getNavigationItem(newData?.id);
        if (navItem?.parent?.title) {
            parentSearchTerm.value = navItem.parent.title;
            showParentSearchResults.value = false;
        }
    },
    { immediate: true, deep: true },
);

onMounted(() => {

});


</script>

<template>
    <div class="helpbar-edit">
        <div class="edit-title">
            <div class="edit-title-text">{{ initialData.title }} - úprava</div>

            <div class="edit-submit button-wrapper">
                <button @click="emit('editPage', formData)" class="btn btn-success cursor-pointer" title="Save changes">
                    <Icon icon="save" class="page-edit-save" :width="20" :height="20" color="#506069" />
                </button>
                <button @click="emit('closeEdit')" class="btn btn-success cursor-pointer" title="Exit edit mode and discard changes" v-if="formData?.id !== null">
                    <Icon icon="close" :width="18" :height="18" class="page-edit-discard" color="#506069" />
                </button>
            </div>
        </div>
        <div class="edit-page-form">
            <InputField v-model="formData.title" label="Název" class="input" />
            <div class="parent-search" ref="parentSearchRef">
                <!--                <InputField-->
                <!--                    v-model="formData.parentdoc_id"-->
                <!--                    label="ID Rodičovského dokumentu"-->
                <!--                    class="input"-->
                <!--                />-->
<!--                <InputField v-model="parentSearchTerm" label="Rodičovská dokumentace" class="input" />-->
<!--                <div class="parent-search-results" v-if="showParentSearchResults">-->
<!--                    <div class="result" v-for="result in parentSearchResults" @click="setParent(result.id, result.title)">-->
<!--                        {{ result.title }}-->
<!--                    </div>-->
<!--                </div>-->
                <Select
                    v-model="formData.parentdoc_id"
                    :url="'admin/docs/get-page-list-for-select?isJolanda=' + (helpbarStore.showJolandaDocs ? '1' : '0')"
                    :filterable="true"
                    filterableParam="searchTerm"
                    remoteName="title"
                    remoteIdentifier="id"
                />
            </div>

            <InputField v-model="formData.urlpattern" label="Reg. výraz pro URL" class="input" />
            <InputField v-model="formData.tags" label="Tagy (oddělené čárkami)" class="input" />
        </div>
        <div class="edit-description">
            <div class="pb-2 description-label">
                <div>Text dokumentace</div>
                <Button icon="edit" variant="white" :outline="true" tooltip="Otevřít textový editor na celé obrazovce" @click="openModal" />
            </div>
            <TinyMCE class="description-editor" v-model="formData.content" ref="editorElement" :compact="true" :height="500" :custom-actions="[maximizeAction]" />
        </div>
        <Modal :isVisible="modalOpen" size="large" @update:is-visible="modalOpen = false" :z-index="101">
            <template v-slot:header> Edit </template>
            <template v-slot:body>
                <div>
                    <TinyMCE class="big-description-editor" v-model="formData.content" ref="bigEditorElement" :compact="false" :height="500" />
                </div>
            </template>
        </Modal>
    </div>
</template>

<style scoped>
.helpbar-edit {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding-right: 5px;
    .edit-title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        column-gap: 10px;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 10px;

        .button-wrapper {
            display: flex;
            flex-direction: row;
            column-gap: 5px;
        }
    }
    .edit-page-form {
        margin: 0 0 20px 0;
        display: flex;
        flex-direction: column;
        row-gap: 10px;

        .parent-search {
            .parent-search-results {
                margin-top: -5px;
                padding-top: 5px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.2);
                border-left: 1px solid rgba(0, 0, 0, 0.2);
                border-right: 1px solid rgba(0, 0, 0, 0.2);
                border-radius: 0 0 10px 10px;
                .result {
                    padding: 10px;
                    border-top: 1px solid rgba(0, 0, 0, 0.2);
                    cursor: pointer;

                    &:hover {
                        background-color: rgba(0, 0, 0, 0.15);
                    }
                }
            }
        }
    }
    .edit-description {
        width: 100%;

        .description-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
}

.page-edit-save:hover {
    color: #24c586 !important;
}

.page-edit-discard:hover {
    color: #ff0000 !important;
}
</style>
