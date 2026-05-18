function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ShippingPayment = /*#__PURE__*/function () {
  function ShippingPayment() {
    _classCallCheck(this, ShippingPayment);
    this.bindEvents();
  }
  return _createClass(ShippingPayment, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;
      $(function () {
        new Zasilkovna('2237ad43f1459473');
        new Balikovna('BALIKOVNY');
        new Balikovna('POST_OFFICE');
        new PPL();
        if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
          $("div[data-payment-id=".concat(ShippingPayment.applePayID, "]")).show();
        } else {
          $("div[data-payment-id=".concat(ShippingPayment.applePayID, "]")).remove();
        }

        // $('.continue-shopping').click(() => {
        //     $('#main-form').submit();
        // });

        $('.shippings .item').click(function (e) {
          var $this = $(e.target).closest('.shippings .item');
          if ($this.hasClass('active')) return;
          $('.shippings .item').removeClass('active');
          $this.addClass('active');
          $('#recap-shipping-name').html($this.data('shipping-name'));
          var shippingPriceWithVat = $this.data('shipping-price-with-vat') > 0 ? numberHelpers.formatPrice($this.data('shipping-price-with-vat')) : 'Zdarma';
          $('#recap-shipping-price').html(shippingPriceWithVat);
          $('#Shipping_ID').val($this.data('shipping-id'));
          var shippingImage = $this.find('.image img').attr('src');
          if (shippingImage) {
            $('#recap-shipping-image').attr('src', shippingImage);
          }
          cartRecapitulation.shippingPriceWithoutVat = $this.data('shipping-price-without-vat');
          cartRecapitulation.shippingPriceWithVat = $this.data('shipping-price-with-vat');
          cartRecapitulation.updateTotalPrice();
          _this.loadPayments($this.data('shipping-id'));
          ShippingPayment.handlePickUpCarriers();
        });
        $('.payments .item').click(function (e) {
          var $this = $(e.target).closest('.payments .item');
          if ($this.hasClass('inactive')) return;
          $('.payments .item').removeClass('active');
          $this.addClass('active');
          $('#recap-payment-name').html($this.data('payment-name'));
          var paymentPriceWithVat = $this.data('payment-price-with-vat') > 0 ? numberHelpers.formatPrice($this.data('payment-price-with-vat')) : 'Zdarma';
          $('#recap-payment-price').html(paymentPriceWithVat);
          $('#Payment_ID').val($this.data('payment-id'));
          var paymentImage = $this.find('.image img').attr('src');
          if (paymentImage) {
            $('#recap-payment-image').attr('src', paymentImage);
          }
          cartRecapitulation.paymentPriceWithVat = $this.data('payment-price-with-vat');
          cartRecapitulation.paymentPriceWithoutVat = $this.data('payment-price-without-vat');
          cartRecapitulation.updateTotalPrice();
        });
        var selectedShippingID = $('#Shipping_ID').val();
        if (selectedShippingID) {
          $('.shippings .item[data-shipping-id=' + selectedShippingID + ']').click();
        } else {
          $('.shippings .item:first-of-type').click();
        }
      });
    }
  }, {
    key: "loadPayments",
    value: function loadPayments(shippingID) {
      $.ajax({
        type: "POST",
        url: "/default/order/shipping-payments",
        data: {
          ShippingID: shippingID
        },
        success: function success(data) {
          $('.no-payment').hide();
          var payments = JSON.parse(data);
          var hasPayment = false;
          var paymentsItem = $('.payments .item');
          var selectedPaymentID = $('#Payment_ID').val();
          paymentsItem.removeClass('active');
          paymentsItem.addClass('inactive');
          $.each(payments, function (k, v) {
            var payment = $('.payments .item[data-payment-id="' + v.Payment_ID + '"]');
            payment.removeClass('inactive');
            if (selectedPaymentID) {
              if (v.Payment_ID == selectedPaymentID) payment.click();
              hasPayment = true;
            } else {
              if (!hasPayment) payment.click();
              hasPayment = true;
            }
          });
          if (!hasPayment) {
            $('#recap-payment-name').html('');
            $('#recap-payment-price').html('');
            $('#Payment_ID').val('');
            $('.no-payment').show();
          }
        }
      });
    }
  }], [{
    key: "handlePickUpCarriers",
    value: function handlePickUpCarriers() {
      if (this.isZasilkovnaCzChosen()) {
        this.processZasilkovna();
        return;
      }
      if (this.isZasilkovnaSkChosen()) {
        this.processZasilkovna();
        return;
      }
      if (this.isPPLChosen()) {
        this.processPPL();
        return;
      }
      if (this.isBalikovnaChosen()) {
        this.processBalikovna();
        return;
      }
      if (this.isBalikNaPostuChosen()) {
        this.processBalikNaPostu();
        return;
      }
      this.enableCompleteShoppingButton();
    }
  }, {
    key: "handleZasilkovna",
    value: function handleZasilkovna() {
      if (this.isZasilkovnaCzChosen() || this.isZasilkovnaSkChosen()) {
        this.processZasilkovna();
      }
    }
  }, {
    key: "handleBalikovna",
    value: function handleBalikovna() {
      if (this.isBalikovnaChosen()) {
        this.processBalikovna();
      }
    }
  }, {
    key: "handleBalikNaPostu",
    value: function handleBalikNaPostu() {
      if (this.isBalikNaPostuChosen()) {
        this.processBalikNaPostu();
      }
    }
  }, {
    key: "handlePPL",
    value: function handlePPL() {
      if (this.isPPLChosen()) {
        this.processPPL();
      }
    }
  }, {
    key: "isZasilkovnaCzChosen",
    value: function isZasilkovnaCzChosen() {
      return $('.shippings .item.active').data('shipping-id') === this.zasilkovnaCZShippingID;
    }
  }, {
    key: "isZasilkovnaSkChosen",
    value: function isZasilkovnaSkChosen() {
      return $('.shippings .item.active').data('shipping-id') === this.zasilkovnaSKShippingID;
    }
  }, {
    key: "isBalikovnaChosen",
    value: function isBalikovnaChosen() {
      return $('.shippings .item.active').data('shipping-id') === this.balikovnaShippingID;
    }
  }, {
    key: "isBalikNaPostuChosen",
    value: function isBalikNaPostuChosen() {
      return $('.shippings .item.active').data('shipping-id') === this.balikNaPostuShippingID;
    }
  }, {
    key: "isPPLChosen",
    value: function isPPLChosen() {
      return $('.shippings .item.active').data('shipping-id') === this.pplShippingID;
    }
  }, {
    key: "isPickUpPointChosen",
    value: function isPickUpPointChosen(selector) {
      return $(selector).attr('data-point-chosen') === 'true';
    }
  }, {
    key: "getDataAboutPickUpPoint",
    value: function getDataAboutPickUpPoint(pickupPlaceSelector) {
      var ID = $(pickupPlaceSelector).attr('data-point-id');
      var Name = $(pickupPlaceSelector).attr('data-point-name');
      var Address = $(pickupPlaceSelector).attr('data-point-address');
      var Code = $(pickupPlaceSelector).attr('data-point-code');
      return {
        ID: ID,
        Name: Name,
        Address: Address,
        Code: Code
      };
    }
  }, {
    key: "processZasilkovna",
    value: function processZasilkovna() {
      if (this.isZasilkovnaCzChosen() && !this.isPickUpPointChosen('#m1-cz')) {
        this.disableCompleteShoppingButton();
        this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky.');
      } else if (this.isZasilkovnaSkChosen() && !this.isPickUpPointChosen('#m1-sk')) {
        this.disableCompleteShoppingButton();
        this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky;');
      } else {
        this.enableCompleteShoppingButton();
        var pickupPointData;
        if (this.isZasilkovnaCzChosen()) pickupPointData = this.getDataAboutPickUpPoint('#m1-cz');else pickupPointData = this.getDataAboutPickUpPoint('#m1-sk');
        this.clearHiddenInputs(pickupPointData);
        this.createHiddenInputs(pickupPointData);
      }
    }
  }, {
    key: "processBalikovna",
    value: function processBalikovna() {
      if (this.isBalikovnaChosen() && !this.isPickUpPointChosen('#m1-balikovna')) {
        this.disableCompleteShoppingButton();
        this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky.');
      } else {
        this.enableCompleteShoppingButton();
        var pickupPointData = this.getDataAboutPickUpPoint('#m1-balikovna');
        this.clearHiddenInputs(pickupPointData);
        this.createHiddenInputs(pickupPointData);
      }
    }
  }, {
    key: "processBalikNaPostu",
    value: function processBalikNaPostu() {
      if (this.isBalikNaPostuChosen() && !this.isPickUpPointChosen('#m1-balik-na-postu')) {
        this.disableCompleteShoppingButton();
        this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky.');
      } else {
        this.enableCompleteShoppingButton();
        var pickupPointData = this.getDataAboutPickUpPoint('#m1-balik-na-postu');
        this.clearHiddenInputs(pickupPointData);
        this.createHiddenInputs(pickupPointData);
      }
    }
  }, {
    key: "processPPL",
    value: function processPPL() {
      if (this.isPPLChosen() && !this.isPickUpPointChosen('.ppl-selected-pickup-point')) {
        this.disableCompleteShoppingButton();
        this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky.');
      } else {
        this.enableCompleteShoppingButton();
        var pickupPointData = this.getDataAboutPickUpPoint('.ppl-selected-pickup-point');
        this.clearHiddenInputs(pickupPointData);
        this.createHiddenInputs(pickupPointData);
      }
    }
  }, {
    key: "disableCompleteShoppingButton",
    value: function disableCompleteShoppingButton() {
      console.log("VOLAM SE");
      $('.complete-order').attr("disabled", "disabled");
      $('.complete-order').css("background", "gray");

      // $('.continue-shopping').attr("disabled", "disabled");
      // $('.continue-shopping').css("background", "gray");
    }
  }, {
    key: "sendAlertMessage",
    value: function sendAlertMessage(selector, message) {
      console.log("VOLAM ALERT MESSAGE");
      if (!$('#info-message').length) $(selector).append("<div id=\"info-message\" style=\"color: red;\" class=\"p-1\">".concat(message, "</div>"));
    }
  }, {
    key: "clearAlertMessage",
    value: function clearAlertMessage() {
      if ($('#info-message').length) {
        $('#info-message').remove();
      }
    }
  }, {
    key: "enableCompleteShoppingButton",
    value: function enableCompleteShoppingButton() {
      $('.complete-order').removeAttr("disabled");
      $('.complete-order').removeAttr("style");

      // $('.continue-shopping').removeAttr("disabled");
      // $('.continue-shopping').removeAttr("style");

      this.clearAlertMessage();
    }
  }, {
    key: "createHiddenInputs",
    value: function createHiddenInputs(data) {
      var mainForm = $('#main-form');
      for (var key in data) {
        mainForm.append("<input type=\"hidden\" id=\"PickupPoint_".concat(key, "\" name=\"PickupPoint_").concat(key, "\" value=\"").concat(data[key], "\">"));
      }
    }
  }, {
    key: "clearHiddenInputs",
    value: function clearHiddenInputs() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (data) {
        for (var key in data) {
          $("#PickupPoint_".concat(key)).remove();
        }
      }
    }
  }]);
}();
_defineProperty(ShippingPayment, "zasilkovnaCZShippingID", 13);
_defineProperty(ShippingPayment, "zasilkovnaSKShippingID", 12);
_defineProperty(ShippingPayment, "balikovnaShippingID", 1);
_defineProperty(ShippingPayment, "balikNaPostuShippingID", 3);
_defineProperty(ShippingPayment, "pplShippingID", 8);
_defineProperty(ShippingPayment, "applePayID", 5);
//# sourceMappingURL=ShippingPayment.js.map
