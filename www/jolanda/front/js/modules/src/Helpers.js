class Helpers {
    static lockAjaxes = [];
    /**
     *
     * @param {function} callback Callback
     * @param context
     * @param {int} wait Zpožední v ms
     * @returns {function(...[*]=)}
     */
    static delay(callback, context, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => callback.apply(context, args), wait);
        };
    }

    /**
     * Provede AJAX požadavek
     * @param {object} settings Nastavení requestu (https://api.jquery.com/jquery.ajax/)
     * @param {boolean} lock Nastavení uzamknutí stránky při načítání
     */
    static ajax(settings, lock = false) {
        if (lock)
            $('#hard-loader').addClass('show');

        if(settings.success){
            let tmp = settings.success;

            settings.success = (data, statusText, xhr) => {
                if(xhr.getResponseHeader("Logged") !== null){
                    if(xhr.getResponseHeader("Logged") === '0'){
                        window.location.reload();
                    }
                }

                tmp(data, statusText, xhr);
            };
        }else{
            settings.success = (data, statusText, xhr) => {
                if(xhr.getResponseHeader("Logged") !== null){
                    if(xhr.getResponseHeader("Logged") === '0'){
                        window.location.reload();
                    }
                }
            };
        }

        let ajax = $.ajax(settings);
        ajax.uid = Date.now().toString(36) + Math.random().toString(36).substring(2);

        if(lock)
            this.lockAjaxes.push(ajax);

        ajax.always(function (data, status, ajax) {
            Helpers.lockAjaxes = Helpers.lockAjaxes.filter(a => a.uid !== ajax.uid);

            if(Helpers.lockAjaxes.length === 0)
                $('#hard-loader').removeClass('show');
        });

        return ajax;
    }

    static ajaxToBlock(url, block, blockLock = true, globalLock = false, onAfterSuccess = null) {
        if(blockLock){
            block.prepend($('.block-loader:not(.show)').clone());
            block.find('.block-loader').addClass('show');
            block.css('min-height', '120px');
        }

        let ajax = Helpers.ajax({
            url: url,
            success: function (data) {
                block.html(data);
                block.css('min-height', 'unset');

                if(typeof onAfterSuccess === 'function'){
                    onAfterSuccess(data);
                }
            }
        }, globalLock);

        ajax.always((data, status, ajax) => {
            block.css('min-height', 'unset');
            block.find('.block-loader').remove();
        });

    }

    /**
     * Provede stažení souboru pomocí AJAXu
     * @param {string} url URL pro stažení
     * @param {string|null} filename Název stahovaného souboru
     * @param {Object|null} data POST parametry
     * @param {Function|null} onSuccess event po stažení
     */
    static downloadFile(url, filename = null, data = {}, onSuccess = null) {
        $('#hard-loader').addClass('show');
        $('#progress-bar .progress-bar').css('width', '0%');
        $('#progress-bar').addClass('show');
        var req = new XMLHttpRequest();
        req.open("POST", url, true);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.addEventListener("progress", function (evt) {
            if(evt.lengthComputable) {
                var percentComplete = Math.floor((evt.loaded / evt.total) * 100);
                console.log(percentComplete);
                $('#progress-bar .progress-bar').css('width', percentComplete+'%');
            }
        }, false);

        req.responseType = "blob";
        req.onreadystatechange = function () {
            if (!filename) {
                var disposition = req.getResponseHeader('Content-Disposition');
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }
            }

            if (req.readyState === 4 && req.status === 200) {

                if (typeof window.chrome !== 'undefined') {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(req.response);
                    link.download = filename;
                    link.click();
                } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    var blob = new Blob([req.response], { type: 'application/force-download' });
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var file = new File([req.response], filename, { type: 'application/force-download' });
                    window.open(URL.createObjectURL(file));
                }

                if (onSuccess && typeof onSuccess === 'function') {
                    onSuccess(req);
                }

                $('#hard-loader').removeClass('show');
                $('#progress-bar').removeClass('show');
            }
        };
        req.send($.param(data));
    }

    /**
     * Formátuje číslo
     * @param {int} number Číslo
     * @param {int} decimals Počet desetinných míst
     * @param {string} dec_point Desetinný oddělovač
     * @param {string} thousands_sep Oddělovač tisíců
     * @returns {string}
     */
    static numberFormat(number, decimals= 2, dec_point=',', thousands_sep='.') {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals), sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    /**
     * Formátuje cenu
     * @param {int} data Cena
     * @param {int} decimals Počet desetinných míst
     * @returns {string}
     */
    static formatPrice(data, decimals = 0) {
        return Helpers.numberFormat(data, decimals, '.', ' ')
    }

    static fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
        } catch (err) {
            console.warn('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    /**
     * Kopíruje text do schránky
     * @param {string} text Text ke zkopírování
     */
    static copyToClipboard(text) {
        if (!navigator.clipboard) {
            Helpers.fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
        }, function(err) {
            console.warn('Async: Could not copy text: ', err);
        });
    }

    /**
     * Vrátí datum posunuté o x dní ode dnešního
     * @param {integer} increase Počet dní
     * @returns {string}
     */
    static nextDate(increase, format = 'YYYY-MM-DD') {
        return moment().add(increase, 'days').format(format);
    }

    /**
     * Vrací GET parametry z URL
     * @param {string} qs Parametry
     * @returns {{}}
     */
    static getQueryParams(qs) {
        qs = qs.split('+').join(' ');

        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }

    /**
     * Pošle formulářové data na server a stáhne soubor
     * Dojde-li k výjimce při zpracování požadavku, vygenerujte chybovou hlavičku např 404 s vlastní hláškou, nestarejte se o kódování UTF-8, je to řešeno konverzí
     * @param url adresa akce
     * @param filename název souboru, nebude-li obsažen v hlavičce Content-Disposition
     * @param data posílané do formuláře
     * @param callback zpětná funkce, která se provede po úspěšném stažení souboru
     */
    static sendFormAndDownloadData(url, filename = null, data = {}, callback = null) {
        $('#hard-loader').addClass('show');
        $('#progress-bar .progress-bar').css('width', '0%');
        $('#progress-bar').addClass('show');
        Helpers.ajax({
            url: url,
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            cache: false,
            xhrFields: {responseType: 'blob'},
            success: function (data, status, xhr) {
                var headerWithName = xhr.getResponseHeader('Content-Disposition');
                if (!filename && headerWithName) {
                    filename = headerWithName.split('filename=').pop().replace(/\"/g, '');
                }
                if (typeof window.chrome !== 'undefined') {
                    var link = document.createElement('a');
                    var url = window.URL.createObjectURL(data);
                    link.href = url;
                    link.download = filename;
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(data, filename);
                } else {
                    var file = new File(data, filename, {type: 'application/force-download'});
                    window.open(URL.createObjectURL(file));
                }
                $('#hard-loader').removeClass('show');
                $('#progress-bar').removeClass('show');
                if (callback) {
                    callback();
                }
            },
            error: function (data, status, message) {
                alerts.alert('Error', 'error', Helpers.convertUTFToNaitive(message));
                $('#hard-loader').removeClass('show');
                $('#progress-bar').removeClass('show');
            }
        });
    }

    /**
     * Zkonvertuje string (obsahující znaky nad hranicí 128, původně kodovaný v UTF-8) do unicode javascriptu (lze zobrazit)
     * @param string
     * @returns {string}
     */
    static convertUTFToNaitive(string) {
        return decodeURIComponent(string.split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    /**
     * Převede Grid a ParentGrid do Excelu (zachová pořadí sloupců, názvy, filtr)
     * Důležité upozornění, v gridech nesmí přesáhnout velikost sloupců typu store type velikost 1M, neboť při testování bylo zjištěno, že se data při přenosu
     * ztrácejí (nebyla zjištěna příčina), tzn. tyto sloupce je nutno nahradit v manageru přímou hodnotou z join tabulky
     * @param filename Název souboru, k názvu připojí aktuální datum
     * @param grida Main Grid
     * @param gridb Parent Grid
     */
    static exportGridToExcel(filename, grida, gridb = null) {
        filename = filename + $.datepicker.formatDate('_yy_mm_dd', new Date()) + '.xlsx';
        if (!gridb) {
            let Grid = {};
            Grid.Grid1 = Helpers.getColumnInfo(grida);
            Helpers.downloadFile(basePath + '/common/file/export-to-excel/', filename, Grid);
        } else {
            let Grid = {};
            Grid.Grid1 = Helpers.getColumnInfo(grida);
            Grid.Grid2 = Helpers.getColumnInfo(gridb);
            Grid.Grid2.ParentGrid = gridb.parentGrid;
            Helpers.downloadFile(basePath + '/common/file/export-to-excel/', filename, Grid);
        }
    }

    /**
     * Pomocná rutina pro export Gridu do Excelu, sbírá z gridu potřebné údaje
     * @param grid
     * @returns {{}}
     */
    static getColumnInfo(grid) {

        let columns = grid.getColumnList();
        let columnData = [];
        columns.forEach(function(item) {
            if (item.mData !== 'checkbox' && item.mData !== 'Action') {
                let column = {};
                column.Name = item.columnInfo.name;
                column.Label = item.columnInfo.label;
                column.Format = item.columnInfo.format;
                column.Width  =  item.columnInfo.width;
                column.Values = item.enum_values;
                columnData.push(column) ;
            }
        });
        let Grid = {};
        Grid.Name = grid.id;
        Grid.Columns = columnData;
        Grid.URL =  grid.params.urls.datalistUrl;
        Grid.Attributes = grid.urlParameters;
        return Grid;
    }

    static getBrowserLocales(options = {}) {
        const defaultOptions = {
            languageCodeOnly: true,
        };

        const opt = {
            ...defaultOptions,
            ...options,
        };

        const browserLocales =
            navigator.languages === undefined
                ? [navigator.language]
                : navigator.languages;

        if (!browserLocales) {
            return undefined;
        }

        return browserLocales.map(locale => {
            const trimmedLocale = locale.trim();

            return opt.languageCodeOnly
                ? trimmedLocale.split(/-|_/)[0]
                : trimmedLocale;
        });
    }

    static alertStatuses(statuses) {
        statuses.forEach((status) => {
            if(status.type === 'success' || status.type === 'error' || status.type === 'info')
                alerts.alert('', status.type, status.msg);
        });
    }

    static alertAuthStatuses(statuses) {
        statuses.forEach((status) => {
            if(status.type === 'auth_error')
                alerts.alert('', 'error', JSON.parse(status.msg).message);
        });
    }

    static getStatusesByType(statuses, type) {
        let $result = [];
        statuses.forEach((status) => {
            if(status.type === type)
                $result.push(status);
        });

        return $result;
    }

    static humanFileSize(value) {
        let i = 0;
        while (value > 1024) {
            value /= 1024;
            i++;
        }

        return Helpers.numberFormat(Math.max(value, 0.0), 1, '.', ' ') + ' ' + ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][i];
    }

    static deepEqual(object1, object2) {
        const keys1 = Object.keys(object1).sort();
        const keys2 = Object.keys(object2).sort();
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (let i = 0; i < keys1.length; i++) {
            const key = keys1[i];
            if (key !== keys2[i]) {
                return false;
            }
            const value1 = object1[key];
            const value2 = object2[key];
            const areObjects = Helpers.isObject(value1) && Helpers.isObject(value2);
            if (
                (areObjects && !Helpers.deepEqual(value1, value2)) ||
                (!areObjects && value1 !== value2)
            ) {
                return false;
            }
        }
        return true;
    }

    static isObject(object) {
        return object != null && typeof object === 'object';
    }

}
