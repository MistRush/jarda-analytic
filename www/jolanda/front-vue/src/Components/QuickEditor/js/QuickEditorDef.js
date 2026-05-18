import FormGroup from "@/Components/OldForm/js/Controls/FormGroup";
import SubGridDef from "@/DataGrid/js/SubGridDef";

export default class QuickEditorDef extends FormGroup{
    static SAVE_DATA_SERVERSIDE = 'serverside';
    static SAVE_DATA_LOCAL = 'local';

    id;
    data_url;
    entity_id = null;
    dialog;
    custom_code;
    send_on_enter = true;
    dataListUrl = 'data-list';
    dataUpdateUrl = 'data-update';
    dataCreateUrl = 'data-create';
    _bu;
    customData = {};

    dataSaveType = QuickEditorDef.SAVE_DATA_SERVERSIDE;
    forGrid;
    local_tmp_id;
    create_default_values;

    quickEditor = null;

    constructor(label, url, superInstance = null) {
        super(null, label);
        this._bu = window.basePath;
        // this.super = superInstance;
        this.parent = this;
        this.super = superInstance;



        this.id = 'quickeditor_' + Math.random().toString(36).substring(7);
        this.data_url = url;
    }

    getEntityId(){
        return this.entity_id;
    }

    setEntityId(entity_id) {
        this.entity_id = entity_id;
        if(!this.getFormControl('ID')){
            this.addHidden('ID').setValue(entity_id);
        }else{
            this.getFormControl('ID').setValue(entity_id);
        }

        return this;
    }

    getDialog(){
        return this.dialog;
    }

    setDialog(dialog){
        this.dialog = dialog;
        return this;
    }

    getId(){
        return this.id;
    }

    getDatalistUrl() {
        let conjunction = '?';

        if (this.dataListUrl.includes('?')) {
            conjunction = '&';
        }

        return `${this._bu}/${this.data_url}/${this.dataListUrl}${conjunction}ID=`;
    }

    getDataupdateUrl(){
        return `${this._bu}/${this.data_url}/${this.dataUpdateUrl}`;
    }

    getDatacreateUrl(){
        return `${this._bu}/${this.data_url}/${this.dataCreateUrl}`;
    }

    setParent(column, value){
        this.addHidden(column).setValue(value);
        return this;
    }

    setCustomCode(custom_code){
        this.custom_code = custom_code;
        return this;
    }

    getCustomCode(){
        return this.custom_code;
    }

    getSendOnEnter(){
        return this.send_on_enter;
    }

    sendOnEnter(sendOnEnter){
        this.send_on_enter = send_on_enter;
        return this;
    }

    setDataListUrl(dataListUrl){
        this.dataListUrl = dataListUrl;
        return this;
    }

    setDataUpdateUrl(dataUpdateUrl){
        this.dataUpdateUrl = dataUpdateUrl;
        return this;
    }

    setDataCreateUrl(dataCreateUrl){
        this.dataCreateUrl = dataCreateUrl;
        return this;
    }

    addGrid(id, title){
        const grid = new SubGridDef(id, title, null);
        grid.setParentEditor(this);
        this.formControls.push(grid);
    }

    getSubGrids(){
        return this.formControls.filter(control => control instanceof SubGridDef);
    }

    setDataListAction(dataListAction){
        this.setDataListUrl(dataListAction);
    }

    setDataUpdateAction(dataUpdateAction){
        this.setDataUpdateUrl(dataUpdateAction);
    }

    setDataCreateAction(dataCreateAction){
        this.setDataCreateUrl(dataCreateAction);
    }

    addCustomData(key, value){
        this.customData[key] = value;
        return this;
    }

    setCustomData(customData){
        this.customData = customData;
        return this;
    }

    getCustomData(){
        return this.customData;
    }

    getCustomDataJson(){
        return JSON.stringify(this.customData);
    }

    setupRemoteEditor(module) {
        let url = this.data_url;
        url = url.substring(url.indexOf('/'));
        this.setDataUrl(module + url);

        for (const grid of this.getSubGrids()) {
            let gridUrl = grid.getDatalistUrl();
            gridUrl = gridUrl.substring(gridUrl.indexOf(grid._bu));
            gridUrl = gridUrl.substring(gridUrl.indexOf('/', 1));
            grid.setDatalistUrl(`${this._bu}/${module}${gridUrl}`);

            gridUrl = grid.getDeleteUrl();
            gridUrl = gridUrl.substring(gridUrl.indexOf(grid._bu));
            gridUrl = gridUrl.substring(gridUrl.indexOf('/', 1));
            grid.setDeleteUrl(`${this._bu}/${module}${gridUrl}`);

            gridUrl = grid.getUpdateUrl();
            gridUrl = gridUrl.substring(gridUrl.indexOf(grid._bu));
            gridUrl = gridUrl.substring(gridUrl.indexOf('/', 1));
            grid.setUpdateUrl(`${this._bu}/${module}${gridUrl}`);

            const quickEditorUrl = grid.getQuickEditor();
            if (quickEditorUrl) {
                let editorUrl = quickEditorUrl.substring(quickEditorUrl.indexOf(grid._bu));
                editorUrl = editorUrl.substring(editorUrl.indexOf('/', 1));
                grid.addEditor(`${module}${editorUrl}`);
            }
        }

        const comboboxes = this.getControlsByType('ComboBox');
        for (const combobox of comboboxes) {
            if (combobox.isAjax()) {
                let comboUrl = combobox.getControlPart().getAttribute('data-store');
                comboUrl = comboUrl.substring(comboUrl.indexOf(this._bu));
                comboUrl = comboUrl.substring(comboUrl.indexOf('/', 1));
                combobox.getControlPart().setAttribute('data-store', `${this._bu}/${module}${comboUrl}`);
            }
        }
    }

    getControlsByType(type) {
        const controls = [];

        this.getFormControls().forEach(formControl => {
            if (formControl instanceof type) {
                controls.push(formControl);
            }
        });

        return controls;
    }
}