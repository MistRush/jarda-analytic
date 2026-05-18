import {ContextMenuItemSetting} from "@/DataGrid/js/Settings/ContextMenuItemSetting";

export class ContextMenuItem extends ContextMenuItemSetting{
    _contextMenuItemSetting;

    constructor(contextMenuItemSetting, dataGird) {
        super(contextMenuItemSetting);

        this.contextMenuItemSetting = contextMenuItemSetting;

        this.subItems = contextMenuItemSetting?.subItems ?? [];
    }

    get contextMenuItemSetting() {
        return this._contextMenuItemSetting;
    }

    set contextMenuItemSetting(value) {
        this._contextMenuItemSetting = value;
    }

    get subItems() {
        return this._subItems;
    }

    set subItems(value) {
        this._subItems = [];
        value.forEach((item, index) => {
            this._subItems.push(new ContextMenuItem(item));
        });
    }
}