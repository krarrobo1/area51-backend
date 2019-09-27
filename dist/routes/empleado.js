"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _auth = require("../middleware/auth");

var _empleado = require("../controllers/empleado.controller");

var router = (0, _express.Router)();
router.post('/', [_auth.verificarToken, _auth.verificarAdmin], _empleado.crearEmpleado);
router.get('/:id', _auth.verificarToken, _empleado.obtenerEmpleado); // Es necesario que sea admin?

router.get('/empresa/:id', [_auth.verificarToken, _auth.verificarAdmin], _empleado.obtenerEmpleadosPorEmpresa);
router.put('/:id', _auth.verificarToken, _empleado.modificarEmpleado); // Es necesario que sea admin?

router["delete"]('/:id', [_auth.verificarToken, _auth.verificarAdmin], _empleado.eliminarEmpleado);
var _default = router;
exports["default"] = _default;