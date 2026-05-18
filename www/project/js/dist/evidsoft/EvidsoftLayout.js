function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var EvidsoftLayout = /*#__PURE__*/function () {
  function EvidsoftLayout() {
    _classCallCheck(this, EvidsoftLayout);
    this.bindEvents();
  }
  _createClass(EvidsoftLayout, [{
    key: "bindEvents",
    value: function bindEvents() {
      $('#changeEshop').change(function (e) {
        var val = e.currentTarget.value;
        var selected = $('#changeEshop').data('selected');
        if (val != selected) {
          var d = new Date();
          d.setTime(d.getTime() + 86400000);
          document.cookie = "Eshop_ID=" + val + ";expires=" + d.toUTCString() + ";path=/admin";
          window.location.reload();
        }
      });
      $('#changeLanguage').change(function (e) {
        var val = e.currentTarget.value;
        var selected = $('#changeLanguage').data('selected');
        if (val != selected) {
          var d = new Date();
          d.setTime(d.getTime() + 86400000);
          document.cookie = "Language=" + val + ";expires=" + d.toUTCString() + ";path=/admin";
          window.location.reload();
        }
      });
      $(document).on('select2:open', function () {
        document.querySelector('.select2-search__field').focus();
      });

      // $('header .right').prepend('<a class="create-new-feedback" title="Vytvořit nový feedback" href="/admin/feedback/create-feedback"><i class="ci ci-feedback"></i>Nový</a>');
    }
  }]);
  return EvidsoftLayout;
}();
//# sourceMappingURL=EvidsoftLayout.js.map
