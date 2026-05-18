function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cart = /*#__PURE__*/function () {
  function Cart() {
    _classCallCheck(this, Cart);

    this.$cart = $('#cartIcon');
    this.$badge = this.$cart.find('.badge');
    this.$items = this.$cart.parents('.cartContainer').find('.items');
    this.init();
  }

  _createClass(Cart, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.$cart.parents('.cartContainer').mouseenter(function (e) {
        if (_this.$items.find('.row').length > 0) {
          _this.$cart.attr('style', '');

          _this.$cart.parents('.cartContainer').find('.content').stop().slideDown(100);
        }
      }).mouseleave(function (e) {
        _this.$cart.parents('.cartContainer').find('.content').slideUp(100);
      });
      this.getItems();
    }
  }, {
    key: "refreshCart",
    value: function refreshCart() {
      var _this2 = this;

      var flash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      $.ajax({
        url: basePath + '/default/cart/get-count',
        success: function success(data) {
          if (flash) {
            _this2.flashCart();
          }

          if (data > 0) {
            _this2.$badge.text(data);

            _this2.$badge.removeClass('empty');
          } else {
            _this2.$badge.text(0);

            _this2.$badge.addClass('empty');
          }
        }
      });
      this.getItems();
    }
  }, {
    key: "flashCart",
    value: function flashCart() {
      var _this3 = this;

      this.$badge.addClass('blink');
      setTimeout(function () {
        _this3.$badge.removeClass('blink');
      }, 500);
    }
  }, {
    key: "getItems",
    value: function getItems() {
      var _this4 = this;

      $.ajax({
        url: basePath + '/default/cart/get-items',
        success: function success(data) {
          _this4.$items.html('');

          if (!data.startsWith("[") && !data.startsWith('{')) {
            return;
          }

          var new_data = JSON.parse(data);
          var total = 0;
          var currency = '€';

          for (var i = 0; i < new_data.length; i++) {
            var html = "<div class=\"row\">\n                    <div class=\"col thumb\">";

            if (new_data[i].Image != null) {
              html += '<img src="' + basePath + '/files/images/remante/800/' + new_data[i].Image + '">';
            } else {
              html += '<img src="' + basePath + '/core/img/cdb-icons/package.svg">';
            }

            html += "</div>\n                    <div class=\"col product\">\n                    <a href=\"".concat(basePath, "/default/product/index?search=").concat(new_data[i].Product_ID, "\">").concat(new_data[i].Product, "</a>\n                    </div>\n                    <div class=\"col-4 info\">\n                        <span class=\"quantity\">").concat(new_data[i].Quantity, "x</span>\n                        <span class=\"price\">").concat(Helpers.formatPrice(new_data[i].Quantity * new_data[i].Price), " ").concat(new_data[i].Currency, "</span>\n                    </div>\n                    </div>");
            total += new_data[i].Quantity * new_data[i].Price;
            currency = new_data[i].Currency;

            _this4.$items.append(html);
          }

          _this4.$cart.parents('.cartContainer').find('.total span').text(Helpers.formatPrice(total) + " ".concat(currency));
        }
      });
    }
  }]);

  return Cart;
}();
//# sourceMappingURL=Cart.js.map

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CDB = /*#__PURE__*/function () {
  function CDB(request) {
    _classCallCheck(this, CDB);

    this.layout = new CDBLayout();
    this.cart = new Cart();
    this.modules = {};
    this.dispatch();
  }

  _createClass(CDB, [{
    key: "dispatch",
    value: function dispatch() {
      if (request.module === 'default') {
        if (request.controller === 'homepage' && request.action === 'index') {
          this.modules['homepage'] = new Homepage();
        }

        if (request.controller !== 'login') {
          this.modules['videohelp'] = new Videohelp();
        }
      }
    }
  }]);

  return CDB;
}();
//# sourceMappingURL=CDB.js.map

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

