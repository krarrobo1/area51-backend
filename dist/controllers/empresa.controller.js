"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crearEmpresa = crearEmpresa;
exports.obtenerEmpresas = obtenerEmpresas;
exports.obtenerEmpresa = obtenerEmpresa;
exports.eliminarEmpresa = eliminarEmpresa;
exports.actualizarEmpresa = actualizarEmpresa;

var _Empresa = _interopRequireDefault(require("../models/Empresa"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function crearEmpresa(_x, _x2) {
  return _crearEmpresa.apply(this, arguments);
}

function _crearEmpresa() {
  _crearEmpresa = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, nombre, latitud, longitud, radio, nuevaEmpresa;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, nombre = _req$body.nombre, latitud = _req$body.latitud, longitud = _req$body.longitud, radio = _req$body.radio;
            _context.prev = 1;
            _context.next = 4;
            return _Empresa["default"].create({
              nombre: nombre,
              latitud: latitud,
              longitud: longitud,
              radio: radio
            }, {
              fields: ['nombre', 'latitud', 'longitud', 'radio']
            });

          case 4:
            nuevaEmpresa = _context.sent;

            if (!nuevaEmpresa) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", res.json({
              ok: true,
              message: 'Empresa creada correctamente!',
              data: nuevaEmpresa
            }));

          case 7:
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](1);
            res.status(500).json({
              ok: false,
              err: _context.t0
            });

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 9]]);
  }));
  return _crearEmpresa.apply(this, arguments);
}

;

function obtenerEmpresas(_x3, _x4) {
  return _obtenerEmpresas.apply(this, arguments);
}

function _obtenerEmpresas() {
  _obtenerEmpresas = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var empresas;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _Empresa["default"].findAll();

          case 2:
            empresas = _context2.sent;

            if (!empresas) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", res.json({
              ok: true,
              data: empresas
            }));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _obtenerEmpresas.apply(this, arguments);
}

function obtenerEmpresa(_x5, _x6) {
  return _obtenerEmpresa.apply(this, arguments);
}

function _obtenerEmpresa() {
  _obtenerEmpresa = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var id, empresa;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;
            _context3.prev = 1;
            _context3.next = 4;
            return _Empresa["default"].findOne({
              where: {
                id: id
              }
            });

          case 4:
            empresa = _context3.sent;

            if (empresa) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", res.status(404).json({
              message: 'Empresa no encontrada...'
            }));

          case 7:
            return _context3.abrupt("return", res.json({
              ok: true,
              data: empresa
            }));

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](1);
            res.status(500).json({
              ok: false,
              err: _context3.t0
            });

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 10]]);
  }));
  return _obtenerEmpresa.apply(this, arguments);
}

function eliminarEmpresa(_x7, _x8) {
  return _eliminarEmpresa.apply(this, arguments);
}

function _eliminarEmpresa() {
  _eliminarEmpresa = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var id;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            _context4.prev = 1;
            _context4.next = 4;
            return _Empresa["default"].destroy({
              where: {
                id: id
              }
            });

          case 4:
            res.json({
              ok: true,
              message: 'Empresa eliminada...'
            });
            _context4.next = 10;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](1);
            return _context4.abrupt("return", res.json({
              ok: false,
              err: _context4.t0
            }));

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 7]]);
  }));
  return _eliminarEmpresa.apply(this, arguments);
}

function actualizarEmpresa(_x9, _x10) {
  return _actualizarEmpresa.apply(this, arguments);
}

function _actualizarEmpresa() {
  _actualizarEmpresa = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res) {
    var id, _req$body2, nombre, latitud, longitud, radio, estado;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id;
            _req$body2 = req.body, nombre = _req$body2.nombre, latitud = _req$body2.latitud, longitud = _req$body2.longitud, radio = _req$body2.radio, estado = _req$body2.estado;
            _context5.prev = 2;
            _context5.next = 5;
            return _Empresa["default"].update({
              nombre: nombre,
              latitud: latitud,
              longitud: longitud,
              radio: radio,
              estado: estado
            }, {
              where: {
                id: id
              }
            });

          case 5:
            return _context5.abrupt("return", res.json({
              ok: true,
              message: 'Empresa actualizada...'
            }));

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](2);
            res.status(500).json({
              ok: false,
              err: _context5.t0
            });

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[2, 8]]);
  }));
  return _actualizarEmpresa.apply(this, arguments);
}