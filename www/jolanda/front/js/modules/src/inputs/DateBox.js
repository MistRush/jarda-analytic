class DateBox extends Input{
    constructor(element, form = null) {
        super(element, form);
    }

    setValue(date){
        this.getDateTimeObject().date(date);
        return this;
    }

    getDateTimeObject(){
        return this.$element.data("DateTimePicker");
    }

    getValueDateObject() {
        this.getDateTimeObject().viewDate();
    }

    getFormatedDate(format = 'YYYY-MM-DD'){
        return this.getValueDateObject().format(format);
    }
}