function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Form = /*#__PURE__*/function () {
  function Form(form_id) {
    _classCallCheck(this, Form);
    this.$form = $('#' + form_id);
    this.valid = true;
  }
  return _createClass(Form, [{
    key: "checkVisibility",
    value: function checkVisibility(d) {
      if (d === undefined) return true;else return !$(d).is(':hidden');
    }
  }, {
    key: "validate",
    value: function validate() {
      var _this = this;
      this.valid = true;
      this.$form.find(':input').each(function (i, e) {
        e = $(e);
        var validation_data = e.data('validator');
        if (validation_data === undefined) return;else if (typeof validation_data === 'string') validation_data = JSON.parse(validation_data);
        var value = e.val();
        var errorMessage = '';
        var errorDiv = $("#" + e.attr('name') + "Error");
        errorDiv.html('');
        e.removeClass('input-error');
        validation_data.forEach(function (v) {
          switch (v.v) {
            case Form.VALIDATOR_REQUIRED:
              if (_this.checkVisibility(v.d) && !Form.validateRequired(value)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_IN:
              if (_this.checkVisibility(v.d) && !Form.validateRegex(value, '^[0-9]{1,8}$')) errorMessage += v.m;
              break;
            case Form.VALIDATOR_EMAIL:
              if (_this.checkVisibility(v.d) && !Form.validateEmail(value)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_LENGTH:
              if (_this.checkVisibility(v.d) && !Form.validateLength(value, v.p)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_MAX_LENGTH:
              if (_this.checkVisibility(v.d) && !Form.validateMaxLength(value, v.p)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_MIN_LENGTH:
              if (_this.checkVisibility(v.d) && !Form.validateMinLength(value, v.p)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_NUMBER:
              if (_this.checkVisibility(v.d) && !Form.validateNumber(value)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_PATTERN:
              var re = new RegExp(v.p);
              if (_this.checkVisibility(v.d) && !Form.validateRegex(value, re)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_RANGE:
              if (_this.checkVisibility(v.d) && !Form.validateRange()) errorMessage += v.m;
              break;
            default:
              var validateFunction = v.v.split('.');
              if (typeof window[validateFunction[0]][validateFunction[1]] === 'function') {
                if (!window[validateFunction[0]][validateFunction[1]](value)) errorMessage += v.m;
              }
              break;
          }
        });
        if (errorMessage !== '') {
          if (errorDiv.length === 0) e.after($("<div class=\"error\" id=\"".concat(e.attr('name'), "Error\"></div>")));
          $("#" + e.attr('name') + "Error").html(errorMessage);
          e.addClass('input-error');
          _this.valid = false;
        }
      });
      return this.valid;
    }
  }], [{
    key: "validateRegex",
    value: function validateRegex(value, pattern) {
      var r = new RegExp(pattern);
      return value.match(r) != null;
    }
  }, {
    key: "validateMinLength",
    value: function validateMinLength(value, minlength) {
      return value.length >= minlength;
    }
  }, {
    key: "validateMaxLength",
    value: function validateMaxLength(value, maxlength) {
      return value.length <= maxlength;
    }
  }, {
    key: "validateLength",
    value: function validateLength(value, length) {
      return toString(value).length === length;
    }
  }, {
    key: "validateEmail",
    value: function validateEmail(value) {
      return this.validateRegex(value.toLowerCase(), /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
  }, {
    key: "validateRequired",
    value: function validateRequired(value) {
      return value != '';
    }
  }, {
    key: "validateNumber",
    value: function validateNumber(value) {
      return value.isInteger(value);
    }
  }, {
    key: "validateRange",
    value: function validateRange(value, min, max) {
      return min >= value && value <= max;
    }
  }]);
}();
_defineProperty(Form, "VALIDATOR_REQUIRED", ':required');
_defineProperty(Form, "VALIDATOR_IN", ':in-validator');
_defineProperty(Form, "VALIDATOR_MIN_LENGTH", ':min_length');
_defineProperty(Form, "VALIDATOR_MAX_LENGTH", ':max_length');
_defineProperty(Form, "VALIDATOR_LENGTH", ':length');
_defineProperty(Form, "VALIDATOR_EMAIL", ':email');
_defineProperty(Form, "VALIDATOR_PATTERN", ':pattern');
_defineProperty(Form, "VALIDATOR_NUMBER", ':number');
_defineProperty(Form, "VALIDATOR_RANGE", ':range');
//# sourceMappingURL=Form.js.map
