class Checkbox extends Input{
    constructor(element, form = null) {
        super(element, form);
    }

    check(){
        this.setValue(true);
        return this;
    }

    uncheck(){
        this.setValue(false);
        return this;
    }

    setValue(val) {
        this.$element.prop('checked', Boolean(val));
        return this;
    }

    getValue(){
        return this.$element.prop('checked');
    }
}