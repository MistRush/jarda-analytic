function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Formatters = /*#__PURE__*/function () {
  function Formatters() {
    _classCallCheck(this, Formatters);
  }
  return _createClass(Formatters, [{
    key: "formatStock",
    value: function formatStock(value, col) {
      if (value === null) value = 0;
      var cls = '';
      switch (col) {
        case 'Availability1':
          cls = 'green';
          break;
        case 'Availability2':
          cls = 'yellow';
          break;
        case 'Availability3':
          cls = 'red';
          break;
        case 'AvailabilitySum':
          cls = 'yellowClaim';
          break;
      }
      if (value <= 0) cls = '';
      return '<div class="stock-info ' + cls + '">' + value + '</div>';
    }
  }, {
    key: "formatPriceCdb",
    value: function formatPriceCdb(value, col, row) {
      var gExactPrice = row !== null && row !== void 0 && row.gExactPrice ? row.gExactPrice === "1" : false;
      var last3 = col.slice(-3);
      if ((value == 0 || value == null || value == 'null') && !gExactPrice) return 'On request';else if (last3 == "EUR") return '<div style=" font-size: 14px">' + Helpers.formatPrice(value / 100) + " \u20AC</div>";
      if (last3 == "CZK") return '<div style=" font-size: 14px">' + Helpers.formatPrice(value / 100) + ' Kč</div>';
      if (last3 == "GBP") return '<div style=" font-size: 14px">' + Helpers.formatPrice(value / 100) + ' &pound</div>';
      if (last3 == "PLN") return '<div style=" font-size: 14px">' + Helpers.formatPrice(value / 100) + ' zł</div>';
    }
  }, {
    key: "formatPriceCdbWorkflow",
    value: function formatPriceCdbWorkflow(value) {
      if (value == 0 || value == null || value == 'null') return 'Not a value';else return '<div style=" font-size: 14px">' + Helpers.formatPrice(value) + '</div>';
    }
  }, {
    key: "formatPriceCdbGreen",
    value: function formatPriceCdbGreen(value, col, row) {
      var gExactPrice = row !== null && row !== void 0 && row.gExactPrice ? row.gExactPrice === "1" : false;
      var last3 = col.slice(-3);
      if ((value == 0 || value == null || value == 'null') && !gExactPrice) return 'On request';else if (last3 == "EUR") return '<div style="color: #24C586; font-weight: bold; font-size: 14px">' + Helpers.formatPrice(value / 100) + " \u20AC</div>";
      if (last3 == "CZK") return '<div style="color: #24C586; font-weight: bold; font-size: 14px">' + Helpers.formatPrice(value / 100) + ' Kč</div>';
      if (last3 == "GBP") return '<div style="color: #24C586; font-weight: bold; font-size: 14px">' + Helpers.formatPrice(value / 100) + ' &pound</div>';
      if (last3 == "PLN") return '<div style="color: #24C586; font-weight: bold; font-size: 14px">' + Helpers.formatPrice(value / 100) + ' zł</div>';
    }
  }, {
    key: "formatPrice",
    value: function formatPrice(value, col, row) {
      var gExactPrice = row !== null && row !== void 0 && row.gExactPrice ? row.gExactPrice === "1" : false;
      if ((value == 0 || value == null || value == 'null') && !gExactPrice) return 'On request';else return Helpers.formatPrice(value / 100);
    }
  }, {
    key: "generateRandomText",
    value: function generateRandomText(length) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
    }
  }, {
    key: "formatProductRankingBuyer",
    value: function formatProductRankingBuyer(value) {
      if (!value) return '<div class="stock-info w-75" style="background: darkgrey;">-</div>';else return '<div class="stock-info w-75" style="background: #48BF53;">' + value + '</div>';
    }
  }, {
    key: "formatProductRanking",
    value: function formatProductRanking(value) {
      if (!value) return '<div class="stock-info w-75" style="background: darkgrey;">-</div>';else if (value <= 100) return '<div class="stock-info w-75" style="background: #48BF53;">' + value + '</div>';else if (value <= 200) return '<div class="stock-info w-75" style="background: #FFCE03; color: black !important;">' + value + '</div>';else if (value <= 300) return '<div class="stock-info w-75" style="background: #FD9A01;">' + value + '</div>';else if (value <= 400) return '<div class="stock-info w-75" style="background: #FD6104;">' + value + '</div>';else if (value <= 1000) return '<div class="stock-info w-75" style="background: #C1181D;">' + value + '</div>';else if (value <= 2500) return '<div class="stock-info w-75" style="background: #88060b;">' + value + '</div>';else return '<div class="stock-info w-75" style="background: #8c2905;">2501+</div>';
    }
  }, {
    key: "formatProductReclamationStatus",
    value: function formatProductReclamationStatus(value) {
      var match = value.match(/(\d+)/); // Find the first occurrence of numbers

      if (!match) {
        return '<div class="stock-info w-75" style="background: grey;">Unknown</div>';
      }
      var numberPart = parseInt(match[0], 10); // Convert matched number to an integer
      var stringPart = value.replace(match[0], "").trim(); // Remove the number from the input string

      if (!value) return '<div class="stock-info w-75" style="background: darkgrey;">-</div>';else if (numberPart == 138) return '<div class="stock-info w-75" style="background: #48BF53;">' + stringPart + '</div>';else if (numberPart == 105) return '<div class="stock-info w-75" style="background: #FFCE03; color: black !important;">' + stringPart + '</div>';else if (numberPart == 113) return '<div class="stock-info w-75" style="background: #FD9A01;">' + stringPart + '</div>';else if (numberPart == 159) return '<div class="stock-info w-75" style="background: #FD6104;">' + stringPart + '</div>';else return '<div class="stock-info w-75" style="background: #8c2905;">' + stringPart + '</div>';
    }
  }, {
    key: "formatProductReclamationLegitimacy",
    value: function formatProductReclamationLegitimacy(value) {
      var match = value.match(/(\d+)/); // Find the first occurrence of numbers

      if (!match) {
        return '<div class="stock-info w-75" style="background: grey;">Unknown</div>';
      }
      var numberPart = parseInt(match[0], 10); // Convert matched number to an integer
      var stringPart = value.replace(match[0], "").trim(); // Remove the number from the input string

      if (!value) return '<div class="stock-info w-75" style="background: darkgrey;">-</div>';else if (numberPart == 1) return '<div class="stock-info w-75" style="background: #0080ff; color: black !important;">' + stringPart + '</div>';else if (numberPart == 2) return '<div class="stock-info w-75" style="background: #FF0000; color: black !important;">' + stringPart + '</div>';else if (numberPart == 3) return '<div class="stock-info w-75" style="background: #48BF53;">' + stringPart + '</div>';else if (numberPart == 4) return '<div class="stock-info w-75" style="background: #FD9A01;">' + stringPart + '</div>';else return '<div class="stock-info w-75" style="background: grey;">' + stringPart + '</div>';
    }
  }, {
    key: "formatWorkflowStatus",
    value: function formatWorkflowStatus(value) {
      if (!value) {
        return '<div class="stock-info w-75" style="background: #A9A9A9;">Není určeno</div>';
      }
      var color = '#A9A9A9'; // default: Není určeno
      var label = value;
      switch (value.toLowerCase()) {
        case 'zrušeno':
          color = '#FF4C4C'; // červená
          break;
        case 'dokončeno':
          color = '#4CAF50'; // zelená
          break;
        case 'probíhá':
          color = '#2196F3'; // modrá
          break;
        case 'vytvořeno':
          color = '#FFB74D'; // oranžová
          break;
        case 'pozastaveno':
          color = '#607D8B'; // oranžová
          break;
        case 'není známo':
          color = '#A9A9A9'; // tmavě šedá
          break;
        case 'čeká':
          color = '#C9B010'; // žlutá
          break;
      }
      return "<div class=\"stock-info w-75\" style=\"background: ".concat(color, ";\">").concat(label, "</div>");
    }
  }, {
    key: "formatWorkflowResult",
    value: function formatWorkflowResult(value) {
      if (!value) {
        return '<div class="stock-info w-75" style="background: #A9A9A9;">Není určeno</div>';
      }
      var color = '#A9A9A9'; // default: Není určeno
      var label = value;
      switch (value.toLowerCase()) {
        case 'zamítnuto':
          color = '#FF4C4C'; // červená
          break;
        case 'schváleno':
          color = '#4CAF50'; // zelená
          break;
        case 'není určeno':
          color = '#A9A9A9'; // tmavě šedá
          break;
      }
      return "<div class=\"stock-info w-75\" style=\"background: ".concat(color, ";\">").concat(label, "</div>");
    }
  }, {
    key: "formatResponsibleEmployees",
    value: function formatResponsibleEmployees(value) {
      if (!value || typeof value !== 'string') {
        return '<div class="stock-info w-75" style="background: #A9A9A9;">Není určeno</div>';
      }
      var items = value.split(',').map(function (v) {
        return v.trim();
      });
      var results = items.map(function (item) {
        // Expected format: "schváleno: Petra Černá"
        var parts = item.split(':');
        if (parts.length !== 2) return '';
        var status = parts[0].trim().toLowerCase();
        var label = parts[1].trim();
        var color = '#A9A9A9'; // default

        switch (status) {
          case 'zamítnuto':
            color = '#FF4C4C'; // red
            break;
          case 'schváleno':
            color = '#4CAF50'; // green
            break;
          case 'není určeno':
            color = '#A9A9A9'; // gray
            break;
        }
        return "<div class=\"stock-info w-75 mb-1\" style=\"background: ".concat(color, ";\">").concat(label, "</div>");
      });
      return results.join('');
    }
  }, {
    key: "formatImage",
    value: function formatImage(name, key, row) {
      var srcFull = "/files/reclamations/".concat(row.OrderNumber, "/").concat(name);
      return " <a href=\"".concat(srcFull, "\" target=\"_blank\">\n            <img src=\"").concat(srcFull, "\" style=\"max-height: 200px\">\n        </a>");
    }
  }]);
}();
var ActiveProductFilter = function ActiveProductFilter(row, data) {
  if (data.Deactivate == 1) $(row).addClass('deactivated');
};
//# sourceMappingURL=Formatters.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Cron = /*#__PURE__*/function () {
  function Cron(logUrl, runUrl) {
    _classCallCheck(this, Cron);
    this.logPanel = null;
    this.grid = null;
    this._defaults = {
      logUrl: basePath + logUrl,
      runUrl: basePath + runUrl,
      logPanelTitle: 'Log',
      start: 'Start',
      stop: 'Stop',
      runtime: 'Run time'
    };
  }
  return _createClass(Cron, [{
    key: "init",
    value: function init() {
      var _this = this;
      $(function () {
        _this.bindEvents();
      });
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      this._graphWrapper = $('[data-graph-data]');
      try {
        this._graphWrapper.get(0).graphData = JSON.parse(this._graphWrapper.get(0).dataset.graphData);
        this.renderBoxes(this._graphWrapper.get(0).graphData);
      } catch (e) {
        console.error(e);
        alerts.error();
      }
    }
  }, {
    key: "defaults",
    get: function get() {
      return this._defaults;
    },
    set: function set(defaults) {
      this._defaults = Object.assign(this._defaults, defaults);
    }
  }, {
    key: "log",
    value: function log(id) {
      this.logPanel = new Panel();
      this.logPanel.setTitle(this.defaults.logPanelTitle);
      this.logPanel.showFromUrl(this.defaults.logUrl, {
        Cron_ID: id,
        Panel_ID: this.logPanel.uid
      });
    }
  }, {
    key: "run",
    value: function run(id) {
      $.ajax({
        url: this.defaults.runUrl,
        data: {
          Cron_ID: id
        }
      });
    }
  }, {
    key: "renderBoxes",
    value: function renderBoxes(graphData) {
      var self = this;
      for (var ind in graphData.items) {
        $(this.renderBox(graphData.items[ind], graphData)).appendTo(this._graphWrapper.find('.cron__items')).tooltip({
          html: true,
          title: function title() {
            var _this$cron$message;
            var statusColor = this.cron.status === 'OK' ? 'ok' : 'error';
            var html = "\n                        <div class=\"cron__items__box__tooltip\">\n                            <h2>".concat(this.cron.name, "</h2>\n                            <hr>\n                            <b>").concat(self.defaults.start, ":</b> ").concat(this.cron.start, "<br>\n                            <b>").concat(self.defaults.stop, ":</b> ").concat(this.cron.stop, "<br>\n                            <b>").concat(self.defaults.runtime, ":</b> ").concat(this.cron.runtime, "\n                            <h3 class=\"cron__items__box__tooltip__").concat(statusColor, "\">").concat(this.cron.status, "</h3>\n                            <pre>").concat((_this$cron$message = this.cron.message) !== null && _this$cron$message !== void 0 ? _this$cron$message : '', "</pre>\n                        </div>\n                    ");
            return html;
          }
        });
      }
    }

    /**
     * Render boxu
     * @param {Object} item
     */
  }, {
    key: "renderBox",
    value: function renderBox(item, graphData) {
      var _this2 = this;
      var element = document.createElement('div');
      var height = 100 / (graphData.level + 1);
      element.cron = item;
      element.classList.add('cron__items__box');
      element.style.left = item.left / graphData.range * 100 + '%';
      element.style.width = item.width / graphData.range * 100 + '%';
      element.style.height = height + '%';
      element.style.top = height * item.top + '%';
      element.classList.add(item.status === 'OK' ? 'cron__items__box__success' : 'cron__items__box__error');
      element.classList.add('item_' + item.id);
      element.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        _this2.log(item.id);
      });
      return element;
    }
  }]);
}();
//# sourceMappingURL=Cron.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Layout = /*#__PURE__*/function () {
  function Layout() {
    var _this = this;
    _classCallCheck(this, Layout);
    history.pushState('page', 'CDB', window.location.href);
    $(document).ajaxSend(function () {
      $('#loader').stop().fadeIn(100);
    });
    $(document).ajaxError(function (data) {
      if (!data.statusText === 'abort') alerts.alert('Error', 'error', data.statusText + ': ' + data.responseText);
    });
    $(document).ajaxComplete(function () {
      $('#loader').stop().fadeOut(100);
    });
    this._latestPanelHeading = null;
    this.dialogOpen = false;
    $(function () {
      _this.initDarkMode();
      $("#loader").hide();
      _this.bindEvents();
    });
  }
  return _createClass(Layout, [{
    key: "bindEvents",
    value: function bindEvents() {
      $(document).on("click", ".disabled", function (event) {
        event.stopImmediatePropagation();
        return false;
      });
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        $.fn.dataTable.tables({
          visible: true,
          api: true
        }).columns.adjust();
        if (typeof InstallTrigger !== 'undefined') {
          if (typeof window[$($(this).attr('href')).find('[id$="_datagrid"]').attr('id')] !== 'undefined') window[$($(this).attr('href')).find('[id$="_datagrid"]').attr('id')].refresh();
        }
        var rs = $($(this).attr('href')).find('.relation-switcher');
        if (rs.length > 0) {
          window[rs.attr('id')].refresh();
        }
      });
      $(window).on('scroll', function () {
        var y_scroll_pos = window.pageYOffset;
        if ($('.panel-heading').length > 0) {
          var scroll_pos_test = $('.panel-heading').offset().top;
          if (this._latestPanelHeading == null) {
            if (y_scroll_pos > scroll_pos_test) {
              this._latestPanelHeading = scroll_pos_test;
              var temp_height = $('.panel-heading').outerHeight();
              $('.panel-heading').parent().css('padding-top', temp_height);
              $('.panel-heading').addClass('locked');
            }
          } else {
            if (y_scroll_pos < this._latestPanelHeading) {
              this._latestPanelHeading = null;
              $('.panel-heading').parent().removeAttr('style');
              $('.panel-heading').removeClass('locked');
            }
          }
        }
      });
    }
  }, {
    key: "initDarkMode",
    value: function initDarkMode() {
      if (Cookie.getCookie('color-mode') === undefined && $('html').data('nocolor') === undefined) {
        if ($('html').hasClass('prefer-light') || $('html').hasClass('prefer-dark')) {
          return;
        }
        $('html').addClass('prefer-dark');
        Cookie.setCookie('color-mode', 'prefer-dark', 365);
      }
    }
  }, {
    key: "toggleDarkMode",
    value: function toggleDarkMode() {
      if (Cookie.getCookie('color-mode') === 'prefer-light') {
        Cookie.setCookie('color-mode', 'prefer-dark', 365);
        $('html').removeClass('prefer-light');
        $('html').addClass('prefer-dark');
      } else {
        Cookie.setCookie('color-mode', 'prefer-light', 365);
        $('html').addClass('prefer-light');
        $('html').removeClass('prefer-dark');
      }
      plugins.initTinyMCE();
    }
  }, {
    key: "changeLanguage",
    value: function changeLanguage(lang) {
      Helpers.ajax({
        url: basePath + "/admin/settings/change-language/",
        data: {
          LanguageValue: lang
        },
        success: function success() {
          location.reload();
        }
      }, true);
    }
  }, {
    key: "scrollTo",
    value: function scrollTo(e) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      e.preventDefault();
      if ($(e.target).hasClass('search')) {
        $("html, body").animate({
          scrollTop: $('#search').offset().top - $('header').height() - 20
        }, time, 'swing', callback);
        $('#search input').focus();
      } else {
        var $this = $('#' + $(e.target).data('id'));
        $("html, body").animate({
          scrollTop: $this.offset().top + $this.height() / 2 - $(window).height() / 2
        }, time, 'swing', callback);
      }
    }
  }]);
}();
//# sourceMappingURL=Layout.js.map

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Menu = /*#__PURE__*/function () {
  function Menu() {
    var _this = this;
    _classCallCheck(this, Menu);
    $(function () {
      $('#menuSearch').keyup(Helpers.delay(function () {
        _this.searchInMenu();
      }, _this, 400));
      $('#toggleMenu').click(function () {
        $('body').toggleClass('menu-open');
        _this.setCookie($('body').hasClass('menu-open'));
      });
      window.addEventListener('resize', function () {
        _this.toggleMenuFromCookie();
      });
      if ($('.subsubitem.active').length > 0) {
        var parent = $('.subsubitem.active').parent();
        parent.addClass('show');
        parent.siblings('.expander').removeClass('collapsed');
        parent.closest('.subitem').addClass('active');
      }
      if ($('.subitem.active').length > 0) {
        var _parent = $('.subitem.active').parent();
        _parent.addClass('show');
        _parent.siblings('.expander').removeClass('collapsed');
        _parent.closest('.item').addClass('active');
      }
      $('.main-search').click(function (e) {
        if (window.innerWidth > 768) {
          if ($('body').hasClass('menu-open')) {
            return;
          } else {
            $('body').addClass('menu-open');
            if ($(e.target).is('.main-search')) {
              $(e.target).find('input').focus();
            } else {
              $(e.target).parents('.main-search').find('input').focus();
            }
          }
        }
      });
    });
    this.toggleMenuFromCookie();
  }
  return _createClass(Menu, [{
    key: "resetMenuSearch",
    value: function resetMenuSearch() {
      $('.item').show();
      $('.item .subitem').show();
      $('.item .subsubitem').show();
      $('.item .expander').show();
      $('.item .collapse').not('.show').attr('style', '');
    }
  }, {
    key: "searchInMenu",
    value: function searchInMenu() {
      var query = $('#menuSearch').val();
      this.resetMenuSearch();
      if (query.length > 0) {
        query = query.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        var results = [];
        $('.menu-item-name').each(function () {
          var regex = new RegExp(query);
          var name = $(this).text().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          var description = $(this).data('description').replace(/\s/g, '').toLowerCase();
          var level = $(this).data('level');
          if (name.search(regex) !== -1 || description.search(regex) !== -1) {
            results.push($(this));
          }
          if (level == 1) {
            $(this).closest('.item').hide();
          } else if (level == 2) {
            $(this).closest('.subitem').hide();
          } else if (level == 3) {
            $(this).closest('.subitem').hide();
            $(this).closest('.subsubitem').hide();
          }
        });
        results.forEach(function (item) {
          var level = item.data('level');
          item.closest('.item').show();
          if (level == 2) {
            item.closest('.subitem').show();
            item.closest('.first-submenu').show();
          } else if (level == 3) {
            item.closest('.subitem').show();
            item.closest('.subsubitem').show();
            item.closest('.first-submenu').show();
            item.closest('.second-submenu').show();
          }
        });
        $('.expander').hide();
      }
    }
  }, {
    key: "setCookie",
    value: function setCookie() {
      var opened = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (window.innerWidth < 769) {
        return;
      }
      Cookie.setCookie('menuOpened', opened, 365);
    }
  }, {
    key: "toggleMenuFromCookie",
    value: function toggleMenuFromCookie() {
      if (window.innerWidth < 769) {
        if (!$('body').hasClass('menu-open')) {
          $('body').addClass('menu-open');
        }
        return;
      }
      if (Cookie.getCookie('menuOpened') === undefined) {
        this.setCookie(true);
        return;
      }
      if (Cookie.getCookie('menuOpened') === 'true') {
        if (!$('body').hasClass('menu-open')) {
          $('body').addClass('menu-open');
        }
      } else {
        $('body').removeClass('menu-open');
      }
    }
  }]);
}();
//# sourceMappingURL=Menu.js.map

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Plugins = /*#__PURE__*/function () {
  function Plugins() {
    _classCallCheck(this, Plugins);
    this.afterInit = null;
    this.tinyMCEKey = settings.filemanagerKey;
    this.lazyload = null;
    this.initSelectEvents = false;
    this.tiniMceCustomParams = {};
    if (typeof filemanagerSubForlder === "undefined") this.filemanagerSubForlder = "";else this.filemanagerSubForlder = filemanagerSubForlder;
    moment.locale(Helpers.getBrowserLocales()[0]);
    lightbox.option({
      'resizeDuration': 100,
      'fadeDuration': 100,
      'imageFadeDuration': 100,
      'albumLabel': "%1 / %2"
    });
    $(function () {
      setTimeout(plugins.initPlugins());
    });
  }
  return _createClass(Plugins, [{
    key: "initPlugins",
    value: function initPlugins() {
      var reinit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      $.fn.modal.Constructor.prototype._enforceFocus = function () {};
      this.initGrapes(reinit, reset);
      this.initTinyMCE(reinit);
      this.initSvg();
      this.initDatePicker();
      this.initSelect2();
      this.initBsFile();
      this.initBsPopover();
      this.initBsTooltip();
      this.initLazyLoad();
      if (typeof this.afterInit === 'function') this.afterInit();
    }
  }, {
    key: "initLazyLoad",
    value: function initLazyLoad() {
      this.lazyload = new LazyLoad({});
    }
  }, {
    key: "initBsTooltip",
    value: function initBsTooltip() {
      $('.tooltip[role="tooltip"]').remove();
      $('body').tooltip({
        selector: '[data-toggle="bstooltip"]',
        html: true
      });
      $('body').tooltip({
        selector: '[data-toggle="tooltipCustom"]',
        html: true,
        template: '<div class="tooltip tooltip-custom" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
        placement: 'bottom'
      });
    }
  }, {
    key: "initBsPopover",
    value: function initBsPopover() {
      $('body').popover({
        selector: '[data-toggle="bspopover"]',
        html: true,
        trigger: 'focus'
      });
    }
  }, {
    key: "initSvg",
    value: function initSvg() {
      $('img.svg').each(function () {
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
        jQuery.get(imgURL, function (data) {
          var $svg = jQuery(data).find('svg');
          if (typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
          }
          if (typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass + ' replaced-svg');
          }
          $svg = $svg.removeAttr('xmlns:a');
          if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
          }
          $img.replaceWith($svg);
        }, 'xml');
      });
    }
  }, {
    key: "initDatePicker",
    value: function initDatePicker() {
      $('.datepicker').each(function () {
        var val = $(this).val();
        if (val.match(/^\d{4}-\d{2}-\d{2}$/)) {
          var date = moment(val, 'YYYY-MM-DD');
          val = date.format('L');
          $(this).val(val);
        }
      });
      $('.datetimepicker').each(function () {
        var val = $(this).val();
        if (val.match(/^\d{4}-\d{2}-\d{2}.*$/)) {
          var date = moment(val, 'YYYY-MM-DD HH:mm:ss');
          val = date.format('L LTS');
          $(this).val(val);
        }
      });
      $('.timepickerH').each(function () {
        var val = $(this).val();
        if (val.match(/^\d{2}$/)) {
          var date = moment(val, 'HH');
          val = date.format('HH');
          $(this).val(val);
        }
      });
      $('.timepickerHM').each(function () {
        var val = $(this).val();
        if (val.match(/^\d{2}:\d{2}$/)) {
          var date = moment(val, 'HH:mm');
          val = date.format('LT');
          $(this).val(val);
        }
      });
      $('.timepickerHMS').each(function () {
        var val = $(this).val();
        if (val.match(/^\d{2}:\d{2}:\d{2}$/)) {
          var date = moment(val, 'HH:mm:ss');
          val = date.format('LTS');
          $(this).val(val);
        }
      });
      $('.datepicker').datetimepicker({
        locale: moment.locale(lang),
        format: 'L'
      });
      $('.datetimepicker').datetimepicker({
        locale: moment.locale(lang),
        format: 'L LTS'
      });
      $('.timepickerH').datetimepicker({
        locale: moment.locale(lang),
        format: 'HH'
      });
      $('.timepickerHM').datetimepicker({
        locale: moment.locale(lang),
        format: 'LT'
      });
      $('.timepickerHMS').datetimepicker({
        locale: moment.locale(lang),
        format: 'LTS'
      });
    }
  }, {
    key: "initSelect2",
    value: function initSelect2() {
      $('select:not(.noselect):not([name*="_datagrid_length"]):not([data-store])').each(function (index, e) {
        e = $(e);
        e.select2({
          lang: 'cs',
          width: '100%',
          allowClear: true,
          placeholder: '',
          tags: typeof e.data('editable') !== 'undefined' && e.data('editable') === true,
          matcher: function matcher(params, data) {
            var matcher = $.fn.select2.defaults.defaults.matcher;
            if (data.id.indexOf(params.term) > -1) {
              return data;
            }
            return matcher(params, data);
          }
        });
      });
      if (!this.initSelectEvents) {
        $(document).on('click', '.select2.select2-container.select2-container--default.select2-container--below[data-select2-id]', function (e) {
          if ($('.select2-container.select2-container--default.select2-container--open .select2-search__field').length) $('.select2-container.select2-container--default.select2-container--open .select2-search__field')[0].focus();
        });
        $(document).on('focus', '.select2-selection.select2-selection--single', function (e) {
          $(this).closest(".select2-container").siblings('select:enabled').select2('open');
          if ($('.select2-container.select2-container--default.select2-container--open .select2-search__field').length) $('.select2-container.select2-container--default.select2-container--open .select2-search__field')[0].focus();
        });

        // steal focus during close - only capture once and stop propogation
        $(document).on('select2:closing', 'select.select2-hidden-accessible', function (e) {
          $(e.currentTarget).trigger('focus');
          $(e.target).data("select2").$selection.one('focus focusin', function (e) {
            e.stopPropagation();
          });
        });
        this.initSelectEvents = true;
      }
    }
  }, {
    key: "initSelect2Ajax",
    value: function initSelect2Ajax(selector) {
      $(selector).find('[data-store]:not(.noselect):not([name*="_datagrid_length"]):not([data-select2-id])').each(function (i, e) {
        e = $(e);
        e[0].setUrlParameter = function (k, v) {
          var params = $(this).data('storeparams');
          params[k] = v;
          $(this).data('storeparams', params);
        };
        e[0].unsetUrlParameter = function (k) {
          var params = $(this).data('storeparams');
          delete params[k];
          $(this).data('storeparams', params);
        };
        e[0].getUrlParameter = function (k) {
          var params = $(this).data('storeparams');
          return params[k];
        };
        e[0].refresh = function () {
          var parent = $(this).data('storedepends');
          $(this).closest('form').find('[name="' + $(this).data('storedepends') + '"]').trigger('change');
        };
        e[0].refreshThis = function () {
          var params = $(this).data('storeparams');
          $.ajax({
            url: e.data('store'),
            data: Object.assign({}, params)
          }).then(function (data) {
            data = JSON.parse(data).items;
            e.html("<option value=\"null\">-</option>");
            var val = null;
            if (e.val() !== 'null') val = e.val();
            if (val == null && selector.id.includes('entityeditor')) val = window[selector.id].data[e.attr('name')];
            for (var c in data) {
              if (_typeof(data[c]) === 'object') {
                var option = "<option value=\"".concat(data[c].ID, "\" ").concat(data[c].ID == val ? 'selected' : '', ">").concat(data[c][e.data('storefield')], "</option>");
                e.append(option);
              }
            }
            e.trigger('change');
          });
        };
        if (typeof e.data('storedepends') !== 'undefined') {
          $(selector).find('[name="' + e.data('storedepends') + '"]').on('change', function (event) {
            var target = $(event.target);
            if (target.val() === '' || target.val() === null || target.val() === 'null') {
              e.html("<option value=\"null\">-</option>");
              e.trigger('change');
            } else {
              var params = e.data('storeparams');
              params[e.data('storedepends')] = target.val();
              $.ajax({
                url: e.data('store'),
                data: Object.assign({}, params)
              }).then(function (data) {
                if (typeof data === 'string') data = JSON.parse(data);
                data = data.items;
                if (e.attr('data-select-first')) {
                  e.html("");
                } else {
                  e.html("<option value=\"null\">-</option>");
                }
                var val = null;
                if (e.val() !== 'null') val = e.val();
                if (val == null && selector.id.includes('entityeditor')) val = window[selector.id].data[e.attr('name')];
                if (val == null && e.attr('data-select-first') && data.length > 0) val = data[0].ID;
                for (var c in data) {
                  if (_typeof(data[c]) === 'object') {
                    var option = "<option value=\"".concat(data[c].ID, "\" ").concat(data[c].ID == val ? 'selected' : '', ">").concat(data[c][e.data('storefield')], "</option>");
                    e.append(option);
                  }
                }
                e.trigger('change');
              });
            }
          });
        }
        e.select2({
          lang: 'cs',
          height: '100%',
          allowClear: true,
          placeholder: '',
          matcher: function matcher(params, data) {
            var matcher = $.fn.select2.defaults.defaults.matcher;
            if (data.id.indexOf(params.term) > -1) {
              return data;
            }
            return matcher(params, data);
          },
          ajax: {
            url: e.data('store'),
            dataType: 'json',
            delay: 350,
            data: function data(params) {
              var limit = 15;
              var query = {
                q: params.term,
                //[e.data('storefield')]: params.term,
                start: limit * (params.page - 1 || 0),
                count: limit * (params.page || 1)
              };
              if (typeof e.data('storeparams') !== 'undefined') query = _objectSpread(_objectSpread({}, e.data('storeparams')), query);
              return query;
            },
            processResults: function processResults(data, params) {
              var editable = typeof e.data('editable') !== 'undefined' && e.data('editable') === true;
              var limit = 15;
              var numRows = data.numRows;
              data = data.items;
              params.page = params.page || 1;
              data = $.map(data, function (obj) {
                obj.id = obj.ID;
                obj.text = obj[e.data('storefield')];
                return obj;
              });
              if (editable) {
                console.log('jsemtu');
                data = [{
                  'id': 'null',
                  text: params.term
                }].concat(_toConsumableArray(data));
              }
              return {
                results: data,
                pagination: {
                  more: params.page * limit < numRows
                }
              };
            },
            cache: true
          }
        });
      });
    }
  }, {
    key: "initTinyMCE",
    value: function initTinyMCE() {
      var reinit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      tinymce.init(_objectSpread({
        selector: 'textarea[data-mce=true]:not([aria-hidden])',
        language: lang,
        branding: false,
        height: 300,
        image_advtab: true,
        relative_urls: false,
        remove_script_host: true,
        document_base_url: basePath,
        paste_data_images: true,
        convert_urls: true,
        skin: Cookie.getCookie('color-mode') === 'prefer-dark' ? 'oxide-dark' : null,
        content_css: Cookie.getCookie('color-mode') === 'prefer-dark' ? 'dark' : null,
        plugins: 'preview paste searchreplace autolink code visualblocks visualchars fullscreen image link media table charmap hr nonbreaking anchor toc insertdatetime advlist lists wordcount textpattern noneditable help charmap quickbars emoticons responsivefilemanager',
        toolbar: 'undo redo | bold italic underline strikethrough | formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | charmap emoticons | fullscreen  preview | insertfile image media responsivefilemanager link anchor',
        toolbar_sticky: true,
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        toolbar_mode: 'sliding',
        // external_filemanager_path: basePath + "/jolanda/front/filemanager/",
        external_filemanager_path: basePath + "/admin/file-manager/",
        // external_plugins: { "filemanager" : basePath + "/core/filemanager/plugin.min.js"},
        menu: {
          file: {
            title: 'File',
            items: 'newdocument restoredraft | preview | print '
          },
          edit: {
            title: 'Edit',
            items: 'undo redo | cut copy paste | selectall | searchreplace'
          },
          view: {
            title: 'View',
            items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen'
          },
          insert: {
            title: 'Insert',
            items: 'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime'
          },
          format: {
            title: 'Format',
            items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats align | forecolor backcolor | removeformat'
          },
          tools: {
            title: 'Tools',
            items: 'spellchecker spellcheckerlanguage | code wordcount'
          },
          table: {
            title: 'Table',
            items: 'inserttable | cell row column | tableprops deletetable'
          }
        },
        filemanager_access_key: this.tinyMCEKey,
        filemanager_relative_url: basePath,
        filemanager_subfolder: this.filemanagerSubForlder,
        setup: function setup(editor) {
          editor.on('blur change cut copy keyup paste focus focusout', function (e) {
            editor.save();
          });
        }
      }, this.tiniMceCustomParams));
    }
  }, {
    key: "initBsFile",
    value: function initBsFile() {
      bsCustomFileInput.init();
    }
  }, {
    key: "initGrapes",
    value: function initGrapes() {
      var reinit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    } // $('.block-editor').each((i, e) => {
    //     let isInit = false;
    //     grapesjs.editors.forEach((editor) => {
    //         if($(editor.getEl()).parent()[0] === e){
    //             isInit = true;
    //
    //             if(reinit){
    //                 editor.destroy();
    //                 isInit = false;
    //             }
    //         }
    //     });
    //
    //     if(isInit)
    //         return;
    //
    //     console.log('asd');
    //
    //     let editor = grapesjs.init({
    //         container: e,
    //         storageManager: {type: 'null'},
    //         fromElement: true,
    //         height: '600px',
    //         storeComponents: false,
    //         noticeOnUnload: false,
    //
    //         canvas: {
    //             styles: [
    //                 "https://fonts.googleapis.com/css2?family=Nunito+Sans&display=swap",
    //                 "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css",
    //                 basePath + "/front/css/libs.min.css",
    //                 basePath + "/front/css/style.min.css"
    //             ],
    //             scripts: [
    //                 "https://code.jquery.com/jquery-3.3.1.slim.min.js",
    //                 "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js",
    //             ]
    //         },
    //         assetManager: {
    //             custom: true,
    //         },
    //         /*assetManager: {
    //             assets: [
    //                 'http://placehold.it/350x250/78c5d6/fff/image1.jpg',
    //                 // Pass an object with your properties
    //                 {
    //                     type: 'image',
    //                     src: 'http://placehold.it/350x250/459ba8/fff/image2.jpg',
    //                     height: 350,
    //                     width: 250,
    //                     name: 'displayName'
    //                 },
    //                 {
    //                     // As the 'image' is the base type of assets, omitting it will
    //                     // be set as `image` by default
    //                     src: 'http://placehold.it/350x250/79c267/fff/image3.jpg',
    //                     height: 350,
    //                     width: 250,
    //                     name: 'displayName'
    //                 },
    //             ],
    //         },*/
    //         customStyleManager: [{
    //             name: 'General',
    //             buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
    //             properties: [{
    //                 name: 'Alignment',
    //                 property: 'float',
    //                 type: 'radio',
    //                 defaults: 'none',
    //                 list: [
    //                     {value: 'none', className: 'fa fa-times'},
    //                     {value: 'left', className: 'fa fa-align-left'},
    //                     {value: 'right', className: 'fa fa-align-right'}
    //                 ],
    //             },
    //                 {property: 'position', type: 'select'}
    //             ],
    //         }, {
    //             name: 'Dimension',
    //             open: false,
    //             buildProps: ['width', 'flex-width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
    //             properties: [{
    //                 id: 'flex-width',
    //                 type: 'integer',
    //                 name: 'Width',
    //                 units: ['px', '%'],
    //                 property: 'flex-basis',
    //                 toRequire: 1,
    //             }, {
    //                 property: 'margin',
    //                 properties: [
    //                     {name: 'Top', property: 'margin-top'},
    //                     {name: 'Right', property: 'margin-right'},
    //                     {name: 'Bottom', property: 'margin-bottom'},
    //                     {name: 'Left', property: 'margin-left'}
    //                 ],
    //             }, {
    //                 property: 'padding',
    //                 properties: [
    //                     {name: 'Top', property: 'padding-top'},
    //                     {name: 'Right', property: 'padding-right'},
    //                     {name: 'Bottom', property: 'padding-bottom'},
    //                     {name: 'Left', property: 'padding-left'}
    //                 ],
    //             }],
    //         }, {
    //             name: 'Typography',
    //             open: false,
    //             buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'],
    //             properties: [
    //                 {name: 'Font', property: 'font-family'},
    //                 {name: 'Weight', property: 'font-weight'},
    //                 {name: 'Font color', property: 'color'},
    //                 {
    //                     property: 'text-align',
    //                     type: 'radio',
    //                     defaults: 'left',
    //                     list: [
    //                         {value: 'left', name: 'Left', className: 'fa fa-align-left'},
    //                         {value: 'center', name: 'Center', className: 'fa fa-align-center'},
    //                         {value: 'right', name: 'Right', className: 'fa fa-align-right'},
    //                         {value: 'justify', name: 'Justify', className: 'fa fa-align-justify'}
    //                     ],
    //                 }, {
    //                     property: 'text-decoration',
    //                     type: 'radio',
    //                     defaults: 'none',
    //                     list: [
    //                         {value: 'none', name: 'None', className: 'fa fa-times'},
    //                         {value: 'underline', name: 'underline', className: 'fa fa-underline'},
    //                         {value: 'line-through', name: 'Line-through', className: 'fa fa-strikethrough'}
    //                     ],
    //                 }, {
    //                     property: 'text-shadow',
    //                     properties: [
    //                         {name: 'X position', property: 'text-shadow-h'},
    //                         {name: 'Y position', property: 'text-shadow-v'},
    //                         {name: 'Blur', property: 'text-shadow-blur'},
    //                         {name: 'Color', property: 'text-shadow-color'}
    //                     ],
    //                 }],
    //         }, {
    //             name: 'Decorations',
    //             open: false,
    //             buildProps: ['opacity', 'border-radius', 'border', 'box-shadow', 'background-bg'],
    //             properties: [{
    //                 type: 'slider',
    //                 property: 'opacity',
    //                 defaults: 1,
    //                 step: 0.01,
    //                 max: 1,
    //                 min: 0,
    //             }, {
    //                 property: 'border-radius',
    //                 properties: [
    //                     {name: 'Top', property: 'border-top-left-radius'},
    //                     {name: 'Right', property: 'border-top-right-radius'},
    //                     {name: 'Bottom', property: 'border-bottom-left-radius'},
    //                     {name: 'Left', property: 'border-bottom-right-radius'}
    //                 ],
    //             }, {
    //                 property: 'box-shadow',
    //                 properties: [
    //                     {name: 'X position', property: 'box-shadow-h'},
    //                     {name: 'Y position', property: 'box-shadow-v'},
    //                     {name: 'Blur', property: 'box-shadow-blur'},
    //                     {name: 'Spread', property: 'box-shadow-spread'},
    //                     {name: 'Color', property: 'box-shadow-color'},
    //                     {name: 'Shadow type', property: 'box-shadow-type'}
    //                 ],
    //             }, {
    //                 id: 'background-bg',
    //                 property: 'background',
    //                 type: 'bg',
    //             },],
    //         }, {
    //             name: 'Extra',
    //             open: false,
    //             buildProps: ['transition', 'perspective', 'transform'],
    //             properties: [{
    //                 property: 'transition',
    //                 properties: [
    //                     {name: 'Property', property: 'transition-property'},
    //                     {name: 'Duration', property: 'transition-duration'},
    //                     {name: 'Easing', property: 'transition-timing-function'}
    //                 ],
    //             }, {
    //                 property: 'transform',
    //                 properties: [
    //                     {name: 'Rotate X', property: 'transform-rotate-x'},
    //                     {name: 'Rotate Y', property: 'transform-rotate-y'},
    //                     {name: 'Rotate Z', property: 'transform-rotate-z'},
    //                     {name: 'Scale X', property: 'transform-scale-x'},
    //                     {name: 'Scale Y', property: 'transform-scale-y'},
    //                     {name: 'Scale Z', property: 'transform-scale-z'}
    //                 ],
    //             }]
    //         }, {
    //             name: 'Flex',
    //             open: false,
    //             properties: [{
    //                 name: 'Flex Container',
    //                 property: 'display',
    //                 type: 'select',
    //                 defaults: 'block',
    //                 list: [
    //                     {value: 'block', name: 'Disable'},
    //                     {value: 'flex', name: 'Enable'}
    //                 ],
    //             }, {
    //                 name: 'Flex Parent',
    //                 property: 'label-parent-flex',
    //                 type: 'integer',
    //             }, {
    //                 name: 'Direction',
    //                 property: 'flex-direction',
    //                 type: 'radio',
    //                 defaults: 'row',
    //                 list: [{
    //                     value: 'row',
    //                     name: 'Row',
    //                     className: 'icons-flex icon-dir-row',
    //                     title: 'Row',
    //                 }, {
    //                     value: 'row-reverse',
    //                     name: 'Row reverse',
    //                     className: 'icons-flex icon-dir-row-rev',
    //                     title: 'Row reverse',
    //                 }, {
    //                     value: 'column',
    //                     name: 'Column',
    //                     title: 'Column',
    //                     className: 'icons-flex icon-dir-col',
    //                 }, {
    //                     value: 'column-reverse',
    //                     name: 'Column reverse',
    //                     title: 'Column reverse',
    //                     className: 'icons-flex icon-dir-col-rev',
    //                 }],
    //             }, {
    //                 name: 'Justify',
    //                 property: 'justify-content',
    //                 type: 'radio',
    //                 defaults: 'flex-start',
    //                 list: [{
    //                     value: 'flex-start',
    //                     className: 'icons-flex icon-just-start',
    //                     title: 'Start',
    //                 }, {
    //                     value: 'flex-end',
    //                     title: 'End',
    //                     className: 'icons-flex icon-just-end',
    //                 }, {
    //                     value: 'space-between',
    //                     title: 'Space between',
    //                     className: 'icons-flex icon-just-sp-bet',
    //                 }, {
    //                     value: 'space-around',
    //                     title: 'Space around',
    //                     className: 'icons-flex icon-just-sp-ar',
    //                 }, {
    //                     value: 'center',
    //                     title: 'Center',
    //                     className: 'icons-flex icon-just-sp-cent',
    //                 }],
    //             }, {
    //                 name: 'Align',
    //                 property: 'align-items',
    //                 type: 'radio',
    //                 defaults: 'center',
    //                 list: [{
    //                     value: 'flex-start',
    //                     title: 'Start',
    //                     className: 'icons-flex icon-al-start',
    //                 }, {
    //                     value: 'flex-end',
    //                     title: 'End',
    //                     className: 'icons-flex icon-al-end',
    //                 }, {
    //                     value: 'stretch',
    //                     title: 'Stretch',
    //                     className: 'icons-flex icon-al-str',
    //                 }, {
    //                     value: 'center',
    //                     title: 'Center',
    //                     className: 'icons-flex icon-al-center',
    //                 }],
    //             }, {
    //                 name: 'Flex Children',
    //                 property: 'label-parent-flex',
    //                 type: 'integer',
    //             }, {
    //                 name: 'Order',
    //                 property: 'order',
    //                 type: 'integer',
    //                 defaults: 0,
    //                 min: 0
    //             }, {
    //                 name: 'Flex',
    //                 property: 'flex',
    //                 type: 'composite',
    //                 properties: [{
    //                     name: 'Grow',
    //                     property: 'flex-grow',
    //                     type: 'integer',
    //                     defaults: 0,
    //                     min: 0
    //                 }, {
    //                     name: 'Shrink',
    //                     property: 'flex-shrink',
    //                     type: 'integer',
    //                     defaults: 0,
    //                     min: 0
    //                 }, {
    //                     name: 'Basis',
    //                     property: 'flex-basis',
    //                     type: 'integer',
    //                     units: ['px', '%', ''],
    //                     unit: '',
    //                     defaults: 'auto',
    //                 }],
    //             }, {
    //                 name: 'Align',
    //                 property: 'align-self',
    //                 type: 'radio',
    //                 defaults: 'auto',
    //                 list: [{
    //                     value: 'auto',
    //                     name: 'Auto',
    //                 }, {
    //                     value: 'flex-start',
    //                     title: 'Start',
    //                     className: 'icons-flex icon-al-start',
    //                 }, {
    //                     value: 'flex-end',
    //                     title: 'End',
    //                     className: 'icons-flex icon-al-end',
    //                 }, {
    //                     value: 'stretch',
    //                     title: 'Stretch',
    //                     className: 'icons-flex icon-al-str',
    //                 }, {
    //                     value: 'center',
    //                     title: 'Center',
    //                     className: 'icons-flex icon-al-center',
    //                 }],
    //             }]
    //         }
    //         ],
    //     });
    //
    //     if ($(editor.getEl()).parent().hasClass('block-editor')) {
    //         let name = $(editor.getEl()).parent().parent().attr('blockeditordata');
    //         let dynamic = $(editor.getEl()).parent().parent().attr('dynamic') ?? false;
    //         let editorName = $(editor.getEl()).parent().parent().attr('name');
    //
    //         if(dynamic){
    //             let namesSelect = $("[name='" + editorName + "_names']");
    //             console.log(namesSelect);
    //
    //
    //             namesSelect.on('change', (e) => {
    //                 console.log(e);
    //             })
    //         }
    //
    //         if (typeof name !== 'undefined' && name) {
    //             editor.on('update', () => {
    //                 //$("[name='"+name+"']").val(JSON.stringify(editor.storeData()));
    //                 $("[name='" + name + "']").val(JSON.stringify({
    //                     html: Plugins.getModifiedGrapesHTML(editor.storeData().html),
    //                     css: editor.storeData().css,
    //                 }));
    //             });
    //
    //             if(reset){
    //                 editor.loadData({html: '<div class="editor-container container"></div>', css: '* { box-sizing: border-box; } body {margin: 0;}'});
    //                 $("[name='" + name + "']").val(JSON.stringify({html: '<div class="editor-container container"></div>', css: '* { box-sizing: border-box; } body {margin: 0;}'}));
    //             }
    //
    //             editor.on('load', () => {
    //                 if ($("[name='" + name + "']").val() !== '') {
    //                     try {
    //                         editor.loadData(JSON.parse($("[name='" + name + "']").val()));
    //                     } catch {
    //                         editor.loadData({html: '<div class="editor-container container"></div>'});
    //                     }
    //                 }else {
    //                     editor.loadData({html: '<div class="editor-container container"></div>'});
    //                 }
    //
    //                 $(editor.getEl()).find('iframe')[0].contentWindow.$('head').append("<style>.editor-container[data-gjs-type] { min-height: 100vh; padding-bottom: 30px; }</style>");
    //             });
    //
    //             if (typeof window[name + '_editor_addBlocks'] === 'function') {
    //                 window[name + '_editor_addBlocks'](editor);
    //             }
    //
    //             editor.Panels.addButton('options', [{
    //                 id: 'copy',
    //                 className: 'far fa-copy icon-blank',
    //                 command: (editor1, sender) => {
    //                     localStorage.setItem('grapesjs_copy', JSON.stringify({
    //                         html: Plugins.getModifiedGrapesHTML(editor1.storeData().html),
    //                         css: editor1.storeData().css,
    //                     }));
    //
    //                     alerts.alert(translations.COPY_TO_CLIPBOARD, 'info');
    //                 },
    //                 attributes: {title: translations.BLOCKEDITOR_CLIPBOARD_COPY}
    //             },
    //             ]);
    //
    //             editor.Panels.addButton('options', [{
    //                 id: 'paste',
    //                 className: 'fas fa-paste icon-blank',
    //                 command: function (editor1, sender) {
    //                     let data = localStorage.getItem('grapesjs_copy');
    //
    //                     if (!data) {
    //                         alerts.alert(translations.CLIPBOARD_IS_EMPTY, 'error');
    //                         return;
    //                     }
    //
    //                     let isConfirm = confirm(translations.BLOCKEDITOR_PASTE_CONFIRM);
    //
    //                     if (data && isConfirm) {
    //                         data = JSON.parse(data);
    //                         editor1.loadData(data);
    //                     }
    //                 },
    //                 attributes: {title: translations.BLOCKEDITOR_CLIPBOARD_PASTE}
    //             },
    //             ]);
    //
    //             editor.Panels.addButton('options', [{
    //                 id: 'file-manager',
    //                 className: 'fas fa-folder-open',
    //                 command: function (editor1, sender) {
    //                     let iframe = document.createElement('iframe');
    //                     iframe.setAttribute('width', '100%');
    //                     iframe.setAttribute('height', '500px');
    //                     iframe.setAttribute('id', name + '_filemanager');
    //                     iframe.setAttribute('class', '_blockeditor_filemanager');
    //                     iframe.setAttribute('src', basePath + '/jolanda/front/filemanager/dialog.php?type=0&lang=cs&akey=KxrAjXPO5DihmPY7aUtqwBCed8OcvfYw&basePath=' + basePath);
    //
    //                     let dialog = new Dialog();
    //                     dialog.show();
    //                     $('#dialog_'+dialog._uid).find('.modal-body').append(iframe);
    //                 },
    //             },
    //             ]);
    //
    //             editor.DomComponents.getWrapper().set({droppable: false, selectable: false, hoverable: false});
    //
    //             editor.DomComponents.addType('default', {
    //                 model: {
    //                     defaults: {
    //                         draggable: false, // lze je umistovat dovnitr jinych bloku?
    //                         removable: false, // muze byt odstranen?
    //                         droppable: false, // lze umistit dovnitr jiny blok?
    //                         selectable: false,
    //                         hoverable: false,
    //                     },
    //                 },
    //             });
    //
    //             editor.DomComponents.addType('drop-inside', {
    //                 //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
    //                 isComponent: el => typeof el.classList !== 'undefined' ? Object.values(el.classList).includes('drop-inside') : false,
    //                 model: {
    //                     defaults: {
    //                         draggable: false, // lze je umistovat dovnitr jinych bloku?
    //                         removable: false, // muze byt odstranen?
    //                         droppable: true, // lze umistit dovnitr jiny blok?
    //                         selectable: false,
    //                         hoverable: false,
    //                     },
    //                 },
    //             });
    //             editor.DomComponents.addType('editor-container', {
    //                 //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
    //                 isComponent: el => typeof el.classList !== 'undefined' ? Object.values(el.classList).includes('editor-container') : false,
    //                 model: {
    //                     defaults: {
    //                         draggable: false, // lze je umistovat dovnitr jinych bloku?
    //                         removable: false, // muze byt odstranen?
    //                         droppable: true, // lze umistit dovnitr jiny blok?
    //                         selectable: true,
    //                         hoverable: true,
    //                     },
    //                 },
    //             });
    //
    //             editor.DomComponents.addType('not-editable', {
    //                 //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
    //                 isComponent: el => typeof el.classList !== 'undefined' ? Object.values(el.classList).includes('not-editable') : false,
    //                 model: {
    //                     defaults: {
    //                         draggable: false, // lze je umistovat dovnitr jinych bloku?
    //                         removable: false, // muze byt odstranen?
    //                         droppable: false, // lze umistit dovnitr jiny blok?
    //                         selectable: false,
    //                         hoverable: false,
    //                     },
    //                 },
    //             });
    //
    //
    //             editor.on('run:core:open-layers', () => editor.Layers.setRoot('.editor-container'));
    //
    //             editor.on('asset:custom', props => {
    //                 $('._blockeditor_filemanager').each((i,e) => {
    //                     e.remove();
    //                 });
    //                 props.assets = [];
    //                 // The `props` will contain all the information you need in order to update your UI.
    //                 // props.open (boolean) - Indicates if the Asset Manager is open
    //                 // props.assets (Array<Asset>) - Array of all assets
    //                 // props.types (Array<String>) - Array of asset types requested, eg. ['image'],
    //                 // props.close (Function) - A callback to close the Asset Manager
    //                 // props.remove (Function<Asset>) - A callback to remove an asset
    //                 // props.select (Function<Asset, boolean>) - A callback to select an asset
    //                 // props.container (HTMLElement) - The element where you should append your UI
    //
    //                 // Here you would put the logic to render/update your UI.
    //                 if (props.open) {
    //                     let iframe = document.createElement('iframe');
    //                     iframe.setAttribute('width', '100%');
    //                     iframe.setAttribute('height', '500px');
    //                     iframe.setAttribute('id', name + '_filemanager');
    //                     iframe.setAttribute('class', '_blockeditor_filemanager');
    //                     iframe.setAttribute('src', basePath + '/jolanda/front/filemanager/dialog.php?type=1&lang=cs&akey=KxrAjXPO5DihmPY7aUtqwBCed8OcvfYw&basePath=' + basePath);
    //                     iframe.onload = function () {
    //                         iframe.contentWindow.apply_any = (e) => {
    //                             let asset = props.am.add(e);
    //                             props.select(asset);
    //                             props.close();
    //                         };
    //                     };
    //                     if(!$('#'+name+'_filemanager')[0])
    //                         $(props.container).append(iframe);
    //                 }
    //
    //             });
    //
    //             // pridani inline stylu pro link a zmenu barvy
    //             const rte = editor.RichTextEditor;
    //             rte.add('link', {
    //                 icon: '<i class="fa fa-chain"></i>',
    //                 attributes: {title: 'Link'},
    //                 // Example on it's easy to wrap a selected content
    //                 result: rte => rte.insertHTML(`<a href="#">${rte.selection()}</a>`)
    //             });
    //             rte.add('text-color', {
    //                 icon: `<select class="gjs-field">
    //                     <option>Bez barvy</option>
    //                     <option value="text-primary">Primární</option>
    //                     <option value="text-success">Pozitivní</option>
    //                     <option value="text-danger">Negativní</option>
    //                     <option value="text-warning">Varování</option>
    //                   </select>`,
    //                 // Bind the 'result' on 'change' listener
    //                 event: 'change',
    //                 result: (rte, action) => {
    //                     var value = action.btn.firstChild.value;
    //                     if (value != 'Bez barvy') { // value is a string
    //                         rte.insertHTML(`<span class="${value}">${rte.selection()}</span>`)
    //                     }else{
    //                         rte.insertHTML(`${rte.selection()}`)
    //                     }
    //                 },
    //             });
    //         }
    //     }
    // });
  }], [{
    key: "getModifiedGrapesHTML",
    value: function getModifiedGrapesHTML(html) {
      html = html.replace(/\<\/div\>\<div\>\<br\/\>\<\/div\>\<div( alignment\=\"text\-left\")?[a-zA-Z0-9"= ]*\>/g, '<br/><br/>');
      return html.replace(/\<\/div\>\<div\>\<br\/\>\<\/div\>/g, '<br/><br/></div>');
    }
  }]);
}();
//# sourceMappingURL=Plugins.js.map

if (!window.jolandaConfig.alerts.vueAlerts) {
  var alerts = new Alerts();
}
var plugins = new Plugins();
var formatters = new Formatters();
var menu = new Menu();
var layout = new Layout();
//# sourceMappingURL=application.js.map
