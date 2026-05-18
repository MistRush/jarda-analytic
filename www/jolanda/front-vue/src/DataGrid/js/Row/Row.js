import {Cell} from "@/DataGrid/js/Cell/Cell";
import {RowSetting} from "@/DataGrid/js/Settings/RowSetting";
import {useErrorHandlerStore} from "@/App/stores/errorHandlerStore.js";

export class Row{
    _cells = null;
    _dataGrid;
    _position;

    constructor(dataGrid, position) {
        this._dataGrid = dataGrid;
        this._position = position;
    }

    data(){
        return this.dataGrid.getData(true)[this.position] ?? undefined;
    }

    getData(){
        return this.data();
    }

    updateData(data){
        this.dataGrid.getData()[this.position] = data;
    }

    select(select = true, event = null){
        try{
            if(select){
                this._select(event);
            }else{
                this.deselect(event);
            }
        }catch (e){

        }
    }

    _select(event = null){
        try{
            if(this.dataGrid.settings.row.onBeforeSelect?.(this, event) === false){
                return;
            }
        }catch (e){
            const errorHandlerStore = useErrorHandlerStore();
            const errorHandler = errorHandlerStore.getErrorHandler();
            if(errorHandler)
                errorHandler.handleError(e);
            else console.error(e);
        }

        if(this.dataGrid.selectedRows().includes(this._position)){
            return;
        }

        if(this.dataGrid.settings.row.selectType === RowSetting.SELECT_TYPE_SINGLE){
            this.dataGrid._selectedRows = [];
        }

        if(this.dataGrid.settings.row.selectType === RowSetting.SELECT_TYPE_MULTI || this.dataGrid.settings.row.selectType === RowSetting.SELECT_TYPE_MULTI_CHECKBOX){
            if(event){
                if(event.shiftKey){
                    if(this.position < Math.min(...this.dataGrid._selectedRows)){
                        let lastSelectedRow = Math.min(...this.dataGrid._selectedRows);

                        for(let i = this.position + 1; i < lastSelectedRow; i++){
                            this.dataGrid.row(i).select();
                        }
                    }else if(this.position > Math.max(...this.dataGrid._selectedRows)){
                        let lastSelectedRow = Math.max(...this.dataGrid._selectedRows)

                        for(let i = this.position - 1; i > lastSelectedRow; i--){
                            this.dataGrid.row(i).select();
                        }
                    }

                    this.dataGrid._selectedRows.push(this._position);
                }else if(event.ctrlKey || event._ctrlKey){
                    this.dataGrid._selectedRows.push(this._position);
                }else{
                    if(this.dataGrid.settings.row.selectType === RowSetting.SELECT_TYPE_MULTI){
                        this.dataGrid._selectedRows.push(this._position);
                    }

                    if(this.dataGrid.settings.row.selectType === RowSetting.SELECT_TYPE_MULTI_CHECKBOX){
                        this.dataGrid._selectedRows = [];
                        this.dataGrid._selectedRows.push(this._position);
                    }
                }
            }else{
                this.dataGrid._selectedRows.push(this._position);
            }
        }else{
            this.dataGrid._selectedRows.push(this._position);
        }

        this.dataGrid.settings.row.onSelect?.(event, this);
    }

    deselect(event = null){
        try{
            if(this.dataGrid.settings.row.onBeforeDeselect?.(this, event) === false){
                return;
            };
        }catch (e){
            const errorHandlerStore = useErrorHandlerStore();
            const errorHandler = errorHandlerStore.getErrorHandler();
            if(errorHandler)
                errorHandler.handleError(e);
            else console.error(e);
        }

        if(!this.dataGrid.selectedRows().includes(this._position)){
            return;
        }

        if(this.dataGrid.settings.row.selectType === RowSetting.SELECT_TYPE_SINGLE){
            // this.dataGrid._selectedRows = [];
            const rowsForUnselect = this.dataGrid._selectedRows.filter(row => row !== this._position);

            rowsForUnselect.forEach((row) => {
                this.dataGrid.row(row).deselect();
            });
        }else if(this.dataGrid.settings.row.selectType === RowSetting.SELECT_TYPE_MULTI_CHECKBOX){
            if(event){
                if(event.ctrlKey || event._ctrlKey || event.shiftKey){
                    this.dataGrid._selectedRows = this.dataGrid._selectedRows.filter(row => row !== this._position);
                }else{
                    const rowsForUnselect = this.dataGrid._selectedRows.filter(row => row !== this._position);

                    rowsForUnselect.forEach((row) => {
                        this.dataGrid.row(row).deselect();
                    });

                    if(!this.isSelected()){
                        this.select();
                    }
                }
            }else{
                this.dataGrid._selectedRows = this.dataGrid._selectedRows.filter(row => row !== this._position);
            }

        }else{
            this.dataGrid._selectedRows = this.dataGrid._selectedRows.filter(row => row !== this._position);
        }

        this.dataGrid.settings.row.onDeselect?.(event, this);
    }

    toggleSelect(event = null){
        if(this.isSelected()){
            this.deselect(event);
        }else{
            this.select(true, event);
        }
    }

    isSelected(){
        return this.dataGrid.selectedRows().includes(this._position);
    }


    remove(){
        this.dataGrid.getData().splice(this.position, 1);
    }

    getSortedCellsByPosition(){
        let cells = [];
        this.dataGrid.columns.sort((a, b) => a.column.position - b.column.position).forEach((column, j) => {
            cells.push(new Cell(this, column));
        });

        this._cells = cells;
        return this._cells;
    }

    getCellByPosition(position){
        const column = this.dataGrid.columns.find(item => item.position === position);

        return new Cell(this, column);
    }

    get cells() {
        // if(this._cells){
        //     return this._cells;
        // }

        let cells = [];
        this.dataGrid.columns.forEach((column, j) => {
            cells.push(new Cell(this, column));
        });

        this._cells = cells;
        return this._cells;
        // return this._cells;
    }

    set cells(value) {
        this._cells = value;
    }

    get dataGrid() {
        return this._dataGrid;
    }

    set dataGrid(value) {
        this._dataGrid = value;
    }


    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
    }

    get isLoaded(){
        if(!this.dataGrid.ajax){
            return true;
        }

        if(this.dataGrid.ajax.loadedRows.includes(this.position)){
            return true;
        }else{
            return false;
        }
    }
}