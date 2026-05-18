import {ContextMenuItemSetting} from "./ContextMenuItemSetting.js";

export class ContextMenuSetting{
    _items = [];

    constructor(contextMenu) {
        if(!contextMenu) return;

        Object.entries(contextMenu).forEach((value, index) => {
            let varName = value[0];
            if(!(contextMenu instanceof ContextMenuSetting)){
                varName = '_' + varName;
            }

            if(!this.hasOwnProperty(varName)){
                return;
            }

            this[value[0]] = value[1];
        });
    }

    get items() {
        return this._items;
    }

    set items(value) {
        this._items = [];
        value.forEach((item, index) => {
            this._items.push(new ContextMenuItemSetting(item));
        });
    }
}