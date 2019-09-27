"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _auth = require("../middleware/auth");

var _periodo = require("../controllers/periodo.controller");

var router = (0, _express.Router)();
router.post('/', [_auth.verificarToken, _auth.verificarAdmin], _periodo.crearPeriodo);
router.get('/cargo/:id', _auth.verificarToken, _periodo.obtenerPeriodoPorIdCargo);
router.get('/:id', [_auth.verificarToken, _auth.verificarAdmin], _periodo.obtenerPeriodo);
router.put('/:id', [_auth.verificarToken, _auth.verificarAdmin], _periodo.modificarPeriodo);
router["delete"]('/:id', [_auth.verificarToken, _auth.verificarAdmin], _periodo.eliminarPeriodo);
var _default = router;
exports["default"] = _default;