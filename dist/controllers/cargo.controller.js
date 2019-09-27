"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crearCargo = crearCargo;
exports.modificarCargo = modificarCargo;
exports.eliminarCargo = eliminarCargo;
exports.obtenerCargosPorEmpresaId = obtenerCargosPorEmpresaId;

var _Cargo = _interopRequireDefault(require("../models/Cargo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function crearCargo(_x, _x2) {
  return _crearCargo.apply(this, arguments);
}

function _crearCargo() {
  _crearCargo = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, empresaid, nombre, nuevoCargo;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, empresaid = _req$body.empresaid, nombre = _req$body.nombre;
            _context.prev = 1;
            _context.next = 4;
            return _Cargo["default"].create({
              empresaid: empresaid,
              nombre: nombre
            }, {
              fields: ['empresaid', 'nombre']
            });

          case 4:
            nuevoCargo = _context.sent;

            if (nuevoCargo) {
              res.json({
                message: 'Cargo creado correctamente',
                data: nuevoCargo
              });
            }

            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](1);
            res.status(500).json({
              ok: false,
              err: _context.t0
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 8]]);
  }));
  return _crearCargo.apply(this, arguments);
}

function modificarCargo(_x3, _x4) {
  return _modificarCargo.apply(this, arguments);
}

function _modificarCargo() {
  _modificarCargo = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var id, nombre, cargo;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id;
            nombre = req.body.nombre;
            _context2.prev = 2;
            _context2.next = 5;
            return _Cargo["default"].update({
              nombre: nombre
            }, {
              where: {
                id: id
              }
            });

          case 5:
            cargo = _context2.sent;
            return _context2.abrupt("return", res.json({
              ok: true,
              message: 'Cargo modificado'
            }));

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](2);
            res.status(500).json({
              ok: false,
              err: _context2.t0
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 9]]);
  }));
  return _modificarCargo.apply(this, arguments);
}

function eliminarCargo(_x5, _x6) {
  return _eliminarCargo.apply(this, arguments);
}

function _eliminarCargo() {
  _eliminarCargo = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var id;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;
            _context3.prev = 1;
            _context3.next = 4;
            return _Cargo["default"].destroy({
              where: {
                id: id
              }
            });

          case 4:
            res.json({
              ok: true,
              message: 'Cargo eliminado...'
            });
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](1);
            res.status(500).json({
              ok: false,
              err: _context3.t0
            });

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 7]]);
  }));
  return _eliminarCargo.apply(this, arguments);
}

function obtenerCargosPorEmpresaId(_x7, _x8) {
  return _obtenerCargosPorEmpresaId.apply(this, arguments);
}

function _obtenerCargosPorEmpresaId() {
  _obtenerCargosPorEmpresaId = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var empresaid, cargos;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            empresaid = req.params.empresaid;
            _context4.prev = 1;
            _context4.next = 4;
            return _Cargo["default"].findAll({
              where: {
                empresaid: empresaid
              }
            });

          case 4:
            cargos = _context4.sent;
            res.json({
              ok: true,
              data: cargos
            });
            _context4.next = 11;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](1);
            res.status(500).json({
              ok: false,
              err: _context4.t0
            });

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 8]]);
  }));
  return _obtenerCargosPorEmpresaId.apply(this, arguments);
}