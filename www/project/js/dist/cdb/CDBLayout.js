function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CDBLayout = /*#__PURE__*/function () {
  function CDBLayout() {
    _classCallCheck(this, CDBLayout);

    this.bindEvents();

    if (Cookie.getCookie('seller') === undefined || Cookie.getCookie('seller') !== 'true') {
      $('.seller-contact').stop().hide(0);
      $('#toggleSeller').removeClass('active');
    } else if (Cookie.getCookie('seller') === 'false') {
      $('.seller-contact').stop().show(0);
      $('#toggleSeller').addClass('active');
    }
  }

  _createClass(CDBLayout, [{
    key: "bindEvents",
    value: function bindEvents() {
      $('#videohelp').on('click', function (e) {
        if ($(e.target).parents('.content').length > 0) {
          return;
        }

        e.preventDefault();
        $(e.target).parents('.videohelp').find('.content').stop().slideToggle(300);
      });
      $(".popup .cls").click(function () {
        var $popup = $(this).closest('.popup');
        var Popup_ID = $popup.data('popup');
        $.ajax({
          url: basePath + "/admin/settings/set-popup-read/",
          content: {
            Popup_ID: Popup_ID
          },
          sync: true,
          success: function success() {
            $popup.hide();
          }
        });
      });
    }
  }, {
    key: "toggleSeller",
    value: function toggleSeller() {
      if (Cookie.getCookie('seller') === undefined || Cookie.getCookie('seller') === 'true') {
        Cookie.setCookie('seller', false, 365);
        $('.seller-contact').stop().slideUp(300, function () {
          $('#toggleSeller').removeClass('active');
        });
      } else if (Cookie.getCookie('seller') === 'false') {
        Cookie.setCookie('seller', true, 365);
        $('.seller-contact').stop().slideDown(300, function () {
          $('#toggleSeller').addClass('active');
        });
      }
    }
  }, {
    key: "changeSeller",
    value: function changeSeller(side) {
      if (side === 'left') {
        $('.seller-contact').addClass('left');
        $('.seller-contact').removeClass('right');
      } else {
        $('.seller-contact').addClass('right');
        $('.seller-contact').removeClass('left');
      }
    }
  }]);

  return CDBLayout;
}();
//# sourceMappingURL=CDBLayout.js.map
