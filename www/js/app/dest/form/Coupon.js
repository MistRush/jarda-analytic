function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Kupóny
 */
var Coupon = /*#__PURE__*/function () {
  /**
   * Konstruktor pro kupóny
   * @param form_id
   */
  function Coupon() {
    var form_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'coupon-form';
    _classCallCheck(this, Coupon);
    this._element = document.getElementById(form_id);
    this._form = new Form(form_id);
    this.init();
  }

  /**
   * Vrací formulář
   * @return {*|jQuery|HTMLElement}
   */
  return _createClass(Coupon, [{
    key: "$form",
    get: function get() {
      return $(this._element);
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      $(function () {
        _this.$input = _this.$form.find('input[name="couponCode"]');
        _this.$submit = _this.$form.find('button[type="submit"]');
        _this.$reset = _this.$form.find('button[type="reset"]');
        if (_this.$input.val().length) {
          _this.handleSuccess();
        }
      });
      this.$form.on('submit', function (e) {
        e.preventDefault();
        _this.applyCoupon(_this.$input.val());
      });
      this.$form.on('reset', function (e) {
        _this.removeCoupon();
      });
    }

    /**
     * Aplikuje kupón
     * @param {string} coupon
     */
  }, {
    key: "applyCoupon",
    value: function applyCoupon(coupon) {
      var _this2 = this;
      $.ajax({
        url: projectVars.basePath + '/cart/apply-coupon',
        method: 'POST',
        data: {
          coupon: coupon
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
        url: projectVars.basePath + '/cart/remove-coupon',
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
}();
//# sourceMappingURL=Coupon.js.map
