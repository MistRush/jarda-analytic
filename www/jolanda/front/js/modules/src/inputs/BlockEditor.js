class BlockEditor extends Input {
    constructor(element, form = null) {
        super(element, form);
    }


    init(){
        super.init();

        this.name = this.$element.parent().attr('name');
        this.editor = null;
        this.dataInputName = this.$element.parent().attr('blockeditordata');
        this.dataInput = this.form.getInputObject(this.dataInputName);
        this.dynamic = this.$element.parent().attr('dynamic') ?? false;
        this.dynamicNamesSelect = this.form.getInputObject(this.name + '_names');


        this.initGrapes();
    }
    initGrapes(reinit = false, reset = false) {
        if (this.editor && !reinit)
            return;
        else{
            if(this.editor){
                this.editor.destroy();
                this.editor = null;
            }
        }

        this.editor = grapesjs.init({
            container: this.element,
            storageManager: {type: 'null'},
            fromElement: true,
            height: '600px',
            storeComponents: false,
            noticeOnUnload: false,

            canvas: {
                styles: [
                    "https://fonts.googleapis.com/css2?family=Nunito+Sans&display=swap",
                    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css",
                    basePath + "/front/css/libs.min.css",
                    basePath + "/front/css/style.min.css",
                    basePath + "/css/web/customicons.css"
                ],
                scripts: [
                    "https://code.jquery.com/jquery-3.3.1.slim.min.js",
                    "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js",
                ]
            },
            assetManager: {
                custom: true,
            },
            /*assetManager: {
                assets: [
                    'http://placehold.it/350x250/78c5d6/fff/image1.jpg',
                    // Pass an object with your properties
                    {
                        type: 'image',
                        src: 'http://placehold.it/350x250/459ba8/fff/image2.jpg',
                        height: 350,
                        width: 250,
                        name: 'displayName'
                    },
                    {
                        // As the 'image' is the base type of assets, omitting it will
                        // be set as `image` by default
                        src: 'http://placehold.it/350x250/79c267/fff/image3.jpg',
                        height: 350,
                        width: 250,
                        name: 'displayName'
                    },
                ],
            },*/
            customStyleManager: [{
                name: 'General',
                buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
                properties: [{
                    name: 'Alignment',
                    property: 'float',
                    type: 'radio',
                    defaults: 'none',
                    list: [
                        {value: 'none', className: 'fa fa-times'},
                        {value: 'left', className: 'fa fa-align-left'},
                        {value: 'right', className: 'fa fa-align-right'}
                    ],
                },
                    {property: 'position', type: 'select'}
                ],
            }, {
                name: 'Dimension',
                open: false,
                buildProps: ['width', 'flex-width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
                properties: [{
                    id: 'flex-width',
                    type: 'integer',
                    name: 'Width',
                    units: ['px', '%'],
                    property: 'flex-basis',
                    toRequire: 1,
                }, {
                    property: 'margin',
                    properties: [
                        {name: 'Top', property: 'margin-top'},
                        {name: 'Right', property: 'margin-right'},
                        {name: 'Bottom', property: 'margin-bottom'},
                        {name: 'Left', property: 'margin-left'}
                    ],
                }, {
                    property: 'padding',
                    properties: [
                        {name: 'Top', property: 'padding-top'},
                        {name: 'Right', property: 'padding-right'},
                        {name: 'Bottom', property: 'padding-bottom'},
                        {name: 'Left', property: 'padding-left'}
                    ],
                }],
            }, {
                name: 'Typography',
                open: false,
                buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'],
                properties: [
                    {name: 'Font', property: 'font-family'},
                    {name: 'Weight', property: 'font-weight'},
                    {name: 'Font color', property: 'color'},
                    {
                        property: 'text-align',
                        type: 'radio',
                        defaults: 'left',
                        list: [
                            {value: 'left', name: 'Left', className: 'fa fa-align-left'},
                            {value: 'center', name: 'Center', className: 'fa fa-align-center'},
                            {value: 'right', name: 'Right', className: 'fa fa-align-right'},
                            {value: 'justify', name: 'Justify', className: 'fa fa-align-justify'}
                        ],
                    }, {
                        property: 'text-decoration',
                        type: 'radio',
                        defaults: 'none',
                        list: [
                            {value: 'none', name: 'None', className: 'fa fa-times'},
                            {value: 'underline', name: 'underline', className: 'fa fa-underline'},
                            {value: 'line-through', name: 'Line-through', className: 'fa fa-strikethrough'}
                        ],
                    }, {
                        property: 'text-shadow',
                        properties: [
                            {name: 'X position', property: 'text-shadow-h'},
                            {name: 'Y position', property: 'text-shadow-v'},
                            {name: 'Blur', property: 'text-shadow-blur'},
                            {name: 'Color', property: 'text-shadow-color'}
                        ],
                    }],
            }, {
                name: 'Decorations',
                open: false,
                buildProps: ['opacity', 'border-radius', 'border', 'box-shadow', 'background-bg'],
                properties: [{
                    type: 'slider',
                    property: 'opacity',
                    defaults: 1,
                    step: 0.01,
                    max: 1,
                    min: 0,
                }, {
                    property: 'border-radius',
                    properties: [
                        {name: 'Top', property: 'border-top-left-radius'},
                        {name: 'Right', property: 'border-top-right-radius'},
                        {name: 'Bottom', property: 'border-bottom-left-radius'},
                        {name: 'Left', property: 'border-bottom-right-radius'}
                    ],
                }, {
                    property: 'box-shadow',
                    properties: [
                        {name: 'X position', property: 'box-shadow-h'},
                        {name: 'Y position', property: 'box-shadow-v'},
                        {name: 'Blur', property: 'box-shadow-blur'},
                        {name: 'Spread', property: 'box-shadow-spread'},
                        {name: 'Color', property: 'box-shadow-color'},
                        {name: 'Shadow type', property: 'box-shadow-type'}
                    ],
                }, {
                    id: 'background-bg',
                    property: 'background',
                    type: 'bg',
                },],
            }, {
                name: 'Extra',
                open: false,
                buildProps: ['transition', 'perspective', 'transform'],
                properties: [{
                    property: 'transition',
                    properties: [
                        {name: 'Property', property: 'transition-property'},
                        {name: 'Duration', property: 'transition-duration'},
                        {name: 'Easing', property: 'transition-timing-function'}
                    ],
                }, {
                    property: 'transform',
                    properties: [
                        {name: 'Rotate X', property: 'transform-rotate-x'},
                        {name: 'Rotate Y', property: 'transform-rotate-y'},
                        {name: 'Rotate Z', property: 'transform-rotate-z'},
                        {name: 'Scale X', property: 'transform-scale-x'},
                        {name: 'Scale Y', property: 'transform-scale-y'},
                        {name: 'Scale Z', property: 'transform-scale-z'}
                    ],
                }]
            }, {
                name: 'Flex',
                open: false,
                properties: [{
                    name: 'Flex Container',
                    property: 'display',
                    type: 'select',
                    defaults: 'block',
                    list: [
                        {value: 'block', name: 'Disable'},
                        {value: 'flex', name: 'Enable'}
                    ],
                }, {
                    name: 'Flex Parent',
                    property: 'label-parent-flex',
                    type: 'integer',
                }, {
                    name: 'Direction',
                    property: 'flex-direction',
                    type: 'radio',
                    defaults: 'row',
                    list: [{
                        value: 'row',
                        name: 'Row',
                        className: 'icons-flex icon-dir-row',
                        title: 'Row',
                    }, {
                        value: 'row-reverse',
                        name: 'Row reverse',
                        className: 'icons-flex icon-dir-row-rev',
                        title: 'Row reverse',
                    }, {
                        value: 'column',
                        name: 'Column',
                        title: 'Column',
                        className: 'icons-flex icon-dir-col',
                    }, {
                        value: 'column-reverse',
                        name: 'Column reverse',
                        title: 'Column reverse',
                        className: 'icons-flex icon-dir-col-rev',
                    }],
                }, {
                    name: 'Justify',
                    property: 'justify-content',
                    type: 'radio',
                    defaults: 'flex-start',
                    list: [{
                        value: 'flex-start',
                        className: 'icons-flex icon-just-start',
                        title: 'Start',
                    }, {
                        value: 'flex-end',
                        title: 'End',
                        className: 'icons-flex icon-just-end',
                    }, {
                        value: 'space-between',
                        title: 'Space between',
                        className: 'icons-flex icon-just-sp-bet',
                    }, {
                        value: 'space-around',
                        title: 'Space around',
                        className: 'icons-flex icon-just-sp-ar',
                    }, {
                        value: 'center',
                        title: 'Center',
                        className: 'icons-flex icon-just-sp-cent',
                    }],
                }, {
                    name: 'Align',
                    property: 'align-items',
                    type: 'radio',
                    defaults: 'center',
                    list: [{
                        value: 'flex-start',
                        title: 'Start',
                        className: 'icons-flex icon-al-start',
                    }, {
                        value: 'flex-end',
                        title: 'End',
                        className: 'icons-flex icon-al-end',
                    }, {
                        value: 'stretch',
                        title: 'Stretch',
                        className: 'icons-flex icon-al-str',
                    }, {
                        value: 'center',
                        title: 'Center',
                        className: 'icons-flex icon-al-center',
                    }],
                }, {
                    name: 'Flex Children',
                    property: 'label-parent-flex',
                    type: 'integer',
                }, {
                    name: 'Order',
                    property: 'order',
                    type: 'integer',
                    defaults: 0,
                    min: 0
                }, {
                    name: 'Flex',
                    property: 'flex',
                    type: 'composite',
                    properties: [{
                        name: 'Grow',
                        property: 'flex-grow',
                        type: 'integer',
                        defaults: 0,
                        min: 0
                    }, {
                        name: 'Shrink',
                        property: 'flex-shrink',
                        type: 'integer',
                        defaults: 0,
                        min: 0
                    }, {
                        name: 'Basis',
                        property: 'flex-basis',
                        type: 'integer',
                        units: ['px', '%', ''],
                        unit: '',
                        defaults: 'auto',
                    }],
                }, {
                    name: 'Align',
                    property: 'align-self',
                    type: 'radio',
                    defaults: 'auto',
                    list: [{
                        value: 'auto',
                        name: 'Auto',
                    }, {
                        value: 'flex-start',
                        title: 'Start',
                        className: 'icons-flex icon-al-start',
                    }, {
                        value: 'flex-end',
                        title: 'End',
                        className: 'icons-flex icon-al-end',
                    }, {
                        value: 'stretch',
                        title: 'Stretch',
                        className: 'icons-flex icon-al-str',
                    }, {
                        value: 'center',
                        title: 'Center',
                        className: 'icons-flex icon-al-center',
                    }],
                }]
            }
            ],
        });

        if ($(this.editor.getEl()).parent().hasClass('block-editor')) {
            if (this.dynamic) {
                this.dynamicNamesSelect.$element.on('change', (e) => {
                    let val = $(e.currentTarget).val();
                    this.dataInputName = val;
                    this.dataInput = this.form.getInputObject(val);
                    this.$element.parent().attr('blockeditordata', val);
                    this.loadDataFromDataInput();
                });
            }

            if (typeof this.dataInputName !== 'undefined' && this.dataInputName) {
                this.editor.on('update', () => {
                    this.dataInput.setValue(JSON.stringify({
                        html: BlockEditor.getModifiedGrapesHTML(this.editor.storeData().html),
                        css: this.editor.storeData().css,
                    }));
                });

                if (reset) {
                    this.editor.loadData({
                        html: '<div class="editor-container container"></div>',
                        css: '* { box-sizing: border-box; } body {margin: 0;}'
                    });
                    this.dataInput.setValue(JSON.stringify({
                        html: '<div class="editor-container container"></div>',
                        css: '* { box-sizing: border-box; } body {margin: 0;}'
                    }));
                }

                this.editor.on('load', () => {
                    if (this.dataInput.getValue() !== '') {
                        this.loadDataFromDataInput();
                    } else {
                        this.editor.loadData({html: '<div class="editor-container container"></div>'});
                    }

                    $(this.editor.getEl()).find('iframe')[0].contentWindow.$('head').append("<style>.editor-container[data-gjs-type] { min-height: 100vh; padding-bottom: 30px; }</style>");
                });

                if (typeof window[this.name + '_addBlocks'] === 'function') {
                    window[this.name + '_addBlocks'](this.editor);
                }

                this.editor.Panels.addButton('options', [{
                    id: 'copy',
                    className: 'far fa-copy icon-blank',
                    command: (editor1, sender) => {
                        localStorage.setItem('grapesjs_copy', JSON.stringify({
                            html: BlockEditor.getModifiedGrapesHTML(editor1.storeData().html),
                            css: editor1.storeData().css,
                        }));

                        alerts.alert(translations.COPY_TO_CLIPBOARD, 'info');
                    },
                    attributes: {title: translations.BLOCKEDITOR_CLIPBOARD_COPY}
                },
                ]);

                this.editor.Panels.addButton('options', [{
                    id: 'paste',
                    className: 'fas fa-paste icon-blank',
                    command: function (editor1, sender) {
                        let data = localStorage.getItem('grapesjs_copy');

                        if (!data) {
                            alerts.alert(translations.CLIPBOARD_IS_EMPTY, 'error');
                            return;
                        }

                        let isConfirm = confirm(translations.BLOCKEDITOR_PASTE_CONFIRM);

                        if (data && isConfirm) {
                            data = JSON.parse(data);
                            editor1.loadData(data);
                        }
                    },
                    attributes: {title: translations.BLOCKEDITOR_CLIPBOARD_PASTE}
                },
                ]);

                this.editor.Panels.addButton('options', [{
                    id: 'file-manager',
                    className: 'fas fa-folder-open',
                    command: function (editor1, sender) {
                        let iframe = document.createElement('iframe');
                        iframe.setAttribute('width', '100%');
                        iframe.setAttribute('height', '500px');
                        iframe.setAttribute('id', this.name + '_filemanager');
                        iframe.setAttribute('class', '_blockeditor_filemanager');
                        iframe.setAttribute('src', basePath + '/admin/file-manager/dialog.php?type=0&lang=cs&akey=KxrAjXPO5DihmPY7aUtqwBCed8OcvfYw&basePath=' + basePath + '/files/');

                        let dialog = new Dialog();
                        dialog.show();
                        $('#dialog_' + dialog._uid).find('.modal-body').append(iframe);
                    },
                },
                ]);

                this.editor.DomComponents.getWrapper().set({droppable: false, selectable: false, hoverable: false});

                this.editor.DomComponents.addType('default', {
                    model: {
                        defaults: {
                            draggable: false, // lze je umistovat dovnitr jinych bloku?
                            removable: false, // muze byt odstranen?
                            droppable: false, // lze umistit dovnitr jiny blok?
                            selectable: false,
                            hoverable: false,
                        },
                    },
                });

                this.editor.DomComponents.addType('drop-inside', {
                    //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
                    isComponent: el => typeof el.classList !== 'undefined' ? Object.values(el.classList).includes('drop-inside') : false,
                    model: {
                        defaults: {
                            draggable: false, // lze je umistovat dovnitr jinych bloku?
                            removable: false, // muze byt odstranen?
                            droppable: true, // lze umistit dovnitr jiny blok?
                            selectable: false,
                            hoverable: false,
                        },
                    },
                });
                this.editor.DomComponents.addType('editor-container', {
                    //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
                    isComponent: el => typeof el.classList !== 'undefined' ? Object.values(el.classList).includes('editor-container') : false,
                    model: {
                        defaults: {
                            draggable: false, // lze je umistovat dovnitr jinych bloku?
                            removable: false, // muze byt odstranen?
                            droppable: true, // lze umistit dovnitr jiny blok?
                            selectable: true,
                            hoverable: true,
                        },
                    },
                });

                this.editor.DomComponents.addType('not-editable', {
                    //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
                    isComponent: el => typeof el.classList !== 'undefined' ? Object.values(el.classList).includes('not-editable') : false,
                    model: {
                        defaults: {
                            draggable: false, // lze je umistovat dovnitr jinych bloku?
                            removable: false, // muze byt odstranen?
                            droppable: false, // lze umistit dovnitr jiny blok?
                            selectable: false,
                            hoverable: false,
                            highlightable: false,
                        },
                    },
                });


                this.editor.on('run:core:open-layers', () => this.editor.Layers.setRoot('.editor-container'));

                this.editor.on('asset:custom', props => {
                    $('._blockeditor_filemanager').each((i, e) => {
                        e.remove();
                    });
                    props.assets = [];
                    // The `props` will contain all the information you need in order to update your UI.
                    // props.open (boolean) - Indicates if the Asset Manager is open
                    // props.assets (Array<Asset>) - Array of all assets
                    // props.types (Array<String>) - Array of asset types requested, eg. ['image'],
                    // props.close (Function) - A callback to close the Asset Manager
                    // props.remove (Function<Asset>) - A callback to remove an asset
                    // props.select (Function<Asset, boolean>) - A callback to select an asset
                    // props.container (HTMLElement) - The element where you should append your UI

                    // Here you would put the logic to render/update your UI.
                    if (props.open) {
                        let iframe = document.createElement('iframe');
                        iframe.setAttribute('width', '100%');
                        iframe.setAttribute('height', '500px');
                        iframe.setAttribute('id', this.name + '_filemanager');
                        iframe.setAttribute('class', '_blockeditor_filemanager');
                        iframe.setAttribute('src', basePath + '/admin/file-manager/dialog.php?type=1&lang=cs&akey=KxrAjXPO5DihmPY7aUtqwBCed8OcvfYw&basePath=' + basePath + '/files/');
                        iframe.onload = function () {
                            iframe.contentWindow.apply_any = (e) => {
                                console.log(e);
                                let asset = props.am.add(e);
                                props.select(asset);
                                props.close();
                            };
                        };
                        if (!$('#' + this.name + '_filemanager')[0])
                            $(props.container).append(iframe);
                    }

                });

                // pridani inline stylu pro link a zmenu barvy
                const rte = this.editor.RichTextEditor;
                rte.add('link', {
                    icon: '<i class="fa fa-chain"></i>',
                    attributes: {title: 'Link'},
                    // Example on it's easy to wrap a selected content
                    result: rte => rte.insertHTML(`<a href="#">${rte.selection()}</a>`)
                });
                rte.add('text-color', {
                    icon: `<select class="gjs-field">
                            <option>Bez barvy</option>
                            <option value="text-primary">Primární</option>
                            <option value="text-success">Pozitivní</option>
                            <option value="text-danger">Negativní</option>
                            <option value="text-warning">Varování</option>
                          </select>`,
                    // Bind the 'result' on 'change' listener
                    event: 'change',
                    result: (rte, action) => {
                        var value = action.btn.firstChild.value;
                        if (value != 'Bez barvy') { // value is a string
                            rte.insertHTML(`<span class="${value}">${rte.selection()}</span>`)
                        } else {
                            rte.insertHTML(`${rte.selection()}`)
                        }
                    },
                });
            }
        }

        this.initCodeEditor();
    }

    static codeEditorDialog = null;

    initCodeEditor() {

        this.editor.on('load', () => {
            const body = this.editor.Canvas.getDocument().body;
            body.style.overflow = 'auto';
        });

        this.editor.on('load', () => {
            this.editor.Panels.addButton('options', {
                id: 'edit-code',
                className: 'fa fa-code',
                command: 'open-code-editor',
                attributes: { title: 'Edit Source Code' }
            });

            this.editor.Commands.add('open-code-editor', {
                run(editor) {
                    const html = BlockEditor.formatHTML(editor.getHtml());
                    const css = BlockEditor.formatCSS(editor.getCss());

                    BlockEditor.codeEditorDialog = new Dialog();
                    BlockEditor.codeEditorDialog.title = 'Source Code Editor';
                    BlockEditor.codeEditorDialog.content = `
				<style>
				</style>
				<div class="row">
					<div class="col-md-7"><textarea id="block-editor-code-editor-html" style="width:100%;" rows="15">${ html}</textarea></div>
					<div class="col-md-5"><textarea id="block-editor-code-editor-css" style="width:100%;" rows="15">${ css}</textarea></div>
				</div>
				`;
                    BlockEditor.codeEditorDialog.enableConfirmButton('BlockEditor.saveEditorCode()');
                    BlockEditor.codeEditorDialog.enableCancelButton();
                    BlockEditor.codeEditorDialog.blockEditor = editor;
                    BlockEditor.codeEditorDialog.show();
                }
            });
        });
    }

    static saveEditorCode () {
        const updatedHtml = document.getElementById('block-editor-code-editor-html').value;
        const updatedCss = document.getElementById('block-editor-code-editor-css').value;

        if (updatedHtml && updatedCss) {
            BlockEditor.codeEditorDialog.close();
            BlockEditor.codeEditorDialog.blockEditor.loadData({ html: updatedHtml, css: updatedCss });
            BlockEditor.codeEditorDialog = null;
        }
    }

    static formatCSS(css) {
        const rules = css
            .split(/(?<=})/)
            .map(rule => rule.trim())
            .filter(rule => rule);

        return rules
            .map(rule => {
                const [selector, properties] = rule.split(/{/);
                if (!properties) return '';

                const formattedProperties = properties
                    .replace(/}/g, '')
                    .split(';')
                    .map(property => property.trim())
                    .filter(property => property)
                    .map(property => `    ${property};`)
                    .join('\n');

                return `${selector.trim()} {\n${formattedProperties}\n}`;
            })
            .join('\n\n');
    }

    static formatHTML(html) {
        const indentChar = '  '; // Dvě mezery pro odsazení
        let indentLevel = 0;

        return html
            .replace(/>\s+</g, '><') // Odstranit mezery mezi tagy
            .split(/(<[^>]+>)/g) // Rozdělit podle HTML tagů
            .filter(part => part.trim()) // Odstranit prázdné části
            .map(part => {
                if (part.match(/^<\/\w/)) {
                    // Uzavírací tag snižuje odsazení
                    indentLevel = Math.max(indentLevel - 1, 0); // Zabránit záporným hodnotám
                }

                const formattedPart = `${indentChar.repeat(indentLevel)}${part}`;

                if (part.match(/^<\w[^>]*[^\/]>$/)) {
                    // Otevírací tag zvyšuje odsazení, pokud není self-closing
                    indentLevel++;
                }

                return formattedPart;
            })
            .join('\n'); // Spojit do čitelného formátu
    }

    loadDataFromDataInput(){
        try {
            this.editor.loadData(JSON.parse(this.dataInput.getValue()));
        } catch {
            this.editor.loadData({html: '<div class="editor-container container"></div>'});
        }
    }

    static getModifiedGrapesHTML(html){
        html = html.replace(/\<\/div\>\<div\>\<br\/\>\<\/div\>\<div( alignment\=\"text\-left\")?[a-zA-Z0-9"= ]*\>/g, '<br/><br/>');
        return html.replace(/\<\/div\>\<div\>\<br\/\>\<\/div\>/g, '<br/><br/></div>');
    }
}