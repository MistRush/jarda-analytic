import { ColumnType } from "./ColumnType";
import { ColumnDef } from "../../Settings/ColumnDef";

export class ColumnTypeCounter extends ColumnType {
    _format = ColumnDef.COLUMN_TYPE_COUNTER;

    constructor(column) {
        super(column);
    }

    render(data, onlyData = false, cell) {
        return cell.row.position + 1;
    }

    get editor() {
        return null;
    }
}
