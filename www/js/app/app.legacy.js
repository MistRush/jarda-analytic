function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Alerts = /*#__PURE__*/function () {
  function Alerts() {
    var _this = this;
    _classCallCheck(this, Alerts);
    $(function () {
      _this.stack = new PNotify.Stack({
        dir1: 'down',
        dir2: 'left',
        firstpos1: 25,
        firstpos2: 25,
        modal: false,
        maxOpen: Infinity,
        delay: 30000
      });
      _this.opts = {
        // addModelessClass: 'nonblock',
        styling: 'bootstrap4',
        icons: {
          prefix: 'fontawesome5',
          closer: 'fa fa-times'
        },
        closerHover: false,
        closer: true,
        sticker: false,
        stack: _this.stack,
        modules: PNotify.defaultModules
      };
    });
  }

  /**
   *
   * @param {string} title Titulek zprávy
   * @param {string} type Typ zprávy (success, error, notice, info)
   * @param {string} text Text zprávy
   */
  return _createClass(Alerts, [{
    key: "alert",
    value: function alert(title) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
      var text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      this.opts.title = title;
      this.opts.text = text;
      var notify = PNotify[type](this.opts);
      notify.on('click', function () {
        notify.close();
      });
    }
  }, {
    key: "error",
    value: function error() {
      this.alert('Error', 'error');
    }
  }, {
    key: "success",
    value: function success() {
      this.alert('Success', 'success');
    }
  }]);
}();
//# sourceMappingURL=Alerts.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
!function (t, e) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.PNotify = e() : t.PNotify = e();
}(window, function () {
  return function (t) {
    var e = {};
    function n(i) {
      if (e[i]) return e[i].exports;
      var o = e[i] = {
        i: i,
        l: !1,
        exports: {}
      };
      return t[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
    }
    return n.m = t, n.c = e, n.d = function (t, e, i) {
      n.o(t, e) || Object.defineProperty(t, e, {
        enumerable: !0,
        get: i
      });
    }, n.r = function (t) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(t, "__esModule", {
        value: !0
      });
    }, n.t = function (t, e) {
      if (1 & e && (t = n(t)), 8 & e) return t;
      if (4 & e && "object" == _typeof(t) && t && t.__esModule) return t;
      var i = Object.create(null);
      if (n.r(i), Object.defineProperty(i, "default", {
        enumerable: !0,
        value: t
      }), 2 & e && "string" != typeof t) for (var o in t) n.d(i, o, function (e) {
        return t[e];
      }.bind(null, o));
      return i;
    }, n.n = function (t) {
      var e = t && t.__esModule ? function () {
        return t["default"];
      } : function () {
        return t;
      };
      return n.d(e, "a", e), e;
    }, n.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }, n.p = "", n(n.s = 3);
  }([function (t, e, n) {},,, function (t, e, n) {
    "use strict";

    function i(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
      t.prototype = Object.create(e && e.prototype, {
        constructor: {
          value: t,
          writable: !0,
          configurable: !0
        }
      }), e && u(t, e);
    }
    function o(t) {
      return function () {
        var e,
          n = l(t);
        if (c()) {
          var i = l(this).constructor;
          Reflect.construct(n, arguments, i);
        } else n.apply(this, arguments);
        return r(this, e);
      };
    }
    function r(t, e) {
      return !e || "object" !== y(e) && "function" != typeof e ? function (t) {
        if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t;
      }(t) : e;
    }
    function s(t) {
      var e = "function" == typeof Map ? new Map() : void 0;
      return function (t) {
        if (null === t || (t, -1 === Function.toString.call(n).indexOf("[native code]"))) return t;
        var n;
        if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
        if (void 0 !== e) {
          if (e.has(t)) return e.get(t);
          e.set(t, i);
        }
        function i() {
          return a(t, arguments, l(this).constructor);
        }
        return i.prototype = Object.create(t.prototype, {
          constructor: {
            value: i,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        }), u(i, t);
      }(t);
    }
    function a(t, e, n) {
      return (c() ? Reflect.construct : function (t, e, n) {
        var i = [null];
        i.push.apply(i, e);
        var o = new (Function.bind.apply(t, i))();
        return n && u(o, n.prototype), o;
      }).apply(null, arguments);
    }
    function c() {
      if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
      if (Reflect.construct.sham) return !1;
      if ("function" == typeof Proxy) return !0;
      try {
        return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
      } catch (t) {
        return !1;
      }
    }
    function u(t, e) {
      return (Object.setPrototypeOf || function (t, e) {
        return t.__proto__ = e, t;
      })(t, e);
    }
    function l(t) {
      return (Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      })(t);
    }
    function f(t) {
      return function (t) {
        if (Array.isArray(t)) return d(t);
      }(t) || function (t) {
        if ("undefined" != typeof Symbol && Symbol.iterator in Object(t)) return Array.from(t);
      }(t) || function (t, e) {
        if (!t) return;
        if ("string" == typeof t) return d(t, e);
        var n = Object.prototype.toString.call(t).slice(8, -1);
        "Object" === n && t.constructor && (n = t.constructor.name);
        if ("Map" === n || "Set" === n) return Array.from(n);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return d(t, e);
      }(t) || function () {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }();
    }
    function d(t, e) {
      (null == e || e > t.length) && (e = t.length);
      for (var n = 0, i = new Array(e); n < e; n++) i[n] = t[n];
      return i;
    }
    function h(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }
    function p(t, e) {
      for (var n = 0; n < e.length; n++) {
        var i = e[n];
        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
      }
    }
    function m(t, e, n) {
      return e && p(t.prototype, e), n && p(t, n), t;
    }
    function y(t) {
      return (y = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }
    function v() {}
    n.r(e), n.d(e, "Stack", function () {
      return vt;
    }), n.d(e, "alert", function () {
      return ie;
    }), n.d(e, "notice", function () {
      return oe;
    }), n.d(e, "info", function () {
      return re;
    }), n.d(e, "success", function () {
      return se;
    }), n.d(e, "error", function () {
      return ae;
    }), n.d(e, "defaultStack", function () {
      return le;
    }), n.d(e, "defaultModules", function () {
      return fe;
    }), n.d(e, "defaults", function () {
      return de;
    });
    function g(t, e) {
      for (var n in e) t[n] = e[n];
      return t;
    }
    function $(t) {
      return t();
    }
    function _() {
      return Object.create(null);
    }
    function x(t) {
      t.forEach($);
    }
    function k(t) {
      return "function" == typeof t;
    }
    function b(t, e) {
      return t != t ? e == e : t !== e || t && "object" === y(t) || "function" == typeof t;
    }
    new Set();
    function w(t, e) {
      t.appendChild(e);
    }
    function O(t, e, n) {
      t.insertBefore(e, n || null);
    }
    function C(t) {
      t.parentNode.removeChild(t);
    }
    function M(t) {
      return document.createElement(t);
    }
    function T(t) {
      return document.createTextNode(t);
    }
    function S() {
      return T(" ");
    }
    function E() {
      return T("");
    }
    function H(t, e, n, i) {
      return t.addEventListener(e, n, i), function () {
        return t.removeEventListener(e, n, i);
      };
    }
    function j(t, e, n) {
      null == n ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
    }
    function N(t) {
      return Array.from(t.childNodes);
    }
    function A(t, e) {
      e = "" + e, t.data !== e && (t.data = e);
    }
    function P(t, e) {
      var n = document.createEvent("CustomEvent");
      return n.initCustomEvent(t, !1, !1, e), n;
    }
    var L,
      R = function () {
        function t(e) {
          var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
          h(this, t), this.e = M("div"), this.a = n, this.u(e);
        }
        return m(t, [{
          key: "m",
          value: function value(t) {
            for (var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null, n = 0; n < this.n.length; n += 1) O(t, this.n[n], e);
            this.t = t;
          }
        }, {
          key: "u",
          value: function value(t) {
            this.e.innerHTML = t, this.n = Array.from(this.e.childNodes);
          }
        }, {
          key: "p",
          value: function value(t) {
            this.d(), this.u(t), this.m(this.t, this.a);
          }
        }, {
          key: "d",
          value: function value() {
            this.n.forEach(C);
          }
        }]), t;
      }();
    new Set();
    function I(t) {
      L = t;
    }
    function D() {
      if (!L) throw new Error("Function called outside component initialization");
      return L;
    }
    function W(t, e) {
      var n = t.$$.callbacks[e.type];
      n && n.slice().forEach(function (t) {
        return t(e);
      });
    }
    var F = [],
      q = [],
      B = [],
      U = [],
      z = Promise.resolve(),
      G = !1;
    function J() {
      G || (G = !0, z.then(Y));
    }
    function K() {
      return J(), z;
    }
    function Q(t) {
      B.push(t);
    }
    var V = !1,
      X = new Set();
    function Y() {
      if (!V) {
        V = !0;
        do {
          for (var t = 0; t < F.length; t += 1) {
            var e = F[t];
            I(e), Z(e.$$);
          }
          for (F.length = 0; q.length;) q.pop()();
          for (var n = 0; n < B.length; n += 1) {
            var i = B[n];
            X.has(i) || (X.add(i), i());
          }
          B.length = 0;
        } while (F.length);
        for (; U.length;) U.pop()();
        G = !1, V = !1, X.clear();
      }
    }
    function Z(t) {
      if (null !== t.fragment) {
        t.update(), x(t.before_update);
        var e = t.dirty;
        t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(Q);
      }
    }
    var tt,
      et = new Set();
    function nt() {
      tt = {
        r: 0,
        c: [],
        p: tt
      };
    }
    function it() {
      tt.r || x(tt.c), tt = tt.p;
    }
    function ot(t, e) {
      t && t.i && (et["delete"](t), t.i(e));
    }
    function rt(t, e, n, i) {
      if (t && t.o) {
        if (et.has(t)) return;
        et.add(t), tt.c.push(function () {
          et["delete"](t), i && (n && t.d(1), i());
        }), t.o(e);
      }
    }
    var st = "undefined" != typeof window ? window : global;
    function at(t, e) {
      rt(t, 1, 1, function () {
        e["delete"](t.key);
      });
    }
    function ct(t, e, n, i, o, r, s, a, c, u, l, f) {
      for (var d = t.length, h = r.length, p = d, m = {}; p--;) m[t[p].key] = p;
      var y = [],
        v = new Map(),
        g = new Map();
      for (p = h; p--;) {
        var $ = f(o, r, p),
          _ = n($),
          x = s.get(_);
        x ? i && x.p($, e) : (x = u(_, $)).c(), v.set(_, y[p] = x), _ in m && g.set(_, Math.abs(p - m[_]));
      }
      var k = new Set(),
        b = new Set();
      function w(t) {
        ot(t, 1), t.m(a, l, s.has(t.key)), s.set(t.key, t), l = t.first, h--;
      }
      for (; d && h;) {
        var O = y[h - 1],
          C = t[d - 1],
          M = O.key,
          T = C.key;
        O === C ? (l = O.first, d--, h--) : v.has(T) ? !s.has(M) || k.has(M) ? w(O) : b.has(T) ? d-- : g.get(M) > g.get(T) ? (b.add(M), w(O)) : (k.add(T), d--) : (c(C, s), d--);
      }
      for (; d--;) {
        var S = t[d];
        v.has(S.key) || c(S, s);
      }
      for (; h;) w(y[h - 1]);
      return y;
    }
    function ut(t, e) {
      for (var n = {}, i = {}, o = {
          $$scope: 1
        }, r = t.length; r--;) {
        var s = t[r],
          a = e[r];
        if (a) {
          for (var c in s) c in a || (i[c] = 1);
          for (var u in a) o[u] || (n[u] = a[u], o[u] = 1);
          t[r] = a;
        } else for (var l in s) o[l] = 1;
      }
      for (var f in i) f in n || (n[f] = void 0);
      return n;
    }
    function lt(t) {
      return "object" === y(t) && null !== t ? t : {};
    }
    new Set(["allowfullscreen", "allowpaymentrequest", "async", "autofocus", "autoplay", "checked", "controls", "default", "defer", "disabled", "formnovalidate", "hidden", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "selected"]);
    function ft(t) {
      t && t.c();
    }
    function dt(t, e, n) {
      var i = t.$$,
        o = i.fragment,
        r = i.on_mount,
        s = i.on_destroy,
        a = i.after_update;
      o && o.m(e, n), Q(function () {
        var e = r.map($).filter(k);
        s ? s.push.apply(s, f(e)) : x(e), t.$$.on_mount = [];
      }), a.forEach(Q);
    }
    function ht(t, e) {
      var n = t.$$;
      null !== n.fragment && (x(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
    }
    function pt(t, e) {
      -1 === t.$$.dirty[0] && (F.push(t), J(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
    }
    "function" == typeof HTMLElement && HTMLElement;
    var mt = function () {
      function t() {
        h(this, t);
      }
      return m(t, [{
        key: "$destroy",
        value: function value() {
          ht(this, 1), this.$destroy = v;
        }
      }, {
        key: "$on",
        value: function value(t, e) {
          var n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
          return n.push(e), function () {
            var t = n.indexOf(e);
            -1 !== t && n.splice(t, 1);
          };
        }
      }, {
        key: "$set",
        value: function value() {}
      }]), t;
    }();
    function yt(t, e) {
      for (var n = 0; n < e.length; n++) {
        var i = e[n];
        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
      }
    }
    var vt = function () {
      function t(e) {
        if (function (t, e) {
          if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
        }(this, t), Object.assign(this, {
          dir1: null,
          dir2: null,
          firstpos1: null,
          firstpos2: null,
          spacing1: 25,
          spacing2: 25,
          push: "bottom",
          maxOpen: 1,
          maxStrategy: "wait",
          maxClosureCausesWait: !0,
          modal: "ish",
          modalishFlash: !0,
          overlayClose: !0,
          overlayClosesPinned: !1,
          context: window && document.body || null
        }, e), "ish" === this.modal && 1 !== this.maxOpen) throw new Error("A modalish stack must have a maxOpen value of 1.");
        if ("ish" === this.modal && !this.dir1) throw new Error("A modalish stack must have a direction.");
        if ("top" === this.push && "ish" === this.modal && "close" !== this.maxStrategy) throw new Error("A modalish stack that pushes to the top must use the close maxStrategy.");
        this._noticeHead = {
          notice: null,
          prev: null,
          next: null
        }, this._noticeTail = {
          notice: null,
          prev: this._noticeHead,
          next: null
        }, this._noticeHead.next = this._noticeTail, this._noticeMap = new WeakMap(), this._length = 0, this._addpos2 = 0, this._animation = !0, this._posTimer = null, this._openNotices = 0, this._listener = null, this._overlayOpen = !1, this._overlayInserted = !1, this._collapsingModalState = !1, this._leader = null, this._leaderOff = null, this._masking = null, this._maskingOff = null;
      }
      var e, n, i;
      return e = t, (n = [{
        key: "forEach",
        value: function value(t) {
          var e,
            n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            i = n.start,
            o = void 0 === i ? "oldest" : i,
            r = n.dir,
            s = void 0 === r ? "newer" : r,
            a = n.skipModuleHandled,
            c = void 0 !== a && a;
          if ("head" === o || "newest" === o && "top" === this.push || "oldest" === o && "bottom" === this.push) e = this._noticeHead.next;else if ("tail" === o || "newest" === o && "bottom" === this.push || "oldest" === o && "top" === this.push) e = this._noticeTail.prev;else {
            if (!this._noticeMap.has(o)) throw new Error("Invalid start param.");
            e = this._noticeMap.get(o);
          }
          for (; e.notice;) {
            var u = e.notice;
            if ("prev" === s || "top" === this.push && "newer" === s || "bottom" === this.push && "older" === s) e = e.prev;else {
              if (!("next" === s || "top" === this.push && "older" === s || "bottom" === this.push && "newer" === s)) throw new Error("Invalid dir param.");
              e = e.next;
            }
            if (!(c && u.getModuleHandled() || !1 !== t(u))) break;
          }
        }
      }, {
        key: "close",
        value: function value(t) {
          this.forEach(function (e) {
            return e.close(t, !1, !1);
          });
        }
      }, {
        key: "open",
        value: function value(t) {
          this.forEach(function (e) {
            return e.open(t);
          });
        }
      }, {
        key: "openLast",
        value: function value() {
          this.forEach(function (t) {
            if (-1 === ["opening", "open", "waiting"].indexOf(t.getState())) return t.open(), !1;
          }, {
            start: "newest",
            dir: "older"
          });
        }
      }, {
        key: "position",
        value: function value() {
          var t = this;
          this._length > 0 ? (this._resetPositionData(), this.forEach(function (e) {
            t._positionNotice(e);
          }, {
            start: "head",
            dir: "next",
            skipModuleHandled: !0
          })) : (delete this._nextpos1, delete this._nextpos2);
        }
      }, {
        key: "queuePosition",
        value: function value() {
          var t = this,
            e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 10;
          this._posTimer && clearTimeout(this._posTimer), this._posTimer = setTimeout(function () {
            return t.position();
          }, e);
        }
      }, {
        key: "_resetPositionData",
        value: function value() {
          this._nextpos1 = this.firstpos1, this._nextpos2 = this.firstpos2, this._addpos2 = 0;
        }
      }, {
        key: "_positionNotice",
        value: function value(t) {
          var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : t === this._masking,
            n = t.refs.elem;
          if (n && (n.classList.contains("pnotify-in") || n.classList.contains("pnotify-initial") || e)) {
            var i = [this.firstpos1, this.firstpos2, this._nextpos1, this._nextpos2, this._addpos2],
              o = i[0],
              r = i[1],
              s = i[2],
              a = i[3],
              c = i[4];
            n.getBoundingClientRect(), !this._animation || e || this._collapsingModalState ? t._setMoveClass("") : t._setMoveClass("pnotify-move");
            var u,
              l = this.context === document.body ? window.innerHeight : this.context.scrollHeight,
              f = this.context === document.body ? window.innerWidth : this.context.scrollWidth;
            if (this.dir1) {
              var d;
              switch (u = {
                down: "top",
                up: "bottom",
                left: "right",
                right: "left"
              }[this.dir1], this.dir1) {
                case "down":
                  d = n.offsetTop;
                  break;
                case "up":
                  d = l - n.scrollHeight - n.offsetTop;
                  break;
                case "left":
                  d = f - n.scrollWidth - n.offsetLeft;
                  break;
                case "right":
                  d = n.offsetLeft;
              }
              null == o && (s = o = d);
            }
            if (this.dir1 && this.dir2) {
              var h,
                p = {
                  down: "top",
                  up: "bottom",
                  left: "right",
                  right: "left"
                }[this.dir2];
              switch (this.dir2) {
                case "down":
                  h = n.offsetTop;
                  break;
                case "up":
                  h = l - n.scrollHeight - n.offsetTop;
                  break;
                case "left":
                  h = f - n.scrollWidth - n.offsetLeft;
                  break;
                case "right":
                  h = n.offsetLeft;
              }
              if (null == r && (a = r = h), !e) {
                var m = s + n.offsetHeight + this.spacing1,
                  y = s + n.offsetWidth + this.spacing1;
                (("down" === this.dir1 || "up" === this.dir1) && m > l || ("left" === this.dir1 || "right" === this.dir1) && y > f) && (s = o, a += c + this.spacing2, c = 0);
              }
              switch (null != a && (n.style[p] = "".concat(a, "px"), this._animation || n.style[p]), this.dir2) {
                case "down":
                case "up":
                  n.offsetHeight + (parseFloat(n.style.marginTop, 10) || 0) + (parseFloat(n.style.marginBottom, 10) || 0) > c && (c = n.offsetHeight);
                  break;
                case "left":
                case "right":
                  n.offsetWidth + (parseFloat(n.style.marginLeft, 10) || 0) + (parseFloat(n.style.marginRight, 10) || 0) > c && (c = n.offsetWidth);
              }
            } else if (this.dir1) {
              var v, g;
              switch (this.dir1) {
                case "down":
                case "up":
                  g = ["left", "right"], v = this.context.scrollWidth / 2 - n.offsetWidth / 2;
                  break;
                case "left":
                case "right":
                  g = ["top", "bottom"], v = l / 2 - n.offsetHeight / 2;
              }
              n.style[g[0]] = "".concat(v, "px"), n.style[g[1]] = "auto", this._animation || n.style[g[0]];
            }
            if (this.dir1) switch (null != s && (n.style[u] = "".concat(s, "px"), this._animation || n.style[u]), this.dir1) {
              case "down":
              case "up":
                s += n.offsetHeight + this.spacing1;
                break;
              case "left":
              case "right":
                s += n.offsetWidth + this.spacing1;
            } else {
              var $ = f / 2 - n.offsetWidth / 2,
                _ = l / 2 - n.offsetHeight / 2;
              n.style.left = "".concat($, "px"), n.style.top = "".concat(_, "px"), this._animation || n.style.left;
            }
            e || (this.firstpos1 = o, this.firstpos2 = r, this._nextpos1 = s, this._nextpos2 = a, this._addpos2 = c);
          }
        }
      }, {
        key: "_addNotice",
        value: function value(t) {
          var e = this,
            n = {
              notice: t,
              prev: null,
              next: null
            };
          if ("top" === this.push ? (n.next = this._noticeHead.next, n.prev = this._noticeHead, n.next.prev = n, n.prev.next = n) : (n.prev = this._noticeTail.prev, n.next = this._noticeTail, n.prev.next = n, n.next.prev = n), this._noticeMap.set(t, n), this._length++, this._listener || (this._listener = function () {
            return e.position();
          }, this.context.addEventListener("pnotify:position", this._listener)), -1 !== ["open", "opening", "closing"].indexOf(t.getState())) this._handleNoticeOpened(t);else if ("ish" === this.modal && this.modalishFlash && this._shouldNoticeWait()) var i = t.on("pnotify:mount", function () {
            i(), t._setMasking(!0, !1, function () {
              t._setMasking(!1);
            }), e._resetPositionData(), e._positionNotice(e._leader), window.requestAnimationFrame(function () {
              e._positionNotice(t, !0);
            });
          });
        }
      }, {
        key: "_removeNotice",
        value: function value(t) {
          if (this._noticeMap.has(t)) {
            var e = this._noticeMap.get(t);
            this._leader === t && this._setLeader(null), this._masking === t && this._setMasking(null), e.prev.next = e.next, e.next.prev = e.prev, e.prev = null, e.next = null, this._noticeMap["delete"](t), this._length--, !this._length && this._listener && (this.context.removeEventListener("pnotify:position", this._listener), this._listener = null), !this._length && this._overlayOpen && this._removeOverlay(), -1 !== ["open", "opening", "closing"].indexOf(t.getState()) && this._handleNoticeClosed(t);
          }
        }
      }, {
        key: "_setLeader",
        value: function value(t) {
          var e = this;
          if (this._leaderOff && (this._leaderOff(), this._leaderOff = null), this._leader = t, this._leader) {
            var n,
              i = function i() {
                var t = null;
                e._overlayOpen && (e._collapsingModalState = !0, e.forEach(function (n) {
                  n._preventTimerClose(!1), n !== e._leader && -1 !== ["opening", "open"].indexOf(n.getState()) && (t || (t = n), n.close(n === t, !1, !0));
                }, {
                  start: e._leader,
                  dir: "next",
                  skipModuleHandled: !0
                }), e._removeOverlay()), o && (clearTimeout(o), o = null), e.forEach(function (n) {
                  if (n !== e._leader) return "waiting" === n.getState() || n === t ? (e._setMasking(n, !!t), !1) : void 0;
                }, {
                  start: e._leader,
                  dir: "next",
                  skipModuleHandled: !0
                });
              },
              o = null,
              r = function r() {
                o && (clearTimeout(o), o = null), o = setTimeout(function () {
                  o = null, e._setMasking(null);
                }, 750);
              };
            this._leaderOff = (n = [this._leader.on("mouseenter", i), this._leader.on("focusin", i), this._leader.on("mouseleave", r), this._leader.on("focusout", r)], function () {
              return n.map(function (t) {
                return t();
              });
            });
          }
        }
      }, {
        key: "_setMasking",
        value: function value(t, e) {
          var n = this;
          if (this._masking) {
            if (this._masking === t) return;
            this._masking._setMasking(!1, e);
          }
          if (this._maskingOff && (this._maskingOff(), this._maskingOff = null), this._masking = t, this._masking) {
            this._resetPositionData(), this._leader && this._positionNotice(this._leader), this._masking._setMasking(!0, e), window.requestAnimationFrame(function () {
              n._masking && n._positionNotice(n._masking);
            });
            var i,
              o = function o() {
                "ish" === n.modal && (n._insertOverlay(), n._setMasking(null, !0), n.forEach(function (t) {
                  t._preventTimerClose(!0), "waiting" === t.getState() && t.open();
                }, {
                  start: n._leader,
                  dir: "next",
                  skipModuleHandled: !0
                }));
              };
            this._maskingOff = (i = [this._masking.on("mouseenter", o), this._masking.on("focusin", o)], function () {
              return i.map(function (t) {
                return t();
              });
            });
          }
        }
      }, {
        key: "_handleNoticeClosed",
        value: function value(t) {
          var e = this;
          if (!t.getModuleHandled()) {
            if (this._openNotices--, "ish" === this.modal && t === this._leader && (this._setLeader(null), this._masking && this._setMasking(null)), this.maxOpen !== 1 / 0 && this._openNotices < this.maxOpen) {
              var n = function n(t) {
                if ("waiting" === t.getState() && (t.open(), e._openNotices >= e.maxOpen)) return !1;
              };
              "wait" === this.maxStrategy ? this.forEach(n, {
                start: t,
                dir: "next"
              }) : "close" === this.maxStrategy && this.maxClosureCausesWait && this.forEach(n, {
                start: t,
                dir: "older"
              });
            }
            this._openNotices <= 0 ? (this._openNotices = 0, this._overlayOpen && this._removeOverlay()) : this._collapsingModalState || this.queuePosition(0);
          }
        }
      }, {
        key: "_handleNoticeOpened",
        value: function value(t) {
          var e = this;
          if (!t.getModuleHandled()) {
            if (this._openNotices++, ("ish" !== this.modal || !this._overlayOpen) && this.maxOpen !== 1 / 0 && this._openNotices > this.maxOpen && "close" === this.maxStrategy) {
              var n = this._openNotices - this.maxOpen;
              this.forEach(function (t) {
                if (-1 !== ["opening", "open"].indexOf(t.getState())) return t.close(!1, !1, e.maxClosureCausesWait), t === e._leader && e._setLeader(null), !! --n;
              });
            }
            !0 === this.modal && this._insertOverlay(), "ish" !== this.modal || this._leader && -1 !== ["opening", "open", "closing"].indexOf(this._leader.getState()) || this._setLeader(t), "ish" === this.modal && this._overlayOpen && t._preventTimerClose(!0);
          }
        }
      }, {
        key: "_shouldNoticeWait",
        value: function value() {
          return !("ish" === this.modal && this._overlayOpen) && this.maxOpen !== 1 / 0 && this._openNotices >= this.maxOpen && "wait" === this.maxStrategy;
        }
      }, {
        key: "_insertOverlay",
        value: function value() {
          var t = this;
          this._overlay || (this._overlay = document.createElement("div"), this._overlay.classList.add("pnotify-modal-overlay"), this.dir1 && this._overlay.classList.add("pnotify-modal-overlay-".concat(this.dir1)), this.overlayClose && this._overlay.classList.add("pnotify-modal-overlay-closes"), this.context !== document.body && (this._overlay.style.height = "".concat(this.context.scrollHeight, "px"), this._overlay.style.width = "".concat(this.context.scrollWidth, "px")), this._overlay.addEventListener("click", function () {
            t.overlayClose && (t._leader && t._setLeader(null), t.forEach(function (e) {
              -1 === ["closed", "closing", "waiting"].indexOf(e.getState()) && (e.hide || t.overlayClosesPinned ? e.close() : e.hide || "ish" !== t.modal || (t._leader ? e.close(!1, !1, !0) : t._setLeader(e)));
            }, {
              skipModuleHandled: !0
            }), t._overlayOpen && t._removeOverlay());
          })), this._overlay.parentNode !== this.context && (this._overlay.classList.remove("pnotify-modal-overlay-in"), this._overlay = this.context.insertBefore(this._overlay, this.context.firstChild), this._overlayOpen = !0, this._overlayInserted = !0, window.requestAnimationFrame(function () {
            t._overlay.classList.add("pnotify-modal-overlay-in");
          })), this._collapsingModalState = !1;
        }
      }, {
        key: "_removeOverlay",
        value: function value() {
          var t = this;
          this._overlay.parentNode && (this._overlay.classList.remove("pnotify-modal-overlay-in"), this._overlayOpen = !1, setTimeout(function () {
            t._overlayInserted = !1, t._overlay.parentNode && t._overlay.parentNode.removeChild(t._overlay);
          }, 250), setTimeout(function () {
            t._collapsingModalState = !1;
          }, 400));
        }
      }, {
        key: "notices",
        get: function get() {
          var t = [];
          return this.forEach(function (e) {
            return t.push(e);
          }), t;
        }
      }, {
        key: "length",
        get: function get() {
          return this._length;
        }
      }, {
        key: "leader",
        get: function get() {
          return this._leader;
        }
      }]) && yt(e.prototype, n), i && yt(e, i), t;
    }();
    function gt(t, e, n) {
      return (gt = $t() ? Reflect.construct : function (t, e, n) {
        var i = [null];
        i.push.apply(i, e);
        var o = new (Function.bind.apply(t, i))();
        return n && _t(o, n.prototype), o;
      }).apply(null, arguments);
    }
    function $t() {
      if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
      if (Reflect.construct.sham) return !1;
      if ("function" == typeof Proxy) return !0;
      try {
        return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
      } catch (t) {
        return !1;
      }
    }
    function _t(t, e) {
      return (_t = Object.setPrototypeOf || function (t, e) {
        return t.__proto__ = e, t;
      })(t, e);
    }
    var xt = function xt() {
      for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
      return gt(ye, e);
    };
    function kt(t) {
      return function (t) {
        if (Array.isArray(t)) return bt(t);
      }(t) || function (t) {
        if ("undefined" != typeof Symbol && Symbol.iterator in Object(t)) return Array.from(t);
      }(t) || function (t, e) {
        if (!t) return;
        if ("string" == typeof t) return bt(t, e);
        var n = Object.prototype.toString.call(t).slice(8, -1);
        "Object" === n && t.constructor && (n = t.constructor.name);
        if ("Map" === n || "Set" === n) return Array.from(n);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return bt(t, e);
      }(t) || function () {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }();
    }
    function bt(t, e) {
      (null == e || e > t.length) && (e = t.length);
      for (var n = 0, i = new Array(e); n < e; n++) i[n] = t[n];
      return i;
    }
    n(0);
    function wt(t, e) {
      for (var n = 0; n < e.length; n++) {
        var i = e[n];
        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
      }
    }
    function Ot(t, e) {
      return (Ot = Object.setPrototypeOf || function (t, e) {
        return t.__proto__ = e, t;
      })(t, e);
    }
    function Ct(t, e) {
      return !e || "object" !== Pt(e) && "function" != typeof e ? Mt(t) : e;
    }
    function Mt(t) {
      if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return t;
    }
    function Tt() {
      if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
      if (Reflect.construct.sham) return !1;
      if ("function" == typeof Proxy) return !0;
      try {
        return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
      } catch (t) {
        return !1;
      }
    }
    function St(t) {
      return (St = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      })(t);
    }
    function Et(t, e) {
      return function (t) {
        if (Array.isArray(t)) return t;
      }(t) || function (t, e) {
        if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(t))) return;
        var n = [],
          i = !0,
          o = !1,
          r = void 0;
        try {
          for (var s, a = t[Symbol.iterator](); !(i = (s = a.next()).done) && (n.push(s.value), !e || n.length !== e); i = !0);
        } catch (t) {
          o = !0, r = t;
        } finally {
          try {
            i || null == a["return"] || a["return"]();
          } finally {
            if (o) throw r;
          }
        }
        return n;
      }(t, e) || function (t, e) {
        if (!t) return;
        if ("string" == typeof t) return Ht(t, e);
        var n = Object.prototype.toString.call(t).slice(8, -1);
        "Object" === n && t.constructor && (n = t.constructor.name);
        if ("Map" === n || "Set" === n) return Array.from(n);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Ht(t, e);
      }(t, e) || function () {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }();
    }
    function Ht(t, e) {
      (null == e || e > t.length) && (e = t.length);
      for (var n = 0, i = new Array(e); n < e; n++) i[n] = t[n];
      return i;
    }
    function jt(t, e) {
      var n = Object.keys(t);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(t);
        e && (i = i.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })), n.push.apply(n, i);
      }
      return n;
    }
    function Nt(t) {
      for (var e = 1; e < arguments.length; e++) {
        var n = null != arguments[e] ? arguments[e] : {};
        e % 2 ? jt(Object(n), !0).forEach(function (e) {
          At(t, e, n[e]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : jt(Object(n)).forEach(function (e) {
          Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e));
        });
      }
      return t;
    }
    function At(t, e, n) {
      return e in t ? Object.defineProperty(t, e, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }) : t[e] = n, t;
    }
    function Pt(t) {
      return (Pt = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }
    var Lt = st.Map;
    function Rt(t, e, n) {
      var i = t.slice();
      return i[106] = e[n][0], i[107] = e[n][1], i;
    }
    function It(t, e, n) {
      var i = t.slice();
      return i[106] = e[n][0], i[107] = e[n][1], i;
    }
    function Dt(t, e, n) {
      var i = t.slice();
      return i[106] = e[n][0], i[107] = e[n][1], i;
    }
    function Wt(t, e, n) {
      var i = t.slice();
      return i[106] = e[n][0], i[107] = e[n][1], i;
    }
    function Ft(t, e) {
      var n,
        i,
        _o,
        r = [{
          self: e[41]
        }, e[107]],
        s = e[106]["default"];
      function a(t) {
        for (var e = {}, n = 0; n < r.length; n += 1) e = g(e, r[n]);
        return {
          props: e
        };
      }
      if (s) var _c = new s(a());
      return {
        key: t,
        first: null,
        c: function c() {
          n = E(), _c && ft(_c.$$.fragment), i = E(), this.first = n;
        },
        m: function m(t, e) {
          O(t, n, e), _c && dt(_c, t, e), O(t, i, e), _o = !0;
        },
        p: function p(t, e) {
          var n = 1088 & e[1] ? ut(r, [1024 & e[1] && {
            self: t[41]
          }, 64 & e[1] && lt(t[107])]) : {};
          if (s !== (s = t[106]["default"])) {
            if (_c) {
              nt();
              var o = _c;
              rt(o.$$.fragment, 1, 0, function () {
                ht(o, 1);
              }), it();
            }
            s ? (ft((_c = new s(a())).$$.fragment), ot(_c.$$.fragment, 1), dt(_c, i.parentNode, i)) : _c = null;
          } else s && _c.$set(n);
        },
        i: function i(t) {
          _o || (_c && ot(_c.$$.fragment, t), _o = !0);
        },
        o: function o(t) {
          _c && rt(_c.$$.fragment, t), _o = !1;
        },
        d: function d(t) {
          t && C(n), t && C(i), _c && ht(_c, t);
        }
      };
    }
    function qt(t) {
      var e, n, i, o, r;
      return {
        c: function c() {
          e = M("div"), j(n = M("span"), "class", t[21]("closer")), j(e, "class", i = "pnotify-closer ".concat(t[20]("closer"), " ").concat(!t[16] || t[25] ? "" : "pnotify-hidden")), j(e, "role", "button"), j(e, "tabindex", "0"), j(e, "title", o = t[19].close);
        },
        m: function m(i, o, s) {
          O(i, e, o), w(e, n), s && r(), r = H(e, "click", t[98]);
        },
        p: function p(t, n) {
          33619968 & n[0] && i !== (i = "pnotify-closer ".concat(t[20]("closer"), " ").concat(!t[16] || t[25] ? "" : "pnotify-hidden")) && j(e, "class", i), 524288 & n[0] && o !== (o = t[19].close) && j(e, "title", o);
        },
        d: function d(t) {
          t && C(e), r();
        }
      };
    }
    function Bt(t) {
      var e, n, i, o, r, s, a;
      return {
        c: function c() {
          e = M("div"), j(n = M("span"), "class", i = "".concat(t[21]("sticker"), " ").concat(t[1] ? t[21]("unstuck") : t[21]("stuck"))), j(e, "class", o = "pnotify-sticker ".concat(t[20]("sticker"), " ").concat(!t[18] || t[25] ? "" : "pnotify-hidden")), j(e, "role", "button"), j(e, "aria-pressed", r = !t[1]), j(e, "tabindex", "0"), j(e, "title", s = t[1] ? t[19].stick : t[19].unstick);
        },
        m: function m(i, o, r) {
          O(i, e, o), w(e, n), r && a(), a = H(e, "click", t[99]);
        },
        p: function p(t, a) {
          2 & a[0] && i !== (i = "".concat(t[21]("sticker"), " ").concat(t[1] ? t[21]("unstuck") : t[21]("stuck"))) && j(n, "class", i), 33816576 & a[0] && o !== (o = "pnotify-sticker ".concat(t[20]("sticker"), " ").concat(!t[18] || t[25] ? "" : "pnotify-hidden")) && j(e, "class", o), 2 & a[0] && r !== (r = !t[1]) && j(e, "aria-pressed", r), 524290 & a[0] && s !== (s = t[1] ? t[19].stick : t[19].unstick) && j(e, "title", s);
        },
        d: function d(t) {
          t && C(e), a();
        }
      };
    }
    function Ut(t) {
      var e, n, i;
      return {
        c: function c() {
          e = M("div"), j(n = M("span"), "class", i = !0 === t[11] ? t[21](t[2]) : t[11]), j(e, "class", "pnotify-icon ".concat(t[20]("icon")));
        },
        m: function m(i, o) {
          O(i, e, o), w(e, n), t[100](e);
        },
        p: function p(t, e) {
          2052 & e[0] && i !== (i = !0 === t[11] ? t[21](t[2]) : t[11]) && j(n, "class", i);
        },
        d: function d(n) {
          n && C(e), t[100](null);
        }
      };
    }
    function zt(t, e) {
      var n,
        i,
        _o2,
        r = [{
          self: e[41]
        }, e[107]],
        s = e[106]["default"];
      function a(t) {
        for (var e = {}, n = 0; n < r.length; n += 1) e = g(e, r[n]);
        return {
          props: e
        };
      }
      if (s) var _c2 = new s(a());
      return {
        key: t,
        first: null,
        c: function c() {
          n = E(), _c2 && ft(_c2.$$.fragment), i = E(), this.first = n;
        },
        m: function m(t, e) {
          O(t, n, e), _c2 && dt(_c2, t, e), O(t, i, e), _o2 = !0;
        },
        p: function p(t, e) {
          var n = 1152 & e[1] ? ut(r, [1024 & e[1] && {
            self: t[41]
          }, 128 & e[1] && lt(t[107])]) : {};
          if (s !== (s = t[106]["default"])) {
            if (_c2) {
              nt();
              var o = _c2;
              rt(o.$$.fragment, 1, 0, function () {
                ht(o, 1);
              }), it();
            }
            s ? (ft((_c2 = new s(a())).$$.fragment), ot(_c2.$$.fragment, 1), dt(_c2, i.parentNode, i)) : _c2 = null;
          } else s && _c2.$set(n);
        },
        i: function i(t) {
          _o2 || (_c2 && ot(_c2.$$.fragment, t), _o2 = !0);
        },
        o: function o(t) {
          _c2 && rt(_c2.$$.fragment, t), _o2 = !1;
        },
        d: function d(t) {
          t && C(n), t && C(i), _c2 && ht(_c2, t);
        }
      };
    }
    function Gt(t) {
      var e,
        n = !t[32] && Jt(t);
      return {
        c: function c() {
          e = M("div"), n && n.c(), j(e, "class", "pnotify-title ".concat(t[20]("title")));
        },
        m: function m(i, o) {
          O(i, e, o), n && n.m(e, null), t[101](e);
        },
        p: function p(t, i) {
          t[32] ? n && (n.d(1), n = null) : n ? n.p(t, i) : ((n = Jt(t)).c(), n.m(e, null));
        },
        d: function d(i) {
          i && C(e), n && n.d(), t[101](null);
        }
      };
    }
    function Jt(t) {
      var e;
      function n(t, e) {
        return t[4] ? Qt : Kt;
      }
      var i = n(t),
        o = i(t);
      return {
        c: function c() {
          o.c(), e = E();
        },
        m: function m(t, n) {
          o.m(t, n), O(t, e, n);
        },
        p: function p(t, r) {
          i === (i = n(t)) && o ? o.p(t, r) : (o.d(1), (o = i(t)) && (o.c(), o.m(e.parentNode, e)));
        },
        d: function d(t) {
          o.d(t), t && C(e);
        }
      };
    }
    function Kt(t) {
      var e, n;
      return {
        c: function c() {
          e = M("span"), n = T(t[3]), j(e, "class", "pnotify-pre-line");
        },
        m: function m(t, i) {
          O(t, e, i), w(e, n);
        },
        p: function p(t, e) {
          8 & e[0] && A(n, t[3]);
        },
        d: function d(t) {
          t && C(e);
        }
      };
    }
    function Qt(t) {
      var e;
      return {
        c: function c() {
          e = new R(t[3], null);
        },
        m: function m(t, n) {
          e.m(t, n);
        },
        p: function p(t, n) {
          8 & n[0] && e.p(t[3]);
        },
        d: function d(t) {
          t && e.d();
        }
      };
    }
    function Vt(t) {
      var e,
        n = !t[33] && Xt(t);
      return {
        c: function c() {
          e = M("div"), n && n.c(), j(e, "class", "pnotify-text ".concat(t[20]("text"))), j(e, "style", t[31]), j(e, "role", "alert");
        },
        m: function m(i, o) {
          O(i, e, o), n && n.m(e, null), t[102](e);
        },
        p: function p(t, i) {
          t[33] ? n && (n.d(1), n = null) : n ? n.p(t, i) : ((n = Xt(t)).c(), n.m(e, null)), 1 & i[1] && j(e, "style", t[31]);
        },
        d: function d(i) {
          i && C(e), n && n.d(), t[102](null);
        }
      };
    }
    function Xt(t) {
      var e;
      function n(t, e) {
        return t[6] ? Zt : Yt;
      }
      var i = n(t),
        o = i(t);
      return {
        c: function c() {
          o.c(), e = E();
        },
        m: function m(t, n) {
          o.m(t, n), O(t, e, n);
        },
        p: function p(t, r) {
          i === (i = n(t)) && o ? o.p(t, r) : (o.d(1), (o = i(t)) && (o.c(), o.m(e.parentNode, e)));
        },
        d: function d(t) {
          o.d(t), t && C(e);
        }
      };
    }
    function Yt(t) {
      var e, n;
      return {
        c: function c() {
          e = M("span"), n = T(t[5]), j(e, "class", "pnotify-pre-line");
        },
        m: function m(t, i) {
          O(t, e, i), w(e, n);
        },
        p: function p(t, e) {
          32 & e[0] && A(n, t[5]);
        },
        d: function d(t) {
          t && C(e);
        }
      };
    }
    function Zt(t) {
      var e;
      return {
        c: function c() {
          e = new R(t[5], null);
        },
        m: function m(t, n) {
          e.m(t, n);
        },
        p: function p(t, n) {
          32 & n[0] && e.p(t[5]);
        },
        d: function d(t) {
          t && e.d();
        }
      };
    }
    function te(t, e) {
      var n,
        i,
        _o3,
        r = [{
          self: e[41]
        }, e[107]],
        s = e[106]["default"];
      function a(t) {
        for (var e = {}, n = 0; n < r.length; n += 1) e = g(e, r[n]);
        return {
          props: e
        };
      }
      if (s) var _c3 = new s(a());
      return {
        key: t,
        first: null,
        c: function c() {
          n = E(), _c3 && ft(_c3.$$.fragment), i = E(), this.first = n;
        },
        m: function m(t, e) {
          O(t, n, e), _c3 && dt(_c3, t, e), O(t, i, e), _o3 = !0;
        },
        p: function p(t, e) {
          var n = 1280 & e[1] ? ut(r, [1024 & e[1] && {
            self: t[41]
          }, 256 & e[1] && lt(t[107])]) : {};
          if (s !== (s = t[106]["default"])) {
            if (_c3) {
              nt();
              var o = _c3;
              rt(o.$$.fragment, 1, 0, function () {
                ht(o, 1);
              }), it();
            }
            s ? (ft((_c3 = new s(a())).$$.fragment), ot(_c3.$$.fragment, 1), dt(_c3, i.parentNode, i)) : _c3 = null;
          } else s && _c3.$set(n);
        },
        i: function i(t) {
          _o3 || (_c3 && ot(_c3.$$.fragment, t), _o3 = !0);
        },
        o: function o(t) {
          _c3 && rt(_c3.$$.fragment, t), _o3 = !1;
        },
        d: function d(t) {
          t && C(n), t && C(i), _c3 && ht(_c3, t);
        }
      };
    }
    function ee(t, e) {
      var n,
        i,
        _o4,
        r = [{
          self: e[41]
        }, e[107]],
        s = e[106]["default"];
      function a(t) {
        for (var e = {}, n = 0; n < r.length; n += 1) e = g(e, r[n]);
        return {
          props: e
        };
      }
      if (s) var _c4 = new s(a());
      return {
        key: t,
        first: null,
        c: function c() {
          n = E(), _c4 && ft(_c4.$$.fragment), i = E(), this.first = n;
        },
        m: function m(t, e) {
          O(t, n, e), _c4 && dt(_c4, t, e), O(t, i, e), _o4 = !0;
        },
        p: function p(t, e) {
          var n = 1536 & e[1] ? ut(r, [1024 & e[1] && {
            self: t[41]
          }, 512 & e[1] && lt(t[107])]) : {};
          if (s !== (s = t[106]["default"])) {
            if (_c4) {
              nt();
              var o = _c4;
              rt(o.$$.fragment, 1, 0, function () {
                ht(o, 1);
              }), it();
            }
            s ? (ft((_c4 = new s(a())).$$.fragment), ot(_c4.$$.fragment, 1), dt(_c4, i.parentNode, i)) : _c4 = null;
          } else s && _c4.$set(n);
        },
        i: function i(t) {
          _o4 || (_c4 && ot(_c4.$$.fragment, t), _o4 = !0);
        },
        o: function o(t) {
          _c4 && rt(_c4.$$.fragment, t), _o4 = !1;
        },
        d: function d(t) {
          t && C(n), t && C(i), _c4 && ht(_c4, t);
        }
      };
    }
    function ne(t) {
      for (var e, n, i, o, r, s, a, _c5, u, l, f, d, h, _p, _m, y, g = [], $ = new Lt(), _ = [], b = new Lt(), T = [], E = new Lt(), N = [], A = new Lt(), P = t[37], L = function L(t) {
          return t[106];
        }, R = 0; R < P.length; R += 1) {
        var I = Wt(t, P, R),
          D = L(I);
        $.set(D, g[R] = Ft(D, I));
      }
      for (var W = t[15] && !t[35] && qt(t), F = t[17] && !t[35] && Bt(t), q = !1 !== t[11] && Ut(t), B = t[38], U = function U(t) {
          return t[106];
        }, z = 0; z < B.length; z += 1) {
        var G = Dt(t, B, z),
          J = U(G);
        b.set(J, _[z] = zt(J, G));
      }
      for (var K = !1 !== t[3] && Gt(t), Q = !1 !== t[5] && Vt(t), V = t[39], X = function X(t) {
          return t[106];
        }, Y = 0; Y < V.length; Y += 1) {
        var Z = It(t, V, Y),
          tt = X(Z);
        E.set(tt, T[Y] = te(tt, Z));
      }
      for (var et = t[40], st = function st(t) {
          return t[106];
        }, ut = 0; ut < et.length; ut += 1) {
        var lt = Rt(t, et, ut),
          ft = st(lt);
        A.set(ft, N[ut] = ee(ft, lt));
      }
      return {
        c: function c() {
          e = M("div"), n = M("div");
          for (var m = 0; m < g.length; m += 1) g[m].c();
          i = S(), W && W.c(), o = S(), F && F.c(), r = S(), q && q.c(), s = S(), a = M("div");
          for (var y = 0; y < _.length; y += 1) _[y].c();
          _c5 = S(), K && K.c(), u = S(), Q && Q.c(), l = S();
          for (var v = 0; v < T.length; v += 1) T[v].c();
          f = S();
          for (var $ = 0; $ < N.length; $ += 1) N[$].c();
          j(a, "class", "pnotify-content ".concat(t[20]("content"))), j(n, "class", d = "pnotify-container ".concat(t[20]("container"), " ").concat(t[20](t[2]), " ").concat(t[14] ? "pnotify-shadow" : "", " ").concat(t[26].container.join(" "))), j(n, "style", h = "".concat(t[29], " ").concat(t[30])), j(n, "role", "alert"), j(e, "data-pnotify", ""), j(e, "class", _p = "pnotify ".concat(!1 !== t[11] ? "pnotify-with-icon" : "", " ").concat(t[20]("elem"), " pnotify-mode-").concat(t[7], " ").concat(t[8], " ").concat(t[23], " ").concat(t[24], " ").concat(t[36], " ").concat("fade" === t[12] ? "pnotify-fade-".concat(t[13]) : "", " ").concat(t[34] ? "pnotify-modal ".concat(t[9]) : t[10], " ").concat(t[27] ? "pnotify-masking" : "", " ").concat(t[28] ? "pnotify-masking-in" : "", " ").concat(t[26].elem.join(" "))), j(e, "aria-live", "assertive"), j(e, "role", "alertdialog");
        },
        m: function m(d, h, p) {
          O(d, e, h), w(e, n);
          for (var $ = 0; $ < g.length; $ += 1) g[$].m(n, null);
          w(n, i), W && W.m(n, null), w(n, o), F && F.m(n, null), w(n, r), q && q.m(n, null), w(n, s), w(n, a);
          for (var b = 0; b < _.length; b += 1) _[b].m(a, null);
          w(a, _c5), K && K.m(a, null), w(a, u), Q && Q.m(a, null), w(a, l);
          for (var C = 0; C < T.length; C += 1) T[C].m(a, null);
          t[103](a), w(n, f);
          for (var M = 0; M < N.length; M += 1) N[M].m(n, null);
          var S;
          t[104](n), t[105](e), _m = !0, p && x(y), y = [(S = t[42].call(null, e), S && k(S.destroy) ? S.destroy : v), H(e, "mouseenter", t[43]), H(e, "mouseleave", t[44]), H(e, "focusin", t[43]), H(e, "focusout", t[44])];
        },
        p: function p(t, f) {
          if (1088 & f[1]) {
            var y = t[37];
            nt(), g = ct(g, f, L, 1, t, y, $, n, at, Ft, i, Wt), it();
          }
          if (t[15] && !t[35] ? W ? W.p(t, f) : ((W = qt(t)).c(), W.m(n, o)) : W && (W.d(1), W = null), t[17] && !t[35] ? F ? F.p(t, f) : ((F = Bt(t)).c(), F.m(n, r)) : F && (F.d(1), F = null), !1 !== t[11] ? q ? q.p(t, f) : ((q = Ut(t)).c(), q.m(n, s)) : q && (q.d(1), q = null), 1152 & f[1]) {
            var v = t[38];
            nt(), _ = ct(_, f, U, 1, t, v, b, a, at, zt, _c5, Dt), it();
          }
          if (!1 !== t[3] ? K ? K.p(t, f) : ((K = Gt(t)).c(), K.m(a, u)) : K && (K.d(1), K = null), !1 !== t[5] ? Q ? Q.p(t, f) : ((Q = Vt(t)).c(), Q.m(a, l)) : Q && (Q.d(1), Q = null), 1280 & f[1]) {
            var x = t[39];
            nt(), T = ct(T, f, X, 1, t, x, E, a, at, te, null, It), it();
          }
          if (1536 & f[1]) {
            var k = t[40];
            nt(), N = ct(N, f, st, 1, t, k, A, n, at, ee, null, Rt), it();
          }
          (!_m || 67125252 & f[0] && d !== (d = "pnotify-container ".concat(t[20]("container"), " ").concat(t[20](t[2]), " ").concat(t[14] ? "pnotify-shadow" : "", " ").concat(t[26].container.join(" ")))) && j(n, "class", d), (!_m || 1610612736 & f[0] && h !== (h = "".concat(t[29], " ").concat(t[30]))) && j(n, "style", h), (!_m || 494944128 & f[0] | 40 & f[1] && _p !== (_p = "pnotify ".concat(!1 !== t[11] ? "pnotify-with-icon" : "", " ").concat(t[20]("elem"), " pnotify-mode-").concat(t[7], " ").concat(t[8], " ").concat(t[23], " ").concat(t[24], " ").concat(t[36], " ").concat("fade" === t[12] ? "pnotify-fade-".concat(t[13]) : "", " ").concat(t[34] ? "pnotify-modal ".concat(t[9]) : t[10], " ").concat(t[27] ? "pnotify-masking" : "", " ").concat(t[28] ? "pnotify-masking-in" : "", " ").concat(t[26].elem.join(" ")))) && j(e, "class", _p);
        },
        i: function i(t) {
          if (!_m) {
            for (var e = 0; e < P.length; e += 1) ot(g[e]);
            for (var n = 0; n < B.length; n += 1) ot(_[n]);
            for (var i = 0; i < V.length; i += 1) ot(T[i]);
            for (var o = 0; o < et.length; o += 1) ot(N[o]);
            _m = !0;
          }
        },
        o: function o(t) {
          for (var e = 0; e < g.length; e += 1) rt(g[e]);
          for (var n = 0; n < _.length; n += 1) rt(_[n]);
          for (var i = 0; i < T.length; i += 1) rt(T[i]);
          for (var o = 0; o < N.length; o += 1) rt(N[o]);
          _m = !1;
        },
        d: function d(n) {
          n && C(e);
          for (var i = 0; i < g.length; i += 1) g[i].d();
          W && W.d(), F && F.d(), q && q.d();
          for (var o = 0; o < _.length; o += 1) _[o].d();
          K && K.d(), Q && Q.d();
          for (var r = 0; r < T.length; r += 1) T[r].d();
          t[103](null);
          for (var s = 0; s < N.length; s += 1) N[s].d();
          t[104](null), t[105](null), x(y);
        }
      };
    }
    var ie = function ie(t) {
        return xt(ce(t));
      },
      oe = function oe(t) {
        return xt(ce(t, "notice"));
      },
      re = function re(t) {
        return xt(ce(t, "info"));
      },
      se = function se(t) {
        return xt(ce(t, "success"));
      },
      ae = function ae(t) {
        return xt(ce(t, "error"));
      };
    function ce(t, e) {
      "object" !== Pt(t) && (t = {
        text: t
      }), e && (t.type = e);
      var n = document.body;
      return "stack" in t && t.stack && t.stack.context && (n = t.stack.context), {
        target: n,
        props: t
      };
    }
    var ue,
      le = new vt({
        dir1: "down",
        dir2: "left",
        firstpos1: 25,
        firstpos2: 25,
        spacing1: 36,
        spacing2: 36,
        push: "bottom"
      }),
      fe = new Map(),
      de = {
        type: "notice",
        title: !1,
        titleTrusted: !1,
        text: !1,
        textTrusted: !1,
        styling: "brighttheme",
        icons: "brighttheme",
        mode: "no-preference",
        addClass: "",
        addModalClass: "",
        addModelessClass: "",
        autoOpen: !0,
        width: "360px",
        minHeight: "16px",
        maxTextHeight: "200px",
        icon: !0,
        animation: "fade",
        animateSpeed: "normal",
        shadow: !0,
        hide: !0,
        delay: 8e3,
        mouseReset: !0,
        closer: !0,
        closerHover: !0,
        sticker: !0,
        stickerHover: !0,
        labels: {
          close: "Close",
          stick: "Pin",
          unstick: "Unpin"
        },
        remove: !0,
        destroy: !0,
        stack: le,
        modules: fe
      };
    function he() {
      le.context || (le.context = document.body), window.addEventListener("resize", function () {
        ue && clearTimeout(ue), ue = setTimeout(function () {
          var t = new Event("pnotify:position");
          document.body.dispatchEvent(t), ue = null;
        }, 10);
      });
    }
    function pe(t, e, n) {
      var i,
        o = D(),
        r = (i = D(), function (t, e) {
          var n = i.$$.callbacks[t];
          if (n) {
            var o = P(t, e);
            n.slice().forEach(function (t) {
              t.call(i, o);
            });
          }
        }),
        s = function (t) {
          var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
            n = ["focus", "blur", "fullscreenchange", "fullscreenerror", "scroll", "cut", "copy", "paste", "keydown", "keypress", "keyup", "auxclick", "click", "contextmenu", "dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "pointerlockchange", "pointerlockerror", "select", "wheel", "drag", "dragend", "dragenter", "dragstart", "dragleave", "dragover", "drop", "touchcancel", "touchend", "touchmove", "touchstart", "pointerover", "pointerenter", "pointerdown", "pointermove", "pointerup", "pointercancel", "pointerout", "pointerleave", "gotpointercapture", "lostpointercapture"].concat(kt(e));
          function i(e) {
            W(t, e);
          }
          return function (t) {
            for (var e = [], o = 0; o < n.length; o++) e.push(H(t, n[o], i));
            return {
              destroy: function destroy() {
                for (var t = 0; t < e.length; t++) e[t]();
              }
            };
          };
        }(o, ["pnotify:init", "pnotify:mount", "pnotify:update", "pnotify:beforeOpen", "pnotify:afterOpen", "pnotify:enterModal", "pnotify:leaveModal", "pnotify:beforeClose", "pnotify:afterClose", "pnotify:beforeDestroy", "pnotify:afterDestroy", "focusin", "focusout", "animationend", "transitionend"]),
        a = e.modules,
        c = void 0 === a ? new Map(de.modules) : a,
        u = e.stack,
        l = void 0 === u ? de.stack : u,
        f = {
          elem: null,
          container: null,
          content: null,
          iconContainer: null,
          titleContainer: null,
          textContainer: null
        },
        d = Nt({}, de);
      zt("init", {
        notice: o,
        defaults: d
      });
      var h,
        p = e.type,
        m = void 0 === p ? d.type : p,
        y = e.title,
        v = void 0 === y ? d.title : y,
        g = e.titleTrusted,
        $ = void 0 === g ? d.titleTrusted : g,
        _ = e.text,
        x = void 0 === _ ? d.text : _,
        k = e.textTrusted,
        b = void 0 === k ? d.textTrusted : k,
        w = e.styling,
        O = void 0 === w ? d.styling : w,
        C = e.icons,
        M = void 0 === C ? d.icons : C,
        T = e.mode,
        S = void 0 === T ? d.mode : T,
        E = e.addClass,
        j = void 0 === E ? d.addClass : E,
        N = e.addModalClass,
        A = void 0 === N ? d.addModalClass : N,
        L = e.addModelessClass,
        R = void 0 === L ? d.addModelessClass : L,
        I = e.autoOpen,
        F = void 0 === I ? d.autoOpen : I,
        B = e.width,
        U = void 0 === B ? d.width : B,
        z = e.minHeight,
        G = void 0 === z ? d.minHeight : z,
        J = e.maxTextHeight,
        Q = void 0 === J ? d.maxTextHeight : J,
        V = e.icon,
        X = void 0 === V ? d.icon : V,
        Y = e.animation,
        Z = void 0 === Y ? d.animation : Y,
        tt = e.animateSpeed,
        et = void 0 === tt ? d.animateSpeed : tt,
        nt = e.shadow,
        it = void 0 === nt ? d.shadow : nt,
        ot = e.hide,
        rt = void 0 === ot ? d.hide : ot,
        st = e.delay,
        at = void 0 === st ? d.delay : st,
        ct = e.mouseReset,
        ut = void 0 === ct ? d.mouseReset : ct,
        lt = e.closer,
        ft = void 0 === lt ? d.closer : lt,
        dt = e.closerHover,
        ht = void 0 === dt ? d.closerHover : dt,
        pt = e.sticker,
        mt = void 0 === pt ? d.sticker : pt,
        yt = e.stickerHover,
        vt = void 0 === yt ? d.stickerHover : yt,
        gt = e.labels,
        $t = void 0 === gt ? d.labels : gt,
        _t = e.remove,
        xt = void 0 === _t ? d.remove : _t,
        bt = e.destroy,
        wt = void 0 === bt ? d.destroy : bt,
        Ot = "closed",
        Ct = null,
        Mt = null,
        Tt = null,
        St = !1,
        Ht = "",
        jt = "",
        At = !1,
        Pt = !1,
        Lt = {
          elem: [],
          container: []
        },
        Rt = !1,
        It = !1,
        Dt = !1,
        Wt = !1,
        Ft = null,
        qt = rt,
        Bt = NaN,
        Ut = !1;
      function zt(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = Nt({
            notice: o
          }, e);
        "init" === t && Array.from(c).forEach(function (t) {
          var e = Et(t, 2),
            i = e[0];
          e[1];
          return "init" in i && i.init(n);
        });
        var i = f.elem || l && l.context || document.body;
        if (!i) return r("pnotify:".concat(t), n), !0;
        var s = new Event("pnotify:".concat(t), {
          bubbles: "init" === t || "mount" === t,
          cancelable: t.startsWith("before")
        });
        return s.detail = n, i.dispatchEvent(s), !s.defaultPrevented;
      }
      function Gt() {
        var t = l && l.context || document.body;
        if (!t) throw new Error("No context to insert this notice into.");
        if (!f.elem) throw new Error("Trying to insert notice before element is available.");
        f.elem.parentNode !== t && t.appendChild(f.elem);
      }
      function Jt() {
        f.elem && f.elem.parentNode.removeChild(f.elem);
      }
      h = function h() {
        zt("mount"), F && Qt();
      }, D().$$.on_mount.push(h), function (t) {
        D().$$.before_update.push(t);
      }(function () {
        zt("update"), "closed" !== Ot && "waiting" !== Ot && rt !== qt && (rt ? qt || ie() : ne()), "closed" !== Ot && "closing" !== Ot && l && !l._collapsingModalState && l.queuePosition(), qt = rt;
      });
      var Kt = e.open,
        Qt = void 0 === Kt ? function (t) {
          if ("opening" !== Ot) if ("open" !== Ot) {
            if (!Rt && l && l._shouldNoticeWait()) n(81, Ot = "waiting");else if (zt("beforeOpen", {
              immediate: t
            })) {
              n(81, Ot = "opening"), n(27, Dt = !1), n(23, Ht = "pnotify-initial pnotify-hidden");
              var e = function e() {
                rt && ie(), n(81, Ot = "open"), zt("afterOpen", {
                  immediate: t
                });
              };
              l && l._handleNoticeOpened(o), It ? e() : (Gt(), window.requestAnimationFrame(function () {
                "opening" === Ot && (l && (n(45, l._animation = !1, l), "top" === l.push && l._resetPositionData(), l._positionNotice(o), l.queuePosition(0), n(45, l._animation = !0, l)), Zt(e, t));
              }));
            }
          } else rt && ie();
        } : Kt,
        Vt = e.close,
        Xt = void 0 === Vt ? function (t, e, i) {
          if ("closing" !== Ot && "closed" !== Ot) {
            var r = function r() {
              zt("beforeDestroy") && (l && l._removeNotice(o), o.$destroy(), zt("afterDestroy"));
            };
            if ("waiting" === Ot) {
              if (i) return;
              return n(81, Ot = "closed"), void (wt && !i && r());
            }
            zt("beforeClose", {
              immediate: t,
              timerHide: e,
              waitAfterward: i
            }) && (n(81, Ot = "closing"), At = !!e, Ct && "prevented" !== Ct && clearTimeout && clearTimeout(Ct), n(82, Ct = null), ee(function () {
              n(25, Pt = !1), At = !1, n(81, Ot = i ? "waiting" : "closed"), zt("afterClose", {
                immediate: t,
                timerHide: e,
                waitAfterward: i
              }), l && l._handleNoticeClosed(o), wt && !i ? r() : xt && !i && Jt();
            }, t));
          }
        } : Vt,
        Yt = e.animateIn,
        Zt = void 0 === Yt ? function (t, e) {
          St = "in";
          var i = function e(n) {
            if (!(n && f.elem && n.target !== f.elem || (f.elem && f.elem.removeEventListener("transitionend", e), Mt && clearTimeout(Mt), "in" !== St))) {
              var i = It;
              if (!i && f.elem) {
                var o = f.elem.getBoundingClientRect();
                for (var r in o) if (o[r] > 0) {
                  i = !0;
                  break;
                }
              }
              i ? (t && t.call(), St = !1) : Mt = setTimeout(e, 40);
            }
          };
          "fade" !== Z || e ? (n(23, Ht = "pnotify-in"), K().then(function () {
            i();
          })) : (f.elem && f.elem.addEventListener("transitionend", i), n(23, Ht = "pnotify-in"), K().then(function () {
            n(23, Ht = "pnotify-in pnotify-fade-in"), Mt = setTimeout(i, 650);
          }));
        } : Yt,
        te = e.animateOut,
        ee = void 0 === te ? function (t, e) {
          St = "out";
          var i = function e(i) {
            if (!(i && f.elem && i.target !== f.elem || (f.elem && f.elem.removeEventListener("transitionend", e), Tt && clearTimeout(Tt), "out" !== St))) {
              var o = It;
              if (!o && f.elem) {
                var r = f.elem.getBoundingClientRect();
                for (var s in r) if (r[s] > 0) {
                  o = !0;
                  break;
                }
              }
              f.elem && f.elem.style.opacity && "0" !== f.elem.style.opacity && o ? Tt = setTimeout(e, 40) : (n(23, Ht = ""), t && t.call(), St = !1);
            }
          };
          "fade" !== Z || e ? (n(23, Ht = ""), K().then(function () {
            i();
          })) : (f.elem && f.elem.addEventListener("transitionend", i), n(23, Ht = "pnotify-in"), Tt = setTimeout(i, 650));
        } : te;
      function ne() {
        Ct && "prevented" !== Ct && (clearTimeout(Ct), n(82, Ct = null)), Tt && clearTimeout(Tt), "closing" === Ot && (n(81, Ot = "open"), St = !1, n(23, Ht = "fade" === Z ? "pnotify-in pnotify-fade-in" : "pnotify-in"));
      }
      function ie() {
        "prevented" !== Ct && (ne(), at !== 1 / 0 && n(82, Ct = setTimeout(function () {
          return Xt(!1, !0);
        }, isNaN(at) ? 0 : at)));
      }
      var oe, re, se, ae, ce, ue, le, fe, he, pe, me, ye;
      return t.$set = function (t) {
        "modules" in t && n(46, c = t.modules), "stack" in t && n(45, l = t.stack), "type" in t && n(2, m = t.type), "title" in t && n(3, v = t.title), "titleTrusted" in t && n(4, $ = t.titleTrusted), "text" in t && n(5, x = t.text), "textTrusted" in t && n(6, b = t.textTrusted), "styling" in t && n(47, O = t.styling), "icons" in t && n(48, M = t.icons), "mode" in t && n(7, S = t.mode), "addClass" in t && n(8, j = t.addClass), "addModalClass" in t && n(9, A = t.addModalClass), "addModelessClass" in t && n(10, R = t.addModelessClass), "autoOpen" in t && n(49, F = t.autoOpen), "width" in t && n(50, U = t.width), "minHeight" in t && n(51, G = t.minHeight), "maxTextHeight" in t && n(52, Q = t.maxTextHeight), "icon" in t && n(11, X = t.icon), "animation" in t && n(12, Z = t.animation), "animateSpeed" in t && n(13, et = t.animateSpeed), "shadow" in t && n(14, it = t.shadow), "hide" in t && n(1, rt = t.hide), "delay" in t && n(53, at = t.delay), "mouseReset" in t && n(54, ut = t.mouseReset), "closer" in t && n(15, ft = t.closer), "closerHover" in t && n(16, ht = t.closerHover), "sticker" in t && n(17, mt = t.sticker), "stickerHover" in t && n(18, vt = t.stickerHover), "labels" in t && n(19, $t = t.labels), "remove" in t && n(55, xt = t.remove), "destroy" in t && n(56, wt = t.destroy), "open" in t && n(59, Qt = t.open), "close" in t && n(22, Xt = t.close), "animateIn" in t && n(60, Zt = t.animateIn), "animateOut" in t && n(61, ee = t.animateOut);
      }, t.$$.update = function () {
        524288 & t.$$.dirty[1] && n(29, oe = "string" == typeof U ? "width: ".concat(U, ";") : ""), 1048576 & t.$$.dirty[1] && n(30, re = "string" == typeof G ? "min-height: ".concat(G, ";") : ""), 2097152 & t.$$.dirty[1] && n(31, se = "string" == typeof Q ? "max-height: ".concat(Q, "; overflow-y: auto; overscroll-behavior: contain; padding-bottom:.03em;") : ""), 8 & t.$$.dirty[0] && n(32, ae = v instanceof HTMLElement), 32 & t.$$.dirty[0] && n(33, ce = x instanceof HTMLElement), 16384 & t.$$.dirty[1] | 1572864 & t.$$.dirty[2] && n(34, ue = l && (!0 === l.modal || "ish" === l.modal && "prevented" === Ct) && -1 !== ["open", "opening", "closing"].indexOf(Ot)), 1792 & t.$$.dirty[0] | 8 & t.$$.dirty[1] && n(35, le = j.match(/\bnonblock\b/) || A.match(/\bnonblock\b/) && ue || R.match(/\bnonblock\b/) && !ue), 16384 & t.$$.dirty[1] && n(36, fe = l && l.dir1 ? "pnotify-stack-".concat(l.dir1) : ""), 32768 & t.$$.dirty[1] && n(37, he = Array.from(c).filter(function (t) {
          var e = Et(t, 2),
            n = e[0];
          e[1];
          return "PrependContainer" === n.position;
        })), 32768 & t.$$.dirty[1] && n(38, pe = Array.from(c).filter(function (t) {
          var e = Et(t, 2),
            n = e[0];
          e[1];
          return "PrependContent" === n.position;
        })), 32768 & t.$$.dirty[1] && n(39, me = Array.from(c).filter(function (t) {
          var e = Et(t, 2),
            n = e[0];
          e[1];
          return "AppendContent" === n.position;
        })), 32768 & t.$$.dirty[1] && n(40, ye = Array.from(c).filter(function (t) {
          var e = Et(t, 2),
            n = e[0];
          e[1];
          return "AppendContainer" === n.position;
        })), 9 & t.$$.dirty[0] | 2 & t.$$.dirty[1] && ae && f.titleContainer && f.titleContainer.appendChild(v), 33 & t.$$.dirty[0] | 4 & t.$$.dirty[1] && ce && f.textContainer && f.textContainer.appendChild(x), 16384 & t.$$.dirty[1] | 536870912 & t.$$.dirty[2] && Bt !== l && (Bt && Bt._removeNotice(o), l && l._addNotice(o), n(91, Bt = l)), 8 & t.$$.dirty[1] | 1073741824 & t.$$.dirty[2] && Ut !== ue && (zt(ue ? "enterModal" : "leaveModal"), n(92, Ut = ue));
      }, [f, rt, m, v, $, x, b, S, j, A, R, X, Z, et, it, ft, ht, mt, vt, $t, function (t) {
        return "string" == typeof O ? "".concat(O, "-").concat(t) : t in O ? O[t] : "".concat(O.prefix, "-").concat(t);
      }, function (t) {
        return "string" == typeof M ? "".concat(M, "-icon-").concat(t) : t in M ? M[t] : "".concat(M.prefix, "-icon-").concat(t);
      }, Xt, Ht, jt, Pt, Lt, Dt, Wt, oe, re, se, ae, ce, ue, le, fe, he, pe, me, ye, o, s, function (t) {
        if (n(25, Pt = !0), ut && "closing" === Ot) {
          if (!At) return;
          ne();
        }
        rt && ut && ne();
      }, function (t) {
        n(25, Pt = !1), rt && ut && "out" !== St && ie();
      }, l, c, O, M, F, U, G, Q, at, ut, xt, wt, function () {
        return Ot;
      }, function () {
        return Ct;
      }, Qt, Zt, ee, ne, ie, function (t) {
        t ? (ne(), n(82, Ct = "prevented")) : "prevented" === Ct && (n(82, Ct = null), "open" === Ot && rt && ie());
      }, function () {
        return o.$on.apply(o, arguments);
      }, function () {
        return o.$set.apply(o, arguments);
      }, function (t, e) {
        r(t, e);
      }, function (t) {
        for (var e = 0; e < (arguments.length <= 1 ? 0 : arguments.length - 1); e++) {
          var i = e + 1 < 1 || arguments.length <= e + 1 ? void 0 : arguments[e + 1];
          -1 === Lt[t].indexOf(i) && Lt[t].push(i);
        }
        n(26, Lt);
      }, function (t) {
        for (var e = 0; e < (arguments.length <= 1 ? 0 : arguments.length - 1); e++) {
          var i = e + 1 < 1 || arguments.length <= e + 1 ? void 0 : arguments[e + 1],
            o = Lt[t].indexOf(i);
          -1 !== o && Lt[t].splice(o, 1);
        }
        n(26, Lt);
      }, function (t) {
        for (var e = 0; e < (arguments.length <= 1 ? 0 : arguments.length - 1); e++) {
          var n = e + 1 < 1 || arguments.length <= e + 1 ? void 0 : arguments[e + 1];
          if (-1 === Lt[t].indexOf(n)) return !1;
        }
        return !0;
      }, function () {
        return Rt;
      }, function (t) {
        return Rt = t;
      }, function () {
        return It;
      }, function (t) {
        return It = t;
      }, function (t) {
        return St = t;
      }, function () {
        return Ht;
      }, function (t) {
        return n(23, Ht = t);
      }, function () {
        return jt;
      }, function (t) {
        return n(24, jt = t);
      }, function (t, e, i) {
        if (Ft && clearTimeout(Ft), Dt !== t) if (t) n(27, Dt = !0), n(28, Wt = !!e), Gt(), K().then(function () {
          window.requestAnimationFrame(function () {
            if (Dt) if (e && i) i();else {
              n(28, Wt = !0);
              var t = function t() {
                f.elem && f.elem.removeEventListener("transitionend", t), Ft && clearTimeout(Ft), Wt && i && i();
              };
              f.elem && f.elem.addEventListener("transitionend", t), Ft = setTimeout(t, 650);
            }
          });
        });else if (e) n(27, Dt = !1), n(28, Wt = !1), xt && -1 === ["open", "opening", "closing"].indexOf(Ot) && Jt(), i && i();else {
          var o = function t() {
            f.elem && f.elem.removeEventListener("transitionend", t), Ft && clearTimeout(Ft), Wt || (n(27, Dt = !1), xt && -1 === ["open", "opening", "closing"].indexOf(Ot) && Jt(), i && i());
          };
          n(28, Wt = !1), f.elem && f.elem.addEventListener("transitionend", o), f.elem && f.elem.style.opacity, Ft = setTimeout(o, 650);
        }
      }, Ot, Ct, Mt, Tt, St, At, Rt, It, Ft, qt, Bt, Ut, r, d, zt, Gt, Jt, function () {
        return Xt(!1);
      }, function () {
        return n(1, rt = !rt);
      }, function (t) {
        q[t ? "unshift" : "push"](function () {
          f.iconContainer = t, n(0, f);
        });
      }, function (t) {
        q[t ? "unshift" : "push"](function () {
          f.titleContainer = t, n(0, f);
        });
      }, function (t) {
        q[t ? "unshift" : "push"](function () {
          f.textContainer = t, n(0, f);
        });
      }, function (t) {
        q[t ? "unshift" : "push"](function () {
          f.content = t, n(0, f);
        });
      }, function (t) {
        q[t ? "unshift" : "push"](function () {
          f.container = t, n(0, f);
        });
      }, function (t) {
        q[t ? "unshift" : "push"](function () {
          f.elem = t, n(0, f);
        });
      }];
    }
    window && document.body ? he() : document.addEventListener("DOMContentLoaded", he);
    var me = function (t) {
        !function (t, e) {
          if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
          t.prototype = Object.create(e && e.prototype, {
            constructor: {
              value: t,
              writable: !0,
              configurable: !0
            }
          }), e && Ot(t, e);
        }(s, t);
        var e,
          n,
          i,
          o,
          r = (e = s, function () {
            var t,
              n = St(e);
            if (Tt()) {
              var i = St(this).constructor;
              t = Reflect.construct(n, arguments, i);
            } else t = n.apply(this, arguments);
            return Ct(this, t);
          });
        function s(t) {
          var e;
          return function (t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
          }(this, s), function (t, e, n, i, o, r) {
            var s = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : [-1],
              a = L;
            I(t);
            var c = e.props || {},
              u = t.$$ = {
                fragment: null,
                ctx: null,
                props: r,
                update: v,
                not_equal: o,
                bound: _(),
                on_mount: [],
                on_destroy: [],
                before_update: [],
                after_update: [],
                context: new Map(a ? a.$$.context : []),
                callbacks: _(),
                dirty: s
              },
              l = !1;
            if (u.ctx = n ? n(t, c, function (e, n) {
              var i = !(arguments.length <= 2) && arguments.length - 2 ? arguments.length <= 2 ? void 0 : arguments[2] : n;
              return u.ctx && o(u.ctx[e], u.ctx[e] = i) && (u.bound[e] && u.bound[e](i), l && pt(t, e)), n;
            }) : [], u.update(), l = !0, x(u.before_update), u.fragment = !!i && i(u.ctx), e.target) {
              if (e.hydrate) {
                var f = N(e.target);
                u.fragment && u.fragment.l(f), f.forEach(C);
              } else u.fragment && u.fragment.c();
              e.intro && ot(t.$$.fragment), dt(t, e.target, e.anchor), Y();
            }
            I(a);
          }(Mt(e = r.call(this)), t, pe, ne, b, {
            modules: 46,
            stack: 45,
            refs: 0,
            type: 2,
            title: 3,
            titleTrusted: 4,
            text: 5,
            textTrusted: 6,
            styling: 47,
            icons: 48,
            mode: 7,
            addClass: 8,
            addModalClass: 9,
            addModelessClass: 10,
            autoOpen: 49,
            width: 50,
            minHeight: 51,
            maxTextHeight: 52,
            icon: 11,
            animation: 12,
            animateSpeed: 13,
            shadow: 14,
            hide: 1,
            delay: 53,
            mouseReset: 54,
            closer: 15,
            closerHover: 16,
            sticker: 17,
            stickerHover: 18,
            labels: 19,
            remove: 55,
            destroy: 56,
            getState: 57,
            getTimer: 58,
            getStyle: 20,
            getIcon: 21,
            open: 59,
            close: 22,
            animateIn: 60,
            animateOut: 61,
            cancelClose: 62,
            queueClose: 63,
            _preventTimerClose: 64,
            on: 65,
            update: 66,
            fire: 67,
            addModuleClass: 68,
            removeModuleClass: 69,
            hasModuleClass: 70,
            getModuleHandled: 71,
            setModuleHandled: 72,
            getModuleOpen: 73,
            setModuleOpen: 74,
            setAnimating: 75,
            getAnimatingClass: 76,
            setAnimatingClass: 77,
            _getMoveClass: 78,
            _setMoveClass: 79,
            _setMasking: 80
          }, [-1, -1, -1, -1]), e;
        }
        return n = s, (i = [{
          key: "modules",
          get: function get() {
            return this.$$.ctx[46];
          },
          set: function set(t) {
            this.$set({
              modules: t
            }), Y();
          }
        }, {
          key: "stack",
          get: function get() {
            return this.$$.ctx[45];
          },
          set: function set(t) {
            this.$set({
              stack: t
            }), Y();
          }
        }, {
          key: "refs",
          get: function get() {
            return this.$$.ctx[0];
          }
        }, {
          key: "type",
          get: function get() {
            return this.$$.ctx[2];
          },
          set: function set(t) {
            this.$set({
              type: t
            }), Y();
          }
        }, {
          key: "title",
          get: function get() {
            return this.$$.ctx[3];
          },
          set: function set(t) {
            this.$set({
              title: t
            }), Y();
          }
        }, {
          key: "titleTrusted",
          get: function get() {
            return this.$$.ctx[4];
          },
          set: function set(t) {
            this.$set({
              titleTrusted: t
            }), Y();
          }
        }, {
          key: "text",
          get: function get() {
            return this.$$.ctx[5];
          },
          set: function set(t) {
            this.$set({
              text: t
            }), Y();
          }
        }, {
          key: "textTrusted",
          get: function get() {
            return this.$$.ctx[6];
          },
          set: function set(t) {
            this.$set({
              textTrusted: t
            }), Y();
          }
        }, {
          key: "styling",
          get: function get() {
            return this.$$.ctx[47];
          },
          set: function set(t) {
            this.$set({
              styling: t
            }), Y();
          }
        }, {
          key: "icons",
          get: function get() {
            return this.$$.ctx[48];
          },
          set: function set(t) {
            this.$set({
              icons: t
            }), Y();
          }
        }, {
          key: "mode",
          get: function get() {
            return this.$$.ctx[7];
          },
          set: function set(t) {
            this.$set({
              mode: t
            }), Y();
          }
        }, {
          key: "addClass",
          get: function get() {
            return this.$$.ctx[8];
          },
          set: function set(t) {
            this.$set({
              addClass: t
            }), Y();
          }
        }, {
          key: "addModalClass",
          get: function get() {
            return this.$$.ctx[9];
          },
          set: function set(t) {
            this.$set({
              addModalClass: t
            }), Y();
          }
        }, {
          key: "addModelessClass",
          get: function get() {
            return this.$$.ctx[10];
          },
          set: function set(t) {
            this.$set({
              addModelessClass: t
            }), Y();
          }
        }, {
          key: "autoOpen",
          get: function get() {
            return this.$$.ctx[49];
          },
          set: function set(t) {
            this.$set({
              autoOpen: t
            }), Y();
          }
        }, {
          key: "width",
          get: function get() {
            return this.$$.ctx[50];
          },
          set: function set(t) {
            this.$set({
              width: t
            }), Y();
          }
        }, {
          key: "minHeight",
          get: function get() {
            return this.$$.ctx[51];
          },
          set: function set(t) {
            this.$set({
              minHeight: t
            }), Y();
          }
        }, {
          key: "maxTextHeight",
          get: function get() {
            return this.$$.ctx[52];
          },
          set: function set(t) {
            this.$set({
              maxTextHeight: t
            }), Y();
          }
        }, {
          key: "icon",
          get: function get() {
            return this.$$.ctx[11];
          },
          set: function set(t) {
            this.$set({
              icon: t
            }), Y();
          }
        }, {
          key: "animation",
          get: function get() {
            return this.$$.ctx[12];
          },
          set: function set(t) {
            this.$set({
              animation: t
            }), Y();
          }
        }, {
          key: "animateSpeed",
          get: function get() {
            return this.$$.ctx[13];
          },
          set: function set(t) {
            this.$set({
              animateSpeed: t
            }), Y();
          }
        }, {
          key: "shadow",
          get: function get() {
            return this.$$.ctx[14];
          },
          set: function set(t) {
            this.$set({
              shadow: t
            }), Y();
          }
        }, {
          key: "hide",
          get: function get() {
            return this.$$.ctx[1];
          },
          set: function set(t) {
            this.$set({
              hide: t
            }), Y();
          }
        }, {
          key: "delay",
          get: function get() {
            return this.$$.ctx[53];
          },
          set: function set(t) {
            this.$set({
              delay: t
            }), Y();
          }
        }, {
          key: "mouseReset",
          get: function get() {
            return this.$$.ctx[54];
          },
          set: function set(t) {
            this.$set({
              mouseReset: t
            }), Y();
          }
        }, {
          key: "closer",
          get: function get() {
            return this.$$.ctx[15];
          },
          set: function set(t) {
            this.$set({
              closer: t
            }), Y();
          }
        }, {
          key: "closerHover",
          get: function get() {
            return this.$$.ctx[16];
          },
          set: function set(t) {
            this.$set({
              closerHover: t
            }), Y();
          }
        }, {
          key: "sticker",
          get: function get() {
            return this.$$.ctx[17];
          },
          set: function set(t) {
            this.$set({
              sticker: t
            }), Y();
          }
        }, {
          key: "stickerHover",
          get: function get() {
            return this.$$.ctx[18];
          },
          set: function set(t) {
            this.$set({
              stickerHover: t
            }), Y();
          }
        }, {
          key: "labels",
          get: function get() {
            return this.$$.ctx[19];
          },
          set: function set(t) {
            this.$set({
              labels: t
            }), Y();
          }
        }, {
          key: "remove",
          get: function get() {
            return this.$$.ctx[55];
          },
          set: function set(t) {
            this.$set({
              remove: t
            }), Y();
          }
        }, {
          key: "destroy",
          get: function get() {
            return this.$$.ctx[56];
          },
          set: function set(t) {
            this.$set({
              destroy: t
            }), Y();
          }
        }, {
          key: "getState",
          get: function get() {
            return this.$$.ctx[57];
          }
        }, {
          key: "getTimer",
          get: function get() {
            return this.$$.ctx[58];
          }
        }, {
          key: "getStyle",
          get: function get() {
            return this.$$.ctx[20];
          }
        }, {
          key: "getIcon",
          get: function get() {
            return this.$$.ctx[21];
          }
        }, {
          key: "open",
          get: function get() {
            return this.$$.ctx[59];
          },
          set: function set(t) {
            this.$set({
              open: t
            }), Y();
          }
        }, {
          key: "close",
          get: function get() {
            return this.$$.ctx[22];
          },
          set: function set(t) {
            this.$set({
              close: t
            }), Y();
          }
        }, {
          key: "animateIn",
          get: function get() {
            return this.$$.ctx[60];
          },
          set: function set(t) {
            this.$set({
              animateIn: t
            }), Y();
          }
        }, {
          key: "animateOut",
          get: function get() {
            return this.$$.ctx[61];
          },
          set: function set(t) {
            this.$set({
              animateOut: t
            }), Y();
          }
        }, {
          key: "cancelClose",
          get: function get() {
            return this.$$.ctx[62];
          }
        }, {
          key: "queueClose",
          get: function get() {
            return this.$$.ctx[63];
          }
        }, {
          key: "_preventTimerClose",
          get: function get() {
            return this.$$.ctx[64];
          }
        }, {
          key: "on",
          get: function get() {
            return this.$$.ctx[65];
          }
        }, {
          key: "update",
          get: function get() {
            return this.$$.ctx[66];
          }
        }, {
          key: "fire",
          get: function get() {
            return this.$$.ctx[67];
          }
        }, {
          key: "addModuleClass",
          get: function get() {
            return this.$$.ctx[68];
          }
        }, {
          key: "removeModuleClass",
          get: function get() {
            return this.$$.ctx[69];
          }
        }, {
          key: "hasModuleClass",
          get: function get() {
            return this.$$.ctx[70];
          }
        }, {
          key: "getModuleHandled",
          get: function get() {
            return this.$$.ctx[71];
          }
        }, {
          key: "setModuleHandled",
          get: function get() {
            return this.$$.ctx[72];
          }
        }, {
          key: "getModuleOpen",
          get: function get() {
            return this.$$.ctx[73];
          }
        }, {
          key: "setModuleOpen",
          get: function get() {
            return this.$$.ctx[74];
          }
        }, {
          key: "setAnimating",
          get: function get() {
            return this.$$.ctx[75];
          }
        }, {
          key: "getAnimatingClass",
          get: function get() {
            return this.$$.ctx[76];
          }
        }, {
          key: "setAnimatingClass",
          get: function get() {
            return this.$$.ctx[77];
          }
        }, {
          key: "_getMoveClass",
          get: function get() {
            return this.$$.ctx[78];
          }
        }, {
          key: "_setMoveClass",
          get: function get() {
            return this.$$.ctx[79];
          }
        }, {
          key: "_setMasking",
          get: function get() {
            return this.$$.ctx[80];
          }
        }]) && wt(n.prototype, i), o && wt(n, o), s;
      }(mt),
      ye = e["default"] = me;
  }]);
});
//# sourceMappingURL=PNotify.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var CarSelect = /*#__PURE__*/function () {
  function CarSelect() {
    _classCallCheck(this, CarSelect);
    this.bindEvents();
  }
  _createClass(CarSelect, [{
    key: "bindEvents",
    value: function bindEvents() {
      $(function () {
        if (page.controller == 'index' && page.action == 'index') setTimeout(function () {
          $("#CarBrand").val('0');
          $("#CarModel").val('0');
          $("#CarType").val('0');
        }, 50);
        if ($('.car-select').data('carbrand') || $("#CarBrand").val() != 0) {
          if ($("#CarBrand").val() != 0) {
            CarSelect.getCarModels($("#CarBrand").val());
          } else if ($('.car-select').data('carbrand')) {
            $("#CarBrand").val($('.car-select').data('carbrand'));
            CarSelect.getCarModels($('.car-select').data('carbrand'), $('.car-select').data('carmodel'), $('.car-select').data('cartype'));
          }
          $('.confirm-car-select').removeClass('inactive');
        }
        $('.car-select #CarBrand').change(function (e) {
          var $this = $(e.target);
          var carBrand = $this.val();
          if (carBrand == 0) {
            $('.confirm-car-select').addClass('inactive');
            $('.car-select .counter').html('');
          } else {
            $('.confirm-car-select').removeClass('inactive');
          }
          CarSelect.getCarModels(carBrand);
        });
        $('.car-select #CarModel').change(function (e) {
          var $this = $(e.target);
          var carModel = $this.val();
          CarSelect.getCarTypes(carModel);
        });
        $('.car-select #CarType').change(function (e) {
          var $this = $(e.target);
          var carType = $this.val();
          CarSelect.computeProductCar(carType);
        });
        $('.confirm-car-select').click(function (e) {
          var $this = $(e.target);
          if ($this.hasClass('inactive')) return;
          var carBrand = $("#CarBrand").val();
          var carModel = $("#CarModel").val();
          var carType = $("#CarType").val();
          var url = '/' + projectVars.url.category + '/' + $('.car-select').data('categoryurl');
          if (carBrand) {
            url += '/cb/' + carBrand;
          }
          if (carModel && carModel != 'undefined') {
            url += '/cm/' + carModel;
          }
          if (carType && carType != 'undefined' && carType !== '0') {
            url += '/?f=28-' + carType;
          }

          //let url = '/' + projectVars.url.category + '/' + $('.car-select').data('categoryurl')  + '/cb/' + carBrand + '/cm/' + carModel;
          window.location.href = url;
          return;
        });
        $('.car-select .images img').click(function (e) {
          var $this = $(e.target);
          $('#CarBrand').val($this.data('carbrand')).change();
        });
      });
    }
  }], [{
    key: "getCarModels",
    value: function getCarModels(carBrand) {
      var carModel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var carType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      if (typeof carBrand !== 'undefined') {
        $.ajax({
          type: "POST",
          url: "/default/index/get-car-models",
          data: {
            "isAjax": true,
            CarBrand: carBrand,
            CategoryID: $('.car-select').data('categoryid')
          },
          dataType: "json",
          success: function success(data) {
            var select = $("#CarModel"),
              options = "";
            select.empty();
            if (data.productsCount) $('.car-select .counter').html('(' + data.productsCount + ')');else $('.car-select .counter').html();
            for (var i = 0; i < data.cms.length; i++) {
              options += "<option value=" + data.cms[i].slug + ">" + data.cms[i].name + "</option>";
            }
            select.append(options);
            if (carModel) {
              $("#CarModel").val(carModel);
              CarSelect.getCarTypes(carModel, carType);
            }
            var select = $("#CarType"),
              options = "";
            select.empty();
            options += "<option value='0'>Vyberte karoserii vozidla</option>";
            select.append(options);
          }
        });
      }
    }
  }, {
    key: "getCarTypes",
    value: function getCarTypes(carModel) {
      var carType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (typeof carModel !== 'undefined') {
        $.ajax({
          type: "POST",
          url: "/default/index/get-car-types",
          data: {
            "isAjax": true,
            CarModel: carModel,
            CategoryID: $('.car-select').data('categoryid')
          },
          dataType: "json",
          success: function success(data) {
            var select = $("#CarType"),
              options = "";
            select.empty();
            $('.car-select .counter').html('(' + data.productsCount + ')');
            for (var i = 0; i < data.cts.length; i++) {
              options += "<option value=" + data.cts[i].ID + ">" + data.cts[i].name + "</option>";
            }
            select.append(options);
            if (carType) {
              $("#CarType").val(carType);
              CarSelect.computeProductCar(carType);
            }
          }
        });
      }
    }
  }, {
    key: "computeProductCar",
    value: function computeProductCar(carType) {
      if (typeof carType !== 'undefined') {
        $.ajax({
          type: "POST",
          url: "/default/index/get-products-count",
          data: {
            "isAjax": true,
            CarModel: $("#CarModel").val(),
            CarTypeID: $("#CarType").val(),
            CategoryID: $('.car-select').data('categoryid')
          },
          dataType: "json",
          success: function success(data) {
            $('.car-select .counter').html('(' + data.productsCount + ')');
          }
        });
      }
    }
  }]);
  return CarSelect;
}();
//# sourceMappingURL=CarSelect.js.map

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
var Watchdog = /*#__PURE__*/function () {
  function Watchdog() {
    var _this = this;
    _classCallCheck(this, Watchdog);
    $(function () {
      _this.bindEvents();
    });
  }
  return _createClass(Watchdog, [{
    key: "bindEvents",
    value: function bindEvents() {
      var me = this;
      this.enableWatchdogEvent(me);
      this.disableWatchdogEvent(me);
    }
  }, {
    key: "enableWatchdogEvent",
    value: function enableWatchdogEvent(me) {
      $('.set-watchdog').unbind('click').on('click', function (e) {
        e.preventDefault();
        $.ajax({
          type: "POST",
          url: '/default/product/set-watchdog',
          data: {
            Product_ID: $(this).data('product-id')
          },
          success: me.processSuccessResponse(e.target)
        });
      });
    }
  }, {
    key: "disableWatchdogEvent",
    value: function disableWatchdogEvent(me) {
      $('.disable-watchdog').unbind('click').on('click', function (e) {
        e.preventDefault();
        $.ajax({
          type: "POST",
          url: '/default/product/disable-watchdog',
          data: {
            Product_ID: $(this).data('product-id')
          },
          success: me.processSuccessResponse(e.target)
        });
      });
    }
  }, {
    key: "processSuccessResponse",
    value: function processSuccessResponse(target) {
      var me = this;
      return /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(data) {
          var _t;
          return _regenerator().w(function (_context) {
            while (1) switch (_context.p = _context.n) {
              case 0:
                _context.p = 0;
                data = JSON.parse(data);
                if (!data.error) {
                  _context.n = 1;
                  break;
                }
                alerts.alert('Error', 'error', data.msg);
                _context.n = 3;
                break;
              case 1:
                _context.n = 2;
                return me.displayWatchdogConfirmationInfo(data.msg);
              case 2:
                if ($(target).closest('.set-watchdog').length) {
                  $(target).text('Zrušit hlídacího psa');
                  $(target).closest('.set-watchdog').addClass('disable-watchdog').removeClass('set-watchdog');
                  me.bindEvents();
                } else if ($(target).closest('.disable-watchdog').length) {
                  $(target).text('Hlídací pes');
                  $(target).closest('.disable-watchdog').addClass('set-watchdog').removeClass('disable-watchdog');
                  me.bindEvents();
                }
              case 3:
                _context.n = 5;
                break;
              case 4:
                _context.p = 4;
                _t = _context.v;
                console.error(_t);
                alerts.error();
              case 5:
                return _context.a(2);
            }
          }, _callee, null, [[0, 4]]);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }();
    }
  }, {
    key: "displayWatchdogConfirmationInfo",
    value: function () {
      var _displayWatchdogConfirmationInfo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(content) {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (this.dialog) {
                this.dialog.close();
              }
              this.dialog = new Dialog();
              this.dialog._title = 'Nastavení hlídacího psa';
              this.dialog._modalClass = 'watchdog-confirmation';
              _context2.n = 1;
              return this.dialog.openFromUrl(projectVars.basePath + '/modal/watchdog-confirmation', {
                content: content
              });
            case 1:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function displayWatchdogConfirmationInfo(_x2) {
        return _displayWatchdogConfirmationInfo.apply(this, arguments);
      }
      return displayWatchdogConfirmationInfo;
    }()
  }]);
}();
//# sourceMappingURL=Watchdog.js.map

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

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var cartController = /*#__PURE__*/function () {
  function cartController() {
    _classCallCheck(this, cartController);
  }
  return _createClass(cartController, [{
    key: "indexAction",
    value: function indexAction() {
      new CartPage();
    }
  }, {
    key: "emptyAction",
    value: function emptyAction() {
      new CartPage();
    }
  }]);
}();
//# sourceMappingURL=cartController.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var categoryController = /*#__PURE__*/function () {
  function categoryController() {
    _classCallCheck(this, categoryController);
  }
  return _createClass(categoryController, [{
    key: "indexAction",
    value: function indexAction() {
      new CategoryLayout();
    }
  }]);
}();
//# sourceMappingURL=categoryController.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var complaintController = /*#__PURE__*/function () {
  function complaintController() {
    _classCallCheck(this, complaintController);
  }
  return _createClass(complaintController, [{
    key: "indexAction",
    value: function indexAction() {
      new Complaint();
    }
  }]);
}();
//# sourceMappingURL=complaintController.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var customerController = /*#__PURE__*/function () {
  function customerController() {
    _classCallCheck(this, customerController);
  }
  return _createClass(customerController, [{
    key: "myaccountAction",
    value: function myaccountAction() {
      new MyAccount('order-list');
    }
  }, {
    key: "addressAction",
    value: function addressAction() {
      window.address = new Address();
    }
  }, {
    key: "registerAction",
    value: function registerAction() {
      window.registration = new Registration();
    }
  }, {
    key: "oldaccountAction",
    value: function oldaccountAction() {
      window.oldAccountForm = new OldAccountForm();
    }
  }, {
    key: "changeaddressrequestAction",
    value: function changeaddressrequestAction() {
      window.changeAddressRequest = new ChangeAddressRequest();
    }
  }]);
}();
//# sourceMappingURL=customerController.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Dispatch = /*#__PURE__*/function () {
  function Dispatch(page) {
    _classCallCheck(this, Dispatch);
    this.page = page;
    this.dispatch();
  }
  return _createClass(Dispatch, [{
    key: "dispatch",
    value: function dispatch() {
      var className = page.controller + 'Controller';
      var functionName = this.prepareAction(page.action + 'Action');
      try {
        var checkClass = eval("new ".concat(className, "()"));
        if (typeof checkClass[functionName] === 'function') eval("checkClass.".concat(functionName, "()"));
      } catch (e) {}
    }
  }, {
    key: "prepareAction",
    value: function prepareAction(action) {
      return action.replace('-', '');
    }
  }]);
}();
//# sourceMappingURL=Dispatch.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var indexController = /*#__PURE__*/function () {
  function indexController() {
    _classCallCheck(this, indexController);
  }
  return _createClass(indexController, [{
    key: "indexAction",
    value: function indexAction() {
      new MainContactForm();
    }
  }]);
}();
//# sourceMappingURL=indexController.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var manufacturerController = /*#__PURE__*/function () {
  function manufacturerController() {
    _classCallCheck(this, manufacturerController);
  }
  return _createClass(manufacturerController, [{
    key: "detailAction",
    value: function detailAction() {
      new ManufacturerLayout();
    }
  }]);
}();
//# sourceMappingURL=manufacturerController.js.map

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

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var pageController = /*#__PURE__*/function () {
  function pageController() {
    _classCallCheck(this, pageController);
  }
  return _createClass(pageController, [{
    key: "indexAction",
    value: function indexAction() {
      new MainContactForm();
    }
  }, {
    key: "getPageSlug",
    value: function getPageSlug() {
      var u = location.href;
      return u.replace(/(^\w+:|^)\/\//, '').replace(location.host + '/page/', '').replace(location.search, '');
    }
  }]);
}();
//# sourceMappingURL=pageController.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var productController = /*#__PURE__*/function () {
  function productController() {
    _classCallCheck(this, productController);
  }
  return _createClass(productController, [{
    key: "indexAction",
    value: function indexAction() {
      new ProductLayout();
    }
  }]);
}();
//# sourceMappingURL=productController.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var searchController = /*#__PURE__*/function () {
  function searchController() {
    _classCallCheck(this, searchController);
  }
  return _createClass(searchController, [{
    key: "indexAction",
    value: function indexAction() {
      new SearchLayout();
    }
  }]);
}();
//# sourceMappingURL=searchController.js.map

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Registration = /*#__PURE__*/function () {
  function Registration() {
    var _this = this;

    _classCallCheck(this, Registration);

    $(function () {
      _this.registrationForm = new Form('main-form');

      _this.bindEvents();
    });
  }

  _createClass(Registration, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;

      $('#confirm-registration').click(function () {
        _this2.registrationForm.validate();
      });
      $('.company-toggler').click(function () {
        var companyBox = $('.company-box');
        $('#IsCompany').prop('checked') ? companyBox.slideDown(300) : companyBox.slideUp(300);
      });
    }
  }, {
    key: "validateEmail",
    value: function validateEmail(value) {
      var result = true;
      $.ajax({
        type: "POST",
        url: "/default/customer/check-email/",
        data: {
          Email: value
        },
        success: function success(data) {
          if (data == 1) {
            result = false;
          } else {
            result = true;
          }
        },
        async: false
      });
      return result;
    }
  }]);

  return Registration;
}();
//# sourceMappingURL=registration.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Dialog = /*#__PURE__*/function () {
  function Dialog() {
    _classCallCheck(this, Dialog);
    _defineProperty(this, "_uid", void 0);
    // UID
    _defineProperty(this, "_modalClass", void 0);
    // Titulek
    _defineProperty(this, "_title", void 0);
    // Titulek
    _defineProperty(this, "_content", void 0);
    // Obsah
    _defineProperty(this, "_footer", void 0);
    // Patička
    _defineProperty(this, "_shown", void 0);
    // Bool zda již bylo zobrazené
    _defineProperty(this, "_confirmButton", void 0);
    _defineProperty(this, "_cancelButton", void 0);
    _defineProperty(this, "_buttons", void 0);
    _defineProperty(this, "onBeforeOpen", void 0);
    _defineProperty(this, "onAfterOpen", void 0);
    _defineProperty(this, "onBeforeClose", void 0);
    _defineProperty(this, "onAfterClose", void 0);
    _defineProperty(this, "confirm_function", void 0);
    _defineProperty(this, "fade_interval", void 0);
    this._modalClass = "";
    this._content = "";
    this._title = "";
    this._footer = "";
    this._uid = 'dialog_' + Math.random().toString(36).substring(10);
    window[this._uid] = this;
    this.init();
    this.bind();
  }
  return _createClass(Dialog, [{
    key: "init",
    value:
    /**
     * Inicializace základních proměnných
     */
    function init() {
      this._element = null;
      this._confirmButton = false;
      this._cancelButton = false;
      this._buttons = [];
      this.onBeforeClose = null;
      this.onAfterClose = null;
      this.onBeforeOpen = null;
      this.onAfterOpen = null;
      this.confirm_function = 'dialogConfirm()';
      this.fade_interval = 300;
      this._shown = false;
    }

    /**
     * Bind základních akcí
     */
  }, {
    key: "bind",
    value: function bind() {
      //
    }

    /**
     * Zavírá dialog;
     */
  }, {
    key: "close",
    value: function close() {
      window.dialogIsShown = false;
      if (this.onBeforeClose && typeof this.onBeforeClose == "function") this.onBeforeClose();
      $('body').removeClass('modal-open');
      this._element.remove();
      $('.modal-backdrop').remove();
      $('#modal').hide(0);
      window[this._uid] = undefined;
      if (this.onAfterClose && typeof this.onAfterClose == "function") this.onAfterClose();
    }

    /**
     * Otevírá dialog
     */
  }, {
    key: "open",
    value: function open() {
      if (window.dialogIsShown) {
        console.warn('Another dialog is opened already');
        return this;
      }
      window.dialogIsShown = true;
      if (this.onBeforeOpen && typeof this.onBeforeOpen == "function") this.onBeforeOpen();
      $('#modal').show(0);
      $('body').addClass('modal-open');
      if ($('.modal-backdrop').length === 0) {
        $('body').append('<div class="modal-backdrop fade show">');
      }
      this.render();

      //layout.bindEvents();

      if (this.onAfterOpen && typeof this.onAfterOpen == "function") this.onAfterOpen();
      return this;
    }

    /**
     * Zobrazuje dialog s obsahem z URL
     * @param {string} url URL s daty
     * @param {Object} params Parametry requestu
     * @param {boolean} json Označení, zda jsou data servírována v JSONu
     */
  }, {
    key: "openFromUrl",
    value: function openFromUrl(url) {
      var _this = this;
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var json = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      params.dialog_id = this._uid;
      $.ajax({
        url: url,
        data: params,
        success: function success(data) {
          if (json) {
            try {
              data = JSON.parse(data);
              _this._content = data.content;
              _this._title = data.title;
              _this._footer = data.footer;
            } catch (ex) {
              console.warn('Data cannot be parsed as JSON');
              alerts.error();
            }
          } else {
            _this._content = data;
          }
          _this.open();
        }
      });
    }

    /**
     * Přida tlačítko/akci
     * @param {number} id
     * @param {string} label
     * @param {?function|null} onClick
     * @param {?string} onClick
     * @param {?string|null} icon
     * 
     * @return {DialogAction} vrácí tlačítko
     */
  }, {
    key: "addAction",
    value: function addAction(id, label) {
      var onClick = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var btnType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'primary';
      var icon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var action = new DialogAction(this, id, label, onClick, btnType, icon);
      this._buttons.push(action);
      return Action;
    }

    /**
     * Vykreslí dialog a nastaví jej jako element
     * 
     * @return {Dialog} vrácí sebe
     */
  }, {
    key: "render",
    value: function render() {
      if (this._buttons.length > 0) this._footer += this._renderActions();
      if (this._confirmButton) this._footer += "<button onclick=\"".concat(this.confirm_function, "\"><i class=\"fas fa-check\"></i>").concat(projectVars.confirm, "</button>");
      if (this._cancelButton) this._footer += "<button onclick=\"window['".concat(this._uid, "'].close();\"><i class=\"fas fa-times\"></i>").concat(projectVars.cancel, "</button>");
      var template = "\n            <div class=\"modal-dialog modal-lg modal-dialog-centered ".concat(this._modalClass, "\" id=\"").concat(this._uid, "\" role=\"document\">\n                <div class=\"modal-content\">\n                    <div class=\"modal-header\">\n                        <h5 class=\"modal-title\">").concat(this._title, "</h5>\n                        <button type=\"button\" class=\"close\" onclick=\"window['").concat(this._uid, "'].close()\" aria-label=\"Close\"></button>\n                    </div>\n                    <div class=\"modal-body\">\n                        ").concat(this._content, "\n                    </div>\n                    ").concat(this._footer.length > 0 ? '<div class="modal-footer">' + this._footer + '</div>' : '', "\n                </div>\n            </div>\n        ");
      this._element = template;
      this._getModal().append($(template));
      this._element = $('#' + this._uid);
      this._shown = true;
      return this;
    }

    /**
     * Vrací element modalu, připadně jej vytvoří
     * 
     * @return {JQuery}
     */
  }, {
    key: "_getModal",
    value: function _getModal() {
      var $modal = $('#modal');
      if ($modal.length > 0) {
        return $modal;
      } else {
        $('body').append('<div class="modal fade show" id="modal" style="display:block;" role="dialog"></div>');
        return this._getModal();
      }
    }

    /**
     * Rendruje tlačítka do footeru
     * 
     * @returns {string}
     */
  }, {
    key: "_renderActions",
    value: function _renderActions() {
      var out = '';
      this._buttons.forEach(function (e) {
        out += e.render();
      });
      return out;
    }

    /**
     * Odstraní tlačítko
     * 
     * @returns {string}
     */
  }, {
    key: "removeAction",
    value: function removeAction(index) {
      this._buttons.splice(index, 1);
      return this;
    }

    /**
     * Zapne tlačítko ve footeru pro zrušení akce
     * 
     * @returns {Dialog}
     */
  }, {
    key: "enableCancel",
    value: function enableCancel() {
      this._cancelButton = true;
      return this;
    }

    /**
     * Zapne tlačítko ve footeru pro potvrzení akce
     * 
     * @returns {Dialog}
     */
  }, {
    key: "enableConfirm",
    value: function enableConfirm() {
      var confirm_function = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'dialogConfirm()';
      this.confirm_function = confirm_function;
      this._confirmButton = true;
      return this;
    }

    /**
     * Vypne tlačítko ve footeru pro zrušení akce
     * 
     * @returns {Dialog}
     */
  }, {
    key: "disableCancel",
    value: function disableCancel() {
      this._cancelButton = false;
      return this;
    }

    /**
     * Vypne tlačítko ve footeru pro potvrzení akce
     * 
     * @returns {Dialog}
     */
  }, {
    key: "disableConfirm",
    value: function disableConfirm() {
      this._confirmButton = false;
      return this;
    }

    /*
     *      SETTERS
     */

    /**
     * Nastaví hlavičku
     * @param value
     */
  }, {
    key: "modalClass",
    get:
    /**
     * Vrací ID dialogu
     * @return {string}
     */
    function get() {
      return this._modalClass;
    }

    /**
     * Vrací ID dialogu
     * @return {string}
     */,
    set: function set(value) {
      this._modalClass = value;
      return this;
    }

    /**
     * Nastaví hlavičku
     * @param value
     */
  }, {
    key: "title",
    get: function get() {
      return this._uid;
    },
    set: function set(value) {
      this._title = value;
      if (this._shown) this._element.find('.modal-title').html(value);
      return this;
    }

    /**
     * Nastaví obsah
     * @param value
     */
  }, {
    key: "content",
    set: function set(value) {
      this._content = value;
      if (this._shown) this._element.find('.modal-body').html(value);
      return this;
    }

    /**
     * Nastaví patičku
     * @param value
     */
  }, {
    key: "footer",
    set: function set(value) {
      this._footer = value;
      if (this._shown) this._element.find('.modal-footer').html(value);
      return this;
    }

    /*
     *      GETTERS
     */

    /**
     * Vrací jQuery element
     * @return {JQuery}
     */
  }, {
    key: "element",
    get: function get() {
      return this._element;
    }

    /**
     * Vrací ID dialogu
     * @return {string}
     */
  }, {
    key: "uid",
    get: function get() {
      return this._uid;
    }
  }], [{
    key: "createDialog",
    value: function createDialog(title) {
      var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var footer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
      var dialog = new Dialog();
      dialog.title = title;
      dialog.content = content;
      dialog.footer = footer;
      dialog.enableCancel();
      return dialog;
    }
  }]);
}();
//# sourceMappingURL=Dialog.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var DialogAction = /*#__PURE__*/function () {
  function DialogAction(dialog, id, label) {
    var onClick = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var btnType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'primary';
    var icon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    _classCallCheck(this, DialogAction);
    _defineProperty(this, "_dialog", void 0);
    _defineProperty(this, "_id", void 0);
    _defineProperty(this, "label", void 0);
    _defineProperty(this, "onClick", void 0);
    _defineProperty(this, "btnType", void 0);
    _defineProperty(this, "icon", void 0);
    this._id = id, this.label = label;
    this.onClick = onClick;
    this.btnType = btnType;
    this.btnClasses = '';
    this.icon = icon;
    this._dialog = dialog;
  }
  return _createClass(DialogAction, [{
    key: "render",
    value: function render() {
      var template = "\n            <button class=\"btn btn-".concat(this.btnType).concat(this.icon ? ' btn-with-icon' : '', " ").concat(this.btnClasses, "\" ").concat(this.onClick ? 'onclick="' + this.onClick + '"' : '', ">\n                ").concat(this.icon ? '<i class="' + this.icon + '"></i>' : '').concat(this.label, "\n            </button>\n        ");
      return template;
    }
  }]);
}();
//# sourceMappingURL=DialogAction.js.map

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Address = /*#__PURE__*/function () {
  function Address() {
    var _this = this;
    _classCallCheck(this, Address);
    $(function () {
      _this.customerForm = new Form('main-form');
      _this.bindEvents();
    });
  }
  _createClass(Address, [{
    key: "bindEvents",
    value: function bindEvents() {
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
  return Address;
}();
//# sourceMappingURL=Address.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var BannerGeneratorForm = /*#__PURE__*/function () {
  function BannerGeneratorForm() {
    var _this = this;
    _classCallCheck(this, BannerGeneratorForm);
    $(function () {
      _this.contactForm = new Form("banner-generator-form");
      _this.bindEvents();
    });
  }
  _createClass(BannerGeneratorForm, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $("#banner-generator-form input").each(function () {
        var currentID = $(this)[0].id;
        $('#' + currentID + '-placeholder').html($('#' + currentID).val());
      });
      $("#banner-generator-form input").keyup(function (e) {
        var currentID = e.currentTarget.id;
        $('#' + currentID + '-placeholder').html($('#' + currentID).val());
      });
      $("#banner-generator-form #confirm-banner-generator-form").click( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                e.preventDefault();
                if (_this2.contactForm.validate()) {
                  _this2.validateForm();
                }
              case 2:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "validateForm",
    value: function validateForm() {
      $('<div class="progress-loader-wrap" style="top:0;float: initial; margin: 0 auto"><div class="progress-loader"></div></div>').insertBefore('#confirm-banner-generator-form');
      $('#confirm-banner-generator-form').hide();
      $.ajax({
        type: "POST",
        url: "/default/customer/generate-banner/",
        data: {
          CompanyName: $('#CompanyName').val(),
          CompanyAddress: $('#CompanyAddress').val(),
          City: $('#City').val(),
          Phone: $('#Phone').val(),
          ZipCode: $('#ZipCode').val(),
          Web: $('#Web').val()
        },
        success: function success(data) {
          $('#banner-generator-form').trigger("reset");
          $('#banner-generator-form form').hide();
          $('#banner-generator-form').css('height', '125px');
          $('#banner-generator-form').html('<p><strong>Vaše žádost o ceduli byla úspěšně odeslána. Děkujeme</strong></p>');
        }
      });
    }
  }]);
  return BannerGeneratorForm;
}();
//# sourceMappingURL=BannerGeneratorForm.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ChangeAddressRequest = /*#__PURE__*/function () {
  function ChangeAddressRequest() {
    var _this = this;
    _classCallCheck(this, ChangeAddressRequest);
    $(function () {
      _this.questionForm = new Form('main-form');
      _this.bindEvents();
    });
  }
  return _createClass(ChangeAddressRequest, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $('#confirm-question').click(function () {
        _this2.questionForm.validate();
        if (_this2.questionForm.valid) $('#main-form').submit();
      });
    }
  }]);
}();
//# sourceMappingURL=ChangeAddressRequest.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Complaint = /*#__PURE__*/function () {
  function Complaint() {
    var _this = this;
    _classCallCheck(this, Complaint);
    this.complaintItemCounter = 1;
    $(function () {
      _this.complaintForm = new Form('complaint-form');
      _this.bindEvents();
      _this.initializeTogglers();
      // this.initializeCountrySelects();
      _this.initializeComplaintItems();
      $('.complaint-item').first().find('.complaint-item-title').text("Polo\u017Eka \u010D. 1");
    });
  }
  return _createClass(Complaint, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $('#confirm-complaint').click(function () {
        _this2.complaintForm.validate();
        var isValid = _this2.complaintForm.valid && $('#gdpr').prop('checked');
        $('select:visible').each(function () {
          var select = $(this);
          if (select.hasClass('select2-hidden-accessible') && !select.val()) {
            var select2Container = select.siblings('.select2-container');
            select2Container.addClass('input-error');
            isValid = false;
          } else {
            select.siblings('.select2-container').removeClass('input-error');
          }
        });
        if (isValid) {
          _this2.recapchaCallback();
        }
      });
      $('select').on('change', function () {
        $(this).siblings('.select2-container').removeClass('input-error');
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
          }).appendTo('#complaint-form');
          $('#complaint-form').submit();
        });
      });
    }
  }, {
    key: "initializeTogglers",
    value: function initializeTogglers() {
      $('.with-toggler').click(function () {
        $(this).toggleClass('active');
        $(this).next().slideToggle();
        if ($(this).hasClass('active')) {
          $(this).next().find('input[type="hidden"]').val(1);
        } else {
          $(this).next().find('input[type="hidden"]').val(0);
        }
      });
      $('.company-block').hide();
      $('.delivery-address-block').hide();
    }
  }, {
    key: "initializeComplaintItems",
    value: function initializeComplaintItems() {
      if ($('.complaint-item').length === 1) {
        $('.complaint-item').first().find('.remove-complaint-item').hide();
      }
      $('#add-complaint-item').click(function () {
        var maxCurrentNumber = Math.max.apply(Math, _toConsumableArray($('.complaint-item').map(function () {
          return parseInt($(this).find('.complaint-item-title').text().replace('Položka č. ', ''));
        }).get()));
        var newNumber = maxCurrentNumber + 1;
        var newItem = $('.complaint-item').first().clone();
        newItem.find('.complaint-item-title').text("Polo\u017Eka \u010D. ".concat(newNumber));
        newItem.find('input, textarea').each(function (index, el) {
          var $el = $(el);
          var originalId = $el.attr('id');
          var originalName = $el.attr('name');
          var newId = originalId ? originalId.replace(/\d+$/, '') + newNumber : '';
          var newName = originalName.replace(/\d+$/, '') + newNumber;
          $el.attr({
            'id': newId,
            'name': newName
          }).val('');
        });
        newItem.find('.remove-complaint-item').show();
        $('.complaint-item').first().find('.remove-complaint-item').show();
        $('#complaint-items').append(newItem);
      });
      $(document).on('click', '.remove-complaint-item', function () {
        if ($('.complaint-item').length > 1) {
          $(this).closest('.complaint-item').remove();
          $('.complaint-item').each(function (index, item) {
            var $item = $(item);
            var newNumber = index + 1;
            $item.find('.complaint-item-title').text("Polo\u017Eka \u010D. ".concat(newNumber));
            $item.find('input, textarea').each(function (idx, el) {
              var $el = $(el);
              var originalId = $el.attr('id');
              var originalName = $el.attr('name');
              if (originalId) {
                $el.attr('id', originalId.replace(/\d+$/, '') + newNumber);
              }
              $el.attr('name', originalName.replace(/\d+$/, '') + newNumber);
            });
          });
          if ($('.complaint-item').length === 1) {
            $('.complaint-item').first().find('.remove-complaint-item').hide();
          }
        } else {
          alert("Musí zůstat alespoň jedna položka zásilky.");
        }
      });
    }
  }]);
}();
//# sourceMappingURL=Complaint.js.map

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

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Kupóny
 */
