<script setup>
import Grid from "@/DataGrid/Components/Table/Grid.vue";
import { reactive, provide, watch, computed, ref, useId, onMounted, onUnmounted, inject, h, getCurrentInstance } from "vue";
import { DataGrid } from "@/DataGrid/js/DataGrid";
import { Ajax } from "@/DataGrid/js/Ajax/Ajax";
import Select from "@/Components/Inputs/Select.vue";
import InputField from "@/Components/Inputs/InputField.vue";
import { RowSetting } from "@/DataGrid/js/Settings/RowSetting";
import Preview from "@/DataGrid/Components/Table/Preview/Preview.vue";
import { useTranslations } from "@/Composables/useTranslation.js";
import { useAppStore } from "@/App/stores/appStore";
import Modal from "@/Components/Modal/Modal.vue";
import { useAjax } from "@/Composables/useAjax.js";
import { useManager } from "@/Composables/useManager";
import FilterDialog from "@/DataGrid/Components/Filter/FilterDialog.vue";
import ColumnSettingsDialog from "@/DataGrid/Components/Column/ColumnSettingsDialog.vue";
import { useAlertStore } from "@/Components/Alerts/stores/alertStore";
import { usePage } from "@/App/composables/usePage";
import { useHelper } from "@/Composables/useHelper";
import PresetManager from "@/DataGrid/Components/Preset/PresetManager.vue";
import Popover from "@/Components/Popover/Popover.vue";
import Column from "@/DataGrid/Components/Table/Body/Column.vue";
import Button from "@/Components/Inputs/Button.vue";
import Checkbox from "@/Components/Inputs/Checkbox.vue";
import RowReorderModal from "@/DataGrid/Components/RowReorder/RowReorderModal.vue";
import isEqual from "lodash/isEqual";
import Loader from "@/Components/Other/Loading/Loader.vue";
import { useApp } from "@/App/composables/useApp.js";
import Action from "@/DataGrid/Components/Action/Action.vue";
import ActiveFilters from "@/DataGrid/Components/Filter/ActiveFilters.vue";

const props = defineProps({
    dataGrid: {
        type: Object,
    },
    manager: [String, Object],
    search: Object,
    title: String,
    preview: Boolean,
    selectType: {
        type: String,
        default: RowSetting.SELECT_TYPE_SINGLE,
        validator: (value) => {
            const allowedValues = [RowSetting.SELECT_TYPE_SINGLE, RowSetting.SELECT_TYPE_MULTI, RowSetting.SELECT_TYPE_MULTI_CHECKBOX];
            return allowedValues.includes(value);
        },
    },
    enabledActions: {
        type: Object,
        default: () => {
            return {
                add: true,
                edit: true,
                remove: true,
            };
        },
    },
    actionLabels: {
        type: Boolean,
        default: true,
    },
    editorURL: String,
    editorParams: {
        type: Object,
        default: null
    },
    parent: [Object, Array],
    fetchData: Boolean,
    fetchDataUrl: {
        type: String,
        default: null,
    },
    filter: {
        type: Boolean,
        default: true,
    },
    refresh: {
        type: Boolean,
        default: true,
    },
    columnsSetting: {
        type: Boolean,
        default: true,
    },
    editorModal: {
        type: Object,
    },
    id: {
        type: String,
    },
    ajaxCount: {
        type: Number,
    },
    order: {
        type: [Object, String],
        default: "-ID",
    },
    rowFormatter: Function,
    data: {
        type: Array,
    },
    preset: {
        type: Boolean,
        default: undefined,
    },
    rowHeight: {
        type: [Number, String],
        default: 33,
    },
    height: {
        type: [String, Number],
        default: "68vh",
    },
    actionsColumn: {
        type: Boolean,
        default: true,
    },
    rowReorder: {
        type: Object,
    },
    exportAction: {
        type: Boolean,
        default: false,
    },
    onAfterInlineEditConfirm: {
        type: Function,
        default: () => {},
    },
});

const { registerGrid, unregisterGrid, getGrid } = usePage();
const tabRegisterGrid = inject("tab-registerGrid", null);
const tabUnregisterGrid = inject("tab-unregisterGrid", null);
provide("dataGrid-defOrder", props.order);

const alerts = useAlertStore(window.pinia);

const emit = defineEmits(["rowDblclick", "rowSelect", "rowBeforeSelect", "rowDeselect", "rowBeforeDeselect", "rowClick", "rowBeforeClick"]);
const { translations } = useTranslations();
const helper = useHelper();
const { layout } = useApp();
const instance = getCurrentInstance();

