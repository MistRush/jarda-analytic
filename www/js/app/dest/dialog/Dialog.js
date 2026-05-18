function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Dialog = /*#__PURE__*/function () {
  function Dialog() {
    _classCallCheck(this, Dialog);
    _defineProperty(this, "_uid", void 0);
    // UID
    _defineProperty(this, "_modalClass", void 0);
    // Titulek
    _defineProperty(this, "_title", void 0);
    // Titulek
    _defineProperty(this, "_content", void 0);
    // Obsah
    _defineProperty(this, "_footer", void 0);
    // Patička
    _defineProperty(this, "_shown", void 0);
    // Bool zda již bylo zobrazené
    _defineProperty(this, "_confirmButton", void 0);
    _defineProperty(this, "_cancelButton", void 0);
    _defineProperty(this, "_buttons", void 0);
    _defineProperty(this, "onBeforeOpen", void 0);
    _defineProperty(this, "onAfterOpen", void 0);
    _defineProperty(this, "onBeforeClose", void 0);
    _defineProperty(this, "onAfterClose", void 0);
    _defineProperty(this, "confirm_function", void 0);
    _defineProperty(this, "fade_interval", void 0);
    this._modalClass = "";
    this._content = "";
    this._title = "";
    this._footer = "";
    this._uid = 'dialog_' + Math.random().toString(36).substring(10);
    window[this._uid] = this;
    this.init();
    this.bind();
  }
  return _createClass(Dialog, [{
    key: "init",
    value:
    /**
     * Inicializace základních proměnných
     */
    function init() {
      this._element = null;
      this._confirmButton = false;
      this._cancelButton = false;
      this._buttons = [];
      this.onBeforeClose = null;
      this.onAfterClose = null;
      this.onBeforeOpen = null;
      this.onAfterOpen = null;
      this.confirm_function = 'dialogConfirm()';
      this.fade_interval = 300;
      this._shown = false;
    }

    /**
     * Bind základních akcí
     */
  }, {
    key: "bind",
    value: function bind() {
      //
    }

    /**
     * Zavírá dialog;
     */
  }, {
    key: "close",
    value: function close() {
      window.dialogIsShown = false;
      if (this.onBeforeClose && typeof this.onBeforeClose == "function") this.onBeforeClose();
      $('body').removeClass('modal-open');
      this._element.remove();
      $('.modal-backdrop').remove();
      $('#modal').hide(0);
      window[this._uid] = undefined;
      if (this.onAfterClose && typeof this.onAfterClose == "function") this.onAfterClose();
    }

    /**
     * Otevírá dialog
     */
  }, {
    key: "open",
    value: function open() {
      if (window.dialogIsShown) {
        console.warn('Another dialog is opened already');
        return this;
      }
      window.dialogIsShown = true;
      if (this.onBeforeOpen && typeof this.onBeforeOpen == "function") this.onBeforeOpen();
      $('#modal').show(0);
      $('body').addClass('modal-open');
      if ($('.modal-backdrop').length === 0) {
        $('body').append('<div class="modal-backdrop fade show">');
      }
      this.render();

      //layout.bindEvents();

      if (this.onAfterOpen && typeof this.onAfterOpen == "function") this.onAfterOpen();
      return this;
    }

    /**
     * Zobrazuje dialog s obsahem z URL
     * @param {string} url URL s daty
     * @param {Object} params Parametry requestu
     * @param {boolean} json Označení, zda jsou data servírována v JSONu
     */
  }, {
    key: "openFromUrl",
    value: function openFromUrl(url) {
      var _this = this;
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var json = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      params.dialog_id = this._uid;
      $.ajax({
        url: url,
        data: params,
        success: function success(data) {
          if (json) {
            try {
              data = JSON.parse(data);
              _this._content = data.content;
              _this._title = data.title;
              _this._footer = data.footer;
            } catch (ex) {
              console.warn('Data cannot be parsed as JSON');
              alerts.error();
            }
          } else {
            _this._content = data;
          }
          _this.open();
        }
      });
    }

    /**
     * Přida tlačítko/akci
     * @param {number} id
     * @param {string} label
     * @param {?function|null} onClick
     * @param {?string} onClick
     * @param {?string|null} icon
     * 
     * @return {DialogAction} vrácí tlačítko
     */
  }, {
    key: "addAction",
    value: function addAction(id, label) {
      var onClick = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var btnType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'primary';
      var icon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var action = new DialogAction(this, id, label, onClick, btnType, icon);
      this._buttons.push(action);
      return Action;
    }

    /**
     * Vykreslí dialog a nastaví jej jako element
     * 
     * @return {Dialog} vrácí sebe
     */
  }, {
    key: "render",
    value: function render() {
      if (this._buttons.length > 0) this._footer += this._renderActions();
      if (this._confirmButton) this._footer += "<button onclick=\"".concat(this.confirm_function, "\"><i class=\"fas fa-check\"></i>").concat(projectVars.confirm, "</button>");
      if (this._cancelButton) this._footer += "<button onclick=\"window['".concat(this._uid, "'].close();\"><i class=\"fas fa-times\"></i>").concat(projectVars.cancel, "</button>");
      var template = "\n            <div class=\"modal-dialog modal-lg modal-dialog-centered ".concat(this._modalClass, "\" id=\"").concat(this._uid, "\" role=\"document\">\n                <div class=\"modal-content\">\n                    <div class=\"modal-header\">\n                        <h5 class=\"modal-title\">").concat(this._title, "</h5>\n                        <button type=\"button\" class=\"close\" onclick=\"window['").concat(this._uid, "'].close()\" aria-label=\"Close\"></button>\n                    </div>\n                    <div class=\"modal-body\">\n                        ").concat(this._content, "\n                    </div>\n                    ").concat(this._footer.length > 0 ? '<div class="modal-footer">' + this._footer + '</div>' : '', "\n                </div>\n            </div>\n        ");
      this._element = template;
      this._getModal().append($(template));
      this._element = $('#' + this._uid);
      this._shown = true;
      return this;
    }

    /**
     * Vrací element modalu, připadně jej vytvoří
     * 
     * @return {JQuery}
     */
  }, {
    key: "_getModal",
    value: function _getModal() {
      var $modal = $('#modal');
      if ($modal.length > 0) {
        return $modal;
      } else {
        $('body').append('<div class="modal fade show" id="modal" style="display:block;" role="dialog"></div>');
        return this._getModal();
      }
    }

    /**
     * Rendruje tlačítka do footeru
     * 
     * @returns {string}
     */
  }, {
    key: "_renderActions",
    value: function _renderActions() {
      var out = '';
      this._buttons.forEach(function (e) {
        out += e.render();
      });
      return out;
    }

    /**
     * Odstraní tlačítko
     * 
     * @returns {string}
     */
  }, {
    key: "removeAction",
    value: function removeAction(index) {
      this._buttons.splice(index, 1);
      return this;
    }

    /**
     * Zapne tlačítko ve footeru pro zrušení akce
     * 
     * @returns {Dialog}
     */
  }, {
    key: "enableCancel",
    value: function enableCancel() {
      this._cancelButton = true;
      return this;
    }

    /**
     * Zapne tlačítko ve footeru pro potvrzení akce
     * 
     * @returns {Dialog}
     */
  }, {
    key: "enableConfirm",
    value: function enableConfirm() {
      var confirm_function = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'dialogConfirm()';
      this.confirm_function = confirm_function;
      this._confirmButton = true;
      return this;
    }

    /**
     * Vypne tlačítko ve footeru pro zrušení akce
     * 
     * @returns {Dialog}
     */
  }, {
    key: "disableCancel",
    value: function disableCancel() {
      this._cancelButton = false;
      return this;
    }

    /**
     * Vypne tlačítko ve footeru pro potvrzení akce
     * 
     * @returns {Dialog}
     */
  }, {
    key: "disableConfirm",
    value: function disableConfirm() {
      this._confirmButton = false;
      return this;
    }

    /*
     *      SETTERS
     */

    /**
     * Nastaví hlavičku
     * @param value
     */
  }, {
    key: "modalClass",
    get:
    /**
     * Vrací ID dialogu
     * @return {string}
     */
    function get() {
      return this._modalClass;
    }

    /**
     * Vrací ID dialogu
     * @return {string}
     */,
    set: function set(value) {
      this._modalClass = value;
      return this;
    }

    /**
     * Nastaví hlavičku
     * @param value
     */
  }, {
    key: "title",
    get: function get() {
      return this._uid;
    },
    set: function set(value) {
      this._title = value;
      if (this._shown) this._element.find('.modal-title').html(value);
      return this;
    }

    /**
     * Nastaví obsah
     * @param value
     */
  }, {
    key: "content",
    set: function set(value) {
      this._content = value;
      if (this._shown) this._element.find('.modal-body').html(value);
      return this;
    }

    /**
     * Nastaví patičku
     * @param value
     */
  }, {
    key: "footer",
    set: function set(value) {
      this._footer = value;
      if (this._shown) this._element.find('.modal-footer').html(value);
      return this;
    }

    /*
     *      GETTERS
     */

    /**
     * Vrací jQuery element
     * @return {JQuery}
     */
  }, {
    key: "element",
    get: function get() {
      return this._element;
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
  }], [{
    key: "createDialog",
    value: function createDialog(title) {
      var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var footer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
      var dialog = new Dialog();
      dialog.title = title;
      dialog.content = content;
      dialog.footer = footer;
      dialog.enableCancel();
      return dialog;
    }
  }]);
}();
//# sourceMappingURL=Dialog.js.map
