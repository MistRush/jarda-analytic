class DialogAction {
    _dialog;
    _id
    label;
    onClick;
    btnType;
    icon;

    constructor(dialog, id, label, onClick = null, btnType = 'primary', icon = null) {
        this._id = id,
        this.label = label;
        this.onClick = onClick;
        this.btnType = btnType;
        this.btnClasses = '';
        this.icon = icon;
        this._dialog = dialog;
    }

    render() {
        let template = `
            <button class="btn btn-${this.btnType}${this.icon?' btn-with-icon':''} ${this.btnClasses}" ${this.onClick?'onclick="' + this.onClick + '"':''}>
                ${this.icon?'<i class="' + this.icon + '"></i>':''}${this.label}
            </button>
        `;

        return template;
    }
}