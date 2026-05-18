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
