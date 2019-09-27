"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _dispositivo = require("../controllers/dispositivo.controller");

var _auth = require("../middleware/auth");

var router = (0, _express.Router)();
router.get('/empleado', _auth.verificarToken, _dispositivo.obtenerDispositivosPorIdEmpleado);
router.post('/', _auth.verificarToken, _dispositivo.registrarDispositivo);
router.get('/:id', _auth.verificarToken, _dispositivo.obtenerDispositivo);
router.put('/:id', _auth.verificarToken, _dispositivo.modificarDispositivo);
router["delete"]('/:id', _auth.verificarToken, _dispositivo.eliminarDispositivo);
var _default = router;
exports["default"] = _default;