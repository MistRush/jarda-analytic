class Watchdog {
    constructor() {
        $(() => {
            this.bindEvents();
        });
    }

    bindEvents() {
        const me = this;
        this.enableWatchdogEvent(me);
        this.disableWatchdogEvent(me);
    }

    enableWatchdogEvent(me) {
        $('.set-watchdog').unbind('click').on('click', function (e) {
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: '/default/product/set-watchdog',
                data: {
                    Product_ID: $(this).data('product-id'),
                },
                success: me.processSuccessResponse(e.target),
            });
        });
    }

    disableWatchdogEvent(me) {
        $('.disable-watchdog').unbind('click').on('click', function (e) {
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: '/default/product/disable-watchdog',
                data: {
                    Product_ID: $(this).data('product-id'),
                },
                success: me.processSuccessResponse(e.target),
            });
        });
    }

    processSuccessResponse(target) {
        const me = this;
        return async function (data) {
            try {
                data = JSON.parse(data);
                if (data.error) {
                    alerts.alert('Error', 'error', data.msg);
                } else {
                    await me.displayWatchdogConfirmationInfo(data.msg);

                    if ($(target).closest('.set-watchdog').length) {
                        $(target).text('Zrušit hlídacího psa');
                        $(target).closest('.set-watchdog')
                            .addClass('disable-watchdog')
                            .removeClass('set-watchdog');
                        me.bindEvents();
                    } else if ($(target).closest('.disable-watchdog').length) {
                        $(target).text('Hlídací pes');
                        $(target).closest('.disable-watchdog')
                            .addClass('set-watchdog')
                            .removeClass('disable-watchdog');
                        me.bindEvents();
                    }
                }
            } catch (e) {
                console.error(e);
                alerts.error();
            }
        };
    }

    async displayWatchdogConfirmationInfo(content) {
        if (this.dialog) { this.dialog.close(); }

        this.dialog = new Dialog();
        this.dialog._title = 'Nastavení hlídacího psa';
        this.dialog._modalClass = 'watchdog-confirmation';
        await this.dialog.openFromUrl(projectVars.basePath + '/modal/watchdog-confirmation', {content});
    }
}