import Form from "./../../Components/OldForm/js/Form";
import Action from "./Action";
import Column from "@/DataGrid/js/Column";
import { useAjax } from "@/Composables/useAjax.js";
import { isVNode, reactive } from "vue";

export default class GridDef {
    static SELECT_SINGLE = "single";
    static SELECT_MULTI = "multi";
    static SELECT_MULTI_CHECKBOX = "multi_checkbox";
    static SELECT_MULTI_CHECKBOX_REVERSE = "multi_checkbox_reverse";

    static SELECT_MULTI_TYPE_ONLY_LOADED = "only_loaded";
    static SELECT_MULTI_TYPE_ALL = "all";

    static SAVE_DATA_SERVERSIDE = "serverside";
    static SAVE_DATA_LOCAL = "local";

    static PRESET_SAVE_TYPE_LOCAL = "local";
    static PRESET_SAVE_TYPE_SERVERSIDE = "serverside";

    static EXCEL_APP = false;
    static PRESET_SAVE_TYPE = GridDef.PRESET_SAVE_TYPE_LOCAL;
    static PRESET_SAVE_SERVERSIDE_URL = null;

    static COLUMN_ID = Column.COLUMN_ID;
    static COLUMN_TEXT = Column.COLUMN_TEXT;
    static COLUMN_NUMBER = Column.COLUMN_NUMBER;
    static COLUMN_CURRENCY = Column.COLUMN_CURRENCY;
    static COLUMN_BOOL = Column.COLUMN_BOOL;
    static COLUMN_DATE = Column.COLUMN_DATE;
    static COLUMN_TIME = Column.COLUMN_TIME;
    static COLUMN_DATETIME = Column.COLUMN_DATETIME;
    static COLUMN_TIMESTAMP = Column.COLUMN_TIMESTAMP;
    static COLUMN_ENUM = Column.COLUMN_ENUM;
    static COLUMN_ENTITY = Column.COLUMN_ENTITY;
    static COLUMN_CUSTOM = Column.COLUMN_CUSTOM;
    static COLUMN_CHECKBOX = Column.COLUMN_CHECKBOX;
    static COLUMN_EDITBOX = Column.COLUMN_EDITBOX;
    static COLUMN_COMBOBOX = Column.COLUMN_COMBOBOX;
    static FILTER_ENABLE = Column.FILTER_ENABLE;
    static FILTER_DISABLE = Column.FILTER_DISABLE;
    static COLUMN_COUNTER = Column.COLUMN_COUNTER;
    static COLUMN_PERCENTAGE = Column.COLUMN_PERCENTAGE;
    static COLUMN_CURRENCY_EUR = Column.COLUMN_CURRENCY_EUR;
    static COLUMN_CURRENCY_CZK = Column.COLUMN_CURRENCY_CZK;
    static COLUMN_CURRENCY_USD = Column.COLUMN_CURRENCY_USD;
    static COLUMN_CURRENCY_GBP = Column.COLUMN_CURRENCY_GBP;
    static COLUMN_CURRENCY_PLN = Column.COLUMN_CURRENCY_PLN;
    static COLUMN_LONGTEXT = Column.COLUMN_LONGTEXT;

    class = "Grid";
    id;
    name;
    cacheEditor = false;
    datalist_url;
    delete_url;
    update_url;
    create_url;
    definitionData_url;
    cols = [];
    actions = [];
    baseActions = {};
    edit_action = "";
    inline_edit_action;
    quickedit_action = null;
    quickedit_maxWidth = null;
    enabled_actions;
    title;
    relations;
    order_column;
    select;
    has_filter;
    rowFormatter;
    search = null;
    relation_switcher = false;
    filter_default = true;
    height = "68vh";
    preview = false;
    order = {};
    one_must_be_selected = true;
    switchesForm;
    super;
    multipleType;
    displayBuffer = 25;
    infiniteScroll = true;
    dataSaveType = GridDef.SAVE_DATA_SERVERSIDE;
    dataSaveParams = []; //??
    enable_controls = true;
    enable_refresh = true;
    ajax = true;
    data = null;
    columnReorder = true;
    custom_row_reorder = false;
    filterForm;
    filterFormGroup;
    presetSaveType;
    presetServersideUrl = null;
    use_filters_bar = true;
    renderInCreateEditor = false;
    _bu;
    switchesFormToEditor = false;
    quickEditorComponent;
    serverSideDef = false;
    onAfterInit = null;

