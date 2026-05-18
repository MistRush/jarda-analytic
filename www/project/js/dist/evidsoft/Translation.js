function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Translation = /*#__PURE__*/function () {
  function Translation(lang) {
    _classCallCheck(this, Translation);
    console.log('x');
    this._form = null;
    this._lang = lang;
    this._trans = {
      copyOriginal: 'Copy original',
      copyOriginalOpen: 'Copy original and open Google Translate',
      translateByGoogle: 'Translate by Google',
      saved: 'Saved!',
      copied: 'Copied',
      empty: 'Text is empty'
    };
  }
  _createClass(Translation, [{
    key: "trans",
    get: function get() {
      return this._trans;
    }

    /**
     * @param {Form|null} form
     */,
    set: function set(trans) {
      this._trans = Object.assign(this._trans, trans);
      return this;
    }
  }, {
    key: "setForm",
    value: function setForm() {
      var form = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this._form = form;
    }

    /**
     * @param {string} lang
     */
  }, {
    key: "setLang",
    value: function setLang(lang) {
      this._lang = lang;
    }

    /**
     * @param {Form|null} form
     */
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      var form = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (form) this.setForm(form);
      $(function () {
        _this.createMissing();
        _this.createActions();
        _this.bindEvents();
      });
    }

    /**
     * Bind eventů
     */
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      this.bindSubmit();
      this.bindCopy();
    }

    /**
     * @returns {Translation}
     */
  }, {
    key: "createActions",
    value: function createActions() {
      var _this2 = this;
      if (!this._form) return this;
      $(this._form.form).find('label').each(function (index, item) {
        $(item).parent().prepend("\n<div class=\"copy-action\">\n    <button type=\"button\" data-copy=\"original\" data-open=\"0\" title=\"".concat(_this2.trans.copyOriginal, "\" class=\"copy-original\" data-toggle=\"bstooltip\"><i class=\"fa fa-copy\"></i></button>\n    <button type=\"button\" data-copy=\"original\" data-open=\"1\" title=\"").concat(_this2.trans.copyOriginalOpen, "\" class=\"copy-original-open\" data-toggle=\"bstooltip\"><i class=\"ci ci-export\"></i></button>\n    \n</div>\n                "));
      });
      setTimeout(function () {
        plugins.initBsTooltip();
      }, 500);
      return this;
    }

    /**
     * Vytvoření chybějicích překladů
     * @returns {Translation}
     */
  }, {
    key: "createMissing",
    value: function createMissing() {
      if (!this._form) return this;
      $(this._form.form).find('.has-error').each(function () {
        $(this).find('label').css('color', '#f00');
        $(this).appendTo($("#empty"));
      });
      return this;
    }

    /**
     * Bind uložení
     * @returns {Translation}
     */
  }, {
    key: "bindSubmit",
    value: function bindSubmit() {
      var _this3 = this;
      if (!this._form) return this;
      $(this._form.form).submit(function (event) {
        event.preventDefault();
        Helpers.ajax({
          method: 'POST',
          url: $(_this3._form.form).attr('action'),
          data: {
            data: JSON.stringify($(_this3._form.form).serializeArray()),
            elang: _this3._lang
          },
          success: function success() {
            alerts.alert(_this3.trans.saved);
          }
        }, true);
      });
      return this;
    }

    /**
     * Bind kopírování
     * @returns {Translation}
     */
  }, {
    key: "bindCopy",
    value: function bindCopy() {
      var _this4 = this;
      $('[data-copy]').unbind().click(function (e) {
        var parent = $(e.currentTarget).parent().parent();
        if ($(e.currentTarget).data('copy') == 'original') {
          var input = document.createElement("input");
          input.value = parent.find('label').text();
          input.style.top = "0";
          input.style.left = "0";
          input.style.position = "fixed";
          document.body.appendChild(input);
          _this4.copyText(input, $(e.currentTarget).data('open') > 0);
          input.remove();
        } else {
          _this4.copyText(parent.find('input').get(0), false);
        }
      });
      return this;
    }

    /**
     * Zkopírovat text / otevřít v překládači
     * @param element
     * @param {boolean} open
     */
  }, {
    key: "copyText",
    value: function copyText(element) {
      var open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      element.select();
      element.setSelectionRange(0, 99999);
      if (element.value) {
        if (open) window.open('https://translate.google.com/?sl=cs&op=translate&tl=' + this._getCorrectLang(this._lang) + '&text=' + element.value.trim().replace(/\s/g, '%20'), '_translation');else {
          document.execCommand("copy");
          alerts.alert(this.trans.copied);
        }
      } else {
        alerts.alert(this.trans.empty, 'error');
      }
    }

    /**
     * Vrátí jazyk pro Google překládač
     * @param lang
     * @returns {string|*}
     * @private
     */
  }, {
    key: "_getCorrectLang",
    value: function _getCorrectLang(lang) {
      switch (lang) {
        case "EN":
          return 'en';
        case "CZ":
          return 'cs';
        case "FR":
          return 'fr';
        default:
          return lang;
      }
    }
  }]);
  return Translation;
}();
//# sourceMappingURL=Translation.js.map
