function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ManufacturerLayout = /*#__PURE__*/function () {
  function ManufacturerLayout() {
    var _this = this;
    _classCallCheck(this, ManufacturerLayout);
    _defineProperty(this, "pagination", 1);
    _defineProperty(this, "remainingProducts", void 0);
    $(function () {
      _this.bindEvents();
    });
  }
  return _createClass(ManufacturerLayout, [{
    key: "bindEvents",
    value: function bindEvents() {
      this.pagination = $('#ajax-load').data('current-page');
      this.remainingProducts = $(".showing.pagination-".concat(this.pagination)).data('remaining-to-display');
      this.ajaxClickEvent();
      this.hideDisplayMoreButtonIfNoMoreProductsExist(this.remainingProducts);
      $('#back-to-product-top').click(function (e) {
        new Layout().backToTop();
      });
      $('.sorting a').click(function (e) {
        e.preventDefault();
        var $this = $(e.target);
        var sorting = $this.data('sorting');
        Cookie.setCookie('sorting', sorting, 10);
        location.reload();
      });
      $("#show-more-description").click(function () {
        $("#long-description").toggle(250, function () {
          $("#short-description").hide();
          $('#show-more-description').hide();
        });
      });
      $("#collapse-more-description").click(function () {
        $("#long-description").toggle(250, function () {
          $("#short-description").show(250);
          $('#show-more-description').show();
        });
      });
    }
  }, {
    key: "ajaxClickEvent",
    value: function ajaxClickEvent() {
      var me = this;
      $("#ajax-display-more").click(function (event) {
        event.preventDefault();
        $(".loader-circle").show();
        me.loadProducts(me.increasePagination());
        new Layout().doScroll("#ajax-product-row-".concat(me.pagination));
      });
    }
  }, {
    key: "loadProducts",
    value: function loadProducts(pagination) {
      var me = this;
      this.createDivContainerForLoadingOfProducts(pagination);
      var url;
      url = this.buildProperUrlForProductLoading(pagination);
      $.ajax({
        url: url,
        data: {},
        type: "GET",
        dataType: "html",
        success: function success(data) {
          me.insertLoadedProductsIntoPage(pagination, data);
          me.hideDisplayMoreButtonIfNoMoreProductsExist($(".showing.pagination-".concat(pagination)).data('remaining-to-display'));
        },
        error: function error(xhr, status) {
          alert("Sorry, there was a problem!");
        },
        complete: function complete(xhr, status) {
          me.removePreviousPaginationRow(pagination);
          me.updateUrl(pagination);
          me.updatePagination(pagination);
        }
      });
    }
  }, {
    key: "createDivContainerForLoadingOfProducts",
    value: function createDivContainerForLoadingOfProducts(pagination) {
      if (pagination === 1) {
        $("#ajax-load").empty();
        $("#ajax-load").append("<div id=\"ajax-product-row-".concat(pagination, "\"></div>"));
      } else {
        $("#ajax-load").append("<div id=\"ajax-product-row-".concat(pagination, "\"></div>"));
      }
    }
  }, {
    key: "buildProperUrlForProductLoading",
    value: function buildProperUrlForProductLoading(pagination) {
      var manufacturer = $("#ajax-load").data('manufacturer-slug');
      return "/znacky/".concat(manufacturer, "/load-page/").concat(pagination);
    }
  }, {
    key: "insertLoadedProductsIntoPage",
    value: function insertLoadedProductsIntoPage(pagination, data) {
      $("#ajax-product-row-".concat(pagination)).hide();
      $("#ajax-product-row-".concat(pagination)).html(data);
      $("#ajax-product-row-".concat(pagination)).show(500);
    }
  }, {
    key: "insertLoadedPaginationIntoPage",
    value: function insertLoadedPaginationIntoPage(data) {
      $("#pagination").html(data);
    }
  }, {
    key: "increasePagination",
    value: function increasePagination() {
      return ++this.pagination;
    }
  }, {
    key: "removePreviousPaginationRow",
    value: function removePreviousPaginationRow(pagination) {
      $(".pl-box.origin-page-".concat(pagination - 1)).hide();
    }
  }, {
    key: "hideDisplayMoreButtonIfNoMoreProductsExist",
    value: function hideDisplayMoreButtonIfNoMoreProductsExist(remaining) {
      if (typeof remaining === "undefined") {
        $('#ajax-display-more').hide();
      }
      if (remaining == 0) {
        $('#ajax-display-more').hide(500);
      }
    }
  }, {
    key: "updateUrl",
    value: function updateUrl(pagination) {
      var currentManufacturerSlug = $("#ajax-load").data('manufacturer-slug');
      window.history.pushState({}, "", "/znacky/".concat(currentManufacturerSlug, "/page/").concat(pagination, "/"));
    }
  }, {
    key: "updatePagination",
    value: function updatePagination(pagination) {
      var me = this;
      var url = '/manufacturer/page-update';
      $.ajax({
        url: url,
        data: {
          'slug': $("#ajax-load").data('manufacturer-slug'),
          'page': pagination
        },
        type: "GET",
        dataType: "html",
        success: function success(data) {
          me.insertLoadedPaginationIntoPage(data);
        },
        error: function error(xhr, status) {
          alert("Sorry, there was a problem!");
        }
      });
    }
  }]);
}();
//# sourceMappingURL=ManufacturerLayout.js.map
