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