const initGrid = () => {
    let usePreset = typeof props.preset === "undefined" ? DataGrid.USE_PRESETS : props.preset;
    if (!props.id && usePreset) {
        usePreset = false;
        console.warn("Pass the prop ID for this DataGrid for presets");
    }

    const setting = {
        id: id,
        height: props.height,
        row: {
            selectType: props.selectType,
            height: props.rowHeight,
            onDblclick: (event, row) => {
                const hasHandler = !!(instance?.vnode?.props?.onRowDblclick);
                if (hasHandler) {
                    emit("rowDblclick", event, row);
                } else if (props.enabledActions.edit) {
                    edit();
                }
            },
            onSelect: (event, row) => {
                emit("rowSelect", event, row);
            },
            onBeforeSelect: (event, row) => {
                emit("rowBeforeSelect", event, row);
            },
            onDeselect: (event, row) => {
                emit("rowDeselect", event, row);
            },
            onBeforeDeselect: (event, row) => {
                emit("rowBeforeDeselect", event, row);
            },
            onClick: (event, row) => {
                emit("rowClick", event, row);
            },
            onBeforeClick: (event, row) => {
                emit("rowBeforeClick", event, row);
            },

            rowCallback: typeof props.rowFormatter === "function" && props.rowFormatter ? props.rowFormatter : null,
        },
        external: {
            search: props.search ?? null,
        },
        preset: usePreset
            ? {
                  presetTriggerSave: (state) => {
                      // if (this.params.presetSaveType === "local") {
                      //   localStorage.setItem("DataGridVue_" + "USR" + userID + "_" + "_tmp_" + "_" + this.id + "_" + window.location.pathname, JSON.stringify(state));
                      // } else {
                      // state.grid.stateRestore.saveState("_tmp_", JSON.stringify(state));
                      // }
                  },
              }
            : null,
        editor: {
            onAfterConfirm: (cell, newData, oldData) => {
                if (newData === oldData) {
                    return;
                }

                const id = cell.row.getData()["ID"] ?? null;

                if (!id) {
                    console.error("ID not found");
                    return;
                }

                let data = {
                    ID: id,
                    [cell.column.data]: newData,
                };

                let onAfterInlineEditConfirmResult = null;
                if (typeof props.onAfterInlineEditConfirm === "function") {
                    try {
                        onAfterInlineEditConfirmResult = props.onAfterInlineEditConfirm(cell, newData, oldData);
                    } catch (error) {
                        console.error("Error in onAfterInlineEditConfirm:", error);
                    }
                }

                if (props.manager) {
                    const { getURLs } = useManager(props.manager);
                    const ajax = useAjax();

                    if (getURLs().update) {
                        ajax.postForm(getURLs().update, { data: JSON.stringify(data) }).then(() => {
                            if (onAfterInlineEditConfirmResult === false) return;
                            cell.column.dataGrid.refresh();
                        });
                    } else {
                        // if (typeof this.onAfterInlineChange === "function") this.onAfterInlineChange(cell.column.data, data[cell.column.data], data.ID);
                    }
                }
            },
        },
    };

    const grid = new DataGrid(setting);

    if (props.manager) {
        const { getURLs } = useManager(props.manager);

        grid.ajax = new Ajax(
            {
                count: props.ajaxCount ?? null,
            },
            grid,
        );
        grid.ajax.url = getURLs().list;
        grid.ajax.data = (state) => {
            const { getParams } = useManager(props.manager);

            const params = {
                ...(state ?? {}),
                ...(getParams() ?? {}),
            };

            let sort = null;
            const sortCol = grid.getColumnByID(state.order[0].column);

            if (grid.ajax._requestCount === 0 && (!sortCol || !sortCol.data)) {
                if (props.order) {
                    if (typeof props.order === "string") {
                        sort = props.order;
                    } else {
                        sort = props.order.dir === "asc" ? "" : "-" + props.order.column;
                    }
                } else {
                    sort = "-ID";
                }
            } else {
                if (sortCol) {
                    sort = (state.order[0].dir === "asc" ? "" : "-") + sortCol.data;
                } else {
                }
            }

            delete params.order;
            params.sort = sort;

            Object.entries(params).forEach(([key, value]) => {
                if (value === true) {
                    params[key] = "1";
                    return;
                }

                if (value === false) {
                    params[key] = "0";
                    return;
                }
            });

            return params;
        };
        grid.ajax.dataFilter = (data) => {
            let resultData;
            if (typeof data === "string") resultData = JSON.parse(data);
            else resultData = data;
            resultData.recordsTotal = resultData.numRows;
            resultData.recordsFiltered = resultData.numRows;

            delete resultData.numRows;

            return resultData;
        };
    } else if (props.data) {
        grid.setData(props.data);
    }

    if (id) {
        registerGrid(id, grid);

        if (tabRegisterGrid) {
            tabRegisterGrid(grid);
        }
    }

    return grid;
};

const id = props.id ?? useId();
const grid = props.dataGrid ?? initGrid();

const state = reactive({
    id: id,
    grid: grid,
    search: grid.external.search,
    preview: {
        showPreview: false,
        row: null,
    },
    editor: {
        show: false,
        id: null,
        shouldRefresh: false,
    },
    filterDialog: {
        show: false,
        data: {},
    },
    columnsSettingDialog: {
        show: false,
    },
    preset: {
        userPresets: [],
    },
    fetchedData: {
        data: null,
        fetched: false,
        error: false,
    },
    rowReorderDialog: {
        show: false,
    },
    parent: props.parent ? props.parent : null,
});

provide("dataGrid", state.grid);
provide("dataGridState", state);

//extended functions
const getCurrentItem = (showWarning = false, returnRows = false) => {
    return state.grid.getCurrentItem(showWarning, returnRows);
};

