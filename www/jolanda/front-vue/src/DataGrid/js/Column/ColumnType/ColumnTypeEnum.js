import {ColumnType} from "./ColumnType";
import {ColumnDef} from "../../Settings/ColumnDef";

export class ColumnTypeEnum extends ColumnType{
    _format = ColumnDef.COLUMN_TYPE_ENUM;
    constructor(column) {
        super(column);
    }

    render(data, onlyData= false){
        if (typeof this.enumValues !== 'object' || !this.enumValues)
            return 'ENUM values not set';
        else if (this.enumValues[data] === undefined) {
            if (data === null)
                return '';
            else
                return 'INVALID VALUE';
        } else
            return `<span class="text">${this.enumValues[data]}</span>`;
    }

    get enumValues(){
        return this.column.enumValues;
    }

    get editor(){
        return 'enum';
    }
}