import Form from './../../OldForm/js/Form';
import FormGroup from './../../OldForm/js/Controls/FormGroup';
import Tab from "@/Components/EntityEditor/js/Tab";
import {reactive} from "vue";

export default class EntityEditorDef extends Form {
    static SAVE_DATA_SERVERSIDE = 'serverside';
    static SAVE_DATA_LOCAL = 'local';

    tabs = [];
    data_url;
    entity_id = null;
    back_url = null;
    name = '';
    entity_name_column = null;
    parent_entities = null;
    ajax = false;
    enable_standalone = false;
    actions = [];
    readonly = false;
    url_parameters = [];
    sendOnEnterEnabled = true; //orig: send_on_enter
    isShowedSaveButtons = true; //orig: showSaveButtons
    footerTab = null;
    headerTab = null;
    isEnabledNextPrevButtons = false; //orig: enableNextPrevButtons
    isEnabledNextPrevCounter = true; //orig: enableNextPrevCounter
    dataListAction = 'data-list';
    dataUpdateAction = 'data-update';
    dataCreateAction = 'data-create';
    _bu;
    customData = {};
    dataSaveType = EntityEditorDef.SAVE_DATA_SERVERSIDE;
    forGrid = null;
    local_tmp_id = null;
    onAfterInit = null;

    constructor(id, name, url, superInstance = null) {
        super(superInstance);
        this._bu = window.basePath ?? null;
        this.id = 'entityeditor_' + Math.random().toString(36).substring(7);
        this.super = superInstance;
        this.data_url = url;
        this.name = name;

        // this.setEntityId(id);
    }

    setApiEndpoint(endpoint) {
        this.apiEndpoint = endpoint;
        return this;
    }

    addTab(title, id = null) {
        const tab = reactive(new Tab(title, this, id));
        this.tabs.push(tab);
        return reactive(tab);
    }

    getTabs() {
        return this.tabs;
    }

    getTab(id) {
        return this.tabs.find(tab => tab.getId() === id) || null;
    }

    removeTab(id) {
        this.tabs = this.tabs.filter(tab => tab.getId() !== id);
        return this;
    }

    getSubGrid(name) {
        return this.getSubGrids().find(grid => grid.getName() === name) || null;
    }

    getControl(name) {
        for (const tab of this.tabs) {
            for (const group of tab.getGroups()) {
                for (const control of group.getGroupControls()) {
                    if (control instanceof FormGroup) {
                        const result = control.getFormControl(name);
                        if (result) return result;
                    }
                }
            }
        }
        return null;
    }

    getControlsByType(type) {
        const controls = [];
        for (const tab of this.tabs) {
            for (const group of tab.getGroups()) {
                for (const control of group.getGroupControls()) {
                    if (control instanceof FormGroup) {
                        for (const formControl of control.getFormControls()) {
                            if (formControl instanceof type) {
                                controls.push(formControl);
                            }
                        }
                    }
                }
            }
        }
        return controls;
    }

    getDatalistUrl() {
        const conjunction = this.dataListAction.includes('?') ? '&' : '?';
        if (this.url_parameters.length === 0) {
            return `${this._bu}/${this.data_url}/${this.dataListAction}${conjunction}ID=`;
        } else {
            const params = this.url_parameters.join('&');
            return `${this._bu}/${this.data_url}/${this.dataListAction}${conjunction}${params}&ID=`;
        }
    }

    getDataupdateUrl() {
        return `${this._bu}/${this.data_url}/${this.dataUpdateAction}`;
    }

    getDatacreateUrl() {
        return `${this._bu}/${this.data_url}/${this.dataCreateAction}`;
    }

    getBackUrl() {
        return this.back_url;
    }

    setBackUrl(back_url) {
        this.back_url = back_url;
        return this;
    }

