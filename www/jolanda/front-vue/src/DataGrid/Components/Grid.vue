<script setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, watch } from "vue";
import GridComponent from "@/DataGrid/Components/Table/Grid.vue";
import Grid from "@/DataGrid/js/Grid";
import SubGrid from "@/DataGrid/js/SubGrid";
import GridMapper from "../js/Mappers/GridMapper";
import FormComponent from "../../Components/OldForm/Components/Form.vue";
import GridDef from "@/DataGrid/js/GridDef";
import SubGridDef from "@/DataGrid/js/SubGridDef";
import DialogComponent from "../../Components/Dialog/Components/Dialog.vue";
import Dialog from "../../Components/Dialog/js/Dialog";
import { useTranslations } from "@/Composables/useTranslation.js";
import { gridProps } from "@/DataGrid/js/useGrid-old";
import Modal from "@/Components/Modal/Modal.vue";

const props = defineProps({
    json: String,
    grid: Object,

    //Def from slots
    id: String,
    title: String,
    url: String,
    dataListURL: String,
    deleteURL: String,
    updateURL: String,
    createURL: String,
    fetchDataURL: String,
    editorURL: String,
    inlineEditURL: String,
    enabledActions: Object,
    hasFilter: Boolean,
    rowFormatter: Function,
    filterDefault: Boolean,
    height: [String, Number],
    preview: Boolean,
    oneMustBeSelected: Boolean,
    enableControls: {
        type: Boolean,
        default: true,
    },
    search: Object,
    dataSaveType: [String, Object],
    relationSwitcher: Object,
    order: [String, Object],
    selectType: [String, Object],
    fetchData: Boolean,

    //parent
    ...gridProps,
});

const gridDef = reactive({ def: !props.json ? props.grid : GridMapper.map(props.json) });

// if(gridDef.def){
//     if(gridDef.hasFilter()){
//         gridDef.generateFilter();
//     }
//
//     window[gridDef.id] = null;
// }

const isGridInited = ref(false);
const grid = ref(null);
const quickEditor = ref(null);

//Data fetch
const fetchedData = ref(null);

//Def from slots
const instance = getCurrentInstance();

const createDefFromSlots = async () => {
    const def = new GridDef(props.id, props.title);

    if (typeof props.url === "string") {
        def.setUrl(props.url);
    } else if (typeof props.url === "object") {
        def.setUrl(props.url.url, props.url.params);
    } else if (typeof props.store !== "undefined") {
        def.setupStore(props.store);
    }

    props.dataListURL && def.setDatalistUrl(props.dataListURL);
    props.deleteURL && def.setDeleteUrl(props.deleteURL);
    props.updateURL && def.setUpdateUrl(props.updateURL);
    props.createURL && def.setCreateUrl(props.createURL);
    props.fetchDataURL && (def.definitionData_url = props.fetchDataURL);
    props.editorURL && def.setEditAction(props.editorURL);
    props.inlineEditURL && def.setInlineEditAction(props.inlineEditURL);
    props.enabledActions && def.setEnabledActions(props.enabledActions.add ?? true, props.enabledActions.edit ?? true, props.enabledActions.remove ?? true);
    typeof props.hasFilter !== "undefined" && def.setHasFilter(props.hasFilter);
    props.rowFormatter && def.setRowFormatter(props.rowFormatter);
    typeof props.filterDefault !== "undefined" && def.setFilterDefault(props.filterDefault);
    props.height && def.setHeight(props.height);
    typeof props.preview !== "undefined" && def.enablePreview(props.preview);
    typeof props.oneMustBeSelected !== "undefined" && def.oneMustBeSelected(props.oneMustBeSelected);
    typeof props.enableControls !== "undefined" && (def.enable_controls = props.enableControls);

    if (props.search && typeof props.search === "object") {
        def.enableSearch(props.search.column, props.search.placeholder, props.search.searchType);
    }

    if (props.dataSaveType) {
        if (typeof props.dataSaveType === "object") {
            def.setDataSaveType(props.dataSaveType.type, props.dataSaveType.params);
        } else {
            def.setDataSaveType(props.dataSaveType);
        }
    }

    if (props.relationSwitcher) {
        def.enableRelationSwitcher(props.relationSwitcher.title, props.relationSwitcher.sourceUrl, props.relationSwitcher.relationsUrl, props.relationSwitcher.parentColumn, props.relationSwitcher.childColumn, props.relationSwitcher.childNameColumn, props.relationSwitcher.params, props.relationSwitcher.groupByColumn, props.relationSwitcher.groupByNameColumn);
    }

    if (props.order) {
        if (typeof props.order === "object") {
            def.setOrder(props.order.column, props.order.direction);
        } else if (typeof props.order === "string") {
            def.setOrder(props.order);
        }
    }

    if (props.selectType) {
        if (typeof props.selectType === "string") {
            def.setSelect(props.selectType);
        } else if (typeof props.selectType === "object") {
            def.setSelect(props.selectType.type, props.selectType.multipleType);
        }
    }

    if (props.fetchData) {
        fetchedData.value = await def.fetchDefinitionData();
    }

    processColumns(def);
    processActions(def);
    processQuickeditor(def);

    if (def.hasFilter()) {
        def.generateFilter();
    }

    return def;
};

