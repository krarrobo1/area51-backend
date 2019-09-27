"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crearAsistencia = crearAsistencia;
exports.obtenerAsistencia = obtenerAsistencia;

var _Asistencia = _interopRequireDefault(require("../models/Asistencia"));

var _Dispositivo = _interopRequireDefault(require("../models/Dispositivo"));

var _Empleado = _interopRequireDefault(require("../models/Empleado"));

var _Evento = _interopRequireDefault(require("../models/Evento"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function crearAsistencia(_x, _x2) {
  return _crearAsistencia.apply(this, arguments);
}

function _crearAsistencia() {
  _crearAsistencia = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var id, _req$body, dispositivoid, latitud, longitud, eventoid, dispositivos, flag, i, _id, nuevaAsistencia;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = req.data.id;
            _req$body = req.body, dispositivoid = _req$body.dispositivoid, latitud = _req$body.latitud, longitud = _req$body.longitud, eventoid = _req$body.eventoid;
            _context.next = 4;
            return _Dispositivo["default"].findAll({
              raw: true,
              where: {
                empleadoid: id
              }
            });

          case 4:
            dispositivos = _context.sent;

            if (!(dispositivos.length == 0)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", res.status(404).json({
              ok: false,
              message: 'No se han encontrado dispositivos vinculados a dicho empleado...'
            }));

          case 7:
            flag = false;
            i = 0;

          case 9:
            if (!(i < dispositivos.length)) {
              _context.next = 17;
              break;
            }

            _id = dispositivos[i].id;

            if (!(dispositivoid == _id)) {
              _context.next = 14;
              break;
            }

            flag = true;
            return _context.abrupt("break", 17);

          case 14:
            i++;
            _context.next = 9;
            break;

          case 17:
            if (flag) {
              _context.next = 19;
              break;
            }

            return _context.abrupt("return", res.json({
              ok: false,
              message: 'El id del dispositivo no coincide con el empleado'
            }));

          case 19:
            _context.prev = 19;
            _context.next = 22;
            return _Asistencia["default"].create({
              dispositivoid: dispositivoid,
              hora: new Date(),
              latitud: latitud,
              longitud: longitud,
              eventoid: eventoid
            }, {
              fields: ['dispositivoid', 'hora', 'latitud', 'longitud', 'eventoid']
            });

          case 22:
            nuevaAsistencia = _context.sent;
            res.json({
              ok: true,
              asistencia: nuevaAsistencia
            });
            _context.next = 29;
            break;

          case 26:
            _context.prev = 26;
            _context.t0 = _context["catch"](19);
            res.status(500).json({
              ok: false,
              err: _context.t0
            });

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[19, 26]]);
  }));
  return _crearAsistencia.apply(this, arguments);
}

;

function obtenerAsistencia(_x3, _x4) {
  return _obtenerAsistencia.apply(this, arguments);
}

function _obtenerAsistencia() {
  _obtenerAsistencia = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var id, asistencias;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id;
            _context2.prev = 1;
            _context2.next = 4;
            return _Asistencia["default"].findAll({
              attributes: ['id', 'hora', 'latitud', 'longitud'],
              where: {
                dispositivoid: id
              },
              include: [{
                model: _Dispositivo["default"],
                attributes: ['id', 'nombre', 'ip', 'mac', 'modelo'],
                include: [{
                  model: _Empleado["default"],
                  attributes: ['id', 'nombres', 'apellidos']
                }]
              }, {
                model: _Evento["default"],
                attributes: ['nombre']
              }]
            });

          case 4:
            asistencias = _context2.sent;
            return _context2.abrupt("return", res.json({
              ok: true,
              data: asistencias
            }));

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](1);
            res.status(500).json({
              ok: true,
              err: _context2.t0
            });

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 8]]);
  }));
  return _obtenerAsistencia.apply(this, arguments);
}