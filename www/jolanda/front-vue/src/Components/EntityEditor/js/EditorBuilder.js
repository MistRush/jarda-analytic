export default class EditorBuilder{
    editorDef = null;
    editor = null;
    onAfterInit = null;

    constructor() {
    }

    async createDef(params){

    }

    async _createDef(params){
        const editor = this.createDef(params);

        this.editorDef = editor;
        this.editorDef.onAfterInit = (editor) => this._afterInit(editor);

        return editor;
    }


    afterInit(editor){

    }

    _afterInit(editor){
        this.editor = editor;

        this.afterInit(editor);

        if(this.onAfterInit){
            this.onAfterInit(editor);
        }
    }
}