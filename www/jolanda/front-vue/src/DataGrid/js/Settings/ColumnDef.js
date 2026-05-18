export class ColumnDef {
    static COLUMN_TYPE_TEXT = "text";
    static COLUMN_TYPE_NUMBER = "number";
    static COLUMN_TYPE_DATE = "date";
    static COLUMN_TYPE_TIME = "time";
    static COLUMN_TYPE_DATETIME = "datetime";
    static COLUMN_TYPE_BOOL = "bool";
    static COLUMN_TYPE_TIMESTAMP = "timestamp";
    static COLUMN_TYPE_CURRENCY = "currency";
    static COLUMN_TYPE_ENUM = "enum";
    static COLUMN_TYPE_CHECKBOX = "checkbox";
    static COLUMN_TYPE_COUNTER = "counter";
    static COLUMN_TYPE_LONGTEXT = "longtext";
    static COLUMN_TYPE_CUSTOM = "custom";
    static COLUMN_TYPE_PERCENT = "percent";
    static COLUMN_TYPE_GALLERY = "gallery";
    static COLUMN_TYPE_HTML = "html";

    _className;
    _data;
    _label;
    _labelTooltip;
    _name;
    _defaultContent;
    _editable;
    _entity_values; //??
    _format;
    _formatFunction;
    _minWidth;
    _visible = true;
    _enumValues; //??
    _orderSequence;
    _render;
    _select_values; //??
    _position; //orig -> targets
    _width = 90;
    _orderable = true;
    _external = null;
    _overflowPreview = true;

    constructor(columnDef) {
        columnDef = ColumnDef.mapOldToNew(columnDef);

        Object.entries(columnDef).forEach((value, index) => {
            let varName = value[0];
            if (!(columnDef instanceof ColumnDef)) {
                varName = "_" + varName;
            }

            if (!this.hasOwnProperty(varName)) {
                return;
            }

            this[value[0]] = value[1];
        });
    }

    static mapOldToNew(columnDef) {
        columnDef.data = columnDef.data ?? columnDef.mData ?? null;
        columnDef.position = columnDef.position ?? columnDef.targets ?? null;

        return columnDef;
    }

    get className() {
        return this._className;
    }

    set className(value) {
        this._className = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }

    get labelTooltip() {
        return this._labelTooltip;
    }

    set labelTooltip(value) {
        this._labelTooltip = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get defaultContent() {
        return this._defaultContent;
    }

    set defaultContent(value) {
        this._defaultContent = value;
    }

    get editable() {
        return this._editable;
    }

    set editable(value) {
        this._editable = value;
    }

    get entity_values() {
        return this._entity_values;
    }

    set entity_values(value) {
        this._entity_values = value;
    }

    get format() {
        return this._format;
    }

    set format(value) {
        this._format = value;
    }

    get formatFunction() {
        return this._formatFunction;
    }

    set formatFunction(value) {
        this._formatFunction = value;
    }

    get minWidth() {
        return this._minWidth;
    }

    set minWidth(value) {
        this._minWidth = value;
    }

    get visible() {
        return this._visible;
    }

    set visible(value) {
        this._visible = value;
    }

    get enumValues() {
        return this._enumValues;
    }

    set enumValues(value) {
        this._enumValues = value;
    }

    get orderSequence() {
        return this._orderSequence;
    }

    set orderSequence(value) {
        this._orderSequence = value;
    }

    get render() {
        return this._render;
    }

    set render(value) {
        this._render = value;
    }

    get select_values() {
        return this._select_values;
    }

    set select_values(value) {
        this._select_values = value;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        if (!value) {
            this._width = 90;
            return;
        }
        this._width = value;
    }

    get orderable() {
        return this._orderable;
    }

    set orderable(value) {
        this._orderable = value;
    }

    //OLD DATAGRID
    get mData() {
        return this.data;
    }

    set mData(value) {
        this.data = value;
    }

    get external() {
        return this._external;
    }
    set external(value) {
        this._external = value;
    }

    get overflowPreview() {
        return this._overflowPreview;
    }

    set overflowPreview(value) {
        this._overflowPreview = value;
    }
}
