function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Wishlist = /*#__PURE__*/function () {
  function Wishlist() {
    _classCallCheck(this, Wishlist);
    this.bindEvents();
  }
  return _createClass(Wishlist, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;
      $(function () {
        $('.add-to-wishlist').click(function (e) {
          var $this = $(e.target);
          var productID = $this.data('product-id');
          _this.updateWishList(productID);
        });
        $('.remove-from-wishlist').click(function (e) {
          var $this = $(e.target);
          var productID = $this.data('product-id');
          _this.deleteWishlistItem(productID);
          $this.parent('.item').parent('.col-lg-3').hide();
        });
      });
    }
  }, {
    key: "updateWishList",
    value: function updateWishList(productID) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      $.ajax({
        type: "POST",
        url: "/default/wishlist/update-wish-list",
        data: {
          ProductID: productID
        },
        success: function success(data) {
          var wishlistData = JSON.parse(data);
          // CartHeader.updateCartHeader(wishlistData.TotalPriceWithVat, wishlistData.TotalCount, wishlistData.cartItems);

          if (wishlistData.successMsg) alerts.alert('Hotovo', 'success', wishlistData.successMsg);
          if (wishlistData.failMsg) alerts.alert('Chyba', 'error', wishlistData.failMsg);

          /*if ( !assign )
              CartPrompt.addedToCart();*/

          if (callback) callback(wishlistData);
        }
      });
    }
  }, {
    key: "deleteWishlistItem",
    value: function deleteWishlistItem(productID) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      $.ajax({
        type: "POST",
        url: "/default/wishlist/delete-wish-list-item",
        data: {
          ProductID: productID
        }
        //     success: (data) => {
        //         let cartData = JSON.parse(data);
        //         CartHeader.updateCartHeader(cartData.TotalPriceWithVat, cartData.TotalCount, cartData.cartItems);
        //
        //         if ( callback )
        //             callback(cartData);
        //     },
      });
    }
  }]);
}();
//# sourceMappingURL=Wishlist.js.map
