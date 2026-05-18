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
var ProductLayout = /*#__PURE__*/function () {
  function ProductLayout() {
    var _this = this;
    _classCallCheck(this, ProductLayout);
    $(function () {
      _this.bindEvents();
    });
    new Tabs('product-tabs');
  }
  return _createClass(ProductLayout, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      var me = this;
      $(".fancybox").fancybox({
        'speedIn': 0
      });
      this.inputControls(me);
      this.switchProductDetailBlock();
      window.onresize = function (event) {
        _this2.switchProductDetailBlock();
      };
      $('#button-price').click(function (e) {
        e.preventDefault();
      });
      if ($('.attribute-item').length) {
        me.disableAddToCartButton();
      }
      $('.attribute-item').click(function () {
        if (me.isAddToCartButtonDisabled()) {
          me.enableAddToCartButton();
        }
        me.handleProductAttributes(this);
      });
      $('.copy-current-product-link').click(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var url, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              url = $(this).data('url');
              _context.p = 1;
              _context.n = 2;
              return navigator.clipboard.writeText(url);
            case 2:
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              console.log(_t);
            case 4:
              return _context.a(2);
          }
        }, _callee, this, [[1, 3]]);
      })));
      if ($('.price-per-piece-block').length > 0) {
        var _me = this;
        $('.quantity').on('change', this.debounce(function () {
          _me.checkUnitPrice($('#product').data('id'), $(this).val());
        }, 1000));
      }
      new Watchdog();
    }
  }, {
    key: "switchProductDetailBlock",
    value: function switchProductDetailBlock() {
      if ($(window).width() < 992) {
        $(".desktop-visible .sticky").appendTo(".mobile-visible");
      } else {
        $(".mobile-visible .sticky").appendTo(".desktop-visible");
      }
    }
  }, {
    key: "isAddToCartButtonDisabled",
    value: function isAddToCartButtonDisabled() {
      return $('.add-to-cart').hasClass('disabled');
    }
  }, {
    key: "enableAddToCartButton",
    value: function enableAddToCartButton() {
      $('.add-to-cart').removeClass('disabled');
      $('.add-to-cart').removeAttr('disabled');
    }
  }, {
    key: "disableAddToCartButton",
    value: function disableAddToCartButton() {
      $('.add-to-cart').addClass('disabled');
      // $('.add-to-cart').attr("disabled", true);
    }
  }, {
    key: "debounce",
    value: function debounce(func, delay) {
      var timer;
      return function () {
        var _this3 = this;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        clearTimeout(timer);
        timer = setTimeout(function () {
          func.apply(_this3, args);
        }, delay);
      };
    }
  }, {
    key: "handleProductAttributes",
    value: function handleProductAttributes(context) {
      var paramID = $(context).data('paramId');
      var productParamID = $(context).data('productParamId');
      var paramValue = $(context).data('paramValue');
      $("#param-".concat(paramID)).html(paramValue);
      this.handleActiveClass(context);
      $('#selected-product-attributes').val("".concat(productParamID));
    }
  }, {
    key: "handleActiveClass",
    value: function handleActiveClass(context) {
      this.clearActiveClass();
      $(context).addClass('active');
    }
  }, {
    key: "inputControls",
    value: function inputControls(me) {
      $('.input-group').on('click', '.button-qty', function (e) {
        me.checkWhetherIncrOrDecr(e, me);
      });
    }
  }, {
    key: "checkUnitPrice",
    value: function checkUnitPrice(productID, quantity) {
      $.ajax({
        url: '/default/product/check-unit-price',
        data: {
          productID: productID,
          quantity: quantity
        },
        success: function success(data) {
          var response = JSON.parse(data);
          $('.price-block .with-vat').html(response.PriceWithVat + ' Kč');
          $('.price-block .without-vat').html(response.PriceWithoutVat + ' Kč bez DPH');
        }
      });
    }
  }, {
    key: "checkWhetherIncrOrDecr",
    value: function checkWhetherIncrOrDecr(e, me) {
      if (e.target.value === "+") {
        me.incrementInputValue(e);
        $("#finalPrice").trigger("change");
      } else {
        me.decrementInputValue(e);
        $("#finalPrice").trigger("change");
      }
    }
  }, {
    key: "incrementInputValue",
    value: function incrementInputValue(e) {
      e.preventDefault();
      var fieldName = $(e.target).data('field');
      var parent = $(e.target).closest('div');
      var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);
      if (!isNaN(currentVal)) {
        parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
      } else {
        parent.find('input[name=' + fieldName + ']').val(0);
      }
    }
  }, {
    key: "clearActiveClass",
    value: function clearActiveClass() {
      $('.attribute-item').removeClass('active');
    }
  }, {
    key: "decrementInputValue",
    value: function decrementInputValue(e) {
      e.preventDefault();
      var fieldName = $(e.target).data('field');
      var parent = $(e.target).closest('div');
      var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);
      if (!isNaN(currentVal) && currentVal > 0) {
        parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
      } else {
        parent.find('input[name=' + fieldName + ']').val(0);
      }
    }
  }]);
}();
//# sourceMappingURL=ProductLayout.js.map
