class Import {
    constructor(uid) {
        window[`import_${uid}`] = this;

        this.initialized = false;
        this.id = uid;
        this.element = document.getElementById('import_' + uid);
        this.type = null;
        this.handleUrl = null;

        /** @type {Grid|null} fileGrid */
        this.fileGrid = null;
        this.form = null;
        this.uploadAjax = null;
        this.ajaxes = {};
        this.completeTimout = null;
        this.localStargeKey = null;
        this.columns = {};
        this.outputFile = null;
        this.returnBlob = false;

        this.onAfterUpload = null;
        this.onProgress = null;
        this.onAfterSelect = null;
        this.onAfterUnselect = null;
    }

    init() {
        this.localStargeKey = 'importSelected[' + this.type + ']';

        this.fileGrid = window["import_" + this.id + '_datagrid'];
        this.form = window["import_" + this.id + '_form'];

        this.handleSelect();

        $(() => {
            this.bindEvents();
        });
    }

    bindEvents() {
        $(this.element).find('input#input_' + this.id).on('change', (ev) => {
            this.uploadFile(ev);
        });

        $(this.element).find('#list_' + this.id).on('click', (ev) => {
            this.showList();
        });

        $(this.element).find('.import__reset').on('click', (ev) => {
            this.resetSelected();
        });

        this.fileGrid.onDblClick = (ev) => {
            this.setSelected(this.fileGrid.getCurrentItemValue('fileName'));
        }

        $(this.element).on('submit', this.form.form, this.submit);
        $(this.element).on('click', `#import_${ this.id }_submit`, this.submit);
        $(this.element).on('click', 'button[data-download-output]', this.downloadOutputFile);
    }

    bindSelected() {
        plugins.initBsTooltip();

        $(this.element).find('.import__selected__item__data__table__select[data-data]').select2({
            width: '100%',
            allowClear: true,
            placeholder: (translations.SELECT ?? '-'),
            escapeMarkup: (markup) => markup,
            templateResult: this.templateSelect2,
            templateSelection: this.templateSelect2
        }).on('select2:open', () => {
            setTimeout(() => {
                plugins.initBsTooltip();
            }, 0);
        }).on('select2:close', () => {
            plugins.initBsTooltip();
        })

        $(this.element).find('.import__selected__item__data__table__select[data-data]').each((ind, el) => {
            $(el).val($(el).data('selected')).trigger('change');
        });

        // $(this.element).find('.import__selected__item__data__table__select[data-data]').on('change', (ev) => {
        //     console.log(this.getMapped());
        // });

    }

    templateSelect2 = (item) => {
        if (item.description) {
            return `<div class="${item.important ? 'text-danger' : null}" title="${item.description}" data-toggle="bstooltip">${item.text}</div>`;
        } else {
            return `<div class="${item.important ? 'text-danger' : null}">${item.text}</div>`;
        }
    }

    uploadFile(ev) {
        let file = ev.currentTarget.files[0];

        let formdata = new FormData();
        formdata.append("file", file);
        formdata.append("type", this.getType());


        if (this.uploadAjax) {
            this.uploadAjax.abort();
            this.uploadAjax = null;
        }

        if (file === undefined)
            return;

        this._setProgress();

        this.uploadAjax = new XMLHttpRequest();
        this.uploadAjax.upload.addEventListener("progress", (ev) => {
            this.handleProgress(ev);
        }, false);
        this.uploadAjax.addEventListener("load", (ev) => {
            this.handleComplete(ev);
        }, false);
        this.uploadAjax.addEventListener("error", (ev) => {
            this.handleError(ev);
        }, false);
        this.uploadAjax.addEventListener("abort", (ev) => {
            this.handleAbort(ev);
        }, false);
        this.uploadAjax.open("POST", this.handleUrl ?? "");
        this.uploadAjax.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        this.uploadAjax.send(formdata);

        ev.currentTarget.value = "";
    }

    /**
     * @param {number|null} percent
     * @param {string} status
     * @param {string} color
     * @private
     */
    _setProgress(percent = 0, status = '0%', color = '#00a34b') {
        $(this.element).find('.import__progress').stop().slideDown(50);
        if (percent !== null)
            $(this.element).find('.import__progress').css('--percentage', percent);
        $(this.element).find('.import__progress').attr('data-status', status);
        $(this.element).find('.import__progress').css('--status-color', color);
    }

