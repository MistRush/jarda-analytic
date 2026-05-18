function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var OrderList = /*#__PURE__*/function () {
  function OrderList() {
    _classCallCheck(this, OrderList);
    this.timeout = null;
    this.elem = null;
    this.preview = null;
    this.interrupter = null;
    this.order = null;
    this.totalPrice = 0;
    this.totalQuantity = 0;
    this.init(1000);
  }
  _createClass(OrderList, [{
    key: "init",
    value: function init() {
      var _this = this;
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        _this.bindEvents();
      }, timeout);
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $(function () {
        $('.orderPreview').unbind().click(function (ev) {
          _this2.showPreview(ev.currentTarget);
          _this2.interrupter = setTimeout(function () {
            _this2.interrupter = null;
          }, 100);
        });
        $('body').click(function (ev) {
          if (_this2.interrupter) return null;
          var tar = $(ev.target);
          if (_this2.elem && !(tar.is('.orderPreviewModal') || tar.parents('.orderPreviewModal').length)) _this2.clearPreview();
        });
        $('.orderPreviewModal .close').click(function () {
          _this2.clearPreview();
        });
      });
    }
  }, {
    key: "showPreview",
    value: function showPreview(el) {
      this.clearPreview();
      this.elem = el;
      this._getOrderDetail();
    }
  }, {
    key: "clearPreview",
    value: function clearPreview() {
      this.elem = null;
      if (this.preview) {
        $(this.preview).remove();
      }
      this.lastId = null;
      if (this.loadingAjax) this.loadingAjax.abort();
      this.loadingAjax = null;
      this.preview = null;
    }
  }, {
    key: "setPreviewPosition",
    value: function setPreviewPosition() {
      var top = $(this.elem).parent().offset().top;
      var left = $(this.elem).offset().left + $(this.elem).outerWidth() - 15;
      if (top + this.preview.outerHeight() > window.innerHeight) {
        top = $(this.elem).parent().offset().top + $(this.elem).parent().outerHeight() - this.preview.outerHeight();
      }
      this.preview.css('position', 'aboslute');
      if (window.innerWidth < 768) {
        top = window.innerHeight / 2 - this.preview.outerHeight() / 2;
        left = window.innerWidth / 2 - this.preview.outerWidth() / 2;
        this.preview.css('position', 'fixed');
      }
      this.preview.css('left', left + 'px');
      this.preview.css('top', top + 'px');
    }
  }, {
    key: "renderLoading",
    value: function renderLoading() {
      return "\n            <div class=\"orderPreviewModal\">\n                <a href=\"javascript:void(0);\" class=\"close\"><i class=\"ci ci-times\"></i></a>\n                <div class=\"panel\">\n                    <img class=\"loadingImg\" src=\"".concat(basePath, "/project/img/loading.gif\">\n                </div>\n            </div>\n        ");
    }
  }, {
    key: "renderError",
    value: function renderError() {
      return "\n            <a href=\"javascript:void(0);\" class=\"close\"><i class=\"ci ci-times\"></i></a>\n            <div class=\"panel errorPanel\">\n                <i class=\"ci ci-warning error-icon\"></i>\n                Error\n            </div>\n        ";
    }
  }, {
    key: "_getOrderDetail",
    value: function _getOrderDetail() {
      var _this3 = this;
      var id = $(this.elem).data('id');
      if (this.lastId == id) return null;
      this.lastId = id;
      if (!id) return null;
      $('body').append(this.renderLoading());
      this.preview = $('body').find('.orderPreviewModal');
      this.setPreviewPosition();
      this.loadingAjax = $.ajax(basePath + '/admin/order/order-preview', {
        data: {
          Order_ID: id
        },
        method: 'POST',
        success: function success(data) {
          try {
            if (data) {
              _this3.preview.html(data);
              plugins.initBsTooltip();
              _this3.setPreviewPosition();
            } else {
              _this3.preview.html(_this3.renderError());
              _this3.setPreviewPosition();
            }
          } catch (ex) {
            _this3.preview.html(_this3.renderError());
            _this3.setPreviewPosition();
          }
        },
        error: function error(ex) {
          if (ex.statusText != 'abort') {
            _this3.preview.html(_this3.renderError());
            _this3.setPreviewPosition();
          }
        },
        complete: function complete() {
          _this3.loadingAjax = null;
          _this3.init(10);
        }
      });
    }
  }]);
  return OrderList;
}();
//# sourceMappingURL=OrderList.js.map
