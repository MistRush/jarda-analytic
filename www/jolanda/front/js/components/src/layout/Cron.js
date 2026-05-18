class Cron {
    constructor(logUrl, runUrl) {
        this.logPanel = null;
        this.grid = null;

        this._defaults = {
            logUrl: basePath + logUrl,
            runUrl: basePath + runUrl,
            logPanelTitle: 'Log',
            start: 'Start',
            stop: 'Stop',
            runtime: 'Run time',
        };
    }

    init() {
        $(() => {
            this.bindEvents();
        });
    }

    bindEvents() {

        this._graphWrapper = $('[data-graph-data]');
        try {
            this._graphWrapper.get(0).graphData = JSON.parse(this._graphWrapper.get(0).dataset.graphData);

            this.renderBoxes(this._graphWrapper.get(0).graphData);
        } catch (e) {
            console.error(e);
            alerts.error();
        }
    }

    set defaults(defaults) {
        this._defaults = Object.assign(this._defaults, defaults);
    }

    get defaults() {
        return this._defaults;
    }

    log(id) {
        this.logPanel = new Panel();
        this.logPanel.setTitle(this.defaults.logPanelTitle);
        this.logPanel.showFromUrl(this.defaults.logUrl, {
            Cron_ID: id,
            Panel_ID: this.logPanel.uid
        });
    }

    run(id) {
        $.ajax({
            url: this.defaults.runUrl,
            data: {
                Cron_ID: id
            }
        });
    }

    renderBoxes(graphData) {
        let self = this;
        for (let ind in graphData.items) {
            $(this.renderBox(graphData.items[ind], graphData)).appendTo(this._graphWrapper.find('.cron__items')).tooltip({
                html: true,
                title: function() {
                    let statusColor = this.cron.status === 'OK' ? 'ok' : 'error';
                    let html = `
                        <div class="cron__items__box__tooltip">
                            <h2>${this.cron.name}</h2>
                            <hr>
                            <b>${self.defaults.start}:</b> ${this.cron.start}<br>
                            <b>${self.defaults.stop}:</b> ${this.cron.stop}<br>
                            <b>${self.defaults.runtime}:</b> ${this.cron.runtime}
                            <h3 class="cron__items__box__tooltip__${statusColor}">${this.cron.status}</h3>
                            <pre>${this.cron.message??''}</pre>
                        </div>
                    `
                    return html;
                }
            });
        }
    }

    /**
     * Render boxu
     * @param {Object} item
     */
    renderBox(item, graphData) {
        let element = document.createElement('div');
        let height = 100 / (graphData.level + 1);

        element.cron = item;
        element.classList.add('cron__items__box');
        element.style.left = (item.left / graphData.range * 100) + '%';
        element.style.width = (item.width / graphData.range * 100) + '%';
        element.style.height = height + '%';
        element.style.top = (height * item.top) + '%';
        element.classList.add(item.status === 'OK' ? 'cron__items__box__success' : 'cron__items__box__error');
        element.classList.add('item_' + item.id);

        element.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();

            this.log(item.id);
        })

        return element;
    }
}