    _hideProgress() {
        $(this.element).find('.import__progress').stop().slideUp(500);
    }

    handleProgress(ev) {
        clearTimeout(this.completeTimout);

        let percent = Math.round((ev.loaded / ev.total) * 100);
        this._setProgress(percent, percent + '%');
    }

    handleComplete(ev) {
        this.uploadAjax = null;
        clearTimeout(this.completeTimout);

        if (ev.currentTarget.status !== 200) {
            this.handleError(ev);
            return;
        }

        let data = JSON.parse(ev.target.responseText);

        this.completeTimout = setTimeout(() => {
            this.setSelected(data.filename);
            this.updateCount();
        }, 0);
    }

    handleError() {
        clearTimeout(this.completeTimout);

        this._setProgress(null, translations.ERROR, '#c91313');
    }

    handleAbort() {
        clearTimeout(this.completeTimout);

        this._setProgress(null, translations.ABORTED, '#c96513');
    }

    /**
     * Zobrazit/Skrýt uploader
     * @param {boolean|null} show
     * @returns {Import}
     */
    toggleUploader(show = null) {
        if (show === null) {
            return this.toggleUploader($(this.element).find('.import__uploader').is(':visible'));
        }
        if (show === true)
            $(this.element).find('.import__uploader').stop().slideDown(150);
        else if (show === false)
            $(this.element).find('.import__uploader').stop().slideUp(150);

        this.updateCount();

        return this;
    }

    /**
     * Zobrazit/Skrýt zvolené
     * @param {boolean|null} show
     * @returns {Import}
     */
    toggleSelected(show = null) {
        if (show === null) {
            return this.toggleSelected($(this.element).find('.import__selected').is(':visible'));
        }
        if (show === true) {
            $(this.element).find('button[data-download-output]').stop().hide();
            $(this.element).find('.import__selected').stop().slideDown(150);
            this._runFunction('generateDataTable', (data) => {
                $(this.element).find('.import__selected__item__data').html(data);
                this.bindSelected();

                if (typeof this.onAfterSelect === 'function') {
                    this.onAfterSelect();
                }
            });
        } else if (show === false) {
            $(this.element).find('.import__selected').stop().slideUp(150, () => {
                if (typeof this.onAfterUnselect=== 'function') {
                    this.onAfterUnselect();
                }
            });
        }

        return this;
    }

    /**
     * Zobrazit/Skrýt zvolené
     * @param {boolean|null} show
     * @returns {Import}
     */
    toggleList(show = null) {
        if (show === null) {
            return this.toggleList($(this.element).find('.import__list__file').is(':visible'));
        }
        if (show === true) {
            $(this.element).find('.import__list__file').stop().slideDown(150);
            this.onListOpen();
        } else if (show === false)
            $(this.element).find('.import__list__file').stop().slideUp(150);

        return this;
    }

    /**
     * Vrátí zvolený soubor
     * @returns {string}
     */
    getSelected() {
        return window.localStorage.getItem(this.localStargeKey);
    }

    /**
     * Nastaví zvolený soubor
     * @param {string|null} value
     * @returns {Import}
     */
    setSelected(value) {
        if (value) {
            window.localStorage.setItem(this.localStargeKey, value);
        } else {
            window.localStorage.removeItem(this.localStargeKey);
        }

        this._hideProgress();

        return this.handleSelect();
    }

    /**
     * Handler pro zobrazení tabu
     * @returns {Import}
     */
    handleSelect() {
        let selected = this.getSelected();
        if (selected) {
            this.toggleUploader(false);
            this.toggleSelected(true);
            this.toggleList(false);
            $(this.element).find('.import__selected__item__filename').text(selected);
        } else {
            this.toggleUploader(true);
            this.toggleSelected(false);
            this.toggleList(false);
            $(this.element).find('.import__selected__item__filename').text('-');
        }

        return this;
    }

    /**
     * Resetuje nastavenou hodnotu
     * @returns {Import}
     */
    resetSelected() {
        return this.setSelected(null);
    }

    /**
     * Nastavuje unikátní typ
     * @param {string} type
     */
    setType(type) {
        this.type = type;
        return this;
    }

    /**
     * Vrací unikátní typ
     * @returns {null}
     */
    getType() {
        return this.type;
    }