//search
let searchTimeout = null;
watch(
    () => ({
        search: state.search?.value,
        searchType: state.search?.searchType?.value,
    }),
    (newVal, oldVal) => {
        if (!state.grid.ajax) return;
        clearTimeout(searchTimeout);

        if (Array.isArray(state.search.column)) {
            if (state.search.column.length) {
                if (state.search.column.length === 1) {
                    if (newVal.search) {
                        state.grid.ajax.state[state.search.column[0]] = newVal.search;
                    } else {
                        delete state.grid.ajax.state[state.search.column[0]];
                    }
                } else {
                    if (newVal.search) {
                        state.grid.ajax.state.gridSearch = JSON.stringify([state.search.column.join(","), newVal.search]);
                    } else {
                        delete state.grid.ajax.state.gridSearch;
                    }
                }
            }
        } else if (state.search.column) {
            if (newVal.search) {
                state.grid.ajax.state[state.search.column] = newVal.search;
            } else {
                delete state.grid.ajax.state[state.search.column];
            }
        }

        if (newVal.searchType) {
            state.grid.ajax.state.SearchBy = newVal.searchType;
        } else {
            delete state.grid.ajax.state.SearchBy;
        }

        if (oldVal.searchType !== newVal.searchType && !newVal.search && !oldVal.search) return;

        searchTimeout = setTimeout(() => {
            state.grid.ajax.reload(null, true);
        }, 450);
    },
);

//preview
//TODO pro multiple pokud je vybrane vice  řádků
const showPreview = (row = null) => {
    if (row) {
        state.preview.row = row;
    } else {
        state.preview.row = getCurrentItem(true, true);

        if (Array.isArray(state.preview.row)) {
            state.preview.row = state.preview.row[0];
        }
    }

    if (state.preview.row) {
        state.preview.show = true;
    }
};

//add
const add = () => {
    const parents = state.parent ? (Array.isArray(state.parent) ? state.parent : [state.parent]) : [];
    for (const parent of parents) {
        const parentItemSelected = parent?.ref?.getCurrentItem?.();
        if(!parentItemSelected) {
            alerts.info(translations.SELECT_ROW_TEXT);
            return;
        }
    }

    if (props.editorURL) {
        const { app } = useAppStore(window.pinia);

        const route = {
            name: props.editorURL,
            query: {
                __jolanda_fromGridId: state.id,
                __jolanda_gridParentId: state.parent && typeof state.parent.ref !== "undefined"
                    ? state.parent.ref?.getCurrentItem()[state.parent.parent]
                    : null,
                __jolanda_gridParentCol: state.parent && typeof state.parent.ref !== "undefined"
                    ? state.parent.child
                    : null,
            },
        };

        if(props.editorParams) {
            route.query = { ...route.query, ...props.editorParams };
        }

        app.router.router.push(route);
    } else {
        state.editor.show = true;
        state.editor.id = null;
    }
};

//edit
const edit = (id = null) => {
    state.editor.id = null;

    if (!id) {
        const item = getCurrentItem(true);

        if (!item) {
            return;
        }

        if (Array.isArray(item)) {
            if (item.length > 1) {
                alerts.alert(translations.SELECT_ONLY_ONE);
                return;
            } else if (item.length === 0) {
                alerts.alert(translations.SELECT_ROW, "info", translations.SELECT_ROW_TEXT);
                return;
            }

            state.editor.id = item[0].ID;
        } else {
            state.editor.id = item.ID;
        }

        if (!state.editor.id) {
            return;
        }
    } else {
        state.editor.id = id;
    }

    if (props.editorURL) {
        const { app } = useAppStore(window.pinia);

        app.router.router.push({
            name: props.editorURL,
            query: {
                entity_ID: state.editor.id,
                __jolanda_fromGridId: state.id,
            },
        });
    } else {
        state.editor.show = true;
    }
};

