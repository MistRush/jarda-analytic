let getDataAttr = (element, attr, def = '') => {
    let data = element.getAttribute('data-' + attr);
    if (data === undefined || data === null)
        return def;
    else
        try {
            return JSON.parse(data);
        } catch (e) {
            return data
        }
};

class Grid {
    static COLUMN_ID = 1;
    static COLUMN_TEXT = 2;
    static COLUMN_NUMBER = 4;
    static COLUMN_CURRENCY = 8;
    static COLUMN_BOOL = 16;
    static COLUMN_DATE = 32;
    static COLUMN_TIME = 64;
    static COLUMN_DATETIME = 65;
    static COLUMN_TIMESTAMP = 66;
    static COLUMN_ENUM = 128;
    static COLUMN_ENTITY = 256;
    static COLUMN_CHECKBOX = 1040;
    static COLUMN_COUNTER = 32768;
    static COLUMN_CURRENCY_EUR = 131072;
    static COLUMN_CURRENCY_CZK = 262144;
    static COLUMN_CURRENCY_USD = 524288;
    static COLUMN_CURRENCY_GBP = 1048576;
    static COLUMN_CURRENCY_PLN = 2097152;
    static COLUMN_LONGTEXT = 4194304;

    static keypressEventInit = false;
    static lastUsedGrid = null;

    /**
     * Grid constructor
     * @param {string} element_id ID elementu s Gridem
     */
    constructor(element_id) {
        this.initialized = false;
        this.element = document.getElementById(element_id);
        this.id = element_id;
        this.filters = {};
        this.panel = null;
        this.name = getDataAttr(this.element, 'name');
        this.relations = getDataAttr(this.element, 'parent');
        this.parentGrids = [];
        this.parentElement = null;
        this.childGrids = [];
        this.urlParameters = {};
        this.currentRow = null;
        this.cancelAjax = false;
        this.grid = null;
        this.columnIndexes = [];
        this.refreshing = false;
        this.recentItemIndex = null;
        this.selectedRows = [];
        this.filterRefreshnig = false;
        this.range = {
            'from': 0,
            'to': 0,
            'scroll': 0,
            'total': 0,
            'totalPrev':0,
            'direction': 'down',
            'position': 1,
        };
        this.filterForm = new Form(element_id + '_filterform');
        this.stateRestore = new StateRestore(this);
        this.quickeditor = getDataAttr(this.element, 'quickeditor');
        this.switchesForm = window[element_id + '_switches'];
        this.onBeforeShowCreateEditor = null;
        this.params = {
            'urls': {
                'datalistUrl': getDataAttr(this.element, 'datalisturl'),
                'editAction': getDataAttr(this.element, 'editaction'),
                'inlineEditAction': getDataAttr(this.element, 'inlineeditaction'),
                'quickeditAction': getDataAttr(this.element, 'quickeditaction'),
                'deleteUrl': getDataAttr(this.element, 'deleteurl'),
                'updateUrl': getDataAttr(this.element, 'updateurl'),
            },
            'actions': {
                'add': getDataAttr(this.element, 'actions').includes('add'),
                'edit': getDataAttr(this.element, 'actions').includes('edit'),
                'remove': getDataAttr(this.element, 'actions').includes('remove'),
            },
            'select': getDataAttr(this.element, 'select'),
            'multipleType': getDataAttr(this.element, 'multipleType'),
            'reorder': getDataAttr(this.element, 'reorder'),
            'rowformatter': getDataAttr(this.element, 'rowformatter'),
            'relationswitcher': getDataAttr(this.element, 'relationswitcher'),
            'rowbuttons': getDataAttr(this.element, 'rowbuttons'),
            'height': getDataAttr(this.element, 'height'),
            'order': getDataAttr(this.element, 'orders'),
            'preview': getDataAttr(this.element, 'preview'),
            'editorCaching': getDataAttr(this.element, 'cacheEditor'),
            'displayBuffer': getDataAttr(this.element, 'displayBuffer'),
            'infiniteScroll': getDataAttr(this.element, 'infiniteScroll'),
            'dataSaveType': getDataAttr(this.element, 'dataSaveType'),
            'dataSaveParams': getDataAttr(this.element, 'dataSaveParams'),
            'quickeditMaxWidth': getDataAttr(this.element, 'quickeditmaxwidth'),
            'oneMustBeSelected': getDataAttr(this.element, 'oneMustBeSelected'),
            'ajax': getDataAttr(this.element, 'isAjax') == 1 ? true : false,
            'data': getDataAttr(this.element, 'data'),
            'title': getDataAttr(this.element, 'title'),
            'columnReorder': getDataAttr(this.element, 'columnReorder'),
            'customRowReorder': getDataAttr(this.element, 'customRowReorder'),
            'presetSaveType': getDataAttr(this.element, 'presetSaveType'),
            'presetServersideUrl': getDataAttr(this.element, 'presetServersideUrl'),
            'useFiltersBar': getDataAttr(this.element, 'useFiltersBar'),
            'switchesFormToEditor': getDataAttr(this.element, 'switchesFormToEditor'),
        };

        this.params.order.reordered = false;

        this.onAfterInit = null;
        this._onAfterInit = null;

        this.baseOptions = this.getBaseOptions();

        this.onBeforeRefresh = null;
        this.onAfterRefresh = null;
        this.onSelect = null;
        this.onUnSelect = null;
        this.onCurrentItemUnSelect = null;
        this.onAfterInlineChange = null;
        this.onDblClick = null;

        this.panel = null;
        this.columnsWidth = [];
        this.modifySortData = null;

        this.createDefaultValues = {};
        this._xhr = null;
        this.switchesFormTimeout = null;

        this.editorIsOpen = false;

        $(() => {
            setTimeout(() => this.init(), 20);

            this.relations.forEach((relation) => {
                let found = false;

                this.parentGrids.forEach((parentGrid) => {
                    if(parentGrid.id === window[relation.grid].id) {
                        found = true;
                    }
                });

                if(!found)
                    this.parentGrids.push(window[relation.grid]);
            });

            this.parentGrids.forEach((parentGrid) => {
                parentGrid.setChild(this);
            });
        })


        if (this.params.relationswitcher && this.params.select === 'single') {
            this.relationswitcher = new RelationSwitcher(this.params.relationswitcher, $('#' + this.id + '-rs'));
            $('#' + this.id + '-rs').css('height', this.params.height);
        }
    }

    /**
     * Re/Inicializace gridu
     */
    init() {
        if (this.initialized) {
            $(this.element).DataTable().clear();
            $(this.element).DataTable().destroy();
        }
        this.grid = $(this.element).DataTable(this.baseOptions);
        this.bindEvents();
        //this.loadSettings();
        $(() => {
            let params = Helpers.getQueryParams(window.location.search);
            let hasFilter = false;
            this.getColumnList(true).forEach((item) => {
                let value = params[item.mData];
                if (value !== undefined && value !== '') {
                    if (value.includes(','))
                        value = value.split(',');
                    this.filterForm.setValue(item.mData, value);
                    hasFilter = true;
                }
            });
            if (hasFilter)
                $(this.filterForm.getForm()).trigger('change');
            if (this.switchesForm !== undefined) {
                let vals = this.switchesForm.serializeArrayEntity();
                for (let k in vals) {
                    if (typeof vals[k] === 'boolean')
                        vals[k] = vals[k] ? 1 : 0;
                    this.setUrlParameter(k, vals[k]);
                }
            }
        });

        $("#" + this.id + '-search-type').change();

        if(this.params.reorder !== ''){
            $(this.element).addClass('reorderable');
        }

        let $search = $("#" + this.id + '-search input');

        if ($search.length > 0 && $search.val().length > 0) {
            if (!this.urlParameters.searchAs || this.urlParameters.searchAs !== $search.val()) {
                $search.trigger('keyup');
            }
        }

        if(!this.params.columnReorder){
            this.grid.colReorder.disable();
        }

        this.stateRestore.initServersideStates();

        if(this.params.useFiltersBar){
            this.filters = JSON.parse(localStorage.getItem('DataTablesFilters_' + 'USR' + userID + '_'+ this.id +'_' + window.location.pathname));
            if(this.filters){
                this.filterRefreshnig = true;
                Object.keys(this.filters).forEach((key, index) => {
                    if(this.filterForm.getInput(key + '__filter').length <= 0)
                        return;

                    if(this.filterForm.getInput(key + '__filter').prop('type') === 'number' && this.filterForm.getInput(key + '__filter').data('currency') == 1){
                        this.filterForm.setValue(key + '__filter', this.filters[key]/100);
                        return
                    }

                    this.filterForm.setValue(key + '__filter', this.filters[key]);
                });
                this.filterRefreshnig = false;
                if(Object.keys(this.filters).length > 0)
                    $(this.filterForm.form).trigger('change');
            }else{
                this.filters = {};
            }
        }


        if(typeof this._onAfterInit === 'function') {
            this._onAfterInit();
        }

        if(typeof this.onAfterInit === 'function'){
            this.onAfterInit();
        }
    }

    /**
     * Bindování eventů
     */
    bindEvents() {
        $("#" + this.id).on("contextmenu", "tr", (e) => {
            e.preventDefault();
            this.grid.rows(e.currentTarget).select();
            let $menu = $('#' + this.id + '-context');
            let offset = $menu.parent().offset();
            $menu.css("left", e.pageX - offset.left);
            $menu.css("top", e.pageY - offset.top);
            $menu.fadeIn(200, () => {
                $(document).on("click", function () {
                    $(".dataTable-context").hide();
                    // $(document).off("click");
                })
            });
        });

        $(this.filterForm.getForm()).on('change', (e) => {
            this.renderFiltersBar();
        });

        $(document).on("click","#"+this.id+"_active_filters .filter .close-btn",(e) => {
            let $input = this.filterForm.getInput($(e.currentTarget).parent().data('name'));

            if($input.prop('type') === 'radio'){
                this.filterForm.setValue($(e.currentTarget).parent().data('name'), '');
            }else{
                this.filterForm.setValue($(e.currentTarget).parent().data('name'), null);
            }

            $input.trigger('change');

            if($input.hasClass('datepicker') || $input.hasClass('datetimepicker'))
                this.renderFiltersBar();


        });

        $(document).on("click","#"+this.id+"_active_filters .reset",(e) => {
            this.resetFilter();
        });

        $('#' + this.id + '_filterdialog').on('hide.bs.modal', () => {
            // $(this.filterForm.getForm()).trigger('change');
        })

        $("#" + this.id).on('dblclick', "tr", (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.params.actions.edit && this.params.urls.editAction !== undefined && (this.params.select === 'single' || this.params.select === 'multi_checkbox')) {
                this.grid.rows(e.currentTarget).select();
                this.edit();
            } else if (typeof this.onDblClick === "function") {
                this.grid.rows(e.currentTarget).select();
                this.onDblClick(e);
            }
        });

