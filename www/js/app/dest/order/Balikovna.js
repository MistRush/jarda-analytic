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
