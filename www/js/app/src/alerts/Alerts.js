class Alerts {
    constructor() {
        $(() => {
            this.stack = new PNotify.Stack({
                dir1: 'down',
                dir2: 'left',
                firstpos1: 25,
                firstpos2: 25,
                modal: false,
                maxOpen: Infinity,
                delay: 30000,
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
        });
    }

    /**
     *
     * @param {string} title Titulek zprávy
     * @param {string} type Typ zprávy (success, error, notice, info)
     * @param {string} text Text zprávy
     */
    alert(title, type = 'info', text = '') {
        this.opts.title = title;
        this.opts.text = text;
        let notify = PNotify[type](this.opts);
        notify.on('click', function () {
            notify.close();
        });
    }

    error() {
        this.alert('Error', 'error');
    }

    success() {
        this.alert('Success', 'success');
    }
}