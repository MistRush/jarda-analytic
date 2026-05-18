class CategoryLayout {
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
        });

        $('.sorting a').click((e) => {
            e.preventDefault();
            let $this = $(e.target);
            let sorting = $this.data('sorting');
            Cookie.setCookie('sorting', sorting, 10);
            location.reload();
        });

        $('.grid a').click((e) => {
            e.preventDefault();
            let $this = $(e.target);
            let grid = $this.parent().data('grid');
            Cookie.setCookie('grid', grid, 10);
            location.reload();
        });

        $( "#show-more-description" ).click(function() {
            $( "#long-description" ).toggle( 250, function() {
                $('#show-more-description').hide();
            });
        });

        $( "#collapse-more-description" ).click(function() {
            $( "#long-description" ).toggle( 250, function() {
                $('#show-more-description').show();
                new Layout().doScroll("#category-headline");
            });
        });
        new Watchdog();
    }

    ajaxClickEvent() {
        const me = this;
        $("#ajax-display-more").click(function (event) {
            event.preventDefault();
            $(".loader-circle").show();
            me.loadProducts(me.increasePagination());
            new Layout().doScroll(`#ajax-product-row-${me.pagination}`);
        });
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
                me.removePreviousPaginationRow(pagination);
                me.updateUrl(pagination);
                me.updatePagination(pagination);
                const wishlist = new Wishlist();
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
        let category = $("#ajax-load").data('category-slug');
        let currentFilter = $("#ajax-load").data('current-filter');
        return `/c/${category}/load-page/${pagination}?f=${currentFilter}`;
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
        return ++this.pagination;
    }

    removePreviousPaginationRow(pagination) {
        $(`.pl-box.origin-page-${pagination-1}`).hide();
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
        let currentCategorySlug = $("#ajax-load").data('category-slug');
        let currentFilter = $("#ajax-load").data('current-filter');
        window.history.pushState({},"", `/c/${currentCategorySlug}/page/${pagination}?f=${currentFilter}`);
    }

    updatePagination(pagination) {
        const me = this;
        const url = '/category/page-update';
        $.ajax({
            url,
            data: {
                'slug': $("#ajax-load").data('category-slug'),
                'f': $("#ajax-load").data('current-filter'),
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