//remove
const remove = () => {
    const selectedRows = state.grid.rows({ selected: true });
    const selectedCount = selectedRows.count();

    if (selectedCount === 0) {
        alerts.alert(translations.SELECT_ROW, "info", translations.SELECT_ROW_TEXT);
        return;
    }
    let count = selectedCount === 1 ? translations.REMOVE_ITEM + "?" : selectedCount + " " + translations.REMOVE_ITEMS + "?";
    if (confirm(translations.REMOVE_QUESTION + " " + count + " [" + props.title + "]")) {
        //TODO
        // if(this.params.dataSaveType === 'local'){
        //     this.grid.rows({selected: true}).remove();
        //     $('#' + this.id + '_counter').text(this.grid.getData().length);
        //     alerts.alert(translations.ITEMS_DELETED, 'success', '');
        //     return;
        // }

        if (props.manager) {
            const ajax = useAjax();
            const { getURLs } = useManager(props.manager);

            if (props.selectType === RowSetting.SELECT_TYPE_SINGLE) {
                let ID = getCurrentItem().ID;

                try {
                    ajax.postForm(
                        getURLs().delete,
                        {
                            data: '{ \"ID\":' + ID + "}",
                        },
                        null,
                        {
                            waitingAlert: {
                                title: translations.DELETING_RECORD + " [ID: " + ID + "]",
                            },
                        },
                    ).then(({ alert, data }) => {
                        state.grid.ajax.reload(null, true);

                        //TODO
                        // if(typeof data.statuses !== 'undefined' && data.statuses.length > 0){
                        //     data.statuses.forEach((status) => {
                        //         alerts.alert('', status.type, status.msg);
                        //
                        //         if(status.afterNotifyFunction){
                        //             if(typeof eval(status.afterNotifyFunction) === 'function')
                        //                 eval(status.afterNotifyFunction+'()');
                        //             else
                        //                 console.warn('Typeof ' + status.afterNotifyFunction + ' is not a function');
                        //         }
                        //     });
                        // }

                        if (data.error) {
                            alert.changeToError(translations.ERROR, data.description);
                        } else {
                            alert.changeToSuccess(translations.ITEMS_DELETED, "");
                        }
                    });
                } catch ({ error, alert }) {
                    alert.changeToError("Chyba při mazání", error.message);
                }
            } else {
                const queue = [];
                let s_count = 0,
                    t_count = 0;
                selectedRows.data().forEach((k) => {
                    t_count++;
                    queue.push(
                        ajax
                            .postForm(
                                getURLs().delete,
                                {
                                    data: '{ \"ID\":' + k.ID + "}",
                                },
                                null,
                                {
                                    waitingAlert: {
                                        title: translations.DELETING_RECORD + " [ID: " + k.ID + "] (" + t_count + "/" + selectedCount + ")",
                                    },
                                },
                            )
                            .then(({ alert, data }) => {
                                //TODO
                                // if(typeof data.statuses !== 'undefined' && data.statuses.length > 0){
                                //     data.statuses.forEach((status) => {
                                //         alerts.alert('ID: ' + k.ID, status.type, status.msg);
                                //
                                //         if(status.afterNotifyFunction){
                                //             if(typeof eval(status.afterNotifyFunction) === 'function')
                                //                 eval(status.afterNotifyFunction+'()');
                                //             else
                                //                 console.warn('Typeof ' + status.afterNotifyFunction + ' is not a function');
                                //         }
                                //     });
                                // }

                                if (data.error) {
                                    alert.changeToError(translations.ERROR, data.description);
                                } else {
                                    s_count++;
                                    alert.changeToSuccess(translations.ITEMS_DELETED, "");
                                }
                            }),
                    );
                });
                Promise.all(queue)
                    .then(() => {
                        state.grid.ajax.reload(null, true);
                        alerts.alert(translations.ITEMS_DELETED, "success", `${s_count} / ${t_count}`);
                    })
                    .catch((error) => {
                        console.error("Chyba při mazání položek:", error);
                        alerts.alert(translations.ERROR_OCCURRED, "error");
                    });
            }
        } else {
            if (props.selectType === RowSetting.SELECT_TYPE_SINGLE) {
                const ID = getCurrentItem().ID;

                const index = state.grid.getData().findIndex((row) => row.ID == ID);

                state.grid._data.splice(index, 1);
            } else {
                const indexesToDelete = selectedRows.map((row) => state.grid.getData().findIndex((r) => r.ID == row.ID)).filter((index) => index !== -1);
                indexesToDelete.sort((a, b) => b - a);

                for (const index of indexesToDelete) {
                    state.grid._data.splice(index, 1);
                }
            }
        }
    }
};

//header custom buttons
const headerActions = computed(() => (parent) => {
    return parent.subItems.filter((item) => item.customProps.header.visibility);
});

//refresh
const refresh = (resetPaging = false) => {
    if (state.grid.ajax) {
        state.grid.ajax.reload(null, resetPaging);
    }
};

//parent
const setAttributesFromParent = (currentItem, parent) => {
    if (Array.isArray(currentItem)) {
        if (currentItem.length > 0) {
            state.grid.ajax.state[parent.child] = currentItem.map((obj) => obj[parent.parent]);
        } else {
            if (Array.isArray(state.parent)) {
                delete state.grid.ajax.state[parent.child];
            } else {
                state.grid.ajax.state[parent.child] = -1;
            }
        }
    } else {
        if (currentItem) {
            state.grid.ajax.state[parent.child] = currentItem[parent.parent];
        } else {
            if (Array.isArray(state.parent)) {
                delete state.grid.ajax.state[parent.child];
            } else {
                state.grid.ajax.state[parent.child] = -1;
            }
        }
    }
};

watch(
    () => props.parent,
    (newVal) => {
        if (newVal) {
            if (Array.isArray(newVal)) {
                const tmp = [];
                newVal.forEach((par) => {
                    tmp.push({
                        ref: undefined,
                        child: "ID",
                        parent: "ID",
                        ...(par ?? {}),
                    });
                });

                state.parent = tmp;
            } else {
                state.parent = {
                    ref: undefined,
                    child: "ID",
                    parent: "ID",
                    ...(newVal ?? {}),
                };
            }
        } else {
            state.parent = null;
        }
    },
);

watch(
    () => {
        const parents = Array.isArray(state.parent) ? state.parent : [state.parent];

        return parents.map((parent) => {
            const ref = parent?.ref;
            const currentItem = typeof ref !== "string" ? ref?.getCurrentItem?.() : null;
            const requestCount = ref?.ajax?._requestCount;

            return { currentItem, requestCount };
        });
    },
    (newVal, oldVal) => {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal) && state.grid.ajax) {
            const parents = Array.isArray(state.parent) ? state.parent : [state.parent];
            newVal.forEach((par, index) => {
                if (parents[index]?.ref) {
                    setAttributesFromParent(par.currentItem, parents[index]);

                    if (waitForParent.value) {
                        return;
                    }

                    if (state.grid.ajax._requestCount === 0) {
                        return;
                    }

                    state.grid.ajax.reload(null, true);
                }
            });
        }
    },
);

