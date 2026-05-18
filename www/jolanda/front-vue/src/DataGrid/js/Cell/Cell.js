import { h } from "vue";
import Icon from "@/Icons/Icon.vue";

export class Cell {
    _column;
    _row;

    constructor(row, column) {
        this._column = column;
        this._row = row;
    }

    getData() {
        const data = this.row.dataGrid.getData(true)[this.row.position] ?? undefined;
        if (typeof data !== "undefined" && data && data.hasOwnProperty(this.column.data)) {
            return data[this.column.data] ?? null;
        } else {
            return undefined;
        }
    }

    render() {
        const data = this.getData();

        //TODO identifikovat undefined vs notLoaded data
        if (!this.isLoaded) {
            return undefined;
        }

        let renderedData = "";

        //TODO přehodit a upravit custom render
        if (this._column.format) {
            if (typeof this._column.formatFunction === "function") {
                renderedData = this._column.formatFunction(data, this);
            } else {
                renderedData = this._column.format.render(data, false, this);
            }
        } else if (typeof this._column._render === "function") {
            //TODO čtvrtý parametr expample {settings: {…}, row: 0, col: 0}
            renderedData = this._column._render(data, this.column.format, this._row.data(), {
                row: this._row,
                column: this._column,
            });
        }

        let renderedCell = "";

        if (typeof renderedData === "object" || Array.isArray(renderedData)) {
            if (this.column.editable) {
                const children = [];
                children.push(h("div", { class: "dataGridCell-dataWrapper", renderedData }));
                children.push(h("div", { class: "dataGridCell-editIconWrapper" }, h(Icon, { class: "dataGridCell-editIcon", icon: "edit" })));

                renderedCell = h("div", { class: "dataGridCell-cellWrapper" }, children);
            } else {
                renderedCell = h("div", { class: "dataGridCell-dataWrapper" }, renderedData);
            }
        } else {
            if (this.column.editable) {
                const children = [];
                children.push(h("div", { class: "dataGridCell-dataWrapper", innerHTML: renderedData }));
                children.push(h("div", { class: "dataGridCell-editIconWrapper" }, h(Icon, { class: "dataGridCell-editIcon", icon: "edit" })));
                return h("div", { class: "dataGridCell-cellWrapper" }, children);
            } else {
                return h("div", { class: "dataGridCell-dataWrapper", innerHTML: renderedData });
            }
        }

        return renderedCell;
    }

    renderPreview() {
        const data = this.getData();

        if (this._column.format) {
            return this._column.format.renderPreview(data);
        }

        return null;
    }

    updateData(data) {
        if (typeof this.row.dataGrid.getData(true)[this.row.position] !== "undefined") {
            this.row.dataGrid.getData(true)[this.row.position][this.column.data] = data;
        }
    }

    get column() {
        return this._column;
    }

    set column(value) {
        this._column = value;
    }

    get row() {
        return this._row;
    }

    set row(value) {
        this._row = value;
    }

    get isLoaded() {
        let isLoaded = this.row.isLoaded;

        if (isLoaded) {
            return true;
        }

        if (this.column.className && this.column.className.includes("select-checkbox")) {
            isLoaded = true;
        }

        if (this.column.data === "Action") {
            isLoaded = true;
        }

        return isLoaded;
    }

    get rowData() {
        return this._row.data();
    }
}
