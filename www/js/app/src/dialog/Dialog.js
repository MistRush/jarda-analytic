class Dialog {
    _uid; // UID
    _modalClass; // Titulek
    _title; // Titulek
    _content; // Obsah
    _footer; // Patička
    _shown; // Bool zda již bylo zobrazené

    _confirmButton;
    _cancelButton;
    _buttons;

    onBeforeOpen;
    onAfterOpen;
    onBeforeClose;
    onAfterClose;
    confirm_function;

    fade_interval;

    constructor() {
        this._modalClass = "";
        this._content = "";
        this._title = "";
        this._footer = "";
        this._uid = 'dialog_' + Math.random().toString(36).substring(10);
        window[this._uid] = this;

        this.init();
        this.bind();
    }

    static createDialog(title, content = "", footer = "") {
        let dialog = new Dialog();
        dialog.title = title;
        dialog.content = content;
        dialog.footer = footer;
        dialog.enableCancel();
        return dialog;
    }

    /**
     * Inicializace základních proměnných
     */
    init () {
        this._element = null;

        this._confirmButton = false;
        this._cancelButton = false;
        this._buttons = [];

        this.onBeforeClose = null;
        this.onAfterClose = null;
        this.onBeforeOpen = null;
        this.onAfterOpen = null;
        this.confirm_function = 'dialogConfirm()';
        this.fade_interval = 300;

        this._shown = false;
    }

    /**
     * Bind základních akcí
     */
    bind() {
        //
    }

    /**
     * Zavírá dialog;
     */
    close() {
        window.dialogIsShown = false;
        if (this.onBeforeClose && typeof this.onBeforeClose == "function")
            this.onBeforeClose();

        $('body').removeClass('modal-open');
        this._element.remove();
        $('.modal-backdrop').remove();
        $('#modal').hide(0);

        window[this._uid] = undefined;
        if (this.onAfterClose && typeof this.onAfterClose == "function")
            this.onAfterClose();

    }

    /**
     * Otevírá dialog
     */
    open() {
        if (window.dialogIsShown) {
            console.warn('Another dialog is opened already');
            return this;
        }

        window.dialogIsShown = true;
        
        if (this.onBeforeOpen && typeof this.onBeforeOpen == "function")
            this.onBeforeOpen();

        $('#modal').show(0);
        $('body').addClass('modal-open');
        if ($('.modal-backdrop').length === 0) {
            $('body').append('<div class="modal-backdrop fade show">');
        }
        
        this.render();

        //layout.bindEvents();

        if (this.onAfterOpen && typeof this.onAfterOpen == "function")
            this.onAfterOpen();

        return this;
    }

    /**
     * Zobrazuje dialog s obsahem z URL
     * @param {string} url URL s daty
     * @param {Object} params Parametry requestu
     * @param {boolean} json Označení, zda jsou data servírována v JSONu
     */
    openFromUrl(url, params = {}, json = false) {
        params.dialog_id = this._uid;

        $.ajax({
            url: url,
            data: params,
            success: (data) => {
                if (json){
                    try {
                        data = JSON.parse(data);
                        this._content = data.content;
                        this._title = data.title;
                        this._footer = data.footer;
                    } catch (ex) {
                        console.warn('Data cannot be parsed as JSON');
                        alerts.error();
                    }
                } else {
                    this._content = data
                }

                this.open()
            }
        })
    }

    /**
     * Přida tlačítko/akci
     * @param {number} id
     * @param {string} label
     * @param {?function|null} onClick
     * @param {?string} onClick
     * @param {?string|null} icon
     * 
     * @return {DialogAction} vrácí tlačítko
     */
    addAction(id, label, onClick = null, btnType = 'primary', icon = null) {
        let action = new DialogAction(this, id, label, onClick, btnType, icon)
        this._buttons.push(action)
        return Action;
    }

    /**
     * Vykreslí dialog a nastaví jej jako element
     * 
     * @return {Dialog} vrácí sebe
     */
    render() {
        if (this._buttons.length > 0)
            this._footer += this._renderActions();
        if (this._confirmButton)
            this._footer += `<button onclick="${this.confirm_function}"><i class="fas fa-check"></i>${projectVars.confirm}</button>`;
        if (this._cancelButton)
            this._footer += `<button onclick="window['${this._uid}'].close();"><i class="fas fa-times"></i>${projectVars.cancel}</button>`;

        let template = `
            <div class="modal-dialog modal-lg modal-dialog-centered ${this._modalClass}" id="${this._uid}" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${this._title}</h5>
                        <button type="button" class="close" onclick="window['${this._uid}'].close()" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${this._content}
                    </div>
                    ${this._footer.length > 0?'<div class="modal-footer">' + this._footer + '</div>':''}
                </div>
            </div>
        `;

        this._element = template;
        this._getModal().append($(template));
        this._element = $('#' + this._uid);
        this._shown = true;

        return this;
    }

    /**
     * Vrací element modalu, připadně jej vytvoří
     * 
     * @return {JQuery}
     */
    _getModal() {
        let $modal = $('#modal');

        if ($modal.length > 0) {
            return $modal;
        } else {
            $('body').append('<div class="modal fade show" id="modal" style="display:block;" role="dialog"></div>');
            return this._getModal();
        }
    }

    /**
     * Rendruje tlačítka do footeru
     * 
     * @returns {string}
     */
    _renderActions() {
        let out = '';

        this._buttons.forEach((e) => {
            out += e.render();
        });

        return out;
    }

    /**
     * Odstraní tlačítko
     * 
     * @returns {string}
     */
    removeAction(index) {
        this._buttons.splice(index, 1);
        return this;
    }

    /**
     * Zapne tlačítko ve footeru pro zrušení akce
     * 
     * @returns {Dialog}
     */
    enableCancel() {
        this._cancelButton = true;
        return this;
    }

    /**
     * Zapne tlačítko ve footeru pro potvrzení akce
     * 
     * @returns {Dialog}
     */
    enableConfirm(confirm_function = 'dialogConfirm()') {
        this.confirm_function = confirm_function;
        this._confirmButton = true;
        return this;
    }

    /**
     * Vypne tlačítko ve footeru pro zrušení akce
     * 
     * @returns {Dialog}
     */
    disableCancel() {
        this._cancelButton = false;
        return this;
    }

    /**
     * Vypne tlačítko ve footeru pro potvrzení akce
     * 
     * @returns {Dialog}
     */
    disableConfirm() {
        this._confirmButton = false;
        return this;
    }

    /*
     *      SETTERS
     */

    /**
     * Nastaví hlavičku
     * @param value
     */
    set modalClass(value) {
        this._modalClass = value;

        return this;
    }

    /**
     * Nastaví hlavičku
     * @param value
     */
    set title(value) {
        this._title = value;
        if (this._shown)
            this._element.find('.modal-title').html(value);

        return this;
    }

    /**
     * Nastaví obsah
     * @param value
     */
    set content(value) {
        this._content = value;
        if (this._shown)
            this._element.find('.modal-body').html(value);

        return this;
    }

    /**
     * Nastaví patičku
     * @param value
     */
    set footer(value) {
        this._footer = value;
        if (this._shown)
            this._element.find('.modal-footer').html(value);

        return this;
    }

    /*
     *      GETTERS
     */

    /**
     * Vrací jQuery element
     * @return {JQuery}
     */
    get element() {
        return this._element;
    }

    /**
     * Vrací ID dialogu
     * @return {string}
     */
    get uid() {
        return this._uid;
    }

    /**
     * Vrací ID dialogu
     * @return {string}
     */
    get modalClass() {
        return this._modalClass;
    }

    /**
     * Vrací ID dialogu
     * @return {string}
     */
    get title() {
        return this._uid;
    }
}