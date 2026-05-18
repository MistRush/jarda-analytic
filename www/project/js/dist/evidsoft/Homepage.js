function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* MAIN CLASS */
var Homepage = /*#__PURE__*/function () {
  function Homepage() {
    _classCallCheck(this, Homepage);
    _defineProperty(this, "$nav", void 0);
    _defineProperty(this, "$content", void 0);
    _defineProperty(this, "titles", void 0);
    _defineProperty(this, "navigation", void 0);
    this.$nav = $('#navigation .wrapper');
    this.$content = $('#homepage .main-content>.row>div');
    this.titles = {
      'ordersChart': 'Statistiky',
      'otherInfo': 'Aktivní objednávky',
      'helpContact': 'Kontakt na dodavatele',
      'evidsoft': 'Evidsoft'
    };
    this.navigation = null;
  }
  _createClass(Homepage, [{
    key: "init",
    value: function init() {
      this.buildMenu();
      this.navigation = new Navigation();
      this.search = new Search();
    }
  }, {
    key: "buildMenu",
    value: function buildMenu() {
      var _this = this;
      var exclude = ['search', 'facts', 'gallery'];
      if (this.$nav.length > 0 && this.$content.length > 0) {
        this.$nav.html('');
        this.$content.each(function (i) {
          if ($(_this.$content.get(i)).attr('id').length > 0) {
            if (exclude.includes($(_this.$content.get(i)).attr('id')) == false) {
              var danger = $(_this.$content.get(i)).data('danger') == true ? '<i class="ci ci-warning text-danger mr-2"></i>' : '';
              _this.$nav.append('<li><a href="#" data-id="' + $(_this.$content.get(i)).attr('id') + '">' + danger + (_this.titles[$(_this.$content.get(i)).attr('id')] ? _this.titles[$(_this.$content.get(i)).attr('id')] : $(_this.$content.get(i)).find('.title').text() + $(_this.$content.get(i)).find('.panel>.heading').text()) + ($(_this.$content.get(i)).data('icon') ? '<i class="' + $(_this.$content.get(i)).data('icon') + '"></i>' : '<i class="far fa-circle" style="font-size: 10px;width:16px;text-align:right;"></i>') + '</a></li>');
            } else if ($(_this.$content.get(i)).attr('id') == 'search') {
              _this.$nav.append('<li><a href="#" class="search" data-id="search">' + (_this.titles[$(_this.$content.get(i)).attr('id')] ? _this.titles[$(_this.$content.get(i)).attr('id')] : 'Search') + '<i class="ci ci-search"></i></a>');
            }
          }
        });
      }
    }
  }]);
  return Homepage;
}();
/* NAVIGATION ANIMATION */
var Navigation = /*#__PURE__*/function () {
  function Navigation() {
    _classCallCheck(this, Navigation);
    this.init();
  }
  _createClass(Navigation, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      $(window).scroll(function (e) {
        _this2.setItem();
      });
    }
  }, {
    key: "setItem",
    value: function setItem() {
      var scrollTop = $(window).scrollTop() + $(window).height() / 2;
      var items = [];
      $('.main-content>.row>div').each(function (i) {
        var offset = $(this).offset().top - 12;
        var offset_bottom = offset + $(this).height() + 12;
        if (offset <= scrollTop && offset_bottom >= scrollTop) {
          items.push($('#navigation li a[data-id="' + $(this).attr('id') + '"]'));
        }
      });
      $('#navigation li a').removeClass('active');
      for (var i = 0; i < items.length; i++) {
        Object.values(items)[i].addClass('active');
      }
    }
  }]);
  return Navigation;
}();
/* AJAX SEARCH */
var _$search_input = /*#__PURE__*/new WeakMap();
var _$search_results = /*#__PURE__*/new WeakMap();
var Search = /*#__PURE__*/function () {
  function Search() {
    var result_count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
    _classCallCheck(this, Search);
    _classPrivateFieldInitSpec(this, _$search_input, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _$search_results, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "loading", void 0);
    _classPrivateFieldSet(this, _$search_input, $('#search input'));
    _classPrivateFieldSet(this, _$search_results, $('#search .search-results'));
    this.handleInput();
  }
  _createClass(Search, [{
    key: "handleInput",
    value: function handleInput() {
      var _this3 = this;
      var timeout = null;
      _classPrivateFieldGet(this, _$search_input).on('keyup paste', function (e) {
        if (e.target.value.length > 1) {
          clearTimeout(timeout);
          timeout = setTimeout(function () {
            _this3.searchItems(e.target.value);
          }, 500);
        } else {
          _this3.searchItems('');
        }
      });
    }
  }, {
    key: "searchItems",
    value: function searchItems(SearchString) {
      SearchString = SearchString.toLowerCase();
      if (SearchString.length > 0) {
        this.getItems(SearchString);
        if (_classPrivateFieldGet(this, _$search_results).is(':not(:visible)')) {
          this.toggleResults(true);
        }
      } else {
        this.toggleResults(false);
      }
    }
  }, {
    key: "getItems",
    value: function getItems(SearchString) {
      var _this4 = this;
      var Category = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      if (SearchString.length === 0 || $(window).width() < 769) {
        return false;
      }
      _classPrivateFieldGet(this, _$search_results).html('<div class="text-center text-muted">Probíhá načítání ...</div>');
      $.ajax({
        url: basePath + '/admin/index/search',
        data: {
          SearchString: SearchString
        },
        success: function success(data) {
          _classPrivateFieldGet(_this4, _$search_results).html(data);
        },
        fail: function fail() {}
      });
    }
  }, {
    key: "toggleResults",
    value: function toggleResults() {
      var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (show === true) {
        _classPrivateFieldGet(this, _$search_results).stop().slideDown(300);
      } else if (show === false) {
        _classPrivateFieldGet(this, _$search_results).stop().slideUp(300);
      } else {
        _classPrivateFieldGet(this, _$search_results).stop().slideToggle(300);
      }
    }
  }, {
    key: "clearInput",
    value: function clearInput() {
      _classPrivateFieldGet(this, _$search_input).val('');
      this.searchItems('');
    }
  }]);
  return Search;
}();
//# sourceMappingURL=Homepage.js.map
