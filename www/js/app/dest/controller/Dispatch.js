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
