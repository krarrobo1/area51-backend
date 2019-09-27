"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogIn = LogIn;

var _Empleado = _interopRequireDefault(require("../models/Empleado"));

var _Empresa = _interopRequireDefault(require("../models/Empresa"));

var _Cargo = _interopRequireDefault(require("../models/Cargo"));

var _Rol = _interopRequireDefault(require("../models/Rol"));

var _Periodo = _interopRequireDefault(require("../models/Periodo"));

var _Dia = _interopRequireDefault(require("../models/Dia"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = require("../config/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function LogIn(_x, _x2) {
  return _LogIn.apply(this, arguments);
}

function _LogIn() {
  _LogIn = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, email, password, empleadoTemp, flag, data, tkndata, token;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, email = _req$body.email, password = _req$body.password;
            _context.prev = 1;
            _context.next = 4;
            return _Empleado["default"].findOne({
              attributes: ['id', 'nombres', 'apellidos', 'email', 'password'],
              where: {
                email: email
              },
              include: [{
                model: _Empresa["default"],
                attributes: ['nombre', 'latitud', 'longitud', 'radio']
              }, {
                model: _Rol["default"],
                attributes: ['nombre']
              }, {
                model: _Cargo["default"],
                attributes: ['nombre'],
                include: [{
                  model: _Periodo["default"],
                  attributes: ['horainicio', 'horafin'],
                  include: [{
                    model: _Dia["default"],
                    attributes: ['nombre']
                  }]
                }]
              }]
            });

          case 4:
            empleadoTemp = _context.sent;

            if (empleadoTemp) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", res.status('401').json({
              ok: false,
              message: 'Email* o password incorrectos...'
            }));

          case 7:
            _context.next = 9;
            return _bcrypt["default"].compare(String(password), empleadoTemp.password);

          case 9:
            flag = _context.sent;

            if (flag) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("return", res.status('401').json({
              ok: false,
              message: 'Email o password* incorrectos...'
            }));

          case 12:
            data = empleadoTemp.dataValues;
            delete data.password;
            tkndata = {
              id: data.id,
              nombres: data.nombres,
              apellidos: data.apellidos,
              rol: data.role.nombre,
              email: data.email
            };
            token = _jsonwebtoken["default"].sign(tkndata, _config.seed, {
              expiresIn: '12h'
            });
            return _context.abrupt("return", res.json({
              ok: true,
              data: data,
              token: token
            }));

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](1);
            console.log(_context.t0);
            res.status(500).json({
              ok: false,
              err: _context.t0
            });

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 19]]);
  }));
  return _LogIn.apply(this, arguments);
}