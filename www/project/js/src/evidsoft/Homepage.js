/* MAIN CLASS */
class Homepage {
    $nav;
    $content;
    titles;
    navigation;

    constructor() {
        this.$nav = $('#navigation .wrapper');
        this.$content = $('#homepage .main-content>.row>div');
        this.titles = {
            'ordersChart': 'Statistiky',
            'otherInfo': 'Aktivní objednávky',
            'helpContact': 'Kontakt na dodavatele',
            'evidsoft': 'Evidsoft',
        };
        this.navigation = null;
    }

    init() {
        this.buildMenu();
        this.navigation = new Navigation();
        this.search = new Search();
    }

    buildMenu() {
        var exclude = ['search', 'facts', 'gallery'];
        if (this.$nav.length > 0 && this.$content.length > 0) {
            this.$nav.html('');
            this.$content.each((i) => {
                if($(this.$content.get(i)).attr('id').length > 0) {
                    if(exclude.includes($(this.$content.get(i)).attr('id')) == false) {
                        var danger = ($(this.$content.get(i)).data('danger') == true)? '<i class="ci ci-warning text-danger mr-2"></i>':'';
                        this.$nav.append('<li><a href="#" data-id="' + $(this.$content.get(i)).attr('id') + '">' + danger + 
                            ((this.titles[$(this.$content.get(i)).attr('id')])?
                                (this.titles[$(this.$content.get(i)).attr('id')]):
                                ($(this.$content.get(i)).find('.title').text() + $(this.$content.get(i)).find('.panel>.heading').text())
                            ) + (($(this.$content.get(i)).data('icon'))?('<i class="' + $(this.$content.get(i)).data('icon') + '"></i>'):('<i class="far fa-circle" style="font-size: 10px;width:16px;text-align:right;"></i>')) + '</a></li>');
                    } else if($(this.$content.get(i)).attr('id') == 'search') {
                        this.$nav.append('<li><a href="#" class="search" data-id="search">' +
                        ((this.titles[$(this.$content.get(i)).attr('id')])?this.titles[$(this.$content.get(i)).attr('id')]:'Search')+ '<i class="ci ci-search"></i></a>');
                    }
                }
            });
        }
    }
}

/* NAVIGATION ANIMATION */
class Navigation {
    constructor() {
        this.init();
    }

    init() {
        $(window).scroll((e) => {
            this.setItem();
        });
    }

    setItem() {
        var scrollTop = $(window).scrollTop() + ($(window).height() / 2);
        var items = [];
        $('.main-content>.row>div').each(function (i) {
            var offset = $(this).offset().top - 12;
            var offset_bottom = offset + $(this).height() + 12;
            if (offset <= scrollTop && offset_bottom >= scrollTop) {
                items.push($('#navigation li a[data-id="' + $(this).attr('id') + '"]'));
            }
        });
        $('#navigation li a').removeClass('active');
        for (var i=0;i<items.length;i++) {
            Object.values(items)[i].addClass('active');
        }
    }
}

/* AJAX SEARCH */
class Search {
    #$search_input;
    #$search_results;
    loading;

    constructor(result_count = 5) {
        this.#$search_input = $('#search input');
        this.#$search_results = $('#search .search-results');

        this.handleInput();
    }

    handleInput() {
        let timeout = null;

        this.#$search_input.on('keyup paste' ,(e) => {
            if (e.target.value.length > 1) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.searchItems(e.target.value);
                }, 500);
            } else {
                this.searchItems('');
            }
        });
    }

    searchItems(SearchString) {
        SearchString = SearchString.toLowerCase();
        if (SearchString.length > 0) {
            this.getItems(SearchString);
            if (this.#$search_results.is(':not(:visible)')) {
                this.toggleResults(true);
            }
        } else {
            this.toggleResults(false);
        }
    }

    getItems(SearchString, Category = 0) {
        if (SearchString.length === 0 || $(window).width() < 769) {
            return false;
        }

        this.#$search_results.html('<div class="text-center text-muted">Probíhá načítání ...</div>');

        $.ajax({
            url: basePath + '/admin/index/search',
            data: {
                SearchString: SearchString
            },
            success: (data) => {
                this.#$search_results.html(data);
            },
            fail: () => {
            }
        })
    }

    toggleResults(show = null) {
        if (show === true) {
            this.#$search_results.stop().slideDown(300);
        } else if (show === false) {
            this.#$search_results.stop().slideUp(300);
        } else {
            this.#$search_results.stop().slideToggle(300);
        }
    }

    clearInput() {
        this.#$search_input.val('');
        this.searchItems('');
    }
}