        if (this.switchesForm !== undefined) {
            $(this.switchesForm.form).on('change', (e) => {
                if(this.switchesFormTimeout !== null){
                    clearTimeout(this.switchesFormTimeout);
                }

                this.switchesFormTimeout = setTimeout(() => {this.refresh(true)}, 250);
            });

            $(this.switchesForm.form).on('submit', (e) => {
                e.preventDefault();
            });
        }

        $("#" + this.id).on('click', "td.editable", (e) => {
            let isDragging = false;
            $("#" + this.id).on('mousedown', "td.editable", (e) => {
                $(window).mousemove(function() {
                    isDragging = true;
                    $(window).unbind("mousemove");
                });
            });
            $("#" + this.id).on('mouseup', "td.editable", (e) => {
                if($(e.currentTarget).hasClass('editing'))
                    return;

                let wasDragging = isDragging;
                isDragging = false;
                $(window).unbind("mousemove");
                if (!wasDragging) {
                    let value = this.grid.cell(e.currentTarget).data();
                    let column = this.getColumnList()[this.grid.cell(e.currentTarget).index().column];
                    let row = this.grid.row(this.grid.cell(e.currentTarget).index().row)
                    this.createInlineEdit(e.currentTarget, column, row, value);
                }
            });
        });

        this.grid.on('order.dt', () => {
            //this.params.order.reordered = true;
        });

        if(!Grid.keypressEventInit){
            $(document).keydown((event) => {
                if(event.keyCode == 46) {
                    if(typeof Grid.lastUsedGrid !== 'undefined' && Grid.lastUsedGrid !== null){
                        if(!Grid.lastUsedGrid.params.actions.remove)
                            return;

                        if($(event.target).prop('tagName') === 'INPUT')
                            return;

                        if($("#" + this.id).closest('.dataTable-package')[0].offsetParent === null)
                            return;

                        if(Dialog.getOpenDialogs().length > 0)
                            return;

                        Grid.lastUsedGrid.remove();
                    }
                }
            });

            Grid.keypressEventInit = true;
        }

        $("#" + this.id).closest('.dataTable-package').on('click', (e) => {
            Grid.lastUsedGrid = this;
        });


        $("#" + this.id).on('click', "tr", (e) => {
            if (this.params.select === 'multi_checkbox') {
                if (!$(e.target).hasClass('select-checkbox') && !e.ctrlKey && !e.shiftKey) {
                    this.grid.rows().deselect();
                    // this.grid.row(e.currentTarget).select();
                }else if(e.shiftKey && !$(e.target).closest('tr').hasClass('selected')){
                    let currentRow = this.grid.row($($(e.target).closest('tr')[0]))[0][0];
                    if(currentRow < this.grid.rows('.selected')[0][0]){
                        let lastSelectedRow = this.grid.rows('.selected')[0][0];

                        for(let i = currentRow+1; i < lastSelectedRow; i++){
                            this.grid.row(i).select();
                        }
                    }else if(currentRow > this.grid.rows('.selected')[0][this.grid.rows('.selected')[0].length-1]){
                        let lastSelectedRow = this.grid.rows('.selected')[0][this.grid.rows('.selected')[0].length-1];

                        for(let i = currentRow-1; i > lastSelectedRow; i--){
                            this.grid.row(i).select();
                        }
                    }
                }
            }
            if ($(e.target).closest('tr').hasClass('selected')) {
                if (typeof this.onCurrentItemUnSelect === 'function')
                    this.onCurrentItemUnSelect(e);

                if (this.relationswitcher !== undefined) {
                    this.relationswitcher.setParent(null);
                }

                if(typeof this.onUnSelect !== 'function') {
                    this.onUnSelect = ((e, indexes) => {
                        this.onCurrentItemChanged();
                        this.onUnSelect = null;
                    });
                }
            }
            if (typeof e.target.onclick === 'function') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            if(e.altKey){
                Helpers.copyToClipboard($(e.target).text())
                alerts.alert(translations.COPY_TO_CLIPBOARD, 'info');
            }
        });

        $("#" + this.id + '-search input').keyup(
            Helpers.delay((e) => {
                let val = e.target.value;
                if (val.length > 0)
                    $(e.target).siblings('span').show();
                else
                    $(e.target).siblings('span').hide();
                if (e.target.name.includes(',')) {
                    this.setUrlParameter('gridSearch', JSON.stringify([e.target.name, val]));
                } else
                    this.setUrlParameter(e.target.name, val);

                this.setUrlParameter('start', 0);
                this.refresh(true);
            }, this, 400)
        );

        $("#" + this.id + '-search-type').on('change', (e) => {
            this.setUrlParameter('SearchBy', $(e.currentTarget).val());
            $("#" + this.id + '-search input').attr('name', $(e.currentTarget).val());

            if($("#" + this.id + '-search-type option:selected').text() !== '')
                $("#" + this.id + '-search i').html('<span class="searchTypePrefix">' + $("#" + this.id + '-search-type option:selected').text() + ':</span>');
            else{
                $("#" + this.id + '-search i').html('<span class="searchTypePrefix">' + $("#" + this.id + '-search-type option:selected').text() + '</span>');
            }
            $("#" + this.id + '-search input').css('padding-left', 21 + $("#" + this.id + '-search i').width() + 'px');
            if($("#" + this.id + '-search input').val() !== '') {
                $("#" + this.id + '-search input').trigger('keyup');
            }
        });



        this.grid.on('select', (e, dt, type, indexes) => {
            if (e.namespace === 'dt' && typeof this.onSelect === 'function')
                this.onSelect(e, indexes);
            if (this.relationswitcher !== undefined) {
                this.relationswitcher.setParent(this.getCurrentItem()['ID']);
            }

            if(this.params.select !== 'single') {
                this.getCurrentItem().forEach((row, index) => {
                    let obj = this.selectedRows.find(o => o.ID === row.ID);

                    if (typeof obj === 'undefined') {
                        this.selectedRows.push(row);
                    }
                });
                this.updateMultiselectAllCount(this.selectedRows.length);
            }

            if(this.params.multipleType !== 'all' && this.params.select !== 'single'){
                this.updateMultiselectAllCount(this.getSelectedCount());
            }

            this.onCurrentItemChanged(indexes);
        });

        this.grid.on('deselect', (e, dt, type, indexes) => {
            if (e.namespace === 'dt' && typeof this.onUnSelect === 'function')
                this.onUnSelect(e, indexes);

            if(this.params.select !== 'single') {
                if (this.getCurrentItem()) {
                    this.selectedRows.forEach((row, index) => {
                        let obj = this.getCurrentItem().find(o => o.ID === row.ID);

                        if (typeof obj === 'undefined' && typeof this.grid.rows().data().toArray().find(o => o.ID === row.ID) !== 'undefined') {
                            this.selectedRows = this.selectedRows.filter(a => a.ID != row.ID);
                        }
                    });
                    this.updateMultiselectAllCount(this.selectedRows.length);
                } else {
                    this.selectedRows.forEach((row, index) => {
                        if (typeof this.grid.rows().data().toArray().find(o => o.ID === row.ID) !== 'undefined') {
                            this.selectedRows = this.selectedRows.filter(a => a.ID != row.ID);
                        }
                    });
                    this.updateMultiselectAllCount(this.selectedRows.length);
                }
            }

            if(this.params.multipleType !== 'all' && this.params.select !== 'single'){
                this.updateMultiselectAllCount(this.getSelectedCount());
            }
        });

        this.grid.on('row-reorder', (e, diff, object) => {
            let data = [];
            if(this.params.customRowReorder){
                let newPosition;
                for (let i = 0, ien = diff.length; i < ien; i++) {
                    let rowData = this.grid.row(diff[i].node).data();
                    if(rowData.ID === object.triggerRow.data().ID){
                        newPosition = diff[i].newPosition;
                    }
                }

                let obj = {};
                obj.ID =  object.triggerRow.data().ID;
                obj[this.params.reorder] = newPosition;
                data.push(obj)
            }else{
                for (let i = 0, ien = diff.length; i < ien; i++) {
                    let rowData = this.grid.row(diff[i].node).data();
                    let obj = {};
                    obj.ID = rowData['ID'];
                    obj[this.params.reorder] = diff[i].newPosition;
                    data.push(obj)
                }
            }



            let queue = [];
            data.forEach((row) => {
                queue.push(Helpers.ajax({
                    url: this.params.urls.updateUrl,
                    data: {
                        data: JSON.stringify(row)
                    },
                    success: function () {

                    }
                }));
            });
            let defer = $.when.apply($, queue);
            defer.done(() => {
                this.refresh();
                alerts.alert('Ok', 'success', '');
            });
        });

        this.grid.on('column-reorder', () => {
            // if (this.initialized)
            //     this.saveSettings();
        });

        this.grid.on('column-visibility.dt', (e) => {
            // if (this.initialized)
            //     this.saveSettings()
        });

        this.grid.on('xhr.dt', (e) => {
            if(this.params.infiniteScroll){
                this.range.position = this.grid.scroller.page().start;
                this.grid.on('draw',() => {
                    if(this.refreshing) {
                        this.grid.scroller.toPosition(this.range.position, false);
                        //this.cancelAjax = true;
                    }
                    //$(this.element).parent().scrollTop(this.range.scroll);
                    //this.grid.row(this.range.position).scrollTo(false);

                });
            }

        });

        $("#" + this.id).on('mouseover', "td .text", (e) => {
            let $target = $(e.currentTarget);
            let $td = $target.closest('td');
            if ($target.width() > ($td.width() + 10)) {
                var $div = $('<div />');
                $div.addClass("overflowHover");
                $div.text($target.data('text') ?? $target.text());
                $div.appendTo('body');
                $div.css('left', $target.offset().left + ($td.width() / 2));
                $div.css('top', $target.offset().top + ($td.height() / 2));
                $div.css('max-width', $td.width() * 2);
                $div.show();
            }
        });

        $("#" + this.id).on('mouseout', "td .text", (e) => {
            let $target = $(e.currentTarget);
            let $hover = $('.overflowHover');
            if ($hover.length > 0) {
                $hover.remove();
            }
        });

