import { AjaxSetting } from "@/DataGrid/js/Settings/AjaxSetting";
import axios from "axios";
import { useApp } from "@/App/composables/useApp.js";

export class Ajax extends AjaxSetting {
    _ajaxSetting;
    _params;
    _state = {
        count: 200,
        start: 0,
    };
    _totalCount = null;
    _filteredCount = null;
    _dataGrid;
    _loading = false;
    _loadedRows = [];
    _abortController = null;
    _requestCount = 0;

    constructor(ajaxSetting, dataGird) {
        super(ajaxSetting);
        this._ajaxSetting = ajaxSetting;
        this.dataGrid = dataGird;
        this._state.count = this._count ?? this._state.count;
    }

    async getData() {
        let params = this.getParams();
        this.state = params;

        //TODO BEFORE SEND
        if (this._abortController) {
            this._abortController.abort(); // Zrušíme předchozí požadavek
        }
        this._abortController = new AbortController();

        try {
            const response = await axios.get(this.url, {
                headers: {
                    "Content-Type": "application/json",
                },
                params: params,
                signal: this._abortController.signal,
            });

            const { app } = useApp();
            if (app) {
                const jolandaBuildTime = response.headers["x-jolanda-build-time"] ?? null;

                app.checkBuildVersion(jolandaBuildTime);
            }

            let data = response.data;
            if (typeof this.dataFilter === "function") {
                data = this.dataFilter(data);

                if (typeof data === "string") {
                    data = JSON.parse(data);
                }
            }

            data.params = params;

            return {
                data: data,
                cancel: false,
            };
        } catch (error) {
            if (axios.isCancel(error)) {
                // console.log('Požadavek byl zrušen:', error.message); // Nepovažujeme za chybu
            } else {
                console.error("Došlo k chybě:", error); // Skutečná chyba
            }

            return {
                data: null,
                cancel: true,
            };
        }
    }

    prepareDataForTable(data, params, resetPaging, oldLoadedRows = []) {
        let _data;

        if (resetPaging) {
            _data = [];
        } else {
            _data = [...(this.dataGrid._data ?? [])];
        }

        //TODO recordsFiltered asi není v data
        // for (let i = 0; i < data.recordsFiltered; i++) {
        //     _data.push(null);
        // }

        if (resetPaging) {
            for (let i = 0; i < data.recordsTotal; i++) {
                _data.push(null);
            }

            let count = 0;
            for (let i = params.start; i < params.start + data.items.length; i++) {
                _data[i] = data.items[count] ?? null;
                count++;
            }
        } else {
            if (_data.length > data.recordsTotal) {
                _data = _data.slice(0, data.recordsTotal);
            } else if (_data.length < data.recordsTotal) {
                for (let i = _data.length; i < data.recordsTotal; i++) {
                    _data.push(null);
                }
            }

            oldLoadedRows.forEach((rowIndex) => {
                if (rowIndex >= data.recordsTotal) {
                    return;
                }

                _data[rowIndex] = null;
            });

            let count = 0;
            for (let i = params.start; i < params.start + data.items.length; i++) {
                _data[i] = data.items[count] ?? null;
                count++;
            }
        }

        // let _data = [...this.dataGrid.data];
        //
        // let count = 0;
        // for (let i = params.start; i < params.count + params.start; i++) {
        //     _data[i] = data.items[count] ?? null;
        //     count++;
        // }

        return _data;
    }

    //TODO options, resetPaging
    async reload(callback = null, resetPaging = false) {
        this._loading = true;
        let oldLoadedRows = this._loadedRows ?? [];

        if (resetPaging) {
            this.dataGrid._selectedRows = [];
            this.dataGrid.scroller.virtualListRef?.scrollTo({ left: 0, top: 0 });
            this.state.start = 0;
        }

        const { data, cancel } = await this.getData();
        // data.recordsTotal=100;
        // data.recor

        if (cancel) {
            this._loading = false;
            return;
        }

        const params = data.params;

        // if(resetPaging){
        this.totalCount = data.recordsTotal;
        // }

        this.filteredCount = data.recordsTotal;
        this._loadedRows = [];
        for (let i = params.start; i < params.start + data.items.length; i++) {
            this._loadedRows.push(i);
        }

        data.items = this.prepareDataForTable(data, params, resetPaging, oldLoadedRows);

        this.dataGrid.setData(data.items);
        this._loading = false;
        this._requestCount++;

        if (typeof callback === "function") {
            callback();
        }
        // this.dataGrid.scroller.virtualListRef.$forceUpdate(); //??
    }

    getParams() {
        let params = this.state;

        if (typeof this.data === "function") {
            params = this.data({
                ...this.state,
                length: this.state.count,
                order: this.dataGrid._order,
            });
        }

        return params;
    }

    get startIndex() {
        return this.state.start;
    }

    get endIndex() {
        return this.state.start + this.state.count;
    }

    get ajaxSetting() {
        return this._ajaxSetting;
    }

    set ajaxSetting(value) {
        this._ajaxSetting = value;
    }

    get params() {
        return this._params;
    }

    set params(value) {
        this._params = value;
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }

    get totalCount() {
        return this._totalCount;
    }

    set totalCount(value) {
        this._totalCount = value;
    }

    get filteredCount() {
        return this._filteredCount;
    }

    set filteredCount(value) {
        this._filteredCount = value;
    }

    get dataGrid() {
        return this._dataGrid;
    }

    set dataGrid(value) {
        this._dataGrid = value;
    }

    get loading() {
        return this._loading;
    }

    set loading(value) {
        this._loading = value;
    }

    get loadedRows() {
        return this._loadedRows;
    }

    set loadedRows(value) {
        this._loadedRows = value;
    }
}