    //GridVue
    rowHeight = 33;

    constructor(id, title, editor = null, superInstance = null, allowExport = true) {
        // All properties from PHP constructor
        this._bu = basePath;
        this.name = id;
        this.id = `${id}_datagrid`;
        this.cols = [];
        this.actions = {};
        this.relations = [];
        this.rowFormatter = null;
        this.title = title;
        this.inline_edit_action = null;
        if (editor !== null) {
            if (typeof editor === "string") {
                this.edit_action = this._bu + "/" + editor;
            } else if (isVNode(editor)) {
                this.quickEditorComponent = editor;
            }
        }
        this.enabled_actions = { add: true, edit: true, remove: true };
        this.order_column = null;
        this.select = GridDef.SELECT_SINGLE;
        this.multipleType = GridDef.SELECT_MULTI_TYPE_ONLY_LOADED;
        this.has_filter = false;
        this.order = { order: "asc", column: "ID" };
        this.super = superInstance;
        const addButton = reactive(new Action(this, `${this.id}_add`, "ADD", `window['${this.id}'].add()`, [true, true, false]));
        addButton.getHeaderButton().setAttribute("class", "btn btn-green");
        addButton.setIcon("plus");
        const editButton = reactive(new Action(this, `${this.id}_edit`, "EDIT", `window['${this.id}'].edit()`, [true, true, true]));
        editButton.getHeaderButton().setAttribute("class", `btn btn-yellow ${this.id}_edit_button`);
        editButton.setIcon("edit");
        const removeButton = reactive(new Action(this, `${this.id}_remove`, "REMOVE", `window['${this.id}'].remove()`, [true, true, true]));
        removeButton.getHeaderButton().setAttribute("class", "btn btn-red");
        removeButton.setIcon("times");
        this.baseActions = {
            add: addButton,
            edit: editButton,
            remove: removeButton,
        };
        const switchesForm = reactive(new Form());
        switchesForm.setId(`${this.id}_switches`);
        this.switchesForm = switchesForm.addFormGroup();
        this.switchesForm.setDefaultColumnSize(0);
        this.filterForm = reactive(new Form());
        this.filterForm.setId(`${this.id}_filterform`);
        this.filterFormGroup = this.filterForm.addFormGroup();
        this.presetSaveType = GridDef.PRESET_SAVE_TYPE;

        if (allowExport) {
            const exportAction = this.addAction("orig_export", "EXPORT", null, [false, true, true]);
            exportAction.addSubAction("orig_export_csv_all", "EXPORT_CSV_ALL", `window['${this.id}'].exportDataToCSV()`);
            exportAction.addSubAction("orig_export_csv_filter", "EXPORT_CSV_FILTER", `window['${this.id}'].exportDataToCSV(true)`);
            exportAction.addSubAction("orig_export_pdf_all", "EXPORT_PDF_ALL", `window['${this.id}'].exportDataToPDF()`);
            exportAction.addSubAction("orig_export_pdf_filter", "EXPORT_PDF_FILTER", `window['${this.id}'].exportDataToPDF(true)`);
        }

        if (GridDef.EXCEL_APP) {
            this.addAction("export_grid_to_excel_app", "Přenést do excel appky", `window.exportGridToExcelApp('${this.id}')`, [false, true, true]);
        }
    }

    // Method examples from the PHP class
    getTitle() {
        return this.title;
    }

    setTitle(title) {
        this.title = title;
        return this;
    }

    getEnabledActions() {
        return this.enabled_actions;
    }

    setEnabledActions(add, edit, remove) {
        this.enabled_actions = { add: add, edit: edit, remove: remove };
        return this;
    }

    getColumns() {
        return this.cols;
    }

    getFormattedColumns() {
        const result = [];
        if (this.getSelect().includes("checkbox")) {
            result.push({
                name: "checkbox",
                minwidth: "20",
                label: "Checkbox",
            });
        }
        for (const col of this.cols) {
            const tmp = {
                name: col.getColumn(),
                format: col.getFormat(),
                format_function: col.getFormatFunction(),
                editable: col.isEditable(),
                editType: col.getEditType(),
                editParams: col.getEditParams().length > 0 ? col.getEditParams() : null,
                minwidth: col.getMinWidth(),
                label: col.getLabel(),
                entity_values: col.getEntityValues(false),
                visibility: col.isVisible(),
            };
            result.push(tmp);
        }

        return result;
    }

