function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var CarSelect = /*#__PURE__*/function () {
  function CarSelect() {
    _classCallCheck(this, CarSelect);
    this.bindEvents();
  }
  _createClass(CarSelect, [{
    key: "bindEvents",
    value: function bindEvents() {
      $(function () {
        if (page.controller == 'index' && page.action == 'index') setTimeout(function () {
          $("#CarBrand").val('0');
          $("#CarModel").val('0');
          $("#CarType").val('0');
        }, 50);
        if ($('.car-select').data('carbrand') || $("#CarBrand").val() != 0) {
          if ($("#CarBrand").val() != 0) {
            CarSelect.getCarModels($("#CarBrand").val());
          } else if ($('.car-select').data('carbrand')) {
            $("#CarBrand").val($('.car-select').data('carbrand'));
            CarSelect.getCarModels($('.car-select').data('carbrand'), $('.car-select').data('carmodel'), $('.car-select').data('cartype'));
          }
          $('.confirm-car-select').removeClass('inactive');
        }
        $('.car-select #CarBrand').change(function (e) {
          var $this = $(e.target);
          var carBrand = $this.val();
          if (carBrand == 0) {
            $('.confirm-car-select').addClass('inactive');
            $('.car-select .counter').html('');
          } else {
            $('.confirm-car-select').removeClass('inactive');
          }
          CarSelect.getCarModels(carBrand);
        });
        $('.car-select #CarModel').change(function (e) {
          var $this = $(e.target);
          var carModel = $this.val();
          CarSelect.getCarTypes(carModel);
        });
        $('.car-select #CarType').change(function (e) {
          var $this = $(e.target);
          var carType = $this.val();
          CarSelect.computeProductCar(carType);
        });
        $('.confirm-car-select').click(function (e) {
          var $this = $(e.target);
          if ($this.hasClass('inactive')) return;
          var carBrand = $("#CarBrand").val();
          var carModel = $("#CarModel").val();
          var carType = $("#CarType").val();
          var url = '/' + projectVars.url.category + '/' + $('.car-select').data('categoryurl');
          if (carBrand) {
            url += '/cb/' + carBrand;
          }
          if (carModel && carModel != 'undefined') {
            url += '/cm/' + carModel;
          }
          if (carType && carType != 'undefined' && carType !== '0') {
            url += '/?f=28-' + carType;
          }

          //let url = '/' + projectVars.url.category + '/' + $('.car-select').data('categoryurl')  + '/cb/' + carBrand + '/cm/' + carModel;
          window.location.href = url;
          return;
        });
        $('.car-select .images img').click(function (e) {
          var $this = $(e.target);
          $('#CarBrand').val($this.data('carbrand')).change();
        });
      });
    }
  }], [{
    key: "getCarModels",
    value: function getCarModels(carBrand) {
      var carModel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var carType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      if (typeof carBrand !== 'undefined') {
        $.ajax({
          type: "POST",
          url: "/default/index/get-car-models",
          data: {
            "isAjax": true,
            CarBrand: carBrand,
            CategoryID: $('.car-select').data('categoryid')
          },
          dataType: "json",
          success: function success(data) {
            var select = $("#CarModel"),
              options = "";
            select.empty();
            if (data.productsCount) $('.car-select .counter').html('(' + data.productsCount + ')');else $('.car-select .counter').html();
            for (var i = 0; i < data.cms.length; i++) {
              options += "<option value=" + data.cms[i].slug + ">" + data.cms[i].name + "</option>";
            }
            select.append(options);
            if (carModel) {
              $("#CarModel").val(carModel);
              CarSelect.getCarTypes(carModel, carType);
            }
            var select = $("#CarType"),
              options = "";
            select.empty();
            options += "<option value='0'>Vyberte karoserii vozidla</option>";
            select.append(options);
          }
        });
      }
    }
  }, {
    key: "getCarTypes",
    value: function getCarTypes(carModel) {
      var carType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (typeof carModel !== 'undefined') {
        $.ajax({
          type: "POST",
          url: "/default/index/get-car-types",
          data: {
            "isAjax": true,
            CarModel: carModel,
            CategoryID: $('.car-select').data('categoryid')
          },
          dataType: "json",
          success: function success(data) {
            var select = $("#CarType"),
              options = "";
            select.empty();
            $('.car-select .counter').html('(' + data.productsCount + ')');
            for (var i = 0; i < data.cts.length; i++) {
              options += "<option value=" + data.cts[i].ID + ">" + data.cts[i].name + "</option>";
            }
            select.append(options);
            if (carType) {
              $("#CarType").val(carType);
              CarSelect.computeProductCar(carType);
            }
          }
        });
      }
    }
  }, {
    key: "computeProductCar",
    value: function computeProductCar(carType) {
      if (typeof carType !== 'undefined') {
        $.ajax({
          type: "POST",
          url: "/default/index/get-products-count",
          data: {
            "isAjax": true,
            CarModel: $("#CarModel").val(),
            CarTypeID: $("#CarType").val(),
            CategoryID: $('.car-select').data('categoryid')
          },
          dataType: "json",
          success: function success(data) {
            $('.car-select .counter').html('(' + data.productsCount + ')');
          }
        });
      }
    }
  }]);
  return CarSelect;
}();
//# sourceMappingURL=CarSelect.js.map
