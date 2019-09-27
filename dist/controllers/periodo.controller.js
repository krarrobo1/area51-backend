"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crearPeriodo = crearPeriodo;
exports.obtenerPeriodoPorIdCargo = obtenerPeriodoPorIdCargo;
exports.modificarPeriodo = modificarPeriodo;
exports.eliminarPeriodo = eliminarPeriodo;
exports.obtenerPeriodo = obtenerPeriodo;

var _Periodo = _interopRequireDefault(require("../models/Periodo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function crearPeriodo(_x, _x2) {
  return _crearPeriodo.apply(this, arguments);
}

function _crearPeriodo() {
  _crearPeriodo = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, cargoid, diaid, horainicio, horafin, nuevo;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, cargoid = _req$body.cargoid, diaid = _req$body.diaid, horainicio = _req$body.horainicio, horafin = _req$body.horafin;
            _context.prev = 1;
            _context.next = 4;
            return _Periodo["default"].create({
              cargoid: cargoid,
              diaid: diaid,
              horainicio: horainicio,
              horafin: horafin
            }, {
              fields: ['cargoid', 'diaid', 'horainicio', 'horafin']
            });

          case 4:
            nuevo = _context.sent;

            if (!nuevo) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", res.json({
              ok: true,
              data: nuevo
            }));

          case 7:
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](1);
            return _context.abrupt("return", res.status(500).json({
              ok: false,
              err: _context.t0
            }));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 9]]);
  }));
  return _crearPeriodo.apply(this, arguments);
}

;
/*Debe retornar el dia laboral, la hora inicio y la hora fin */

function obtenerPeriodoPorIdCargo(_x3, _x4) {
  return _obtenerPeriodoPorIdCargo.apply(this, arguments);
}

function _obtenerPeriodoPorIdCargo() {
  _obtenerPeriodoPorIdCargo = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var id, periodos;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id;
            _context2.prev = 1;
            _context2.next = 4;
            return _Periodo["default"].findAll({
              where: {
                cargoid: id
              }
            });

          case 4:
            periodos = _context2.sent;
            return _context2.abrupt("return", res.json({
              ok: true,
              data: periodos
            }));

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](1);
            return _context2.abrupt("return", res.status(500).json({
              ok: false,
              err: _context2.t0
            }));

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 8]]);
  }));
  return _obtenerPeriodoPorIdCargo.apply(this, arguments);
}

;

function modificarPeriodo(_x5, _x6) {
  return _modificarPeriodo.apply(this, arguments);
}

function _modificarPeriodo() {
  _modificarPeriodo = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var id, _req$body2, horainicio, horafin, diaid, periodo;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;
            _req$body2 = req.body, horainicio = _req$body2.horainicio, horafin = _req$body2.horafin, diaid = _req$body2.diaid;
            _context3.prev = 2;
            _context3.next = 5;
            return _Periodo["default"].update({
              horainicio: horainicio,
              horafin: horafin,
              diaid: diaid
            }, {
              where: {
                id: id
              }
            });

          case 5:
            periodo = _context3.sent;
            return _context3.abrupt("return", res.json({
              ok: true,
              message: 'Periodo modificado correctamente'
            }));

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](2);
            res.status(500).json({
              ok: false,
              err: _context3.t0
            });

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 9]]);
  }));
  return _modificarPeriodo.apply(this, arguments);
}

;

function eliminarPeriodo(_x7, _x8) {
  return _eliminarPeriodo.apply(this, arguments);
}

function _eliminarPeriodo() {
  _eliminarPeriodo = _asyncToGenerator(
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
            return _Periodo["default"].destroy({
              where: {
                id: id
              }
            });

          case 4:
            return _context4.abrupt("return", res.json({
              ok: true,
              message: 'Periodo eliminado'
            }));

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](1);
            res.status(500).json({
              ok: false,
              err: _context4.t0
            });

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 7]]);
  }));
  return _eliminarPeriodo.apply(this, arguments);
}

;

function obtenerPeriodo(_x9, _x10) {
  return _obtenerPeriodo.apply(this, arguments);
}

function _obtenerPeriodo() {
  _obtenerPeriodo = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res) {
    var id, periodo;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id;
            _context5.prev = 1;
            _context5.next = 4;
            return _Periodo["default"].findOne({
              where: {
                id: id
              }
            });

          case 4:
            periodo = _context5.sent;

            if (!periodo) {
              res.status(404).json({
                ok: false,
                message: 'Periodo no encontrado'
              });
            }

            res.json({
              ok: true,
              data: periodo
            });
            _context5.next = 12;
            break;

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](1);
            res.status(500).json({
              ok: false,
              err: _context5.t0
            });

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 9]]);
  }));
  return _obtenerPeriodo.apply(this, arguments);
}

;