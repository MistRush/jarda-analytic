function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Address = /*#__PURE__*/function () {
  function Address() {
    var _this = this;
    _classCallCheck(this, Address);
    $(function () {
      _this.customerForm = new Form('main-form');
      _this.bindEvents();
    });
  }
  _createClass(Address, [{
    key: "bindEvents",
    value: function bindEvents() {
      $('.company-toggler').click(function () {
        var companyBox = $('.company-box');
        $('#IsCompany').prop('checked') ? companyBox.slideDown(300) : companyBox.slideUp(300);
      });
      $('.delivery-toggler').click(function () {
        var deliveryBox = $('.delivery-box');
        $('#IsDelivery').prop('checked') ? deliveryBox.slideDown(300) : deliveryBox.slideUp(300);
      });
      $('.user-toggler').click(function () {
        var userBox = $('.user-box');
        $('#IsUser').prop('checked') ? userBox.slideDown(300) : userBox.slideUp(300);
        $('.user-box .pw').attr({
          id: "Password",
          type: "password",
          name: "Password"
        });
        $('.user-box .pw-again').attr({
          id: "PasswordAgain",
          type: "password",
          name: "PasswordAgain"
        });
      });
    }
  }, {
    key: "validateEmail",
    value: function validateEmail(value) {
      var result = true;
      if ($("#IsUser").length == 0) return result;
      if (!$("#IsUser").prop('checked')) return result;
      $.ajax({
        type: "POST",
        url: "/default/customer/check-email/",
        data: {
          Email: value
        },
        async: false,
        success: function success(data) {
          result = data != 1;
        }
      });
      return result;
    }
  }, {
    key: "validatePassword",
    value: function validatePassword() {
      var password = $('#Password').val();
      var passwordAgain = $('#PasswordAgain').val();
      var result = true;
      if (password !== passwordAgain) result = false;
      return result;
    }
  }]);
  return Address;
}();
//# sourceMappingURL=Address.js.map