        if(this.params.urls.editAction) {
            $(document).on('mousedown', '.' + this.id + '_edit_button', (e) => {
                if (e.which === 2) {
                    if (this.getSelectedCount() > 1) {
                        alerts.alert(translations.SELECT_ONLY_ONE);
                        return;
                    } else if (this.getSelectedCount() === 0) {
                        alerts.alert(translations.SELECT_ROW, 'info', translations.SELECT_ROW_TEXT);
                        return;
                    }
                    if(this.params.urls.editAction.includes('?')){
                        window.open(this.params.urls.editAction + '&entity_ID=' + this.getCurrentItemValue('ID'), '_blank').focus();
                    }else{
                        window.open(this.params.urls.editAction + '?entity_ID=' + this.getCurrentItemValue('ID'), '_blank').focus();
                    }

                }
            });
        }
    }

    renderFiltersBar(){
        if(this.filterRefreshnig)
            return;

        let data = this.filterForm.serializeArrayEntity();
        let keys = Object.keys(data).map((str) => {
            return str.substring(0, str.indexOf('__'))
        }).filter(item => item !== '');
        keys.forEach(v => {
            this.unsetUrlParameter(v);
            if(typeof this.filters[v] !== 'undefined')
                delete this.filters[v];
        });
        keys.filter(item => data[item + '__filter'] !== '').forEach((v) => {
            let val = data[v + '__filter'];
            this.setUrlParameter(v, val);
            if(val){
                if(Array.isArray(val) && val.length === 0){
                    return;
                }

                this.filters[v] = val;
            }

        });


        let $filtersEl = $('#'+this.id+'_active_filters').find('.filters');

        let count = 0;

        $filtersEl.html('');
        if(Object.keys(this.filters).length > 0){
            if(this.params.useFiltersBar){
                $('#'+this.id+'_active_filters').removeClass('d-none');
            }
            Object.keys(this.filters).forEach((key, index) => {
                if(this.filterForm.getInput(key + '__filter').length <= 0)
                    return;

                count++;

                let val = $(this.filterForm.form).find('label[for="' + this.filterForm.id + '_' + key + '__filter' + '"]').text();
                if(val)
                    val = val.replace(' *', '');

                let text = this.filters[key];

                if(this.filterForm.getInput(key + '__filter').prop('tagName') === 'SELECT'){
                    text = '';
                    let keys = [];
                    if(!Array.isArray(this.filters[key])){
                        keys.push(this.filters[key]);
                    }else{
                        keys = this.filters[key];
                    }
                    keys.forEach((k, i) => {
                        if(text !== '')
                            text += ', ';
                        text += this.filterForm.getInput(key + '__filter').find('option[value="'+k+'"]').text();
                    });
                }else{
                    if(this.filterForm.getInput(key + '__filter').prop('type') === 'radio'){
                        if(text == 1){
                            text = translations.YES;
                        }else if(text == 0){
                            text = translations.NO;
                        }
                    }

                    if(this.filterForm.getInput(key + '__filter').prop('type') === 'number' && this.filterForm.getInput(key + '__filter').data('currency') == 1){
                        text = text / 100;
                    }
                }


                $filtersEl.append('<div class="filter" data-name="'+key+'__filter"><div class="name">' + val + ':</div><div class="value">' + text + '</div><div aria-hidden="true" class="close-btn">×</div></div>');
            });
        }else{
            if(!$('#'+this.id+'_active_filters').hasClass('d-none'))
                $('#'+this.id+'_active_filters').addClass('d-none');
        }

        $('#'+this.id+'_active_filters .counter').text(count);
        $('#'+this.id+'_filterbutton').attr('data-filtercount', count);


        localStorage.setItem('DataTablesFilters_' + 'USR' + userID + '_'+ this.id +'_' + window.location.pathname, JSON.stringify(this.filters));

        this.refresh(true);
    }

    /**
     * Uloží nastavení gridu do DB
     */
    saveSettings() {
        if (typeof DISABLE_GRID_SETTINGS !== "undefined") {
            return;
        }
        let column_list = this.getColumnList();
        let columns = {
            'items': {},
            'order': this.grid.colReorder.order()
        };
        column_list.forEach(item => {
            if (item.mData !== 'Action') {
                let col = this.getColumn(item.name);
                columns['items'][item.mData] = {
                    'visible': col.visible(),
                }
            }
        });
        Helpers.ajax({
            url: basePath + '/user/grid-settings/save-settings',
            data: {
                Name: this.id,
                Value: JSON.stringify(columns)
            }
        });
    }

    /**
     * Načte nastavení gridu do DB
     */
    loadSettings() {
        if (typeof DISABLE_GRID_SETTINGS !== "undefined") {
            this.initialized = true;
            return;
        }
        this.initialized = false;
        Helpers.ajax({
            url: basePath + '/user/grid-settings/load-settings',
            data: {
                Name: this.id,
            },
            success: (data) => {
                if (data !== null && data !== "") {
                    data = JSON.parse(data);
                    for (let item in data.items) {
                        this.getColumn(item).visible(data.items[item].visible)
                    }
                    this.grid.colReorder.order(data.order)
                }
                this.initialized = true;
            }
        });
    }

    /**
     * Vytvoří inline editaci zázamu
     * @param {HTMLElement} element Buňka
     * @param {Object} column Sloupec
     * @param {Object} row Řádek
     * @param {string} value Hodnota
     */
    createInlineEdit(element, column, row, value) {
        let $cell = $(element);
        $cell.closest('table').addClass('editing');
        let $editor = $cell.append('<div class="editor"></div>');
        $cell.addClass('editing');
        let input = '';
        switch (column.editType){
            case 'default':
                switch (column.format) {
                    case Grid.COLUMN_BOOL:
                        input = `
                            <select name="${column.name}" data-id="${row.data()['ID']}">
                                <option value="1" ${value === '1' ? 'selected' : ''}>Ano</option>
                                <option value="0" ${value === '0' ? 'selected' : ''}>Ne</option>
                            </select>
                        `;
                        break;
                    case Grid.COLUMN_ENUM:
                    case Grid.COLUMN_ENTITY:
                        input = `<select name="${column.name}" data-id="${row.data()['ID']}">`;
                        let values = column.select_values;
                        for (let k in values) {
                            input += `<option value="${k}" ${value == k ? 'selected' : ''}>${values[k]}</option>`;
                        }
                        input += `</select>`;
                        break;
                    case Grid.COLUMN_NUMBER:
                        input = `<input type="number" value="${value === null ? '' : value}" name="${column.name}" data-id="${row.data()['ID']}">`;
                        break;
                    default:
                        input = `<input value="${value === null ? '' : value}" name="${column.name}" data-id="${row.data()['ID']}">`;
                }
                break;
            case 'ajax-select':
                input = column.editParams.input;
                input = $(input).attr('data-id', row.data()['ID']);
                input = $(input).append(`<option value="old_unchanged_value" selected>${value}</option>`);
                break;
        }
        $editor.html(input);
        $editor.find(':input').focus();
        $editor.find(':input').on('change focusout', (e) => {
            if(($(e.currentTarget).is('select') && e.type !== 'focusout') || (!$(e.currentTarget).is('select') && $(e.currentTarget).attr('type') !== 'number' || ($(e.currentTarget).attr('type') === 'number' && e.type !== 'change'))) {
                if ($editor) {
                    processInlineEditor(e.currentTarget);
                }
            }
        });

        if(column.editType === 'ajax-select' || $editor.find('select').length > 0){
            const onMouseup = $(document).on('mouseup', 'html', (e) =>
            {
                let container = $($editor).find('.select2').parent();

                // if the target of the click isn't the container nor a descendant of the container
                if (!container.is(e.target) && container.has(e.target).length === 0)
                {
                    $(document).off('mouseup', 'html');
                    this.refresh();
                }
            });

            if(column.editType === 'ajax-select')
                plugins.initSelect2Ajax(this.element);
            else{
                plugins.initSelect2();
            }
        }


        const processInlineEditor = (e) => {
            let $input = $(e);
            let data = {
                ID: $input.data('id')
            };
            data[$input.attr('name')] = $input.val();

            if(this.params.urls.inlineEditAction) {
                Helpers.ajax({
                    url: this.params.urls.inlineEditAction,
                    data: {
                        data: JSON.stringify(data)
                    },
                    success: () => {
                        this.refresh();
                        $(this.element).removeClass('editing');
                        if (typeof this.onAfterInlineChange === 'function')
                            this.onAfterInlineChange($input.attr('name'), $input.val(), $input.data('id'));
                        if(column.editType === 'ajax-select' || column.format === Grid.COLUMN_ENUM || column.format === Grid.COLUMN_ENTITY || column.format === Grid.COLUMN_BOOL){
                            $(document).off('mouseup', 'html');
                            $input.select2('destroy');
                        }
                        $input.remove();
                    }
                });
            }else{
                $cell.addClass('changed');
                $(this.element).removeClass('editing');
                if(column.editType === 'ajax-select' || column.editType === Grid.COLUMN_ENUM || column.editType === Grid.COLUMN_ENTITY || column.editType === Grid.COLUMN_BOOL){
                    $(document).off('mouseup', 'html');
                    $input.select2('destroy');
                }
                this.grid.cell(element).data($input.val());
                if (typeof this.onAfterInlineChange === 'function')
                    this.onAfterInlineChange($input.attr('name'), $input.val(), $input.data('id'));
                $input.remove();
                $cell.removeClass('editing');
            }
        };
    }

    /**
     * Formátování dat v buňce
     * @param {string} data Hodnota
     * @param type
     * @param {object} row Data řádku
     * @param {string} format Typ formátu
     * @param {string} name Název sloupce
     * @returns {string|*}
     */
    colFormatter(data, type, row, format, name, onlyData = false) {
        switch (format) {
            case Grid.COLUMN_DATE:
                if (data != null) {
                    let d = moment(data);
                    return d.format('L');
                } else
                    return "";
            case Grid.COLUMN_BOOL:
                if (data === null)
                    return translations.NO;
                return (Number(data)) ? translations.YES : translations.NO;
            case Grid.COLUMN_TIME:
                if (data === null)
                    return "";
                let t = moment(data);
                return t.format('LTS');
            case Grid.COLUMN_DATETIME:
                if (data === null)
                    return "";
                let dt = moment(data);
                return dt.format('L LTS');
            case Grid.COLUMN_TIMESTAMP:
                if (data === null)
                    return "";
                let dtt = moment.unix(data);
                return dtt.format('D. M. Y HH:mm:ss');
            case Grid.COLUMN_CURRENCY:
                if (data === null)
                    return "";
                return Helpers.formatPrice(data / 100, 2);
            case Grid.COLUMN_CURRENCY_CZK:
                if (data === null)
                    return "";
                return Helpers.formatPrice(data / 100, 2) + " Kč";
            case Grid.COLUMN_CURRENCY_EUR:
                if (data === null)
                    return "";
                return Helpers.formatPrice(data / 100, 2) + " €";
            case Grid.COLUMN_CURRENCY_USD:
                if (data === null)
                    return "";
                return Helpers.formatPrice(data / 100, 2) + " $";
            case Grid.COLUMN_CURRENCY_GBP:
                if (data === null)
                    return "";
                return Helpers.formatPrice(data / 100, 2) + " £";
            case Grid.COLUMN_CURRENCY_PLN:
                if (data === null)
                    return "";
                return Helpers.formatPrice(data / 100, 2) + " zł";
            case Grid.COLUMN_LONGTEXT:
                if (data === null)
                    return "";
                data = data.replace(/<(?:.|\n)*?>/gm, '');
                if (onlyData)
                    return data.substr(0, 100);
                else
                    return `<span class="text" data-text="${data.substr(0, 500)}">${data.substr(0, 100)}...</span>`;
            case Grid.COLUMN_CHECKBOX:
                if (onlyData)
                    return (data === '1' || data === true) ? translations.YES : translations.NO;
                return `<label class="checkbox"><input type="checkbox" class="form-control" onchange="window['${this.id}'].toggleBoolean(${row.ID}, '${name}', this)" ${(data === '1' || data === true) ? 'checked' : ''}><span class="checkmark"></span><span class="text">${(data === '1' || data === true) ? translations.YES : translations.NO}</span></label>`;
            case Grid.COLUMN_TEXT:
                if (data == null)
                    return "";

                let span = document.createElement('span');
                span.classList.add('text');
                span.innerText = span.textContent = data;

                if (onlyData)
                    return span.innerText;

                return span.outerHTML;
            default:
                if (data === null)
                    return '';

                if (onlyData)
                    return data;
                return `<span class="text">${data}</span>`
        }
    };

    /**
     * Vrací seznam sloupců v gridu
     * @returns {null|[]}
     */
    getColumnList(def = false) {
        if(def){
            return this.grid.settings().init().aoColumnDefs;
        }
        let columns = [];
        if(this.params.columnReorder){
            this.grid.colReorder.order().forEach((col, i) => {
                columns.push(this.grid.settings().init().aoColumnDefs[col]);
            })
        }else{
            return this.grid.settings().init().aoColumnDefs;
        }


        return columns;
    }

    /**
     * Odesílá hodnotu inline editové boolean hodnoty
     * @param {int} id ID řádku
     * @param {string} column Sloupec
     * @param {HTMLElement} checkbox Checkbox
     */
    toggleBoolean(id, column, checkbox) {
        let data = {ID: id}
        data[column] = $(checkbox).prop('checked') ? '1' : '0';
        Helpers.ajax({
            url: this.params.urls.updateUrl,
            data: {
                data: JSON.stringify(data)
            },
            success: () => {
                if (data[column] === '1')
                    $(checkbox).siblings('.text').text(translations.YES);
                else
                    $(checkbox).siblings('.text').text(translations.NO);

                if (typeof this.onAfterInlineChange === 'function')
                    this.onAfterInlineChange(column, $(checkbox).prop('checked'), id);
            }
        });
    }

    /**
     * Zobrazí dialog s nastavením viditelnosti sloupců
     */
    showColumnVisibilityDialog() {
        let dialog = new Dialog();
        let content = '<div class="dataTable-columnvisibility row">';
        this.getColumnList().forEach(item => {
            if(item.name === 'checkbox' || item.name === 'actions')
                return;

            let col = this.getColumn(item.name);

            content += `
            <div class="btn-group-toggle col-md-6" data-toggle="buttons">
                <label class="btn ${col.visible() ? 'active' : ''}">
                    <input type="checkbox" ${col.visible() ? 'checked="true"' : ''} autocomplete="off" onchange="window['${this.id}'].getColumn('${item.name}').visible(this.checked)"> ${item.label}
                </label>
            </div>
            `
        });
        content += `</div>`;
        dialog.content = content;
        dialog.title = translations.SHOW_HIDE_COLUMNS;
        dialog.show();
    }

    /**
     * Vrací základní nastavení gridu
     * @returns {{}}
     */
    getBaseOptions() {
        let options = {
            language: {
                url: basePath + '/jolanda/front/js/assets/datatables/' + lang + '.json'
            },
            serverSide: this.params.dataSaveType === 'serverside' && this.params.ajax,
            processing: true,
            responsive: false,
            pageLength: this.params.displayBuffer,
            rowId: 'extn',
            autoWidth: false,
            deferRender: true,
            scrollY: this.params.height,
            scrollX: true,
            scrollCollapse: true,
            dom: 'Blrtip',
            fixedHeader: false,
            stateSave: true,
            buttons: [],
            paging: true,
            pagingType: "full_numbers",
            stateSaveCallback: (settings,data) => {
                if(this.grid) {
                    data.order = this.grid.order();

                    if(data.order.length && typeof data.order[0]._idx !== 'undefined'){
                        delete data.order[0]._idx;
                    }
                }

                delete data.scroller;
                delete data.select;
                delete data.search;
                delete data.childRows;
                delete data.length;

                if(!this.params.columnReorder){
                    delete data.ColReorder;
                }else{
                    data.columnsWidth = this.columnsWidth;
                }


                data.start = 0;

                if(this.params.presetSaveType === 'local'){
                    localStorage.setItem( 'DataTables_' + 'USR' + userID + '_' + settings.sInstance + '_' + window.location.pathname, JSON.stringify(data) );
                }else{
                    let old = localStorage.getItem( 'DataTables_' + 'USR' + userID + '_' + settings.sInstance + '_' + window.location.pathname);

                    if(old){
                        let oldObj = JSON.parse(old);

                        oldObj.time = data.time;

                        if(typeof oldObj.ColReorder !== "undefined"){
                            if(typeof data.ColReorder === "undefined"){
                                data.ColReorder = oldObj.ColReorder;
                            }
                        }
                        delete oldObj.length;

                        let equal = Helpers.deepEqual(oldObj, data);

                        if(equal)
                            return null;
                    }

                    this.stateRestore.saveState('_tmp_', JSON.stringify(data));
                    localStorage.setItem( 'DataTables_' + 'USR' + userID + '_' + settings.sInstance + '_' + window.location.pathname, JSON.stringify(data) );
                }

            },
            stateLoadCallback: (settings, callback) => {
                let data = null;

                if(this.params.presetSaveType === 'local'){
                    data = JSON.parse( localStorage.getItem( 'DataTables_' + 'USR' + userID + '_' + settings.sInstance + '_' + window.location.pathname) );
                }else{
                    data = this.stateRestore.getState('_tmp_');

                    if(!data)
                        return null;
                    else{
                        if(!data.Data)
                            return null;
                        else
                            data = JSON.parse(data.Data);
                    }

                }
                // this.grid.settings().init().aoColumnsDefs.forEach((col, i) => {
                //     $(this.grid.column(col).header()).width(data.columnsWidth[col]);
                //     this.grid.settings().init().aoColumnsDefs[col].width = data.columnsWidth[col];
                // });

                if(!data)
                    return null;

                if(!this.params.columnReorder){
                    if(typeof data.ColReorder !== 'undefined')
                        delete data.ColReorder;

                    data.columnsWidth = [];
                }



                if(data){
                    if(typeof data.columnsWidth === 'undefined')
                        data.columnsWidth = [];

                    this.columnsWidth = data.columnsWidth;
                }

                return data;
            },
            stateLoaded: (settings, data) => {
            },
            searching: false,
            preDrawCallback: () => {
                /*this.grid.columns()[0].forEach((i) => {
                    let col = this.grid.column(i).header();
                    $(col).css('max-width', col.style.width);
                });*/

                if (this.refreshing && this.range.total === this.range.totalPrev) {
                    $(this.element).parent().scrollTop(this.range.scroll);
                }
                if(this.columnsWidth.length > 0) {
                    this.grid.columns()[0].forEach((col, i) => {
                        if(!this.columnsWidth[col])
                            return;

                        $(this.grid.column(col).header()).css('width', this.columnsWidth[col]);
                        this.grid.settings()[0].aoColumns[i].sWidth = this.columnsWidth[col];
                        this.grid.settings()[0].aoColumns[i].width = this.columnsWidth[col];
                    });
                }

                try{
                    this.grid.columns.adjust();
                } catch (e) {
                }
            },
            initComplete: () => {
                $(this.element).parent().css('height', this.params.height);
                this.urlParameters = this.grid.ajax.params();
                if (this.urlParameters === undefined)
                    this.urlParameters = {};

                if(this.columnsWidth.length > 0) {
                    this.grid.columns()[0].forEach((col, i) => {
                        if(!this.columnsWidth[col])
                            return;

                        $(this.grid.column(col).header()).css('width', this.columnsWidth[col]);
                        this.grid.settings()[0].aoColumns[i].sWidth = this.columnsWidth[col];
                        this.grid.settings()[0].aoColumns[i].width = this.columnsWidth[col];
                    });
                }

                try{
                    this.grid.columns.adjust();
                } catch (e) {
                }

                if(typeof this.onAfterInit === 'function'){
                    this.onAfterInit();
                }
            },
            drawCallback: () => {
                if(this.params.multipleType === 'all' && this.selectedRows.length){
                    this.selectedRows.forEach((row, index) => {
                        let i = this.grid.rows().data().toArray().indexOf(this.grid.rows().data().toArray().find(o => o.ID === row.ID));

                        if(i >= 0){
                            this.grid.rows(i).select();
                        }
                    });

                }

                if(this.params.multipleType !== 'all' && this.params.select !== 'single'){
                    this.updateMultiselectAllCount(this.getSelectedCount());
                }

                if (this.refreshing && this.range.total === this.range.totalPrev) {
                    //$(this.element).parent().scrollTop(this.range.scroll);
                    if (this.recentItemIndex !== null && this.recentItemIndex !== undefined)
                        if (typeof this.recentItemIndex === 'number')
                            this.getRowByIndex(this.recentItemIndex).select();
                        else if (typeof this.recentItemIndex === 'object')
                            this.grid.rows(this.recentItemIndex).select();
                }
                this.recentItemIndex = null;
            },
            ajax: this.params.dataSaveType === 'serverside' && this.params.ajax ? {
                url: this.params.urls.datalistUrl,
                beforeSend: (xhr, settings) => {
                    let cancel = this.cancelAjax;
                    this.cancelAjax = false;
                    if(cancel){
                        xhr.abort();
                        console.log(this._xhr);
                    }else{
                        if(this._xhr && this._xhr.readyState !== 4){
                            this._xhr.abort();
                            console.log(this._xhr);
                        }

                        this._xhr = xhr;
                    }

                },
                data: (d, datatable, settings) => {
                    let sort = ((d.order[0].dir === 'asc') ? '' : '-') + this.getColumnList(true)[d.order[0].column].name;

                    if (this.params.order.reordered){
                        try{
                            sort = ((d.order[0].dir === 'asc') ? '' : '-') + this.getColumnList()[d.order[0].column].name;
                        }catch (e) {

                        }
                    }
                    else {
                        if(d.draw === 1){
                            if(this.grid.state.loaded()){
                                //this.grid.colReorder.order(this.grid.state.loaded().ColReorder);
                                // this.grid.state.loaded().order[0][0] = Object.keys(this.grid.state.loaded().ColReorder).find(key => this.grid.state.loaded().ColReorder[key] === this.grid.state.loaded().order[0][0]);
                                if(typeof this.grid.state.loaded().ColReorder !== 'undefined'){
                                    this.grid.state.loaded().order[0][0] = this.grid.state.loaded().ColReorder[this.grid.state.loaded().order[0][0]];
                                    this.grid.order(this.grid.state.loaded().order);
                                    d.order[0].column = this.grid.state.loaded().order[0][0];
                                }
                            }
                        }
                        try{
                            sort = ((d.order[0].dir === 'asc') ? '' : '-') + this.getColumnList()[d.order[0].column].name;
                        }catch (e) {

                        }
                    }
                    let length = (d.length > 0) ? d.length : 0;

                    let currentFrom = 0;
                    let currentTo = 0;

                    if(d.start !== 0){
                        currentFrom = this.range.from;
                        currentTo = this.range.to;
                    }

                    if(typeof this.modifySortData === 'function'){
                        sort = this.modifySortData(sort, d);
                    }

                    let rangeFrom = d.start;
                    let rangeTo = d.start + length;
                    let direction;

                    this.range.totalPrev = this.range.total;

                    let start;
                    let draw = d.draw;
                    d = {};

                    let count = rangeTo - currentTo;
                    if(count > length || count === 0)
                        count = length;

                    if(currentTo < rangeTo) {
                        direction = 'down';
                        if(count < 0)
                            count = 0;
                        if(rangeFrom > currentTo)
                            start = rangeFrom;
                        else
                            start = currentTo;
                    }else if(currentTo > rangeTo){
                        direction = 'up';

                        if(count < 0)
                            count = Math.abs(count);

                        if(rangeFrom < currentFrom-length) {
                            count = length;
                            start = rangeTo;
                        }else
                            start = currentFrom-count;
                    }else{
                        direction = 'refresh';
                        start = rangeFrom;
                        count = length;
                    }

                    if(this.refreshing){
                        direction = 'refresh';
                        count = length;
                        rangeFrom = this.range.from;
                        start = this.range.from;

                        if(currentFrom === 0){
                            rangeFrom = 0;
                            start = 0;
                        }
                    }

                    if(rangeFrom === 0){
                        direction = 'refresh';
                        start = 0;
                        count = length;
                    }

                    if(((draw  > 1 &&  count < (this.params.displayBuffer*2)) || this.cancelAjax) && this.params.infiniteScroll) {
                        this.cancelAjax = true;
                        return;
                    }else{
                        this.cancelAjax = false;
                        this.range.from = rangeFrom;
                        this.range.to = rangeTo;
                        this.range.direction = direction;
                    }
                    this.setUrlParameter('sort', sort);
                    this.setUrlParameter('count', count);
                    this.setUrlParameter('start', start);

                    if (this.switchesForm !== undefined) {
                        let data = this.switchesForm.serializeArrayEntity();
                        for (let i in data) {
                            if (typeof data[i] === 'boolean')
                                data[i] = data[i] ? 1 : 0;
                            this.setUrlParameter(i, data[i]);

                            if(this.params.switchesFormToEditor){
                                this.createDefaultValues[i] = data[i];
                            }
                        }
                    }

                    if (getDataAttr(this.element, 'parent-element') !== '' && getDataAttr(this.element, 'parent-editor') !== '') {
                        this.setUrlParameter(getDataAttr(this.element, 'parent-element'), window[getDataAttr(this.element, 'parent-editor')].entity_id);
                    }
                    for (let key in this.urlParameters) {
                        if (this.urlParameters[key] !== null && this.urlParameters[key] !== 'null' && this.urlParameters[key] !== '')
                            d[key] = this.urlParameters[key];
                    }
                    return d;
                },
                dataFilter: (data,a,b) => {
                    let json;
                    if (typeof data === 'string')
                        json = JSON.parse(data);
                    else
                        json = data;
                    json.recordsTotal = json.numRows;
                    json.recordsFiltered = json.numRows;

                    if(json.statuses !== undefined){
                        Helpers.alertAuthStatuses(json.statuses);

                        let hasAuthError = Helpers.getStatusesByType(json.statuses, 'auth_error');
                        if(hasAuthError.length > 0){
                            let OAuthServer = JSON.parse(hasAuthError[0].msg).OAuthServer;
                            AuthWindow.open(OAuthServer);
                        }
                    }

                    this.getColumnByFormat(Grid.COLUMN_COUNTER).forEach((column, index) => {
                        json.items.forEach((row, index) => {
                            row[column.columnInfo.name] = this.urlParameters.start + (index+1);
                        });
                    });

                    if(this.range.direction === 'down') {
                        json.data = this.grid.data().toArray().slice(json.items.length);
                        json.data = json.data.concat(json.items);
                    }else if(this.range.direction === 'up'){
                        json.data = json.items;
                        json.data = json.data.concat(this.grid.data().toArray().slice(0,this.grid.data().toArray().length-json.items.length));
                    }else{
                        json.data = json.items;
                    }

                    delete json.items;
                    delete json.numRows;
                    $('#' + this.id + '_counter').text(json.recordsTotal + (json.message !== undefined ? ' - ' + json.message : ''));
                    if ($(this.element).closest('.tab-pane').length > 0) {
                        let item = $('#' + $(this.element).closest('.tab-pane').attr('id') + '-link .counter');
                        item.text('(' + json.recordsTotal + ')');
                    }
                    this.range.total = json.recordsTotal;

                    return JSON.stringify(json);
                },
                error: function (err) {
                    console.log(err);
                }
            } : null,
        };

        if(this.params.columnReorder){
            options.colReorder = {
                realtime: false
            };
            options.dom += 'R';
            options.colResize= {
                isEnabled: true,
                    hoverClass: 'dt-colresizable-hover',
                    hasBoundCheck: false,
                    minBoundClass: 'dt-colresizable-bound-min',
                    maxBoundClass: 'dt-colresizable-bound-max',
                    isResizable: (column) => { return true; },
                    onResizeStart: (column, columns) => {},
                    onResize: (column) => {},
                    onResizeEnd: (column, columns) => {
                    this.grid.columns()[0].forEach((col, i) => {
                        this.columnsWidth[col] = this.grid.settings()[0].aoColumns[i].sWidth;
                    });

                    this.grid.state.save();
                },
                    getMinWidthOf: ($thNode) => {}
            };
        }

        if(!this.params.ajax){
            options.data = this.params.data;
            this.setCounter(options.data.length);
        }

        if(this.params.infiniteScroll){
            options.scroller = {
                loadingIndicator: true,
                rowHeight: 33,
                displayBuffer: this.params.displayBuffer,
            };
        }

        options.aoColumnDefs = [];

        if (this.params.select === 'single')
            options.select = {style: 'single'};
        if (this.params.select === 'multi')
            options.select = {style: 'multi'};
        if (this.params.select.includes('checkbox')) {
            options.select = {style: 'os', selector: 'td:first-child'};
        }

        //options.aoColumns = this.setGridColumns();

        let columns_json = getDataAttr(this.element, 'columns');

        columns_json.forEach((v, i) => {
            if(v.name === 'checkbox'){
                let checkbox = {
                    data: "checkbox",
                    orderable: false,
                    colReorder: false,
                    className: 'select-checkbox',
                    targets: 0,
                    width: '20px',
                    name: 'checkbox',
                    label: v.label,
                    render: () => {
                        return '';
                    }
                };

                options.aoColumnDefs.push(checkbox);
                this.columnIndexes.push('checkbox');
                return;
            }


            let col = {targets: i};
            col.width = v.minwidth;
            col.sWidth = v.minwidth;
            col.visible = v.visibility;
            if (v.editable)
                col.className = 'editable';
            col.mData = v.name;
            col.name = v.name;
            col.label = v.label;
            col.defaultContent = '';
            col.editable = v.editable;
            col.editType = v.editType;
            col.editParams = v.editParams;
            col.columnInfo = v;
            col.resizable = true;
            col.format = v.format;
            col.orderSequence = ['desc', 'asc'];
            let enum_values = JSON.parse(v.entity_values);
            let enum_values2 = JSON.parse(v.entity_values);
            col.enum_values = enum_values;
            col.select_values = enum_values2;
            col.render = (data, type, row, meta) => {
                if (v.format === Grid.COLUMN_ENTITY || v.format === Grid.COLUMN_ENUM) {
                    if (enum_values === null)
                        return 'ENUM values not set';
                    else if (enum_values[data] === undefined) {
                        if (data === null)
                            return '';
                        else
                            return 'INVALID VALUE';
                    } else
                        return `<span class="text">${enum_values[data]}</span>`;
                } else {
                    if (v.format_function == null)
                        return this.colFormatter(data, type, row, v.format, v.name);
                    else {
                        if (v.format_function.includes('.')) {
                            let call = v.format_function.split('.');
                            if (typeof window[call[0]][call[1]] === 'function')
                                return window[call[0]][call[1]](data, v.name, row, meta, this);
                            else {
                                console.log(v.format_function + ' is not a function!');
                                return data;
                            }
                        }
                        if (typeof window[v.format_function] === 'function')
                            return window[v.format_function](data, v.name, row, meta, this);
                        else {
                            console.log(v.format_function + ' is not a function!');
                            return data;
                        }
                    }
                }
            };

            this.columnIndexes.push(v.name);
            options.aoColumnDefs.push(col);
        });

        let actions = {
            targets: columns_json.length,
            width: (80+(this.params.rowbuttons.length*30)) + 'px',
            visible: true,
            data: "Action",
            name: "actions",
            render: () => {
                let buttons = '';
                for (let i in this.params.rowbuttons)
                    buttons += this.params.rowbuttons[i];
                if (this.params.preview)
                    buttons += `<button class="btn btn-icon" onclick="Grid.callRow(this,window['${this.id}'].preview)" type="button"><span class="ci ci-search"></span></button>`;
                if (this.params.actions.edit && this.params.urls.editAction !== '') {
                    buttons += `<button class="btn btn-icon" onclick="Grid.callRow(this,window['${this.id}'].edit)" onmousedown="Grid.callRow(this,window['${this.id}'].openTabEditor, [event])" type="button"><span class="ci ci-edit"></span></button>`;
                }
                if (this.params.actions.remove && this.params.urls.deleteUrl !== '') {
                    buttons += `<button class="btn btn-icon" onclick="Grid.callRow(this,window['${this.id}'].remove)" type="button"><span class="fa fa-trash"></span></button>`;
                }

                return buttons;
            }
        }

        if ((this.params.rowbuttons.length > 1) || this.params.preview || (this.params.actions.edit && this.params.urls.editAction !== '') || (this.params.actions.remove && this.params.urls.deleteUrl !== '')) {
            actions.visible = true;
        } else {
            actions.visible = false;
        }

        options.aoColumnDefs.push(actions);
        this.columnIndexes.push('action');


        if (this.hasParentGrid())
            options.iDeferLoading = true;
        if (this.params.reorder !== '') {
            options.rowReorder = {
                dataSrc: this.params.reorder,
                snapX: true,
            };
        }
        if (this.params.rowformatter !== '') {
            options.rowCallback = window[this.params.rowformatter]
        }

        if (this.params.reorder !== '') {
            options.rowReorder = true;
        }


        let orderColumn = Object.keys(this.columnIndexes).find(key => this.columnIndexes[key] === this.params.order.column);
        options.order = [[orderColumn === undefined ? 0 : orderColumn, this.params.order.order]];

        this.stateRestore.addDefaultState(options);
        return options;
    }

    openTabEditor = (e) => {
        if (e[0].which === 2) {
            if (this.getSelectedCount() > 1) {
                alerts.alert(translations.SELECT_ONLY_ONE);
                return;
            } else if (this.getSelectedCount() === 0) {
                alerts.alert(translations.SELECT_ROW, 'info', translations.SELECT_ROW_TEXT);
                return;
            }
            if(this.params.urls.editAction.includes('?')){
                window.open(this.params.urls.editAction + '&entity_ID=' + this.getCurrentItemValue('ID'), '_blank').focus();
            }else{
                window.open(this.params.urls.editAction + '?entity_ID=' + this.getCurrentItemValue('ID'), '_blank').focus();
            }

        }
    }

    /**
     * Připravuje sloupce v gridu
     * @returns {[]}
     */
    setGridColumns() {
        let result = [];
        if (this.params.select.includes('checkbox')) {
            result.push({
                render: () => {
                    return '';
                }
            });
            this.columnIndexes.push('checkbox');
        }
        let columns_json = getDataAttr(this.element, 'columns');
        columns_json.forEach((v) => {
            let enum_values = JSON.parse(v.entity_values);
            let enum_values2 = JSON.parse(v.entity_values);
            this.columnIndexes.push(v.name);
            result.push({
                mData: v.name,
                name: v.name,
                label: v.label,
                defaultContent: '',
                editable: true,
                columnInfo: v,
                enum_values: enum_values,
                select_values: enum_values2,
                render: (data, type, row, meta) => {
                    if (v.format === Grid.COLUMN_ENTITY || v.format === Grid.COLUMN_ENUM) {
                        if (enum_values === null)
                            return 'ENUM values not set';
                        else if (enum_values[data] === undefined) {
                            if (data === null)
                                return '';
                            else
                                return 'INVALID VALUE';
                        } else
                            return `<span class="text">${enum_values[data]}</span>`;
                    } else {
                        if (v.format_function == null)
                            return this.colFormatter(data, type, row, v.format, v.name);
                        else {
                            if (v.format_function.includes('.')) {
                                let call = v.format_function.split('.');
                                if (typeof window[call[0]][call[1]] === 'function')
                                    return window[call[0]][call[1]](data, v.name, row, meta);
                                else {
                                    console.log(v.format_function + ' is not a function!');
                                    return data;
                                }
                            }
                            if (typeof window[v.format_function] === 'function')
                                return window[v.format_function](data, v.name, row, meta);
                            else {
                                console.log(v.format_function + ' is not a function!');
                                return data;
                            }
                        }
                    }
                }
            });
        });
        result.push({
            mData: '',
            label: translations.ACTION,
            render: () => {
                let buttons = '';
                for (let i in this.params.rowbuttons)
                    buttons += this.params.rowbuttons[i];
                if (this.params.preview)
                    buttons += `<button class="btn btn-icon" onclick="Grid.callRow(this,window['${this.id}'].preview)" type="button"><span class="ci ci-search"></span></button>`;
                if (this.params.actions.edit && this.params.urls.editAction !== '') {
                    buttons += `<button class="btn btn-icon" onclick="Grid.callRow(this,window['${this.id}'].edit)" type="button"><span class="ci ci-edit"></span></button>`;
                }
                if (this.params.actions.remove && this.params.urls.deleteUrl !== '') {
                    buttons += `<button class="btn btn-icon" onclick="Grid.callRow(this,window['${this.id}'].remove)" type="button"><span class="fa fa-trash"></span></button>`;
                }
                return buttons;
            }
        });
        this.columnIndexes.push('action');
        return result;
    }

    /**
     * Zkopíruje data v řádku do schránky ve formátu CSV
     */
    copyRowToCSV() {
        let item = this.getCurrentItem();
        let columns = this.getColumnList().map(i => {
            return i.name
        });
        let result = columns.join(',') + '\n';
        result += Object.keys(item).filter(i => {
            return columns.includes(i)
        }).map(i => {
            return '"' + item[i] + '"'
        });
        copyToClipboard(result);
    }

    /**
     * Nastavuje URL parametr (filtr) gridu
     * @param {string} param Název parametru
     * @param {string} value Hodnota
     */
    setUrlParameter(param, value) {
        this.urlParameters[param] = value;
    };

    /**
     * Odstraní URL parametr (filtr) gridu
     * @param {string} param Název parametru
     */
    unsetUrlParameter(param) {
        delete this.urlParameters[param];
    };

    /**
     * Vrací data aktuálně vybraného řádku
     * @returns {null|{}}
     */
    getCurrentItem(showWarning = false) {
        if (this.grid.rows({selected: true}).data()[0] !== undefined)
            if (this.params.select === 'single')
                return this.grid.rows({selected: true}).data()[0];
            else
                return this.grid.rows({selected: true}).data().toArray();
        else {
            if (showWarning)
                alerts.alert(translations.SELECT_ROW, 'info', translations.SELECT_ROW_TEXT);
            return null;
        }
    };

    /**
     * Vrací hodnotu sloupce aktuálně vybraného řádku
     * @param column
     */
    getCurrentItemValue(column, showWarning = true) {
        /*   if (showWarning)
               alerts.alert(translations.SELECT_ROW, 'info', translations.SELECT_ROW_TEXT);*/
        if (this.params.select === 'single')
            return this.getCurrentItem()[column];
        else {
            if (this.getCurrentItem() !== null)
                return this.getCurrentItem()[0][column];
            else
                return null;
        }
    }

    /**
     * Resetuje filtr
     */
    resetFilter() {
        this.filterRefreshnig = true;
        this.filterForm.reset();
        this.filterRefreshnig = false;
        $(this.filterForm.form).trigger('change');
    };

    /**
     * Nastavuje rodičovský
     * @param column
     * @param value
     */
    setParentElement(column, value) {
        this.parentElement = [{'column': column, 'id': value, 'grid': this.relations[0].grid}];
    };

    /**
     * nastavuje rodičovský grid
     * @param {Grid} parent_grid Rodičovský grid
     */
    setParentGrid(parent_grid) {
        this.relations[0].grid = parent_grid;
    };

    /**
     * Zobrazí panel s přidáváním entity
     */
    add() {
        if(this.editorIsOpen){
            return;
        }

        if (this.params.actions.add && (this.params.urls.editAction !== '' || this.params.urls.quickeditAction !== '')) {
            let parent_rows = [];
            if (this.hasParentGrid()) {
                let oneIsSelected = false;
                this.relations.forEach((relation) => {
                    if(window[relation.grid].getCurrentItem() != null){
                        oneIsSelected = true;
                        parent_rows.push({
                            column: relation.column,
                            id: window[relation.grid].getCurrentItem()[relation.child],
                        });
                    }
                });
                if(!oneIsSelected){
                    alerts.alert('Select parent', 'notice', 'Please select parent');
                    return;
                }
            }
            if (this.parentElement != null)
                parent_rows = this.parentElement;

            if (this.params.urls.editAction !== '') {
                if(typeof this.onBeforeShowCreateEditor === 'function'){
                    let show = this.onBeforeShowCreateEditor() ?? true;
                    if(!show)
                        return;
                }
                let panel = new Panel();
                Helpers.ajax({
                    url: this.params.urls.editAction,
                    data: {
                        panel_id: panel.uid,
                        parent_rows: parent_rows,
                        dataSaveType: this.params.dataSaveType,
                        grid_id: this.id,
                        create_default_values: JSON.stringify(this.createDefaultValues),
                    },
                    success: (data) => {
                        if (typeof data === 'string')
                            data = JSON.parse(data);
                        panel.classes = 'entity-editor';
                        panel.setTitle(data.title);
                        panel.setContent(data.content);
                        panel.setFooter(data.footer);
                        panel.addToButtonArea(data.buttons);
                        panel.onAfterHide = (args) => {
                            this.editorIsOpen = false;

                            if (args !== null && args[0] === 'continue') {
                                this.edit(args[1][0]['ID']);
                            } else
                                this.refresh()
                        };

                        panel.onAfterShow = () => {
                            this.editorIsOpen = true;
                        }

                        panel.show();


                    }
                });
            } else if (this.params.urls.quickeditAction !== '') {
                if(typeof this.onBeforeShowCreateEditor === 'function'){
                    let show = this.onBeforeShowCreateEditor() ?? true;
                    if(!show)
                        return;
                }

                let dialog = new Dialog();
                if(this.params.quickeditMaxWidth)
                    dialog.maxWidth = this.params.quickeditMaxWidth;
                dialog.onAfterShow = () => {
                    this.editorIsOpen = true;
                };
                dialog.showFromUrl(this.params.urls.quickeditAction, {
                    'parent_column': null,
                    'parent_entity_id': null,
                    'parent_rows': parent_rows,
                    'parent_row': parent_rows.length === 1 ? parent_rows[0] : null, //kvůli bc breaku
                    'dataSaveType': this.params.dataSaveType,
                    'grid_id': this.id,
                    'create_default_values': JSON.stringify(this.createDefaultValues),
                }, true);

                dialog.onAfterClose = () => {
                    this.editorIsOpen = false;
                    this.refresh()
                };
            }
        }
    };

    addRow(item) {
        if (this.params.actions.add) {
            Helpers.ajax({
                type: 'POST',
                url: this.params.urls.createUrl,
                data: {
                    data: JSON.stringify(item),
                },
                success: (data) => {
                    // alerts.alert(translations.EDIT_DONE, 'success', '');
                    // this.refresh(true);
                }
            })
        }
    }

    /**
     * Zobrazí panel s editací entity
     */
    edit = (ID = null) => {
        if(this.editorIsOpen){
            return;
        }

        if (this.params.actions.edit && (this.params.urls.editAction !== '' || this.params.urls.quickeditAction !== '')) {
            let row = this.getCurrentItem();
            this.currentRow = row;
            if (ID === null) {
                if (this.getSelectedCount() > 1) {
                    alerts.alert(translations.SELECT_ONLY_ONE);
                    return;
                } else if (this.getSelectedCount() === 0) {
                    alerts.alert(translations.SELECT_ROW, 'info', translations.SELECT_ROW_TEXT);
                    return;
                }
                if (this.params.select === 'single')
                    ID = row['ID'];
                else
                    ID = row[0]['ID'];
            }
            let parent_rows = [];
            if (this.hasParentGrid()) {
                let oneIsSelected = false;
                this.relations.forEach((relation) => {
                    if(window[relation.grid].getCurrentItem() != null){
                        oneIsSelected = true;
                        parent_rows.push({
                            column: relation.column,
                            id: window[relation.grid].getCurrentItem()[relation.child],
                        });
                    }
                });
                if(!oneIsSelected && this.params.oneMustBeSelected){
                    alerts.alert('Select parent', 'notice', 'Please select parent');
                    return;
                }
            }
            if (this.parentElement != null)
                parent_rows = this.parentElement;

            if (this.params.urls.editAction !== '') {
                if(!this.panel || !this.params.editorCaching){
                    this.panel = new Panel();

                    let data = {
                        entity_ID: ID,
                        panel_id: this.panel.uid,
                        parent_rows: parent_rows,
                        caching: this.params.editorCaching,
                        dataSaveType: this.params.dataSaveType,
                        grid_id: this.id,
                    };

                    if(this.params.dataSaveType === 'local'){
                        data['local_tmp_id'] = this.params.select === 'single' ? row['local_tmp_id'] : row[0]['local_tmp_id'];
                    }

                    Helpers.ajax({
                        url: this.params.urls.editAction,
                        data: data,
                        success: (data) => {
                            if (typeof data === 'string')
                                data = JSON.parse(data);
                            this.panel.classes = 'entity-editor';
                            this.panel.setTitle(data.title);
                            this.panel.setContent(data.content);
                            this.panel.setFooter(data.footer);
                            this.panel.addToButtonArea(data.buttons);
                            this.panel.setUrl(this.params.urls.editAction, ID);
                            this.panel.cache = this.params.editorCaching;
                            this.panel.onAfterHide = () => {
                                this.editorIsOpen = false;
                                this.refresh()
                            };
                            this.panel.onAfterShow = () => {
                                this.editorIsOpen = true;
                            }
                            this.panel.show();
                        },
                        complete: () => {
                            if(this.params.editorCaching) {
                                setTimeout(() => {
                                    if(this.params.dataSaveType === 'local'){
                                        this.panel.entityEditor.local_tmp_id = this.params.select === 'single' ? this.getCurrentItem()['local_tmp_id'] : this.getCurrentItem()[0]['local_tmp_id'];
                                        this.panel.entityEditor.entityIterator = new Iterator(this.grid.data().map((e) => {return e.local_tmp_id}).toArray(), Array.isArray(this.getCurrentItemIndex()) ? this.getCurrentItemIndex()[0] : this.getCurrentItemIndex() , parseInt(this.grid.data().toArray().length), 0);
                                    }else {
                                        this.panel.entityEditor.entity_id = ID;
                                        this.panel.entityEditor.entityIterator = new Iterator(this.grid.data().map((e) => {return e.ID}).toArray(), Array.isArray(this.getCurrentItemIndex()) ? this.getCurrentItemIndex()[0] : this.getCurrentItemIndex(), parseInt(this.range.total), this.range.from, {
                                            params: this.urlParameters,
                                            url: this.params.urls.datalistUrl,
                                        });
                                        this.panel.entityEditor.entityIterator.lockScreenOnAjax = true;
                                    }
                                    $('#'+this.panel.entityEditor.editor_id+'_editor_iterator_current').text(this.panel.entityEditor.entityIterator.currentIndex+1);
                                    $('#'+this.panel.entityEditor.editor_id+'_editor_iterator_length').text(this.panel.entityEditor.entityIterator.totalLength);

                                    if(!this.panel.entityEditor.entityIterator.hasNext())
                                        $('#'+this.panel.entityEditor.editor_id+'_editor_next_entity_button').addClass('disabled');
                                    else
                                        $('#'+this.panel.entityEditor.editor_id+'_editor_next_entity_button').removeClass('disabled');


                                    if(!this.panel.entityEditor.entityIterator.hasPrev())
                                        $('#'+this.panel.entityEditor.editor_id+'_editor_prev_entity_button').addClass('disabled');
                                    else
                                        $('#'+this.panel.entityEditor.editor_id+'_editor_prev_entity_button').removeClass('disabled');
                                }, 0);
                            }
                        }
                    });
                }else{
                    if(this.params.dataSaveType === 'local'){
                        this.panel.entityEditor.local_tmp_id = this.params.select === 'single' ? this.getCurrentItem()['local_tmp_id'] : this.getCurrentItem()[0]['local_tmp_id'];
                        this.panel.entityEditor.entityIterator = new Iterator(this.grid.data().map((e) => {return e.local_tmp_id}).toArray(), Array.isArray(this.getCurrentItemIndex()) ? this.getCurrentItemIndex()[0] : this.getCurrentItemIndex() , parseInt(this.grid.data().toArray().length), 0);
                    }else {
                        this.panel.entityEditor.entity_id = ID;
                        this.panel.entityEditor.entityIterator = new Iterator(this.grid.data().map((e) => {
                            return e.ID
                        }).toArray(), Array.isArray(this.getCurrentItemIndex()) ? this.getCurrentItemIndex()[0] : this.getCurrentItemIndex(), parseInt(this.range.total), this.range.from, {
                            params: this.urlParameters,
                            url: this.params.urls.datalistUrl,
                        });
                        this.panel.entityEditor.entityIterator.lockScreenOnAjax = true;
                    }
                    $('#'+this.panel.entityEditor.editor_id+'_editor_iterator_current').text(this.panel.entityEditor.entityIterator.currentIndex+1);
                    $('#'+this.panel.entityEditor.editor_id+'_editor_iterator_length').text(this.panel.entityEditor.entityIterator.totalLength);

                    if(!this.panel.entityEditor.entityIterator.hasNext())
                        $('#'+this.panel.entityEditor.editor_id+'_editor_next_entity_button').addClass('disabled');
                    else
                        $('#'+this.panel.entityEditor.editor_id+'_editor_next_entity_button').removeClass('disabled');


                    if(!this.panel.entityEditor.entityIterator.hasPrev())
                        $('#'+this.panel.entityEditor.editor_id+'_editor_prev_entity_button').addClass('disabled');
                    else
                        $('#'+this.panel.entityEditor.editor_id+'_editor_prev_entity_button').removeClass('disabled');

                    this.panel.setUrl(this.params.urls.editAction, ID);
                    this.panel.show();
                    this.panel.entityEditor.loadData();
                    this.panel.entityEditor.refreshSubGrids();
                    this.panel.entityEditor.refreshRelationSwitches();
                }

            } else if (this.params.urls.quickeditAction !== '') {
                let dialog = new Dialog();
                row = this.getCurrentItem(false);
                if (this.params.select === 'single')
                    ID = row['ID'];
                else
                    ID = row[0]['ID'];

                let params = {
                    'parent_column': null,
                    'parent_entity_id': null,
                    'parent_rows': parent_rows,
                    'parent_row': parent_rows.length === 1 ? parent_rows[0] : null, //kvůli bc breaku
                    'entity_id': ID,
                    'dataSaveType': this.params.dataSaveType,
                    'grid_id': this.id,
                };

                if(this.params.dataSaveType === 'local'){
                    params['local_tmp_id'] = this.params.select === 'single' ? row['local_tmp_id'] : row[0]['local_tmp_id'];
                }
                if(this.params.quickeditMaxWidth)
                    dialog.maxWidth = this.params.quickeditMaxWidth;
                dialog.onAfterShow = () => {
                    this.editorIsOpen = true;
                };
                dialog.showFromUrl(this.params.urls.quickeditAction, params, true);
                dialog.onAfterClose = () => {
                    this.editorIsOpen = false;
                    this.refresh()
                };
            }
        }
    };

    /**
     * Smaže vybranou entitu
     */
    remove = () => {
        if (this.getSelectedCount() === 0) {
            alerts.alert(translations.SELECT_ROW, 'info', translations.SELECT_ROW_TEXT);
            return;
        }
        let count = (this.getSelectedCount() === 1) ? (translations.REMOVE_ITEM + '?') : (this.getSelectedCount() + ' ' + translations.REMOVE_ITEMS + '?')
        if (confirm(translations.REMOVE_QUESTION + ' ' + count  + ' ['+this.params.title+']')) {
            if(this.params.dataSaveType === 'local'){
                this.grid.rows({selected: true}).remove().draw();
                alerts.alert(translations.ITEMS_DELETED, 'success', '');
                return;
            }

            if (this.params.select === 'single') {
                let ID = this.getCurrentItem().ID;
                Helpers.ajax({
                    url: this.params.urls.deleteUrl,
                    data: {
                        data: '{ \"ID\":' + ID + '}'
                    },
                    success: (data) => {
                        this.refresh();
                        if (typeof data === 'string' && data !== '')
                            data = JSON.parse(data);

                        if(typeof data.statuses !== 'undefined' && data.statuses.length > 0){
                            data.statuses.forEach((status) => {
                                alerts.alert('', status.type, status.msg);

                                if(status.afterNotifyFunction){
                                    if(typeof eval(status.afterNotifyFunction) === 'function')
                                        eval(status.afterNotifyFunction+'()');
                                    else
                                        console.warn('Typeof ' + status.afterNotifyFunction + ' is not a function');
                                }
                            });
                        }

                        if (data.error)
                            alerts.alert(translations.ERROR, 'error', data.description);
                        else
                            alerts.alert(translations.ITEMS_DELETED, 'success', '');
                    },
                });
            } else {
                let queue = [];
                let s_count = 0, t_count = 0;
                this.grid.rows({selected: true}).data().each((k) => {
                    t_count++;
                    queue.push(Helpers.ajax({
                        url: this.params.urls.deleteUrl,
                        data: {
                            data: '{ \"ID\":' + k.ID + '}'
                        },
                        success: function (data) {
                            if (data !== '' && typeof data === 'string')
                                data = JSON.parse(data);
                            if (!data.error)
                                s_count++;

                            if(typeof data.statuses !== 'undefined' && data.statuses.length > 0){
                                data.statuses.forEach((status) => {
                                    alerts.alert('ID: ' + k.ID, status.type, status.msg);

                                    if(status.afterNotifyFunction){
                                        if(typeof eval(status.afterNotifyFunction) === 'function')
                                            eval(status.afterNotifyFunction+'()');
                                        else
                                            console.warn('Typeof ' + status.afterNotifyFunction + ' is not a function');
                                    }
                                });
                            }
                        },
                    }));
                });
                let defer = $.when.apply($, queue);
                defer.done(() => {
                    this.refresh();
                    alerts.alert(translations.ITEMS_DELETED, 'success', s_count + ' / ' + t_count);
                });
            }
        }
    };

    /**
     * Vrací nastavení sloupce
     * @param {string} name Název sloupce
     * @returns {*}
     */
    getColumn(name) {
        return this.grid.column(name + ':name');
    };

    /**
     * Provede aktualizaci gridu
     */
    refresh(resetPaging = false) {
        if(this.params.dataSaveType === 'local') {
            this.grid.draw();
            return;
        }

        this.range.scroll = $(this.element).parent().scrollTop();
        this.recentItemIndex = this.getCurrentItemIndex();
        this.refreshing = true;
        if (typeof this.onBeforeRefresh === 'function'){
            if(this.onBeforeRefresh() === false){
                return;
            }
        }
        this.grid.ajax.reload(() => {
            if (typeof this.onAfterRefresh === 'function')
                this.onAfterRefresh()
            this.refreshing = false;
            this.onCurrentItemChanged();
        }, resetPaging);
    };

    /**
     * Vrací filtr naformátovaný pro URL
     */
    formatFilterUrl() {
        let str = "";
        for (let key in this.urlParameters) {
            if (str !== "") {
                str += "&";
            }
            str += key + "=" + this.urlParameters[key];
        }
        return str;
    }

    /**
     * Kopíruje URL s předfiltrovanými daty do schránky
     */
    copyFilterUrl() {
        Helpers.copyToClipboard(location.protocol + '//' + location.host + location.pathname + '?' + this.formatFilterUrl());
        alerts.alert(translations.COPY_FILTER_URL, 'info', translations.COPY_FILTER_URL_TEXT)
    }


    /**
     * Určení zda má grid rodičovský grid
     * @returns {boolean}
     */
    hasParentGrid() {
        return this.parentGrids.length !== 0;
    };

    /**
     * Vrací rodičovský grid
     * @returns {null|Grid}
     */
    getParentGrid() {
        console.warn('This function is deprecated. Use getParenGrids() insted.');

        if (this.parentGrids.length)
            return this.parentGrids[0];
        else
            return null;
    };

    getRelations(){
        return this.relations;
    }

    getParentGrids(){
        return this.parentGrids;
    }

    /**
     * Nastavuje potomka gridu
     * @param child
     */
    setChild(child) {
        this.childGrids.push(child);
    };

    /**
     * Vrací celkový počet řádků
     * @returns {int}
     */
    getItemCount() {
        return this.grid.rows().count();
    };

    /**
     * Vrací index aktuálně vybraného řádku
     * @returns {int|[]}
     */
    getCurrentItemIndex() {
        if (this.params.select === 'single')
            return this.grid.rows({selected: true}).indexes()[0];
        else
            return this.grid.rows({selected: true}).indexes().toArray();
    };

    /**
     * Vrací počet vybraných řádků
     * @returns {int}
     */
    getSelectedCount() {
        return this.grid.rows({selected: true}).count();
    }

    /**
     * Vrací řádek podle indexu
     * @param {int} index Index
     * @returns {{}}
     */
    getRowByIndex(index) {
        return this.grid.row(index);
    }

    /**
     * Vybírá řádek dle hodnoty ve sloupci
     * @param {string} column Sloupec
     * @param {string} value Hledaná hodnota
     */
    selectRowBy(column, value) {
        let rowIndex = this.grid.rows().data().map(item => {
            return item[column];
        }).indexOf(value);
        this.getRowByIndex(rowIndex).select();
    }

    /**
     * Event při změně vybraného řádku
     */
    onCurrentItemChanged() {
        if (this.childGrids.length !== 0) {
            this.childGrids.forEach((g) => {
                g.onParentItemChanged();
            })
        }
    };

    /**
     * Event při změně řádku v rodičovském gridu
     */
    onParentItemChanged() {
        this.relations.forEach((relation) => {
            let child = window[relation.grid].getCurrentItem();

            if (!child)
                this.setUrlParameter(relation.column, '-1');
            else{
                if(Array.isArray(child))
                    this.setUrlParameter(relation.column, child.map((item) => item[relation.child]));
                else
                    this.setUrlParameter(relation.column, child[relation.child]);
            }

        });


        this.refresh();
    };

    /**
     * Zobrazuje náhled řádku
     */
    preview = () => {
        let current = this.getCurrentItem();
        let dialog = new Dialog();
        dialog.title = translations.PREVIEW;
        dialog.enableCancelButton();
        let content = '';
        this.getColumnList().forEach((item) => {
            if (item.data !== 'Action' && item.data !== 'checkbox') {
                content += `
                   <h2>${item.label}</h2>`;
                if (item.columnInfo.format_function == null && item.columnInfo.format !== Grid.COLUMN_LONGTEXT)
                    content += item.render(current[item.mData], 'display', this.getCurrentItem(false), {});
                else
                    content += current[item.mData];
                content += `<hr>
               `;
            }
        });
        dialog.content = content;
        dialog.show();
    }

    static callRow(e, callback, args) {
        e = $(e);
        const grid = $(e).closest('table').attr('id');
        window[grid].unselectAllRows();
        window[grid].grid.row(e.closest('tr')).select();
        callback.call(null, args);
    }

    static headerClick(e) {
        if ($(e.currentTarget).hasClass('DTCR_tableHeaderHover')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        } else
            return true;
    }

    setOrder(column, order = 'asc') {
        this.grid.order(this.getColumn(column).index(), order.toLowerCase());
    }

    getName() {
        return this.name;
    }

    toogleSelectAllRows(){
        if(this.getSelectedCount()){
            this.unselectAllRows();
        }else{
            this.selectAllRows();
        }
    }

    selectRowsReverse(){
        let selectedRows = this.grid.rows({selected: true});
        let unselectedRows = this.grid.rows({selected: false});

        selectedRows.select(false);
        unselectedRows.select(true);
    }

    selectAllRows() {
        $(this.grid.header()[0]).find('.select-checkbox input[type="checkbox"]').prop('checked', true);
        this.grid.rows().select();
    }

    unselectAllRows(){
        $(this.grid.header()[0]).find('.select-checkbox input[type="checkbox"]').prop('checked', false);
        this.grid.rows().select(false);
    }

    updateMultiselectAllCount(count){
        $('#'+this.id+'_multipleSelectCount').text(count);

        if(count > 0){
            $('#'+this.id+'_multipleSelectCount').parent().removeClass('d-none');
        }else{
            $('#'+this.id+'_multipleSelectCount').parent().addClass('d-none');
        }
    }

    getSelectedRows(){
        return this.selectedRows;
    }

    getNextRow(){
        if (this.params.select === 'single')
            return this.grid.row(grid.getCurrentItemIndex()+1);
        else
            return this.grid.row(grid.getCurrentItemIndex()[0]+1);
    }

    getPrevRow(){
        if (this.params.select === 'single')
            return this.grid.row(grid.getCurrentItemIndex()-1);
        else
            return this.grid.row(grid.getCurrentItemIndex()[0]-1);
    }

    addRow(data, refresh = true){
        this.grid.row.add(data);
        if(refresh)
            this.refresh()
    }

    getRowByUniqueKeyValue(key, value){
        return this.grid.rows().every((rowIdx, tableLoop, rowLoop) => {
            let row = this.grid.row(rowIdx);

            if(row.data()[key] == value){
                return row;
            }
        });
    }

    updateRow(row, data){
        let newData = row.data()[0];
        if(Array.isArray(data)) {
            data.forEach((item, key) => {
                if (typeof item !== 'undefined')
                    newData[key] = item;
            })
        }else if(typeof data === 'object'){
            for (const [key, value] of Object.entries(data)) {
                if (typeof value !== 'undefined')
                    newData[key] = value;
            }
        }

        row.data(newData);
        row.invalidate().draw();
    }

    deleteRow(row){
        row.remove().draw();
    }

    exportDataToCSV(filtered = false){
        let data = {};
        if(filtered){
            data = this.urlParameters;
            delete data.count;
            delete data.start;
        }


        Helpers.ajax({
            url: this.params.urls.datalistUrl,
            data: data,
            success: (data) => {
                data = JSON.parse(data);
                data = data.items;
                let csvContent = "\uFEFF";
                const separator = ';';
                let header = '';

                data.forEach((row) => {
                    // row = Object.values(row);
                    let rowData = '';
                    let tmpHeader = '';

                    this.getColumnList().forEach((v) => {
                        if(v.name === 'actions' || v.name === 'checkbox')
                            return;

                        if(!v.visible)
                            return;

                        if(header === ''){
                            tmpHeader += v.label + separator;
                        }

                        if(typeof row[v.mData] !== 'undefined'){
                            if(v.enum_values) {
                                if(typeof v.enum_values[row[v.mData]] !== 'undefined')
                                    rowData += v.enum_values[row[v.mData]] + separator;
                                else
                                    rowData += '' + separator;
                            }else
                                rowData += this.colFormatter(row[v.mData], null, null,  v.columnInfo.format, null, true) + separator;
                        }else{
                            rowData += '' + separator;
                        }
                    });

                    if(header === ''){
                        if(tmpHeader !== ''){
                            tmpHeader += "\r\n";
                            header = tmpHeader;
                            csvContent += header;
                        }
                    }

                    csvContent += rowData + "\r\n";
                });

                var link = document.createElement("a");
                link.id="lnkDwnldLnk";

                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);

                let blob = new Blob([csvContent], { type: 'text/csv' });
                var csvUrl = window.webkitURL.createObjectURL(blob);
                var filename = this.id + '-' + Math.round(Date.now()/1000);  + '.csv';
                $("#lnkDwnldLnk")
                    .attr({
                        'download': filename,
                        'href': csvUrl
                    });

                $('#lnkDwnldLnk')[0].click();
                document.body.removeChild(link);
            }
        },true);
    }

    exportDataToPDF(filtered = false){
        let data = {};
        if(filtered){
            data = this.urlParameters;
            delete data.count;
            delete data.start;
        }


        Helpers.ajax({
            url: this.params.urls.datalistUrl,
            data: data,
            success: (data) => {
                data = JSON.parse(data);
                data = data.items;
                let header = null;
                let content = [
                    {
                        layout: 'lightHorizontalLines', // optional
                        table: {
                            // headers are automatically repeated if the table spans over multiple pages
                            // you can declare how many rows should be treated as headers
                            headerRows: 1,

                            body: [],
                        }
                    }
                ];

                data.forEach((row) => {
                    let tmpHeader = [];
                    let rowData = [];

                    this.getColumnList().forEach((v) => {
                        if(v.name === 'actions' || v.name === 'checkbox')
                            return;

                        if(!v.visible)
                            return;

                        if(header === null){
                            tmpHeader.push(v.label);
                        }

                        if(typeof row[v.mData] !== 'undefined'){
                            if(v.enum_values) {
                                if(typeof v.enum_values[row[v.mData]] !== 'undefined')
                                    rowData.push(v.enum_values[row[v.mData]]);
                                else
                                    rowData.push('');
                            }else
                                rowData.push(this.colFormatter(row[v.mData], null, null,  v.columnInfo.format, null, true));
                        }else{
                            rowData.push('');
                        }

                    });

                    if(header === null){
                        header= tmpHeader;
                        content[0].table.body.push(header);
                    }

                    content[0].table.body.push(rowData);
                });

                createPdf({
                    content: content, defaultStyle: {
                        fontSize: 8,
                    }
                }).open();
            }
        }, true);
    }

    setCounter(val) {
        if (isNaN(val))
            val = '-';
        $('#' + this.id + '_counter').text(val);
    }

    getSelected() {
        return this.grid.rows('.selected');
    }

    removeRow(row) {
        try {
            row.remove().draw();
        } catch (err) {
            
        }
    }

    removeAll() {
        this.grid.clear().draw()
    }

    removeSelected() {
        this.removeRow(this.getSelected());
    }

    getColumnByFormat(format) {
        let columns = [];
        this.getColumnList().forEach((column, index) => {
            if (typeof column.columnInfo === 'undefined')
                return;

            if (column.columnInfo.format === format) {
                columns.push(column);
            }
        });

        return columns;
    }

}