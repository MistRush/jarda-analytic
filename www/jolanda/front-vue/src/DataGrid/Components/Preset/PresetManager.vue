<script setup>
import { inject, onMounted, reactive, ref } from "vue";
import { useApp } from "@/App/composables/useApp.js";
import { PresetSetting } from "@/DataGrid/js/Settings/PresetSetting.js";
import { useAjax } from "@/Composables/useAjax.js";
import { useTranslations } from "@/Composables/useTranslation.js";
import Modal from "@/Components/Modal/Modal.vue";
import InputField from "@/Components/Inputs/InputField.vue";
import Form from "@/Components/Form/Components/Form.vue";
import { object, string } from "yup";

const grid = inject("dataGrid", null);
const { user } = useApp();
const ajax = useAjax();
const { translations } = useTranslations();
const userStates = ref([]);

const emit = defineEmits(["userPresets"]);

grid.presetManager.settings.presetTriggerSave = (state) => {
    if (grid.presetManager?.settings.saveType === PresetSetting.SAVE_TYPE_LOCAL) {
        localStorage.setItem("DataGridVue_" + "USR" + user.ID + "_" + "_tmp_" + "_" + grid.id + "_" + window.location.pathname, JSON.stringify(state));
    } else {
        saveState("_tmp_", JSON.stringify(state));
    }
};

const state = reactive({
    addModal: {
        show: false,
        state: {
            name: null,
        },
    },
    renameModal: {
        show: false,
        state: {
            name: null,
            oldName: null,
            id: null,
        },
    },
    defaultState: null,
});

const initServersideStates = async () => {
    if (grid.presetManager?.settings.saveType === PresetSetting.SAVE_TYPE_SERVERSIDE) {
        const states = await getStates();

        if (!states) {
            return;
        }

        states.forEach((apiState, index) => {
            if (typeof apiState.Data === "string") {
                apiState.Data = JSON.parse(apiState.Data);
            }

            if (apiState.PresetName === "_tmp_") {
                const tmpState = grid.presetManager.createPresetFromState("_tmp_", apiState.PresetName, apiState.Data);
                if (tmpState) {
                    tmpState.load();
                }

                return;
            }

            let name = "USR" + apiState.User_ID + "_" + apiState.PresetName;

            // let state = this.grid.grid.stateRestore.state(name);
            //
            // if(state[0] === null){
            //     this.grid.grid.stateRestore.state.add(name);
            // }

            grid.presetManager.addPresetFromState(name, apiState.PresetName, apiState.Data);
            // localStorage.setItem('DataTables_stateRestore_USR' + apiState.User_ID + '_' + apiState.PresetName+'_'+apiState.URL, apiState.Data);
        });
    } else {
        Object.entries(localStorage).forEach(([key, value]) => {
            if (key.includes("DataGridVue") && key.includes(grid.id) && key.includes(window.location.pathname) && key.includes("USR" + user.ID)) {
                let state = JSON.parse(value);

                if (key.includes("__tmp__")) {
                    const tmpState = grid.presetManager.createPresetFromState("_tmp_", "_tmp_", state);
                    if (tmpState) {
                        tmpState.load();
                    }

                    return;
                }

                let name = key.replace("DataGridVue_" + "USR" + user.ID + "_", "");
                name = name.replace("_" + grid.id + "_" + window.location.pathname, "");

                grid.presetManager.addPresetFromState(key, name, state);
            }
        });
    }

    loadUserStates();
};

const getStates = async () => {
    if (!grid.presetManager?.settings.serversideUrl) {
        console.error("Preset ServersideUrl is not set");
        return;
    }

    let states = null;
    await ajax
        .get(grid.presetManager.settings.serversideUrl + "/get", {
            params: {
                URL: window.location.pathname,
                GridName: grid.id,
                UserID: user.ID,
                All: true,
            },
        })
        .then(({ data }) => {
            if (data) {
                states = data;
            }
        });

    return states;
};

const loadUserStates = () => {
    userStates.value = [];
    if (user.ID) {
        // this.grid.grid.stateRestore.states().each((state, i) => {
        //     if(state.s.identifier.includes('USR'+this.userID + '_')){
        //         state.Identifier = state.s.identifier;
        //         state.Name = state.s.identifier.replace('USR'+this.userID + '_', "");
        //         this.userStates.push(state);
        //     }
        // });
        Object.entries(grid.presetManager.presets).forEach(([key, preset]) => {
            if (preset.id.includes("USR" + user.ID + "_")) {
                // state.Identifier = state.s.identifier;
                // state.Name = state.s.identifier.replace('USR'+this.userID + '_', "");
                userStates.value.push(preset);
            }
        });
    }

    return userStates.value;
};

const addUserState = async (presetName) => {
    if (!isStateExist(presetName)) {
        // $(this.grid.element).closest('.dataTables_wrapper').find('.dtsr-creation').find('.dtsr-creation-button').click();
        const preset = grid.presetManager.addPresetFromCurrentDataGrid("USR" + user.ID + "_" + presetName, presetName);

        if (grid.presetManager?.settings.saveType === PresetSetting.SAVE_TYPE_SERVERSIDE) {
            const data = JSON.stringify(preset.state);

            await saveState(preset.name, data);
        } else {
            localStorage.setItem("DataGridVue_" + preset.id + "_" + grid.id + "_" + window.location.pathname, JSON.stringify(preset.state));
        }

        // this.addDialog.dialog.close();
        setTimeout(() => loadUserStates(), 100);
        // this.addDialog.dialog = null;
    } else {
        alert(translations.NAME_ALREADY_EXIST);
    }
};

const saveState = async (presetName, data) => {
    await ajax.postForm(grid.presetManager.settings.serversideUrl + "/save", {
        URL: window.location.pathname,
        GridName: grid.id,
        UserID: user.ID,
        PresetName: presetName,
        Data: data,
    });
};