var Coupon = /*#__PURE__*/function () {
  /**
   * Konstruktor pro kupóny
   * @param form_id
   */
  function Coupon() {
    var form_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'coupon-form';
    _classCallCheck(this, Coupon);
    this._element = document.getElementById(form_id);
    this._form = new Form(form_id);
    this.init();
  }

  /**
   * Vrací formulář
   * @return {*|jQuery|HTMLElement}
   */
  return _createClass(Coupon, [{
    key: "$form",
    get: function get() {
      return $(this._element);
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      $(function () {
        _this.$input = _this.$form.find('input[name="couponCode"]');
        _this.$submit = _this.$form.find('button[type="submit"]');
        _this.$reset = _this.$form.find('button[type="reset"]');
        if (_this.$input.val().length) {
          _this.handleSuccess();
        }
      });
      this.$form.on('submit', function (e) {
        e.preventDefault();
        _this.applyCoupon(_this.$input.val());
      });
      this.$form.on('reset', function (e) {
        _this.removeCoupon();
      });
    }

    /**
     * Aplikuje kupón
     * @param {string} coupon
     */
  }, {
    key: "applyCoupon",
    value: function applyCoupon(coupon) {
      var _this2 = this;
      $.ajax({
        url: projectVars.basePath + '/cart/apply-coupon',
        method: 'POST',
        data: {
          coupon: coupon
        },
        success: function success(data) {
          try {
            data = JSON.parse(data);
            if (data.error === true) return _this2.handleError(data.error_msg);
            _this2.handleSuccess();
          } catch (ex) {
            _this2.handleError();
          }
          location.reload();
          //CartPage.refreshCart();
        },
        error: function error() {
          _this2.handleError();
        }
      });
    }
  }, {
    key: "removeCoupon",
    value: function removeCoupon() {
      var _this3 = this;
      $.ajax({
        url: projectVars.basePath + '/cart/remove-coupon',
        method: 'POST',
        success: function success(data) {
          _this3.$input.prop('readonly', false);
          _this3.$reset.hide();
          _this3.$submit.show();
          location.reload();
          //CartPage.refreshCart();
        },
        error: function error() {
          _this3.handleError();
        }
      });
    }

    /**
     * Handle pro error
     * @param {string|null} msg
     * @return {boolean}
     */
  }, {
    key: "handleError",
    value: function handleError() {
      var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.$input.prop('readonly', false);
      this.$reset.hide();
      this.$submit.show();
      if (msg) alerts.alert('Error', 'error', msg);else alerts.error();
      return false;
    }

    /**
     * Handle pro úspěšné užití
     */
  }, {
    key: "handleSuccess",
    value: function handleSuccess() {
      this.$input.attr('readonly', true);
      this.$reset.show();
      this.$submit.hide();
    }
  }]);
}();
//# sourceMappingURL=Coupon.js.map

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Kupóny
 */
