class Translation {
    constructor(lang) {
        console.log('x');

        this._form = null;
        this._lang = lang;

        this._trans = {
            copyOriginal: 'Copy original',
            copyOriginalOpen: 'Copy original and open Google Translate',
            translateByGoogle: 'Translate by Google',
            saved: 'Saved!',
            copied: 'Copied',
            empty: 'Text is empty',
        }
    }

    set trans(trans) {
        this._trans = Object.assign(this._trans, trans);
        return this;
    }

    get trans() {
        return this._trans;
    }

    /**
     * @param {Form|null} form
     */
    setForm(form = null) {
        this._form = form;
    }

    /**
     * @param {string} lang
     */
    setLang(lang) {
        this._lang = lang;
    }

    /**
     * @param {Form|null} form
     */
    init(form = null) {
        if (form)
            this.setForm(form);

        $(() => {
            this.createMissing();
            this.createActions();

            this.bindEvents();
        });
    }

    /**
     * Bind eventů
     */
    bindEvents() {
        this.bindSubmit();
        this.bindCopy();
    }

    /**
     * @returns {Translation}
     */
    createActions() {
        if ( !this._form )
            return this;

        $(this._form.form).find('label').each((index, item) => {
            $(item).parent().prepend(`
<div class="copy-action">
    <button type="button" data-copy="original" data-open="0" title="${this.trans.copyOriginal}" class="copy-original" data-toggle="bstooltip"><i class="fa fa-copy"></i></button>
    <button type="button" data-copy="original" data-open="1" title="${this.trans.copyOriginalOpen}" class="copy-original-open" data-toggle="bstooltip"><i class="ci ci-export"></i></button>
    
</div>
                `)
        });

        setTimeout(function () {
            plugins.initBsTooltip();
        }, 500);

        return this;
    }

    /**
     * Vytvoření chybějicích překladů
     * @returns {Translation}
     */
    createMissing() {
        if ( !this._form )
            return this;

        $(this._form.form).find('.has-error').each(function () {
            $(this).find('label').css('color', '#f00');
            $(this).appendTo($("#empty"));
        });

        return this;
    }

    /**
     * Bind uložení
     * @returns {Translation}
     */
    bindSubmit() {
        if ( !this._form )
            return this;

        $(this._form.form).submit((event) => {
            event.preventDefault();
            Helpers.ajax({
                method: 'POST',
                url: $(this._form.form).attr('action'),
                data: {
                    data: JSON.stringify($(this._form.form).serializeArray()),
                    elang: this._lang
                },
                success: () => {
                    alerts.alert(this.trans.saved);
                },
            }, true);
        });

        return this;
    }

    /**
     * Bind kopírování
     * @returns {Translation}
     */
    bindCopy() {
        $('[data-copy]').unbind().click((e) => {
            var parent = $(e.currentTarget).parent().parent();

            if ($(e.currentTarget).data('copy') == 'original') {
                var input = document.createElement("input");
                input.value = parent.find('label').text();
                input.style.top = "0";
                input.style.left = "0";
                input.style.position = "fixed";
                document.body.appendChild(input);

                this.copyText(input, $(e.currentTarget).data('open') > 0);

                input.remove();
            } else {
                this.copyText(parent.find('input').get(0), false);
            }
        });

        return this;
    }

    /**
     * Zkopírovat text / otevřít v překládači
     * @param element
     * @param {boolean} open
     */
    copyText(element, open = false) {
        element.select();
        element.setSelectionRange(0, 99999);

        if (element.value) {
            if (open)
                window.open('https://translate.google.com/?sl=cs&op=translate&tl=' + this._getCorrectLang(this._lang) + '&text=' + element.value.trim().replace(/\s/g, '%20'), '_translation');
            else {
                document.execCommand("copy");
                alerts.alert(this.trans.copied);
            }

        } else {
            alerts.alert(this.trans.empty, 'error');
        }
    }

    /**
     * Vrátí jazyk pro Google překládač
     * @param lang
     * @returns {string|*}
     * @private
     */
    _getCorrectLang(lang) {
        switch (lang) {
            case "EN":
                return 'en';
            case "CZ":
                return 'cs';
            case "FR":
                return 'fr';
            default:
                return lang;
        }
    }
}