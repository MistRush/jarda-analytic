import {ColumnType} from "./ColumnType";
import {ColumnDef} from "../../Settings/ColumnDef";
import moment from 'moment/min/moment-with-locales';

export class ColumnTypeDate extends ColumnType{
    _format = ColumnDef.COLUMN_TYPE_DATE;
    constructor(column) {
        super(column);
    }

    render(data, onlyData= false){
        if (data != null) {
            //TODO MOMENT LOCALE
            moment.locale('cs');

            const dt = moment(data);
            dt.locale('cs');
            return dt.format('L');
        }

        return "";
    }

    get editor(){
        return 'date';
    }
}