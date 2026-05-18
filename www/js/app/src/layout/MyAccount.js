class MyAccount {

    defaultPage;

    constructor(defaultPage) {
        this.defaultPage = defaultPage;
        $(() => {
            this.bindEvents();
            this.init();
        });
    }

    bindEvents() {
       this.clickEvent();
    }

    init() {
        const paramsString= location.search;
        const searchParams = new URLSearchParams(paramsString);
        let indexParam = searchParams.get('page');
        if (indexParam) {
            this.clearActiveNavigation();
            this.loadPage(indexParam);
            $(`a[data-href$=${indexParam}]`).parent().addClass('active');
        } else {
            this.loadPage(this.defaultPage);
        }
    }

    clickEvent() {
        const me = this;
        $(".navigation-container li").click(function (event) {
            event.preventDefault();
            const pageSlug= $(this).children('a').attr('data-href');
            me.loadPage(pageSlug);
            me.clearActiveNavigation();
            $(this).addClass('active');
            me.updatePageUrl(pageSlug);
        });
    }

    loadPage(pageSlug) {
        const me = this;
        let url;
        url = this.buildProperUrlForPageLoading(pageSlug);
        $.ajax({
            url,
            data: {},
            type: "GET",
            dataType: "html",
            success: function (data) {
                me.updatePageBlock(data);
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
            },
            complete: function (xhr, status) {
                new OrderDetailLayout();
                new AddressEditLayout();
                new PersonalDataEditLayout();
            }
        });
    }

    buildProperUrlForPageLoading(pageSlug) {
        return `/customer/${pageSlug}`;
    }

    updatePageBlock(data) {
        $('#page-block').html(data);
    }

    clearActiveNavigation() {
        $(".navigation-container li").removeClass('active');
    }

    updatePageUrl(pageSlug){
        window.history.pushState({},"", `?page=${pageSlug}`);
    }
}