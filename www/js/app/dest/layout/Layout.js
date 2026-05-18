function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Layout = /*#__PURE__*/function () {
  // static UTM_COOKIE = 'filokalistaUtm';
  // static REFERER_COOKIE = 'filokalistaReferer';
  function Layout() {
    var _this = this;
    _classCallCheck(this, Layout);
    $(function () {
      _this.bindEvents();
      if (page.controller === 'index' && page.action === 'index') _this.initSlider();
    });

    //new Newsletter();
  }
  return _createClass(Layout, [{
    key: "bindEvents",
    value: function () {
      var _bindEvents = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _this2 = this;
        var me, mobileBreakpoint, isMobile;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              isMobile = function _isMobile() {
                return $(window).width() < mobileBreakpoint;
              };
              me = this;
              $(window).scroll(function () {
                me.sticker();
              });
              me.menuSticker();
              $("#currency-menu .dropdown-item").click(function () {
                me.setCookie("currencyMark", $(this).data("currencyMark"), 30);
                me.setCookie("currencyName", $(this).data("currencyName"), 30);
                location.reload();
              });
              CartHeader.quantityChangeListener();
              $(".quantity-change").click(function (e) {
                var quantity = $(e.currentTarget).siblings('.quantity').val();
                if ($(e.currentTarget).hasClass('down') && quantity != 1) $(e.currentTarget).siblings('.quantity').val(quantity - 1);
                if ($(e.currentTarget).hasClass('up')) {
                  $(e.currentTarget).siblings('.quantity').val(quantity - -1);
                }
                $(e.currentTarget).siblings('.quantity').trigger('change');
              });
              this.toggleLeftSide();
              this.processUtmParams(window.location.href);
              this.processReferer();
              $('.back-to-top').click(function (e) {
                e.preventDefault();
                _this2.backToTop();
              });
              $('.mobile-search').click(function (e) {
                _this2.toggleSearch();
              });

              // $('.mobile-menu').click((e) => {
              //     this.toggleMenu();
              // });

              $('.filter .heading').click(function (e) {
                _this2.toggleFilter();
              });
              $('#menuToggle').click(function (e) {
                $('#header').toggleClass('white-menu');
                $('.mobile-menu').toggleClass('open');
              });
              $('#menu1 a').click(function () {
                $('#menuToggle input').prop('checked', false);
                $('#header').removeClass('white-menu');
                $('.mobile-menu').removeClass('open');
              });
              $('#toggle-menu').click(function (e) {
                _this2.toggleMenu();
                if ($(window).width() < 992) {}
              });
              $('#toggleMenu').click(function (e) {
                // this.toggleMenu();
                console.log(sss);
              });

              // $('#menu1 li').click((e) => {
              //     this.toggleMenu();
              // });
              if (!(location.hash === '#prihlaseni')) {
                _context.n = 1;
                break;
              }
              _context.n = 1;
              return layout.openLoginDialog();
            case 1:
              // mobile menu section
              mobileBreakpoint = 992;
              $('.category-wrapper .item img').on('click', function (e) {
                if (isMobile()) {
                  e.preventDefault();
                  e.stopPropagation();
                  var categoryWrapper = $(this).closest('.category-wrapper');
                  var itemLink = $(this).closest('.item');
                  var categoryId = itemLink.data('category-id');
                  $('.category-wrapper .item').not(itemLink).removeClass('open');
                  itemLink.toggleClass('open');
                  $('.subcategory-preview').not('[data-category-id="' + categoryId + '"]').removeClass('active');
                  var targetSubcategory = $('.subcategory-preview[data-category-id="' + categoryId + '"]');
                  targetSubcategory.toggleClass('active');
                }
              });
              $('.subcategory-item .subcategory-name a img').on('click', function (e) {
                if (isMobile()) {
                  e.preventDefault();
                  e.stopPropagation();
                  var subcategoryItem = $(this).closest('.subcategory-item');
                  var subcategoryId = subcategoryItem.data('subcategory-id');
                  $('.subcategory-item').not(subcategoryItem).removeClass('open');
                  subcategoryItem.toggleClass('open');
                }
              });
              $(window).resize(function () {
                if (!isMobile()) {
                  $('.category-wrapper .item').removeClass('open');
                  $('.subcategory-preview').removeClass('active');
                  $('.subcategory-item').removeClass('open');
                }
              });
              // end mobile menu section

              $('.category-menu .headline').click(function (e) {
                _this2.toggleHeaderCategoryMenu();
              });
              $('.product-catalogue .link-holder').click(function (e) {
                _this2.toggleProductCatalogue();
              });
              $('.header-main-menu-container .menu-item').each(function (e) {
                /*
                    let $this = $(this);
                    if ( $this.data('sub-loaded') == 0 ) {
                        $this.data('sub-loaded', 1);
                         this.running = $.ajax(projectVars.basePath + '/default/index/get-main-menu-sub-category', {
                            data: {
                                Category_ID: $this.data('category-id')
                            },
                            method: 'GET',
                            success: (data) => {
                                $this.append(data);
                                if ($(window).outerWidth() <= 768) {
                                    me.mobileMenuInit();
                                    me.mobileMenuSubMenuInit();
                                }
                                $(window).resize(function(){
                                    if ($(window).outerWidth() <= 768) {
                                        me.mobileMenuInit();
                                        me.mobileMenuSubMenuInit();
                                    }
                                });
                            }
                        });
                    }
                  */
              });

              // if ($(window).outerWidth() < 768) {
              //     me.mobileMenuInit();
              // }
              //
              // $(window).resize(function(){
              //     if ($(window).outerWidth() < 768) {
              //         me.mobileMenuSubMenuInit();
              //     }
              // });

              if ($('#announcement[data-announcement]').length) {
                $('#announcement .close').unbind().bind('click', function (e) {
                  _this2.setAnnouncementRead($(e.currentTarget).parents('#announcement').data('announcement'));
                  $(e.currentTarget).parents('#announcement').stop().fadeOut(300, function () {
                    //$(this).remove();
                  });
                });
              }
              $(function () {
                /*
                let el = document.querySelector(".instagram-posts");
                let x = 0, y = 0, top = 0, left = 0;
                 let draggingFunction = (e) => {
                    document.addEventListener('mouseup', () => {
                        document.removeEventListener("mousemove", draggingFunction);
                    });
                     el.scrollLeft = left - e.pageX + x;
                    el.scrollTop = top - e.pageY + y;
                };
                 el.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                     y = e.pageY;
                    x = e.pageX;
                    top = el.scrollTop;
                    left = el.scrollLeft;
                     document.addEventListener('mousemove', draggingFunction);
                });*/
              });
            case 2:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function bindEvents() {
        return _bindEvents.apply(this, arguments);
      }
      return bindEvents;
    }()
  }, {
    key: "backToTop",
    value: function backToTop() {
      $('html, body').animate({
        scrollTop: 0
      }, 350);
    }
  }, {
    key: "toggleSearch",
    value: function toggleSearch() {
      $('.search-block').toggle('slow');
    }

    // toggleMenu() {
    //     $('.header-main-menu-container').toggle();
    //     $('.header-main-container').toggleClass('open');
    // }

    // toggleMenu() {
    //     console.log('toggle menu .. tady by se na mobilu melo otevřít menu');
    //     $('#header .menu-container').toggle('medium');
    //     // $('.mobile-menu').toggleClass('active');
    //     $('#toggle-menu.mobile-menu').toggleClass('active');
    // }

    // toggleMenu() {
    //     $('.header-main-menu-container').toggle('medium');
    //     $('.mobile-menu').toggleClass('active');
    //     $('#toggleMenu').toggleClass('active');
    // }
  }, {
    key: "toggleHeaderCategoryMenu",
    value: function toggleHeaderCategoryMenu() {
      $('#header .category-menu').toggleClass('active');
      this.toggleLeftSide();
    }
  }, {
    key: "toggleLeftSide",
    value: function toggleLeftSide() {
      if ($(window).width() > 991) {
        $('#content .left-side').css('padding-top', $('#header .category-menu').height() - 20 + 'px');
      }
    }
  }, {
    key: "toggleFilter",
    value: function toggleFilter() {
      $('.filter .block').toggle('medium');
    }
  }, {
    key: "toggleProductCatalogue",
    value: function toggleProductCatalogue() {
      $('.product-catalogue .categories').toggle();
    }
  }, {
    key: "cookiePopup",
    value: function cookiePopup() {
      var cookie_popup = Cookie.getCookie('cookie-popup');
      if (cookie_popup === undefined || !cookie_popup) {
        $('#cookieBar').css('display', 'flex');
      }
      $('#cookieBar button').click(function () {
        Cookie.setCookie('cookie-popup', true, 900);
        $('#cookieBar').hide();
      });
    }
  }, {
    key: "doScroll",
    value: function doScroll(targetNode) {
      var target = $(targetNode);
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  }, {
    key: "initSlider",
    value: function initSlider() {
      $("#slider").responsiveSlides({
        auto: true,
        pager: false,
        nav: false,
        speed: 800,
        namespace: "centered-btns",
        manualControls: '.slider-pager'
      });
    }
  }, {
    key: "setAnnouncementRead",
    value: function setAnnouncementRead(Hash) {
      var announcements = Cookie.getCookie('announcement');
      if (announcements.length) announcements = JSON.parse(announcements);else announcements = [];
      announcements.push(Hash);
      Cookie.setCookie('announcement', JSON.stringify(announcements), '10');
    }
  }, {
    key: "processUtmParams",
    value: function processUtmParams(href) {
      var isVisitorFromExternalCampaign;
      var isCookieExists;
      if (!Layout.checkCookieName(Layout.UTM_COOKIE)) {
        isCookieExists = false;
        isVisitorFromExternalCampaign = !!href.match(/(?:utm_source|utm_medium|utm_name|utm_content)/i);
      } else {
        isCookieExists = true;
        isVisitorFromExternalCampaign = true;
      }
      if (!isCookieExists && isVisitorFromExternalCampaign) {
        var utmParams = this.prepareUtmParams(href);
        this.setCookie(Layout.UTM_COOKIE, utmParams, 1);
      }
    }
  }, {
    key: "processReferer",
    value: function processReferer() {
      var isCookieExists = Layout.checkCookieName(Layout.REFERER_COOKIE);
      var referer = document.referrer;
      if (!isCookieExists && referer) {
        var refererValue = this.prepareRefererValue(referer);
        if (refererValue !== 'vamot') this.setCookie(Layout.REFERER_COOKIE, refererValue, 1);
      }
    }
  }, {
    key: "setCookie",
    value: function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
  }, {
    key: "sticker",
    value: function sticker() {
      var header = $('#header');
      var headerHeight = header.height();
      var content = $('#content');
      var winScroll = $(window).scrollTop();
      header.toggleClass('fixed', 0 - winScroll <= 0);
      //content.css('padding-top', headerHeight + 20);
      /*
      if(0 - winScroll <= 0) {
          content.css('padding-top', headerHeight + 20);
      } else {
          content.css('padding-top', 0);
      }*/
    }
  }, {
    key: "prepareUtmParams",
    value: function prepareUtmParams(href) {
      var params = href.split('?');
      var paramValues = params[1].split('&');
      var finalParamsString = [];
      var _iterator = _createForOfIteratorHelper(paramValues),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var paramValue = _step.value;
          var data = paramValue.split('=');
          if (data[0].match(/(utm_source|utm_medium|utm_name|utm_content)/i)) finalParamsString.push("".concat(data[0], "=").concat(data[1]));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return finalParamsString.join('&');
    }
  }, {
    key: "prepareRefererValue",
    value: function prepareRefererValue(referer) {
      var dataWithoutSubdomain = referer.replace('www.', '').replace('search.', '');
      var dataWithoutProtocol = dataWithoutSubdomain.split('://')[1];
      return dataWithoutProtocol.split('.')[0];
    }
  }, {
    key: "mobileMenuInit",
    value: function mobileMenuInit() {
      $('.menu-item[data-category-id] > a').click(function (e) {
        e.preventDefault();
        $(this).parent('[data-category-id]').children('.sub-menu').addClass('show');
      });
    }
  }, {
    key: "mobileMenuSubMenuInit",
    value: function mobileMenuSubMenuInit() {
      $('.menu-item[data-category-id] .sub-menu .back-item').each(function (e) {
        $(this).click(function (e) {
          e.preventDefault();
          $(this).closest('.sub-menu').removeClass('show');
        });
      });
    }
  }, {
    key: "openLoginDialog",
    value: function () {
      var _openLoginDialog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (this.dialog) {
                this.dialog.close();
              }
              this.dialog = new Dialog();
              this.dialog._modalClass = 'login';
              _context2.n = 1;
              return this.dialog.openFromUrl(projectVars.basePath + '/modal/login');
            case 1:
              new LoginForm();
            case 2:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function openLoginDialog() {
        return _openLoginDialog.apply(this, arguments);
      }
      return openLoginDialog;
    }()
  }, {
    key: "menuSticker",
    value: function menuSticker() {
      var threshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
      var me = this;
      $('.category-wrapper').hover(function () {
        if (window.scrollY >= threshold) {
          var subcategoryPreview = $(this).find('.subcategory-preview');
          var rightOffset = me.rightSpaceCalculationForFixedMenu('.container');
          subcategoryPreview.addClass('fixed');
          if (rightOffset > 0) {
            subcategoryPreview.css('right', rightOffset);
          } else {
            var leftOffset = me.leftSpaceCalculationForFixedMenu('.container');
            subcategoryPreview.css('left', leftOffset);
          }
        } else {
          $(this).find('.subcategory-preview').removeClass('fixed');
          $(this).find('.subcategory-preview').css({
            'right': '',
            'left': ''
          });
        }
      });
    }
  }, {
    key: "openRegistrationInfoDialog",
    value: function () {
      var _openRegistrationInfoDialog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(title, content) {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              console.log('openRegistrationInfoDialog', title, content);
              if (this.dialog) {
                this.dialog.close();
              }
              this.dialog = new Dialog();
              this.dialog.modalClass = 'registration-info';
              this.dialog._title = title;
              _context3.n = 1;
              return this.dialog.openFromUrl(projectVars.basePath + '/customer/registration-info', {
                content: content
              });
            case 1:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function openRegistrationInfoDialog(_x, _x2) {
        return _openRegistrationInfoDialog.apply(this, arguments);
      }
      return openRegistrationInfoDialog;
    }()
  }, {
    key: "rightSpaceCalculationForFixedMenu",
    value: function rightSpaceCalculationForFixedMenu(selector) {
      var content = document.querySelector(selector);
      if (content) {
        var rect = content.getBoundingClientRect();
        var spaceRight = window.innerWidth - rect.right;
        if (spaceRight < 100) {
          return 0;
        }
        return spaceRight + 'px';
      }
    }
  }, {
    key: "leftSpaceCalculationForFixedMenu",
    value: function leftSpaceCalculationForFixedMenu(selector) {
      var content = document.querySelector(selector);
      if (content) {
        var rect = content.getBoundingClientRect();
        var spaceLeft = rect.left;
        var categoryMenuWidth = $('.category-menu.active').width();
        return spaceLeft + categoryMenuWidth + 'px';
      }
    }
  }], [{
    key: "checkCookieName",
    value: function checkCookieName(name) {
      var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) {
        return match[2];
      } else {
        return false;
      }
    }
  }, {
    key: "deleteCookie",
    value: function deleteCookie(cname) {
      document.cookie = cname + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }]);
}();
//# sourceMappingURL=Layout.js.map
