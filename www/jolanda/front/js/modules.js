function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Alerts = /*#__PURE__*/function () {
  function Alerts() {
    _classCallCheck(this, Alerts);
    this.stack = new PNotify.Stack({
      dir1: 'up',
      dir2: 'left',
      firstpos1: 25,
      firstpos2: 25,
      modal: false,
      maxOpen: Infinity
    });
    this.opts = {
      // addModelessClass: 'nonblock',
      styling: 'bootstrap4',
      icons: {
        prefix: 'fontawesome5',
        closer: 'fa fa-times'
      },
      closerHover: false,
      closer: true,
      sticker: false,
      stack: this.stack,
      modules: PNotify.defaultModules
    };
  }

  /**
   *
   * @param {string} title Titulek zprávy
   * @param {string} type Typ zprávy (success, error, warning, info)
   * @param {string} text Text zprávy
   * @param {boolean} text persist
   */
  return _createClass(Alerts, [{
    key: "alert",
    value: function alert(title) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
      var text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var persist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      this.opts.title = title;
      this.opts.text = text;
      if (persist) this.opts.hide = false;
      var notify = PNotify[type](this.opts);
      if (!persist) {
        notify.on('click', function () {
          notify.close();
        });
      }
    }
  }, {
    key: "error",
    value: function error() {
      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      this.alert(translations.ERROR, 'error', text);
    }
  }]);
}();
//# sourceMappingURL=Alerts.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Helpers = /*#__PURE__*/function () {
  function Helpers() {
    _classCallCheck(this, Helpers);
  }
  return _createClass(Helpers, null, [{
    key: "delay",
    value:
    /**
     *
     * @param {function} callback Callback
     * @param context
     * @param {int} wait Zpožední v ms
     * @returns {function(...[*]=)}
     */
    function delay(callback, context, wait) {
      var timeout;
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          return callback.apply(context, args);
        }, wait);
      };
    }

    /**
     * Provede AJAX požadavek
     * @param {object} settings Nastavení requestu (https://api.jquery.com/jquery.ajax/)
     * @param {boolean} lock Nastavení uzamknutí stránky při načítání
     */
  }, {
    key: "ajax",
    value: function ajax(settings) {
      var lock = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (lock) $('#hard-loader').addClass('show');
      if (settings.success) {
        var tmp = settings.success;
        settings.success = function (data, statusText, xhr) {
          if (xhr.getResponseHeader("Logged") !== null) {
            if (xhr.getResponseHeader("Logged") === '0') {
              window.location.reload();
            }
          }
          tmp(data, statusText, xhr);
        };
      } else {
        settings.success = function (data, statusText, xhr) {
          if (xhr.getResponseHeader("Logged") !== null) {
            if (xhr.getResponseHeader("Logged") === '0') {
              window.location.reload();
            }
          }
        };
      }
      var ajax = $.ajax(settings);
      ajax.uid = Date.now().toString(36) + Math.random().toString(36).substring(2);
      if (lock) this.lockAjaxes.push(ajax);
      ajax.always(function (data, status, ajax) {
        Helpers.lockAjaxes = Helpers.lockAjaxes.filter(function (a) {
          return a.uid !== ajax.uid;
        });
        if (Helpers.lockAjaxes.length === 0) $('#hard-loader').removeClass('show');
      });
      return ajax;
    }
  }, {
    key: "ajaxToBlock",
    value: function ajaxToBlock(url, block) {
      var blockLock = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var globalLock = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var onAfterSuccess = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      if (blockLock) {
        block.prepend($('.block-loader:not(.show)').clone());
        block.find('.block-loader').addClass('show');
        block.css('min-height', '120px');
      }
      var ajax = Helpers.ajax({
        url: url,
        success: function success(data) {
          block.html(data);
          block.css('min-height', 'unset');
          if (typeof onAfterSuccess === 'function') {
            onAfterSuccess(data);
          }
        }
      }, globalLock);
      ajax.always(function (data, status, ajax) {
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
  }, {
    key: "downloadFile",
    value: function downloadFile(url) {
      var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var onSuccess = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      $('#hard-loader').addClass('show');
      $('#progress-bar .progress-bar').css('width', '0%');
      $('#progress-bar').addClass('show');
      var req = new XMLHttpRequest();
      req.open("POST", url, true);
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      req.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
          var percentComplete = Math.floor(evt.loaded / evt.total * 100);
          console.log(percentComplete);
          $('#progress-bar .progress-bar').css('width', percentComplete + '%');
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
            var blob = new Blob([req.response], {
              type: 'application/force-download'
            });
            window.navigator.msSaveBlob(blob, filename);
          } else {
            var file = new File([req.response], filename, {
              type: 'application/force-download'
            });
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
  }, {
    key: "numberFormat",
    value: function numberFormat(number) {
      var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
      var dec_point = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ',';
      var thousands_sep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.';
      number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
      var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
        dec = typeof dec_point === 'undefined' ? '.' : dec_point,
        s = '',
        toFixedFix = function toFixedFix(n, prec) {
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
  }, {
    key: "formatPrice",
    value: function formatPrice(data) {
      var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return Helpers.numberFormat(data, decimals, '.', ' ');
    }
  }, {
    key: "fallbackCopyTextToClipboard",
    value: function fallbackCopyTextToClipboard(text) {
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
  }, {
    key: "copyToClipboard",
    value: function copyToClipboard(text) {
      if (!navigator.clipboard) {
        Helpers.fallbackCopyTextToClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(function () {}, function (err) {
        console.warn('Async: Could not copy text: ', err);
      });
    }

    /**
     * Vrátí datum posunuté o x dní ode dnešního
     * @param {integer} increase Počet dní
     * @returns {string}
     */
  }, {
    key: "nextDate",
    value: function nextDate(increase) {
      var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD';
      return moment().add(increase, 'days').format(format);
    }

    /**
     * Vrací GET parametry z URL
     * @param {string} qs Parametry
     * @returns {{}}
     */
  }, {
    key: "getQueryParams",
    value: function getQueryParams(qs) {
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
  }, {
    key: "sendFormAndDownloadData",
    value: function sendFormAndDownloadData(url) {
      var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
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
        xhrFields: {
          responseType: 'blob'
        },
        success: function success(data, status, xhr) {
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
            var file = new File(data, filename, {
              type: 'application/force-download'
            });
            window.open(URL.createObjectURL(file));
          }
          $('#hard-loader').removeClass('show');
          $('#progress-bar').removeClass('show');
          if (callback) {
            callback();
          }
        },
        error: function error(data, status, message) {
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
  }, {
    key: "convertUTFToNaitive",
    value: function convertUTFToNaitive(string) {
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
  }, {
    key: "exportGridToExcel",
    value: function exportGridToExcel(filename, grida) {
      var gridb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      filename = filename + $.datepicker.formatDate('_yy_mm_dd', new Date()) + '.xlsx';
      if (!gridb) {
        var Grid = {};
        Grid.Grid1 = Helpers.getColumnInfo(grida);
        Helpers.downloadFile(basePath + '/common/file/export-to-excel/', filename, Grid);
      } else {
        var _Grid = {};
        _Grid.Grid1 = Helpers.getColumnInfo(grida);
        _Grid.Grid2 = Helpers.getColumnInfo(gridb);
        _Grid.Grid2.ParentGrid = gridb.parentGrid;
        Helpers.downloadFile(basePath + '/common/file/export-to-excel/', filename, _Grid);
      }
    }

    /**
     * Pomocná rutina pro export Gridu do Excelu, sbírá z gridu potřebné údaje
     * @param grid
     * @returns {{}}
     */
  }, {
    key: "getColumnInfo",
    value: function getColumnInfo(grid) {
      var columns = grid.getColumnList();
      var columnData = [];
      columns.forEach(function (item) {
        if (item.mData !== 'checkbox' && item.mData !== 'Action') {
          var column = {};
          column.Name = item.columnInfo.name;
          column.Label = item.columnInfo.label;
          column.Format = item.columnInfo.format;
          column.Width = item.columnInfo.width;
          column.Values = item.enum_values;
          columnData.push(column);
        }
      });
      var Grid = {};
      Grid.Name = grid.id;
      Grid.Columns = columnData;
      Grid.URL = grid.params.urls.datalistUrl;
      Grid.Attributes = grid.urlParameters;
      return Grid;
    }
  }, {
    key: "getBrowserLocales",
    value: function getBrowserLocales() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var defaultOptions = {
        languageCodeOnly: true
      };
      var opt = _objectSpread(_objectSpread({}, defaultOptions), options);
      var browserLocales = navigator.languages === undefined ? [navigator.language] : navigator.languages;
      if (!browserLocales) {
        return undefined;
      }
      return browserLocales.map(function (locale) {
        var trimmedLocale = locale.trim();
        return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale;
      });
    }
  }, {
    key: "alertStatuses",
    value: function alertStatuses(statuses) {
      statuses.forEach(function (status) {
        if (status.type === 'success' || status.type === 'error' || status.type === 'info') alerts.alert('', status.type, status.msg);
      });
    }
  }, {
    key: "alertAuthStatuses",
    value: function alertAuthStatuses(statuses) {
      statuses.forEach(function (status) {
        if (status.type === 'auth_error') alerts.alert('', 'error', JSON.parse(status.msg).message);
      });
    }
  }, {
    key: "getStatusesByType",
    value: function getStatusesByType(statuses, type) {
      var $result = [];
      statuses.forEach(function (status) {
        if (status.type === type) $result.push(status);
      });
      return $result;
    }
  }, {
    key: "humanFileSize",
    value: function humanFileSize(value) {
      var i = 0;
      while (value > 1024) {
        value /= 1024;
        i++;
      }
      return Helpers.numberFormat(Math.max(value, 0.0), 1, '.', ' ') + ' ' + ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][i];
    }
  }, {
    key: "deepEqual",
    value: function deepEqual(object1, object2) {
      var keys1 = Object.keys(object1).sort();
      var keys2 = Object.keys(object2).sort();
      if (keys1.length !== keys2.length) {
        return false;
      }
      for (var i = 0; i < keys1.length; i++) {
        var key = keys1[i];
        if (key !== keys2[i]) {
          return false;
        }
        var value1 = object1[key];
        var value2 = object2[key];
        var areObjects = Helpers.isObject(value1) && Helpers.isObject(value2);
        if (areObjects && !Helpers.deepEqual(value1, value2) || !areObjects && value1 !== value2) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: "isObject",
    value: function isObject(object) {
      return object != null && _typeof(object) === 'object';
    }
  }]);
}();
_defineProperty(Helpers, "lockAjaxes", []);
//# sourceMappingURL=Helpers.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var TreeView = /*#__PURE__*/function () {
  function TreeView(element_id, data) {
    var checkbox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var customoptions = arguments.length > 3 ? arguments[3] : undefined;
    _classCallCheck(this, TreeView);
    this.data = data;
    this.onChange = null;
    this.onPositionChange = null;
    this.element = $('#' + element_id);
    if (this.element.data('data') !== undefined) this.data = this.element.data('data');
    if (typeof this.data === 'string') this.data = JSON.parse(this.data);
    var plugins = ["wholerow", "dnd"];
    if (checkbox) plugins.push('checkbox');
    var options = {
      "plugins": plugins,
      'core': {
        'themes': {
          'icons': false
        },
        "check_callback": function check_callback(op, node, par, pos, more) {
          if (more && more.dnd) {
            return more.pos !== "i" && par.id == node.parent;
          }
          return true;
        },
        'data': this.data
      }
    };
    this.tree = this.element.jstree(Object.assign(options, customoptions));
    this.bindEvents();
  }
  return _createClass(TreeView, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;
      this.element.on('changed.jstree', function (e, action) {
        if (action.action === 'deselect_all' && action.selected.length === 0 && action.old_selection.length === 0) {
          return;
        }
        if (typeof _this.onChange === 'function') _this.onChange();
      }).jstree();
      this.element.on('move_node.jstree', function (e, data) {
        if (typeof _this.onPositionChange === 'function') _this.onPositionChange(e, data);
      }).jstree();
    }
  }, {
    key: "getSelected",
    value: function getSelected() {
      return this.tree.jstree(true).get_selected();
    }
  }]);
}();
//# sourceMappingURL=TreeView.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var CategoryTree = /*#__PURE__*/function (_TreeView) {
  /**
   *
   * @param element_id ID elementu
   * @param data JSON s daty
   * @param entity_id ID upravované entity
   * @param settings JSON s nastevím
   */
  function CategoryTree(element_id, data, entity_id, settings) {
    var _this;
    _classCallCheck(this, CategoryTree);
    var customoptions = {
      'checkbox': {
        three_state: false
      }
    };
    _this = _callSuper(this, CategoryTree, [element_id, data, true, customoptions]);
    _this.onBeforeChange = null;
    _this.onAfterChange = null;
    _this.entity_id = entity_id;
    _this.settings = JSON.parse(settings);
    _this.data = {};
    $(function () {
      _this.element.on('ready.jstree', function () {
        _this.loadData();
      });
    });
    return _this;
  }

  /**
   * Načítá data z datové tabulky
   */
  _inherits(CategoryTree, _TreeView);
  return _createClass(CategoryTree, [{
    key: "loadData",
    value: function loadData() {
      var _this2 = this;
      this.data = {};
      var data = {};
      data[this.settings.child_column] = this.entity_id;
      Helpers.ajax({
        url: this.settings['data_url'],
        data: data,
        success: function success(data) {
          data = JSON.parse(data).items;
          _this2.tree.jstree(true).deselect_all();
          for (var i in data) {
            _this2.data[data[i].ID] = data[i][_this2.settings.parent_column];
            _this2.tree.jstree(true).select_node(data[i][_this2.settings.parent_column], true);
          }
        }
      });
    }

    /**
     * Binduje eventy
     */
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this3 = this;
      this.element.on('changed.jstree', function (event, action) {
        if (!action.node) return;
        if (typeof _this3.onBeforeChange === 'function') _this3.onBeforeChange();
        var ID = action.node.id;
        var relation_ID = Object.keys(_this3.data).find(function (key) {
          return _this3.data[key] === ID;
        });
        if (action.action === 'select_node') {
          var data = {};
          data[_this3.settings.child_column] = _this3.entity_id;
          data[_this3.settings.parent_column] = ID;
          Helpers.ajax({
            url: _this3.settings['create_url'],
            data: {
              data: JSON.stringify(data)
            },
            success: function success(data) {
              data = JSON.parse(data);
              data = data.items[0];
              _this3.data[data.ID] = ID;
              if (typeof _this3.onAfterChange === 'function') _this3.onAfterChange();
            }
          });
        } else if (action.action === 'deselect_node') {
          var _data = {
            ID: relation_ID
          };
          Helpers.ajax({
            url: _this3.settings['delete_url'],
            data: {
              data: JSON.stringify(_data)
            },
            success: function success() {
              _this3.data[relation_ID] = undefined;
              if (typeof _this3.onAfterChange === 'function') _this3.onAfterChange();
            }
          });
        }
      }).jstree();
    }
  }]);
}(TreeView);
//# sourceMappingURL=CategoryTree.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var RelationSwitcher = /*#__PURE__*/function () {
  /**
   * RelationSwitcher constructor
   * @param {string|Object} params Parametry nastavení
   * @param {jquery} element Selector pro render
   * @param {int|null} parent_id ID rodičovské entity
   */
  function RelationSwitcher(params, element) {
    var _params$group_by_colu, _params$group_by_name;
    var parent_id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    _classCallCheck(this, RelationSwitcher);
    if (typeof params == 'string') params = JSON.parse(params);
    this.source_url = params.source_url;
    this.delete_url = params.delete_url;
    this.create_url = params.create_url;
    this.relations_url = params.relations_url;
    this.parent_column = params.parent_column;
    this.child_column = params.child_column;
    this.child_name_column = params.child_name_column;
    this.group_by_column = (_params$group_by_colu = params.group_by_column) !== null && _params$group_by_colu !== void 0 ? _params$group_by_colu : null;
    this.group_by_name_column = (_params$group_by_name = params.group_by_name_column) !== null && _params$group_by_name !== void 0 ? _params$group_by_name : null;
    this.title = params.title;
    this.source_data = {};
    this.group_by_title_data = {};
    this.parent_id = null;
    this.current_relations = {};
    this.element = element;
    this.rendered = false;
    this.getSource();
    this.bindEvents();
    if (parent_id !== null) this.setParent(parent_id);
  }

  /**
   * Nabinduje eventy
   */
  return _createClass(RelationSwitcher, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;
      this.element.on('change', '.rs-checkbox input[type="checkbox"]', function (e, el) {
        e = $(e.target);
        if (e.prop('checked')) {
          _this.createRelation(e.data('key'));
        } else {
          _this.deleteRelation(e.data('key'));
        }
        if (e.data('group')) {
          _this.handleGroupCheckbox(e.data('group'));
        }
      });
      this.element.on('change', '.rs-group-checkbox input[type="checkbox"]', function (e) {
        e = $(e.target);
        if (e.prop('checked')) {
          $(".rs-checkbox input[data-group=\"".concat(e.data('group'), "\"]:not(:checked)")).each(function (i, el) {
            $(el).prop('checked', true);
            _this.createRelation($(el).data('key'));
          });
        } else {
          $(".rs-checkbox input[data-group=\"".concat(e.data('group'), "\"]:checked")).each(function (i, el) {
            $(el).prop('checked', false);
            _this.deleteRelation($(el).data('key'));
          });
        }
      });
      this.element.on('click', '.rs-group-label', function (e) {
        if ($(e.target).hasClass('rs-group-checkbox') || $(e.target).parent().hasClass('rs-group-checkbox')) {
          e.stopPropagation();
        } else {
          e.preventDefault();
        }
      });
      this.element.on('click', '.select-all', function (e, el) {
        _this.selectAll();
      });
      this.element.on('click', '.unselect-all', function (e, el) {
        _this.unselectAll();
      });
      this.element.on('keyup', 'input[type="text"]', function (e, el) {
        e = $(e.target);
        var value = e.val().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        if (_this.group_by_column) {
          _this.element.find('.data .rs-group-label').addClass('d-none');
          _this.element.find('.data .rs-checkbox').addClass('d-none');
          _this.element.find('.rs-group-label').each(function (i, e) {
            var text = $(e).text().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            var regex = new RegExp(value);
            if (text.search(regex) !== -1) {
              $(e).removeClass('d-none');
            }
          });
          _this.element.find('.rs-checkbox').each(function (i, e) {
            var text = $(e).text().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            var regex = new RegExp(value);
            if (text.search(regex) !== -1) {
              var group = $(e).parent().data('group');
              $(".data .rs-group-label[data-group=\"".concat(group, "\"]")).removeClass('d-none');
              $(e).removeClass('d-none');
            }
          });
        } else {
          _this.element.find('.data label').addClass('d-none');
          _this.element.find('label').each(function (i, e) {
            var text = $(e).text().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            var regex = new RegExp(value);
            if (text.search(regex) !== -1) {
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
  }, {
    key: "createRelation",
    value: function createRelation(value) {
      var _this2 = this;
      var data = {};
      data[this.parent_column] = this.parent_id;
      data[this.child_column] = value;
      Helpers.ajax({
        url: this.create_url,
        data: {
          data: JSON.stringify(data)
        },
        success: function success(data) {
          if (typeof data === 'string') data = JSON.parse(data);
          data = data.items[0];
          _this2.current_relations[value].ID = data.ID;
          _this2.current_relations[value].state = true;
          _this2.resetCounter();
        }
      });
    }

    /**
     * Smaže relaci
     * @param value
     */
  }, {
    key: "deleteRelation",
    value: function deleteRelation(value) {
      var _this3 = this;
      var data = {
        ID: this.current_relations[value].ID
      };
      Helpers.ajax({
        url: this.delete_url,
        data: {
          data: JSON.stringify(data)
        },
        success: function success(data) {
          _this3.current_relations[value].state = false;
          _this3.resetCounter();
        }
      });
    }

    /**
     * Nastavuje ID rodičovské entity
     * @param value
     */
  }, {
    key: "setParent",
    value: function setParent(value) {
      this.parent_id = value;
      this.refresh();
    }

    /**
     * Získá zdrojové data
     */
  }, {
    key: "getSource",
    value: function getSource() {
      var _this4 = this;
      Helpers.ajax({
        url: this.source_url,
        success: function success(data) {
          if (typeof data === 'string') data = JSON.parse(data);
          data = data.items;
          data.forEach(function (v, k) {
            if (_this4.group_by_column) {
              var groupByKey;
              if (!v[_this4.group_by_column]) {
                groupByKey = 0;
              } else {
                groupByKey = v[_this4.group_by_column];
              }
              if (!_this4.source_data[groupByKey]) {
                _this4.source_data[groupByKey] = {};
              }
              if (_this4.group_by_name_column) {
                var _v$_this4$group_by_na;
                _this4.group_by_title_data[groupByKey] = (_v$_this4$group_by_na = v[_this4.group_by_name_column]) !== null && _v$_this4$group_by_na !== void 0 ? _v$_this4$group_by_na : groupByKey;
              } else {
                _this4.group_by_title_data[groupByKey] = groupByKey;
              }
              _this4.source_data[groupByKey][v.ID] = v[_this4.child_name_column];
            } else {
              _this4.source_data[v.ID] = v[_this4.child_name_column];
            }
            _this4.current_relations[v.ID] = {
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
  }, {
    key: "refresh",
    value: function refresh() {
      var _this5 = this;
      var data = {};
      data[this.parent_column] = this.parent_id;
      for (var i in this.current_relations) {
        this.current_relations[i].state = false;
      }
      Helpers.ajax({
        url: this.relations_url,
        data: data,
        success: function success(data) {
          if (typeof data === 'string') data = JSON.parse(data);
          data = data.items;
          data.forEach(function (v, k) {
            _this5.current_relations[v[_this5.child_column]] = {
              ID: v.ID,
              state: true
            };
          });
          _this5.render();
        }
      });
    }
  }, {
    key: "resetCounter",
    value: function resetCounter() {
      this.element.find('.from').text(Object.values(this.current_relations).filter(function (item) {
        return item.state;
      }).length);
      if (this.group_by_column) {
        var childCount = 0;
        for (var p in this.source_data) {
          childCount += Object.values(this.source_data[p]).length;
        }
        this.element.find('.to').text(childCount);
      } else {
        this.element.find('.to').text(Object.values(this.source_data).length);
      }
    }
  }, {
    key: "selectAll",
    value: function selectAll() {
      this.element.find('.rs-checkbox:not(.d-none) input[type="checkbox"]').each(function (i, el) {
        if ($(el).prop('checked') === false) $(el).prop('checked', true).trigger('change');
      });
    }
  }, {
    key: "unselectAll",
    value: function unselectAll() {
      this.element.find('.rs-checkbox:not(.d-none) input[type="checkbox"]').each(function (i, el) {
        if ($(el).prop('checked') === true) $(el).prop('checked', false).trigger('change');
      });
    }
  }, {
    key: "handleGroupCheckbox",
    value: function handleGroupCheckbox() {
      var group = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (group) {
        var childCount = $(".rs-checkbox input[data-group=\"".concat(group, "\"]")).length;
        var checkedCount = $(".rs-checkbox input[data-group=\"".concat(group, "\"]:checked")).length;
        var groupCheckbox = $(".rs-group-checkbox input[data-group=\"".concat(group, "\"]"));
        if (checkedCount >= childCount) {
          groupCheckbox.prop('indeterminate', false).prop('checked', true);
        } else if (checkedCount < childCount && checkedCount > 0) {
          groupCheckbox.prop('indeterminate', true);
        } else {
          groupCheckbox.prop('indeterminate', false).prop('checked', false);
        }
      } else {
        $(".rs-group-checkbox input[type=\"checkbox\"]").each(function (i, el) {
          var group = $(el).data('group');
          var childCount = $(".rs-checkbox input[data-group=\"".concat(group, "\"]")).length;
          var checkedCount = $(".rs-checkbox input[data-group=\"".concat(group, "\"]:checked")).length;
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
  }, {
    key: "render",
    value: function render() {
      if (!this.rendered) {
        this.element.html("<h2>".concat(this.title, " (<span class=\"from\"></span>/<span class=\"to\"></span>)</h2><div class=\"search mb-2 w100\"><input type=\"text\" class=\"\"><div class=\"btn btn-dark select-all\">").concat(translations.SELECT_ALL, "</div><div class=\"btn btn-dark unselect-all\">").concat(translations.UNSELECT_ALL, "</div></div><div class=\"data\"></div>"));
        this.rendered = true;
      }
      var html = '';
      if (this.group_by_column) {
        for (var group in this.source_data) {
          html += "<div class=\"rs-group-label collapsed\" data-toggle=\"collapse\" data-target=\"#rs-group-".concat(group, "\" data-group=\"").concat(group, "\"><span class=\"rs-arrow\"></span><label class=\"checkbox rs-group-checkbox\"><input type=\"checkbox\" data-group=\"").concat(group, "\" class=\"form-control\"><span class=\"checkmark\"></span>").concat(this.group_by_title_data[group], "</label></div>");
          html += "<div id=\"rs-group-".concat(group, "\" data-group=\"").concat(group, "\" class=\"rs-group collapse-container collapse\">");
          for (var i in this.source_data[group]) {
            html += "<label class=\"checkbox rs-checkbox\" style=\"display: flex\"><input type=\"checkbox\" data-group=\"".concat(group, "\" data-key=\"").concat(i, "\" ").concat(this.current_relations[i].state ? 'checked' : '', " class=\"form-control\"><span class=\"checkmark\"></span>").concat(this.source_data[group][i], "</label>");
          }
          html += "</div>";
        }
      } else {
        for (var _i in this.source_data) {
          html += "<label class=\"checkbox rs-checkbox\" style=\"display: flex\"><input type=\"checkbox\" data-key=\"".concat(_i, "\" ").concat(this.current_relations[_i].state ? 'checked' : '', " class=\"form-control\"><span class=\"checkmark\"></span>").concat(this.source_data[_i], "</label>");
        }
      }
      this.element.find('.data').html(html);
      this.resetCounter();
      this.handleGroupCheckbox();
    }
  }]);
}();
//# sourceMappingURL=RelationSwitcher.js.map

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var getDataAttr = function getDataAttr(element, attr) {
  var def = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var data = element.getAttribute('data-' + attr);
  if (data === undefined || data === null) return def;else try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
};
var Grid = /*#__PURE__*/function () {
  /**
   * Grid constructor
   * @param {string} element_id ID elementu s Gridem
   */
  function Grid(element_id) {
    var _this = this;
    _classCallCheck(this, Grid);
    _defineProperty(this, "openTabEditor", function (e) {
      if (e[0].which === 2) {
        if (_this.getSelectedCount() > 1) {
          alerts.alert(translations.SELECT_ONLY_ONE);
          return;
        } else if (_this.getSelectedCount() === 0) {
          alerts.alert(translations.SELECT_ROW, 'info', translations.SELECT_ROW_TEXT);
          return;
        }
        if (_this.params.urls.editAction.includes('?')) {
          window.open(_this.params.urls.editAction + '&entity_ID=' + _this.getCurrentItemValue('ID'), '_blank').focus();
        } else {
          window.open(_this.params.urls.editAction + '?entity_ID=' + _this.getCurrentItemValue('ID'), '_blank').focus();
        }
      }
    });
    /**
     * Zobrazí panel s editací entity
     */
    _defineProperty(this, "edit", function () {
      var ID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (_this.editorIsOpen) {
        return;
      }
      if (_this.params.actions.edit && (_this.params.urls.editAction !== '' || _this.params.urls.quickeditAction !== '')) {
        var row = _this.getCurrentItem();
        _this.currentRow = row;
        if (ID === null) {
          if (_this.getSelectedCount() > 1) {
            alerts.alert(translations.SELECT_ONLY_ONE);
            return;
          } else if (_this.getSelectedCount() === 0) {
            alerts.alert(translations.SELECT_ROW, 'info', translations.SELECT_ROW_TEXT);
            return;
          }
          if (_this.params.select === 'single') ID = row['ID'];else ID = row[0]['ID'];
        }
        var parent_rows = [];
        if (_this.hasParentGrid()) {
          var oneIsSelected = false;
          _this.relations.forEach(function (relation) {
            if (window[relation.grid].getCurrentItem() != null) {
              oneIsSelected = true;
              parent_rows.push({
                column: relation.column,
                id: window[relation.grid].getCurrentItem()[relation.child]
              });
            }
          });
          if (!oneIsSelected && _this.params.oneMustBeSelected) {
            alerts.alert('Select parent', 'notice', 'Please select parent');
            return;
          }
        }
        if (_this.parentElement != null) parent_rows = _this.parentElement;
        if (_this.params.urls.editAction !== '') {
          if (!_this.panel || !_this.params.editorCaching) {
            _this.panel = new Panel();
            var data = {
              entity_ID: ID,
              panel_id: _this.panel.uid,
              parent_rows: parent_rows,
              caching: _this.params.editorCaching,
              dataSaveType: _this.params.dataSaveType,
              grid_id: _this.id
            };
            if (_this.params.dataSaveType === 'local') {
              data['local_tmp_id'] = _this.params.select === 'single' ? row['local_tmp_id'] : row[0]['local_tmp_id'];
            }
            Helpers.ajax({
              url: _this.params.urls.editAction,
              data: data,
              success: function success(data) {
                if (typeof data === 'string') data = JSON.parse(data);
                _this.panel.classes = 'entity-editor';
                _this.panel.setTitle(data.title);
                _this.panel.setContent(data.content);
                _this.panel.setFooter(data.footer);
                _this.panel.addToButtonArea(data.buttons);
                _this.panel.setUrl(_this.params.urls.editAction, ID);
                _this.panel.cache = _this.params.editorCaching;
                _this.panel.onAfterHide = function () {
                  _this.editorIsOpen = false;
                  _this.refresh();
                };
                _this.panel.onAfterShow = function () {
                  _this.editorIsOpen = true;
                };
                _this.panel.show();
              },
              complete: function complete() {
                if (_this.params.editorCaching) {
                  setTimeout(function () {
                    if (_this.params.dataSaveType === 'local') {
                      _this.panel.entityEditor.local_tmp_id = _this.params.select === 'single' ? _this.getCurrentItem()['local_tmp_id'] : _this.getCurrentItem()[0]['local_tmp_id'];
                      _this.panel.entityEditor.entityIterator = new Iterator(_this.grid.data().map(function (e) {
                        return e.local_tmp_id;
                      }).toArray(), Array.isArray(_this.getCurrentItemIndex()) ? _this.getCurrentItemIndex()[0] : _this.getCurrentItemIndex(), parseInt(_this.grid.data().toArray().length), 0);
                    } else {
                      _this.panel.entityEditor.entity_id = ID;
                      _this.panel.entityEditor.entityIterator = new Iterator(_this.grid.data().map(function (e) {
                        return e.ID;
                      }).toArray(), Array.isArray(_this.getCurrentItemIndex()) ? _this.getCurrentItemIndex()[0] : _this.getCurrentItemIndex(), parseInt(_this.range.total), _this.range.from, {
                        params: _this.urlParameters,
                        url: _this.params.urls.datalistUrl
                      });
                      _this.panel.entityEditor.entityIterator.lockScreenOnAjax = true;
                    }
                    $('#' + _this.panel.entityEditor.editor_id + '_editor_iterator_current').text(_this.panel.entityEditor.entityIterator.currentIndex + 1);
                    $('#' + _this.panel.entityEditor.editor_id + '_editor_iterator_length').text(_this.panel.entityEditor.entityIterator.totalLength);
                    if (!_this.panel.entityEditor.entityIterator.hasNext()) $('#' + _this.panel.entityEditor.editor_id + '_editor_next_entity_button').addClass('disabled');else $('#' + _this.panel.entityEditor.editor_id + '_editor_next_entity_button').removeClass('disabled');
                    if (!_this.panel.entityEditor.entityIterator.hasPrev()) $('#' + _this.panel.entityEditor.editor_id + '_editor_prev_entity_button').addClass('disabled');else $('#' + _this.panel.entityEditor.editor_id + '_editor_prev_entity_button').removeClass('disabled');
                  }, 0);
                }
              }
            });
          } else {
            if (_this.params.dataSaveType === 'local') {
              _this.panel.entityEditor.local_tmp_id = _this.params.select === 'single' ? _this.getCurrentItem()['local_tmp_id'] : _this.getCurrentItem()[0]['local_tmp_id'];
              _this.panel.entityEditor.entityIterator = new Iterator(_this.grid.data().map(function (e) {
                return e.local_tmp_id;
              }).toArray(), Array.isArray(_this.getCurrentItemIndex()) ? _this.getCurrentItemIndex()[0] : _this.getCurrentItemIndex(), parseInt(_this.grid.data().toArray().length), 0);
            } else {
              _this.panel.entityEditor.entity_id = ID;
              _this.panel.entityEditor.entityIterator = new Iterator(_this.grid.data().map(function (e) {
                return e.ID;
              }).toArray(), Array.isArray(_this.getCurrentItemIndex()) ? _this.getCurrentItemIndex()[0] : _this.getCurrentItemIndex(), parseInt(_this.range.total), _this.range.from, {
                params: _this.urlParameters,
                url: _this.params.urls.datalistUrl
              });
              _this.panel.entityEditor.entityIterator.lockScreenOnAjax = true;
            }
            $('#' + _this.panel.entityEditor.editor_id + '_editor_iterator_current').text(_this.panel.entityEditor.entityIterator.currentIndex + 1);
            $('#' + _this.panel.entityEditor.editor_id + '_editor_iterator_length').text(_this.panel.entityEditor.entityIterator.totalLength);
            if (!_this.panel.entityEditor.entityIterator.hasNext()) $('#' + _this.panel.entityEditor.editor_id + '_editor_next_entity_button').addClass('disabled');else $('#' + _this.panel.entityEditor.editor_id + '_editor_next_entity_button').removeClass('disabled');
            if (!_this.panel.entityEditor.entityIterator.hasPrev()) $('#' + _this.panel.entityEditor.editor_id + '_editor_prev_entity_button').addClass('disabled');else $('#' + _this.panel.entityEditor.editor_id + '_editor_prev_entity_button').removeClass('disabled');
            _this.panel.setUrl(_this.params.urls.editAction, ID);
            _this.panel.show();
            _this.panel.entityEditor.loadData();
            _this.panel.entityEditor.refreshSubGrids();
            _this.panel.entityEditor.refreshRelationSwitches();
          }
        } else if (_this.params.urls.quickeditAction !== '') {
          var dialog = new Dialog();
          row = _this.getCurrentItem(false);
          if (_this.params.select === 'single') ID = row['ID'];else ID = row[0]['ID'];
          var params = {
            'parent_column': null,
            'parent_entity_id': null,
            'parent_rows': parent_rows,
            'parent_row': parent_rows.length === 1 ? parent_rows[0] : null,
            //kvůli bc breaku
            'entity_id': ID,
            'dataSaveType': _this.params.dataSaveType,
            'grid_id': _this.id
          };
          if (_this.params.dataSaveType === 'local') {
            params['local_tmp_id'] = _this.params.select === 'single' ? row['local_tmp_id'] : row[0]['local_tmp_id'];
          }
          if (_this.params.quickeditMaxWidth) dialog.maxWidth = _this.params.quickeditMaxWidth;
          dialog.onAfterShow = function () {
            _this.editorIsOpen = true;
          };
          dialog.showFromUrl(_this.params.urls.quickeditAction, params, true);
          dialog.onAfterClose = function () {
            _this.editorIsOpen = false;
            _this.refresh();
          };
        }
      }
    });
    /**
     * Smaže vybranou entitu
     */
    _defineProperty(this, "remove", function () {
      if (_this.getSelectedCount() === 0) {
        alerts.alert(translations.SELECT_ROW, 'info', translations.SELECT_ROW_TEXT);
        return;
      }
      var count = _this.getSelectedCount() === 1 ? translations.REMOVE_ITEM + '?' : _this.getSelectedCount() + ' ' + translations.REMOVE_ITEMS + '?';
      if (confirm(translations.REMOVE_QUESTION + ' ' + count + ' [' + _this.params.title + ']')) {
        if (_this.params.dataSaveType === 'local') {
          _this.grid.rows({
            selected: true
          }).remove().draw();
          alerts.alert(translations.ITEMS_DELETED, 'success', '');
          return;
        }
        if (_this.params.select === 'single') {
          var ID = _this.getCurrentItem().ID;
          Helpers.ajax({
            url: _this.params.urls.deleteUrl,
            data: {
              data: '{ \"ID\":' + ID + '}'
            },
            success: function success(data) {
              _this.refresh();
              if (typeof data === 'string' && data !== '') data = JSON.parse(data);
              if (typeof data.statuses !== 'undefined' && data.statuses.length > 0) {
                data.statuses.forEach(function (status) {
                  alerts.alert('', status.type, status.msg);
                  if (status.afterNotifyFunction) {
                    if (typeof eval(status.afterNotifyFunction) === 'function') eval(status.afterNotifyFunction + '()');else console.warn('Typeof ' + status.afterNotifyFunction + ' is not a function');
                  }
                });
              }
              if (data.error) alerts.alert(translations.ERROR, 'error', data.description);else alerts.alert(translations.ITEMS_DELETED, 'success', '');
            }
          });
        } else {
          var queue = [];
          var s_count = 0,
            t_count = 0;
          _this.grid.rows({
            selected: true
          }).data().each(function (k) {
            t_count++;
            queue.push(Helpers.ajax({
              url: _this.params.urls.deleteUrl,
              data: {
                data: '{ \"ID\":' + k.ID + '}'
              },
              success: function success(data) {
                if (data !== '' && typeof data === 'string') data = JSON.parse(data);
                if (!data.error) s_count++;
                if (typeof data.statuses !== 'undefined' && data.statuses.length > 0) {
                  data.statuses.forEach(function (status) {
                    alerts.alert('ID: ' + k.ID, status.type, status.msg);
                    if (status.afterNotifyFunction) {
                      if (typeof eval(status.afterNotifyFunction) === 'function') eval(status.afterNotifyFunction + '()');else console.warn('Typeof ' + status.afterNotifyFunction + ' is not a function');
                    }
                  });
                }
              }
            }));
          });
          var defer = $.when.apply($, queue);
          defer.done(function () {
            _this.refresh();
            alerts.alert(translations.ITEMS_DELETED, 'success', s_count + ' / ' + t_count);
          });
        }
      }
    });
    /**
     * Zobrazuje náhled řádku
     */
    _defineProperty(this, "preview", function () {
      var current = _this.getCurrentItem();
      var dialog = new Dialog();
      dialog.title = translations.PREVIEW;
      dialog.enableCancelButton();
      var content = '';
      _this.getColumnList().forEach(function (item) {
        if (item.data !== 'Action' && item.data !== 'checkbox') {
          content += "\n                   <h2>".concat(item.label, "</h2>");
          if (item.columnInfo.format_function == null && item.columnInfo.format !== Grid.COLUMN_LONGTEXT) content += item.render(current[item.mData], 'display', _this.getCurrentItem(false), {});else content += current[item.mData];
          content += "<hr>\n               ";
        }
      });
      dialog.content = content;
      dialog.show();
    });
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
      'totalPrev': 0,
      'direction': 'down',
      'position': 1
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
        'updateUrl': getDataAttr(this.element, 'updateurl')
      },
      'actions': {
        'add': getDataAttr(this.element, 'actions').includes('add'),
        'edit': getDataAttr(this.element, 'actions').includes('edit'),
        'remove': getDataAttr(this.element, 'actions').includes('remove')
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
      'switchesFormToEditor': getDataAttr(this.element, 'switchesFormToEditor')
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
    $(function () {
      setTimeout(function () {
        return _this.init();
      }, 20);
      _this.relations.forEach(function (relation) {
        var found = false;
        _this.parentGrids.forEach(function (parentGrid) {
          if (parentGrid.id === window[relation.grid].id) {
            found = true;
          }
        });
        if (!found) _this.parentGrids.push(window[relation.grid]);
      });
      _this.parentGrids.forEach(function (parentGrid) {
        parentGrid.setChild(_this);
      });
    });
    if (this.params.relationswitcher && this.params.select === 'single') {
      this.relationswitcher = new RelationSwitcher(this.params.relationswitcher, $('#' + this.id + '-rs'));
      $('#' + this.id + '-rs').css('height', this.params.height);
    }
  }

  /**
   * Re/Inicializace gridu
   */
  return _createClass(Grid, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      if (this.initialized) {
        $(this.element).DataTable().clear();
        $(this.element).DataTable().destroy();
      }
      this.grid = $(this.element).DataTable(this.baseOptions);
      this.bindEvents();
      //this.loadSettings();
      $(function () {
        var params = Helpers.getQueryParams(window.location.search);
        var hasFilter = false;
        _this2.getColumnList(true).forEach(function (item) {
          var value = params[item.mData];
          if (value !== undefined && value !== '') {
            if (value.includes(',')) value = value.split(',');
            _this2.filterForm.setValue(item.mData, value);
            hasFilter = true;
          }
        });
        if (hasFilter) $(_this2.filterForm.getForm()).trigger('change');
        if (_this2.switchesForm !== undefined) {
          var vals = _this2.switchesForm.serializeArrayEntity();
          for (var k in vals) {
            if (typeof vals[k] === 'boolean') vals[k] = vals[k] ? 1 : 0;
            _this2.setUrlParameter(k, vals[k]);
          }
        }
      });
      $("#" + this.id + '-search-type').change();
      if (this.params.reorder !== '') {
        $(this.element).addClass('reorderable');
      }
      var $search = $("#" + this.id + '-search input');
      if ($search.length > 0 && $search.val().length > 0) {
        if (!this.urlParameters.searchAs || this.urlParameters.searchAs !== $search.val()) {
          $search.trigger('keyup');
        }
      }
      if (!this.params.columnReorder) {
        this.grid.colReorder.disable();
      }
      this.stateRestore.initServersideStates();
      if (this.params.useFiltersBar) {
        this.filters = JSON.parse(localStorage.getItem('DataTablesFilters_' + 'USR' + userID + '_' + this.id + '_' + window.location.pathname));
        if (this.filters) {
          this.filterRefreshnig = true;
          Object.keys(this.filters).forEach(function (key, index) {
            if (_this2.filterForm.getInput(key + '__filter').length <= 0) return;
            if (_this2.filterForm.getInput(key + '__filter').prop('type') === 'number' && _this2.filterForm.getInput(key + '__filter').data('currency') == 1) {
              _this2.filterForm.setValue(key + '__filter', _this2.filters[key] / 100);
              return;
            }
            _this2.filterForm.setValue(key + '__filter', _this2.filters[key]);
          });
          this.filterRefreshnig = false;
          if (Object.keys(this.filters).length > 0) $(this.filterForm.form).trigger('change');
        } else {
          this.filters = {};
        }
      }
      if (typeof this._onAfterInit === 'function') {
        this._onAfterInit();
      }
      if (typeof this.onAfterInit === 'function') {
        this.onAfterInit();
      }
    }

    /**
     * Bindování eventů
     */
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this3 = this;
      $("#" + this.id).on("contextmenu", "tr", function (e) {
        e.preventDefault();
        _this3.grid.rows(e.currentTarget).select();
        var $menu = $('#' + _this3.id + '-context');
        var offset = $menu.parent().offset();
        $menu.css("left", e.pageX - offset.left);
        $menu.css("top", e.pageY - offset.top);
        $menu.fadeIn(200, function () {
          $(document).on("click", function () {
            $(".dataTable-context").hide();
            // $(document).off("click");
          });
        });
      });
      $(this.filterForm.getForm()).on('change', function (e) {
        _this3.renderFiltersBar();
      });
      $(document).on("click", "#" + this.id + "_active_filters .filter .close-btn", function (e) {
        var $input = _this3.filterForm.getInput($(e.currentTarget).parent().data('name'));
        if ($input.prop('type') === 'radio') {
          _this3.filterForm.setValue($(e.currentTarget).parent().data('name'), '');
        } else {
          _this3.filterForm.setValue($(e.currentTarget).parent().data('name'), null);
        }
        $input.trigger('change');
        if ($input.hasClass('datepicker') || $input.hasClass('datetimepicker')) _this3.renderFiltersBar();
      });
      $(document).on("click", "#" + this.id + "_active_filters .reset", function (e) {
        _this3.resetFilter();
      });
      $('#' + this.id + '_filterdialog').on('hide.bs.modal', function () {
        // $(this.filterForm.getForm()).trigger('change');
      });
      $("#" + this.id).on('dblclick', "tr", function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (_this3.params.actions.edit && _this3.params.urls.editAction !== undefined && (_this3.params.select === 'single' || _this3.params.select === 'multi_checkbox')) {
          _this3.grid.rows(e.currentTarget).select();
          _this3.edit();
        } else if (typeof _this3.onDblClick === "function") {
          _this3.grid.rows(e.currentTarget).select();
          _this3.onDblClick(e);
        }
      });
      if (this.switchesForm !== undefined) {
        $(this.switchesForm.form).on('change', function (e) {
          if (_this3.switchesFormTimeout !== null) {
            clearTimeout(_this3.switchesFormTimeout);
          }
          _this3.switchesFormTimeout = setTimeout(function () {
            _this3.refresh(true);
          }, 250);
        });
        $(this.switchesForm.form).on('submit', function (e) {
          e.preventDefault();
        });
      }
      $("#" + this.id).on('click', "td.editable", function (e) {
        var isDragging = false;
        $("#" + _this3.id).on('mousedown', "td.editable", function (e) {
          $(window).mousemove(function () {
            isDragging = true;
            $(window).unbind("mousemove");
          });
        });
        $("#" + _this3.id).on('mouseup', "td.editable", function (e) {
          if ($(e.currentTarget).hasClass('editing')) return;
          var wasDragging = isDragging;
          isDragging = false;
          $(window).unbind("mousemove");
          if (!wasDragging) {
            var value = _this3.grid.cell(e.currentTarget).data();
            var column = _this3.getColumnList()[_this3.grid.cell(e.currentTarget).index().column];
            var row = _this3.grid.row(_this3.grid.cell(e.currentTarget).index().row);
            _this3.createInlineEdit(e.currentTarget, column, row, value);
          }
        });
      });
      this.grid.on('order.dt', function () {
        //this.params.order.reordered = true;
      });
      if (!Grid.keypressEventInit) {
        $(document).keydown(function (event) {
          if (event.keyCode == 46) {
            if (typeof Grid.lastUsedGrid !== 'undefined' && Grid.lastUsedGrid !== null) {
              if (!Grid.lastUsedGrid.params.actions.remove) return;
              if ($(event.target).prop('tagName') === 'INPUT') return;
              if ($("#" + _this3.id).closest('.dataTable-package')[0].offsetParent === null) return;
              if (Dialog.getOpenDialogs().length > 0) return;
              Grid.lastUsedGrid.remove();
            }
          }
        });
        Grid.keypressEventInit = true;
      }
      $("#" + this.id).closest('.dataTable-package').on('click', function (e) {
        Grid.lastUsedGrid = _this3;
      });
      $("#" + this.id).on('click', "tr", function (e) {
        if (_this3.params.select === 'multi_checkbox') {
          if (!$(e.target).hasClass('select-checkbox') && !e.ctrlKey && !e.shiftKey) {
            _this3.grid.rows().deselect();
            // this.grid.row(e.currentTarget).select();
          } else if (e.shiftKey && !$(e.target).closest('tr').hasClass('selected')) {
            var currentRow = _this3.grid.row($($(e.target).closest('tr')[0]))[0][0];
            if (currentRow < _this3.grid.rows('.selected')[0][0]) {
              var lastSelectedRow = _this3.grid.rows('.selected')[0][0];
              for (var i = currentRow + 1; i < lastSelectedRow; i++) {
                _this3.grid.row(i).select();
              }
            } else if (currentRow > _this3.grid.rows('.selected')[0][_this3.grid.rows('.selected')[0].length - 1]) {
              var _lastSelectedRow = _this3.grid.rows('.selected')[0][_this3.grid.rows('.selected')[0].length - 1];
              for (var _i = currentRow - 1; _i > _lastSelectedRow; _i--) {
                _this3.grid.row(_i).select();
              }
            }
          }
        }
        if ($(e.target).closest('tr').hasClass('selected')) {
          if (typeof _this3.onCurrentItemUnSelect === 'function') _this3.onCurrentItemUnSelect(e);
          if (_this3.relationswitcher !== undefined) {
            _this3.relationswitcher.setParent(null);
          }
          if (typeof _this3.onUnSelect !== 'function') {
            _this3.onUnSelect = function (e, indexes) {
              _this3.onCurrentItemChanged();
              _this3.onUnSelect = null;
            };
          }
        }
        if (typeof e.target.onclick === 'function') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        if (e.altKey) {
          Helpers.copyToClipboard($(e.target).text());
          alerts.alert(translations.COPY_TO_CLIPBOARD, 'info');
        }
      });
      $("#" + this.id + '-search input').keyup(Helpers.delay(function (e) {
        var val = e.target.value;
        if (val.length > 0) $(e.target).siblings('span').show();else $(e.target).siblings('span').hide();
        if (e.target.name.includes(',')) {
          _this3.setUrlParameter('gridSearch', JSON.stringify([e.target.name, val]));
        } else _this3.setUrlParameter(e.target.name, val);
        _this3.setUrlParameter('start', 0);
        _this3.refresh(true);
      }, this, 400));
      $("#" + this.id + '-search-type').on('change', function (e) {
        _this3.setUrlParameter('SearchBy', $(e.currentTarget).val());
        $("#" + _this3.id + '-search input').attr('name', $(e.currentTarget).val());
        if ($("#" + _this3.id + '-search-type option:selected').text() !== '') $("#" + _this3.id + '-search i').html('<span class="searchTypePrefix">' + $("#" + _this3.id + '-search-type option:selected').text() + ':</span>');else {
          $("#" + _this3.id + '-search i').html('<span class="searchTypePrefix">' + $("#" + _this3.id + '-search-type option:selected').text() + '</span>');
        }
        $("#" + _this3.id + '-search input').css('padding-left', 21 + $("#" + _this3.id + '-search i').width() + 'px');
        if ($("#" + _this3.id + '-search input').val() !== '') {
          $("#" + _this3.id + '-search input').trigger('keyup');
        }
      });
      this.grid.on('select', function (e, dt, type, indexes) {
        if (e.namespace === 'dt' && typeof _this3.onSelect === 'function') _this3.onSelect(e, indexes);
        if (_this3.relationswitcher !== undefined) {
          _this3.relationswitcher.setParent(_this3.getCurrentItem()['ID']);
        }
        if (_this3.params.select !== 'single') {
          _this3.getCurrentItem().forEach(function (row, index) {
            var obj = _this3.selectedRows.find(function (o) {
              return o.ID === row.ID;
            });
            if (typeof obj === 'undefined') {
              _this3.selectedRows.push(row);
            }
          });
          _this3.updateMultiselectAllCount(_this3.selectedRows.length);
        }
        if (_this3.params.multipleType !== 'all' && _this3.params.select !== 'single') {
          _this3.updateMultiselectAllCount(_this3.getSelectedCount());
        }
        _this3.onCurrentItemChanged(indexes);
      });
      this.grid.on('deselect', function (e, dt, type, indexes) {
        if (e.namespace === 'dt' && typeof _this3.onUnSelect === 'function') _this3.onUnSelect(e, indexes);
        if (_this3.params.select !== 'single') {
          if (_this3.getCurrentItem()) {
            _this3.selectedRows.forEach(function (row, index) {
              var obj = _this3.getCurrentItem().find(function (o) {
                return o.ID === row.ID;
              });
              if (typeof obj === 'undefined' && typeof _this3.grid.rows().data().toArray().find(function (o) {
                return o.ID === row.ID;
              }) !== 'undefined') {
                _this3.selectedRows = _this3.selectedRows.filter(function (a) {
                  return a.ID != row.ID;
                });
              }
            });
            _this3.updateMultiselectAllCount(_this3.selectedRows.length);
          } else {
            _this3.selectedRows.forEach(function (row, index) {
              if (typeof _this3.grid.rows().data().toArray().find(function (o) {
                return o.ID === row.ID;
              }) !== 'undefined') {
                _this3.selectedRows = _this3.selectedRows.filter(function (a) {
                  return a.ID != row.ID;
                });
              }
            });
            _this3.updateMultiselectAllCount(_this3.selectedRows.length);
          }
        }
        if (_this3.params.multipleType !== 'all' && _this3.params.select !== 'single') {
          _this3.updateMultiselectAllCount(_this3.getSelectedCount());
        }
      });
      this.grid.on('row-reorder', function (e, diff, object) {
        var data = [];
        if (_this3.params.customRowReorder) {
          var newPosition;
          for (var i = 0, ien = diff.length; i < ien; i++) {
            var rowData = _this3.grid.row(diff[i].node).data();
            if (rowData.ID === object.triggerRow.data().ID) {
              newPosition = diff[i].newPosition;
            }
          }
          var obj = {};
          obj.ID = object.triggerRow.data().ID;
          obj[_this3.params.reorder] = newPosition;
          data.push(obj);
        } else {
          for (var _i2 = 0, _ien = diff.length; _i2 < _ien; _i2++) {
            var _rowData = _this3.grid.row(diff[_i2].node).data();
            var _obj = {};
            _obj.ID = _rowData['ID'];
            _obj[_this3.params.reorder] = diff[_i2].newPosition;
            data.push(_obj);
          }
        }
        var queue = [];
        data.forEach(function (row) {
          queue.push(Helpers.ajax({
            url: _this3.params.urls.updateUrl,
            data: {
              data: JSON.stringify(row)
            },
            success: function success() {}
          }));
        });
        var defer = $.when.apply($, queue);
        defer.done(function () {
          _this3.refresh();
          alerts.alert('Ok', 'success', '');
        });
      });
      this.grid.on('column-reorder', function () {
        // if (this.initialized)
        //     this.saveSettings();
      });
      this.grid.on('column-visibility.dt', function (e) {
        // if (this.initialized)
        //     this.saveSettings()
      });
      this.grid.on('xhr.dt', function (e) {
        if (_this3.params.infiniteScroll) {
          _this3.range.position = _this3.grid.scroller.page().start;
          _this3.grid.on('draw', function () {
            if (_this3.refreshing) {
              _this3.grid.scroller.toPosition(_this3.range.position, false);
              //this.cancelAjax = true;
            }
            //$(this.element).parent().scrollTop(this.range.scroll);
            //this.grid.row(this.range.position).scrollTo(false);
          });
        }
      });
      $("#" + this.id).on('mouseover', "td .text", function (e) {
        var $target = $(e.currentTarget);
        var $td = $target.closest('td');
        if ($target.width() > $td.width() + 10) {
          var _$target$data;
          var $div = $('<div />');
          $div.addClass("overflowHover");
          $div.text((_$target$data = $target.data('text')) !== null && _$target$data !== void 0 ? _$target$data : $target.text());
          $div.appendTo('body');
          $div.css('left', $target.offset().left + $td.width() / 2);
          $div.css('top', $target.offset().top + $td.height() / 2);
          $div.css('max-width', $td.width() * 2);
          $div.show();
        }
      });
      $("#" + this.id).on('mouseout', "td .text", function (e) {
        var $target = $(e.currentTarget);
        var $hover = $('.overflowHover');
        if ($hover.length > 0) {
          $hover.remove();
        }
      });
      if (this.params.urls.editAction) {
        $(document).on('mousedown', '.' + this.id + '_edit_button', function (e) {
          if (e.which === 2) {
            if (_this3.getSelectedCount() > 1) {
              alerts.alert(translations.SELECT_ONLY_ONE);
              return;
            } else if (_this3.getSelectedCount() === 0) {
              alerts.alert(translations.SELECT_ROW, 'info', translations.SELECT_ROW_TEXT);
              return;
            }
            if (_this3.params.urls.editAction.includes('?')) {
              window.open(_this3.params.urls.editAction + '&entity_ID=' + _this3.getCurrentItemValue('ID'), '_blank').focus();
            } else {
              window.open(_this3.params.urls.editAction + '?entity_ID=' + _this3.getCurrentItemValue('ID'), '_blank').focus();
            }
          }
        });
      }
    }
  }, {
    key: "renderFiltersBar",
    value: function renderFiltersBar() {
      var _this4 = this;
      if (this.filterRefreshnig) return;
      var data = this.filterForm.serializeArrayEntity();
      var keys = Object.keys(data).map(function (str) {
        return str.substring(0, str.indexOf('__'));
      }).filter(function (item) {
        return item !== '';
      });
      keys.forEach(function (v) {
        _this4.unsetUrlParameter(v);
        if (typeof _this4.filters[v] !== 'undefined') delete _this4.filters[v];
      });
      keys.filter(function (item) {
        return data[item + '__filter'] !== '';
      }).forEach(function (v) {
        var val = data[v + '__filter'];
        _this4.setUrlParameter(v, val);
        if (val) {
          if (Array.isArray(val) && val.length === 0) {
            return;
          }
          _this4.filters[v] = val;
        }
      });
      var $filtersEl = $('#' + this.id + '_active_filters').find('.filters');
      var count = 0;
      $filtersEl.html('');
      if (Object.keys(this.filters).length > 0) {
        if (this.params.useFiltersBar) {
          $('#' + this.id + '_active_filters').removeClass('d-none');
        }
        Object.keys(this.filters).forEach(function (key, index) {
          if (_this4.filterForm.getInput(key + '__filter').length <= 0) return;
          count++;
          var val = $(_this4.filterForm.form).find('label[for="' + _this4.filterForm.id + '_' + key + '__filter' + '"]').text();
          if (val) val = val.replace(' *', '');
          var text = _this4.filters[key];
          if (_this4.filterForm.getInput(key + '__filter').prop('tagName') === 'SELECT') {
            text = '';
            var _keys = [];
            if (!Array.isArray(_this4.filters[key])) {
              _keys.push(_this4.filters[key]);
            } else {
              _keys = _this4.filters[key];
            }
            _keys.forEach(function (k, i) {
              if (text !== '') text += ', ';
              text += _this4.filterForm.getInput(key + '__filter').find('option[value="' + k + '"]').text();
            });
          } else {
            if (_this4.filterForm.getInput(key + '__filter').prop('type') === 'radio') {
              if (text == 1) {
                text = translations.YES;
              } else if (text == 0) {
                text = translations.NO;
              }
            }
            if (_this4.filterForm.getInput(key + '__filter').prop('type') === 'number' && _this4.filterForm.getInput(key + '__filter').data('currency') == 1) {
              text = text / 100;
            }
          }
          $filtersEl.append('<div class="filter" data-name="' + key + '__filter"><div class="name">' + val + ':</div><div class="value">' + text + '</div><div aria-hidden="true" class="close-btn">×</div></div>');
        });
      } else {
        if (!$('#' + this.id + '_active_filters').hasClass('d-none')) $('#' + this.id + '_active_filters').addClass('d-none');
      }
      $('#' + this.id + '_active_filters .counter').text(count);
      $('#' + this.id + '_filterbutton').attr('data-filtercount', count);
      localStorage.setItem('DataTablesFilters_' + 'USR' + userID + '_' + this.id + '_' + window.location.pathname, JSON.stringify(this.filters));
      this.refresh(true);
    }

    /**
     * Uloží nastavení gridu do DB
     */
  }, {
    key: "saveSettings",
    value: function saveSettings() {
      var _this5 = this;
      if (typeof DISABLE_GRID_SETTINGS !== "undefined") {
        return;
      }
      var column_list = this.getColumnList();
      var columns = {
        'items': {},
        'order': this.grid.colReorder.order()
      };
      column_list.forEach(function (item) {
        if (item.mData !== 'Action') {
          var col = _this5.getColumn(item.name);
          columns['items'][item.mData] = {
            'visible': col.visible()
          };
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
  }, {
    key: "loadSettings",
    value: function loadSettings() {
      var _this6 = this;
      if (typeof DISABLE_GRID_SETTINGS !== "undefined") {
        this.initialized = true;
        return;
      }
      this.initialized = false;
      Helpers.ajax({
        url: basePath + '/user/grid-settings/load-settings',
        data: {
          Name: this.id
        },
        success: function success(data) {
          if (data !== null && data !== "") {
            data = JSON.parse(data);
            for (var item in data.items) {
              _this6.getColumn(item).visible(data.items[item].visible);
            }
            _this6.grid.colReorder.order(data.order);
          }
          _this6.initialized = true;
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
  }, {
    key: "createInlineEdit",
    value: function createInlineEdit(element, column, row, value) {
      var _this7 = this;
      var $cell = $(element);
      $cell.closest('table').addClass('editing');
      var $editor = $cell.append('<div class="editor"></div>');
      $cell.addClass('editing');
      var input = '';
      switch (column.editType) {
        case 'default':
          switch (column.format) {
            case Grid.COLUMN_BOOL:
              input = "\n                            <select name=\"".concat(column.name, "\" data-id=\"").concat(row.data()['ID'], "\">\n                                <option value=\"1\" ").concat(value === '1' ? 'selected' : '', ">Ano</option>\n                                <option value=\"0\" ").concat(value === '0' ? 'selected' : '', ">Ne</option>\n                            </select>\n                        ");
              break;
            case Grid.COLUMN_ENUM:
            case Grid.COLUMN_ENTITY:
              input = "<select name=\"".concat(column.name, "\" data-id=\"").concat(row.data()['ID'], "\">");
              var values = column.select_values;
              for (var k in values) {
                input += "<option value=\"".concat(k, "\" ").concat(value == k ? 'selected' : '', ">").concat(values[k], "</option>");
              }
              input += "</select>";
              break;
            case Grid.COLUMN_NUMBER:
              input = "<input type=\"number\" value=\"".concat(value === null ? '' : value, "\" name=\"").concat(column.name, "\" data-id=\"").concat(row.data()['ID'], "\">");
              break;
            default:
              input = "<input value=\"".concat(value === null ? '' : value, "\" name=\"").concat(column.name, "\" data-id=\"").concat(row.data()['ID'], "\">");
          }
          break;
        case 'ajax-select':
          input = column.editParams.input;
          input = $(input).attr('data-id', row.data()['ID']);
          input = $(input).append("<option value=\"old_unchanged_value\" selected>".concat(value, "</option>"));
          break;
      }
      $editor.html(input);
      $editor.find(':input').focus();
      $editor.find(':input').on('change focusout', function (e) {
        if ($(e.currentTarget).is('select') && e.type !== 'focusout' || !$(e.currentTarget).is('select') && $(e.currentTarget).attr('type') !== 'number' || $(e.currentTarget).attr('type') === 'number' && e.type !== 'change') {
          if ($editor) {
            processInlineEditor(e.currentTarget);
          }
        }
      });
      if (column.editType === 'ajax-select' || $editor.find('select').length > 0) {
        var onMouseup = $(document).on('mouseup', 'html', function (e) {
          var container = $($editor).find('.select2').parent();

          // if the target of the click isn't the container nor a descendant of the container
          if (!container.is(e.target) && container.has(e.target).length === 0) {
            $(document).off('mouseup', 'html');
            _this7.refresh();
          }
        });
        if (column.editType === 'ajax-select') plugins.initSelect2Ajax(this.element);else {
          plugins.initSelect2();
        }
      }
      var processInlineEditor = function processInlineEditor(e) {
        var $input = $(e);
        var data = {
          ID: $input.data('id')
        };
        data[$input.attr('name')] = $input.val();
        if (_this7.params.urls.inlineEditAction) {
          Helpers.ajax({
            url: _this7.params.urls.inlineEditAction,
            data: {
              data: JSON.stringify(data)
            },
            success: function success() {
              _this7.refresh();
              $(_this7.element).removeClass('editing');
              if (typeof _this7.onAfterInlineChange === 'function') _this7.onAfterInlineChange($input.attr('name'), $input.val(), $input.data('id'));
              if (column.editType === 'ajax-select' || column.format === Grid.COLUMN_ENUM || column.format === Grid.COLUMN_ENTITY || column.format === Grid.COLUMN_BOOL) {
                $(document).off('mouseup', 'html');
                $input.select2('destroy');
              }
              $input.remove();
            }
          });
        } else {
          $cell.addClass('changed');
          $(_this7.element).removeClass('editing');
          if (column.editType === 'ajax-select' || column.editType === Grid.COLUMN_ENUM || column.editType === Grid.COLUMN_ENTITY || column.editType === Grid.COLUMN_BOOL) {
            $(document).off('mouseup', 'html');
            $input.select2('destroy');
          }
          _this7.grid.cell(element).data($input.val());
          if (typeof _this7.onAfterInlineChange === 'function') _this7.onAfterInlineChange($input.attr('name'), $input.val(), $input.data('id'));
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
  }, {
    key: "colFormatter",
    value: function colFormatter(data, type, row, format, name) {
      var onlyData = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
      switch (format) {
        case Grid.COLUMN_DATE:
          if (data != null) {
            var d = moment(data);
            return d.format('L');
          } else return "";
        case Grid.COLUMN_BOOL:
          if (data === null) return translations.NO;
          return Number(data) ? translations.YES : translations.NO;
        case Grid.COLUMN_TIME:
          if (data === null) return "";
          var t = moment(data);
          return t.format('LTS');
        case Grid.COLUMN_DATETIME:
          if (data === null) return "";
          var dt = moment(data);
          return dt.format('L LTS');
        case Grid.COLUMN_TIMESTAMP:
          if (data === null) return "";
          var dtt = moment.unix(data);
          return dtt.format('D. M. Y HH:mm:ss');
        case Grid.COLUMN_CURRENCY:
          if (data === null) return "";
          return Helpers.formatPrice(data / 100, 2);
        case Grid.COLUMN_CURRENCY_CZK:
          if (data === null) return "";
          return Helpers.formatPrice(data / 100, 2) + " Kč";
        case Grid.COLUMN_CURRENCY_EUR:
          if (data === null) return "";
          return Helpers.formatPrice(data / 100, 2) + " €";
        case Grid.COLUMN_CURRENCY_USD:
          if (data === null) return "";
          return Helpers.formatPrice(data / 100, 2) + " $";
        case Grid.COLUMN_CURRENCY_GBP:
          if (data === null) return "";
          return Helpers.formatPrice(data / 100, 2) + " £";
        case Grid.COLUMN_CURRENCY_PLN:
          if (data === null) return "";
          return Helpers.formatPrice(data / 100, 2) + " zł";
        case Grid.COLUMN_LONGTEXT:
          if (data === null) return "";
          data = data.replace(/<(?:.|\n)*?>/gm, '');
          if (onlyData) return data.substr(0, 100);else return "<span class=\"text\" data-text=\"".concat(data.substr(0, 500), "\">").concat(data.substr(0, 100), "...</span>");
        case Grid.COLUMN_CHECKBOX:
          if (onlyData) return data === '1' || data === true ? translations.YES : translations.NO;
          return "<label class=\"checkbox\"><input type=\"checkbox\" class=\"form-control\" onchange=\"window['".concat(this.id, "'].toggleBoolean(").concat(row.ID, ", '").concat(name, "', this)\" ").concat(data === '1' || data === true ? 'checked' : '', "><span class=\"checkmark\"></span><span class=\"text\">").concat(data === '1' || data === true ? translations.YES : translations.NO, "</span></label>");
        case Grid.COLUMN_TEXT:
          if (data == null) return "";
          var span = document.createElement('span');
          span.classList.add('text');
          span.innerText = span.textContent = data;
          if (onlyData) return span.innerText;
          return span.outerHTML;
        default:
          if (data === null) return '';
          if (onlyData) return data;
          return "<span class=\"text\">".concat(data, "</span>");
      }
    }
  }, {
    key: "getColumnList",
    value:
    /**
     * Vrací seznam sloupců v gridu
     * @returns {null|[]}
     */
    function getColumnList() {
      var _this8 = this;
      var def = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (def) {
        return this.grid.settings().init().aoColumnDefs;
      }
      var columns = [];
      if (this.params.columnReorder) {
        this.grid.colReorder.order().forEach(function (col, i) {
          columns.push(_this8.grid.settings().init().aoColumnDefs[col]);
        });
      } else {
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
  }, {
    key: "toggleBoolean",
    value: function toggleBoolean(id, column, checkbox) {
      var _this9 = this;
      var data = {
        ID: id
      };
      data[column] = $(checkbox).prop('checked') ? '1' : '0';
      Helpers.ajax({
        url: this.params.urls.updateUrl,
        data: {
          data: JSON.stringify(data)
        },
        success: function success() {
          if (data[column] === '1') $(checkbox).siblings('.text').text(translations.YES);else $(checkbox).siblings('.text').text(translations.NO);
          if (typeof _this9.onAfterInlineChange === 'function') _this9.onAfterInlineChange(column, $(checkbox).prop('checked'), id);
        }
      });
    }

    /**
     * Zobrazí dialog s nastavením viditelnosti sloupců
     */
  }, {
    key: "showColumnVisibilityDialog",
    value: function showColumnVisibilityDialog() {
      var _this0 = this;
      var dialog = new Dialog();
      var content = '<div class="dataTable-columnvisibility row">';
      this.getColumnList().forEach(function (item) {
        if (item.name === 'checkbox' || item.name === 'actions') return;
        var col = _this0.getColumn(item.name);
        content += "\n            <div class=\"btn-group-toggle col-md-6\" data-toggle=\"buttons\">\n                <label class=\"btn ".concat(col.visible() ? 'active' : '', "\">\n                    <input type=\"checkbox\" ").concat(col.visible() ? 'checked="true"' : '', " autocomplete=\"off\" onchange=\"window['").concat(_this0.id, "'].getColumn('").concat(item.name, "').visible(this.checked)\"> ").concat(item.label, "\n                </label>\n            </div>\n            ");
      });
      content += "</div>";
      dialog.content = content;
      dialog.title = translations.SHOW_HIDE_COLUMNS;
      dialog.show();
    }

    /**
     * Vrací základní nastavení gridu
     * @returns {{}}
     */
  }, {
    key: "getBaseOptions",
    value: function getBaseOptions() {
      var _this1 = this;
      var options = {
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
        stateSaveCallback: function stateSaveCallback(settings, data) {
          if (_this1.grid) {
            data.order = _this1.grid.order();
            if (data.order.length && typeof data.order[0]._idx !== 'undefined') {
              delete data.order[0]._idx;
            }
          }
          delete data.scroller;
          delete data.select;
          delete data.search;
          delete data.childRows;
          delete data.length;
          if (!_this1.params.columnReorder) {
            delete data.ColReorder;
          } else {
            data.columnsWidth = _this1.columnsWidth;
          }
          data.start = 0;
          if (_this1.params.presetSaveType === 'local') {
            localStorage.setItem('DataTables_' + 'USR' + userID + '_' + settings.sInstance + '_' + window.location.pathname, JSON.stringify(data));
          } else {
            var old = localStorage.getItem('DataTables_' + 'USR' + userID + '_' + settings.sInstance + '_' + window.location.pathname);
            if (old) {
              var oldObj = JSON.parse(old);
              oldObj.time = data.time;
              if (typeof oldObj.ColReorder !== "undefined") {
                if (typeof data.ColReorder === "undefined") {
                  data.ColReorder = oldObj.ColReorder;
                }
              }
              delete oldObj.length;
              var equal = Helpers.deepEqual(oldObj, data);
              if (equal) return null;
            }
            _this1.stateRestore.saveState('_tmp_', JSON.stringify(data));
            localStorage.setItem('DataTables_' + 'USR' + userID + '_' + settings.sInstance + '_' + window.location.pathname, JSON.stringify(data));
          }
        },
        stateLoadCallback: function stateLoadCallback(settings, callback) {
          var data = null;
          if (_this1.params.presetSaveType === 'local') {
            data = JSON.parse(localStorage.getItem('DataTables_' + 'USR' + userID + '_' + settings.sInstance + '_' + window.location.pathname));
          } else {
            data = _this1.stateRestore.getState('_tmp_');
            if (!data) return null;else {
              if (!data.Data) return null;else data = JSON.parse(data.Data);
            }
          }
          // this.grid.settings().init().aoColumnsDefs.forEach((col, i) => {
          //     $(this.grid.column(col).header()).width(data.columnsWidth[col]);
          //     this.grid.settings().init().aoColumnsDefs[col].width = data.columnsWidth[col];
          // });

          if (!data) return null;
          if (!_this1.params.columnReorder) {
            if (typeof data.ColReorder !== 'undefined') delete data.ColReorder;
            data.columnsWidth = [];
          }
          if (data) {
            if (typeof data.columnsWidth === 'undefined') data.columnsWidth = [];
            _this1.columnsWidth = data.columnsWidth;
          }
          return data;
        },
        stateLoaded: function stateLoaded(settings, data) {},
        searching: false,
        preDrawCallback: function preDrawCallback() {
          /*this.grid.columns()[0].forEach((i) => {
              let col = this.grid.column(i).header();
              $(col).css('max-width', col.style.width);
          });*/

          if (_this1.refreshing && _this1.range.total === _this1.range.totalPrev) {
            $(_this1.element).parent().scrollTop(_this1.range.scroll);
          }
          if (_this1.columnsWidth.length > 0) {
            _this1.grid.columns()[0].forEach(function (col, i) {
              if (!_this1.columnsWidth[col]) return;
              $(_this1.grid.column(col).header()).css('width', _this1.columnsWidth[col]);
              _this1.grid.settings()[0].aoColumns[i].sWidth = _this1.columnsWidth[col];
              _this1.grid.settings()[0].aoColumns[i].width = _this1.columnsWidth[col];
            });
          }
          try {
            _this1.grid.columns.adjust();
          } catch (e) {}
        },
        initComplete: function initComplete() {
          $(_this1.element).parent().css('height', _this1.params.height);
          _this1.urlParameters = _this1.grid.ajax.params();
          if (_this1.urlParameters === undefined) _this1.urlParameters = {};
          if (_this1.columnsWidth.length > 0) {
            _this1.grid.columns()[0].forEach(function (col, i) {
              if (!_this1.columnsWidth[col]) return;
              $(_this1.grid.column(col).header()).css('width', _this1.columnsWidth[col]);
              _this1.grid.settings()[0].aoColumns[i].sWidth = _this1.columnsWidth[col];
              _this1.grid.settings()[0].aoColumns[i].width = _this1.columnsWidth[col];
            });
          }
          try {
            _this1.grid.columns.adjust();
          } catch (e) {}
          if (typeof _this1.onAfterInit === 'function') {
            _this1.onAfterInit();
          }
        },
        drawCallback: function drawCallback() {
          if (_this1.params.multipleType === 'all' && _this1.selectedRows.length) {
            _this1.selectedRows.forEach(function (row, index) {
              var i = _this1.grid.rows().data().toArray().indexOf(_this1.grid.rows().data().toArray().find(function (o) {
                return o.ID === row.ID;
              }));
              if (i >= 0) {
                _this1.grid.rows(i).select();
              }
            });
          }
          if (_this1.params.multipleType !== 'all' && _this1.params.select !== 'single') {
            _this1.updateMultiselectAllCount(_this1.getSelectedCount());
          }
          if (_this1.refreshing && _this1.range.total === _this1.range.totalPrev) {
            //$(this.element).parent().scrollTop(this.range.scroll);
            if (_this1.recentItemIndex !== null && _this1.recentItemIndex !== undefined) if (typeof _this1.recentItemIndex === 'number') _this1.getRowByIndex(_this1.recentItemIndex).select();else if (_typeof(_this1.recentItemIndex) === 'object') _this1.grid.rows(_this1.recentItemIndex).select();
          }
          _this1.recentItemIndex = null;
        },
        ajax: this.params.dataSaveType === 'serverside' && this.params.ajax ? {
          url: this.params.urls.datalistUrl,
          beforeSend: function beforeSend(xhr, settings) {
            var cancel = _this1.cancelAjax;
            _this1.cancelAjax = false;
            if (cancel) {
              xhr.abort();
              console.log(_this1._xhr);
            } else {
              if (_this1._xhr && _this1._xhr.readyState !== 4) {
                _this1._xhr.abort();
                console.log(_this1._xhr);
              }
              _this1._xhr = xhr;
            }
          },
          data: function data(d, datatable, settings) {
            var sort = (d.order[0].dir === 'asc' ? '' : '-') + _this1.getColumnList(true)[d.order[0].column].name;
            if (_this1.params.order.reordered) {
              try {
                sort = (d.order[0].dir === 'asc' ? '' : '-') + _this1.getColumnList()[d.order[0].column].name;
              } catch (e) {}
            } else {
              if (d.draw === 1) {
                if (_this1.grid.state.loaded()) {
                  //this.grid.colReorder.order(this.grid.state.loaded().ColReorder);
                  // this.grid.state.loaded().order[0][0] = Object.keys(this.grid.state.loaded().ColReorder).find(key => this.grid.state.loaded().ColReorder[key] === this.grid.state.loaded().order[0][0]);
                  if (typeof _this1.grid.state.loaded().ColReorder !== 'undefined') {
                    _this1.grid.state.loaded().order[0][0] = _this1.grid.state.loaded().ColReorder[_this1.grid.state.loaded().order[0][0]];
                    _this1.grid.order(_this1.grid.state.loaded().order);
                    d.order[0].column = _this1.grid.state.loaded().order[0][0];
                  }
                }
              }
              try {
                sort = (d.order[0].dir === 'asc' ? '' : '-') + _this1.getColumnList()[d.order[0].column].name;
              } catch (e) {}
            }
            var length = d.length > 0 ? d.length : 0;
            var currentFrom = 0;
            var currentTo = 0;
            if (d.start !== 0) {
              currentFrom = _this1.range.from;
              currentTo = _this1.range.to;
            }
            if (typeof _this1.modifySortData === 'function') {
              sort = _this1.modifySortData(sort, d);
            }
            var rangeFrom = d.start;
            var rangeTo = d.start + length;
            var direction;
            _this1.range.totalPrev = _this1.range.total;
            var start;
            var draw = d.draw;
            d = {};
            var count = rangeTo - currentTo;
            if (count > length || count === 0) count = length;
            if (currentTo < rangeTo) {
              direction = 'down';
              if (count < 0) count = 0;
              if (rangeFrom > currentTo) start = rangeFrom;else start = currentTo;
            } else if (currentTo > rangeTo) {
              direction = 'up';
              if (count < 0) count = Math.abs(count);
              if (rangeFrom < currentFrom - length) {
                count = length;
                start = rangeTo;
              } else start = currentFrom - count;
            } else {
              direction = 'refresh';
              start = rangeFrom;
              count = length;
            }
            if (_this1.refreshing) {
              direction = 'refresh';
              count = length;
              rangeFrom = _this1.range.from;
              start = _this1.range.from;
              if (currentFrom === 0) {
                rangeFrom = 0;
                start = 0;
              }
            }
            if (rangeFrom === 0) {
              direction = 'refresh';
              start = 0;
              count = length;
            }
            if ((draw > 1 && count < _this1.params.displayBuffer * 2 || _this1.cancelAjax) && _this1.params.infiniteScroll) {
              _this1.cancelAjax = true;
              return;
            } else {
              _this1.cancelAjax = false;
              _this1.range.from = rangeFrom;
              _this1.range.to = rangeTo;
              _this1.range.direction = direction;
            }
            _this1.setUrlParameter('sort', sort);
            _this1.setUrlParameter('count', count);
            _this1.setUrlParameter('start', start);
            if (_this1.switchesForm !== undefined) {
              var data = _this1.switchesForm.serializeArrayEntity();
              for (var i in data) {
                if (typeof data[i] === 'boolean') data[i] = data[i] ? 1 : 0;
                _this1.setUrlParameter(i, data[i]);
                if (_this1.params.switchesFormToEditor) {
                  _this1.createDefaultValues[i] = data[i];
                }
              }
            }
            if (getDataAttr(_this1.element, 'parent-element') !== '' && getDataAttr(_this1.element, 'parent-editor') !== '') {
              _this1.setUrlParameter(getDataAttr(_this1.element, 'parent-element'), window[getDataAttr(_this1.element, 'parent-editor')].entity_id);
            }
            for (var key in _this1.urlParameters) {
              if (_this1.urlParameters[key] !== null && _this1.urlParameters[key] !== 'null' && _this1.urlParameters[key] !== '') d[key] = _this1.urlParameters[key];
            }
            return d;
          },
          dataFilter: function dataFilter(data, a, b) {
            var json;
            if (typeof data === 'string') json = JSON.parse(data);else json = data;
            json.recordsTotal = json.numRows;
            json.recordsFiltered = json.numRows;
            if (json.statuses !== undefined) {
              Helpers.alertAuthStatuses(json.statuses);
              var hasAuthError = Helpers.getStatusesByType(json.statuses, 'auth_error');
              if (hasAuthError.length > 0) {
                var OAuthServer = JSON.parse(hasAuthError[0].msg).OAuthServer;
                AuthWindow.open(OAuthServer);
              }
            }
            _this1.getColumnByFormat(Grid.COLUMN_COUNTER).forEach(function (column, index) {
              json.items.forEach(function (row, index) {
                row[column.columnInfo.name] = _this1.urlParameters.start + (index + 1);
              });
            });
            if (_this1.range.direction === 'down') {
              json.data = _this1.grid.data().toArray().slice(json.items.length);
              json.data = json.data.concat(json.items);
            } else if (_this1.range.direction === 'up') {
              json.data = json.items;
              json.data = json.data.concat(_this1.grid.data().toArray().slice(0, _this1.grid.data().toArray().length - json.items.length));
            } else {
              json.data = json.items;
            }
            delete json.items;
            delete json.numRows;
            $('#' + _this1.id + '_counter').text(json.recordsTotal + (json.message !== undefined ? ' - ' + json.message : ''));
            if ($(_this1.element).closest('.tab-pane').length > 0) {
              var item = $('#' + $(_this1.element).closest('.tab-pane').attr('id') + '-link .counter');
              item.text('(' + json.recordsTotal + ')');
            }
            _this1.range.total = json.recordsTotal;
            return JSON.stringify(json);
          },
          error: function error(err) {
            console.log(err);
          }
        } : null
      };
      if (this.params.columnReorder) {
        options.colReorder = {
          realtime: false
        };
        options.dom += 'R';
        options.colResize = {
          isEnabled: true,
          hoverClass: 'dt-colresizable-hover',
          hasBoundCheck: false,
          minBoundClass: 'dt-colresizable-bound-min',
          maxBoundClass: 'dt-colresizable-bound-max',
          isResizable: function isResizable(column) {
            return true;
          },
          onResizeStart: function onResizeStart(column, columns) {},
          onResize: function onResize(column) {},
          onResizeEnd: function onResizeEnd(column, columns) {
            _this1.grid.columns()[0].forEach(function (col, i) {
              _this1.columnsWidth[col] = _this1.grid.settings()[0].aoColumns[i].sWidth;
            });
            _this1.grid.state.save();
          },
          getMinWidthOf: function getMinWidthOf($thNode) {}
        };
      }
      if (!this.params.ajax) {
        options.data = this.params.data;
        this.setCounter(options.data.length);
      }
      if (this.params.infiniteScroll) {
        options.scroller = {
          loadingIndicator: true,
          rowHeight: 33,
          displayBuffer: this.params.displayBuffer
        };
      }
      options.aoColumnDefs = [];
      if (this.params.select === 'single') options.select = {
        style: 'single'
      };
      if (this.params.select === 'multi') options.select = {
        style: 'multi'
      };
      if (this.params.select.includes('checkbox')) {
        options.select = {
          style: 'os',
          selector: 'td:first-child'
        };
      }

      //options.aoColumns = this.setGridColumns();

      var columns_json = getDataAttr(this.element, 'columns');
      columns_json.forEach(function (v, i) {
        if (v.name === 'checkbox') {
          var checkbox = {
            data: "checkbox",
            orderable: false,
            colReorder: false,
            className: 'select-checkbox',
            targets: 0,
            width: '20px',
            name: 'checkbox',
            label: v.label,
            render: function render() {
              return '';
            }
          };
          options.aoColumnDefs.push(checkbox);
          _this1.columnIndexes.push('checkbox');
          return;
        }
        var col = {
          targets: i
        };
        col.width = v.minwidth;
        col.sWidth = v.minwidth;
        col.visible = v.visibility;
        if (v.editable) col.className = 'editable';
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
        var enum_values = JSON.parse(v.entity_values);
        var enum_values2 = JSON.parse(v.entity_values);
        col.enum_values = enum_values;
        col.select_values = enum_values2;
        col.render = function (data, type, row, meta) {
          if (v.format === Grid.COLUMN_ENTITY || v.format === Grid.COLUMN_ENUM) {
            if (enum_values === null) return 'ENUM values not set';else if (enum_values[data] === undefined) {
              if (data === null) return '';else return 'INVALID VALUE';
            } else return "<span class=\"text\">".concat(enum_values[data], "</span>");
          } else {
            if (v.format_function == null) return _this1.colFormatter(data, type, row, v.format, v.name);else {
              if (v.format_function.includes('.')) {
                var call = v.format_function.split('.');
                if (typeof window[call[0]][call[1]] === 'function') return window[call[0]][call[1]](data, v.name, row, meta, _this1);else {
                  console.log(v.format_function + ' is not a function!');
                  return data;
                }
              }
              if (typeof window[v.format_function] === 'function') return window[v.format_function](data, v.name, row, meta, _this1);else {
                console.log(v.format_function + ' is not a function!');
                return data;
              }
            }
          }
        };
        _this1.columnIndexes.push(v.name);
        options.aoColumnDefs.push(col);
      });
      var actions = {
        targets: columns_json.length,
        width: 80 + this.params.rowbuttons.length * 30 + 'px',
        visible: true,
        data: "Action",
        name: "actions",
        render: function render() {
          var buttons = '';
          for (var i in _this1.params.rowbuttons) buttons += _this1.params.rowbuttons[i];
          if (_this1.params.preview) buttons += "<button class=\"btn btn-icon\" onclick=\"Grid.callRow(this,window['".concat(_this1.id, "'].preview)\" type=\"button\"><span class=\"ci ci-search\"></span></button>");
          if (_this1.params.actions.edit && _this1.params.urls.editAction !== '') {
            buttons += "<button class=\"btn btn-icon\" onclick=\"Grid.callRow(this,window['".concat(_this1.id, "'].edit)\" onmousedown=\"Grid.callRow(this,window['").concat(_this1.id, "'].openTabEditor, [event])\" type=\"button\"><span class=\"ci ci-edit\"></span></button>");
          }
          if (_this1.params.actions.remove && _this1.params.urls.deleteUrl !== '') {
            buttons += "<button class=\"btn btn-icon\" onclick=\"Grid.callRow(this,window['".concat(_this1.id, "'].remove)\" type=\"button\"><span class=\"fa fa-trash\"></span></button>");
          }
          return buttons;
        }
      };
      if (this.params.rowbuttons.length > 1 || this.params.preview || this.params.actions.edit && this.params.urls.editAction !== '' || this.params.actions.remove && this.params.urls.deleteUrl !== '') {
        actions.visible = true;
      } else {
        actions.visible = false;
      }
      options.aoColumnDefs.push(actions);
      this.columnIndexes.push('action');
      if (this.hasParentGrid()) options.iDeferLoading = true;
      if (this.params.reorder !== '') {
        options.rowReorder = {
          dataSrc: this.params.reorder,
          snapX: true
        };
      }
      if (this.params.rowformatter !== '') {
        options.rowCallback = window[this.params.rowformatter];
      }
      if (this.params.reorder !== '') {
        options.rowReorder = true;
      }
      var orderColumn = Object.keys(this.columnIndexes).find(function (key) {
        return _this1.columnIndexes[key] === _this1.params.order.column;
      });
      options.order = [[orderColumn === undefined ? 0 : orderColumn, this.params.order.order]];
      this.stateRestore.addDefaultState(options);
      return options;
    }
  }, {
    key: "setGridColumns",
    value:
    /**
     * Připravuje sloupce v gridu
     * @returns {[]}
     */
    function setGridColumns() {
      var _this10 = this;
      var result = [];
      if (this.params.select.includes('checkbox')) {
        result.push({
          render: function render() {
            return '';
          }
        });
        this.columnIndexes.push('checkbox');
      }
      var columns_json = getDataAttr(this.element, 'columns');
      columns_json.forEach(function (v) {
        var enum_values = JSON.parse(v.entity_values);
        var enum_values2 = JSON.parse(v.entity_values);
        _this10.columnIndexes.push(v.name);
        result.push({
          mData: v.name,
          name: v.name,
          label: v.label,
          defaultContent: '',
          editable: true,
          columnInfo: v,
          enum_values: enum_values,
          select_values: enum_values2,
          render: function render(data, type, row, meta) {
            if (v.format === Grid.COLUMN_ENTITY || v.format === Grid.COLUMN_ENUM) {
              if (enum_values === null) return 'ENUM values not set';else if (enum_values[data] === undefined) {
                if (data === null) return '';else return 'INVALID VALUE';
              } else return "<span class=\"text\">".concat(enum_values[data], "</span>");
            } else {
              if (v.format_function == null) return _this10.colFormatter(data, type, row, v.format, v.name);else {
                if (v.format_function.includes('.')) {
                  var call = v.format_function.split('.');
                  if (typeof window[call[0]][call[1]] === 'function') return window[call[0]][call[1]](data, v.name, row, meta);else {
                    console.log(v.format_function + ' is not a function!');
                    return data;
                  }
                }
                if (typeof window[v.format_function] === 'function') return window[v.format_function](data, v.name, row, meta);else {
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
        render: function render() {
          var buttons = '';
          for (var i in _this10.params.rowbuttons) buttons += _this10.params.rowbuttons[i];
          if (_this10.params.preview) buttons += "<button class=\"btn btn-icon\" onclick=\"Grid.callRow(this,window['".concat(_this10.id, "'].preview)\" type=\"button\"><span class=\"ci ci-search\"></span></button>");
          if (_this10.params.actions.edit && _this10.params.urls.editAction !== '') {
            buttons += "<button class=\"btn btn-icon\" onclick=\"Grid.callRow(this,window['".concat(_this10.id, "'].edit)\" type=\"button\"><span class=\"ci ci-edit\"></span></button>");
          }
          if (_this10.params.actions.remove && _this10.params.urls.deleteUrl !== '') {
            buttons += "<button class=\"btn btn-icon\" onclick=\"Grid.callRow(this,window['".concat(_this10.id, "'].remove)\" type=\"button\"><span class=\"fa fa-trash\"></span></button>");
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
  }, {
    key: "copyRowToCSV",
    value: function copyRowToCSV() {
      var item = this.getCurrentItem();
      var columns = this.getColumnList().map(function (i) {
        return i.name;
      });
      var result = columns.join(',') + '\n';
      result += Object.keys(item).filter(function (i) {
        return columns.includes(i);
      }).map(function (i) {
        return '"' + item[i] + '"';
      });
      copyToClipboard(result);
    }

    /**
     * Nastavuje URL parametr (filtr) gridu
     * @param {string} param Název parametru
     * @param {string} value Hodnota
     */
  }, {
    key: "setUrlParameter",
    value: function setUrlParameter(param, value) {
      this.urlParameters[param] = value;
    }
  }, {
    key: "unsetUrlParameter",
    value:
    /**
     * Odstraní URL parametr (filtr) gridu
     * @param {string} param Název parametru
     */
    function unsetUrlParameter(param) {
      delete this.urlParameters[param];
    }
  }, {
    key: "getCurrentItem",
    value:
    /**
     * Vrací data aktuálně vybraného řádku
     * @returns {null|{}}
     */
    function getCurrentItem() {
      var showWarning = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this.grid.rows({
        selected: true
      }).data()[0] !== undefined) {
        if (this.params.select === 'single') return this.grid.rows({
          selected: true
        }).data()[0];else return this.grid.rows({
          selected: true
        }).data().toArray();
      } else {
        if (showWarning) alerts.alert(translations.SELECT_ROW, 'info', translations.SELECT_ROW_TEXT);
        return null;
      }
    }
  }, {
    key: "getCurrentItemValue",
    value:
    /**
     * Vrací hodnotu sloupce aktuálně vybraného řádku
     * @param column
     */
    function getCurrentItemValue(column) {
      var showWarning = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      /*   if (showWarning)
             alerts.alert(translations.SELECT_ROW, 'info', translations.SELECT_ROW_TEXT);*/
      if (this.params.select === 'single') return this.getCurrentItem()[column];else {
        if (this.getCurrentItem() !== null) return this.getCurrentItem()[0][column];else return null;
      }
    }

    /**
     * Resetuje filtr
     */
  }, {
    key: "resetFilter",
    value: function resetFilter() {
      this.filterRefreshnig = true;
      this.filterForm.reset();
      this.filterRefreshnig = false;
      $(this.filterForm.form).trigger('change');
    }
  }, {
    key: "setParentElement",
    value:
    /**
     * Nastavuje rodičovský
     * @param column
     * @param value
     */
    function setParentElement(column, value) {
      this.parentElement = [{
        'column': column,
        'id': value,
        'grid': this.relations[0].grid
      }];
    }
  }, {
    key: "setParentGrid",
    value:
    /**
     * nastavuje rodičovský grid
     * @param {Grid} parent_grid Rodičovský grid
     */
    function setParentGrid(parent_grid) {
      this.relations[0].grid = parent_grid;
    }
  }, {
    key: "add",
    value:
    /**
     * Zobrazí panel s přidáváním entity
     */
    function add() {
      var _this11 = this;
      if (this.editorIsOpen) {
        return;
      }
      if (this.params.actions.add && (this.params.urls.editAction !== '' || this.params.urls.quickeditAction !== '')) {
        var parent_rows = [];
        if (this.hasParentGrid()) {
          var oneIsSelected = false;
          this.relations.forEach(function (relation) {
            if (window[relation.grid].getCurrentItem() != null) {
              oneIsSelected = true;
              parent_rows.push({
                column: relation.column,
                id: window[relation.grid].getCurrentItem()[relation.child]
              });
            }
          });
          if (!oneIsSelected) {
            alerts.alert('Select parent', 'notice', 'Please select parent');
            return;
          }
        }
        if (this.parentElement != null) parent_rows = this.parentElement;
        if (this.params.urls.editAction !== '') {
          if (typeof this.onBeforeShowCreateEditor === 'function') {
            var _this$onBeforeShowCre;
            var show = (_this$onBeforeShowCre = this.onBeforeShowCreateEditor()) !== null && _this$onBeforeShowCre !== void 0 ? _this$onBeforeShowCre : true;
            if (!show) return;
          }
          var panel = new Panel();
          Helpers.ajax({
            url: this.params.urls.editAction,
            data: {
              panel_id: panel.uid,
              parent_rows: parent_rows,
              dataSaveType: this.params.dataSaveType,
              grid_id: this.id,
              create_default_values: JSON.stringify(this.createDefaultValues)
            },
            success: function success(data) {
              if (typeof data === 'string') data = JSON.parse(data);
              panel.classes = 'entity-editor';
              panel.setTitle(data.title);
              panel.setContent(data.content);
              panel.setFooter(data.footer);
              panel.addToButtonArea(data.buttons);
              panel.onAfterHide = function (args) {
                _this11.editorIsOpen = false;
                if (args !== null && args[0] === 'continue') {
                  _this11.edit(args[1][0]['ID']);
                } else _this11.refresh();
              };
              panel.onAfterShow = function () {
                _this11.editorIsOpen = true;
              };
              panel.show();
            }
          });
        } else if (this.params.urls.quickeditAction !== '') {
          if (typeof this.onBeforeShowCreateEditor === 'function') {
            var _this$onBeforeShowCre2;
            var _show = (_this$onBeforeShowCre2 = this.onBeforeShowCreateEditor()) !== null && _this$onBeforeShowCre2 !== void 0 ? _this$onBeforeShowCre2 : true;
            if (!_show) return;
          }
          var dialog = new Dialog();
          if (this.params.quickeditMaxWidth) dialog.maxWidth = this.params.quickeditMaxWidth;
          dialog.onAfterShow = function () {
            _this11.editorIsOpen = true;
          };
          dialog.showFromUrl(this.params.urls.quickeditAction, {
            'parent_column': null,
            'parent_entity_id': null,
            'parent_rows': parent_rows,
            'parent_row': parent_rows.length === 1 ? parent_rows[0] : null,
            //kvůli bc breaku
            'dataSaveType': this.params.dataSaveType,
            'grid_id': this.id,
            'create_default_values': JSON.stringify(this.createDefaultValues)
          }, true);
          dialog.onAfterClose = function () {
            _this11.editorIsOpen = false;
            _this11.refresh();
          };
        }
      }
    }
  }, {
    key: "addRow",
    value: function addRow(data) {
      var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this.grid.row.add(data);
      if (refresh) this.refresh();
    }
  }, {
    key: "getColumn",
    value:
    /**
     * Vrací nastavení sloupce
     * @param {string} name Název sloupce
     * @returns {*}
     */
    function getColumn(name) {
      return this.grid.column(name + ':name');
    }
  }, {
    key: "refresh",
    value:
    /**
     * Provede aktualizaci gridu
     */
    function refresh() {
      var _this12 = this;
      var resetPaging = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this.params.dataSaveType === 'local') {
        this.grid.draw();
        return;
      }
      this.range.scroll = $(this.element).parent().scrollTop();
      this.recentItemIndex = this.getCurrentItemIndex();
      this.refreshing = true;
      if (typeof this.onBeforeRefresh === 'function') {
        if (this.onBeforeRefresh() === false) {
          return;
        }
      }
      this.grid.ajax.reload(function () {
        if (typeof _this12.onAfterRefresh === 'function') _this12.onAfterRefresh();
        _this12.refreshing = false;
        _this12.onCurrentItemChanged();
      }, resetPaging);
    }
  }, {
    key: "formatFilterUrl",
    value:
    /**
     * Vrací filtr naformátovaný pro URL
     */
    function formatFilterUrl() {
      var str = "";
      for (var key in this.urlParameters) {
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
  }, {
    key: "copyFilterUrl",
    value: function copyFilterUrl() {
      Helpers.copyToClipboard(location.protocol + '//' + location.host + location.pathname + '?' + this.formatFilterUrl());
      alerts.alert(translations.COPY_FILTER_URL, 'info', translations.COPY_FILTER_URL_TEXT);
    }

    /**
     * Určení zda má grid rodičovský grid
     * @returns {boolean}
     */
  }, {
    key: "hasParentGrid",
    value: function hasParentGrid() {
      return this.parentGrids.length !== 0;
    }
  }, {
    key: "getParentGrid",
    value:
    /**
     * Vrací rodičovský grid
     * @returns {null|Grid}
     */
    function getParentGrid() {
      console.warn('This function is deprecated. Use getParenGrids() insted.');
      if (this.parentGrids.length) return this.parentGrids[0];else return null;
    }
  }, {
    key: "getRelations",
    value: function getRelations() {
      return this.relations;
    }
  }, {
    key: "getParentGrids",
    value: function getParentGrids() {
      return this.parentGrids;
    }

    /**
     * Nastavuje potomka gridu
     * @param child
     */
  }, {
    key: "setChild",
    value: function setChild(child) {
      this.childGrids.push(child);
    }
  }, {
    key: "getItemCount",
    value:
    /**
     * Vrací celkový počet řádků
     * @returns {int}
     */
    function getItemCount() {
      return this.grid.rows().count();
    }
  }, {
    key: "getCurrentItemIndex",
    value:
    /**
     * Vrací index aktuálně vybraného řádku
     * @returns {int|[]}
     */
    function getCurrentItemIndex() {
      if (this.params.select === 'single') return this.grid.rows({
        selected: true
      }).indexes()[0];else return this.grid.rows({
        selected: true
      }).indexes().toArray();
    }
  }, {
    key: "getSelectedCount",
    value:
    /**
     * Vrací počet vybraných řádků
     * @returns {int}
     */
    function getSelectedCount() {
      return this.grid.rows({
        selected: true
      }).count();
    }

    /**
     * Vrací řádek podle indexu
     * @param {int} index Index
     * @returns {{}}
     */
  }, {
    key: "getRowByIndex",
    value: function getRowByIndex(index) {
      return this.grid.row(index);
    }

    /**
     * Vybírá řádek dle hodnoty ve sloupci
     * @param {string} column Sloupec
     * @param {string} value Hledaná hodnota
     */
  }, {
    key: "selectRowBy",
    value: function selectRowBy(column, value) {
      var rowIndex = this.grid.rows().data().map(function (item) {
        return item[column];
      }).indexOf(value);
      this.getRowByIndex(rowIndex).select();
    }

    /**
     * Event při změně vybraného řádku
     */
  }, {
    key: "onCurrentItemChanged",
    value: function onCurrentItemChanged() {
      if (this.childGrids.length !== 0) {
        this.childGrids.forEach(function (g) {
          g.onParentItemChanged();
        });
      }
    }
  }, {
    key: "onParentItemChanged",
    value:
    /**
     * Event při změně řádku v rodičovském gridu
     */
    function onParentItemChanged() {
      var _this13 = this;
      this.relations.forEach(function (relation) {
        var child = window[relation.grid].getCurrentItem();
        if (!child) _this13.setUrlParameter(relation.column, '-1');else {
          if (Array.isArray(child)) _this13.setUrlParameter(relation.column, child.map(function (item) {
            return item[relation.child];
          }));else _this13.setUrlParameter(relation.column, child[relation.child]);
        }
      });
      this.refresh();
    }
  }, {
    key: "setOrder",
    value: function setOrder(column) {
      var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'asc';
      this.grid.order(this.getColumn(column).index(), order.toLowerCase());
    }
  }, {
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }, {
    key: "toogleSelectAllRows",
    value: function toogleSelectAllRows() {
      if (this.getSelectedCount()) {
        this.unselectAllRows();
      } else {
        this.selectAllRows();
      }
    }
  }, {
    key: "selectRowsReverse",
    value: function selectRowsReverse() {
      var selectedRows = this.grid.rows({
        selected: true
      });
      var unselectedRows = this.grid.rows({
        selected: false
      });
      selectedRows.select(false);
      unselectedRows.select(true);
    }
  }, {
    key: "selectAllRows",
    value: function selectAllRows() {
      $(this.grid.header()[0]).find('.select-checkbox input[type="checkbox"]').prop('checked', true);
      this.grid.rows().select();
    }
  }, {
    key: "unselectAllRows",
    value: function unselectAllRows() {
      $(this.grid.header()[0]).find('.select-checkbox input[type="checkbox"]').prop('checked', false);
      this.grid.rows().select(false);
    }
  }, {
    key: "updateMultiselectAllCount",
    value: function updateMultiselectAllCount(count) {
      $('#' + this.id + '_multipleSelectCount').text(count);
      if (count > 0) {
        $('#' + this.id + '_multipleSelectCount').parent().removeClass('d-none');
      } else {
        $('#' + this.id + '_multipleSelectCount').parent().addClass('d-none');
      }
    }
  }, {
    key: "getSelectedRows",
    value: function getSelectedRows() {
      return this.selectedRows;
    }
  }, {
    key: "getNextRow",
    value: function getNextRow() {
      if (this.params.select === 'single') return this.grid.row(grid.getCurrentItemIndex() + 1);else return this.grid.row(grid.getCurrentItemIndex()[0] + 1);
    }
  }, {
    key: "getPrevRow",
    value: function getPrevRow() {
      if (this.params.select === 'single') return this.grid.row(grid.getCurrentItemIndex() - 1);else return this.grid.row(grid.getCurrentItemIndex()[0] - 1);
    }
  }, {
    key: "getRowByUniqueKeyValue",
    value: function getRowByUniqueKeyValue(key, value) {
      var _this14 = this;
      return this.grid.rows().every(function (rowIdx, tableLoop, rowLoop) {
        var row = _this14.grid.row(rowIdx);
        if (row.data()[key] == value) {
          return row;
        }
      });
    }
  }, {
    key: "updateRow",
    value: function updateRow(row, data) {
      var newData = row.data()[0];
      if (Array.isArray(data)) {
        data.forEach(function (item, key) {
          if (typeof item !== 'undefined') newData[key] = item;
        });
      } else if (_typeof(data) === 'object') {
        for (var _i3 = 0, _Object$entries = Object.entries(data); _i3 < _Object$entries.length; _i3++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i3], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];
          if (typeof value !== 'undefined') newData[key] = value;
        }
      }
      row.data(newData);
      row.invalidate().draw();
    }
  }, {
    key: "deleteRow",
    value: function deleteRow(row) {
      row.remove().draw();
    }
  }, {
    key: "exportDataToCSV",
    value: function exportDataToCSV() {
      var _this15 = this;
      var filtered = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var data = {};
      if (filtered) {
        data = this.urlParameters;
        delete data.count;
        delete data.start;
      }
      Helpers.ajax({
        url: this.params.urls.datalistUrl,
        data: data,
        success: function success(data) {
          data = JSON.parse(data);
          data = data.items;
          var csvContent = "\uFEFF";
          var separator = ';';
          var header = '';
          data.forEach(function (row) {
            // row = Object.values(row);
            var rowData = '';
            var tmpHeader = '';
            _this15.getColumnList().forEach(function (v) {
              if (v.name === 'actions' || v.name === 'checkbox') return;
              if (!v.visible) return;
              if (header === '') {
                tmpHeader += v.label + separator;
              }
              if (typeof row[v.mData] !== 'undefined') {
                if (v.enum_values) {
                  if (typeof v.enum_values[row[v.mData]] !== 'undefined') rowData += v.enum_values[row[v.mData]] + separator;else rowData += '' + separator;
                } else rowData += _this15.colFormatter(row[v.mData], null, null, v.columnInfo.format, null, true) + separator;
              } else {
                rowData += '' + separator;
              }
            });
            if (header === '') {
              if (tmpHeader !== '') {
                tmpHeader += "\r\n";
                header = tmpHeader;
                csvContent += header;
              }
            }
            csvContent += rowData + "\r\n";
          });
          var link = document.createElement("a");
          link.id = "lnkDwnldLnk";

          //this part will append the anchor tag and remove it after automatic click
          document.body.appendChild(link);
          var blob = new Blob([csvContent], {
            type: 'text/csv'
          });
          var csvUrl = window.webkitURL.createObjectURL(blob);
          var filename = _this15.id + '-' + Math.round(Date.now() / 1000);
          +'.csv';
          $("#lnkDwnldLnk").attr({
            'download': filename,
            'href': csvUrl
          });
          $('#lnkDwnldLnk')[0].click();
          document.body.removeChild(link);
        }
      }, true);
    }
  }, {
    key: "exportDataToPDF",
    value: function exportDataToPDF() {
      var _this16 = this;
      var filtered = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var data = {};
      if (filtered) {
        data = this.urlParameters;
        delete data.count;
        delete data.start;
      }
      Helpers.ajax({
        url: this.params.urls.datalistUrl,
        data: data,
        success: function success(data) {
          data = JSON.parse(data);
          data = data.items;
          var header = null;
          var content = [{
            layout: 'lightHorizontalLines',
            // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              body: []
            }
          }];
          data.forEach(function (row) {
            var tmpHeader = [];
            var rowData = [];
            _this16.getColumnList().forEach(function (v) {
              if (v.name === 'actions' || v.name === 'checkbox') return;
              if (!v.visible) return;
              if (header === null) {
                tmpHeader.push(v.label);
              }
              if (typeof row[v.mData] !== 'undefined') {
                if (v.enum_values) {
                  if (typeof v.enum_values[row[v.mData]] !== 'undefined') rowData.push(v.enum_values[row[v.mData]]);else rowData.push('');
                } else rowData.push(_this16.colFormatter(row[v.mData], null, null, v.columnInfo.format, null, true));
              } else {
                rowData.push('');
              }
            });
            if (header === null) {
              header = tmpHeader;
              content[0].table.body.push(header);
            }
            content[0].table.body.push(rowData);
          });
          createPdf({
            content: content,
            defaultStyle: {
              fontSize: 8
            }
          }).open();
        }
      }, true);
    }
  }, {
    key: "setCounter",
    value: function setCounter(val) {
      if (isNaN(val)) val = '-';
      $('#' + this.id + '_counter').text(val);
    }
  }, {
    key: "getSelected",
    value: function getSelected() {
      return this.grid.rows('.selected');
    }
  }, {
    key: "removeRow",
    value: function removeRow(row) {
      try {
        row.remove().draw();
      } catch (err) {}
    }
  }, {
    key: "removeAll",
    value: function removeAll() {
      this.grid.clear().draw();
    }
  }, {
    key: "removeSelected",
    value: function removeSelected() {
      this.removeRow(this.getSelected());
    }
  }, {
    key: "getColumnByFormat",
    value: function getColumnByFormat(format) {
      var columns = [];
      this.getColumnList().forEach(function (column, index) {
        if (typeof column.columnInfo === 'undefined') return;
        if (column.columnInfo.format === format) {
          columns.push(column);
        }
      });
      return columns;
    }
  }], [{
    key: "callRow",
    value: function callRow(e, callback, args) {
      e = $(e);
      var grid = $(e).closest('table').attr('id');
      window[grid].unselectAllRows();
      window[grid].grid.row(e.closest('tr')).select();
      callback.call(null, args);
    }
  }, {
    key: "headerClick",
    value: function headerClick(e) {
      if ($(e.currentTarget).hasClass('DTCR_tableHeaderHover')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      } else return true;
    }
  }]);
}();
_defineProperty(Grid, "COLUMN_ID", 1);
_defineProperty(Grid, "COLUMN_TEXT", 2);
_defineProperty(Grid, "COLUMN_NUMBER", 4);
_defineProperty(Grid, "COLUMN_CURRENCY", 8);
_defineProperty(Grid, "COLUMN_BOOL", 16);
_defineProperty(Grid, "COLUMN_DATE", 32);
_defineProperty(Grid, "COLUMN_TIME", 64);
_defineProperty(Grid, "COLUMN_DATETIME", 65);
_defineProperty(Grid, "COLUMN_TIMESTAMP", 66);
_defineProperty(Grid, "COLUMN_ENUM", 128);
_defineProperty(Grid, "COLUMN_ENTITY", 256);
_defineProperty(Grid, "COLUMN_CHECKBOX", 1040);
_defineProperty(Grid, "COLUMN_COUNTER", 32768);
_defineProperty(Grid, "COLUMN_CURRENCY_EUR", 131072);
_defineProperty(Grid, "COLUMN_CURRENCY_CZK", 262144);
_defineProperty(Grid, "COLUMN_CURRENCY_USD", 524288);
_defineProperty(Grid, "COLUMN_CURRENCY_GBP", 1048576);
_defineProperty(Grid, "COLUMN_CURRENCY_PLN", 2097152);
_defineProperty(Grid, "COLUMN_LONGTEXT", 4194304);
_defineProperty(Grid, "keypressEventInit", false);
_defineProperty(Grid, "lastUsedGrid", null);
//# sourceMappingURL=Grid.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SubGrid = /*#__PURE__*/function (_Grid) {
  function SubGrid(element_id) {
    var _this;
    _classCallCheck(this, SubGrid);
    _this = _callSuper(this, SubGrid, [element_id]);
    /**
     * Úprava záznamu
     */
    _defineProperty(_this, "edit", function () {
      if (_this.editorIsOpen) {
        return;
      }
      if (_this.params.actions.edit && _this.quickeditor !== '') {
        if (_this.getSelectedCount() > 1) {
          alerts.alert(translations.SELECT_ONLY_ONE);
          return;
        } else if (_this.getSelectedCount() === 0) {
          alerts.alert(translations.SELECT_ROW);
          return;
        }
        var dialog = new Dialog();
        var row = _this.getCurrentItem();
        if (row.length) {
          row = row[0];
        }
        var parent_rows = [];
        if (_this.hasParentGrid()) {
          var oneIsSelected = false;
          _this.relations.forEach(function (relation) {
            if (window[relation.grid].getCurrentItem() != null) {
              oneIsSelected = true;
              parent_rows.push({
                column: relation.column,
                id: window[relation.grid].getCurrentItem()[relation.child]
              });
            }
          });
          if (!oneIsSelected) {
            alerts.alert('Select parent', 'notice', 'Please select parent');
            return;
          }
        }
        if (_this.parentElement != null) parent_rows = _this.parentElement;
        var params = {
          'parent_column': getDataAttr(_this.element, 'parent-element'),
          'parent_entity_id': window[getDataAttr(_this.element, 'parent-editor')].entity_id,
          'entity_id': row['ID'],
          'dataSaveType': _this.params.dataSaveType,
          'grid_id': _this.id,
          'parent_rows': parent_rows
        };
        if (_this.params.dataSaveType === 'local') {
          params['local_tmp_id'] = _this.params.select === 'single' ? row['local_tmp_id'] : row[0]['local_tmp_id'];
        }
        dialog.onAfterShow = function () {
          _this.editorIsOpen = true;
        };
        dialog.showFromUrl(_this.quickeditor, params, true);
        dialog.onAfterClose = function () {
          _this.editorIsOpen = false;
          _this.refresh();
        };
      }
    });
    return _this;
  }

  /**
   * Přidání nového záznamu
   */
  _inherits(SubGrid, _Grid);
  return _createClass(SubGrid, [{
    key: "add",
    value: function add() {
      var _this2 = this;
      if (this.editorIsOpen) {
        return;
      }
      if (this.params.actions.add && this.quickeditor !== '') {
        var parent_rows = [];
        if (this.hasParentGrid()) {
          var oneIsSelected = false;
          this.relations.forEach(function (relation) {
            if (window[relation.grid].getCurrentItem() != null) {
              oneIsSelected = true;
              parent_rows.push({
                column: relation.column,
                id: window[relation.grid].getCurrentItem()[relation.child]
              });
            }
          });
          if (!oneIsSelected) {
            alerts.alert('Select parent', 'notice', 'Please select parent');
            return;
          }
        }
        if (this.parentElement != null) parent_rows = this.parentElement;
        var dialog = new Dialog();
        var data = {
          'parent_column': getDataAttr(this.element, 'parent-element'),
          'parent_entity_id': window[getDataAttr(this.element, 'parent-editor')].entity_id,
          'dataSaveType': this.params.dataSaveType,
          'grid_id': this.id
        };
        dialog.showFromUrl(this.quickeditor, {
          'parent_column': getDataAttr(this.element, 'parent-element'),
          'parent_entity_id': window[getDataAttr(this.element, 'parent-editor')].entity_id,
          'dataSaveType': this.params.dataSaveType,
          'grid_id': this.id,
          'parent_rows': parent_rows,
          'parent_row': parent_rows.length === 1 ? parent_rows[0] : null,
          'create_default_values': JSON.stringify(this.createDefaultValues)
        }, true);
        dialog.onAfterShow = function () {
          _this2.editorIsOpen = true;
        };
        dialog.onAfterClose = function () {
          _this2.editorIsOpen = false;
          _this2.refresh();
        };
      }
    }
  }]);
}(Grid);
//# sourceMappingURL=SubGrid.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Form = /*#__PURE__*/function () {
  /**
   * Form constructor
   * @param {string} form_id ID elementu s formulářem
   */
  function Form(form_id) {
    var _this = this;
    _classCallCheck(this, Form);
    this.form = document.getElementById(form_id);
    this.onSuccess = null;
    this.onBeforeSubmit = null;
    this.onAfterValidate = null;
    this.onError = null;
    this.invalidFields = [];
    this.inputs = {};
    this.initInputs();
    this.id = form_id;
    if ($(this.form).data('ajax')) {
      $(this.form).submit(function (event) {
        event.preventDefault();
        if (typeof _this.onBeforeSubmit === 'function') {
          _this.onBeforeSubmit();
        }
        if (_this.validate()) {
          tinyMCE.triggerSave();
          if (typeof _this.onAfterValidate === 'function') {
            _this.onAfterValidate();
          }
          Helpers.ajax({
            url: $(_this.form).attr('action'),
            method: $(_this.form).attr('method') ? $(_this.form).attr('method') : 'GET',
            data: _this.serializeArrayEntity(),
            success: _this.onSuccess,
            error: _this.onError
          });
        }
      });
    }
    this.prepareAjaxStores();
    this.dynamicSelects = [];
    $(this.form).find('[data-dynamicadding="true"]').each(function (i, e) {
      var select = {
        element: e,
        name: $(e).find('select').attr('name'),
        parentRows: [],
        parentColumn: null,
        parentEntityID: null,
        customParams: {}
      };
      _this.dynamicSelects[select.name] = select;
    });
    $(function () {
      $(_this.form).on('change', ':input', function (e) {
        e = $(e.target);
        _this.validate(e);
      });
      $(_this.form).on('dp.change', '[data-datepicker]', function (e) {
        $(_this.form).trigger('change');
      });
      $(_this.form).find('[type="file"]').bind('resetFile', function () {
        $(this).data('id', null);
        $(this).next().remove();
      });
      $(_this.form).on('click', '.combo_box_add_dynamic_option_button', function (e) {
        e.preventDefault();
        var parent = $('#' + $(e.currentTarget).data('parent'));
        var select = parent.find('select');
        if (typeof select[0] !== 'undefined') {
          _this.openQuickEditor(parent.data('dynamicaddingquickeditor'), select[0], _this.dynamicSelects[select.attr('name')]);
        }
      });
    });
  }
  return _createClass(Form, [{
    key: "prepareAjaxStores",
    value: function prepareAjaxStores() {
      var _this2 = this;
      $(function () {
        plugins.initSelect2Ajax(_this2.form);
      });
    }

    /**
     * Vrací HTML element s formulářem
     * @returns {HTMLElement}
     */
  }, {
    key: "getForm",
    value: function getForm() {
      return this.form;
    }

    /**
     * Validace dle RegEx
     * @param {string} value Hodnota k ověření
     * @param {string} pattern RegEx pattern
     * @returns {boolean}
     */
  }, {
    key: "serializeArrayEntity",
    value:
    /**
     * Uspořádá data do podoby pro Clevis Manager
     * @returns {{}}
     */
    function serializeArrayEntity() {
      var result = {};
      var elements = $.makeArray($(this.form).prop('elements'));
      if (typeof grapesjs !== 'undefined') {
        grapesjs.editors.forEach(function (editor) {
          if ($(editor.getEl()).parent().hasClass('block-editor')) {
            var name = $(editor.getEl()).parent().parent().attr('blockeditordata');
            if (typeof name !== 'undefined' && name) {
              //$("[name='"+name+"']").val(JSON.stringify(editor.storeData()));
              $("[name='" + name + "']").val(JSON.stringify({
                html: Plugins.getModifiedGrapesHTML(editor.storeData().html),
                css: editor.storeData().css
              }));
            }
          }
        });
      }
      elements.filter(function (item) {
        return item.name && !$(item).is(':disabled') && item.nodeName.match(/^(?:input|select|textarea|keygen)/i);
      }).forEach(function (v) {
        var val = null;
        if (v.type === 'checkbox') val = v.checked;else if (v.type === 'radio') {
          if (v.checked) val = v.value;
        } else if (v.type == 'select-multiple') {
          val = $(v).select2('val');
        } else if (v.type == 'select-one') {
          if (v.value === 'null') {
            val = null;
            result[v.name] = null;
          } else {
            val = String(v.value);
            if (v.hasAttribute('data-storefield') && v.getAttribute('data-storefield') && v.getAttribute('data-storefield') !== '' && v.getAttribute('data-storefield') !== 'ID' && typeof v.options[v.options.selectedIndex] !== 'undefined') result[v.name + '_storefield'] = v.options[v.options.selectedIndex].text;
          }
        } else if (v.type == 'textarea') {
          if (v.getAttribute('data-mce') !== null) val = tinymce.get(v.id).getContent();else val = String(v.value);
        } else {
          if (v.value === 'null') {
            val = null;
            result[v.name] = null;
          } else val = String(v.value);
        }
        if (val !== null) {
          if (val === "on") val = true;else if (val === "off") val = false;
          if (v.getAttribute('data-datepicker') != null) {
            var date = moment(v.value, ['L', 'YYYY-MM-DD'], true);
            if (date.isValid()) {
              val = date.format('YYYY-MM-DD');
            } else val = '';
          } else if (v.getAttribute('data-datetimepicker') != null) {
            var _date = moment(v.value, ['L LTS', 'YYYY-MM-DD HH:mm:ss'], true);
            if (_date.isValid()) {
              val = _date.format('YYYY-MM-DD HH:mm:ss');
            } else val = '';
          }
          if (v.name.includes('[')) {
            var dataattr = v.name.replace(/ *\[[^)]*\] */g, "");
            if (result[dataattr] === undefined) result[dataattr] = {};
            result[dataattr][v.name.match(/\[(.*)\]/)[1]] = val;
          } else {
            result[v.name] = val;
            if (v.type === 'number') {
              result[v.name] = result[v.name].replace(',', '.');
            }
            if (v.getAttribute('data-currency') !== null) result[v.name] = result[v.name] !== '' ? parseFloat(result[v.name]) * 100 : '';
            if (v.getAttribute('data-range') !== null) {
              if (v.getAttribute('data-range') === 'from') result[v.getAttribute('data-range-target')] = result[v.name] + ':';else {
                result[v.getAttribute('data-range-target')] += result[v.name];
                if (result[v.getAttribute('data-range-target')] === ":") {
                  result[v.getAttribute('data-range-target')] = null;
                }
              }
            }
          }
        }
      });
      return result;
    }

    /**
     * Provede validaci formuláře
     * @returns {boolean}
     */
  }, {
    key: "validate",
    value: function validate() {
      var _this3 = this;
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.invalidFields = [];
      var noError = true;
      if (input === null) {
        input = $(this.form).find(':input');
        $(this.form).find('.form-input-group').removeClass('has-error');
      } else {
        input.closest('.form-input-group').removeClass('has-error');
      }
      input.each(function (i, e) {
        e = $(e);
        var errorMessage = '';
        var validation_data = e.data('validator');
        if (validation_data === undefined) return;
        e.find('.error-message span').text('');
        var value = e.val();
        validation_data.forEach(function (v) {
          if (typeof v.enabled !== 'undefined' && v.enabled === false) return;
          switch (v.v) {
            case Form.VALIDATOR_REQUIRED:
              if (!Form.validateRequired(value, e)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_EMAIL:
              if (!Form.validateEmail(value)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_LENGTH:
              if (!Form.validateLength(value, v.p)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_MAX_LENGTH:
              if (!Form.validateMaxLength(value, v.p)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_MIN_LENGTH:
              if (!Form.validateMinLength(value, v.p)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_NUMBER:
              if (!Form.validateNumber(value)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_PATTERN:
              var re = new RegExp(v.p);
              if (!Form.validateRegex(value, re)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_SAME_VALUE:
              if (!Form.validateSameValue(value, _this3.getValue(v.p))) errorMessage += v.m;
              break;
            case Form.VALIDATOR_CUSTOM:
              if (!Form.validateByCustom(value, e.attr('name'), v.p)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_RANGE:
              if (!Form.validateRange(value, v.p[0], v.p[1])) errorMessage += v.m;
          }
        });
        if (errorMessage !== '') {
          noError = false;
          e.closest('.form-input-group').addClass('has-error');
          if (e.closest('.form-input-group').find('.error-message').length === 0) e.closest('.form-input-group').append($('<div class="error-message"><span></span></div>'));
          e.closest('.form-input-group').find('.error-message').children().text(errorMessage);
          console.log(errorMessage);
          _this3.invalidFields.push(e);
        }
      });
      if (!noError) {
        if (input.length > 1) alerts.alert(translations.VALIDATION_ERR, 'error', translations.VALIDATION_ERR_TEXT);
      }
      return noError;
    }

    /**
     * Resetuje formulář
     */
  }, {
    key: "reset",
    value: function reset() {
      var _this4 = this;
      var elements = $.makeArray($(this.form).prop('elements'));
      elements.filter(function (item) {
        return item.name && !$(item).is(':disabled') && item.nodeName.match(/^(?:input|select|textarea|keygen)/i);
      }).forEach(function (v) {
        _this4.setValue(v.name, '');
      });
    }

    /**
     * Vrací požadovaný selector inputu
     * @param {string} input_name Název inputu
     * @returns {jQuery|[]}
     */
  }, {
    key: "getInput",
    value: function getInput(input_name) {
      var input = $(this.form).find('[id^="' + this.form.getAttribute('id') + '"][name="' + input_name + '"]');
      if (input.length === 0) input = $(this.form).find('[id^="' + this.form.getAttribute('id') + '"][name$="[' + input_name + ']"]');
      if (input.length === 0) input = $(this.form).find('[type="radio"][name="' + input_name + '"]');
      switch (input.attr('type')) {
        case 'radio':
          input = input.filter(':checked');
          break;
      }
      return input;
    }

    /**
     * Vrací hodnotu z požadovaného inputu
     * @param {string} input_name
     * @returns {*}
     */
  }, {
    key: "getValue",
    value: function getValue(input_name) {
      var input = this.getInput(input_name);
      if (input[0] === undefined) return null;
      switch (input[0].type) {
        case 'checkbox':
          return input.prop('checked');
        case 'radio':
          return $('input[name="' + input_name + '"]:checked', '#' + this.form.getAttribute('id')).val();
        case 'text':
          if (input[0].getAttribute('data-datepicker') != null) {
            var date = moment(input.val(), ['L', 'YYYY-MM-DD'], true);
            if (date.isValid()) {
              return date.format('YYYY-MM-DD');
            } else return;
          } else if (input[0].getAttribute('data-datetimepicker') != null) {
            var _date2 = moment(input.val(), ['L LTS', 'YYYY-MM-DD HH:mm:ss'], true);
            if (_date2.isValid()) {
              return _date2.format('YYYY-MM-DD HH:mm:ss');
            } else return '';
          } else return input.val();
        default:
          if (input.data('mce') === true) {
            var val = tinymce.get(input[0].id).getContent();
            return val;
          }
          return input.val();
      }
    }

    /**
     * Vrací objekt nebo pole objektů vybraných dat v select boxu {id, text}
     * @param {string} input_name Název inputu
     * @returns {[{}]|null}
     */
  }, {
    key: "getSelectValue",
    value: function getSelectValue(input_name) {
      var result = [];
      var input = this.getInput(input_name);
      if (input[0].type === 'select-one' || input[0].type === 'select-multiple') {
        var data = input.select2('data');
        if (data.length == 0) return null;
        data.forEach(function (v, k) {
          result.push({
            id: v.id,
            text: v.text
          });
        });
        return result;
      } else return null;
    }

    /**
     * Nastavuje hodnotu v inputu
     * @param {string} input_name Název inputu
     * @param {string} value Nová hodnota
     */
  }, {
    key: "setValue",
    value: function setValue(input_name, value) {
      var input = this.getInput(input_name);
      if (input[0] === undefined) return;
      switch (input[0].type) {
        case 'checkbox':
          input.prop('checked', value);
          break;
        case 'radio':
          if (value === '' || value === false) {
            if ($('input[name="' + input_name + '"][value=""]').length === 1) $('input[name="' + input_name + '"][value=""]', '#' + this.form.getAttribute('id')).prop('checked', 'checked');else $('input[name="' + input_name + '"]', '#' + this.form.getAttribute('id')).prop('checked', false);
          } else $('input[name="' + input_name + '"][value="' + value + '"]', '#' + this.form.getAttribute('id')).prop('checked', 'checked');
          break;
        case 'text':
          if (input.hasClass('datepicker')) {
            if (moment(value, ["L", "YYYY-MM-DD"]).isValid()) input.val(moment(value).format('L'));else input.val('');
          } else if (input.hasClass('datetimepicker')) {
            if (moment(value, ["L LTS", "YYYY-MM-DD HH:mm:ss"]).isValid()) input.val(moment(value).format('L LTS'));else input.val('');
          } else input.val(value);
          break;
        case 'select-one':
        case 'select-multiple':
          input.val(value);
          input.trigger('change');
          break;
        case 'textarea':
          if (input.data('mce')) tinymce.get(input.attr('id')).setContent(value);else input.val(value);
          break;
        default:
          input.val(value);
      }
    }

    /**
     * Nastavuje atribut readonly pro input
     * @param {string} input_name Název inputu
     * @param {boolean} disabled Určení, zda je pouze pro čtení
     */
  }, {
    key: "setDisabled",
    value: function setDisabled(input_name) {
      var disabled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var input = this.getInput(input_name);
      if (disabled) {
        input.attr('readonly', 'readonly');
        input.closest('.form-input-group').addClass('readonly');
      } else {
        input.removeAttr('readonly');
        input.closest('.form-input-group').removeClass('readonly');
      }
    }
  }, {
    key: "getUrlParameters",
    value: function getUrlParameters(input_name) {
      var input = this.getInput(input_name);
      return {
        params: input.attr('storeparams'),
        input: input,
        add: function add() {
          params;
        }
      };
    }
  }, {
    key: "openQuickEditor",
    value: function openQuickEditor(url, element, dynamicSelect) {
      var dialog = new Dialog();
      var data = _objectSpread({
        'parent_column': dynamicSelect.parentColumn,
        'parent_entity_id': dynamicSelect.parentEntityID,
        'parent_rows': dynamicSelect.parentRows,
        'parent_row': dynamicSelect.parentRows && Object.keys(dynamicSelect.parentRows).length ? dynamicSelect.parentRows[0] : null
      }, dynamicSelect.customParams);
      dialog.showFromUrl(url, data, true);
      dialog.onAfterClose = function () {
        element.refresh();
      };
    }
  }, {
    key: "initInputs",
    value: function initInputs() {
      var _this5 = this;
      var inputs = $(this.form).find(':input');
      inputs.each(function (i, e) {
        e = $(e);
        if (typeof _this5.inputs[e.attr('name')] === 'undefined') {
          switch (e.prop("tagName")) {
            case "SELECT":
              if (typeof e.data('store') !== 'undefined') _this5.inputs[e.attr('name')] = new SelectAjax(e[0], _this5);else _this5.inputs[e.attr('name')] = new Select(e[0], _this5);
              break;
            default:
              switch (e.attr('type')) {
                case "radio":
                  _this5.inputs[e.attr('name')] = new Radio(e[0], _this5);
                  break;
                case "checkbox":
                  _this5.inputs[e.attr('name')] = new Checkbox(e[0], _this5);
                  break;
                case "text":
                  if (typeof e.data('datepicker') !== 'undefined') {
                    _this5.inputs[e.attr('name')] = new DateBox(e[0], _this5);
                    break;
                  }
                  if (typeof e.data('datetimepicker') !== 'undefined') {
                    _this5.inputs[e.attr('name')] = new DateTimeBox(e[0], _this5);
                    break;
                  }
                  _this5.inputs[e.attr('name')] = new Input(e[0], _this5);
                  break;
                default:
                  _this5.inputs[e.attr('name')] = new Input(e[0], _this5);
              }
          }
        }
      });
      $(this.form).find('.block-editor').each(function (i, e) {
        e = $(e);
        _this5.inputs[e.parent().attr('name')] = new BlockEditor(e[0], _this5);
      });
    }
  }, {
    key: "getInputObject",
    value: function getInputObject(input_name) {
      return this.inputs[input_name];
    }
  }, {
    key: "getInputObjectsByType",
    value: function getInputObjectsByType(type) {
      var result = {};
      for (var _i = 0, _Object$entries = Object.entries(this.inputs); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          name = _Object$entries$_i[0],
          input = _Object$entries$_i[1];
        if (input instanceof type) result[name] = input;
      }
      return result;
    }
  }], [{
    key: "validateRegex",
    value: function validateRegex(value, pattern) {
      var r = new RegExp(pattern);
      return value.match(r) != null;
    }

    /**
     * Kontroluje minimální délku řetězce
     * @param {int} value Hodnota k ověření
     * @param {int} minlength Minimílní délka
     * @returns {boolean}
     */
  }, {
    key: "validateMinLength",
    value: function validateMinLength(value, minlength) {
      return value.length >= minlength;
    }

    /**
     * Kontroluje maximální délku řetězce
     * @param {int} value Hodnota k ověření
     * @param {int} maxlength Maximální délka
     * @returns {boolean}
     */
  }, {
    key: "validateMaxLength",
    value: function validateMaxLength(value, maxlength) {
      return value.length <= maxlength;
    }

    /**
     * Kontroluje přesnou délku řetezce
     * @param {string} value Hondota k ověření
     * @param length Délka řetězce
     * @returns {boolean}
     */
  }, {
    key: "validateLength",
    value: function validateLength(value, length) {
      return toString(value).length === length;
    }

    /**
     * Kontroluje zda je hodnota email
     * @param {string} value Email k ověření
     * @returns {boolean}
     */
  }, {
    key: "validateEmail",
    value: function validateEmail(value) {
      return this.validateRegex(value.toLowerCase(), /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }

    /**
     * Kontroluje prázdné řetezce
     * @param {string} value Hodnota k ověření
     * @param {jquery} element
     * @returns {boolean}
     */
  }, {
    key: "validateRequired",
    value: function validateRequired(value, element) {
      if (element[0].type === 'radio') {
        return element.closest('.form-input-group').find('input:checked').length > 0;
      } else return value !== '';
    }

    /**
     * Kontroluje zda je hodnota číslo
     * @param {*} value
     * @returns {boolean}
     */
  }, {
    key: "validateNumber",
    value: function validateNumber(value) {
      return value.isInteger(value);
    }

    /**
     * Kontroluje zda je hodnota stejná jako v cílovém inputu
     * @param {string} value Hodnota k ověření
     * @param {string} other_value Hodnota druhého inputu
     * @returns {boolean}
     */
  }, {
    key: "validateSameValue",
    value: function validateSameValue(value, other_value) {
      return other_value == value;
    }
  }, {
    key: "validateByCustom",
    value: function validateByCustom(value, input_name, func) {
      return eval(func + '("' + value + '", "' + input_name + '")');
    }

    /**
     * Kontroluje zda je hodnota v rozsahu
     * @param {int} value Hodnota k ověření
     * @param {int} min Minimální hranice
     * @param {int} max Maximální hranice
     * @returns {boolean|boolean}
     */
  }, {
    key: "validateRange",
    value: function validateRange(value, min, max) {
      return value >= min && value <= max;
    }
  }]);
}();
_defineProperty(Form, "VALIDATOR_REQUIRED", ':required');
_defineProperty(Form, "VALIDATOR_MIN_LENGTH", ':min_length');
_defineProperty(Form, "VALIDATOR_MAX_LENGTH", ':max_length');
_defineProperty(Form, "VALIDATOR_LENGTH", ':length');
_defineProperty(Form, "VALIDATOR_EMAIL", ':email');
_defineProperty(Form, "VALIDATOR_PATTERN", ':pattern');
_defineProperty(Form, "VALIDATOR_NUMBER", ':number');
_defineProperty(Form, "VALIDATOR_RANGE", ':range');
_defineProperty(Form, "VALIDATOR_CUSTOM", ':custom');
_defineProperty(Form, "VALIDATOR_SAME_VALUE", ':same');
//# sourceMappingURL=Form.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Panel = /*#__PURE__*/function () {
  /**
   * Panel constructor
   */
  function Panel() {
    _classCallCheck(this, Panel);
    this.showed = false;
    this.content = '';
    this.header = '';
    this.title = '';
    this.footer = '';
    this.buttons_content = '';
    this.classes = '';
    this.uid = 'panel' + Math.random().toString(36).substring(7);
    this.prevUrl = null;
    this.buttons = [];
    panels[this.uid] = this;
    this.entityEditor = null;
    this.onBeforeHide = null;
    this.onAfterHide = null;
    this.onBeforeShow = null;
    this.onAfterShow = null;
    this.chache = false;
    this.appendSelector = 'main #content';
  }

  /**
   * Zavře panel
   */
  return _createClass(Panel, [{
    key: "close",
    value: function close() {
      if (this.onBeforeHide != null) this.onBeforeHide();
      window.history.replaceState('page2', 'Title', this.prevUrl);
      if (panels.length == 0) $('#main').show();
      if (this.onAfterHide != null) this.onAfterHide(arguments);
      breadcrumb.popItem();
      $(window).unbind('popstate');
      if (this.entityEditor && !this.cache) {
        $('#panel-' + this.uid).remove();
        delete panels[this.uid];
        var id = this.entityEditor.editor_id;
        $(window).off('beforeunload');
        delete this.entityEditor;
        window[id] = null;
      } else {
        this.showed = false;
        $('#panel-' + this.uid).css('display', 'none');
      }
    }
  }, {
    key: "setTitle",
    value:
    /**
     * Nastavuje titulek tabu
     * @param {string} title Titulek
     */
    function setTitle(title) {
      this.title = title;
      if (this.showed) $('#panel-' + this.uid).find('[data-content="title"]').html(title);
    }
  }, {
    key: "setContent",
    value:
    /**
     * Nastavuje obsah
     * @param {string} content Obsah
     */
    function setContent(content) {
      this.content = content;
      if (this.showed) $('#panel-' + this.uid).find('[data-content="content"]').html(content);
    }
  }, {
    key: "setButtonsContent",
    value:
    /**
     * Nastavuje obsah v prostoru pro tlačítka
     * @param content Obsah
     */
    function setButtonsContent(content) {
      this.buttons_content = content;
      if (this.showed) $('#panel-' + this.uid).find('[data-content="buttons"]').html(content);
    }
  }, {
    key: "setFooter",
    value:
    /**
     * Nastavuje patičku
     * @param {string} footer Patička
     */
    function setFooter(footer) {
      this.footer = footer;
      if (this.showed) $('#panel-' + this.uid).find('[data-content="footer"]').html(footer);
    }
  }, {
    key: "setHeader",
    value:
    /**
     * Nastavuje hlavičku
     * @param {string} header Hlavička
     */
    function setHeader(header) {
      this.header = header;
      if (this.showed) $('#panel-' + this.uid).find('[data-content="header"]').html(header);
    }
  }, {
    key: "showFromUrl",
    value:
    /**
     * Načítá panel z URL
     * @param {string} url Url pro načtení obsahu
     * @param {Object} data Parametry
     */
    function showFromUrl(url) {
      var _this = this;
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      Helpers.ajax({
        url: url,
        data: data,
        success: function success(data) {
          var _tmp$find$html, _tmp$find$html2, _tmp$find$html3, _tmp$find$html4, _tmp$find$html5;
          var tmp = $('<div></div>');
          tmp.html(data);
          _this.setHeader((_tmp$find$html = tmp.find("[data-panel='header']").html()) !== null && _tmp$find$html !== void 0 ? _tmp$find$html : '');
          _this.setContent((_tmp$find$html2 = tmp.find("[data-panel='content']").html()) !== null && _tmp$find$html2 !== void 0 ? _tmp$find$html2 : '');
          _this.setFooter((_tmp$find$html3 = tmp.find("[data-panel='footer']").html()) !== null && _tmp$find$html3 !== void 0 ? _tmp$find$html3 : '');
          _this.setTitle((_tmp$find$html4 = tmp.find("[data-panel='title']").html()) !== null && _tmp$find$html4 !== void 0 ? _tmp$find$html4 : '');
          _this.setButtonsContent((_tmp$find$html5 = tmp.find("[data-panel='buttons']").html()) !== null && _tmp$find$html5 !== void 0 ? _tmp$find$html5 : '');
          _this.show();
          tmp.remove();
        }
      });
    }

    // TODO: dodělat minimalizace
    /*saveState() {
        sessionStorage.setItem(uid, $element);
    };
     minimize() {
        saveState();
        $element.remove();
    };
     maximize() {
        sessionStorage.getItem(uid);
    };
    */

    /**
     * Přidá tlačítko do pole tlačítek
     * @param {string} button HTML s tlačítkem
     */
  }, {
    key: "addToButtonArea",
    value: function addToButtonArea(button) {
      this.buttons.push(button);
    }
  }, {
    key: "setUrl",
    value:
    /**
     * Nastavuje URL
     * @param {string} editAction Editační URL
     * @param {int} entityID ID upravované entity
     */
    function setUrl(editAction) {
      var entityID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (!replace) this.prevUrl = window.location.href;
      if (entityID != null) {
        if (editAction.includes('?')) {
          editAction += '&entity_ID=' + entityID;
        } else {
          editAction += '?entity_ID=' + entityID;
        }
      }
      if (!replace) window.history.pushState('editor', 'Editor', editAction);else window.history.replaceState('editor', 'Editor', editAction);
    }

    /**
     * Zobrazuje panel
     */
  }, {
    key: "show",
    value: function show() {
      var _this2 = this;
      if (Object.values(panels).filter(function (obj) {
        return obj.showed === true;
      }).length > 0) {
        console.warn('There is one panel already opened!');
        delete panels[this.uid];
        return null;
      }
      if (this.onBeforeShow != null) this.onBeforeShow();
      var buttons_html = this.buttons.join('');
      buttons_html += this.buttons_content;
      var template = "\n            <div id=\"panel-".concat(this.uid, "\" class=\"").concat(this.classes, "\">\n                <div class=\"panel-heading row\">\n                    <div class=\"col-12 col-md-auto\">\n                        <button class=\"btn btn-icon\" onclick=\"panels['").concat(this.uid, "'].close()\"><i class=\"fa fa-arrow-left\"></i> </button> <h1 class=\"d-inline-block\" data-content=\"title\">").concat(this.title, "</h1>\n                    </div>\n                    <div class=\"col-12 col-md text-right\" data-content=\"buttons\">\n                        ").concat(buttons_html, "\n                    </div>\n                    <div class=\"col-12\" data-content=\"header\">\n                        ").concat(this.header, "\n                    </div>\n                </div>\n                <div class=\"panel-content\" data-content=\"content\">\n                    ").concat(this.content, "\n                </div>\n                <div data-content=\"footer\">\n                    ").concat(this.footer, "\n                </div>\n            </div>\n        ");
      if (this.appendSelector === 'main #content') {
        $('main #content').children().each(function () {
          $(this).hide();
        });
      }
      if (!this.entityEditor && this.cache || !this.cache) {
        $(this.appendSelector).append(template);
        plugins.initPlugins();
      } else {
        $('#panel-' + this.uid).css('display', 'block');
      }
      this.showed = true;
      $(window).on('popstate', function (event) {
        if (document.location.href === _this2.prevUrl) _this2.close();
      });
      if (this.onAfterShow != null) this.onAfterShow();
    }
  }]);
}();
//# sourceMappingURL=Panel.js.map

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
var EntityEditor = /*#__PURE__*/function () {
  /**
   * EntityEditor constructor
   * @param {string} editor_id ID elementu s editorem
   * @param {int|null} entity_id ID upravované entity
   * @param {string|null} entity_name_column Sloupec s názvem upravované entity
   */
  function EntityEditor(editor_id, entity_id, entity_name_column) {
    var _this = this;
    _classCallCheck(this, EntityEditor);
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
    if (this.dataSaveType === 'local') {
      this.forGrid = getDataAttr(this.editor, 'for-grid');
      this.local_tmp_id = getDataAttr(this.editor, 'local-tmp-id');
    } else {
      this.forGrid = null;
      this.local_tmp_id = null;
    }
    this.data = {};
    if (this.entity_id !== null && this.entity_id !== '' || this.local_tmp_id && this.local_tmp_id !== '') {
      setTimeout(function () {
        return _this.loadData();
      }, 0);
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
    $(function () {
      if (_this.entity_id !== null && _this.entity_id !== '' || _this.local_tmp_id && _this.local_tmp_id !== '') plugins.initPlugins(true);else plugins.initPlugins(true, true);
      $('[role="tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
      });
      if (typeof _this.onAfterShow === 'function') _this.onAfterShow();
      if (entity_id === '') {
        $(_this.editor).closest('.entity-editor').find('[data-create="false"]').hide();
      } else {
        $(_this.editor).closest('.entity-editor').find('[data-update="false"]').hide();
      }
      $(document).ready(function () {
        $(_this.editor).keydown(function (event) {
          if (event.keyCode == 13) {
            if ($(event.target).prop('tagName') === "TEXTAREA") return;
            event.preventDefault();
            if (_this.sendOnEnter) {
              if (!$(event.target).closest('.block-editor-holder').length) _this.confirm();
            }
          }
        });
      });
      $(_this.form.form).find('input,select').change(function (e) {
        $(window).off('beforeunload');
        if (_this.isEdited()) {
          $(window).on('beforeunload', function () {
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
  return _createClass(EntityEditor, [{
    key: "setPanel",
    value: function setPanel(panel) {
      this.panel = panel;
      this.panel.entityEditor = this;
    }

    /**
     * Určuje zda je editor v režimu úprav entity
     * @returns {boolean}
     */
  }, {
    key: "isEditing",
    value: function isEditing() {
      return this.entity_id !== '' && this.entity_id !== null;
    }

    /**
     * Nastavuje rodičovskou entitu
     * @param {string} column Sloupec
     * @param {string} value Hodnota
     */
  }, {
    key: "setParentEntity",
    value: function setParentEntity(column, value) {
      this.parent_entity[column] = value;
      if (value !== "") {
        var parent = $('#' + this.editor.getAttribute('id') + ' [name="' + column + '"]');
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
  }, {
    key: "confirm",
    value: function confirm() {
      var _this2 = this;
      var closePanel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var cont = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      $(window).off('beforeunload');
      if (typeof this.onBeforeConfirm === 'function') {
        if (!this.onBeforeConfirm()) return false;
      }
      if (this.form.validate()) {
        if (this.forGrid && this.dataSaveType === 'local') {
          var data = _objectSpread({}, this.form.serializeArrayEntity());
          if (!this.local_tmp_id) {
            data['local_tmp_id'] = Date.now();
            window[this.forGrid].addRow(data);
          } else {
            var row = window[this.forGrid].getRowByUniqueKeyValue('local_tmp_id', this.local_tmp_id);
            window[this.forGrid].updateRow(row, data);
          }
          this.confirmSuccess(true, data, false);
          return;
        }
        var filePromises = [];
        var isFile = false;
        $(this.form.getForm()).find('input[type="file"]').not('[multiple="multiple"]').each(function (i, e) {
          var file_input = $(e);
          var promise = new Promise(function (resolve, reject) {
            var formData = new FormData();
            if (!file_input.attr('multiple')) {
              if (file_input[0].files.length > 0) {
                isFile = true;
                formData.append('uploadFile', file_input[0].files[0]);
                formData.append('type', file_input.data('type'));
                Helpers.ajax({
                  type: 'POST',
                  url: basePath + '/' + file_input.data('url'),
                  data: formData,
                  mimeTypes: "multipart/form-data",
                  contentType: false,
                  cache: false,
                  processData: false,
                  success: function success(data) {
                    file_input.attr('type', 'text');
                    file_input.val(JSON.parse($(data).val()).items[0].ID);
                    resolve(data);
                  },
                  error: function error(err) {
                    return reject(err);
                  }
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
        Promise.all(filePromises).then(function (data) {
          var _data = _this2.customData;
          _data = _objectSpread(_objectSpread({}, _data), _this2.serializeData());
          Helpers.ajax({
            type: 'POST',
            url: _this2.entity_id == '' || _this2.entity_id === null ? _this2.datacreateUrl : _this2.dataupdateUrl,
            data: {
              data: JSON.stringify(_data)
            },
            success: function success(data) {
              var confirm = true;
              if (typeof data === 'string') data = JSON.parse(data);
              if (typeof data.statuses !== 'undefined' && data.statuses.length > 0) {
                data.statuses.forEach(function (status) {
                  if (!status.confirmAfterNotify) confirm = false;
                  alerts.alert('', status.type, status.msg);
                  if (status.afterNotifyFunction) {
                    if (typeof eval(status.afterNotifyFunction) === 'function') eval(status.afterNotifyFunction + '()');else console.warn('Typeof ' + status.afterNotifyFunction + ' is not a function');
                  }
                });
              }
              if (confirm) {
                if (_typeof(data) === 'object') data = data.items;
                if ($(_this2.form.form).find('[data-multiupload]').length > 0) {
                  $(_this2.form.form).find('[data-multiupload]').each(function (i, e) {
                    if (typeof $(e).data('multiupload-url') !== 'undefined' && $(e).data('multiupload-url') !== '') {
                      if ($(e).prop("files").length > 0) {
                        var url = $(e).data('multiupload-url');
                        var file_input = $(e);
                        var ajaxes = [];
                        var entity_ajaxes = [];
                        $.each($(e).prop("files"), function (k, v) {
                          var form_data = new FormData();
                          var entity_id = data[0].ID;
                          form_data.append("uploadFile", v);
                          form_data.append("Entity_ID", entity_id);
                          ajaxes.push(Helpers.ajax({
                            type: 'POST',
                            url: basePath + '/' + file_input.data('url'),
                            data: form_data,
                            mimeTypes: "multipart/form-data",
                            contentType: false,
                            cache: false,
                            processData: false,
                            success: function success(data) {
                              file_input.attr('type', 'text');
                              file_input.val(JSON.parse($(data).val()).items[0].ID);
                              var d = _this2.serializeData();
                              d[url.identifier] = entity_id;
                              entity_ajaxes.push(Helpers.ajax({
                                type: 'POST',
                                url: url.url,
                                data: {
                                  data: JSON.stringify(d)
                                }
                              }));
                            },
                            error: function error(err) {
                              return reject(err);
                            }
                          }));
                        });
                        Promise.all(ajaxes).then(function () {
                          Promise.all(entity_ajaxes).then(function () {
                            _this2.confirmSuccess(closePanel, data, cont);
                          });
                        });
                      } else _this2.confirmSuccess(closePanel, data, cont);
                    } else {
                      if ($(e).prop("files").length > 0) {
                        var _ajaxes = [];
                        var ajaxes_obj = [];
                        $.each($(e).prop("files"), function (k, v) {
                          if (data) {
                            var form_data = new FormData();
                            form_data.append("uploadFile", v);
                            form_data.append("Entity_ID", data[0].ID);
                            _ajaxes.push(Helpers.ajax({
                              url: basePath + '/' + $(e).data('url'),
                              type: "POST",
                              data: form_data,
                              mimeTypes: "multipart/form-data",
                              contentType: false,
                              cache: false,
                              processData: false
                            }));
                            data = null;
                          } else {
                            var _data2 = _this2.customData;
                            _data2 = _objectSpread(_objectSpread({}, _data2), _this2.serializeData());
                            ajaxes_obj.push(Helpers.ajax({
                              type: 'POST',
                              url: _this2.entity_id == null || _this2.entity_id === null ? _this2.datacreateUrl : _this2.dataupdateUrl,
                              data: {
                                data: JSON.stringify(_data2)
                              },
                              success: function success(data) {
                                if (typeof data === 'string') data = JSON.parse(data);
                                if (_typeof(data) === 'object') data = data.items;
                                var form_data = new FormData();
                                form_data.append("uploadFile", v);
                                form_data.append("Entity_ID", data[0].ID);
                                _ajaxes.push(Helpers.ajax({
                                  url: basePath + '/' + $(e).data('url'),
                                  type: "POST",
                                  data: form_data,
                                  mimeTypes: "multipart/form-data",
                                  contentType: false,
                                  cache: false,
                                  processData: false
                                }));
                              }
                            }));
                          }
                        });
                        Promise.all(ajaxes_obj).then(function () {
                          Promise.all(_ajaxes).then(function () {
                            _this2.confirmSuccess(closePanel, data, cont);
                          });
                        });
                      } else _this2.confirmSuccess(closePanel, data, cont);
                    }
                  });
                } else {
                  _this2.confirmSuccess(closePanel, data, cont);
                }
              }
            }
          });
        });
      } else {
        var tab = this.form.invalidFields[0].closest('.tab-pane');
        $('#' + tab.attr('id') + '-link').tab('show');
      }
    }
  }, {
    key: "confirmSuccess",
    value: function confirmSuccess(closePanel, data) {
      var _this3 = this;
      var cont = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (typeof this.onAfterConfirm === 'function') this.onAfterConfirm(data, closePanel);
      alerts.alert(translations.EDIT_DONE, 'success', '');
      if (closePanel) if (this.panel !== null) {
        if (cont) this.panel.close('continue', data);else this.panel.close(null, data);
      } else {
        $('#hard-loader').addClass('show');
        setTimeout(function () {
          window.location.href = $('#' + _this3.editor.getAttribute('id') + '_back').attr('href');
        });
      }
    }

    /**
     * Načte entity data do editoru
     */
  }, {
    key: "loadData",
    value: function loadData() {
      var _this4 = this;
      if (typeof this.onBeforeLoad === 'function') this.onBeforeLoad();
      if (this.dataSaveType === 'local' && this.forGrid) {
        var data = window[this.forGrid].getRowByUniqueKeyValue('local_tmp_id', this.local_tmp_id).data()[0];
        this.initData(data);
        return;
      }
      this.loadedData = false;
      Helpers.ajax({
        type: 'GET',
        url: this.datalistUrl + this.entity_id + '&full=true',
        dataType: 'json',
        success: function success(data) {
          if (data.items.length === 0) {
            window.location.replace(basePath + '/404');
            return;
          }
          data = data.items[0];
          _this4.initData(data);
          plugins.initPlugins();
          for (var _i = 0, _Object$entries = Object.entries(_this4.form.getInputObjectsByType(BlockEditor)); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
              name = _Object$entries$_i[0],
              input = _Object$entries$_i[1];
            input.loadDataFromDataInput();
          }
          _this4.loadedData = true;
        }
      }, true);
    }
  }, {
    key: "setSendOnEnter",
    value: function setSendOnEnter(send) {
      this.sendOnEnter = send;
    }
  }, {
    key: "isEdited",
    value: function isEdited() {
      if (!this.loadedData) return false;
      for (var _i2 = 0, _Object$entries2 = Object.entries(this.data); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          key = _Object$entries2$_i[0],
          value = _Object$entries2$_i[1];
        if (this.form.getInput(key).length) {
          if (value === 'null' && this.form.getValue(key) === null) {
            continue;
          }
          if (value === null && this.form.getValue(key) === 'null') {
            continue;
          }
          if (this.form.getInput(key).data('currency') == '1') {
            value = (value / 100).toString();
          }
          if (value !== this.form.getValue(key)) {
            if (this.form.getInput(key).attr('type') === 'file') {
              if (value) {
                return true;
              }
            } else {
              return true;
            }
          }
        }
      }
      ;
      return false;
    }
  }, {
    key: "refreshSubGrids",
    value: function refreshSubGrids() {
      this.subGrids.forEach(function (subGrid) {
        subGrid.refresh();
      });
    }
  }, {
    key: "refreshRelationSwitches",
    value: function refreshRelationSwitches() {
      var _this5 = this;
      this.relationSwitches.forEach(function (relationSwitch) {
        relationSwitch.parent_id = _this5.entity_id;
        relationSwitch.refresh();
      });
    }
  }, {
    key: "refreshCategoryTrees",
    value: function refreshCategoryTrees() {
      var _this6 = this;
      this.categoryTrees.forEach(function (categoryTree) {
        categoryTree.entity_id = _this6.entity_id;
        categoryTree.loadData();
      });
    }
  }, {
    key: "gotoNext",
    value: function gotoNext() {
      var newEntity_id = this.entityIterator.next();
      if (!this.entityIterator.hasNext()) $('#' + this.editor_id + '_editor_next_entity_button').addClass('disabled');else $('#' + this.editor_id + '_editor_next_entity_button').removeClass('disabled');
      if (!this.entityIterator.hasPrev()) $('#' + this.editor_id + '_editor_prev_entity_button').addClass('disabled');else $('#' + this.editor_id + '_editor_prev_entity_button').removeClass('disabled');
      $('#' + this.editor_id + '_editor_iterator_current').text(this.entityIterator.currentIndex + 1);
      if (newEntity_id) {
        this.entity_id = newEntity_id;
        this.panel.setUrl(location.pathname, newEntity_id, true);
        this.loadData();
        this.refreshSubGrids();
        this.refreshRelationSwitches();
        this.refreshCategoryTrees();
      }
    }
  }, {
    key: "gotoPrev",
    value: function gotoPrev() {
      var newEntity_id = this.entityIterator.prev();
      if (!this.entityIterator.hasNext()) $('#' + this.editor_id + '_editor_next_entity_button').addClass('disabled');else $('#' + this.editor_id + '_editor_next_entity_button').removeClass('disabled');
      if (!this.entityIterator.hasPrev()) $('#' + this.editor_id + '_editor_prev_entity_button').addClass('disabled');else $('#' + this.editor_id + '_editor_prev_entity_button').removeClass('disabled');
      $('#' + this.editor_id + '_editor_iterator_current').text(this.entityIterator.currentIndex + 1);
      if (newEntity_id) {
        this.entity_id = newEntity_id;
        this.panel.setUrl(location.pathname, newEntity_id, true);
        this.loadData();
        this.refreshSubGrids();
        this.refreshRelationSwitches();
        this.refreshCategoryTrees();
      }
    }
  }, {
    key: "initData",
    value: function initData(data) {
      var _this7 = this;
      this.data = data;
      var data_items = Object.keys(data);
      data_items.filter(function (item) {
        return _typeof(data[item]) == 'object' && data[item] !== null;
      }).forEach(function (v) {
        data_items = [].concat(_toConsumableArray(data_items), _toConsumableArray(Object.keys(data[v]).map(function (item) {
          return v + '[' + item + ']';
        })));
      });
      $(this.editor).find(':input').each(function (i, e) {
        e = $(e);
        if (data_items.includes(e.attr('name'))) {
          var value;
          if (e.attr('name').includes('[')) {
            value = data[e.attr('name').replace(/ *\[[^)]*\] */g, "")][e.attr('name').match(/\[(.*)\]/)[1]];
          } else value = data[e.attr('name')];
          if (e.attr('type') === 'checkbox') e.prop('checked', Boolean(Number(value)));else if (e.attr('type') === 'radio') {
            if (value === e.val()) e.prop('checked', true);
          } else if (e.prop('tagName') === 'SELECT') {
            if (e.data('store') === undefined) {
              e.val(value !== null && value !== void 0 ? value : 'null').trigger('change');
              $("[column='" + e.attr('name') + "']").text(value);
            } else {
              var $newOption;
              if (_this7.dataSaveType === 'local') {
                $newOption = $("<option selected='selected'>" + _this7.data[e.attr('name') + '_storefield'] + "</option>").val(value !== null && value !== void 0 ? value : 'null').text(_this7.data[e.attr('name') + '_storefield']);
              } else {
                $newOption = $("<option selected='selected'>" + _this7.data[e.data('storefield')] + "</option>").val(value !== null && value !== void 0 ? value : 'null').text(_this7.data[e.data('storefield')]);
              }
              e.append($newOption).trigger('change');
            }
          } else if (e.prop('tagName') === 'TEXTAREA') {
            if (tinymce.get(e.attr('id')) != null) {
              if (value === null) value = '';
              e.val(value);
              tinymce.get(e.attr('id')).setContent(value);
            } else {
              e.val(value);
              if (e.attr('blockeditor') && value !== null && value !== '') {
                grapesjs.editors.forEach(function (editor) {
                  if ($(editor.getEl()).parent().hasClass('block-editor')) {
                    var name = $(editor.getEl()).parent().parent().attr('blockeditordata');
                    if (typeof name !== 'undefined' && name === e.attr('blockeditor')) {
                      try {
                        editor.loadData(JSON.parse($("[name='" + name + "']").val()));
                      } catch (_unused) {}
                    }
                  }
                });
              }
            }
          } else if (e.attr('type') === 'text' && e.hasClass('datepicker')) {
            var date = moment(value, 'YYYY-MM-DD');
            e.data("DateTimePicker").date(date);
          } else if (e.attr('type') === 'text' && e.hasClass('datetimepicker')) {
            var _date = moment(value, 'YYYY-MM-DD HH:mm:ss');
            e.data("DateTimePicker").date(_date);
          } else if (e.attr('type') === 'file') {
            var input_value;
            if (e.attr('name').includes('[')) {
              input_value = data[e.attr('name').split('[')[0]][e.attr('name').split('[')[1].slice(0, -1)];
            } else input_value = data[e.attr('name')];
            if (input_value !== null) {
              e.data('id', input_value);
              var fname = '';
              if (data[e.attr('name') + '_Name'] !== undefined && data[e.attr('name') + '_Extension'] !== undefined) fname = data[e.attr('name') + '_Name'] + '.' + data[e.attr('name') + '_Extension'];else {
                fname = 'Download';
                console.warn('Please add ' + e.attr('name') + '_Name and ' + e.attr('name') + '_Extension to manager to get uploaded file name');
              }
              $(_this7.editor).find("[data-imgpreview='" + e.attr('name') + "']").attr('src', window.location.origin + $(_this7.editor).find("[data-imgpreview='" + e.attr('name') + "']").data('imgpath') + fname);
              e.parent().find('div').remove();
              if (e.data("folder")) {
                var folder = e.data("folder");
                e.after("<div>".concat(translations.CURRENT_FILE, ": <a href=\"").concat(basePath, "/common/file/download?ID=").concat(value, "&Folder=").concat(folder, "\" target=\"_blank\">").concat(fname, "</a> - <a href=\"javascript:;\" onclick=\"window['").concat(_this7.editor.getAttribute('id'), "'].form.getInput('").concat(e.attr('name'), "').trigger('resetFile');\" class=\"text-red\">").concat(translations.REMOVE, "</a></div>"));
              } else e.after("<div>".concat(translations.CURRENT_FILE, ": <a href=\"").concat(basePath, "/common/file/download?ID=").concat(value, "\" target=\"_blank\">").concat(fname, "</a> - <a href=\"javascript:;\" onclick=\"window['").concat(_this7.editor.getAttribute('id'), "'].form.getInput('").concat(e.attr('name'), "').trigger('resetFile');\" class=\"text-red\">").concat(translations.REMOVE, "</a></div>"));
            }
          } else if (e.attr('type') === 'number' && e.data('currency') === 1) {
            e.val(Math.floor(parseFloat(value)) / 100);
          } else {
            e.val(value);
          }
        }
      });
      if (this.entity_name_column !== undefined) $('.entity_name').text(data[this.entity_name_column]);
      if (typeof this.onAfterLoad === 'function') {
        setTimeout(function () {
          _this7.onAfterLoad();
        }, 0);
      }
      $(this.editor).find('*[column]').each(function (index, e) {
        e = $(e);
        e.text(_this7.data[e.attr('column')]);
      });
    }
  }, {
    key: "serializeData",
    value: function serializeData(type) {
      var data = this.form.serializeArrayEntity();
      this.subGrids.forEach(function (grid) {
        if (grid.params.dataSaveType === 'local') {
          data[grid.params.dataSaveParams['managerAlias']] = {};
          if (!grid.grid.data().toArray().ID) data[grid.params.dataSaveParams['managerAlias']]['new'] = grid.grid.data().toArray();else data[grid.params.dataSaveParams['managerAlias']]['modified'] = grid.grid.data().toArray();
        }
      });
      return data;
    }
  }, {
    key: "hideTab",
    value: function hideTab(id) {
      $('#tab-' + id).addClass('d-none');
      $('#tab-nav-' + id).addClass('d-none');
    }
  }, {
    key: "showTab",
    value: function showTab(id) {
      $('#tab-' + id).removeClass('d-none');
      $('#tab-nav-' + id).removeClass('d-none');
    }
  }, {
    key: "setCreateDefaultValues",
    value: function setCreateDefaultValues(values) {
      var _this8 = this;
      if (this.entity_id) return;
      if (_typeof(values) !== 'object') return;
      Object.entries(values).forEach(function (key, index) {
        _this8.form.setValue(key[0], key[1]);
      });
    }
  }, {
    key: "setCustomData",
    value: function setCustomData(key, val) {
      this.customData[key] = val;
    }
  }, {
    key: "getCustomData",
    value: function getCustomData() {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (key) return this.customData[key];else return this.customData;
    }
  }]);
}();
//# sourceMappingURL=EntityEditor.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Breadcrumb = /*#__PURE__*/function () {
  /**
   * Breadcrumb constructor.
   * @param {array} items Výchozí pole položek breadcrumbu
   * @param {string} homepage_url
   * @param {string} site
   */
  function Breadcrumb() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var homepage_url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : basePath + '/default/homepage';
    var site = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    _classCallCheck(this, Breadcrumb);
    this.items = items;
    this.site = site;
    this.homepage_url = homepage_url;
    this.render();
  }

  /**
   * Přidá položku
   * @param {string} url URL položky
   * @param {string} type ZATÍM NEVYUŽITO
   * @param {string} name Název položky
   */
  return _createClass(Breadcrumb, [{
    key: "addItem",
    value: function addItem(url) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var name = arguments.length > 2 ? arguments[2] : undefined;
      this.items.push({
        'url': url,
        'type': type,
        'name': name
      });
      this.render();
    }

    /**
     * Odstraní poslední položku
     */
  }, {
    key: "popItem",
    value: function popItem() {
      this.items.pop();
      this.render();
    }

    /**
     * Mění titulek stránky dle názvu poslední položky
     */
  }, {
    key: "changeTitle",
    value: function changeTitle() {
      if (this.items.length > 0) window.document.title = this.items[this.items.length - 1].name.replace(/<[^>]+>/g, '') + ' | ' + this.site;
    }

    /**
     * Render breadcrumbu
     */
  }, {
    key: "render",
    value: function render() {
      var items = "\n            <a href=\"".concat(this.homepage_url, "\" class=\"d-flex align-items-center\">\n                <i class=\"fa fa-home home-icon\"></i>\n                <span>Homepage</span>\n            </a>\n        ");
      this.items.forEach(function (v, k) {
        items += "<span class=\"breadcrumbitem\"><i class=\"fa fa-chevron-right\"></i> <a href=\"".concat(v.url, "\">").concat(v.name, "</a></span>");
      });
      $('.breadcrumb-items').html(items);
      this.changeTitle();
    }
  }]);
}();
//# sourceMappingURL=Breadcrumb.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Dialog = /*#__PURE__*/function () {
  /**
   * Dialog constructor
   */
  function Dialog() {
    _classCallCheck(this, Dialog);
    this._content = '';
    this._title = '';
    this._footer = '';
    this._uid = 'dialog' + Math.random().toString(36).substring(7);
    window[this._uid] = this;
    this.element = document.createElement("div");
    this.element.setAttribute('id', this._uid);
    this.element.setAttribute('class', 'modal fade show');
    this.element.setAttribute('style', 'display: block');
    this.element.setAttribute('role', 'dialog');
    this.shown = false;
    this.confirmButton = false;
    this.confirm_function = null;
    this.cancelButton = false;
    this.onBeforeClose = null;
    this.onAfterClose = null;
    this.onBeforeShow = null;
    this.onAfterShow = null;
    this._maxWidth = null;
    this._confirmButtonText = translations.CONFIRM;
    this._cancelButtonText = translations.CLOSE;
    this.bindEvents();
  }
  return _createClass(Dialog, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;
      $(document).ready(function () {
        $(_this.element).keydown(function (event) {
          if (event.keyCode == 13) {
            if ($(event.target).prop('tagName') === "TEXTAREA") return;
            event.preventDefault();
            if (_this.confirmButton) eval(_this.confirm_function);
          }
        });
      });
      if (!Dialog.escEventInit) {
        $(document).keydown(function (event) {
          if (event.keyCode == 27) {
            var activeDialog = Dialog.getActiveDialog();
            if (activeDialog) {
              Dialog.getActiveDialog().close();
            }
          }
        });
        Dialog.escEventInit = true;
      }
    }

    /**
     * Uzavírá dialog
     */
  }, {
    key: "close",
    value: function close() {
      if (this.shown) {
        this.shown = false;
        if (this.onBeforeClose !== null) this.onBeforeClose();
        Dialog.dialogs.pop();
        if (Dialog.dialogs.length) {
          var lastDialog = Dialog.dialogs.at(-1);
          $($(lastDialog.element).find('.modal-content')[0]).removeClass('not-active');
        }
        this.element.parentNode.removeChild(this.element);
        window[this._uid] = undefined;
        if (this.onAfterClose !== null) this.onAfterClose();
        if (Dialog.getOpenDialogs().length === 0) {
          layout.dialogShow = false;
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();
        }
      }
    }

    /**
     * Zobrazuje dialog
     */
  }, {
    key: "show",
    value: function show() {
      var _this2 = this;
      if (typeof window[this._uid] === 'undefined') {
        window[this._uid] = this;
      }
      if (!this.shown) {
        Dialog.getOpenDialogs().forEach(function (dialog, index) {
          if (index !== _this2._uid) $($(dialog.element).find('.modal-content')[0]).addClass('not-active');
        });
        Dialog.dialogs.push(this);
        this.shown = true;
        layout.dialogShow = true;
        if (this.onBeforeShow !== null) this.onBeforeShow();
        $('body').addClass('modal-open');
        if ($('.modal-backdrop').length === 0) {
          $('body').append('<div class="modal-backdrop fade show">');
        }
        this.render();
        $('.modal-dialog').draggable({
          handle: ".modal-header"
        });
        if (this.onAfterShow !== null) this.onAfterShow();
      }
    }

    /**
     * Vrací obsah
     * @return {string}
     */
  }, {
    key: "content",
    get: function get() {
      return this._content;
    }

    /**
     * Nastavuje obsah
     * @param value
     */,
    set: function set(value) {
      this._content = value;
      if (this.shown) $('#dialog_' + this._uid).find('.modal-body').html(value);
    }

    /**
     * Vrací titulek
     * @return {string}
     */
  }, {
    key: "title",
    get: function get() {
      return this._title;
    }

    /**
     * Nastavuje titulek
     * @param value
     */,
    set: function set(value) {
      this._title = value;
      if (this.shown) $('#dialog_' + this._uid).find('.modal-title').html(value);
    }

    /**
     * Vrací patičku
     * @return {string}
     */
  }, {
    key: "footer",
    get: function get() {
      return this._footer;
    }

    /**
     * Nastavuje patičku
     * @param value
     */,
    set: function set(value) {
      this._footer = value;
      if (this.shown) $('#dialog_' + this._uid).find('.modal-footer').html(value);
    }

    /**
     * Vrací ID dialogu
     * @return {string}
     */
  }, {
    key: "uid",
    get: function get() {
      return this._uid;
    }

    /**
     * Zobrazuje dialog s obsahem vzatým z AJAX requestu
     * @param {string} url URL s daty
     * @param {Object} params Parametry requestu
     * @param {boolean} json Označení, zda jsou data servírována v JSONu
     */
  }, {
    key: "showFromUrl",
    value: function showFromUrl(url) {
      var _this3 = this;
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var json = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      params.dialog_id = this._uid;
      Helpers.ajax({
        url: url,
        data: params,
        success: function success(data) {
          if (json) {
            data = JSON.parse(data);
            _this3._content = data.content;
            _this3._title = data.title;
            _this3._footer = data.footer;
          } else _this3._content = data;
          _this3.show();
          plugins.initPlugins();
        }
      });
    }
  }, {
    key: "enableConfirmButton",
    value: function enableConfirmButton() {
      var confirm_function = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'confirm()';
      this.confirmButton = true;
      this.confirm_function = confirm_function;
    }
  }, {
    key: "enableCancelButton",
    value: function enableCancelButton() {
      this.cancelButton = true;
    }
  }, {
    key: "confirmButtonText",
    get: function get() {
      return this._confirmButtonText;
    },
    set: function set(text) {
      this._confirmButtonText = text;
    }
  }, {
    key: "cancelButtonText",
    get: function get() {
      return this._cancelButtonText;
    },
    set: function set(text) {
      this._cancelButtonText = text;
    }
  }, {
    key: "maxWidth",
    set: function set(maxWith) {
      this._maxWidth = maxWith;
    }

    /**
     * Vykreslení dialogu
     */
  }, {
    key: "render",
    value: function render() {
      var customStyle = '';
      if (this._maxWidth) {
        customStyle = 'max-width: ' + this._maxWidth + 'px;';
      }
      if (this.confirmButton && !this._footer.includes("id=\"dialog_".concat(this._uid, "_confirm_button\""))) this._footer += "<button class=\"btn btn-success\" id=\"dialog_".concat(this._uid, "_confirm_button\" data-dialog-id=\"dialog_").concat(this._uid, "\" onclick=\"").concat(this.confirm_function, "\">").concat(this._confirmButtonText, "</button>");
      if (this.cancelButton && !this._footer.includes("id=\"dialog_".concat(this._uid, "_cancel_button\""))) this._footer += "<button class=\"btn btn-red\" id=\"dialog_".concat(this._uid, "_cancel_button\"  data-dialog-id=\"dialog_").concat(this._uid, "\" onclick=\"window['").concat(this._uid, "'].close();\">").concat(this._cancelButtonText, "</button>");
      var template = "\n              <div class=\"modal-dialog modal-lg modal-dialog-centered\" id=\"dialog_".concat(this._uid, "\" role=\"document\" style=\"").concat(customStyle, "\">\n                <div class=\"modal-content\">\n                  <div class=\"modal-header\">\n                    <h5 class=\"modal-title\">").concat(this._title, "</h5>\n                    <button type=\"button\" class=\"close\" onclick=\"window['").concat(this._uid, "'].close()\" aria-label=\"Close\">\n                      <span aria-hidden=\"true\"><i class=\"ci ci-times\"></i></span>\n                    </button>\n                  </div>\n                  <div class=\"modal-body\">\n                    ").concat(this._content, "\n                  </div>");
      if (this._footer != '') template += "\n                  <div class=\"modal-footer\">\n                    ".concat(this._footer, "\n                  </div>\n                  ");
      template += "\n                </div>\n              </div>\n        ";
      this.element.innerHTML = template;
      $('body').append($(this.element));
      this.shown = true;
    }
  }], [{
    key: "getOpenDialogs",
    value: function getOpenDialogs() {
      var openDialogs = [];
      Dialog.dialogs.forEach(function (dialog, index) {
        if (dialog.shown) openDialogs.push(dialog);
      });
      return openDialogs;
    }
  }, {
    key: "getActiveDialog",
    value: function getActiveDialog() {
      var activeDialog = null;
      Dialog.getOpenDialogs().forEach(function (dialog, index) {
        if (!$($(dialog.element).find('.modal-content')[0]).hasClass('not-active')) {
          activeDialog = dialog;
        }
      });
      return activeDialog;
    }
  }]);
}();
_defineProperty(Dialog, "dialogs", []);
_defineProperty(Dialog, "escEventInit", false);
//# sourceMappingURL=Dialog.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var QuickEditor = /*#__PURE__*/function (_EntityEditor) {
  /**
   * QuickEditor constructor
   * @param {string} editor_id ID elementu s editorem
   * @param {int|null} entity_id ID upravované entity
   */
  function QuickEditor(editor_id) {
    var _this;
    var entity_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _classCallCheck(this, QuickEditor);
    _this = _callSuper(this, QuickEditor, [editor_id, entity_id, null]);
    _this.dialog = null;
    return _this;
  }
  _inherits(QuickEditor, _EntityEditor);
  return _createClass(QuickEditor, [{
    key: "setParentEntity",
    value: function setParentEntity(column, value) {}

    /**
     * Nastavuje dialog
     * @param {string} dialog ID dialogu
     */
  }, {
    key: "setDialog",
    value: function setDialog(dialog) {
      this.dialog = window[dialog];
    }

    /**
     * Potvrzuje a odešle data editoru
     */
  }, {
    key: "confirm",
    value: function confirm() {
      var _this2 = this;
      $(window).off('beforeunload');
      if (typeof this.onBeforeConfirm == "function") {
        var result = this.onBeforeConfirm();
        if (typeof result === 'boolean' && !result) return false;
      }
      if (this.form.validate()) {
        if (this.forGrid && this.dataSaveType === 'local') {
          var data = _objectSpread({}, this.form.serializeArrayEntity());
          if (!this.local_tmp_id) {
            data['ID'] = null;
            data['local_tmp_id'] = Date.now();
            window[this.forGrid].addRow(data);
          } else {
            var row = window[this.forGrid].getRowByUniqueKeyValue('local_tmp_id', this.local_tmp_id);
            window[this.forGrid].updateRow(row, data);
          }
          this.confirmSuccess();
          return;
        }
        var filePromises = [];
        var isFile = false;
        $(this.form.getForm()).find('input[type="file"]').each(function (i, e) {
          var file_input = $(e);
          var promise = new Promise(function (resolve, reject) {
            var formData = new FormData();
            if (!file_input.attr('multiple')) {
              if (file_input[0].files.length > 0) {
                isFile = true;
                formData.append('uploadFile', file_input[0].files[0]);
                formData.append('type', file_input.data('type'));
                Helpers.ajax({
                  type: 'POST',
                  url: basePath + '/' + file_input.data('url'),
                  data: formData,
                  mimeTypes: "multipart/form-data",
                  contentType: false,
                  cache: false,
                  processData: false,
                  success: function success(data) {
                    file_input.attr('type', 'text');
                    file_input.val(JSON.parse($(data).val()).items[0].ID);
                    resolve(data);
                  },
                  error: function error(err) {
                    return reject(err);
                  }
                });
              }
            }
          });
          if (isFile) filePromises.push(promise);else {
            if (file_input.data('id') !== undefined) {
              file_input.attr('type', 'text');
              file_input.val(file_input.data('id'));
            }
          }
        });
        Promise.all(filePromises).then(function (data) {
          var _data = _this2.customData;
          _data = _objectSpread(_objectSpread({}, _data), _this2.form.serializeArrayEntity());
          Helpers.ajax({
            type: 'POST',
            url: _this2.entity_id == null || _this2.entity_id == '' ? _this2.datacreateUrl : _this2.dataupdateUrl,
            data: {
              data: JSON.stringify(_data)
            },
            success: function success(data) {
              var confirm = true;
              if (typeof data === 'string') data = JSON.parse(data);
              if (typeof data.statuses !== 'undefined' && data.statuses.length > 0) {
                data.statuses.forEach(function (status) {
                  if (!status.confirmAfterNotify) confirm = false;
                  alerts.alert('', status.type, status.msg);
                  if (status.afterNotifyFunction) {
                    if (typeof eval(status.afterNotifyFunction) === 'function') eval(status.afterNotifyFunction + '()');else console.warn('Typeof ' + status.afterNotifyFunction + ' is not a function');
                  }
                });
              }
              if (confirm) {
                if (_typeof(data) === 'object') data = data.items;
                if ($(_this2.form.form).find('[data-multiupload]').length > 0) {
                  $(_this2.form.form).find('[data-multiupload]').each(function (i, e) {
                    if (typeof $(e).data('multiupload-url') !== 'undefined' && $(e).data('multiupload-url') !== '') {
                      if ($(e).prop("files").length > 0) {
                        var url = $(e).data('multiupload-url');
                        var file_input = $(e);
                        var ajaxes = [];
                        var entity_ajaxes = [];
                        $.each($(e).prop("files"), function (k, v) {
                          var form_data = new FormData();
                          var entity_id = data[0].ID;
                          form_data.append("uploadFile", v);
                          form_data.append("Entity_ID", entity_id);
                          ajaxes.push(Helpers.ajax({
                            type: 'POST',
                            url: basePath + '/' + file_input.data('url'),
                            data: form_data,
                            mimeTypes: "multipart/form-data",
                            contentType: false,
                            cache: false,
                            processData: false,
                            success: function success(data) {
                              file_input.attr('type', 'text');
                              file_input.val(JSON.parse($(data).val()).items[0].ID);
                              var d = _this2.form.serializeArrayEntity();
                              d[url.identifier] = entity_id;
                              entity_ajaxes.push(Helpers.ajax({
                                type: 'POST',
                                url: url.url,
                                data: {
                                  data: JSON.stringify(d)
                                }
                              }));
                            },
                            error: function error(err) {
                              return reject(err);
                            }
                          }));
                        });
                        Promise.all(ajaxes).then(function () {
                          Promise.all(entity_ajaxes).then(function () {
                            _this2.confirmSuccess();
                          });
                        });
                      } else _this2.confirmSuccess();
                    } else {
                      if ($(e).prop("files").length > 0) {
                        var _ajaxes = [];
                        var ajaxes_obj = [];
                        $.each($(e).prop("files"), function (k, v) {
                          if (data) {
                            var form_data = new FormData();
                            form_data.append("uploadFile", v);
                            form_data.append("Entity_ID", data[0].ID);
                            _ajaxes.push(Helpers.ajax({
                              url: basePath + '/' + $(e).data('url'),
                              type: "POST",
                              data: form_data,
                              mimeTypes: "multipart/form-data",
                              contentType: false,
                              cache: false,
                              processData: false
                            }));
                            data = null;
                          } else {
                            var _data2 = _this2.customData;
                            _data2 = _objectSpread(_objectSpread({}, _data2), _this2.form.serializeArrayEntity());
                            ajaxes_obj.push(Helpers.ajax({
                              type: 'POST',
                              url: _this2.entity_id == null || _this2.entity_id == '' ? _this2.datacreateUrl : _this2.dataupdateUrl,
                              data: {
                                data: JSON.stringify(_data2)
                              },
                              success: function success(data) {
                                if (typeof data === 'string') data = JSON.parse(data);
                                if (_typeof(data) === 'object') data = data.items;
                                var form_data = new FormData();
                                form_data.append("uploadFile", v);
                                form_data.append("Entity_ID", data[0].ID);
                                _ajaxes.push(Helpers.ajax({
                                  url: basePath + '/' + $(e).data('url'),
                                  type: "POST",
                                  data: form_data,
                                  mimeTypes: "multipart/form-data",
                                  contentType: false,
                                  cache: false,
                                  processData: false
                                }));
                              }
                            }));
                          }
                        });
                        Promise.all(ajaxes_obj).then(function () {
                          Promise.all(_ajaxes).then(function () {
                            _this2.confirmSuccess();
                          });
                        });
                      } else _this2.confirmSuccess();
                    }
                  });
                } else {
                  _this2.confirmSuccess();
                }
              }
            }
          });
        });
      }
    }
  }, {
    key: "confirmSuccess",
    value: function confirmSuccess() {
      if (typeof this.onAfterConfirm == "function") this.onAfterConfirm();
      $(window).off('beforeunload');
      window[this.editor_id] = null;
      alerts.alert(translations.EDIT_DONE, 'success', '');
      this.dialog.close();
    }
  }]);
}(EntityEditor);
//# sourceMappingURL=QuickEditor.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Cookie = /*#__PURE__*/function () {
  function Cookie() {
    _classCallCheck(this, Cookie);
  }
  return _createClass(Cookie, null, [{
    key: "setCookie",
    value:
    /**
     * Nastavuje cookie
     * @param {string} cname Název cookie
     * @param {string} cvalue Hodnota cookie
     * @param {int} exdays Doba expirace ve dnech
     */
    function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /**
     * Vrací hodnotu v cookie
     * @param {string} cname Název cookie
     * @return {string|undefined}
     */
  }, {
    key: "getCookie",
    value: function getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return undefined;
    }
  }]);
}();
//# sourceMappingURL=Cookie.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var StateRestore = /*#__PURE__*/function () {
  function StateRestore(grid) {
    _classCallCheck(this, StateRestore);
    this.initialized = false;
    this.grid = grid;
    this.selector = this.grid.id + '_staterestore';
    this.dialog = {
      element: document.getElementById(this.selector),
      buttonElement: document.getElementById(this.selector + '_button'),
      position: {
        top: 0,
        left: 0
      },
      dialogShow: false
    };
    this.renameDialog = {
      dialog: null
    };
    this.addDialog = {
      dialog: null
    };
    this.serverSideStates = [];
    this.userID = null;
    if (typeof userID !== 'undefined') this.userID = userID;else {
      console.warn('userID is not defined. Please add $user to your baseParams');
    }
    this.userStates = [];
    this.initAsync();
  }
  return _createClass(StateRestore, [{
    key: "init",
    value: function init() {
      if (!this.initialized) {
        $(this.dialog.element).detach().appendTo('body');
      } else {}
      this.bindEvents();
      this.initialized = true;
    }
  }, {
    key: "initServersideStates",
    value: function initServersideStates() {
      var _this = this;
      if (this.grid.params.presetSaveType === 'serverside') {
        var states = this.getStates();
        this.serverSideStates = states;
        if (!states) {
          return;
        }
        states.forEach(function (apiState, index) {
          if (apiState.PresetName === '_tmp_') return;
          var name = 'USR' + apiState.User_ID + '_' + apiState.PresetName;
          var state = _this.grid.grid.stateRestore.state(name);
          if (state[0] === null) {
            _this.grid.grid.stateRestore.state.add(name);
          }
          localStorage.setItem('DataTables_stateRestore_USR' + apiState.User_ID + '_' + apiState.PresetName + '_' + apiState.URL, apiState.Data);
        });
      }
    }
  }, {
    key: "initAsync",
    value: function () {
      var _initAsync = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              this.init();
            case 1:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function initAsync() {
        return _initAsync.apply(this, arguments);
      }
      return initAsync;
    }()
  }, {
    key: "loadUserStatesAsync",
    value: function () {
      var _loadUserStatesAsync = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              this.loadUserStates();
            case 1:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function loadUserStatesAsync() {
        return _loadUserStatesAsync.apply(this, arguments);
      }
      return loadUserStatesAsync;
    }()
  }, {
    key: "addDefaultState",
    value: function addDefaultState(baseOptions) {
      var _this2 = this;
      var options = {
        "order": baseOptions.order,
        "columns": [],
        "columnsWidth": [],
        "ColReorder": [],
        "start": 0,
        "length": 400
      };
      baseOptions.aoColumnDefs.forEach(function (col, i) {
        var c = {};
        if (typeof col.visible === 'undefined') col.visible = true;
        c.visible = col.visible;
        options.columns.push(c);
        if (typeof col.sWidth === 'undefined') col.sWidth = null;
        options.columnsWidth.push(col.sWidth);
        options.ColReorder.push(i);
      });
      this.grid._onAfterInit = function () {
        _this2.defaultState = new $.fn.dataTable.StateRestore(_this2.grid.grid, {
          remove: false,
          rename: false
        }, "Reset", options, true);
      };
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this3 = this;
      $(document).on('click', '#' + this.selector + ' .user-presets button', function () {
        eval($(this).data('onclick'));
      });
      $(document).on('click', '#' + this.selector + ' button .buttons div', function (e) {
        e.stopPropagation();
        eval($(e.currentTarget).data('onclick'));
      });
      $(document).click(function (event) {
        if (_this3.dialog.dialogShow) {
          var $target = $(event.target);
          if (!$target.closest('#' + _this3.selector).length && !$target.closest('#' + _this3.selector + '_button').length) {
            _this3.hideDialog();
          }
        }
      });
    }
  }, {
    key: "changeDialogPosition",
    value: function changeDialogPosition() {
      var button = $(this.dialog.buttonElement);
      var element = $(this.dialog.element);
      var buttonPos = button.offset();
      this.dialog.position = {
        top: buttonPos.top + button.outerHeight() + 11,
        left: buttonPos.left - element.outerWidth() + button.outerWidth() + 15 - 6
      };
      this.redrawDialog();
      return this.dialog.position;
    }
  }, {
    key: "redrawDialog",
    value: function redrawDialog() {
      var element = $(this.dialog.element);
      element.css('top', this.dialog.position.top);
      element.css('left', this.dialog.position.left);
    }
  }, {
    key: "showDialog",
    value: function showDialog() {
      this.loadUserStatesAsync();
      this.changeDialogPosition();
      $(this.dialog.element).removeClass('d-none');
      this.dialog.dialogShow = true;
    }
  }, {
    key: "hideDialog",
    value: function hideDialog() {
      $(this.dialog.element).addClass('d-none');
      this.dialog.dialogShow = false;
    }
  }, {
    key: "toogleShowDialog",
    value: function toogleShowDialog() {
      if (this.dialog.dialogShow) this.hideDialog();else this.showDialog();
    }
  }, {
    key: "renderDialog",
    value: function renderDialog() {
      var _this4 = this;
      var element = $(this.dialog.element);
      element.find('.user-presets').html('');
      this.userStates.forEach(function (state, i) {
        element.find('.user-presets').append("\n                <div class=\"preset-row\">\n                    <button type=\"button\" class=\"btn\" data-onclick=\"window['".concat(_this4.grid.id, "'].stateRestore.changeState('").concat(state.Name, "')\">").concat(state.Name, "\n                    <div class=\"buttons\">\n                        <div data-onclick=\"window['").concat(_this4.grid.id, "'].stateRestore.renameStateDialog('").concat(state.Name, "')\" data-toggle=\"bstooltip\" title=\"").concat(translations.RENAME, "\"><i class=\"ci ci-edit btn-ci\"></i></div>\n                        <div data-onclick=\"window['").concat(_this4.grid.id, "'].stateRestore.updateState('").concat(state.Name, "')\" data-toggle=\"bstooltip\" title=\"").concat(translations.UPDATE, "\"><i class=\"ci ci-refresh btn-ci\"></i></div>\n                        <div data-onclick=\"window['").concat(_this4.grid.id, "'].stateRestore.removeState('").concat(state.Name, "')\" data-toggle=\"bstooltip\" title=\"").concat(translations.REMOVE, "\"><i class=\"ci ci-times btn-ci\"></i></div>\n                    </div>\n                    </button>\n                </div>\n            "));
      });
    }
  }, {
    key: "loadUserStates",
    value: function loadUserStates() {
      var _this5 = this;
      this.userStates = [];
      if (this.userID) {
        this.grid.grid.stateRestore.states().each(function (state, i) {
          if (state.s.identifier.includes('USR' + _this5.userID + '_')) {
            state.Identifier = state.s.identifier;
            state.Name = state.s.identifier.replace('USR' + _this5.userID + '_', "");
            _this5.userStates.push(state);
          }
        });
      }
      this.renderDialog();
      return this.userStates;
    }
  }, {
    key: "showAddStateDialog",
    value: function showAddStateDialog() {
      this.grid.grid.stateRestore.state.add('', {
        creationModal: true,
        toggle: {
          columns: {
            visible: true
          },
          order: false
        },
        saveState: {
          order: true,
          scroller: false,
          select: false,
          paging: false,
          search: false,
          columns: {
            search: false,
            visible: true
          },
          searchBuilder: false,
          searchPanes: false
        }
      });
      this.renderAddStateDialog();
    }
  }, {
    key: "renderAddStateDialog",
    value: function renderAddStateDialog() {
      var _this6 = this;
      this.addDialog.dialog = new Dialog();
      this.addDialog.dialog.title = translations.ADD;
      this.addDialog.dialog.enableCancelButton();
      this.addDialog.dialog.enableConfirmButton("window['".concat(this.grid.id, "'].stateRestore.addUserState()"));
      this.addDialog.dialog.content = "<div class=\"form-group\"><div class=\"form-input-group col-md-12\"><label for=\"Name\">".concat(translations.NAME, "</label><input type=\"text\" name=\"tmpName\" class=\"form-control\"></div></div>");
      $(this.addDialog.dialog.element).on('keyup', '[name="tmpName"]', function (e) {
        $(_this6.grid.element).closest('.dataTables_wrapper').find('.dtsr-creation').find('.dtsr-name-input').val('USR' + _this6.userID + '_' + $(e.currentTarget).val());
      });
      this.addDialog.dialog.show();
    }
  }, {
    key: "addUserState",
    value: function addUserState() {
      var _this7 = this;
      if (!this.isStateExist($('[name="tmpName"]').val())) {
        $(this.grid.element).closest('.dataTables_wrapper').find('.dtsr-creation').find('.dtsr-creation-button').click();
        if (this.grid.params.presetSaveType === 'serverside') {
          var data = localStorage.getItem('DataTables_stateRestore_USR' + this.userID + '_' + $('[name="tmpName"]').val() + '_' + window.location.pathname);
          if (data === null) data = localStorage.getItem('DataTables_stateRestore_USR' + this.userID + '_' + $('[name="tmpName"]').val() + '_' + window.location.pathname + '_' + this.grid.id);
          this.saveState($('[name="tmpName"]').val(), data);
        }
        this.addDialog.dialog.close();
        setTimeout(function () {
          return _this7.loadUserStates();
        }, 100);
        this.addDialog.dialog = null;
      } else {
        alert(translations.NAME_ALREADY_EXIST);
      }
    }
  }, {
    key: "changeState",
    value: function changeState(name) {
      name = 'USR' + this.userID + '_' + name;
      this.grid.grid.stateRestore.state(name).load();
      var storeData = this.grid.grid.state.loaded();
      this.grid.columnsWidth = storeData.columnsWidth;
      return storeData;
    }
  }, {
    key: "resetToDefault",
    value: function resetToDefault() {
      this.defaultState.load();
      var storeData = this.grid.grid.state.loaded();
      this.grid.columnsWidth = storeData.columnsWidth;
    }
  }, {
    key: "updateState",
    value: function updateState(name) {
      if (confirm(translations.PRESET_ADD_CONFIRM + ' "' + name + '"?')) {
        var stateName = 'USR' + this.userID + '_' + name;
        this.grid.grid.stateRestore.state(stateName).save();
        if (this.grid.params.presetSaveType === 'serverside') {
          var data = localStorage.getItem('DataTables_stateRestore_USR' + this.userID + '_' + name + '_' + window.location.pathname);
          this.saveState(name, data);
        }
        this.loadUserStates();
      }
    }
  }, {
    key: "removeState",
    value: function removeState(name) {
      if (confirm(translations.REMOVE_QUESTION + ' ' + translations.PRESET + ' "' + name + '"?')) {
        if (this.grid.params.presetSaveType === 'serverside') {
          this.deleteState(name);
        }
        name = 'USR' + this.userID + '_' + name;
        this.grid.grid.stateRestore.state(name).remove(true);
        this.loadUserStates();
      }
    }
  }, {
    key: "renameStateDialog",
    value: function renameStateDialog(name) {
      this.renameDialog.dialog = new Dialog();
      this.renameDialog.dialog.title = translations.PREVIEW;
      this.renameDialog.dialog.enableCancelButton();
      this.renameDialog.dialog.enableConfirmButton("window['".concat(this.grid.id, "'].stateRestore.processRenameStateDialog('").concat(name, "')"));
      this.renameDialog.dialog.content = "<div class=\"form-group\"><div class=\"form-input-group col-md-12\"><label for=\"Name\">".concat(translations.NAME, "</label><input type=\"text\" name=\"tmpName\" class=\"form-control\"></div></div>");
      this.renameDialog.dialog.show();
    }
  }, {
    key: "processRenameStateDialog",
    value: function processRenameStateDialog(name) {
      var newName = $('[name="tmpName"]').val();
      if (!this.isStateExist(newName)) {
        this.renameState(name, newName);
        this.renameDialog.dialog.close();
        this.renameDialog.dialog = null;
      } else {
        alert(translations.NAME_ALREADY_EXIST);
      }
    }
  }, {
    key: "renameState",
    value: function renameState(name, newName) {
      if (this.grid.params.presetSaveType === 'serverside') {
        this.renameServersideState(name, newName);
      }
      name = 'USR' + this.userID + '_' + name;
      newName = 'USR' + this.userID + '_' + newName;
      this.grid.grid.stateRestore.state(name).rename(newName);
      this.loadUserStates();
    }
  }, {
    key: "isStateExist",
    value: function isStateExist(name) {
      var exist = false;
      this.userStates.forEach(function (state, i) {
        if (state.Name === name) exist = true;
      });
      return exist;
    }
  }, {
    key: "getState",
    value: function getState(presetName) {
      var state;
      Helpers.ajax({
        url: basePath + '/' + this.grid.params.presetServersideUrl + '/get',
        async: false,
        data: {
          URL: window.location.pathname,
          GridName: this.grid.id,
          UserID: this.userID,
          PresetName: presetName
        },
        success: function success(data) {
          if (data) state = JSON.parse(data);else state = null;
        }
      });
      return state;
    }
  }, {
    key: "getStates",
    value: function getStates() {
      var states;
      Helpers.ajax({
        url: basePath + '/' + this.grid.params.presetServersideUrl + '/get',
        async: false,
        data: {
          URL: window.location.pathname,
          GridName: this.grid.id,
          UserID: this.userID,
          All: true
        },
        success: function success(data) {
          if (data) states = JSON.parse(data);else states = null;
        }
      });
      return states;
    }
  }, {
    key: "deleteState",
    value: function deleteState(presetName) {
      Helpers.ajax({
        url: basePath + '/' + this.grid.params.presetServersideUrl + '/delete',
        data: {
          URL: window.location.pathname,
          GridName: this.grid.id,
          UserID: this.userID,
          PresetName: presetName
        },
        success: function success(data) {}
      });
    }
  }, {
    key: "saveState",
    value: function saveState(presetName, data) {
      Helpers.ajax({
        url: basePath + '/' + this.grid.params.presetServersideUrl + '/save',
        data: {
          URL: window.location.pathname,
          GridName: this.grid.id,
          UserID: this.userID,
          PresetName: presetName,
          Data: data
        },
        success: function success(data) {}
      });
    }
  }, {
    key: "renameServersideState",
    value: function renameServersideState(oldPresetName, newPresetName) {
      Helpers.ajax({
        url: basePath + '/' + this.grid.params.presetServersideUrl + '/rename',
        data: {
          URL: window.location.pathname,
          GridName: this.grid.id,
          UserID: this.userID,
          OldPresetName: oldPresetName,
          NewPresetName: newPresetName
        },
        success: function success(data) {}
      });
    }
  }]);
}();
//# sourceMappingURL=StateRestore.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Iterator = /*#__PURE__*/function () {
  function Iterator() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var startRelativeIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var totalLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var url = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
      params: [],
      url: null
    };
    _classCallCheck(this, Iterator);
    this.url = url;
    this.items = [];
    this.startIndex = startRelativeIndex;
    this.offset = offset;
    this.currentIndex = this.startIndex + this.offset;
    this.totalLength = totalLength !== null && totalLength !== void 0 ? totalLength : this.items.length;
    this.lockScreenOnAjax = false;
    this.initItems(items);
  }
  return _createClass(Iterator, [{
    key: "setItems",
    value: function setItems(items) {
      var totalLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      this.totalLength = totalLength !== null && totalLength !== void 0 ? totalLength : items.length;
      this.offset = offset;
      this.initItems(items);
      return this;
    }
  }, {
    key: "setCurrentIndex",
    value: function setCurrentIndex(index) {
      if (index < 0 && index >= this.totalLength) return false;
      this.currentIndex = index;
      if (this.url.url) {
        this.getData();
      }
      return true;
    }
  }, {
    key: "appendItems",
    value: function appendItems(items) {
      var _this = this;
      items.forEach(function (item, index) {
        _this.items[index + _this.items.length] = item;
      });
      if (this.items.length > this.totalLength) {
        this.totalLength = this.items.length;
      }
      return this;
    }
  }, {
    key: "prependItems",
    value: function prependItems(items) {
      var _this2 = this;
      this.offset -= items.length;
      if (this.offset < 0) {
        this.items.forEach(function (item, index) {
          _this2.items[index + Math.abs(_this2.offset)] = item;
        });
        this.offset = 0;
        this.totalLength += Math.abs(this.offset);
        this.currentIndex += Math.abs(this.offset);
      }
      items.forEach(function (item, index) {
        _this2.items[index + _this2.offset] = item;
      });
      return this;
    }
  }, {
    key: "getAbsoluteIndex",
    value: function getAbsoluteIndex() {
      return this.currentIndex;
    }
  }, {
    key: "getRelativeIndex",
    value: function getRelativeIndex() {
      return this.currentIndex - this.offset;
    }
  }, {
    key: "initItems",
    value: function initItems(items) {
      var _this3 = this;
      this.items = [];
      items.forEach(function (item, index) {
        _this3.items[index + _this3.offset] = item;
      });
    }
  }, {
    key: "next",
    value: function next() {
      this.currentIndex++;
      if (!Object.keys(this.items).includes(this.currentIndex.toString()) && this.currentIndex < this.totalLength) {
        if (this.url.url) this.getNextData();else return false;
      } else if (!Object.keys(this.items).includes(this.currentIndex.toString())) return false;
      return this.items[this.currentIndex];
    }
  }, {
    key: "prev",
    value: function prev() {
      this.currentIndex--;
      if (!Object.keys(this.items).includes(this.currentIndex.toString()) && this.currentIndex >= 0) {
        if (this.url.url) this.getPrevData();else return false;
      } else if (!Object.keys(this.items).includes(this.currentIndex.toString())) return false;
      return this.items[this.currentIndex];
    }
  }, {
    key: "current",
    value: function current() {
      if (!Object.keys(this.items).includes(this.currentIndex.toString())) return false;
      return this.items[this.currentIndex];
    }
  }, {
    key: "getNextData",
    value: function getNextData() {
      var _this4 = this;
      this.url.params.start = this.getItemsLastIndex() + 1;
      if (this.url.params.start >= this.totalLength) this.url.params.start = this.totalLength;
      var ajax = Helpers.ajax({
        url: this.url.url,
        data: this.url.params,
        async: false,
        success: function success(data) {
          data = JSON.parse(data);
          var items = data.items.map(function (item) {
            return item.ID;
          });
          _this4.appendItems(items);
        }
      }, this.lockScreenOnAjax);
      return ajax;
    }
  }, {
    key: "getData",
    value: function getData() {
      var _this5 = this;
      this.url.params.start = this.currentIndex - this.url.params.count / 2;
      if (this.url.params.start < 0) this.url.params.start = 0;
      var ajax = Helpers.ajax({
        url: this.url.url,
        data: this.url.params,
        async: false,
        success: function success(data) {
          data = JSON.parse(data);
          var items = data.items.map(function (item) {
            return item.ID;
          });
          _this5.setItems(items, _this5.totalLength, _this5.url.params.start);
        }
      }, this.lockScreenOnAjax);
      return ajax;
    }
  }, {
    key: "getPrevData",
    value: function getPrevData() {
      var _this6 = this;
      this.url.params.start = this.offset - this.url.params.count;
      if (this.url.params.start < 0) this.url.params.start = 0;
      var ajax = Helpers.ajax({
        url: this.url.url,
        data: this.url.params,
        async: false,
        success: function success(data) {
          data = JSON.parse(data);
          var items = data.items.map(function (item) {
            return item.ID;
          });
          _this6.prependItems(items);
        }
      }, this.lockScreenOnAjax);
      return ajax;
    }
  }, {
    key: "getItemsLastIndex",
    value: function getItemsLastIndex() {
      return parseInt(Object.keys(this.items)[Object.keys(this.items).length - 1]);
    }
  }, {
    key: "getItemsFirstIndex",
    value: function getItemsFirstIndex() {
      return parseInt(Object.keys(this.items)[0]);
    }
  }, {
    key: "hasNext",
    value: function hasNext() {
      var nextIndex = this.currentIndex + 1;
      if (!Object.keys(this.items).includes(nextIndex.toString()) && nextIndex < this.totalLength) {
        return true;
      } else if (!Object.keys(this.items).includes(nextIndex.toString())) return false;
      return true;
    }
  }, {
    key: "hasPrev",
    value: function hasPrev() {
      var prevIndex = this.currentIndex - 1;
      if (!Object.keys(this.items).includes(prevIndex.toString()) && prevIndex >= 0) {
        return true;
      } else if (!Object.keys(this.items).includes(prevIndex.toString())) return false;
      return true;
    }
  }]);
}();
//# sourceMappingURL=Iterator.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Input = /*#__PURE__*/function () {
  function Input(element) {
    var form = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _classCallCheck(this, Input);
    this.element = element;
    this.$element;
    this.name;
    this.form = form;
    this.validators = [];
    this.init();
  }
  return _createClass(Input, [{
    key: "init",
    value: function init() {
      var _this$$element$data;
      this.$element = $(this.element);
      this.name = this.$element.attr('name');
      this.validators = (_this$$element$data = this.$element.data('validator')) !== null && _this$$element$data !== void 0 ? _this$$element$data : [];
      this.element.input = this;
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {}
  }, {
    key: "disableValidator",
    value: function disableValidator(validatorType) {
      this.setValidatorEnabled(validatorType, false);
      return this;
    }
  }, {
    key: "enableValidator",
    value: function enableValidator(validatorType) {
      this.setValidatorEnabled(validatorType, true);
      return this;
    }
  }, {
    key: "setValidatorEnabled",
    value: function setValidatorEnabled(validatorType, enabled) {
      this.validators.forEach(function (validator, index) {
        validator.enabled = enabled;
      });
      this.$element.data('validator', this.validators);
      if (this.form) this.form.validate(this.$element);
      return this;
    }
  }, {
    key: "setRequired",
    value: function setRequired() {
      var required = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (this.hasValidator(Form.VALIDATOR_REQUIRED)) this.setValidatorEnabled(Form.VALIDATOR_REQUIRED, required);else this.addRule(Form.VALIDATOR_REQUIRED, translations.FIELD_REQUIRED);
      if (required) this.$element.closest('[id*="_group"]').find('.required-char').removeClass('d-none');else this.$element.closest('[id*="_group"]').find('.required-char').addClass('d-none');
      return this;
    }
  }, {
    key: "hasValidator",
    value: function hasValidator(validatorType) {
      var hasValidator = false;
      this.validators.forEach(function (validator, index) {
        if (validator.v === validatorType) hasValidator = true;
      });
      return hasValidator;
    }
  }, {
    key: "addRule",
    value: function addRule(validator, message) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      this.validators.push({
        'v': validator,
        'm': message,
        'p': params
      });
      this.$element.data('validator', this.validators);
      if (this.form) this.form.validate(this.$element);
      return this;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      return this.$element.val();
    }
  }, {
    key: "setValue",
    value: function setValue(val) {
      this.$element.val(val);
      return this;
    }
  }, {
    key: "setReadonly",
    value: function setReadonly() {
      var readonly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (readonly) {
        this.$element.attr('readonly', 'readonly');
        this.$element.closest('.form-input-group').addClass('readonly');
      } else {
        this.$element.removeAttr('readonly');
        this.$element.closest('.form-input-group').removeClass('readonly');
      }
    }
  }]);
}();
//# sourceMappingURL=Input.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var Select = /*#__PURE__*/function (_Input) {
  function Select(element) {
    var form = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _classCallCheck(this, Select);
    return _callSuper(this, Select, [element, form]);
  }
  _inherits(Select, _Input);
  return _createClass(Select, [{
    key: "addOption",
    value: function addOption(text, value) {
      var defaultSelected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var selected = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var option = new Option(text, value, defaultSelected, selected);
      this.$element.append(option);
      if (selected) this.triggerChange();
      return this;
    }
  }, {
    key: "triggerChange",
    value: function triggerChange() {
      this.$element.trigger('change');
      return this;
    }
  }, {
    key: "setValue",
    value: function setValue(val) {
      this.$element.val(val).trigger('change');
      return this;
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      return this.$element.find("option");
    }
  }, {
    key: "getOption",
    value: function getOption(value) {
      return this.$element.find("option[value='" + value + "']");
    }
  }, {
    key: "removeOption",
    value: function removeOption(value) {
      var option = this.getOption(value);
      option.remove();
      if (option.attr('selected') === 'selected') this.triggerChange();
      return this;
    }
  }]);
}(Input);
//# sourceMappingURL=Select.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var Radio = /*#__PURE__*/function (_Input) {
  function Radio(element) {
    var _this;
    var form = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _classCallCheck(this, Radio);
    _this = _callSuper(this, Radio, [element, form]);
    _this.rootElement = _this.$element.closest('[id*="_group"]').find('div');
    _this.onChange = null;
    _this.bindEvents();
    return _this;
  }
  _inherits(Radio, _Input);
  return _createClass(Radio, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      this.rootElement.find('input[type="radio"]').on('change', function (e) {
        if (_this2.onChange) _this2.onChange(e, _this2);
      });
    }
  }, {
    key: "addOption",
    value: function addOption(label, value) {
      var newOption = "\n            <label class=\"radiobox\">\n                <input type=\"radio\" name=\"".concat(this.name, "\" value=\"").concat(value, "\">\n                <span class=\"checkmark\"></span><span>").concat(label, "</span>\n            </label>\n        ");
      this.rootElement.append(newOption);
      return this;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      var checked = this.rootElement.find('input[type="radio"]:checked');
      if (checked.length === 0) return null;
      return checked.val();
    }
  }, {
    key: "setValue",
    value: function setValue(val) {
      this.checkByValue(val);
      return this;
    }
  }, {
    key: "checkByValue",
    value: function checkByValue(value) {
      this.rootElement.find('input[type="radio"][value="' + value + '"]').prop('checked', true);
      return this;
    }
  }]);
}(Input);
//# sourceMappingURL=Radio.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SelectAjax = /*#__PURE__*/function (_Select) {
  function SelectAjax(element) {
    var _this;
    var form = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _classCallCheck(this, SelectAjax);
    _this = _callSuper(this, SelectAjax, [element, form]);
    _defineProperty(_this, "getUrlParameter", function (param) {
      return this.storeParams[param];
    });
    _this.storeUrl = _this.$element.data('store');
    _this.storeField = _this.$element.data('storefield');
    _this.storeParams = _this.$element.data('storeparams');
    _this.storeDepends = _this.$element.data('storedepends');
    _this.editable = typeof _this.$element.data('editable') !== 'undefined' && _this.$element.data('editable') === true;
    _this.ajaxInit();
    return _this;
  }
  _inherits(SelectAjax, _Select);
  return _createClass(SelectAjax, [{
    key: "ajaxInit",
    value: function ajaxInit() {
      var _this2 = this;
      this.initOldFunctions();
      if (typeof this.storeDepends !== 'undefined' && this.form) {
        $(this.form.form).find('[name="' + this.storeDepends + '"]').on('change', function (event) {
          var target = $(event.target);
          if (target.val() === '' || target.val() === null || target.val() === 'null') {
            _this2.$element.html("<option value=\"null\">-</option>");
            _this2.$element.trigger('change');
          } else {
            _this2.storeParams[_this2.storeDepends] = target.val();
            Helpers.ajax({
              url: _this2.storeUrl,
              data: Object.assign({}, _this2.storeParams)
            }).then(function (data) {
              if (typeof data === 'string') data = JSON.parse(data);
              data = data.items;
              if (_this2.$element.attr('data-select-first')) {
                _this2.$element.html("");
              } else {
                _this2.$element.html("<option value=\"null\">-</option>");
              }
              var val = null;
              if (_this2.getValue() !== 'null') val = _this2.getValue();
              if (val == null && _this2.form.id.includes('entityeditor')) val = window[_this2.form.id].data[_this2.$element.attr('name')];
              if (val == null && _this2.$element.attr('data-select-first') && data.length > 0) val = data[0].ID;
              for (var c in data) {
                if (_typeof(data[c]) === 'object') {
                  var option = "<option value=\"".concat(data[c].ID, "\" ").concat(data[c].ID == val ? 'selected' : '', ">").concat(data[c][_this2.storeField], "</option>");
                  _this2.$element.append(option);
                }
              }
              _this2.$element.trigger('change');
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
  }, {
    key: "initOldFunctions",
    value: function initOldFunctions() {
      var _this3 = this;
      this.element.setUrlParameter = function () {
        _this3.setUrlParameter.apply(_this3);
      };
      this.element.unsetUrlParameter = function () {
        _this3.unsetUrlParameter.apply(_this3);
      };
      this.element.getUrlParameter = function () {
        _this3.getUrlParameter.apply(_this3);
      };
      this.element.refresh = function () {
        _this3.refresh.apply(_this3);
      };
      this.element.refreshThis = function () {
        _this3.refreshThis.apply(_this3);
      };
    }
  }, {
    key: "setUrlParameter",
    value: function setUrlParameter(param, value) {
      this.storeParams[param] = value;
      $(this).data('storeparams', this.storeParams);
      return this;
    }
  }, {
    key: "unsetUrlParameter",
    value: function unsetUrlParameter(param) {
      delete this.storeParams[param];
      $(this).data('storeparams', this.storeParams);
      return this;
    }
  }, {
    key: "refresh",
    value: function refresh() {
      $(this).closest('form').find('[name="' + this.storeDepends + '"]').trigger('change');
    }
  }, {
    key: "refreshThis",
    value: function refreshThis() {
      var _this4 = this;
      Helpers.ajax({
        url: this.storeUrl,
        data: Object.assign({}, this.storeParams)
      }).then(function (data) {
        console.log(data);
        data = JSON.parse(data).items;
        _this4.$element.html("<option value=\"null\">-</option>");
        var val = null;
        if (_this4.getValue() !== 'null') val = _this4.getValue();
        if (_this4.form && val == null && _this4.form.form.id.includes('entityeditor')) val = window[_this4.form.form.id].data[_this4.$element.attr('name')];
        for (var c in data) {
          if (_typeof(data[c]) === 'object') {
            var option = "<option value=\"".concat(data[c].ID, "\" ").concat(data[c].ID == val ? 'selected' : '', ">").concat(data[c][_this4.storeField], "</option>");
            _this4.$element.append(option);
          }
        }
        _this4.$element.trigger('change');
      });
    }
  }]);
}(Select);
//# sourceMappingURL=SelectAjax.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var Checkbox = /*#__PURE__*/function (_Input) {
  function Checkbox(element) {
    var form = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _classCallCheck(this, Checkbox);
    return _callSuper(this, Checkbox, [element, form]);
  }
  _inherits(Checkbox, _Input);
  return _createClass(Checkbox, [{
    key: "check",
    value: function check() {
      this.setValue(true);
      return this;
    }
  }, {
    key: "uncheck",
    value: function uncheck() {
      this.setValue(false);
      return this;
    }
  }, {
    key: "setValue",
    value: function setValue(val) {
      this.$element.prop('checked', Boolean(val));
      return this;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      return this.$element.prop('checked');
    }
  }]);
}(Input);
//# sourceMappingURL=Checkbox.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var DateBox = /*#__PURE__*/function (_Input) {
  function DateBox(element) {
    var form = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _classCallCheck(this, DateBox);
    return _callSuper(this, DateBox, [element, form]);
  }
  _inherits(DateBox, _Input);
  return _createClass(DateBox, [{
    key: "setValue",
    value: function setValue(date) {
      this.getDateTimeObject().date(date);
      return this;
    }
  }, {
    key: "getDateTimeObject",
    value: function getDateTimeObject() {
      return this.$element.data("DateTimePicker");
    }
  }, {
    key: "getValueDateObject",
    value: function getValueDateObject() {
      this.getDateTimeObject().viewDate();
    }
  }, {
    key: "getFormatedDate",
    value: function getFormatedDate() {
      var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'YYYY-MM-DD';
      return this.getValueDateObject().format(format);
    }
  }]);
}(Input);
//# sourceMappingURL=DateBox.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var DateTimeBox = /*#__PURE__*/function (_DateBox) {
  function DateTimeBox(element) {
    var form = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _classCallCheck(this, DateTimeBox);
    return _callSuper(this, DateTimeBox, [element, form]);
  }
  _inherits(DateTimeBox, _DateBox);
  return _createClass(DateTimeBox, [{
    key: "getFormatedDate",
    value: function getFormatedDate() {
      var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'YYYY-MM-DD H:mm:ss';
      return this.getValueDateObject().format(format);
    }
  }]);
}(DateBox);
//# sourceMappingURL=DateTimeBox.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var BlockEditor = /*#__PURE__*/function (_Input) {
  function BlockEditor(element) {
    var form = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _classCallCheck(this, BlockEditor);
    return _callSuper(this, BlockEditor, [element, form]);
  }
  _inherits(BlockEditor, _Input);
  return _createClass(BlockEditor, [{
    key: "init",
    value: function init() {
      var _this$$element$parent;
      _superPropGet(BlockEditor, "init", this, 3)([]);
      this.name = this.$element.parent().attr('name');
      this.editor = null;
      this.dataInputName = this.$element.parent().attr('blockeditordata');
      this.dataInput = this.form.getInputObject(this.dataInputName);
      this.dynamic = (_this$$element$parent = this.$element.parent().attr('dynamic')) !== null && _this$$element$parent !== void 0 ? _this$$element$parent : false;
      this.dynamicNamesSelect = this.form.getInputObject(this.name + '_names');
      this.initGrapes();
    }
  }, {
    key: "initGrapes",
    value: function initGrapes() {
      var _this = this;
      var reinit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (this.editor && !reinit) return;else {
        if (this.editor) {
          this.editor.destroy();
          this.editor = null;
        }
      }
      this.editor = grapesjs.init({
        container: this.element,
        storageManager: {
          type: 'null'
        },
        fromElement: true,
        height: '600px',
        storeComponents: false,
        noticeOnUnload: false,
        canvas: {
          styles: ["https://fonts.googleapis.com/css2?family=Nunito+Sans&display=swap", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css", basePath + "/front/css/libs.min.css", basePath + "/front/css/style.min.css", basePath + "/css/web/customicons.css"],
          scripts: ["https://code.jquery.com/jquery-3.3.1.slim.min.js", "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"]
        },
        assetManager: {
          custom: true
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
            list: [{
              value: 'none',
              className: 'fa fa-times'
            }, {
              value: 'left',
              className: 'fa fa-align-left'
            }, {
              value: 'right',
              className: 'fa fa-align-right'
            }]
          }, {
            property: 'position',
            type: 'select'
          }]
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
            toRequire: 1
          }, {
            property: 'margin',
            properties: [{
              name: 'Top',
              property: 'margin-top'
            }, {
              name: 'Right',
              property: 'margin-right'
            }, {
              name: 'Bottom',
              property: 'margin-bottom'
            }, {
              name: 'Left',
              property: 'margin-left'
            }]
          }, {
            property: 'padding',
            properties: [{
              name: 'Top',
              property: 'padding-top'
            }, {
              name: 'Right',
              property: 'padding-right'
            }, {
              name: 'Bottom',
              property: 'padding-bottom'
            }, {
              name: 'Left',
              property: 'padding-left'
            }]
          }]
        }, {
          name: 'Typography',
          open: false,
          buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'],
          properties: [{
            name: 'Font',
            property: 'font-family'
          }, {
            name: 'Weight',
            property: 'font-weight'
          }, {
            name: 'Font color',
            property: 'color'
          }, {
            property: 'text-align',
            type: 'radio',
            defaults: 'left',
            list: [{
              value: 'left',
              name: 'Left',
              className: 'fa fa-align-left'
            }, {
              value: 'center',
              name: 'Center',
              className: 'fa fa-align-center'
            }, {
              value: 'right',
              name: 'Right',
              className: 'fa fa-align-right'
            }, {
              value: 'justify',
              name: 'Justify',
              className: 'fa fa-align-justify'
            }]
          }, {
            property: 'text-decoration',
            type: 'radio',
            defaults: 'none',
            list: [{
              value: 'none',
              name: 'None',
              className: 'fa fa-times'
            }, {
              value: 'underline',
              name: 'underline',
              className: 'fa fa-underline'
            }, {
              value: 'line-through',
              name: 'Line-through',
              className: 'fa fa-strikethrough'
            }]
          }, {
            property: 'text-shadow',
            properties: [{
              name: 'X position',
              property: 'text-shadow-h'
            }, {
              name: 'Y position',
              property: 'text-shadow-v'
            }, {
              name: 'Blur',
              property: 'text-shadow-blur'
            }, {
              name: 'Color',
              property: 'text-shadow-color'
            }]
          }]
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
            min: 0
          }, {
            property: 'border-radius',
            properties: [{
              name: 'Top',
              property: 'border-top-left-radius'
            }, {
              name: 'Right',
              property: 'border-top-right-radius'
            }, {
              name: 'Bottom',
              property: 'border-bottom-left-radius'
            }, {
              name: 'Left',
              property: 'border-bottom-right-radius'
            }]
          }, {
            property: 'box-shadow',
            properties: [{
              name: 'X position',
              property: 'box-shadow-h'
            }, {
              name: 'Y position',
              property: 'box-shadow-v'
            }, {
              name: 'Blur',
              property: 'box-shadow-blur'
            }, {
              name: 'Spread',
              property: 'box-shadow-spread'
            }, {
              name: 'Color',
              property: 'box-shadow-color'
            }, {
              name: 'Shadow type',
              property: 'box-shadow-type'
            }]
          }, {
            id: 'background-bg',
            property: 'background',
            type: 'bg'
          }]
        }, {
          name: 'Extra',
          open: false,
          buildProps: ['transition', 'perspective', 'transform'],
          properties: [{
            property: 'transition',
            properties: [{
              name: 'Property',
              property: 'transition-property'
            }, {
              name: 'Duration',
              property: 'transition-duration'
            }, {
              name: 'Easing',
              property: 'transition-timing-function'
            }]
          }, {
            property: 'transform',
            properties: [{
              name: 'Rotate X',
              property: 'transform-rotate-x'
            }, {
              name: 'Rotate Y',
              property: 'transform-rotate-y'
            }, {
              name: 'Rotate Z',
              property: 'transform-rotate-z'
            }, {
              name: 'Scale X',
              property: 'transform-scale-x'
            }, {
              name: 'Scale Y',
              property: 'transform-scale-y'
            }, {
              name: 'Scale Z',
              property: 'transform-scale-z'
            }]
          }]
        }, {
          name: 'Flex',
          open: false,
          properties: [{
            name: 'Flex Container',
            property: 'display',
            type: 'select',
            defaults: 'block',
            list: [{
              value: 'block',
              name: 'Disable'
            }, {
              value: 'flex',
              name: 'Enable'
            }]
          }, {
            name: 'Flex Parent',
            property: 'label-parent-flex',
            type: 'integer'
          }, {
            name: 'Direction',
            property: 'flex-direction',
            type: 'radio',
            defaults: 'row',
            list: [{
              value: 'row',
              name: 'Row',
              className: 'icons-flex icon-dir-row',
              title: 'Row'
            }, {
              value: 'row-reverse',
              name: 'Row reverse',
              className: 'icons-flex icon-dir-row-rev',
              title: 'Row reverse'
            }, {
              value: 'column',
              name: 'Column',
              title: 'Column',
              className: 'icons-flex icon-dir-col'
            }, {
              value: 'column-reverse',
              name: 'Column reverse',
              title: 'Column reverse',
              className: 'icons-flex icon-dir-col-rev'
            }]
          }, {
            name: 'Justify',
            property: 'justify-content',
            type: 'radio',
            defaults: 'flex-start',
            list: [{
              value: 'flex-start',
              className: 'icons-flex icon-just-start',
              title: 'Start'
            }, {
              value: 'flex-end',
              title: 'End',
              className: 'icons-flex icon-just-end'
            }, {
              value: 'space-between',
              title: 'Space between',
              className: 'icons-flex icon-just-sp-bet'
            }, {
              value: 'space-around',
              title: 'Space around',
              className: 'icons-flex icon-just-sp-ar'
            }, {
              value: 'center',
              title: 'Center',
              className: 'icons-flex icon-just-sp-cent'
            }]
          }, {
            name: 'Align',
            property: 'align-items',
            type: 'radio',
            defaults: 'center',
            list: [{
              value: 'flex-start',
              title: 'Start',
              className: 'icons-flex icon-al-start'
            }, {
              value: 'flex-end',
              title: 'End',
              className: 'icons-flex icon-al-end'
            }, {
              value: 'stretch',
              title: 'Stretch',
              className: 'icons-flex icon-al-str'
            }, {
              value: 'center',
              title: 'Center',
              className: 'icons-flex icon-al-center'
            }]
          }, {
            name: 'Flex Children',
            property: 'label-parent-flex',
            type: 'integer'
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
              defaults: 'auto'
            }]
          }, {
            name: 'Align',
            property: 'align-self',
            type: 'radio',
            defaults: 'auto',
            list: [{
              value: 'auto',
              name: 'Auto'
            }, {
              value: 'flex-start',
              title: 'Start',
              className: 'icons-flex icon-al-start'
            }, {
              value: 'flex-end',
              title: 'End',
              className: 'icons-flex icon-al-end'
            }, {
              value: 'stretch',
              title: 'Stretch',
              className: 'icons-flex icon-al-str'
            }, {
              value: 'center',
              title: 'Center',
              className: 'icons-flex icon-al-center'
            }]
          }]
        }]
      });
      if ($(this.editor.getEl()).parent().hasClass('block-editor')) {
        if (this.dynamic) {
          this.dynamicNamesSelect.$element.on('change', function (e) {
            var val = $(e.currentTarget).val();
            _this.dataInputName = val;
            _this.dataInput = _this.form.getInputObject(val);
            _this.$element.parent().attr('blockeditordata', val);
            _this.loadDataFromDataInput();
          });
        }
        if (typeof this.dataInputName !== 'undefined' && this.dataInputName) {
          this.editor.on('update', function () {
            _this.dataInput.setValue(JSON.stringify({
              html: BlockEditor.getModifiedGrapesHTML(_this.editor.storeData().html),
              css: _this.editor.storeData().css
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
          this.editor.on('load', function () {
            if (_this.dataInput.getValue() !== '') {
              _this.loadDataFromDataInput();
            } else {
              _this.editor.loadData({
                html: '<div class="editor-container container"></div>'
              });
            }
            $(_this.editor.getEl()).find('iframe')[0].contentWindow.$('head').append("<style>.editor-container[data-gjs-type] { min-height: 100vh; padding-bottom: 30px; }</style>");
          });
          if (typeof window[this.name + '_addBlocks'] === 'function') {
            window[this.name + '_addBlocks'](this.editor);
          }
          this.editor.Panels.addButton('options', [{
            id: 'copy',
            className: 'far fa-copy icon-blank',
            command: function command(editor1, sender) {
              localStorage.setItem('grapesjs_copy', JSON.stringify({
                html: BlockEditor.getModifiedGrapesHTML(editor1.storeData().html),
                css: editor1.storeData().css
              }));
              alerts.alert(translations.COPY_TO_CLIPBOARD, 'info');
            },
            attributes: {
              title: translations.BLOCKEDITOR_CLIPBOARD_COPY
            }
          }]);
          this.editor.Panels.addButton('options', [{
            id: 'paste',
            className: 'fas fa-paste icon-blank',
            command: function command(editor1, sender) {
              var data = localStorage.getItem('grapesjs_copy');
              if (!data) {
                alerts.alert(translations.CLIPBOARD_IS_EMPTY, 'error');
                return;
              }
              var isConfirm = confirm(translations.BLOCKEDITOR_PASTE_CONFIRM);
              if (data && isConfirm) {
                data = JSON.parse(data);
                editor1.loadData(data);
              }
            },
            attributes: {
              title: translations.BLOCKEDITOR_CLIPBOARD_PASTE
            }
          }]);
          this.editor.Panels.addButton('options', [{
            id: 'file-manager',
            className: 'fas fa-folder-open',
            command: function command(editor1, sender) {
              var iframe = document.createElement('iframe');
              iframe.setAttribute('width', '100%');
              iframe.setAttribute('height', '500px');
              iframe.setAttribute('id', this.name + '_filemanager');
              iframe.setAttribute('class', '_blockeditor_filemanager');
              iframe.setAttribute('src', basePath + '/admin/file-manager/dialog.php?type=0&lang=cs&akey=KxrAjXPO5DihmPY7aUtqwBCed8OcvfYw&basePath=' + basePath + '/files/');
              var dialog = new Dialog();
              dialog.show();
              $('#dialog_' + dialog._uid).find('.modal-body').append(iframe);
            }
          }]);
          this.editor.DomComponents.getWrapper().set({
            droppable: false,
            selectable: false,
            hoverable: false
          });
          this.editor.DomComponents.addType('default', {
            model: {
              defaults: {
                draggable: false,
                // lze je umistovat dovnitr jinych bloku?
                removable: false,
                // muze byt odstranen?
                droppable: false,
                // lze umistit dovnitr jiny blok?
                selectable: false,
                hoverable: false
              }
            }
          });
          this.editor.DomComponents.addType('drop-inside', {
            //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
            isComponent: function isComponent(el) {
              return typeof el.classList !== 'undefined' ? Object.values(el.classList).includes('drop-inside') : false;
            },
            model: {
              defaults: {
                draggable: false,
                // lze je umistovat dovnitr jinych bloku?
                removable: false,
                // muze byt odstranen?
                droppable: true,
                // lze umistit dovnitr jiny blok?
                selectable: false,
                hoverable: false
              }
            }
          });
          this.editor.DomComponents.addType('editor-container', {
            //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
            isComponent: function isComponent(el) {
              return typeof el.classList !== 'undefined' ? Object.values(el.classList).includes('editor-container') : false;
            },
            model: {
              defaults: {
                draggable: false,
                // lze je umistovat dovnitr jinych bloku?
                removable: false,
                // muze byt odstranen?
                droppable: true,
                // lze umistit dovnitr jiny blok?
                selectable: true,
                hoverable: true
              }
            }
          });
          this.editor.DomComponents.addType('not-editable', {
            //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
            isComponent: function isComponent(el) {
              return typeof el.classList !== 'undefined' ? Object.values(el.classList).includes('not-editable') : false;
            },
            model: {
              defaults: {
                draggable: false,
                // lze je umistovat dovnitr jinych bloku?
                removable: false,
                // muze byt odstranen?
                droppable: false,
                // lze umistit dovnitr jiny blok?
                selectable: false,
                hoverable: false,
                highlightable: false
              }
            }
          });
          this.editor.on('run:core:open-layers', function () {
            return _this.editor.Layers.setRoot('.editor-container');
          });
          this.editor.on('asset:custom', function (props) {
            $('._blockeditor_filemanager').each(function (i, e) {
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
              var iframe = document.createElement('iframe');
              iframe.setAttribute('width', '100%');
              iframe.setAttribute('height', '500px');
              iframe.setAttribute('id', _this.name + '_filemanager');
              iframe.setAttribute('class', '_blockeditor_filemanager');
              iframe.setAttribute('src', basePath + '/admin/file-manager/dialog.php?type=1&lang=cs&akey=KxrAjXPO5DihmPY7aUtqwBCed8OcvfYw&basePath=' + basePath + '/files/');
              iframe.onload = function () {
                iframe.contentWindow.apply_any = function (e) {
                  console.log(e);
                  var asset = props.am.add(e);
                  props.select(asset);
                  props.close();
                };
              };
              if (!$('#' + _this.name + '_filemanager')[0]) $(props.container).append(iframe);
            }
          });

          // pridani inline stylu pro link a zmenu barvy
          var rte = this.editor.RichTextEditor;
          rte.add('link', {
            icon: '<i class="fa fa-chain"></i>',
            attributes: {
              title: 'Link'
            },
            // Example on it's easy to wrap a selected content
            result: function result(rte) {
              return rte.insertHTML("<a href=\"#\">".concat(rte.selection(), "</a>"));
            }
          });
          rte.add('text-color', {
            icon: "<select class=\"gjs-field\">\n                            <option>Bez barvy</option>\n                            <option value=\"text-primary\">Prim\xE1rn\xED</option>\n                            <option value=\"text-success\">Pozitivn\xED</option>\n                            <option value=\"text-danger\">Negativn\xED</option>\n                            <option value=\"text-warning\">Varov\xE1n\xED</option>\n                          </select>",
            // Bind the 'result' on 'change' listener
            event: 'change',
            result: function result(rte, action) {
              var value = action.btn.firstChild.value;
              if (value != 'Bez barvy') {
                // value is a string
                rte.insertHTML("<span class=\"".concat(value, "\">").concat(rte.selection(), "</span>"));
              } else {
                rte.insertHTML("".concat(rte.selection()));
              }
            }
          });
        }
      }
      this.initCodeEditor();
    }
  }, {
    key: "initCodeEditor",
    value: function initCodeEditor() {
      var _this2 = this;
      this.editor.on('load', function () {
        var body = _this2.editor.Canvas.getDocument().body;
        body.style.overflow = 'auto';
      });
      this.editor.on('load', function () {
        _this2.editor.Panels.addButton('options', {
          id: 'edit-code',
          className: 'fa fa-code',
          command: 'open-code-editor',
          attributes: {
            title: 'Edit Source Code'
          }
        });
        _this2.editor.Commands.add('open-code-editor', {
          run: function run(editor) {
            var html = BlockEditor.formatHTML(editor.getHtml());
            var css = BlockEditor.formatCSS(editor.getCss());
            BlockEditor.codeEditorDialog = new Dialog();
            BlockEditor.codeEditorDialog.title = 'Source Code Editor';
            BlockEditor.codeEditorDialog.content = "\n\t\t\t\t<style>\n\t\t\t\t</style>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-md-7\"><textarea id=\"block-editor-code-editor-html\" style=\"width:100%;\" rows=\"15\">".concat(html, "</textarea></div>\n\t\t\t\t\t<div class=\"col-md-5\"><textarea id=\"block-editor-code-editor-css\" style=\"width:100%;\" rows=\"15\">").concat(css, "</textarea></div>\n\t\t\t\t</div>\n\t\t\t\t");
            BlockEditor.codeEditorDialog.enableConfirmButton('BlockEditor.saveEditorCode()');
            BlockEditor.codeEditorDialog.enableCancelButton();
            BlockEditor.codeEditorDialog.blockEditor = editor;
            BlockEditor.codeEditorDialog.show();
          }
        });
      });
    }
  }, {
    key: "loadDataFromDataInput",
    value: function loadDataFromDataInput() {
      try {
        this.editor.loadData(JSON.parse(this.dataInput.getValue()));
      } catch (_unused) {
        this.editor.loadData({
          html: '<div class="editor-container container"></div>'
        });
      }
    }
  }], [{
    key: "saveEditorCode",
    value: function saveEditorCode() {
      var updatedHtml = document.getElementById('block-editor-code-editor-html').value;
      var updatedCss = document.getElementById('block-editor-code-editor-css').value;
      if (updatedHtml && updatedCss) {
        BlockEditor.codeEditorDialog.close();
        BlockEditor.codeEditorDialog.blockEditor.loadData({
          html: updatedHtml,
          css: updatedCss
        });
        BlockEditor.codeEditorDialog = null;
      }
    }
  }, {
    key: "formatCSS",
    value: function formatCSS(css) {
      var rules = css.split(/(?<=})/).map(function (rule) {
        return rule.trim();
      }).filter(function (rule) {
        return rule;
      });
      return rules.map(function (rule) {
        var _rule$split = rule.split(/{/),
          _rule$split2 = _slicedToArray(_rule$split, 2),
          selector = _rule$split2[0],
          properties = _rule$split2[1];
        if (!properties) return '';
        var formattedProperties = properties.replace(/}/g, '').split(';').map(function (property) {
          return property.trim();
        }).filter(function (property) {
          return property;
        }).map(function (property) {
          return "    ".concat(property, ";");
        }).join('\n');
        return "".concat(selector.trim(), " {\n").concat(formattedProperties, "\n}");
      }).join('\n\n');
    }
  }, {
    key: "formatHTML",
    value: function formatHTML(html) {
      var indentChar = '  '; // Dvě mezery pro odsazení
      var indentLevel = 0;
      return html.replace(/>\s+</g, '><') // Odstranit mezery mezi tagy
      .split(/(<[^>]+>)/g) // Rozdělit podle HTML tagů
      .filter(function (part) {
        return part.trim();
      }) // Odstranit prázdné části
      .map(function (part) {
        if (part.match(/^<\/\w/)) {
          // Uzavírací tag snižuje odsazení
          indentLevel = Math.max(indentLevel - 1, 0); // Zabránit záporným hodnotám
        }
        var formattedPart = "".concat(indentChar.repeat(indentLevel)).concat(part);
        if (part.match(/^<\w[^>]*[^\/]>$/)) {
          // Otevírací tag zvyšuje odsazení, pokud není self-closing
          indentLevel++;
        }
        return formattedPart;
      }).join('\n'); // Spojit do čitelného formátu
    }
  }, {
    key: "getModifiedGrapesHTML",
    value: function getModifiedGrapesHTML(html) {
      html = html.replace(/\<\/div\>\<div\>\<br\/\>\<\/div\>\<div( alignment\=\"text\-left\")?[a-zA-Z0-9"= ]*\>/g, '<br/><br/>');
      return html.replace(/\<\/div\>\<div\>\<br\/\>\<\/div\>/g, '<br/><br/></div>');
    }
  }]);
}(Input);
_defineProperty(BlockEditor, "codeEditorDialog", null);
//# sourceMappingURL=BlockEditor.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Import = /*#__PURE__*/function () {
  function Import(uid) {
    var _this = this;
    _classCallCheck(this, Import);
    _defineProperty(this, "templateSelect2", function (item) {
      if (item.description) {
        return "<div class=\"".concat(item.important ? 'text-danger' : null, "\" title=\"").concat(item.description, "\" data-toggle=\"bstooltip\">").concat(item.text, "</div>");
      } else {
        return "<div class=\"".concat(item.important ? 'text-danger' : null, "\">").concat(item.text, "</div>");
      }
    });
    /**
     * Stáhne vybraný soubor z gridu
     */
    _defineProperty(this, "downloadFile", function () {
      var currentItem = _this.fileGrid.getCurrentItem();
      if (!currentItem) return;
      _this._download('downloadFile', currentItem.fileName);
    });
    /**
     * Smaže soubor z gridu
     */
    _defineProperty(this, "deleteFile", function () {
      var currentItem = _this.fileGrid.getCurrentItem();
      if (!currentItem) return;
      var currentFile = currentItem.fileName;
      var row = _this.fileGrid.getSelected();
      document.getElementById('hard-loader').classList.add('show');
      _this._runFunction('deleteFile', function (data) {
        _this.fileGrid.removeRow(row);
      }, function (err) {
        alerts.error();
        console.error(err);
      }, function () {
        document.getElementById('hard-loader').classList.remove('show');
      }, {
        'fileName': currentFile
      });
    });
    /**
     * Provede import
     * @param {Event} ev
     * @returns {boolean}
     */
    _defineProperty(this, "submit", function (ev) {
      ev.preventDefault();
      var selectedColumns = _this.getSelectedColumns();
      var columns = _this.getColumns();
      var downloadOutput = $(_this.element).find('button[data-download-output]');
      var missingImportant = [];
      for (var i in columns) {
        if (!columns[i].important) continue;
        if (!(Object.values(selectedColumns).indexOf(columns[i].id) > -1)) {
          var _columns$i$text;
          missingImportant.push((_columns$i$text = columns[i].text) !== null && _columns$i$text !== void 0 ? _columns$i$text : columns[i].id);
        }
      }
      if (missingImportant.length) {
        alerts.alert(translations.MISSING_IMPORTANT, 'error', missingImportant.join(', '));
        return false;
      }
      var data = {
        columns: selectedColumns,
        form: Object.fromEntries(new FormData(_this.form.form).entries())
      };
      _this._runFunction('importFile', function (successData, status, xhr) {
        var _xhr$getResponseHeade;
        if ((_xhr$getResponseHeade = xhr.getResponseHeader('Content-Disposition')) !== null && _xhr$getResponseHeade !== void 0 && _xhr$getResponseHeade.includes('attachment')) {
          var filename = "";
          var disposition = xhr.getResponseHeader('Content-Disposition');
          if (disposition) {
            var matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
            if (matches !== null && matches !== void 0 && matches[1]) filename = matches[1].replace(/['"]/g, '');
          }
          var _blob = new Blob([successData], {
            type: xhr.getResponseHeader('Content-Type') || 'application/zip'
          });
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(_blob);
          var a = document.createElement('a');
          a.href = downloadUrl;
          a.download = filename || 'export.zip';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
        } else {
          if (successData.msg) {
            var _successData$debug;
            alerts.alert(successData.msg, successData.error ? 'error' : 'info', (_successData$debug = successData.debug) !== null && _successData$debug !== void 0 ? _successData$debug : '');
            if (successData.trace) {
              var _successData$debug2;
              console.log((_successData$debug2 = successData.debug) !== null && _successData$debug2 !== void 0 ? _successData$debug2 : '-');
              console.table(successData.trace);
            }
          } else {
            console.info('DATA:', successData);
          }
          if (!successData.error && successData.outputFile) {
            console.log(successData.outputFile);
            _this.outputFile = successData.outputFile;
            downloadOutput.stop().show();
          } else {
            downloadOutput.stop().hide();
          }
        }
      }, function (err) {
        alerts.error();
        console.error(err);
        console.log(err.state());
      }, null, data, null, _this.getReturnBlob());
    });
    _defineProperty(this, "downloadOutputFile", function () {
      if (!_this.outputFile) return;
      _this._download('downloadOutputFile', _this.outputFile);
    });
    window["import_".concat(uid)] = this;
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
  return _createClass(Import, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      this.localStargeKey = 'importSelected[' + this.type + ']';
      this.fileGrid = window["import_" + this.id + '_datagrid'];
      this.form = window["import_" + this.id + '_form'];
      this.handleSelect();
      $(function () {
        _this2.bindEvents();
      });
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this3 = this;
      $(this.element).find('input#input_' + this.id).on('change', function (ev) {
        _this3.uploadFile(ev);
      });
      $(this.element).find('#list_' + this.id).on('click', function (ev) {
        _this3.showList();
      });
      $(this.element).find('.import__reset').on('click', function (ev) {
        _this3.resetSelected();
      });
      this.fileGrid.onDblClick = function (ev) {
        _this3.setSelected(_this3.fileGrid.getCurrentItemValue('fileName'));
      };
      $(this.element).on('submit', this.form.form, this.submit);
      $(this.element).on('click', "#import_".concat(this.id, "_submit"), this.submit);
      $(this.element).on('click', 'button[data-download-output]', this.downloadOutputFile);
    }
  }, {
    key: "bindSelected",
    value: function bindSelected() {
      var _translations$SELECT;
      plugins.initBsTooltip();
      $(this.element).find('.import__selected__item__data__table__select[data-data]').select2({
        width: '100%',
        allowClear: true,
        placeholder: (_translations$SELECT = translations.SELECT) !== null && _translations$SELECT !== void 0 ? _translations$SELECT : '-',
        escapeMarkup: function escapeMarkup(markup) {
          return markup;
        },
        templateResult: this.templateSelect2,
        templateSelection: this.templateSelect2
      }).on('select2:open', function () {
        setTimeout(function () {
          plugins.initBsTooltip();
        }, 0);
      }).on('select2:close', function () {
        plugins.initBsTooltip();
      });
      $(this.element).find('.import__selected__item__data__table__select[data-data]').each(function (ind, el) {
        $(el).val($(el).data('selected')).trigger('change');
      });

      // $(this.element).find('.import__selected__item__data__table__select[data-data]').on('change', (ev) => {
      //     console.log(this.getMapped());
      // });
    }
  }, {
    key: "uploadFile",
    value: function uploadFile(ev) {
      var _this4 = this,
        _this$handleUrl;
      var file = ev.currentTarget.files[0];
      var formdata = new FormData();
      formdata.append("file", file);
      formdata.append("type", this.getType());
      if (this.uploadAjax) {
        this.uploadAjax.abort();
        this.uploadAjax = null;
      }
      if (file === undefined) return;
      this._setProgress();
      this.uploadAjax = new XMLHttpRequest();
      this.uploadAjax.upload.addEventListener("progress", function (ev) {
        _this4.handleProgress(ev);
      }, false);
      this.uploadAjax.addEventListener("load", function (ev) {
        _this4.handleComplete(ev);
      }, false);
      this.uploadAjax.addEventListener("error", function (ev) {
        _this4.handleError(ev);
      }, false);
      this.uploadAjax.addEventListener("abort", function (ev) {
        _this4.handleAbort(ev);
      }, false);
      this.uploadAjax.open("POST", (_this$handleUrl = this.handleUrl) !== null && _this$handleUrl !== void 0 ? _this$handleUrl : "");
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
  }, {
    key: "_setProgress",
    value: function _setProgress() {
      var percent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0%';
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#00a34b';
      $(this.element).find('.import__progress').stop().slideDown(50);
      if (percent !== null) $(this.element).find('.import__progress').css('--percentage', percent);
      $(this.element).find('.import__progress').attr('data-status', status);
      $(this.element).find('.import__progress').css('--status-color', color);
    }
  }, {
    key: "_hideProgress",
    value: function _hideProgress() {
      $(this.element).find('.import__progress').stop().slideUp(500);
    }
  }, {
    key: "handleProgress",
    value: function handleProgress(ev) {
      clearTimeout(this.completeTimout);
      var percent = Math.round(ev.loaded / ev.total * 100);
      this._setProgress(percent, percent + '%');
    }
  }, {
    key: "handleComplete",
    value: function handleComplete(ev) {
      var _this5 = this;
      this.uploadAjax = null;
      clearTimeout(this.completeTimout);
      if (ev.currentTarget.status !== 200) {
        this.handleError(ev);
        return;
      }
      var data = JSON.parse(ev.target.responseText);
      this.completeTimout = setTimeout(function () {
        _this5.setSelected(data.filename);
        _this5.updateCount();
      }, 0);
    }
  }, {
    key: "handleError",
    value: function handleError() {
      clearTimeout(this.completeTimout);
      this._setProgress(null, translations.ERROR, '#c91313');
    }
  }, {
    key: "handleAbort",
    value: function handleAbort() {
      clearTimeout(this.completeTimout);
      this._setProgress(null, translations.ABORTED, '#c96513');
    }

    /**
     * Zobrazit/Skrýt uploader
     * @param {boolean|null} show
     * @returns {Import}
     */
  }, {
    key: "toggleUploader",
    value: function toggleUploader() {
      var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (show === null) {
        return this.toggleUploader($(this.element).find('.import__uploader').is(':visible'));
      }
      if (show === true) $(this.element).find('.import__uploader').stop().slideDown(150);else if (show === false) $(this.element).find('.import__uploader').stop().slideUp(150);
      this.updateCount();
      return this;
    }

    /**
     * Zobrazit/Skrýt zvolené
     * @param {boolean|null} show
     * @returns {Import}
     */
  }, {
    key: "toggleSelected",
    value: function toggleSelected() {
      var _this6 = this;
      var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (show === null) {
        return this.toggleSelected($(this.element).find('.import__selected').is(':visible'));
      }
      if (show === true) {
        $(this.element).find('button[data-download-output]').stop().hide();
        $(this.element).find('.import__selected').stop().slideDown(150);
        this._runFunction('generateDataTable', function (data) {
          $(_this6.element).find('.import__selected__item__data').html(data);
          _this6.bindSelected();
          if (typeof _this6.onAfterSelect === 'function') {
            _this6.onAfterSelect();
          }
        });
      } else if (show === false) {
        $(this.element).find('.import__selected').stop().slideUp(150, function () {
          if (typeof _this6.onAfterUnselect === 'function') {
            _this6.onAfterUnselect();
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
  }, {
    key: "toggleList",
    value: function toggleList() {
      var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (show === null) {
        return this.toggleList($(this.element).find('.import__list__file').is(':visible'));
      }
      if (show === true) {
        $(this.element).find('.import__list__file').stop().slideDown(150);
        this.onListOpen();
      } else if (show === false) $(this.element).find('.import__list__file').stop().slideUp(150);
      return this;
    }

    /**
     * Vrátí zvolený soubor
     * @returns {string}
     */
  }, {
    key: "getSelected",
    value: function getSelected() {
      return window.localStorage.getItem(this.localStargeKey);
    }

    /**
     * Nastaví zvolený soubor
     * @param {string|null} value
     * @returns {Import}
     */
  }, {
    key: "setSelected",
    value: function setSelected(value) {
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
  }, {
    key: "handleSelect",
    value: function handleSelect() {
      var selected = this.getSelected();
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
  }, {
    key: "resetSelected",
    value: function resetSelected() {
      return this.setSelected(null);
    }

    /**
     * Nastavuje unikátní typ
     * @param {string} type
     */
  }, {
    key: "setType",
    value: function setType(type) {
      this.type = type;
      return this;
    }

    /**
     * Vrací unikátní typ
     * @returns {null}
     */
  }, {
    key: "getType",
    value: function getType() {
      return this.type;
    }

    /**
     * Nastavuje handle URL
     * @param {string|null} handleUrl
     */
  }, {
    key: "setHandleUrl",
    value: function setHandleUrl(handleUrl) {
      this.handleUrl = handleUrl;
      return this;
    }

    /**
     * Vrací handle URL
     * @returns {string|null}
     */
  }, {
    key: "getHandleUrl",
    value: function getHandleUrl() {
      return this.handleUrl;
    }

    /**
     * Zobrazí seznam souboru
     */
  }, {
    key: "showList",
    value: function showList() {
      this.toggleUploader(false);
      this.toggleSelected(false);
      this.toggleList(true);
    }

    /**
     * Callback při otevření seznamu souborů
     */
  }, {
    key: "onListOpen",
    value: function onListOpen() {
      var _this7 = this;
      this.clearItems();
      this._runFunction('getFiles', function (data) {
        _this7.setItems(data);
      }, function () {
        _this7.resetSelected();
      });
    }

    /**
     * Načte soubory
     */
  }, {
    key: "refreshFiles",
    value: function refreshFiles() {
      var _this8 = this;
      this.clearItems();
      this._runFunction('getFiles', function (data) {
        _this8.setItems(data);
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
  }, {
    key: "_runFunction",
    value: function _runFunction(functionName, onSuccess, onError, onComplete) {
      var _this$handleUrl2;
      var data = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var customOptions = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
      var returnsBlob = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
      var _data = {
        'function': functionName,
        'fileName': this.getSelected(),
        'type': this.getType()
      };
      if (_typeof(data) === 'object') {
        _data = $.extend(_data, data);
      }
      var options = {
        url: (_this$handleUrl2 = this.handleUrl) !== null && _this$handleUrl2 !== void 0 ? _this$handleUrl2 : window.location.href,
        processData: false,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(_data),
        success: function success(data, status, xhr) {
          if (typeof onSuccess === "function") onSuccess(data, status, xhr);
        },
        error: function error(err) {
          if (typeof onError === "function") onError(err);
        },
        complete: function complete() {
          if (typeof onComplete === "function") onComplete();
        }
      };
      if (_typeof(customOptions) === 'object') {
        options = $.extend(options, customOptions);
      }

      // Nastavení pro binární data podle parametru returnsBlob
      if (returnsBlob) {
        options.xhrFields = {
          responseType: 'arraybuffer'
        };
      }
      if (this.ajaxes[functionName]) this.ajaxes[functionName].abort();
      this.ajaxes[functionName] = $.ajax(options);
    }

    /**
     * Vyčistí grid souborů
     */
  }, {
    key: "clearItems",
    value: function clearItems() {
      this.fileGrid.removeAll();
    }

    /**
     * Nastaví data gridu
     * @param {array|null} data
     */
  }, {
    key: "setItems",
    value: function setItems(data) {
      for (var i in data) {
        this.fileGrid.addRow(data[i]);
      }
      this.setCounter(data.length);
    }

    /**
     * Nastaví počet souborů
     * @param val
     */
  }, {
    key: "setCounter",
    value: function setCounter(val) {
      this.fileGrid.setCounter(val);
      $(this.element).find('.import__list__count').text(val);
    }

    /**
     * Aktualizovat počet souborů
     */
  }, {
    key: "updateCount",
    value: function updateCount() {
      var _this9 = this;
      this._runFunction('getFileCount', function (data) {
        if (!isNaN(data)) _this9.setCounter(data);
      });
    }

    /**
     * Vraci namapovane sloupce na indexy
     * @returns {string[]}
     */
  }, {
    key: "getMapped",
    value: function getMapped() {
      var selected = [];
      $(this.element).find('.import__selected__item__data__table__select').each(function (ind, el) {
        if (el.value !== "") selected[$(el).data('index')] = el.value;
      });
      return selected;
    }
  }, {
    key: "_download",
    value:
    /**
     * Stáhne soubor přes AJAX
     * @param {string} functionName
     * @param {string|null} fileName
     * @param {function|null} onError
     * @private
     */
    function _download(functionName, fileName) {
      var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      if (!fileName) return;
      document.getElementById('hard-loader').classList.add('show');
      this._runFunction(functionName, function (data, status, xhr) {
        var filename = "";
        var disposition = xhr.getResponseHeader('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(blob, filename);
        } else {
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(data);
          if (filename) {
            var a = document.createElement("a");
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
      }, onError, function () {
        document.getElementById('hard-loader').classList.remove('show');
      }, {
        'fileName': fileName
      }, {
        xhrFields: {
          responseType: 'blob'
        }
      });
    }

    /**
     * Vrátí zvolené sloupce
     * @returns {{}}
     */
  }, {
    key: "getSelectedColumns",
    value: function getSelectedColumns() {
      var columns = {};
      $(this.element).find('.import__selected__item__data__table select[data-index]').each(function (ind, elem) {
        if (elem.value) columns[elem.dataset.index] = elem.value;else columns[elem.dataset.index] = null;
      });
      return columns;
    }

    /**
     * Nastaví sloupce
     * @param columns
     */
  }, {
    key: "setColumns",
    value: function setColumns(columns) {
      this.columns = columns;
    }

    /**
     * Vrátí sloupce
     * @returns {*|{}}
     */
  }, {
    key: "getColumns",
    value: function getColumns() {
      return this.columns;
    }

    /**
     * Nastaví, zda má funkce vracet blob
     * @param {boolean} value
     * @returns {Import}
     */
  }, {
    key: "setReturnBlob",
    value: function setReturnBlob(value) {
      this.returnBlob = value;
      return this;
    }

    /**
     * Vrátí, zda má funkce vracet blob
     * @returns {boolean}
     */
  }, {
    key: "getReturnBlob",
    value: function getReturnBlob() {
      return this.returnBlob;
    }
  }]);
}();
//# sourceMappingURL=Import.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var AuthWindow = /*#__PURE__*/function () {
  function AuthWindow(OAuthServer, url) {
    _classCallCheck(this, AuthWindow);
    this.url = url;
    this.OAuthServer = OAuthServer;
    this.window = null;
    AuthWindow.instance[OAuthServer] = this;
    this._timer = null;
    this.onAfterClose = null;
  }
  return _createClass(AuthWindow, [{
    key: "open",
    value: function (_open) {
      function open() {
        return _open.apply(this, arguments);
      }
      open.toString = function () {
        return _open.toString();
      };
      return open;
    }(function () {
      var _this = this;
      if (!this.window || this.window.closed) {
        this.window = open(this.url + '?OAuthServer=' + this.OAuthServer, '__top', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350,popup=true');
        this._timer = setInterval(function () {
          if (_this.window.closed) {
            clearInterval(_this._timer);
            if (typeof _this.onAfterClose === 'function') {
              _this.onAfterClose();
              _this.window = null;
            }
          }
        }, 1000);
      }
    })
  }], [{
    key: "open",
    value: function open(OAuthServer) {
      if (typeof AuthWindow.instance[OAuthServer] !== "undefined" && AuthWindow.instance[OAuthServer]) AuthWindow.instance[OAuthServer].open();
    }
  }]);
}();
_defineProperty(AuthWindow, "instance", {});
//# sourceMappingURL=AuthWindow.js.map
