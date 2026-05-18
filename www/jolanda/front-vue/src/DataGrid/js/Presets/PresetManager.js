import {Preset} from "./Preset";

export class PresetManager {
    _settings;
    _presets = {};
    _dataGrid;
    constructor(settings, dataGrid) {
        this.settings = settings;
        this._dataGrid = dataGrid;
    }

    createPresetFromCurrentDataGrid(id, name) {
        const state = JSON.parse(JSON.stringify(Preset.stateStructure));

        state.order = this.dataGrid._order;
        this.dataGrid._columns.forEach((column) => {
            state.columns.push({visible: column.visible});
            state.ColReorder.push(column.position);
            state.columnsWidth.push(column.currentWidth);
        });

        const newPreset = new Preset(id, name, state, this.dataGrid);

        return newPreset;
    }

    createPresetFromState(id, name, state){
        const newPreset = new Preset(id, name, state, this.dataGrid);

        return newPreset;
    }

    addPresetFromCurrentDataGrid(id, name){
        if(id === null){
            id = this.getLastNumericId();
        }

        const newPreset = this.createPresetFromCurrentDataGrid(id, name);
        this.presets[id] = newPreset;

        return newPreset;
    }

    addPresetFromState(id, name, state){
        if(id === null){
            id = this.getLastNumericId();
        }

        const newPreset = this.createPresetFromState(id, name, state);
        this.presets[id] = newPreset;

        return newPreset;
    }

    removePreset(id){
        delete this.presets[id];
    }

    load(id){
        const preset = this.getPresetByID(id);

        if(preset){
            preset.load();
        }
    }

    getLastNumericId(){
        const numericKeys = Object.keys(this.presets)
            .map(key => parseInt(key)) // Převedení klíčů na čísla
            .filter(key => !isNaN(key)); // Filtrování jen číselných klíčů

        return numericKeys.length > 0 ? Math.max(...numericKeys) + 1 : 1;
    }

    getPresetByID(id){
        return this.presets[id] ?? null;
    }

    triggerSave(){
        if(this.settings.presetTriggerSave && typeof this.settings.presetTriggerSave === 'function'){
            const preset = this.createPresetFromCurrentDataGrid('current_state', 'Current state');
            this.settings.presetTriggerSave(preset.state);
        }
    }

    get settings(){
        return this._settings;
    }

    set settings(value){
        this._settings = value;
    }

    get presets(){
        return this._presets;
    }

    set presets(value){
        this._presets = value;
    }

    get dataGrid(){
        return this._dataGrid;
    }

    set dataGrid(value){
        this._dataGrid = value;
    }
}