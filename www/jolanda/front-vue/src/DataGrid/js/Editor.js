import {useAppStore} from "@/App/stores/appStore";

export default class Editor{
    isShown = false;
    grid = null;
    editor = null;
    id = null;
    dialog = null;
    parentRows = null;
    type;

    constructor(grid, type) {
        this.grid = grid;
        this.type = type;
    }

    show(id = null, parentRows = null){
        if(this.type === 'quick'){
            if(this.isShown){
                return;
            }

            this.id = id;
            this.parentRows = parentRows;
            this.isShown = true;
        }else if(this.type === 'entity'){
            if(this.isShown){
                return;
            }

            this.id = id;
            this.parentRows = parentRows;
            this.isShown = true;

            if(this.grid.params.urls.editAction){
                const { app } = useAppStore(window.pinia);
                app.router.router.currentRoute.meta.cache = true;
                app.router.router.currentRoute.meta.activeGrid = this.grid;

                if(id){
                    app.router.router.push({
                        name: this.grid.params.urls.editAction,
                        query: { entity_ID: id },
                    });
                }else{
                    app.router.router.push({
                        name: this.grid.params.urls.editAction,
                    });
                }
            }
        }
    }

    close(){
        this.grid.refresh();

        this.id = null;
        this.parentRows = null;
        this.isShown = false;
        this.editor = null;
    }
}