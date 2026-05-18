class DateTimeBox extends DateBox{
    constructor(element, form = null) {
        super(element, form);
    }

    getFormatedDate(format = 'YYYY-MM-DD H:mm:ss'){
        return this.getValueDateObject().format(format);
    }
}