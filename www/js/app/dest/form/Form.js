function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Form = /*#__PURE__*/function () {
  function Form(form_id) {
    _classCallCheck(this, Form);

    this.$form = $('#' + form_id);
    this.valid = true;
  }

  _createClass(Form, [{
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
              if (!Form.validateRequired(value)) errorMessage += v.m;
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

            case Form.VALIDATOR_RANGE:
              if (!Form.validateRange()) errorMessage += v.m;
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

  return Form;
}();

_defineProperty(Form, "VALIDATOR_REQUIRED", ':required');

_defineProperty(Form, "VALIDATOR_MIN_LENGTH", ':min_length');

_defineProperty(Form, "VALIDATOR_MAX_LENGTH", ':max_length');

_defineProperty(Form, "VALIDATOR_LENGTH", ':length');

_defineProperty(Form, "VALIDATOR_EMAIL", ':email');

_defineProperty(Form, "VALIDATOR_PATTERN", ':pattern');

_defineProperty(Form, "VALIDATOR_NUMBER", ':number');

_defineProperty(Form, "VALIDATOR_RANGE", ':range');
//# sourceMappingURL=Form.js.map
