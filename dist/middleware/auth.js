"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verificarToken = verificarToken;
exports.verificarAdmin = verificarAdmin;
exports.verificarSuperAdmin = verificarSuperAdmin;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = require("../config/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function verificarToken(_x, _x2, _x3) {
  return _verificarToken.apply(this, arguments);
}

function _verificarToken() {
  _verificarToken = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var token, decoded;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            token = req.get('Authorization');
            _context.prev = 1;
            _context.next = 4;
            return _jsonwebtoken["default"].verify(token, _config.seed);

          case 4:
            decoded = _context.sent;
            req.data = decoded;
            next();
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](1);
            return _context.abrupt("return", res.status(401).json({
              ok: false,
              message: 'Token invalido...'
            }));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 9]]);
  }));
  return _verificarToken.apply(this, arguments);
}

function verificarAdmin(req, res, next) {
  var rol = req.data.rol;
  if (rol == 'user') return res.status(401).json({
    ok: false,
    message: 'No autorizado...'
  });
  next();
}

function verificarSuperAdmin(req, res, next) {
  var rol = req.data.rol;
  if (rol !== 'superadmin') return res.status(401).json({
    ok: false,
    message: 'No autorizado...'
  });
  next();
}