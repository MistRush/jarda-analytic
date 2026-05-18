import ComboBox from "../../Components/OldForm/js/Controls/ComboBox";
import {reactive} from "vue";

export default class Column {
    static EDIT_TYPE_DEFAULT = 'default';
    static EDIT_TYPE_AJAX_SELECT = 'ajax-select';

    static COLUMN_ID = 1;
    static COLUMN_TEXT = 2;
    static COLUMN_NUMBER = 4;
    static COLUMN_CURRENCY = 8;
    static COLUMN_BOOL = 16;
    static COLUMN_DATE = 32;
    static COLUMN_TIME = 64;
    static COLUMN_DATETIME = 65;
    static COLUMN_TIMESTAMP = 66;
    static COLUMN_ENUM = 128;
    static COLUMN_ENTITY = 256;
    static COLUMN_CUSTOM = 512;
    static COLUMN_CHECKBOX = 1040;
    static COLUMN_EDITBOX = 2048;
    static COLUMN_COMBOBOX = 4096;
    static FILTER_ENABLE = 8192;
    static FILTER_DISABLE = 16384;
    static COLUMN_COUNTER = 32768;
    static COLUMN_PERCENTAGE = 65536;
    static COLUMN_CURRENCY_EUR = 131072;
    static COLUMN_CURRENCY_CZK = 262144;
    static COLUMN_CURRENCY_USD = 524288;
    static COLUMN_CURRENCY_GBP = 1048576;
    static COLUMN_CURRENCY_PLN = 2097152;
    static COLUMN_LONGTEXT = 4194304;

    super;
    format;
    column;
    label;
    min_width;
    format_function;
    entity_values;
    filter;
    editable;
    parent;
    visible = true;
    help_text = null;
    editType = Column.EDIT_TYPE_DEFAULT;
    editParams = {};

    constructor(format, column, label, min_width = null, parent = null) {
        this.format = format;
        this.column = column;
        this.label = label;

        if(min_width === null && this.column === 'ID') {
            this.min_width = 10;
        }

        this.min_width = min_width === null ? '90px' : `${min_width}px`;

        this.filter = parent?.getFilterDefault() || false;
        if (this.filter && parent) {
            parent.setHasFilter(true);
        }

        this.editable = false;
        this.parent = parent;
        this.super = parent?.getSuper() || null;
    }

    getFormat() {
        return this.format;
    }

    setFormat(format) {
        this.format = format;
        return this;
    }

    getColumn() {
        return this.column;
    }

    setColumn(column) {
        this.column = column;
        return this;
    }

    getLabel() {
        return this.label;
    }

    setLabel(label) {
        this.label = label;
        return this;
    }

    getMinWidth() {
        return this.min_width;
    }

    setMinWidth(min_width) {
        this.min_width = min_width;
        return this;
    }

    getFormatFunction() {
        return this.format_function;
    }

    setFormatFunction(format_function) {
        this.format_function = format_function;
        return this;
    }

    setEnumValues(values) {
        const vals = { '': '' };
        for (const [key, val] of Object.entries(values)) {
            vals[key.toString()] = val;
        }
        this.entity_values = vals;
        return this;
    }

    getEntityValues(json = true) {
        return json ? JSON.stringify(this.entity_values) : this.entity_values;
    }

    setEntity(foreignRelationColumn, foreignValueColumn, store) {
        //TODO
        // if (!store.module) store.module = 'admin';
        // let managerClass = `${store.module.charAt(0).toUpperCase() + store.module.slice(1)}_Manager_`;
        //
        // managerClass += store.controller.split('-').map(item => item.charAt(0).toUpperCase() + item.slice(1)).join('');
        //
        // const manager = new managerClass();
        // delete store.module;
        // delete store.controller;
        // const data = manager.performDataList(store, Clevis_Data_Manager.LIST_HIERARCHY);
        //
        // const result = { '': '' };
        // for (const item of data.data) {
        //     result[item[foreignRelationColumn]] = item[foreignValueColumn];
        // }
        //
        // this.entity_values = result;
        // return this;
    }

    hasFilter() {
        return this.filter;
    }

    setFilter(filter = true) {
        this.filter = filter;
        if (this.parent) this.parent.setHasFilter(true);
        return this;
    }

    isEditable() {
        return this.editable;
    }

    setEditable(editable = true, editType = Column.EDIT_TYPE_DEFAULT, editParams = {}) {
        this.editable = editable;
        this.editType = editType;
        this.editParams = editParams;

        if (editType === Column.EDIT_TYPE_AJAX_SELECT) {
            const input = reactive(new ComboBox(
                this, editParams.name, '', false, editParams.storeUrl, editParams.storeField, false, true
            ));
            input.getControlPart().name = editParams.name;
            input.setSelectWidth('100%');
            // this.editParams.input = input.getControlPart().render(); //TODO
        }

        return this;
    }

    getEditType() {
        return this.editType;
    }

    getEditParams() {
        return this.editParams;
    }

    isVisible() {
        return this.visible;
    }

    setVisible(visible) {
        this.visible = visible;
        return this;
    }

    getHelp() {
        return this.help_text || this.label;
    }

    setHelp(help_text) {
        this.help_text = help_text;
        return this;
    }
}
