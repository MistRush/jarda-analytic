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
