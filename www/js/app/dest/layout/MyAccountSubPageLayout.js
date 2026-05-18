function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var MyAccountSubPageLayout = /*#__PURE__*/function () {
  function MyAccountSubPageLayout(defaultPage) {
    var _this = this;
    _classCallCheck(this, MyAccountSubPageLayout);
    _defineProperty(this, "defaultPage", void 0);
    this.defaultPage = defaultPage;
    $(function () {
      _this.bindEvents();
    });
  }
  _createClass(MyAccountSubPageLayout, [{
    key: "bindEvents",
    value: function bindEvents() {
      this.clickEvent();
      this.handleSubPageValue();
    }
  }, {
    key: "handleSubPageValue",
    value: function handleSubPageValue() {
      var paramsString = location.search;
      var searchParams = new URLSearchParams(paramsString);
      var indexParam = searchParams.get('sub-page');
      if (indexParam) {
        this.clearActiveStatus();
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
      $(".page-submenu-item").click(function (event) {
        event.preventDefault();
        var pageSlug = $(this).children('a').attr('data-href');
        // $(".loader-circle").show();
        me.loadPage(pageSlug);
        me.clearActiveStatus();
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
          me.insertLoadedPageIntoPage(data);
        },
        error: function error(xhr, status) {
          alert("Sorry, there was a problem!");
        },
        complete: function complete(xhr, status) {
          me.refreshBreadcrumb(pageSlug);
          new OrderDetailLayout();
          new AddressEditLayout();
          new PersonalDataEditLayout();
          new BannerGeneratorForm();
        }
      });
    }
  }, {
    key: "refreshBreadcrumb",
    value: function refreshBreadcrumb() {
      var nameOfPage = $('#page-load h2').html();
      var breadcrumb = $('#breadcrumb');
      $('.current-page').empty();
      breadcrumb.append("<a class=\"current-page\"><span>".concat(nameOfPage, "</span></a>"));
    }
  }, {
    key: "buildProperUrlForPageLoading",
    value: function buildProperUrlForPageLoading(pageSlug) {
      return "/customer/".concat(pageSlug);
    }
  }, {
    key: "insertLoadedPageIntoPage",
    value: function insertLoadedPageIntoPage(data) {
      $('#page-load').hide();
      $('#page-load').html(data);
      $('#page-load').show(500);
    }
  }, {
    key: "clearActiveStatus",
    value: function clearActiveStatus() {
      $(".page-submenu-item").removeClass('active');
    }
  }, {
    key: "updatePageUrl",
    value: function updatePageUrl(pageSlug) {
      window.history.pushState({}, "", "?sub-page=".concat(pageSlug));
    }
  }]);
  return MyAccountSubPageLayout;
}();
//# sourceMappingURL=MyAccountSubPageLayout.js.map