const waitForParent = computed(() => {
    if (!state.parent) {
        return false;
    }

    const resolveWaitingParent = (parent) => {
        if (typeof parent?.ref === "string") {
            const grid = getGrid(parent.ref);
            parent.ref = grid;
        }

        if (parent.ref) {
            if (!parent.ref.ajax) {
                return false;
            }

            if (parent.ref.ajax && parent.ref.ajax._requestCount > 0) {
                setAttributesFromParent(parent?.ref?.getCurrentItem(), parent);

                return false;
            }
        }

        return true;
    };

    let wait;
    if (Array.isArray(state.parent)) {
        let allTrue = true;

        state.parent.forEach((par) => {
            const result = resolveWaitingParent(par);

            if (!result) {
                allTrue = false;
            }
        });

        wait = allTrue;
    } else {
        wait = resolveWaitingParent(state.parent);
    }

    return wait;
});

//fetchData
const fetchData = () => {
    if (!props.fetchData) {
        return;
    }

    const ajax = useAjax();
    let url = null;
    if(props.fetchDataUrl) {
        url = props.fetchDataUrl;
    } else {
        const {getURLs} = useManager(props.manager);
        url = getURLs().grid;
    }

    if (!url) {
        console.error("No data-grid url given");
        return;
    }

    try {
        ajax.get(
            url,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
            null,
        ).then(({ data }) => {
            state.fetchedData.data = data?.items ?? null;
            state.fetchedData.fetched = true;
            state.fetchedData.error = false;
        });
    } catch (error) {
        state.fetchedData.error = true;
    }
};

if (props.manager) {
    let managerRefreshTimer = null;
    watch(
        () => props.manager,
        (newVal, oldVal) => {
            if (!isEqual(newVal, oldVal)) {
                if (managerRefreshTimer) {
                    clearTimeout(managerRefreshTimer);
                }

                managerRefreshTimer = setTimeout(() => {
                    state.grid.refresh();
                    clearTimeout(managerRefreshTimer);
                }, 250);
            }
        },
        { deep: true },
    );
}

// multi select column
const isAllRowsSelected = ref(false);

if (props.selectType === RowSetting.SELECT_TYPE_MULTI_CHECKBOX) {
    watch(
        () => state.grid.rows({ selected: true }).count(),
        (newSelectedRows) => {
            isAllRowsSelected.value = state.grid.rows().count() > 0 && state.grid.rows().count() === newSelectedRows;
        },
        // { immediate: true, deep: true }, // Volitelné možnosti
    );
}
const selectAllLabel = () => {
    return h(Checkbox, {
        onClick: (event) => {
            event.stopPropagation();
            state.grid.toogleSelectAllRows();
        },
        checked: isAllRowsSelected.value,
    });
};
provide("columnTypeCheckboxOnChange", (newData, cell) => {
    const data = { ID: cell._row.data().ID };
    data[cell._column.data] = newData ? "1" : "0";

    const { getURLs } = useManager(props.manager);

    const ajax = useAjax();
    ajax.postForm(getURLs().update, {
        data: JSON.stringify(data),
    });
});

//preset
const presetManagerRef = ref(null);

//mount
onMounted(() => {
    registerGrid(state.id, state.grid);

    fetchData();
});

onUnmounted(() => {
    unregisterGrid(state.id);

    if (tabUnregisterGrid) {
        tabUnregisterGrid(state.id);
    }
});

const applyFilter = () => {
    const grid = state.grid;

    if (grid.ajax) {
        Object.entries(state.filterDialog.data).forEach(([key, value]) => {
            if (typeof value === "object" && value !== null) {
                if (Array.isArray(value)) {
                    grid.ajax.state[key] = value;
                    return;
                }

                if (typeof value.from !== "undefined" && value.from !== null && value.from !== "") {
                    grid.ajax.state[key + "From"] = value.from;
                } else {
                    delete grid.ajax.state[key + "From"];
                }

                if (typeof value.to !== "undefined" && value.to !== null && value.to !== "") {
                    grid.ajax.state[key + "To"] = value.to;
                } else {
                    delete grid.ajax.state[key + "To"];
                }

                if (grid.ajax.state[key + "From"] || grid.ajax.state[key + "To"]) {
                    grid.ajax.state[key] = (grid.ajax.state[key + "From"] ?? "") + ":" + (grid.ajax.state[key + "To"] ?? "");
                } else {
                    delete grid.ajax.state[key];
                }
            } else {
                if (typeof value !== "undefined" && value !== null && value !== "") {
                    grid.ajax.state[key] = value;
                } else {
                    delete grid.ajax.state[key];
                }
            }
        });

        grid.ajax.reload(null, true);
        removeEmptyFilters();
    }
};

const removeEmptyFilters = () => {
    Object.entries(state.filterDialog.data).forEach(([key, value]) => {
        if (state.filterDialog.data[key] === null) {
            delete state.filterDialog.data[key];
        }
    });
};
provide("applyFilter", applyFilter);

