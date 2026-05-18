class Plugins {
    constructor() {
        this.afterInit = null;
        this.tinyMCEKey = settings.filemanagerKey;
        this.lazyload = null;
        this.initSelectEvents = false;
        this.tiniMceCustomParams = {};

        if (typeof filemanagerSubForlder === "undefined")
            this.filemanagerSubForlder = "";
        else
            this.filemanagerSubForlder = filemanagerSubForlder;

        moment.locale(Helpers.getBrowserLocales()[0]);

        lightbox.option({
            'resizeDuration': 100,
            'fadeDuration': 100,
            'imageFadeDuration': 100,
            'albumLabel': "%1 / %2"
        })

        $(function () {
            setTimeout(plugins.initPlugins());
        })
    }

    initPlugins(reinit = false, reset = false) {
        $.fn.modal.Constructor.prototype._enforceFocus = function() {};

        this.initGrapes(reinit, reset);
        this.initTinyMCE(reinit);
        this.initSvg();
        this.initDatePicker();
        this.initSelect2();
        this.initBsFile();
        this.initBsPopover();
        this.initBsTooltip();
        this.initLazyLoad();

        if (typeof this.afterInit === 'function')
            this.afterInit();
    }

    initLazyLoad() {
        this.lazyload = new LazyLoad({});
    }

    initBsTooltip() {
        $('.tooltip[role="tooltip"]').remove();

        $('body').tooltip({
            selector: '[data-toggle="bstooltip"]',
            html: true
        });

        $('body').tooltip({
            selector: '[data-toggle="tooltipCustom"]',
            html: true,
            template: '<div class="tooltip tooltip-custom" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
            placement: 'bottom'
        });

    }

    initBsPopover() {
        $('body').popover({
            selector: '[data-toggle="bspopover"]',
            html : true,
            trigger: 'focus'
        });

    }

    initSvg() {
        $('img.svg').each(function () {
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            jQuery.get(imgURL, function (data) {
                var $svg = jQuery(data).find('svg');
                if (typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                if (typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass + ' replaced-svg');
                }
                $svg = $svg.removeAttr('xmlns:a');
                if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                    $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
                }
                $img.replaceWith($svg);
            }, 'xml');
        });
    }

    initDatePicker() {
        $('.datepicker').each(function () {
            let val = $(this).val();
            if (val.match(/^\d{4}-\d{2}-\d{2}$/)) {
                let date = moment(val, 'YYYY-MM-DD');
                val = date.format('L');
                $(this).val(val)
            }
        })
        $('.datetimepicker').each(function () {
            let val = $(this).val();
            if (val.match(/^\d{4}-\d{2}-\d{2}.*$/)) {
                let date = moment(val, 'YYYY-MM-DD HH:mm:ss');
                val = date.format('L LTS');
                $(this).val(val)
            }
        })
        $('.timepickerH').each(function () {
            let val = $(this).val();
            if (val.match(/^\d{2}$/)) {
                let date = moment(val, 'HH');
                val = date.format('HH');
                $(this).val(val)
            }
        })
        $('.timepickerHM').each(function () {
            let val = $(this).val();
            if (val.match(/^\d{2}:\d{2}$/)) {
                let date = moment(val, 'HH:mm');
                val = date.format('LT');
                $(this).val(val)
            }
        })
        $('.timepickerHMS').each(function () {
            let val = $(this).val();
            if (val.match(/^\d{2}:\d{2}:\d{2}$/)) {
                let date = moment(val, 'HH:mm:ss');
                val = date.format('LTS');
                $(this).val(val)
            }
        })
        $('.datepicker').datetimepicker({
            locale: moment.locale(lang),
            format: 'L',
        });
        $('.datetimepicker').datetimepicker({
            locale: moment.locale(lang),
            format: 'L LTS',
        });
        $('.timepickerH').datetimepicker({
            locale: moment.locale(lang),
            format: 'HH',
        });
        $('.timepickerHM').datetimepicker({
            locale: moment.locale(lang),
            format: 'LT',
        });
        $('.timepickerHMS').datetimepicker({
            locale: moment.locale(lang),
            format: 'LTS',
        });
    }

    initSelect2() {
        $('select:not(.noselect):not([name*="_datagrid_length"]):not([data-store])').each((index, e) => {
            e = $(e);
            e.select2({
                lang: 'cs',
                width: '100%',
                allowClear: true,
                placeholder: '',
                tags: typeof e.data('editable') !== 'undefined' && e.data('editable') === true,
                matcher: function (params, data) {
                    let matcher = $.fn.select2.defaults.defaults.matcher
                    if (data.id.indexOf(params.term) > -1) {
                        return data;
                    }
                    return matcher(params, data);
                },
            });
        });

        if(!this.initSelectEvents){
            $(document).on('click', '.select2.select2-container.select2-container--default.select2-container--below[data-select2-id]', (e) => {
                if($('.select2-container.select2-container--default.select2-container--open .select2-search__field').length)
                    $('.select2-container.select2-container--default.select2-container--open .select2-search__field')[0].focus();
            });

            $(document).on('focus', '.select2-selection.select2-selection--single', function (e) {
                $(this).closest(".select2-container").siblings('select:enabled').select2('open');

                if($('.select2-container.select2-container--default.select2-container--open .select2-search__field').length)
                    $('.select2-container.select2-container--default.select2-container--open .select2-search__field')[0].focus();
            });

            // steal focus during close - only capture once and stop propogation
            $(document).on('select2:closing', 'select.select2-hidden-accessible', function (e) {
                $(e.currentTarget).trigger('focus');
                $(e.target).data("select2").$selection.one('focus focusin', function (e) {
                    e.stopPropagation();
                });
            });

            this.initSelectEvents = true;
        }

    }

    initSelect2Ajax(selector){
        $(selector).find('[data-store]:not(.noselect):not([name*="_datagrid_length"]):not([data-select2-id])').each((i,e)=>{
            e = $(e);
            e[0].setUrlParameter = function (k, v) {
                let params = $(this).data('storeparams');
                params[k] = v;
                $(this).data('storeparams', params);
            };
            e[0].unsetUrlParameter = function (k) {
                let params = $(this).data('storeparams');
                delete params[k];
                $(this).data('storeparams', params);
            };
            e[0].getUrlParameter = function (k) {
                let params = $(this).data('storeparams');
                return params[k];
            };
            e[0].refresh = function () {
                let parent = $(this).data('storedepends');
                $(this).closest('form').find('[name="' + $(this).data('storedepends') + '"]').trigger('change');
            };
            e[0].refreshThis = function () {
                let params = $(this).data('storeparams');
                $.ajax({
                    url: e.data('store'),
                    data: Object.assign({}, params)
                }).then((data) => {
                    data = JSON.parse(data).items;
                    e.html(`<option value="null">-</option>`);
                    let val = null;
                    if (e.val() !== 'null')
                        val = e.val();
                    if (val == null && selector.id.includes('entityeditor'))
                        val = (window[selector.id].data[e.attr('name')]);
                    for (let c in data) {
                        if (typeof data[c] === 'object') {
                            let option = `<option value="${data[c].ID}" ${data[c].ID == val ? 'selected' : ''}>${data[c][e.data('storefield')]}</option>`;
                            e.append(option);
                        }
                    }
                    e.trigger('change');
                })
            };

            if(typeof e.data('storedepends') !== 'undefined') {
                $(selector).find('[name="' + e.data('storedepends') + '"]').on('change', (event) => {
                    let target = $(event.target);
                    if (target.val() === '' || target.val() === null || target.val() === 'null') {
                        e.html(`<option value="null">-</option>`);
                        e.trigger('change');
                    } else {
                        let params = e.data('storeparams');
                        params[e.data('storedepends')] = target.val();
                        $.ajax({
                            url: e.data('store'),
                            data: Object.assign({}, params)
                        }).then((data) => {
                            if (typeof data === 'string')
                                data = JSON.parse(data);
                            data = data.items;
                            if (e.attr('data-select-first')) {
                                e.html(``);
                            } else {
                                e.html(`<option value="null">-</option>`);
                            }
                            let val = null;
                            if (e.val() !== 'null')
                                val = e.val();
                            if (val == null && selector.id.includes('entityeditor'))
                                val = (window[selector.id].data[e.attr('name')]);
                            if (val == null && e.attr('data-select-first') && data.length > 0)
                                val = data[0].ID;
                            for (let c in data) {
                                if (typeof data[c] === 'object') {
                                    let option = `<option value="${data[c].ID}" ${data[c].ID == val ? 'selected' : ''}>${data[c][e.data('storefield')]}</option>`;
                                    e.append(option);
                                }
                            }
                            e.trigger('change');
                        });
                    }
                });
            }
            e.select2({
                lang: 'cs',
                height: '100%',
                allowClear: true,
                placeholder: '',
                matcher: function (params, data) {
                    let matcher = $.fn.select2.defaults.defaults.matcher
                    if (data.id.indexOf(params.term) > -1) {
                        return data;
                    }
                    return matcher(params, data);
                },
                ajax: {
                    url: e.data('store'),
                    dataType: 'json',
                    delay: 350,
                    data: function (params) {
                        let limit = 15;

                        let query = {
                            q: params.term,
                            //[e.data('storefield')]: params.term,
                            start: (limit * (params.page - 1 || 0)),
                            count: (limit * (params.page || 1)),
                        };

                        if(typeof e.data('storeparams') !== 'undefined')
                            query = {...e.data('storeparams'), ...query};

                        return query;
                    },
                    processResults: function (data, params) {
                        let editable = typeof e.data('editable') !== 'undefined' && e.data('editable') === true;

                        let limit = 15;

                        let numRows = data.numRows;
                        data = data.items;
                        params.page = params.page || 1;
                        data = $.map(data, function (obj) {
                            obj.id = obj.ID;
                            obj.text = obj[e.data('storefield')];
                            return obj;
                        });

                        if(editable){
                            console.log('jsemtu');
                            data = [...[{'id': 'null', text: params.term}], ...data];
                        }

                        return {
                            results: data,
                            pagination: {
                                more: (params.page * limit) < numRows
                            },
                        };
                    },
                    cache: true,
                },
            });


        });
    }

    initTinyMCE(reinit = false) {
        tinymce.init({
            selector: 'textarea[data-mce=true]:not([aria-hidden])',
            language: lang,
            branding: false,
            height: 300,
            image_advtab: true,
            relative_urls: false,
            remove_script_host: true,
            document_base_url: basePath,
            paste_data_images: true,
            convert_urls: true,
            skin: (Cookie.getCookie('color-mode') === 'prefer-dark') ? 'oxide-dark' : null,
            content_css: (Cookie.getCookie('color-mode') === 'prefer-dark') ? 'dark' : null,
            plugins: 'preview paste searchreplace autolink code visualblocks visualchars fullscreen image link media table charmap hr nonbreaking anchor toc insertdatetime advlist lists wordcount textpattern noneditable help charmap quickbars emoticons responsivefilemanager',
            toolbar: 'undo redo | bold italic underline strikethrough | formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | charmap emoticons | fullscreen  preview | insertfile image media responsivefilemanager link anchor',
            toolbar_sticky: true,
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
            toolbar_mode: 'sliding',
            // external_filemanager_path: basePath + "/jolanda/front/filemanager/",
            external_filemanager_path: basePath + "/admin/file-manager/",
            // external_plugins: { "filemanager" : basePath + "/core/filemanager/plugin.min.js"},
            menu: {
                file: {title: 'File', items: 'newdocument restoredraft | preview | print '},
                edit: {title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace'},
                view: {
                    title: 'View',
                    items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen'
                },
                insert: {
                    title: 'Insert',
                    items: 'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime'
                },
                format: {
                    title: 'Format',
                    items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats align | forecolor backcolor | removeformat'
                },
                tools: {title: 'Tools', items: 'spellchecker spellcheckerlanguage | code wordcount'},
                table: {title: 'Table', items: 'inserttable | cell row column | tableprops deletetable'},
            },
            filemanager_access_key: this.tinyMCEKey,
            filemanager_relative_url: basePath,
            filemanager_subfolder: this.filemanagerSubForlder,
            setup: function (editor) {
                editor.on('blur change cut copy keyup paste focus focusout', function(e){
                    editor.save();
                });
            },
            ...this.tiniMceCustomParams,
        });
    }

    initBsFile() {
        bsCustomFileInput.init()
    }

    initGrapes(reinit = false, reset = false) {
        // $('.block-editor').each((i, e) => {
        //     let isInit = false;
        //     grapesjs.editors.forEach((editor) => {
        //         if($(editor.getEl()).parent()[0] === e){
        //             isInit = true;
        //
        //             if(reinit){
        //                 editor.destroy();
        //                 isInit = false;
        //             }
        //         }
        //     });
        //
        //     if(isInit)
        //         return;
        //
        //     console.log('asd');
        //
        //     let editor = grapesjs.init({
        //         container: e,
        //         storageManager: {type: 'null'},
        //         fromElement: true,
        //         height: '600px',
        //         storeComponents: false,
        //         noticeOnUnload: false,
        //
        //         canvas: {
        //             styles: [
        //                 "https://fonts.googleapis.com/css2?family=Nunito+Sans&display=swap",
        //                 "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css",
        //                 basePath + "/front/css/libs.min.css",
        //                 basePath + "/front/css/style.min.css"
        //             ],
        //             scripts: [
        //                 "https://code.jquery.com/jquery-3.3.1.slim.min.js",
        //                 "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js",
        //             ]
        //         },
        //         assetManager: {
        //             custom: true,
        //         },
        //         /*assetManager: {
        //             assets: [
        //                 'http://placehold.it/350x250/78c5d6/fff/image1.jpg',
        //                 // Pass an object with your properties
        //                 {
        //                     type: 'image',
        //                     src: 'http://placehold.it/350x250/459ba8/fff/image2.jpg',
        //                     height: 350,
        //                     width: 250,
        //                     name: 'displayName'
        //                 },
        //                 {
        //                     // As the 'image' is the base type of assets, omitting it will
        //                     // be set as `image` by default
        //                     src: 'http://placehold.it/350x250/79c267/fff/image3.jpg',
        //                     height: 350,
        //                     width: 250,
        //                     name: 'displayName'
        //                 },
        //             ],
        //         },*/
        //         customStyleManager: [{
        //             name: 'General',
        //             buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
        //             properties: [{
        //                 name: 'Alignment',
        //                 property: 'float',
        //                 type: 'radio',
        //                 defaults: 'none',
        //                 list: [
        //                     {value: 'none', className: 'fa fa-times'},
        //                     {value: 'left', className: 'fa fa-align-left'},
        //                     {value: 'right', className: 'fa fa-align-right'}
        //                 ],
        //             },
        //                 {property: 'position', type: 'select'}
        //             ],
        //         }, {
        //             name: 'Dimension',
        //             open: false,
        //             buildProps: ['width', 'flex-width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
        //             properties: [{
        //                 id: 'flex-width',
        //                 type: 'integer',
        //                 name: 'Width',
        //                 units: ['px', '%'],
        //                 property: 'flex-basis',
        //                 toRequire: 1,
        //             }, {
        //                 property: 'margin',
        //                 properties: [
        //                     {name: 'Top', property: 'margin-top'},
        //                     {name: 'Right', property: 'margin-right'},
        //                     {name: 'Bottom', property: 'margin-bottom'},
        //                     {name: 'Left', property: 'margin-left'}
        //                 ],
        //             }, {
        //                 property: 'padding',
        //                 properties: [
        //                     {name: 'Top', property: 'padding-top'},
        //                     {name: 'Right', property: 'padding-right'},
        //                     {name: 'Bottom', property: 'padding-bottom'},
        //                     {name: 'Left', property: 'padding-left'}
        //                 ],
        //             }],
        //         }, {
        //             name: 'Typography',
        //             open: false,
        //             buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'],
        //             properties: [
        //                 {name: 'Font', property: 'font-family'},
        //                 {name: 'Weight', property: 'font-weight'},
        //                 {name: 'Font color', property: 'color'},
        //                 {
        //                     property: 'text-align',
        //                     type: 'radio',
        //                     defaults: 'left',
        //                     list: [
        //                         {value: 'left', name: 'Left', className: 'fa fa-align-left'},
        //                         {value: 'center', name: 'Center', className: 'fa fa-align-center'},
        //                         {value: 'right', name: 'Right', className: 'fa fa-align-right'},
        //                         {value: 'justify', name: 'Justify', className: 'fa fa-align-justify'}
        //                     ],
        //                 }, {
        //                     property: 'text-decoration',
        //                     type: 'radio',
        //                     defaults: 'none',
        //                     list: [
        //                         {value: 'none', name: 'None', className: 'fa fa-times'},
        //                         {value: 'underline', name: 'underline', className: 'fa fa-underline'},
        //                         {value: 'line-through', name: 'Line-through', className: 'fa fa-strikethrough'}
        //                     ],
        //                 }, {
        //                     property: 'text-shadow',
        //                     properties: [
        //                         {name: 'X position', property: 'text-shadow-h'},
        //                         {name: 'Y position', property: 'text-shadow-v'},
        //                         {name: 'Blur', property: 'text-shadow-blur'},
        //                         {name: 'Color', property: 'text-shadow-color'}
        //                     ],
        //                 }],
        //         }, {
        //             name: 'Decorations',
        //             open: false,
        //             buildProps: ['opacity', 'border-radius', 'border', 'box-shadow', 'background-bg'],
        //             properties: [{
        //                 type: 'slider',
        //                 property: 'opacity',
        //                 defaults: 1,
        //                 step: 0.01,
        //                 max: 1,
        //                 min: 0,
        //             }, {
        //                 property: 'border-radius',
        //                 properties: [
        //                     {name: 'Top', property: 'border-top-left-radius'},
        //                     {name: 'Right', property: 'border-top-right-radius'},
        //                     {name: 'Bottom', property: 'border-bottom-left-radius'},
        //                     {name: 'Left', property: 'border-bottom-right-radius'}
        //                 ],
        //             }, {
        //                 property: 'box-shadow',
        //                 properties: [
        //                     {name: 'X position', property: 'box-shadow-h'},
        //                     {name: 'Y position', property: 'box-shadow-v'},
        //                     {name: 'Blur', property: 'box-shadow-blur'},
        //                     {name: 'Spread', property: 'box-shadow-spread'},
        //                     {name: 'Color', property: 'box-shadow-color'},
        //                     {name: 'Shadow type', property: 'box-shadow-type'}
        //                 ],
        //             }, {
        //                 id: 'background-bg',
        //                 property: 'background',
        //                 type: 'bg',
        //             },],
        //         }, {
        //             name: 'Extra',
        //             open: false,
        //             buildProps: ['transition', 'perspective', 'transform'],
        //             properties: [{
        //                 property: 'transition',
        //                 properties: [
        //                     {name: 'Property', property: 'transition-property'},
        //                     {name: 'Duration', property: 'transition-duration'},
        //                     {name: 'Easing', property: 'transition-timing-function'}
        //                 ],
        //             }, {
        //                 property: 'transform',
        //                 properties: [
        //                     {name: 'Rotate X', property: 'transform-rotate-x'},
        //                     {name: 'Rotate Y', property: 'transform-rotate-y'},
        //                     {name: 'Rotate Z', property: 'transform-rotate-z'},
        //                     {name: 'Scale X', property: 'transform-scale-x'},
        //                     {name: 'Scale Y', property: 'transform-scale-y'},
        //                     {name: 'Scale Z', property: 'transform-scale-z'}
        //                 ],
        //             }]
        //         }, {
        //             name: 'Flex',
        //             open: false,
        //             properties: [{
        //                 name: 'Flex Container',
        //                 property: 'display',
        //                 type: 'select',
        //                 defaults: 'block',
        //                 list: [
        //                     {value: 'block', name: 'Disable'},
        //                     {value: 'flex', name: 'Enable'}
        //                 ],
        //             }, {
        //                 name: 'Flex Parent',
        //                 property: 'label-parent-flex',
        //                 type: 'integer',
        //             }, {
        //                 name: 'Direction',
        //                 property: 'flex-direction',
        //                 type: 'radio',
        //                 defaults: 'row',
        //                 list: [{
        //                     value: 'row',
        //                     name: 'Row',
        //                     className: 'icons-flex icon-dir-row',
        //                     title: 'Row',
        //                 }, {
        //                     value: 'row-reverse',
        //                     name: 'Row reverse',
        //                     className: 'icons-flex icon-dir-row-rev',
        //                     title: 'Row reverse',
        //                 }, {
        //                     value: 'column',
        //                     name: 'Column',
        //                     title: 'Column',
        //                     className: 'icons-flex icon-dir-col',
        //                 }, {
        //                     value: 'column-reverse',
        //                     name: 'Column reverse',
        //                     title: 'Column reverse',
        //                     className: 'icons-flex icon-dir-col-rev',
        //                 }],
        //             }, {
        //                 name: 'Justify',
        //                 property: 'justify-content',
        //                 type: 'radio',
        //                 defaults: 'flex-start',
        //                 list: [{
        //                     value: 'flex-start',
        //                     className: 'icons-flex icon-just-start',
        //                     title: 'Start',
        //                 }, {
        //                     value: 'flex-end',
        //                     title: 'End',
        //                     className: 'icons-flex icon-just-end',
        //                 }, {
        //                     value: 'space-between',
        //                     title: 'Space between',
        //                     className: 'icons-flex icon-just-sp-bet',
        //                 }, {
        //                     value: 'space-around',
        //                     title: 'Space around',
        //                     className: 'icons-flex icon-just-sp-ar',
        //                 }, {
        //                     value: 'center',
        //                     title: 'Center',
        //                     className: 'icons-flex icon-just-sp-cent',
        //                 }],
        //             }, {
        //                 name: 'Align',
        //                 property: 'align-items',
        //                 type: 'radio',
        //                 defaults: 'center',
        //                 list: [{
        //                     value: 'flex-start',
        //                     title: 'Start',
        //                     className: 'icons-flex icon-al-start',
        //                 }, {
        //                     value: 'flex-end',
        //                     title: 'End',
        //                     className: 'icons-flex icon-al-end',
        //                 }, {
        //                     value: 'stretch',
        //                     title: 'Stretch',
        //                     className: 'icons-flex icon-al-str',
        //                 }, {
        //                     value: 'center',
        //                     title: 'Center',
        //                     className: 'icons-flex icon-al-center',
        //                 }],
        //             }, {
        //                 name: 'Flex Children',
        //                 property: 'label-parent-flex',
        //                 type: 'integer',
        //             }, {
        //                 name: 'Order',
        //                 property: 'order',
        //                 type: 'integer',
        //                 defaults: 0,
        //                 min: 0
        //             }, {
        //                 name: 'Flex',
        //                 property: 'flex',
        //                 type: 'composite',
        //                 properties: [{
        //                     name: 'Grow',
        //                     property: 'flex-grow',
        //                     type: 'integer',
        //                     defaults: 0,
        //                     min: 0
        //                 }, {
        //                     name: 'Shrink',
        //                     property: 'flex-shrink',
        //                     type: 'integer',
        //                     defaults: 0,
        //                     min: 0
        //                 }, {
        //                     name: 'Basis',
        //                     property: 'flex-basis',
        //                     type: 'integer',
        //                     units: ['px', '%', ''],
        //                     unit: '',
        //                     defaults: 'auto',
        //                 }],
        //             }, {
        //                 name: 'Align',
        //                 property: 'align-self',
        //                 type: 'radio',
        //                 defaults: 'auto',
        //                 list: [{
        //                     value: 'auto',
        //                     name: 'Auto',
        //                 }, {
        //                     value: 'flex-start',
        //                     title: 'Start',
        //                     className: 'icons-flex icon-al-start',
        //                 }, {
        //                     value: 'flex-end',
        //                     title: 'End',
        //                     className: 'icons-flex icon-al-end',
        //                 }, {
        //                     value: 'stretch',
        //                     title: 'Stretch',
        //                     className: 'icons-flex icon-al-str',
        //                 }, {
        //                     value: 'center',
        //                     title: 'Center',
        //                     className: 'icons-flex icon-al-center',
        //                 }],
        //             }]
        //         }
        //         ],
        //     });
        //
        //     if ($(editor.getEl()).parent().hasClass('block-editor')) {
        //         let name = $(editor.getEl()).parent().parent().attr('blockeditordata');
        //         let dynamic = $(editor.getEl()).parent().parent().attr('dynamic') ?? false;
        //         let editorName = $(editor.getEl()).parent().parent().attr('name');
        //
        //         if(dynamic){
        //             let namesSelect = $("[name='" + editorName + "_names']");
        //             console.log(namesSelect);
        //
        //
        //             namesSelect.on('change', (e) => {
        //                 console.log(e);
        //             })
        //         }
        //
        //         if (typeof name !== 'undefined' && name) {
        //             editor.on('update', () => {
        //                 //$("[name='"+name+"']").val(JSON.stringify(editor.storeData()));
        //                 $("[name='" + name + "']").val(JSON.stringify({
        //                     html: Plugins.getModifiedGrapesHTML(editor.storeData().html),
        //                     css: editor.storeData().css,
        //                 }));
        //             });
        //
        //             if(reset){
        //                 editor.loadData({html: '<div class="editor-container container"></div>', css: '* { box-sizing: border-box; } body {margin: 0;}'});
        //                 $("[name='" + name + "']").val(JSON.stringify({html: '<div class="editor-container container"></div>', css: '* { box-sizing: border-box; } body {margin: 0;}'}));
        //             }
        //
        //             editor.on('load', () => {
        //                 if ($("[name='" + name + "']").val() !== '') {
        //                     try {
        //                         editor.loadData(JSON.parse($("[name='" + name + "']").val()));
        //                     } catch {
        //                         editor.loadData({html: '<div class="editor-container container"></div>'});
        //                     }
        //                 }else {
        //                     editor.loadData({html: '<div class="editor-container container"></div>'});
        //                 }
        //
        //                 $(editor.getEl()).find('iframe')[0].contentWindow.$('head').append("<style>.editor-container[data-gjs-type] { min-height: 100vh; padding-bottom: 30px; }</style>");
        //             });
        //
        //             if (typeof window[name + '_editor_addBlocks'] === 'function') {
        //                 window[name + '_editor_addBlocks'](editor);
        //             }
        //
        //             editor.Panels.addButton('options', [{
        //                 id: 'copy',
        //                 className: 'far fa-copy icon-blank',
        //                 command: (editor1, sender) => {
        //                     localStorage.setItem('grapesjs_copy', JSON.stringify({
        //                         html: Plugins.getModifiedGrapesHTML(editor1.storeData().html),
        //                         css: editor1.storeData().css,
        //                     }));
        //
        //                     alerts.alert(translations.COPY_TO_CLIPBOARD, 'info');
        //                 },
        //                 attributes: {title: translations.BLOCKEDITOR_CLIPBOARD_COPY}
        //             },
        //             ]);
        //
        //             editor.Panels.addButton('options', [{
        //                 id: 'paste',
        //                 className: 'fas fa-paste icon-blank',
        //                 command: function (editor1, sender) {
        //                     let data = localStorage.getItem('grapesjs_copy');
        //
        //                     if (!data) {
        //                         alerts.alert(translations.CLIPBOARD_IS_EMPTY, 'error');
        //                         return;
        //                     }
        //
        //                     let isConfirm = confirm(translations.BLOCKEDITOR_PASTE_CONFIRM);
        //
        //                     if (data && isConfirm) {
        //                         data = JSON.parse(data);
        //                         editor1.loadData(data);
        //                     }
        //                 },
        //                 attributes: {title: translations.BLOCKEDITOR_CLIPBOARD_PASTE}
        //             },
        //             ]);
        //
        //             editor.Panels.addButton('options', [{
        //                 id: 'file-manager',
        //                 className: 'fas fa-folder-open',
        //                 command: function (editor1, sender) {
        //                     let iframe = document.createElement('iframe');
        //                     iframe.setAttribute('width', '100%');
        //                     iframe.setAttribute('height', '500px');
        //                     iframe.setAttribute('id', name + '_filemanager');
        //                     iframe.setAttribute('class', '_blockeditor_filemanager');
        //                     iframe.setAttribute('src', basePath + '/jolanda/front/filemanager/dialog.php?type=0&lang=cs&akey=KxrAjXPO5DihmPY7aUtqwBCed8OcvfYw&basePath=' + basePath);
        //
        //                     let dialog = new Dialog();
        //                     dialog.show();
        //                     $('#dialog_'+dialog._uid).find('.modal-body').append(iframe);
        //                 },
        //             },
        //             ]);
        //
        //             editor.DomComponents.getWrapper().set({droppable: false, selectable: false, hoverable: false});
        //
        //             editor.DomComponents.addType('default', {
        //                 model: {
        //                     defaults: {
        //                         draggable: false, // lze je umistovat dovnitr jinych bloku?
        //                         removable: false, // muze byt odstranen?
        //                         droppable: false, // lze umistit dovnitr jiny blok?
        //                         selectable: false,
        //                         hoverable: false,
        //                     },
        //                 },
        //             });
        //
        //             editor.DomComponents.addType('drop-inside', {
        //                 //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
        //                 isComponent: el => typeof el.classList !== 'undefined' ? Object.values(el.classList).includes('drop-inside') : false,
        //                 model: {
        //                     defaults: {
        //                         draggable: false, // lze je umistovat dovnitr jinych bloku?
        //                         removable: false, // muze byt odstranen?
        //                         droppable: true, // lze umistit dovnitr jiny blok?
        //                         selectable: false,
        //                         hoverable: false,
        //                     },
        //                 },
        //             });
        //             editor.DomComponents.addType('editor-container', {
        //                 //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
        //                 isComponent: el => typeof el.classList !== 'undefined' ? Object.values(el.classList).includes('editor-container') : false,
        //                 model: {
        //                     defaults: {
        //                         draggable: false, // lze je umistovat dovnitr jinych bloku?
        //                         removable: false, // muze byt odstranen?
        //                         droppable: true, // lze umistit dovnitr jiny blok?
        //                         selectable: true,
        //                         hoverable: true,
        //                     },
        //                 },
        //             });
        //
        //             editor.DomComponents.addType('not-editable', {
        //                 //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
        //                 isComponent: el => typeof el.classList !== 'undefined' ? Object.values(el.classList).includes('not-editable') : false,
        //                 model: {
        //                     defaults: {
        //                         draggable: false, // lze je umistovat dovnitr jinych bloku?
        //                         removable: false, // muze byt odstranen?
        //                         droppable: false, // lze umistit dovnitr jiny blok?
        //                         selectable: false,
        //                         hoverable: false,
        //                     },
        //                 },
        //             });
        //
        //
        //             editor.on('run:core:open-layers', () => editor.Layers.setRoot('.editor-container'));
        //
        //             editor.on('asset:custom', props => {
        //                 $('._blockeditor_filemanager').each((i,e) => {
        //                     e.remove();
        //                 });
        //                 props.assets = [];
        //                 // The `props` will contain all the information you need in order to update your UI.
        //                 // props.open (boolean) - Indicates if the Asset Manager is open
        //                 // props.assets (Array<Asset>) - Array of all assets
        //                 // props.types (Array<String>) - Array of asset types requested, eg. ['image'],
        //                 // props.close (Function) - A callback to close the Asset Manager
        //                 // props.remove (Function<Asset>) - A callback to remove an asset
        //                 // props.select (Function<Asset, boolean>) - A callback to select an asset
        //                 // props.container (HTMLElement) - The element where you should append your UI
        //
        //                 // Here you would put the logic to render/update your UI.
        //                 if (props.open) {
        //                     let iframe = document.createElement('iframe');
        //                     iframe.setAttribute('width', '100%');
        //                     iframe.setAttribute('height', '500px');
        //                     iframe.setAttribute('id', name + '_filemanager');
        //                     iframe.setAttribute('class', '_blockeditor_filemanager');
        //                     iframe.setAttribute('src', basePath + '/jolanda/front/filemanager/dialog.php?type=1&lang=cs&akey=KxrAjXPO5DihmPY7aUtqwBCed8OcvfYw&basePath=' + basePath);
        //                     iframe.onload = function () {
        //                         iframe.contentWindow.apply_any = (e) => {
        //                             let asset = props.am.add(e);
        //                             props.select(asset);
        //                             props.close();
        //                         };
        //                     };
        //                     if(!$('#'+name+'_filemanager')[0])
        //                         $(props.container).append(iframe);
        //                 }
        //
        //             });
        //
        //             // pridani inline stylu pro link a zmenu barvy
        //             const rte = editor.RichTextEditor;
        //             rte.add('link', {
        //                 icon: '<i class="fa fa-chain"></i>',
        //                 attributes: {title: 'Link'},
        //                 // Example on it's easy to wrap a selected content
        //                 result: rte => rte.insertHTML(`<a href="#">${rte.selection()}</a>`)
        //             });
        //             rte.add('text-color', {
        //                 icon: `<select class="gjs-field">
        //                     <option>Bez barvy</option>
        //                     <option value="text-primary">Primární</option>
        //                     <option value="text-success">Pozitivní</option>
        //                     <option value="text-danger">Negativní</option>
        //                     <option value="text-warning">Varování</option>
        //                   </select>`,
        //                 // Bind the 'result' on 'change' listener
        //                 event: 'change',
        //                 result: (rte, action) => {
        //                     var value = action.btn.firstChild.value;
        //                     if (value != 'Bez barvy') { // value is a string
        //                         rte.insertHTML(`<span class="${value}">${rte.selection()}</span>`)
        //                     }else{
        //                         rte.insertHTML(`${rte.selection()}`)
        //                     }
        //                 },
        //             });
        //         }
        //     }
        // });
    }

    static getModifiedGrapesHTML(html){
        html = html.replace(/\<\/div\>\<div\>\<br\/\>\<\/div\>\<div( alignment\=\"text\-left\")?[a-zA-Z0-9"= ]*\>/g, '<br/><br/>');
        return html.replace(/\<\/div\>\<div\>\<br\/\>\<\/div\>/g, '<br/><br/></div>');
    }
}