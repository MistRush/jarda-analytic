
export class AjaxSetting{
    _url;
    _beforeSend;
    _data;
    _dataFilter;
    _error;
    _count = 200;

    constructor(ajax) {
        if(!ajax){
            return;
        }

        Object.entries(ajax).forEach((value, index) => {
            let varName = value[0];
            if(!(ajax instanceof AjaxSetting)){
                varName = '_' + varName;
            }

            if(!this.hasOwnProperty(varName)){
                return;
            }

            this[value[0]] = value[1];
        });
    }


    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    get beforeSend() {
        return this._beforeSend;
    }

    set beforeSend(value) {
        this._beforeSend = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    get dataFilter() {
        return this._dataFilter;
    }

    set dataFilter(value) {
        this._dataFilter = value;
    }

    get error() {
        return this._error;
    }

    set error(value) {
        this._error = value;
    }

    get count() {
        return this._count;
    }

    set count(value) {
        this._count = value;
    }
}