/* MAIN CLASS */
var Homepage = /*#__PURE__*/function () {
  function Homepage() {
    _classCallCheck(this, Homepage);

    _defineProperty(this, "$nav", void 0);

    _defineProperty(this, "$content", void 0);

    _defineProperty(this, "titles", void 0);

    _defineProperty(this, "showMore", void 0);

    _defineProperty(this, "salesSlider", void 0);

    _defineProperty(this, "navigation", void 0);

    _defineProperty(this, "topProducts", void 0);

    _newsInterval.set(this, {
      writable: true,
      value: void 0
    });

    _interval.set(this, {
      writable: true,
      value: void 0
    });

    this.$nav = $('#navigation .wrapper');
    this.$content = $('#homepage .main-content>.row>div');
    this.titles = {
      'ordersChart': 'Můj marketing',
      'categories': 'Categories',
      'products': 'TOP Sellers',
      'distributor': 'Your specialist',
      'sales': 'Actual sales',
      'search': 'Search'
    };
    this.showMore = ['documents', 'orders', 'latest-search'];
    this.salesSlider = null;
    this.navigation = null;
    this.topProducts = null;

    _classPrivateFieldSet(this, _interval, 10000);
  }

  _createClass(Homepage, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.buildMenu();
      this.salesSlider = new SalesSlider();
      this.navigation = new Navigation();
      this.topProducts = new TopProducts();
      this.search = new Search();
      this.graphs = new GraphChange();
      this.handleNews();
      this.showMore.forEach(function (i) {
        _this.handleMore(i);
      });
      $('#contact .person .person-card').mousedown(function (e) {
        e.preventDefault();
        $(e.target).parents('.people').find('.person .content').slideUp(300);
        $(e.target).parents('.person').find('.content').stop().slideDown(300);
      });
      $('#contact .person .content .close').click(function (e) {
        $(e.target).parents('.content').stop().slideUp(300);
      });
      $('.counter').each(function () {
        $(this).prop('Counter', 0).animate({
          Counter: $(this).text()
        }, {
          duration: 4000,
          easing: 'swing',
          step: function step(now) {
            $(this).text(Helpers.numberFormat(Math.ceil(now), 0, ',', ' '));
          }
        });
      });

      _classPrivateFieldSet(this, _newsInterval, setInterval(function () {
        _this.handleNews();
      }, _classPrivateFieldGet(this, _interval)));

      $('#otherInfo .news').mouseenter(function () {
        clearInterval(_classPrivateFieldGet(_this, _newsInterval));
      }).mouseleave(function () {
        _classPrivateFieldSet(_this, _newsInterval, setInterval(function () {
          _this.handleNews();
        }, _classPrivateFieldGet(_this, _interval)));
      });
    }
  }, {
    key: "buildMenu",
    value: function buildMenu() {
      var _this2 = this;

      var exclude = ['search', 'facts', 'gallery'];

      if (this.$nav.length > 0 && this.$content.length > 0) {
        this.$nav.html('');
        this.$content.each(function (i) {
          if ($(_this2.$content.get(i)).attr('id').length > 0) {
            if (exclude.includes($(_this2.$content.get(i)).attr('id')) == false) {
              var danger = $(_this2.$content.get(i)).data('danger') == true ? '<i class="ci ci-warning text-danger mr-2"></i>' : '';

              _this2.$nav.append('<li><a href="#" data-id="' + $(_this2.$content.get(i)).attr('id') + '">' + danger + (_this2.titles[$(_this2.$content.get(i)).attr('id')] ? _this2.titles[$(_this2.$content.get(i)).attr('id')] : $(_this2.$content.get(i)).find('.title').text() + $(_this2.$content.get(i)).find('.panel>.heading').text()) + ($(_this2.$content.get(i)).data('icon') ? '<i class="' + $(_this2.$content.get(i)).data('icon') + '"></i>' : '<i class="far fa-circle" style="font-size: 10px;width:16px;text-align:right;"></i>') + '</a></li>');
            } else if ($(_this2.$content.get(i)).attr('id') == 'search') {
              _this2.$nav.append('<li><a href="#" class="search" data-id="search">' + (_this2.titles[$(_this2.$content.get(i)).attr('id')] ? _this2.titles[$(_this2.$content.get(i)).attr('id')] : 'Search') + '<i class="ci ci-search"></i></a>');
            }
          }
        });
      }
    }
  }, {
    key: "handleMore",
    value: function handleMore(id) {
      $('#' + id + ' .more').click(function (e) {
        e.preventDefault();
        $(e.target).parents('#' + id).toggleClass('opened');
      });
    }
  }, {
    key: "handleNews",
    value: function handleNews() {
      var prev = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var $news = $('#otherInfo .news .articles .article');
      var $active = $('#otherInfo .news .article-active');
      var $current = $('#otherInfo .news .control .current');
      var max_height = 0;
      $news.each(function (el) {
        $(this).parent().show();
        var height = $(this).outerHeight() + 5;
        $(this).parent().hide();

        if (height > max_height) {
          max_height = height;
        }
      });
      $active.css('min-height', max_height);

      if ($active.data('index') == undefined) {
        $active.html($news.first().html());
        $active.data('index', $news.first().data('index'));
        $current.text($active.data('index') + 1);
        return;
      } else {
        $news.each(function () {
          if ($(this).data('index') == $active.data('index')) {
            var next;

            if (prev) {
              next = $(this).prev('.article');
            } else {
              next = $(this).next('.article');
            }

            if ($(next).length == 0) {
              if (prev) {
                next = $news.last();
              } else {
                next = $news.first();
              }
            }

            $active.html(next.html());
            $active.data('index', next.data('index'));
            $current.text($active.data('index') + 1);
            return false;
          }
        });
      }
    }
  }]);

  return Homepage;
}();
/* SLIDER FOR ACTUAL SALES */


var _newsInterval = new WeakMap();

var _interval = new WeakMap();

