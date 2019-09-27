"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _auth = require("../middleware/auth");

var _asistencia = require("../controllers/asistencia.controller");

var router = (0, _express.Router)();
router.get('/:id', _auth.verificarToken, _asistencia.obtenerAsistencia);
router.post('/', _auth.verificarToken, _asistencia.crearAsistencia);
var _default = router;
exports["default"] = _default;