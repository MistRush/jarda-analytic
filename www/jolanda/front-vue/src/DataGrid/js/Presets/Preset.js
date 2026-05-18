export class Preset {
    static stateStructure = {
        time: null,
        start: 0,
        order: [],
        columns: [],
        ColReorder: [],
        columnsWidth: [],
    }

    _state = {
    };

    _name;
    _id;
    _dataGrid;

    constructor(id, name, state, dataGrid, stateSetting) {
        //TODO STATE SETTING
        this.state = JSON.parse(JSON.stringify(Preset.stateStructure));
        this.name = name;
        this.id = id;
        this._dataGrid = dataGrid;
        Object.keys(Preset.stateStructure).forEach((key) => {
            if(state.hasOwnProperty(key)){
                this.state[key] = state[key];
            }
        });

        if(this.state.time === null){
            this.state.time = new Date().getTime();
        }
    }

    load(){
        // this.dataGrid._order = this.state.order;
        this.dataGrid._columns.forEach((column, index) => {
            if(this.state.columns[index] && typeof this.state.columns[index].visible !== 'undefined'){
                column.visible = this.state.columns[index].visible;
            }else{
                column.visible = true;
            }

            if(this.state.ColReorder[index]){
                column.position = this.state.ColReorder[index];
            }

            if(this.state.columnsWidth[index]){
                column.width = this.state.columnsWidth[index];
            }
        });

        this.dataGrid.presetManager?.triggerSave();
    }

    updateFromCurrentDatagrid(){

    }

    get state(){
        return this._state;
    }

    set state(value){
        this._state = value;
    }

    get name(){
        return this._name;
    }

    set name(value){
        this._name = value;
    }

    get id(){
        return this._id;
    }

    set id(value){
        this._id = value;
    }

    get dataGrid(){
        return this._dataGrid;
    }

    set dataGrid(value){
        this._dataGrid = value;
    }

}