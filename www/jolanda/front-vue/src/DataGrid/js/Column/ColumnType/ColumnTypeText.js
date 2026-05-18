import {ColumnType} from "./ColumnType";
import {ColumnDef} from "../../Settings/ColumnDef";

export class ColumnTypeText extends ColumnType{
    _format = ColumnDef.COLUMN_TYPE_TEXT;
    constructor(column) {
        super(column);
    }

    render(data, onlyData= false){
        if (data == null)
            return "";

        let span = document.createElement('span');
        span.classList.add('text');
        span.innerText = span.textContent = data;

        if (onlyData)
            return span.innerText;

        return span.outerHTML;
    }
}