const processQuickeditor = (def) => {
    const quickeditorSlot = instance?.slots?.quickeditor;

    if (quickeditorSlot) {
        // Vykreslení slotu jako VNode
        const renderedQuickeditor = quickeditorSlot({ data: fetchedData.value });

        def.setQuickEditorComponent(renderedQuickeditor[0]);
    }
};

const processActions = (def) => {
    const actionsSlot = instance?.slots?.actions;

    if (actionsSlot) {
        // Vykreslení slotu jako VNode
        const renderedActions = actionsSlot({ data: fetchedData.value });

        const createActions = (vnode, parent = null) => {
            const attrs = vnode.props;

            if (vnode.type === "Action") {
                let action = null;
                if (parent === null) {
                    action = def.addAction(attrs.id, attrs.label, attrs.onclick, attrs.visibility);
                } else {
                    action = parent.addSubAction(attrs.ud, attrs.label, attrs.onclick, attrs.visibility);
                }

                if (vnode.ref) {
                    vnode.ref.i.setupState[vnode.ref.r] = action;
                }

                vnode.children?.forEach((child) => {
                    createActions(child, action);
                });
            }
        };

        // Zpracování každého VNode sloupce
        renderedActions.forEach((vnode) => {
            createActions(vnode);
        });
    }
};

