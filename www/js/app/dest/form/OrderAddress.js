function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var OrderAddress = /*#__PURE__*/function () {
  function OrderAddress() {
    var _this = this;
    _classCallCheck(this, OrderAddress);
    $(function () {
      _this.customerForm = new Form('main-form');
      $('#step-2').removeAttr('href');
      _this.bindEvents();
    });
  }
  return _createClass(OrderAddress, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $('#step-2').click(function () {
        _this2.customerForm.validate();
        if (_this2.customerForm.valid) {
          $('#main-form').submit();
        }
      });
      $('.continue-shopping').click(function () {
        $('#main-form').submit();
      });
      $('#DFirstName, #DLastName, #DStreet, #DCity, #DZipCode').on('input', function () {
        _this2.deliveryAddressToggle();
      });
      $('#invoiceAddressesSelect').change(function () {
        var addressID = $('#invoiceAddressesSelect').val();
        _this2.reloadAddress(addressID, 'invoice');
      });
      $('#deliveryAddressesSelect').change(function () {
        var addressID = $('#deliveryAddressesSelect').val();
        _this2.reloadAddress(addressID, 'delivery');
        _this2.deliveryAddressToggle();
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
      $('.user.with-toggler').click(function () {
        $('.register-block').toggle(300);
        $(this).toggleClass('active');
        $('input[name="IsRegister"]').val($(this).hasClass());
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
  }, {
    key: "deliveryAddressToggle",
    value: function deliveryAddressToggle() {
      if ($('#DFirstName').val() === '' && $('#DLastName').val() === '' && $('#DStreet').val() === '' && $('#DCity').val() === '' && $('#DZipCode').val() === '') {
        $('input[name="IsDeliveryAddress"]').val(0);
        $('.delivery-address-block').hide();
      }
    }
  }, {
    key: "reloadAddress",
    value: function reloadAddress(addressID, type) {
      $.ajax({
        type: "POST",
        url: "/default/order/get-address",
        data: {
          AddressID: addressID
        },
        success: function success(data) {
          var address = JSON.parse(data);
          if (type === 'invoice') {
            $('#FirstName').val(address.FirstName);
            $('#LastName').val(address.LastName);
            $('#Street').val(address.Street);
            $('#City').val(address.City);
            $('#ZipCode').val(address.ZipCode);
            $('#Phone').val(address.Phone);
            $('#CompanyName').val(address.CompanyName);
            $('#ICO').val(address.IC);
            $('#DIC').val(address.DIC);
          }
          if (type === 'delivery') {
            $('#DFirstName').val(address.FirstName);
            $('#DLastName').val(address.LastName);
            $('#DStreet').val(address.Street);
            $('#DCity').val(address.City);
            $('#DZipCode').val(address.ZipCode);
          }
        }
      });
    }
  }]);
}();
//# sourceMappingURL=OrderAddress.js.map
