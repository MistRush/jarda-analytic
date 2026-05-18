export class OverflowPreview{
    _visible = false;
    _content = null;
    _position = {
        x: 0,
        y: 0
    };
    _maxWidth = 400;
    _isOverflowingTimeout = false;

    contructor(){

    }

    show(content, position){
        this.content = content;
        this.position = position;
        this.visible = true;
    }

    hide(){
        this.visible = false;
        this.content = null;
        this.position = {
            x: 0,
            y: 0
        };
    }

    get visible(){
        return this._visible;
    }

    set visible(visible){
        this._visible = visible;
    }

    get content(){
        return this._content;
    }

    set content(content){
        this._content = content;
    }

    get position(){
        return this._position;
    }

    set position(position){
        this._position = position;
    }

    get maxWidth(){
        return this._maxWidth;
    }

    set maxWidth(maxWidth){
        this._maxWidth = maxWidth;
    }

    get isOverflowingTimeout(){
        return this._isOverflowingTimeout;
    }

    set isOverflowingTimeout(isOverflowingTimeout){
        this._isOverflowingTimeout = isOverflowingTimeout;
    }
}