var SalesSlider = /*#__PURE__*/function () {
  function SalesSlider() {
    var slidetime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;

    _classCallCheck(this, SalesSlider);

    _defineProperty(this, "slide", void 0);

    _defineProperty(this, "isSliding", void 0);

    _defineProperty(this, "slideout", void 0);

    _defineProperty(this, "slideprev", void 0);

    _defineProperty(this, "time", void 0);

    _defineProperty(this, "items", void 0);

    _defineProperty(this, "slidetime", void 0);

    this.slide = null;
    this.isSliding = false;
    this.slideout = false;
    this.slideprev = false;
    this.time = 0;
    this.items = 0;
    this.slidetime = slidetime;
    this.getItemsCount();
    this.init();
  }

  _createClass(SalesSlider, [{
    key: "getItemsCount",
    value: function getItemsCount() {
      this.items = $('#sales').find('.product').length;
      return this.items;
    }
  }, {
    key: "init",
    value: function init() {
      var _this3 = this;

      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10000;
      this.time = time;

      if (this.items > 0) {
        // var random = Math.floor((Math.random() * this.items));
        // $('#sales').find('.product').eq(random).addClass('active');
        $('#sales').find('.product').eq(0).addClass('active');
      }

      if (this.items > 1) {
        $('#sales .control').css('display', 'flex');
        this.slideAuto();
      }

      $('#sales .control').find('.next, .prev').click(function (e) {
        _this3.handleSwitch(e);
      });
      $('#sales .products').mouseenter(function () {
        _this3.handleMouseEnter();
      }).mouseleave(function () {
        _this3.handleMouseLeave();
      });
      return this;
    }
  }, {
    key: "handleSwitch",
    value: function handleSwitch(e) {
      e.preventDefault();

      if (this.isSliding == true) {
        clearTimeout(this.slide);
        this.slideAuto();
      }

      if ($(e.target).is('.prev')) {
        this.slideNext(true);
      } else {
        this.slideNext();
      }

      return;
    }
  }, {
    key: "handleMouseEnter",
    value: function handleMouseEnter() {
      if (this.isSliding) {
        clearTimeout(this.slide);
      }

      return;
    }
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave() {
      if (this.isSliding) {
        this.slideAuto();
      }

      return;
    }
  }, {
    key: "slideAuto",
    value: function slideAuto() {
      var _this4 = this;

      if (this.time > 0) {
        this.isSliding = true;
        this.slide = setTimeout(function () {
          _this4.slideNext();

          _this4.slideAuto();
        }, this.time);
      } else {
        this.isSliding = false;
        clearTimeout(this.slide);
      }

      return;
    }
  }, {
    key: "slideNext",
    value: function slideNext() {
      var _this5 = this;

      var prev = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (this.slideout == true || this.slideprev == true) {
        return;
      }

      var active = $('#sales .products .product.active');
      var next = active.next();

      if (prev === true) {
        next = active.prev();

        if (next.length == 0) {
          next = $('#sales .products .product').last();
        }
      } else {
        if (next.length == 0) {
          next = $('#sales .products .product').first();
        }
      }

      active.addClass('slideout');

      if (prev) {
        active.addClass('prev');
        next.addClass('prev');
      }

      active.removeClass('active');
      this.slideout = true;
      setTimeout(function () {
        _this5.slideout = false;
        active.removeClass('slideout');
        active.removeClass('prev');
        next.addClass('active');

        if (prev) {
          next.addClass('prev');
          _this5.slideprev = true;
          setTimeout(function () {
            _this5.slideprev = false;
            next.removeClass('prev');
          }, _this5.slidetime);
        }
      }, this.slidetime);
      return;
    }
  }]);

  return SalesSlider;
}();
/* NAVIGATION ANIMATION */


var Navigation = /*#__PURE__*/function () {
  function Navigation() {
    _classCallCheck(this, Navigation);

    this.init();
  }

  _createClass(Navigation, [{
    key: "init",
    value: function init() {
      var _this6 = this;

      $(window).scroll(function (e) {
        _this6.setItem();
      });
    }
  }, {
    key: "setItem",
    value: function setItem() {
      var scrollTop = $(window).scrollTop() + $(window).height() / 2;
      var items = [];
      $('.main-content>.row>div').each(function (i) {
        var offset = $(this).offset().top - 12;
        var offset_bottom = offset + $(this).height() + 12;

        if (offset <= scrollTop && offset_bottom >= scrollTop) {
          items.push($('#navigation li a[data-id="' + $(this).attr('id') + '"]'));
        }
      });
      $('#navigation li a').removeClass('active');

      for (var i = 0; i < items.length; i++) {
        Object.values(items)[i].addClass('active');
      }
    }
  }]);

  return Navigation;
}();
/* TOP PRODUCTS */


