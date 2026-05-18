function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var QuickSearch = /*#__PURE__*/function () {
  /**
   * Konstruktor pro QuickSearch
   * 
   * @param {string} id 
   */
  function QuickSearch() {
    var _this = this;
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'search-result-block';
    _classCallCheck(this, QuickSearch);
    this._id = id;
    this._element = null;
    this._form = null;
    this._searchInput = null;
    this._searchTimeout = null;
    this._items = null;
    $(function () {
      _this.init();
      _this.bindEvents();
    });
  }

  /**
   * Inicializuje třídu
   * 
   * @returns {void}
   */
  return _createClass(QuickSearch, [{
    key: "init",
    value: function init() {
      this._element = $('#' + this._id);
      this._items = this._element.find('.items');
      this._form = this._element.parent().children('form');
      return;
    }

    /**
     * Nastaví všechny eventy
     * 
     * @returns {void}
     */
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      if (this._form) {
        this._searchInput = this._form.find('[name="SearchTerm"]');
        if (this._searchInput.length) {
          this._searchInput.on('reset input paste cut', function (ev) {
            _this2.inputHandler(ev.currentTarget.value);
          });
          this._form.on('reset', function (ev) {
            _this2.inputHandler('');
          });
        }
      }
      return;
    }

    /**
     * Handle pro zpracování vyhledávání
     * 
     * @param {*} ev 
     * @return {boolean}
     */
  }, {
    key: "inputHandler",
    value: function inputHandler(val) {
      var _this3 = this;
      if (val.length < 3) {
        this.hide();
        return false;
      }
      clearTimeout(this._searchTimeout);
      this._searchTimeout = setTimeout(function () {
        _this3.show();
        if (_this3.running) {
          _this3.running.abort();
        }
        _this3._performSearch(val);
      }, 250);
      return true;
    }

    /**
     * Zobrazí quick search
     * 
     * @returns {void}
     */
  }, {
    key: "show",
    value: function show() {
      var _this4 = this;
      this._element.stop().slideDown(300, function () {
        _this4._element.removeAttr('style');
      });
      this._form.addClass('active');
      this._element.addClass('active');
      return;
    }

    /**
     * Skryje quick search
     * 
     * @returns {void}
     */
  }, {
    key: "hide",
    value: function hide() {
      var _this5 = this;
      this._element.stop().slideUp(300, function () {
        _this5._form.removeClass('active');
        _this5._element.removeClass('active');
      });
      return;
    }

    /**
     * Vyhledá produkt
     * 
     * @param {string} val 
     * @returns {void}
     */
  }, {
    key: "_performSearch",
    value: function _performSearch(val) {
      var _this6 = this;
      this.renderLoading();
      this.running = $.ajax(projectVars.basePath + '/search/quick', {
        data: {
          searchTerm: val
        },
        method: 'POST',
        success: function success(data) {
          _this6._element.html(data);
          _this6.show();
        },
        error: function error() {
          _this6.hide();
        }
      });
      return;
    }

    /**
     * Vykreslí načítací obrazovku
     * 
     * @returns {void}
     */
  }, {
    key: "renderLoading",
    value: function renderLoading() {
      var html = "<div class=\"loading\">Na\u010D\xEDt\xE1m ...</div>";
      this._element.html(html);
    }
  }]);
}();
//# sourceMappingURL=QuickSearch.js.map
