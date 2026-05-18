export class ContextMenuItemSetting{
    _visibility = true;
    _subItems = [];
    _id;
    _label;
    _onClick;
    _customProps = {};

    constructor(item) {
        if(!item) return;

        Object.entries(item).forEach((value, index) => {
            let varName = value[0];
            if(!(item instanceof ContextMenuItemSetting)){
                varName = '_' + varName;
            }

            if(!this.hasOwnProperty(varName)){
                return;
            }

            this[value[0]] = value[1];
        });
    }

    get visibility() {
        return this._visibility;
    }

    set visibility(value) {
        this._visibility = value;
    }

    get subItems() {
        return this._subItems;
    }

    set subItems(value) {
        this._subItems = [];
        value.forEach((item, index) => {
            this._subItems.push(new ContextMenuItemSetting(item));
        });
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }

    get onClick() {
        return this._onClick;
    }

    set onClick(value) {
        this._onClick = value;
    }

    get customProps() {
        return this._customProps;
    }

    set customProps(value) {
        this._customProps = value;
    }
}