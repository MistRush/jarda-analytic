function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var MyAccount = /*#__PURE__*/function () {
  function MyAccount(defaultPage) {
    var _this = this;
    _classCallCheck(this, MyAccount);
    _defineProperty(this, "defaultPage", void 0);
    this.defaultPage = defaultPage;
    $(function () {
      _this.bindEvents();
      _this.init();
    });
  }
  return _createClass(MyAccount, [{
    key: "bindEvents",
    value: function bindEvents() {
      this.clickEvent();
    }
  }, {
    key: "init",
    value: function init() {
      var paramsString = location.search;
      var searchParams = new URLSearchParams(paramsString);
      var indexParam = searchParams.get('page');
      if (indexParam) {
        this.clearActiveNavigation();
        this.loadPage(indexParam);
        $("a[data-href$=".concat(indexParam, "]")).parent().addClass('active');
      } else {
        this.loadPage(this.defaultPage);
      }
    }
  }, {
    key: "clickEvent",
    value: function clickEvent() {
      var me = this;
      $(".navigation-container li").click(function (event) {
        event.preventDefault();
        var pageSlug = $(this).children('a').attr('data-href');
        me.loadPage(pageSlug);
        me.clearActiveNavigation();
        $(this).addClass('active');
        me.updatePageUrl(pageSlug);
      });
    }
  }, {
    key: "loadPage",
    value: function loadPage(pageSlug) {
      var me = this;
      var url;
      url = this.buildProperUrlForPageLoading(pageSlug);
      $.ajax({
        url: url,
        data: {},
        type: "GET",
        dataType: "html",
        success: function success(data) {
          me.updatePageBlock(data);
        },
        error: function error(xhr, status) {
          alert("Sorry, there was a problem!");
        },
        complete: function complete(xhr, status) {
          new OrderDetailLayout();
          new AddressEditLayout();
          new PersonalDataEditLayout();
        }
      });
    }
  }, {
    key: "buildProperUrlForPageLoading",
    value: function buildProperUrlForPageLoading(pageSlug) {
      return "/customer/".concat(pageSlug);
    }
  }, {
    key: "updatePageBlock",
    value: function updatePageBlock(data) {
      $('#page-block').html(data);
    }
  }, {
    key: "clearActiveNavigation",
    value: function clearActiveNavigation() {
      $(".navigation-container li").removeClass('active');
    }
  }, {
    key: "updatePageUrl",
    value: function updatePageUrl(pageSlug) {
      window.history.pushState({}, "", "?page=".concat(pageSlug));
    }
  }]);
}();
//# sourceMappingURL=MyAccount.js.map