    getFormattedColumnsJson() {
        return JSON.stringify(this.getFormattedColumns());
    }

    getRowActions() {
        const result = [];

        Object.entries(this.getActions()).forEach(([key, action]) => {
            if (action.getVisibility().row && action.subactions.length === 0) {
                // result.push(action.renderRow());
                result.push(action);
            }
        });

        return result.length === 0 ? null : result;
    }

    getRowActionsJson() {
        JSON.stringify(this.getRowActions());
    }

    getActions() {
        return this.actions;
    }

    getEditAction() {
        return this.edit_action;
    }

    setEditAction(editAction) {
        this.edit_action = this.serverSideDef ? this._bu + "/" + editAction : editAction;

        return this;
    }

    getQuickeditAction() {
        return this.quickedit_action;
    }

    setQuickeditAction(quickeditAction) {
        this.quickedit_action = this._bu + "/" + quickeditAction;
        return this;
    }

    getQuickeditMaxWidth() {
        return this.quickedit_maxWidth;
    }

    setupStore(store) {
        let url = "";

        if (!store.module) {
            url += "admin";
        } else {
            url += store.module;
        }

        url += "/" + store.controller;
        delete store.module;
        delete store.controller;

        this.setUrl(url, store);

        return this;
    }

    setUrl(url, params = null) {
        this.datalist_url = `${this._bu}/${url}/data-list`;

        if (params !== null) {
            const urlParamsArray = Object.entries(params).map(([k, v]) => `${k}=${v}`);
            this.datalist_url += `?${urlParamsArray.join("&")}`;
        }

        this.delete_url = `${this._bu}/${url}/data-delete`;
        this.update_url = `${this._bu}/${url}/data-update`;
        this.create_url = `${this._bu}/${url}/data-create`;
        this.definitionData_url = `${this._bu}/${url}/data-grid`;

        if (this.inline_edit_action === null) {
            this.inline_edit_action = this.update_url;
        }

        return this;
    }

    setDirectUrl(
        url,
        dataActions = {
            "data-list": "data-list",
            "data-delete": "data-delete",
            "data-update": "data-update",
            "data-create": "data-create",
        },
        params = null,
    ) {
        this.datalist_url = `${this._bu}/${url}/${dataActions["data-list"] ?? "data-list"}`;

        if (params !== null) {
            const urlParamsArray = Object.entries(params).map(([k, v]) => `${k}=${v}`);
            this.datalist_url += `?${urlParamsArray.join("&")}`;
        }

        this.delete_url = `${this._bu}/${url}/${dataActions["data-delete"] ?? "data-delete"}`;
        this.update_url = `${this._bu}/${url}/${dataActions["data-update"] ?? "data-update"}`;
        this.create_url = `${this._bu}/${url}/${dataActions["data-create"] ?? "data-create"}`;

        if (this.inline_edit_action === null) {
            this.inline_edit_action = this.update_url;
        }

        return this;
    }

    getDatalistUrl() {
        return this.datalist_url;
    }

    getDeleteUrl() {
        return this.delete_url;
    }

    getUpdateUrl() {
        return this.update_url;
    }

    getCreateUrl() {
        return this.create_url;
    }

    setDatalistUrl(datalist_url) {
        this.datalist_url = datalist_url;
        return this;
    }

    setDeleteUrl(delete_url) {
        this.delete_url = delete_url;
        return this;
    }

    setUpdateUrl(update_url) {
        this.update_url = update_url;
        return this;
    }

    setCreateUrl(create_url) {
        this.create_url = create_url;
        return this;
    }

    addColumn(format, column, name, minWidth = null) {
        const col = reactive(new Column(format, column, name, minWidth, this));
        this.cols.push(col);

        return col;
    }

    addAction(id, label, onclick = null, visibility = [true, true, true]) {
        const action = reactive(new Action(this, id, label, onclick, visibility));
        this.actions[id] = action;

        return action;
    }

