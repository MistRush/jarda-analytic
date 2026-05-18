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
