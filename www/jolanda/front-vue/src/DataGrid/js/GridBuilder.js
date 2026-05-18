export default class GridBuilder{
    gridDef = null;
    grid = null;
    onAfterInit = null;

    constructor() {
    }

    async createDef(params){

    }

    async _createDef(params){
        const grid = await this.createDef(params);

        this.gridDef = grid;
        this.gridDef.onAfterInit = (grid) => this._afterInit(grid);

        return grid;
    }


    afterInit(grid){

    }

    _afterInit(grid){
        this.grid = grid;

        this.afterInit(grid);

        if(this.onAfterInit){
            this.onAfterInit(grid);
        }
    }
}