const deleteState = async (presetName) => {
    await ajax.postForm(grid.presetManager.settings.serversideUrl + "/delete", {
        URL: window.location.pathname,
        GridName: grid.id,
        UserID: user.id,
        PresetName: presetName,
    });
};

const renameServersideState = async (oldPresetName, newPresetName) => {
    await ajax.postForm(grid.presetManager.settings.serversideUrl + "/rename", {
        URL: window.location.pathname,
        GridName: grid.id,
        UserID: user.ID,
        OldPresetName: oldPresetName,
        NewPresetName: newPresetName,
    });
};

const updateState = async (id) => {
    const preset = grid.presetManager.getPresetByID(id);

    if (confirm(translations.PRESET_ADD_CONFIRM + ' "' + preset.name + '"?')) {
        if (preset) {
            grid.presetManager.addPresetFromCurrentDataGrid(id, preset.name);
        }

        const data = JSON.stringify(preset.state);
        if (grid.presetManager?.settings.saveType === PresetSetting.SAVE_TYPE_SERVERSIDE) {
            await saveState(preset.name, data);
        } else {
            localStorage.setItem(preset.id, JSON.stringify(preset.state));
        }

        loadUserStates();
    }
};

const removeState = async (id) => {
    const preset = grid.presetManager.getPresetByID(id);

    if (confirm(translations.REMOVE_QUESTION + " " + translations.PRESET + ' "' + preset.name + '"?')) {
        if (grid.presetManager?.settings.saveType === PresetSetting.SAVE_TYPE_SERVERSIDE) {
            await deleteState(preset.name);
        } else {
            localStorage.removeItem(preset.id);
        }

        grid.presetManager.removePreset(id);

        loadUserStates();
    }
};

const renameState = async (name, newName, id) => {
    const preset = grid.presetManager.getPresetByID(id);

    if (grid.presetManager?.settings.saveType === PresetSetting.SAVE_TYPE_SERVERSIDE) {
        await renameServersideState(name, newName);
    } else {
        localStorage.removeItem(preset.id);
        localStorage.setItem("DataGridVue_" + preset.id + "_" + grid.id + "_" + window.location.pathname, JSON.stringify(preset.state));
    }

    preset.name = newName;

    loadUserStates();
};

const isStateExist = (name) => {
    let exist = false;

    userStates.value.forEach((state, i) => {
        if (state.name === name) exist = true;
    });

    return exist;
};

const changeState = (id) => {
    const preset = grid.presetManager.getPresetByID(id);

    if (preset) {
        preset.load();
    }

    return preset;
};

const showAddDialog = () => {
    state.addModal.show = true;
};

const showRenameDialog = (_state) => {
    state.renameModal.state.oldName = _state.name;
    state.renameModal.state.name = _state.name;
    state.renameModal.state.id = _state.id;

    state.renameModal.show = true;
};

const resetToDefault = () => {
    state.defaultState.load();
};

onMounted(() => {
    setTimeout(() => {
        createDefaultState();
        initServersideStates();
    }, 500);
});

const schema = object({
    name: string()
        .required()
        .test("unique", translations.NAME_ALREADY_EXIST, (value) => {
            return !isStateExist(value);
        }),
});

const createDefaultState = () => {
    state.defaultState = grid.presetManager.createPresetFromCurrentDataGrid("default", "Default");
};

defineExpose({
    initServersideStates,
    getStates,
    loadUserStates,
    addUserState,
    saveState,
    deleteState,
    renameServersideState,
    updateState,
    removeState,
    renameState,
    isStateExist,
    changeState,
    resetToDefault,
    showAddDialog,
    showRenameDialog,
    userStates,
});
</script>

<template>
    <div>
        <Modal
            :is-visible="true"
            v-if="state.addModal.show"
            @close="
                state.addModal.state.name = null;
                state.addModal.show = false;
            "
        >
            <template #header>
                {{ translations.ADD }}
            </template>
            <template #body>
                <Form
                    :state="state.addModal.state"
                    @submit="
                        async () => {
                            await addUserState(state.addModal.state.name);
                            state.addModal.state.name = null;
                            state.addModal.show = false;
                        }
                    "
                    :schema="schema"
                >
                    <div class="row-1">
                        <InputField name="name" v-model="state.addModal.state.name" :label="translations.NAME" class="col-1" />
                        <div class="col-1 flex flex-row-reverse">
                            <Button type="submit" variant="green">{{ translations.SAVE }}</Button>
                        </div>
                    </div>
                </Form>
            </template>
        </Modal>
        <Modal
            :is-visible="true"
            v-if="state.renameModal.show"
            @close="
                state.renameModal.state.name = null;
                state.renameModal.state.oldName = null;
                state.renameModal.state.id = null;
                state.renameModal.show = false;
            "
        >
            <template #header>
                {{ translations.PREVIEW }}
            </template>
            <template #body>
                <Form
                    :state="state.renameModal.state"
                    @submit="
                        async () => {
                            await renameState(state.renameModal.state.oldName, state.renameModal.state.name, state.renameModal.state.id);
                            state.renameModal.state.name = null;
                            state.renameModal.state.oldName = null;
                            state.renameModal.state.id = null;
                            state.renameModal.show = false;
                        }
                    "
                    :schema="schema"
                >
                    <div class="row-1">
                        <InputField name="name" v-model="state.renameModal.state.name" :label="translations.NAME" class="col-1" />
                        <div class="col-1 flex flex-row-reverse">
                            <Button type="submit" variant="green">{{ translations.SAVE }}</Button>
                        </div>
                    </div>
                </Form>
            </template>
        </Modal>
    </div>
</template>
