"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crearEmpleado = crearEmpleado;
exports.obtenerEmpleadosPorEmpresa = obtenerEmpleadosPorEmpresa;
exports.obtenerEmpleado = obtenerEmpleado;
exports.modificarEmpleado = modificarEmpleado;
exports.eliminarEmpleado = eliminarEmpleado;

var _Empleado = _interopRequireDefault(require("../models/Empleado"));

var _Empresa = _interopRequireDefault(require("../models/Empresa"));

var _Cargo = _interopRequireDefault(require("../models/Cargo"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function crearEmpleado(_x, _x2) {
  return _crearEmpleado.apply(this, arguments);
}

function _crearEmpleado() {
  _crearEmpleado = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, nombres, apellidos, ci, email, password, empresaid, cargoid, rolid, nuevoEmpleado;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, nombres = _req$body.nombres, apellidos = _req$body.apellidos, ci = _req$body.ci, email = _req$body.email, password = _req$body.password, empresaid = _req$body.empresaid, cargoid = _req$body.cargoid, rolid = _req$body.rolid;
            _context.prev = 1;
            _context.t0 = _Empleado["default"];
            _context.t1 = nombres;
            _context.t2 = apellidos;
            _context.t3 = ci;
            _context.t4 = email;
            _context.next = 9;
            return _bcrypt["default"].hash(password, 10);

          case 9:
            _context.t5 = _context.sent;
            _context.t6 = empresaid;
            _context.t7 = cargoid;
            _context.t8 = rolid;
            _context.t9 = {
              nombres: _context.t1,
              apellidos: _context.t2,
              ci: _context.t3,
              email: _context.t4,
              password: _context.t5,
              empresaid: _context.t6,
              cargoid: _context.t7,
              rolid: _context.t8
            };
            _context.t10 = {
              fields: ['nombres', 'apellidos', 'ci', 'email', 'password', 'empresaid', 'cargoid', 'rolid']
            };
            _context.next = 17;
            return _context.t0.create.call(_context.t0, _context.t9, _context.t10);

          case 17:
            nuevoEmpleado = _context.sent;
            delete nuevoEmpleado.dataValues.password;
            return _context.abrupt("return", res.json({
              ok: true,
              data: nuevoEmpleado
            }));

          case 22:
            _context.prev = 22;
            _context.t11 = _context["catch"](1);
            return _context.abrupt("return", res.status(500).json({
              ok: false,
              err: _context.t11
            }));

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 22]]);
  }));
  return _crearEmpleado.apply(this, arguments);
}

;

function obtenerEmpleadosPorEmpresa(_x3, _x4) {
  return _obtenerEmpleadosPorEmpresa.apply(this, arguments);
}

function _obtenerEmpleadosPorEmpresa() {
  _obtenerEmpleadosPorEmpresa = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var id, empresa, empleados;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id;
            _context2.prev = 1;
            _context2.next = 4;
            return _Empresa["default"].findOne({
              where: {
                id: id
              }
            });

          case 4:
            empresa = _context2.sent;

            if (empresa) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", res.status(404).json({
              ok: false,
              message: 'No se encontro empresa con ese ID'
            }));

          case 7:
            _context2.next = 9;
            return _Empleado["default"].findAll({
              attributes: ['id', 'nombres', 'apellidos', 'email', 'ci']
            }, {
              where: {
                empresaid: id
              },
              include: [_Cargo["default"]]
            });

          case 9:
            empleados = _context2.sent;

            if (empleados) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt("return", res.status(404).json({
              ok: false,
              message: 'No se encontraron empleados de esa empresa'
            }));

          case 12:
            return _context2.abrupt("return", res.json({
              ok: true,
              data: empleados
            }));

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](1);
            return _context2.abrupt("return", res.status(500).json({
              ok: false,
              err: _context2.t0
            }));

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 15]]);
  }));
  return _obtenerEmpleadosPorEmpresa.apply(this, arguments);
}

function obtenerEmpleado(_x5, _x6) {
  return _obtenerEmpleado.apply(this, arguments);
}

function _obtenerEmpleado() {
  _obtenerEmpleado = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var id, empleado;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;
            _context3.prev = 1;
            _context3.next = 4;
            return _Empleado["default"].findOne({
              where: {
                id: id
              },
              attributes: ['nombres', 'apellidos', 'email', 'rolid', 'cargoid', 'empresaid']
            });

          case 4:
            empleado = _context3.sent;

            if (empleado) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", res.status(404).json({
              ok: false,
              message: 'Usuario no encontrado...'
            }));

          case 7:
            delete empleado.dataValues.password;
            return _context3.abrupt("return", res.json({
              ok: true,
              data: empleado
            }));

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](1);
            return _context3.abrupt("return", res.status(500).json({
              ok: false,
              err: _context3.t0
            }));

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 11]]);
  }));
  return _obtenerEmpleado.apply(this, arguments);
}

function modificarEmpleado(_x7, _x8) {
  return _modificarEmpleado.apply(this, arguments);
}

function _modificarEmpleado() {
  _modificarEmpleado = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var _req$body2, nombres, apellidos, ci, email, id;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$body2 = req.body, nombres = _req$body2.nombres, apellidos = _req$body2.apellidos, ci = _req$body2.ci, email = _req$body2.email;
            id = req.params.id;
            _context4.prev = 2;
            _context4.next = 5;
            return _Empleado["default"].update({
              nombres: nombres,
              apellidos: apellidos,
              ci: ci,
              email: email
            }, {
              where: {
                id: id
              }
            }, {
              fields: ['nombres', 'apellidos', 'ci', 'email']
            });

          case 5:
            return _context4.abrupt("return", res.json({
              ok: true,
              message: 'Empleado actualizado...'
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
  return _modificarEmpleado.apply(this, arguments);
}

function eliminarEmpleado(_x9, _x10) {
  return _eliminarEmpleado.apply(this, arguments);
}

function _eliminarEmpleado() {
  _eliminarEmpleado = _asyncToGenerator(
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
            return _Empleado["default"].destroy({
              where: {
                id: id
              }
            });

          case 4:
            return _context5.abrupt("return", res.json({
              ok: true,
              message: 'Empleado eliminado correctamente'
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
  return _eliminarEmpleado.apply(this, arguments);
}