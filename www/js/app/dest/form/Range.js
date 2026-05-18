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
