"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crearPermiso = crearPermiso;
exports.modificarPermiso = modificarPermiso;
exports.eliminarPermiso = eliminarPermiso;
exports.obtenerPermisosPorEmpleadoId = obtenerPermisosPorEmpleadoId;
exports.obtenerPermiso = obtenerPermiso;

var _DetallePermiso = _interopRequireDefault(require("../models/DetallePermiso"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function crearPermiso(_x, _x2) {
  return _crearPermiso.apply(this, arguments);
}

function _crearPermiso() {
  _crearPermiso = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var id, _req$body, fechainicio, fechafin, permisoid, nuevoPermiso;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = req.data.id;
            _req$body = req.body, fechainicio = _req$body.fechainicio, fechafin = _req$body.fechafin, permisoid = _req$body.permisoid;
            _context.prev = 2;
            _context.next = 5;
            return _DetallePermiso["default"].create({
              empleadoid: id,
              fechainicio: fechainicio,
              fechafin: fechafin,
              permisoid: permisoid
            }, {
              fields: ['empleadoid', 'fechainicio', 'fechafin', 'permisoid']
            });

          case 5:
            nuevoPermiso = _context.sent;
            res.json({
              ok: true,
              data: nuevoPermiso
            });
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);
            console.log(_context.t0);
            res.status(500).json({
              ok: false,
              err: _context.t0
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 9]]);
  }));
  return _crearPermiso.apply(this, arguments);
}

function modificarPermiso(_x3, _x4) {
  return _modificarPermiso.apply(this, arguments);
}

function _modificarPermiso() {
  _modificarPermiso = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var id, _req$body2, fechainicio, fechafin, permisoid, estado;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id;
            _req$body2 = req.body, fechainicio = _req$body2.fechainicio, fechafin = _req$body2.fechafin, permisoid = _req$body2.permisoid, estado = _req$body2.estado;
            _context2.prev = 2;
            _context2.next = 5;
            return _DetallePermiso["default"].update({
              fechainicio: fechainicio,
              fechafin: fechafin,
              permisoid: permisoid,
              estado: estado
            }, {
              where: {
                id: id
              }
            });

          case 5:
            return _context2.abrupt("return", res.json({
              ok: true,
              message: 'Permiso actualizado...'
            }));

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](2);
            return _context2.abrupt("return", res.json({
              ok: false,
              err: _context2.t0
            }));

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 8]]);
  }));
  return _modificarPermiso.apply(this, arguments);
}

function eliminarPermiso(_x5, _x6) {
  return _eliminarPermiso.apply(this, arguments);
}

function _eliminarPermiso() {
  _eliminarPermiso = _asyncToGenerator(
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
            return _DetallePermiso["default"].destroy({
              where: {
                id: id
              }
            });

          case 4:
            return _context3.abrupt("return", res.json({
              ok: true,
              message: 'Permiso eliminado...'
            }));

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](1);
            return _context3.abrupt("return", res.json({
              ok: false,
              err: _context3.t0
            }));

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 7]]);
  }));
  return _eliminarPermiso.apply(this, arguments);
}

function obtenerPermisosPorEmpleadoId(_x7, _x8) {
  return _obtenerPermisosPorEmpleadoId.apply(this, arguments);
}

function _obtenerPermisosPorEmpleadoId() {
  _obtenerPermisosPorEmpleadoId = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var id, permisos;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            console.log(id);
            _context4.prev = 2;
            _context4.next = 5;
            return _DetallePermiso["default"].findAll({
              where: {
                empleadoid: id
              }
            });

          case 5:
            permisos = _context4.sent;

            if (permisos) {
              _context4.next = 8;
              break;
            }

            return _context4.abrupt("return", res.status(404).json({
              ok: false,
              message: 'No se han encontrado permisos'
            }));

          case 8:
            return _context4.abrupt("return", res.json({
              ok: true,
              data: permisos
            }));

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4["catch"](2);
            return _context4.abrupt("return", res.json({
              ok: false,
              err: _context4.t0
            }));

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 11]]);
  }));
  return _obtenerPermisosPorEmpleadoId.apply(this, arguments);
}

function obtenerPermiso(_x9, _x10) {
  return _obtenerPermiso.apply(this, arguments);
}

function _obtenerPermiso() {
  _obtenerPermiso = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res) {
    var id, permisos;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id;
            _context5.prev = 1;
            _context5.next = 4;
            return _DetallePermiso["default"].findAll({
              where: {
                id: id
              }
            });

          case 4:
            permisos = _context5.sent;

            if (permisos) {
              _context5.next = 7;
              break;
            }

            return _context5.abrupt("return", res.status(404).json({
              ok: false,
              message: 'No se han encontrado permisos'
            }));

          case 7:
            return _context5.abrupt("return", res.json({
              ok: true,
              data: permisos
            }));

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](1);
            return _context5.abrupt("return", res.json({
              ok: false,
              err: _context5.t0
            }));

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 10]]);
  }));
  return _obtenerPermiso.apply(this, arguments);
}