import Mapper from "../../../Components/js/Mapper";
import GridDef from "../GridDef";
import SubGridDef from "../SubGridDef";
import ColumnMapper from "./ColumnMapper";
import ActionMapper from "./ActionMapper";
import FormMapper from "../../../Components/OldForm/js/FormMapper";

export default class GridMapper extends Mapper {
    //TODO přenáše staticke nastavení
    static REQUIRED_PROPS = ["class", "id", "name", "cacheEditor", "datalist_url", "delete_url", "update_url", "create_url", "cols", "actions", "baseActions", "edit_action", "inline_edit_action", "quickedit_action", "quickedit_maxWidth", "enabled_actions", "title", "relations", "order_column", "select", "has_filter", "rowFormatter", "search", "relation_switcher", "filter_default", "height", "preview", "order", "one_must_be_selected", "switchesForm", "multipleType", "displayBuffer", "infiniteScroll", "dataSaveType", "dataSaveParams", "enable_controls", "enable_refresh", "ajax", "data", "columnReorder", "custom_row_reorder", "filterForm", "presetSaveType", "use_filters_bar", "renderInCreateEditor", "_bu", "switchesFormToEditor", "rowHeight"];

    static map(jsonData, parent = null) {
        if (typeof jsonData === "string") {
            jsonData = JSON.parse(jsonData);
        }

        // Kontrola, zda máme všechny povinné vlastnosti
        this.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        let grid;
        // Vytvoření instance třídy Form
        if (jsonData.class === "SubGrid" || jsonData.class === "SubGridVue") {
            grid = new SubGridDef(jsonData.id, jsonData.title, jsonData.edit_action, parent, false); //TODO allowExport
        } else {
            grid = new GridDef(jsonData.id, jsonData.title, jsonData.edit_action, parent, false); //TODO allowExport
        }

        grid.serverSideDef = true;

        grid.class = jsonData.class;
        grid.id = jsonData.id;
        grid.name = jsonData.name;
        grid.cacheEditor = jsonData.cacheEditor;
        grid.datalist_url = jsonData.datalist_url;
        grid.delete_url = jsonData.delete_url;
        grid.update_url = jsonData.update_url;
        grid.create_url = jsonData.create_url;
        grid.edit_action = jsonData.edit_action;
        grid.inline_edit_action = jsonData.inline_edit_action;
        grid.quickedit_action = jsonData.quickedit_action;
        grid.quickedit_maxWidth = jsonData.quickedit_maxWidth;
        grid.enabled_actions = jsonData.enabled_actions;
        grid.title = jsonData.title;
        grid.relations = jsonData.relations; //??? ma v sobě odkaz na grid->ID
        grid.order_column = jsonData.order_column;
        grid.select = jsonData.select;
        grid.has_filter = jsonData.has_filter;
        grid.rowFormatter = jsonData.rowFormatter;
        grid.search = jsonData.search;
        grid.relation_switcher = jsonData.relation_switcher;
        grid.filter_default = jsonData.filter_default;
        grid.height = jsonData.height;
        grid.preview = jsonData.preview;
        grid.order = jsonData.order;
        grid.one_must_be_selected = jsonData.one_must_be_selected;
        grid.multipleType = jsonData.multipleType;
        grid.displayBuffer = jsonData.displayBuffer;
        grid.infiniteScroll = jsonData.infiniteScroll;
        grid.dataSaveType = jsonData.dataSaveType;
        grid.dataSaveParams = jsonData.dataSaveParams;
        grid.enable_controls = jsonData.enable_controls;
        grid.enable_refresh = jsonData.enable_refresh;
        grid.ajax = jsonData.ajax;
        grid.data = jsonData.data;
        grid.columnReorder = jsonData.columnReorder;
        grid.custom_row_reorder = jsonData.custom_row_reorder;
        grid.presetSaveType = jsonData.presetSaveType;
        grid.presetServersideUrl = jsonData.presetServersideUrl;
        grid.use_filters_bar = jsonData.use_filters_bar;
        grid.renderInCreateEditor = jsonData.renderInCreateEditor;
        grid._bu = jsonData._bu;
        grid.switchesFormToEditor = jsonData.switchesFormToEditor;

        grid.cols = [];
        jsonData.cols.forEach((colData) => {
            grid.cols.push(ColumnMapper.map(colData, grid));
        });

        Object.entries(jsonData.baseActions).forEach(([key, value]) => {
            grid.baseActions[key] = ActionMapper.map(value, grid);
        });

        Object.entries(jsonData.actions).forEach(([key, value]) => {
            grid.actions[key] = ActionMapper.map(value, grid);
        });

        grid.filterForm = FormMapper.map(jsonData.filterForm);
        grid.filterFormGroup = grid.filterForm.formGroups[0];

        const switchesForm = FormMapper.map(jsonData.switchesForm);
        grid.switchesForm = switchesForm.formGroups[0] ?? null;

        return grid;
    }
}