const processColumns = (def) => {
    // Přístup k obsahu slotu "columns"
    const columnsSlot = instance?.slots?.columns;

    const mapColumnType = (type) => {
        switch (type) {
            case "ColumnID":
                return GridDef.COLUMN_ID;
            case "ColumnText":
                return GridDef.COLUMN_TEXT;
            case "ColumnNumber":
                return GridDef.COLUMN_NUMBER;
            case "ColumnCurrency":
                return GridDef.COLUMN_CURRENCY;
            case "ColumnBool":
                return GridDef.COLUMN_BOOL;
            case "ColumnDate":
                return GridDef.COLUMN_DATE;
            case "ColumnTime":
                return GridDef.COLUMN_TIME;
            case "ColumnDateTime":
                return GridDef.COLUMN_DATETIME;
            case "ColumnTimestamp":
                return GridDef.COLUMN_TIMESTAMP;
            case "ColumnEnum":
                return GridDef.COLUMN_ENUM;
            case "ColumnEntity":
                return GridDef.COLUMN_ENTITY;
            case "ColumnCustom":
                return GridDef.COLUMN_CUSTOM;
            case "ColumnCheckbox":
                return GridDef.COLUMN_CHECKBOX;
            case "ColumnEditbox":
                return GridDef.COLUMN_EDITBOX;
            case "ColumnCombobox":
                return GridDef.COLUMN_COMBOBOX;
            case "ColumnCounter":
                return GridDef.COLUMN_COUNTER;
            case "ColumnPercentage":
                return GridDef.COLUMN_PERCENTAGE;
            case "ColumnCurrencyEUR":
                return GridDef.COLUMN_CURRENCY_EUR;
            case "ColumnCurrencyCZK":
                return GridDef.COLUMN_CURRENCY_CZK;
            case "ColumnCurrencyUSD":
                return GridDef.COLUMN_CURRENCY_USD;
            case "ColumnCurrencyGBP":
                return GridDef.COLUMN_CURRENCY_GBP;
            case "ColumnCurrencyPLN":
                return GridDef.COLUMN_CURRENCY_PLN;
            case "ColumnLongText":
                return GridDef.COLUMN_LONGTEXT;
            default:
                return null;
        }
    };

    if (columnsSlot) {
        // Vykreslení slotu jako VNode
        const renderedColumns = columnsSlot({ data: fetchedData.value });

        const processNode = (vnode) => {
            const attrs = vnode.props;

            const columnType = mapColumnType(vnode.type);

            if (columnType === null) {
                if (!vnode?.type) {
                    return;
                }

                if (typeof vnode.type === "symbol") {
                    if (Array.isArray(vnode.children)) {
                        vnode.children?.forEach((child) => {
                            processNode(child);
                        });
                    }
                    return;
                }

                console.error("ColumnType [" + vnode.type + "] does not exist. Skipping this column");
                return;
            }

            const column = def.addColumn(columnType, attrs.data, attrs.label, attrs.width ?? null);

            if (column && attrs) {
                if (typeof attrs.formatFunction !== "undefined" || typeof attrs.format !== "undefined") {
                    column.setFormatFunction(attrs.formatFunction || attrs.format);
                }

                if (typeof attrs.enumValues !== "undefined") {
                    column.setEnumValues(attrs.enumValues);
                }

                if (typeof attrs.entity !== "undefined") {
                    //TODO
                    // column.setEntity(foreignRelationColumn, foreignValueColumn, store);
                }

                if (typeof attrs.filter !== "undefined") {
                    column.setFilter(attrs.filter);
                }

                if (typeof attrs.editable !== "undefined") {
                    if (typeof attrs.editable === "boolean") {
                        column.setEditable(attrs.editable);
                    } else if (typeof attrs.editable === "object") {
                        column.setEditable(attrs.editable.editable, attrs.editable.editType, attrs.editable.editParams);
                    }
                }

                if (typeof attrs.visible !== "undefined") {
                    column.setVisible(attrs.visible);
                }

                if (typeof attrs.help !== "undefined") {
                    column.setHelp(attrs.help);
                }
            }

            if (vnode.ref) {
                vnode.ref.i.setupState[vnode.ref.r] = column;
            }
        };

        // Zpracování každého VNode sloupce
        renderedColumns.forEach((vnode) => {
            processNode(vnode);
        });
    }
};

const initGrid = () => {
    if (gridDef.def instanceof SubGridDef) {
        window[gridDef.def.id] = reactive(new SubGrid(gridDef.def));
    } else if (gridDef.def instanceof GridDef) {
        window[gridDef.def.id] = reactive(new Grid(gridDef.def));
    }

    grid.value = window[gridDef.def.id];

    if (quickEditor.value) {
        grid.value.editor.editor = quickEditor.value;
        // grid.value.editor.dialog = quickEditor.value.dialog;
    }

    isGridInited.value = true;
};

//Depends
if (props?.parent) {
    if (!props.parent.hasOwnProperty("grid") || !props.parent.column) {
        throw new Error("Parent grid and column must be set");
    }
}

const reactiveDepends = computed(() => {
    const depends = [...(props?.depends ?? [])];

    // Kontrola, zda už parent není v seznamu (porovnáváme hodnotu ref)
    if (props?.parent && !depends.some((dep) => dep === props.parent.grid || dep?.value === props.parent?.grid.value)) {
        depends.push(props.parent.grid); // Přidáme parent do depends
    }

    return depends;
});