//export
const exportDataToCSV = (filtered = false) => {
    let data = {};
    if(filtered && state.grid.ajax){
        data = {...state.grid.ajax.state};
        delete data.count;
        delete data.start;
    }

    if (props.manager) {
        const ajax = useAjax();
        const { getURLs } = useManager(props.manager);

        ajax.get(getURLs().list, {
            params: data,
        },
        {
            waitingAlert: {
                title: translations.EXPORT,
            },
        }).then(({ data, alert }) => {
            data = data.items;
            let csvContent = "\uFEFF";
            const separator = ';';
            let header = '';

            data.forEach((row) => {
                let rowData = '';
                let tmpHeader = '';

               state.grid.columns.forEach((v) => {
                    if(v.name === 'actions' || v.name === 'checkbox')
                        return;

                    if(!v.visible)
                        return;

                    if(header === ''){
                        tmpHeader += (typeof v.label === "function" ? v.label() : v.label) + separator;
                    }

                    if(typeof row[v.data] !== 'undefined'){
                        // console.log(v);
                        if(v.enum_values) {
                            if(typeof v.enum_values[row[v.data]] !== 'undefined')
                                rowData += v.enum_values[row[v.data]] + separator;
                            else
                                rowData += '' + separator;
                        }else
                            rowData += v.format.render(row[v.data], true, null) + separator;
                    }else{
                        rowData += '' + separator;
                    }
                });

                if(header === ''){
                    if(tmpHeader !== ''){
                        tmpHeader += "\r\n";
                        header = tmpHeader;
                        csvContent += header;
                    }
                }

                csvContent += rowData + "\r\n";
            });

            var link = document.createElement("a");
            link.id="lnkDwnldLnk";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);

            let blob = new Blob([csvContent], { type: 'text/csv' });
            var csvUrl = window.webkitURL.createObjectURL(blob);
            var filename = state.grid.id + '-' + Math.round(Date.now()/1000);  + '.csv';
            link.setAttribute("download", filename);
            link.setAttribute("href", csvUrl);

            link.click();
            document.body.removeChild(link);

            alert.changeToSuccess();
        }).catch(({ error, alert}) => {
            alert.changeToError(translations.EXPORT, error.message);
        });
    }
}

//active filters count
const activeFiltersCount = computed(() => {
    let count = 0;

    Object.entries(state.filterDialog.data).forEach(([key, value]) => {
        if (state.filterDialog.data.hasOwnProperty(key) && state.filterDialog.data[key] !== null) {
            if(typeof state.filterDialog.data[key] === "object" && state.filterDialog.data[key].from === null && state.filterDialog.data[key].to === null) {
                return;
            }
            count++;
        }
    });

    return count;
});

const actionColumnWidth = computed(() => {
    let actionCount = 0;
    if(props.preview)
        actionCount++;

    if(props.enabledActions?.edit)
        actionCount++;

    if(props.enabledActions?.remove)
        actionCount++;

    if(state.grid.contextMenu?.items?.length) {
        actionCount += state.grid.contextMenu?.items.reduce((acc, item) => {
            if(item.customProps.row)
                acc++;

            return acc;
        }, 0)
    }

    return actionCount * 30 + ((actionCount - 1) * 10) + 13;
})

//Expose
defineExpose({
    ...state,
    getCurrentItem,
    getCurrentItemValue: state.grid.getCurrentItemValue,
    ajax: state.grid.ajax,
});

// watch(
//     () => state.grid,
//     async (newVal, oldVal) => {
//         if (!oldVal && newVal && newVal.ajax) {
//             await nextTick();
//             setTimeout(() => {
//                 debugger;
//             }, 500);
//             // newVal.refresh(true);
//         }
//     },
//     { immediate: true },
// );
</script>

