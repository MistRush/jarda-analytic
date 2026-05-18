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
