function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CompleteOrder = /*#__PURE__*/function () {
  function CompleteOrder() {
    var _this = this;
    _classCallCheck(this, CompleteOrder);
    $(function () {
      _this.customerForm = new Form('main-form');
      _this.bindEvents();
    });
  }
  return _createClass(CompleteOrder, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $('.complete-order').click(function () {
        _this2.customerForm.validate();
        if (!$('#terms').prop('checked')) {
          $('.terms label').css('color', '#ea545f');
        } else {
          $('.terms label').css('color', '#212529');
        }
        console.log(_this2.customerForm.valid);
        if (_this2.customerForm.valid) {
          if ($('#terms').prop('checked')) {
            $('.complete-order').attr('disabled', true);
            $('<div class="progress-loader-wrap" style="float: left;top: -20px; left:38px"><div class="progress-loader"></div></div>').insertBefore('.complete-order');
            $('.terms-label label').css('color', '#11142D');
            var utmParams = Layout.checkCookieName(Layout.UTM_COOKIE);
            var referer = Layout.checkCookieName(Layout.REFERER_COOKIE);
            if (utmParams) {
              $('<input>').attr({
                type: 'hidden',
                id: 'UtmParams',
                name: 'UtmParams',
                value: utmParams
              }).appendTo('#main-form');
            }
            if (referer) {
              $('<input>').attr({
                type: 'hidden',
                id: 'Referer',
                name: 'Referer',
                value: referer
              }).appendTo('#main-form');
            }
            $('#main-form').submit();
          }
        }
      });
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
}();
//# sourceMappingURL=CompleteOrder.js.map
