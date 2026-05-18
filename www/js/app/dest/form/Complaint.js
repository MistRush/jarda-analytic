function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Complaint = /*#__PURE__*/function () {
  function Complaint() {
    var _this = this;
    _classCallCheck(this, Complaint);
    this.complaintItemCounter = 1;
    $(function () {
      _this.complaintForm = new Form('complaint-form');
      _this.bindEvents();
      _this.initializeTogglers();
      // this.initializeCountrySelects();
      _this.initializeComplaintItems();
      $('.complaint-item').first().find('.complaint-item-title').text("Polo\u017Eka \u010D. 1");
    });
  }
  return _createClass(Complaint, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      $('#confirm-complaint').click(function () {
        _this2.complaintForm.validate();
        var isValid = _this2.complaintForm.valid && $('#gdpr').prop('checked');
        $('select:visible').each(function () {
          var select = $(this);
          if (select.hasClass('select2-hidden-accessible') && !select.val()) {
            var select2Container = select.siblings('.select2-container');
            select2Container.addClass('input-error');
            isValid = false;
          } else {
            select.siblings('.select2-container').removeClass('input-error');
          }
        });
        if (isValid) {
          _this2.recapchaCallback();
        }
      });
      $('select').on('change', function () {
        $(this).siblings('.select2-container').removeClass('input-error');
      });
    }
  }, {
    key: "recapchaCallback",
    value: function recapchaCallback() {
      grecaptcha.ready(function () {
        grecaptcha.execute('6Ld4ogArAAAAAN-5fVn8mxHa848vSIN4pqJ41BYy', {
          action: 'submit'
        }).then(function (token) {
          $('<input>').attr({
            type: 'hidden',
            id: 'recaptchaToken',
            name: 'Token',
            value: token
          }).appendTo('#complaint-form');
          $('#complaint-form').submit();
        });
      });
    }
  }, {
    key: "initializeTogglers",
    value: function initializeTogglers() {
      $('.with-toggler').click(function () {
        $(this).toggleClass('active');
        $(this).next().slideToggle();
        if ($(this).hasClass('active')) {
          $(this).next().find('input[type="hidden"]').val(1);
        } else {
          $(this).next().find('input[type="hidden"]').val(0);
        }
      });
      $('.company-block').hide();
      $('.delivery-address-block').hide();
    }
  }, {
    key: "initializeComplaintItems",
    value: function initializeComplaintItems() {
      if ($('.complaint-item').length === 1) {
        $('.complaint-item').first().find('.remove-complaint-item').hide();
      }
      $('#add-complaint-item').click(function () {
        var maxCurrentNumber = Math.max.apply(Math, _toConsumableArray($('.complaint-item').map(function () {
          return parseInt($(this).find('.complaint-item-title').text().replace('Položka č. ', ''));
        }).get()));
        var newNumber = maxCurrentNumber + 1;
        var newItem = $('.complaint-item').first().clone();
        newItem.find('.complaint-item-title').text("Polo\u017Eka \u010D. ".concat(newNumber));
        newItem.find('input, textarea').each(function (index, el) {
          var $el = $(el);
          var originalId = $el.attr('id');
          var originalName = $el.attr('name');
          var newId = originalId ? originalId.replace(/\d+$/, '') + newNumber : '';
          var newName = originalName.replace(/\d+$/, '') + newNumber;
          $el.attr({
            'id': newId,
            'name': newName
          }).val('');
        });
        newItem.find('.remove-complaint-item').show();
        $('.complaint-item').first().find('.remove-complaint-item').show();
        $('#complaint-items').append(newItem);
      });
      $(document).on('click', '.remove-complaint-item', function () {
        if ($('.complaint-item').length > 1) {
          $(this).closest('.complaint-item').remove();
          $('.complaint-item').each(function (index, item) {
            var $item = $(item);
            var newNumber = index + 1;
            $item.find('.complaint-item-title').text("Polo\u017Eka \u010D. ".concat(newNumber));
            $item.find('input, textarea').each(function (idx, el) {
              var $el = $(el);
              var originalId = $el.attr('id');
              var originalName = $el.attr('name');
              if (originalId) {
                $el.attr('id', originalId.replace(/\d+$/, '') + newNumber);
              }
              $el.attr('name', originalName.replace(/\d+$/, '') + newNumber);
            });
          });
          if ($('.complaint-item').length === 1) {
            $('.complaint-item').first().find('.remove-complaint-item').hide();
          }
        } else {
          alert("Musí zůstat alespoň jedna položka zásilky.");
        }
      });
    }
  }]);
}();
//# sourceMappingURL=Complaint.js.map
