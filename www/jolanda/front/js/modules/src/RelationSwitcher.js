class RelationSwitcher {
    /**
     * RelationSwitcher constructor
     * @param {string|Object} params Parametry nastavení
     * @param {jquery} element Selector pro render
     * @param {int|null} parent_id ID rodičovské entity
     */
    constructor(params, element, parent_id = null) {
        if (typeof params == 'string')
            params = JSON.parse(params);
        this.source_url = params.source_url;
        this.delete_url = params.delete_url;
        this.create_url = params.create_url;
        this.relations_url = params.relations_url;
        this.parent_column = params.parent_column;
        this.child_column = params.child_column;
        this.child_name_column = params.child_name_column;
        this.group_by_column = params.group_by_column ?? null;
        this.group_by_name_column = params.group_by_name_column ?? null;
        this.title = params.title;
        this.source_data = {};
        this.group_by_title_data = {};
        this.parent_id = null;
        this.current_relations = {};
        this.element = element;
        this.rendered = false;
        this.getSource();
        this.bindEvents();

        if (parent_id !== null)
            this.setParent(parent_id);
    }

    /**
     * Nabinduje eventy
     */
    bindEvents() {
        this.element.on('change', '.rs-checkbox input[type="checkbox"]', (e, el) => {
            e = $(e.target);

            if (e.prop('checked')) {
                this.createRelation(e.data('key'))
            } else {
                this.deleteRelation(e.data('key'))
            }

            if(e.data('group')) {
                this.handleGroupCheckbox(e.data('group'));
            }
        });

        this.element.on('change', '.rs-group-checkbox input[type="checkbox"]', (e) => {
            e = $(e.target);

            if(e.prop('checked')) {
                $(`.rs-checkbox input[data-group="${e.data('group')}"]:not(:checked)`).each((i, el) => {
                   $(el).prop('checked', true);
                    this.createRelation($(el).data('key'));
                });
            } else {
                $(`.rs-checkbox input[data-group="${e.data('group')}"]:checked`).each((i, el) => {
                    $(el).prop('checked', false);
                    this.deleteRelation($(el).data('key'));
                });
            }
        });

        this.element.on('click', '.rs-group-label', (e) => {
            if($(e.target).hasClass('rs-group-checkbox') || $(e.target).parent().hasClass('rs-group-checkbox')) {
                e.stopPropagation();
            } else {
                e.preventDefault();
            }
        });

        this.element.on('click', '.select-all', (e, el) => {
            this.selectAll();
        });

        this.element.on('click', '.unselect-all', (e, el) => {
            this.unselectAll();
        });

        this.element.on('keyup', 'input[type="text"]', (e, el) => {
            e = $(e.target);
            let value = e.val().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

            if(this.group_by_column) {
                this.element.find('.data .rs-group-label').addClass('d-none');
                this.element.find('.data .rs-checkbox').addClass('d-none');

                this.element.find('.rs-group-label').each((i, e) => {
                    let text = $(e).text().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    let regex = new RegExp(value);
                    if (text.search(regex) !== -1) {
                        $(e).removeClass('d-none');
                    }
                });

                this.element.find('.rs-checkbox').each((i, e) => {
                    let text = $(e).text().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    let regex = new RegExp(value);
                    if (text.search(regex) !== -1) {
                        const group = $(e).parent().data('group');
                        $(`.data .rs-group-label[data-group="${group}"]`).removeClass('d-none');
                        $(e).removeClass('d-none');
                    }
                });
            } else {
                this.element.find('.data label').addClass('d-none');
                this.element.find('label').each((i, e) => {
                    let text = $(e).text().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    let regex = new RegExp(value);
                    if (text.search(regex) !== -1){
                        $(e).removeClass('d-none');
                    }
                });
            }
        });
    }

    /**
     * Vytvoří novou relaci
     * @param {string} value
     */
    createRelation(value) {
        let data = {};
        data[this.parent_column] = this.parent_id;
        data[this.child_column] = value;
        Helpers.ajax({
            url: this.create_url,
            data: {
                data: JSON.stringify(data)
            },
            success: (data) => {
                if (typeof data === 'string')
                    data = JSON.parse(data);
                data = data.items[0];
                this.current_relations[value].ID = data.ID;
                this.current_relations[value].state = true;
                this.resetCounter();
            }
        });
    }

    /**
     * Smaže relaci
     * @param value
     */
    deleteRelation(value) {
        let data = {
            ID: this.current_relations[value].ID
        };
        Helpers.ajax({
            url: this.delete_url,
            data: {
                data: JSON.stringify(data)
            },
            success: (data) => {
                this.current_relations[value].state = false;
                this.resetCounter();
            }
        });
    }

    /**
     * Nastavuje ID rodičovské entity
     * @param value
     */
    setParent(value) {
        this.parent_id = value;
        this.refresh();
    }

    /**
     * Získá zdrojové data
     */
    getSource() {
        Helpers.ajax({
            url: this.source_url,
            success: (data) => {
                if (typeof data === 'string')
                    data = JSON.parse(data);
                data = data.items;
                data.forEach((v, k) => {
                    if(this.group_by_column) {
                        let groupByKey;
                        if(!v[this.group_by_column]) {
                            groupByKey = 0;
                        } else {
                            groupByKey = v[this.group_by_column];
                        }

                        if(!this.source_data[groupByKey]) {
                            this.source_data[groupByKey] = {};
                        }

                        if(this.group_by_name_column) {
                            this.group_by_title_data[groupByKey] = v[this.group_by_name_column] ?? groupByKey;
                        } else {
                            this.group_by_title_data[groupByKey] = groupByKey;
                        }

                        this.source_data[groupByKey][v.ID] = v[this.child_name_column];
                    } else {
                        this.source_data[v.ID] = v[this.child_name_column];
                    }

                    this.current_relations[v.ID] = {
                        ID: null,
                        state: false
                    };
                });
            }
        });
    }

    /**
     * Provede aktualizaci dat
     */
    refresh() {
        let data = {};
        data[this.parent_column] = this.parent_id;
        for (let i in this.current_relations) {
            this.current_relations[i].state = false;
        }
        Helpers.ajax({
            url: this.relations_url,
            data: data,
            success: (data) => {
                if (typeof data === 'string')
                    data = JSON.parse(data);
                data = data.items;
                data.forEach((v, k) => {
                    this.current_relations[v[this.child_column]] = {
                        ID: v.ID,
                        state: true
                    };
                });
                this.render();
            }
        });
    }

    resetCounter() {
        this.element.find('.from').text(Object.values(this.current_relations).filter((item)=>{return item.state}).length)
        if(this.group_by_column) {
            let childCount = 0;
            for (const p in this.source_data) {
                childCount += Object.values(this.source_data[p]).length;
            }
            this.element.find('.to').text(childCount);
        } else {
            this.element.find('.to').text(Object.values(this.source_data).length)
        }
    }

    selectAll() {
        this.element.find('.rs-checkbox:not(.d-none) input[type="checkbox"]').each((i, el) => {
           if($(el).prop('checked') === false)
               $(el).prop('checked', true).trigger('change');
        });
    }

    unselectAll() {
        this.element.find('.rs-checkbox:not(.d-none) input[type="checkbox"]').each((i, el) => {
            if($(el).prop('checked') === true)
                $(el).prop('checked', false).trigger('change');
        });
    }

    handleGroupCheckbox(group = null) {
        if(group) {
            const childCount = $(`.rs-checkbox input[data-group="${group}"]`).length;
            const checkedCount = $(`.rs-checkbox input[data-group="${group}"]:checked`).length;
            const groupCheckbox = $(`.rs-group-checkbox input[data-group="${group}"]`);

            if (checkedCount >= childCount) {
                groupCheckbox.prop('indeterminate', false).prop('checked', true);
            } else if (checkedCount < childCount && checkedCount > 0) {
                groupCheckbox.prop('indeterminate', true);
            } else {
                groupCheckbox.prop('indeterminate', false).prop('checked', false);
            }
        } else {
            $(`.rs-group-checkbox input[type="checkbox"]`).each((i, el) => {
                const group = $(el).data('group');
                const childCount = $(`.rs-checkbox input[data-group="${group}"]`).length;
                const checkedCount = $(`.rs-checkbox input[data-group="${group}"]:checked`).length;

                if (checkedCount >= childCount) {
                    $(el).prop('indeterminate', false).prop('checked', true);
                } else if (checkedCount < childCount && checkedCount > 0) {
                    $(el).prop('indeterminate', true).prop('checked', false);
                } else {
                    $(el).prop('indeterminate', false).prop('checked', false);
                }
            });
        }
    }

    /**
     * Provede render
     */
    render() {
        if (!this.rendered){
            this.element.html(`<h2>${this.title} (<span class="from"></span>/<span class="to"></span>)</h2><div class="search mb-2 w100"><input type="text" class=""><div class="btn btn-dark select-all">${translations.SELECT_ALL}</div><div class="btn btn-dark unselect-all">${translations.UNSELECT_ALL}</div></div><div class="data"></div>`);
            this.rendered = true;
        }
        let html = '';
        if(this.group_by_column) {
            for (const group in this.source_data) {
                html += `<div class="rs-group-label collapsed" data-toggle="collapse" data-target="#rs-group-${group}" data-group="${group}"><span class="rs-arrow"></span><label class="checkbox rs-group-checkbox"><input type="checkbox" data-group="${group}" class="form-control"><span class="checkmark"></span>${this.group_by_title_data[group]}</label></div>`;
                html += `<div id="rs-group-${group}" data-group="${group}" class="rs-group collapse-container collapse">`;
                for (const i in this.source_data[group]) {
                    html += `<label class="checkbox rs-checkbox" style="display: flex"><input type="checkbox" data-group="${group}" data-key="${i}" ${this.current_relations[i].state ? 'checked' : ''} class="form-control"><span class="checkmark"></span>${this.source_data[group][i]}</label>`;
                }
                html += `</div>`;
            }
        } else {
            for (let i in this.source_data) {
                html += `<label class="checkbox rs-checkbox" style="display: flex"><input type="checkbox" data-key="${i}" ${this.current_relations[i].state ? 'checked' : ''} class="form-control"><span class="checkmark"></span>${this.source_data[i]}</label>`;
            }
        }
        this.element.find('.data').html(html);
        this.resetCounter();
        this.handleGroupCheckbox();
    }


}