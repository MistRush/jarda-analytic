class Alerts {
    constructor() {
        this.stack = new PNotify.Stack({
            dir1: 'up',
            dir2: 'left',
            firstpos1: 25,
            firstpos2: 25,
            modal: false,
            maxOpen: Infinity
        });

        this.opts = {
            // addModelessClass: 'nonblock',
            styling: 'bootstrap4',
            icons: {
                prefix: 'fontawesome5',
                closer: 'fa fa-times',
            },
            closerHover: false,
            closer: true,
            sticker: false,
            stack: this.stack,
            modules: PNotify.defaultModules
        }

    }

    /**
     *
     * @param {string} title Titulek zprávy
     * @param {string} type Typ zprávy (success, error, warning, info)
     * @param {string} text Text zprávy
     * @param {boolean} text persist
     */
    alert(title, type = 'info', text = '', persist = false) {
        this.opts.title = title;
        this.opts.text = text;

        if(persist)
            this.opts.hide = false;

        let notify = PNotify[type](this.opts);

        if (!persist) {
            notify.on('click', function () {
                notify.close();
            });
        }
    }

    error(text = '') {
        this.alert(translations.ERROR, 'error', text);
    }

}