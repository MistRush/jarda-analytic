function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Registration = /*#__PURE__*/function () {
  function Registration() {
    var _this = this;
    _classCallCheck(this, Registration);
    $(function () {
      _this.registrationForm = new Form('main-form');
      _this.bindEvents();
    });
  }
  return _createClass(Registration, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $('<a id="loadDataFromAres" class="btn btn-primary" style="position:absolute; right:18px; padding:5px 10px; bottom:4px">Vyplnit fa údaje z ARES</a>').insertAfter($('#IC'));
      $('#loadDataFromAres').click(function (e) {
        $.ajax({
          type: "POST",
          url: "/default/customer/check-ic",
          data: {
            IC: $('#IC').val()
          },
          success: function success(data) {
            if (data && data.status === 'success') {
              var companyData = data.data;
              $('#CompanyName').val(companyData.company);
              $('#Street').val(companyData.street + ' ' + companyData.descriptiveNumber + (companyData.orientationNumber ? '/' + companyData.orientationNumber : ''));
              $('#City').val(companyData.city);
              $('#ZipCode').val(companyData.zip);
              $('#DIC').val(companyData.tin);
            } else {
              alert('Zadané IČ není platné, nebo nebylo nalezeno v ARES.');
            }
          }
        });
      });
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
        if (_this2.registrationForm.valid && $('#terms').prop('checked') && $('#gdpr').prop('checked')) {
          _this2.recapchaCallback();
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
    key: "recapchaCallback",
    value: function recapchaCallback() {
      grecaptcha.ready(function () {
        grecaptcha.execute('6Ld4ogArAAAAAN-5fVn8mxHa848vSIN4pqJ41BYy', {
          action: 'submit'
        }).then(function (token) {
          $('<input>').attr({
            type: 'hidden',
            id: 'recaptchaToken',
            name: 'Token',
            value: token
          }).appendTo('#main-form');
          $('#main-form').submit();
        });
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
//# sourceMappingURL=Registration.js.map