    clearActions() {
        this.actions = {};
        return this;
    }

    setReorderColumn(column, customRowOrder) {
        this.order_column = column;
        this.custom_row_reorder = customRowOrder;

        return this;
    }

    getOrderColumn() {
        return this.order_column;
    }

    getCustomRowReorder() {
        return this.custom_row_reorder;
    }

    getSelect() {
        return this.select;
    }

    getMultipleType() {
        return this.multipleType;
    }

    setSelect(type, multipleType = GridDef.SELECT_MULTI_TYPE_ONLY_LOADED) {
        this.select = type;
        this.multipleType = multipleType;

        return this;
    }

    getRowFormatter() {
        return this.rowFormatter;
    }

    setRowFormatter(rowFormatter) {
        this.rowFormatter = rowFormatter;
        return this;
    }

    getParentGrid() {
        const result = [];

        this.relations.forEach((relation) => {
            result.push({
                ...(relation ?? {}),
                grid: relation.grid instanceof GridDef ? relation.grid.getId() : relation.grid,
            });
        });

        return result;
    }

    setParentGrid(parentGrid, parentColumn, childColumn = "ID") {
        this.relations = [
            {
                grid: parentGrid,
                column: parentColumn,
                child: childColumn,
            },
        ];

        return this;
    }

    setParentGridRelations(parentGrid, relations) {
        this.relations = relations.map((rel) => ({
            ...rel,
            grid: parentGrid,
        }));

        return this;
    }

    setParentRelations(relations) {
        this.relations = relations;
        return this;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.name = id;
        this.id = this.name + "_datagrid";

        return this;
    }

    hasFilter() {
        if (this.getDataSaveType() === GridDef.SAVE_DATA_LOCAL) {
            return false;
        }

        return this.has_filter;
    }

    setHasFilter(hasFilter) {
        this.has_filter = hasFilter;
        return this;
    }

    enableRelationSwitcher(title, sourceUrl, relationsUrl, parentColumn, childColumn, childNameColumn, params = null, groupByColumn = null, groupByNameColumn = null) {
        this.relation_switcher = {};
        this.relation_switcher.relations_url = `${this._bu}/${relationsUrl}/data-list`;
        this.relation_switcher.source_url = `${this._bu}/${sourceUrl}/data-list`;

        if (params !== null) {
            this.relation_switcher.source_url += "?";
            for (const [key, value] of Object.entries(params)) {
                this.relation_switcher.source_url += `${key}=${value}&`;
            }
            // Remove the trailing '&' from the URL
            this.relation_switcher.source_url = this.relation_switcher.source_url.slice(0, -1);
        }

        this.relation_switcher.delete_url = `${this._bu}/${relationsUrl}/data-delete`;
        this.relation_switcher.create_url = `${this._bu}/${relationsUrl}/data-create`;
        this.relation_switcher.child_name_column = childNameColumn;
        this.relation_switcher.parent_column = parentColumn;
        this.relation_switcher.child_column = childColumn;
        this.relation_switcher.title = title;
        this.relation_switcher.group_by_column = groupByColumn;
        this.relation_switcher.group_by_name_column = groupByNameColumn;
    }

    getRelationSwitcher() {
        if (!this.relation_switcher) {
            return false;
        } else {
            return JSON.stringify(this.relation_switcher);
        }
    }

    enableSearch(column, placeholder, searchType = null) {
        this.search = [column, placeholder, searchType];

        return this;
    }

    getSearch() {
        if (this.search == null) {
            return null;
        }
        if (Array.isArray(this.search[0])) {
            return [this.search[0].join(","), this.search[1], this.search[2]];
        } else {
            return this.search;
        }
    }

    getFilterDefault() {
        return this.filter_default;
    }

    setFilterDefault(filter = true) {
        this.filter_default = filter;
        return this;
    }

    getHeight() {
        return this.height;
    }

    setHeight(height) {
        this.height = height;
        return this;
    }

    getOrder(json = true) {
        return json ? JSON.stringify(this.order) : this.order;
    }

    setOrder(column, order = "asc") {
        this.order = { order: order.toLowerCase(), column: column };

        return this;
    }

    getSuper() {
        return this.super;
    }

    isPreview() {
        return this.preview;
    }

