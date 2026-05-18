//TODO Start ze středu tabulky a ne z konce a začátku
export class Scroller{
    _rowSize;
    _virtualListRef;
    _dataGrid;
    _loafingTriggerOffset = 0.8;
    _lastScrollTop = 0;
    _lastScrollLeft = 0;
    _loadDataTimer = null;

    static DIRECTION_DOWN = 'down';
    static DIRECTION_UP = 'up';
    static DIRECTION_LEFT = 'left';
    static DIRECTION_RIGHT = 'right';

    constructor(dataGrid, rowSize){
        this._rowSize = rowSize;
        this._dataGrid = dataGrid;
    }

    onScroll(event){
        const scrollDirection = this.scrollDirection;
        this.lastScrollTop = this.scrollTop;
        this.lastScrollLeft = this.scrollLeft;

        if(!this.viewportItemsLength){
            return;
        }

        if(scrollDirection.y) {
            this.onScrollY(scrollDirection);
        }

        if(scrollDirection.x) {
            this.onScrollX(scrollDirection);
        }
    }

    onScrollY(scrollDirection){
        if(scrollDirection.y === Scroller.DIRECTION_DOWN){
            this.onScrollDown();
        } else if(scrollDirection.y === Scroller.DIRECTION_UP) {
            this.onScrollUp();
        }
    }

    onScrollX(scrollDirection){
        if(scrollDirection.x === Scroller.DIRECTION_LEFT){
            this.onScrollLeft();
        } else if(scrollDirection.x === Scroller.DIRECTION_RIGHT) {
            this.onScrollRight();
        }
    }

    onScrollUp(){
        if(!this.dataGrid.ajax) return;

        if(this.dataGrid.ajax.startIndex <= 0 && this.dataGrid.ajax.loadedRows.indexOf(0) > -1){
            return;
        }

        if(this.loadDataTimer){
            clearTimeout(this.loadDataTimer);
        }

        this.loadDataTimer = setTimeout(() => {
            if(this.viewportItems[0] < this.scrollUpTriggerIndex){
                this.dataGrid.ajax.state.start =  Math.max(parseInt(this.viewportItems[0] - (this.dataGrid.ajax.state.count / 2)), 0);
                this.dataGrid.ajax.reload();
                this.loadDataTimer = null;
            }
        }, 200);
    }

    onScrollDown(){
        if(!this.dataGrid.ajax) return;

        if(this.dataGrid.ajax.endIndex >= this.dataGrid.ajax.filteredCount && this.dataGrid.ajax.loadedRows.indexOf(this.dataGrid.ajax.filteredCount-1) > -1){
            return;
        }

        if(this.loadDataTimer){
            clearTimeout(this.loadDataTimer);
        }

        this.loadDataTimer = setTimeout(() => {
            if(this.viewportItems[this.viewportItemsLength-1] > this.scrollDownTriggerIndex){
                this.dataGrid.ajax.state.start =  Math.min(parseInt(this.viewportItems[this.viewportItemsLength-1] - (this.dataGrid.ajax.state.count / 2)), (this.dataGrid.ajax.filteredCount - this.dataGrid.ajax.state.count));
                this.dataGrid.ajax.reload();
                this.loadDataTimer = null;
            }
        }, 200);
    }

    onScrollLeft(){

    }

    onScrollRight(){

    }

    get scrollDirection(){
        return {
            x: this.scrollXDirection,
            y: this.scrollYDirection
        }
    }

    get scrollYDirection(){
        if(this.scrollTop > this.lastScrollTop){
            return Scroller.DIRECTION_DOWN;
        } else if(this.scrollTop < this.lastScrollTop) {
            return Scroller.DIRECTION_UP;
        }else{
            return null;
        }
    }

    get scrollXDirection(){
        if(this.scrollLeft > this.lastScrollLeft){
            return Scroller.DIRECTION_RIGHT;
        } else if(this.scrollLeft < this.lastScrollLeft) {
            return Scroller.DIRECTION_LEFT;
        }else{
            return null;
        }
    }

    get scrollTop(){
        return this.virtualListRef.listElRef.scrollTop;
    }

    get scrollLeft(){
        return this.virtualListRef.listElRef.scrollLeft;
    }

    get scrollDownTriggerIndex(){
        return Math.min(parseInt(this.dataGrid.ajax.endIndex - (this.dataGrid.ajax.state.count * (1-this.loafingTriggerOffset))), this.dataGrid.ajax.filteredCount-1);
    }

    get scrollUpTriggerIndex(){
        return Math.max(parseInt(this.dataGrid.ajax.startIndex + (this.dataGrid.ajax.state.count * (1 - this.loafingTriggerOffset))),0);
    }

    get viewportItems() {
        return this.virtualListRef.viewportItems;
    }

    get viewportItemsLength() {
        return this.virtualListRef.viewportItems.length;
    }

    get rowSize() {
        return this._rowSize;
    }

    set rowSize(value) {
        this._rowSize = value;
    }

    get virtualListRef() {
        return this._virtualListRef;
    }

    set virtualListRef(value) {
        this._virtualListRef = value;
    }

    get dataGrid() {
        return this._dataGrid;
    }

    set dataGrid(value) {
        this._dataGrid = value;
    }

    get loafingTriggerOffset() {
        return this._loafingTriggerOffset;
    }

    set loafingTriggerOffset(value) {
        this._loafingTriggerOffset = value;
    }

    get lastScrollTop(){
        return this._lastScrollTop;
    }

    set lastScrollTop(value) {
        this._lastScrollTop = value;
    }

    get lastScrollLeft(){
        return this._lastScrollLeft;
    }

    set lastScrollLeft(value) {
        this._lastScrollLeft = value;
    }

    get loadDataTimer() {
        return this._loadDataTimer;
    }

    set loadDataTimer(value) {
        this._loadDataTimer = value;
    }
}