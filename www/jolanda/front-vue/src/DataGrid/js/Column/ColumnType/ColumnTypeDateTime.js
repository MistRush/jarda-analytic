import {ColumnType} from "./ColumnType";
import {ColumnDef} from "../../Settings/ColumnDef";
import moment from 'moment/min/moment-with-locales';

export class ColumnTypeDateTime extends ColumnType{
    _format = ColumnDef.COLUMN_TYPE_DATETIME;
    constructor(column) {
        super(column);
    }

    render(data, onlyData= false){
        if (data === null)
            return "";


        //TODO MOMENT LOCALE
        moment.locale('cs');

        const dt = moment(data);
        dt.locale('cs');
        return dt.format('L LTS');
    }

    get editor(){
        return 'datetime';
    }
}