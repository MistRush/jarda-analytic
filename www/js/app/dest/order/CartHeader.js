function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CartHeader = /*#__PURE__*/function () {
  function CartHeader() {
    _classCallCheck(this, CartHeader);
  }
  return _createClass(CartHeader, null, [{
    key: "updateCartHeader",
    value: function updateCartHeader(price, count, items) {
      $('#header .cart-block .price').text(price);
      $('#header .cart-block .count').text(count);
      $('#header .cart-block .items-block').html(this.formatItems(items));
      $('#header .cart-block .summary .total span').text(price);
      $('#header .cart-block').toggleClass('empty', !items || items.length === 0);
      CartHeader.quantityChangeListener();
      $("#header .quantity-change").click(function (e) {
        var quantity = $(e.currentTarget).siblings('.quantity').val();
        if ($(e.currentTarget).hasClass('down') && quantity != 1) $(e.currentTarget).siblings('.quantity').val(quantity - 1);
        if ($(e.currentTarget).hasClass('up')) {
          $(e.currentTarget).siblings('.quantity').val(quantity - -1);
        }
        $(e.currentTarget).siblings('.quantity').trigger('change');
      });
    }
  }, {
    key: "deleteCartItem",
    value: function deleteCartItem(element) {
      var productID = $(element).parents('.item').data('id');
      cart.deleteProduct(productID);
    }
  }, {
    key: "formatItems",
    value: function formatItems(items) {
      var _this = this;
      var out = "";
      items.forEach(function (item) {
        out += _this.formatItem(item);
      });
      return out;
    }
  }, {
    key: "quantityChangeListener",
    value: function quantityChangeListener() {
      $('#header .quantity').change(function (e) {
        var $this = $(e.target);
        var productID = $this.data('product-id');
        var quantity = $this.val();
        Cart.updateCart(productID, quantity, true);
      });
    }
  }, {
    key: "formatItem",
    value: function formatItem(item) {
      var out = "\n              <div class=\"item\" data-id=\"".concat(item.Product_ID, "\">\n                    <div class=\"photo-block\">\n                        <img src=\"").concat(item.ProductImageUrl, "\">\n                    </div>\n                    <div class=\"info-block\">\n                        <a href=\"").concat(projectVars.basePath, "/").concat(projectVars.url.product, "/").concat(item.slug, "\">").concat(item.ProductName, "</a>\n                        <div class=\"code\">K\xF3d zbo\u017E\xED: <span>").concat(item.ProductCode, "</span></div>\n                        <div class=\"").concat(item.TotalQuantityOnStock > 0 ? 'on-stock' : 'out-stock', " availability\">\n                        ").concat(item.TotalQuantityOnStock > 0 ? 'Skladem' : 'Není skladem', "\n                        </div>\n                    </div>\n                    <div class=\"quantity-block\">\n                        <span class=\"quantity-change down\">-</span>\n                        <input type=\"number\" value=\"").concat(item.Quantity, "\" data-product-id=\"").concat(item.Product_ID, "\" class=\"quantity\" maxlength=\"4\" min=\"1\" max=\"999\" step=\"1\">\n                        <span class=\"quantity-change up\">+</span>\n                    </div>\n\n                    <div class=\"price-block\">").concat(item.TotalPriceWithVat, "</div>\n                    <div class=\"remove-block\">\n                        <a href=\"javascript:;\" onclick=\"CartHeader.deleteCartItem(this)\">\n                            <span class=\"remove\">X</span>\n                        </a>\n                    </div>\n                </div> ");
      return out;
    }
  }]);
}();
//# sourceMappingURL=CartHeader.js.map
