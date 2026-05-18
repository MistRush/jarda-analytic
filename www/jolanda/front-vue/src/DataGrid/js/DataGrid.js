import { Settings } from "@/DataGrid/js/Settings/Settings";
import { Column } from "@/DataGrid/js/Column/Column";
import { Row } from "@/DataGrid/js/Row/Row";
import { Ajax } from "@/DataGrid/js/Ajax/Ajax";
import { Scroller } from "@/DataGrid/js/Scroller/Scroller";
import { RowSet } from "@/DataGrid/js/Row/RowSet";
import { ContextMenu } from "@/DataGrid/js/ContextMenu/ContextMenu";
import { Data } from "@/DataGrid/js/Data/Data";
import { PresetManager } from "./Presets/PresetManager";
import { RowSetting } from "@/DataGrid/js/Settings/RowSetting";
import { useAlertStore } from "@/Components/Alerts/stores/alertStore";
import { useTranslations } from "@/Composables/useTranslation.js";

//TODO unselect při refresh? a při hardRefresh třeba filtry
export class DataGrid {
    static ORDER_ASC = "asc";
    static ORDER_DESC = "desc";
    static USE_PRESETS = false;

    _settings;
    _data = [];
    _columns = [];
    _ajax = null;
    _scroller = null;
    _selectedRows = [];
    _order = [];
    _contextMenu;
    _onInitComplete;
    _presetManager = null;
    _id;
    _external = null;

    constructor(settings) {
        this.settings = new Settings(settings);
        this.id = this.settings.id;

        this.settings.columnDefs.forEach((columnDef, index) => {
            this._columns.push(new Column(columnDef, this, index));
        });

        if (this.settings.order.order) {
            this._order = this.settings.order.order;
        }

        this.ajax = this.settings.ajax ? new Ajax(this.settings.ajax, this) : null;

        this.scroller = new Scroller(this, this.settings.row.height);
        this.contextMenu = this.settings.contextMenu ? new ContextMenu(this.settings.contextMenu, this) : null;
        this.onInitComplete = this.settings.initComplete;
        this.presetManager = this.settings.preset ? new PresetManager(this.settings.preset, this) : null;
        this._external = this.settings._external ?? null;
    }

    setData(data) {
        // this._selectedRows = [];
        this._data = [...data];
    }

    getData(raw = false) {
        if (raw) {
            return this._data;
        }

        if (this.ajax) {
            return this._data.reduce((acc, currentItem, index) => {
                if (this.ajax._loadedRows.includes(index)) {
                    acc.push(currentItem);
                }
                return acc;
            }, []);
        }

        return this._data;
    }

    selectedRows() {
        return this._selectedRows;
    }

    rows(options) {
        //TODO return pouze loaded data pokud je ajax

        let rows = [];
        if (options && typeof options === "object") {
            if (!options.hasOwnProperty("raw")) {
                options.raw = false;
            }

            if (options.hasOwnProperty("selected") && options.selected) {
                this._selectedRows.forEach((rowIndex) => {
                    const row = new Row(this, rowIndex);

                    if (options.raw) {
                        rows.push(row);
                    } else {
                        if (row.isLoaded) {
                            rows.push(row);
                        }
                    }
                });
            } else if (options.hasOwnProperty("all") && options.all) {
                this._data.forEach((rowData, index) => {
                    const row = new Row(this, index);

                    if (options.raw) {
                        rows.push(row);
                    } else {
                        if (row.isLoaded) {
                            rows.push(row);
                        }
                    }
                });
            }
        } else {
            if (this.ajax) {
                this.ajax.loadedRows.forEach((rowIndex) => {
                    rows.push(new Row(this, rowIndex));
                });
            } else {
                this._data.forEach((rowData, index) => {
                    rows.push(new Row(this, index));
                });
            }
        }

        return new RowSet(this, rows);
    }

    row(options) {
        //TODO options??
        //TODO když data[options] // if(this.data.in)
        return new Row(this, options);
    }

    data(raw = false) {
        return new Data(this.getData(raw));
    }

    order(columnIndex, direction) {
        if (typeof columnIndex === "undefined") {
            return this._order;
        }

        this._order = [
            {
                dir: direction,
                column: columnIndex,
            },
        ];

        //TODO přepsat asi do Data objectu a tam sort a i v Column
        if (!this.ajax) {
            this._data.sort((a, b) => {
                if (direction === DataGrid.ORDER_ASC) {
                    return a[this.column(columnIndex + ":id").data] >= b[this.column(columnIndex + ":id").data] ? 1 : -1;
                } else {
                    return a[this.column(columnIndex + ":id").data] <= b[this.column(columnIndex + ":id").data] ? 1 : -1;
                }
            });
        }
    }

    column(options) {
        if (options && typeof options === "string" && options.indexOf(":")) {
            let parsed = options.split(":");

            if (parsed[1] === "name") {
                parsed[1] = "data";
            }

            return this._columns.find((column) => {
                return column[parsed[1]] === parsed[0];
            });
        } else {
            return this._columns[options];
        }
    }

    selectAllRows() {
        this.rows().select();
    }

    unselectAllRows() {
        this.rows().select(false);
    }

    toogleSelectAllRows() {
        if (this.rows().count() === this.rows({ selected: true }).count()) {
            this.unselectAllRows();
        } else {
            this.selectAllRows();
        }
    }

    addRow(row) {
        this._data.push(row);
    }

    getCurrentItem(showWarning = false, returnRows = false) {
        const selectedRows = this.rows({ selected: true });

        if (selectedRows.count()) {
            if (this.settings.row.selectType === RowSetting.SELECT_TYPE_SINGLE) {
                if (returnRows) {
                    return selectedRows._rows[0];
                } else {
                    return selectedRows.data()[0];
                }
            } else {
                if (returnRows) {
                    return selectedRows._rows;
                } else {
                    return selectedRows.data(); //REWRITE
                }
            }
        } else {
            if (showWarning) {
                const alerts = useAlertStore(window.pinia);
                const { translations } = useTranslations();
                alerts.alert(translations.SELECT_ROW, "info", translations.SELECT_ROW_TEXT);
            }

            return null;
        }
    }

    getCurrentItemValue(value, showWarning = false){
        const item = this.getCurrentItem(showWarning);

        if(item){
            if(Array.isArray(item)){
                return item.map((i) => {
                    return i[value];
                })
            }else{
                return item[value];
            }
        }

        return null;
    }

    getColumnByID(id) {
        return this._columns.find((column) => column.id === id);
    }

    refresh(resetPaging = false) {
        if (this.ajax) {
            this.ajax.reload(null, resetPaging);
        }
    }

    get columnPositionToIndexMap() {
        return this._columns.reduce((result, item, index) => {
            result[item.position] = index;
            return result;
        }, {});
    }

    static isCallback(func) {
        return typeof func === "function";
    }

    get settings() {
        return this._settings;
    }

    set settings(value) {
        this._settings = value;
    }

    get columns() {
        return this._columns;
    }

    set columns(value) {
        this._columns = value;
    }

    get ajax() {
        return this._ajax;
    }

    set ajax(value) {
        this._ajax = value;
    }

    get scroller() {
        return this._scroller;
    }

    set scroller(value) {
        this._scroller = value;
    }

    get contextMenu() {
        return this._contextMenu;
    }

    set contextMenu(value) {
        this._contextMenu = value;
    }

    get onInitComplete() {
        return this._onInitComplete;
    }

    set onInitComplete(value) {
        this._onInitComplete = value;
    }

    get presetManager() {
        return this._presetManager;
    }

    set presetManager(value) {
        this._presetManager = value;
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