    enablePreview(preview = true) {
        this.preview = preview;
        return this;
    }

    getBaseActions() {
        return this.baseActions;
    }

    generateFilter() {
        const group = this.filterFormGroup;
        group.setColumns(2);

        this.cols.forEach((col) => {
            if (col.hasFilter()) {
                switch (col.getFormat()) {
                    case this.COLUMN_BOOL:
                    case this.COLUMN_CHECKBOX:
                        group.addBoolRadioButton(`${col.getColumn()}__filter`, col.getLabel(), true);
                        break;

                    case this.COLUMN_ENTITY:
                    case this.COLUMN_ENUM:
                        group.addMultiSelect(`${col.getColumn()}__filter`, col.getLabel(), col.getEntityValues(false));
                        break;

                    case this.COLUMN_DATE:
                    case this.COLUMN_DATETIME:
                    case this.COLUMN_NUMBER:
                    case this.COLUMN_CURRENCY:
                        let from, to;
                        if (col.getFormat() === this.COLUMN_DATE || col.getFormat() === this.COLUMN_DATETIME) {
                            from = group.addDateBox(`${col.getColumn()}From__filter`, `${col.getLabel()} ${Lang.getInstance().translate("FROM")}`);
                            to = group.addDateBox(`${col.getColumn()}To__filter`, `${col.getLabel()} ${Lang.getInstance().translate("TO")}`);
                        } else if (col.getFormat() === this.COLUMN_NUMBER) {
                            from = group.addNumericBox(`${col.getColumn()}From__filter`, `${col.getLabel()} ${Lang.getInstance().translate("FROM")}`);
                            to = group.addNumericBox(`${col.getColumn()}To__filter`, `${col.getLabel()} ${Lang.getInstance().translate("TO")}`);
                        } else if (col.getFormat() === this.COLUMN_CURRENCY) {
                            from = group.addCurrencyBox(`${col.getColumn()}From__filter`, `${col.getLabel()} ${Lang.getInstance().translate("FROM")}`);
                            to = group.addCurrencyBox(`${col.getColumn()}To__filter`, `${col.getLabel()} ${Lang.getInstance().translate("TO")}`);
                        }

                        if (from && to) {
                            from.setColumnSize(3);
                            from.getControlPart().setAttribute("data-range", "from");
                            from.getControlPart().setAttribute("data-range-target", `${col.getColumn()}__filter`);

                            to.setColumnSize(3);
                            to.getControlPart().setAttribute("data-range", "to");
                            to.getControlPart().setAttribute("data-range-target", `${col.getColumn()}__filter`);
                        }
                        break;

                    default:
                        group.addTextBox(`${col.getColumn()}__filter`, col.getLabel());
                }
            }
        });

        this.filterForm.getFormGroups().forEach((group) => {
            group.getFormControls().forEach((formControl) => {
                if (!formControl.getName().endsWith("__filter")) {
                    formControl.setName(`${formControl.getName()}__filter`);
                }
            });
        });

        return this.filterForm;
    }

    getSwitchesForm() {
        return this.switchesForm;
    }

    getName() {
        return this.name;
    }

    getInlineEditAction() {
        return this.inline_edit_action;
    }

    setInlineEditAction(inlineEditAction = null) {
        this.inline_edit_action = inlineEditAction;
        return this;
    }

    setEditorCache(cache) {
        this.cacheEditor = cache;
        return this;
    }

    getEditorCache() {
        return this.cacheEditor;
    }

    setDisplayBuffer(displayBuffer = 25) {
        this.displayBuffer = displayBuffer;
        return this;
    }

    getDisplayBuffer() {
        return this.displayBuffer;
    }

    setInfiniteScroll(infiniteScroll = true) {
        this.infiniteScroll = infiniteScroll;
        return this;
    }

    getInfiniteScroll() {
        return this.infiniteScroll;
    }

    setDataSaveType(dataSaveType, dataSaveParams = {}) {
        //TODO instaceof
        if (dataSaveType === GridDef.SAVE_DATA_LOCAL && !dataSaveParams.hasOwnProperty("managerAlias") && this instanceof SubGrid) {
            throw new Error("Unable to render SubGrid. Please set managerAlias in dataSaveParams");
        }

        this.dataSaveParams = dataSaveParams;
        this.dataSaveType = dataSaveType;
        return this;
    }