    /**
     * Nastavuje handle URL
     * @param {string|null} handleUrl
     */
    setHandleUrl(handleUrl) {
        this.handleUrl = handleUrl;
        return this;
    }

    /**
     * Vrací handle URL
     * @returns {string|null}
     */
    getHandleUrl() {
        return this.handleUrl;
    }

    /**
     * Zobrazí seznam souboru
     */
    showList() {
        this.toggleUploader(false);
        this.toggleSelected(false);
        this.toggleList(true);
    }

    /**
     * Callback při otevření seznamu souborů
     */
    onListOpen() {
        this.clearItems();

        this._runFunction('getFiles', (data) => {
            this.setItems(data);
        }, () => {
            this.resetSelected();
        });
    }

    /**
     * Načte soubory
     */
    refreshFiles() {
        this.clearItems();

        this._runFunction('getFiles', (data) => {
            this.setItems(data);
        });
    }

    /**
     * Spustí funkci
     * @param {string} functionName
     * @param {function|null} onSuccess
     * @param {function|null} onError
     * @param {function|null} onComplete
     * @param {object|null|*} data
     * @param {object|null|*} customOptions
     * @param {boolean} returnsBlob
     * @private
     */
    _runFunction(functionName, onSuccess, onError, onComplete, data = null, customOptions = null, returnsBlob = false) {
        let _data = {
            'function': functionName,
            'fileName': this.getSelected(),
            'type': this.getType(),
        };

        if (typeof data === 'object') {
            _data = $.extend(_data, data);
        }

        let options = {
            url: this.handleUrl ?? window.location.href,
            processData: false,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(_data),
            success: (data, status, xhr) => {
                if (typeof onSuccess === "function")
                    onSuccess(data, status, xhr);
            },
            error: (err) => {
                if (typeof onError === "function")
                    onError(err);
            },
            complete: () => {
                if (typeof onComplete === "function")
                    onComplete();
            }
        };

        if (typeof customOptions === 'object') {
            options = $.extend(options, customOptions);
        }

        // Nastavení pro binární data podle parametru returnsBlob
        if (returnsBlob) {
            options.xhrFields = {
                responseType: 'arraybuffer'
            };
        }

        if (this.ajaxes[functionName])
            this.ajaxes[functionName].abort();

        this.ajaxes[functionName] = $.ajax(options);
    }

    /**
     * Vyčistí grid souborů
     */
    clearItems() {
        this.fileGrid.removeAll();
    }

    /**
     * Nastaví data gridu
     * @param {array|null} data
     */
    setItems(data) {
        for (let i in data) {
            this.fileGrid.addRow(data[i]);
        }
        this.setCounter(data.length);
    }

    /**
     * Nastaví počet souborů
     * @param val
     */
    setCounter(val) {
        this.fileGrid.setCounter(val);
        $(this.element).find('.import__list__count').text(val);
    }

    /**
     * Aktualizovat počet souborů
     */
    updateCount() {
        this._runFunction('getFileCount', (data) => {
            if (!isNaN(data))
                this.setCounter(data);
        })
    }

    /**
     * Vraci namapovane sloupce na indexy
     * @returns {string[]}
     */
    getMapped() {
        let selected = [];
        $(this.element).find('.import__selected__item__data__table__select').each((ind, el) => {
            if (el.value !== "")
                selected[$(el).data('index')] = el.value;
        });

        return selected;

    }

    /**
     * Stáhne vybraný soubor z gridu
     */
    downloadFile = () => {
        let currentItem = this.fileGrid.getCurrentItem();
        if (!currentItem)
            return;

        this._download('downloadFile', currentItem.fileName);
    }

    /**
     * Smaže soubor z gridu
     */
    deleteFile = () => {
        let currentItem = this.fileGrid.getCurrentItem();
        if (!currentItem)
            return;

        let currentFile = currentItem.fileName;
        let row = this.fileGrid.getSelected();

        document.getElementById('hard-loader').classList.add('show');
        this._runFunction('deleteFile', (data) => {
            this.fileGrid.removeRow(row);
        }, (err) => {
            alerts.error();
            console.error(err);
        }, () => {
            document.getElementById('hard-loader').classList.remove('show');
        }, {'fileName': currentFile});
    }

