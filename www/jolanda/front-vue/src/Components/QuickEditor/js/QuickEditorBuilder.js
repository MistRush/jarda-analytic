import {useAjax} from "@/Composables/useAjax.js";

export default class QuickEditorBuilder{
    quickEditorDef = null;
    quickEditor = null;
    onAfterInit = null;

    url = null;
    fetchedData = null;

    constructor() {
        this.url = '/default/settings-system/edit-country';
    }

    async createDef(params){

    }

    async _createDef(params){
        this.fetchedData = await this.fetchData();

        const quickeditor = await this.createDef(params);

        this.quickEditorDef = quickeditor;
        this.quickEditorDef.onAfterInit = (quickeditor) => this._afterInit(quickeditor);

        return quickeditor;
    }


    afterInit(quickeditor){

    }

    _afterInit(quickeditor){
        this.quickEditor = quickeditor;

        this.afterInit(quickeditor);

        if(this.onAfterInit){
            this.onAfterInit(quickeditor);
        }
    }

    async fetchData(){
        if(!this.url){
            return;
        }

        const ajax = useAjax();

        const {data} = await ajax.postForm(this.url, null, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        return data;
    }
}