    getDataSaveParams(asJson = false) {
        return asJson ? JSON.stringify(this.dataSaveParams) : this.dataSaveParams;
    }

    getDataSaveType() {
        return this.dataSaveType;
    }

    disableControls() {
        this.enable_controls = false;
        return this;
    }

    enableControls() {
        this.enable_controls = true;
        return this;
    }

    hasControlsEnabled() {
        return this.enable_controls;
    }

    disableRefresh() {
        this.enable_refresh = false;
        return this;
    }

    enableRefresh() {
        this.enable_refresh = true;
        return this;
    }

    hasRefreshEnabled() {
        return this.enable_refresh;
    }

    oneMustBeSelected(selected = true) {
        this.one_must_be_selected = selected;
        return this;
    }

    mustBeOneSelected() {
        return this.one_must_be_selected;
    }

    setAjax(ajax = true) {
        this.disableControls();
        this.setEnabledActions(false, false, false);
        this.ajax = ajax;
        return this;
    }

    isAjax() {
        return this.ajax;
    }

    setData(data) {
        this.data = data;
        return this;
    }

    getData() {
        return this.data;
    }

    getDataJson() {
        return JSON.stringify(this.data);
    }

    setColumnReorder(columnReorder = true) {
        this.columnReorder = columnReorder;
        return this;
    }

    getColumnReorder() {
        return this.columnReorder;
    }

    getPresetSaveType() {
        return this.presetSaveType;
    }

    setPresetSaveType(presetSaveType) {
        this.presetSaveType = presetSaveType;
        return this;
    }

    getPresetServersideUrl() {
        return this.presetServersideUrl;
    }

    getFilterForm() {
        return this.filterForm;
    }

    getFilterFormGroup() {
        return this.filterFormGroup;
    }

    useFiltersBar() {
        return this.use_filters_bar;
    }

    setUseFiltersBar(useFiltersBar) {
        this.use_filters_bar = useFiltersBar;
        return this;
    }

    isRenderInCreateEditor() {
        return this.renderInCreateEditor;
    }

    setRenderInCreateEditor(renderInCreateEditor) {
        this.renderInCreateEditor = renderInCreateEditor;
        return this;
    }

    isSwitchesFormToEditor() {
        return this.switchesFormToEditor;
    }

    setSwitchesFormToEditor(switchesFormToEditor = true) {
        this.switchesFormToEditor = switchesFormToEditor;
        return this;
    }

    getContextMenuSetting() {
        const settings = [];

        const enabledActions = this.getEnabledActions();
        const baseActions = this.getBaseActions();
        const isSubGrid = this.class === "SubGrid";

        if (enabledActions.add && (!this.getEditAction() || this.getQuickeditAction() || (isSubGrid && this.getQuickEditor() != null))) {
            settings.push(baseActions.add.getContextMenuItemSetting());
        }

        if (enabledActions.edit && (!this.getEditAction() || this.getQuickeditAction() || (isSubGrid && this.getQuickEditor() != null)) && this.getSelect() === "single") {
            settings.push(baseActions.edit.getContextMenuItemSetting());
        }

        if (enabledActions.remove) {
            settings.push(baseActions.remove.getContextMenuItemSetting());
        }

        Object.entries(this.actions).forEach(([id, action]) => {
            const setting = action.getContextMenuItemSetting();
            if (setting) {
                settings.push(setting);
            }
        });

        return settings;
    }

    getContextMenuSettingJson() {
        return JSON.stringify(this.getContextMenuSetting());
    }

    //Grid vue
    setRowHeight(rowHeight) {
        this.rowHeight = rowHeight;
        return this;
    }

    getRowHeight() {
        return this.rowHeight;
    }

    async fetchDefinitionData() {
        if (this.definitionData_url) {
            const ajax = useAjax();

            const data = await ajax.postForm(this.definitionData_url, {});

            return data.response.data.items;
        }
    }

    setQuickEditorComponent(editorComponent) {
        this.quickEditorComponent = editorComponent;
        return this;
    }

    setOnAfterInit(callback) {
        this.onAfterInit = callback;
        return this;
    }

    getOnAfterInit() {
        return this.onAfterInit;
    }
}
