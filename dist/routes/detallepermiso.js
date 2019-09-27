"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _detallepermiso = require("../controllers/detallepermiso.controller");

var _auth = require("../middleware/auth");

var router = (0, _express.Router)();
router.get('/empleado/:id', _auth.verificarToken, _detallepermiso.obtenerPermisosPorEmpleadoId);
router.get('/:id', _auth.verificarToken, _detallepermiso.obtenerPermiso);
router.post('/', _auth.verificarToken, _detallepermiso.crearPermiso);
router.put('/:id', [_auth.verificarToken, _auth.verificarAdmin], _detallepermiso.modificarPermiso);
router["delete"]('/:id', [_auth.verificarToken, _auth.verificarAdmin], _detallepermiso.eliminarPermiso);
var _default = router;
exports["default"] = _default;