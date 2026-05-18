class Range {
    options;
    currenturl ='';
    activeFilters='';
    parameterRanges = {}

    constructor(rangeSelector, options) {
        $(() => {
            this.options = options;
            this.options.name = rangeSelector.replace('#','');
            this.parameterRanges = {[this.options.name] : []};
            this.parameterRanges[this.options.name]
                .push(...this.getActiveRanges(this.options.paramNameFrom, this.options.paramNameTo));
            if(this.options.paramNameFrom.length > 0) {
                window.activeRanges = Object.assign(window.activeRanges, {
                    [this.options.name]: {
                        [this.options.paramNameFrom]: this.parameterRanges[this.options.name][0],
                        [this.options.paramNameTo]: this.parameterRanges[this.options.name][1],
                    }
                });
            }
            this.initializeRange(rangeSelector);
            this.currenturl = $('h1').data('current-url');
            this.currentSlug = $('h1').data('current-slug');

            this.activeFilters = this.getActiveFilters();
        });
    }

    initializeRange(rangeSelector) {
        const me = this;
        $(rangeSelector).jRange({
            from: this.options.from,
            to: this.options.to,
            step: 1,
            scale: [$(rangeSelector).data('from'), ...this.divideRange(this.options.to, 2)],
            format: '%s',
            width: '100%',
            isRange: true,
            showLabels: false,
            ondragend: function (vals) {
                me.formatNumber($(rangeSelector).parent()[0].id);
                return me.handleRangeEvent(vals, rangeSelector);
            },
            onstatechange: function () {
                me.formatNumber($(rangeSelector).parent()[0].id);
                me.pagination = 1;
            }
        })
        this.setAlreadySpecifiedRange(rangeSelector);
    }

    setAlreadySpecifiedRange(rangeSelector) {
        if (this.parameterRanges[this.options.name][0]) {
            $(rangeSelector).jRange('setValue', `${this.parameterRanges[this.options.name][0]},${this.parameterRanges[this.options.name][1]}`);
            $(rangeSelector).prev('.range-info').children('.range-from').html(this.parameterRanges[this.options.name][0]);
            $(rangeSelector).prev('.range-info').children('.range-to').html(this.parameterRanges[this.options.name][1]);
        }
            else {
            $(rangeSelector).prev('.range-info').children('.range-from').html(this.options.from);
            $(rangeSelector).prev('.range-info').children('.range-to').html(this.options.to);
        }
    }

    divideRange(number, parts) {
        const range = []
        for(let i= 1; i <= parts; i++) {
            range.push(number/i);
        }
        return range.reverse();
    }

    formatNumber(idSelector) {
        $(`#${idSelector} .range-from`).html($(`#${idSelector} .pointer-label.low`).html().replace(/\B(?=(\d{3})+(?!\d))/g, " "))
        $(`#${idSelector} .range-to`).html($(`#${idSelector} .pointer-label.high`).html().replace(/\B(?=(\d{3})+(?!\d))/g, " "))
    }

    handleRangeEvent(vals) {
        const valArray = vals.split(',');
        this.parameterRanges[this.options.name] = [];
        for (let i = 0; i<valArray.length; i++) {
            this.addToParamsArray(this.options.name, i, valArray[i]);
        }
        this.updateCategoryUrl();
        return this.loadProducts();
    }

    addToParamsArray(name, index, value) {
        this.parameterRanges[name][index] = value;
        window.activeRanges[name][Object.keys( window.activeRanges[name])[index]] = value;
    }

    updateCategoryUrl(){
        const infoFilter = {
            filterKey:Object.keys(this.activeFilters)[0],
            filterValue:Object.values(this.activeFilters)[0],
        }

        let infoRange = '';
        for( const [i, v] of Object.keys(window.activeRanges).entries()) {
            if(Object.values( window.activeRanges[v])[0]=== null) {
                continue;
            }
            let separator = infoRange.length>0 && i>0?'&':'';
            infoRange += separator + Object.keys(window.activeRanges[v])[0]+'=';
            infoRange += Object.values(window.activeRanges[v])[0];
            infoRange += '&' + Object.keys(window.activeRanges[v])[1]+'=';
            infoRange += Object.values(window.activeRanges[v])[1];
        }

        const filterParams= `${infoFilter.filterKey}=${infoFilter.filterValue}`;
        const rangeParams = infoRange;
        this.changePageAndReplace(1);

         if(infoFilter.filterValue) {
             window.history.pushState({},"", `?${filterParams}&${rangeParams}`);
         } else {
             window.history.pushState({},"", `?${rangeParams}`);
         }
    }

    loadProducts() {
        const me = this;
        let url;
        url = `/ajax-load` + this.removePageFromString(projectVars.currentURI);

        $(`#category-products`).addClass('loading');
        $.ajax({
            url,
            data: {...this.getFilterRangeData(), ...this.activeFilters},
            type: "GET",
            dataType: "html",
            success: function (data) {
                $(`#category-products`).html(data);
                $(`#category-products`).removeClass('loading');
                if(!$('#pagination').length) {
                    $('<div class="list-pagination" id="pagination"></div>').insertAfter('#category-products');
                }
                me.updatePagination(1)

            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
                $(`#category-products`).removeClass('loading');
            },
            complete: function (xhr, status) {
                me.initializeSortingFunctionality();
            }
        });
    }

    getActiveFilters(){
        const params = new URLSearchParams(document.location.search);
        return {'f': params.get("f")};
    }

    getActiveRanges(from, to) {
        const params = new URLSearchParams(document.location.search);
        return [params.get(from), params.get(to)];
    }

    getFilterRangeData() {
        let filterRangeData = {}
        for( const objType of Object.keys(window.activeRanges)) {
            if(Object.values( window.activeRanges[objType])[0]=== null) {
                continue;
            }
            Object.assign(filterRangeData, window.activeRanges[objType]);
        }
        return filterRangeData;
    }

    initializeSortingFunctionality() {
        $('.sorting a').click((e) => {
            e.preventDefault();
            let $this = $(e.target);
            let sorting = $this.data('sorting');
            Cookie.setCookie('sorting', sorting, 10);
            location.reload();
        });
    }

    removePageFromString(url) {
        return url.replace(/\/?(page\/\d+\/?)/i, '');
    }

    changePageInUrl(url, newPage) {
        const urlObject = new URL(url);
        const pathParts = urlObject.pathname.split('/');

        const pageIndex = pathParts.indexOf('page');
        if (pageIndex !== -1 && pageIndex + 1 < pathParts.length) {
            pathParts[pageIndex + 1] = newPage.toString();
            urlObject.pathname = pathParts.join('/');
        }

        return urlObject.toString();
    }

   changePageAndReplace(newPage) {
        const currentUrl = window.location.href;
        const newUrl = this.changePageInUrl(currentUrl, newPage);

        window.history.replaceState({}, '', newUrl);
    }

    updatePagination(pagination) {
        const url = '/category/page-update';
        $.ajax({
            url,
            data: {
                'slug': this.currentSlug,
                'page': pagination,
                ...this.getFilterRangeData(), ...this.activeFilters
            },
            type: "GET",
            dataType: "html",
            success: function (data) {
                $(`#pagination`).html(data);
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
            },
        });
    }

}