watch(
    reactiveDepends,
    async (newDepends) => {
        if (gridDef.def) {
            return;
        }

        if (newDepends.every((dep) => dep)) {
            gridDef.def = await createDefFromSlots();

            if (props?.parent) {
                gridDef.def.setParentGrid(props.parent.grid, props.parent.column, props.parent.child ?? "ID");
            }

            if (props?.onAfterCreate && typeof props.onAfterCreate === "function") {
                props.onAfterCreate(gridDef.def);
            }
        }

        if (gridDef.def && !grid.value) {
            initGrid();
        }
    },
    { immediate: true }, // Spustí se i při první hodnotě
);

onMounted(async () => {
    // if(!gridDef.def){
    //     gridDef.def = await createDefFromSlots();
    // }

    if (gridDef.def && !grid.value) {
        initGrid();
    }
});

defineExpose({
    grid,
    gridDef,
});

const filterDialog = reactive(new Dialog());
const { translations } = useTranslations();

const columnSettingsDialog = reactive(new Dialog());

const setGridEditorRef = (quickEditorRef) => {
    if (grid.value && grid.value.editor) {
        grid.value.editor.editor = quickEditorRef;
    }
};

const _eval = (fnc) => {
    eval(fnc);
};
</script>

<template>
    <div v-if="gridDef.def">
        <div class="dataTable-package">
            <div class="row align-items-center justify-content-between">
                <div class="col-12 grid-switches" v-if="(gridDef.def.class == 'Grid' || gridDef.class == 'GridVue') && gridDef.def.getSwitchesForm().getParent().hasControls()">
                    <FormComponent :form="gridDef.def.getSwitchesForm().getParent()" />
                    <!--                {$grid->getSwitchesForm()->getParent()->render()}-->
                </div>
                <div class="col-12" v-if="gridDef.def.getSearch()">
                    <div class="row no-gutters">
                        <div class="col-2 gridSearchTypeSelect" v-if="gridDef.def.getSearch()[2]">
                            <select name="grid_search_type" :id="gridDef.def.getId() + '-search-type'">
                                <option v-for="(value, index) in gridDef.def.getSearch()[2]" :value="value" :key="index" :selected="index === 0">
                                    {{ value }}
                                </option>
                            </select>
                        </div>
                        <div
                            :class="{
                                'col-10': gridDef.def.getSearch()[2],
                                'col-12': !gridDef.def.getSearch()[2],
                            }"
                        >
                            <div class="dataTable-search" :id="gridDef.def.getId() + '-search'">
                                <i class="ci ci-search"></i>
                                <!--                            <input type="text" :name="grid.getSearch()[0]" :placeholder="grid.getSearch()[1]" value="{$_GET['search']??''}"> dodelat value=-->
                                <input type="text" :name="gridDef.def.getSearch()[0]" :placeholder="gridDef.def.getSearch()[1]" />
                                <span class="cancel ci ci-times" onclick="$(this).prev().val('');$(this).prev().trigger('keyup')"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 active_filters d-none" :id="gridDef.def.getId() + '_active_filters'">
                    <div class="wrapper">
                        <div class="title">
                            <div class="green-dot"></div>
                            <div>{{ translations.ACTIVE_FILTERS }}</div>
                        </div>
                        <div class="filters-wrapper">
                            <div class="reset">
                                Zrušit filtry
                                <div aria-hidden="true" class="counter">3</div>
                            </div>
                            <div class="filters"></div>
                        </div>
                    </div>
                </div>
                <div class="col-12 grid-switches" v-if="(gridDef.def.class == 'SubGrid' || gridDef.def.class == 'SubGridVue') && gridDef.def.getSwitchesForm().getParent().hasControls()">
                    <FormComponent :form="gridDef.def.getSwitchesForm().getParent()" />
                </div>
                <div class="col-12 col-sm-auto grid-title">
                    {{ gridDef.def.getTitle() }} (<span :id="gridDef.def.getId() + '_counter'"></span>) <span class="d-none">[{{ translations.SELECTED }} <span :id="gridDef.def.getId() + '_multipleSelectCount'"></span> {{ translations.RECORDS }}]</span>
                </div>
                <div class="col-12 col-sm-auto grid-controls">
                    <div class="main-buttons">
                        <button v-if="gridDef.def.isPreview()" class="btn btn-yellow" @click="grid.preview()" type="button"><i class="ci ci-search btn-ci"></i>{{ translations.PREVIEW }}</button>
                        <template v-if="gridDef.def.getEnabledActions()['add'] && gridDef.def.getBaseActions()['add'].visibility['header'] && (gridDef.def.getEditAction() !== null || gridDef.def.getQuickeditAction() !== null || ((gridDef.def.class === 'SubGrid' || gridDef.def.class === 'SubGridVue') && gridDef.def.getQuickEditor() != null))">
                            <template v-if="gridDef.def.getBaseActions()['add'].subactions.length === 0">
                                <button v-bind="gridDef.def.getBaseActions()['add'].headerButton.attributes" :title="gridDef.def.getBaseActions()['add'].help_text" v-html="gridDef.def.getBaseActions()['add'].headerButton.html" :onclick="null" @click="grid.add()"></button>
                            </template>
                            <template v-else>
                                <div class="dropdown">
                                    <button
                                        v-bind="gridDef.def.getBaseActions()['add'].headerButton.attributes"
                                        :title="gridDef.def.getBaseActions()['add'].help_text"
                                        v-html="gridDef.def.getBaseActions()['add'].headerButton.html"
                                        :class="{
                                            'dropdown-toggle': true,
                                        }"
                                        data-toggle="dropdown"
                                        aria-expanded="false"
                                    ></button>
                                    <div class="dropdown-menu">
                                        <a v-for="(subaction, index) in gridDef.def.getBaseActions()['add'].subactions" :key="index" :href="'javascript:' + subaction.onclick ?? ''" :id="subaction.id + '_context'" class="dropdown-item">
                                            {{ subaction.label }}
                                        </a>
                                    </div>
                                </div>
                            </template>
                        </template>
                        <template v-if="gridDef.def.getEnabledActions()['edit'] && gridDef.def.getBaseActions()['edit'].visibility['header'] && (gridDef.def.getEditAction() !== null || gridDef.def.getQuickeditAction() !== null || ((gridDef.def.class === 'SubGrid' || gridDef.def.class === 'SubGridVue') && gridDef.def.getQuickEditor() != null))">
                            <template v-if="gridDef.def.getBaseActions()['edit'].subactions.length === 0">
                                <button v-bind="gridDef.def.getBaseActions()['edit'].headerButton.attributes" :title="gridDef.def.getBaseActions()['edit'].help_text" v-html="gridDef.def.getBaseActions()['edit'].headerButton.html" :onclick="null" @click="grid.edit()"></button>
                            </template>
                            <template v-else>
                                <div class="dropdown">
                                    <button
                                        v-bind="gridDef.def.getBaseActions()['edit'].headerButton.attributes"
                                        :title="gridDef.def.getBaseActions()['edit'].help_text"
                                        v-html="gridDef.def.getBaseActions()['edit'].headerButton.html"
                                        :class="{
                                            'dropdown-toggle': true,
                                        }"
                                        data-toggle="dropdown"
                                        aria-expanded="false"
                                    ></button>
                                    <div class="dropdown-menu">
                                        <a v-for="(subaction, index) in gridDef.def.getBaseActions()['add'].subactions" :key="index" :href="'javascript:' + subaction.onclick ?? ''" :id="subaction.id + '_context'" class="dropdown-item">
                                            {{ subaction.label }}
                                        </a>
                                    </div>
                                </div>
                            </template>
                        </template>
                        <template v-if="gridDef.def.getEnabledActions()['remove'] && gridDef.def.getBaseActions()['remove'].visibility['header']">
                            <template v-if="gridDef.def.getBaseActions()['remove'].subactions.length === 0">
                                <button v-bind="gridDef.def.getBaseActions()['remove'].headerButton.attributes" :title="gridDef.def.getBaseActions()['remove'].help_text" v-html="gridDef.def.getBaseActions()['remove'].headerButton.html" :onclick="null" @click="grid.remove()"></button>
                            </template>
                            <template v-else>
                                <div class="dropdown">
                                    <button
                                        v-bind="gridDef.def.getBaseActions()['remove'].headerButton.attributes"
                                        :title="gridDef.def.getBaseActions()['remove'].help_text"
                                        v-html="gridDef.def.getBaseActions()['remove'].headerButton.html"
                                        :class="{
                                            'dropdown-toggle': true,
                                        }"
                                        data-toggle="dropdown"
                                        aria-expanded="false"
                                    ></button>
                                    <div class="dropdown-menu">
                                        <a v-for="(subaction, index) in gridDef.def.getBaseActions()['add'].subactions" :key="index" :href="'javascript:' + subaction.onclick ?? ''" :id="subaction.id + '_context'" class="dropdown-item">
                                            {{ subaction.label }}
                                        </a>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                    <div class="custom-buttons">
                        <template v-for="[id, action] in Object.entries(gridDef.def.getActions())">
                            <template v-if="action.visibility['header']">
                                <template v-if="action.subactions.length === 0">
                                    <button
                                        v-bind="action.headerButton.attributes"
                                        :title="action.help_text"
                                        :onclick="null"
                                        @click="
                                            () => {
                                                typeof action.onclick === 'function' ? action.onclick(grid) : typeof action.onclick === 'string' ? _eval(action.onclick) : null;
                                            }
                                        "
                                    >
                                        {{ action.headerButton.content }}
                                    </button>
                                </template>
                                <template v-else>
                                    <div class="dropdown">
                                        <button
                                            v-bind="action.headerButton.attributes"
                                            :title="action.help_text"
                                            v-html="action.headerButton.html"
                                            :class="{
                                                'dropdown-toggle': true,
                                            }"
                                            data-toggle="dropdown"
                                            aria-expanded="false"
                                        ></button>
                                        <div class="dropdown-menu">
                                            <a
                                                v-for="(subaction, index) in action.subactions"
                                                :key="index"
                                                :href="'javascript:' + subaction.onclick ?? ''"
                                                :id="subaction.id + '_context'"
                                                class="dropdown-item"
                                                :onclick="null"
                                                @click="
                                                    () => {
                                                        typeof subaction.onclick === 'function' ? subaction.onclick(grid) : typeof subaction.onclick === 'string' ? _eval(subaction.onclick) : null;
                                                    }
                                                "
                                            >
                                                {{ subaction.label }}
                                            </a>
                                        </div>
                                    </div>
                                </template>
                            </template>
                        </template>
                    </div>
                    <div class="control-buttons">
                        <template v-if="gridDef.def.hasControlsEnabled()">
                            <button v-if="gridDef.def.hasRefreshEnabled()" type="button" class="btn btn-icon" @click="grid.refresh()" data-toggle="bstooltip" :title="translations.REFRESH"><i class="ci ci-refresh"></i></button>
                            <button v-if="gridDef.def.hasFilter()" type="button" :id="gridDef.def.getId() + '_filterbutton'" class="btn btn-icon filter-button" @click="filterDialog.show()" data-toggle="bstooltip" :title="translations.FILTER"><i class="fa fa-filter"></i></button>
                            <button type="button" class="btn btn-icon" @click="columnSettingsDialog.show()" data-toggle="bstooltip" :title="translations.COLUMN_SETTINGS"><i class="ci ci-cog"></i></button>
                            <button type="button" class="btn btn-icon" @click="grid.stateRestore.toogleShowDialog()" :id="gridDef.def.getId() + '_staterestore_button'" data-toggle="bstooltip" :title="translations.PRESETS"><i class="fas fa-sort-amount-down"></i></button>
                        </template>
                    </div>
                </div>
            </div>
            <div class="row">
                <div
                    :class="{
                        'col-md-12': gridDef.def.getRelationSwitcher() == false,
                        'col-md-10': gridDef.def.getRelationSwitcher() == true,
                    }"
                >
                    <GridComponent v-if="grid?.grid" :data-grid="grid.grid" theme="old"> </GridComponent>
                    <!--                {if $grid->class == 'Grid' || $grid->class == 'GridVue'}-->
                    <!--                <Grid-->
                    <!--                    json={$grid->toJson()}-->
                    <!--                    >-->
                    <!--                </Grid>-->
                    <!--                {elseif $grid->class == 'SubGrid' || $grid->class == 'SubGridVue'}-->
                    <!--                <SubGrid-->
                    <!--                    data-id="{$id|noescape}"-->
                    <!--                    data-settings={$grid->getSetting()}-->
                    <!--                    >-->
                    <!--                </SubGrid>-->
                    <!--                {/if}-->
                </div>
                <div class="col-md-2" v-if="gridDef.def.getRelationSwitcher()">
                    <div class="dataTable-relation">
                        <!--                        {jlang 'RELATIONS'} RELATIONS není v překladech  -->
                        {{ translations.RELATIONS }}
                    </div>
                    <div :id="gridDef.def.getId() + '-rs'" class="form-group dataTable-rs"></div>
                </div>
            </div>
        </div>

        <div class="stateRestore-dialog d-none" :id="gridDef.def.getId() + '_staterestore'" :data-grid="gridDef.def.getId()">
            <div class="content">
                <div class="header text-center">
                    <h3>{{ translations.PRESETS }}</h3>
                </div>
                <div class="presets">
                    <button type="button" class="btn" @click="grid.stateRestore.resetToDefault()">{{ translations.PRESET_DEFAULT }}</button>
                    <div class="user-presets"></div>
                    <button type="button" class="btn btn-green" @click="grid.stateRestore.showAddStateDialog()">{{ translations.ADD }}</button>
                </div>
            </div>
        </div>

        <DialogComponent v-if="gridDef.def.hasFilter()" :dialog="filterDialog">
            <template #title>
                {{ translations.FILTER }}
            </template>
            <template #content>
                <FormComponent :form="gridDef.def.getFilterForm()" />
            </template>
            <template #footer>
                <button class="btn btn-success" type="button" @click="filterDialog.close()">{{ translations.CONFIRM }}</button>
                <button class="btn btn-dark" type="button" @click="grid.copyFilterUrl()">{{ translations.COPY_FILTER_URL }}</button>
                <button class="btn btn-dark" type="button" @click="grid.resetFilter()">{{ translations.RESET_FILTER }}</button>
            </template>
        </DialogComponent>

        <DialogComponent v-if="grid && grid.grid" :dialog="columnSettingsDialog">
            <template #title>
                {{ translations.SHOW_HIDE_COLUMNS }}
            </template>
            <template #content>
                <div class="dataTable-columnvisibility row">
                    <template v-for="col in grid.getColumnList()">
                        <div class="btn-group-toggle col-md-6" data-toggle="buttons" v-if="col.data !== 'checkbox' && col.data !== 'actions'">
                            <label
                                class="btn"
                                :class="{
                                    active: col.visible,
                                }"
                            >
                                <input
                                    type="checkbox"
                                    :checked="col.visible ? 'true' : null"
                                    autocomplete="off"
                                    @change="
                                        (event) => {
                                            col.visible = event.target.checked;
                                        }
                                    "
                                />
                                {{ col.label }}
                            </label>
                        </div>
                    </template>
                </div>
            </template>
            <template #footer> </template>
        </DialogComponent>

        <component v-if="gridDef.def.quickEditorComponent && grid && grid.editor?.isShown" :is="gridDef.def.quickEditorComponent" :onAfterCreate="(quickEditor) => {}" :onAfterInit="setGridEditorRef" :entity-ID="grid.editor.id" :for-grid="grid"></component>

        <Modal v-if="grid?.editor?.isShown && !gridDef.def.edit_action" :is-visible="grid.editor?.isShown" @close="() => grid.editor?.close()">
            <template #body>
                <slot
                    name="editor"
                    :id="grid.editor.id"
                    :baseProps="{
                        id: grid.editor.id,
                        grid: grid,
                        rightBar: false,
                    }"
                />
            </template>
        </Modal>
    </div>
</template>
