/*let getDataAttr = (element, attr) => {
    let data = element.getAttribute('data-' + attr);
    if (data === undefined)
        return '';
    else
        try {
            return JSON.parse(data);
        } catch (e) {
            return data
        }
};*/

class EntityEditor {
    /**
     * EntityEditor constructor
     * @param {string} editor_id ID elementu s editorem
     * @param {int|null} entity_id ID upravované entity
     * @param {string|null} entity_name_column Sloupec s názvem upravované entity
     */
    constructor(editor_id, entity_id, entity_name_column) {
        this.editor = document.getElementById(editor_id);
        this.datalistUrl = getDataAttr(this.editor, 'datalist-url');
        this.dataupdateUrl = getDataAttr(this.editor, 'dataupdate-url');
        this.datacreateUrl = getDataAttr(this.editor, 'datacreate-url');
        this.entity_id = entity_id;
        this.editor_id = editor_id;
        this.form = new Form(editor_id);
        this.panel = null;
        this.entity_name_column = entity_name_column;
        this.parent_entity = [];

        this.dataSaveType = getDataAttr(this.editor, 'data-save-type');
        if(this.dataSaveType === 'local') {
            this.forGrid = getDataAttr(this.editor, 'for-grid');
            this.local_tmp_id = getDataAttr(this.editor, 'local-tmp-id');
        }else{
            this.forGrid = null;
            this.local_tmp_id = null;
        }

        this.data = {};
        if ((this.entity_id !== null && this.entity_id !== '') || (this.local_tmp_id && this.local_tmp_id !== '')) {
            setTimeout(() => this.loadData(), 0)
        }
        this.onAfterShow = null;
        this.onBeforeConfirm = null;
        this.onAfterConfirm = null;
        this.onBeforeLoad = null;
        this.onAfterLoad = null;
        this.subGrids = [];
        this.relationSwitches = [];
        this.categoryTrees = [];

        this.entityIterator = null;
        this.loadedData = false;
        this.customData = getDataAttr(this.editor, 'custom-data', {});

        this.sendOnEnter = true;
        $(() => {
            if ((this.entity_id !== null && this.entity_id !== '') || (this.local_tmp_id && this.local_tmp_id !== ''))
                plugins.initPlugins(true);
            else
                plugins.initPlugins(true, true);

            $('[role="tab"]').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });
            if (typeof this.onAfterShow === 'function')
                this.onAfterShow();
            if (entity_id === '') {
                $(this.editor).closest('.entity-editor').find('[data-create="false"]').hide();
            } else {
                $(this.editor).closest('.entity-editor').find('[data-update="false"]').hide();
            }

            $(document).ready(() => {
                $(this.editor).keydown((event) => {
                    if(event.keyCode == 13 ) {
                        if($(event.target).prop('tagName') === "TEXTAREA")
                            return;

                        event.preventDefault();
                        if(this.sendOnEnter) {
                            if (!$(event.target).closest('.block-editor-holder').length)
                                this.confirm();
                        }
                    }
                });
            });


            $(this.form.form).find('input,select').change((e) => {
                $(window).off('beforeunload');
                if(this.isEdited()){
                    $(window).on('beforeunload', function(){
                        return true;
                    });
                }
            });


        });
    }

    /**
     * Nastavuje rodičovský panel
     * @param {Panel} panel
     */
    setPanel(panel) {
        this.panel = panel;
        this.panel.entityEditor = this;
    }

    /**
     * Určuje zda je editor v režimu úprav entity
     * @returns {boolean}
     */
    isEditing() {
        return (this.entity_id !== '' && this.entity_id !== null);
    }

    /**
     * Nastavuje rodičovskou entitu
     * @param {string} column Sloupec
     * @param {string} value Hodnota
     */
    setParentEntity(column, value) {
        this.parent_entity[column] = value;
        if (value !== "") {
            let parent = $('#' + this.editor.getAttribute('id') + ' [name="' + column + '"]');
            if (parent.length === 0) {
                $('#' + this.editor.getAttribute('id')).append('<input name="' + column + '" type="hidden">');
                parent = $('#' + this.editor.getAttribute('id') + ' [name="' + column + '"]');
            }
            parent.attr('readonly', 'readonly');
            parent.val(value);
        }
    }

    /**
     * Potvrdí odeslání editoru
     * @param {boolean} closePanel Určitění, zda se má panel při odeslání zavřít
     * @param {boolean} cont Určení, zda se ma při vytváření entity pokračovat v úpravách
     */
    confirm(closePanel = false, cont = false) {
        $(window).off('beforeunload');
        if (typeof this.onBeforeConfirm === 'function') {
            if (!this.onBeforeConfirm())
                return false;
        }

        if (this.form.validate()) {
            if(this.forGrid && this.dataSaveType === 'local'){
                const data = {
                    ...this.form.serializeArrayEntity(),
                }

                if(!this.local_tmp_id){
                    data['local_tmp_id'] = Date.now();
                    window[this.forGrid].addRow(data);
                }else{
                    const row = window[this.forGrid].getRowByUniqueKeyValue('local_tmp_id', this.local_tmp_id);
                    window[this.forGrid].updateRow(row, data);
                }


                this.confirmSuccess(true, data, false);
                return;
            }

            let filePromises = [];
            let isFile = false;
            $(this.form.getForm()).find('input[type="file"]').not('[multiple="multiple"]').each((i, e) => {
                let file_input = $(e);
                let promise = new Promise((resolve, reject) => {
                    let formData = new FormData();
                    if (!file_input.attr('multiple')) {
                        if (file_input[0].files.length > 0) {
                            isFile = true;
                            formData.append('uploadFile', file_input[0].files[0]);
                            formData.append('type', file_input.data('type'));
                            Helpers.ajax({
                                type: 'POST',
                                url: basePath+'/' + file_input.data('url'),
                                data: formData,
                                mimeTypes: "multipart/form-data",
                                contentType: false,
                                cache: false,
                                processData: false,
                                success: function (data) {
                                    file_input.attr('type', 'text');
                                    file_input.val(JSON.parse($(data).val()).items[0].ID);
                                    resolve(data);
                                },
                                error: err => reject(err)
                            });
                        } else {
                            isFile = false;
                        }
                    }
                });
                if (isFile) {
                    filePromises.push(promise);
                } else {
                    if (file_input.data('id') !== undefined) {
                        file_input.attr('type', 'text');
                        file_input.val(file_input.data('id'));
                    }
                }
            });

            Promise.all(filePromises).then((data) => {
                let _data = this.customData;
                _data = {..._data, ...this.serializeData()};

                Helpers.ajax({
                    type: 'POST',
                    url: (this.entity_id == '' || this.entity_id === null) ? this.datacreateUrl : this.dataupdateUrl,
                    data: {
                        data: JSON.stringify(_data),
                    },
                    success: (data) => {
                        let confirm = true;

                        if (typeof data === 'string')
                            data = JSON.parse(data);

                        if(typeof data.statuses !== 'undefined' && data.statuses.length > 0){
                            data.statuses.forEach((status) => {
                                if(!status.confirmAfterNotify)
                                    confirm = false;
                                alerts.alert('', status.type, status.msg);

                                if(status.afterNotifyFunction){
                                    if(typeof eval(status.afterNotifyFunction) === 'function')
                                        eval(status.afterNotifyFunction+'()');
                                    else
                                        console.warn('Typeof ' + status.afterNotifyFunction + ' is not a function');
                                }
                            });
                        }

                        if(confirm){
                            if(typeof data === 'object')
                                data = data.items;
                            if ($(this.form.form).find('[data-multiupload]').length > 0){
                                $(this.form.form).find('[data-multiupload]').each((i,e) => {
                                    if(typeof $(e).data('multiupload-url') !== 'undefined' && $(e).data('multiupload-url') !== ''){
                                        if ($(e).prop("files").length > 0) {
                                            let url = $(e).data('multiupload-url');
                                            let file_input = $(e);

                                            var ajaxes = [];
                                            var entity_ajaxes = [];
                                            $.each($(e).prop("files"), (k , v) => {
                                                let form_data = new FormData();
                                                let entity_id = data[0].ID;

                                                form_data.append("uploadFile", v);
                                                form_data.append("Entity_ID", entity_id);


                                                ajaxes.push(Helpers.ajax({
                                                    type: 'POST',
                                                    url: basePath+'/' + file_input.data('url'),
                                                    data: form_data,
                                                    mimeTypes: "multipart/form-data",
                                                    contentType: false,
                                                    cache: false,
                                                    processData: false,
                                                    success: (data) => {
                                                        file_input.attr('type', 'text');
                                                        file_input.val(JSON.parse($(data).val()).items[0].ID);

                                                        let d = this.serializeData();
                                                        d[url.identifier] = entity_id;

                                                        entity_ajaxes.push(Helpers.ajax({
                                                            type: 'POST',
                                                            url: url.url,
                                                            data:{
                                                                data: JSON.stringify(d),
                                                            },
                                                        }));
                                                    },
                                                    error: err => reject(err)
                                                }));
                                            });
                                            Promise.all(ajaxes).then(() => {
                                                Promise.all(entity_ajaxes).then(() => {
                                                    this.confirmSuccess(closePanel, data, cont);
                                                });
                                            });
                                        }else
                                            this.confirmSuccess(closePanel, data, cont);
                                    }else{
                                        if ($(e).prop("files").length > 0) {
                                            let ajaxes = [];
                                            let ajaxes_obj = [];
                                            $.each($(e).prop("files"), (k, v) => {
                                                if(data) {
                                                    let form_data = new FormData();
                                                    form_data.append("uploadFile", v);
                                                    form_data.append("Entity_ID", data[0].ID);
                                                    ajaxes.push(Helpers.ajax({
                                                        url: basePath + '/' + $(e).data('url'),
                                                        type: "POST",
                                                        data: form_data,
                                                        mimeTypes: "multipart/form-data",
                                                        contentType: false,
                                                        cache: false,
                                                        processData: false,
                                                    }));
                                                    data = null;
                                                }else{
                                                    let _data = this.customData;
                                                    _data = {..._data, ...this.serializeData()};

                                                    ajaxes_obj.push(Helpers.ajax({
                                                        type: 'POST',
                                                        url: (this.entity_id == null || this.entity_id === null) ? this.datacreateUrl : this.dataupdateUrl,
                                                        data: {
                                                            data: JSON.stringify(_data),
                                                        },
                                                        success: (data) => {
                                                            if (typeof data === 'string')
                                                                data = JSON.parse(data);
                                                            if(typeof data === 'object')
                                                                data = data.items;
                                                            let form_data = new FormData();
                                                            form_data.append("uploadFile", v);
                                                            form_data.append("Entity_ID", data[0].ID);
                                                            ajaxes.push(Helpers.ajax({
                                                                url: basePath + '/' + $(e).data('url'),
                                                                type: "POST",
                                                                data: form_data,
                                                                mimeTypes: "multipart/form-data",
                                                                contentType: false,
                                                                cache: false,
                                                                processData: false,
                                                            }));
                                                        }
                                                    }));
                                                }
                                            });
                                            Promise.all(ajaxes_obj).then(() => {
                                                Promise.all(ajaxes).then(() => {
                                                    this.confirmSuccess(closePanel, data, cont);
                                                });
                                            });
                                        } else
                                            this.confirmSuccess(closePanel, data, cont);
                                    }
                                });
                            } else {
                                this.confirmSuccess(closePanel, data, cont);
                            }
                        }
                    }
                })
            });
        } else {
            let tab = this.form.invalidFields[0].closest('.tab-pane');
            $('#' + tab.attr('id') + '-link').tab('show');
        }
    }

    confirmSuccess(closePanel, data, cont = false) {
        if (typeof this.onAfterConfirm === 'function')
            this.onAfterConfirm(data, closePanel);
        alerts.alert(translations.EDIT_DONE, 'success', '');
        if (closePanel)
            if (this.panel !== null) {
                if (cont)
                    this.panel.close('continue', data);
                else
                    this.panel.close(null, data);
            } else {
                $('#hard-loader').addClass('show');
                setTimeout(() => {
                    window.location.href = $('#' + this.editor.getAttribute('id') + '_back').attr('href');
                })
            }
    }

    /**
     * Načte entity data do editoru
     */
    loadData() {
        if (typeof this.onBeforeLoad === 'function')
            this.onBeforeLoad();

        if(this.dataSaveType === 'local' && this.forGrid){
            const data = window[this.forGrid].getRowByUniqueKeyValue('local_tmp_id', this.local_tmp_id).data()[0];
            this.initData(data);
            return;
        }
        this.loadedData = false;

        Helpers.ajax({
            type: 'GET',
            url: this.datalistUrl + this.entity_id + '&full=true',
            dataType: 'json',
            success: (data) => {
                if (data.items.length === 0) {
                    window.location.replace(basePath + '/404');
                    return;
                }
                data = data.items[0];

                this.initData(data);
                plugins.initPlugins();
                for (const [name, input] of Object.entries(this.form.getInputObjectsByType(BlockEditor))){
                    input.loadDataFromDataInput();
                }

                this.loadedData = true;
            }
        }, true)
    }

    setSendOnEnter(send){
        this.sendOnEnter = send;
    }

    isEdited(){
        if(!this.loadedData)
            return false;

        for (let [key, value] of Object.entries(this.data)){
            if(this.form.getInput(key).length){
                if((value === 'null' && this.form.getValue(key) === null)){
                    continue;
                }

                if((value === null && this.form.getValue(key) === 'null')){
                    continue;
                }

                if(this.form.getInput(key).data('currency') == '1'){
                    value = (value / 100).toString();
                }

                if(value !== this.form.getValue(key)){
                    if(this.form.getInput(key).attr('type') === 'file'){
                        if(value){
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            }
        };
        return false;
    }

    refreshSubGrids(){
        this.subGrids.forEach((subGrid) => {
           subGrid.refresh();
        });
    }

    refreshRelationSwitches(){
        this.relationSwitches.forEach((relationSwitch) => {
            relationSwitch.parent_id = this.entity_id;
            relationSwitch.refresh();
        });
    }

    refreshCategoryTrees(){
        this.categoryTrees.forEach((categoryTree) => {
            categoryTree.entity_id = this.entity_id;
            categoryTree.loadData();
        });
    }

    gotoNext(){
        const newEntity_id = this.entityIterator.next();

        if(!this.entityIterator.hasNext())
            $('#'+this.editor_id+'_editor_next_entity_button').addClass('disabled');
        else
            $('#'+this.editor_id+'_editor_next_entity_button').removeClass('disabled');


        if(!this.entityIterator.hasPrev())
            $('#'+this.editor_id+'_editor_prev_entity_button').addClass('disabled');
        else
            $('#'+this.editor_id+'_editor_prev_entity_button').removeClass('disabled');

        $('#'+this.editor_id+'_editor_iterator_current').text(this.entityIterator.currentIndex+1);


        if(newEntity_id){
            this.entity_id = newEntity_id;
            this.panel.setUrl(location.pathname, newEntity_id, true);
            this.loadData();
            this.refreshSubGrids();
            this.refreshRelationSwitches();
            this.refreshCategoryTrees();
        }
    }

    gotoPrev(){
        const newEntity_id = this.entityIterator.prev();

        if(!this.entityIterator.hasNext())
            $('#'+this.editor_id+'_editor_next_entity_button').addClass('disabled');
        else
            $('#'+this.editor_id+'_editor_next_entity_button').removeClass('disabled');

        if(!this.entityIterator.hasPrev())
            $('#'+this.editor_id+'_editor_prev_entity_button').addClass('disabled');
        else
            $('#'+this.editor_id+'_editor_prev_entity_button').removeClass('disabled');

        $('#'+this.editor_id+'_editor_iterator_current').text(this.entityIterator.currentIndex+1);

        if(newEntity_id) {
            this.entity_id = newEntity_id;
            this.panel.setUrl(location.pathname, newEntity_id, true);
            this.loadData();
            this.refreshSubGrids();
            this.refreshRelationSwitches();
            this.refreshCategoryTrees();
        }
    }

    initData(data){
        this.data = data;
        let data_items = Object.keys(data);
        data_items.filter(item => typeof data[item] == 'object' && data[item] !== null).forEach((v) => {
            data_items = [...data_items, ...(Object.keys(data[v]).map(item => {
                return v + '[' + item + ']'
            }))];
        });

        $(this.editor).find(':input').each((i, e) => {
            e = $(e);
            if (data_items.includes(e.attr('name'))) {
                let value;
                if (e.attr('name').includes('[')) {
                    value = data[e.attr('name').replace(/ *\[[^)]*\] */g, "")][e.attr('name').match(/\[(.*)\]/)[1]]
                } else
                    value = data[e.attr('name')];
                if (e.attr('type') === 'checkbox')
                    e.prop('checked', Boolean(Number(value)));
                else if (e.attr('type') === 'radio') {
                    if (value === e.val())
                        e.prop('checked', true);
                } else if (e.prop('tagName') === 'SELECT') {
                    if (e.data('store') === undefined) {
                        e.val(value ?? 'null').trigger('change');
                        $("[column='" + e.attr('name') + "']").text(value);
                    }else{
                        let $newOption;
                        if(this.dataSaveType === 'local'){
                            $newOption = $("<option selected='selected'>" + this.data[e.attr('name') + '_storefield'] + "</option>").val(value ?? 'null').text(this.data[e.attr('name') + '_storefield']);
                        }else{
                            $newOption = $("<option selected='selected'>" + this.data[e.data('storefield')] + "</option>").val(value ?? 'null').text(this.data[e.data('storefield')]);
                        }
                        e.append($newOption).trigger('change');
                    }
                } else if (e.prop('tagName') === 'TEXTAREA') {
                    if (tinymce.get(e.attr('id')) != null) {
                        if(value === null)
                            value = '';
                        e.val(value);
                        tinymce.get(e.attr('id')).setContent(value);
                    } else {
                        e.val(value);
                        if(e.attr('blockeditor') && (value !== null && value !== '')){
                            grapesjs.editors.forEach((editor) => {
                                if($(editor.getEl()).parent().hasClass('block-editor')){
                                    let name = $(editor.getEl()).parent().parent().attr('blockeditordata');
                                    if(typeof name !== 'undefined' && name === e.attr('blockeditor')){
                                        try {
                                            editor.loadData(JSON.parse($("[name='"+name+"']").val()));
                                        } catch {}
                                    }
                                }
                            });
                        }
                    }
                } else if (e.attr('type') === 'text' && e.hasClass('datepicker')) {
                    let date = moment(value, 'YYYY-MM-DD');
                    e.data("DateTimePicker").date(date);
                } else if (e.attr('type') === 'text' && e.hasClass('datetimepicker')) {
                    let date = moment(value, 'YYYY-MM-DD HH:mm:ss');
                    e.data("DateTimePicker").date(date);
                } else if (e.attr('type') === 'file') {
                    let input_value;
                    if (e.attr('name').includes('[')) {
                        input_value = data[e.attr('name').split('[')[0]][e.attr('name').split('[')[1].slice(0, -1)]
                    } else
                        input_value = data[e.attr('name')];
                    if (input_value !== null) {
                        e.data('id', input_value)
                        let fname = '';
                        if (data[e.attr('name') + '_Name'] !== undefined && data[e.attr('name') + '_Extension'] !== undefined)
                            fname = data[e.attr('name') + '_Name'] + '.' + data[e.attr('name') + '_Extension'];
                        else {
                            fname = 'Download';
                            console.warn('Please add ' + e.attr('name') + '_Name and ' + e.attr('name') + '_Extension to manager to get uploaded file name');
                        }

                        $(this.editor).find("[data-imgpreview='" + e.attr('name') + "']").attr('src', window.location.origin + $(this.editor).find("[data-imgpreview='" + e.attr('name') + "']").data('imgpath') + fname);

                        e.parent().find('div').remove();

                        if(e.data("folder")){
                            let folder = e.data("folder");
                            e.after(`<div>${translations.CURRENT_FILE}: <a href="${basePath}/common/file/download?ID=${value}&Folder=${folder}" target="_blank">${fname}</a> - <a href="javascript:;" onclick="window['${this.editor.getAttribute('id')}'].form.getInput('${e.attr('name')}').trigger('resetFile');" class="text-red">${translations.REMOVE}</a></div>`);
                        }
                        else
                            e.after(`<div>${translations.CURRENT_FILE}: <a href="${basePath}/common/file/download?ID=${value}" target="_blank">${fname}</a> - <a href="javascript:;" onclick="window['${this.editor.getAttribute('id')}'].form.getInput('${e.attr('name')}').trigger('resetFile');" class="text-red">${translations.REMOVE}</a></div>`);
                    }
                } else if (e.attr('type') === 'number' && e.data('currency') === 1){
                    e.val(Math.floor(parseFloat(value))/100);
                } else {
                    e.val(value);
                }


            }

        });
        if (this.entity_name_column !== undefined)
            $('.entity_name').text(data[this.entity_name_column]);
        if (typeof this.onAfterLoad === 'function') {
            setTimeout(() => {
                this.onAfterLoad();
            }, 0);
        }

        $(this.editor).find('*[column]').each((index, e) => {
            e = $(e);
            e.text(this.data[e.attr('column')]);
        });
    }

    serializeData(type){
        let data = this.form.serializeArrayEntity();

        this.subGrids.forEach((grid) => {
            if(grid.params.dataSaveType === 'local'){
                data[grid.params.dataSaveParams['managerAlias']] = {};
                if(!grid.grid.data().toArray().ID)
                    data[grid.params.dataSaveParams['managerAlias']]['new'] = grid.grid.data().toArray();
                else
                    data[grid.params.dataSaveParams['managerAlias']]['modified'] = grid.grid.data().toArray();
            }
        });

        return data;
    }

    hideTab(id){
        $('#tab-' + id).addClass('d-none');
        $('#tab-nav-' + id).addClass('d-none');
    }

    showTab(id){
        $('#tab-' + id).removeClass('d-none');
        $('#tab-nav-' + id).removeClass('d-none');
    }

    setCreateDefaultValues(values){
        if(this.entity_id)
            return;

        if(typeof values !== 'object')
            return;

        Object.entries(values).forEach((key, index) => {
           this.form.setValue(key[0], key[1]);
        });
    }

    setCustomData(key, val){
        this.customData[key] = val;
    }

    getCustomData(key = null){
        if(key)
            return this.customData[key];
        else
            return this.customData;
    }
}
