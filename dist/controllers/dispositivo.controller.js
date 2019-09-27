"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registrarDispositivo = registrarDispositivo;
exports.obtenerDispositivosPorIdEmpleado = obtenerDispositivosPorIdEmpleado;
exports.obtenerDispositivo = obtenerDispositivo;
exports.modificarDispositivo = modificarDispositivo;
exports.eliminarDispositivo = eliminarDispositivo;

var _Dispositivo = _interopRequireDefault(require("../models/Dispositivo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function registrarDispositivo(_x, _x2) {
  return _registrarDispositivo.apply(this, arguments);
}

function _registrarDispositivo() {
  _registrarDispositivo = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var id, _req$body, nombre, ip, mac, modelo, nuevoDispositivo;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = req.data.id;
            _req$body = req.body, nombre = _req$body.nombre, ip = _req$body.ip, mac = _req$body.mac, modelo = _req$body.modelo;
            _context.prev = 2;
            _context.next = 5;
            return _Dispositivo["default"].create({
              empleadoid: id,
              nombre: nombre,
              ip: ip,
              mac: mac,
              modelo: modelo
            }, {
              fields: ['empleadoid', 'nombre', 'ip', 'mac', 'modelo']
            });

          case 5:
            nuevoDispositivo = _context.sent;
            return _context.abrupt("return", res.json({
              ok: true,
              data: nuevoDispositivo
            }));

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);
            return _context.abrupt("return", res.status(500).json({
              ok: false,
              err: _context.t0
            }));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 9]]);
  }));
  return _registrarDispositivo.apply(this, arguments);
}

function obtenerDispositivosPorIdEmpleado(_x3, _x4) {
  return _obtenerDispositivosPorIdEmpleado.apply(this, arguments);
}

function _obtenerDispositivosPorIdEmpleado() {
  _obtenerDispositivosPorIdEmpleado = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var id, dispositivos;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.data.id;
            _context2.prev = 1;
            _context2.next = 4;
            return _Dispositivo["default"].findAll({
              where: {
                empleadoid: id
              }
            });

          case 4:
            dispositivos = _context2.sent;
            return _context2.abrupt("return", res.json({
              ok: true,
              data: dispositivos
            }));

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](1);
            res.status(500).json({
              ok: false,
              err: _context2.t0
            });

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 8]]);
  }));
  return _obtenerDispositivosPorIdEmpleado.apply(this, arguments);
}

function obtenerDispositivo(_x5, _x6) {
  return _obtenerDispositivo.apply(this, arguments);
}

function _obtenerDispositivo() {
  _obtenerDispositivo = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var id, dispositivo;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;
            _context3.prev = 1;
            _context3.next = 4;
            return _Dispositivo["default"].findOne({
              where: {
                id: id
              }
            });

          case 4:
            dispositivo = _context3.sent;

            if (dispositivo) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", res.status(404).json({
              ok: false,
              message: 'Dispositivo no encontrado...'
            }));

          case 7:
            return _context3.abrupt("return", res.json({
              ok: true,
              data: dispositivo
            }));

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](1);
            return _context3.abrupt("return", res.json({
              ok: false,
              err: _context3.t0
            }));

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 10]]);
  }));
  return _obtenerDispositivo.apply(this, arguments);
}

function modificarDispositivo(_x7, _x8) {
  return _modificarDispositivo.apply(this, arguments);
}

function _modificarDispositivo() {
  _modificarDispositivo = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var id, _req$body2, nombre, ip, mac, estado;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            _req$body2 = req.body, nombre = _req$body2.nombre, ip = _req$body2.ip, mac = _req$body2.mac, estado = _req$body2.estado;
            _context4.prev = 2;
            _context4.next = 5;
            return _Dispositivo["default"].update({
              nombre: nombre,
              ip: ip,
              mac: mac,
              estado: estado
            }, {
              where: {
                id: id
              }
            });

          case 5:
            return _context4.abrupt("return", res.json({
              ok: true,
              message: 'Dispositivo actualizado...'
            }));

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](2);
            return _context4.abrupt("return", res.status(500).json({
              ok: false,
              err: _context4.t0
            }));

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 8]]);
  }));
  return _modificarDispositivo.apply(this, arguments);
}

;

function eliminarDispositivo(_x9, _x10) {
  return _eliminarDispositivo.apply(this, arguments);
}

function _eliminarDispositivo() {
  _eliminarDispositivo = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res) {
    var id;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id;
            _context5.prev = 1;
            _context5.next = 4;
            return _Dispositivo["default"].update({
              estado: false
            }, {
              where: {
                id: id
              }
            });

          case 4:
            return _context5.abrupt("return", res.json({
              ok: true,
              message: 'Dispositivo eliminado...'
            }));

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](1);
            return _context5.abrupt("return", res.status(500).json({
              ok: false,
              err: _context5.t0
            }));

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 7]]);
  }));
  return _eliminarDispositivo.apply(this, arguments);
}