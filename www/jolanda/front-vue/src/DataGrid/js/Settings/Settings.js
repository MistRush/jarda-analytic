import { ColumnDef } from "@/DataGrid/js/Settings/ColumnDef";
import { AjaxSetting } from "@/DataGrid/js/Settings/AjaxSetting";
import { RowSetting } from "@/DataGrid/js/Settings/RowSetting";
import { ContextMenuSetting } from "@/DataGrid/js/Settings/ContextMenuSetting";
import { PresetSetting } from "./PresetSetting";

export class Settings {
    _ajax;
    _columnDefs;
    _row;
    _initComplete;
    _language;
    _order = {
        type: "single",
        order: [
            {
                column: 0,
                dir: "desc",
            },
        ],
    };
    _preDrawCallback;
    _rowCallback;
    _serverSide;
    _contextMenu;
    _height;
    _preset;
    _editor = {
        ofAfterConfirm: null,
    };
    _id = null;
    _external = null;

    constructor(settings) {
        if (settings) {
            settings = Settings.mapOldToNew(settings);
        }

        this.columnDefs = settings?.columnDefs ?? null; //TODO foreach new ColumnDef
        this.ajax = settings?.ajax ? new AjaxSetting(settings.ajax) : null;
        this.row = settings?.row ? new RowSetting(settings.row) : new RowSetting();
        this.contextMenu = settings?.contextMenu ? new ContextMenuSetting(settings.contextMenu) : null;
        this.initComplete = settings?.initComplete;
        this.height = settings?.height ?? "68vh";
        this.id = settings?.id ?? null;

        if (settings?.order) {
            this.order.type = settings?.order.type ?? this.order.type;

            if (settings.order.order) {
                this.order.order = [];

                settings.order.order.forEach((order, index) => {
                    if (Array.isArray(order)) {
                        this.order.order.push({
                            column: order[0],
                            dir: order[1],
                        });
                    } else {
                        this.order.order.push(order);
                    }
                });
            }
        }

        this.preset = settings?.preset ? new PresetSetting(settings.preset) : null;
        if (settings?.editor) {
            this.editor = settings.editor;
        }

        this.external = settings?.external ?? null;
    }

    static mapOldToNew(settings) {
        settings.columnDefs = settings?.aoColumnDefs ?? settings?.aoColumnDefs ?? null;

        return settings;
    }

    get ajax() {
        return this._ajax;
    }

    set ajax(value) {
        this._ajax = null;

        if (value) {
            this._ajax = new AjaxSetting(value);
        }
    }

    get columnDefs() {
        return this._columnDefs;
    }

    set columnDefs(value) {
        this._columnDefs = [];

        if (value) {
            value.forEach((columnDef, index) => {
                this._columnDefs.push(new ColumnDef(columnDef));
            });
        }
    }

    get initComplete() {
        return this._initComplete;
    }

    set initComplete(value) {
        this._initComplete = value;
    }

    get language() {
        return this._language;
    }

    set language(value) {
        this._language = value;
    }

    get order() {
        return this._order;
    }

    set order(value) {
        this._order = value;
    }

    get preDrawCallback() {
        return this._preDrawCallback;
    }

    set preDrawCallback(value) {
        this._preDrawCallback = value;
    }

    get rowCallback() {
        return this._rowCallback;
    }

    set rowCallback(value) {
        this._rowCallback = value;
    }

    get serverSide() {
        return this._serverSide;
    }

    set serverSide(value) {
        this._serverSide = value;
    }

    get row() {
        return this._row;
    }

    set row(value) {
        this._row = value;
    }

    get contextMenu() {
        return this._contextMenu;
    }

    set contextMenu(value) {
        this._contextMenu = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }

    get preset() {
        return this._preset;
    }

    set preset(value) {
        this._preset = value;
    }

    get editor() {
        return this._editor;
    }

    set editor(value) {
        this._editor = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get external() {
        return this._external;
    }

    set external(value) {
        this._external = value;
    }
}
