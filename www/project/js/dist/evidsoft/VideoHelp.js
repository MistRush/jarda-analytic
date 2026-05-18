function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Videohelp = /*#__PURE__*/function () {
  function Videohelp() {
    var videohelpID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'videohelp';

    _classCallCheck(this, Videohelp);

    this.videohelpID = videohelpID;
    this.init();
  }

  _createClass(Videohelp, [{
    key: "init",
    value: function init() {
      this.refresh();
    }
  }, {
    key: "openVideo",
    value: function openVideo(id) {
      var _this = this;

      var videoDialog = new Dialog();
      videoDialog.title = 'Videotutoriál - ' + id;
      videoDialog.content = 'test';
      videoDialog.showFromUrl(basePath + '/default/menu/view-videohelp', {
        VideoID: id
      }, false);
      videoDialog.enableCancelButton();

      videoDialog.onAfterClose = function () {
        _this.refresh();
      };
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var $videohelp = $('#' + this.videohelpID);
      var $items = $videohelp.find('.items');
      var $badge = $videohelp.find('.badge');
      /* TODO */

      $.ajax({
        url: basePath + '/default/menu/get-videohelp',
        data: {
          page: request.module + '/' + request.controller + '/' + request.action
        },
        success: function success(data) {
          if (!data.startsWith("[") && !data.startsWith('{')) {
            return;
          }

          var data = JSON.parse(data);
          $items.html('');
          var count = 0;
          var total = 0;

          for (var i = 0; i < Object.keys(data).length; i++) {
            var type = Object.keys(data)[i];
            var items = Object.values(data)[i];

            for (var x = 0; x < items.length; x++) {
              var icon = '<i class="fas ' + (type == 'unwatched' ? 'fa-eye' : 'fa-check') + '"></i>';
              var overlay = '<div class="overlay">' + icon + '</div>';
              var img = '<img src="' + items[x].Thumb + '">';
              var thumb = '<div class="thumb">' + img + overlay + '</div>';
              var col_thumb = '<div class="col-2 thumb-col">' + thumb + '</div>';
              var name = '<p>' + items[x].Name + '</p>';
              name += "<p class=\"upload\">".concat(translations.UPLOADED, ": ").concat(items[x].UploadTime, "</p>");
              var col_name = '<div class="col-10 name">' + name + '</div>';
              var row = '<a class="row ' + type + '" href="#" onclick="evidsoft.videohelp.openVideo(' + items[x].VideoID + ');">' + col_thumb + col_name + '</a>';
              $items.html($items.html() + row);
              total++;

              if (type == 'unwatched') {
                count++;
              }
            }
          }

          $badge.text(count);

          if (total > 0) {
            $videohelp.show();
          } else {
            $videohelp.hide();
          }

          if (count > 0) {
            $badge.removeClass('empty');
          } else {
            $badge.addClass('empty');
          }
        }
      });
    }
  }]);

  return Videohelp;
}();
//# sourceMappingURL=VideoHelp.js.map
