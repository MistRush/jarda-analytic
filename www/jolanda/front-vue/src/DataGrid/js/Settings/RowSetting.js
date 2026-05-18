export class RowSetting {
    static SELECT_TYPE_SINGLE = 'single';
    static SELECT_TYPE_MULTI = 'multi';
    static SELECT_TYPE_MULTI_CHECKBOX = 'multi_checkbox';

    _onSelect;
    _onBeforeSelect;
    _onDeselect;
    _onBeforeDeselect;
    _onClick;
    _onBeforeClick;
    _onDblclick;
    _onBeforeDblclick;
    _selectType = RowSetting.SELECT_TYPE_SINGLE;
    _rowCallback;
    _height = 33;

    constructor(rowSetting = null) {
        if(!rowSetting){
            return;
        }


        Object.entries(rowSetting).forEach((value, index) => {
            let varName = value[0];
            if(!(rowSetting instanceof RowSetting)){
                varName = '_' + varName;
            }

            if(!this.hasOwnProperty(varName)){
                return;
            }

            this[value[0]] = value[1];
        });
    }

    get onSelect() {
        return this._onSelect;
    }

    set onSelect(value) {
        this._onSelect = value;
    }

    get onBeforeSelect() {
        return this._onBeforeSelect;
    }

    set onBeforeSelect(value) {
        this._onBeforeSelect = value;
    }

    get onDeselect() {
        return this._onDeselect;
    }

    set onDeselect(value) {
        this._onDeselect = value;
    }

    get onBeforeDeselect() {
        return this._onBeforeDeselect;
    }

    set onBeforeDeselect(value) {
        this._onBeforeDeselect = value;
    }

    get onClick() {
        return this._onClick;
    }

    set onClick(value) {
        this._onClick = value;
    }

    get onBeforeClick() {
        return this._onBeforeClick;
    }

    set onBeforeClick(value) {
        this._onBeforeClick = value;
    }

    get onDblclick() {
        return this._onDblclick;
    }

    set onDblclick(value) {
        this._onDblclick = value;
    }

    get onBeforeDblclick() {
        return this._onBeforeDblclick;
    }

    set onBeforeDblclick(value) {
        this._onBeforeDblclick = value;
    }

    get selectType() {
        return this._selectType;
    }

    set selectType(value) {
        this._selectType = value;
    }

    get rowCallback() {
        return this._rowCallback;
    }

    set rowCallback(value) {
        this._rowCallback = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }
}