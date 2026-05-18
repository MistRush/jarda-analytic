import EntityEditor from "@/Components/EntityEditor/js/EntityEditor";

export default class QuickEditor extends EntityEditor{

    constructor(quickEditorDef) {
        super(quickEditorDef);
        // this.dialog = null
    }

    get dialog() {
        return this.entityEditorDef.dialog;
    }

    set dialog(value) {
        this.entityEditorDef.dialog = value;
    }

    setParentEntity(column, value) {
    }

    /**
     * Nastavuje dialog
     * @param {string} dialog ID dialogu
     */
    setDialog(dialog) {
        this.dialog = window[dialog];
    }

    /**
     * Potvrzuje a odešle data editoru
     */
    confirm() {
        $(window).off('beforeunload');
        if (typeof this.onBeforeConfirm == "function")
            this.onBeforeConfirm();
        if (this.form.validate()) {
            if(this.forGrid && this.dataSaveType === 'local'){
                const data = {
                    ...this.form.serializeArrayEntity(),
                }

                if(!this.local_tmp_id){
                    data['ID'] = null;
                    data['local_tmp_id'] = Date.now();
                    window[this.forGrid].addRow(data);
                }else{
                    const row = window[this.forGrid].getRowByUniqueKeyValue('local_tmp_id', this.local_tmp_id);
                    window[this.forGrid].updateRow(row, data);
                }


                this.confirmSuccess();
                return;
            }

            let filePromises = [];
            let isFile = false;
            $(this.form.getForm()).find('input[type="file"]').each((i,e) => {
                let file_input = $(e);
                let promise = new Promise((resolve, reject) => {
                    let formData = new FormData();
                    if (!file_input.attr('multiple')) {
                        if (file_input[0].files.length > 0) {
                            isFile = true;
                            formData.append('uploadFile', file_input[0].files[0]);
                            formData.append('type', file_input.data('type'))
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
                        }
                    }
                });
                if (isFile)
                    filePromises.push(promise);
                else {
                    if (file_input.data('id') !== undefined) {
                        file_input.attr('type', 'text');
                        file_input.val(file_input.data('id'));
                    }
                }
            });
            Promise.all(filePromises).then((data) => {
                let _data = this.customData;
                _data = {..._data, ...this.form.serializeArrayEntity()};

                Helpers.ajax({
                    type: 'POST',
                    url: (this.entity_id == null) ? this.datacreateUrl : this.dataupdateUrl,
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

                                                        let d = this.form.serializeArrayEntity();
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
                                                    this.confirmSuccess();
                                                });
                                            });
                                        }else
                                            this.confirmSuccess();
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
                                                    _data = {..._data, ...this.form.serializeArrayEntity()};

                                                    ajaxes_obj.push(Helpers.ajax({
                                                        type: 'POST',
                                                        url: (this.entity_id == null) ? this.datacreateUrl : this.dataupdateUrl,
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
                                                    this.confirmSuccess();
                                                });
                                            });
                                        } else
                                            this.confirmSuccess();
                                    }
                                });
                            } else {
                                this.confirmSuccess();
                            }
                        }
                    }
                })
            });
        }
    }

    confirmSuccess() {
        if (typeof this.onAfterConfirm == "function")
            this.onAfterConfirm();
        $(window).off('beforeunload');
        window[this.editor_id] = null;
        alerts.alert(translations.EDIT_DONE, 'success', '');
        this.dialog.close();
    }
}