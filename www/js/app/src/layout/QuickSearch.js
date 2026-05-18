class QuickSearch {
    /**
     * Konstruktor pro QuickSearch
     * 
     * @param {string} id 
     */
    constructor(id = 'search-result-block') {
        this._id = id;
        this._element = null;
        this._form = null;
        this._searchInput = null;
        this._searchTimeout = null;
        this._items = null;

        $(() => {
            this.init();
            this.bindEvents();
        });
    }

    /**
     * Inicializuje třídu
     * 
     * @returns {void}
     */
    init() {
        this._element = $('#' + this._id);
        this._items = this._element.find('.items');
        this._form = this._element.parent().children('form');

        return;
    }

    /**
     * Nastaví všechny eventy
     * 
     * @returns {void}
     */
    bindEvents() {
        if (this._form) {
            this._searchInput = this._form.find('[name="SearchTerm"]');
            if (this._searchInput.length) {
                this._searchInput.on('reset input paste cut', (ev) => {
                    this.inputHandler(ev.currentTarget.value)
                });

                this._form.on('reset', (ev) => {
                    this.inputHandler('')
                });
            }
        }

        return;
    }

    /**
     * Handle pro zpracování vyhledávání
     * 
     * @param {*} ev 
     * @return {boolean}
     */
    inputHandler(val) {
        if (val.length < 3) {
            this.hide();
            return false;
        }

        clearTimeout(this._searchTimeout);

        this._searchTimeout = setTimeout(() => {
            this.show();

            if (this.running) {
                this.running.abort();
            }

            this._performSearch(val);
        }, 250);

        return true;
    }

    /**
     * Zobrazí quick search
     * 
     * @returns {void}
     */
    show() {
        this._element.stop().slideDown(300, () => {
            this._element.removeAttr('style');
        });
        this._form.addClass('active');
        this._element.addClass('active');

        return;
    }

    /**
     * Skryje quick search
     * 
     * @returns {void}
     */
    hide() {
        this._element.stop().slideUp(300, () => {
            this._form.removeClass('active');
            this._element.removeClass('active');
        });

        return;
    }

    /**
     * Vyhledá produkt
     * 
     * @param {string} val 
     * @returns {void}
     */
    _performSearch(val) {
        this.renderLoading();

        this.running = $.ajax(projectVars.basePath + '/search/quick', {
            data: {
                searchTerm: val
            },
            method: 'POST',
            success: (data) => {
                this._element.html(data);
                this.show();
            },
            error: () => {
                this.hide();
            }
        });

        return;
    }

    /**
     * Vykreslí načítací obrazovku
     * 
     * @returns {void}
     */
    renderLoading() {
        let html = `<div class="loading">Načítám ...</div>`;

        this._element.html(html);
    }
}