<template>
    <div class="dataTable-package" v-if="!waitForParent">
        <div>
            <!--            <div class="col-12 grid-switches" v-if="(gridDef.def.class == 'Grid' || gridDef.class == 'GridVue') && gridDef.def.getSwitchesForm().getParent().hasControls()">-->
            <!--                <FormComponent :form="gridDef.def.getSwitchesForm().getParent()" />-->
            <!--                &lt;!&ndash;                {$grid->getSwitchesForm()->getParent()->render()}&ndash;&gt;-->
            <!--            </div>-->

            <!--        //TODO active filters bar-->
            <div class="flex justify-between items-center flex-wrap gap-2">
                <div class="grid-title text-nowrap flex items-center">
                    <h3>
                        {{ props.title }}
                    </h3>
                    <Tag class="ml-2" light>{{ helper.numberFormat(state.grid.ajax ? state.grid.ajax.totalCount : state.grid._data.length, 0, ",", " ") }}</Tag>
                    <!-- <div>
                        <span class="ml-2">(<span>{{ state.grid.ajax ? state.grid.ajax.totalCount : state.grid._data.length }}</span>)</span>
                        <span v-if="selectedCount">[{{ translations.SELECTED }} <span>{{ selectedCount }}</span> {{ translations.RECORDS }}]</span>
                    </div> -->
                </div>
                <div class="col-sm-auto grid-controls flex flex-wrap gap-2 justify-end ml-auto">
                    <div class="main-buttons flex gap-2" :class="{ 'order-2': layout?.state?.isMobile }">
                        <Button v-if="props.preview" variant="orange" icon="search" size="small" @click="showPreview()" :iconOnly="!props.actionLabels">
                            {{ props.actionLabels ? translations.PREVIEW : "" }}
                        </Button>
                        <Button v-if="props.enabledActions?.add" variant="green" icon="plus" size="small" @click="add()" :iconOnly="!props.actionLabels">
                            {{ props.actionLabels ? translations.ADD : "" }}
                        </Button>
                        <Button v-if="props.enabledActions?.edit" variant="orange" icon="edit" size="small" @click="edit()" :iconOnly="!props.actionLabels">
                            {{ props.actionLabels ? translations.EDIT : "" }}
                        </Button>
                        <Button v-if="props.enabledActions?.remove" variant="red" icon="delete" size="small" @click="remove()" :iconOnly="!props.actionLabels">
                            {{ props.actionLabels ? translations.REMOVE : "" }}
                        </Button>
                    </div>
                    <div class="custom-buttons flex flex-wrap gap-2" v-if="state.grid.contextMenu?.items?.length" :class="{ 'order-1': layout?.state?.isMobile }">
                        <template v-for="action in state.grid.contextMenu?.items" :key="action.id">
                            <Button v-if="action.customProps.header.visibility && !headerActions(action)?.length" :icon="action.customProps.header.icon" variant="default" size="small" @click="action.onClick('header')" :class="action.customProps.header.class">
                                {{ action.label }}
                            </Button>
                            <Popover v-else-if="action.customProps.header.visibility">
                                <Button
                                    variant="default"
                                    size="small"
                                    :class="{
                                        'dropdown-toggle': true,
                                        ...action.customProps.header.class,
                                    }"
                                    icon="arrow"
                                    :iconProps="{
                                        direction: 'bottom',
                                    }"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                    @click="action.onClick(state.grid, 'header')"
                                >
                                    {{ action.label }}
                                </Button>

                                <template #panel="{ close }">
                                    <div class="p-[5px] dropdown-menu border border-outline dark:border-dark bg-white dark:bg-dark-bg">
                                        <div
                                            v-for="(subaction, index) in headerActions(action)"
                                            :key="subaction.id"
                                            class="dropdown-item p-[6px] px-[10px] cursor-pointer border-outline! dark:border-dark! hover:bg-primary-200/80 dark:hover:bg-medium/50 font-medium rounded-sm"
                                            @click="
                                                () => {
                                                    subaction.onClick(state.grid, 'header');
                                                    close();
                                                }
                                            "
                                        >
                                            <span class="text-[0.9rem]">
                                                {{ subaction.label }}
                                            </span>
                                        </div>
                                    </div>
                                </template>
                            </Popover>
                        </template>
                    </div>
                    <div class="control-buttons flex gap-2" :class="{ 'order-3': layout?.state?.isMobile }">
                        <Button v-if="props.rowReorder" variant="white" icon="state" size="small" @click="state.rowReorderDialog.show = true" outline> </Button>
                        <Button v-if="props.refresh" variant="white" icon="refresh" size="small" @click="refresh()" outline> </Button>
                        <Button v-if="props.filter && activeFiltersCount > 0" variant="white" icon="filter" size="small" @click="state.filterDialog.show = true" outline class="relative" iconDirection="left">
                            <Tag light>
                                {{ activeFiltersCount }}
                            </Tag>
                        </Button>
                        <Button v-else-if="props.filter" variant="white" icon="filter" size="small" @click="state.filterDialog.show = true" outline class="relative"></Button>
                        <Button v-if="props.columnsSetting" variant="white" icon="gear" size="small" @click="state.columnsSettingDialog.show = true" outline> </Button>
                        <Popover :popper="{ placement: 'bottom-start' }" v-if="state.grid && state.grid.presetManager && (!props.fetchData || (props.fetchData && state.fetchedData.fetched))">
                            <Button variant="white" icon="project" size="small" outline />

                            <template #panel>
                                <div class="content p-2">
                                    <div class="header text-center">
                                        <h3>{{ translations.PRESETS }}</h3>
                                    </div>
                                    <div class="presets">
                                        <div class="flex justify-between mb-2 mt-1 gap-2">
                                            <Button @click="presetManagerRef.resetToDefault()" variant="gray">{{ translations.PRESET_DEFAULT }}</Button>
                                            <Button variant="green" @click="presetManagerRef.showAddDialog()">{{ translations.ADD }}</Button>
                                        </div>
                                        <hr class="mb-2" />
                                        <div class="user-presets">
                                            <div class="preset-row mb-1" v-for="state in presetManagerRef.userStates">
                                                <div @click="presetManagerRef.changeState(state.id)" class="flex items-center gap-4 justify-between rounded-md px-[8px] py-[4px] border-1 border-outline dark:border-outline/20 hover:bg-outline dark:hover:bg-outline/20 cursor-pointer">
                                                    <div>
                                                        {{ state.name }}
                                                    </div>
                                                    <div class="buttons flex gap-2">
                                                        <Button :tooltip="translations.RENAME" icon="edit" @click.stop="presetManagerRef.showRenameDialog(state)" size="small"></Button>
                                                        <Button :tooltip="translations.UPDATE" icon="refresh" @click.stop="presetManagerRef.updateState(state.id)" size="small"></Button>
                                                        <Button :tooltip="translations.REMOVE" icon="delete" @click.stop="presetManagerRef.removeState(state.id)" size="small"></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </Popover>
                    </div>
                </div>
            </div>
            <div v-if="state.search" class="mt-2">
                <Row>
                    <Col cols="2" class="gridSearchTypeSelect" v-if="state.search.searchType">
                        <Select v-model="state.search.searchType.value" :options="state.search.searchType.options ?? []" />
                    </Col>
                    <Col :cols="state.search.searchType ? 10 : 12">
                        <div class="dataTable-search">
                            <InputField type="text" v-model="state.search.value" :placeholder="state.search.placeholder ?? ''" :showClear="true" icon="search" />
                        </div>
                    </Col>
                </Row>
            </div>
            <div v-if="props.filter && activeFiltersCount > 0">
                <ActiveFilters />
            </div>
        </div>
        <Grid v-if="state.grid" :data-grid="state.grid" class="new-data-grid" :id="state.id">
            <template #columns>
                <Column width="35" v-if="state.grid.settings.row.selectType === 'multi_checkbox' && (!props.fetchData || (props.fetchData && state.fetchedData.fetched))" :label="selectAllLabel" :orderable="false" :filter="false" :preview="false" :overflow-preview="false">
                    <template #cell="{ cell }">
                        <div class="flex items-center justify-center">
                            <Checkbox
                                class="w-[16px]"
                                :checked="cell.row.isSelected()"
                                @click.stop="() => {}"
                                @change="
                                    () => {
                                        cell.row.toggleSelect({ ctrlKey: true });
                                    }
                                "
                            />
                        </div>
                    </template>
                </Column>

                <slot name="columns" v-if="!props.fetchData || (props.fetchData && state.fetchedData.fetched)" :fetchedData="state.fetchedData.data" :grid="state.grid"> </slot>

                <Column v-if="props.actionsColumn && (!props.fetchData || (props.fetchData && state.fetchedData.fetched)) && (props.enabledActions?.edit || props.enabledActions?.remove || props.preview)" :width="actionColumnWidth" :label="translations.ACTION" :overflow-preview="false" :orderable="false" :filter="false" :preview="false">
                    <template #cell="{ cell }">
                        <div class="flex gap-2 px-2">
                            <Button v-if="props.preview" variant="white" icon="search" size="small" @click="showPreview(cell.row)" iconOnly outline />
                            <Button v-if="props.enabledActions?.edit" variant="white" icon="edit" size="small" @click="edit(cell.row.data().ID)" iconOnly outline />
                            <Button v-if="props.enabledActions?.remove" variant="white" icon="delete" size="small" @click="remove(cell.row.data().ID)" iconOnly outline />
                            <template v-if="state.grid.contextMenu?.items?.length" v-for="action in state.grid.contextMenu?.items">
                                <Button v-if="action.customProps.row" :icon="action.customProps.header.icon" variant="white" size="small" @click="action.onClick('header')" iconOnly outline />
                            </template>
                        </div>
                    </template>
                </Column>
            </template>
            <template #actions>
                <slot name="actions" v-if="!props.fetchData || (props.fetchData && state.fetchedData.fetched)" :fetchedData="state.fetchedData.data" :grid="state.grid"></slot>
                <Action v-if="props.exportAction" :label="translations.EXPORT">
                    <Action :label="translations.EXPORT_CSV_ALL" @click="exportDataToCSV()" />
                    <Action :label="translations.EXPORT_CSV_FILTER" @click="exportDataToCSV(true)" />
                </Action>
            </template>
        </Grid>
        <PresetManager v-if="state.grid && state.grid.presetManager && (!props.fetchData || (props.fetchData && state.fetchedData.fetched))" ref="presetManagerRef" />
        <RowReorderModal
            v-if="state.rowReorderDialog.show"
            :reorder-column="props.rowReorder.column"
            :columns="props.rowReorder.tableColumns"
            @close="
                state.rowReorderDialog.show = false;
                state.grid.refresh();
            "
        />
        <Preview
            v-if="state.preview.show"
            :row="state.preview.row"
            @close="
                state.preview.show = false;
                state.preview.row = null;
            "
        />
        <Modal
            v-bind="props.editorModal"
            v-if="state.editor.show && $slots.editorDialog"
            :is-visible="state.editor.show"
            @close="
                () => {
                    if (state.editor.shouldRefresh) {
                        state.grid.refresh();
                    }

                    state.editor.shouldRefresh = false;
                    state.editor.show = false;
                }
            "
        >
            <template #body>
                <!--                <slot-->
                <!--                    name="editorDialog"-->
                <!--                    :id="state.editor.id"-->
                <!--                    :state="typeof state.parent.ref !== 'undefined' ? {-->
                <!--                        [state.parent.child]: state.parent.ref?.getCurrentItem()[state.parent.parent],-->
                <!--                    } : {}"-->
                <!--                />-->
                <slot name="editorDialog" :id="state.editor.id" :grid="state.grid" />
            </template>
        </Modal>
        <FilterDialog v-if="state.filterDialog.show">
            <template #default="{ data }">
                <slot name="filter" :data="data"></slot>
            </template>
        </FilterDialog>
        <ColumnSettingsDialog v-if="state.columnsSettingDialog.show" />
    </div>
    <div class="dataTable-package waiting-placeholder relative" v-else>
        <div class="grid-title">
            {{ props.title }}
        </div>
        <div class="min-h-10 relative">
            <Loader />
        </div>
    </div>
</template>

<style scoped>
.waiting-placeholder {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;

    .grid-title {
        min-width: auto;
    }

    .block-loader {
        display: flex;
        opacity: 1;
    }
}

.dropdown-item:not(:first-of-type) {
    border-top: 1px solid;
}
</style>
