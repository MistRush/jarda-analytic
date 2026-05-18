export class ColumnType {
    _format;
    _column;

    constructor(column) {
        this._column = column;
    }

    render(data, onlyData = false, cell = null) {
        return data;
    }

    renderPreview(data, cell = null) {
        return this.render(data, false, cell);
    }

    get editor() {
        return "text";
    }

    get format() {
        return this._format;
    }

    set format(value) {
        this._format = value;
    }

    get column() {
        return this._column;
    }

    set column(value) {
        this._column = value;
    }
}
