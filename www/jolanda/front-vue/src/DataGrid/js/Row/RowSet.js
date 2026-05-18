import {Row} from "./Row";

export class RowSet{
    _rows = [];
    _dataGrid;

    constructor(dataGrid, rows){
        this._rows = rows;
        this.dataGrid = dataGrid;
    }

    data(){
        let data = [];
        this._rows.forEach((row, index) => {
            data.push(row.data());
        });

        return data;
    }

    updateData(data){
        this._rows.forEach((row, index) => {
            if(typeof data === 'object'){
                row.updateData(data);
            }else if(Array.isArray(data)){
                if(typeof data[index] === 'undefined'){
                    row.updateData(data[index]);
                }
            }
        });
    }

    select(select = true){
        this._rows.forEach((row, index) => {
            row.select(select);
        });
    }

    deselect(){
        this._rows.forEach((row, index) => {
            row.deselect();
        });
    }

    row(options){
        //TODO Options? stejně jako v DataGrid
        return this._rows.filter(row => row._position === options);
    }

    //OLD DATAGRID
    every(callback){
        if(typeof callback !== 'function'){
            throw new Error('Callback must be a function');
        }

        let result = [];
        let rowSet = true;
        this._rows.forEach((row, index) => {
            const rowResult = callback(row._position);

            if(typeof rowResult !== 'undefined'){
                if(!(rowResult instanceof Row)){
                    rowSet = false;
                }
                result.push(rowResult);
            }
        });

        if(rowSet && result.length){
            result = new RowSet(this._dataGrid, result);
        }

        return result;
    }

    indexes(){
        return this._rows.map(row => row._position);
    }

    count(){
        return this._rows.length;
    }

    remove(){
        this._rows.forEach((row, index) => {
            row.remove();
        });
    }


    get dataGrid() {
        return this._dataGrid;
    }

    set dataGrid(value) {
        this._dataGrid = value;
    }
}