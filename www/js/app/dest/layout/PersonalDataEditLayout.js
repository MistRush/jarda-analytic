function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var PersonalDataEditLayout = /*#__PURE__*/function () {
  function PersonalDataEditLayout() {
    var _this = this;
    _classCallCheck(this, PersonalDataEditLayout);
    $(function () {
      _this.personalDataForm = new Form('main-form-change-personal-data');
      _this.bindEvents();
    });
  }
  return _createClass(PersonalDataEditLayout, [{
    key: "bindEvents",
    value: function bindEvents() {
      var me = this;
      $('#confirm-personal-data-change').click(function () {
        $('<div class="progress-loader-wrap"><div class="progress-loader"></div></div>').insertBefore('#confirm-address');
        me.personalDataForm.validate();
        if (me.personalDataForm.valid) {
          var _$$val, _$$val2, _$$val3;
          $.ajax({
            url: "/default/customer/edit-password-process/",
            type: 'POST',
            dataType: "html",
            data: {
              // FirstName: $('#FirstName').val(),
              // LastName: $('#LastName').val(),
              // Email: $('#Email').val(),
              // Phone: $('#Phone').val(),
              CurrentPassword: (_$$val = $('#CurrentPassword').val()) !== null && _$$val !== void 0 ? _$$val : '',
              Password: (_$$val2 = $('#Password').val()) !== null && _$$val2 !== void 0 ? _$$val2 : '',
              PasswordAgain: (_$$val3 = $('#PasswordAgain').val()) !== null && _$$val3 !== void 0 ? _$$val3 : ''
            },
            success: function success(data) {
              new MyAccount('my-account-personal-data');
              setTimeout(function () {
                $('#message').html(data);
              }, 500);
            }
          });
        }
      });
    }
  }]);
}();
//# sourceMappingURL=PersonalDataEditLayout.js.map
