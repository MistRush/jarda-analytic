class Radio extends Input{
    constructor(element, form = null) {
        super(element, form);

        this.rootElement = this.$element.closest('[id*="_group"]').find('div');
    }

    getValue(){
        let checked = this.rootElement.find('input[type="radio"]:checked');

        if(checked.length === 0)
            return null;

        return checked.val();
    }

    setValue(val) {
        this.checkByValue(val);
        return this;
    }

    checkByValue(value){
        this.rootElement.find('input[type="radio"][value="' + value + '"]').prop('checked', true);
        return this;
    }
}