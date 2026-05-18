import {ColumnType} from "./ColumnType";
import {ColumnDef} from "../../Settings/ColumnDef";

export class ColumnTypeBool extends ColumnType{
    _format = ColumnDef.COLUMN_TYPE_BOOL;
    constructor(column) {
        super(column);
    }

    render(data, onlyData = false){
        if (data === null)
            return 'Ne';
        return (Number(data)) ? 'Ano' : 'Ne';
    }

    get enumValues(){
        return {
            0: 'Ne',
            1: 'Ano'
        };
    }

    get editor(){
        return 'bool';
    }
}