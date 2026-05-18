function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var OldAccountForm = /*#__PURE__*/function () {
  function OldAccountForm() {
    var _this = this;
    _classCallCheck(this, OldAccountForm);
    $(function () {
      _this.registrationForm = new Form('main-form');
      _this.bindEvents();
    });
  }
  return _createClass(OldAccountForm, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $('input[name="Hash"]').val(window.location.search.replace('?hash=', ''));
      $('#confirm-registration').click(function (e) {
        e.preventDefault();
        if (!$('#terms').prop('checked')) {
          $('.terms label').css('color', '#ea545f');
        } else {
          $('.terms label').css('color', '#212529');
        }
        if (!$('#gdpr').prop('checked')) {
          $('.gdpr label').css('color', '#ea545f');
        } else {
          $('.gdpr label').css('color', '#212529');
        }
        _this2.registrationForm.validate();
        if (_this2.registrationForm.valid && $('#gdpr').prop('checked')) {
          $('#main-form').submit();
        }
      });
      $('.company.with-toggler').click(function () {
        $('.company-block').toggle(300);
        $(this).toggleClass('active');
        $('input[name="IsCompany"]').val($(this).hasClass());
      });
      $('.delivery-address.with-toggler').click(function () {
        $('.delivery-address-block').toggle(300);
        $(this).toggleClass('active');
        $('input[name="IsDeliveryAddress"]').val($(this).hasClass());
      });
    }
  }, {
    key: "validateEmail",
    value: function validateEmail(value) {
      var result = true;
      $.ajax({
        type: "POST",
        url: "/default/customer/check-email",
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
}();
//# sourceMappingURL=OldAccountForm.js.map
