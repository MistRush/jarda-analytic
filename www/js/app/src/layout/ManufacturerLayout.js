class ManufacturerLayout {
    pagination = 1;
    remainingProducts;

    constructor() {
        $(() => {
            this.bindEvents();
        });
    }

    bindEvents() {
        this.pagination = $('#ajax-load').data('current-page');
        this.remainingProducts = $(`.showing.pagination-${this.pagination}`).data('remaining-to-display');
        this.ajaxClickEvent();
        this.hideDisplayMoreButtonIfNoMoreProductsExist(this.remainingProducts);

        $('#back-to-product-top').click((e)=> {
            new Layout().backToTop();
        })

        $('.sorting a').click((e) => {
            e.preventDefault();
            let $this = $(e.target);
            let sorting = $this.data('sorting');
            Cookie.setCookie('sorting', sorting, 10);
            location.reload();
        });

        $( "#show-more-description" ).click(function() {
            $( "#long-description" ).toggle( 250, function() {
                $( "#short-description" ).hide();
                $('#show-more-description').hide();
            });
        });

        $( "#collapse-more-description" ).click(function() {
            $( "#long-description" ).toggle( 250, function() {
                $( "#short-description" ).show(250);
                $('#show-more-description').show();
            });
        });
    }

    ajaxClickEvent() {
        const me = this;
        $("#ajax-display-more").click(function (event) {
            event.preventDefault();
            $(".loader-circle").show();
            me.loadProducts(me.increasePagination())
            new Layout().doScroll(`#ajax-product-row-${me.pagination}`);
        })
    }

    loadProducts(pagination) {
        const me = this;

        this.createDivContainerForLoadingOfProducts(pagination);
        let url;
        url = this.buildProperUrlForProductLoading(pagination);
        $.ajax({
            url,
            data: {},
            type: "GET",
            dataType: "html",
            success: function (data) {
                me.insertLoadedProductsIntoPage(pagination, data);
                me.hideDisplayMoreButtonIfNoMoreProductsExist($(`.showing.pagination-${pagination}`).data('remaining-to-display'));
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
            },
            complete: function (xhr, status) {
                me.removePreviousPaginationRow(pagination)
                me.updateUrl(pagination);
                me.updatePagination(pagination);
            }
        });
    }
    createDivContainerForLoadingOfProducts(pagination) {
        if(pagination === 1) {
            $("#ajax-load").empty()
            $("#ajax-load").append(`<div id="ajax-product-row-${pagination}"></div>`);
        } else {
            $("#ajax-load").append(`<div id="ajax-product-row-${pagination}"></div>`);
        }
    }

    buildProperUrlForProductLoading(pagination) {
        let manufacturer = $("#ajax-load").data('manufacturer-slug');
        return `/znacky/${manufacturer}/load-page/${pagination}`
    }

    insertLoadedProductsIntoPage(pagination, data) {
        $(`#ajax-product-row-${pagination}`).hide();
        $(`#ajax-product-row-${pagination}`).html(data);
        $(`#ajax-product-row-${pagination}`).show(500);
    }

    insertLoadedPaginationIntoPage(data) {
        $(`#pagination`).html(data);
    }

    increasePagination() {
        return ++this.pagination
    }

    removePreviousPaginationRow(pagination) {
        $(`.pl-box.origin-page-${pagination-1}`).hide()
    }

    hideDisplayMoreButtonIfNoMoreProductsExist(remaining) {
        if (typeof(remaining) === "undefined") {
            $('#ajax-display-more').hide();
        }

        if(remaining == 0) {
            $('#ajax-display-more').hide(500);
        }

    }

    updateUrl(pagination) {
        let currentManufacturerSlug = $("#ajax-load").data('manufacturer-slug');
        window.history.pushState({},"", `/znacky/${currentManufacturerSlug}/page/${pagination}/`);
    }

    updatePagination(pagination) {
        const me = this;
        const url = '/manufacturer/page-update'
        $.ajax({
            url,
            data: {
                'slug': $("#ajax-load").data('manufacturer-slug'),
                'page': pagination
            },
            type: "GET",
            dataType: "html",
            success: function (data) {
                me.insertLoadedPaginationIntoPage(data);
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
            },
        });
    }
}