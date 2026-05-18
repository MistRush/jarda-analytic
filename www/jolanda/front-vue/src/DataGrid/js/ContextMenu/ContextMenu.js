import {ContextMenuSetting} from "@/DataGrid/js/Settings/ContextMenuSetting";
import {ContextMenuItem} from "@/DataGrid/js/ContextMenu/ContextMenuItem";

export class ContextMenu extends ContextMenuSetting{
    _contextMenuSetting;
    _visible = false;
    _position = {x: 0, y: 0};

    constructor(contextMenuSetting, dataGird) {
        super(contextMenuSetting);

        this.contextMenuSetting = contextMenuSetting;

        this.items = contextMenuSetting?.items ?? [];

        // if(contextMenuSetting.items){
        //     contextMenuSetting.items.forEach((item, index) => {
        //        this.items.push(new ContextMenuItem(item));
        //     });
        // }
    }

    show(show = true){
        this.visible = show;
    }

    get hasVisibleItems(){
        return !!this._items.find(item => item.visibility);
    }

    get items() {
        return this._items;
    }
    set items(value) {
        this._items = [];
        value.forEach((item, index) => {
            this._items.push(new ContextMenuItem(item));
        });
    }
    get contextMenuSetting() {
        return this._contextMenuSetting;
    }

    set contextMenuSetting(value) {
        this._contextMenuSetting = value;
    }

    get visible() {
        return this._visible;
    }

    set visible(value) {
        this._visible = value;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
    }
}