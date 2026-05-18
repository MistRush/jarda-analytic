import {ColumnType} from "./ColumnType";
import {ColumnDef} from "../../Settings/ColumnDef";

export class ColumnTypeLongText extends ColumnType{
    _format = ColumnDef.COLUMN_TYPE_LONGTEXT;
    constructor(column) {
        super(column);
    }

    render(data, onlyData= false){
        if (data === null)
            return "";
        data = data.replace(/<(?:.|\n)*?>/gm, '');
        if (onlyData)
            return data.substr(0, 100);
        else
            return `<span class="text" data-text="${data.substr(0, 500)}">${data.substr(0, 100)}...</span>`;
    }
}