var TopProducts = /*#__PURE__*/function () {
  function TopProducts() {
    var productsId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'products';
    var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;

    _classCallCheck(this, TopProducts);

    _timer.set(this, {
      writable: true,
      value: void 0
    });

    _defineProperty(this, "$products", void 0);

    _defineProperty(this, "productsId", void 0);

    _interval2.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _timer, null);

    this.productsId = productsId;
    this.$products = $('#' + this.productsId + ' .products');

    _classPrivateFieldSet(this, _interval2, interval);

    this.init();
  }

  _createClass(TopProducts, [{
    key: "init",
    value: function init() {
      if (!$('#' + this.productsId + ' .category').is('.active')) {
        $('#' + this.productsId + ' .category').first().addClass('active');
        this.getData($('#' + this.productsId + ' .type.active').data('id'), $('#' + this.productsId + ' .category.active').data('id'));
      }

      this.categoryHandle();
      this.typeHandle();
    }
  }, {
    key: "categoryHandle",
    value: function categoryHandle() {
      var _this7 = this;

      $('#' + this.productsId + ' .category').click(function (e) {
        e.preventDefault();

        if ($('#' + _this7.productsId + '').hasClass('disabled')) {
          return;
        }

        var active_type = $('#' + _this7.productsId + ' .type.active').data('id');
        $('#' + _this7.productsId + ' .category').removeClass('active');
        $(e.target).parents('.category').addClass('active');

        _this7.getData(active_type, $(e.target).parents('.category').data('id'));
      });
    }
  }, {
    key: "typeHandle",
    value: function typeHandle() {
      var _this8 = this;

      $('#' + this.productsId + ' .type').click(function (e) {
        e.preventDefault();
        var $type = $(e.target).parent();

        if ($('#' + _this8.productsId + '').hasClass('disabled')) {
          return;
        }

        var active_cat = $('#' + _this8.productsId + ' .category.active').data('id');
        $('#' + _this8.productsId + ' .type').removeClass('active');

        if ($(e.target).is('a')) {
          $type.addClass('active');
        } else if ($(e.target).is('.right')) {
          $type.next().addClass('active');
        } else if ($(e.target).is('.left')) {
          $type.prev().addClass('active');
        }

        _this8.getData($('#' + _this8.productsId + ' .type.active').data('id'), active_cat);
      });
    }
  }, {
    key: "getData",
    value: function getData(type, category) {
      var _this9 = this;

      var now = Date.now();
      var dt = 0;
      this.$products.addClass('slideout');
      this.$products.removeClass('active');
      $('#products').addClass('disabled');
      this.timer = setTimeout(function () {
        $.get(basePath + '/default/homepage/get-products', {
          type: type,
          category: category
        }).done(function (data) {
          try {
            data = JSON.parse(data);
            dt = Date.now() - now;

            _this9.$products.html('');

            Object.keys(data).forEach(function (i) {
              if (i != 'label') {
                _this9.$products.append("<a href=\"".concat(basePath, "/product/index?search=").concat(data[i]['Code'], "\" class=\"product\"> <div class=\"thumb\"> <img src=\"").concat(data[i]['Image'], "\"> <div class=\"overlay\"> <span class=\"ci ci-search\"></span> </div> </div> <p>").concat(data[i]['Name'], "</p> </a>"));
              }
            });
            $('#exportProducts').attr('href', basePath + '/homepage/export-top-products?category=' + data['label']);

            if (_this9.$products.html().length == 0) {
              _this9.$products.append('<p class="text-nothing text-center w-100 font-bold h-100 d-flex align-items-center justify-content-center">' + translations.NO_PRODUCT_IN_CATEGORY + '</p>');
            }
          } catch (ex) {
            return;
          }
        }).always(function () {
          _this9.$products.removeClass('slideout');

          $('#' + _this9.productsId).removeClass('disabled');

          _this9.$products.addClass('active');
        });
      }, dt > 300 ? 0 : _classPrivateFieldGet(this, _interval2));
    }
  }]);

  return TopProducts;
}();
/* AJAX SEARCH */


var _timer = new WeakMap();

var _interval2 = new WeakMap();

