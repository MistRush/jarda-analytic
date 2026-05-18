export default class Dialog {
    static dialogs = [];

    static escEventInit = false;

    /**
     * Dialog constructor
     */
    constructor() {
        this._content = '';
        this._title = '';
        this._footer = '';
        this._uid = 'dialog' + Math.random().toString(36).substring(7);
        window[this._uid] = this;
        // this.element = document.createElement("div");
        // this.element.setAttribute('id', this._uid);
        // this.element.setAttribute('class', 'modal fade show');
        // this.element.setAttribute('style', 'display: block');
        // this.element.setAttribute('role', 'dialog');
        this.shown = false;
        this.confirmButton = false;
        this.confirm_function = null;
        this.cancelButton = false;
        this.onBeforeClose = null;
        this.onAfterClose = null;
        this.onBeforeShow = null;
        this.onAfterShow = null;
        this._maxWidth = null;


        this._confirmButtonText = translations.CONFIRM;
        this._cancelButtonText = translations.CLOSE;

        // this.bindEvents();
    }

    bindEvents(){
        $(document).ready(() => {
            $(this.element).keydown((event) => {
                if(event.keyCode == 13) {
                    if($(event.target).prop('tagName') === "TEXTAREA")
                        return;

                    event.preventDefault();
                    if(this.confirmButton)
                        eval(this.confirm_function);
                }
            });
        });

        if(!Dialog.escEventInit){
            $(document).keydown((event) => {
                if(event.keyCode == 27) {
                    let activeDialog = Dialog.getActiveDialog();

                    if(activeDialog){
                        Dialog.getActiveDialog().close();
                    }
                }
            });

            Dialog.escEventInit = true;
        }

    }

    /**
     * Uzavírá dialog
     */
    close() {
        if(this.shown){
            this.shown = false;
            if (this.onBeforeClose !== null)
                this.onBeforeClose();

            Dialog.dialogs.pop();

            if(Dialog.dialogs.length) {
                let lastDialog = Dialog.dialogs.at(-1);
                $($(lastDialog.element).find('.modal-content')[0]).removeClass('not-active');
            }

            // this.element.parentNode.removeChild(this.element);
            window[this._uid] = undefined;
            if (this.onAfterClose !== null)
                this.onAfterClose();

            if(Dialog.getOpenDialogs().length === 0){
                layout.dialogShow = false;
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            }
        }
    }

    /**
     * Zobrazuje dialog
     */
    show() {
        if(typeof window[this._uid] === 'undefined'){
            window[this._uid] = this;
        }

        if(!this.shown){
            Dialog.getOpenDialogs().forEach((dialog, index) => {
                if(index !== this._uid)
                    $($(dialog.element).find('.modal-content')[0]).addClass('not-active');
            });

            Dialog.dialogs.push(this);
            this.shown = true;
            layout.dialogShow = true;
            if (this.onBeforeShow !== null)
                this.onBeforeShow();
            $('body').addClass('modal-open');
            if ($('.modal-backdrop').length === 0) {
                $('body').append('<div class="modal-backdrop fade show">');
            }
            this.render();
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
            if (this.onAfterShow !== null)
                this.onAfterShow();
        }
    }

    /**
     * Vrací obsah
     * @return {string}
     */
    get content() {
        return this._content;
    }

    /**
     * Nastavuje obsah
     * @param value
     */
    set content(value) {
        this._content = value;
        if (this.shown)
            $('#dialog_'+this._uid).find('.modal-body').html(value);
    }

    /**
     * Vrací titulek
     * @return {string}
     */
    get title() {
        return this._title;
    }

    /**
     * Nastavuje titulek
     * @param value
     */
    set title(value) {
        this._title = value;
        if (this.shown)
            $('#dialog_'+this._uid).find('.modal-title').html(value);
    }

    /**
     * Vrací patičku
     * @return {string}
     */
    get footer() {
        return this._footer;
    }

    /**
     * Nastavuje patičku
     * @param value
     */
    set footer(value) {
        this._footer = value;
        if (this.shown)
            $('#dialog_'+this._uid).find('.modal-footer').html(value);
    }

    /**
     * Vrací ID dialogu
     * @return {string}
     */
    get uid() {
        return this._uid;
    }

    /**
     * Zobrazuje dialog s obsahem vzatým z AJAX requestu
     * @param {string} url URL s daty
     * @param {Object} params Parametry requestu
     * @param {boolean} json Označení, zda jsou data servírována v JSONu
     */
    showFromUrl(url, params = {}, json = false) {
        params.dialog_id = this._uid;
        Helpers.ajax({
            url: url,
            data: params,
            success: (data) => {
                if (json){
                    data = JSON.parse(data);
                    this._content = data.content;
                    this._title = data.title;
                    this._footer = data.footer;
                } else
                    this._content = data

                this.show()
                plugins.initPlugins();
            }
        })
    }

    enableConfirmButton(confirm_function = 'confirm()') {
        this.confirmButton = true;
        this.confirm_function = confirm_function;
    }

    enableCancelButton() {
        this.cancelButton = true;
    }

    get confirmButtonText(){
        return this._confirmButtonText;
    }

    set confirmButtonText(text){
        this._confirmButtonText = text;
    }

    get cancelButtonText(){
        return this._cancelButtonText;
    }

    set cancelButtonText(text){
        this._cancelButtonText = text;
    }

    set maxWidth(maxWith){
        this._maxWidth = maxWith;
    }

    /**
     * Vykreslení dialogu
     */
    render() {
        this.shown = true;
    }

    static getOpenDialogs(){
        let openDialogs = [];
        Dialog.dialogs.forEach((dialog, index) => {
            if(dialog.shown)
                openDialogs.push(dialog);
        });

        return openDialogs;
    }

    static getActiveDialog(){
        let activeDialog = null;
        Dialog.getOpenDialogs().forEach((dialog, index) => {
            if(!$($(dialog.element).find('.modal-content')[0]).hasClass('not-active')){
                activeDialog = dialog;
            }
        });

        return activeDialog;
    }
}
