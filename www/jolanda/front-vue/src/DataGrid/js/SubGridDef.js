import GridDef from './GridDef.js';

export default class SubGridDef extends GridDef {
    class = 'SubGrid';
    height = '56vh';
    quick_editor = null;
    parent_entity = '';
    parent_editor = null;

    constructor(id, title, editAction = null, superInstance = null, allowExport = true) {
        super(id, title, editAction, superInstance, allowExport);
    }

    setParentEditor(editor){
        this.parent_editor = editor.getId();
        return this;
    }

    getQuickEditor(){
        return this.quick_editor;
    }

    addEditor(url){
        this.quick_editor = this._bu + '/' + url;

        return this;
    }

    getParentEntity(){
        return this.parent_entity;
    }

    setParentEntity(column){
        this.parent_entity = column;
        return this;
    }

}