var Search = /*#__PURE__*/function () {
  function Search() {
    var result_count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;

    _classCallCheck(this, Search);

    _$search_input.set(this, {
      writable: true,
      value: void 0
    });

    _$search_results.set(this, {
      writable: true,
      value: void 0
    });

    _$result_items.set(this, {
      writable: true,
      value: void 0
    });

    _$result_count.set(this, {
      writable: true,
      value: void 0
    });

    _$link.set(this, {
      writable: true,
      value: void 0
    });

    _defineProperty(this, "cols", void 0);

    _defineProperty(this, "notFound", void 0);

    _defineProperty(this, "loading", void 0);

    _defineProperty(this, "dialogTitle", void 0);

    _classPrivateFieldSet(this, _$search_input, $('#search input'));

    _classPrivateFieldSet(this, _$search_results, $('#search .search-results'));

    _classPrivateFieldSet(this, _$result_items, _classPrivateFieldGet(this, _$search_results).find('.table-items'));

    _classPrivateFieldSet(this, _$result_count, _classPrivateFieldGet(this, _$search_results).find('.show-more .count'));

    _classPrivateFieldSet(this, _$link, _classPrivateFieldGet(this, _$search_results).find('.show-more a'));

    this.cols = 6;
    this.notFound = 'No products found';
    this.loading = 'Loading...';
    this.dialogTitle = 'Product detail';
    this.link = basePath + '/product/index?search=';
    this.handleInput();
  }

  _createClass(Search, [{
    key: "toggleResults",
    value: function toggleResults() {
      var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (show === true) {
        _classPrivateFieldGet(this, _$search_results).stop().slideDown(300);
      } else if (show === false) {
        _classPrivateFieldGet(this, _$search_results).stop().slideUp(300);
      } else {
        _classPrivateFieldGet(this, _$search_results).stop().slideToggle(300);
      }
    }
  }, {
    key: "buildItem",
    value: function buildItem(item) {
      var show = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [true, true, true, true];
      var out = '';
      out += "<tr><td class=\"photo\"><img src=\"".concat(item.Photo, "\"></td>");
      out += "<td>".concat(item.Name, "</td>");

      if (show[0]) {
        out += "<td class=\"stock\"> <span class=\"avai1".concat(item.Availability1 > 0 ? '' : ' empty', "\">").concat(item.Availability1 > 0 ? item.Availability1 : 0, "</span></td>");
      }

      if (show[1]) {
        out += "<td class=\"stock\"> <span class=\"avai2".concat(item.Availability2 > 0 ? '' : ' empty', "\">").concat(item.Availability2 > 0 ? item.Availability2 : 0, "</span></td>");
      }

      if (show[2]) {
        out += "<td class=\"stock\"> <span class=\"avai3".concat(item.Availability3 > 0 ? '' : ' empty', "\">").concat(item.Availability3 > 0 ? item.Availability3 : 0, "</span></td>");
      }

      if (show[3]) {
        out += "<td class=\"stock\">".concat((item.Price / 100).toLocaleString(), " ").concat(item.Label, "</td>");
        out += "<td class=\"stock\">".concat((item.Deposit / 100).toLocaleString(), " ").concat(item.Label, "</td>");
      }

      out += "<td class=\"link\"><a href=\"javascript: cdb.modules.homepage.search.showDetailDialog(".concat(item.ID, ", ").concat(item.Price, ", ").concat(item.Deposit, ");\"><i class=\"ci ci-search\"></i></a></td></tr>");
      return out;
    }
  }, {
    key: "buildNotFound",
    value: function buildNotFound() {
      return "<tr>\n            <td colspan=\"".concat(this.cols, "\" class=\"text-center\"><span class=\"text-muted\">").concat(this.notFound, "</span></td>\n        </tr>");
    }
  }, {
    key: "buildLoading",
    value: function buildLoading() {
      return "<tr>\n            <td colspan=\"".concat(this.cols, "\" class=\"text-center\"><span class=\"text-muted\">").concat(this.loading, "</span></td>\n        </tr>");
    }
  }, {
    key: "processItems",
    value: function processItems(items) {
      var _this10 = this;

      var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var show = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [true, true, true, true];
      var output = '';

      _classPrivateFieldGet(this, _$result_count).text(count);

      items.forEach(function (item) {
        output += _this10.buildItem(item, show);
      });

      if (output.length == 0) {
        output = this.buildNotFound();
      }

      return output;
    }
  }, {
    key: "getItems",
    value: function getItems(SearchString) {
      var _this11 = this;

      var Category = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (SearchString.length == 0 || $(window).width() < 769) {
        return false;
      }

      _classPrivateFieldGet(this, _$result_items).html(this.buildLoading());

      _classPrivateFieldGet(this, _$link).attr('href', this.link + SearchString);

      $.ajax({
        url: basePath + '/homepage/search-products',
        data: {
          SearchString: SearchString,
          Category: Category
        },
        success: function success(data) {
          try {
            data = JSON.parse(data);

            _classPrivateFieldGet(_this11, _$result_items).html(_this11.processItems(data.Items, data.Count, data.Show));
          } catch (e) {
            _classPrivateFieldGet(_this11, _$result_items).html(_this11.processItems([], 0));
          }
        },
        fail: function fail() {
          _classPrivateFieldGet(_this11, _$result_items).html(_this11.processItems([], 0));
        }
      });
    }
  }, {
    key: "searchItems",
    value: function searchItems(SearchString) {
      SearchString = SearchString.toLowerCase();

      if (SearchString.length > 0) {
        this.getItems(SearchString);

        if (_classPrivateFieldGet(this, _$search_results).is(':not(:visible)')) {
          this.toggleResults(true);
        }
      } else {
        this.toggleResults(false);

        _classPrivateFieldGet(this, _$result_items).html('');
      }
    }
  }, {
    key: "showDetailDialog",
    value: function showDetailDialog(ID, Price, Deposit) {
      var dialog = new Dialog();
      dialog.title = this.dialogTitle;
      dialog.showFromUrl(basePath + '/default/product/product-detail', {
        Product_ID: ID,
        deposit: Deposit,
        price: Price
      });
    }
  }, {
    key: "handleInput",
    value: function handleInput() {
      var _this12 = this;

      var timeout = null;

      _classPrivateFieldGet(this, _$search_input).on('keyup paste', function (e) {
        if (e.target.value.length > 3) {
          clearTimeout(timeout);
          timeout = setTimeout(function () {
            _this12.searchItems(e.target.value);
          }, 500);
        } else {
          _this12.searchItems('');
        }
      });
    }
  }, {
    key: "clearInput",
    value: function clearInput() {
      _classPrivateFieldGet(this, _$search_input).val('');

      this.searchItems('');
    }
  }]);

  return Search;
}();

var _$search_input = new WeakMap();

var _$search_results = new WeakMap();

var _$result_items = new WeakMap();

var _$result_count = new WeakMap();

var _$link = new WeakMap();

var GraphChange = /*#__PURE__*/function () {
  function GraphChange() {
    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30000;

    _classCallCheck(this, GraphChange);

    _interval3.set(this, {
      writable: true,
      value: void 0
    });

    _$panel.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _$panel, $('#ordersChart'));

    this.$graphs = _classPrivateFieldGet(this, _$panel).find('.charts');

    _classPrivateFieldSet(this, _interval3, null);

    this.time = time;
    this.init();
  }

  _createClass(GraphChange, [{
    key: "init",
    value: function init() {
      var _this13 = this;

      this.startSliding();

      _classPrivateFieldGet(this, _$panel).mouseenter(function () {
        _this13.stopSliding();
      }).mouseleave(function (e) {
        _this13.startSliding();
      });
    }
  }, {
    key: "startSliding",
    value: function startSliding() {
      var _this14 = this;

      _classPrivateFieldSet(this, _interval3, setInterval(function () {
        _this14.changeGraph();
      }, this.time));
    }
  }, {
    key: "stopSliding",
    value: function stopSliding() {
      clearInterval(_classPrivateFieldGet(this, _interval3));

      _classPrivateFieldSet(this, _interval3, null);
    }
  }, {
    key: "changeGraph",
    value: function changeGraph() {
      var prev = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var active = this.$graphs.find('.active');
      var next_chart = prev === false ? active.next() : active.prev();

      if (next_chart.length === 0) {
        next_chart = prev === false ? this.$graphs.find('.wrapper').first() : this.$graphs.find('.wrapper').last();
      }

      if (next_chart.length === 0) {
        return false;
      }

      next_chart.addClass('active');
      active.removeClass('active');

      _classPrivateFieldGet(this, _$panel).find('.title').text(next_chart.data('title'));
    }
  }]);

  return GraphChange;
}();

