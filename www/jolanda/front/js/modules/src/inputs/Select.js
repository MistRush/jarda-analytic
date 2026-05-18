class Select extends Input{
    constructor(element, form = null) {
        super(element, form);
    }

    addOption(text, value, defaultSelected = false, selected = false){
        let option = new Option(text, value, defaultSelected, selected);
        this.$element.append(option);

        if(selected)
            this.triggerChange();

        return this;
    }

    triggerChange(){
        this.$element.trigger('change');
        return this;
    }

    setValue(val){
        this.$element.val(val).trigger('change');
        return this;
    }

    getOptions(){
        return this.$element.find("option");
    }

    getOption(value){
        return this.$element.find("option[value='" + value + "']");
    }

    removeOption(value){
        let option = this.getOption(value);

        option.remove();

        if(option.attr('selected') === 'selected')
            this.triggerChange();

        return this;
    }
}