    getTitle() {
        return `${this.getName()} ${(this.entity_id == null ? '(New)' : '(Edit)')}${(this.getEntityNameColumn() == null || this.entity_id == null ? '' : ' - <span class="entity_name"></span>')}`;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    getEntityNameColumn() {
        return this.entity_name_column;
    }

    setEntityNameColumn(entity_name_column) {
        this.entity_name_column = entity_name_column;
        return this;
    }

    getEntityId() {
        return this.entity_id;
    }

    setEntityId(entity_id) {
        this.entity_id = entity_id;
        return this;
    }

    getParentEntities() {
        return this.parent_entities;
    }

    setParentEntity(parent_entity, parent_value) {
        if (!this.parent_entities) this.parent_entities = {};
        this.parent_entities[parent_entity] = parent_value;
        return this;
    }

    isAjax() {
        return this.ajax;
    }

    setAjax(ajax = true) {
        this.ajax = ajax;
        return this;
    }

    isEnableStandalone() {
        return this.enable_standalone;
    }

    enableStandalone(enable_standalone = true) {
        this.enable_standalone = enable_standalone;
        return this;
    }

    addAction(id, label, icon = null, visible_create = true, visible_update = true, onclick = null) {
        const button = reactive(new Action(this, id, label, icon, visible_create, visible_update, onclick));
        this.actions.push(button);
        return button;
    }

    enableNextPrevButtons(showCounter = true) {
        this.isEnabledNextPrevButtons = true;
        this.isEnabledNextPrevCounter = showCounter;
        return this;
    }

    isNextPrevButtonsEnabled() {
        return this.isEnabledNextPrevButtons;
    }

    isNextPrevCounterEnabled() {
        return this.isEnabledNextPrevCounter;
    }

    getActions() {
        return this.actions;
    }

    isReadonly() {
        return this.readonly;
    }

    setReadonly(readonly = true) {
        this.readonly = readonly;
        return this;
    }

    setUrlParameters(parameters) {
        this.url_parameters = parameters;
        return this;
    }

    getSendOnEnter() {
        return this.sendOnEnterEnabled;
    }

    sendOnEnter(sendOnEnter) {
        this.sendOnEnterEnabled = sendOnEnter;
        return this;
    }

    getSubGrids() {
        let subGrids = [];
        for (const tab of this.tabs) {
            subGrids = subGrids.concat(tab.getSubGrids());
        }
        if (this.headerTab) {
            subGrids = subGrids.concat(this.headerTab.getSubGrids());
        }
        if (this.footerTab) {
            subGrids = subGrids.concat(this.footerTab.getSubGrids());
        }
        return subGrids;
    }

    getRelationSwitches() {
        let relationSwitches = [];
        for (const tab of this.tabs) {
            relationSwitches = relationSwitches.concat(tab.getRelationSwitches());
        }
        if (this.headerTab) {
            relationSwitches = relationSwitches.concat(this.headerTab.getRelationSwitches());
        }
        if (this.footerTab) {
            relationSwitches = relationSwitches.concat(this.footerTab.getRelationSwitches());
        }
        return relationSwitches;
    }

    getCategoryTrees() {
        let categoryTrees = [];
        for (const tab of this.tabs) {
            categoryTrees = categoryTrees.concat(tab.getCategoryTrees());
        }
        if (this.headerTab) {
            categoryTrees = categoryTrees.concat(this.headerTab.getCategoryTrees());
        }
        if (this.footerTab) {
            categoryTrees = categoryTrees.concat(this.footerTab.getCategoryTrees());
        }
        return categoryTrees;
    }

    showSaveButtons(show = true) {
        this.isShowedSaveButtons = show;
        return this;
    }

    isShowSaveButtons() {
        return this.isShowedSaveButtons;
    }

    addFooterTab(title, id = null) {
        const tab = reactive(new Tab(title, this, id));
        this.footerTab = tab;
        return tab;
    }

    getFooterTab() {
        return this.footerTab;
    }

    addHeaderTab(title, id = null) {
        const tab = reactive(new Tab(title, this, id));
        this.headerTab = tab;
        return tab;
    }

    getHeaderTab() {
        return this.headerTab;
    }

    getDataListAction() {
        return this.dataListAction;
    }

    setDataListAction(dataListAction) {
        this.dataListAction = dataListAction;
        return this;
    }

    getDataUpdateAction() {
        return this.dataUpdateAction;
    }

    setDataUpdateAction(dataUpdateAction) {
        this.dataUpdateAction = dataUpdateAction;
        return this;
    }

    getDataCreateAction() {
        return this.dataCreateAction;
    }

    setDataCreateAction(dataCreateAction) {
        this.dataCreateAction = dataCreateAction;
        return this;
    }

    addCustomData(key, value) {
        this.customData[key] = value;
        return this;
    }

    setCustomData(customData) {
        this.customData = customData;
        return this;
    }

    getCustomData() {
        return this.customData;
    }

    getCustomDataJson() {
        return JSON.stringify(this.customData);
    }

    getDataUrl() {
        return this.data_url;
    }

    setDataUrl(data_url) {
        this.data_url = data_url;
        return this;
    }

    setupRemoteEditor(module) {
        let url = this.data_url;
        url = url.substring(url.indexOf('/'));
        this.setDataUrl(module + url);

        for (const grid of this.getSubGrids()) {
            let gridUrl = grid.getDatalistUrl();
            gridUrl = gridUrl.substring(gridUrl.indexOf(grid._bu));
            gridUrl = gridUrl.substring(gridUrl.indexOf('/', 1));
            grid.setDatalistUrl(`${this._bu}/${module}${gridUrl}`);

            gridUrl = grid.getDeleteUrl();
            gridUrl = gridUrl.substring(gridUrl.indexOf(grid._bu));
            gridUrl = gridUrl.substring(gridUrl.indexOf('/', 1));
            grid.setDeleteUrl(`${this._bu}/${module}${gridUrl}`);

            gridUrl = grid.getUpdateUrl();
            gridUrl = gridUrl.substring(gridUrl.indexOf(grid._bu));
            gridUrl = gridUrl.substring(gridUrl.indexOf('/', 1));
            grid.setUpdateUrl(`${this._bu}/${module}${gridUrl}`);

            const quickEditorUrl = grid.getQuickEditor();
            if (quickEditorUrl) {
                let editorUrl = quickEditorUrl.substring(quickEditorUrl.indexOf(grid._bu));
                editorUrl = editorUrl.substring(editorUrl.indexOf('/', 1));
                grid.addEditor(`${module}${editorUrl}`);
            }
        }

        const comboboxes = this.getControlsByType('ComboBox');
        for (const combobox of comboboxes) {
            if (combobox.isAjax()) {
                let comboUrl = combobox.getControlPart().getAttribute('data-store');
                comboUrl = comboUrl.substring(comboUrl.indexOf(this._bu));
                comboUrl = comboUrl.substring(comboUrl.indexOf('/', 1));
                combobox.getControlPart().setAttribute('data-store', `${this._bu}/${module}${comboUrl}`);
            }
        }
    }

    applyParams(params) {
        for (const [key, value] of Object.entries(params)) {
            if (Array.isArray(value)) {
                this[key](...value);
            } else {
                this[key](value);
            }
        }
    }
}