var _interval3 = new WeakMap();

var _$panel = new WeakMap();
//# sourceMappingURL=Homepage.js.map

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
              var row = '<a class="row ' + type + '" href="#" onclick="cdb.videohelp.openVideo(' + items[x].VideoID + ');">' + col_thumb + col_name + '</a>';
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cart = /*#__PURE__*/function () {
  function Cart() {
    _classCallCheck(this, Cart);

    this.$cart = $('#cartIcon');
    this.$badge = this.$cart.find('.badge');
    this.$items = this.$cart.parents('.cartContainer').find('.items');
    this.init();
  }

  _createClass(Cart, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.$cart.parents('.cartContainer').mouseenter(function (e) {
        if (_this.$items.find('.row').length > 0) {
          _this.$cart.attr('style', '');

          _this.$cart.parents('.cartContainer').find('.content').stop().slideDown(100);
        }
      }).mouseleave(function (e) {
        _this.$cart.parents('.cartContainer').find('.content').slideUp(100);
      });
      this.getItems();
    }
  }, {
    key: "refreshCart",
    value: function refreshCart() {
      var _this2 = this;

      var flash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      $.ajax({
        url: basePath + '/default/cart/get-count',
        success: function success(data) {
          if (flash) {
            _this2.flashCart();
          }

          if (data > 0) {
            _this2.$badge.text(data);

            _this2.$badge.removeClass('empty');
          } else {
            _this2.$badge.text(0);

            _this2.$badge.addClass('empty');
          }
        }
      });
      this.getItems();
    }
  }, {
    key: "flashCart",
    value: function flashCart() {
      var _this3 = this;

      this.$badge.addClass('blink');
      setTimeout(function () {
        _this3.$badge.removeClass('blink');
      }, 500);
    }
  }, {
    key: "getItems",
    value: function getItems() {
      var _this4 = this;

      $.ajax({
        url: basePath + '/default/cart/get-items',
        success: function success(data) {
          _this4.$items.html('');

          if (!data.startsWith("[") && !data.startsWith('{')) {
            return;
          }

          var new_data = JSON.parse(data);
          var total = 0;
          var currency = '€';

          for (var i = 0; i < new_data.length; i++) {
            var html = "<div class=\"row\">\n                    <div class=\"col thumb\">";

            if (new_data[i].Image != null) {
              html += '<img src="' + basePath + '/files/images/remante/800/' + new_data[i].Image + '">';
            } else {
              html += '<img src="' + basePath + '/core/img/cdb-icons/package.svg">';
            }

            html += "</div>\n                    <div class=\"col product\">\n                    <a href=\"".concat(basePath, "/default/product/index?search=").concat(new_data[i].Product_ID, "\">").concat(new_data[i].Product, "</a>\n                    </div>\n                    <div class=\"col-4 info\">\n                        <span class=\"quantity\">").concat(new_data[i].Quantity, "x</span>\n                        <span class=\"price\">").concat(Helpers.formatPrice(new_data[i].Quantity * new_data[i].Price), " ").concat(new_data[i].Currency, "</span>\n                    </div>\n                    </div>");
            total += new_data[i].Quantity * new_data[i].Price;
            currency = new_data[i].Currency;

            _this4.$items.append(html);
          }

          _this4.$cart.parents('.cartContainer').find('.total span').text(Helpers.formatPrice(total) + " ".concat(currency));
        }
      });
    }
  }]);

  return Cart;
}();
//# sourceMappingURL=Cart.js.map

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CDBLayout = /*#__PURE__*/function () {
  function CDBLayout() {
    _classCallCheck(this, CDBLayout);

    this.bindEvents();
  }

  _createClass(CDBLayout, [{
    key: "bindEvents",
    value: function bindEvents() {}
  }]);

  return CDBLayout;
}();
//# sourceMappingURL=CDBLayout.js.map

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Evidsoft = /*#__PURE__*/function () {
  function Evidsoft(request) {
    _classCallCheck(this, Evidsoft);
    this.layout = new EvidsoftLayout();
    //this.cart = new Cart();

    this.modules = {};
    this.dispatch();
  }
  _createClass(Evidsoft, [{
    key: "dispatch",
    value: function dispatch() {
      if (request.module === 'admin') {
        if (request.controller === 'index' && request.action === 'index') {
          this.modules['homepage'] = new Homepage();
        }
        if (request.controller === 'translation') {
          this.modules['translation'] = new Translation(lang);
        }
        if (request.controller === 'order' && request.action === 'list') {
          this.modules['orderList'] = new OrderList();
        }
      }
    }
  }]);
  return Evidsoft;
}();
//# sourceMappingURL=Evidsoft.js.map

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

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* MAIN CLASS */
var Homepage = /*#__PURE__*/function () {
  function Homepage() {
    _classCallCheck(this, Homepage);
    _defineProperty(this, "$nav", void 0);
    _defineProperty(this, "$content", void 0);
    _defineProperty(this, "titles", void 0);
    _defineProperty(this, "navigation", void 0);
    this.$nav = $('#navigation .wrapper');
    this.$content = $('#homepage .main-content>.row>div');
    this.titles = {
      'ordersChart': 'Statistiky',
      'otherInfo': 'Aktivní objednávky',
      'helpContact': 'Kontakt na dodavatele',
      'evidsoft': 'Evidsoft'
    };
    this.navigation = null;
  }
  _createClass(Homepage, [{
    key: "init",
    value: function init() {
      this.buildMenu();
      this.navigation = new Navigation();
      this.search = new Search();
    }
  }, {
    key: "buildMenu",
    value: function buildMenu() {
      var _this = this;
      var exclude = ['search', 'facts', 'gallery'];
      if (this.$nav.length > 0 && this.$content.length > 0) {
        this.$nav.html('');
        this.$content.each(function (i) {
          if ($(_this.$content.get(i)).attr('id').length > 0) {
            if (exclude.includes($(_this.$content.get(i)).attr('id')) == false) {
              var danger = $(_this.$content.get(i)).data('danger') == true ? '<i class="ci ci-warning text-danger mr-2"></i>' : '';
              _this.$nav.append('<li><a href="#" data-id="' + $(_this.$content.get(i)).attr('id') + '">' + danger + (_this.titles[$(_this.$content.get(i)).attr('id')] ? _this.titles[$(_this.$content.get(i)).attr('id')] : $(_this.$content.get(i)).find('.title').text() + $(_this.$content.get(i)).find('.panel>.heading').text()) + ($(_this.$content.get(i)).data('icon') ? '<i class="' + $(_this.$content.get(i)).data('icon') + '"></i>' : '<i class="far fa-circle" style="font-size: 10px;width:16px;text-align:right;"></i>') + '</a></li>');
            } else if ($(_this.$content.get(i)).attr('id') == 'search') {
              _this.$nav.append('<li><a href="#" class="search" data-id="search">' + (_this.titles[$(_this.$content.get(i)).attr('id')] ? _this.titles[$(_this.$content.get(i)).attr('id')] : 'Search') + '<i class="ci ci-search"></i></a>');
            }
          }
        });
      }
    }
  }]);
  return Homepage;
}();
/* NAVIGATION ANIMATION */
var Navigation = /*#__PURE__*/function () {
  function Navigation() {
    _classCallCheck(this, Navigation);
    this.init();
  }
  _createClass(Navigation, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      $(window).scroll(function (e) {
        _this2.setItem();
      });
    }
  }, {
    key: "setItem",
    value: function setItem() {
      var scrollTop = $(window).scrollTop() + $(window).height() / 2;
      var items = [];
      $('.main-content>.row>div').each(function (i) {
        var offset = $(this).offset().top - 12;
        var offset_bottom = offset + $(this).height() + 12;
        if (offset <= scrollTop && offset_bottom >= scrollTop) {
          items.push($('#navigation li a[data-id="' + $(this).attr('id') + '"]'));
        }
      });
      $('#navigation li a').removeClass('active');
      for (var i = 0; i < items.length; i++) {
        Object.values(items)[i].addClass('active');
      }
    }
  }]);
  return Navigation;
}();
/* AJAX SEARCH */
var _$search_input = /*#__PURE__*/new WeakMap();
var _$search_results = /*#__PURE__*/new WeakMap();
var Search = /*#__PURE__*/function () {
  function Search() {
    var result_count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
    _classCallCheck(this, Search);
    _classPrivateFieldInitSpec(this, _$search_input, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _$search_results, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "loading", void 0);
    _classPrivateFieldSet(this, _$search_input, $('#search input'));
    _classPrivateFieldSet(this, _$search_results, $('#search .search-results'));
    this.handleInput();
  }
  _createClass(Search, [{
    key: "handleInput",
    value: function handleInput() {
      var _this3 = this;
      var timeout = null;
      _classPrivateFieldGet(this, _$search_input).on('keyup paste', function (e) {
        if (e.target.value.length > 1) {
          clearTimeout(timeout);
          timeout = setTimeout(function () {
            _this3.searchItems(e.target.value);
          }, 500);
        } else {
          _this3.searchItems('');
        }
      });
    }
  }, {
    key: "searchItems",
    value: function searchItems(SearchString) {
      SearchString = SearchString.toLowerCase();
      if (SearchString.length > 0) {
        this.getItems(SearchString);
        if (_classPrivateFieldGet(this, _$search_results).is(':not(:visible)')) {
          this.toggleResults(true);
        }
      } else {
        this.toggleResults(false);
      }
    }
  }, {
    key: "getItems",
    value: function getItems(SearchString) {
      var _this4 = this;
      var Category = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      if (SearchString.length === 0 || $(window).width() < 769) {
        return false;
      }
      _classPrivateFieldGet(this, _$search_results).html('<div class="text-center text-muted">Probíhá načítání ...</div>');
      $.ajax({
        url: basePath + '/admin/index/search',
        data: {
          SearchString: SearchString
        },
        success: function success(data) {
          _classPrivateFieldGet(_this4, _$search_results).html(data);
        },
        fail: function fail() {}
      });
    }
  }, {
    key: "toggleResults",
    value: function toggleResults() {
      var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (show === true) {
        _classPrivateFieldGet(this, _$search_results).stop().slideDown(300);
      } else if (show === false) {
        _classPrivateFieldGet(this, _$search_results).stop().slideUp(300);
      } else {
        _classPrivateFieldGet(this, _$search_results).stop().slideToggle(300);
      }
    }
  }, {
    key: "clearInput",
    value: function clearInput() {
      _classPrivateFieldGet(this, _$search_input).val('');
      this.searchItems('');
    }
  }]);
  return Search;
}();
//# sourceMappingURL=Homepage.js.map

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

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Translation = /*#__PURE__*/function () {
  function Translation(lang) {
    _classCallCheck(this, Translation);
    console.log('x');
    this._form = null;
    this._lang = lang;
    this._trans = {
      copyOriginal: 'Copy original',
      copyOriginalOpen: 'Copy original and open Google Translate',
      translateByGoogle: 'Translate by Google',
      saved: 'Saved!',
      copied: 'Copied',
      empty: 'Text is empty'
    };
  }
  _createClass(Translation, [{
    key: "trans",
    get: function get() {
      return this._trans;
    }

    /**
     * @param {Form|null} form
     */,
    set: function set(trans) {
      this._trans = Object.assign(this._trans, trans);
      return this;
    }
  }, {
    key: "setForm",
    value: function setForm() {
      var form = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this._form = form;
    }

    /**
     * @param {string} lang
     */
  }, {
    key: "setLang",
    value: function setLang(lang) {
      this._lang = lang;
    }

    /**
     * @param {Form|null} form
     */
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      var form = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (form) this.setForm(form);
      $(function () {
        _this.createMissing();
        _this.createActions();
        _this.bindEvents();
      });
    }

    /**
     * Bind eventů
     */
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      this.bindSubmit();
      this.bindCopy();
    }

    /**
     * @returns {Translation}
     */
  }, {
    key: "createActions",
    value: function createActions() {
      var _this2 = this;
      if (!this._form) return this;
      $(this._form.form).find('label').each(function (index, item) {
        $(item).parent().prepend("\n<div class=\"copy-action\">\n    <button type=\"button\" data-copy=\"original\" data-open=\"0\" title=\"".concat(_this2.trans.copyOriginal, "\" class=\"copy-original\" data-toggle=\"bstooltip\"><i class=\"fa fa-copy\"></i></button>\n    <button type=\"button\" data-copy=\"original\" data-open=\"1\" title=\"").concat(_this2.trans.copyOriginalOpen, "\" class=\"copy-original-open\" data-toggle=\"bstooltip\"><i class=\"ci ci-export\"></i></button>\n    \n</div>\n                "));
      });
      setTimeout(function () {
        plugins.initBsTooltip();
      }, 500);
      return this;
    }

    /**
     * Vytvoření chybějicích překladů
     * @returns {Translation}
     */
  }, {
    key: "createMissing",
    value: function createMissing() {
      if (!this._form) return this;
      $(this._form.form).find('.has-error').each(function () {
        $(this).find('label').css('color', '#f00');
        $(this).appendTo($("#empty"));
      });
      return this;
    }

    /**
     * Bind uložení
     * @returns {Translation}
     */
  }, {
    key: "bindSubmit",
    value: function bindSubmit() {
      var _this3 = this;
      if (!this._form) return this;
      $(this._form.form).submit(function (event) {
        event.preventDefault();
        Helpers.ajax({
          method: 'POST',
          url: $(_this3._form.form).attr('action'),
          data: {
            data: JSON.stringify($(_this3._form.form).serializeArray()),
            elang: _this3._lang
          },
          success: function success() {
            alerts.alert(_this3.trans.saved);
          }
        }, true);
      });
      return this;
    }

    /**
     * Bind kopírování
     * @returns {Translation}
     */
  }, {
    key: "bindCopy",
    value: function bindCopy() {
      var _this4 = this;
      $('[data-copy]').unbind().click(function (e) {
        var parent = $(e.currentTarget).parent().parent();
        if ($(e.currentTarget).data('copy') == 'original') {
          var input = document.createElement("input");
          input.value = parent.find('label').text();
          input.style.top = "0";
          input.style.left = "0";
          input.style.position = "fixed";
          document.body.appendChild(input);
          _this4.copyText(input, $(e.currentTarget).data('open') > 0);
          input.remove();
        } else {
          _this4.copyText(parent.find('input').get(0), false);
        }
      });
      return this;
    }

    /**
     * Zkopírovat text / otevřít v překládači
     * @param element
     * @param {boolean} open
     */
  }, {
    key: "copyText",
    value: function copyText(element) {
      var open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      element.select();
      element.setSelectionRange(0, 99999);
      if (element.value) {
        if (open) window.open('https://translate.google.com/?sl=cs&op=translate&tl=' + this._getCorrectLang(this._lang) + '&text=' + element.value.trim().replace(/\s/g, '%20'), '_translation');else {
          document.execCommand("copy");
          alerts.alert(this.trans.copied);
        }
      } else {
        alerts.alert(this.trans.empty, 'error');
      }
    }

    /**
     * Vrátí jazyk pro Google překládač
     * @param lang
     * @returns {string|*}
     * @private
     */
  }, {
    key: "_getCorrectLang",
    value: function _getCorrectLang(lang) {
      switch (lang) {
        case "EN":
          return 'en';
        case "CZ":
          return 'cs';
        case "FR":
          return 'fr';
        default:
          return lang;
      }
    }
  }]);
  return Translation;
}();
//# sourceMappingURL=Translation.js.map

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

var evidsoft = new Evidsoft();
//# sourceMappingURL=application.js.map
