export class Data{
    _length
    _data;

    constructor(data){
        this.data = data;
    }

    get data(){
        return this._data;
    }

    set data(value){
        for(let i= 0; i < this._length; i++){
            if(this.hasOwnProperty(i)){
                delete this[i];
            }
        }

        this._data = value;
        this.length = value.length;

        this._data.forEach((row, index) => {
            this[index] = row;
        });
    }

    map(callback){
        return new Data(this._data.map(callback));
    }

    each(callback){
        return this._data.forEach(callback);
    }

    toArray(){
        return this.data;
    }

    get count(){
        return this.length;
    }

    get length(){
        return this._length;
    }

    set length(value){
        this._length = value;
    }


}