import { ColumnDef } from "@/DataGrid/js/Settings/ColumnDef";
import { DataGrid } from "@/DataGrid/js/DataGrid";
import { ColumnTypeText } from "./ColumnType/ColumnTypeText";
import { ColumnTypeEnum } from "./ColumnType/ColumnTypeEnum";
import { ColumnTypeBool } from "./ColumnType/ColumnTypeBool";
import { ColumnTypeNumber } from "./ColumnType/ColumnTypeNumber";
import { ColumnTypeDateTime } from "./ColumnType/ColumnTypeDateTime";
import { ColumnTypeDate } from "./ColumnType/ColumnTypeDate";
import { ColumnTypeTime } from "./ColumnType/ColumnTypeTime";
import { ColumnTypeLongText } from "./ColumnType/ColumnTypeLongText";
import { ColumnTypeCheckbox } from "./ColumnType/ColumnTypeCheckbox";
import { ColumnTypeCurrency } from "@/DataGrid/js/Column/ColumnType/ColumnTypeCurrency";
import { ColumnTypePercent } from "@/DataGrid/js/Column/ColumnType/ColumnTypePercent";
import { ColumnTypeGallery } from "@/DataGrid/js/Column/ColumnType/ColumnTypeGallery";
import { ColumnTypeCounter } from "@/DataGrid/js/Column/ColumnType/ColumnTypeCounter";
import { ColumnTypeHTML } from "@/DataGrid/js/Column/ColumnType/ColumnTypeHTML";

export class Column extends ColumnDef {
    _columnDef;
    _dataGrid;
    _id;

    constructor(columnDef, dataGrid, id) {
        if (typeof columnDef.position === "undefined" || columnDef.position === null) {
            const positions = dataGrid.columns.map((col) => col.position).filter((pos) => pos !== undefined);
            const maxPosition = positions.length > 0 ? Math.max(...positions) : -1;
            columnDef.position = maxPosition + 1;
        }

        super(columnDef);

        this.columnDef = columnDef;
        this._dataGrid = dataGrid;
        this._id = id;

        this.format = Column.getColumnTypeInstance(this, this.format);
    }

    isInOrder() {
        return this._dataGrid._order.filter((item) => item.column == this.id)[0] ?? null;
    }

    set order(direction) {
        if (this.dataGrid.settings.order.type === "single") {
            this.dataGrid.order(this.id, direction);
        } else {
            let order = this.isInOrder();

            if (direction === DataGrid.ORDER_ASC) {
                if (order) {
                    order.dir = DataGrid.ORDER_ASC;
                } else {
                    this._dataGrid._order.push({
                        dir: DataGrid.ORDER_ASC,
                        column: this.id,
                    });
                }
            } else if (direction === DataGrid.ORDER_DESC) {
                if (order) {
                    order.dir = DataGrid.ORDER_DESC;
                } else {
                    this._dataGrid._order.push({
                        dir: DataGrid.ORDER_DESC,
                        column: this.id,
                    });
                }
            }
        }

        //TODO přepsat asi do Data objectu a tam sort a i v DataGrid
        if (!this.dataGrid.ajax) {
            this.dataGrid._data.sort((a, b) => {
                if (direction === DataGrid.ORDER_ASC) {
                    return a[this.data] >= b[this.data] ? 1 : -1;
                } else {
                    return a[this.data] <= b[this.data] ? 1 : -1;
                }
            });
        }
    }

    get order() {
        let order = this.isInOrder();
        return order ? order.dir : null;
    }

    get columnDef() {
        return this._columnDef;
    }

    set columnDef(value) {
        this._columnDef = value;
    }

    get dataGrid() {
        return this._dataGrid;
    }

    set dataGrid(value) {
        this._dataGrid = value;
    }

    get currentWidth() {
        return Math.max(parseInt(this.width) ?? 0, 36.4);
    }

    get position() {
        return this._position;
    }

    set position(value) {
        if (typeof this._position === "undefined") {
            this._position = value;
            return;
        }

        const columnsCopy = [...this.dataGrid.columns];

        // Vyjmutí přesouvaného sloupce
        const movedColumn = this;

        // Pokud se přesouvá směrem dolů (z menší pozice na větší)
        if (this.position < value) {
            columnsCopy.forEach((column) => {
                if (column.position > this.position && column.position <= value) {
                    column._position--;
                }
            });
        }
        // Pokud se přesouvá směrem nahoru (z větší pozice na menší)
        else if (this.position > value) {
            columnsCopy.forEach((column) => {
                if (column.position >= value && column.position < this.position) {
                    column._position++;
                }
            });
        }

        // Nastavení nové pozice pro přesunutý sloupec
        movedColumn._position = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get visible() {
        return this._visible;
    }

    set visible(value) {
        const oldValue = this._visible;

        this._visible = value;

        if (oldValue !== value) {
            this.dataGrid.presetManager?.triggerSave();
        }
    }

    static getColumnTypeInstance(column, format, setting = {}) {
        switch (format) {
            case ColumnDef.COLUMN_TYPE_TEXT:
                return new ColumnTypeText(column);
            case ColumnDef.COLUMN_TYPE_ENUM:
                return new ColumnTypeEnum(column);
            case ColumnDef.COLUMN_TYPE_BOOL:
                return new ColumnTypeBool(column);
            case ColumnDef.COLUMN_TYPE_NUMBER:
                return new ColumnTypeNumber(column);
            case ColumnDef.COLUMN_TYPE_DATETIME:
                return new ColumnTypeDateTime(column);
            case ColumnDef.COLUMN_TYPE_DATE:
                return new ColumnTypeDate(column);
            case ColumnDef.COLUMN_TYPE_TIME:
                return new ColumnTypeTime(column);
            case ColumnDef.COLUMN_TYPE_LONGTEXT:
                return new ColumnTypeLongText(column);
            case ColumnDef.COLUMN_TYPE_CHECKBOX:
                return new ColumnTypeCheckbox(column);
            case ColumnDef.COLUMN_TYPE_CURRENCY:
                return new ColumnTypeCurrency(column, setting);
            case ColumnDef.COLUMN_TYPE_PERCENT:
                return new ColumnTypePercent(column);
            case ColumnDef.COLUMN_TYPE_GALLERY:
                return new ColumnTypeGallery(column, setting);
            case ColumnDef.COLUMN_TYPE_COUNTER:
                return new ColumnTypeCounter(column);
            case ColumnDef.COLUMN_TYPE_HTML:
                return new ColumnTypeHTML(column);
        }

        // return new ColumnType();
        return null;
    }
}
