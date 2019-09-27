"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _cargo = require("../controllers/cargo.controller");

var _auth = require("../middleware/auth");

var router = (0, _express.Router)(); // api/cargo/

router.post('/', [_auth.verificarToken, _auth.verificarAdmin], _cargo.crearCargo);
router.get('/:empresaid', [_auth.verificarToken, _auth.verificarAdmin], _cargo.obtenerCargosPorEmpresaId);
router.put('/:id', [_auth.verificarToken, _auth.verificarAdmin], _cargo.modificarCargo);
router["delete"]('/:id', [_auth.verificarToken, _auth.verificarAdmin], _cargo.eliminarCargo);
var _default = router;
exports["default"] = _default;