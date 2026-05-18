function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Registration = /*#__PURE__*/function () {
  function Registration() {
    var _this = this;

    _classCallCheck(this, Registration);

    $(function () {
      _this.registrationForm = new Form('main-form');

      _this.bindEvents();
    });
  }

  _createClass(Registration, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;

      $('#confirm-registration').click(function () {
        _this2.registrationForm.validate();
      });
      $('.company-toggler').click(function () {
        var companyBox = $('.company-box');
        $('#IsCompany').prop('checked') ? companyBox.slideDown(300) : companyBox.slideUp(300);
      });
    }
  }, {
    key: "validateEmail",
    value: function validateEmail(value) {
      var result = true;
      $.ajax({
        type: "POST",
        url: "/default/customer/check-email/",
        data: {
          Email: value
        },
        success: function success(data) {
          if (data == 1) {
            result = false;
          } else {
            result = true;
          }
        },
        async: false
      });
      return result;
    }
  }]);

  return Registration;
}();
//# sourceMappingURL=registration.js.map
