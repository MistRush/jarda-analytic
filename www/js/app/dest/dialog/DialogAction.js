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
