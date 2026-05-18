import dataGrid from "@/DataGrid/Components/DataGrid.vue";
import {reactive} from "vue";

export class DataGridState{
    _state;

    constructor(dataGrid) {
        this._state = reactive({
          dataGrid: dataGrid,
        });
    }


    get state() {
        return this._state;
    }

    get dataGrid() {
        return this.state.dataGrid;
    }

    set dataGrid(value) {
        this.state.dataGrid = value;
    }
}