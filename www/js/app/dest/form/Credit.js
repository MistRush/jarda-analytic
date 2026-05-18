function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Kupóny
 */
var Credit = /*#__PURE__*/function () {
  /**
   * Konstruktor pro kredit
   * @param form_id
   */
  function Credit() {
    var form_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'creditForm';
    _classCallCheck(this, Credit);
    this._element = document.getElementById(form_id);
    this._form = new Form(form_id);
    this.init();
  }

  /**
   * Vrací formulář
   * @return {*|jQuery|HTMLElement}
   */
  _createClass(Credit, [{
    key: "$form",
    get: function get() {
      return $(this._element);
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      $(function () {
        _this.$input = _this.$form.find('input[name="creditsAmount"]');
        _this.$submit = _this.$form.find('button[type="submit"]');
        _this.$reset = _this.$form.find('button[type="reset"]');
        if ($('.credit-row').length) {
          _this.handleSuccess();
        }
      });
      this.$form.on('submit', function (e) {
        e.preventDefault();
        _this.applyCredit(_this.$input.val());
      });
      this.$form.on('reset', function (e) {
        _this.removeCoupon();
      });
    }

    /**
     * Aplikuje kupón
     * @param {string} credit
     */
  }, {
    key: "applyCredit",
    value: function applyCredit(credit) {
      var _this2 = this;
      $.ajax({
        url: projectVars.basePath + '/cart/apply-credits',
        method: 'POST',
        data: {
          credit: credit
        },
        success: function success(data) {
          try {
            data = JSON.parse(data);
            if (data.error === true) return _this2.handleError(data.error_msg);
            _this2.handleSuccess();
          } catch (ex) {
            _this2.handleError();
          }
          location.reload();
          //CartPage.refreshCart();
        },

        error: function error() {
          _this2.handleError();
        }
      });
    }
  }, {
    key: "removeCoupon",
    value: function removeCoupon() {
      var _this3 = this;
      $.ajax({
        url: projectVars.basePath + '/cart/remove-credits',
        method: 'POST',
        success: function success(data) {
          _this3.$input.prop('readonly', false);
          _this3.$reset.hide();
          _this3.$submit.show();
          location.reload();
          //CartPage.refreshCart();
        },

        error: function error() {
          _this3.handleError();
        }
      });
    }

    /**
     * Handle pro error
     * @param {string|null} msg
     * @return {boolean}
     */
  }, {
    key: "handleError",
    value: function handleError() {
      var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.$input.prop('readonly', false);
      this.$reset.hide();
      this.$submit.show();
      if (msg) alerts.alert('Error', 'error', msg);else alerts.error();
      return false;
    }

    /**
     * Handle pro úspěšné užití
     */
  }, {
    key: "handleSuccess",
    value: function handleSuccess() {
      this.$input.attr('readonly', true);
      this.$reset.show();
      this.$submit.hide();
    }
  }]);
  return Credit;
}();
//# sourceMappingURL=Credit.js.map
