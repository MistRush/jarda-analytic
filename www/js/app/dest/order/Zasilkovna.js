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
