class Layout {
    constructor() {
        history.pushState('page', 'CDB', window.location.href);
        $(document).ajaxSend(() => {
            $('#loader').stop().fadeIn(100);
        });
    
        $(document).ajaxError((data) => {
            if (!data.statusText === 'abort')
                alerts.alert('Error', 'error', data.statusText + ': ' + data.responseText);
        });
    
        $(document).ajaxComplete(() => {
            $('#loader').stop().fadeOut(100);
        });

        this._latestPanelHeading = null;
        this.dialogOpen = false;

        $(()=>{
            this.initDarkMode();
            $("#loader").hide();
            this.bindEvents();
        });


    }

    bindEvents() {
        $(document).on("click", ".disabled", function (event) {
            event.stopImmediatePropagation();
            return (false);
        });

        $('.modal-dialog').draggable({
            handle: ".modal-header"
        });

        $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
            $.fn.dataTable.tables({visible: true, api: true}).columns.adjust();
            if (typeof InstallTrigger !== 'undefined') {
                if(typeof window[$($(this).attr('href')).find('[id$="_datagrid"]').attr('id')] !== 'undefined')
                    window[$($(this).attr('href')).find('[id$="_datagrid"]').attr('id')].refresh();
            }
            let rs = $($(this).attr('href')).find('.relation-switcher');
            if (rs.length > 0) {
                window[rs.attr('id')].refresh();
            }
        });

        $(window).on('scroll', function() {
            var y_scroll_pos = window.pageYOffset;
            if ($('.panel-heading').length > 0) {
                var scroll_pos_test = $('.panel-heading').offset().top;
                if (this._latestPanelHeading == null) {
                    if (y_scroll_pos > scroll_pos_test) {
                        this._latestPanelHeading = scroll_pos_test;
                        let temp_height = $('.panel-heading').outerHeight();
                        $('.panel-heading').parent().css('padding-top', temp_height);
                        $('.panel-heading').addClass('locked');
                    }
                } else {
                    if (y_scroll_pos < this._latestPanelHeading) {
                        this._latestPanelHeading = null;
                        $('.panel-heading').parent().removeAttr('style');
                        $('.panel-heading').removeClass('locked');
                    }
                }
            }
        });


    }

    initDarkMode() {
        if (Cookie.getCookie('color-mode') === undefined && $('html').data('nocolor') === undefined) {
            if($('html').hasClass('prefer-light') || $('html').hasClass('prefer-dark')){
                return;
            }
            $('html').addClass('prefer-dark');
            Cookie.setCookie('color-mode', 'prefer-dark', 365);
        }
    }

    toggleDarkMode() {
        if (Cookie.getCookie('color-mode') === 'prefer-light') {
            Cookie.setCookie('color-mode', 'prefer-dark', 365);
            $('html').removeClass('prefer-light');
            $('html').addClass('prefer-dark');
        } else {
            Cookie.setCookie('color-mode', 'prefer-light', 365);
            $('html').addClass('prefer-light');
            $('html').removeClass('prefer-dark');
        }
        plugins.initTinyMCE();
    }

    changeLanguage(lang) {
        Helpers.ajax({
            url: basePath + "/admin/settings/change-language/",
            data: {
                LanguageValue: lang
            },
            success: function () {
                location.reload();
            }
        }, true);
    }



    scrollTo(e, time=300, callback = null) {
        e.preventDefault();
        if ($(e.target).hasClass('search')) {
            $("html, body").animate({ 
                scrollTop: $('#search').offset().top - $('header').height() - 20
            }, time, 'swing', callback);
            $('#search input').focus();
        } else {
            var $this = $('#' + $(e.target).data('id'));
            $("html, body").animate({ 
                scrollTop: ($this.offset().top + ($this.height() / 2)) - ($(window).height() / 2)
            }, time, 'swing', callback);
        }
    }
}
