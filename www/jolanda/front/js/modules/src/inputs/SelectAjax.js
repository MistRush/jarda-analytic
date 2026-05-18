class SelectAjax extends Select{
    constructor(element, form = null) {
        super(element, form);

        this.storeUrl = this.$element.data('store');
        this.storeField = this.$element.data('storefield');
        this.storeParams = this.$element.data('storeparams');
        this.storeDepends = this.$element.data('storedepends');
        this.editable =  typeof this.$element.data('editable') !== 'undefined' && this.$element.data('editable') === true;

        this.ajaxInit();
    }

    ajaxInit(){
        this.initOldFunctions();

        if(typeof this.storeDepends !== 'undefined' && this.form) {
            $(this.form.form).find('[name="' + this.storeDepends + '"]').on('change', (event) => {
                let target = $(event.target);
                if (target.val() === '' || target.val() === null || target.val() === 'null') {
                    this.$element.html(`<option value="null">-</option>`);
                    this.$element.trigger('change');
                } else {
                    this.storeParams[this.storeDepends] = target.val();
                    Helpers.ajax({
                        url: this.storeUrl,
                        data: Object.assign({}, this.storeParams)
                    }).then((data) => {
                        if (typeof data === 'string')
                            data = JSON.parse(data);
                        data = data.items;
                        if (this.$element.attr('data-select-first')) {
                            this.$element.html(``);
                        } else {
                            this.$element.html(`<option value="null">-</option>`);
                        }
                        let val = null;
                        if (this.getValue() !== 'null')
                            val = this.getValue();
                        if (val == null && this.form.id.includes('entityeditor'))
                            val = (window[this.form.id].data[this.$element.attr('name')]);
                        if (val == null && this.$element.attr('data-select-first') && data.length > 0)
                            val = data[0].ID;
                        for (let c in data) {
                            if (typeof data[c] === 'object') {
                                let option = `<option value="${data[c].ID}" ${data[c].ID == val ? 'selected' : ''}>${data[c][this.storeField]}</option>`;
                                this.$element.append(option);
                            }
                        }
                        this.$element.trigger('change');
                    });
                }
            });
        }

        // this.$element.select2({
        //     lang: 'cs',
        //     height: '100%',
        //     allowClear: true,
        //     placeholder: '',
        //     matcher: function (params, data) {
        //         let matcher = $.fn.select2.defaults.defaults.matcher
        //         if (data.id.indexOf(params.term) > -1) {
        //             return data;
        //         }
        //         return matcher(params, data);
        //     },
        //     ajax: {
        //         url: () => {
        //             return this.storeUrl;
        //         },
        //         dataType: 'json',
        //         delay: 350,
        //         data: (params) => {
        //             let limit = 15;
        //
        //             let query = {
        //                 q: params.term,
        //                 //[e.data('storefield')]: params.term,
        //                 start: (limit * (params.page - 1 || 0)),
        //                 count: (limit * (params.page || 1)),
        //             };
        //
        //             if(typeof this.storeParams !== 'undefined')
        //                 query = {...this.storeParams, ...query};
        //
        //             return query;
        //         },
        //         processResults: (data, params) => {
        //             let limit = 15;
        //
        //             let numRows = data.numRows;
        //             data = data.items;
        //             params.page = params.page || 1;
        //             data = $.map(data, (obj) => {
        //                 obj.id = obj.ID;
        //                 obj.text = obj[this.storeField];
        //                 return obj;
        //             });
        //
        //             if(this.editable){
        //                 data = [...[{'id': params.term, text: params.term}], ...data];
        //             }
        //
        //             return {
        //                 results: data,
        //                 pagination: {
        //                     more: (params.page * limit) < numRows
        //                 },
        //             };
        //         },
        //         cache: true,
        //     },
        // });
    }

    initOldFunctions(){
        this.element.setUrlParameter = () => {
            this.setUrlParameter.apply(this)
        };
        this.element.unsetUrlParameter = () => {
            this.unsetUrlParameter.apply(this)
        };
        this.element.getUrlParameter = () => {
            this.getUrlParameter.apply(this)
        };
        this.element.refresh = () => {
            this.refresh.apply(this)
        };
        this.element.refreshThis = () => {
            this.refreshThis.apply(this);
        };
    }

    setUrlParameter(param, value) {
        this.storeParams[param] = value;
        $(this).data('storeparams', this.storeParams);
        return this;
    }

    unsetUrlParameter(param){
        delete this.storeParams[param];
        $(this).data('storeparams', this.storeParams);
        return this;
    }

    getUrlParameter = function (param) {
        return this.storeParams[param];
    }

    refresh() {
        $(this).closest('form').find('[name="' + this.storeDepends + '"]').trigger('change');
    }

    refreshThis() {
        Helpers.ajax({
            url: this.storeUrl,
            data: Object.assign({}, this.storeParams)
        }).then((data) => {
            console.log(data);
            data = JSON.parse(data).items;
            this.$element.html(`<option value="null">-</option>`);
            let val = null;
            if (this.getValue() !== 'null')
                val = this.getValue();
            if (this.form && val == null && this.form.form.id.includes('entityeditor'))
                val = (window[this.form.form.id].data[this.$element.attr('name')]);
            for (let c in data) {
                if (typeof data[c] === 'object') {
                    let option = `<option value="${data[c].ID}" ${data[c].ID == val ? 'selected' : ''}>${data[c][this.storeField]}</option>`;
                    this.$element.append(option);
                }
            }
            this.$element.trigger('change');
        })
    }
}