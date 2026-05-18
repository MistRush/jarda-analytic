function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var orderController = /*#__PURE__*/function () {
  function orderController() {
    _classCallCheck(this, orderController);
  }
  return _createClass(orderController, [{
    key: "step1Action",
    value: function step1Action() {
      window.orderAddress = new OrderAddress();
    }
  }, {
    key: "step2Action",
    value: function step2Action() {
      window.cartRecapitulation = new CartRecapitulation();
      window.shippingPayment = new ShippingPayment();
      window.completeOrder = new CompleteOrder();
    }
  }, {
    key: "step3Action",
    value: function step3Action() {
      if (Layout.checkCookieName(Layout.UTM_COOKIE)) {
        Layout.deleteCookie(Layout.UTM_COOKIE);
      }
      if (Layout.checkCookieName(Layout.REFERER_COOKIE)) {
        Layout.deleteCookie(Layout.REFERER_COOKIE);
      }
    }
  }]);
}();
//# sourceMappingURL=orderController.js.map
