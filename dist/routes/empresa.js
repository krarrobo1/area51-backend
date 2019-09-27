"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _empresa = require("../controllers/empresa.controller");

var _auth = require("../middleware/auth");

var router = (0, _express.Router)(); // api/empresa

router.post('/', [_auth.verificarToken, _auth.verificarSuperAdmin], _empresa.crearEmpresa);
router.get('/', [_auth.verificarToken, _auth.verificarSuperAdmin], _empresa.obtenerEmpresas); // api/empresa/:id

router.get('/:id', [_auth.verificarToken, _auth.verificarAdmin], _empresa.obtenerEmpresa);
router["delete"]('/:id', [_auth.verificarToken, _auth.verificarSuperAdmin], _empresa.eliminarEmpresa);
router.put('/:id', [_auth.verificarToken, _auth.verificarAdmin], _empresa.actualizarEmpresa);
var _default = router;
exports["default"] = _default;