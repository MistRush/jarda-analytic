class Breadcrumb {
    /**
     * Breadcrumb constructor.
     * @param {array} items Výchozí pole položek breadcrumbu
     * @param {string} homepage_url
     * @param {string} site
     */
    constructor(items = [], homepage_url = basePath + '/default/homepage', site= '') {
        this.items = items;
        this.site = site
        this.homepage_url = homepage_url
        this.render()
    }

    /**
     * Přidá položku
     * @param {string} url URL položky
     * @param {string} type ZATÍM NEVYUŽITO
     * @param {string} name Název položky
     */
    addItem(url, type = null, name) {
        this.items.push({
            'url': url,
            'type': type,
            'name': name
        })
        this.render();
    }

    /**
     * Odstraní poslední položku
     */
    popItem() {
        this.items.pop();
        this.render();
    }

    /**
     * Mění titulek stránky dle názvu poslední položky
     */
    changeTitle() {
        if (this.items.length > 0)
            window.document.title = (this.items[this.items.length-1].name).replace(/<[^>]+>/g, '') + ' | ' + this.site;
    }

    /**
     * Render breadcrumbu
     */
    render() {
        let items = `
            <a href="${this.homepage_url}" class="d-flex align-items-center">
                <i class="fa fa-home home-icon"></i>
                <span>Homepage</span>
            </a>
        `;
        this.items.forEach((v,k) => {
           items += `<span class="breadcrumbitem"><i class="fa fa-chevron-right"></i> <a href="${v.url}">${v.name}</a></span>`;
        });
        $('.breadcrumb-items').html(items);
        this.changeTitle();
    }
}