    /**
     * Provede import
     * @param {Event} ev
     * @returns {boolean}
     */
    submit = (ev) => {
        ev.preventDefault();

        let selectedColumns = this.getSelectedColumns();
        let columns = this.getColumns();
        let downloadOutput = $(this.element).find('button[data-download-output]');

        let missingImportant = [];
        for (let i in columns) {
            if (!columns[i].important)
                continue;

            if (!(Object.values(selectedColumns).indexOf(columns[i].id) > -1)) {
                missingImportant.push(columns[i].text ?? columns[i].id);
            }
        }

        if (missingImportant.length) {
            alerts.alert(translations.MISSING_IMPORTANT, 'error', missingImportant.join(', '));
            return false;
        }

        let data = {
            columns: selectedColumns,
            form: Object.fromEntries((new FormData(this.form.form)).entries())
        };

        this._runFunction('importFile', (successData, status, xhr) => {
            if (xhr.getResponseHeader('Content-Disposition')?.includes('attachment')) {
                let filename = "";
                let disposition = xhr.getResponseHeader('Content-Disposition');
                if (disposition) {
                    let matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
                    if (matches?.[1]) filename = matches[1].replace(/['"]/g, '');
                }
                
                let blob = new Blob([successData], { type: xhr.getResponseHeader('Content-Type') || 'application/zip' });
                let URL = window.URL || window.webkitURL;
                let downloadUrl = URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = downloadUrl;
                a.download = filename || 'export.zip';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);
            } else {
                if (successData.msg) {
                    alerts.alert(successData.msg, successData.error ? 'error' : 'info', successData.debug ?? '');
                    if (successData.trace) {
                        console.log(successData.debug ?? '-');
                        console.table(successData.trace);
                    }
                } else {
                    console.info('DATA:', successData);
                }

                if (!successData.error && successData.outputFile) {
                    console.log(successData.outputFile);
                    this.outputFile = successData.outputFile;
                    downloadOutput.stop().show();
                } else {
                    downloadOutput.stop().hide();
                }
            }
        }, (err) => {
            alerts.error();
            console.error(err);
            console.log(err.state());
        }, null, data, null, this.getReturnBlob());
    }

    downloadOutputFile = () => {
        if (!this.outputFile)
            return;

        this._download('downloadOutputFile', this.outputFile);
    }

    /**
     * Stáhne soubor přes AJAX
     * @param {string} functionName
     * @param {string|null} fileName
     * @param {function|null} onError
     * @private
     */
    _download(functionName, fileName, onError = null) {
        if (!fileName)
            return;

        document.getElementById('hard-loader').classList.add('show');
        this._runFunction(functionName, (data, status, xhr) => {
            let filename = "";
            let disposition = xhr.getResponseHeader('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                let matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
            }

            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                window.navigator.msSaveBlob(blob, filename);
            } else {
                let URL = window.URL || window.webkitURL;
                let downloadUrl = URL.createObjectURL(data);

                if (filename) {
                    let a = document.createElement("a");
                    if (typeof a.download === 'undefined') {
                        window.location.href = downloadUrl;
                    } else {
                        a.href = downloadUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                    }
                } else {
                    window.location.href = downloadUrl;
                }

                setTimeout(function () {
                    URL.revokeObjectURL(downloadUrl);
                }, 100);
            }
        }, onError, () => {
            document.getElementById('hard-loader').classList.remove('show');
        }, {'fileName': fileName}, {
            xhrFields: {
                responseType: 'blob'
            }
        });
    }

    /**
     * Vrátí zvolené sloupce
     * @returns {{}}
     */
    getSelectedColumns() {
        let columns = {};
        $(this.element).find('.import__selected__item__data__table select[data-index]').each((ind, elem) => {
            if (elem.value)
                columns[elem.dataset.index] = elem.value;
            else
                columns[elem.dataset.index] = null;
        });

        return columns;
    }

    /**
     * Nastaví sloupce
     * @param columns
     */
    setColumns(columns) {
        this.columns = columns;
    }

    /**
     * Vrátí sloupce
     * @returns {*|{}}
     */
    getColumns() {
        return this.columns;
    }

    /**
     * Nastaví, zda má funkce vracet blob
     * @param {boolean} value
     * @returns {Import}
     */
    setReturnBlob(value) {
        this.returnBlob = value;
        return this;
    }

    /**
     * Vrátí, zda má funkce vracet blob
     * @returns {boolean}
     */
    getReturnBlob() {
        return this.returnBlob;
    }
}