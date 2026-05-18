function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Cart = /*#__PURE__*/function () {
  function Cart() {
    _classCallCheck(this, Cart);
    window.confirmDialog = null;
    this.bindEvents();
  }
  return _createClass(Cart, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;
      $(function () {
        $(document).on('click', '.cart-block button', /*#__PURE__*/function () {
          var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
            var $this, productID, quantity, stockCheck, _t;
            return _regenerator().w(function (_context) {
              while (1) switch (_context.p = _context.n) {
                case 0:
                  $this = $(e.target);
                  productID = $this.data('product-id');
                  quantity = $this.parent().parent().children().children('.quantity').val();
                  _context.p = 1;
                  _context.n = 2;
                  return Cart.checkProductStockQuantity(productID, quantity);
                case 2:
                  stockCheck = _context.v;
                  if (!stockCheck['QuantityDiff']) {
                    _context.n = 3;
                    break;
                  }
                  quantity = stockCheck['AllowedQuantity'];
                  _context.n = 3;
                  return Cart.displayWarningInfoAboutStock(stockCheck);
                case 3:
                  if (quantity > 0) {
                    Cart.updateCart(productID, quantity);
                  }
                  _context.n = 5;
                  break;
                case 4:
                  _context.p = 4;
                  _t = _context.v;
                  console.error(_t);
                case 5:
                  return _context.a(2);
              }
            }, _callee, null, [[1, 4]]);
          }));
          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }());

        // pridani do kosiku z wish listu
        $('#wish-list .add-to-cart').click(function (e) {
          var $this = $(e.target);
          var productID = $this.data('product-id');
          var quantity = 1;
          Cart.updateCart(productID, quantity);
          _this.flyToCart();
        });

        // pridani do kosiku z detailu produktu
        $('.cart-info .add-to-cart').click(/*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(e) {
            var $this, productID, quantity, cartMsg, stockCheck, _t2;
            return _regenerator().w(function (_context2) {
              while (1) switch (_context2.p = _context2.n) {
                case 0:
                  $this = $(e.target);
                  productID = $this.data('product-id');
                  quantity = $('.cart-info .quantity').val();
                  cartMsg = $('#cart-msg');
                  _context2.p = 1;
                  _context2.n = 2;
                  return Cart.checkProductStockQuantity(productID, quantity);
                case 2:
                  stockCheck = _context2.v;
                  if (!stockCheck['QuantityDiff']) {
                    _context2.n = 3;
                    break;
                  }
                  quantity = stockCheck['AllowedQuantity'];
                  _context2.n = 3;
                  return Cart.displayWarningInfoAboutStock(stockCheck);
                case 3:
                  _context2.n = 5;
                  break;
                case 4:
                  _context2.p = 4;
                  _t2 = _context2.v;
                  console.error(_t2);
                case 5:
                  if ($.isNumeric(quantity)) {
                    cartMsg.hide();
                    Cart.updateCart(productID, quantity, false, null);
                  } else {
                    cartMsg.show();
                    cartMsg.html('Musíte zadat číselnou hodnotu.');
                  }
                  _this.flyToCart();
                case 6:
                  return _context2.a(2);
              }
            }, _callee2, null, [[1, 4]]);
          }));
          return function (_x2) {
            return _ref2.apply(this, arguments);
          };
        }());
      });
    }
  }, {
    key: "deleteProduct",
    value: function deleteProduct(productID) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      $.ajax({
        type: "POST",
        url: "/default/cart/delete-cart-product",
        data: {
          ProductID: productID
        },
        success: function success(data) {
          var cartData = JSON.parse(data);
          CartHeader.updateCartHeader(cartData.TotalPriceWithVat, cartData.TotalCount, cartData.cartItems);
          if (callback) callback(cartData);
        }
      });
    }
  }, {
    key: "flyToCart",
    value: function flyToCart() {
      return;
      var cart = $('.header-cart-badge .cart-icon');
      var imgToDrag = $('.product-image .fancybox').find("img").eq(0);
      var imgWidth = imgToDrag.width();
      var imgHeight = imgToDrag.height();
      if (imgToDrag) {
        var imgClone = imgToDrag.clone().offset({
          top: imgToDrag.offset().top,
          left: imgToDrag.offset().left
        }).css({
          'opacity': '0.5',
          'position': 'absolute',
          'height': imgHeight + 'px',
          'width': imgWidth + 'px',
          'z-index': '100'
        }).appendTo($('body')).animate({
          'top': cart.offset().top + 10,
          'left': cart.offset().left + 10,
          'width': 75,
          'height': 75
        }, 1000, 'easeInOutExpo');

        // setTimeout(function () {
        //     cart.effect("shake", {
        //         times: 2
        //     }, 200);
        // }, 1500);

        imgClone.animate({
          'width': 0,
          'height': 0
        }, function () {
          $(this).detach();
        });
      }
    }
  }], [{
    key: "updateCart",
    value: function updateCart(productID, quantity) {
      var assign = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      $.ajax({
        type: "POST",
        url: "/default/cart/update-cart-product",
        data: {
          ProductID: productID,
          Quantity: quantity,
          Assign: assign
        },
        success: function success(data) {
          var cartData = JSON.parse(data);
          CartHeader.updateCartHeader(cartData.TotalPriceWithVat, cartData.TotalCount, cartData.cartItems);
          if (cartData.failMsg) {
            alerts.alert('Chyba', 'error', cartData.failMsg);
            if (cartData.totalQuantity) {
              var selector = ".item[data-product-id = ".concat(cartData.productID, "] .quantity");
              if ($(selector).length > 0) {
                $(selector).val($(selector).val() > cartData.totalQuantity ? cartData.totalQuantity : $(selector).val());
              }
            }
          }
          if (!assign) {
            window.confirmDialog = new Dialog();
            window.confirmDialog.modalClass = 'add-to-cart';
            window.confirmDialog.title = 'Produkt byl přidán do košíku';
            window.confirmDialog.openFromUrl(projectVars.basePath + '/modal/add-to-cart', {
              'Product_ID': productID,
              'Quantity': quantity
            });
          } else {
            if (cartData.successMsg) alerts.alert('Hotovo', 'success', cartData.successMsg);
          }

          /*if ( !assign )
              CartPrompt.addedToCart();*/

          if (callback) callback(cartData);
        }
      });
    }
  }, {
    key: "checkProductStockQuantity",
    value: function checkProductStockQuantity(productID, quantity) {
      return new Promise(function (resolve, reject) {
        $.ajax({
          type: "POST",
          url: "/default/cart/check-product-stock-quantity",
          data: {
            ProductID: productID,
            Quantity: quantity
          },
          success: function success(data) {
            var cartData = JSON.parse(data);
            resolve(cartData);
          },
          error: function error(xhr, status, _error) {
            reject(_error);
          }
        });
      });
    }
  }, {
    key: "displayWarningInfoAboutStock",
    value: function () {
      var _displayWarningInfoAboutStock = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(stockCheck) {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              if (this.dialog) {
                this.dialog.close();
              }
              this.dialog = new Dialog();
              this.dialog._title = 'Požadované množství není skladem';
              this.dialog._modalClass = 'cart-out-stock-info';
              _context3.n = 1;
              return this.dialog.openFromUrl(projectVars.basePath + '/modal/cart-out-stock-info', {
                stockCheck: stockCheck
              });
            case 1:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function displayWarningInfoAboutStock(_x3) {
        return _displayWarningInfoAboutStock.apply(this, arguments);
      }
      return displayWarningInfoAboutStock;
    }()
  }]);
}();
//# sourceMappingURL=Cart.js.map