var Credit = /*#__PURE__*/function () {
  /**
   * Konstruktor pro kredit
   * @param form_id
   */
  function Credit() {
    var form_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'creditForm';
    _classCallCheck(this, Credit);
    this._element = document.getElementById(form_id);
    this._form = new Form(form_id);
    this.init();
  }

  /**
   * Vrací formulář
   * @return {*|jQuery|HTMLElement}
   */
  _createClass(Credit, [{
    key: "$form",
    get: function get() {
      return $(this._element);
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      $(function () {
        _this.$input = _this.$form.find('input[name="creditsAmount"]');
        _this.$submit = _this.$form.find('button[type="submit"]');
        _this.$reset = _this.$form.find('button[type="reset"]');
        if ($('.credit-row').length) {
          _this.handleSuccess();
        }
      });
      this.$form.on('submit', function (e) {
        e.preventDefault();
        _this.applyCredit(_this.$input.val());
      });
      this.$form.on('reset', function (e) {
        _this.removeCoupon();
      });
    }

    /**
     * Aplikuje kupón
     * @param {string} credit
     */
  }, {
    key: "applyCredit",
    value: function applyCredit(credit) {
      var _this2 = this;
      $.ajax({
        url: projectVars.basePath + '/cart/apply-credits',
        method: 'POST',
        data: {
          credit: credit
        },
        success: function success(data) {
          try {
            data = JSON.parse(data);
            if (data.error === true) return _this2.handleError(data.error_msg);
            _this2.handleSuccess();
          } catch (ex) {
            _this2.handleError();
          }
          location.reload();
          //CartPage.refreshCart();
        },

        error: function error() {
          _this2.handleError();
        }
      });
    }
  }, {
    key: "removeCoupon",
    value: function removeCoupon() {
      var _this3 = this;
      $.ajax({
        url: projectVars.basePath + '/cart/remove-credits',
        method: 'POST',
        success: function success(data) {
          _this3.$input.prop('readonly', false);
          _this3.$reset.hide();
          _this3.$submit.show();
          location.reload();
          //CartPage.refreshCart();
        },

        error: function error() {
          _this3.handleError();
        }
      });
    }

    /**
     * Handle pro error
     * @param {string|null} msg
     * @return {boolean}
     */
  }, {
    key: "handleError",
    value: function handleError() {
      var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.$input.prop('readonly', false);
      this.$reset.hide();
      this.$submit.show();
      if (msg) alerts.alert('Error', 'error', msg);else alerts.error();
      return false;
    }

    /**
     * Handle pro úspěšné užití
     */
  }, {
    key: "handleSuccess",
    value: function handleSuccess() {
      this.$input.attr('readonly', true);
      this.$reset.show();
      this.$submit.hide();
    }
  }]);
  return Credit;
}();
//# sourceMappingURL=Credit.js.map

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Form = /*#__PURE__*/function () {
  function Form(form_id) {
    _classCallCheck(this, Form);

    this.$form = $('#' + form_id);
    this.valid = true;
  }

  _createClass(Form, [{
    key: "validate",
    value: function validate() {
      var _this = this;

      this.valid = true;
      this.$form.find(':input').each(function (i, e) {
        e = $(e);
        var validation_data = e.data('validator');
        if (validation_data === undefined) return;else if (typeof validation_data === 'string') validation_data = JSON.parse(validation_data);
        var value = e.val();
        var errorMessage = '';
        var errorDiv = $("#" + e.attr('name') + "Error");
        errorDiv.html('');
        e.removeClass('input-error');
        validation_data.forEach(function (v) {
          switch (v.v) {
            case Form.VALIDATOR_REQUIRED:
              if (!Form.validateRequired(value)) errorMessage += v.m;
              break;

            case Form.VALIDATOR_EMAIL:
              if (!Form.validateEmail(value)) errorMessage += v.m;
              break;

            case Form.VALIDATOR_LENGTH:
              if (!Form.validateLength(value, v.p)) errorMessage += v.m;
              break;

            case Form.VALIDATOR_MAX_LENGTH:
              if (!Form.validateMaxLength(value, v.p)) errorMessage += v.m;
              break;

            case Form.VALIDATOR_MIN_LENGTH:
              if (!Form.validateMinLength(value, v.p)) errorMessage += v.m;
              break;

            case Form.VALIDATOR_NUMBER:
              if (!Form.validateNumber(value)) errorMessage += v.m;
              break;

            case Form.VALIDATOR_PATTERN:
              var re = new RegExp(v.p);
              if (!Form.validateRegex(value, re)) errorMessage += v.m;
              break;

            case Form.VALIDATOR_RANGE:
              if (!Form.validateRange()) errorMessage += v.m;
              break;

            default:
              var validateFunction = v.v.split('.');

              if (typeof window[validateFunction[0]][validateFunction[1]] === 'function') {
                if (!window[validateFunction[0]][validateFunction[1]](value)) errorMessage += v.m;
              }

              break;
          }
        });

        if (errorMessage !== '') {
          if (errorDiv.length === 0) e.after($("<div class=\"error\" id=\"".concat(e.attr('name'), "Error\"></div>")));
          $("#" + e.attr('name') + "Error").html(errorMessage);
          e.addClass('input-error');
          _this.valid = false;
        }
      });
      return this.valid;
    }
  }], [{
    key: "validateRegex",
    value: function validateRegex(value, pattern) {
      var r = new RegExp(pattern);
      return value.match(r) != null;
    }
  }, {
    key: "validateMinLength",
    value: function validateMinLength(value, minlength) {
      return value.length >= minlength;
    }
  }, {
    key: "validateMaxLength",
    value: function validateMaxLength(value, maxlength) {
      return value.length <= maxlength;
    }
  }, {
    key: "validateLength",
    value: function validateLength(value, length) {
      return toString(value).length === length;
    }
  }, {
    key: "validateEmail",
    value: function validateEmail(value) {
      return this.validateRegex(value.toLowerCase(), /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
  }, {
    key: "validateRequired",
    value: function validateRequired(value) {
      return value != '';
    }
  }, {
    key: "validateNumber",
    value: function validateNumber(value) {
      return value.isInteger(value);
    }
  }, {
    key: "validateRange",
    value: function validateRange(value, min, max) {
      return min >= value && value <= max;
    }
  }]);

  return Form;
}();

_defineProperty(Form, "VALIDATOR_REQUIRED", ':required');

_defineProperty(Form, "VALIDATOR_MIN_LENGTH", ':min_length');

_defineProperty(Form, "VALIDATOR_MAX_LENGTH", ':max_length');

_defineProperty(Form, "VALIDATOR_LENGTH", ':length');

_defineProperty(Form, "VALIDATOR_EMAIL", ':email');

_defineProperty(Form, "VALIDATOR_PATTERN", ':pattern');

_defineProperty(Form, "VALIDATOR_NUMBER", ':number');

_defineProperty(Form, "VALIDATOR_RANGE", ':range');
//# sourceMappingURL=Form.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
var LoginForm = /*#__PURE__*/_createClass(function LoginForm() {
  _classCallCheck(this, LoginForm);
  $('body').on('click', '#confirm-login', function () {
    $('.userError').hide();
    if ($('#LoginEmail').val() && $('#LoginPassword').val()) {
      $.ajax({
        type: "POST",
        url: "/default/customer/login-process",
        data: {
          Email: $('#LoginEmail').val(),
          Password: $('#LoginPassword').val()
        },
        async: false,
        success: function success(data) {
          var dataObj = JSON.parse(data);
          if (dataObj.success && !dataObj.userFromOldAccount) {
            if (location.href.includes('/logout') || location.href.includes('/register-done') || location.href.includes('/set-new-password')) {
              location.href = '/';
            } else {
              location.reload();
            }
          }
          if (dataObj.success && dataObj.userFromOldAccount) {
            location.href = '/default/customer/old-account?hash=' + dataObj.hash;
          }
          if (!dataObj.success && dataObj.userFromOldAccount) {
            $('.userError').show();
          }
          if (!dataObj.success && !dataObj.userFromOldAccount) {
            $('.userError').show();
          }
        }
      });
    } else {
      $('.userError').show();
    }
  });
  $('.loginDialog .modal-body').keypress(function (e) {
    if (e.keyCode === 13) {
      $('#confirm-login').trigger('click');
    }
  });
});
//# sourceMappingURL=LoginForm.js.map

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
var MainContactForm = /*#__PURE__*/function () {
  function MainContactForm() {
    var _this = this;
    _classCallCheck(this, MainContactForm);
    $(function () {
      _this.contactForm = new Form("contact-us-form");
      _this.bindEvents();
    });
  }
  return _createClass(MainContactForm, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $("#contact-us-form #confirm-contact-form").click(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
          return _regenerator().w(function (_context) {
            while (1) switch (_context.n) {
              case 0:
                e.preventDefault();
                if (!_this2.contactForm.validate()) {
                  _context.n = 1;
                  break;
                }
                _context.n = 1;
                return _this2.recapchaCallback();
              case 1:
                return _context.a(2);
            }
          }, _callee);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "recapchaCallback",
    value: function recapchaCallback() {
      var me = this;
      grecaptcha.ready(function () {
        grecaptcha.execute('6LdSvYUsAAAAAMEc4A38re5VImJbJI1Jz04BF2PX', {
          action: 'submit'
        }).then(function (token) {
          me.validateForm(token);
        });
      });
    }
  }, {
    key: "validateForm",
    value: function validateForm(token) {
      $('<div class="progress-loader-wrap" style="float: initial; margin: 0 auto; position: absolute; right: 15px; top: -26px"><div class="progress-loader"></div></div>').insertBefore('#confirm-contact-form');
      $('#confirm-contact-form').hide();
      $.ajax({
        type: "POST",
        url: "/default/page/contact-us",
        data: {
          Name: $('#name').val(),
          Company: $('#company').val(),
          Email: $('#email').val(),
          Subject: $('#subject').val(),
          Message: $('#message').val(),
          Token: token
        },
        success: function success(data) {
          $('#contact-us-form').trigger("reset");
          $('#contact-us-form form').hide();
          $('#contact-us-form').css('height', '125px');
          $('#contact-us-form').html('<p><strong>Vaše zpráva byla úspěšně odeslána. Děkujeme</strong></p>');
        }
      });
    }
  }]);
}();
//# sourceMappingURL=MainContactForm.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var OldAccountForm = /*#__PURE__*/function () {
  function OldAccountForm() {
    var _this = this;
    _classCallCheck(this, OldAccountForm);
    $(function () {
      _this.registrationForm = new Form('main-form');
      _this.bindEvents();
    });
  }
  return _createClass(OldAccountForm, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $('input[name="Hash"]').val(window.location.search.replace('?hash=', ''));
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
        if (_this2.registrationForm.valid && $('#gdpr').prop('checked')) {
          $('#main-form').submit();
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
//# sourceMappingURL=OldAccountForm.js.map

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

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var OrderCustomerForm = /*#__PURE__*/function () {
  function OrderCustomerForm() {
    var _this = this;
    _classCallCheck(this, OrderCustomerForm);
    $(function () {
      _this.contactForm = new Form("order-customer-form");
      _this.bindEvents();
    });
  }
  _createClass(OrderCustomerForm, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $("#order-customer-form #confirm-order-customer-form").click( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                $('<div class="progress-loader-wrap"><div class="progress-loader"></div></div>').insertBefore('#confirm-order-customer-form');
                e.preventDefault();
                if (!_this2.contactForm.validate()) {
                  _context.next = 5;
                  break;
                }
                _context.next = 5;
                return _this2.recapchaCallback();
              case 5:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "recapchaCallback",
    value: function recapchaCallback() {
      var me = this;
      grecaptcha.ready(function () {
        grecaptcha.execute('6LcF1AYqAAAAAN0d8gOTi4RtgRBzS18Kasfax2bY', {
          action: 'submit'
        }).then(function (token) {
          me.validateForm(token);
        });
      });
    }
  }, {
    key: "validateForm",
    value: function validateForm(token) {
      $('#confirm-order-customer-form').css('visibility', 'hidden');
      $.ajax({
        type: "POST",
        url: "/default/customer/customer-order-question",
        data: {
          OrderID: $('#OrderID').val(),
          OrderNumber: $('#OrderNumber').val(),
          UserID: $('#UserID').val(),
          Message: $('#Message').val(),
          Token: token
        },
        success: function success(data) {
          $('#order-customer-form form').hide();
          $('#order-customer-form').html('<p><strong>Vaše zpráva byla úspěšně odeslána. Děkujeme</strong></p>');
        }
      });
    }
  }]);
  return OrderCustomerForm;
}();
//# sourceMappingURL=OrderCustomerForm.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Question = /*#__PURE__*/function () {
  function Question() {
    var _this = this;
    _classCallCheck(this, Question);
    $(function () {
      _this.questionForm = new Form('main-form');
      _this.bindEvents();
    });
  }
  return _createClass(Question, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $('#confirm-question').click(function () {
        _this2.questionForm.validate();
        if (_this2.questionForm.valid) $('#main-form').submit();
      });
    }
  }]);
}();
//# sourceMappingURL=Question.js.map

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
var QuestionProduct = /*#__PURE__*/function () {
  function QuestionProduct() {
    var _this = this;
    _classCallCheck(this, QuestionProduct);
    $(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _this.contactForm = new Form("QuestionForm");
            if (!_this.contactForm.validate()) {
              _context.n = 1;
              break;
            }
            _context.n = 1;
            return _this.recapchaCallback();
          case 1:
            return _context.a(2);
        }
      }, _callee);
    })));
  }
  return _createClass(QuestionProduct, [{
    key: "recapchaCallback",
    value: function recapchaCallback() {
      var me = this;
      grecaptcha.ready(function () {
        grecaptcha.execute('6LdSvYUsAAAAAMEc4A38re5VImJbJI1Jz04BF2PX', {
          action: 'submit'
        }).then(function (token) {
          me.validateForm(token);
        });
      });
    }
  }, {
    key: "validateForm",
    value: function validateForm(token) {
      $.ajax({
        type: "POST",
        url: '/default/product/process-question',
        data: {
          Product_ID: $('#Product_ID').val(),
          Email: $('#Email').val(),
          Phone: $('#Phone').val(),
          Description: $('#Description').val(),
          Token: token
        },
        success: function success(data) {
          try {
            data = JSON.parse(data);
            if (data.error) {
              alerts.alert('Error', 'error', data.msg);
            } else {
              var dialogId = $('#Dialog_ID').val();
              window[dialogId].close();
              window.onSuccessDialog();
            }
          } catch (e) {
            console.error(e);
            alerts.error();
          }
        }
      });
    }
  }]);
}();
//# sourceMappingURL=QuestionProduct.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Range = /*#__PURE__*/function () {
  function Range(rangeSelector, options) {
    var _this = this;
    _classCallCheck(this, Range);
    _defineProperty(this, "options", void 0);
    _defineProperty(this, "currenturl", '');
    _defineProperty(this, "activeFilters", '');
    _defineProperty(this, "parameterRanges", {});
    $(function () {
      var _this$parameterRanges2;
      _this.options = options;
      _this.options.name = rangeSelector.replace('#', '');
      _this.parameterRanges = _defineProperty({}, _this.options.name, []);
      (_this$parameterRanges2 = _this.parameterRanges[_this.options.name]).push.apply(_this$parameterRanges2, _toConsumableArray(_this.getActiveRanges(_this.options.paramNameFrom, _this.options.paramNameTo)));
      if (_this.options.paramNameFrom.length > 0) {
        window.activeRanges = Object.assign(window.activeRanges, _defineProperty({}, _this.options.name, _defineProperty(_defineProperty({}, _this.options.paramNameFrom, _this.parameterRanges[_this.options.name][0]), _this.options.paramNameTo, _this.parameterRanges[_this.options.name][1])));
      }
      _this.initializeRange(rangeSelector);
      _this.currenturl = $('h1').data('current-url');
      _this.currentSlug = $('h1').data('current-slug');
      _this.activeFilters = _this.getActiveFilters();
    });
  }
  return _createClass(Range, [{
    key: "initializeRange",
    value: function initializeRange(rangeSelector) {
      var me = this;
      $(rangeSelector).jRange({
        from: this.options.from,
        to: this.options.to,
        step: 1,
        scale: [$(rangeSelector).data('from')].concat(_toConsumableArray(this.divideRange(this.options.to, 2))),
        format: '%s',
        width: '100%',
        isRange: true,
        showLabels: false,
        ondragend: function ondragend(vals) {
          me.formatNumber($(rangeSelector).parent()[0].id);
          return me.handleRangeEvent(vals, rangeSelector);
        },
        onstatechange: function onstatechange() {
          me.formatNumber($(rangeSelector).parent()[0].id);
          me.pagination = 1;
        }
      });
      this.setAlreadySpecifiedRange(rangeSelector);
    }
  }, {
    key: "setAlreadySpecifiedRange",
    value: function setAlreadySpecifiedRange(rangeSelector) {
      if (this.parameterRanges[this.options.name][0]) {
        $(rangeSelector).jRange('setValue', "".concat(this.parameterRanges[this.options.name][0], ",").concat(this.parameterRanges[this.options.name][1]));
        $(rangeSelector).prev('.range-info').children('.range-from').html(this.parameterRanges[this.options.name][0]);
        $(rangeSelector).prev('.range-info').children('.range-to').html(this.parameterRanges[this.options.name][1]);
      } else {
        $(rangeSelector).prev('.range-info').children('.range-from').html(this.options.from);
        $(rangeSelector).prev('.range-info').children('.range-to').html(this.options.to);
      }
    }
  }, {
    key: "divideRange",
    value: function divideRange(number, parts) {
      var range = [];
      for (var i = 1; i <= parts; i++) {
        range.push(number / i);
      }
      return range.reverse();
    }
  }, {
    key: "formatNumber",
    value: function formatNumber(idSelector) {
      $("#".concat(idSelector, " .range-from")).html($("#".concat(idSelector, " .pointer-label.low")).html().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
      $("#".concat(idSelector, " .range-to")).html($("#".concat(idSelector, " .pointer-label.high")).html().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
    }
  }, {
    key: "handleRangeEvent",
    value: function handleRangeEvent(vals) {
      var valArray = vals.split(',');
      this.parameterRanges[this.options.name] = [];
      for (var i = 0; i < valArray.length; i++) {
        this.addToParamsArray(this.options.name, i, valArray[i]);
      }
      this.updateCategoryUrl();
      return this.loadProducts();
    }
  }, {
    key: "addToParamsArray",
    value: function addToParamsArray(name, index, value) {
      this.parameterRanges[name][index] = value;
      window.activeRanges[name][Object.keys(window.activeRanges[name])[index]] = value;
    }
  }, {
    key: "updateCategoryUrl",
    value: function updateCategoryUrl() {
      var infoFilter = {
        filterKey: Object.keys(this.activeFilters)[0],
        filterValue: Object.values(this.activeFilters)[0]
      };
      var infoRange = '';
      var _iterator = _createForOfIteratorHelper(Object.keys(window.activeRanges).entries()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            i = _step$value[0],
            v = _step$value[1];
          if (Object.values(window.activeRanges[v])[0] === null) {
            continue;
          }
          var separator = infoRange.length > 0 && i > 0 ? '&' : '';
          infoRange += separator + Object.keys(window.activeRanges[v])[0] + '=';
          infoRange += Object.values(window.activeRanges[v])[0];
          infoRange += '&' + Object.keys(window.activeRanges[v])[1] + '=';
          infoRange += Object.values(window.activeRanges[v])[1];
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var filterParams = "".concat(infoFilter.filterKey, "=").concat(infoFilter.filterValue);
      var rangeParams = infoRange;
      this.changePageAndReplace(1);
      if (infoFilter.filterValue) {
        window.history.pushState({}, "", "?".concat(filterParams, "&").concat(rangeParams));
      } else {
        window.history.pushState({}, "", "?".concat(rangeParams));
      }
    }
  }, {
    key: "loadProducts",
    value: function loadProducts() {
      var me = this;
      var url;
      url = "/ajax-load" + this.removePageFromString(projectVars.currentURI);
      $("#category-products").addClass('loading');
      $.ajax({
        url: url,
        data: _objectSpread(_objectSpread({}, this.getFilterRangeData()), this.activeFilters),
        type: "GET",
        dataType: "html",
        success: function success(data) {
          $("#category-products").html(data);
          $("#category-products").removeClass('loading');
          if (!$('#pagination').length) {
            $('<div class="list-pagination" id="pagination"></div>').insertAfter('#category-products');
          }
          me.updatePagination(1);
        },
        error: function error(xhr, status) {
          alert("Sorry, there was a problem!");
          $("#category-products").removeClass('loading');
        },
        complete: function complete(xhr, status) {
          me.initializeSortingFunctionality();
        }
      });
    }
  }, {
    key: "getActiveFilters",
    value: function getActiveFilters() {
      var params = new URLSearchParams(document.location.search);
      return {
        'f': params.get("f")
      };
    }
  }, {
    key: "getActiveRanges",
    value: function getActiveRanges(from, to) {
      var params = new URLSearchParams(document.location.search);
      return [params.get(from), params.get(to)];
    }
  }, {
    key: "getFilterRangeData",
    value: function getFilterRangeData() {
      var filterRangeData = {};
      for (var _i = 0, _Object$keys = Object.keys(window.activeRanges); _i < _Object$keys.length; _i++) {
        var objType = _Object$keys[_i];
        if (Object.values(window.activeRanges[objType])[0] === null) {
          continue;
        }
        Object.assign(filterRangeData, window.activeRanges[objType]);
      }
      return filterRangeData;
    }
  }, {
    key: "initializeSortingFunctionality",
    value: function initializeSortingFunctionality() {
      $('.sorting a').click(function (e) {
        e.preventDefault();
        var $this = $(e.target);
        var sorting = $this.data('sorting');
        Cookie.setCookie('sorting', sorting, 10);
        location.reload();
      });
    }
  }, {
    key: "removePageFromString",
    value: function removePageFromString(url) {
      return url.replace(/\/?(page\/\d+\/?)/i, '');
    }
  }, {
    key: "changePageInUrl",
    value: function changePageInUrl(url, newPage) {
      var urlObject = new URL(url);
      var pathParts = urlObject.pathname.split('/');
      var pageIndex = pathParts.indexOf('page');
      if (pageIndex !== -1 && pageIndex + 1 < pathParts.length) {
        pathParts[pageIndex + 1] = newPage.toString();
        urlObject.pathname = pathParts.join('/');
      }
      return urlObject.toString();
    }
  }, {
    key: "changePageAndReplace",
    value: function changePageAndReplace(newPage) {
      var currentUrl = window.location.href;
      var newUrl = this.changePageInUrl(currentUrl, newPage);
      window.history.replaceState({}, '', newUrl);
    }
  }, {
    key: "updatePagination",
    value: function updatePagination(pagination) {
      var url = '/category/page-update';
      $.ajax({
        url: url,
        data: _objectSpread(_objectSpread({
          'slug': this.currentSlug,
          'page': pagination
        }, this.getFilterRangeData()), this.activeFilters),
        type: "GET",
        dataType: "html",
        success: function success(data) {
          $("#pagination").html(data);
        },
        error: function error(xhr, status) {
          alert("Sorry, there was a problem!");
        }
      });
    }
  }]);
}();
//# sourceMappingURL=Range.js.map

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

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Cookie = /*#__PURE__*/function () {
  function Cookie() {
    _classCallCheck(this, Cookie);
  }
  return _createClass(Cookie, null, [{
    key: "setCookie",
    value: function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
  }, {
    key: "getCookie",
    value: function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
  }]);
}();
//# sourceMappingURL=Cookie.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Form = /*#__PURE__*/function () {
  function Form(form_id) {
    _classCallCheck(this, Form);
    this.$form = $('#' + form_id);
    this.valid = true;
  }
  return _createClass(Form, [{
    key: "checkVisibility",
    value: function checkVisibility(d) {
      if (d === undefined) return true;else return !$(d).is(':hidden');
    }
  }, {
    key: "validate",
    value: function validate() {
      var _this = this;
      this.valid = true;
      this.$form.find(':input').each(function (i, e) {
        e = $(e);
        var validation_data = e.data('validator');
        if (validation_data === undefined) return;else if (typeof validation_data === 'string') validation_data = JSON.parse(validation_data);
        var value = e.val();
        var errorMessage = '';
        var errorDiv = $("#" + e.attr('name') + "Error");
        errorDiv.html('');
        e.removeClass('input-error');
        validation_data.forEach(function (v) {
          switch (v.v) {
            case Form.VALIDATOR_REQUIRED:
              if (_this.checkVisibility(v.d) && !Form.validateRequired(value)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_IN:
              if (_this.checkVisibility(v.d) && !Form.validateRegex(value, '^[0-9]{1,8}$')) errorMessage += v.m;
              break;
            case Form.VALIDATOR_EMAIL:
              if (_this.checkVisibility(v.d) && !Form.validateEmail(value)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_LENGTH:
              if (_this.checkVisibility(v.d) && !Form.validateLength(value, v.p)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_MAX_LENGTH:
              if (_this.checkVisibility(v.d) && !Form.validateMaxLength(value, v.p)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_MIN_LENGTH:
              if (_this.checkVisibility(v.d) && !Form.validateMinLength(value, v.p)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_NUMBER:
              if (_this.checkVisibility(v.d) && !Form.validateNumber(value)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_PATTERN:
              var re = new RegExp(v.p);
              if (_this.checkVisibility(v.d) && !Form.validateRegex(value, re)) errorMessage += v.m;
              break;
            case Form.VALIDATOR_RANGE:
              if (_this.checkVisibility(v.d) && !Form.validateRange()) errorMessage += v.m;
              break;
            default:
              var validateFunction = v.v.split('.');
              if (typeof window[validateFunction[0]][validateFunction[1]] === 'function') {
                if (!window[validateFunction[0]][validateFunction[1]](value)) errorMessage += v.m;
              }
              break;
          }
        });
        if (errorMessage !== '') {
          if (errorDiv.length === 0) e.after($("<div class=\"error\" id=\"".concat(e.attr('name'), "Error\"></div>")));
          $("#" + e.attr('name') + "Error").html(errorMessage);
          e.addClass('input-error');
          _this.valid = false;
        }
      });
      return this.valid;
    }
  }], [{
    key: "validateRegex",
    value: function validateRegex(value, pattern) {
      var r = new RegExp(pattern);
      return value.match(r) != null;
    }
  }, {
    key: "validateMinLength",
    value: function validateMinLength(value, minlength) {
      return value.length >= minlength;
    }
  }, {
    key: "validateMaxLength",
    value: function validateMaxLength(value, maxlength) {
      return value.length <= maxlength;
    }
  }, {
    key: "validateLength",
    value: function validateLength(value, length) {
      return toString(value).length === length;
    }
  }, {
    key: "validateEmail",
    value: function validateEmail(value) {
      return this.validateRegex(value.toLowerCase(), /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
  }, {
    key: "validateRequired",
    value: function validateRequired(value) {
      return value != '';
    }
  }, {
    key: "validateNumber",
    value: function validateNumber(value) {
      return value.isInteger(value);
    }
  }, {
    key: "validateRange",
    value: function validateRange(value, min, max) {
      return min >= value && value <= max;
    }
  }]);
}();
_defineProperty(Form, "VALIDATOR_REQUIRED", ':required');
_defineProperty(Form, "VALIDATOR_IN", ':in-validator');
_defineProperty(Form, "VALIDATOR_MIN_LENGTH", ':min_length');
_defineProperty(Form, "VALIDATOR_MAX_LENGTH", ':max_length');
_defineProperty(Form, "VALIDATOR_LENGTH", ':length');
_defineProperty(Form, "VALIDATOR_EMAIL", ':email');
_defineProperty(Form, "VALIDATOR_PATTERN", ':pattern');
_defineProperty(Form, "VALIDATOR_NUMBER", ':number');
_defineProperty(Form, "VALIDATOR_RANGE", ':range');
//# sourceMappingURL=Form.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var GoogleMap = /*#__PURE__*/function () {
  function GoogleMap(options) {
    var _this = this;
    _classCallCheck(this, GoogleMap);
    _defineProperty(this, "apiKey", void 0);
    _defineProperty(this, "coordinates", void 0);
    _defineProperty(this, "iconName", void 0);
    _defineProperty(this, "elementId", void 0);
    $(function () {
      _this.apiKey = options.apiKey;
      _this.coordinates = {
        lat: options.lat,
        lng: options.lng
      };
      _this.iconName = options.iconName;
      _this.elementId = options.elementId;
      _this.bindEvents();
    });
  }
  return _createClass(GoogleMap, [{
    key: "bindEvents",
    value: function bindEvents() {
      this.handleMap();
    }
  }, {
    key: "handleMap",
    value: function handleMap() {
      var me = this;
      var script = document.createElement('script');
      script.src = "https://maps.googleapis.com/maps/api/js?key=".concat(this.apiKey, "&v=weekly\"");
      script.onload = function () {
        me.initMap();
      };
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  }, {
    key: "initMap",
    value: function initMap() {
      var map = new google.maps.Map(document.getElementById(this.elementId), {
        center: new google.maps.LatLng(this.coordinates.lat, this.coordinates.lng),
        zoom: 16
      });
      var iconBase = "/img/front/icons/";
      var icons = {
        evidsoft: {
          icon: iconBase + this.iconName
        }
      };
      var features = [{
        position: new google.maps.LatLng(this.coordinates.lat, this.coordinates.lng),
        type: "evidsoft"
      }];

      // Create markers.
      for (var i = 0; i < features.length; i++) {
        var marker = new google.maps.Marker({
          position: features[i].position,
          icon: icons[features[i].type].icon,
          map: map
        });
      }
    }
  }]);
}();
//# sourceMappingURL=GoogleMap.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
var Helpers = /*#__PURE__*/_createClass(function Helpers() {
  _classCallCheck(this, Helpers);
});
//# sourceMappingURL=Helpers.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var NumberHelpers = /*#__PURE__*/function () {
  function NumberHelpers() {
    _classCallCheck(this, NumberHelpers);
  }
  return _createClass(NumberHelpers, [{
    key: "formatPrice",
    value: function formatPrice(number) {
      return this.number_format(number, projectVars.priceDecimalPlaces, ',', ' ') + ' ' + projectVars.currencyLabel;
    }
  }, {
    key: "isInteger",
    value: function isInteger(value) {
      return !!(Math.floor(value) == value && $.isNumeric(value));
    }
  }, {
    key: "number_format",
    value: function number_format(number, decimals, dec_point, thousands_sep) {
      number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
      var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
        dec = typeof dec_point === 'undefined' ? '.' : dec_point,
        s = '',
        toFixedFix = function toFixedFix(n, prec) {
          var k = Math.pow(10, prec);
          return '' + Math.round(n * k) / k;
        };
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
      }
      if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
      }
      return s.join(dec);
    }
  }]);
}();
//# sourceMappingURL=NumberHelpers.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Tabs = /*#__PURE__*/function () {
  function Tabs(tabcontainer_id) {
    var _this = this;
    _classCallCheck(this, Tabs);
    this.tabcontainerID = '#' + tabcontainer_id;
    $(function () {
      _this.bindEvents();
    });
  }
  return _createClass(Tabs, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $(this.tabcontainerID + ' ul.tabs li').click(function (e) {
        var $this = $(e.target);
        _this2.changeTab($this);
      });
    }
  }, {
    key: "changeTab",
    value: function changeTab(tab) {
      $(this.tabcontainerID + ' ul.tabs li').removeClass('current');
      $(this.tabcontainerID + ' .tab-content').removeClass('current');
      tab.addClass('current');
      $("#" + tab.attr('data-tab')).addClass('current');
    }
  }]);
}();
//# sourceMappingURL=Tabs.js.map

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
var AddressEditLayout = /*#__PURE__*/function () {
  function AddressEditLayout() {
    var _this = this;
    _classCallCheck(this, AddressEditLayout);
    $(function () {
      _this.addressForm = new Form('main-form');
      _this.bindEvents();
    });
  }
  return _createClass(AddressEditLayout, [{
    key: "bindEvents",
    value: function bindEvents() {
      this.clickEvent();
    }
  }, {
    key: "clickEvent",
    value: function clickEvent() {
      var me = this;
      $(".edit-address").click(function (event) {
        var addressId = $(this).data('id');
        var type = $(this).data('type');
        me.loadPage(addressId, type);
      });
      $(".remove-address").click(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(event) {
          var addressId;
          return _regenerator().w(function (_context) {
            while (1) switch (_context.n) {
              case 0:
                event.preventDefault();
                if (this.dialog) {
                  this.dialog.close();
                }
                addressId = $(this).data('id');
                this.dialog = new Dialog();
                this.dialog._title = 'Opravdu chcete odstranit adresu?';
                this.dialog._modalClass = 'delete-address-confirmation';
                _context.n = 1;
                return this.dialog.openFromUrl(projectVars.basePath + '/modal/delete-address-confirmation', {
                  addressId: addressId
                });
              case 1:
                return _context.a(2);
            }
          }, _callee, this);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
      $(".create-address-item").click(function (event) {
        var type = $(this).data('type');
        me.loadPage(null, type);
      });
    }
  }, {
    key: "loadPage",
    value: function loadPage(addressId, type) {
      var me = this;
      var url;
      url = this.buildProperUrlForPageLoading();
      $.ajax({
        url: url,
        data: {
          addressId: addressId,
          type: type
        },
        type: "GET",
        dataType: "html",
        success: function success(data) {
          me.insertLoadedPageIntoPage(data);
        },
        error: function error(xhr, status) {
          alert("Sorry, there was a problem!");
        },
        complete: function complete() {
          $('#confirm-address').click(function () {
            me.addressForm = new Form('main-form');
            $('<div class="progress-loader-wrap"><div class="progress-loader"></div></div>').insertBefore('#confirm-address');
            me.addressForm.validate();
            if (me.addressForm.valid) {
              var data = {};
              if (type === 'type-delivery') {
                data = {
                  AddressId: addressId,
                  Label: $('#Label').val(),
                  MainAddress: $('#MainAddress').is(':checked') ? 1 : 0,
                  DFirstName: $('#DFirstName').val(),
                  DLastName: $('#DLastName').val(),
                  DStreet: $('#DStreet').val(),
                  DZipCode: $('#DZipCode').val(),
                  DCity: $('#DCity').val(),
                  DCountry: $('#DCountry').val(),
                  IsDelivery: true
                };
              } else {
                var _$$val, _$$val2, _$$val3;
                data = {
                  AddressId: addressId,
                  Label: $('#Label').val(),
                  MainAddress: $('#MainAddress').is(':checked') ? 1 : 0,
                  FirstName: $('#FirstName').val(),
                  LastName: $('#LastName').val(),
                  Street: $('#Street').val(),
                  ZipCode: $('#ZipCode').val(),
                  City: $('#City').val(),
                  Country: $('#Country').val(),
                  Phone: $('#Phone').val(),
                  CompanyName: (_$$val = $('#CompanyName').val()) !== null && _$$val !== void 0 ? _$$val : '',
                  IC: (_$$val2 = $('#IC').val()) !== null && _$$val2 !== void 0 ? _$$val2 : '',
                  DIC: (_$$val3 = $('#DIC').val()) !== null && _$$val3 !== void 0 ? _$$val3 : ''
                };
              }
              $.ajax({
                url: "/default/customer/address-edit-process",
                type: 'POST',
                dataType: "html",
                data: data,
                success: function success(data) {
                  new MyAccount('address-list');
                  setTimeout(function () {
                    $('#address-edit-load').show();
                    $('#address-edit-load').css('opacity', '1');
                    $('#address-edit-load').css('width', '100%');
                    $('#address-edit-load').css('height', 'auto');
                    $('#address-edit-load').html(data);
                  }, 500);
                }
              });
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
          $('#close-edit-address').click(function () {
            $('#address-edit-load').hide();
          });
        }
      });
    }
  }, {
    key: "buildProperUrlForPageLoading",
    value: function buildProperUrlForPageLoading() {
      return "/customer/address-edit";
    }
  }, {
    key: "insertLoadedPageIntoPage",
    value: function insertLoadedPageIntoPage(data) {
      $('#address-edit-load').addClass('open');
      $('#address-edit-load').hide();
      $('#address-edit-load').html(data);
      $('#address-edit-load').show(500);
      $('html, body').animate({
        scrollTop: 0
      }, 500);
    }
  }]);
}();
//# sourceMappingURL=AddressEditLayout.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CategoryLayout = /*#__PURE__*/function () {
  function CategoryLayout() {
    var _this = this;
    _classCallCheck(this, CategoryLayout);
    _defineProperty(this, "pagination", 1);
    _defineProperty(this, "remainingProducts", void 0);
    $(function () {
      _this.bindEvents();
    });
  }
  return _createClass(CategoryLayout, [{
    key: "bindEvents",
    value: function bindEvents() {
      this.pagination = $('#ajax-load').data('current-page');
      this.remainingProducts = $(".showing.pagination-".concat(this.pagination)).data('remaining-to-display');
      this.ajaxClickEvent();
      this.hideDisplayMoreButtonIfNoMoreProductsExist(this.remainingProducts);
      $('#back-to-product-top').click(function (e) {
        new Layout().backToTop();
      });
      $('.sorting a').click(function (e) {
        e.preventDefault();
        var $this = $(e.target);
        var sorting = $this.data('sorting');
        Cookie.setCookie('sorting', sorting, 10);
        location.reload();
      });
      $('.grid a').click(function (e) {
        e.preventDefault();
        var $this = $(e.target);
        var grid = $this.parent().data('grid');
        Cookie.setCookie('grid', grid, 10);
        location.reload();
      });
      $("#show-more-description").click(function () {
        $("#long-description").toggle(250, function () {
          $('#show-more-description').hide();
        });
      });
      $("#collapse-more-description").click(function () {
        $("#long-description").toggle(250, function () {
          $('#show-more-description').show();
          new Layout().doScroll("#category-headline");
        });
      });
      new Watchdog();
    }
  }, {
    key: "ajaxClickEvent",
    value: function ajaxClickEvent() {
      var me = this;
      $("#ajax-display-more").click(function (event) {
        event.preventDefault();
        $(".loader-circle").show();
        me.loadProducts(me.increasePagination());
        new Layout().doScroll("#ajax-product-row-".concat(me.pagination));
      });
    }
  }, {
    key: "loadProducts",
    value: function loadProducts(pagination) {
      var me = this;
      this.createDivContainerForLoadingOfProducts(pagination);
      var url;
      url = this.buildProperUrlForProductLoading(pagination);
      $.ajax({
        url: url,
        data: {},
        type: "GET",
        dataType: "html",
        success: function success(data) {
          me.insertLoadedProductsIntoPage(pagination, data);
          me.hideDisplayMoreButtonIfNoMoreProductsExist($(".showing.pagination-".concat(pagination)).data('remaining-to-display'));
        },
        error: function error(xhr, status) {
          alert("Sorry, there was a problem!");
        },
        complete: function complete(xhr, status) {
          me.removePreviousPaginationRow(pagination);
          me.updateUrl(pagination);
          me.updatePagination(pagination);
          var wishlist = new Wishlist();
        }
      });
    }
  }, {
    key: "createDivContainerForLoadingOfProducts",
    value: function createDivContainerForLoadingOfProducts(pagination) {
      if (pagination === 1) {
        $("#ajax-load").empty();
        $("#ajax-load").append("<div id=\"ajax-product-row-".concat(pagination, "\"></div>"));
      } else {
        $("#ajax-load").append("<div id=\"ajax-product-row-".concat(pagination, "\"></div>"));
      }
    }
  }, {
    key: "buildProperUrlForProductLoading",
    value: function buildProperUrlForProductLoading(pagination) {
      var category = $("#ajax-load").data('category-slug');
      var currentFilter = $("#ajax-load").data('current-filter');
      return "/c/".concat(category, "/load-page/").concat(pagination, "?f=").concat(currentFilter);
    }
  }, {
    key: "insertLoadedProductsIntoPage",
    value: function insertLoadedProductsIntoPage(pagination, data) {
      $("#ajax-product-row-".concat(pagination)).hide();
      $("#ajax-product-row-".concat(pagination)).html(data);
      $("#ajax-product-row-".concat(pagination)).show(500);
    }
  }, {
    key: "insertLoadedPaginationIntoPage",
    value: function insertLoadedPaginationIntoPage(data) {
      $("#pagination").html(data);
    }
  }, {
    key: "increasePagination",
    value: function increasePagination() {
      return ++this.pagination;
    }
  }, {
    key: "removePreviousPaginationRow",
    value: function removePreviousPaginationRow(pagination) {
      $(".pl-box.origin-page-".concat(pagination - 1)).hide();
    }
  }, {
    key: "hideDisplayMoreButtonIfNoMoreProductsExist",
    value: function hideDisplayMoreButtonIfNoMoreProductsExist(remaining) {
      if (typeof remaining === "undefined") {
        $('#ajax-display-more').hide();
      }
      if (remaining == 0) {
        $('#ajax-display-more').hide(500);
      }
    }
  }, {
    key: "updateUrl",
    value: function updateUrl(pagination) {
      var currentCategorySlug = $("#ajax-load").data('category-slug');
      var currentFilter = $("#ajax-load").data('current-filter');
      window.history.pushState({}, "", "/c/".concat(currentCategorySlug, "/page/").concat(pagination, "?f=").concat(currentFilter));
    }
  }, {
    key: "updatePagination",
    value: function updatePagination(pagination) {
      var me = this;
      var url = '/category/page-update';
      $.ajax({
        url: url,
        data: {
          'slug': $("#ajax-load").data('category-slug'),
          'f': $("#ajax-load").data('current-filter'),
          'page': pagination
        },
        type: "GET",
        dataType: "html",
        success: function success(data) {
          me.insertLoadedPaginationIntoPage(data);
        },
        error: function error(xhr, status) {
          alert("Sorry, there was a problem!");
        }
      });
    }
  }]);
}();
//# sourceMappingURL=CategoryLayout.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ConsentHandler = /*#__PURE__*/function () {
  function ConsentHandler() {
    _classCallCheck(this, ConsentHandler);
  }
  return _createClass(ConsentHandler, [{
    key: "enableAnalyticsScripts",
    value: function enableAnalyticsScripts() {
      if (typeof gtag === 'undefined') {
        return;
      }
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }, {
    key: "disableAnalyticsScripts",
    value: function disableAnalyticsScripts() {
      if (typeof gtag === 'undefined') {
        return;
      }
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  }, {
    key: "enableMarketingScripts",
    value: function enableMarketingScripts() {
      if (typeof gtag === 'undefined') {
        return;
      }
      gtag('consent', 'update', {
        'ad_personalization': 'granted',
        'ad_user_data': 'granted',
        'analytics_storage': 'granted'
      });
    }
  }, {
    key: "disableMarketingScripts",
    value: function disableMarketingScripts() {
      if (typeof gtag === 'undefined') {
        return;
      }
      gtag('consent', 'default', {
        'ad_personalization': 'denied',
        'ad_user_data': 'denied'
      });
    }
  }]);
}();
//# sourceMappingURL=ConsentHandler.js.map

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var IndexLayout = /*#__PURE__*/function () {
  function IndexLayout() {
    var _this = this;

    _classCallCheck(this, IndexLayout);

    $(function () {
      _this.bindEvents();
    });
  }

  _createClass(IndexLayout, [{
    key: "bindEvents",
    value: function bindEvents() {
      $('.product-catalogue .link-holder').click();
    }
  }]);

  return IndexLayout;
}();
//# sourceMappingURL=IndexLayout.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Layout = /*#__PURE__*/function () {
  // static UTM_COOKIE = 'filokalistaUtm';
  // static REFERER_COOKIE = 'filokalistaReferer';
  function Layout() {
    var _this = this;
    _classCallCheck(this, Layout);
    $(function () {
      _this.bindEvents();
      if (page.controller === 'index' && page.action === 'index') _this.initSlider();
    });

    //new Newsletter();
  }
  return _createClass(Layout, [{
    key: "bindEvents",
    value: function () {
      var _bindEvents = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _this2 = this;
        var me, mobileBreakpoint, isMobile;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              isMobile = function _isMobile() {
                return $(window).width() < mobileBreakpoint;
              };
              me = this;
              $(window).scroll(function () {
                me.sticker();
              });
              me.menuSticker();
              $("#currency-menu .dropdown-item").click(function () {
                me.setCookie("currencyMark", $(this).data("currencyMark"), 30);
                me.setCookie("currencyName", $(this).data("currencyName"), 30);
                location.reload();
              });
              CartHeader.quantityChangeListener();
              $(".quantity-change").click(function (e) {
                var quantity = $(e.currentTarget).siblings('.quantity').val();
                if ($(e.currentTarget).hasClass('down') && quantity != 1) $(e.currentTarget).siblings('.quantity').val(quantity - 1);
                if ($(e.currentTarget).hasClass('up')) {
                  $(e.currentTarget).siblings('.quantity').val(quantity - -1);
                }
                $(e.currentTarget).siblings('.quantity').trigger('change');
              });
              this.toggleLeftSide();
              this.processUtmParams(window.location.href);
              this.processReferer();
              $('.back-to-top').click(function (e) {
                e.preventDefault();
                _this2.backToTop();
              });
              $('.mobile-search').click(function (e) {
                _this2.toggleSearch();
              });

              // $('.mobile-menu').click((e) => {
              //     this.toggleMenu();
              // });

              $('.filter .heading').click(function (e) {
                _this2.toggleFilter();
              });
              $('#menuToggle').click(function (e) {
                $('#header').toggleClass('white-menu');
                $('.mobile-menu').toggleClass('open');
              });
              $('#menu1 a').click(function () {
                $('#menuToggle input').prop('checked', false);
                $('#header').removeClass('white-menu');
                $('.mobile-menu').removeClass('open');
              });
              $('#toggle-menu').click(function (e) {
                _this2.toggleMenu();
                if ($(window).width() < 992) {}
              });
              $('#toggleMenu').click(function (e) {
                // this.toggleMenu();
                console.log(sss);
              });

              // $('#menu1 li').click((e) => {
              //     this.toggleMenu();
              // });
              if (!(location.hash === '#prihlaseni')) {
                _context.n = 1;
                break;
              }
              _context.n = 1;
              return layout.openLoginDialog();
            case 1:
              // mobile menu section
              mobileBreakpoint = 992;
              $('.category-wrapper .item img').on('click', function (e) {
                if (isMobile()) {
                  e.preventDefault();
                  e.stopPropagation();
                  var categoryWrapper = $(this).closest('.category-wrapper');
                  var itemLink = $(this).closest('.item');
                  var categoryId = itemLink.data('category-id');
                  $('.category-wrapper .item').not(itemLink).removeClass('open');
                  itemLink.toggleClass('open');
                  $('.subcategory-preview').not('[data-category-id="' + categoryId + '"]').removeClass('active');
                  var targetSubcategory = $('.subcategory-preview[data-category-id="' + categoryId + '"]');
                  targetSubcategory.toggleClass('active');
                }
              });
              $('.subcategory-item .subcategory-name a img').on('click', function (e) {
                if (isMobile()) {
                  e.preventDefault();
                  e.stopPropagation();
                  var subcategoryItem = $(this).closest('.subcategory-item');
                  var subcategoryId = subcategoryItem.data('subcategory-id');
                  $('.subcategory-item').not(subcategoryItem).removeClass('open');
                  subcategoryItem.toggleClass('open');
                }
              });
              $(window).resize(function () {
                if (!isMobile()) {
                  $('.category-wrapper .item').removeClass('open');
                  $('.subcategory-preview').removeClass('active');
                  $('.subcategory-item').removeClass('open');
                }
              });
              // end mobile menu section

              $('.category-menu .headline').click(function (e) {
                _this2.toggleHeaderCategoryMenu();
              });
              $('.product-catalogue .link-holder').click(function (e) {
                _this2.toggleProductCatalogue();
              });
              $('.header-main-menu-container .menu-item').each(function (e) {
                /*
                    let $this = $(this);
                    if ( $this.data('sub-loaded') == 0 ) {
                        $this.data('sub-loaded', 1);
                         this.running = $.ajax(projectVars.basePath + '/default/index/get-main-menu-sub-category', {
                            data: {
                                Category_ID: $this.data('category-id')
                            },
                            method: 'GET',
                            success: (data) => {
                                $this.append(data);
                                if ($(window).outerWidth() <= 768) {
                                    me.mobileMenuInit();
                                    me.mobileMenuSubMenuInit();
                                }
                                $(window).resize(function(){
                                    if ($(window).outerWidth() <= 768) {
                                        me.mobileMenuInit();
                                        me.mobileMenuSubMenuInit();
                                    }
                                });
                            }
                        });
                    }
                  */
              });

              // if ($(window).outerWidth() < 768) {
              //     me.mobileMenuInit();
              // }
              //
              // $(window).resize(function(){
              //     if ($(window).outerWidth() < 768) {
              //         me.mobileMenuSubMenuInit();
              //     }
              // });

              if ($('#announcement[data-announcement]').length) {
                $('#announcement .close').unbind().bind('click', function (e) {
                  _this2.setAnnouncementRead($(e.currentTarget).parents('#announcement').data('announcement'));
                  $(e.currentTarget).parents('#announcement').stop().fadeOut(300, function () {
                    //$(this).remove();
                  });
                });
              }
              $(function () {
                /*
                let el = document.querySelector(".instagram-posts");
                let x = 0, y = 0, top = 0, left = 0;
                 let draggingFunction = (e) => {
                    document.addEventListener('mouseup', () => {
                        document.removeEventListener("mousemove", draggingFunction);
                    });
                     el.scrollLeft = left - e.pageX + x;
                    el.scrollTop = top - e.pageY + y;
                };
                 el.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                     y = e.pageY;
                    x = e.pageX;
                    top = el.scrollTop;
                    left = el.scrollLeft;
                     document.addEventListener('mousemove', draggingFunction);
                });*/
              });
            case 2:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function bindEvents() {
        return _bindEvents.apply(this, arguments);
      }
      return bindEvents;
    }()
  }, {
    key: "backToTop",
    value: function backToTop() {
      $('html, body').animate({
        scrollTop: 0
      }, 350);
    }
  }, {
    key: "toggleSearch",
    value: function toggleSearch() {
      $('.search-block').toggle('slow');
    }

    // toggleMenu() {
    //     $('.header-main-menu-container').toggle();
    //     $('.header-main-container').toggleClass('open');
    // }

    // toggleMenu() {
    //     console.log('toggle menu .. tady by se na mobilu melo otevřít menu');
    //     $('#header .menu-container').toggle('medium');
    //     // $('.mobile-menu').toggleClass('active');
    //     $('#toggle-menu.mobile-menu').toggleClass('active');
    // }

    // toggleMenu() {
    //     $('.header-main-menu-container').toggle('medium');
    //     $('.mobile-menu').toggleClass('active');
    //     $('#toggleMenu').toggleClass('active');
    // }
  }, {
    key: "toggleHeaderCategoryMenu",
    value: function toggleHeaderCategoryMenu() {
      $('#header .category-menu').toggleClass('active');
      this.toggleLeftSide();
    }
  }, {
    key: "toggleLeftSide",
    value: function toggleLeftSide() {
      if ($(window).width() > 991) {
        $('#content .left-side').css('padding-top', $('#header .category-menu').height() - 20 + 'px');
      }
    }
  }, {
    key: "toggleFilter",
    value: function toggleFilter() {
      $('.filter .block').toggle('medium');
    }
  }, {
    key: "toggleProductCatalogue",
    value: function toggleProductCatalogue() {
      $('.product-catalogue .categories').toggle();
    }
  }, {
    key: "cookiePopup",
    value: function cookiePopup() {
      var cookie_popup = Cookie.getCookie('cookie-popup');
      if (cookie_popup === undefined || !cookie_popup) {
        $('#cookieBar').css('display', 'flex');
      }
      $('#cookieBar button').click(function () {
        Cookie.setCookie('cookie-popup', true, 900);
        $('#cookieBar').hide();
      });
    }
  }, {
    key: "doScroll",
    value: function doScroll(targetNode) {
      var target = $(targetNode);
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  }, {
    key: "initSlider",
    value: function initSlider() {
      $("#slider").responsiveSlides({
        auto: true,
        pager: false,
        nav: false,
        speed: 800,
        namespace: "centered-btns",
        manualControls: '.slider-pager'
      });
    }
  }, {
    key: "setAnnouncementRead",
    value: function setAnnouncementRead(Hash) {
      var announcements = Cookie.getCookie('announcement');
      if (announcements.length) announcements = JSON.parse(announcements);else announcements = [];
      announcements.push(Hash);
      Cookie.setCookie('announcement', JSON.stringify(announcements), '10');
    }
  }, {
    key: "processUtmParams",
    value: function processUtmParams(href) {
      var isVisitorFromExternalCampaign;
      var isCookieExists;
      if (!Layout.checkCookieName(Layout.UTM_COOKIE)) {
        isCookieExists = false;
        isVisitorFromExternalCampaign = !!href.match(/(?:utm_source|utm_medium|utm_name|utm_content)/i);
      } else {
        isCookieExists = true;
        isVisitorFromExternalCampaign = true;
      }
      if (!isCookieExists && isVisitorFromExternalCampaign) {
        var utmParams = this.prepareUtmParams(href);
        this.setCookie(Layout.UTM_COOKIE, utmParams, 1);
      }
    }
  }, {
    key: "processReferer",
    value: function processReferer() {
      var isCookieExists = Layout.checkCookieName(Layout.REFERER_COOKIE);
      var referer = document.referrer;
      if (!isCookieExists && referer) {
        var refererValue = this.prepareRefererValue(referer);
        if (refererValue !== 'vamot') this.setCookie(Layout.REFERER_COOKIE, refererValue, 1);
      }
    }
  }, {
    key: "setCookie",
    value: function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
  }, {
    key: "sticker",
    value: function sticker() {
      var header = $('#header');
      var headerHeight = header.height();
      var content = $('#content');
      var winScroll = $(window).scrollTop();
      header.toggleClass('fixed', 0 - winScroll <= 0);
      //content.css('padding-top', headerHeight + 20);
      /*
      if(0 - winScroll <= 0) {
          content.css('padding-top', headerHeight + 20);
      } else {
          content.css('padding-top', 0);
      }*/
    }
  }, {
    key: "prepareUtmParams",
    value: function prepareUtmParams(href) {
      var params = href.split('?');
      var paramValues = params[1].split('&');
      var finalParamsString = [];
      var _iterator = _createForOfIteratorHelper(paramValues),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var paramValue = _step.value;
          var data = paramValue.split('=');
          if (data[0].match(/(utm_source|utm_medium|utm_name|utm_content)/i)) finalParamsString.push("".concat(data[0], "=").concat(data[1]));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return finalParamsString.join('&');
    }
  }, {
    key: "prepareRefererValue",
    value: function prepareRefererValue(referer) {
      var dataWithoutSubdomain = referer.replace('www.', '').replace('search.', '');
      var dataWithoutProtocol = dataWithoutSubdomain.split('://')[1];
      return dataWithoutProtocol.split('.')[0];
    }
  }, {
    key: "mobileMenuInit",
    value: function mobileMenuInit() {
      $('.menu-item[data-category-id] > a').click(function (e) {
        e.preventDefault();
        $(this).parent('[data-category-id]').children('.sub-menu').addClass('show');
      });
    }
  }, {
    key: "mobileMenuSubMenuInit",
    value: function mobileMenuSubMenuInit() {
      $('.menu-item[data-category-id] .sub-menu .back-item').each(function (e) {
        $(this).click(function (e) {
          e.preventDefault();
          $(this).closest('.sub-menu').removeClass('show');
        });
      });
    }
  }, {
    key: "openLoginDialog",
    value: function () {
      var _openLoginDialog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (this.dialog) {
                this.dialog.close();
              }
              this.dialog = new Dialog();
              this.dialog._modalClass = 'login';
              _context2.n = 1;
              return this.dialog.openFromUrl(projectVars.basePath + '/modal/login');
            case 1:
              new LoginForm();
            case 2:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function openLoginDialog() {
        return _openLoginDialog.apply(this, arguments);
      }
      return openLoginDialog;
    }()
  }, {
    key: "menuSticker",
    value: function menuSticker() {
      var threshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
      var me = this;
      $('.category-wrapper').hover(function () {
        if (window.scrollY >= threshold) {
          var subcategoryPreview = $(this).find('.subcategory-preview');
          var rightOffset = me.rightSpaceCalculationForFixedMenu('.container');
          subcategoryPreview.addClass('fixed');
          if (rightOffset > 0) {
            subcategoryPreview.css('right', rightOffset);
          } else {
            var leftOffset = me.leftSpaceCalculationForFixedMenu('.container');
            subcategoryPreview.css('left', leftOffset);
          }
        } else {
          $(this).find('.subcategory-preview').removeClass('fixed');
          $(this).find('.subcategory-preview').css({
            'right': '',
            'left': ''
          });
        }
      });
    }
  }, {
    key: "openRegistrationInfoDialog",
    value: function () {
      var _openRegistrationInfoDialog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(title, content) {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              console.log('openRegistrationInfoDialog', title, content);
              if (this.dialog) {
                this.dialog.close();
              }
              this.dialog = new Dialog();
              this.dialog.modalClass = 'registration-info';
              this.dialog._title = title;
              _context3.n = 1;
              return this.dialog.openFromUrl(projectVars.basePath + '/customer/registration-info', {
                content: content
              });
            case 1:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function openRegistrationInfoDialog(_x, _x2) {
        return _openRegistrationInfoDialog.apply(this, arguments);
      }
      return openRegistrationInfoDialog;
    }()
  }, {
    key: "rightSpaceCalculationForFixedMenu",
    value: function rightSpaceCalculationForFixedMenu(selector) {
      var content = document.querySelector(selector);
      if (content) {
        var rect = content.getBoundingClientRect();
        var spaceRight = window.innerWidth - rect.right;
        if (spaceRight < 100) {
          return 0;
        }
        return spaceRight + 'px';
      }
    }
  }, {
    key: "leftSpaceCalculationForFixedMenu",
    value: function leftSpaceCalculationForFixedMenu(selector) {
      var content = document.querySelector(selector);
      if (content) {
        var rect = content.getBoundingClientRect();
        var spaceLeft = rect.left;
        var categoryMenuWidth = $('.category-menu.active').width();
        return spaceLeft + categoryMenuWidth + 'px';
      }
    }
  }], [{
    key: "checkCookieName",
    value: function checkCookieName(name) {
      var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) {
        return match[2];
      } else {
        return false;
      }
    }
  }, {
    key: "deleteCookie",
    value: function deleteCookie(cname) {
      document.cookie = cname + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }]);
}();
//# sourceMappingURL=Layout.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ManufacturerLayout = /*#__PURE__*/function () {
  function ManufacturerLayout() {
    var _this = this;
    _classCallCheck(this, ManufacturerLayout);
    _defineProperty(this, "pagination", 1);
    _defineProperty(this, "remainingProducts", void 0);
    $(function () {
      _this.bindEvents();
    });
  }
  return _createClass(ManufacturerLayout, [{
    key: "bindEvents",
    value: function bindEvents() {
      this.pagination = $('#ajax-load').data('current-page');
      this.remainingProducts = $(".showing.pagination-".concat(this.pagination)).data('remaining-to-display');
      this.ajaxClickEvent();
      this.hideDisplayMoreButtonIfNoMoreProductsExist(this.remainingProducts);
      $('#back-to-product-top').click(function (e) {
        new Layout().backToTop();
      });
      $('.sorting a').click(function (e) {
        e.preventDefault();
        var $this = $(e.target);
        var sorting = $this.data('sorting');
        Cookie.setCookie('sorting', sorting, 10);
        location.reload();
      });
      $("#show-more-description").click(function () {
        $("#long-description").toggle(250, function () {
          $("#short-description").hide();
          $('#show-more-description').hide();
        });
      });
      $("#collapse-more-description").click(function () {
        $("#long-description").toggle(250, function () {
          $("#short-description").show(250);
          $('#show-more-description').show();
        });
      });
    }
  }, {
    key: "ajaxClickEvent",
    value: function ajaxClickEvent() {
      var me = this;
      $("#ajax-display-more").click(function (event) {
        event.preventDefault();
        $(".loader-circle").show();
        me.loadProducts(me.increasePagination());
        new Layout().doScroll("#ajax-product-row-".concat(me.pagination));
      });
    }
  }, {
    key: "loadProducts",
    value: function loadProducts(pagination) {
      var me = this;
      this.createDivContainerForLoadingOfProducts(pagination);
      var url;
      url = this.buildProperUrlForProductLoading(pagination);
      $.ajax({
        url: url,
        data: {},
        type: "GET",
        dataType: "html",
        success: function success(data) {
          me.insertLoadedProductsIntoPage(pagination, data);
          me.hideDisplayMoreButtonIfNoMoreProductsExist($(".showing.pagination-".concat(pagination)).data('remaining-to-display'));
        },
        error: function error(xhr, status) {
          alert("Sorry, there was a problem!");
        },
        complete: function complete(xhr, status) {
          me.removePreviousPaginationRow(pagination);
          me.updateUrl(pagination);
          me.updatePagination(pagination);
        }
      });
    }
  }, {
    key: "createDivContainerForLoadingOfProducts",
    value: function createDivContainerForLoadingOfProducts(pagination) {
      if (pagination === 1) {
        $("#ajax-load").empty();
        $("#ajax-load").append("<div id=\"ajax-product-row-".concat(pagination, "\"></div>"));
      } else {
        $("#ajax-load").append("<div id=\"ajax-product-row-".concat(pagination, "\"></div>"));
      }
    }
  }, {
    key: "buildProperUrlForProductLoading",
    value: function buildProperUrlForProductLoading(pagination) {
      var manufacturer = $("#ajax-load").data('manufacturer-slug');
      return "/znacky/".concat(manufacturer, "/load-page/").concat(pagination);
    }
  }, {
    key: "insertLoadedProductsIntoPage",
    value: function insertLoadedProductsIntoPage(pagination, data) {
      $("#ajax-product-row-".concat(pagination)).hide();
      $("#ajax-product-row-".concat(pagination)).html(data);
      $("#ajax-product-row-".concat(pagination)).show(500);
    }
  }, {
    key: "insertLoadedPaginationIntoPage",
    value: function insertLoadedPaginationIntoPage(data) {
      $("#pagination").html(data);
    }
  }, {
    key: "increasePagination",
    value: function increasePagination() {
      return ++this.pagination;
    }
  }, {
    key: "removePreviousPaginationRow",
    value: function removePreviousPaginationRow(pagination) {
      $(".pl-box.origin-page-".concat(pagination - 1)).hide();
    }
  }, {
    key: "hideDisplayMoreButtonIfNoMoreProductsExist",
    value: function hideDisplayMoreButtonIfNoMoreProductsExist(remaining) {
      if (typeof remaining === "undefined") {
        $('#ajax-display-more').hide();
      }
      if (remaining == 0) {
        $('#ajax-display-more').hide(500);
      }
    }
  }, {
    key: "updateUrl",
    value: function updateUrl(pagination) {
      var currentManufacturerSlug = $("#ajax-load").data('manufacturer-slug');
      window.history.pushState({}, "", "/znacky/".concat(currentManufacturerSlug, "/page/").concat(pagination, "/"));
    }
  }, {
    key: "updatePagination",
    value: function updatePagination(pagination) {
      var me = this;
      var url = '/manufacturer/page-update';
      $.ajax({
        url: url,
        data: {
          'slug': $("#ajax-load").data('manufacturer-slug'),
          'page': pagination
        },
        type: "GET",
        dataType: "html",
        success: function success(data) {
          me.insertLoadedPaginationIntoPage(data);
        },
        error: function error(xhr, status) {
          alert("Sorry, there was a problem!");
        }
      });
    }
  }]);
}();
//# sourceMappingURL=ManufacturerLayout.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var MyAccount = /*#__PURE__*/function () {
  function MyAccount(defaultPage) {
    var _this = this;
    _classCallCheck(this, MyAccount);
    _defineProperty(this, "defaultPage", void 0);
    this.defaultPage = defaultPage;
    $(function () {
      _this.bindEvents();
      _this.init();
    });
  }
  return _createClass(MyAccount, [{
    key: "bindEvents",
    value: function bindEvents() {
      this.clickEvent();
    }
  }, {
    key: "init",
    value: function init() {
      var paramsString = location.search;
      var searchParams = new URLSearchParams(paramsString);
      var indexParam = searchParams.get('page');
      if (indexParam) {
        this.clearActiveNavigation();
        this.loadPage(indexParam);
        $("a[data-href$=".concat(indexParam, "]")).parent().addClass('active');
      } else {
        this.loadPage(this.defaultPage);
      }
    }
  }, {
    key: "clickEvent",
    value: function clickEvent() {
      var me = this;
      $(".navigation-container li").click(function (event) {
        event.preventDefault();
        var pageSlug = $(this).children('a').attr('data-href');
        me.loadPage(pageSlug);
        me.clearActiveNavigation();
        $(this).addClass('active');
        me.updatePageUrl(pageSlug);
      });
    }
  }, {
    key: "loadPage",
    value: function loadPage(pageSlug) {
      var me = this;
      var url;
      url = this.buildProperUrlForPageLoading(pageSlug);
      $.ajax({
        url: url,
        data: {},
        type: "GET",
        dataType: "html",
        success: function success(data) {
          me.updatePageBlock(data);
        },
        error: function error(xhr, status) {
          alert("Sorry, there was a problem!");
        },
        complete: function complete(xhr, status) {
          new OrderDetailLayout();
          new AddressEditLayout();
          new PersonalDataEditLayout();
        }
      });
    }
  }, {
    key: "buildProperUrlForPageLoading",
    value: function buildProperUrlForPageLoading(pageSlug) {
      return "/customer/".concat(pageSlug);
    }
  }, {
    key: "updatePageBlock",
    value: function updatePageBlock(data) {
      $('#page-block').html(data);
    }
  }, {
    key: "clearActiveNavigation",
    value: function clearActiveNavigation() {
      $(".navigation-container li").removeClass('active');
    }
  }, {
    key: "updatePageUrl",
    value: function updatePageUrl(pageSlug) {
      window.history.pushState({}, "", "?page=".concat(pageSlug));
    }
  }]);
}();
//# sourceMappingURL=MyAccount.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var MyAccountSubPageLayout = /*#__PURE__*/function () {
  function MyAccountSubPageLayout(defaultPage) {
    var _this = this;
    _classCallCheck(this, MyAccountSubPageLayout);
    _defineProperty(this, "defaultPage", void 0);
    this.defaultPage = defaultPage;
    $(function () {
      _this.bindEvents();
    });
  }
  _createClass(MyAccountSubPageLayout, [{
    key: "bindEvents",
    value: function bindEvents() {
      this.clickEvent();
      this.handleSubPageValue();
    }
  }, {
    key: "handleSubPageValue",
    value: function handleSubPageValue() {
      var paramsString = location.search;
      var searchParams = new URLSearchParams(paramsString);
      var indexParam = searchParams.get('sub-page');
      if (indexParam) {
        this.clearActiveStatus();
        this.loadPage(indexParam);
        $("a[data-href$=".concat(indexParam, "]")).parent().addClass('active');
      } else {
        this.loadPage(this.defaultPage);
      }
    }
  }, {
    key: "clickEvent",
    value: function clickEvent() {
      var me = this;
      $(".page-submenu-item").click(function (event) {
        event.preventDefault();
        var pageSlug = $(this).children('a').attr('data-href');
        // $(".loader-circle").show();
        me.loadPage(pageSlug);
        me.clearActiveStatus();
        $(this).addClass('active');
        me.updatePageUrl(pageSlug);
      });
    }
  }, {
    key: "loadPage",
    value: function loadPage(pageSlug) {
      var me = this;
      var url;
      url = this.buildProperUrlForPageLoading(pageSlug);
      $.ajax({
        url: url,
        data: {},
        type: "GET",
        dataType: "html",
        success: function success(data) {
          me.insertLoadedPageIntoPage(data);
        },
        error: function error(xhr, status) {
          alert("Sorry, there was a problem!");
        },
        complete: function complete(xhr, status) {
          me.refreshBreadcrumb(pageSlug);
          new OrderDetailLayout();
          new AddressEditLayout();
          new PersonalDataEditLayout();
          new BannerGeneratorForm();
        }
      });
    }
  }, {
    key: "refreshBreadcrumb",
    value: function refreshBreadcrumb() {
      var nameOfPage = $('#page-load h2').html();
      var breadcrumb = $('#breadcrumb');
      $('.current-page').empty();
      breadcrumb.append("<a class=\"current-page\"><span>".concat(nameOfPage, "</span></a>"));
    }
  }, {
    key: "buildProperUrlForPageLoading",
    value: function buildProperUrlForPageLoading(pageSlug) {
      return "/customer/".concat(pageSlug);
    }
  }, {
    key: "insertLoadedPageIntoPage",
    value: function insertLoadedPageIntoPage(data) {
      $('#page-load').hide();
      $('#page-load').html(data);
      $('#page-load').show(500);
    }
  }, {
    key: "clearActiveStatus",
    value: function clearActiveStatus() {
      $(".page-submenu-item").removeClass('active');
    }
  }, {
    key: "updatePageUrl",
    value: function updatePageUrl(pageSlug) {
      window.history.pushState({}, "", "?sub-page=".concat(pageSlug));
    }
  }]);
  return MyAccountSubPageLayout;
}();
//# sourceMappingURL=MyAccountSubPageLayout.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Newsletter = /*#__PURE__*/function () {
  function Newsletter() {
    var _this = this;
    _classCallCheck(this, Newsletter);
    $(function () {
      _this.bindEvents();
    });
  }
  return _createClass(Newsletter, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $(".newsletter-subscribe").click(function (e) {
        _this2.newsletterSubscribe();
      });
    }
  }, {
    key: "newsletterSubscribe",
    value: function newsletterSubscribe() {
      $.ajax({
        type: "POST",
        url: "/default/customer/newsletter-subscribe",
        data: {
          NewsletterSubscriber: $('.newsletter-email').val()
        },
        success: function success(data) {
          var newsletterMessage = $('.newsletter-container .message');
          newsletterMessage.show();
          newsletterMessage.html(data);
        }
      });
    }
  }]);
}();
//# sourceMappingURL=Newsletter.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var OrderDetailLayout = /*#__PURE__*/function () {
  function OrderDetailLayout() {
    var _this = this;
    _classCallCheck(this, OrderDetailLayout);
    _defineProperty(this, "isOpen", false);
    $(function () {
      _this.bindEvents();
    });
  }
  return _createClass(OrderDetailLayout, [{
    key: "bindEvents",
    value: function bindEvents() {
      this.clickEvent();
    }
  }, {
    key: "clickEvent",
    value: function clickEvent() {
      var me = this;
      $(".open-order-detail").click(function (event) {
        if (me.isOpen) {
          $("#order-detail-block").remove();
          me.isOpen = false;
          if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            $(this).parent('td').parent('tr').removeClass('open-order-detail');
            return;
          }
        }
        $(".order-detail").removeClass('open');
        $(".order-history tr").removeClass('open-order-detail');
        var orderId = $(this).attr('data-id');
        // $(".loader-circle").show();
        $('<tr id="order-detail-block"><td colspan="6"><div id="order-detail-load"></div></td></tr>').insertAfter($(this).parent('td').parent('tr'));
        me.loadPage(orderId);
        $(this).addClass('open');
        $(this).parent('td').parent('tr').addClass('open-order-detail');
        me.isOpen = true;
      });
    }
  }, {
    key: "loadPage",
    value: function loadPage(orderId) {
      var me = this;
      var url;
      url = this.buildProperUrlForPageLoading(orderId);
      $.ajax({
        url: url,
        data: {},
        type: "GET",
        dataType: "html",
        success: function success(data) {
          me.insertLoadedPageIntoPage(data);
        },
        error: function error(xhr, status) {
          alert("Sorry, there was a problem!");
        },
        complete: function complete() {
          new OrderCustomerForm();
        }
      });
    }
  }, {
    key: "buildProperUrlForPageLoading",
    value: function buildProperUrlForPageLoading(orderId) {
      return "/customer/order-detail/id/".concat(orderId);
    }
  }, {
    key: "insertLoadedPageIntoPage",
    value: function insertLoadedPageIntoPage(data) {
      $('#order-detail-load').hide();
      $('#order-detail-load').html(data);
      $('#order-detail-load').show(500);
    }
  }]);
}();
//# sourceMappingURL=OrderDetailLayout.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var PersonalDataEditLayout = /*#__PURE__*/function () {
  function PersonalDataEditLayout() {
    var _this = this;
    _classCallCheck(this, PersonalDataEditLayout);
    $(function () {
      _this.personalDataForm = new Form('main-form-change-personal-data');
      _this.bindEvents();
    });
  }
  return _createClass(PersonalDataEditLayout, [{
    key: "bindEvents",
    value: function bindEvents() {
      var me = this;
      $('#confirm-personal-data-change').click(function () {
        $('<div class="progress-loader-wrap"><div class="progress-loader"></div></div>').insertBefore('#confirm-address');
        me.personalDataForm.validate();
        if (me.personalDataForm.valid) {
          var _$$val, _$$val2, _$$val3;
          $.ajax({
            url: "/default/customer/edit-password-process/",
            type: 'POST',
            dataType: "html",
            data: {
              // FirstName: $('#FirstName').val(),
              // LastName: $('#LastName').val(),
              // Email: $('#Email').val(),
              // Phone: $('#Phone').val(),
              CurrentPassword: (_$$val = $('#CurrentPassword').val()) !== null && _$$val !== void 0 ? _$$val : '',
              Password: (_$$val2 = $('#Password').val()) !== null && _$$val2 !== void 0 ? _$$val2 : '',
              PasswordAgain: (_$$val3 = $('#PasswordAgain').val()) !== null && _$$val3 !== void 0 ? _$$val3 : ''
            },
            success: function success(data) {
              new MyAccount('my-account-personal-data');
              setTimeout(function () {
                $('#message').html(data);
              }, 500);
            }
          });
        }
      });
    }
  }]);
}();
//# sourceMappingURL=PersonalDataEditLayout.js.map

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

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var QuickSearch = /*#__PURE__*/function () {
  /**
   * Konstruktor pro QuickSearch
   * 
   * @param {string} id 
   */
  function QuickSearch() {
    var _this = this;
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'search-result-block';
    _classCallCheck(this, QuickSearch);
    this._id = id;
    this._element = null;
    this._form = null;
    this._searchInput = null;
    this._searchTimeout = null;
    this._items = null;
    $(function () {
      _this.init();
      _this.bindEvents();
    });
  }

  /**
   * Inicializuje třídu
   * 
   * @returns {void}
   */
  return _createClass(QuickSearch, [{
    key: "init",
    value: function init() {
      this._element = $('#' + this._id);
      this._items = this._element.find('.items');
      this._form = this._element.parent().children('form');
      return;
    }

    /**
     * Nastaví všechny eventy
     * 
     * @returns {void}
     */
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      if (this._form) {
        this._searchInput = this._form.find('[name="SearchTerm"]');
        if (this._searchInput.length) {
          this._searchInput.on('reset input paste cut', function (ev) {
            _this2.inputHandler(ev.currentTarget.value);
          });
          this._form.on('reset', function (ev) {
            _this2.inputHandler('');
          });
        }
      }
      return;
    }

    /**
     * Handle pro zpracování vyhledávání
     * 
     * @param {*} ev 
     * @return {boolean}
     */
  }, {
    key: "inputHandler",
    value: function inputHandler(val) {
      var _this3 = this;
      if (val.length < 3) {
        this.hide();
        return false;
      }
      clearTimeout(this._searchTimeout);
      this._searchTimeout = setTimeout(function () {
        _this3.show();
        if (_this3.running) {
          _this3.running.abort();
        }
        _this3._performSearch(val);
      }, 250);
      return true;
    }

    /**
     * Zobrazí quick search
     * 
     * @returns {void}
     */
  }, {
    key: "show",
    value: function show() {
      var _this4 = this;
      this._element.stop().slideDown(300, function () {
        _this4._element.removeAttr('style');
      });
      this._form.addClass('active');
      this._element.addClass('active');
      return;
    }

    /**
     * Skryje quick search
     * 
     * @returns {void}
     */
  }, {
    key: "hide",
    value: function hide() {
      var _this5 = this;
      this._element.stop().slideUp(300, function () {
        _this5._form.removeClass('active');
        _this5._element.removeClass('active');
      });
      return;
    }

    /**
     * Vyhledá produkt
     * 
     * @param {string} val 
     * @returns {void}
     */
  }, {
    key: "_performSearch",
    value: function _performSearch(val) {
      var _this6 = this;
      this.renderLoading();
      this.running = $.ajax(projectVars.basePath + '/search/quick', {
        data: {
          searchTerm: val
        },
        method: 'POST',
        success: function success(data) {
          _this6._element.html(data);
          _this6.show();
        },
        error: function error() {
          _this6.hide();
        }
      });
      return;
    }

    /**
     * Vykreslí načítací obrazovku
     * 
     * @returns {void}
     */
  }, {
    key: "renderLoading",
    value: function renderLoading() {
      var html = "<div class=\"loading\">Na\u010D\xEDt\xE1m ...</div>";
      this._element.html(html);
    }
  }]);
}();
//# sourceMappingURL=QuickSearch.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SearchLayout = /*#__PURE__*/function () {
  function SearchLayout() {
    var _this = this;
    _classCallCheck(this, SearchLayout);
    $(function () {
      _this.bindEvents();
    });
  }
  return _createClass(SearchLayout, [{
    key: "bindEvents",
    value: function bindEvents() {
      new Watchdog();
    }
  }]);
}();
//# sourceMappingURL=SearchLayout.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Balikovna = /*#__PURE__*/function () {
  function Balikovna() {
    var _this = this;
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'BALIKOVNY';
    _classCallCheck(this, Balikovna);
    _defineProperty(this, "type", null);
    _defineProperty(this, "bindEvents", function () {
      var selector = '#balikovnaChoosePickupPlace';
      if (_this.type === 'POST_OFFICE') {
        selector = '#balikNaPostuChoosePickupPlace';
      }
      $(selector).unbind('click').click(function (e) {
        e.preventDefault();
        _this.createModal();
        window.addEventListener('message', _this.iframeListener);
      });
    });
    _defineProperty(this, "iframeListener", function (event) {
      if (event.data.message === 'pickerResult') {
        $('.balikovna-overlay').remove();
        _this.showSelectedPickupPoint(event.data.point);
      }
    });
    // Vytvoření modalu
    _defineProperty(this, "createModal", function () {
      _this.clear();
      // Vytvoření overlay prvku
      var $overlay = $('<div class="balikovna-overlay">').css({
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100%',
        'background-color': 'rgba(0, 0, 0, 0.7)',
        'z-index': '1000',
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center'
      });

      // Vytvoření modálního okna
      var $modal = $('<div>').css({
        'background-color': 'white',
        'border-radius': '5px',
        'padding': '20px',
        'max-width': '90%',
        'max-height': '90%',
        'position': 'relative',
        'overflow': 'hidden'
      });

      // Vytvoření tlačítka pro zavření
      var $closeButton = $('<button>').text('X').css({
        'position': 'absolute',
        'top': '10px',
        'right': '10px',
        'border': 'none',
        'background': 'none',
        'font-size': '20px',
        'cursor': 'pointer'
      }).on('click', function () {
        $overlay.remove();
      });

      // Vytvoření iframe
      var $iframe = $('<iframe>', {
        'title': 'Výběr místa pro vyzvednutí zásilky',
        'src': "https://b2c.cpost.cz/locations/?type=".concat(_this.type),
        'allow': 'geolocation'
      }).css({
        'width': '90vw',
        'height': '80vh',
        'border': 'none'
      });

      // Sestavení modalu
      $modal.append($closeButton);
      $modal.append($iframe);
      $overlay.append($modal);

      // Přidání do DOM
      $('body').append($overlay);
    });
    // Funkce pro otevření mPOST_OFFICEodalu při kliknutí na tlačítko
    _defineProperty(this, "createModalButton", function () {
      var $button = $('<button>').text('Vybrat místo vyzvednutí').on('click', function () {
        _this.createModal();
      });
      $('body').append($button);
    });
    this.type = type;
    this.bindEvents();
  }
  return _createClass(Balikovna, [{
    key: "showSelectedPickupPoint",
    value: function showSelectedPickupPoint(point) {
      var pickupPointElementId = 'm1-balikovna';
      if (this.type === 'POST_OFFICE') {
        pickupPointElementId = 'm1-balik-na-postu';
      }
      var divContainer = document.getElementById(pickupPointElementId);
      divContainer.style.display = "block";
      divContainer.innerText = "Vybrané místo: " + (point ? point.name : "Žádné");
      divContainer.dataset.pointChosen = !!point;
      divContainer.dataset.pointId = point ? point.id : '';
      divContainer.dataset.pointName = point ? point.name : '';
      divContainer.dataset.pointAddress = point ? "".concat(point.street, ", ").concat(point.municipality_name, ", ").concat(point.zip) : '';
      if (this.type === 'POST_OFFICE') {
        ShippingPayment.handleBalikNaPostu();
      } else {
        ShippingPayment.handleBalikovna();
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      var pickupPointElementId = 'm1-balikovna';
      if (this.type === 'POST_OFFICE') {
        pickupPointElementId = 'm1-balik-na-postu';
      }
      var divContainer = document.getElementById(pickupPointElementId);
      divContainer.innerText = "";
      Packeta.Widget.close();
    }
  }]);
}();
//# sourceMappingURL=Balikovna.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Balikovna = /*#__PURE__*/function () {
  function Balikovna() {
    var _this = this;
    _classCallCheck(this, Balikovna);
    _defineProperty(this, "bindEvents", function () {
      $('#balikovnaChoosePickupPlace').click(function () {
        _this.createModal();
        window.addEventListener('message', _this.iframeListener);
      });
    });
    _defineProperty(this, "iframeListener", function (event) {
      if (event.data.message === 'pickerResult') {
        console.log('Vybráno místo:', event.data.point);
        $('.balikovna-overlay').remove();
        _this.showSelectedPickupPoint(event.data.point);
      }
    });
    // Vytvoření modalu
    _defineProperty(this, "createModal", function () {
      _this.clear();
      // Vytvoření overlay prvku
      var $overlay = $('<div class="balikovna-overlay">').css({
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100%',
        'background-color': 'rgba(0, 0, 0, 0.7)',
        'z-index': '1000',
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center'
      });

      // Vytvoření modálního okna
      var $modal = $('<div>').css({
        'background-color': 'white',
        'border-radius': '5px',
        'padding': '20px',
        'max-width': '90%',
        'max-height': '90%',
        'position': 'relative',
        'overflow': 'hidden'
      });

      // Vytvoření tlačítka pro zavření
      var $closeButton = $('<button>').text('X').css({
        'position': 'absolute',
        'top': '10px',
        'right': '10px',
        'border': 'none',
        'background': 'none',
        'font-size': '20px',
        'cursor': 'pointer'
      }).on('click', function () {
        $overlay.remove();
      });

      // Vytvoření iframe
      var $iframe = $('<iframe>', {
        'title': 'Výběr místa pro vyzvednutí zásilky',
        'src': 'https://b2c.cpost.cz/locations/?type=BALIKOVNY',
        'allow': 'geolocation'
      }).css({
        'width': '90vw',
        'height': '80vh',
        'border': 'none'
      });

      // Sestavení modalu
      $modal.append($closeButton);
      $modal.append($iframe);
      $overlay.append($modal);

      // Přidání do DOM
      $('body').append($overlay);
    });
    // Funkce pro otevření modalu při kliknutí na tlačítko
    _defineProperty(this, "createModalButton", function () {
      var $button = $('<button>').text('Vybrat místo vyzvednutí').on('click', function () {
        _this.createModal();
      });
      $('body').append($button);
    });
    this.bindEvents();
  }
  return _createClass(Balikovna, [{
    key: "showSelectedPickupPoint",
    value: function showSelectedPickupPoint(point) {
      console.log('this:', point);
      var divContainer = document.getElementById('m1-balikovna');
      divContainer.style.display = "block";
      divContainer.innerText = "Vybrané místo: " + (point ? point.name : "Žádné");
      divContainer.dataset.pointChosen = !!point;
      divContainer.dataset.pointId = point ? point.id : '';
      divContainer.dataset.pointName = point ? point.name : '';
      divContainer.dataset.pointAddress = point ? "".concat(point.street, ", ").concat(point.municipality_name, ", ").concat(point.zip) : '';
      ShippingPayment.handleBalikovna();
    }
  }, {
    key: "clear",
    value: function clear() {
      var elements = document.querySelectorAll('.balikovna-selected-pickup-point');
      for (var i = 0; i < elements.length; i++) {
        elements[i].innerText = "";
      }
      Packeta.Widget.close();
    }
  }]);
}(); // Inicializace třídy
$(document).ready(function () {
  new Balikovna();
});
//# sourceMappingURL=Balíkovna.js.map

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
var CartPage = /*#__PURE__*/function () {
  function CartPage() {
    _classCallCheck(this, CartPage);
    this.bindEvents();
  }
  return _createClass(CartPage, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;
      $(function () {
        $('.quantity').change(function (e) {
          var $this = $(e.target);
          var productID = $this.data('product-id');
          var quantity = $this.val();
          var montage = $('.montage [data-product-id="' + productID + '"]').val();
          Cart.updateCart(productID, quantity, true, function (data) {
            CartPage.updateCartPage(data);
          }, montage);
        });
        $('.remove-item').click(function (e) {
          var productID = $(e.target).data('product-id');
          cart.deleteProduct(productID, function (data) {
            var cartRow = '.item[data-product-id="' + productID + '"]';
            $(cartRow).fadeOut(200, function () {
              $(cartRow).remove();
            });
            CartPage.updateCartPage(data);
          });
        });
        $('#clearCartContent').click(/*#__PURE__*/function () {
          var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
            return _regenerator().w(function (_context) {
              while (1) switch (_context.n) {
                case 0:
                  _context.n = 1;
                  return _this.openCartClearConfirmationDialog('Smazání produktů z košíku', 'Opravdu chcete smazat obsah košíku?');
                case 1:
                  return _context.a(2);
              }
            }, _callee);
          }));
          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }());
        $('.montage').change(function (e) {
          var $this = $(e.target);
          var productID = $this.data('product-id');
          var quantity = $('.count[data-product-id="' + productID + '"]').val();
          var montage = $(e.target).is(':checked');
          cart.updateCart(productID, quantity, true, null, montage);
        });
        _this.initSimpleDropbox();
      });
    }
  }, {
    key: "openCartClearConfirmationDialog",
    value: function () {
      var _openCartClearConfirmationDialog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(title, content) {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (this.dialog) {
                this.dialog.close();
              }
              this.dialog = new Dialog();
              this.dialog._title = title;
              this.dialog._modalClass = 'cart-clear-confirmation';
              _context2.n = 1;
              return this.dialog.openFromUrl(projectVars.basePath + '/modal/cart-clear-confirmation', {
                title: title,
                content: content
              });
            case 1:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function openCartClearConfirmationDialog(_x2, _x3) {
        return _openCartClearConfirmationDialog.apply(this, arguments);
      }
      return openCartClearConfirmationDialog;
    }()
  }, {
    key: "initSimpleDropbox",
    value: function initSimpleDropbox() {
      var dropzone = document.getElementById('dropzone');
      var fileInput = document.getElementById('fileInput');
      var importButton = document.getElementById('importButton');
      var fileInfo = document.getElementById('fileInfo');
      var fileName = document.getElementById('fileName');
      var fileSize = document.getElementById('fileSize');
      var fileRemove = document.getElementById('fileRemove');
      var errorMessage = document.getElementById('errorMessage');
      var selectedFile = null;
      dropzone.addEventListener('click', function () {
        fileInput.click();
      });
      importButton.style.display = 'none';
      fileInput.addEventListener('change', function () {
        if (this.files && this.files.length > 0) {
          var file = this.files[0];
          validateAndPreviewFile(file);
        }
      });
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
        dropzone.addEventListener(eventName, preventDefaults, false);
      });
      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }
      ['dragenter', 'dragover'].forEach(function (eventName) {
        dropzone.addEventListener(eventName, highlight, false);
      });
      ['dragleave', 'drop'].forEach(function (eventName) {
        dropzone.addEventListener(eventName, unhighlight, false);
      });
      function highlight() {
        dropzone.classList.add('dragover');
      }
      function unhighlight() {
        dropzone.classList.remove('dragover');
        dropzone.classList.remove('error');
      }

      // Zpracování přetaženého souboru
      dropzone.addEventListener('drop', function (e) {
        var dt = e.dataTransfer;
        if (dt.files && dt.files.length > 0) {
          var file = dt.files[0];
          validateAndPreviewFile(file);
        }
      });

      // Import souboru po kliknutí na tlačítko importu
      importButton.addEventListener('click', function (e) {
        e.preventDefault();
        if (selectedFile) {
          // Zde provádíme samotný "import" souboru
          handleFileImport(selectedFile);
        } else {
          // Pokud není vybrán soubor, otevřeme dialog pro výběr
          fileInput.click();
        }
      });

      // Odstraní vybraný soubor
      fileRemove.addEventListener('click', function () {
        clearFile();
      });
      function validateAndPreviewFile(file) {
        // Kontrola, zda je soubor CSV
        var fileExtension = file.name.split('.').pop().toLowerCase();
        if (fileExtension === 'csv') {
          // Resetování chybových stavů
          hideError();

          // Uložení souboru a zobrazení náhledu
          selectedFile = file;
          previewFile(file);

          // Aktivace tlačítka importu
          importButton.style.display = 'block';
          importButton.classList.remove('disabled');
          importButton.parentElement.classList.remove('disabled');
        } else {
          // Zobrazení chyby
          showError();

          // Vyčištění výběru
          clearFile();
        }
      }

      // Zobrazení náhledu souboru
      function previewFile(file) {
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.classList.add('has-file');
      }

      // Zpracování importu souboru
      function handleFileImport(file) {
        var formData = new FormData();
        formData.append('File', file);
        formData.append('Delimiter', $('#csvDelimiter').val());
        fetch('/cart/import-products-from-csv', {
          method: 'POST',
          body: formData
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data.status === 'success') {
            alerts.alert('Import dokončen', 'info', data.message);
            window.location.reload();
          } else {
            alerts.alert('Chyba', 'error', data.error_message);
          }
        })["catch"](function (error) {
          console.error('Chyba při importu:', error);
          alerts.alert('Chyba', 'error', error);
        });

        // Po importu můžeme vyčistit formulář
        clearFile();
      }

      // Zobrazení chybové zprávy
      function showError() {
        alerts.alert('Upozornění', 'error', 'Prosím, vyberte platný CSV soubor.');
        errorMessage.classList.add('show');
        dropzone.classList.add('error');
        setTimeout(function () {
          errorMessage.classList.remove('show');
          dropzone.classList.remove('error');
        }, 3000);
      }

      // Skrytí chybové zprávy
      function hideError() {
        errorMessage.classList.remove('show');
        dropzone.classList.remove('error');
      }

      // Odstranění vybraného souboru
      function clearFile() {
        selectedFile = null;
        fileInput.value = '';
        fileInfo.classList.remove('has-file');
        hideError();
      }

      // Formátování velikosti souboru
      function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024;
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }
    }
  }], [{
    key: "updateCartPage",
    value: function updateCartPage(data) {
      if (data.TotalCount == 0) {
        window.location.href = '/cart/empty/';
        return;
      }
      $('.summary-container .total-with-vat').html(data.TotalPriceWithVat);
      $('.summary-container .total-without-vat').html(data.TotalPriceWithoutVat);
      $('.summary-container .total-vat').html(data.TotalVat);
      $('.cart-summary .left-to-free-shipping').html(data.LeftToFreeShipping);
      $('#item-coupon').html(data.CouponItemHtml);
      $.each(data.cartItems, function (k, v) {
        var cartRow = '.item[data-product-id="' + v.Product_ID + '"]';
        $(cartRow + ' .count').val(v.Quantity);
        $(cartRow + ' .price').html(v.PriceWithVat);
        $(cartRow + ' .total-price').html(v.TotalPriceWithVat);
      });
    }
  }]);
}();
//# sourceMappingURL=CartPage.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CartPrompt = /*#__PURE__*/function () {
  function CartPrompt() {
    _classCallCheck(this, CartPrompt);
  }
  return _createClass(CartPrompt, null, [{
    key: "addedToCart",
    value: function addedToCart() {
      var addToCartDialog = {
        state0: {
          title: 'Produkt byl přidán do košíku',
          html: 'Děkujeme Vám, za Váš zájem o naše služby.<br>Nyní můžete pokračovat v nákupu, nebo přejít k objednávce.',
          buttons: {
            "Pokračujte v nakupování": 1,
            "Nákupní košík": 2
          },
          submit: function submit(e, v, m, f) {
            e.preventDefault();
            if (v == 1) $.prompt.close();else document.location.href = '/cart/';
          }
        }
      };
      $.prompt(addToCartDialog);
    }
  }]);
}();
//# sourceMappingURL=CartPrompt.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CartRecapitulation = /*#__PURE__*/function () {
  function CartRecapitulation() {
    _classCallCheck(this, CartRecapitulation);
    _defineProperty(this, "shippingPriceWithoutVat", 0);
    _defineProperty(this, "shippingPriceWithVat", 0);
    _defineProperty(this, "paymentPriceWithoutVat", 0);
    _defineProperty(this, "paymentPriceWithVat", 0);
  }
  return _createClass(CartRecapitulation, [{
    key: "updateTotalPrice",
    value: function updateTotalPrice() {
      var totalPriceWithoutVat = this.shippingPriceWithoutVat - -this.paymentPriceWithoutVat - -$('.order-recapitulation .total-price-with-vat').data('total-produts-price-without-vat');
      var totalPriceWithVat = this.shippingPriceWithVat - -this.paymentPriceWithVat - -$('.order-recapitulation .total-price-with-vat').data('total-produts-price-with-vat');
      $('.total .total-price-without-vat').html(numberHelpers.formatPrice(totalPriceWithoutVat));
      $('.total .total-vat').html(numberHelpers.formatPrice(totalPriceWithVat - totalPriceWithoutVat));
      $('.total .total-price-with-vat').html(numberHelpers.formatPrice(totalPriceWithVat));
    }
  }]);
}();
//# sourceMappingURL=CartRecapitulation.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var PPL = /*#__PURE__*/function () {
  function PPL() {
    _classCallCheck(this, PPL);
    this.modalBox = null;
    this.closeButton = null;
    this.init();
    this.bindEvents();
  }
  return _createClass(PPL, [{
    key: "init",
    value: function init() {
      // Vytvoření základních elementů
      $('<div id="ppl-parcel-shop-modal"><div class="ppl-modal-header"></div>').insertBefore('#footer');
      $('<div id="ppl-parcelshop-map" data-countries="cz"></div>').appendTo('#ppl-parcel-shop-modal');
      $('<a id="close-modal-button">&times;</a>').prependTo('.ppl-modal-header');
      this.modalBox = document.querySelector("#ppl-parcel-shop-modal");
      this.closeButton = document.querySelector("#close-modal-button");

      // Načtení externích zdrojů
      this.loadExternalResources();
    }
  }, {
    key: "loadExternalResources",
    value: function loadExternalResources() {
      var _this = this;
      // Načtení JavaScript souboru
      var script = document.createElement('script');
      script.src = 'https://www.ppl.cz/sources/map/main.js';
      script.onload = function () {
        _this.setupEventListeners();
      };
      document.getElementsByTagName('head')[0].append(script);

      // Načtení CSS souboru
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://www.ppl.cz/sources/map/main.css";
      document.getElementsByTagName('head')[0].append(link);
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      // Kliknutí na tlačítko pro výběr pobočky
      $('#choose-parcel-shop').unbind('click').click(function () {
        _this2.openModal();
      });

      // Kliknutí na tlačítko pro zavření modalu
      this.closeButton.addEventListener("click", function () {
        _this2.closeModal();
      });
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this3 = this;
      // Poslouchání událostí z mapy PPL
      document.addEventListener("ppl-parcelshop-map", function (event) {
        _this3.closeModal();
        _this3.processSelectedPoint(event.detail);
      });
    }
  }, {
    key: "openModal",
    value: function openModal() {
      this.modalBox.style.opacity = 1;
      this.modalBox.style.zIndex = 99999;
    }
  }, {
    key: "closeModal",
    value: function closeModal() {
      this.modalBox.style.opacity = 0;
      this.modalBox.style.zIndex = -9999999;
    }
  }, {
    key: "processSelectedPoint",
    value: function processSelectedPoint(details) {
      var pickupID = details.id;
      var pickupName = details.name;
      var pickupCode = details.code;
      var addressCity = details.city;
      var addressStreet = details.street;
      var addressZipCode = details.zipCode;
      var parcelShopDetail = $('.ppl-selected-pickup-point');
      parcelShopDetail.css('display', 'block');
      parcelShopDetail.attr('data-point-chosen', true);
      parcelShopDetail.attr('data-point-id', pickupID);
      parcelShopDetail.attr('data-point-name', pickupName);
      parcelShopDetail.attr('data-point-code', pickupCode);
      parcelShopDetail.attr('data-point-address', "".concat(addressStreet, ", ").concat(addressCity, " ").concat(addressZipCode));
      parcelShopDetail.html("Vybran\xE9 m\xEDsto: ".concat(pickupName, ", ").concat(addressStreet, ", ").concat(addressCity, " ").concat(addressZipCode));

      // Zavolání metody pro zpracování na straně košíku
      ShippingPayment.handlePPL();
    }
  }, {
    key: "clear",
    value: function clear() {
      var parcelShopDetail = $('.ppl-selected-pickup-point');
      parcelShopDetail.css('display', 'none');
      parcelShopDetail.attr('data-point-chosen', false);
      parcelShopDetail.html('');
    }
  }]);
}();
//# sourceMappingURL=PPL.js.map

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

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Zasilkovna = /*#__PURE__*/function () {
  function Zasilkovna(packetaApiKey) {
    var _this = this;
    _classCallCheck(this, Zasilkovna);
    _defineProperty(this, "packetaApiKey", void 0);
    _defineProperty(this, "packetaOptions", void 0);
    _defineProperty(this, "country", void 0);
    _defineProperty(this, "bindEvents", function () {
      _this.packetaOptions = {
        valueFormat: "\"Packeta\",id,carrierId,carrierPickupPointId,name,city,street",
        view: "modal",
        defaultCurrency: "CZK"
      };
      $('#chooseCzPickupPlace').unbind('click').click(function () {
        _this.country = "cz";
        _this.packetaOptions.country = "cz";
        _this.packetaOptions.language = "cs";
        _this.modalDialog($('#m1-cz'));
      });
      $('#chooseSkPickupPlace').unbind('click').click(function () {
        _this.country = "sk";
        _this.packetaOptions.country = "sk";
        _this.packetaOptions.language = "sk";
        _this.modalDialog($('#m1-sk'));
      });
    });
    this.packetaApiKey = packetaApiKey;
    this.loadPacketaScript();
  }
  return _createClass(Zasilkovna, [{
    key: "showSelectedPickupPoint",
    value: function showSelectedPickupPoint(point) {
      this.style.display = "block";
      this.innerText = "Vybrané místo: " + (point ? point.name : "Žádné");
      this.dataset.pointChosen = !!point;
      this.dataset.pointId = point ? point.id : '';
      this.dataset.pointName = point ? point.name : '';
      this.dataset.pointAddress = point ? "".concat(point.street, ", ").concat(point.city, ", ").concat(point.zip) : '';
      ShippingPayment.handleZasilkovna();
    }
  }, {
    key: "clear",
    value: function clear() {
      var elements = document.querySelectorAll(".zasilkovna-".concat(this.country, "-selected-pickup-point"));
      for (var i = 0; i < elements.length; i++) {
        elements[i].innerText = "";
      }
      Packeta.Widget.close();
    }
  }, {
    key: "modalDialog",
    value: function modalDialog(div) {
      this.clear();
      Packeta.Widget.pick(this.packetaApiKey, this.showSelectedPickupPoint.bind(div[0]), this.packetaOptions); // Použij div[0] pro získání DOM elementu z jQuery objektu
    }
  }, {
    key: "loadPacketaScript",
    value: function loadPacketaScript() {
      var packetaScript = document.createElement('script');
      packetaScript.src = 'https://widget.packeta.com/v6/www/js/library.js';
      packetaScript.onload = this.bindEvents;
      document.head.appendChild(packetaScript);
    }
  }]);
}();
//# sourceMappingURL=Zasilkovna.js.map

var layout = new Layout();
new Dispatch();
var newsletter = new Newsletter();
var cart = new Cart();
var consentHandler = new ConsentHandler();
var numberHelpers = new NumberHelpers();
var alerts = new Alerts();
var quickSearch = new QuickSearch();
var wishlist = new Wishlist();
//# sourceMappingURL=app.js.map
