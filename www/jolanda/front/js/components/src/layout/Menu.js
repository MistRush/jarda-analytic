class Menu {
    constructor() {
        $(()=>{
            $('#menuSearch').keyup(Helpers.delay(()=>{
                this.searchInMenu();
            },this,400));

            $('#toggleMenu').click(() => {
                $('body').toggleClass('menu-open');
                this.setCookie($('body').hasClass('menu-open'));
            });

            window.addEventListener('resize', () => {
                this.toggleMenuFromCookie();
            });

            if ($('.subsubitem.active').length > 0) {
                let parent = $('.subsubitem.active').parent();
                parent.addClass('show');
                parent.siblings('.expander').removeClass('collapsed');
                parent.closest('.subitem').addClass('active');
            }

            if ($('.subitem.active').length > 0) {
                let parent = $('.subitem.active').parent();
                parent.addClass('show');
                parent.siblings('.expander').removeClass('collapsed');
                parent.closest('.item').addClass('active');
            }

            $('.main-search').click((e) => {
                if (window.innerWidth > 768) {
                    if ($('body').hasClass('menu-open')) {
                        return;
                    } else {
                        $('body').addClass('menu-open');
                        if ($(e.target).is('.main-search')) {
                            $(e.target).find('input').focus();
                        } else {
                            $(e.target).parents('.main-search').find('input').focus();
                        }
                    }
                }
            });
        })

        this.toggleMenuFromCookie();
    }

    resetMenuSearch(){
        $('.item').show();
        $('.item .subitem').show();
        $('.item .subsubitem').show();
        $('.item .expander').show();
        $('.item .collapse').not('.show').attr('style', '');
    }

    searchInMenu() {
        let query = $('#menuSearch').val();
        this.resetMenuSearch();
        if (query.length > 0) {
            query = query.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            var results = [];
            $('.menu-item-name').each(function () {
                let regex = new RegExp(query);
                let name = $(this).text().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                let description = $(this).data('description').replace(/\s/g, '').toLowerCase();
                let level = $(this).data('level');
                if (name.search(regex) !== -1 || description.search(regex) !== -1) {
                    results.push($(this));
                }
                if (level == 1) {
                    $(this).closest('.item').hide();
                } else if (level == 2) {
                    $(this).closest('.subitem').hide();
                } else if (level == 3) {
                    $(this).closest('.subitem').hide();
                    $(this).closest('.subsubitem').hide();
                }
            });
            results.forEach(function (item) {
                let level = item.data('level');
                item.closest('.item').show();
                if (level == 2) {
                    item.closest('.subitem').show();
                    item.closest('.first-submenu').show();
                } else if (level == 3) {
                    item.closest('.subitem').show();
                    item.closest('.subsubitem').show();
                    item.closest('.first-submenu').show();
                    item.closest('.second-submenu').show();
                }
            });
            $('.expander').hide();
        }
    }

    setCookie(opened = true) {
        if (window.innerWidth < 769) {
            return;
        }

        Cookie.setCookie('menuOpened', opened, 365)
    }

    toggleMenuFromCookie() {
        if (window.innerWidth < 769) {
            if (!$('body').hasClass('menu-open')) {
                $('body').addClass('menu-open');
            }
            return;
        }
        if (Cookie.getCookie('menuOpened') === undefined){
            this.setCookie(true);
            return;
        }

        if (Cookie.getCookie('menuOpened') === 'true') {
            if (!$('body').hasClass('menu-open')) {
                $('body').addClass('menu-open');
            }
        } else {
            $('body').removeClass('menu-open');
        }
    }
}