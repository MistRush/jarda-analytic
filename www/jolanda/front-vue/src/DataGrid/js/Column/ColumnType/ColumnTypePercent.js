import { ColumnType } from "./ColumnType";
import { ColumnDef } from "../../Settings/ColumnDef";

export class ColumnTypePercent extends ColumnType {
    _format = ColumnDef.COLUMN_TYPE_PERCENT;
    constructor(column) {
        super(column);
    }

    render(data, onlyData = false) {
        if (data === null) return "";

        if (onlyData) return data;

        return `<span class="text">${data} %</span>`;
    }

    get editor() {
        return "number";
    }
}
