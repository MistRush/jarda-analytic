class OrderList {
    constructor() {
        this.timeout = null;
        this.elem = null;
        this.preview = null;
        this.interrupter = null;
        this.order = null;
        this.totalPrice = 0;
        this.totalQuantity = 0;
        this.init(1000);
    }

    init(timeout = 500) {
        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            this.bindEvents();
        }, timeout);
    }

    bindEvents() {
        $(() => {
            $('.orderPreview').unbind().click((ev) => {
                this.showPreview(ev.currentTarget);
                this.interrupter = setTimeout(() => {
                    this.interrupter = null;
                }, 100)
            })

            $('body').click((ev) => {
                if (this.interrupter)
                    return null;

                let tar = $(ev.target);
                if (this.elem && !(tar.is('.orderPreviewModal') || tar.parents('.orderPreviewModal').length))
                    this.clearPreview();
            })

            $('.orderPreviewModal .close').click(() => {
                this.clearPreview();
            })
        });
    }

    showPreview(el) {
        this.clearPreview();

        this.elem = el;
        this._getOrderDetail();
    }

    clearPreview() {
        this.elem = null;

        if (this.preview) {
            $(this.preview).remove();
        }
        
        this.lastId = null;
        if (this.loadingAjax)
            this.loadingAjax.abort();
        this.loadingAjax = null;
        this.preview = null;

    }

    setPreviewPosition() {
        let top = $(this.elem).parent().offset().top;
        let left = $(this.elem).offset().left + $(this.elem).outerWidth() - 15;
        if (top + this.preview.outerHeight() > window.innerHeight) {
            top = $(this.elem).parent().offset().top + $(this.elem).parent().outerHeight() - this.preview.outerHeight();
        }
        this.preview.css('position', 'aboslute');

        if (window.innerWidth < 768) {
            top = window.innerHeight/2 - this.preview.outerHeight()/2;
            left = window.innerWidth/2 - this.preview.outerWidth()/2;
            this.preview.css('position', 'fixed');
            
        }
        this.preview.css('left', left + 'px');
        this.preview.css('top', top + 'px');
    }

    renderLoading() {
        return `
            <div class="orderPreviewModal">
                <a href="javascript:void(0);" class="close"><i class="ci ci-times"></i></a>
                <div class="panel">
                    <img class="loadingImg" src="${basePath}/project/img/loading.gif">
                </div>
            </div>
        `;
    }

    renderError() {
        return `
            <a href="javascript:void(0);" class="close"><i class="ci ci-times"></i></a>
            <div class="panel errorPanel">
                <i class="ci ci-warning error-icon"></i>
                Error
            </div>
        `
    }

    _getOrderDetail() {
        let id = $(this.elem).data('id')
        if (this.lastId == id)
            return null;

        this.lastId = id;

        if (!id)
            return null;

        $('body').append( this.renderLoading());
        this.preview = $('body').find('.orderPreviewModal');
        this.setPreviewPosition();

        this.loadingAjax = $.ajax(basePath + '/admin/order/order-preview', {
            data: {
                Order_ID: id,
            },
            method: 'POST',
            success: (data) => {
                try {
                    if (data) {
                        this.preview.html(data);
                        plugins.initBsTooltip();
                        this.setPreviewPosition();
                    } else {
                        this.preview.html(this.renderError());
                        this.setPreviewPosition();
                    }
                } catch(ex) {
                    this.preview.html(this.renderError());
                    this.setPreviewPosition();
                }
            },
            error: (ex) => {
                if (ex.statusText != 'abort') {
                    this.preview.html(this.renderError());
                    this.setPreviewPosition();
                }
            },
            complete: () => {
                this.loadingAjax = null;
                this.init(10);
            }
        })
    }
}