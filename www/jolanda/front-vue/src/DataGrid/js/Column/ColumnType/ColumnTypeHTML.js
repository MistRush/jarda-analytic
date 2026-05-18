import { ColumnType } from "./ColumnType";
import { ColumnDef } from "../../Settings/ColumnDef";

export class ColumnTypeHTML extends ColumnType {
    _format = ColumnDef.COLUMN_TYPE_HTML;
    constructor(column) {
        super(column);
    }

    render(data, onlyData = false) {
        if (data == null) return "";

        if (onlyData) return data;

        return "...";
    }

    renderPreview(data, cell = null) {
        return data;
    }
}
