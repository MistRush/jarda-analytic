function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cart = /*#__PURE__*/function () {
  function Cart() {
    _classCallCheck(this, Cart);

    this.$cart = $('#cartIcon');
    this.$badge = this.$cart.find('.badge');
    this.$items = this.$cart.parents('.cartContainer').find('.items');
    this.init();
  }

  _createClass(Cart, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.$cart.parents('.cartContainer').mouseenter(function (e) {
        if (_this.$items.find('.row').length > 0) {
          _this.$cart.attr('style', '');

          _this.$cart.parents('.cartContainer').find('.content').stop().slideDown(100);
        }
      }).mouseleave(function (e) {
        _this.$cart.parents('.cartContainer').find('.content').slideUp(100);
      });
      this.getItems();
    }
  }, {
    key: "refreshCart",
    value: function refreshCart() {
      var _this2 = this;

      var flash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      $.ajax({
        url: basePath + '/default/cart/get-count',
        success: function success(data) {
          if (flash) {
            _this2.flashCart();
          }

          if (data > 0) {
            _this2.$badge.text(data);

            _this2.$badge.removeClass('empty');
          } else {
            _this2.$badge.text(0);

            _this2.$badge.addClass('empty');
          }
        }
      });
      this.getItems();
    }
  }, {
    key: "flashCart",
    value: function flashCart() {
      var _this3 = this;

      this.$badge.addClass('blink');
      setTimeout(function () {
        _this3.$badge.removeClass('blink');
      }, 500);
    }
  }, {
    key: "getItems",
    value: function getItems() {
      var _this4 = this;

      $.ajax({
        url: basePath + '/default/cart/get-items',
        success: function success(data) {
          _this4.$items.html('');

          if (!data.startsWith("[") && !data.startsWith('{')) {
            return;
          }

          var new_data = JSON.parse(data);
          var total = 0;
          var currency = '€';

          for (var i = 0; i < new_data.length; i++) {
            var html = "<div class=\"row\">\n                    <div class=\"col thumb\">";

            if (new_data[i].Image != null) {
              html += '<img src="' + basePath + '/files/images/remante/800/' + new_data[i].Image + '">';
            } else {
              html += '<img src="' + basePath + '/core/img/cdb-icons/package.svg">';
            }

            html += "</div>\n                    <div class=\"col product\">\n                    <a href=\"".concat(basePath, "/default/product/index?search=").concat(new_data[i].Product_ID, "\">").concat(new_data[i].Product, "</a>\n                    </div>\n                    <div class=\"col-4 info\">\n                        <span class=\"quantity\">").concat(new_data[i].Quantity, "x</span>\n                        <span class=\"price\">").concat(Helpers.formatPrice(new_data[i].Quantity * new_data[i].Price), " ").concat(new_data[i].Currency, "</span>\n                    </div>\n                    </div>");
            total += new_data[i].Quantity * new_data[i].Price;
            currency = new_data[i].Currency;

            _this4.$items.append(html);
          }

          _this4.$cart.parents('.cartContainer').find('.total span').text(Helpers.formatPrice(total) + " ".concat(currency));
        }
      });
    }
  }]);

  return Cart;
}();
//# sourceMappingURL=Cart.js.map
